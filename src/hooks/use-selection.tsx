import {
  type Edge,
  type Node,
  useOnSelectionChange,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";

/**
 * A hook that provides selection state and methods to select and clear nodes and edges.
 */
export const useSelection = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const { setNodes, setEdges } = useReactFlow();

  /**
   * Updates the selected nodes and edges when the selection changes.
   * @param {Node[]} selection.nodes The selected nodes.
   * @param {Edge[]} selection.edges The selected edges.
   * @returns {void}
   */
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

  /**
   * Selects the nodes with the given IDs.
   * @param {string[]} nodeIds The IDs of the nodes to select.
   * @param {boolean} [addToSelection=false] Whether to add the selected nodes to the current selection.
   * @returns {void}
   */
  const selectNodes = useCallback(
    (nodeIds: string[], addToSelection: boolean = false) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: addToSelection
            ? nodeIds.includes(node.id.toString()) || node.selected
            : nodeIds.includes(node.id.toString()),
        })),
      );
    },
    [setNodes],
  );

  /**
   * Selects the edges with the given IDs.
   * @param {string[]} edgeIds The IDs of the edges to select.
   * @param {boolean} [addToSelection=false] Whether to add the selected edges to the current selection.
   * @returns {void}
   */
  const selectEdges = useCallback(
    (edgeIds: string[], addToSelection: boolean = false) => {
      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          selected: addToSelection
            ? edgeIds.includes(edge.id.toString()) || edge.selected
            : edgeIds.includes(edge.id.toString()),
        })),
      );
    },
    [setEdges],
  );

  /**
   * Clears the selection of nodes and edges.
   * @returns {void}
   */
  const clearSelection = useCallback(() => {
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })));
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })));
  }, [setNodes, setEdges]);

  return {
    selectedNodes,
    selectedEdges,
    selectNodes,
    selectEdges,
    clearSelection,
  };
};
