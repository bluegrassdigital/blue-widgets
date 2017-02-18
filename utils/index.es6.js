// Borrowed from jquery data() method

const testJSON = /^(?:\{[\w\W]*\}|\[[\w\W]*])$/

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
  const newObj = {}
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      newObj[attr] = castData(obj[attr])
    }
  }
  return newObj
}
