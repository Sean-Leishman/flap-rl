import Phaser from "phaser";

class Bootstrap extends Phaser.Scene {
  constructor() {
    super("bootstrap");
  }

  init() {}

  preload() {}

  create() {
    this.createNewGame();
  }

  update() {}

  private createNewGame() {
    this.scene.launch("game");
  }
}

export { Bootstrap };
