"use client";

import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { Graph } from "@/lib/vm/graph";
import { RXRuntime } from "@/lib/vm/runtime";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventStream, Output, Process, Queue } from "./blocks";

// Flow initial state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Options
const proOptions = { hideAttribution: true };
const fitViewOptions = {
  padding: 0.2,
  minZoom: 1,
  maxZoom: 1,
};

// Node types
export enum NodeType {
  EventStream = "EventStream",
  Queue = "Queue",
  Process = "Process",
  Output = "Output",
}
export const nodeTypes = {
  [NodeType.EventStream]: EventStream,
  [NodeType.Queue]: Queue,
  [NodeType.Process]: Process,
  [NodeType.Output]: Output,
} as const;

export const defaultNodePrefs = {
  EventStream: {
    name: "Event Stream",
    frequency: 1000,
    unit: "events",
    throttle: false,
  },
  Queue: {
    name: "Queue",
    max: 100,
    broadcast: false,
  },
  Process: {
    name: "Process",
    delay: 1000,
  },
  Output: {
    name: "Output",
  },
};

export const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { selectedNodes, selectedEdges, clearSelection } = useSelection();

  /**
   * Create a new node
   * @param position
   * @param type
   * @returns void
   */
  const createNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: uuidv4(),
        type,
        position: {
          x: 0,
          y: 0,
        },
        selected: true,
        data: {
          ...defaultNodePrefs[type as keyof typeof defaultNodePrefs],
        },
      };
      setNodes((nodes) => nodes.concat(newNode));
    },
    [setNodes],
  );

  useEffect(() => {
    const handleCreateNode = (event: CustomEvent) => {
      const { type } = event.detail;
      createNode(type);
    };

    window.addEventListener("createNode", handleCreateNode as EventListener);
    return () => {
      window.removeEventListener(
        "createNode",
        handleCreateNode as EventListener,
      );
    };
  }, [createNode]);

  /**
   * Handle delete key press on selected nodes
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

        // Delete selected nodes
        if (selectedNodes.length > 0) {
          setNodes((nds) =>
            nds.filter((node) => !selectedNodes.includes(node.id)),
          );

          // Delete edges connected to deleted nodes
          setEdges((eds) =>
            eds.filter(
              (edge) =>
                !selectedNodes.includes(edge.source) &&
                !selectedNodes.includes(edge.target),
            ),
          );
        }

        // Delete selected edges
        if (selectedEdges.length > 0) {
          setEdges((eds) =>
            eds.filter((edge) => !selectedEdges.includes(edge.id)),
          );
        }

        // Clear selection after deletion
        clearSelection();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNodes, selectedEdges, setNodes, setEdges, clearSelection]);

  /**
   * Check if adding a new edge would create a cycle
   * @param connection - The new connection being attempted
   * @returns boolean - True if adding the connection would create a cycle
   * @see https://en.wikipedia.org/wiki/Cycle_detection
   */
  const hasCycle = useCallback(
    (connection: Connection) => {
      const visited = new Set<string>();
      const visiting = new Set<string>();

      const dfs = (nodeId: string): boolean => {
        // If we find a node we're currently visiting, there's a cycle
        if (visiting.has(nodeId)) return true;
        // If we've already fully explored this node, no cycle here
        if (visited.has(nodeId)) return false;

        visiting.add(nodeId);

        // Get all edges going out from this node (including the new potential edge)
        const outgoingEdges = edges
          .concat({
            id: "temporary",
            source: connection.source!,
            target: connection.target!,
          })
          .filter((edge) => edge.source === nodeId);

        // Check all connected nodes for cycles
        for (const edge of outgoingEdges) {
          if (dfs(edge.target)) return true;
        }

        // Remove from visiting set and add to fully visited
        visiting.delete(nodeId);
        visited.add(nodeId);
        return false;
      };

      return dfs(connection.source!);
    },
    [edges],
  );

  /**
   * Handle connection between nodes
   * @param connection
   * @returns void
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!hasCycle(connection)) {
        setEdges((prevEdges) =>
          addEdge({ ...connection, animated: true }, prevEdges),
        );
      } else {
        alert("Cannot create connection: this would create a infinite loop.");
      }
    },
    [setEdges, hasCycle],
  );

  /**
   * Handle drag over event
   * @param event
   * @returns void
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Handle drop event
   * @param event
   * @returns void
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData("nodeType");
      if (!type) {
        return;
      }

      // Get the current viewport zoom level and pan offset
      const { zoom, x: viewX, y: viewY } = reactFlowInstance.getViewport();

      // Calculate the pointer position relative to the wrapper
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: (event.clientX - reactFlowBounds.left - viewX) / zoom,
        y: (event.clientY - reactFlowBounds.top - viewY) / zoom,
      };

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: {
          ...defaultNodePrefs[type as keyof typeof defaultNodePrefs],
        },
      };

      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  /**
   * Analyze the flow graph
   * @returns void
   */
  const constructFlow = useCallback(() => {
    try {
      const graph = new Graph(nodes, edges);
      const sortedIds = graph.topologicalSort();

      const runtime = new RXRuntime(graph, sortedIds);
      runtime.build();

      console.log("Flow Analysis:");
      sortedIds.forEach((id) => {
        const node = nodes.find((n) => n.id === id);
        if (node) {
          console.log(`${node.id} (${node.type})`);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Flow Analysis Error:", error.message);
      }
    }
  }, [nodes, edges]);

  useEffect(() => {
    constructFlow();
  }, [constructFlow]);

  return (
    <div className="flex h-full w-full" style={styles.centerPanel}>
      <div ref={reactFlowWrapper} className="h-full w-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          proOptions={proOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          defaultViewport={{ zoom: 1, x: 0, y: 0 }}
        >
          <Panel
            position="bottom-right"
            className="font-mono text-xs text-neutral-500"
          >
            {nodes.length} {nodes.length === 1 ? "Node" : "Nodes"},{" "}
            {edges.length} {edges.length === 1 ? "Connection" : "Connections"}
          </Panel>
          <Background color="#999" variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
