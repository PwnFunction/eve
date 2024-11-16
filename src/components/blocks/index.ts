export * from "./batch";
export * from "./event-stream";
export * from "./output";
export * from "./process";

// Default node preferences
export const defaultNodePrefs = {
  EventStream: {
    name: "Event Stream",
    frequency: 1000,
    unit: "events",
    throttle: false,
  },
  Batch: {
    name: "Batch",
    size: 10,
  },
  Process: {
    name: "Process",
    time: 1000,
  },
  Output: {
    name: "Output",
  },
};
