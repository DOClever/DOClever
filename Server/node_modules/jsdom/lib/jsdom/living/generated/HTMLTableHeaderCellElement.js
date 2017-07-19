"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLTableCellElement = require("./HTMLTableCellElement.js");
const impl = utils.implSymbol;

function HTMLTableHeaderCellElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLTableHeaderCellElement.prototype, HTMLTableCellElement.interface.prototype);
Object.setPrototypeOf(HTMLTableHeaderCellElement, HTMLTableCellElement.interface);

Object.defineProperty(HTMLTableHeaderCellElement.prototype, "scope", {
  get() {
    const value = this.getAttribute("scope");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'scope' property on 'HTMLTableHeaderCellElement': The provided value"
    });
    this.setAttribute("scope", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableHeaderCellElement.prototype, "abbr", {
  get() {
    const value = this.getAttribute("abbr");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'abbr' property on 'HTMLTableHeaderCellElement': The provided value"
    });
    this.setAttribute("abbr", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableHeaderCellElement.prototype, "sorted", {
  get() {
    const value = this.getAttribute("sorted");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'sorted' property on 'HTMLTableHeaderCellElement': The provided value"
    });
    this.setAttribute("sorted", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableHeaderCellElement.prototype, Symbol.toStringTag, {
  value: "HTMLTableHeaderCellElement",
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
    throw new TypeError(`${context} is not of type 'HTMLTableHeaderCellElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableHeaderCellElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableHeaderCellElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    HTMLTableCellElement._internalSetup(obj);
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
  interface: HTMLTableHeaderCellElement,
  expose: {
    Window: { HTMLTableHeaderCellElement: HTMLTableHeaderCellElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLTableHeaderCellElement-impl.js");
