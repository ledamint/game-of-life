export default class Cell {
  constructor() {
    this.isAlive = false;
  }

  setAlive() {
    this.isAlive = true;
  }

  setDead() {
    this.isAlive = false;
  }
}
