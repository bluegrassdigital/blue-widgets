import { assert } from 'chai'
import jsdom from 'mocha-jsdom';
import Widget from '../Widget';
import * as registry from '../registry';
import { parse } from '../parser';

let test = 0

class Foo extends Widget {
  beforeRemove() {
    test = 1
  }
  getOptions() {
    return {
      fooFoo: 'baz',
      test: 2,
    }
  }
}

describe('registry:add', function () {
  it('should add new widget definitions to the registry', function () {
    registry.add({
      Foo,
    })
    assert.include(registry.lib, { Foo });
  })
  it('should add new widget definitions to the registry even if not on a plain object', function () {
    function Bar() {
      this.Foo2 = Foo
    }
    Bar.prototype.Baz = 'test'
    registry.add(new Bar())
    assert.include(registry.lib, { Foo });
  })
  it('should add new widget definitions to the registry', function () {
    registry.add({
      Foo,
    })
    assert.include(registry.lib, { Foo });
  })
})

describe('registry:addInstance', function () {
  jsdom({
    url: 'http://localhost/',
  })
  it('should create a new instance', function (done) {
    const el = document.createElement('div')
    el.setAttribute('data-ref', 'ref1')
    registry.addInstance(el, 'Foo')
    setTimeout(() => {
      assert.equal(registry.registry.get(el).instance.el, el)
      assert.equal(registry.registry.get(el).ref, 'ref1')
      done()
    }, 50)
  })
})

describe('registry:descendants', function () {
  jsdom({
    url: 'http://localhost/',
    html: `
  <div id="blah" data-widget="Foo">
    <div data-widget="Foo"></div>
    <div data-widget="Foo"></div>
    <div data-widget="Foo"><div data-widget="Foo"></div></div>
    <div data-widget="Test"></div>
  </div>`,
  })
  it('should find 5 descendants', function (done) {
    parse()
    setTimeout(() => {
      assert.equal(registry.descendants(document.getElementById('blah')).length, 5)
      done()
    }, 50)
  })
  it('should find 4 descendants of type Foo if passed as Class', function (done) {
    parse()
    setTimeout(() => {
      assert.equal(registry.descendants(document.getElementById('blah'), Foo).length, 4)
      done()
    }, 50)
  })
  it('should find 4 descendants of type Foo if passed as string', function (done) {
    parse()
    setTimeout(() => {
      assert.equal(registry.descendants(document.getElementById('blah'), 'Foo').length, 4)
      done()
    }, 50)
  })
})

describe('registry:destroyDescendants', function () {
  jsdom({
    url: 'http://localhost/',
    html: `
  <div id="blah" data-widget="Foo">
    <div data-widget="Foo"></div>
    <div data-widget="Foo"></div>
    <div data-widget="Foo"><div data-widget="Foo"><div data-widget="Foo"></div></div><div data-widget="Foo"></div></div>
    <div data-widget="Test"></div>
  </div>`,
  })
  it('should destroy all a widgets descendant instances', function (done) {
    parse()

    setTimeout(() => {
      registry.destroyDescendants(document.getElementById('blah'))
      assert.equal(registry.descendants(document.getElementById('blah')).length, 0)
      done()
    }, 50)
  })
  it('should not destroy all a widgets descendant instances if recursive is false', function (done) {
    parse()

    setTimeout(() => {
      const length = registry.descendants(document.documentElement).length
      registry.destroy(document.getElementById('blah'), false)
      assert.equal(registry.descendants(document.documentElement).length, length - 1)
      done()
    }, 50)
  })
})

describe('registry:get', function () {
  jsdom({
    url: 'http://localhost/',
  })
  it('should return an instance if passed a data-ref string', function (done) {
    const el = document.createElement('div')
    el.setAttribute('data-ref', 'foo')
    el.setAttribute('data-widget', 'Foo')
    document.body.appendChild(el)
    parse()
    setTimeout(() => {
      assert.instanceOf(registry.get('foo'), Foo)
      assert.equal(registry.get('foo').ref, 'foo')
      done()
    }, 50)
  })
  it('should return an instance if passed a html element as a key', function (done) {
    const el = document.createElement('div')
    el.setAttribute('data-ref', 'foo')
    el.setAttribute('data-widget', 'Foo')
    document.body.appendChild(el)
    parse()
    setTimeout(() => {
      assert.instanceOf(registry.get(el), Foo)
      done()
    }, 50)
  })
})
