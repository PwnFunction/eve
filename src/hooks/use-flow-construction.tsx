import { RXRuntime } from "@/lib/vm/runtime";
import { type Edge, type Node } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";

/**
 * Check if two sets of nodes are structurally equal
 * @param prevNodes
 * @param newNodes
 * @returns boolean
 */
const areNodesStructurallyEqual = (prevNodes: Node[], newNodes: Node[]) => {
  if (prevNodes.length !== newNodes.length) return false;

  const prevStructure = new Set(
    prevNodes.map((node) => `${node.id}-${node.type}`),
  );

  return newNodes.every((node) => prevStructure.has(`${node.id}-${node.type}`));
};

/**
 * Check if two sets of edges are equal
 * @param prevEdges
 * @param newEdges
 * @returns boolean
 */
const areEdgesEqual = (prevEdges: Edge[], newEdges: Edge[]) => {
  if (prevEdges.length !== newEdges.length) return false;

  const prevEdgeSet = new Set(
    prevEdges.map((edge) => `${edge.source}-${edge.target}`),
  );

  return newEdges.every((edge) =>
    prevEdgeSet.has(`${edge.source}-${edge.target}`),
  );
};

/**
 * Hook to construct flow graph on changes
 * @param nodes
 * @param edges
 * @returns void
 */
export const useFlowConstruction = ({
  nodes,
  edges,
  runtime,
}: {
  nodes: Node[];
  edges: Edge[];
  runtime: RXRuntime;
}) => {
  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);

  const constructFlow = useCallback(() => {
    const hasNodesChanged = !areNodesStructurallyEqual(
      prevNodesRef.current,
      nodes,
    );
    const hasEdgesChanged = !areEdgesEqual(prevEdgesRef.current, edges);

    if (hasNodesChanged || hasEdgesChanged) {
      try {
        // Rebuild the graph representation inside the runtime
        runtime.build();

        // Only update refs if build was successful
        prevNodesRef.current = nodes;
        prevEdgesRef.current = edges;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Build Error:", error.message);
        }
      }
    }
  }, [nodes, edges]);

  useEffect(() => {
    constructFlow();
  }, [constructFlow]);

  return constructFlow;
};
