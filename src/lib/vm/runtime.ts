import {
  type EventStreamProps,
  type OutputProps,
  type ProcessProps,
  type QueueProps,
} from "@/components/blocks";
import { NodeType } from "@/components/canvas";
import { interval, Subject } from "rxjs";
import { Graph } from "./graph";

/**
 * Runtime for the reactive programming engine
 * @class RXRuntime
 */
export class RXRuntime {
  private graph: Graph;
  private buildOrder: string[];

  public components = new Map<string, any>();
  public componentEdges: Map<string, string> = new Map();

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
        .filter((e) => e.source == nodeId)
        .forEach((edge) => {
          const source = this.components.get(edge.source);
          const target = this.components.get(edge.target);

          // If either source or target is missing, skip
          if (!source || !target) {
            return;
          }

          // If connection is already established, skip
          if (
            this.componentEdges.has(edge.source) &&
            this.componentEdges.get(edge.source) === edge.target
          ) {
            return;
          }

          // Connect the components together
          if (!this.componentEdges.has(edge.source)) {
            this.componentEdges.set(edge.source, edge.target);
          }
        });
    });
    console.log("-------------");
    console.log(this.componentEdges);
  }

  /**
   * Create an event stream
   * @param node EventStreamProps
   * @returns void
   */
  createEventStream(node: EventStreamProps) {
    const eventStream = interval(node.data.frequency || 1000);
    this.components.set(node.id, eventStream);
  }

  /**
   * Create a queue
   * @param node QueueProps
   * @returns void
   */
  createQueue(node: QueueProps) {
    const queue = new Subject();
    this.components.set(node.id, queue);
  }

  /**
   * Create a process
   * @param node ProcessProps
   * @returns void
   */
  createProcess(node: ProcessProps) {
    const process = new Subject();
    this.components.set(node.id, process);
  }

  /**
   * Create an output
   * @param node OutputProps
   * @returns void
   */
  createOutput(node: OutputProps) {
    const output = new Subject();
    this.components.set(node.id, output);
  }
}
