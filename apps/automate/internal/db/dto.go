package db

type NodeType string

const (
	ActionNode      NodeType = "ActionNode"
	TriggerNode     NodeType = "TriggerNode"
	ConditionNode   NodeType = "ConditionNode"
	PlaceholderNode NodeType = "PlaceholderNode"
)

type FlowVariableType string

const (
	FlowVariableTypeText        FlowVariableType = "text"
	FlowVariableTypeNumber      FlowVariableType = "number"
	FlowVariableTypeDate        FlowVariableType = "date"
	FlowVariableTypeBool        FlowVariableType = "boolean"
	FlowVariableTypeUser        FlowVariableType = "user"
	FlowVariableTypeStatus      FlowVariableType = "status"
	FlowVariableTypePriority    FlowVariableType = "priority"
	FlowVariableTypeMultiSelect FlowVariableType = "multiSelect"
	FlowVariableTypeSelect      FlowVariableType = "select"
)

type FlowVariable struct {
	Name  string           `json:"name"`
	Type  FlowVariableType `json:"type"`
	Value string           `json:"value"`
}

type FlowCondition struct {
	LeftOperand  *FlowVariable `json:"field,omitempty"`
	Operator     *FlowOperator `json:"operator,omitempty"`
	RightOperand *FlowValue    `json:"value,omitempty"`
}

var OperatorCompatibility = map[FlowVariableType][]FlowOperatorValue{
	FlowVariableTypeBool:        {FlowOperatorValueEqual, FlowOperatorValueNotEqual},
	FlowVariableTypeNumber:      {FlowOperatorValueEqual, FlowOperatorValueNotEqual, FlowOperatorValueGreaterThan, FlowOperatorValueGreaterThanOrEqual, FlowOperatorValueLessThan, FlowOperatorValueLessThanOrEqual},
	FlowVariableTypeText:        {FlowOperatorValueEqual, FlowOperatorValueNotEqual, FlowOperatorValueContains},
	FlowVariableTypeDate:        {FlowOperatorValueEqual, FlowOperatorValueNotEqual, FlowOperatorValueGreaterThan, FlowOperatorValueGreaterThanOrEqual, FlowOperatorValueLessThan, FlowOperatorValueLessThanOrEqual},
	FlowVariableTypeStatus:      {FlowOperatorValueEqual, FlowOperatorValueNotEqual},
	FlowVariableTypePriority:    {FlowOperatorValueEqual, FlowOperatorValueNotEqual},
	FlowVariableTypeMultiSelect: {FlowOperatorValueContains},
	FlowVariableTypeSelect:      {FlowOperatorValueEqual, FlowOperatorValueNotEqual},
	FlowVariableTypeUser:        {FlowOperatorValueEqual, FlowOperatorValueNotEqual},
}

type FlowOperatorValue string

type FlowOperator struct {
	Label string            `json:"label"`
	Value FlowOperatorValue `json:"value"`
}

func (operator *FlowOperator) CheckCompatibility(variableType FlowVariableType) bool {
	compatibility := OperatorCompatibility[variableType]
	for _, op := range compatibility {
		if operator.Value == op {
			return true
		}
	}
	return false
}

const (
	FlowOperatorValueEqual              FlowOperatorValue = "=="
	FlowOperatorValueNotEqual           FlowOperatorValue = "!="
	FlowOperatorValueGreaterThan        FlowOperatorValue = ">"
	FlowOperatorValueLessThan           FlowOperatorValue = "<"
	FlowOperatorValueGreaterThanOrEqual FlowOperatorValue = ">="
	FlowOperatorValueLessThanOrEqual    FlowOperatorValue = "<="
	FlowOperatorValueContains           FlowOperatorValue = "contains"
)

type FLowValueType string

const (
	FlowValueTypeStatic   FLowValueType = "static"
	FlowValueTypeVariable FLowValueType = "variable"
)

type FlowValue struct {
	Type  FLowValueType `json:"type"`
	Value interface{}   `json:"value"`
}

type ConditionNodeData struct {
	Label     string        `json:"label"`
	Condition FlowCondition `json:"condition"`
}

type TriggerNodeData struct {
	Label     string        `json:"label"`
	Type      string        `json:"type"`
	Condition FlowCondition `json:"condition"`
}

type PlaceholderNodeData struct {
	Label    string `json:"label"`
	ParentID string `json:"parentId"`
}

type AutomationFlowNode struct {
	ID   string
	Type NodeType
	Data interface{}
}

type AutomationFlowEdge struct {
	ID     string
	Source string
	Target string
}

type AutomationFlow struct {
	Nodes []AutomationFlowNode `json:"nodes"`
	Edges []AutomationFlowEdge `json:"edges"`
}

type WorkflowDetail struct {
	Workflow
	Statuses []WorkflowStatus `json:"statuses"`
}

type ProjectTemplatePropertyType string

const (
	TemplatePropertyTypeText            ProjectTemplatePropertyType = "text"
	TemplatePropertyTypeTextNumber      ProjectTemplatePropertyType = "number"
	TemplatePropertyTypeTextDate        ProjectTemplatePropertyType = "date"
	TemplatePropertyTypeTextSelect      ProjectTemplatePropertyType = "select"
	TemplatePropertyTypeTextMultiSelect ProjectTemplatePropertyType = "multiSelect"
	TemplatePropertyTypeTextUser        ProjectTemplatePropertyType = "user"
)

type ProjectTemplateProperty struct {
	Name       string                      `json:"name"`
	Type       ProjectTemplatePropertyType `json:"type"`
	Options    []string                    `json:"options,omitempty"`    // Optional
	SingleUser *bool                       `json:"singleUser,omitempty"` // Optional
	Required   bool                        `json:"required"`
}

type ProjectTemplateDetail struct {
	ProjectTemplate
	Workflow WorkflowDetail `json:"workflow"`
}
