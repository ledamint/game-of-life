import EventEmitter from 'events';
import pug from '../main.pug';
import style from '../style.styl';

class View extends EventEmitter {
  constructor(numberOfRows) {
    super();

    document.body.innerHTML = pug({ numberOfRows });

    this.gameBoard = document.querySelector('.window__game');
    this.numberOfRowsInput = document.querySelector('.window__input');
    this.playButton = document.querySelector('.window__button_play');
    this.clearButton = document.querySelector('.window__button_clear');

    this.setInitialHandlers();
  }

  draw(cells) {
    this.removeElemCells();

    cells.forEach((row) => {
      const elemRow = View.createElemRow();
      this.gameBoard.appendChild(elemRow);

      row.forEach((modelCell) => {
        const elemCell = View.createElemCell();
        elemCell.onclick = () => this.toogleCell(modelCell, elemCell);

        if (modelCell.isAlive) this.makeAlive(modelCell, elemCell);
        else this.makeDead(modelCell, elemCell);

        elemRow.appendChild(elemCell);
      });
    });

    return this;
  }

  getNumberOfRowsInputValue() {
    return Number(this.numberOfRowsInput.value);
  }

  changePlayButton(isGameActive) {
    if (isGameActive) this.playButton.textContent = 'Pause';
    else this.playButton.textContent = 'Play';

    return this;
  }

  changeNumberOfRowsInputValue(value) {
    this.numberOfRowsInput.value = value;

    return this;
  }

  removeElemCells() {
    while (this.gameBoard.children.length) {
      this.gameBoard.removeChild(this.gameBoard.children[0]);
    }

    return this;
  }

  toogleCell(modelCell, elemCell) {
    if (modelCell.isAlive) this.makeDead(modelCell, elemCell);
    else this.makeAlive(modelCell, elemCell);

    return this;
  }

  makeAlive(modelCell, elemCell) {
    this.emit('setModelCellAlive', modelCell);
    elemCell.classList.add('window__cell_enable');

    return this;
  }

  makeDead(modelCell, elemCell) {
    this.emit('setModelCellDead', modelCell);
    elemCell.classList.remove('window__cell_enable');

    return this;
  }

  setInitialHandlers() {
    this.numberOfRowsInput.onblur = () => this.emit('changeRows');
    this.playButton.onclick = () => this.emit('playOrPause');
    this.clearButton.onclick = () => this.emit('clearCells');

    return this;
  }

  static createElemRow() {
    const elemRow = document.createElement('div');
    elemRow.classList.add('window__row');

    return elemRow;
  }

  static createElemCell() {
    const elemCell = document.createElement('div');
    elemCell.classList.add('window__cell');

    return elemCell;
  }
}

export default View;
