"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLDialogElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLDialogElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLDialogElement, HTMLElement.interface);

Object.defineProperty(HTMLDialogElement.prototype, "open", {
  get() {
    return this.hasAttribute("open");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'open' property on 'HTMLDialogElement': The provided value"
    });
    if (V) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLDialogElement.prototype, Symbol.toStringTag, {
  value: "HTMLDialogElement",
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
    throw new TypeError(`${context} is not of type 'HTMLDialogElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLDialogElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLDialogElement.prototype);
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
  interface: HTMLDialogElement,
  expose: {
    Window: { HTMLDialogElement: HTMLDialogElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLDialogElement-impl.js");
