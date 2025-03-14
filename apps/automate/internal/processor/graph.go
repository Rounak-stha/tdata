package processor

import (
	"tdata/automate/internal/db"
)

// buildFlowGraph creates a directed graph from the flow edges
func buildFlowGraph(flow *db.AutomationFlow) (map[string][]string, error) {
	graph := make(map[string][]string)
	for _, edge := range flow.Edges {
		if _, exists := graph[edge.Source]; !exists {
			graph[edge.Source] = []string{}
		}
		graph[edge.Source] = append(graph[edge.Source], edge.Target)
	}
	return graph, nil
}
