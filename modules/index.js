import * as parser from './parser'
import * as registry from './registry'
import Widget from './Widget'

/**
 * Adds an object of widget classes to the registry library
 *
 * @static
 * @param {Object.<string, Class>} widgets Object of key value pair widgets to add to the library. The key is the name and the value is the Class itself
 * @function
 */
const defineWidgets = registry.add

/**
 * Parse an element for widget instances and add them to the registry. By default looks for elements with a `data-widget` attribute
 * @param {HTMLElement} el A dom element
 * @param {string} [pattern='[data-widget]'] Optional string for setting the selector pattern to match in the querySelectorAll call
 * @param {function} [typeFn=el => el.dataset.widget] Optional function for returning the type to look up in the registry'
 * @returns {Promise<Array>} A Promise fulfilled with an array of the parsed instances
 * @function
 */
const parse = parser.parse

/**
 * Get a widget instance from the registry
 *
 * @static
 * @param {string} ref Reference of the widget to fetch
 * @function
 */
const getInstance = registry.get

/**
 * Gets all descendants of the passed element.
 *
 * @function
 * @param {HTMLElement} parent The parent dom element
 * @param {string|Class} widgetType The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses.
 * @returns {array} An array containing the matching descendants
 */
const getDescendants = registry.descendants

/**
 * Removes a widget instance from the registry (doesn't remove the element t itself, just the widget instances)
 *
 * @param {string} widgetRef The ref of the widget we want to remove
 * @param {boolean} [recursive=true] Whether to also destory a widgets descendants
 * @function
 */

const destroyInstance = registry.destroy

export {
  parser,
  registry,
  Widget,
  parse,
  getInstance,
  getDescendants,
  destroyInstance,
  defineWidgets
}
