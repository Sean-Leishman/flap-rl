import "./ControlGame.css";

import { useState } from "react";
import { StoreState, store } from "../main";
import Slider from "@mui/material/Slider";
import { useSelector } from "react-redux";

function ControlGame() {
  const [play_btn, set_play_btn] = useState("Play");

  let pipe_speed = 1;
  let bird_gravity = 0.2;
  let bird_jump_speed = 4;

  function play_btn_press() {
    if (store.getState().value) {
      store.dispatch({ type: "play/setFalse" });
    } else {
      store.dispatch({ type: "play/setTrue" });
    }

    set_play_btn(store.getState().value ? "Pause" : "Play");
  }

  function handlePipeSpeedSlider(_, value) {
    if (value == pipe_speed) {
      return;
    }
    pipe_speed = value;
    store.dispatch({ type: "play/setPipeSpeed", payload: value * -2 });
  }

  function handleBirdSpeedSlider(_, value) {
    if (value == bird_gravity) {
      return;
    }
    bird_gravity = value;
    store.dispatch({ type: "play/setBirdGravity", payload: value });
  }

  function handleBirdJumpSpeed(_, value) {
    if (value == bird_jump_speed) {
      return;
    }
    bird_jump_speed = value;
    store.dispatch({ type: "play/setBirdJumpSpeed", payload: value });
  }

  const generation = useSelector((state: StoreState) => state.generation);
  const score = useSelector((state: StoreState) => state.score);
  const num_alive = useSelector((state: StoreState) => state.number_alive);

  return (
    <div className="controls-container">
      <div className="controls-row">
        <button onClick={play_btn_press} className="play-btn">
          {play_btn}
        </button>
        <div className="generation-container">
          <span className="score_text">Score: {score}</span>
          <span className="generation-text">Generation: {generation}</span>
          <span className="generation-text">Alive: {num_alive}</span>
        </div>
      </div>
      <div className="slider-container">
        <div className="slider-wrapper">
          <span className="slider-name">Pipe Speed:</span>
          <div className="slider-item">
            <Slider
              size="small"
              defaultValue={1}
              aria-label="Small"
              valueLabelDisplay="auto"
              max={2}
              min={0}
              step={0.05}
              onChangeCommitted={handlePipeSpeedSlider}
              // valueLabelDisplay={"on"}
            />
          </div>
        </div>
        <div className="slider-wrapper">
          <span className="slider-name">Bird Gravity:</span>
          <div className="slider-item">
            <Slider
              size="small"
              defaultValue={0.2}
              aria-label="Small"
              valueLabelDisplay="auto"
              max={0.5}
              min={0}
              step={0.05}
              onChangeCommitted={handleBirdSpeedSlider}
              // valueLabelDisplay={"on"}
            />
          </div>
        </div>
        <div className="slider-wrapper">
          <span className="slider-name">Bird Jump Speed:</span>
          <div className="slider-item">
            <Slider
              size="small"
              defaultValue={4}
              aria-label="Small"
              valueLabelDisplay="auto"
              max={6}
              min={1}
              step={0.5}
              onChangeCommitted={handleBirdJumpSpeed}
              // valueLabelDisplay={"on"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlGame;
