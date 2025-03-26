package processor

import (
	"fmt"
	"tdata/automate/internal/db"
	"testing"

	"github.com/stretchr/testify/assert"
)

func mockAutomationFlow() *db.AutomationFlow {
	return &db.AutomationFlow{
		Nodes: []db.AutomationFlowNode{
			{
				ID:   "0OBxNkqfx6J3-Fp8gGswU",
				Type: db.TriggerNode,
			},
			{
				ID:   "6zIP9mLm0R_KJmRGUvg1e",
				Type: db.ConditionNode,
			},
			{
				ID:   "cTTWyCKT7eIuqPOU1kiTq",
				Type: db.ActionNode,
			},
			{
				ID:   "8quyWtltna_J9-41TaJjn",
				Type: db.PlaceholderNode,
			},
			{
				ID:   "q_TBHmfa7MOKdHlJtAUfv",
				Type: db.ActionNode,
			},
			{
				ID:   "QC-lbJu0bUiuICxsYR1Wg",
				Type: db.PlaceholderNode,
			},
		},
		Edges: []db.AutomationFlowEdge{
			{
				ID:     "it_V6A9HIiIzfZtKvRpW7",
				Source: "0OBxNkqfx6J3-Fp8gGswU",
				Target: "6zIP9mLm0R_KJmRGUvg1e",
			},
			{
				ID:           "5wbva2vWuJGRbLn1-3ng6",
				Source:       "6zIP9mLm0R_KJmRGUvg1e",
				Target:       "cTTWyCKT7eIuqPOU1kiTq",
				SourceHandle: strPointer("true"),
			},
			{
				ID:     "c-1m5kUA-dO70nMSIR4uu",
				Source: "cTTWyCKT7eIuqPOU1kiTq",
				Target: "8quyWtltna_J9-41TaJjn",
			},
			{
				ID:           "ByOxroiTlrGejeLdiS5SC",
				Source:       "6zIP9mLm0R_KJmRGUvg1e",
				Target:       "q_TBHmfa7MOKdHlJtAUfv",
				SourceHandle: strPointer("false"),
			},
			{
				ID:     "ywdawTX1fT1LIYbz3ts0Q",
				Source: "q_TBHmfa7MOKdHlJtAUfv",
				Target: "QC-lbJu0bUiuICxsYR1Wg",
			},
		},
	}
}

// Helper function to create a pointer to a string
func strPointer(s string) *string {
	return &s
}

func TestGenerateGraph(t *testing.T) {
	// Arrange
	flow := mockAutomationFlow()

	// Act
	graph := BuildGraph(flow)

	// Assert
	// Ensure that graph.Routes is not empty
	assert.NotNil(t, graph.Routes)
	fmt.Println(graph.Routes)
	assert.Len(t, graph.Routes, 4)

	// Ensure the source "0OBxNkqfx6J3-Fp8gGswU" has the correct next node
	assert.Contains(t, graph.Routes["0OBxNkqfx6J3-Fp8gGswU"], "true")
	assert.Equal(t, graph.Routes["0OBxNkqfx6J3-Fp8gGswU"]["true"].ID, "6zIP9mLm0R_KJmRGUvg1e")

	// Ensure the source "6zIP9mLm0R_KJmRGUvg1e" has the correct next node for "true"
	assert.Contains(t, graph.Routes["6zIP9mLm0R_KJmRGUvg1e"], "true")
	assert.Equal(t, graph.Routes["6zIP9mLm0R_KJmRGUvg1e"]["true"].ID, "cTTWyCKT7eIuqPOU1kiTq")

	// Ensure the source "6zIP9mLm0R_KJmRGUvg1e" has the correct next node for "false"
	assert.Contains(t, graph.Routes["6zIP9mLm0R_KJmRGUvg1e"], "false")
	assert.Equal(t, graph.Routes["6zIP9mLm0R_KJmRGUvg1e"]["false"].ID, "q_TBHmfa7MOKdHlJtAUfv")
}

func TestGetNextNode(t *testing.T) {
	// Arrange
	flow := mockAutomationFlow()
	graph := BuildGraph(flow)

	// Act & Assert
	// Test for valid node lookup (0OBxNkqfx6J3-Fp8gGswU -> 6zIP9mLm0R_KJmRGUvg1e)
	nextNode := graph.GetNextNode("0OBxNkqfx6J3-Fp8gGswU", "true")
	assert.NotNil(t, nextNode)
	assert.Equal(t, nextNode.ID, "6zIP9mLm0R_KJmRGUvg1e")

	// Test for valid conditional node lookup (6zIP9mLm0R_KJmRGUvg1e -> cTTWyCKT7eIuqPOU1kiTq with "true")
	nextNode = graph.GetNextNode("6zIP9mLm0R_KJmRGUvg1e", "true")
	assert.NotNil(t, nextNode)
	assert.Equal(t, nextNode.ID, "cTTWyCKT7eIuqPOU1kiTq")

	// Test for invalid conditional edge (6zIP9mLm0R_KJmRGUvg1e -> q_TBHmfa7MOKdHlJtAUfv with "false")
	nextNode = graph.GetNextNode("6zIP9mLm0R_KJmRGUvg1e", "false")
	assert.NotNil(t, nextNode)
	assert.Equal(t, nextNode.ID, "q_TBHmfa7MOKdHlJtAUfv")

	// Test for a node with no edges (cTTWyCKT7eIuqPOU1kiTq has no next nodes)
	nextNode = graph.GetNextNode("cTTWyCKT7eIuqPOU1kiTq", "truw")
	assert.Nil(t, nextNode)

	// Test for invalid node lookup
	nextNode = graph.GetNextNode("nonexistent", "true")
	assert.Nil(t, nextNode)
}
