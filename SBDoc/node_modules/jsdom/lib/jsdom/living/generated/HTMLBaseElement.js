"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLBaseElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLBaseElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLBaseElement, HTMLElement.interface);

Object.defineProperty(HTMLBaseElement.prototype, "href", {
  get() {
    return this[impl]["href"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'href' property on 'HTMLBaseElement': The provided value"
    });
    this[impl]["href"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLBaseElement.prototype, "target", {
  get() {
    const value = this.getAttribute("target");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'target' property on 'HTMLBaseElement': The provided value"
    });
    this.setAttribute("target", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLBaseElement.prototype, Symbol.toStringTag, {
  value: "HTMLBaseElement",
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
    throw new TypeError(`${context} is not of type 'HTMLBaseElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLBaseElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLBaseElement.prototype);
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
  interface: HTMLBaseElement,
  expose: {
    Window: { HTMLBaseElement: HTMLBaseElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLBaseElement-impl.js");
