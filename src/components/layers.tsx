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
      className="space-y-2 border-r border-neutral-200 p-2"
      style={styles.leftPanel}
    >
      <div className="flex items-center justify-between">
        <p>
          Layers{" "}
          <Kbd>
            <span className="text-neutral-500">{nodes.length}</span>
          </Kbd>
        </p>

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

      <div className="space-y-0.5">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "flex cursor-pointer select-none items-center space-x-2 px-2 py-1 hover:bg-neutral-100",
              {
                "bg-neutral-100": selectedNodeElements.includes(node),
              },
            )}
            onClick={() => handleNodeClick(node.id)}
          >
            <span>{node.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
