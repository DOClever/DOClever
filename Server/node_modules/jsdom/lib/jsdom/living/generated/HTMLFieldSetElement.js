"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLFieldSetElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLFieldSetElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLFieldSetElement, HTMLElement.interface);

Object.defineProperty(HTMLFieldSetElement.prototype, "disabled", {
  get() {
    return this.hasAttribute("disabled");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'disabled' property on 'HTMLFieldSetElement': The provided value"
    });
    if (V) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFieldSetElement.prototype, "form", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["form"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFieldSetElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLFieldSetElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFieldSetElement.prototype, Symbol.toStringTag, {
  value: "HTMLFieldSetElement",
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
    throw new TypeError(`${context} is not of type 'HTMLFieldSetElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLFieldSetElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLFieldSetElement.prototype);
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
  interface: HTMLFieldSetElement,
  expose: {
    Window: { HTMLFieldSetElement: HTMLFieldSetElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLFieldSetElement-impl.js");
