import Phaser from "phaser";

import { Game } from "./game/scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: [Game],
  backgroundColor: "#FFEECC",
  width: 800,
  height: 500,
  scale: {
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
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
