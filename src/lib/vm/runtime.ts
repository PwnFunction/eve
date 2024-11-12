import { type Edge, type Node } from "@xyflow/react";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { delay, tap } from "rxjs/operators";

// Define the types of nodes we support
export enum NodeType {
  EventStream = "EventStream",
  Queue = "Queue",
  Process = "Process",
  Output = "Output",
}

export class RXRuntime {
  private nodes: Map<string, any> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private subjects: Map<string, Subject<any>> = new Map();
  private sortedNodeIds: string[];
  private graph: { nodes: Node[]; edges: Edge[] };
  private _onStateChange?: (isRunning: boolean) => void;

  constructor(
    graph: { nodes: Node[]; edges: Edge[] },
    sortedIds: string[],
    onStateChange?: (isRunning: boolean) => void,
  ) {
    this.sortedNodeIds = sortedIds;
    this.graph = graph;
    this._onStateChange = onStateChange;
    this.setupSubjects();
  }

  private _isRunning: boolean = false;
  get isRunning(): boolean {
    return this._isRunning;
  }
  private setIsRunning(value: boolean) {
    this._isRunning = value;
    this._onStateChange?.(value);
  }

  private setupSubjects() {
    this.subjects.clear();
    this.nodes.clear();

    this.graph.nodes.forEach((node) => {
      this.subjects.set(node.id, new Subject());
      this.nodes.set(node.id, node);
    });
  }

  private initializeRuntime() {
    this.clearSubscriptions();

    // First, set up event stream sources
    this.sortedNodeIds.forEach((nodeId) => {
      const node = this.nodes.get(nodeId);
      if (node?.type === NodeType.EventStream) {
        const subject = this.subjects.get(nodeId);
        if (subject) {
          console.log(`Setting up event stream for ${node.data.name}`);
          const subscription = interval(node.data.frequency).subscribe(
            (value) => {
              console.log(`[${node.data.name}] Emitting:`, value);
              subject.next(value);
            },
          );
          this.subscriptions.set(`${nodeId}-source`, subscription);
        }
      }
    });

    // Then set up the connections between nodes
    this.graph.edges.forEach((edge) => {
      const sourceNode = this.nodes.get(edge.source);
      const targetNode = this.nodes.get(edge.target);
      const sourceSubject = this.subjects.get(edge.source);
      const targetSubject = this.subjects.get(edge.target);

      if (!sourceNode || !targetNode || !sourceSubject || !targetSubject) {
        return;
      }

      let observable: Observable<any>;

      switch (sourceNode.type) {
        case NodeType.Process:
          observable = sourceSubject.pipe(
            delay(sourceNode.data.delay),
            tap((value) => {
              console.log(`[${sourceNode.data.name}] Processing:`, value);
            }),
          );
          break;

        case NodeType.Queue:
          observable = sourceSubject.pipe(
            tap((value) => {
              console.log(`[${sourceNode.data.name}] Queued:`, value);
            }),
          );
          break;

        default:
          observable = sourceSubject;
      }

      const subscription = observable.subscribe({
        next: (value) => {
          if (targetNode.type === NodeType.Output) {
            console.log(`[${targetNode.data.name}] Output:`, value);
          }
          targetSubject.next(value);
        },
        error: (err) => {
          console.error(`Error in node ${sourceNode.data.name}:`, err);
          targetSubject.error(err);
        },
      });

      this.subscriptions.set(`${edge.source}-${edge.target}`, subscription);
    });
  }

  private clearSubscriptions() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();
  }

  public start() {
    if (!this.isRunning) {
      console.log("Starting flow...");
      this.initializeRuntime();
      this.setIsRunning(true);
    }
  }

  public stop() {
    if (this.isRunning) {
      console.log("Stopping flow...");
      this.clearSubscriptions();
      this.setIsRunning(false);
    }
  }

  public reset() {
    console.log("Resetting flow...");
    this.stop();
    this.subjects.forEach((subject) => subject.complete());
    this.setupSubjects();
  }

  public isActive(): boolean {
    return this.isRunning;
  }
}
