import { defineSystem, World } from "bitecs";
import Population from "../neat/Population";
import { Scene } from "phaser";
import Genome from "../neat/Genome";

const map = (value: number, x1: number, y1: number, x2: number, y2: number) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export const createDrawingSystem = (
  scene: Scene,
  graphics: Phaser.GameObjects.Graphics,
  drawingConfig: any
) => {
  const config = drawingConfig;
  let genome: Genome;

  return defineSystem((population: Population) => {
    if (!population.bestPlayer) return;
    if (population.bestPlayer.brain === genome) return;

    console.log("draw");

    genome = population.bestPlayer.brain;

    let layerDistance = 200;
    let circleDistance = 50;

    let y = circleDistance;

    let allnodes = [];
    let nodesPositions: any[] = [];
    let nodesIdx: any[] = [];

    console.log(genome.nodes);

    for (let i = 0; i < genome.layers; i++) {
      let x = config.x + (i + 1) * layerDistance;
      for (let j = 0; j < genome.nodes.length; j++) {
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(x, y, 20);
        nodesPositions.push({ x, y });
        nodesIdx.push(genome.nodes[j].id);
        y += 50;
      }
      y = circleDistance;
    }

    for (let i = 0; i < genome.connections.length; i++) {
      if (genome.connections[i].enabled) {
        graphics.lineStyle(1, 0xffffff);
      } else {
        graphics.lineStyle(0.5, 0x0f0f0f);
      }

      let from =
        nodesPositions[nodesIdx.indexOf(genome.connections[i].fromNode.id)];
      let to =
        nodesPositions[nodesIdx.indexOf(genome.connections[i].toNode.id)];

      graphics.lineStyle(
        map(Math.abs(genome.connections[i].weight), 0, 1, 0, 3),
        0xffffff
      );

      console.log(from, to);
      console.log(genome.connections[i].weight);
      let weight = genome.connections[i].weight.toFixed(2).toString();
      if (from && to) {
        graphics.beginPath();
        graphics.moveTo(from.x, from.y);
        graphics.lineTo(to.x, to.y);
        graphics.closePath();
        graphics.strokePath();

        let midx = Math.floor((from.x + to.x) / 2);
        let midy = Math.floor((from.y + to.y) / 2);
        scene.add.text(midx, midy, weight);
      }
    }
  });
};
