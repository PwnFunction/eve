import { type Edge, type Node } from "@xyflow/react";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { bufferCount, delay, tap } from "rxjs/operators";
import { logger } from "../utils/logger";

// Define the types of nodes we support
export enum NodeType {
  EventStream = "EventStream",
  Batch = "Batch",
  Process = "Process",
  Output = "Output",
}

/**
 * The runtime class that manages the execution of the flow graph
 */
export class RXRuntime {
  private nodes: Map<string, any> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private subjects: Map<string, Subject<any>> = new Map();
  private sortedNodeIds: string[];
  private graph: { nodes: Node[]; edges: Edge[] };
  private _onStateChange?: (isRunning: boolean) => void;

  /**
   * Creates a new runtime instance
   * @param {Object} graph - The graph object containing nodes and edges
   * @param {string[]} sortedIds - Topologically sorted node IDs
   * @param {Function} onStateChange - Callback function to call when the
   */
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

  /**
   * Returns whether the runtime is currently running
   * @returns {boolean}
   */
  get isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Sets the isRunning flag and calls the onStateChange callback
   * @param {boolean} value - The new value of the isRunning flag
   * @returns {void}
   */
  private setIsRunning(value: boolean) {
    this._isRunning = value;
    this._onStateChange?.(value);
  }

  /**
   * Sets up subjects for each node in the graph
   * @returns {void}
   */
  private setupSubjects() {
    this.subjects.clear();
    this.nodes.clear();

    this.graph.nodes.forEach((node) => {
      this.subjects.set(node.id, new Subject());
      this.nodes.set(node.id, node);
    });
  }

  /**
   * Initializes the runtime by setting up event streams and connections
   * between nodes
   * @returns {void}
   */
  private initializeRuntime() {
    this.clearSubscriptions();

    // First, set up event stream sources
    this.sortedNodeIds.forEach((nodeId) => {
      const node = this.nodes.get(nodeId);
      if (node?.type === NodeType.EventStream) {
        const subject = this.subjects.get(nodeId);
        if (subject) {
          logger.log(`Setting up event stream for ${node.data.name}`);

          const subscription = interval(node.data.frequency).subscribe(
            (value) => {
              logger.log(`[${node.data.name}] Emitting:`, { value });
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
              logger.log(`[${sourceNode.data.name}] Processing:`, { value });
            }),
          );
          break;

        case NodeType.Batch:
          observable = sourceSubject.pipe(
            bufferCount(sourceNode.data.size),
            tap((values) => {
              logger.log(`[${sourceNode.data.name}] Batching:`, { values });
            }),
          );
          break;

        default:
          observable = sourceSubject;
      }

      const subscription = observable.subscribe({
        next: (value) => {
          if (targetNode.type === NodeType.Output) {
            logger.log(`[${targetNode.data.name}] Output:`, { value });
          }
          targetSubject.next(value);
        },
        error: (error) => {
          logger.error(`Error in node ${sourceNode.data.name}`, {
            error,
          });
          targetSubject.error(error);
        },
      });

      this.subscriptions.set(`${edge.source}-${edge.target}`, subscription);
    });
  }

  /**
   * Clears all subscriptions
   * @returns {void}
   */
  private clearSubscriptions() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();
  }

  /**
   * Starts the runtime by initializing the runtime and setting the
   * isRunning flag to true
   * @returns {void}
   */
  public start() {
    if (!this.isRunning) {
      this.initializeRuntime();
      this.setIsRunning(true);
      logger.log("Event simulation started");
    }
  }

  /**
   * Stops the runtime by clearing all subscriptions
   * @returns {void}
   */
  public stop() {
    if (this.isRunning) {
      this.clearSubscriptions();
      this.setIsRunning(false);
      logger.log("Event simulation stopped");
    }
  }

  /**
   * Resets the runtime by stopping it and clearing all subjects
   * and subscriptions
   * @returns {void}
   */
  public reset() {
    this.stop();
    this.subjects.forEach((subject) => subject.complete());
    this.setupSubjects();
    logger.log("Runtime reset");
  }

  /**
   * Returns whether the runtime is currently active (running)
   * @returns {boolean}
   */
  public isActive(): boolean {
    return this.isRunning;
  }
}
