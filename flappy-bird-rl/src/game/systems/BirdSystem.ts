import {
  defineQuery,
  enterQuery,
  exitQuery,
  World,
  defineSystem,
} from "bitecs";
import { Scene, GameObjects } from "phaser";
import {
  Sprite,
  Position,
  Rotation,
  Velocity,
  Player,
  Pipe,
  LastPipe,
  RecentPipe,
  Vision,
} from "../constants";
import { removeComponent } from "bitecs";
import { removeEntity } from "bitecs";
import { addComponent } from "bitecs";
import { GameState } from "../scenes/GameState";
import Population from "../neat/Population";

export const createBirdSystem = (
  group: Phaser.Physics.Arcade.Group,
  kb: Phaser.Types.Input.Keyboard.CursorKeys
) => {
  const birdQuery = defineQuery([Position, Velocity, Player, Sprite]);
  const lastPipeQuery = defineQuery([Position, Velocity, LastPipe, Sprite]);

  return defineSystem(
    (world: World, gameState: GameState, population: Population) => {
      const entities = birdQuery(world);
      const pipes = lastPipeQuery(world);

      const pipeId = pipes[0];
      let done = true;

      for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        const player = population.getPlayer(i);

        if (player == null) return;

        if (!Player.dead[id]) {
          if (kb.up.isDown || Player.input[id]) {
            Velocity.y[id] = 4;
          }
          Vision.yVel[id] = Velocity.y[id];
          Vision.distanceToClosestPipe[id] =
            Position.x[pipeId] - Position.x[id];
          // Check if pipe is consistent from line 38 pipeId = pipes[0]
          Vision.heightBelowTopPipe[id] = Position.y[pipeId] - Position.y[id];

          player.look(
            Vision.yVel[id],
            Vision.distanceToClosestPipe[id],
            Vision.heightBelowTopPipe[id]
          );
          player.think();
          Player.input[id] = player.move();
          //player.update();

          done = false;
        } else {
          //gameState.resetGame(); Vision
        }
        if (Position.y[id] < 450) {
          Velocity.y[id] -= 0.2;
          Position.y[id] -= Velocity.y[id];
        }
      }

      if (done) {
        population.naturalSelection();
        gameState.resetGame();
      }

      if (gameState.reset) {
        for (let i = 0; i < entities.length; i++) {
          const id = entities[i];
          removeEntity(world, id);
        }
      }

      return world;
    }
  );
};
