// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function select(array) {
  const codeLength = 4;
  const code =[];
  let counter = codeLength;
  while (counter > 0) {
    code.push(array[Math.floor(Math.random()*array.length)]);
    counter--;
  }
  return code;
}

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const { user } = hook.params;

    // assign the owner of the game
    hook.data.userId = user._id,
    // add the owner to the players, as the first player in the game
    hook.data.players = [{
      userId: user._id
    }];

    // create a code to guess
    const initcode = select('123456'.split(''));
    hook.data.code = initcode
      .map((initcode) => ({ initcode: initcode }));

    return Promise.resolve(hook);
  };
};
