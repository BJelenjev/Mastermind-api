const { authenticate } = require('feathers-authentication').hooks;
const { restrictToAuthenticated } = require('feathers-authentication-hooks');
const { populate } = require('feathers-hooks-common');

const restrict = [
  authenticate('jwt'),
  restrictToAuthenticated(),
];


const ownerSchema = {
  include: {
    service: 'users',
    nameAs: 'owner',
    parentField: 'userId',
    childField: '_id',
  }
};

const createGame = require('../../hooks/create-game');

const joinGame = require('../../hooks/join-game');

const checkWinner = require('../../hooks/check-winner');

const checkGuess = require('../../hooks/check-guess');

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [],
    get: [],
    create: [createGame()],
    update: [joinGame(), checkGuess()],
    patch: [joinGame(), checkGuess()],
    remove: []
  },

  after: {
    all: [populate({ schema: ownerSchema }), checkWinner()],
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
