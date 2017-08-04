// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function select(array) {
  const codeLength = 4;
  const code =[];
  let counter = codeLength;
  while (counter > 0) {
    const element = array[(Math.floor(Math.random()*array.length))];
    if (!code.includes(element))
      code.push(element),
      counter--;
  }
  return code;
}

function seedColors() {
  return ['gray'].concat('red orange yellow green blue indigo'.split(' '));
}

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const { user } = hook.params;

    // assign the owner of the game
    hook.data.ownerId = user._id;

    // add the owner to the players, as the first player in the game
    hook.data.players = [{_id: user._id}];

    // create a code to guess
    const initcode = select('123456'.split(''));
    hook.data.code = initcode.map((initcode) => Number(initcode));

    // and seed colors (add a color scheme generator later).
    // The first color (index 0) should be "gray", since our initcode values only
    // go 1-6 we need to have 7 colors exactly
    hook.data.colors = seedColors();

    return Promise.resolve(hook);
  };
};
