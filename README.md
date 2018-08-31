# blue-widgets

[![Build Status](https://travis-ci.org/bluegrassdigital/blue-widgets.svg?branch=master)](https://travis-ci.org/bluegrassdigital/blue-widgets) [![npm version](https://badge.fury.io/js/blue-widgets.svg)](https://badge.fury.io/js/blue-widgets) [![Greenkeeper badge](https://badges.greenkeeper.io/bluegrassdigital/blue-widgets.svg)](https://greenkeeper.io/)

**blue-widgets** is a class-based widget library for adding complex javascript functionality to existing DOM elements

This library is developed and maintained internally at [bluegrassdigital](http://www.bluegrassdigital.com)

There are 3 main modules: `parser` `registry` and the base widget class `Widget`

## v2 breaking changes

`parser.parse` now returns a Promise, as each widget instantiation is wrapped using `requestAnimationFrame` to prevent blocking the UI during initial interaction.

Unless you're actually using the return of `parser.parse()` this will probably not impact you

## Installation

`npm install blue-widgets`

## Tutorial

Creating a basic widget

Take this html:

```html
<body>
  <div data-widget="ShowHide">
    <a href="#" data-trigger>ShowHide trigger - click me!</a>
    <div data-content>
      <p>Some example content</p>
      <p>Some more example content</p>
      <table>
        <tr>
          <td>
            test
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
```

Create our widget Class

In `./widgets/ShowHide/index.js`

```js
import { dom } from 'blue-js'
import { Widget } from 'blue-widgets'

const OPEN_CLASS = 'is-open'

class ShowHide extends Widget {
  constructor (el) {
    super(el)
    this.trigger = el.querySelector('[data-trigger]')
    this.content = el.querySelector('[data-content]')

    this.content.style.display = dom.hasClass(el, OPEN_CLASS) ? 'block' : 'none'

    this.trigger.addEventListener('click', this.onTriggerClick.bind(this), false)
  }
  onTriggerClick (event) {
    event.preventDefault()
    this.toggle()
  }
  toggle () {
    this.content.style.display = dom.hasClass(this.el, OPEN_CLASS) ? 'none' : 'block'
    dom.toggleClass(this.el, OPEN_CLASS)
  }
}

export default ShowHide
```

Add widget to registry and parse for widgets in `app.js`

```js
import { parser, registry } from 'blue-widgets'
import ShowHide from './widgets/ShowHide'

// Add widgets to the registry
registry.add({
  ShowHide
})
/* NOTE: this is the ES6 equivalent of
registry.addWidgets({
  ShowHide: ShowHide
})
*/

// Parse the dom for widget instances
parser.parse()
```

## API

## Modules

<dl>
<dt><a href="#module_parser">parser</a></dt>
<dd><p>Methods relating to parsing the dom and adding found <code>widgets</code> to the registry</p>
</dd>
<dt><a href="#module_registry">registry</a></dt>
<dd><p>Methods relating to adding widgets to the library and creating new widget instances</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Widget">Widget</a></dt>
<dd></dd>
</dl>

<a name="module_parser"></a>

## parser
Methods relating to parsing the dom and adding found `widgets` to the registry

<a name="module_parser.parse"></a>

### parser.parse(el, [pattern], [typeFn]) ⇒ <code>Promise.&lt;Array&gt;</code>
Parse an element for widget instances and add them to the registry. By default looks for elements with a `data-widget` attribute

**Kind**: static method of [<code>parser</code>](#module_parser)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A Promise fulfilled with an array of the parsed instances  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| el | <code>HTMLElement</code> |  | A dom element |
| [pattern] | <code>string</code> | <code>&quot;&#x27;[data-widget]&#x27;&quot;</code> | Optional string for setting the selector pattern to match in the querySelectorAll call |
| [typeFn] | <code>function</code> | <code>el &#x3D;&gt; el.dataset.widget</code> | Optional function for returning the type to look up in the registry' |

<a name="module_registry"></a>

## registry
Methods relating to adding widgets to the library and creating new widget instances


* [registry](#module_registry)
    * [.add(widgets)](#module_registry.add)
    * [.descendants(parent, widgetType)](#module_registry.descendants) ⇒ <code>array</code>
    * [.get(ref)](#module_registry.get)
    * [.destroy(widgetRef)](#module_registry.destroy)
    * [.destroyDescendants(parent, widgetType)](#module_registry.destroyDescendants)

<a name="module_registry.add"></a>

### registry.add(widgets)
Adds an object of widget classes to the registry library

**Kind**: static method of [<code>registry</code>](#module_registry)  

| Param | Type | Description |
| --- | --- | --- |
| widgets | <code>Object.&lt;string, Class&gt;</code> | Object of key value pair widgets to add to the library. The key is the name and the value is the Class itself |

<a name="module_registry.descendants"></a>

### registry.descendants(parent, widgetType) ⇒ <code>array</code>
Gets all descendants of the passed element.

**Kind**: static method of [<code>registry</code>](#module_registry)  
**Returns**: <code>array</code> - An array containing the matching descendants  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>HTMLElement</code> | The parent dom element |
| widgetType | <code>string</code> \| <code>Class</code> | The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses. |

<a name="module_registry.get"></a>

### registry.get(ref)
Get a widget instance from the registry

**Kind**: static method of [<code>registry</code>](#module_registry)  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>string</code> | Reference of the widget to fetch |

<a name="module_registry.destroy"></a>

### registry.destroy(widgetRef)
Removes a widget instance from the registry (doesn't remove the element t itself, just the widget instances)

**Kind**: static method of [<code>registry</code>](#module_registry)  

| Param | Type | Description |
| --- | --- | --- |
| widgetRef | <code>string</code> | The ref of the widget we want to remove |

<a name="module_registry.destroyDescendants"></a>

### registry.destroyDescendants(parent, widgetType)
Destroys all widget descendants of a dom element (doesn't remove the element t itself, just the widget instances)

**Kind**: static method of [<code>registry</code>](#module_registry)  

| Param | Type | Description |
| --- | --- | --- |
| parent | <code>HTMLElement</code> | The parent dom element |
| widgetType | <code>string</code> \| <code>Class</code> | The type of the widget - as a string will only match instances of those widget classes that are stored under that exact name - as a Class will match all widgets that are instances of that class including subclasses. |

<a name="Widget"></a>

## Widget
**Kind**: global class  

* [Widget](#Widget)
    * [new Widget(el, [opts])](#new_Widget_new)
    * [.el](#Widget+el) : <code>HTMLElement</code>
    * [.ref](#Widget+ref) : <code>String</code>
    * [.options](#Widget+options) : <code>Object</code>
    * [.getOptions()](#Widget+getOptions) ⇒ <code>Object</code>
    * [.onWidgetsReady()](#Widget+onWidgetsReady)
    * [.beforeRemove()](#Widget+beforeRemove)

<a name="new_Widget_new"></a>

### new Widget(el, [opts])
The base Widget class from which other widgets are extended. Technically the parser can create widgets using any Class at all (rather than only ones that extend off the Widget class). This base widget provides some convenience setup options and lifecycle methods that work well with the parser/registry though.


| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> | The dom node of the Widget instance |
| [opts] | <code>Object</code> | Optional options to be passed to the constructor. Only used if the widget is constructed directly (using the `new` keyword rather than using the parser) |

<a name="Widget+el"></a>

### widget.el : <code>HTMLElement</code>
The html element that the instance was created using

**Kind**: instance property of [<code>Widget</code>](#Widget)  
<a name="Widget+ref"></a>

### widget.ref : <code>String</code>
The reference of the widget in the registry. Only set if the widget was created using the parser. Defaults to the elements `data-ref` attribute - if not set the registry will automatically create a unique ref during parsing.

**Kind**: instance property of [<code>Widget</code>](#Widget)  
**Default**: <code>&#x27;The elements data-ref attribute&#x27;</code>  
**Read only**: true  
<a name="Widget+options"></a>

### widget.options : <code>Object</code>
The widget options. An object created by merging `this.getOptions()`, `opts` from the constructor, and the base elements dataset.

**Kind**: instance property of [<code>Widget</code>](#Widget)  
**Example**  
```js
class CustomWidget extends Widget {  // The default widget options  getOptions () {    return { openClass: 'is-open' }  }}// Override option in the html <div data-widget="CustomWidget" data-open-class="open">// this.options in the widget instance would be { openClass: 'open' } in this case
```
<a name="Widget+getOptions"></a>

### widget.getOptions() ⇒ <code>Object</code>
Returns the default widget options

**Kind**: instance method of [<code>Widget</code>](#Widget)  
**Returns**: <code>Object</code> - The default widget options  
<a name="Widget+onWidgetsReady"></a>

### widget.onWidgetsReady()
Lifecycle method: Fires when all widgets in the current `parse` cycle have been created

**Kind**: instance method of [<code>Widget</code>](#Widget)  
<a name="Widget+beforeRemove"></a>

### widget.beforeRemove()
Lifecycle method: Fires when a widget is destroyed using [registry.destroy](#module_registry+destroy) or [registry.destroyDescendants](#module_registry+destroyDescendants)

**Kind**: instance method of [<code>Widget</code>](#Widget)  

