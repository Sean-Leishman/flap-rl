import Connection from "./Connection";

class Node {
  id: number;
  layer: number;
  inputSum: number;
  outputSum: number;
  outputConnections: Connection[];
  activationFunction: number;
  bias: number;
  output: boolean;

  constructor(id: number, layer: number, isOutput: boolean = false) {
    this.id = id;
    this.layer = layer;

    this.inputSum = 0;
    this.outputSum = 0;
    this.outputConnections = [];
    this.output = isOutput;

    this.bias = Math.random() * 2 - 1;
    this.activationFunction = Math.floor(Math.random() * 5);
  }

  engage() {
    if (this.layer != 0) {
      this.outputSum = this.activation(this.inputSum + this.bias);
    }

    this.outputConnections.forEach((conn) => {
      if (conn.enabled) {
        conn.toNode.inputSum += conn.weight * this.outputSum;
      }
    });
  }

  clone() {
    let node = new Node(this.id, this.layer, this.output);
    node.bias = this.bias;
    node.activationFunction = this.activationFunction;
    return node;
  }

  activation(x) {
    //All the possible activation Functions
    switch (this.activationFunction) {
      case 0: //Sigmoid
        return 1 / (1 + Math.pow(Math.E, -4.9 * x));
        break;
      case 1: //Identity
        return x;
        break;
      case 2: //Step
        return x > 0 ? 1 : 0;
        break;
      case 3: //Tanh
        return Math.tanh(x);
        break;
      case 4: //ReLu
        return x < 0 ? 0 : x;
        break;
      default: //Sigmoid
        return 1 / (1 + Math.pow(Math.E, -4.9 * x));
        break;
    }
  }
}

export default Node;
