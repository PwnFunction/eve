import { type Edge, type Node, useEdges, useNodes } from "@xyflow/react";

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
