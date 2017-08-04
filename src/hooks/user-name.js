// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
function generateName(user){
  user.name = user.email.slice(0,user.email.indexOf('@'));
  return user;
}


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function userName (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    hook.data = generateName(hook.data);
    return Promise.resolve(hook);
  };
};
