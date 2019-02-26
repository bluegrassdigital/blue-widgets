import { assert } from 'chai'
import jsdom from 'mocha-jsdom';
import Widget from '../Widget';

class Foo extends Widget {
  getOptions() {
    return {
      fooFoo: 'baz',
      test: 2,
    }
  }
}

describe('Widget', function () {
  jsdom({
    url: 'http://localhost/',
    html: `
<div data-ref="test" data-foo-foo="bar" data-test="1" data-blah="null" data-bar='{"foo":false}'></div>`,
  })
  it('should shallow merge options from the getOptions method, the constructor, and the dataset in that order', function () {
    this.timeout(5000)

    const instance = new Foo(document.querySelector('[data-ref=test]'), { test: 3, bar: 'test' })

    assert.deepEqual(instance.options, { fooFoo: 'bar', bar: { foo :false }, ref: 'test', blah: null, test: 1 });
  })
  it('should ignore the dataset options if constructor is passed a ref (to prevent double merge form the registry creation', function () {
    const instance = new Foo(document.querySelector('[data-ref=test]'), { test: 3, bar: 'test' }, 'boo')

    assert.deepEqual(instance.options, { fooFoo: 'baz', bar: 'test', test: 3 });
  })
})
