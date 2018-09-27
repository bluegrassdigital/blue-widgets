import getData from './getData'
import { rafPromise } from './raf'

export const registry = new WeakMap()
export const lib = {}
export let currentIndex = 0

export function addInstanceSync (element, Type) {
  var props

  if (lib[Type]) {
    var ref = element.getAttribute('data-ref') || 'widget-' + currentIndex
    element.setAttribute('data-ref', ref)
    props = {
      instance: new lib[Type](element, getData(element), ref),
      ref: ref
    }
    registry.set(element, props)
    currentIndex++
  }

  return props && props.instance
}

export function addInstance (element, Type) {
  return rafPromise(addInstanceSync.bind(window, element, Type))
}

export function add (widgets) {
  for (var widget in widgets) {
    if (widgets.hasOwnProperty(widget)) {
      lib[widget] = widgets[widget]
    }
  }
}

export function descendants (parent, fieldType) {
  var d = []
  var descendantWidgets = parent.querySelectorAll('[data-ref]')

  for (var i = 0; i < descendantWidgets.length; i++) {
    var widget = descendantWidgets[i]
    var instance = registry.get(widget)
    var isMatch = fieldType ? instance && instance.instance instanceof (typeof fieldType === 'function' ? fieldType : lib[fieldType]) : true
    if (isMatch) {
      d.push(instance.instance)
    }
  }

  return d
}

export function get (key) {
  const mapItem = registry.get(getKey(key))
  return mapItem && mapItem.instance
}

function getKey (key) {
  return typeof key === 'string' ? document.querySelector('[data-ref=' + key + ']') : key
}

export function destroy (widgetRef, recursive = true) {
  var widgetEl = getKey(widgetRef)
  var widget = registry.get(widgetEl)
  if (widget) {
    typeof widget.instance.beforeRemove === 'function' && widget.instance.beforeRemove()
    registry.delete(widgetEl)
    if (recursive) destroyDescendants(widgetEl)
  }
}

export function destroyDescendants (parent, fieldType) {
  var d = descendants(parent, fieldType)
  d.forEach(function (w) {
    destroy(w.el)
  })
}
