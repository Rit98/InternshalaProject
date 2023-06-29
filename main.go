package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net"
	"sync"
	"time"

	pb "path/to/proto/package" // Import your Protobuf package

	"google.golang.org/grpc"
)

const (
	port    = ":50051"
	codeLen = 6
	expire  = 60 * time.Second
)

type server struct {
	pb.UnimplementedCodeGeneratorServer
	code     string
	codeLock sync.RWMutex
}

func (s *server) GenerateCode(ctx context.Context, req *pb.CodeRequest) (*pb.CodeResponse, error) {
	code := generateCode()
	s.codeLock.Lock()
	s.code = code
	s.codeLock.Unlock()

	go s.clearCodeAfterExpire()

	return &pb.CodeResponse{Code: code}, nil
}

func (s *server) VerifyCode(ctx context.Context, req *pb.CodeVerificationRequest) (*pb.CodeVerificationResponse, error) {
	s.codeLock.RLock()
	defer s.codeLock.RUnlock()

	if req.Code == s.code {
		return &pb.CodeVerificationResponse{Message: "Code verified successfully"}, nil
	}

	return &pb.CodeVerificationResponse{Message: "Code verification failed"}, nil
}

func (s *server) clearCodeAfterExpire() {
	time.Sleep(expire)
	s.codeLock.Lock()
	s.code = ""
	s.codeLock.Unlock()
}

func generateCode() string {
	rand.Seed(time.Now().UnixNano())
	code := fmt.Sprintf("%06d", rand.Intn(1000000))
	return code
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterCodeGeneratorServer(s, &server{})
	log.Printf("Server listening on %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
