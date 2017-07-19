(function () {
  "use strict";

  function isSequence(obj) {
    return obj instanceof Sequence;
  }

  function Sequence(global_context) {
    var self = this,
      waiting = true,
      data,
      stack = [];

    if (!isSequence(this)) {
      return new Sequence(global_context);
    }

    global_context = global_context || null;

    function next() {
      var args = Array.prototype.slice.call(arguments),
        seq = stack.shift(); // BUG this will eventually leak

      data = arguments;

      if (!seq) {
        // the chain has ended (for now)
        waiting = true;
        return;
      }

      args.unshift(next);
      seq.callback.apply(seq.context, args);
    }

    function then(callback, context) {
      if ('function' !== typeof callback) {
        throw new Error("`Sequence().then(callback [context])` requires that `callback` be a function and that `context` be `null`, an object, or a function");
      }
      stack.push({
        callback: callback,
        context: (null === context ? null : context || global_context),
        index: stack.length
      });

      // if the chain has stopped, start it back up
      if (waiting) {
        waiting = false;
        next.apply(null, data);
      }

      return self;
    }

    self.next = next;
    self.then = then;
  }

  function createSequence(context) {
    // TODO use prototype instead of new
    return (new Sequence(context));
  }
  Sequence.create = createSequence;
  Sequence.isSequence = isSequence;
  module.exports = Sequence;
}());
