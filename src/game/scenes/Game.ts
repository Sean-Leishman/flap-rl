import Phaser, { Physics } from "phaser";
import {
  createWorld,
  addEntity,
  Types,
  addComponent,
  defineComponent,
  IWorld,
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
  Static,
  Vision,
} from "../constants";
import {
  createSpriteSystem,
  createPipeSystem,
  createBirdSystem,
  createStaticSpriteSystem,
  createDrawingSystem,
} from "../systems";
import { System } from "bitecs";

import bird1 from "../../assets/bird1.png";
import bird2 from "../../assets/bird2.png";
import bird3 from "../../assets/bird3.png";
import pipe from "../../assets/pipe.png";
import dpipe from "../../assets/dpipe.png";
import base from "../../assets/base.png";
import bg from "../../assets/bg.png";

import "./GameState";
import { GameState } from "./GameState";
import Population from "../neat/Population";

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
const YCORRANGE = [-150, 70];
const OFFSET = 625;

const generateSpanPipeYCor = () => {
  const n = Math.floor(
    Math.random() * (YCORRANGE[1] - YCORRANGE[0] + 1) + YCORRANGE[0]
  );
  const offset_n = n + OFFSET;
  //const offset_n = 830-;
  return { n, offset_n };
};

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
  addComponent(world, Rotation, upipe);
  addComponent(world, Rotation, dpipe);
  addComponent(world, Pipe, upipe);
  addComponent(world, Pipe, dpipe);
  addComponent(world, RecentPipe, upipe);
  addComponent(world, RecentPipe, dpipe);
  addComponent(world, Static, upipe);
  addComponent(world, Static, dpipe);

  const ypos = generateSpanPipeYCor();

  Position.x[upipe] = 500;
  Position.y[upipe] = ypos.offset_n;
  Position.x[dpipe] = 500;
  Position.y[dpipe] = ypos.n;

  Velocity.x[upipe] = -2;
  Velocity.x[dpipe] = -2;

  Pipe.type[upipe] = 1;
  Pipe.type[dpipe] = 0;

  return { upipe, dpipe };
};

const addPipes = (world: World) => {
  const pipes = generatePipes(world);
  addComponent(world, LastPipe, pipes.upipe);
  addComponent(world, LastPipe, pipes.dpipe);

  return pipes;
};

class Game extends Phaser.Scene {
  private world?: IWorld;
  private spriteSystem?: System;
  private pipeSystem?: System;
  private birdSystem?: System;
  private staticSpriteSystem?: System;
  private drawingSystem?: System;
  private kb!: Phaser.Types.Input.Keyboard.CursorKeys;

  private playerGroup?: Physics.Arcade.Group;
  private boundingGroup?: Physics.Arcade.Group;

  private gfx?: Phaser.GameObjects.Graphics;
  private tfx?: Phaser.GameObjects.Text;

  private gameState?: GameState;

  private population?: Population;
  private populationSize = 200;

  private drawingConfig = {
    x: 300,
    y: 10,
    width: 500,
    height: 200,
  };

  constructor() {
    super("game");
  }

  init() {
    this.kb = this.input.keyboard?.createCursorKeys()!;
    this.gameState = new GameState();
    this.population = new Population(this.populationSize);
  }

  preload() {
    for (let i = 0; i < TextureKeys.length; i++) {
      this.load.image(i.toString(), TextureKeys[i]);
    }
  }

  addBird() {
    const bird = addEntity(this.world);
    addComponent(this.world, Position, bird);
    addComponent(this.world, Rotation, bird);
    addComponent(this.world, Velocity, bird);
    Position.x[bird] = 100;
    Position.y[bird] = Math.floor(Math.random() * 200 + 200);
    Sprite.texture[bird] = Textures.BirdUp;
    addComponent(this.world, Sprite, bird);
    addComponent(this.world, Player, bird);
    addComponent(this.world, Vision, bird);
    return bird;
  }

  reinitialise() {
    const base = addEntity(this.world);
    addComponent(this.world, Position, base);
    addComponent(this.world, Sprite, base);
    addComponent(this.world, Static, base);
    Position.x[base] = 100;
    Position.y[base] = 550;
    Sprite.texture[base] = Textures.Ground;

    const top = addEntity(this.world);
    addComponent(this.world, Position, top);
    addComponent(this.world, Sprite, top);
    addComponent(this.world, Static, top);
    Position.x[top] = 100;
    Position.y[top] = -100;
    Sprite.texture[top] = Textures.Ground;

    const pipes = addPipes(this.world);

    this.playerGroup = this.physics.add.group();
    this.boundingGroup = this.physics.add.group();

    const collider = this.physics.add.collider(
      this.playerGroup,
      this.boundingGroup,
      function (player, brick) {
        const id = player.getData("id");
        if (Player.alive[id]) {
          Player.dead[id] = true;
          player.visible = false;
        }
      }
    );
  }

  create() {
    const { width, height } = this.scale;

    console.log(width, height);
    this.world = createWorld();
    this.world.dead = false;

    for (let i = 0; i < this.populationSize; i++) {
      const bird = this.addBird();
      this.population?.addPlayer(bird);
    }

    this.reinitialise();
    this.gfx = this.add.graphics();

    this.birdSystem = createBirdSystem(this.playerGroup, this.kb);
    this.staticSpriteSystem = createStaticSpriteSystem(
      this.boundingGroup,
      TextureKeys
    );
    this.spriteSystem = createSpriteSystem(this.playerGroup, TextureKeys);
    this.pipeSystem = createPipeSystem(this, generatePipes);
    this.drawingSystem = createDrawingSystem(
      this,
      this.gfx,
      this.drawingConfig
    );
  }

  update() {
    if (!this.world) return;
    this.spriteSystem?.(this.world);
    this.birdSystem?.(this.world, this.gameState, this.population);
    this.pipeSystem?.(this.world, this.gameState);
    this.drawingSystem?.(this.world, this.population);
    this.staticSpriteSystem?.(this.world);
    if (this.gameState && this.gameState.reset) {
      console.log("Reinitialise");
      this.reinitialise();
      this.gameState?.resetGame(false);
    }
  }
}

export { Game };
