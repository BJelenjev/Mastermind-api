const { authenticate } = require('feathers-authentication').hooks;
const { restrictToAuthenticated} = require('feathers-authentication-hooks');
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

const statusGame = require('../../hooks/status-game');

const checkGuess = require('../../hooks/check-guess');
const concealCode = require('../../hooks/conceal-code');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ ...restrict, createGame()],
    update: [ ...restrict, joinGame(), checkGuess()],
    patch:  [ ...restrict, joinGame(), checkGuess()],
    remove: [ ...restrict]
  },

  after: {
    all: [populate({ schema: ownerSchema }), statusGame(), concealCode],
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
