"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;

function HTMLHyperlinkElementUtils() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "href", {
  get() {
    return this[impl]["href"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'href' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["href"] = V;
  },
  enumerable: true,
  configurable: true
});

HTMLHyperlinkElementUtils.prototype.toString = function toString() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl]["href"];
};

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "origin", {
  get() {
    return this[impl]["origin"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "protocol", {
  get() {
    return this[impl]["protocol"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'protocol' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["protocol"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "username", {
  get() {
    return this[impl]["username"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'username' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["username"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "password", {
  get() {
    return this[impl]["password"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'password' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["password"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "host", {
  get() {
    return this[impl]["host"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'host' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["host"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "hostname", {
  get() {
    return this[impl]["hostname"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'hostname' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["hostname"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "port", {
  get() {
    return this[impl]["port"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'port' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["port"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "pathname", {
  get() {
    return this[impl]["pathname"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'pathname' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["pathname"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "search", {
  get() {
    return this[impl]["search"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'search' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["search"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, "hash", {
  get() {
    return this[impl]["hash"];
  },
  set(V) {
    V = conversions["USVString"](V, {
      context: "Failed to set the 'hash' property on 'HTMLHyperlinkElementUtils': The provided value"
    });
    this[impl]["hash"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHyperlinkElementUtils.prototype, Symbol.toStringTag, {
  value: "HTMLHyperlinkElementUtils",
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
    throw new TypeError(`${context} is not of type 'HTMLHyperlinkElementUtils'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLHyperlinkElementUtils.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLHyperlinkElementUtils.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {},
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
  interface: HTMLHyperlinkElementUtils,
  expose: {}
};
module.exports = iface;

const Impl = require("../nodes/HTMLHyperlinkElementUtils-impl.js");
