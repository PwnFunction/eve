import { RXRuntime } from "@/lib/vm/runtime";
import { type Edge, type Node } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Compare nodes by id, type, and data
 * @param prevNodes
 * @param newNodes
 * @returns boolean
 */
const areNodesEqual = (prevNodes: Node[], newNodes: Node[]) => {
  if (prevNodes.length !== newNodes.length) return false;

  // Create a map of previous nodes for faster lookup
  const prevNodesMap = new Map(prevNodes.map((node) => [node.id, node]));

  return newNodes.every((newNode) => {
    const prevNode = prevNodesMap.get(newNode.id);

    // Check if node exists and has same type
    if (!prevNode || prevNode.type !== newNode.type) {
      return false;
    }

    // Compare data properties that affect runtime behavior
    const prevData = prevNode.data;
    const newData = newNode.data;

    // Check specific properties based on node type
    switch (newNode.type) {
      case "EventStream":
        return (
          prevData.frequency === newData.frequency &&
          prevData.throttle === newData.throttle
        );

      case "Process":
        return prevData.delay === newData.delay;

      case "Batch":
        return prevData.size === newData.size;

      case "Output":
        // Output nodes don't have runtime-specific data to compare
        return true;

      default:
        // For unknown node types, compare full data object
        return JSON.stringify(prevData) === JSON.stringify(newData);
    }
  });
};

/**
 * Compare edges by source and target
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
 * Hook to construct and manage the flow runtime
 * @param nodes
 * @param edges
 * @param sortedIds - topologically sorted node ids
 * @returns runtime, isRunning, constructFlow
 */
export const useFlowConstruction = ({
  nodes,
  edges,
  sortedIds,
}: {
  nodes: Node[];
  edges: Edge[];
  sortedIds: string[];
}) => {
  const [runtime, setRuntime] = useState<RXRuntime | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);

  const constructFlow = useCallback(() => {
    const hasNodesChanged = !areNodesEqual(prevNodesRef.current, nodes);
    const hasEdgesChanged = !areEdgesEqual(prevEdgesRef.current, edges);

    if (hasNodesChanged || hasEdgesChanged) {
      try {
        // Clean up existing runtime
        runtime?.reset();

        // Create new runtime with state change callback
        const newRuntime = new RXRuntime(
          { nodes, edges },
          sortedIds,
          (running) => setIsRunning(running),
        );
        setRuntime(newRuntime);
        setIsRunning(false);

        // Update refs
        prevNodesRef.current = nodes;
        prevEdgesRef.current = edges;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Build Error:", error.message);
        }
      }
    }
  }, [nodes, edges, sortedIds, runtime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runtime?.reset();
    };
  }, [runtime]);

  useEffect(() => {
    constructFlow();
  }, [constructFlow]);

  return { runtime, isRunning, constructFlow };
};
