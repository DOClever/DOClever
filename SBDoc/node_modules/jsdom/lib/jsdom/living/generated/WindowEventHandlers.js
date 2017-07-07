"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;

function WindowEventHandlers() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(WindowEventHandlers.prototype, "onafterprint", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onafterprint"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onafterprint"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onbeforeprint", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onbeforeprint"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onbeforeprint"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onbeforeunload", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onbeforeunload"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onbeforeunload"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onhashchange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onhashchange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onhashchange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onlanguagechange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onlanguagechange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onlanguagechange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onmessage", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmessage"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmessage"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onoffline", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onoffline"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onoffline"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "ononline", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ononline"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ononline"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onpagehide", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onpagehide"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onpagehide"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onpageshow", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onpageshow"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onpageshow"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onpopstate", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onpopstate"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onpopstate"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onrejectionhandled", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onrejectionhandled"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onrejectionhandled"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onstorage", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onstorage"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onstorage"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onunhandledrejection", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onunhandledrejection"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onunhandledrejection"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, "onunload", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onunload"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onunload"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(WindowEventHandlers.prototype, Symbol.toStringTag, {
  value: "WindowEventHandlers",
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
    throw new TypeError(`${context} is not of type 'WindowEventHandlers'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(WindowEventHandlers.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(WindowEventHandlers.prototype);
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
  interface: WindowEventHandlers,
  expose: {
    Window: { WindowEventHandlers: WindowEventHandlers }
  }
};
module.exports = iface;

const Impl = require("../nodes/WindowEventHandlers-impl.js");
