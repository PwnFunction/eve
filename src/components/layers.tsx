"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useNodes, useReactFlow } from "@xyflow/react";
import { Trash, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Kbd } from "./ui/kbd";
import { ScrollArea } from "./ui/scroll-area";

// Custom event name for focusing
const FOCUS_NODE_EVENT = "focusNode";

/**
 * Dispatch a custom event to focus a node
 * @param nodeId
 * @returns void
 */
export const dispatchFocusNodeEvent = (nodeId: string) => {
  const event = new CustomEvent(FOCUS_NODE_EVENT, { detail: { nodeId } });
  window.dispatchEvent(event);
};

/**
 * Layers component
 * @returns JSX.Element
 */
export const Layers = () => {
  const { selectedNodes, selectedEdges, selectNodes, clearSelection } =
    useSelection();
  const { selectedNodeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  const nodes = useNodes();
  const { deleteElements } = useReactFlow();

  /**
   * Delete a node and its connected edges
   * @param nodeId
   * @returns void
   */
  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      // Find the node to delete
      const nodeToDelete = nodes.find((node) => node.id === nodeId);
      if (!nodeToDelete) return;

      // Delete the node and its connected edges
      deleteElements({ nodes: [nodeToDelete], edges: [] });

      // If the deleted node was selected, clear it from selection
      if (selectedNodes.includes(nodeId)) {
        const newSelection = selectedNodes.filter((id) => id !== nodeId);
        selectNodes(newSelection, false);
      }
    },
    [nodes, deleteElements, selectedNodes, selectNodes],
  );

  // Track shift key state
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Listen for shift key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) setIsShiftPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /**
   * Handle node click event
   * @param nodeId
   * @returns void
   */
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      selectNodes([nodeId], isShiftPressed);
    },
    [selectNodes, isShiftPressed],
  );

  return (
    <aside
      className="space-y-2 border-r border-neutral-200"
      style={styles.leftPanel}
    >
      <div className="flex w-full items-center justify-between border-b px-2 py-2">
        <div className="w-fit select-none space-x-2 font-medium">
          <span>Layers</span>
          {selectedNodes.length > 0 && (
            <Kbd>
              <span className="text-neutral-500">{selectedNodes.length}</span>
            </Kbd>
          )}
        </div>

        <TooltipProvider>
          {selectedNodes.length > 1 && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <button
                  className="text-neutral-500 hover:text-neutral-600"
                  onClick={clearSelection}
                >
                  <X size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Clear selection</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <ScrollArea className="!mt-0 h-[95.5%]">
        {nodes.map((node) => (
          <LayerItem
            key={node.id}
            node={node}
            selected={selectedNodeElements.includes(node)}
            selectOnClick={() => handleNodeClick(node.id)}
            deleteOnClick={() => handleNodeDelete(node.id)}
          />
        ))}
      </ScrollArea>
    </aside>
  );
};

/**
 * Layer item component
 * @param node
 * @param selected
 * @param selectOnClick
 * @param deleteOnClick
 * @returns JSX.Element
 */
const LayerItem = ({
  node,
  selected,
  selectOnClick,
  deleteOnClick,
}: {
  node: any;
  selected: boolean;
  selectOnClick: () => void;
  deleteOnClick: () => void;
}) => {
  const name = node.data?.name || node.type;

  /**
   * Handle double click event
   * Focus the node
   * @param e
   * @returns void
   */
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatchFocusNodeEvent(node.id);
    },
    [node.id],
  );

  return (
    <div
      className={cn(
        "group flex cursor-pointer select-none items-center justify-between hover:bg-neutral-50",
        selected && "bg-neutral-100",
      )}
    >
      <span
        className="flex-1 px-2 py-1"
        onClick={selectOnClick}
        onDoubleClick={handleDoubleClick}
      >
        {name}
      </span>

      <div
        className="hidden h-full px-2 py-1 text-neutral-400 hover:text-red-500 group-hover:block"
        onClick={deleteOnClick}
      >
        <Trash size={14} />
      </div>
    </div>
  );
};
