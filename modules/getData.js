
// Borrowed from jquery data() method

var testJSON = /^(?:\{[\w\W]*\}|\[[{"][\w\W]*[}"]])$/

export function castData (data) {
  if (data === 'true') {
    return true
  }

  if (data === 'false') {
    return false
  }

  if (data === 'null') {
    return null
  }

  // Only convert to a number if it doesn't change the string
  if (data === +data + '') {
    return +data
  }

  if (testJSON.test(data)) {
    return JSON.parse(data)
  }

  return data
}

export function castObject (obj) {
  var newObj = {}
  Object.keys(obj).forEach(attr => {
    newObj[attr] = castData(obj[attr])
  })
  return newObj
}

function toUpperCase (n0) {
  return n0.charAt(1).toUpperCase()
}

export default function getData (el) {
  if (!el.dataset) {
    var map = {}
    var attributes = el.attributes

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i]

      // This test really should allow any XML Name without
      // colons (and non-uppercase for XHTML)

      if (attribute && attribute.name && (/^data-\w[\w-]*$/).test(attribute.name)) {
        var name = attribute.name
        var value = attribute.value

        // Change to CamelCase

        var propName = name.substr(5).replace(/-./g, toUpperCase)

        map[propName] = castData(value)
      }
    }
    return map
  } else {
    return castObject(el.dataset)
  }
}
