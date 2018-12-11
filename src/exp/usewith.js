export const tryWith = function () {
  console.log('let us start!')
  var s = `
  var o = {a: 1, b: 2}
  with (o) {
    console.log(a)
  }
  `
  eval(s)
}
