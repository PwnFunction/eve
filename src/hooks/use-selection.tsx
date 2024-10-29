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
    (nodeIds: string[], addToSelection: boolean = false) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: addToSelection
            ? nodeIds.includes(node.id.toString()) || node.selected
            : nodeIds.includes(node.id.toString()),
        })),
      );
    },
    [setNodes],
  );

  const selectEdges = useCallback(
    (edgeIds: string[], addToSelection: boolean = false) => {
      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          selected: addToSelection
            ? edgeIds.includes(edge.id.toString()) || edge.selected
            : edgeIds.includes(edge.id.toString()),
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
