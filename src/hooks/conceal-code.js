// Recursively remove the "code" property from the given object or Array of objects
const concealGameCode = (data) => {
  console.log("Data in conceal: ", data)
  if(data.map) { // If the data is an array
    return data.map(concealGameCode)
  } else {
    delete data.code
    return data
  }
}

module.exports = function(hook) {
  hook.result = concealGameCode(hook.result)
  console.log("Data after conceal: ", hook.result)
  return hook
}
