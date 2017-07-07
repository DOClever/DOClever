"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const Node = require("./Node.js");
const impl = utils.implSymbol;
const mixin = utils.mixin;
const ChildNode = require("./ChildNode.js");

function DocumentType() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(DocumentType.prototype, Node.interface.prototype);
Object.setPrototypeOf(DocumentType, Node.interface);

mixin(DocumentType.prototype, ChildNode.interface.prototype);
ChildNode.mixedInto.push(DocumentType);
Object.defineProperty(DocumentType.prototype, "name", {
  get() {
    return this[impl]["name"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(DocumentType.prototype, "publicId", {
  get() {
    return this[impl]["publicId"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(DocumentType.prototype, "systemId", {
  get() {
    return this[impl]["systemId"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(DocumentType.prototype, Symbol.toStringTag, {
  value: "DocumentType",
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
    throw new TypeError(`${context} is not of type 'DocumentType'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(DocumentType.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(DocumentType.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Node._internalSetup(obj);
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
  interface: DocumentType,
  expose: {
    Window: { DocumentType: DocumentType }
  }
};
module.exports = iface;

const Impl = require("../nodes/DocumentType-impl.js");
