
/**
 * dependencies.
 */

var Emitter = require('events').EventEmitter
  , proto = Emitter.prototype;

/**
 * expsoe `mixin`
 *
 * @param {Object} obj
 */

module.exports = function (obj) {

  // mixin

  for (var k in proto) {
    obj[k] = proto[k];
  }

  // events getter.

  obj.__defineGetter__('_events', function () {
    return this.__events || (this.__events = {});
  });

  // events setter.

  obj.__defineSetter__('_events', function (val) {
    this.__events = val;
  });

  /**
   * Remove all listeners for `event`.
   *
   * if the method is executed without
   * arguments it will remove all listeners,
   * otherwise you can supply `event` or
   * `event` with `fn` for more specific stuff.
   *
   * example:
   *
   *          obj.on('foo', console.log)._events;
   *          // > { foo: fn, }
   *          obj.on('foo', console.dir)._events;
   *          // > { foo: [fn, fn] }
   *          obj.off('foo', console.log)._events;
   *          // > { foo: [fn] }
   *          obj.off('foo');
   *          // > {}
   *          obj.off();
   *          // > {}
   *
   * @param {String} event
   * @param {Function} fn
   * @return {self}
   */

  obj.off = function (event, fn) {
    switch (arguments.length) {
      case 2:
        this.removeListener(event, fn);
        return this;
      case 1:
        this.removeAllListeners(event);
        return this;
      case 0:
        this.removeAllListeners();
        return this;
    }
  };


  // all done
  return obj;
};
