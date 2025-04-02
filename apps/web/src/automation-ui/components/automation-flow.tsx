"use client";

import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { edgeTypes, nodeTypes } from "@/automation-ui/lib/constants/entities";
import { Automation, ProjectDetail } from "@tdata/shared/types";
import { FC, useEffect } from "react";
import { FlowVariablesModal } from "@/automation-ui/components/flow-variables";
import { SaveFlow } from "./save-flow";
import { getSystemVariables } from "@tdata/shared/utils";
import { InitialEdges, InitialNodes, useFlowStore } from "@/automation-ui/store/flow";
import { UpdateFlow } from "./update-flow";

type AutomationFlowProps = {
  project: ProjectDetail;
  automation?: Automation | null;
};

const AutomationFlowWithoutProvider: FC<AutomationFlowProps> = ({ automation, project }) => {
  const { nodes, edges, isValidConnection, onDragLeave, onNodesChange, onEdgesChange, onConnect, onConnectStart, onConnectEnd, setProject, setVariables, setNodes, setEdges } =
    useFlowStore();

  useEffect(() => {
    const systemVariables = getSystemVariables(project);
    const nodes = automation?.flow.nodes || InitialNodes;
    const edges = automation?.flow.edges || InitialEdges;
    console.log({
      automation,
      nodes,
      edges,
    });
    setProject(project);
    setVariables({ system: systemVariables, custom: [] });
    setNodes(nodes);
    setEdges(edges);
  }, []);

  return (
    <div className="h-[90vh] w-full flex">
      <ReactFlow
        className="automationFlow"
        // connectionLineStyle={{ stroke: invalidConnection ? "red" : "black", animationName: "" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        onDragLeave={onDragLeave}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background className="dark:bg-background" />
        <Panel position="top-left">
          <FlowVariablesModal />
        </Panel>
        <Panel position="top-right">{automation ? <UpdateFlow project={project} automationId={automation.id} /> : <SaveFlow project={project} />}</Panel>
        <Controls className="dark:bg-background" />
        <MiniMap className="dark:bg-background" />
      </ReactFlow>
    </div>
  );
};

export default function AutomationFlow({ project, automation }: AutomationFlowProps) {
  return (
    <ReactFlowProvider>
      <style>
        {`
				a[aria-label="React Flow attribution"] {
					display: none;
				}
			`}
      </style>
      <AutomationFlowWithoutProvider project={project} automation={automation} />
    </ReactFlowProvider>
  );
}
