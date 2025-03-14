package processor

import (
	"context"
	"log"

	"tdata/automate/internal/db"
	"tdata/automate/internal/models"
)

type Processor struct {
	// Add any dependencies here (database, services, etc.)
	ctx context.Context
	db  *db.Queries
}

func New(ctx context.Context, db *db.Queries) *Processor {
	return &Processor{
		ctx,
		db,
	}
}

func (p *Processor) Process(msg *models.Message) error {
	// Implement your business logic here
	log.Printf("Processing message: %v", msg.Event)

	// Example processing steps:
	// 1. Validate message
	// 2. Transform data if needed
	// 3. Store in database
	// 4. Call external services
	// 5. Send notifications

	switch event := msg.Event; event {
	case db.AutomationTriggerTypeTASKCREATED, db.AutomationTriggerTypeTASKUPDATED:
		p.processTaskEvent(msg)
		break

	}

	return nil
}

func (p *Processor) processTaskEvent(msg *models.Message) error {
	log.Println("Processing task event")
	messageContent := msg.Content
	taskId := messageContent.TaskId

	task, err := p.db.GetTaskDetail(p.ctx, taskId)

	if err != nil {
		log.Printf("Error getting task details: %v", err)
		return err
	}

	log.Printf("Task details: %v", task)

	flow, err := p.db.GetAutomationByEvent(p.ctx, msg.Event)
	if err != nil {
		log.Printf("Error getting automation flow: %v", err)
		return err
	}

	log.Printf("Automation flow: %v", flow)

	return nil
}
