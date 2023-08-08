import { defineSystem } from "bitecs";
import Population from "../neat/Population";
import Node from "../neat/Node";
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

  let textEntities: Phaser.GameObjects.Text[] = [];

  return defineSystem((population: Population) => {
    if (!population.bestPlayer) return;
    if (population.bestPlayer.brain === genome) return;

    genome = population.bestPlayer.brain;

    let layerDistance = 150;
    let circleDistance = 50;

    let y = circleDistance;

    let nodesPositions: any[] = [];
    let nodesIdx: any[] = [];

    for (let i = 0; i < genome.layers; i++) {
      let x = config.x + (i + 1) * layerDistance;
      for (let j = 0; j < genome.nodes.length; j++) {
        if (genome.nodes[j].layer == i) {
          graphics.fillStyle(0x000000);
          graphics.fillCircle(x, y, 20);
          nodesPositions.push({ x, y });
          nodesIdx.push(genome.nodes[j].id);
          y += 50;
        }
      }
      y = circleDistance;
    }

    for (let i = 0; i < genome.connections.length; i++) {
      if (genome.connections[i].enabled) {
        graphics.lineStyle(1, 0x000000);
      } else {
        graphics.lineStyle(0.5, 0x000000);
      }

      let from =
        nodesPositions[
          nodesIdx.indexOf((genome.connections[i].fromNode as Node).id)
        ];
      let to =
        nodesPositions[
          nodesIdx.indexOf((genome.connections[i].toNode as Node).id)
        ];

      graphics.lineStyle(
        map(Math.abs(genome.connections[i].weight), 0, 1, 0, 3),
        0x000000
      );

      let weight = genome.connections[i].weight.toFixed(2).toString();

      if (from && to) {
        graphics.beginPath();
        graphics.moveTo(from.x, from.y);
        graphics.lineTo(to.x, to.y);
        graphics.closePath();
        graphics.strokePath();

        let midx = Math.floor((from.x + to.x) / 2);
        let midy = Math.floor((from.y + to.y) / 2);

        if (i >= textEntities.length) {
          const text = scene.add.text(midx, midy, weight);
          text.setColor("black");
          textEntities.push(text);
        } else {
          textEntities[i].setText(weight);
        }
      }
    }
  });
};
