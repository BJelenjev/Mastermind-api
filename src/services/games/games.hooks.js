

const createGame = require('../../hooks/create-game');

const joinGame = require('../../hooks/join-game');

const checkWinner = require('../../hooks/check-winner');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createGame()],
    update: [joinGame(), checkWinner()],
    patch: [joinGame(), checkWinner()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
