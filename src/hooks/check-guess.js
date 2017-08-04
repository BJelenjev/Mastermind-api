// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');
module.exports = function checkGuess(hook) {
  // Hooks can either return nothing or a promise
  // that resolves with the `hook` object for asynchronous operations

  //see if hook has data guess: and that the array doesn't contain 0
  if (hook.data.guess === undefined) return Promise.resolve(hook);
  if (hook.data.guess.includes(0)) {
    throw new errors.Unprocessable('0 cannot be specified as a color index within a guess (the 0 index is reserved for gray)');
  }

  // check if user is one of the players
  const { user } = hook.params;

  // Contrary to what you might suspect, doing this "reentry" (calling the service's "get"
  // from within the service) implies that all the filters and hooks and whatnot are going
  // to be applied to to what gets returned. That, in turn, means that:
  //  a) if you are not careful you can create a "recursive" hook call, which, when applied well
  //     with promises, will give you an async infinite loop (apply this hook in `get` to discover)
  //  b) most importantly - "code" is scrubbed from the returned data structure.
  //
  // So to obtain our actual dain' data we need to query Mongoose _directly_ and operate _on that_.
  const model = hook.app.service('games').Model;
  const userId = user._id.toString();

  // !!!!! https://github.com/feathersjs/feathers/issues/382#issuecomment-238112819
  return model.findOne({_id: hook.id}).then((game) => {
    const { players,turn,guesses,code } = game;

    const playerIds = players.map((p) => p._id.toString());

    const joined = playerIds.includes(userId);
    if (!joined) {
      throw new errors.Unprocessable('You are not a player in this game, so you can not play!');
    }

    const hasTurn = playerIds.indexOf(userId)  === (turn % 2);
    if (!hasTurn) {
      throw new errors.Unprocessable('It is not your turn to guess, wait for your opponent!');
    }

    const guessValid = hook.data.guess.length === code.length;
    if (!guessValid) {
      throw new errors.Unprocessable('Your guess is not complete!');
    }

    const turnLoss = (turn + 1) > 10; // Do not accept game-altering data via hooks
    if (turnLoss) {
      hook.data.loss = true;
      return hook;
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
    const newGuess = {guess, numExact, numApprox};
    const newGuesses = guesses.concat(newGuess);

    //guess get's added to list with result
    hook.data.guesses = newGuesses;

    //is the result all correct then won gets to be true, and winnerId gets set
    if (numExact === code.length){
      hook.data.won = true;
      hook.data.winnerId = userId;
    }

    //ready next turn or game over
    hook.data.turn = turn + 1;
    //console.log("Resolving hook with ", hook.data)
    return hook;
  });
};
