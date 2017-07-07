"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const UIEventInit = require("./UIEventInit");

module.exports = {
  convertInherit(obj, ret, { context = "The provided value" } = {}) {
    UIEventInit.convertInherit(obj, ret, { context });
    let key, value;

    key = "altKey";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member altKey that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "ctrlKey";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member ctrlKey that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "metaKey";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member metaKey that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierAltGraph";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierAltGraph that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierCapsLock";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierCapsLock that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierFn";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierFn that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierFnLock";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierFnLock that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierHyper";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierHyper that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierNumLock";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierNumLock that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierOS";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierOS that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierScrollLock";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierScrollLock that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierSuper";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierSuper that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierSymbol";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierSymbol that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "modifierSymbolLock";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member modifierSymbolLock that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }

    key = "shiftKey";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      value = conversions["boolean"](value, { context: `${context} has member shiftKey that` });
      ret[key] = value;
    } else {
      ret[key] = false;
    }
  },

  convert(obj, { context = "The provided value" } = {}) {
    if (obj !== undefined && typeof obj !== "object" && typeof obj !== "function") {
      throw new TypeError(`${context} is not an object.`);
    }

    const ret = Object.create(null);
    module.exports.convertInherit(obj, ret, { context });
    return ret;
  }
};
