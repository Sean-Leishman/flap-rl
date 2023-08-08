import { useEffect, useRef } from "react";
import { config } from "./Phaser";

import "phaser";

function Canvas() {
  const sceneGeneratedRef = useRef(false);
  useEffect(() => {
    if (sceneGeneratedRef.current) return;

    function initPhaser() {
      return import("./game/scenes").then((scenes) => {
        new Phaser.Game({
          ...config,
          parent: "phaser-container",
          scene: [scenes.Game],
        });
      });
    }
    sceneGeneratedRef.current = true;
    initPhaser().then((_) => {
      const canvas = document.querySelector("#phaser-container canvas");
      console.log(canvas);

      canvas?.addEventListener("wheel", (e: Event) => {
        e.preventDefault();

        window.scrollBy({
          top: (e as WheelEvent).deltaY,
          left: 0,
        });
      });
    });
  }, []);

  return <div id="phaser-container" className="Canvas"></div>;
}

export default Canvas;
