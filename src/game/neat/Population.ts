import Player from "./Player";

class Population {
  population: Player[];
  bestPlayer: Player;
  bestFitness: number;
  matingPool: number[];
  size: number;
  generation: number;

  constructor(size) {
    this.population = [];
    this.bestFitness = 0;
    this.generation = 0;
    this.matingPool = [];
    this.size = size;
    this.bestPlayer = new Player(-1);
  }

  addPlayer(entityId: number) {
    if (this.population.length >= this.size) return;
    this.population.push(new Player(entityId));
    this.population[this.population.length - 1].brain.generateNetwork();
    this.population[this.population.length - 1].brain.mutate();
  }

  getPlayer(entityId: number) {
    return this.population.find((player) => player.id === entityId);
  }

  naturalSelection() {
    this.calculateFitness();

    this.getAverageScore();
    let children: Player[] = [];

    this.fillMatingPool();
    this.population.forEach((_) => {
      let parent1 = this.selectPlayer();
      let parent2 = this.selectPlayer();
      if (parent1.fitness > parent2.fitness) {
        children.push(parent1.crossover(parent2));
      } else {
        children.push(parent2.crossover(parent1));
      }
    });

    this.population.splice(0, this.population.length);
    this.population = children.splice(0);
    this.generation++;
    this.population.forEach((player) => {
      player.brain.generateNetwork();
    });
    this.bestPlayer.lifespan = 0;
    this.bestPlayer.dead = false;
    this.bestPlayer.score = 1;
  }

  calculateFitness() {
    let currentMax = 0;
    this.population.forEach((player) => {
      player.calculateFitness();
      if (player.fitness > this.bestFitness) {
        this.bestFitness = player.fitness;
        this.bestPlayer = player.clone();
        //this.bestPlayer.brain.id = "Best";
        //this.bestPlayer.brain.draw();
      }
      if (player.fitness > currentMax) {
        currentMax = player.fitness;
      }
    });

    this.population.forEach((player) => {
      player.fitness /= currentMax;
    });
  }

  fillMatingPool() {
    this.matingPool.splice(0, this.matingPool.length);
    this.population.forEach((player, idx) => {
      let n = player.fitness * 100;
      for (let i = 0; i < n; i++) {
        this.matingPool.push(idx);
      }
    });
  }

  selectPlayer() {
    let rand = Math.floor(Math.random() * this.matingPool.length);
    return this.population[this.matingPool[rand]];
  }

  getAverageScore() {
    let sum = 0;
    this.population.forEach((player) => {
      sum += player.score;
    });

    return sum / this.population.length;
  }
}

export default Population;
