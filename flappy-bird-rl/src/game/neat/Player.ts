import Genome from "./Genome";

let inputs = 3;
let outputs = 1;
let showBest = true;

class Player {
  brain: Genome;
  fitness: number;
  score: number;
  lifespan: number;
  dead: boolean;
  decisions: number[];
  vision: number[];

  id: number;

  constructor(entityId: number) {
    this.id = entityId;
    this.brain = new Genome(inputs, outputs, this.id);

    this.score = 1;
    this.lifespan = 0;
    this.dead = false;
    this.decisions = [];
    this.vision = [];
  }

  clone() {
    let clone = new Player(this.id);
    clone.brain = this.brain.clone();
    return clone;
  }

  crossover(parent: Player) {
    let child = new Player();
    if (parent.fitness < this.fitness) {
      child.brain = this.brain.crossover(parent.brain);
      child.id = this.id;
    } else {
      child.brain = parent.brain.crossover(this.brain);
      child.id = parent.id;
    }
    child.brain.mutate();
    return child;
  }

  // Make general purpose?
  look(yVel: number, distToPipe: number, heightBelowPipe: number) {
    this.vision = [yVel, distToPipe, heightBelowPipe];
  }

  think() {
    this.decisions = this.brain.feedForward(this.vision);
  }

  move() {
    // Check possible decisions
    let maxIdx = 0;
    for (let i = 0; i < this.decisions.length; i++) {
      if (this.decisions[i] > this.decisions[maxIdx]) {
        maxIdx = i;
      }
    }
    return this.decisions[maxIdx] >= 0 ? 1 : 0;
  }

  update(lastPassedPipe: number) {
    if (lastPassedPipe !== -1) {
      this.score += 1;
    }
  }

  calculateFitness() {
    this.fitness = this.score * this.score + this.lifespan / 10;
    this.fitness /= this.brain.calculateWeight();
  }

  show() {}
}

export default Player;
