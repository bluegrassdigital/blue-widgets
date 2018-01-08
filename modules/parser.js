import * as registry from './registry'
import { raf } from './raf'

/**
 * Methods relating to parsing the dom and adding found `widgets` to the registry
 * @module parser
 */

var typeFnDefault = function (el) {
  return el.getAttribute('data-widget')
}

/**
 * Parse an element for widget instances and add them to the registry. By default looks for elements with a `data-widget` attribute
 * @param {HTMLElement} el A dom element
 * @param {string} [pattern='[data-widget]'] Optional string for setting the selector pattern to match in the querySelectorAll call
 * @param {function} [typeFn=el => el.dataset.widget] Optional function for returning the type to look up in the registry'
 * @returns {array} An array of the parsed instances.
 * @function
 */
export function parse (el, pattern, typeFn) {
  el = el || document
  pattern = pattern || '[data-widget]'
  typeFn = typeof typeFn === 'function' ? typeFn : typeFnDefault
  var promises = []
  var widgets = el.querySelectorAll(pattern)

  for (var i = 0; i < widgets.length; i++) {
    var widget = widgets[i]
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
