"use client";

import { styles } from "@/lib/styles/layout";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];
const proOptions = { hideAttribution: true };

export const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <section style={styles.centerPanel}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={proOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Panel position="top-left">Canvas</Panel>
        <Background color="#999" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </section>
  );
};
