class GameState {
  reset;

  constructor() {
    this.reset = false;
  }

  resetGame(val: boolean = true) {
    this.reset = val;
  }
}

export { GameState };
