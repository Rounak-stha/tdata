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
	Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) error
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

func (e *ActionNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) error {
	// Action logic
	fmt.Printf("Executing Action Node: %s\n", node.ID)
	return nil
}

// TriggerNodeEvaluator evaluates TriggerNode type nodes
type TriggerNodeEvaluator struct{}

func (e *TriggerNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) error {
	// Trigger logic
	fmt.Printf("Evaluating Trigger Node: %s\n", node.ID)
	return nil
}

// TriggerNodeEvaluator evaluates TriggerNode type nodes
type ConditionNodeEvaluator struct{}

func (e *ConditionNodeEvaluator) Evaluate(env *models.FlowEnvironment, node *db.AutomationFlowNode) error {
	// Trigger logic
	fmt.Printf("Evaluating Trigger Node: %s\n", node.ID)
	return nil
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
	leftValue := possibleLeftValue.Value

	rightValue := ""
	if cond.RightOperand.Type == db.FlowValueTypeVariable {
		variable := cond.RightOperand.Value.(db.FlowVariable)
		variableValue := variable.Value
		possibleRightValue, exists := env.Variables[variableValue]
		if !exists {
			return false
		}
		rightValue = possibleRightValue.Value
	}

	// Ensure the types of fieldValue and cond.Value.Value match
	switch cond.LeftOperand.Type {
	case db.FlowVariableTypeText:
		return compareValues(leftValue, rightValue, *cond.Operator)

	case db.FlowVariableTypeNumber:
		fieldInt, err1 := strconv.Atoi(leftValue)
		valueInt, err2 := getIntValue(rightValue)
		if err1 != nil || err2 != nil {
			return false
		}
		return compareValues(fieldInt, valueInt, *cond.Operator)

	case db.FlowVariableTypeBool:
		fieldBool, err1 := strconv.ParseBool(leftValue)
		valueBool, err2 := getBoolValue(rightValue)
		if err1 != nil || err2 != nil {
			return false
		}
		return compareValues(fieldBool, valueBool, *cond.Operator)

	default:
		return false
	}
}

// Helper function to compare values
func compareValues(a, b interface{}, operator db.FlowOperator) bool {
	switch operator.Value {
	case db.FlowOperatorValueEqual:
		return compareEquality(a, b)
	case db.FlowOperatorValueNotEqual:
		return compareInequality[T](a, b)
	case db.FlowOperatorValueGreaterThan:
		return compareGreaterThan(a, b)
	case db.FlowOperatorValueLessThan:
		return compareLessThan(a, b)
	case db.FlowOperatorValueGreaterThanOrEqual:
		return compareGreaterThanOrEqual(a, b)
	case db.FlowOperatorValueLessThanOrEqual:
		return compareLessThanOrEqual(a, b)
	case db.FlowOperatorValueContains:
		return compareContains(a, b)
	default:
		return false
	}
}

func compareEquality(a, b interface{}) bool {
	return a == b
}

func compareInequality(a, b interface{}) bool {
	return a != b
}

func compareLessThan(a, b interface{}) bool {
	aFloat, err1 := getFloatValue(a)
	bFloat, err2 := getFloatValue(b)
	if err1 != nil || err2 != nil {
		return false
	}
	return aFloat < bFloat
}

func compareGreaterThan(a, b interface{}) bool {
	aFloat, err1 := getFloatValue(a)
	bFloat, err2 := getFloatValue(b)
	if err1 != nil || err2 != nil {
		return false
	}
	return aFloat > bFloat
}

func compareLessThanOrEqual(a, b interface{}) bool {
	aFloat, err1 := getFloatValue(a)
	bFloat, err2 := getFloatValue(b)
	if err1 != nil || err2 != nil {
		return false
	}
	return aFloat <= bFloat
}

func compareGreaterThanOrEqual(a, b interface{}) bool {
	aFloat, err1 := getFloatValue(a)
	bFloat, err2 := getFloatValue(b)
	if err1 != nil || err2 != nil {
		return false
	}
	return aFloat >= bFloat
}

func compareContains(container interface{}, value string) bool {
	switch containerValue := container.(type) {
	case string:
		return strings.Contains(containerValue, value)
	case []string:
		for _, item := range containerValue {
			if item == value {
				return true
			}
		}
		return false
	default:
		return false
	}
}

func compareNotContains(container interface{}, value string) (bool, error) {
	switch containerValue := container.(type) {
	case string:
		return !strings.Contains(containerValue, value), nil
	case []string:
		for _, item := range containerValue {
			if item == value {
				return false, nil
			}
		}
		return true, nil
	default:
		return false, errors.New("first parameter must be a string or an array of strings")
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

// Helper function to convert interface{} to float64 safely
func getFloatValue(value interface{}) (float64, error) {
	switch v := value.(type) {
	case float64:
		return v, nil
	case int:
		return float64(v), nil
	case string:
		return strconv.ParseFloat(v, 64)
	default:
		return 0, errors.New("invalid float type")
	}
}
