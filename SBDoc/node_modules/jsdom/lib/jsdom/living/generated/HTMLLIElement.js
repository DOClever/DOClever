"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLLIElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLLIElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLLIElement, HTMLElement.interface);

Object.defineProperty(HTMLLIElement.prototype, "value", {
  get() {
    const value = parseInt(this.getAttribute("value"));
    return isNaN(value) || value < -2147483648 || value > 2147483647 ? 0 : value;
  },
  set(V) {
    V = conversions["long"](V, {
      context: "Failed to set the 'value' property on 'HTMLLIElement': The provided value"
    });
    this.setAttribute("value", String(V));
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLIElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLLIElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLIElement.prototype, Symbol.toStringTag, {
  value: "HTMLLIElement",
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
    throw new TypeError(`${context} is not of type 'HTMLLIElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLLIElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLLIElement.prototype);
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
  interface: HTMLLIElement,
  expose: {
    Window: { HTMLLIElement: HTMLLIElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLLIElement-impl.js");
