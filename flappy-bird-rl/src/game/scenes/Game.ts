import Phaser from "phaser";
import {
  createWorld,
  addEntity,
  Types,
  addComponent,
  defineComponent,
  IWorld,
  World,
} from "bitecs";

import {
  Vector2,
  Position,
  Rotation,
  Velocity,
  Sprite,
  Player,
  Pipe,
  RecentPipe,
  LastPipe,
} from "../constants";
import {
  createSpriteSystem,
  createPipeSystem,
  createBirdSystem,
} from "../systems";
import { System } from "bitecs";

import bird1 from "../../assets/bird1.png";
import bird2 from "../../assets/bird2.png";
import bird3 from "../../assets/bird3.png";
import pipe from "../../assets/pipe.png";
import dpipe from "../../assets/dpipe.png";
import base from "../../assets/base.png";
import bg from "../../assets/bg.png";

enum Textures {
  BirdUp = 0,
  BirdDown = 1,
  BirdNormal = 2,
  UpPipe = 3,
  DownPipe = 4,
  Ground = 5,
  Bg = 6,
}

const TextureKeys = [bird1, bird2, bird3, pipe, dpipe, base, bg];

const generatePipes = (world: World) => {
  const upipe = addEntity(world);
  const dpipe = addEntity(world);

  addComponent(world, Position, upipe);
  addComponent(world, Velocity, upipe);
  addComponent(world, Position, dpipe);
  addComponent(world, Velocity, dpipe);

  Sprite.texture[upipe] = Textures.UpPipe;
  Sprite.texture[dpipe] = Textures.DownPipe;

  addComponent(world, Sprite, upipe);
  addComponent(world, Sprite, dpipe);
  addComponent(world, Pipe, upipe);
  addComponent(world, Pipe, dpipe);
  addComponent(world, RecentPipe, upipe);
  addComponent(world, RecentPipe, dpipe);

  Position.x[upipe] = 500;
  Position.y[upipe] = 500;
  Position.x[dpipe] = 500;
  Position.y[dpipe] = 0;

  Velocity.x[upipe] = -2;
  Velocity.x[dpipe] = -2;

  return { upipe, dpipe };
};

const addPipes = (world: World) => {
  const pipes = generatePipes(world);
  addComponent(world, LastPipe, pipes.upipe);
  addComponent(world, LastPipe, pipes.dpipe);
};

class Game extends Phaser.Scene {
  private world?: IWorld;
  private spriteSystem?: System;
  private pipeSystem?: System;
  private birdSystem?: System;
  private kb!: Phaser.Types.Input.Keyboard;

  constructor() {
    super("game");
  }

  init() {
    this.kb = this.input.keyboard?.createCursorKeys();
  }

  preload() {
    for (let i = 0; i < TextureKeys.length; i++) {
      this.load.image(i.toString(), TextureKeys[i]);
    }
  }

  create() {
    const { width, height } = this.scale;
    this.world = createWorld();

    const bird = addEntity(this.world);

    addComponent(this.world, Position, bird);
    addComponent(this.world, Rotation, bird);
    addComponent(this.world, Velocity, bird);
    Position.x[bird] = 200;
    Position.y[bird] = 200;
    Sprite.texture[bird] = Textures.BirdUp;
    addComponent(this.world, Sprite, bird);
    addComponent(this.world, Player, bird);

    addPipes(this.world);

    this.spriteSystem = createSpriteSystem(this, TextureKeys);
    this.pipeSystem = createPipeSystem(this, generatePipes);
    this.birdSystem = createBirdSystem(this, this.kb);
  }

  update() {
    if (!this.world) return;
    this.spriteSystem?.(this.world);
    this.pipeSystem?.(this.world);
    this.birdSystem?.(this.world);
  }
}

export { Game };
