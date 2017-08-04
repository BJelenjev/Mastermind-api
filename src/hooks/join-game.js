// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // see if hook.data has { join: boolean }
    if (hook.data.join === undefined) return Promise.resolve(hook);

    const { user } = hook.params;
    const currentUserId = user._id.toString();

    // see if player already present
    return hook.app.service('games')
      .get(hook.id)
      .then((game) => {

        const {players} = game;
        const wantsToJoin = hook.data.join;
        const alreadyJoined = players.map((p) => (p._id.toString())).includes(currentUserId);

        hook.data = {};

        if (!alreadyJoined && wantsToJoin) {
          //console.log(`Will add ${currentUserId} to game ${game._id}`)
          hook.data = {
            players: players.concat({ _id: user._id})
          };
        } else {
          //console.log(`${currentUserId} already in game ${game._id}`)
          hook.data = {};
        }
        return Promise.resolve(hook);
      });
  };
};
