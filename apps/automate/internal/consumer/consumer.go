package consumer

import (
	"context"
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"

	"tdata/automate/internal/config"
	"tdata/automate/internal/models"
	"tdata/automate/internal/processor"
)

type Consumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   amqp.Queue
	cfg     *config.Config
	proc    *processor.Processor
}

func New(cfg *config.Config) (*Consumer, error) {
	// Connect to RabbitMQ
	conn, err := amqp.Dial(cfg.RabbitMQ.URL)

	if err != nil {
		return nil, err
	}
	
	// Create channel
	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, err
	}
	
	// Declare exchange
	err = ch.ExchangeDeclare(
		cfg.RabbitMQ.ExchangeName, // name
		"direct",                 // type
		true,                     // durable
		false,                    // auto-deleted
		false,                    // internal
		false,                    // no-wait
		nil,                      // arguments
	)
	if err != nil {
		return nil, err
	}
	
	// Declare queue
	q, err := ch.QueueDeclare(
		cfg.RabbitMQ.QueueName, // name
		true,                  // durable
		false,                 // delete when unused
		false,                 // exclusive
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		return nil, err
	}
	
	// Bind queue to exchange
	err = ch.QueueBind(
		q.Name,                   // queue name
		cfg.RabbitMQ.RoutingKey,  // routing key
		cfg.RabbitMQ.ExchangeName, // exchange
		false,
		nil,
	)
	if err != nil {
		return nil, err
	}
	
	// Create processor
	proc := processor.New()
	
	return &Consumer{
		conn:    conn,
		channel: ch,
		queue:   q,
		cfg:     cfg,
		proc:    proc,
	}, nil
}

func (c *Consumer) Start(ctx context.Context) error {
	// Set QoS settings
	err := c.channel.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		return err
	}
	
	// Start consuming
	msgs, err := c.channel.Consume(
		c.queue.Name, // queue
		"",          // consumer
		false,       // auto-ack
		false,       // exclusive
		false,       // no-local
		false,       // no-wait
		nil,         // args
	)
	if err != nil {
		return err
	}
	
	// Process messages
	for {
		select {
		case <-ctx.Done():
			return nil
		case msg, ok := <-msgs:
			if !ok {
				return nil
			}
			
			// Process message
			c.handleMessage(msg)
		}
	}
}

func (c *Consumer) handleMessage(msg amqp.Delivery) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Recovered from panic in message handler: %v", r)
			// Nack the message (don't requeue to avoid infinite loops)
			msg.Nack(false, false)
		}
	}()
	
	log.Printf("Received message: %s", msg.Body)
	
	// Parse message
	var message models.Message
	if err := json.Unmarshal(msg.Body, &message); err != nil {
		log.Printf("Error parsing message: %v", err)
		// Nack the message (don't requeue)
		msg.Nack(false, false)
		return
	}
	
	// Process the message
	if err := c.proc.Process(&message); err != nil {
		log.Printf("Error processing message: %v", err)
		// Nack the message (requeue for retry)
		msg.Nack(false, true)
		return
	}
	
	// Acknowledge the message
	msg.Ack(false)
}

func (c *Consumer) Close() error {
	if c.channel != nil {
		if err := c.channel.Close(); err != nil {
			return err
		}
	}
	
	if c.conn != nil {
		return c.conn.Close()
	}
	
	return nil
}