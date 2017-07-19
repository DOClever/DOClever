"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;

function Location() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(Location.prototype, Symbol.toStringTag, {
  value: "Location",
  writable: false,
  enumerable: false,
  configurable: true
});

const iface = {
  mixedInto: [],
  is(obj) {
    if (obj) {
      if (obj[impl] instanceof Impl.implementation) {
        return true;
      }
      for (let i = 0; i < module.exports.mixedInto.length; ++i) {
        if (obj instanceof module.exports.mixedInto[i]) {
          return true;
        }
      }
    }
    return false;
  },
  isImpl(obj) {
    if (obj) {
      if (obj instanceof Impl.implementation) {
        return true;
      }

      const wrapper = utils.wrapperForImpl(obj);
      for (let i = 0; i < module.exports.mixedInto.length; ++i) {
        if (wrapper instanceof module.exports.mixedInto[i]) {
          return true;
        }
      }
    }
    return false;
  },
  convert(obj, { context = "The provided value" } = {}) {
    if (module.exports.is(obj)) {
      return utils.implForWrapper(obj);
    }
    throw new TypeError(`${context} is not of type 'Location'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(Location.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(Location.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Object.defineProperty(obj, "href", {
      get() {
        return obj[impl]["href"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'href' property on 'Location': The provided value"
        });
        obj[impl]["href"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "toString", {
      writable: false,
      enumerable: true,
      configurable: false,
      value: function toString() {
        if (!this || !module.exports.is(this)) {
          throw new TypeError("Illegal invocation");
        }
        return obj[impl]["href"];
      }
    });

    Object.defineProperty(obj, "origin", {
      get() {
        return obj[impl]["origin"];
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "protocol", {
      get() {
        return obj[impl]["protocol"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'protocol' property on 'Location': The provided value"
        });
        obj[impl]["protocol"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "host", {
      get() {
        return obj[impl]["host"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'host' property on 'Location': The provided value"
        });
        obj[impl]["host"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "hostname", {
      get() {
        return obj[impl]["hostname"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'hostname' property on 'Location': The provided value"
        });
        obj[impl]["hostname"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "port", {
      get() {
        return obj[impl]["port"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'port' property on 'Location': The provided value"
        });
        obj[impl]["port"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "pathname", {
      get() {
        return obj[impl]["pathname"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'pathname' property on 'Location': The provided value"
        });
        obj[impl]["pathname"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "search", {
      get() {
        return obj[impl]["search"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'search' property on 'Location': The provided value"
        });
        obj[impl]["search"] = V;
      },
      enumerable: true,
      configurable: false
    });

    Object.defineProperty(obj, "hash", {
      get() {
        return obj[impl]["hash"];
      },
      set(V) {
        V = conversions["USVString"](V, {
          context: "Failed to set the 'hash' property on 'Location': The provided value"
        });
        obj[impl]["hash"] = V;
      },
      enumerable: true,
      configurable: false
    });

    obj.assign = function assign(url) {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'assign' on 'Location': 1 argument required, but only " + arguments.length + " present."
        );
      }

      const args = [];
      for (let i = 0; i < arguments.length && i < 1; ++i) {
        args[i] = arguments[i];
      }
      args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'assign' on 'Location': parameter 1" });
      return this[impl].assign(...args);
    };

    obj.replace = function replace(url) {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'replace' on 'Location': 1 argument required, but only " + arguments.length + " present."
        );
      }

      const args = [];
      for (let i = 0; i < arguments.length && i < 1; ++i) {
        args[i] = arguments[i];
      }
      args[0] = conversions["USVString"](args[0], {
        context: "Failed to execute 'replace' on 'Location': parameter 1"
      });
      return this[impl].replace(...args);
    };

    obj.reload = function reload() {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl].reload();
    };
  },
  setup(obj, constructorArgs, privateData) {
    if (!privateData) privateData = {};
    privateData.wrapper = obj;

    this._internalSetup(obj);

    Object.defineProperty(obj, impl, {
      value: new Impl.implementation(constructorArgs, privateData),
      writable: false,
      enumerable: false,
      configurable: true
    });
    obj[impl][utils.wrapperSymbol] = obj;
  },
  interface: Location,
  expose: {
    Window: { Location: Location }
  }
};
module.exports = iface;

const Impl = require("../window/Location-impl.js");
