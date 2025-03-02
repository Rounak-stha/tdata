package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/jackc/pgx/v5"

	"tdata/automate/internal/config"
	"tdata/automate/internal/consumer"
	"tdata/automate/internal/db"
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

	// Create db connection
	connection, err := pgx.Connect(ctx, cfg.DB.URL)

	if err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}

	defer connection.Close(ctx)

	queries := db.New(connection)

	users, err := queries.GetUsers(ctx)
	if err != nil {
		log.Fatalf("unable to get users: %v", err)
	}
	fmt.Printf("%v", users)

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
