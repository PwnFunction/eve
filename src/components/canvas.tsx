"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFlowConstruction } from "@/hooks/use-flow-construction";
import { useNodeFocusListener } from "@/hooks/use-node-focus-listener";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { Graph } from "@/lib/vm/graph";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Batch,
  defaultNodePrefs,
  EventStream,
  Output,
  Process,
} from "./blocks";
import { Button } from "./ui/button";

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
  Batch = "Batch",
  Process = "Process",
  Output = "Output",
}
export const nodeTypes = {
  [NodeType.EventStream]: EventStream,
  [NodeType.Batch]: Batch,
  [NodeType.Process]: Process,
  [NodeType.Output]: Output,
} as const;

/**
 * Canvas component for the flow graph
 * @returns JSX.Element
 */
export const Canvas = () => {
  // React Flow states
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { selectedNodes, selectedEdges, clearSelection } = useSelection();
  const { setCenter, getNode } = useReactFlow();
  const [newNodeId, setNewNodeId] = useState<string | null>(null);

  // Dialog states
  const [showCycleDetectionDialog, setShowCycleDetectionDialog] =
    useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  /**
   * Focus on the selected node, centering it precisely by accounting for its dimensions
   * @param nodeId - The ID of the node to focus on
   * @returns void
   */
  const focusOnNode = useCallback(
    (nodeId: string) => {
      const node = getNode(nodeId);
      if (node) {
        const nodeWidth = node.width ?? 150;
        const nodeHeight = node.height ?? 40;

        const centerX = node.position.x + nodeWidth / 2;
        const centerY = node.position.y + nodeHeight / 2;

        setCenter(centerX, centerY, {
          zoom: 1,
          duration: 800,
        });
      }
    },
    [getNode, setCenter],
  );

  /**
   * Focus on the selected node
   * @returns void
   */
  const focusOnSelectedNode = useCallback(() => {
    if (selectedNodes.length > 0) {
      focusOnNode(selectedNodes[0]);
    }
  }, [selectedNodes, focusOnNode]);

  /**
   * Handle key press events
   * @param event - The key press event
   * @returns void
   */
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Check if the active element is an input field or contenteditable element
      const activeElement = document.activeElement;
      const isEditingText =
        activeElement instanceof HTMLElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      // Only handle 'F' key press if not editing text
      if (!isEditingText && event.key.toLowerCase() === "f") {
        event.preventDefault();
        focusOnSelectedNode();
      }
    },
    [focusOnSelectedNode],
  );

  // Listen for key press events
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Listen for double-click focus events
  useNodeFocusListener(focusOnNode);

  /**
   * Create a new node
   * @param type - The type of the new node
   * @returns void
   */
  const createNode = useCallback(
    (type: string) => {
      const nodeId = uuidv4();

      // First, clear selection
      clearSelection();

      // Then create and add the new node
      const newNode: Node = {
        id: nodeId,
        type,
        position: {
          x: 0,
          y: 0,
        },
        selected: true,
        data: {
          ...defaultNodePrefs[type as keyof typeof defaultNodePrefs],
          name: `${type} ${
            nodes.filter((node) => node.type === type).length + 1
          }`,
        },
      };

      setNodes((nodes) => nodes.concat(newNode));
      // Store the new node ID for focusing
      setNewNodeId(nodeId);
    },
    [nodes, clearSelection, setNodes],
  );

  // Focus on the newly created node
  useEffect(() => {
    if (newNodeId) {
      // Small timeout to ensure state updates are complete
      const timeoutId = setTimeout(() => {
        focusOnSelectedNode();
        setNewNodeId(null); // Reset the newNodeId
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [newNodeId, focusOnSelectedNode]);

  // Listen for custom events to create new nodes
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

  // Handle delete key press
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

  // Add this alongside your existing deleteNode event listener in the useEffect
  useEffect(() => {
    const handleDeleteNode = (event: CustomEvent) => {
      const { nodeId } = event.detail;
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    };

    const handleRemoveConnections = (event: CustomEvent) => {
      const { nodeId } = event.detail;
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    };

    window.addEventListener("deleteNode", handleDeleteNode as EventListener);
    window.addEventListener(
      "removeConnections",
      handleRemoveConnections as EventListener,
    );

    return () => {
      window.removeEventListener(
        "deleteNode",
        handleDeleteNode as EventListener,
      );
      window.removeEventListener(
        "removeConnections",
        handleRemoveConnections as EventListener,
      );
    };
  }, [setNodes, setEdges]);

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
        setShowCycleDetectionDialog(true);
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
  const onDrop = (event: React.DragEvent) => {
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
        name: `${type} ${
          nodes.filter((node) => node.type === type).length + 1
        }`,
      },
    };

    setNodes((nodes) => nodes.concat(newNode));
  };

  /**
   * Reset the flow graph
   * @returns void
   */
  const resetFlow = () => {
    setNodes([]);
    setEdges([]);
  };

  /**
   * Construct the flow graph
   * @see src/hooks/use-flow-construction.tsx
   */
  const graph = new Graph(nodes, edges);
  const sortedIds = graph.topologicalSort();
  const { runtime, isRunning } = useFlowConstruction({
    nodes,
    edges,
    sortedIds,
  });

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
          panOnDrag={[1]}
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={true}
          selectNodesOnDrag={true}
        >
          <Panel
            position="bottom-right"
            className="font-mono text-xs text-neutral-500"
          >
            {nodes.length} {nodes.length === 1 ? "Block" : "Blocks"},{" "}
            {edges.length} {edges.length === 1 ? "Connection" : "Connections"}
          </Panel>
          <Background color="#999" variant={BackgroundVariant.Dots} />
          <Controls />
          <Panel position="top-right" className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!isRunning) {
                  runtime?.start();
                } else {
                  runtime?.stop();
                }
              }}
              disabled={nodes.length === 0}
            >
              {!isRunning ? "Start" : "Stop"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              disabled={nodes.length === 0}
            >
              Reset
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Dialogs */}
      <AlertDialog
        open={showCycleDetectionDialog}
        onOpenChange={setShowCycleDetectionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Cycle Detected
            </AlertDialogTitle>
            <AlertDialogDescription>
              You cannot add a connection that would create a cycle in the flow
              graph, as it would result in an infinite loop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Are you sure you want to reset the flow?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              nodes and connections in the flow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                runtime?.reset();
                resetFlow();
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
