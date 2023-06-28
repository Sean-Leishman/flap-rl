class GameState {
  reset;

  constructor() {
    this.reset = false;
  }

  resetGame() {
    this.reset = true;
  }
}

export { GameState };
