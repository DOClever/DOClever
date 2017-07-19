"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLParamElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLParamElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLParamElement, HTMLElement.interface);

Object.defineProperty(HTMLParamElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLParamElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLParamElement.prototype, "value", {
  get() {
    const value = this.getAttribute("value");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'value' property on 'HTMLParamElement': The provided value"
    });
    this.setAttribute("value", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLParamElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLParamElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLParamElement.prototype, "valueType", {
  get() {
    const value = this.getAttribute("valueType");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'valueType' property on 'HTMLParamElement': The provided value"
    });
    this.setAttribute("valueType", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLParamElement.prototype, Symbol.toStringTag, {
  value: "HTMLParamElement",
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
    throw new TypeError(`${context} is not of type 'HTMLParamElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLParamElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLParamElement.prototype);
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
  interface: HTMLParamElement,
  expose: {
    Window: { HTMLParamElement: HTMLParamElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLParamElement-impl.js");
