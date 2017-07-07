"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLSourceElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLSourceElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLSourceElement, HTMLElement.interface);

Object.defineProperty(HTMLSourceElement.prototype, "src", {
  get() {
    return this[impl]["src"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'src' property on 'HTMLSourceElement': The provided value"
    });
    this[impl]["src"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLSourceElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLSourceElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLSourceElement.prototype, "srcset", {
  get() {
    const value = this.getAttribute("srcset");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'srcset' property on 'HTMLSourceElement': The provided value"
    });
    this.setAttribute("srcset", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLSourceElement.prototype, "sizes", {
  get() {
    const value = this.getAttribute("sizes");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'sizes' property on 'HTMLSourceElement': The provided value"
    });
    this.setAttribute("sizes", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLSourceElement.prototype, "media", {
  get() {
    const value = this.getAttribute("media");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'media' property on 'HTMLSourceElement': The provided value"
    });
    this.setAttribute("media", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLSourceElement.prototype, Symbol.toStringTag, {
  value: "HTMLSourceElement",
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
    throw new TypeError(`${context} is not of type 'HTMLSourceElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLSourceElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLSourceElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    HTMLElement._internalSetup(obj);
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
  interface: HTMLSourceElement,
  expose: {
    Window: { HTMLSourceElement: HTMLSourceElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLSourceElement-impl.js");
