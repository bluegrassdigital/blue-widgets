import datasetPolyfill from 'element-dataset'
datasetPolyfill()
import { dom } from 'blue-js'
/**
 * @description Methods relating to adding widgets to the library and creating new widget instances
 * @exports registry
 */
class WidgetLibrary {
  constructor () {
    this.registry = {}
    this.lib = {}
    this.currentIndex = 0
  }
  addInstance (element, Type) {
    const ref = element.dataset.ref || 'widget-' + this.currentIndex

    if (!this.registry[ref] && this.lib[Type]) {
      element.dataset.ref = ref
      this.registry[ref] = new this.lib[Type](element, {}, ref)
      this.registry[ref].ref = ref
      this.registry[ref].__type = Type
      this.currentIndex++
    }

    return this.registry[ref]
  }
  /**
   * Adds an object of widget classes to the registry library
   *
   * @static
   * @param {Object.<string, Class>} widgets Object of key value pair widgets to add to the library. The key is the name and the value is the Class itself
   */
  add (widgets) {
    for (let widget in widgets) {
      if (widgets.hasOwnProperty(widget)) {
        this.lib[widget] = widgets[widget]
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
  descendants (parent, fieldType) {
    let descendants = []
    const descendantWidgets = parent.querySelectorAll('[data-ref]')

    dom.each(descendantWidgets, widget => {
      let ref = widget.dataset.ref
      if (fieldType && this.registry[ref] instanceof (typeof fieldType === 'function' ? fieldType : this.lib[fieldType]) || !fieldType) {
        descendants.push(this.registry[ref])
      }
    })

    return descendants
  }
  /**
   * Get a widget instance from the registry
   *
   * @static
   * @param {string} ref Reference of the widget to fetch
   */
  get (ref) {
    return this.registry[ref]
  }
  /**
   * Removes a widget instance from the registry (doesn't remove the element t itself, just the widget instances)
   *
   * @param {string} widgetRef The ref of the widget we want to remove
   * @static
   */
  destroy (widgetRef) {
    if (widgetRef && this.registry.hasOwnProperty(widgetRef)) {
      typeof this.registry[widgetRef].beforeRemove === 'function' && this.registry[widgetRef].beforeRemove()
      delete this.registry[widgetRef]
    }
  }
  /**
   * Destroys all widget descendants of a dom element (doesn't remove the element t itself, just the widget instances)
   *
   * @param {HTMLElement} parent The parent dom element
   * @param {string|Class} widgetType The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses.
   * @static
   */
  destroyDescendants (parent, fieldType) {
    const descendants = this.descendants(parent, fieldType)
    descendants.forEach(({ref}) => this.destroy(ref))
  }
}

module.exports = new WidgetLibrary()
