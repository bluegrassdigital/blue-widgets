import extend from '../extend'
import { assert } from 'chai'

describe('extend', function () {
  it('should ignore non iterable arguments', function () {
    this.timeout(5000)
    const final = extend({ foo: 'bar' }, null, 3, ['fire', 'flies'], { bar: 'test' });
    assert.deepEqual(final, { foo: 'bar', bar: 'test', '0': 'fire', '1': 'flies' });
  })
})
