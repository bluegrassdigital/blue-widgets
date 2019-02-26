import { raf, rafPromise } from '../raf'
import jsdom from 'mocha-jsdom'
import { assert } from 'chai'

describe('raf', function () {
  jsdom({ url: 'http://localhost/' })
  it('raf should fire the callback', function (done) {
    raf(function () {
      done()
    })
  })
  it('rafPromise should fire the callback', function (done) {
    let run = false
    rafPromise(function () {
      run = true
    }).then(function () {
      assert.equal(run, true)
      done()
    })
  })
})
