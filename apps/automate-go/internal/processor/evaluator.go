package processor

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"tdata/automate/internal/db"
	"tdata/automate/internal/models"
)

type NodeEvaluator interface {
	Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) (bool, error)
}

func getNodeEvaluator(nodeType db.NodeType) (NodeEvaluator, error) {
	switch nodeType {
	case db.TriggerNode:
		return &TriggerNodeEvaluator{}, nil
	case db.ActionNode:
		return &ActionNodeEvaluator{}, nil
	case db.ConditionNode:
		return &ConditionNodeEvaluator{}, nil
	default:
		return nil, errors.New("unsupported node type")
	}
}

// ActionNodeEvaluator evaluates ActionNode type nodes
type ActionNodeEvaluator struct{}

func (e *ActionNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) (bool, error) {
	// Action logic
	fmt.Printf("Executing Action Node: %s\n", node.ID)
	return false, nil
}

// TriggerNodeEvaluator evaluates TriggerNode type nodes
type TriggerNodeEvaluator struct{}

func (e *TriggerNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) (bool, error) {
	data, ok := node.Data.(*db.TriggerNodeData)
	if !ok {
		fmt.Println("Type assertion failed")
		return false, errors.New("invalid node data")
	}
	return evaluateCondition(env, &data.Condition), nil
}

// TriggerNodeEvaluator evaluates TriggerNode type nodes
type ConditionNodeEvaluator struct{}

func (e *ConditionNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) (bool, error) {
	data, ok := node.Data.(*db.ConditionNodeData)
	if !ok {
		fmt.Println("Type assertion failed")
		return false, errors.New("invalid node data")
	}
	return evaluateCondition(env, &data.Condition), nil
}

func evaluateCondition(env *models.FlowEnvironment, cond *db.FlowCondition) bool {
	if cond.LeftOperand == nil || cond.Operator == nil || cond.RightOperand == nil {
		return false
	}

	operator := cond.Operator

	if !operator.CheckCompatibility(cond.LeftOperand.Type) {
		return false
	}

	possibleLeftValue, exists := env.Variables[cond.LeftOperand.Name]
	if !exists {
		return false
	}
	leftValue := *possibleLeftValue.Value

	rightValue := ""
	if cond.RightOperand.Type == db.FlowValueTypeVariable {
		variable := cond.RightOperand.Value.(db.FlowVariable)
		variableValue := variable.Value
		possibleRightValue, exists := env.Variables[*variableValue]
		if !exists {
			return false
		}
		rightValue = *possibleRightValue.Value
	}

	// Ensure the types of fieldValue and cond.Value.Value match
	switch cond.LeftOperand.Type {
	case db.FlowVariableTypeText:
		return compareTextType(leftValue, rightValue, *cond.Operator)
	case db.FlowVariableTypeSelect:
		return compareSelectType(leftValue, rightValue, *cond.Operator)

	// For multiselect, the left value will be an array of text items
	// Need to handle this

	// Status and Priority values will be the id of the respective record which is an integer
	case db.FlowVariableTypeNumber, db.FlowVariableTypeStatus, db.FlowVariableTypePriority:
		fieldInt, err1 := strconv.Atoi(leftValue)
		valueInt, err2 := getIntValue(rightValue)
		if err1 != nil || err2 != nil {
			return false
		}
		return compareNumberType(fieldInt, valueInt, *cond.Operator)

	case db.FlowVariableTypeBool:
		fieldBool, err1 := strconv.ParseBool(leftValue)
		valueBool, err2 := getBoolValue(rightValue)
		if err1 != nil || err2 != nil {
			return false
		}
		return compareBooleanType(fieldBool, valueBool, *cond.Operator)

	default:
		return false
	}
}

func compareBooleanType(a, b bool, operator db.FlowOperator) bool {
	switch operator.Value {
	case db.FlowOperatorValueEqual:
		return a == b
	case db.FlowOperatorValueNotEqual:
		return a != b
	default:
		return false
	}
}

func compareTextType(a, b string, operator db.FlowOperator) bool {
	switch operator.Value {
	case db.FlowOperatorValueEqual:
		return a == b
	case db.FlowOperatorValueNotEqual:
		return a != b
	case db.FlowOperatorValueContains:
		return strings.Contains(a, b)
	default:
		return false
	}
}

func compareSelectType(a, b string, operator db.FlowOperator) bool {
	switch operator.Value {
	case db.FlowOperatorValueEqual:
		return a == b
	case db.FlowOperatorValueNotEqual:
		return a != b
	default:
		return false
	}
}

func compareNumberType(a, b int, operator db.FlowOperator) bool {
	switch operator.Value {
	case db.FlowOperatorValueEqual:
		return a == b
	case db.FlowOperatorValueNotEqual:
		return a != b
	case db.FlowOperatorValueGreaterThan:
		return a > b
	case db.FlowOperatorValueLessThan:
		return a < b
	case db.FlowOperatorValueGreaterThanOrEqual:
		return a >= b
	case db.FlowOperatorValueLessThanOrEqual:
		return a <= b
	default:
		return false
	}
}

// Helper function to convert interface{} to int safely
func getIntValue(value interface{}) (int, error) {
	switch v := value.(type) {
	case int:
		return v, nil
	case float64:
		return int(v), nil
	case string:
		return strconv.Atoi(v)
	default:
		return 0, errors.New("invalid int type")
	}
}

// Helper function to convert interface{} to int safely
func getBoolValue(value interface{}) (bool, error) {
	switch v := value.(type) {
	case bool:
		return v, nil
	case string:
		return v == "true", nil
	default:
		return false, errors.New("invalid int type")
	}
}
