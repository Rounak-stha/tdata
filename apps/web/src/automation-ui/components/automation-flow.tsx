"use client";

import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { edgeTypes, nodeTypes } from "@/automation-ui/lib/constants/entities";
import { useFlowStore } from "@/automation-ui/store/flow";
import { ProjectDetail } from "@tdata/shared/types";
import { FC, useEffect } from "react";

type AutomationFlowProps = {
  project: ProjectDetail;
};

const AutomationFlowWithoutProvider: FC<AutomationFlowProps> = ({ project }) => {
  const { nodes, edges, isValidConnection, onDragLeave, onNodesChange, onEdgesChange, onConnect, onConnectStart, onConnectEnd, setProject } = useFlowStore();

  useEffect(() => {
    setProject(project);
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
        <Controls className="dark:bg-background" />
        <MiniMap className="dark:bg-background" />
      </ReactFlow>
    </div>
  );
};

export default function AutomationFlow({ project }: AutomationFlowProps) {
  return (
    <ReactFlowProvider>
      <style>
        {`
				a[aria-label="React Flow attribution"] {
					display: none;
				}
			`}
      </style>
      <AutomationFlowWithoutProvider project={project} />
    </ReactFlowProvider>
  );
}
