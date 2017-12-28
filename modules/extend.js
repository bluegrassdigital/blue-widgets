export default function extend () { // .length of function is 2
  var to = {}

  for (var index = 0; index < arguments.length; index++) {
    var nextSource = arguments[index]

    if (nextSource != null) { // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey]
        }
      }
    }
  }
  return to
}
