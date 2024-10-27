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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Event Stream" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "Queue" } },
  { id: "3", position: { x: 100, y: 200 }, data: { label: "Process" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];
const proOptions = { hideAttribution: true };
const fitViewOptions = {
  padding: 0.2,
  minZoom: 1,
  maxZoom: 1,
};

export const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
        fitView={true}
        fitViewOptions={fitViewOptions}
        defaultViewport={{ zoom: 1, x: 0, y: 0 }}
      >
        <Panel position="top-left">Canvas</Panel>
        <Background color="#999" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </section>
  );
};
