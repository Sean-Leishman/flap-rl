import "./index.css";

import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

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
  } as StoreState,
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
      state.generation += 1;
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

export const store = configureStore({
  reducer: playSlice.reducer,
});

export interface StoreState {
  value: boolean;
  generation: number;
  score: number;
  number_alive: number;
  pipe_speed: number;
  bird_gravity: number;
  bird_jump_speed: number;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
