package models

import (
	"tdata/automate/internal/db"
)

type TaskEventMessageContent struct {
	TaskId int32 `json:"task_id"`
}

type Message struct {
	ID      string                   `json:"id"`
	Event   db.AutomationTriggerType `json:"event"`
	Content TaskEventMessageContent  `json:"content"`
	UserId  string                   `json:"user_id"`
}
