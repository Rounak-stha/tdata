package processor

import (
	"errors"
	"tdata/automate/internal/db"
)

// getNodeByID finds a node by its ID within the automation flow.
func getNodeByID(flow *db.AutomationFlow, nodeID string) (*db.AutomationFlowNode, error) {
	for _, node := range flow.Nodes {
		if node.ID == nodeID {
			return &node, nil
		}
	}
	return nil, errors.New("node not found")
}
