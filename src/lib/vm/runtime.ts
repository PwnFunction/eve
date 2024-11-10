import { NodeType } from "@/components/canvas";
import { Graph } from "./graph";

export class RXRuntime {
  private components = new Map<string, any>();
  private buildOrder: string[];
  private graph: Graph;

  constructor(graph: Graph, buildOrder: string[]) {
    this.graph = graph;
    this.buildOrder = buildOrder;
  }

  build() {
    this.buildOrder.forEach((nodeId, idx) => {
      const node = this.graph.nodes.filter((n) => n.id == nodeId).pop();

      if (!node) {
        return;
      }

      switch (node.type) {
        case NodeType.EventStream:
          console.log("-> event stream", idx);
          break;
        case NodeType.Queue:
          console.log("-> queue", idx);
          break;
        case NodeType.Process:
          console.log("-> process", idx);
          break;
        case NodeType.Output:
          console.log("-> output", idx);
          break;
        default:
          console.log("no idea", node.type, idx);
      }
    });
  }
}
