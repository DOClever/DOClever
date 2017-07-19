"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLTableCellElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLTableCellElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLTableCellElement, HTMLElement.interface);

Object.defineProperty(HTMLTableCellElement.prototype, "colSpan", {
  get() {
    return this[impl]["colSpan"];
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'colSpan' property on 'HTMLTableCellElement': The provided value"
    });
    this[impl]["colSpan"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "rowSpan", {
  get() {
    return this[impl]["rowSpan"];
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'rowSpan' property on 'HTMLTableCellElement': The provided value"
    });
    this[impl]["rowSpan"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "headers", {
  get() {
    return utils.getSameObject(this, "headers", () => {
      return utils.tryWrapperForImpl(this[impl]["headers"]);
    });
  },
  set(V) {
    this.headers.value = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "cellIndex", {
  get() {
    return this[impl]["cellIndex"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "align", {
  get() {
    const value = this.getAttribute("align");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'align' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("align", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "axis", {
  get() {
    const value = this.getAttribute("axis");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'axis' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("axis", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "height", {
  get() {
    const value = this.getAttribute("height");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'height' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("height", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "width", {
  get() {
    const value = this.getAttribute("width");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'width' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("width", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "ch", {
  get() {
    const value = this.getAttribute("char");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'ch' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("char", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "chOff", {
  get() {
    const value = this.getAttribute("charoff");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'chOff' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("charoff", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "noWrap", {
  get() {
    return this.hasAttribute("noWrap");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'noWrap' property on 'HTMLTableCellElement': The provided value"
    });
    if (V) {
      this.setAttribute("noWrap", "");
    } else {
      this.removeAttribute("noWrap");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "vAlign", {
  get() {
    const value = this.getAttribute("vAlign");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'vAlign' property on 'HTMLTableCellElement': The provided value"
    });
    this.setAttribute("vAlign", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, "bgColor", {
  get() {
    const value = this.getAttribute("bgColor");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'bgColor' property on 'HTMLTableCellElement': The provided value",
      treatNullAsEmptyString: true
    });
    this.setAttribute("bgColor", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableCellElement.prototype, Symbol.toStringTag, {
  value: "HTMLTableCellElement",
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
    throw new TypeError(`${context} is not of type 'HTMLTableCellElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableCellElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableCellElement.prototype);
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
  interface: HTMLTableCellElement,
  expose: {
    Window: { HTMLTableCellElement: HTMLTableCellElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLTableCellElement-impl.js");
