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
import { useDebugStore } from "@/lib/store/debug";
import { styles } from "@/lib/styles/layout";
import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

/**
 * Inspector component for displaying node and edge properties
 * @returns JSX.Element
 */
export const Inspector = () => {
  const { selectedNodes, selectedEdges } = useSelection();
  const { selectedNodeElements, selectedEdgeElements } = useSelectedElements(
    selectedNodes,
    selectedEdges,
  );

  const debug = useDebugStore((state) => state.debug);
  const setDebug = useDebugStore((state) => state.setDebug);

  return (
    <aside className="border-l border-neutral-200" style={styles.rightPanel}>
      <div className="flex w-full items-center justify-between border-b px-2">
        <div className="w-fit select-none space-x-2 font-medium">
          <span>Inspector</span>
          {debug && (
            <Kbd>
              <span className="text-neutral-500">read only</span>
            </Kbd>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Debug mode</span>
          <Switch className="m-2" checked={debug} onCheckedChange={setDebug} />
        </div>
      </div>

      <div className="p-2">
        {selectedNodes.length > 0 ? (
          <div>
            {selectedNodeElements.map((node) => (
              <NodeInspector key={node.id} node={node} debugMode={debug} />
            ))}
          </div>
        ) : selectedEdges.length > 0 ? (
          <div>
            {selectedEdgeElements.map((edge) => (
              <EdgeInspector key={edge.id} edge={edge} debugMode={debug} />
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

/**
 * Node inspector component
 * @param node
 * @param debugMode
 * @returns JSX.Element
 */
const NodeInspector = ({
  node,
  debugMode,
}: {
  node: Node;
  debugMode: boolean;
}) => {
  const { setNodes } = useReactFlow();

  /**
   * Update node data
   * @param key
   * @param value
   * @returns void
   */
  const updateNodeData = useCallback(
    (key: string, value: string | number | boolean) => {
      setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id === node.id) {
            const convertedValue = (() => {
              const originalType = typeof node.data[key];
              if (originalType === "number") {
                return Number(value) || 0;
              }
              return value;
            })();

            return {
              ...n,
              data: {
                ...n.data,
                [key]: convertedValue,
              },
            };
          }
          return n;
        }),
      );
    },
    [node.id, setNodes, node.data],
  );

  return (
    <div>
      {debugMode ? (
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

/**
 * Edge inspector component
 * @param edge
 * @param debugMode
 * @returns JSX.Element
 */
const EdgeInspector = ({
  edge,
  debugMode,
}: {
  edge: Edge;
  debugMode: boolean;
}) => (
  <div>
    {debugMode ? (
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
