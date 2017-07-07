"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLButtonElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLButtonElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLButtonElement, HTMLElement.interface);

Object.defineProperty(HTMLButtonElement.prototype, "autofocus", {
  get() {
    return this.hasAttribute("autofocus");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'autofocus' property on 'HTMLButtonElement': The provided value"
    });
    if (V) {
      this.setAttribute("autofocus", "");
    } else {
      this.removeAttribute("autofocus");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "disabled", {
  get() {
    return this.hasAttribute("disabled");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'disabled' property on 'HTMLButtonElement': The provided value"
    });
    if (V) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "form", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["form"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "formNoValidate", {
  get() {
    return this.hasAttribute("formNoValidate");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'formNoValidate' property on 'HTMLButtonElement': The provided value"
    });
    if (V) {
      this.setAttribute("formNoValidate", "");
    } else {
      this.removeAttribute("formNoValidate");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "formTarget", {
  get() {
    const value = this.getAttribute("formTarget");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'formTarget' property on 'HTMLButtonElement': The provided value"
    });
    this.setAttribute("formTarget", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLButtonElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "type", {
  get() {
    return this[impl]["type"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLButtonElement': The provided value"
    });
    this[impl]["type"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, "value", {
  get() {
    const value = this.getAttribute("value");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'value' property on 'HTMLButtonElement': The provided value"
    });
    this.setAttribute("value", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLButtonElement.prototype, Symbol.toStringTag, {
  value: "HTMLButtonElement",
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
    throw new TypeError(`${context} is not of type 'HTMLButtonElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLButtonElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLButtonElement.prototype);
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
  interface: HTMLButtonElement,
  expose: {
    Window: { HTMLButtonElement: HTMLButtonElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLButtonElement-impl.js");
