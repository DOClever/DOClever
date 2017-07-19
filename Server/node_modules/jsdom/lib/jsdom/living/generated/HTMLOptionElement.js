"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLOptionElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLOptionElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLOptionElement, HTMLElement.interface);

Object.defineProperty(HTMLOptionElement.prototype, "disabled", {
  get() {
    return this.hasAttribute("disabled");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'disabled' property on 'HTMLOptionElement': The provided value"
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

Object.defineProperty(HTMLOptionElement.prototype, "form", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["form"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "label", {
  get() {
    return this[impl]["label"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'label' property on 'HTMLOptionElement': The provided value"
    });
    this[impl]["label"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "defaultSelected", {
  get() {
    return this.hasAttribute("selected");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'defaultSelected' property on 'HTMLOptionElement': The provided value"
    });
    if (V) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "selected", {
  get() {
    return this[impl]["selected"];
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'selected' property on 'HTMLOptionElement': The provided value"
    });
    this[impl]["selected"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "value", {
  get() {
    return this[impl]["value"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'value' property on 'HTMLOptionElement': The provided value"
    });
    this[impl]["value"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "text", {
  get() {
    return this[impl]["text"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'text' property on 'HTMLOptionElement': The provided value"
    });
    this[impl]["text"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, "index", {
  get() {
    return this[impl]["index"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLOptionElement.prototype, Symbol.toStringTag, {
  value: "HTMLOptionElement",
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
    throw new TypeError(`${context} is not of type 'HTMLOptionElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLOptionElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLOptionElement.prototype);
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
  interface: HTMLOptionElement,
  expose: {
    Window: { HTMLOptionElement: HTMLOptionElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLOptionElement-impl.js");
