import { type Edge, type Node, useEdges, useNodes } from "@xyflow/react";

/**
 * Hook to get the selected elements from the selected node and edge ids.
 * @param selectedNodes The selected node ids.
 * @param selectedEdges The selected edge ids.
 * @returns The selected node and edge elements.
 */
export const useSelectedElements = (
  selectedNodes: string[],
  selectedEdges: string[],
) => {
  const nodes = useNodes();
  const edges = useEdges();

  const selectedNodeElements = selectedNodes
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is Node => node !== undefined);

  const selectedEdgeElements = selectedEdges
    .map((id) => edges.find((edge) => edge.id === id))
    .filter((edge): edge is Edge => edge !== undefined);

  return {
    selectedNodeElements,
    selectedEdgeElements,
  };
};
