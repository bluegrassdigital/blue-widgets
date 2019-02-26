import { assert } from 'chai';
import jsdom from 'mocha-jsdom';
import getData, { castData } from '../getData';

describe('castData', function () {
  it('should cast number strings to numbers', function () {
    assert.equal(castData('1'), 1);
  })
  it('should keep text strings as strings', function () {
    assert.equal(castData('1s'), '1s');
  })
  it('should cast null string to null', function () {
    assert.equal(castData('null'), null);
  })
  it('should cast false string to false', function () {
    assert.equal(castData('false'), false);
  })
  it('should cast true string to true', function () {
    assert.equal(castData('true'), true);
  })
  it('should cast JSON string to an object', function () {
    assert.equal(castData('{"foo":"bar"}').foo, 'bar');
  })
})

describe('getData', function () {
  jsdom({
    url: 'http://localhost/',
    html: `
<div id="test" data-foo-foo="bar" data-test="1" data-blah="null" data-bar='{"foo":false}'></div>`,
  })
  it('should return an object with the correct types', function () {
    const get = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'dataset').get
    delete window.HTMLElement.prototype.dataset
    const data = getData(document.querySelector('#test'))
    Object.defineProperty(window.HTMLElement.prototype, 'dataset', {
      get
    })
    assert.deepEqual(data, {
      fooFoo: 'bar',
      test: 1,
      blah: null,
      bar: {
        foo: false,
      }
    })
  })
})
