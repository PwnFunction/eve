import { RXRuntime } from "@/lib/vm/runtime";
import { type Edge, type Node } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

const areNodesStructurallyEqual = (prevNodes: Node[], newNodes: Node[]) => {
  if (prevNodes.length !== newNodes.length) return false;
  const prevStructure = new Set(
    prevNodes.map((node) => `${node.id}-${node.type}`),
  );
  return newNodes.every((node) => prevStructure.has(`${node.id}-${node.type}`));
};

const areEdgesEqual = (prevEdges: Edge[], newEdges: Edge[]) => {
  if (prevEdges.length !== newEdges.length) return false;
  const prevEdgeSet = new Set(
    prevEdges.map((edge) => `${edge.source}-${edge.target}`),
  );
  return newEdges.every((edge) =>
    prevEdgeSet.has(`${edge.source}-${edge.target}`),
  );
};

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
    const hasNodesChanged = !areNodesStructurallyEqual(
      prevNodesRef.current,
      nodes,
    );
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
