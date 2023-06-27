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
} from "../constants";
import { removeComponent } from "bitecs";
import { removeEntity } from "bitecs";
import { addComponent } from "bitecs";

export const createBirdSystem = (
  scene: Scene,
  kb: Phaser.Types.Input.Keyboard.CursorKeys
) => {
  const birdQuery = defineQuery([Position, Velocity, Player]);

  return defineSystem((world: World) => {
    const entities = birdQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      if (kb.up.isDown) {
        Velocity.y[id] = 4;
      }
      if (Position.y[id] < 500) {
        Velocity.y[id] -= 0.2;
        Position.y[id] -= Velocity.y[id];
      }
    }
  });
};
