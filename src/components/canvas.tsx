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
import { useCallback, useMemo } from "react";
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

const proOptions = { hideAttribution: true };

const fitViewOptions = {
  padding: 0.2,
  minZoom: 1,
  maxZoom: 1,
};

export const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => ({ EventStream, Generic }), []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prevEdges) =>
        addEdge({ ...connection, animated: true }, prevEdges),
      );
    },
    [setEdges],
  );

  return (
    <section style={styles.centerPanel}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={proOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView={true}
        fitViewOptions={fitViewOptions}
        defaultViewport={{ zoom: 1, x: 0, y: 0 }}
      >
        <Panel
          position="bottom-right"
          className="font-mono text-xs text-neutral-500"
        >
          {nodes.length} {nodes.length > 1 ? "Nodes" : "Node"}, {edges.length}{" "}
          {edges.length > 1 ? "Connections" : "Connection"}
        </Panel>
        <Background color="#999" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </section>
  );
};
