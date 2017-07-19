"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLOListElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLOListElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLOListElement, HTMLElement.interface);

Object.defineProperty(HTMLOListElement.prototype, "reversed", {
  get() {
    return this.hasAttribute("reversed");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'reversed' property on 'HTMLOListElement': The provided value"
    });
    if (V) {
      this.setAttribute("reversed", "");
    } else {
      this.removeAttribute("reversed");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOListElement.prototype, "start", {
  get() {
    const value = parseInt(this.getAttribute("start"));
    return isNaN(value) || value < -2147483648 || value > 2147483647 ? 0 : value;
  },
  set(V) {
    V = conversions["long"](V, {
      context: "Failed to set the 'start' property on 'HTMLOListElement': The provided value"
    });
    this.setAttribute("start", String(V));
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOListElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLOListElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOListElement.prototype, "compact", {
  get() {
    return this.hasAttribute("compact");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'compact' property on 'HTMLOListElement': The provided value"
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

Object.defineProperty(HTMLOListElement.prototype, Symbol.toStringTag, {
  value: "HTMLOListElement",
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
    throw new TypeError(`${context} is not of type 'HTMLOListElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLOListElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLOListElement.prototype);
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
  interface: HTMLOListElement,
  expose: {
    Window: { HTMLOListElement: HTMLOListElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLOListElement-impl.js");
