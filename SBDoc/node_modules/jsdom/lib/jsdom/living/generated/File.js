"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const Blob = require("./Blob.js");
const impl = utils.implSymbol;
const isBlob = require("./Blob").is;
const convertFilePropertyBag = require("./FilePropertyBag").convert;

function File(fileBits, fileName) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'File'. Please use the 'new' operator; this constructor cannot be called as a function."
    );
  }
  if (arguments.length < 2) {
    throw new TypeError("Failed to construct 'File': 2 arguments required, but only " + arguments.length + " present.");
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }
  if (!utils.isObject(args[0])) {
    throw new TypeError("Failed to construct 'File': parameter 1" + " is not an iterable object.");
  } else {
    const V = [];
    const tmp = args[0];
    for (let nextItem of tmp) {
      if (isBlob(nextItem)) {
        nextItem = utils.implForWrapper(nextItem);
      } else if (nextItem instanceof ArrayBuffer) {
      } else if (ArrayBuffer.isView(nextItem)) {
      } else {
        nextItem = conversions["USVString"](nextItem, {
          context: "Failed to construct 'File': parameter 1" + "'s element"
        });
      }
      V.push(nextItem);
    }
    args[0] = V;
  }
  args[1] = conversions["USVString"](args[1], { context: "Failed to construct 'File': parameter 2" });
  args[2] = convertFilePropertyBag(args[2], { context: "Failed to construct 'File': parameter 3" });

  iface.setup(this, args);
}
Object.setPrototypeOf(File.prototype, Blob.interface.prototype);
Object.setPrototypeOf(File, Blob.interface);

Object.defineProperty(File.prototype, "name", {
  get() {
    return this[impl]["name"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(File.prototype, "lastModified", {
  get() {
    return this[impl]["lastModified"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(File.prototype, Symbol.toStringTag, {
  value: "File",
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
    throw new TypeError(`${context} is not of type 'File'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(File.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(File.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Blob._internalSetup(obj);
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
  interface: File,
  expose: {
    Window: { File: File },
    Worker: { File: File }
  }
};
module.exports = iface;

const Impl = require("../file-api/File-impl.js");
