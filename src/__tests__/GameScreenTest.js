import Model from '../model/GameScreen';
import * as Cell from '../model/Cell';

Cell.default = class TestCell {
  constructor() {
    this.isAlive = false;
  }

  setAlive() {
    this.isAlive = true;
  }

  setDead() {
    this.isAlive = false;
  }
};

describe('Model GameScreen', function () {
  const model = new Model();

  const VertLineCells = [
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
  ];

  const setInitialModel = function initTest() {
    model.cells = VertLineCells;
    model.numOfRows = 3;
    model.maxRows = 5;
    model.gameIsActive = false;
  };

  it('model.numOfRows equals 0', function () {
    assert.strictEqual(model.numOfRows, 0, 'numOfRows doesnt strictEqual 0');
  });

  it('model.maxRows equals 40', function () {
    assert.strictEqual(model.maxRows, 40, 'maxRows doesnt strictEqual 40');
  });

  it('model.cells equals []', function () {
    assert.isArray(model.cells, 'numOfRows doesnt array');
    assert.strictEqual(model.cells.length, 0, 'numOfRows doesnt strictEqual []');
  });

  it('model.gameIsActive equals false', function () {
    assert.strictEqual(model.gameIsActive, false, 'gameIsActive doesnt strictEqual false');
  });

  it('model.delay equals 500', function () {
    assert.strictEqual(model.delay, 500, 'delay doesnt strictEqual 500');
  });

  describe('setInitialCells', function () {
    describe('set initial cells 3x3', function () {
      before(function () {
        setInitialModel();

        model.cells = [];

        model.setInitialCells();
      });

      it('cells is array', () => {
        assert.isArray(model.cells, 'model.cell is not array');
      });

      it('cells has 3 rows', () => {
        assert.strictEqual(model.cells.length, 3, 'model.cell doesnt have 3 rows');
      });

      it('cells has 3 cells in last row', () => {
        assert.strictEqual(model.cells[2].length, 3, 'model.cell doesnt have 3 cells in last row');
      });
    });

    it('return this', () => {
      assert.strictEqual(model.setInitialCells(), model, 'doesnt return this');
    });
  });

  describe('setNextStepCells', function () {
    describe('update vertical line to horizontal', function () {
      before(function () {
        setInitialModel();

        const stubGetAliveNeighbors = sinon.stub(model, 'getAliveNeighbors');

        stubGetAliveNeighbors.onCall(0).returns(2);
        stubGetAliveNeighbors.onCall(1).returns(1);
        stubGetAliveNeighbors.onCall(2).returns(2);
        stubGetAliveNeighbors.onCall(3).returns(3);
        stubGetAliveNeighbors.onCall(4).returns(2);
        stubGetAliveNeighbors.onCall(5).returns(3);
        stubGetAliveNeighbors.onCall(6).returns(2);
        stubGetAliveNeighbors.onCall(7).returns(1);
        stubGetAliveNeighbors.onCall(8).returns(2);

        model.setNextStepCells();

        stubGetAliveNeighbors.restore();
      });

      it('set dead the top cell of the line', function () {
        assert.isFalse(model.cells[0][1].isAlive, 'the update line of three cell doesnt right');
      });

      it('set alive the left cell of the line', function () {
        assert.isTrue(model.cells[1][0].isAlive, 'the update line of three cell doesnt right');
      });

      it('retain alive the center cell of the line', function () {
        assert.isTrue(model.cells[1][1].isAlive, 'the update line of three cell doesnt right');
      });

      it('set alive the right cell of the line', function () {
        assert.isTrue(model.cells[1][2].isAlive, 'the update line of three cell doesnt right');
      });

      it('set dead the bottom cell of the line', function () {
        assert.isFalse(model.cells[2][1].isAlive, 'the update line of three cell doesnt right');
      });
    });

    it('return this', () => {
      assert.strictEqual(model.setNextStepCells(), model, 'doesnt return this');
    });
  });

  describe('getAliveNeighbors', function () {
    const neighb = [
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
      { isAlive: false },
    ];

    const stubGetNeighbors = sinon.stub(model, 'getNeighbors');
    stubGetNeighbors.returns(neighb);

    before(function () {
      setInitialModel();
    });

    after(function () {
      stubGetNeighbors.restore();
    });

    it('return 0 of cell with 0 alive neighbors', function () {
      const aliveNeighbors = model.getAliveNeighbors();
      assert.strictEqual(aliveNeighbors, 0, 'the amount of the alive neighbors doesnt right of the cell with 2 alive neighbors');
    });

    it('return 2 of cell with 2 alive neighbors', function () {
      neighb[3].isAlive = true;
      neighb[6].isAlive = true;

      const aliveNeighbors = model.getAliveNeighbors();
      assert.strictEqual(aliveNeighbors, 2, 'the amount of the alive neighbors doesnt right of the cell with 2 alive neighbors');
    });

    it('return 4 of cell with 4 alive neighbors', function () {
      neighb[0].isAlive = true;
      neighb[7].isAlive = true;

      const aliveNeighbors = model.getAliveNeighbors();
      assert.strictEqual(aliveNeighbors, 4, 'the amount of the alive neighbors doesnt right of the cell with 2 alive neighbors');
    });
  });

  describe('getNeighbors', function () {
    before(function () {
      setInitialModel();
    });

    it('return neighboors of the first cell', function () {
      const neighbors = model.getNeighbors(0, 0);
      assert.strictEqual(neighbors[2], model.cells[1][1], 'the first neighbor of the first cell doesnt right');
      assert.strictEqual(neighbors.length, 3, 'the amount of the neighbors of the first cell doesnt right');
    });

    it('return neighboors of the center cell', function () {
      const neighbors = model.getNeighbors(1, 1);
      assert.strictEqual(neighbors[4], model.cells[1][2], 'the first neighbor of the center cell doesnt right');
      assert.strictEqual(neighbors.length, 8, 'the amount of the neighbors of the center cell doesnt right');
    });

    it('return neighboors of the center right cell', function () {
      const neighbors = model.getNeighbors(1, 2);
      assert.strictEqual(neighbors[0], model.cells[0][1], 'the first neighbor of the last cell doesnt right');
      assert.strictEqual(neighbors.length, 5, 'the amount of the neighbors of the center right cell doesnt right');
    });
  });

  describe('setGameActive', function () {
    before(function () {
      setInitialModel();
    });

    it('set gameIsAlive to true', function () {
      model.setGameActive(true);
      assert.isTrue(model.gameIsActive);
    });

    it('set gameIsAlive to false', function () {
      model.setGameActive(false);
      assert.isFalse(model.gameIsActive);
    });

    it('return this', () => {
      assert.strictEqual(model.setGameActive(true), model, 'doesnt return this');
    });
  });

  describe('setNumOfRows', function () {
    before(function () {
      setInitialModel();
    });

    it('set argument to numOfRows, if argument is less than the maxRows', function () {
      model.setNumOfRows(4);
      assert.strictEqual(model.numOfRows, 4, 'doesnt set num of rows right');
    });

    it('set maxRows to numOfRows, if argument is more than the maxRows', function () {
      model.setNumOfRows(model.maxRows + 10);
      assert.strictEqual(model.numOfRows, model.maxRows, 'doesnt set num of rows right');
    });
  });
});
