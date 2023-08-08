class GameState {
  reset: boolean;
  pause: boolean;

  constructor() {
    this.reset = false;
    this.pause = false;
  }

  resetGame(val: boolean = true) {
    this.reset = val;
  }

  pausePlayGame(val: boolean) {
    this.pause = val;
  }
}

export { GameState };
