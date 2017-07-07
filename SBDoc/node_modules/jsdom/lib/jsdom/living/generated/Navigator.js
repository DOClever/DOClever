"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;
const mixin = utils.mixin;
const NavigatorID = require("./NavigatorID.js");
const NavigatorLanguage = require("./NavigatorLanguage.js");
const NavigatorOnLine = require("./NavigatorOnLine.js");
const NavigatorCookies = require("./NavigatorCookies.js");
const NavigatorPlugins = require("./NavigatorPlugins.js");
const NavigatorConcurrentHardware = require("./NavigatorConcurrentHardware.js");

function Navigator() {
  throw new TypeError("Illegal constructor");
}

mixin(Navigator.prototype, NavigatorID.interface.prototype);
NavigatorID.mixedInto.push(Navigator);
mixin(Navigator.prototype, NavigatorLanguage.interface.prototype);
NavigatorLanguage.mixedInto.push(Navigator);
mixin(Navigator.prototype, NavigatorOnLine.interface.prototype);
NavigatorOnLine.mixedInto.push(Navigator);
mixin(Navigator.prototype, NavigatorCookies.interface.prototype);
NavigatorCookies.mixedInto.push(Navigator);
mixin(Navigator.prototype, NavigatorPlugins.interface.prototype);
NavigatorPlugins.mixedInto.push(Navigator);
mixin(Navigator.prototype, NavigatorConcurrentHardware.interface.prototype);
NavigatorConcurrentHardware.mixedInto.push(Navigator);

Object.defineProperty(Navigator.prototype, Symbol.toStringTag, {
  value: "Navigator",
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
    throw new TypeError(`${context} is not of type 'Navigator'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(Navigator.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(Navigator.prototype);
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
  interface: Navigator,
  expose: {
    Window: { Navigator: Navigator }
  }
};
module.exports = iface;

const Impl = require("../navigator/Navigator-impl.js");
