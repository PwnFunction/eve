"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { CustomEvents } from "@/lib/constants/custom-events";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { truncateString } from "@/lib/utils/truncate";
import { useNodes, useReactFlow } from "@xyflow/react";
import { Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Kbd } from "./ui/kbd";
import { ScrollArea } from "./ui/scroll-area";

/**
 * Dispatch focus node event
 * @param {string} nodeId
 * @returns void
 */
export const dispatchFocusNodeEvent = (nodeId: string) => {
  const event = new CustomEvent(CustomEvents.FocusNode, { detail: { nodeId } });
  window.dispatchEvent(event);
};

/**
 * Layers component
 * @returns JSX.Element
 */
export const Layers = () => {
  const nodes = useNodes();
  const { deleteElements } = useReactFlow();
  const { selectedNodes, selectedEdges, selectNodes, clearSelection } =
    useSelection();
  const { selectedNodeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isCommandPressed, setIsCommandPressed] = useState(false);

  /**
   * Handle delete node
   * @param {string} nodeId
   * @param {React.MouseEvent} e
   * @returns void
   */
  const handleNodeDelete = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const nodeToDelete = nodes.find((node) => node.id === nodeId);
      if (!nodeToDelete) return;

      deleteElements({ nodes: [nodeToDelete], edges: [] });

      if (selectedNodes.includes(nodeId)) {
        const newSelection = selectedNodes.filter((id) => id !== nodeId);
        selectNodes(newSelection, false);
      }
    },
    [nodes, deleteElements, selectedNodes, selectNodes],
  );

  /**
   * Handle delete selected nodes
   * @param {React.MouseEvent} e
   * @returns void
   */
  const handleDeleteSelected = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nodesToDelete = nodes.filter((node) =>
        selectedNodes.includes(node.id),
      );
      if (nodesToDelete.length === 0) return;

      deleteElements({ nodes: nodesToDelete, edges: [] });
      clearSelection();
    },
    [nodes, selectedNodes, deleteElements, clearSelection],
  );

  /**
   * Handle click on a node to select it
   * @param {string} nodeId
   * @param {number} index
   * @param {React.MouseEvent} e
   * @returns void
   */
  const handleNodeClick = useCallback(
    (nodeId: string, index: number, e: React.MouseEvent) => {
      e.stopPropagation();

      if (isShiftPressed && lastClickedIndex !== null) {
        const start = Math.min(lastClickedIndex, index);
        const end = Math.max(lastClickedIndex, index);
        const rangeNodeIds = nodes.slice(start, end + 1).map((node) => node.id);

        if (isCommandPressed) {
          const existingSelection = new Set(selectedNodes);
          rangeNodeIds.forEach((id) => existingSelection.add(id));
          selectNodes(Array.from(existingSelection), false);
        } else {
          selectNodes(rangeNodeIds, false);
        }
      } else {
        selectNodes([nodeId], isCommandPressed);
        setLastClickedIndex(index);
      }
    },
    [
      selectNodes,
      isCommandPressed,
      isShiftPressed,
      lastClickedIndex,
      nodes,
      selectedNodes,
    ],
  );

  /**
   * Handle click on the panel to clear selection
   * @param {React.MouseEvent} e
   * @returns void
   */
  const handlePanelClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if we clicked directly on the ScrollArea or aside
      const target = e.target as HTMLElement;
      if (
        target.classList.contains("layers-panel") ||
        target.classList.contains("scroll-area-wrapper")
      ) {
        clearSelection();
        setLastClickedIndex(null);
      }
    },
    [clearSelection],
  );

  // Listen for command and shift key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) setIsCommandPressed(true);
      if (e.shiftKey) setIsShiftPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) setIsCommandPressed(false);
      if (!e.shiftKey) setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <aside
      className="layers-panel space-y-2 border-r border-neutral-200"
      style={styles.leftPanel}
      onClick={handlePanelClick}
    >
      <div
        className="flex w-full items-center justify-between border-b px-2 py-2"
        onClick={(e) => e.stopPropagation()}
      >
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
                  className="text-neutral-500 hover:text-red-500"
                  onClick={handleDeleteSelected}
                >
                  <Trash size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete selected</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <div className="scroll-area-wrapper !mt-0 h-[95.5%]">
        <ScrollArea>
          {nodes.map((node, index) => (
            <LayerItem
              key={node.id}
              node={node}
              selected={selectedNodeElements.includes(node)}
              selectOnClick={(e) => handleNodeClick(node.id, index, e)}
              deleteOnClick={(e) => handleNodeDelete(node.id, e)}
            />
          ))}
        </ScrollArea>
      </div>
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
  selectOnClick: (e: React.MouseEvent) => void;
  deleteOnClick: (e: React.MouseEvent) => void;
}) => {
  const name = node.data?.name || node.type;

  /**
   * Handle double click on a node to focus it
   * @param {React.MouseEvent} e
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
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="flex-1 px-2 py-1"
        onClick={selectOnClick}
        onDoubleClick={handleDoubleClick}
      >
        {truncateString(name)}
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
