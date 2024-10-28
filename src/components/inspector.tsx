"use client";

import { styles } from "@/lib/styles/layout";
import { type Edge, type Node, useOnSelectionChange } from "@xyflow/react";
import { useCallback, useState } from "react";

export const Inspector = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes.map((node) => node.id.toString()));
      setSelectedEdges(edges.map((edge) => edge.id.toString()));
    },
    [],
  );

  useOnSelectionChange({
    onChange,
  });

  return (
    <aside
      className="border-l border-neutral-200 p-2"
      style={styles.rightPanel}
    >
      <p>Inspector</p>

      <div>
        <p>Selected nodes: {selectedNodes.join(", ")}</p>
        <p>Selected edges: {selectedEdges.join(", ")}</p>
      </div>
    </aside>
  );
};
