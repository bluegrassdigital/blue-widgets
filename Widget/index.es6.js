import datasetPolyfill from 'element-dataset'
datasetPolyfill()

const fnTest = /xyz/.test(function () {
  let xyz
  xyz
}) ? /\b_super\b/ : /.*/
/**
 * The base Widget class from which other widgets are extended. Technically the parser can create widgets using any Class at all (rather than only ones that extend off the Widget class). This base widget provides some convenience setup options and lifecycle methods that work well with the parser/registry though.
 * @class
 * @param {HTMLElement} el The dom node of the Widget instance
 * @param {Object} [opts] Optional options to be passed to the constructor. Only used if the widget is constructed directly (using the `new` keyword rather than using the parser)
 */
class Widget {
  constructor (el, opts = {}, ref) {
    /**
     * The html element that the instance was created using
     *
     * @name Widget#el
     * @type HTMLElement
     */
    this.el = el
    /**
     * The reference of the widget in the registry. Only set if the widget was created using the parser. Defaults to the elements `data-ref` attribute - if not set the registry will automatically create a unique ref during parsing.
     *
     * @name Widget#ref
     * @type String
     * @default 'The elements data-ref attribute'
     * @readonly
     */
    this.ref = ref
    /**
     * The widget options. An object created by merging `this.getOptions()`, `opts` from the constructor, and the base elements dataset.
     *
     * @name Widget#options
     * @type Object
     * @example
     * class CustomWidget extends Widget {
     *   // The default widget options
     *   getOptions () {
     *     return { openClass: 'is-open' }
     *   }
     * }
     *
     * // Override option in the html <div data-widget="CustomWidget" data-open-class="open">
     * // this.options in the widget instance would be { openClass: 'open' } in this case
     */
    this.options = {...this.getOptions(), ...opts, ...this.el.dataset}

    if (typeof this.init === 'function') {
      this.init.apply(this, arguments)
    }
  }
  /**
   * Returns the default widget options
   *
   * @returns {Object} The default widget options
   */
  getOptions () {
    return {}
  }
  /**
   * Lifecycle method: Fires when all widgets in the current `parse` cycle have been created
   */
  onWidgetsReady () {
    return false
  }
  /**
   * Lifecycle method: Fires when a widget is destroyed using [registry.destroy]{@link #module_registry+destroy} or [registry.destroyDescendants]{@link #module_registry+destroyDescendants}
   */
  beforeRemove () {
    return false
  }
}

/**
 * Static extend method (ES5 usage for SubClassing)
 *
 * @memberof Widget
 * @static
 * @example
 * var Widget = require('blue-widgets').Widget
 *
 * var SomeWidget = Widget.extend({
 *   init: function (el) {
 *     // Perform widget initialisation (in place of using class constructor)
 *   }
 * })
 */
Widget.extend = function (props) {
  var _super = this.prototype
  var w = this

  // Set up the prototype to inherit from the base class
  // (but without running the init constructor)
  var proto = Object.create(_super)

  // Copy the properties over onto the new prototype
  for (var name in props) {
    // Check if we're overwriting an existing function
    proto[name] = typeof props[name] === 'function' &&
      typeof _super[name] === 'function' && fnTest.test(props[name]) ? (function (name, fn) {
        return function () {
          var tmp = this._super

          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name]

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments)
          this._super = tmp

          return ret
        }
      })(name, props[name]) : props[name]
  }

  // The new constructor
  var newClass = function EmptyClass (el) {
    w.call(this, el)
  }

  // Populate our constructed prototype object
  newClass.prototype = proto

  // Enforce the constructor to be what we expect
  proto.constructor = newClass

  // And make this class extendable
  newClass.extend = this.extend

  return newClass
}

module.exports = Widget
