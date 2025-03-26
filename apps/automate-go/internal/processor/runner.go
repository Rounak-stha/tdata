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
	graph := BuildGraph(runner.Flow)

	// Example logic to start execution
	currNode := graph.StartNode

	for currNode != nil {
		nodeID := currNode.ID

		node, err := getNodeByID(runner.Flow, nodeID)
		if err != nil {
			return err
		}

		// Evaluate the node
		evaluator, err := getNodeEvaluator(node.Type)

		if err != nil {
			return err
		}

		success, err := evaluator.Evaluate(runner.Environment, node)

		if err != nil {
			return err
		}

		if success {
			currNode = graph.GetNextNode(currNode.ID, "true")
		} else {
			currNode = graph.GetNextNode(currNode.ID, "false")
		}
	}
	return nil
}
