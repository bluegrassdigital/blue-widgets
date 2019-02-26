export default function extend () {
  var to = {}

  for (var index = 0; index < arguments.length; index++) {
    var nextSource = arguments[index]

    if (nextSource != null) { // Skip over if undefined or null
      Object.keys(nextSource).forEach(key => {
        to[key] = nextSource[key]
      })
    }
  }
  return to
}
