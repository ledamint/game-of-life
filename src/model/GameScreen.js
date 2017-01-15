import Cell from './Cell';

export default class Model {
  constructor() {
    this.numOfRows = 0;
    this.maxRows = 40;
    this.cells = [];
    this.gameIsActive = false;
    this.delay = 500;
  }

  setInitialCells() {
    const cells = [];
    const length = this.numOfRows;

    for (let i = 0; i < length; i += 1) {
      const cellsRow = [];

      for (let j = 0; j < length; j += 1) {
        const cell = new Cell();
        cellsRow.push(cell);
      }
      cells.push(cellsRow);
    }

    this.cells = cells;

    return this;
  }

  setNextStepCells() {
    const newCells = this.cells.map((row, i) => row.map((cell, j) => {
      const newCell = new Cell();
      newCell.isAlive = cell.isAlive;

      const aliveNeighbors = this.getAliveNeighbors(i, j);

      if (cell.isAlive) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) newCell.setDead();
      } else if (aliveNeighbors === 3) newCell.setAlive();

      return newCell;
    }));

    this.cells = newCells;

    return this;
  }

  getAliveNeighbors(i, j) {
    const neighbors = this.getNeighbors(i, j);

    const aliveNeighbors = neighbors.reduce((numOfAliveCells, neighbor) => {
      if (neighbor.isAlive) return (numOfAliveCells += 1);
      return numOfAliveCells;
    }, 0);

    return aliveNeighbors;
  }

  getNeighbors(i, j) {
    // i - y coord of cell in the cells, j - x coord of cell in the cells
    const coordOfNeighbors = [
      { x: j - 1, y: i - 1 },
      { x: j,     y: i - 1 },
      { x: j + 1, y: i - 1 },
      { x: j - 1, y: i },
      { x: j + 1, y: i },
      { x: j - 1, y: i + 1 },
      { x: j,     y: i + 1 },
      { x: j + 1, y: i + 1 },
    ];
    const neighbors = [];

    coordOfNeighbors.forEach((coordOfNeighbor) => {
      const x = coordOfNeighbor.x;
      const y = coordOfNeighbor.y;
      const lastRow = this.numOfRows - 1;

      if (x >= 0 && y >= 0) {
        if (x <= lastRow && y <= lastRow) {
          neighbors.push(this.cells[y][x]);
        }
      }
    });

    return neighbors;
  }

  setGameActive(isGameActive) {
    this.gameIsActive = isGameActive;

    return this;
  }

  setNumOfRows(numOfRows) {
    if (numOfRows >= this.maxRows) this.numOfRows = this.maxRows;
    else this.numOfRows = numOfRows;
  }
}
