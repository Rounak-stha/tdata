package processor

import (
	"tdata/automate/internal/db"
	"tdata/automate/internal/models"
)

// FlowRunner handles the execution of the automation flow
type FlowRunner struct {
	Flow        *db.AutomationFlow
	Environment *models.FlowEnvironment
}

// Run processes the flow based on the graph
func (runner *FlowRunner) Run() error {
	graph, err := buildFlowGraph(runner.Flow)
	if err != nil {
		return err
	}

	// Example logic to start execution
	nodeQueue := []string{"1"} // Assuming trigger node is "1"
	visitedNodes := make(map[string]bool)

	for len(nodeQueue) > 0 {
		nodeID := nodeQueue[0]
		nodeQueue = nodeQueue[1:]

		if visitedNodes[nodeID] {
			continue
		}
		visitedNodes[nodeID] = true

		node, err := getNodeByID(runner.Flow, nodeID)
		if err != nil {
			return err
		}

		// Evaluate the node
		evaluator, err := getNodeEvaluator(node.Type)

		if err != nil {
			return err
		}

		if err := evaluator.Evaluate(runner.Environment, node); err != nil {
			return err
		}

		// Enqueue connected nodes
		if targets, exists := graph[nodeID]; exists {
			nodeQueue = append(nodeQueue, targets...)
		}
	}
	return nil
}
