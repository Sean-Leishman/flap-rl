import Node from "./Node";

class Connection {
  fromNode: Node;
  toNode: Node;
  weight: number;
  enabled: boolean;

  constructor(from: Node, to: Node, weight: number) {
    this.fromNode = from;
    this.toNode = to;
    this.weight = weight;

    this.enabled = true;
  }

  mutateWeight() {
    if (Math.random() < 0.05) {
      this.weight = Math.random() * 2 - 1;
    } else {
      this.weight += gaussianRandom() / 50;
    }
  }
  getInnovationNumber() {
    return (
      (1 / 2) *
        (this.fromNode.id + this.toNode.id) *
        (this.fromNode.id + this.toNode.id + 1) +
      this.fromNode.id
    );
  }

  clone() {
    let clone = new Connection(this.fromNode, this.toNode, this.weight);
    clone.enabled = this.enabled;
    return clone;
  }
}

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

export default Connection;
