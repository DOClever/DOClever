"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLTableRowElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLTableRowElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLTableRowElement, HTMLElement.interface);

HTMLTableRowElement.prototype.insertCell = function insertCell() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }
  if (args[0] !== undefined) {
    args[0] = conversions["long"](args[0], {
      context: "Failed to execute 'insertCell' on 'HTMLTableRowElement': parameter 1"
    });
  } else {
    args[0] = -1;
  }
  return utils.tryWrapperForImpl(this[impl].insertCell(...args));
};

HTMLTableRowElement.prototype.deleteCell = function deleteCell(index) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'deleteCell' on 'HTMLTableRowElement': 1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["long"](args[0], {
    context: "Failed to execute 'deleteCell' on 'HTMLTableRowElement': parameter 1"
  });
  return this[impl].deleteCell(...args);
};
Object.defineProperty(HTMLTableRowElement.prototype, "rowIndex", {
  get() {
    return this[impl]["rowIndex"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "sectionRowIndex", {
  get() {
    return this[impl]["sectionRowIndex"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "cells", {
  get() {
    return utils.getSameObject(this, "cells", () => {
      return utils.tryWrapperForImpl(this[impl]["cells"]);
    });
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "align", {
  get() {
    const value = this.getAttribute("align");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'align' property on 'HTMLTableRowElement': The provided value"
    });
    this.setAttribute("align", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "ch", {
  get() {
    const value = this.getAttribute("char");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'ch' property on 'HTMLTableRowElement': The provided value"
    });
    this.setAttribute("char", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "chOff", {
  get() {
    const value = this.getAttribute("charoff");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'chOff' property on 'HTMLTableRowElement': The provided value"
    });
    this.setAttribute("charoff", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "vAlign", {
  get() {
    const value = this.getAttribute("vAlign");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'vAlign' property on 'HTMLTableRowElement': The provided value"
    });
    this.setAttribute("vAlign", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, "bgColor", {
  get() {
    const value = this.getAttribute("bgColor");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'bgColor' property on 'HTMLTableRowElement': The provided value",
      treatNullAsEmptyString: true
    });
    this.setAttribute("bgColor", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLTableRowElement.prototype, Symbol.toStringTag, {
  value: "HTMLTableRowElement",
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
    throw new TypeError(`${context} is not of type 'HTMLTableRowElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableRowElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLTableRowElement.prototype);
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
  interface: HTMLTableRowElement,
  expose: {
    Window: { HTMLTableRowElement: HTMLTableRowElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLTableRowElement-impl.js");
