import { defineQuery, World, defineSystem } from "bitecs";
import {
  Sprite,
  Position,
  Velocity,
  Player,
  Pipe,
  Vision,
  Acceleration,
} from "../constants";
import { GameState } from "../scenes/GameState";
import Population from "../neat/Population";

import { store } from "../../ui/ControlGame";
import { pipe } from "bitecs";

// TODO  Check for collisions here
export const createBirdSystem = (
  kb: Phaser.Types.Input.Keyboard.CursorKeys,
  bird_gravity: number,
  bird_jump_speed: number
) => {
  const birdQuery = defineQuery([Position, Velocity, Player, Sprite]);
  const pipeQuery = defineQuery([Position, Velocity, Pipe, Sprite]);
  let itr = 1;
  let state_bird_gravity = bird_gravity;
  let state_bird_jump_speed = bird_jump_speed;

  return defineSystem(
    (
      world: World,
      gameState: GameState,
      population: Population,
      bird_gravity: number,
      bird_jump_speed: number
    ) => {
      const entities = birdQuery(world);
      const pipes = pipeQuery(world);
      let pipeId;

      if (state_bird_gravity != bird_gravity) {
        state_bird_gravity = bird_gravity;
      }
      if (state_bird_gravity != bird_jump_speed) {
        state_bird_jump_speed = bird_jump_speed;
      }

      // Get the pipe closest to the bird in x-direction
      // that is to the right of the bird
      let minimum_pipe_x = 10000000;
      for (let j = 0; j < pipes.length; j++) {
        if (Pipe.type[pipes[j]] === 0) {
          let x_pipe_pos = Position.x[pipes[j]];
          if (x_pipe_pos > Position.x[entities[0]] - 50) {
            if (minimum_pipe_x > x_pipe_pos) {
              minimum_pipe_x = x_pipe_pos;
              pipeId = pipes[j];
            }
          }
        }
      }

      let done = true;
      let getMove = true;
      if (itr % 1 === 0) {
        done = true;
        getMove = true;
      }

      let dispatched = false;
      let pipe_passed = -1;

      // Choose to jump at intervals
      for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        const player = population.getPlayer(i);

        if (player == null) return;

        if (getMove) {
          if (Player.alive[id]) {
            if (kb.up.isDown || Player.input[id]) {
              Velocity.y[id] = state_bird_jump_speed;
            }
            Vision.yVel[id] = Velocity.y[id];
            Vision.distanceToClosestPipe[id] =
              Position.x[pipeId] - Position.x[id];
            // Check if pipe is consistent from line 38 pipeId = pipes[0]
            Vision.heightBelowTopPipe[id] =
              Position.y[id] - (Position.y[pipeId] + 235 + 100); // + offset to middle of gap
            if (
              Position.x[pipeId] - 30 < Position.x[id] &&
              Vision.lastPassedPipe[id] !== pipeId &&
              Vision.hasPassed !== 1
            ) {
              Vision.lastPassedPipe[id] = pipeId;
              Vision.hasPassed = 0;

              if (pipe_passed != pipeId && !dispatched) {
                store.dispatch({ type: "play/incrementScore" });
                dispatched = true;
                pipe_passed = pipeId;
              }
            }
            // else {
            //   Vision.lastPassedPipe[id] = -1;
            // }

            player.look(
              Vision.yVel[id],
              Vision.distanceToClosestPipe[id],
              Vision.heightBelowTopPipe[id],
              Position.y[id]
            );
            player.think();
            Player.input[id] = player.move();
            player.update(Vision.lastPassedPipe[id]);

            done = false;
            if (Position.y[id] < 450) {
              Velocity.y[id] -= state_bird_gravity;
              Position.y[id] -= Velocity.y[id];
            }
          } else {
            //player.update(true);
            //gameState.resetGame(); Vision
          }
        }
      }
      dispatched = false;

      if (getMove) {
        getMove = false;
        itr = 0;
      }

      itr++;

      if (done) {
        itr = 1;
        population.naturalSelection();
        for (let i = 0; i < entities.length; i++) {
          const id = entities[i];
          population.population[i].id = id;

          //removeEntity(world, id);
          Position.y[id] = 200;
          Velocity.y[id] = 0;
          Player.alive[id] = true;

          Vision.timeAlive[id] = 0;
        }
        gameState.resetGame();
      }

      return world;
    }
  );
};
