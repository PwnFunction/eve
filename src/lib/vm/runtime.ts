import { type Edge, type Node } from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { delay, tap } from "rxjs/operators";

// Define the types of nodes we support
export enum NodeType {
  EventStream = "EventStream",
  Queue = "Queue",
  Process = "Process",
  Output = "Output",
}

export class RXRuntime {
  private nodes: Map<string, any> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private subjects: Map<string, Subject<any>> = new Map();
  private sortedNodeIds: string[];

  constructor(graph: { nodes: Node[]; edges: Edge[] }, sortedIds: string[]) {
    this.sortedNodeIds = sortedIds;
    this.initializeRuntime(graph);
  }

  private initializeRuntime(graph: { nodes: Node[]; edges: Edge[] }) {
    // Reset any existing state
    this.reset();

    // Create subjects for each node
    graph.nodes.forEach((node) => {
      this.subjects.set(node.id, new Subject());
      this.nodes.set(node.id, node);
    });

    // Connect nodes based on edges
    graph.edges.forEach((edge) => {
      const sourceNode = this.nodes.get(edge.source);
      const targetNode = this.nodes.get(edge.target);
      const sourceSubject = this.subjects.get(edge.source);
      const targetSubject = this.subjects.get(edge.target);

      if (!sourceNode || !targetNode || !sourceSubject || !targetSubject) {
        return;
      }

      // Create the subscription chain based on node types
      let observable: Observable<any>;

      switch (sourceNode.type) {
        case NodeType.EventStream:
          // Create an interval stream for EventStream nodes
          observable = interval(sourceNode.data.frequency).pipe(
            tap((value) => {
              console.log(`[${sourceNode.data.name}] Emitting:`, value);
            }),
          );
          break;

        case NodeType.Process:
          // Add processing delay for Process nodes
          observable = sourceSubject.pipe(
            delay(sourceNode.data.delay),
            tap((value) => {
              console.log(`[${sourceNode.data.name}] Processing:`, value);
            }),
          );
          break;

        case NodeType.Queue:
          // Simple pass-through for now, can add queue logic later
          observable = sourceSubject.pipe(
            tap((value) => {
              console.log(`[${sourceNode.data.name}] Queued:`, value);
            }),
          );
          break;

        default:
          observable = sourceSubject;
      }

      // Subscribe the target to the source
      const subscription = observable.subscribe({
        next: (value) => {
          if (targetNode.type === NodeType.Output) {
            console.log(`[${targetNode.data.name}] Output:`, value);
          }
          targetSubject.next(value);
        },
        error: (err) => {
          console.error(`Error in node ${sourceNode.data.name}:`, err);
          targetSubject.error(err);
        },
      });

      // Store the subscription for cleanup
      this.subscriptions.set(`${edge.source}-${edge.target}`, subscription);
    });

    // Start event streams (they should be at the beginning of sortedNodeIds)
    this.sortedNodeIds.forEach((nodeId) => {
      const node = this.nodes.get(nodeId);
      if (node?.type === NodeType.EventStream) {
        const subject = this.subjects.get(nodeId);
        if (subject) {
          // Initialize the event stream
          interval(node.data.frequency).subscribe((value) => {
            subject.next(value);
          });
        }
      }
    });
  }

  public reset() {
    // Clean up existing subscriptions
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();

    // Clean up existing subjects
    this.subjects.forEach((subject) => subject.complete());
    this.subjects.clear();

    // Clear nodes
    this.nodes.clear();
  }

  public getSubject(nodeId: string): Subject<any> | undefined {
    return this.subjects.get(nodeId);
  }
}

/**
 * Check if two sets of nodes are structurally equal
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
  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);
  const runtimeRef = useRef<RXRuntime | null>(null);

  const constructFlow = useCallback(() => {
    const hasNodesChanged = !areNodesStructurallyEqual(
      prevNodesRef.current,
      nodes,
    );
    const hasEdgesChanged = !areEdgesEqual(prevEdgesRef.current, edges);

    if (hasNodesChanged || hasEdgesChanged) {
      try {
        // Clean up existing runtime if it exists
        if (runtimeRef.current) {
          runtimeRef.current.reset();
        }

        // Create new runtime with current graph structure
        runtimeRef.current = new RXRuntime({ nodes, edges }, sortedIds);

        // Only update refs if build was successful
        prevNodesRef.current = nodes;
        prevEdgesRef.current = edges;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Build Error:", error.message);
        }
      }
    }
  }, [nodes, edges, sortedIds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (runtimeRef.current) {
        runtimeRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    constructFlow();
  }, [constructFlow]);

  return { runtime: runtimeRef.current, constructFlow };
};
