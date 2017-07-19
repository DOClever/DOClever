
var TIMEOUT_MAX = 2147483647; // 2^31-1

exports.setTimeout = function(listener, after) {
  return new Timeout(listener, after)
}
exports.clearTimeout = function(timer) {
  if (timer) timer.close()
}

exports.Timeout = Timeout

function Timeout(listener, after) {
  this.listener = listener
  this.after = after
  this.start()
}

Timeout.prototype.start = function() {
  if (this.after <= TIMEOUT_MAX) {
    this.timeout = setTimeout(this.listener, this.after)
  } else {
    var self = this
    this.timeout = setTimeout(function() {
      self.after -= TIMEOUT_MAX
      self.start()
    }, TIMEOUT_MAX)
  }
}

Timeout.prototype.close = function() {
  clearTimeout(this.timeout)
}
