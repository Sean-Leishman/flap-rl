import "./ControlGame.css";

import { createSlice, configureStore } from "@reduxjs/toolkit";
import { useState } from "react";

import Slider from "@mui/material/Slider";
import { pipe } from "bitecs";

const playSlice = createSlice({
  name: "play",
  initialState: {
    value: false,
    generation: 0,
    score: 0,
    number_alive: 200,
    pipe_speed: -2,
    bird_gravity: 0.2,
    bird_jump_speed: 4,
  },
  reducers: {
    setTrue: (state) => {
      state.value = true;
    },
    setFalse: (state) => {
      state.value = false;
    },
    incrementGeneration: (state) => {
      state.generation += 1;
    },
    incrementScore: (state) => {
      state.score += 1;
    },
    decrementAlive: (state) => {
      state.number_alive -= 1;
    },
    resetStats: (state, action) => {
      state.score = 0;
      state.number_alive = action.payload.num_alive;
    },
    setPipeSpeed: (state, action) => {
      state.pipe_speed = action.payload;
    },
    setBirdGravity: (state, action) => {
      state.bird_gravity = action.payload;
    },
    setBirdJumpSpeed: (state, action) => {
      state.bird_jump_speed = action.payload;
    },
  },
});

export const { setTrue, setFalse } = playSlice.actions;

export const store = configureStore({
  reducer: playSlice.reducer,
});

function ControlGame() {
  const [play_btn, set_play_btn] = useState("Play");
  const [generation, set_generation] = useState(0);
  const [score, set_score] = useState(0);
  const [num_alive, set_num_alive] = useState(200);

  let pipe_speed = -2;
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

  function handlePipeSpeedSlider(event, value) {
    if (value == pipe_speed) {
      return;
    }
    pipe_speed = value;
    store.dispatch({ type: "play/setPipeSpeed", payload: value * -2 });
  }

  function handleBirdSpeedSlider(event, value) {
    if (value == bird_gravity) {
      return;
    }
    bird_gravity = value;
    store.dispatch({ type: "play/setBirdGravity", payload: value });
  }

  function handleBirdJumpSpeed(event, value) {
    if (value == bird_jump_speed) {
      return;
    }
    bird_jump_speed = value;
    store.dispatch({ type: "play/setBirdJumpSpeed", payload: value });
  }

  store.subscribe(() => {
    set_generation(store.getState().generation);
    set_score(store.getState().score);
    set_num_alive(store.getState().number_alive);
  });

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
              valueLabelDisplay={"on"}
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
              valueLabelDisplay={"on"}
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
              valueLabelDisplay={"on"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlGame;
