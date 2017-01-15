import View from '../view/View';

describe('View', function () {
  const stubSetInitialHandlers = sinon.stub(View.prototype, 'setInitialHandlers');

  const view = new View(3);
  const VertLineCells = [
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
    [{ isAlive: false }, { isAlive: true }, { isAlive: false }],
  ];
  const spyRemoveElemCells = sinon.spy(view, 'removeElemCells');
  const spyCreateElemRow = sinon.spy(View, 'createElemRow');
  const spyCreateElemCell = sinon.spy(View, 'createElemCell');
  const spyToogleCell = sinon.spy(view, 'toogleCell');
  const spyMakeAlive = sinon.spy(view, 'makeAlive');
  const spyMakeDead = sinon.spy(view, 'makeDead');
  const spyEmit = sinon.spy(view, 'emit');

  const resetAllSinon = function reset() {
    stubSetInitialHandlers.reset();
    spyRemoveElemCells.reset();
    spyCreateElemRow.reset();
    spyCreateElemCell.reset();
    spyToogleCell.reset();
    spyMakeAlive.reset();
    spyMakeDead.reset();
    spyEmit.reset();
  };

  stubSetInitialHandlers.restore();

  describe('set up initial layout', function () {
    it('draw window', function () {
      const window = document.querySelectorAll('.window');
      assert.strictEqual(window.length, 1, 'doesnt draw window');
    });

    it('draw window__h1', function () {
      const windowH1 = document.querySelectorAll('.window__h1');
      assert.strictEqual(windowH1.length, 1, 'doesnt draw window__h1');
    });

    it('draw window__game', function () {
      const windowGame = document.querySelectorAll('.window__game');
      assert.strictEqual(windowGame.length, 1, 'doesnt draw window__game');
    });

    it('save window__game in view.gameBoard', function () {
      const windowGame = document.querySelector('.window__game');
      assert.strictEqual(windowGame, view.gameBoard, 'doesnt save window__game in view.gameBoard');
    });

    it('draw window__controller', function () {
      const windowController = document.querySelectorAll('.window__controller');
      assert.strictEqual(windowController.length, 1, 'doesnt draw window__controller');
    });

    it('draw window__input', function () {
      const windowInput = document.querySelectorAll('.window__input');
      assert.strictEqual(windowInput.length, 1, 'doesnt draw window__input');
    });

    it('save window__input in view.numberOfRowsInput', function () {
      const windowInput = document.querySelector('.window__input');
      assert.strictEqual(windowInput, view.numberOfRowsInput, 'doesnt save window__input in view.numberOfRowsInput');
    });

    it('draw window__button_play', function () {
      const windowButtonPlay = document.querySelectorAll('.window__button_play');
      assert.strictEqual(windowButtonPlay.length, 1, 'doesnt draw window__button_play');
    });

    it('save window__button_play in view.playButton', function () {
      const windowButtonPlay = document.querySelector('.window__button_play');
      assert.strictEqual(windowButtonPlay, view.playButton, 'doesnt save window__button_play in view.playButton');
    });

    it('draw window__button_clear', function () {
      const windowButtonClear = document.querySelectorAll('.window__button_clear');
      assert.strictEqual(windowButtonClear.length, 1, 'doesnt draw window__button_clear');
    });

    it('save window__button_clear in view.clearButton', function () {
      const windowButtonClear = document.querySelector('.window__button_clear');
      assert.strictEqual(windowButtonClear, view.clearButton, 'doesnt save window__button_clear in view.clearButton');
    });

    it('call setInitialHandlers', function () {
      sinon.assert.calledOnce(stubSetInitialHandlers);
    });
  });

  describe('draw', function() {
    describe('center vertical line on 3x3', function () {
      before(function () {
        resetAllSinon();
        view.draw(VertLineCells);
      });

      it('call removeElemCells once', function () {
        sinon.assert.calledOnce(spyRemoveElemCells);
      });

      it('call createElemRow thrice', function () {
        sinon.assert.calledThrice(spyCreateElemRow);
      });

      it('call createElemCell nine times', function () {
        sinon.assert.callCount(spyCreateElemCell, 9);
      });

      it('call makeAlive thrice', function () {
        sinon.assert.callCount(spyMakeAlive, 3);
      });

      it('call makeDead six times', function () {
        sinon.assert.callCount(spyMakeDead, 6);
      });

      it('call toggleCell after click on cell', function() {
        const click = new Event('click');
        const cellElems = document.querySelectorAll('.window__cell');

        cellElems[0].dispatchEvent(click);
        sinon.assert.calledOnce(spyToogleCell);
        cellElems[8].dispatchEvent(click);
        sinon.assert.calledTwice(spyToogleCell);
      });

      it('draw on gameBoard nine window__cell', function() {
        const cellElems = view.gameBoard.querySelectorAll('.window__cell');
        assert.strictEqual(cellElems.length, 9, 'doesnt draw on gameBoard nine window__cell');
      });
    });

    it('return this', function () {
      assert.strictEqual(view.draw([]), view, 'doesnt return this');
    });
  });

  describe('getNumberOfRowsInputValue', function () {
    it('return number of rows input value', function () {
      view.numberOfRowsInput.value = 5;
      assert.strictEqual(view.getNumberOfRowsInputValue(), 5, 'doesnt return right number');
    });
  });

  describe('changePlayButton', function () {
    it('change play button to play state', function () {
      view.playButton.textContent = 'Pause';
      view.changePlayButton(false);
      assert.strictEqual(view.playButton.textContent, 'Play', 'doesnt change play button to play state');
    });

    it('change play button to pause state', function () {
      view.playButton.textContent = 'Play';
      view.changePlayButton(true);
      assert.strictEqual(view.playButton.textContent, 'Pause', 'doesnt change play button to pause state');
    });

    it('return this', function () {
      assert.strictEqual(view.changePlayButton(), view, 'doesnt return this');
    });
  });

  describe('changeNumberOfRowsInputValue', function () {
    it('change number of rows input value', function () {
      view.numberOfRowsInput.value = 5;
      view.changeNumberOfRowsInputValue(7);

      assert.strictEqual(Number(view.numberOfRowsInput.value), 7, 'doesnt change number of rows input value right');
    });

    it('return this', function () {
      assert.strictEqual(view.changeNumberOfRowsInputValue(), view, 'doesnt return this');
    });
  });

  describe('removeElemCells', function () {
    before(function () {
      for (let i = 0; i < 10; i += 1) {
        const elemCell = document.createElement('div');
        elemCell.classList.add('window__cell');
        view.gameBoard.appendChild(elemCell);
      }
    });

    it('remove all elements on game board', function () {
      view.removeElemCells();
      assert.strictEqual(view.gameBoard.children.length, 0, 'doesnt remove all elements on game board');
    });

    it('return this', function () {
      assert.strictEqual(view.removeElemCells(), view, 'doesnt return this');
    });
  });

  describe('toogleCell', function () {
    before(function () {
      resetAllSinon();
    });

    it('call makeDead if cell is alive', function () {
      const modelCell = { isAlive: true };
      const elemCell = document.createElement('div');

      view.toogleCell(modelCell, elemCell);
      sinon.assert.calledWith(spyMakeDead, modelCell, elemCell);
    });

    it('call makeAlive if cell is dead', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      view.toogleCell(modelCell, elemCell);
      sinon.assert.calledWith(spyMakeAlive, modelCell, elemCell);
    });

    it('return this', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      assert.strictEqual(view.toogleCell(modelCell, elemCell), view, 'doesnt return this');
    });
  });

  describe('makeAlive', function () {
    before(function () {
      resetAllSinon();
    });

    it('call emit setModelCellAlive', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      view.makeAlive(modelCell, elemCell);
      sinon.assert.calledWith(spyEmit, 'setModelCellAlive', modelCell);
    });

    it('add to elemCell class window__cell_enable', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      view.makeAlive(modelCell, elemCell);
      assert(elemCell.classList.contains('window__cell_enable'), 'doesnt add elemCell class window__cell_enable');
    });

    it('return this', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      assert.strictEqual(view.makeAlive(modelCell, elemCell), view, 'doesnt return this');
    });
  });

  describe('makeDead', function () {
    before(function () {
      resetAllSinon();
    });

    it('call emit setModelCellDead', function () {
      const modelCell = { isAlive: true };
      const elemCell = document.createElement('div');

      view.makeDead(modelCell, elemCell);
      sinon.assert.calledWith(spyEmit, 'setModelCellDead', modelCell);
    });

    it('remove out elemCell class window__cell_enable', function () {
      const modelCell = { isAlive: true };
      const elemCell = document.createElement('div');

      view.makeDead(modelCell, elemCell);
      assert(!elemCell.classList.contains('window__cell_enable'), 'doesnt remove elemCell class window__cell_enable');
    });

    it('return this', function () {
      const modelCell = { isAlive: false };
      const elemCell = document.createElement('div');

      assert.strictEqual(view.makeDead(modelCell, elemCell), view, 'doesnt return this');
    });
  });

  describe('setInitialHandlers', function () {
    before(function () {
      resetAllSinon();
      view.setInitialHandlers();
    });

    it('call emit changeRows when numberOfRowsInput unfocused', function () {
      const blur = new Event('blur');
      view.numberOfRowsInput.dispatchEvent(blur);

      sinon.assert.calledWith(spyEmit, 'changeRows');
    });

    it('call emit playOrPause when playButton click', function () {
      const click = new Event('click');
      view.playButton.dispatchEvent(click);

      sinon.assert.calledWith(spyEmit, 'playOrPause');
    });

    it('call emit clearCells when clearButton click', function () {
      const click = new Event('click');
      view.clearButton.dispatchEvent(click);

      sinon.assert.calledWith(spyEmit, 'clearCells');
    });

    it('return this', function () {
      assert.strictEqual(view.setInitialHandlers(), view, 'doesnt return this');
    });
  });

  describe('createElemRow', function () {
    const elemRow = View.createElemRow();

    it('elemRow has div tag', function () {
      assert.strictEqual(elemRow.tagName, 'DIV', 'elemRow doesnt have div tag');
    });

    it('elemRow has class window__row', function () {
      assert(elemRow.classList.contains('window__row'), 'elemRow doesnt have class window__row');
    });
  });

  describe('createElemCell', function () {
    const elemCell = View.createElemCell();

    it('elemCell has div tag', function () {
      assert.strictEqual(elemCell.tagName, 'DIV', 'elemCell doesnt have div tag');
    });

    it('elemCell has class window__cell', function () {
      assert(elemCell.classList.contains('window__cell'), 'elemCell doesnt have class window__cell');
    });
  });
});
