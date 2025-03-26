package models

import (
	"tdata/automate/internal/db"
)

type FlowEnvironment struct {
	Variables map[string]db.FlowVariable
}
