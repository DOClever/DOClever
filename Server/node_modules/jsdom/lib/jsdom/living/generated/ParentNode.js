"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;

function ParentNode() {
  throw new TypeError("Illegal constructor");
}

ParentNode.prototype.querySelector = function querySelector(selectors) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'querySelector' on 'ParentNode': 1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'querySelector' on 'ParentNode': parameter 1"
  });
  return utils.tryWrapperForImpl(this[impl].querySelector(...args));
};

ParentNode.prototype.querySelectorAll = function querySelectorAll(selectors) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'querySelectorAll' on 'ParentNode': 1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'querySelectorAll' on 'ParentNode': parameter 1"
  });
  return utils.tryWrapperForImpl(this[impl].querySelectorAll(...args));
};
Object.defineProperty(ParentNode.prototype, "children", {
  get() {
    return utils.getSameObject(this, "children", () => {
      return utils.tryWrapperForImpl(this[impl]["children"]);
    });
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ParentNode.prototype, "firstElementChild", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["firstElementChild"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ParentNode.prototype, "lastElementChild", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["lastElementChild"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ParentNode.prototype, "childElementCount", {
  get() {
    return this[impl]["childElementCount"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ParentNode.prototype, Symbol.toStringTag, {
  value: "ParentNode",
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
    throw new TypeError(`${context} is not of type 'ParentNode'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(ParentNode.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(ParentNode.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {},
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
  interface: ParentNode,
  expose: {}
};
module.exports = iface;

const Impl = require("../nodes/ParentNode-impl.js");
