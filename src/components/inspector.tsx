"use client";

import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { type Edge, type Node } from "@xyflow/react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export const Inspector = () => {
  const { selectedNodes, selectedEdges } = useSelection();
  const { selectedNodeElements, selectedEdgeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  const [rawMode, setRawMode] = useState(false);

  return (
    <aside className="border-l border-neutral-200" style={styles.rightPanel}>
      <div className="flex w-full items-center justify-between border-b px-2">
        <div className="w-fit select-none space-x-2 font-medium">
          <span>Inspector</span>
          {rawMode && (
            <Kbd>
              <span className="text-neutral-500">read only</span>
            </Kbd>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Raw mode</span>
          <Switch
            className="m-2"
            checked={rawMode}
            onCheckedChange={setRawMode}
          />
        </div>
      </div>

      <div className="p-2">
        {selectedNodes.length > 0 ? (
          <div>
            {selectedNodeElements.map((node) => (
              <NodeInspector key={node.id} node={node} rawMode={rawMode} />
            ))}
          </div>
        ) : selectedEdges.length > 0 ? (
          <div>
            {selectedEdgeElements.map((edge) => (
              <EdgeInspector key={edge.id} edge={edge} rawMode={rawMode} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">
            Select a node or edge to inspect its properties. Hold down the{" "}
            <Kbd>⌘</Kbd> or <Kbd>Ctrl</Kbd> key to select multiple nodes or
            edges.
          </p>
        )}
      </div>
    </aside>
  );
};

const NodeInspector = ({ node, rawMode }: { node: Node; rawMode: boolean }) => (
  <div>
    {rawMode ? (
      <pre className="w-[360px] overflow-x-auto text-neutral-500">
        {JSON.stringify(node, null, 2)}
      </pre>
    ) : (
      <div className="space-y-2">
        {/* Type */}
        <div className="flex items-center justify-between">
          <Label>Type</Label>

          <Input value={node.type} className="w-fit" disabled />
        </div>

        {/* ID */}
        <div className="flex items-center justify-between">
          <Label>ID</Label>

          <Input value={node.id} disabled className="w-fit" />
        </div>
      </div>
    )}
  </div>
);

const EdgeInspector = ({ edge, rawMode }: { edge: Edge; rawMode: boolean }) => (
  <div>
    {rawMode ? (
      <pre className="w-[360px] overflow-x-auto text-neutral-500">
        {JSON.stringify(edge, null, 2)}
      </pre>
    ) : (
      <div className="space-y-2">
        {/* Source */}
        <div className="flex items-center justify-between">
          <Label>Source</Label>

          <Input value={edge.source} disabled className="w-fit" />
        </div>

        {/* Target */}
        <div className="flex items-center justify-between">
          <Label>Target</Label>

          <Input value={edge.target} disabled className="w-fit" />
        </div>
      </div>
    )}
  </div>
);
