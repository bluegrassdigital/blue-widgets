import getData from './getData'

/**
 * @description Methods relating to adding widgets to the library and creating new widget instances
 * @exports registry
 */
export const registry = {}
export const lib = {}
export let currentIndex = 0

export function addInstance (element, Type) {
  var ref = element.getAttribute('data-ref') || 'widget-' + currentIndex

  if (!registry[ref] && lib[Type]) {
    element.setAttribute('data-ref', ref)
    registry[ref] = new lib[Type](element, getData(element), ref)
    registry[ref].ref = ref
    registry[ref].__type = Type
    currentIndex++
  }

  return registry[ref]
}
/**
 * Adds an object of widget classes to the registry library
 *
 * @static
 * @param {Object.<string, Class>} widgets Object of key value pair widgets to add to the library. The key is the name and the value is the Class itself
 */
export function add (widgets) {
  for (var widget in widgets) {
    if (widgets.hasOwnProperty(widget)) {
      lib[widget] = widgets[widget]
    }
  }
}

/**
 * Gets all descendants of the passed element.
 *
 * @static
 * @param {HTMLElement} parent The parent dom element
 * @param {string|Class} widgetType The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses.
 * @returns {array} An array containing the matching descendants
 */
export function descendants (parent, fieldType) {
  var d = []
  var descendantWidgets = parent.querySelectorAll('[data-ref]')

  for (var i = 0; i < descendantWidgets.length; i++) {
    var widget = descendantWidgets[i]
    var ref = widget.getAttribute('data-ref')
    var isMatch = fieldType ? registry[ref] instanceof (typeof fieldType === 'function' ? fieldType : lib[fieldType]) : true
    if (isMatch) {
      d.push(registry[ref])
    }
  }

  return d
}

/**
 * Get a widget instance from the registry
 *
 * @static
 * @param {string} ref Reference of the widget to fetch
 */
export function get (ref) {
  return registry[ref]
}
/**
 * Removes a widget instance from the registry (doesn't remove the element t itself, just the widget instances)
 *
 * @param {string} widgetRef The ref of the widget we want to remove
 * @static
 */
export function destroy (widgetRef) {
  if (widgetRef && registry.hasOwnProperty(widgetRef)) {
    typeof registry[widgetRef].beforeRemove === 'function' && registry[widgetRef].beforeRemove()
    delete registry[widgetRef]
  }
}
/**
 * Destroys all widget descendants of a dom element (doesn't remove the element t itself, just the widget instances)
 *
 * @param {HTMLElement} parent The parent dom element
 * @param {string|Class} widgetType The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses.
 * @static
 */
export function destroyDescendants (parent, fieldType) {
  var d = descendants(parent, fieldType)
  d.forEach(function (w) {
    destroy(w.ref)
  })
}
