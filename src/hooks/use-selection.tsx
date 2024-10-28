import {
  type Edge,
  type Node,
  useOnSelectionChange,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";

export const useSelection = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const { setNodes, setEdges } = useReactFlow();

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

  const selectNodes = useCallback(
    (nodeIds: string[], reset: boolean = true) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: reset
            ? nodeIds.includes(node.id.toString())
            : nodeIds.includes(node.id.toString()) || node.selected,
        })),
      );
    },
    [setNodes],
  );

  const selectEdges = useCallback(
    (edgeIds: string[], reset: boolean = true) => {
      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          selected: reset
            ? edgeIds.includes(edge.id.toString())
            : edgeIds.includes(edge.id.toString()) || edge.selected,
        })),
      );
    },
    [setEdges],
  );

  const clearSelection = useCallback(() => {
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })));
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })));
  }, [setNodes, setEdges]);

  return {
    selectedNodes,
    selectedEdges,
    selectNodes,
    selectEdges,
    clearSelection,
  };
};
