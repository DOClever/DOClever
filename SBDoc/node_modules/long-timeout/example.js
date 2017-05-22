var lt = require('./')

lt.setTimeout(function() {
  console.log('in a long time')
}, Number.MAX_VALUE)

lt.setTimeout(function() {
  console.log('2 seconds')
}, 2000)

