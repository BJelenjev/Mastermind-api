const { expect } = require('chai');
const joinGame = require('../../src/hooks/join-game');
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');

const storeInit = {
  '0': { players: [{ userId: 'cde456'}], id: 0 }
};

let store;

function services () {
  const app = this;
  app.configure(games);
}

function games () {
  const app = this;
  store = clone(storeInit);

  app.use('games', memory({
    store
  }));
}


describe('\'joinGame\' hook', () => {
  let app;
  let games;

  beforeEach(() => {
    app = feathers()
      .configure(feathersHooks())
      .configure(services);

    games = app.service('games');
  });

  const mock = {
    params: {
      user: { _id: 'abc123' }
    },
    data: {
      join: true

    },
    id: store[0]

  };

  // Initialize our hook with no options
  const hook = joinGame();

  it('adds the second player', () => {
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.players[1].userId).to.eq('cde456');
    });
  });

});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
