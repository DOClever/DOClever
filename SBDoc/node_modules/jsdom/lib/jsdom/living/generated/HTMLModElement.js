"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLModElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLModElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLModElement, HTMLElement.interface);

Object.defineProperty(HTMLModElement.prototype, "cite", {
  get() {
    const value = this.getAttribute("cite");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'cite' property on 'HTMLModElement': The provided value"
    });
    this.setAttribute("cite", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLModElement.prototype, "dateTime", {
  get() {
    const value = this.getAttribute("dateTime");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'dateTime' property on 'HTMLModElement': The provided value"
    });
    this.setAttribute("dateTime", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLModElement.prototype, Symbol.toStringTag, {
  value: "HTMLModElement",
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
    throw new TypeError(`${context} is not of type 'HTMLModElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLModElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLModElement.prototype);
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
  interface: HTMLModElement,
  expose: {
    Window: { HTMLModElement: HTMLModElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLModElement-impl.js");
