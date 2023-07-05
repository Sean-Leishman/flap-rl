import Node from "./Node";
import Connection from "./Connection";

class Genome {
  inputs;
  outputs;
  id;
  layers;
  nextNode;
  nodes: Node[];
  connections: Connection[];
  network: Node[];
  biasNode;

  constructor(inputs: number, outputs: number, id: number, offSpring = false) {
    this.inputs = inputs;
    this.outputs = outputs;

    this.id = id;
    this.layers = 2;
    this.nextNode = 0; // bias node

    this.nodes = []; // nodes in network
    this.connections = []; // how this.nodes connect
    this.network = []; // correct ordering of this.nodes

    if (!offSpring) {
      for (let i = 0; i < this.inputs; i++) {
        this.nodes.push(new Node(this.nextNode, 0));
        this.nextNode++;
      }

      for (let i = 0; i < this.outputs; i++) {
        let node = new Node(this.nextNode, 1, true);
        this.nodes.push(node);
        this.nextNode++;
      }

      for (let i = 0; i < this.inputs; i++) {
        for (let j = this.inputs; j < this.outputs + this.inputs; j++) {
          let weight = Math.random() * this.inputs * Math.sqrt(2 / this.inputs);
          this.connections.push(
            new Connection(this.nodes[i], this.nodes[j], weight)
          );
        }
      }
    }
  }

  feedForward(inputValues: number[]) {
    let result: number[] = [];

    this.generateNetwork();

    this.nodes.forEach((node, idx) => {
      node.inputSum = 0;
      node.outputSum = inputValues[idx];
    });

    this.nodes.forEach((node, idx) => {
      node.engage();

      if (node.output) {
        result.push(node.outputSum);
      }
    });

    return result;
  }

  generateNetwork() {
    this.nodes.forEach((node, idx) => {
      node.outputConnections = [];
      //node.outputConnections.splice(0, node.outputConnections.length);
    });

    this.connections.forEach((conn) => {
      conn.fromNode.outputConnections.push(conn);
    });

    this.sortByLayer();
  }

  sortByLayer() {
    this.network = [];

    for (let l = 0; l < this.layers; l++) {
      this.nodes.forEach((node) => {
        if (node.layer === l) {
          this.network.push(node);
        }
      });
    }
  }

  mutate() {
    let rand = Math.random();
    if (Math.random() < 0.05) {
      this.addNode();
    }
    if (Math.random() < 0.15) {
      this.addConnection();
    }
    if (Math.random() < 0.8) {
      this.connections.forEach((conn) => {
        conn.mutateWeight();
      });
    }
  }

  addNode() {
    let connectionIndex = Math.floor(Math.random() * this.connections.length);
    let pickedConnection = this.connections[connectionIndex];
    pickedConnection.enabled = false;
    this.connections.splice(connectionIndex, 1); //Delete the connection

    //Create the new node
    let newNode = new Node(this.nextNode, pickedConnection.fromNode.layer + 1);
    this.nodes.forEach((node) => {
      //Shift all nodes layer value
      if (node.layer > pickedConnection.fromNode.layer) node.layer++;
    });

    //New connections
    let newConnection1 = new Connection(pickedConnection.fromNode, newNode, 1);
    let newConnection2 = new Connection(
      newNode,
      pickedConnection.toNode,
      pickedConnection.weight
    );

    this.layers++;
    this.connections.push(newConnection1); //Add connection
    this.connections.push(newConnection2); //Add connection
    this.nodes.push(newNode); //Add node
    this.nextNode++;
  }

  addConnection() {
    if (this.fullyConnected()) {
      return;
    }

    let node1 = Math.floor(Math.random() * this.nodes.length);
    let node2 = Math.floor(Math.random() * this.nodes.length);

    while (
      this.nodes[node1].layer === this.nodes[node2].layer ||
      this.nodesConnected(this.nodes[node1], this.nodes[node2])
    ) {
      node1 = Math.floor(Math.random() * this.nodes.length);
      node2 = Math.floor(Math.random() * this.nodes.length);
    }

    if (this.nodes[node1].layer > this.nodes[node2].layer) {
      let temp = node1;
      node1 = node2;
      node2 = node1;
    }

    let newConnection = new Connection(
      this.nodes[node1],
      this.nodes[node2],
      Math.random() * this.inputs * Math.sqrt(2 / this.inputs)
    );
    this.connections.push(newConnection);
  }

  crossover(partner: Genome) {
    let offspring = new Genome(this.inputs, this.outputs, 0, true);
    offspring.nextNode = this.nextNode;

    // inherits parent nodes
    this.nodes.forEach((node) => {
      let newNode = node.clone();
      if (newNode.output) {
        let partnerNode = partner.nodes[partner.getNode(node.id)];
        if (Math.random() > 0.5) {
          newNode.activationFunction = partnerNode.activationFunction;
          newNode.bias = partnerNode.bias;
        }
      }
      offspring.nodes.push(newNode);
    });

    // takes nodes from this and partner network
    let maxlayer = 0;
    this.connections.forEach((conn) => {
      let idx = this.commonConnections(
        conn.getInnovationNumber(),
        partner.connections
      );

      let c = conn.clone();
      if (idx != -1) {
        c = Math.random() > 0.5 ? c : partner.connections[idx].clone();
      }

      let fromNode = offspring.nodes[offspring.getNode(conn.fromNode.id)];
      let toNode = offspring.nodes[offspring.getNode(conn.toNode.id)];

      c.fromNode = fromNode;
      c.toNode = toNode;

      if (fromNode && toNode) {
        offspring.connections.push(c);
      }
    });

    offspring.layers = this.layers;
    return offspring;
  }

  fullyConnected() {
    let maxConnections = 0;
    let nodesPerLayer: number[] = [];

    this.nodes.forEach((node) => {
      if (nodesPerLayer[node.layer] != undefined) {
        nodesPerLayer[node.layer]++;
      } else {
        nodesPerLayer[node.layer] = 1;
      }
    });

    for (let i = 0; i < this.layers - 1; i++)
      for (let j = i + 1; j < this.layers; j++)
        maxConnections += nodesPerLayer[i] * nodesPerLayer[j];

    return maxConnections == this.connections.length;
  }

  nodesConnected(node1: Node, node2: Node) {
    for (let conn in this.connections) {
      if (conn.fromNode == node1 && conn.toNode == node2) {
        return true;
      }
    }
    return false;
  }

  getNode(idx: number) {
    return this.nodes.findIndex((node) => node.id === idx);
  }

  commonConnections(innovationNum: number, connections: Connection[]) {
    return connections.findIndex(
      (conn) => innovationNum === conn.getInnovationNumber()
    );
  }

  clone() {
    let g = new Genome(this.inputs, this.outputs, this.id);
    g.nodes = this.nodes.slice(0, this.nodes.length);
    g.connections = this.connections.slice(0, this.connections.length);

    return g;
  }

  calculateWeight() {
    return this.connections.length + this.nodes.length;
  }
}

export default Genome;
