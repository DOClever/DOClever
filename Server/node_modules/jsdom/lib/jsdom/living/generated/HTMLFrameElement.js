"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLFrameElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLFrameElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLFrameElement, HTMLElement.interface);

Object.defineProperty(HTMLFrameElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLFrameElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "scrolling", {
  get() {
    const value = this.getAttribute("scrolling");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'scrolling' property on 'HTMLFrameElement': The provided value"
    });
    this.setAttribute("scrolling", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "src", {
  get() {
    return this[impl]["src"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'src' property on 'HTMLFrameElement': The provided value"
    });
    this[impl]["src"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "frameBorder", {
  get() {
    const value = this.getAttribute("frameBorder");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'frameBorder' property on 'HTMLFrameElement': The provided value"
    });
    this.setAttribute("frameBorder", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "longDesc", {
  get() {
    return this[impl]["longDesc"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'longDesc' property on 'HTMLFrameElement': The provided value"
    });
    this[impl]["longDesc"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "noResize", {
  get() {
    return this.hasAttribute("noResize");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'noResize' property on 'HTMLFrameElement': The provided value"
    });
    if (V) {
      this.setAttribute("noResize", "");
    } else {
      this.removeAttribute("noResize");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "contentDocument", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["contentDocument"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "contentWindow", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["contentWindow"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "marginHeight", {
  get() {
    const value = this.getAttribute("marginHeight");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'marginHeight' property on 'HTMLFrameElement': The provided value",
      treatNullAsEmptyString: true
    });
    this.setAttribute("marginHeight", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, "marginWidth", {
  get() {
    const value = this.getAttribute("marginWidth");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'marginWidth' property on 'HTMLFrameElement': The provided value",
      treatNullAsEmptyString: true
    });
    this.setAttribute("marginWidth", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFrameElement.prototype, Symbol.toStringTag, {
  value: "HTMLFrameElement",
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
    throw new TypeError(`${context} is not of type 'HTMLFrameElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLFrameElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLFrameElement.prototype);
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
  interface: HTMLFrameElement,
  expose: {
    Window: { HTMLFrameElement: HTMLFrameElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLFrameElement-impl.js");
