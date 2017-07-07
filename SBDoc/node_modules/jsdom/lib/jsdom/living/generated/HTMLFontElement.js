"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLFontElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLFontElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLFontElement, HTMLElement.interface);

Object.defineProperty(HTMLFontElement.prototype, "color", {
  get() {
    const value = this.getAttribute("color");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'color' property on 'HTMLFontElement': The provided value",
      treatNullAsEmptyString: true
    });
    this.setAttribute("color", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFontElement.prototype, "face", {
  get() {
    const value = this.getAttribute("face");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'face' property on 'HTMLFontElement': The provided value"
    });
    this.setAttribute("face", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFontElement.prototype, "size", {
  get() {
    const value = this.getAttribute("size");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'size' property on 'HTMLFontElement': The provided value"
    });
    this.setAttribute("size", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFontElement.prototype, Symbol.toStringTag, {
  value: "HTMLFontElement",
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
    throw new TypeError(`${context} is not of type 'HTMLFontElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLFontElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLFontElement.prototype);
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
  interface: HTMLFontElement,
  expose: {
    Window: { HTMLFontElement: HTMLFontElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLFontElement-impl.js");
