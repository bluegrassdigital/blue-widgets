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
  var sorted = Array.prototype.sort.call(widgets, function(a, b) {
    var aLength = a.querySelectorAll(pattern).length
    var bLength = b.querySelectorAll(pattern).length

    if (aLength > bLength) return 1
    if (aLength < bLength) return -1
    return 0
  })

  for (var i = 0; i < sorted.length; i++) {
    var widget = sorted[i]
    var instance = parseOne(widget, typeFn)
    if (instance && typeof instance.onWidgetsReady === 'function') {
      raf(instance.onWidgetsReady.bind(instance))
    }
    promises.push(instance)
  }

  return Promise.all(promises)
}

function parseOne (el, typeFn) {
  return registry.addInstance(el, typeFn(el))
}
