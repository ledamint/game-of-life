import Controller from '../controller/Controller';
import View from '../view/View';
import Model from '../model/GameScreen';

describe('Controller', function () {
  const controller = new Controller();

  it('controller.view instanceof View', function () {
    assert(controller.view instanceof View, 'controller.view doesnt instanceof View');
  });

  it('controller.model instanceof Model', function () {
    assert(controller.model instanceof Model, 'controller.model doesnt instanceof Model');
  });

  const spySetBeginGame = sinon.spy(controller, 'setBeginGame');
  const spyToggleGameActive = sinon.spy(controller, 'toggleGameActive');
  const spyStartGame = sinon.spy(controller, 'startGame');
  const spyPauseGame = sinon.spy(controller, 'pauseGame');
  const spyDrawInitialCells = sinon.spy(controller, 'drawInitialCells');
  const spyTransmitNumOfRowsInputValueToModel = sinon.spy(controller, 'transmitNumOfRowsInputValueToModel');
  const spyDrawNextStepCells = sinon.spy(controller, 'drawNextStepCells');
  const spyChangeNumberOfRowsInputValue = sinon.spy(controller.view, 'changeNumberOfRowsInputValue');
  const spyChangePlayButton = sinon.spy(controller.view, 'changePlayButton');
  const spyDraw = sinon.spy(controller.view, 'draw');
  const stubGetNumberOfRowsInputValue = sinon.stub(controller.view, 'getNumberOfRowsInputValue');
  const spySetGameActive = sinon.spy(controller.model, 'setGameActive');
  const spySetInitialCells = sinon.spy(controller.model, 'setInitialCells');
  const spySetNextStepCells = sinon.spy(controller.model, 'setNextStepCells');
  const spySetNumOfRows = sinon.stub(controller.model, 'setNumOfRows');

  const resetAllSinon = function reset() {
    spySetBeginGame.reset();
    spyToggleGameActive.reset();
    spyStartGame.reset();
    spyPauseGame.reset();
    spyDrawInitialCells.reset();
    spyTransmitNumOfRowsInputValueToModel.reset();
    spyDrawNextStepCells.reset();
    spyChangeNumberOfRowsInputValue.reset();
    spyChangePlayButton.reset();
    spyDraw.reset();
    stubGetNumberOfRowsInputValue.reset();
    spySetGameActive.reset();
    spySetInitialCells.reset();
    spySetNextStepCells.reset();
    spySetNumOfRows.reset();
  };

  describe('setUpGame', function () {
    before(function () {
      controller.setUpGame();
    });

    afterEach(function () {
      resetAllSinon();
    });

    it('call setBeginGame', function () {
      sinon.assert.calledOnce(spySetBeginGame);
    });

    it('call setBeginGame after view event changeRows', function () {
      controller.view.emit('changeRows');
      sinon.assert.calledOnce(spySetBeginGame);
    });

    it('call toggleGameActive after view event playOrPause', function () {
      controller.view.emit('playOrPause');
      sinon.assert.calledOnce(spyToggleGameActive);
    });

    it('call setBeginGame after view event clearCells', function () {
      controller.view.emit('clearCells');
      sinon.assert.calledOnce(spySetBeginGame);
    });

    it('call model.setAlive with after view event setModelCellAlive', function () {
      const modelCell = {
        isAlive: false,

        setAlive() {
          this.isAlive = true;
        },
      };

      const spySetAlive = sinon.spy(modelCell, 'setAlive');

      controller.view.emit('setModelCellAlive', modelCell);
      sinon.assert.calledOnce(spySetAlive);
    });

    it('call model.setDead after view event setModelCellDead', function () {
      const modelCell = {
        isAlive: true,

        setDead() {
          this.isAlive = false;
        },
      };
      const spySetDead = sinon.spy(modelCell, 'setDead');

      controller.view.emit('setModelCellDead', modelCell);
      sinon.assert.calledOnce(spySetDead);
    });
  });

  describe('setBeginGame', function () {
    before(function () {
      resetAllSinon();
    });

    afterEach(function () {
      resetAllSinon();
    });

    it('call pauseGame if game is active', function () {
      controller.model.gameIsActive = true;
      controller.setBeginGame();

      sinon.assert.calledOnce(spyPauseGame);
    });

    it('doesnt call pauseGame if game is not active', function () {
      controller.model.gameIsActive = false;
      controller.setBeginGame();

      sinon.assert.notCalled(spyPauseGame);
    });

    it('call transmitNumOfRowsInputValueToModel', function () {
      controller.setBeginGame();
      sinon.assert.calledOnce(spyTransmitNumOfRowsInputValueToModel);
    });

    it('call view.changeNumberOfRowsInputValue', function () {
      controller.setBeginGame();
      sinon.assert.calledOnce(spyChangeNumberOfRowsInputValue);
    });

    it('call spyDrawInitialCells', function () {
      controller.setBeginGame();
      sinon.assert.calledOnce(spyDrawInitialCells);
    });

    it('return this', function () {
      assert.strictEqual(controller.setBeginGame(), controller, 'doesnt return this');
    });
  });

  describe('toggleGameActive', function () {
    before(function () {
      resetAllSinon();
    });

    afterEach(function () {
      resetAllSinon();
    });

    it('call pauseGame if game is active', function () {
      controller.model.gameIsActive = true;
      controller.toggleGameActive();
      sinon.assert.calledOnce(spyPauseGame);
      sinon.assert.notCalled(spyStartGame);
    });

    it('call startGame if game is not active', function () {
      controller.model.gameIsActive = false;
      controller.toggleGameActive();
      sinon.assert.calledOnce(spyStartGame);
      sinon.assert.notCalled(spyPauseGame);
    });

    it('return this', function () {
      assert.strictEqual(controller.toggleGameActive(), controller, 'doesnt return this');
    });
  });

  describe('startGame', function () {
    before(function () {
      resetAllSinon();
      controller.startGame();
    });

    it('call model.setGameActive(true)', function () {
      sinon.assert.calledWith(spySetGameActive, true);
    });

    it('call drawNextStepCells', function () {
      sinon.assert.calledOnce(spyDrawNextStepCells);
    });

    it('call view.changePlayButton(this.model.gameIsActive)', function () {
      sinon.assert.calledWith(spyChangePlayButton, controller.model.gameIsActive);
    });

    it('call drawNextStepCells after delay', function (done) {
      setTimeout(() => {
        sinon.assert.calledTwice(spyDrawNextStepCells);
        done();
      }, controller.model.delay);
    });

    it('return this', function () {
      assert.strictEqual(controller.startGame(), controller, 'doesnt return this');
    });
  });

  describe('pauseGame', function () {
    before(function () {
      resetAllSinon();
      controller.startGame();
      controller.pauseGame();
    });

    it('doesnt call drawUpdateCells after delay', function (done) {
      setTimeout( () => {
        sinon.assert.calledOnce(spyDrawNextStepCells);

        done();
      }, controller.model.delay);
    });

    it('call model.setGameActive(false)', function () {
      sinon.assert.calledWith(spySetGameActive, false);
    });

    it('call view.changePlayButton(this.model.gameIsActive)', function () {
      sinon.assert.calledWith(spyChangePlayButton, controller.model.gameIsActive);
    });

    it('return this', function () {
      assert.strictEqual(controller.pauseGame(), controller, 'doesnt return this');
    });
  });

  describe('drawInitialCells', function () {
    before(function () {
      resetAllSinon();
      controller.drawInitialCells();
    });

    it('call model.setInitialCells', function () {
      sinon.assert.calledOnce(spySetInitialCells);
    });

    it('call view.draw(this.model.cells);', function () {
      sinon.assert.calledWith(spyDraw, controller.model.cells);
    });

    it('return this', function () {
      assert.strictEqual(controller.drawInitialCells(), controller, 'doesnt return this');
    });
  });

  describe('drawNextStepCells', function () {
    before(function () {
      resetAllSinon();
      controller.drawNextStepCells();
    });

    it('call model.setNextStepCells', function () {
      sinon.assert.calledOnce(spySetNextStepCells);
    });

    it('call view.draw(this.model.cells);', function () {
      sinon.assert.calledWith(spyDraw, controller.model.cells);
    });

    it('return this', function () {
      assert.strictEqual(controller.drawNextStepCells(), controller, 'doesnt return this');
    });
  });

  describe('transmitNumOfRowsInputValueToModel', function () {
    const testInputValue = 'five';
    stubGetNumberOfRowsInputValue.returns(testInputValue);

    before(function () {
      resetAllSinon();
      controller.transmitNumOfRowsInputValueToModel();
    });

    it('call view.getNumberOfRowsInputValue', function () {
      sinon.assert.calledOnce(stubGetNumberOfRowsInputValue);
    });

    it('call model.spySetNumOfRows with numberOfRowsInputValue', function () {
      sinon.assert.calledWith(spySetNumOfRows, testInputValue);
    });

    it('return this', function () {
      assert.strictEqual(controller.transmitNumOfRowsInputValueToModel(), controller, 'doesnt return this');
    });
  });
});
