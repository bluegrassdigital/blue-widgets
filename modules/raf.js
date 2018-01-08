
let raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }

raf = raf.bind(window)

const rafPromise = function (callback) {
  return new Promise(function (resolve) {
    const newCallback = function () {
      resolve(callback())
    }
    raf(newCallback)
  })
}

export { raf, rafPromise }
