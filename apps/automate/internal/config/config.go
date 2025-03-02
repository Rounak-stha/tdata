package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	RabbitMQ RabbitMQConfig
	DB       DBConfig
}

type RabbitMQConfig struct {
	URL          string
	ExchangeName string
	QueueName    string
	RoutingKey   string
}

type DBConfig struct {
	URL string
}

func Load() (*Config, error) {
	// load env vars
	err := godotenv.Load()

	if err != nil {
		return nil, err
	}

	rabbitMQUrl := os.Getenv("RABBITMQ_URL")
	rabbitMQExchangeName := os.Getenv("RABBITMQ_AUTOMATE_EXCHANGE_NAME")
	rabbitMQQueueName := os.Getenv("RABBITMQ_AUTOMATE_QUEUE_NAME")
	rabbitMQRoutingKey := os.Getenv("RABBITMQ_AUTOMATE_ROUTING_KEY")

	dbUrl := os.Getenv("SUPABASE_DB_URL")

	if rabbitMQUrl == "" || rabbitMQExchangeName == "" || rabbitMQQueueName == "" || rabbitMQRoutingKey == "" || dbUrl == "" {
		return nil, errors.New("missing required environment variables")
	}

	// Default config
	cfg := &Config{
		RabbitMQ: RabbitMQConfig{
			URL:          rabbitMQUrl,
			ExchangeName: rabbitMQExchangeName,
			QueueName:    rabbitMQQueueName,
			RoutingKey:   rabbitMQRoutingKey,
		},
		DB: DBConfig{
			URL: dbUrl,
		},
	}

	return cfg, nil
}
