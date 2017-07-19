"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const UIEvent = require("./UIEvent.js");
const impl = utils.implSymbol;
const convertFocusEventInit = require("./FocusEventInit").convert;

function FocusEvent(type) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'FocusEvent'. Please use the 'new' operator; this constructor cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'FocusEvent': 1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'FocusEvent': parameter 1" });
  args[1] = convertFocusEventInit(args[1], { context: "Failed to construct 'FocusEvent': parameter 2" });

  iface.setup(this, args);
}
Object.setPrototypeOf(FocusEvent.prototype, UIEvent.interface.prototype);
Object.setPrototypeOf(FocusEvent, UIEvent.interface);

Object.defineProperty(FocusEvent.prototype, "relatedTarget", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["relatedTarget"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(FocusEvent.prototype, Symbol.toStringTag, {
  value: "FocusEvent",
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
    throw new TypeError(`${context} is not of type 'FocusEvent'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(FocusEvent.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(FocusEvent.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    UIEvent._internalSetup(obj);
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
  interface: FocusEvent,
  expose: {
    Window: { FocusEvent: FocusEvent }
  }
};
module.exports = iface;

const Impl = require("../events/FocusEvent-impl.js");
