"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLMetaElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLMetaElement, HTMLElement.interface);

Object.defineProperty(HTMLMetaElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLMetaElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {
  get() {
    const value = this.getAttribute("http-equiv");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'httpEquiv' property on 'HTMLMetaElement': The provided value"
    });
    this.setAttribute("http-equiv", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLMetaElement.prototype, "content", {
  get() {
    const value = this.getAttribute("content");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'content' property on 'HTMLMetaElement': The provided value"
    });
    this.setAttribute("content", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLMetaElement.prototype, "scheme", {
  get() {
    const value = this.getAttribute("scheme");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'scheme' property on 'HTMLMetaElement': The provided value"
    });
    this.setAttribute("scheme", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLMetaElement.prototype, Symbol.toStringTag, {
  value: "HTMLMetaElement",
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
    throw new TypeError(`${context} is not of type 'HTMLMetaElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLMetaElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLMetaElement.prototype);
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
  interface: HTMLMetaElement,
  expose: {
    Window: { HTMLMetaElement: HTMLMetaElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLMetaElement-impl.js");
