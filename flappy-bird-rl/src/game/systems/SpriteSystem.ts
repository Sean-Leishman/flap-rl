import { defineQuery, enterQuery, exitQuery, World } from "bitecs";
import { Scene, GameObjects } from "phaser";
import {
  Sprite,
  Position,
  Rotation,
  Velocity,
  Player,
  Pipe,
} from "../constants";
import { defineSystem } from "bitecs";
import { removeEntity } from "bitecs";

export const createSpriteSystem = (scene: Scene, textures: string[]) => {
  const spriteId = new Map<number, GameObjects.Sprite>();
  const spriteQuery = defineQuery([Sprite, Position]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const spriteQueryExit = exitQuery(spriteQuery);

  return defineSystem((world: World) => {
    const enterEntities = spriteQueryEnter(world);
    for (let i = 0; i < enterEntities.length; i++) {
      const id = enterEntities[i];
      const textId = Sprite.texture[id];
      const texture = textures[textId];
      spriteId.set(id, scene.add.sprite(0, 0, textId));
    }
    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      const sprite = spriteId.get(id);
      if (!sprite) continue;
      sprite.x = Position.x[id];
      sprite.y = Position.y[id];
      //sprite.angle = Rotation.angle[id];
    }
    const exitEntities = spriteQueryExit(world);
    for (let i = 0; i < exitEntities.length; i++) {
      const id = exitEntities[i];
      const sprite = spriteId.get(id);
      if (!sprite) continue;
      sprite.destroy();
      spriteId.delete(id);
      removeEntity(world, id);
    }
    return world;
  });
};
