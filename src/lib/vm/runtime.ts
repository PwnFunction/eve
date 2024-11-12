import {
  type EventStreamProps,
  type OutputProps,
  type ProcessProps,
  type QueueProps,
} from "@/components/blocks";
import { NodeType } from "@/components/canvas";
import { type Edge } from "@xyflow/react";
import { interval, Observable, Subject } from "rxjs";
import { Graph } from "./graph";

/**
 * Runtime for the reactive programming engine
 * @class RXRuntime
 */
export class RXRuntime {
  private graph: Graph;
  private buildOrder: string[];

  public components = new Map<string, any>();
  public componentEdges: Edge[] = [];

  /**
   * Create a new runtime
   * @param graph
   * @param buildOrder
   * @returns void
   */
  constructor(graph: Graph, buildOrder: string[]) {
    this.graph = graph;
    this.buildOrder = buildOrder; // Topologically sorted
  }

  /**
   * Get the configuration for a component
   * @param id
   * @returns config
   */
  getComponentConfig(id: string) {
    return this.graph.nodes.filter((n) => n.id == id).pop()?.data;
  }

  /**
   * Build the runtime
   * @returns void
   */
  build() {
    // First pass: create all the non-configured components
    // A, B, C
    this.buildOrder.forEach((nodeId, idx) => {
      const node = this.graph.nodes.filter((n) => n.id == nodeId).pop();

      if (!node) {
        return;
      }

      switch (node.type) {
        case NodeType.EventStream:
          this.createEventStream(node as EventStreamProps);
          break;
        case NodeType.Queue:
          this.createQueue(node as QueueProps);
          break;
        case NodeType.Process:
          this.createProcess(node as ProcessProps);
          break;
        case NodeType.Output:
          this.createOutput(node as OutputProps);
          break;
        default:
          console.error("Unknown block", node.type, idx);
      }
    });

    // Second pass: connect all the components
    // A -> B -> C
    this.buildOrder.reverse().forEach((nodeId) => {
      this.graph.edges
        .filter((edge) => edge.target === nodeId)
        .forEach((edge) => this.connectComponents(edge));
    });
  }

  /**
   * Check if a connection exists
   * @param source
   * @param target
   * @returns boolean
   */
  connectionExists(source: string, target: string) {
    return this.componentEdges.filter(
      (edge) => edge.source === source && edge.target === target,
    ).length;
  }

  /**
   * Connect components
   * @param edge
   * @returns void
   */
  connectComponents(edge: Edge) {
    const source = this.components.get(edge.source);
    const target = this.components.get(edge.target);

    // If either source or target is missing, skip
    if (!source || !target) {
      return;
    }

    // If connection is already established, skip
    if (this.connectionExists(edge.source, edge.target)) {
      return;
    }

    // setup output node
    if (
      this.graph.nodes.filter((n) => n.id == edge.target).pop()?.type ===
      NodeType.Output
    ) {
      target.subscribe((event: any) => {
        console.log("Output:", event);
      });
    }

    source.subscribe(target);

    // add edge to componentEdges
    this.componentEdges.push(edge);
  }

  /**
   * Store component and return it
   * @param id string
   * @param component Observable<any> | Subject<any>
   */
  private registerComponent<T>(id: string, component: T): T {
    this.components.set(id, component);
    return component;
  }

  /**
   * Create an event stream
   * @param node EventStreamProps
   * @returns Observable<number>
   */
  createEventStream(node: EventStreamProps): Observable<number> {
    return this.registerComponent(
      node.id,
      interval(node.data.frequency || 1000),
    );
  }

  /**
   * Create a queue
   * @param node QueueProps
   * @returns Subject<any>
   */
  createQueue(node: QueueProps): Subject<any> {
    return this.registerComponent(node.id, new Subject());
  }

  /**
   * Create a process
   * @param node ProcessProps
   * @returns Subject<any>
   */
  createProcess(node: ProcessProps): Subject<any> {
    return this.registerComponent(node.id, new Subject());
  }

  /**
   * Create an output
   * @param node OutputProps
   * @returns Subject<any>
   */
  createOutput(node: OutputProps): Subject<any> {
    return this.registerComponent(node.id, new Subject());
  }
}
