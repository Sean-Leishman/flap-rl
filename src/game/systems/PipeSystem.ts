import { defineQuery, World, defineSystem } from "bitecs";
import {
  Sprite,
  Position,
  Velocity,
  Pipe,
  LastPipe,
  RecentPipe,
} from "../constants";
import { removeComponent } from "bitecs";
import { removeEntity } from "bitecs";
import { addComponent } from "bitecs";
import { GameState } from "../scenes/GameState";

export const createPipeSystem = (
  generatePipes: Function,
  pipe_speed: number
) => {
  const pipeQuery = defineQuery([Position, Velocity, Pipe, Sprite]);
  const lastPipeQuery = defineQuery([Position, Velocity, LastPipe, Sprite]);
  const recentPipeQuery = defineQuery([Position, Velocity, RecentPipe, Sprite]);

  let state_pipe_speed = pipe_speed;

  return defineSystem(
    (world: World, gameState: GameState, pipe_speed: number) => {
      const entities = pipeQuery(world);
      const leavingPipes = lastPipeQuery(world);

      let lastPipeX = 1000000;
      let newLastPipe;

      if (gameState.reset) {
        for (let i = 0; i < entities.length; i++) {
          const id = entities[i];
          removeEntity(world, id);
        }
        return world;
      }

      for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        if (state_pipe_speed != pipe_speed) {
          Velocity.x[id] = pipe_speed;
        }

        Position.x[id] += Velocity.x[id];
        if (
          Position.x[id] < lastPipeX &&
          Position.x[id] > Position.x[leavingPipes[0]]
        ) {
          lastPipeX = Position.x[id];
          newLastPipe = id;
        }
      }

      for (let i = 0; i < leavingPipes.length; i++) {
        const id = leavingPipes[i];
        if (Position.x[id] < 0) {
          removeComponent(world, Sprite, id);
          removeComponent(world, LastPipe, id);
          addComponent(world, LastPipe, newLastPipe);
          newLastPipe++;
        }
      }

      const recentPipes = recentPipeQuery(world);
      let spawnPipes = false;
      for (let i = 0; i < recentPipes.length; i++) {
        const id = recentPipes[i];
        if (Position.x[id] < 300) {
          // Spawn new pipes
          removeComponent(world, RecentPipe, id);
          spawnPipes = true;
        }
      }
      if (spawnPipes) {
        generatePipes(world);
      }

      state_pipe_speed = pipe_speed;

      return world;
    }
  );
};
