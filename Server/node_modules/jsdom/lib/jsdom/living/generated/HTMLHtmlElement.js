"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLHtmlElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLHtmlElement, HTMLElement.interface);

Object.defineProperty(HTMLHtmlElement.prototype, "version", {
  get() {
    const value = this.getAttribute("version");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'version' property on 'HTMLHtmlElement': The provided value"
    });
    this.setAttribute("version", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLHtmlElement.prototype, Symbol.toStringTag, {
  value: "HTMLHtmlElement",
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
    throw new TypeError(`${context} is not of type 'HTMLHtmlElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLHtmlElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLHtmlElement.prototype);
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
  interface: HTMLHtmlElement,
  expose: {
    Window: { HTMLHtmlElement: HTMLHtmlElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLHtmlElement-impl.js");
