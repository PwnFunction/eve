"use client";

import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { cn } from "@/lib/utils/class";
import { useNodes } from "@xyflow/react";

export const Layers = () => {
  const { selectedNodes, selectedEdges } = useSelection();
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
      <p>
        Layers <span className="font-mono text-xs">({nodes.length})</span>
      </p>

      <div className="space-y-0.5">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "flex select-none items-center space-x-2 px-2 py-1 hover:bg-neutral-100",
              {
                "bg-neutral-100": selectedNodeElements.includes(node),
              },
            )}
          >
            <span>{node.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
