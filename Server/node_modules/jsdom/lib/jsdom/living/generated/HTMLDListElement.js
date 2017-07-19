"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLDListElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLDListElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLDListElement, HTMLElement.interface);

Object.defineProperty(HTMLDListElement.prototype, "compact", {
  get() {
    return this.hasAttribute("compact");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'compact' property on 'HTMLDListElement': The provided value"
    });
    if (V) {
      this.setAttribute("compact", "");
    } else {
      this.removeAttribute("compact");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLDListElement.prototype, Symbol.toStringTag, {
  value: "HTMLDListElement",
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
    throw new TypeError(`${context} is not of type 'HTMLDListElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLDListElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLDListElement.prototype);
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
  interface: HTMLDListElement,
  expose: {
    Window: { HTMLDListElement: HTMLDListElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLDListElement-impl.js");
