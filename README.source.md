# blue-widgets

[![Build Status](https://travis-ci.org/bluegrassdigital/blue-widgets.svg?branch=master)](https://travis-ci.org/bluegrassdigital/blue-widgets) [![npm version](https://badge.fury.io/js/blue-widgets.svg)](https://badge.fury.io/js/blue-widgets) [![Greenkeeper badge](https://badges.greenkeeper.io/bluegrassdigital/blue-widgets.svg)](https://greenkeeper.io/) [![gzip size](http://img.badgesize.io/https://unpkg.com/blue-widgets/dist/blue-widgets.umd.js?compression=gzip)](https://unpkg.com/blue-widgets/dist/blue-widgets.umd.js) [![codecov](https://codecov.io/gh/bluegrassdigital/blue-widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/bluegrassdigital/blue-widgets)

blue-widgets** is a class-based widget library for adding complex javascript functionality to existing DOM elements

## v3 breaking changes

WeakMap() support required

Parse order has changed of the widgets in order to better support composeability. So whereas before widgets were parsed in the order they were discovered, now descendant widgets are parsed first. So if I now call getDescendants in the onWidgetsReady lifecycle method, all descendants will have already been initialised.

## Browser Support

IE11+ and all other modern browsers out of the box. For support down to IE9 you'll need to polyfill `WeakMap()`

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
import { hasClass, toggleClass } from 'blue-js'
import { Widget } from 'blue-widgets'

const OPEN_CLASS = 'is-open'

class ShowHide extends Widget {
  constructor (el) {
    super(el)
    this.trigger = el.querySelector('[data-trigger]')
    this.content = el.querySelector('[data-content]')

    this.content.style.display = hasClass(el, OPEN_CLASS) ? 'block' : 'none'

    this.trigger.addEventListener('click', this.onTriggerClick.bind(this), false)
  }
  onTriggerClick (event) {
    event.preventDefault()
    this.toggle()
  }
  toggle () {
    this.content.style.display = hasClass(this.el, OPEN_CLASS) ? 'none' : 'block'
    toggleClass(this.el, OPEN_CLASS)
  }
}

export default ShowHide
```

Add widget to registry and parse for widgets in `app.js`

```js
import { defineWidgets, parse } from 'blue-widgets'
import ShowHide from './widgets/ShowHide'

// Add widgets to the registry
defineWidgets({
  ShowHide
})
/* NOTE: this is the ES6 equivalent of
defineWidgets({
  ShowHide: ShowHide
})
*/

// Parse the dom for widget instances
parse()
```

## API

{{>main}}

