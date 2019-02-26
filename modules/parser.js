import * as registry from './registry'
import { raf } from './raf'

var typeFnDefault = function (el) {
  return el.getAttribute('data-widget')
}

export function parse (el, pattern, typeFn) {
  el = el || document
  pattern = pattern || '[data-widget]'
  typeFn = typeof typeFn === 'function' ? typeFn : typeFnDefault
  var promises = []
  var widgets = el.querySelectorAll(pattern)
  var sorted = Array.from(widgets).sort(function(a, b) {
    var aLength = a.querySelectorAll(pattern).length
    var bLength = b.querySelectorAll(pattern).length

    if (aLength > bLength) return 1
    if (aLength < bLength) return -1
    return 0
  })

  for (var i = 0; i < sorted.length; i++) {
    var widget = sorted[i]
    var promise = parseOne(widget, typeFn)
    promises.push(promise)
  }

  return Promise.all(promises)
    .then(function (instances) {
      instances.forEach(function (instance) {
        if (instance && typeof instance.onWidgetsReady === 'function') {
          raf(instance.onWidgetsReady.bind(instance))
        }
      })
      return instances
    })
}

function parseOne (el, typeFn) {
  return registry.addInstance(el, typeFn(el))
}
