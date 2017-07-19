"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const Event = require("./Event.js");
const impl = utils.implSymbol;
const convertErrorEventInit = require("./ErrorEventInit").convert;

function ErrorEvent(type) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'ErrorEvent'. Please use the 'new' operator; this constructor cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'ErrorEvent': 1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'ErrorEvent': parameter 1" });
  args[1] = convertErrorEventInit(args[1], { context: "Failed to construct 'ErrorEvent': parameter 2" });

  iface.setup(this, args);
}
Object.setPrototypeOf(ErrorEvent.prototype, Event.interface.prototype);
Object.setPrototypeOf(ErrorEvent, Event.interface);

Object.defineProperty(ErrorEvent.prototype, "message", {
  get() {
    return this[impl]["message"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ErrorEvent.prototype, "filename", {
  get() {
    return this[impl]["filename"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ErrorEvent.prototype, "lineno", {
  get() {
    return this[impl]["lineno"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ErrorEvent.prototype, "colno", {
  get() {
    return this[impl]["colno"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ErrorEvent.prototype, "error", {
  get() {
    return this[impl]["error"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(ErrorEvent.prototype, Symbol.toStringTag, {
  value: "ErrorEvent",
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
    throw new TypeError(`${context} is not of type 'ErrorEvent'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(ErrorEvent.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(ErrorEvent.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Event._internalSetup(obj);
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
  interface: ErrorEvent,
  expose: {
    Window: { ErrorEvent: ErrorEvent },
    Worker: { ErrorEvent: ErrorEvent }
  }
};
module.exports = iface;

const Impl = require("../events/ErrorEvent-impl.js");
