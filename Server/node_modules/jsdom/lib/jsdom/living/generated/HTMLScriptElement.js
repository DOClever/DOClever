"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLScriptElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLScriptElement, HTMLElement.interface);

Object.defineProperty(HTMLScriptElement.prototype, "src", {
  get() {
    return this[impl]["src"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'src' property on 'HTMLScriptElement': The provided value"
    });
    this[impl]["src"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "type", {
  get() {
    const value = this.getAttribute("type");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLScriptElement': The provided value"
    });
    this.setAttribute("type", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "charset", {
  get() {
    const value = this.getAttribute("charset");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'charset' property on 'HTMLScriptElement': The provided value"
    });
    this.setAttribute("charset", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "defer", {
  get() {
    return this.hasAttribute("defer");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'defer' property on 'HTMLScriptElement': The provided value"
    });
    if (V) {
      this.setAttribute("defer", "");
    } else {
      this.removeAttribute("defer");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "crossOrigin", {
  get() {
    const value = this.getAttribute("crossOrigin");
    return value === null ? "" : value;
  },
  set(V) {
    if (V === null || V === undefined) {
      V = null;
    } else {
      V = conversions["DOMString"](V, {
        context: "Failed to set the 'crossOrigin' property on 'HTMLScriptElement': The provided value"
      });
    }
    this.setAttribute("crossOrigin", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "text", {
  get() {
    return this[impl]["text"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'text' property on 'HTMLScriptElement': The provided value"
    });
    this[impl]["text"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "nonce", {
  get() {
    const value = this.getAttribute("nonce");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'nonce' property on 'HTMLScriptElement': The provided value"
    });
    this.setAttribute("nonce", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "event", {
  get() {
    const value = this.getAttribute("event");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'event' property on 'HTMLScriptElement': The provided value"
    });
    this.setAttribute("event", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, "htmlFor", {
  get() {
    const value = this.getAttribute("for");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'htmlFor' property on 'HTMLScriptElement': The provided value"
    });
    this.setAttribute("for", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLScriptElement.prototype, Symbol.toStringTag, {
  value: "HTMLScriptElement",
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
    throw new TypeError(`${context} is not of type 'HTMLScriptElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLScriptElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLScriptElement.prototype);
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
  interface: HTMLScriptElement,
  expose: {
    Window: { HTMLScriptElement: HTMLScriptElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLScriptElement-impl.js");
