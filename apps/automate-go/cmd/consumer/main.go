package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"tdata/automate/internal/config"
	"tdata/automate/internal/consumer"
)

func main() {
	// Load configuration
	cfg, err := config.Load()

	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Create consumer
	cons, err := consumer.New(cfg)
	if err != nil {
		log.Fatalf("Failed to create consumer: %v", err)
	}
	defer cons.Close()

	// Set up graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Start consuming in the background
	go func() {
		if err := cons.Start(ctx); err != nil {
			log.Fatalf("Consumer error: %v", err)
		}
	}()

	log.Println("RabbitMQ consumer started. Press CTRL+C to exit.")

	// Wait for termination signal
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh

	log.Println("Shutting down gracefully...")
	cancel()

	log.Println("Shutdown complete")
}
