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
  group: Phaser.Physics.Arcade.Group,
  kb: Phaser.Types.Input.Keyboard.CursorKeys
) => {
  const birdQuery = defineQuery([Position, Velocity, Player, Sprite]);

  return defineSystem((world: World, gameState: GameState) => {
    const entities = birdQuery(world);

    if (gameState.reset) {
      for (let i = 0; i < entities.length; i++) {
        const id = entities[i];
        removeEntity(world, id);
      }
      return world;
    }

    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      if (!Player.dead[id]) {
        if (kb.up.isDown) {
          Velocity.y[id] = 4;
        }
      } else {
        //gameState.resetGame();
      }
      if (Position.y[id] < 450) {
        Velocity.y[id] -= 0.2;
        Position.y[id] -= Velocity.y[id];
      }
    }
  });
};
