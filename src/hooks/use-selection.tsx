import { type Edge, type Node, useOnSelectionChange } from "@xyflow/react";
import { useCallback, useState } from "react";

export const useSelection = () => {
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

  return {
    selectedNodes,
    selectedEdges,
  };
};
