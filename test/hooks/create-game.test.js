const { expect } = require('chai');
const createGame = require('../../src/hooks/create-game');

describe('\'createGame\' hook', () => {
  // A mock hook object
  const mock = {
    params: {
      user: { _id: 'abc123' }
    },
    data: {

    }
  };
  // Initialize our hook with no options
  const hook = createGame();

  it('assigns the current user', () => {
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.userId).to.eq(mock.params.user._id);
    });
  });

  it('creates the code of 4 positions', () => {
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.code.length).to.eq(4);
    });
  });

  it('adds the current user as the first player', () => {
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.players.length).to.eq(1);
      expect(result.data.players[0].userId).to.eq('abc123');
    });
  });

});
