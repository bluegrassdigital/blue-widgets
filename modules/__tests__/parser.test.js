import { parse } from '../parser'
import { add } from '../registry'
import Widget from '../Widget';
import jsdom from 'mocha-jsdom'
import { assert } from 'chai'

class Test extends Widget {
  onWidgetsReady() {
    this._fired = true
  }
}

describe('parser', function () {
  jsdom({
    url: 'http://localhost/',
    html: `
<div id="test1">
<div data-widget="Test"></div>
<div data-widget="Test"></div>
</div>
<div id="test2">
  <div data-test="Test"></div>
  <div data-test="Test"></div>
</div>
<div id="test3">
  <div data-order="5" data-widget="Test"><div data-order="0" data-widget="Test"></div><div data-order="1" data-widget="Test"></div></div>
  <div data-order="2" data-widget="Test"></div>
  <div data-order="4" data-widget="Test"><div data-order="3" data-widget="Test"></div></div>
</div>`,
  })
  it('should find two widget elements', function () {
    return parse(document.querySelector('#test1'))
      .then(widgets => {
        assert.equal(widgets.length, 2)
      })
  })
  it('should find 8 widget elements in the body', function () {
    return parse()
      .then(widgets => {
        assert.equal(widgets.length, 8)
      })
  })
  it('should fire onWidgetsReady method', function (done) {
    add({
      Test
    })
    parse(document.querySelector('#test1'))
      .then(instances => {
        setTimeout(() => {
          instances.forEach(instance => {
            assert.equal(instance._fired, true)
          })
          done()
        }, 50)
      })
  })
  it('should fire onWidgetsReady method', function (done) {
    add({
      Test
    })
    parse(document.querySelector('#test1'))
      .then(instances => {
        setTimeout(() => {
          instances.forEach(instance => {
            assert.equal(instance._fired, true)
          })
          done()
        }, 50)
      })
  })
  it('should accept alternate pattern matching', function (done) {
    add({
      test: Test
    })
    parse(document.querySelector('#test2'), '[data-test]', el => el.getAttribute('data-test').toLowerCase())
      .then(instances => {
        instances.forEach(instance => {
          assert.exists(instance)
        })
        done()
      })
  })
  it('should reorder widget nodes according to their number of child widgets', function (done) {
    add({
      test: Test
    })
    parse(document.querySelector('#test3'))
      .then(instances => {
        instances.forEach((instance, index) => {
          assert.equal(Number(instance.el.getAttribute('data-order')), index)
        })
        done()
      })
  })
})
