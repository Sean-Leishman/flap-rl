import { defineQuery, enterQuery, exitQuery, World } from "bitecs";
import { Scene, GameObjects } from "phaser";
import {
  Sprite,
  Position,
  Rotation,
  Velocity,
  Player,
  Pipe,
  Static,
} from "../constants";
import { defineSystem } from "bitecs";
import { removeEntity } from "bitecs";

export const createSpriteSystem = (
  group: Phaser.Physics.Arcade.Group,
  textures: string[]
) => {
  const spriteId = new Map<number, GameObjects.Sprite>();
  const spriteQuery = defineQuery([Sprite, Player, Position, Rotation]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const spriteQueryExit = exitQuery(spriteQuery);

  return defineSystem((world: World) => {
    const enterEntities = spriteQueryEnter(world);
    for (let i = 0; i < enterEntities.length; i++) {
      const id = enterEntities[i];
      const textId = Sprite.texture[id];
      const texture = textures[textId];
      //const sprite = scene.physics.add.sprite(0, 0, textId);
      const sprite = group.get(Position.x[id], Position.y[id], textId);
      sprite.body.debugShowBody = false;
      sprite.scale = 1.5;
      spriteId.set(id, sprite);

      // Alive
      sprite.setData("id", id);
      Player.dead[id] = false;
    }
    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      const sprite = spriteId.get(id);
      if (!sprite) continue;
      sprite.x = Position.x[id];
      sprite.y = Position.y[id];
      sprite.angle = Rotation.angle[id];
      if (Player.dead[id]) {
        sprite.visible = false;
      } else {
        sprite.visible = true;
      }
    }
    const exitEntities = spriteQueryExit(world);
    for (let i = 0; i < exitEntities.length; i++) {
      const id = exitEntities[i];
      const sprite = spriteId.get(id);
      if (!sprite) continue;
      group.killAndHide(sprite);
      spriteId.delete(id);
      removeEntity(world, id);
    }
    return world;
  });
};
