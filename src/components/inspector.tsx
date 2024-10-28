"use client";

import { styles } from "@/lib/styles/layout";
import {
  type Edge,
  type Node,
  useNodes,
  useOnSelectionChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";

export const Inspector = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const nodes = useNodes();

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes.map((node) => node.id.toString()));
      setSelectedEdges(edges.map((edge) => edge.id.toString()));
    },
    [],
  );

  useOnSelectionChange({
    onChange,
  });

  return (
    <aside
      className="border-l border-neutral-200 p-2"
      style={styles.rightPanel}
    >
      <p>Inspector</p>

      {selectedNodes.length > 0 ? (
        <div>
          {selectedNodes.map((id) => {
            const node = nodes.find((node) => node.id === id);

            if (!node) {
              return null;
            }

            return <NodeInspector key={node.id} node={node} />;
          })}
        </div>
      ) : (
        <p>
          Select a node or edge to inspect its properties. Hold down the{" "}
          <kbd>CMD</kbd> key to select multiple nodes or edges.
        </p>
      )}
    </aside>
  );
};

const NodeInspector = ({ node }: { node: Node }) => {
  return (
    <div>
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
};
