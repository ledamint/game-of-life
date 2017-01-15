import View from '../view/View';
import Model from '../model/GameScreen';

export default class Controller {
  constructor(numberOfRows) {
    this.view = new View(numberOfRows);
    this.model = new Model();

    this.playTimerId = 0;
  }

  setUpGame() {
    this.setBeginGame();

    this.view.on('changeRows', this.setBeginGame);
    this.view.on('playOrPause', this.toggleGameActive);
    this.view.on('clearCells', this.setBeginGame);
    this.view.on('setModelCellAlive', modelCell => modelCell.setAlive());
    this.view.on('setModelCellDead', modelCell => modelCell.setDead());
  }

  setBeginGame = () => {
    if (this.model.gameIsActive) {
      this.pauseGame();
    }

    this.transmitNumOfRowsInputValueToModel();
    this.view.changeNumberOfRowsInputValue(this.model.numOfRows);
    this.drawInitialCells();

    return this;
  }

  toggleGameActive = () => {
    if (this.model.gameIsActive) this.pauseGame();
    else this.startGame();

    return this;
  }

  startGame() {
    clearInterval(this.playTimerId);

    this.model.setGameActive(true);
    this.drawNextStepCells();
    this.view.changePlayButton(this.model.gameIsActive);

    this.playTimerId = setInterval(() => {
      this.drawNextStepCells();
    }, this.model.delay);

    return this;
  }

  pauseGame() {
    clearInterval(this.playTimerId);

    this.model.setGameActive(false);
    this.view.changePlayButton(this.model.gameIsActive);

    return this;
  }

  drawInitialCells() {
    this.model.setInitialCells();
    this.view.draw(this.model.cells);

    return this;
  }

  drawNextStepCells() {
    this.model.setNextStepCells();
    this.view.draw(this.model.cells);

    return this;
  }

  transmitNumOfRowsInputValueToModel() {
    const numOfRows = this.view.getNumberOfRowsInputValue();
    this.model.setNumOfRows(numOfRows);

    return this;
  }
}
