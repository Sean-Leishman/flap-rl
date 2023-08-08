import "./ControlGame.css";

import { createSlice, configureStore } from "@reduxjs/toolkit";
import { useState } from "react";

const playSlice = createSlice({
  name: "play",
  initialState: {
    value: false,
  },
  reducers: {
    setTrue: (state: { value: boolean }) => {
      state.value = true;
    },
    setFalse: (state) => {
      state.value = false;
    },
  },
});

export const { setTrue, setFalse } = playSlice.actions;

export const store = configureStore({
  reducer: playSlice.reducer,
});

function ControlGame() {
  const [play_btn, set_play_btn] = useState("Play");

  function play_btn_press() {
    if (store.getState().value) {
      store.dispatch({ type: "play/setFalse" });
    } else {
      store.dispatch({ type: "play/setTrue" });
    }

    set_play_btn(store.getState().value ? "Pause" : "Play");
  }

  return (
    <>
      <button onClick={play_btn_press} className="play_btn">
        {play_btn}
      </button>
    </>
  );
}

export default ControlGame;
