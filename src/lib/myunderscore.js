import _ from 'underscore'
let oldTemplate = _.template
let newTemplate = function (a, b) {
  // debugger
  if (b === undefined) {
    return oldTemplate(a)
  } else {
    return (oldTemplate(a))(b)
  }
}
_.template = newTemplate
export default _
