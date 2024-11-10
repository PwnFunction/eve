const nodes = [
  // event streams
  {
    id: "1",
    data: {
      type: "event-stream",
    },
  },
  {
    id: "2",
    data: {
      type: "event-stream",
    },
  },
  // queue
  {
    id: "3",
    data: {
      type: "queue",
    },
  },
  // process
  {
    id: "4",
    data: {
      type: "process",
    },
  },
  {
    id: "5",
    data: {
      type: "process",
    },
  },
  {
    id: "6",
    data: {
      type: "process",
    },
  },
  // output
  {
    id: "7",
    data: {
      type: "output",
    },
  },
  // queue
  {
    id: "8",
    data: {
      type: "queue",
    },
  },
  // output
  {
    id: "9",
    data: {
      type: "output",
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
    source: nodes[2].id,
    target: nodes[5].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[3].id,
    target: nodes[6].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[4].id,
    target: nodes[6].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[5].id,
    target: nodes[6].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[3].id,
    target: nodes[7].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[4].id,
    target: nodes[7].id,
  },
  {
    id: crypto.randomUUID().slice(0, 7),
    source: nodes[7].id,
    target: nodes[8].id,
  },
  // cyclic
  // {
  //   id: crypto.randomUUID().slice(0, 7),
  //   source: nodes[5].id,
  //   target: nodes[2].id,
  // },
];

/**
 * Topological Sort
 * @param {*} startNode
 * @param {*} visited
 * @param {*} visiting
 * @param {*} sorted
 * @returns sorted
 */
function topologicalSort(startNode, visited = [], visiting = [], sorted = []) {
  // If we encounter a node we're currently visiting, we've found a cycle
  if (visiting.includes(startNode.id)) {
    throw new Error(`Cycle detected involving node ${startNode.id}`);
  }

  // If we've already completely visited this node, skip it
  if (visited.includes(startNode.id)) {
    return;
  }

  // Mark node as being visited in current path
  visiting.push(startNode.id);

  let connectedEdges = edges.filter((edge) => edge.source === startNode.id);
  let connectedNodes = nodes.filter((node) => {
    return connectedEdges.map((edge) => edge.target).includes(node.id);
  });

  // Visit all connected nodes
  connectedNodes.forEach((node) =>
    topologicalSort(node, visited, visiting, sorted),
  );

  // Remove node from visiting set as we're done with this path
  visiting.splice(visiting.indexOf(startNode.id), 1);

  // Mark as fully visited and add to sorted list
  visited.push(startNode.id);
  sorted.push(startNode.id);

  return sorted;
}

const starts = nodes.filter((node) => node.data.type === "event-stream");

let visited = [];
starts.forEach((start) => {
  let sorted = topologicalSort(start, visited);

  sorted.forEach((id) => {
    let n = nodes.find((node) => node.id === id);
    console.log(n.id, n.data.type);
  });
});
