import Cell from '../model/Cell';

describe('Model Cell', function () {
  const cell = new Cell();

  it('created cell is object', function () {
    assert.isObject(cell);
  });

  it('created cell has dead status', function () {
    assert.strictEqual(cell.isAlive, false, 'created cell doesnt have dead status');
  });

  it('setAlive', function () {
    cell.setAlive();
    assert.strictEqual(cell.isAlive, true, 'doesnt set cell to alive');
  });

  it('setDead', function () {
    cell.setDead();
    assert.strictEqual(cell.isAlive, false, 'doesnt set cell to dead');
  });
});
