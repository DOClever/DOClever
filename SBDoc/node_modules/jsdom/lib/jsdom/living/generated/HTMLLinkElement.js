"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;
const mixin = utils.mixin;
const LinkStyle = require("./LinkStyle.js");

function HTMLLinkElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLLinkElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLLinkElement, HTMLElement.interface);

mixin(HTMLLinkElement.prototype, LinkStyle.interface.prototype);
LinkStyle.mixedInto.push(HTMLLinkElement);
Object.defineProperty(HTMLLinkElement.prototype, "href", {
  get() {
    return this[impl]["href"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'href' property on 'HTMLLinkElement': The provided value"
    });
    this[impl]["href"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "crossOrigin", {
  get() {
    const value = this.getAttribute("crossOrigin");
    return value === null ? "" : value;
  },
  set(V) {
    if (V === null || V === undefined) {
      V = null;
    } else {
      V = conversions["DOMString"](V, {
        context: "Failed to set the 'crossOrigin' property on 'HTMLLinkElement': The provided value"
      });
    }
    this.setAttribute("crossOrigin", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "rel", {
  get() {
    const value = this.getAttribute("rel");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'rel' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("rel", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "media", {
  get() {
    const value = this.getAttribute("media");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'media' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("media", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "hreflang", {
  get() {
    const value = this.getAttribute("hreflang");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'hreflang' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("hreflang", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "charset", {
  get() {
    const value = this.getAttribute("charset");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'charset' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("charset", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "rev", {
  get() {
    const value = this.getAttribute("rev");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'rev' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("rev", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, "target", {
  get() {
    const value = this.getAttribute("target");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'target' property on 'HTMLLinkElement': The provided value"
    });
    this.setAttribute("target", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLLinkElement.prototype, Symbol.toStringTag, {
  value: "HTMLLinkElement",
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
    throw new TypeError(`${context} is not of type 'HTMLLinkElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLLinkElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLLinkElement.prototype);
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
  interface: HTMLLinkElement,
  expose: {
    Window: { HTMLLinkElement: HTMLLinkElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLLinkElement-impl.js");
