"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLLabelElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLLabelElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLLabelElement, HTMLElement.interface);

Object.defineProperty(HTMLLabelElement.prototype, "form", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["form"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLabelElement.prototype, "htmlFor", {
  get() {
    const value = this.getAttribute("for");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'htmlFor' property on 'HTMLLabelElement': The provided value"
    });
    this.setAttribute("for", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLabelElement.prototype, Symbol.toStringTag, {
  value: "HTMLLabelElement",
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
    throw new TypeError(`${context} is not of type 'HTMLLabelElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLLabelElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLLabelElement.prototype);
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
  interface: HTMLLabelElement,
  expose: {
    Window: { HTMLLabelElement: HTMLLabelElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLLabelElement-impl.js");
