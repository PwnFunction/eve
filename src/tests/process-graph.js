const nodes = [
  // event streams
  {
    id: "1",
    data: {
      type: "event-stream",
      unit: "requests",
      name: `Event Stream 1`,
      frequency: 1000,
      period: 1000, // ms
    },
  },
  {
    id: "2",
    data: {
      type: "event-stream",
      unit: "requests",
      name: `Event Stream 2`,
      frequency: 1000,
      period: 1000, // ms
    },
  },
  // router
  {
    id: "3",
    data: {
      type: "router",
      mode: "fifo", // fifo, wait
      inputs: ["1", "2"],
      outputs: ["4", "5"],
    },
  },
  // process
  {
    id: "4",
    data: {
      type: "process",
      delay: 1000, // ms
    },
  },
  {
    id: "5",
    data: {
      type: "process",
      delay: 2000, // ms
    },
  },
  // router
  {
    id: "6",
    data: {
      type: "router",
      mode: "wait",
      inputs: ["4", "5"],
      outputs: ["7"],
    },
  },
  // process
  {
    id: "7",
    data: {
      type: "process",
      delay: 1000, // ms
    },
  },
  // output
  {
    id: "8",
    data: {
      type: "output",
      to: "log", // log, store
    },
  },
  {
    id: "9",
    data: {
      type: "output",
      to: "log", // log, store
    },
  },
];

const edges = [
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[0].id,
    target: nodes[2].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[0].id,
    target: nodes[8].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[1].id,
    target: nodes[2].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[2].id,
    target: nodes[3].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[2].id,
    target: nodes[4].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[3].id,
    target: nodes[5].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[4].id,
    target: nodes[5].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[5].id,
    target: nodes[6].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[6].id,
    target: nodes[7].id,
  },
];

function log(x) {
  console.log(JSON.stringify(x, null, 2));
}

/**
 * GRAPH
 *    9
 *  /
 * 1     4
 *   \ /  \
 *    3    6 - 7 - 8
 *   / \  /
 * 2    5
 *
 */

const start = nodes.filter((node) => node.data.type === "event-stream");
log({ start });

const end = nodes.filter((node) => {
  const isTarget = !!edges.filter((edge) => edge.target === node.id).length;
  const isNotSource = !edges.filter((edge) => edge.source === node.id).length;

  return isTarget && isNotSource;
});

log({ end });

/**
 *
 * {
 *   id: 1,
 *   destination: [9, 3],
 * }
 *
 * {
 *   id: 2,
 *   destination: [3],
 * }
 *
 * {
 *   id: 9,
 *   source: [1],
 * }
 */
