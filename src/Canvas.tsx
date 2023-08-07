import { useEffect, useRef } from "react";
import { config } from "./Phaser";

import "phaser";

function Canvas() {
  const sceneGeneratedRef = useRef(false);
  useEffect(() => {
    if (sceneGeneratedRef.current) return;

    async function initPhaser() {
      const scenes = await import("./game/scenes");

      new Phaser.Game({
        ...config,
        parent: "phaser-container",
        scene: [scenes.Game],
      });
    }
    sceneGeneratedRef.current = true;
    initPhaser();
  }, []);

  return <div id="phaser-container" className="Canvas"></div>;
}

export default Canvas;
