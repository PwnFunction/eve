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
import { useNodes } from "@xyflow/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Kbd } from "./ui/kbd";
import { ScrollArea } from "./ui/scroll-area";

export const Layers = () => {
  const { selectedNodes, selectedEdges, selectNodes, clearSelection } =
    useSelection();
  const { selectedNodeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  const nodes = useNodes();
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Track shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
          <div
            key={node.id}
            className={cn(
              "flex cursor-pointer select-none items-center space-x-2 px-2 py-1 hover:bg-neutral-50",
              {
                "bg-neutral-100": selectedNodeElements.includes(node),
              },
            )}
            onClick={() => handleNodeClick(node.id)}
          >
            <span>{node.type}</span>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};
