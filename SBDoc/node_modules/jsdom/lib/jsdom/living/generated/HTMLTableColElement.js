"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLTableColElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLTableColElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLTableColElement, HTMLElement.interface);

Object.defineProperty(HTMLTableColElement.prototype, "span", {
  get() {
    const value = parseInt(this.getAttribute("span"));
    return isNaN(value) || value < 0 || value > 2147483647 ? 0 : value;
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'span' property on 'HTMLTableColElement': The provided value"
    });
    V = V > 2147483647 ? 0 : V;
    this.setAttribute("span", String(V));
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, "align", {
  get() {
    const value = this.getAttribute("align");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'align' property on 'HTMLTableColElement': The provided value"
    });
    this.setAttribute("align", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, "ch", {
  get() {
    const value = this.getAttribute("char");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'ch' property on 'HTMLTableColElement': The provided value"
    });
    this.setAttribute("char", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, "chOff", {
  get() {
    const value = this.getAttribute("charoff");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'chOff' property on 'HTMLTableColElement': The provided value"
    });
    this.setAttribute("charoff", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, "vAlign", {
  get() {
    const value = this.getAttribute("vAlign");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'vAlign' property on 'HTMLTableColElement': The provided value"
    });
    this.setAttribute("vAlign", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, "width", {
  get() {
    const value = this.getAttribute("width");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'width' property on 'HTMLTableColElement': The provided value"
    });
    this.setAttribute("width", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableColElement.prototype, Symbol.toStringTag, {
  value: "HTMLTableColElement",
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
    throw new TypeError(`${context} is not of type 'HTMLTableColElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableColElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableColElement.prototype);
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
  interface: HTMLTableColElement,
  expose: {
    Window: { HTMLTableColElement: HTMLTableColElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLTableColElement-impl.js");
