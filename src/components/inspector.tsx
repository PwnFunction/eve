"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedElements } from "@/hooks/use-selected-elements";
import { useSelection } from "@/hooks/use-selection";
import { styles } from "@/lib/styles/layout";
import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback, useState } from "react";
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

const NodeInspector = ({ node, rawMode }: { node: Node; rawMode: boolean }) => {
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback(
    (key: string, value: string | number | boolean) => {
      setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                [key]: value,
              },
            };
          }
          return n;
        }),
      );
    },
    [node.id, setNodes],
  );

  return (
    <div>
      {rawMode ? (
        <pre className="w-[450px] overflow-x-auto text-neutral-500">
          {JSON.stringify(node, null, 2)}
        </pre>
      ) : (
        <div className="space-y-2">
          {/* Type */}
          <div className="flex items-center justify-between">
            <Label className="flex-1">Type</Label>

            <Input value={node.type} className="w-fit flex-1" disabled />
          </div>

          {/* ID */}
          <div className="flex items-center justify-between">
            <Label className="flex-1">ID</Label>

            <Input value={node.id} className="w-fit flex-1" disabled />
          </div>

          {/* Data */}
          {Object.entries(node.data).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="flex-1 capitalize">{key}</Label>

              {typeof value === "boolean" ? (
                <Select defaultValue={value.toString()}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={key} className="capitalize" />
                  </SelectTrigger>
                  <SelectContent className="flex-1">
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={value?.toString()}
                  className="w-fit flex-1"
                  type={typeof value === "string" ? "text" : "number"}
                  onChange={(e) => updateNodeData(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EdgeInspector = ({ edge, rawMode }: { edge: Edge; rawMode: boolean }) => (
  <div>
    {rawMode ? (
      <pre className="w-[450px] overflow-x-auto text-neutral-500">
        {JSON.stringify(edge, null, 2)}
      </pre>
    ) : (
      <div className="space-y-2">
        {/* Source */}
        <div className="flex items-center justify-between">
          <Label className="flex-1">Source</Label>

          <Input value={edge.source} className="w-fit flex-1" disabled />
        </div>

        {/* Target */}
        <div className="flex items-center justify-between">
          <Label className="flex-1">Target</Label>

          <Input value={edge.target} className="w-fit flex-1" disabled />
        </div>
      </div>
    )}
  </div>
);
