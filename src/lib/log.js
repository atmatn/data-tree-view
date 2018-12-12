import _ from 'underscore'
import $ from 'jquery'
var allowedAttrs = []
$.ajax({
  url: '/api/all-log-attrs',
  success: (res) => {
    allowedAttrs = res.allowedAttrs
    console.log('allowed attrs: ' + JSON.stringify(allowedAttrs))
  }
})

const log = function (eventId, attrs) {
  let map = {}
  map['event_id'] = eventId
  for (let key in attrs) {
    if (!_.contains(allowedAttrs, key)) {
      console.log('not allowed key: ' + key)
    }
    map[key] = attrs[key]
  }
  console.log('logging event: ' + eventId + JSON.stringify(attrs))
  $.get('/log', map)
}

export default log
