package processor

import (
	"tdata/automate/internal/db"
)

type Graph struct {
	StartNode *db.AutomationFlowNode
	Routes    map[string]map[string]*db.AutomationFlowNode // nodeID -> (edgeName -> nextNode)
}

// generateGraph builds the graph from nodes and edges arrays.
func BuildGraph(flow *db.AutomationFlow) *Graph {
	nodes := flow.Nodes
	edges := flow.Edges

	// Map to store nodes by their IDs for constant-time lookups
	nodeMap := make(map[string]*db.AutomationFlowNode)

	// Initialize the graph structure
	g := &Graph{
		Routes: make(map[string]map[string]*db.AutomationFlowNode),
	}

	// Populate the node map for fast access by node ID
	for _, node := range nodes {
		if node.Type == db.TriggerNode {
			g.StartNode = &node
		}
		nodeMap[node.ID] = &node
	}

	// Build graph from edges
	for _, edge := range edges {
		sourceNode := nodeMap[edge.Source]
		targetNode := nodeMap[edge.Target]

		edgeName := "true"

		// If the source or target node is nil, skip this edge (invalid data)
		if sourceNode == nil || targetNode == nil {
			continue
		}

		// If it's a PlaceholderNode, don't add it as a valid next node
		if targetNode.Type == db.PlaceholderNode {
			targetNode = nil
		}

		if edge.SourceHandle != nil {
			edgeName = *edge.SourceHandle
		}

		// Create the map for the source node if it doesn't exist
		if _, ok := g.Routes[edge.Source]; !ok {
			g.Routes[edge.Source] = make(map[string]*db.AutomationFlowNode)
		}

		// Add the edge to the graph
		g.Routes[edge.Source][edgeName] = targetNode
	}

	return g
}

// GetNextNode retrieves the next node based on the current node ID and the sourceHandle.
// It returns nil if the next node is a PlaceholderNode (leaf node) or doesn't exist.
func (g *Graph) GetNextNode(currentNodeID, sourceHandle string) *db.AutomationFlowNode {
	// Find the edge with the matching sourceHandle for the current node
	if nextNode, ok := g.Routes[currentNodeID][sourceHandle]; ok {
		return nextNode
	}
	return nil
}
