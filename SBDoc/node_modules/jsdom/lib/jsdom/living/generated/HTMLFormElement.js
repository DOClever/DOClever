"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLFormElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLFormElement, HTMLElement.interface);

HTMLFormElement.prototype.submit = function submit() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].submit();
};

HTMLFormElement.prototype.reset = function reset() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].reset();
};
Object.defineProperty(HTMLFormElement.prototype, "acceptCharset", {
  get() {
    const value = this.getAttribute("accept-charset");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'acceptCharset' property on 'HTMLFormElement': The provided value"
    });
    this.setAttribute("accept-charset", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "action", {
  get() {
    return this[impl]["action"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'action' property on 'HTMLFormElement': The provided value"
    });
    this[impl]["action"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "enctype", {
  get() {
    return this[impl]["enctype"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'enctype' property on 'HTMLFormElement': The provided value"
    });
    this[impl]["enctype"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "method", {
  get() {
    return this[impl]["method"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'method' property on 'HTMLFormElement': The provided value"
    });
    this[impl]["method"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLFormElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "noValidate", {
  get() {
    return this.hasAttribute("noValidate");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'noValidate' property on 'HTMLFormElement': The provided value"
    });
    if (V) {
      this.setAttribute("noValidate", "");
    } else {
      this.removeAttribute("noValidate");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "target", {
  get() {
    const value = this.getAttribute("target");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'target' property on 'HTMLFormElement': The provided value"
    });
    this.setAttribute("target", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "elements", {
  get() {
    return utils.getSameObject(this, "elements", () => {
      return utils.tryWrapperForImpl(this[impl]["elements"]);
    });
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, "length", {
  get() {
    return this[impl]["length"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLFormElement.prototype, Symbol.toStringTag, {
  value: "HTMLFormElement",
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
    throw new TypeError(`${context} is not of type 'HTMLFormElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLFormElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLFormElement.prototype);
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
  interface: HTMLFormElement,
  expose: {
    Window: { HTMLFormElement: HTMLFormElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLFormElement-impl.js");
