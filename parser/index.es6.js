import datasetPolyfill from 'element-dataset'
datasetPolyfill()
import registry from '../registry'
import { dom } from 'blue-js'

/**
 * Methods relating to parsing the dom and adding found `widgets` to the registry
 * @module parser
 */

/**
 * Parse an element for widget instances and add them to the registry. By default looks for elements with a `data-widget` attribute
 * @param {HTMLElement} el A dom element
 * @param {string} [pattern='[data-widget]'] Optional string for setting the selector pattern to match in the querySelectorAll call
 * @param {function} [typeFn=el => el.dataset.widget] Optional function for returning the type to look up in the registry'
 * @returns {array} An array of the parsed instances.
 * @function
 */
export const parse = (el, pattern = '[data-widget]', typeFn = el => el.dataset.widget) => {
  el = el || document
  let instances = []
  const widgets = el.querySelectorAll(pattern)

  dom.each(widgets, widget => {
    const instance = parseOne(widget, typeFn)
    if (instance) instances.push(instance)
  })

  instances.forEach(instance => {
    if (instance && typeof instance.onWidgetsReady === 'function') {
      instance.onWidgetsReady()
    }
  })

  return instances
}

const parseOne = (el, typeFn) => {
  try {
    return registry.addInstance(el, typeFn(el))
  } catch (e) {
    if (window.console) console.warn(`Widget failed to initialise: ${e.message}`)
  }
}
