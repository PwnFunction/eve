import {
  EventStreamProps,
  OutputProps,
  ProcessProps,
  QueueProps,
} from "@/components/blocks";
import { NodeType } from "@/components/canvas";
import { type Edge, type Node } from "@xyflow/react";

export type EveNode =
  | Node
  | EventStreamProps
  | QueueProps
  | ProcessProps
  | OutputProps;

export class Graph {
  public nodes: EveNode[];
  public edges: Edge[];

  /**
   * Create a new graph
   * @param nodes
   * @param edges
   */
  constructor(nodes: EveNode[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  /**
   * Perform a topological sort of the graph
   * @param startNode
   * @param visited
   * @param visiting
   * @param sorted
   * @returns void
   */
  private topologicalSortUtil(
    startNode: EveNode,
    visited: Set<string>,
    visiting: Set<string>,
    sorted: string[],
  ): void {
    // If we encounter a node we're currently visiting, we've found a cycle
    if (visiting.has(startNode.id)) {
      throw new Error(`Cycle detected involving node ${startNode.id}`);
    }

    // If we've already completely visited this node, skip it
    if (visited.has(startNode.id)) {
      return;
    }

    // Mark node as being visited in current path
    visiting.add(startNode.id);

    // Find connected edges and nodes
    const connectedEdges = this.edges.filter(
      (edge) => edge.source === startNode.id,
    );
    const connectedNodes = this.nodes.filter((node) =>
      connectedEdges.some((edge) => edge.target === node.id),
    );

    // Visit all connected nodes
    for (const node of connectedNodes) {
      this.topologicalSortUtil(node, visited, visiting, sorted);
    }

    // Remove node from visiting set as we're done with this path
    visiting.delete(startNode.id);

    // Mark as fully visited and add to sorted list
    visited.add(startNode.id);
    sorted.push(startNode.id);
  }

  /**
   * Perform a topological sort of the graph
   * @returns string[]
   */
  topologicalSort(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const sorted: string[] = [];

    const startNodes = this.nodes.filter(
      (node) => node.type === NodeType.EventStream,
    );

    for (const node of startNodes) {
      if (!visited.has(node.id)) {
        this.topologicalSortUtil(node, visited, visiting, sorted);
      }
    }

    return sorted.reverse();
  }

  /**
   * Print sorted nodes
   * @returns void
   */
  printSortedNodes(): void {
    const sorted = this.topologicalSort();
    sorted.forEach((id) => {
      const node = this.nodes.find((n) => n.id === id);
      if (node) {
        console.log(node.id, node.type);
      }
    });
  }
}
