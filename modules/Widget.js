import getData from './getData'
import extend from './extend'

/**
 * The base Widget class from which other widgets are extended. Technically the parser can create widgets using any Class at all (rather than only ones that extend off the Widget class). This base widget provides some convenience setup options and lifecycle methods that work well with the parser/registry though.
 * @class
 * @param {HTMLElement} el The dom node of the Widget instance
 * @param {Object} [opts] Optional options to be passed to the constructor. Only used if the widget is constructed directly (using the `new` keyword rather than using the parser)
 */
var Widget = function (el, opts, ref) {
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
  var datasetOptions = ref ? {} : getData(this.el)
  this.options = extend(this.getOptions(), opts, datasetOptions)
}
/**
 * Returns the default widget options
 *
 * @returns {Object} The default widget options
 */
Widget.prototype.getOptions = function () {
  return {}
}
/**
 * Lifecycle method: Fires when all widgets in the current `parse` cycle have been created
 */
Widget.prototype.onWidgetsReady = function () {
  return false
}
/**
 * Lifecycle method: Fires when a widget is destroyed using [registry.destroy]{@link #module_registry+destroy} or [registry.destroyDescendants]{@link #module_registry+destroyDescendants}
 */
Widget.prototype.beforeRemove = function () {
  return false
}

export default Widget
