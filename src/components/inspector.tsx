"use client";

import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { type Edge, type Node } from "@xyflow/react";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";

export const Inspector = () => {
  const { selectedNodes, selectedEdges } = useSelection();
  const { selectedNodeElements, selectedEdgeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  return (
    <aside
      className="border-l border-neutral-200 p-2"
      style={styles.rightPanel}
    >
      <p>Inspector</p>

      {selectedNodes.length > 0 ? (
        <div>
          {selectedNodeElements.map((node) => (
            <NodeInspector key={node.id} node={node} />
          ))}
        </div>
      ) : selectedEdges.length > 0 ? (
        <div>
          {selectedEdgeElements.map((edge) => (
            <EdgeInspector key={edge.id} edge={edge} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          Select a node or edge to inspect its properties. Hold down the{" "}
          <Kbd>⌘</Kbd> or <Kbd>Ctrl</Kbd> key to select multiple nodes or edges.
        </p>
      )}
    </aside>
  );
};

// NodeInspector and EdgeInspector components remain the same

const NodeInspector = ({ node }: { node: Node }) => {
  return (
    <div>
      <pre className="w-[360px] overflow-x-auto text-neutral-500">
        {JSON.stringify(node, null, 2)}
      </pre>

      <div className="space-y-2">
        {/* Type */}
        <div className="flex items-center justify-between">
          <Label>Type</Label>

          <Input
            value={node.type}
            readOnly
            className="w-fit cursor-not-allowed"
          />
        </div>

        {/* ID */}
        <div className="flex items-center justify-between">
          <Label>ID</Label>

          <Input
            value={node.id}
            readOnly
            className="w-fit cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

const EdgeInspector = ({ edge }: { edge: Edge }) => {
  return (
    <div>
      <pre className="w-[360px] overflow-x-auto text-neutral-500">
        {JSON.stringify(edge, null, 2)}
      </pre>

      <div className="space-y-2">
        {/* Source */}
        <div className="flex items-center justify-between">
          <Label>Source</Label>

          <Input
            value={edge.source}
            readOnly
            className="w-fit cursor-not-allowed"
          />
        </div>

        {/* Target */}
        <div className="flex items-center justify-between">
          <Label>Target</Label>

          <Input
            value={edge.target}
            readOnly
            className="w-fit cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
