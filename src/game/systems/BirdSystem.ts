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

// TODO  Check for collisions here
export const createBirdSystem = (
  group: Phaser.Physics.Arcade.Group,
  kb: Phaser.Types.Input.Keyboard.CursorKeys
) => {
  const birdQuery = defineQuery([Position, Velocity, Player, Sprite]);
  const lastPipeQuery = defineQuery([Position, Velocity, LastPipe, Sprite]);
  let itr = 1;

  return defineSystem(
    (world: World, gameState: GameState, population: Population) => {
      const entities = birdQuery(world);
      const pipes = lastPipeQuery(world);
      let pipeId;

      // Get the pipe closest to the bird in x-direction
      // that is to the right of the bird
      let minimum_pipe_x = 10000000;
      for (let j = 0; j < pipes.length; j++) {
        if (Pipe.type[pipes[j]] === 0) {
          let x_pipe_pos = Position.x[pipes[j]];
          if (x_pipe_pos > Position.x[entities[0]] - 30) {
            if (minimum_pipe_x > x_pipe_pos) {
              minimum_pipe_x = x_pipe_pos;
              pipeId = j;
            }
          }
        }
      }

      let check_pipe_collision = false;
      if (Math.abs(minimum_pipe_x - Position.x[entities[0]]) < 80) {
        console.log("checking collision");
        check_pipe_collision = true;
      }

      let done = false;
      let getMove = false;
      if (itr % 1 === 0) {
        done = true;
        getMove = true;
      }

      // Choose to jump at intervals
      for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        const player = population.getPlayer(i);

        if (player == null) return;

        if (check_pipe_collision) {
          if (!Player.dead[id]) {
          }
        }

        if (getMove) {
          if (!Player.dead[id]) {
            Player.alive[id] = true;
            if (kb.up.isDown || Player.input[id]) {
              Velocity.y[id] = 4;
            }
            Vision.yVel[id] = Velocity.y[id];
            Vision.distanceToClosestPipe[id] =
              Position.x[pipeId] - Position.x[id];
            // Check if pipe is consistent from line 38 pipeId = pipes[0]
            Vision.heightBelowTopPipe[id] =
              Position.y[id] - (Position.y[pipeId] + 235);
            if (
              Position.x[pipeId] - 30 < Position.x[id] &&
              Vision.lastPassedPipe[id] !== pipeId &&
              Vision.hasPassed !== 1
            ) {
              Vision.lastPassedPipe[id] = pipeId;
              Vision.hasPassed = 0;
            } else {
              Vision.lastPassedPipe[id] = -1;
            }

            player.look(
              Vision.yVel[id],
              Vision.distanceToClosestPipe[id],
              Vision.heightBelowTopPipe[id]
            );
            player.think();
            Player.input[id] = player.move();
            player.update(Vision.lastPassedPipe[id]);

            done = false;
            if (Position.y[id] < 450) {
              Velocity.y[id] -= 0.2;
              Position.y[id] -= Velocity.y[id];
            }
          } else {
            //player.update(true);
            //gameState.resetGame(); Vision
          }
        }
      }

      if (getMove) {
        getMove = false;
        itr = 0;
      }

      itr++;

      if (done) {
        console.log("all dead");
        itr = 1;
        population.naturalSelection();
        for (let i = 0; i < entities.length; i++) {
          const id = entities[i];
          population.population[i].id = id;

          //removeEntity(world, id);
          Position.y[id] = 200;
          Velocity.y[id] = 0;
          Player.dead[id] = false;
          Player.alive[id] = true;
        }
        gameState.resetGame();
      }

      return world;
    }
  );
};
