// Recursively remove the "code" property from the given object or Array of objects
const concealGameCode = (data) => {
  if(data.data) { // If this is a paginated response, where the collection is enveloped in data
    return Object.assign({}, data, {data: data.data.map(concealGameCode)})
  }
  if(data.map) { // If the data is an array
    return data.map(concealGameCode);
  } else {
    delete data.code;
    return data;
  }
};

module.exports = function(hook) {
  hook.result = concealGameCode(hook.result);
  return hook;
};
