"use client";

import { styles } from "@/lib/styles/layout";
import { useNodes } from "@xyflow/react";

export const Layers = () => {
  const nodes = useNodes();

  return (
    <aside
      className="space-y-2 border-r border-neutral-200 p-2"
      style={styles.leftPanel}
    >
      <p>
        Layers <span className="font-mono text-xs">({nodes.length})</span>
      </p>

      <div>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="flex select-none items-center space-x-2 px-2 py-1 hover:bg-neutral-100"
          >
            <span>{node.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
