// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0

package db

import (
	"database/sql/driver"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

type ActivityAction string

const (
	ActivityActionFIELDUPDATE      ActivityAction = "FIELD_UPDATE"
	ActivityActionCOMMENTADD       ActivityAction = "COMMENT_ADD"
	ActivityActionCOMMENTDELETE    ActivityAction = "COMMENT_DELETE"
	ActivityActionATTACHMENTUPLOAD ActivityAction = "ATTACHMENT_UPLOAD"
	ActivityActionATTACHMENTDELETE ActivityAction = "ATTACHMENT_DELETE"
	ActivityActionTASKCREATE       ActivityAction = "TASK_CREATE"
	ActivityActionTASKDELETE       ActivityAction = "TASK_DELETE"
)

func (e *ActivityAction) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ActivityAction(s)
	case string:
		*e = ActivityAction(s)
	default:
		return fmt.Errorf("unsupported scan type for ActivityAction: %T", src)
	}
	return nil
}

type NullActivityAction struct {
	ActivityAction ActivityAction
	Valid          bool // Valid is true if ActivityAction is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullActivityAction) Scan(value interface{}) error {
	if value == nil {
		ns.ActivityAction, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ActivityAction.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullActivityAction) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ActivityAction), nil
}

type AutomationTriggerType string

const (
	AutomationTriggerTypeTASKCREATED AutomationTriggerType = "TASK_CREATED"
	AutomationTriggerTypeTASKUPDATED AutomationTriggerType = "TASK_UPDATED"
)

func (e *AutomationTriggerType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = AutomationTriggerType(s)
	case string:
		*e = AutomationTriggerType(s)
	default:
		return fmt.Errorf("unsupported scan type for AutomationTriggerType: %T", src)
	}
	return nil
}

type NullAutomationTriggerType struct {
	AutomationTriggerType AutomationTriggerType
	Valid                 bool // Valid is true if AutomationTriggerType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullAutomationTriggerType) Scan(value interface{}) error {
	if value == nil {
		ns.AutomationTriggerType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.AutomationTriggerType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullAutomationTriggerType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.AutomationTriggerType), nil
}

type Priority string

const (
	PriorityLOW    Priority = "LOW"
	PriorityMEDIUM Priority = "MEDIUM"
	PriorityHIGH   Priority = "HIGH"
)

func (e *Priority) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = Priority(s)
	case string:
		*e = Priority(s)
	default:
		return fmt.Errorf("unsupported scan type for Priority: %T", src)
	}
	return nil
}

type NullPriority struct {
	Priority Priority
	Valid    bool // Valid is true if Priority is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullPriority) Scan(value interface{}) error {
	if value == nil {
		ns.Priority, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.Priority.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullPriority) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.Priority), nil
}

type Role string

const (
	RoleAdmin  Role = "Admin"
	RoleMember Role = "Member"
)

func (e *Role) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = Role(s)
	case string:
		*e = Role(s)
	default:
		return fmt.Errorf("unsupported scan type for Role: %T", src)
	}
	return nil
}

type NullRole struct {
	Role  Role
	Valid bool // Valid is true if Role is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullRole) Scan(value interface{}) error {
	if value == nil {
		ns.Role, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.Role.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullRole) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.Role), nil
}

type Automation struct {
	ID             pgtype.UUID
	OrganizationID int32
	Name           string
	CreatedBy      pgtype.UUID
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
	ProjectID      int32
	Description    pgtype.Text
	TriggerType    AutomationTriggerType
	Flow           AutomationFlow
	Variables      []FlowVariable
}

type Organization struct {
	ID        int32
	Name      string
	Key       string
	ImageUrl  pgtype.Text
	CreatedBy pgtype.UUID
	UpdatedAt pgtype.Timestamp
	CreatedAt pgtype.Timestamp
}

type OrganizationMembership struct {
	ID             int32
	OrganizationID int32
	UserID         pgtype.UUID
	Role           Role
	Test           pgtype.Text
}

type Project struct {
	ID             int32
	OrganizationID int32
	Name           string
	Key            string
	Description    pgtype.Text
	CreatedBy      pgtype.UUID
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type ProjectTemplate struct {
	ID             int32
	Name           string
	Description    pgtype.Text
	OrganizationID int32
	WorkflowID     int32
	SingleAssignee bool
	TaskProperties []ProjectTemplateProperty
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type Task struct {
	ID             int32
	OrganizationID int32
	ProjectID      int32
	CreatedBy      pgtype.UUID
	Title          string
	Content        pgtype.Text
	Priority       Priority
	StatusID       int32
	TaskNumber     string
	Properties     []byte
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type TaskActivity struct {
	ID             int32
	OrganizationID int32
	Action         ActivityAction
	TaskID         int32
	Metadata       []byte
	UserID         pgtype.UUID
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type TaskComment struct {
	ID             int32
	OrganizationID int32
	TaskID         int32
	UserID         pgtype.UUID
	Content        string
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type TasksUser struct {
	ID             int32
	OrganizationID int32
	TaskID         int32
	UserID         pgtype.UUID
	Name           string
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type Transition struct {
	ID             int32
	OrganizationID int32
	WorkflowID     int32
	FromStatus     int32
	ToStatus       int32
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type User struct {
	ID        pgtype.UUID
	Name      string
	Email     string
	ImageUrl  pgtype.Text
	Active    pgtype.Bool
	UpdatedAt pgtype.Timestamp
	CreatedAt pgtype.Timestamp
	DeletedAt pgtype.Timestamp
}

type Workflow struct {
	ID             int32
	OrganizationID int32
	Name           string
	Description    pgtype.Text
	CreatedBy      pgtype.UUID
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type WorkflowStatus struct {
	ID             int32
	OrganizationID int32
	CreatedBy      pgtype.UUID
	Icon           string
	Name           string
	WorkflowID     int32
	UpdatedAt      pgtype.Timestamp
	CreatedAt      pgtype.Timestamp
}

type WorkflowTemplate struct {
	ID        int32
	Name      string
	Content   pgtype.Text
	UpdatedAt pgtype.Timestamp
	CreatedAt pgtype.Timestamp
}
