# blue-widgets

**blue-widgets** is a class-based widget library for adding complex javascript functionality to existing DOM elements

This library is developed and maintained internally at [bluegrassdigital](http://www.bluegrassdigital.com)

There are 3 main modules: `parser` `registry` and the base widget class `Widget`

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

{{>main}}

