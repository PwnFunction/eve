"use client";

import { styles } from "@/lib/styles/layout";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, useState } from "react";
import { EventStream, Generic } from "./blocks";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Event Stream", frequency: 1000 },
    type: "EventStream",
  },
  {
    id: "2",
    position: { x: 300, y: -100 },
    data: { label: "Queue" },
    type: "Generic",
  },
  {
    id: "3",
    position: { x: 500, y: 0 },
    data: { label: "Process" },
    type: "Generic",
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

const nodeTypes = {
  EventStream,
  Generic,
};

const proOptions = { hideAttribution: true };

const fitViewOptions = {
  padding: 0.2,
  minZoom: 1,
  maxZoom: 1,
};

let id = 4;

export const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prevEdges) =>
        addEdge({ ...connection, animated: true }, prevEdges),
      );
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData("nodeType");
      if (!type) {
        return;
      }

      // Get the current viewport zoom level and pan offset
      const { zoom, x: viewX, y: viewY } = reactFlowInstance.getViewport();

      // Calculate the pointer position relative to the wrapper
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: (event.clientX - reactFlowBounds.left - viewX) / zoom,
        y: (event.clientY - reactFlowBounds.top - viewY) / zoom,
      };

      const newNode: Node = {
        id: String(id++),
        type,
        position,
        data: {
          label: type === "EventStream" ? "Event Stream" : "Generic Node",
          ...(type === "EventStream" ? { frequency: 1000 } : {}),
        },
      };

      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="flex h-full w-full" style={styles.centerPanel}>
      <div ref={reactFlowWrapper} className="h-full w-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          proOptions={proOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          defaultViewport={{ zoom: 1, x: 0, y: 0 }}
        >
          <Panel
            position="bottom-right"
            className="font-mono text-xs text-neutral-500"
          >
            {nodes.length} {nodes.length === 1 ? "Node" : "Nodes"},{" "}
            {edges.length} {edges.length === 1 ? "Connection" : "Connections"}
          </Panel>
          <Background color="#999" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};
