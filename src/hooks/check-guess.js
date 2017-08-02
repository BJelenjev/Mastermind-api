// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function checkGuess (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    //see if hook has data guess: and that the array doesn't contain 0
    if (hook.data.guess === undefined) return Promise.resolve(hook);
    if (hook.data.guess.includes(0)) return Promise.resolve(hook);
    //check if user is one of the players
    const { user } = hook.params;
    return hook.app.service('games').get(hook.id)
      .then((game) => {
        const { players,turn,guesses,code } = game;
        const playerIds = players.map((p) => (p.userId.toString()));
        const joined = playerIds.includes(user._id.toString());
        const turnState = (turn % 2) ;
        const hasTurn = playerIds.indexOf(user._id)  === turnState;
        const guessValid = hook.data.guess.length === code.length;
        const turnLoss = hook.data.turn > 10 ;

        if (!joined) {
          throw new errors.Unprocessable('You are not a player in this game, so you can not play!');
        }

        if (!hasTurn) {
          throw new errors.Unprocessable('It is not your turn to guess!');
        }

        if (!guessValid) {
          throw new errors.Unprocessable('Your guess is not complete!');
        }

        function spotOnGuess(guess,code){
          var i = guess.length;
          var spot = 0;
          while (i--) {
            if (guess[i]===code[i])
              spot += 1;
          }
          return spot;
        }

        function closeGuess(guess,code){
          var i = guess.length;
          var close = 0;
          while (i--) {
            if (guess[i] !== code[i] && code.includes(guess[i]))
              close +=1;
          }
          return close;
        }




        //take the hook data and generate its clue
        const guess = hook.data.guess;
        const numExact = spotOnGuess(guess,code);
        const numApprox = closeGuess(guess,code);
        const newGuess = Object.assign({}, {guess: guess}, { clue: [numExact,numApprox] });
        const newGuesses = guesses.concat(newGuess);
        //guess get's added to list with result
        hook.data.guesses = newGuesses;

        //is the result all correct then won gets to be true, and winnerId gets set
        if (numExact === code.length){
          hook.data.won = true;
          hook.data.winnerId = user._id;
        }

        //ready next turn or game over
        let newTurn = turn + 1;
        hook.data.turn = newTurn;
        if (!turnLoss) {
          return hook;
        }


        hook.data.loss = true;

        return Promise.resolve(hook);
      });
  };
};
