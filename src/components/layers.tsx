"use client";

import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useNodes } from "@xyflow/react";
import { X } from "lucide-react";
import { Kbd } from "./ui/kbd";

export const Layers = () => {
  const { selectedNodes, selectedEdges, selectNodes, clearSelection } =
    useSelection();
  const { selectedNodeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  const nodes = useNodes();

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

        {selectedNodes.length > 1 && (
          <button
            className="text-neutral-500 hover:text-neutral-600"
            onClick={clearSelection}
          >
            <X size={12} />
          </button>
        )}
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
            onClick={() => selectNodes([node.id])}
          >
            <span>{node.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
