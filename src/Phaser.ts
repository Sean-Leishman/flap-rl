import Phaser from "phaser";

import { Game } from "./game/scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: [Game],
  backgroundColor: "#282c34",
  scale: {
    //mode: Phaser.Scale.ScaleModes.RESIZE,
    //width: window.innerWidth,
    //height: window.innerHeight,
    mode: Phaser.Scale.ScaleModes.NONE,
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
};
// eslint-disable-next-line import/no-anonymous-default-export
export { config };
