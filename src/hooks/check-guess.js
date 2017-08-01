// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function checkGuess (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    //see if hook has data this should be an 4 length array
    if (hook.data.guess === undefined) return Promise.resolve(hook);
    if (hook.data.guess.length !== 4) return Promise.resolve(hook);
    //check if user is one of the players
    const { user } = hook.params;
    return hook.app.service('games').get(hook.id)
      .then((game) => {
        const { players,turn,guesses } = game;
        const playerIds = players.map((p) => (p.userId.toString()));
        const joined = playerIds.includes(user._id.toString());
        const turnState = (turn % 2) ;
        const hasTurn = playerIds.indexOf(user._id)  === turnState;

        if (!joined) {
          throw new errors.Unprocessable('You are not a player in this game, so you can not play!');
        }

        if (!hasTurn) {
          throw new errors.Unprocessable('It is not your turn to guess!');
        }

    //take the hook data and generate its clue
        const guess = hook.data.guess
        const initcode = code.initcode


        function spoton(guess,initcode){
          var i = guess.length;
          var spot = 0;
          while (i--) {
            if (guess[i]===initcode[i])
            spot += 1;
          }
          return spot
        }

        function isthere(guess,initcode){
          var i = guess.length;
          var there = 0;
          while (i--) {
            if (guess[i] !== initcode[i] && initcode.includes(guess[i]))
            there +=1;
          }
          return there
        }

        clue = [spoton(guess,initcode),isthere(guess,initcode)];

        hook.data.guesses

    //is the result all correct then won gets to be true, and winnerId gets set

    //guess get's added to list with result

    //ready next turn

    //if turn if >10 then game over loss



    return Promise.resolve(hook);
  };
}
