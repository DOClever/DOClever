"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLMediaElement = require("./HTMLMediaElement.js");
const impl = utils.implSymbol;

function HTMLVideoElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLVideoElement.prototype, HTMLMediaElement.interface.prototype);
Object.setPrototypeOf(HTMLVideoElement, HTMLMediaElement.interface);

Object.defineProperty(HTMLVideoElement.prototype, "width", {
  get() {
    const value = parseInt(this.getAttribute("width"));
    return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'width' property on 'HTMLVideoElement': The provided value"
    });
    V = V > 2147483647 ? 0 : V;
    this.setAttribute("width", String(V));
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLVideoElement.prototype, "height", {
  get() {
    const value = parseInt(this.getAttribute("height"));
    return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'height' property on 'HTMLVideoElement': The provided value"
    });
    V = V > 2147483647 ? 0 : V;
    this.setAttribute("height", String(V));
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", {
  get() {
    return this[impl]["videoWidth"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", {
  get() {
    return this[impl]["videoHeight"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLVideoElement.prototype, "poster", {
  get() {
    return this[impl]["poster"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'poster' property on 'HTMLVideoElement': The provided value"
    });
    this[impl]["poster"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLVideoElement.prototype, Symbol.toStringTag, {
  value: "HTMLVideoElement",
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
    throw new TypeError(`${context} is not of type 'HTMLVideoElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLVideoElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLVideoElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    HTMLMediaElement._internalSetup(obj);
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
  interface: HTMLVideoElement,
  expose: {
    Window: { HTMLVideoElement: HTMLVideoElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLVideoElement-impl.js");
