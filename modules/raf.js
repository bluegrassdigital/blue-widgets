
const raf = function (callback) {
  let rafGlobal = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }

  rafGlobal = rafGlobal.bind(window)
  return rafGlobal(callback);
}

const rafPromise = function (callback) {
  return new Promise(function (resolve) {
    const newCallback = function () {
      resolve(callback())
    }
    raf(newCallback)
  })
}

export { raf, rafPromise }
