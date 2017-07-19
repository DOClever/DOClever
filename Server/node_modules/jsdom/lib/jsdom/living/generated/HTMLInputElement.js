"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const HTMLElement = require("./HTMLElement.js");
const impl = utils.implSymbol;

function HTMLInputElement() {
  throw new TypeError("Illegal constructor");
}
Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.interface.prototype);
Object.setPrototypeOf(HTMLInputElement, HTMLElement.interface);

HTMLInputElement.prototype.select = function select() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].select();
};

HTMLInputElement.prototype.setRangeText = function setRangeText(replacement) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'setRangeText' on 'HTMLInputElement': 1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 4; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'setRangeText' on 'HTMLInputElement': parameter 1"
  });
  return this[impl].setRangeText(...args);
};

HTMLInputElement.prototype.setSelectionRange = function setSelectionRange(start, end) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'setSelectionRange' on 'HTMLInputElement': 2 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["unsigned long"](args[0], {
    context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 1"
  });
  args[1] = conversions["unsigned long"](args[1], {
    context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 2"
  });
  if (args[2] !== undefined) {
    args[2] = conversions["DOMString"](args[2], {
      context: "Failed to execute 'setSelectionRange' on 'HTMLInputElement': parameter 3"
    });
  }
  return this[impl].setSelectionRange(...args);
};
Object.defineProperty(HTMLInputElement.prototype, "accept", {
  get() {
    const value = this.getAttribute("accept");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'accept' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("accept", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "alt", {
  get() {
    const value = this.getAttribute("alt");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'alt' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("alt", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "autocomplete", {
  get() {
    const value = this.getAttribute("autocomplete");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'autocomplete' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("autocomplete", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "autofocus", {
  get() {
    return this.hasAttribute("autofocus");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'autofocus' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("autofocus", "");
    } else {
      this.removeAttribute("autofocus");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "defaultChecked", {
  get() {
    return this.hasAttribute("checked");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'defaultChecked' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "checked", {
  get() {
    return this[impl]["checked"];
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'checked' property on 'HTMLInputElement': The provided value"
    });
    this[impl]["checked"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "dirName", {
  get() {
    const value = this.getAttribute("dirName");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'dirName' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("dirName", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "disabled", {
  get() {
    return this.hasAttribute("disabled");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'disabled' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "form", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["form"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "files", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["files"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "formNoValidate", {
  get() {
    return this.hasAttribute("formNoValidate");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'formNoValidate' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("formNoValidate", "");
    } else {
      this.removeAttribute("formNoValidate");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "formTarget", {
  get() {
    const value = this.getAttribute("formTarget");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'formTarget' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("formTarget", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "inputMode", {
  get() {
    const value = this.getAttribute("inputMode");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'inputMode' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("inputMode", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "max", {
  get() {
    const value = this.getAttribute("max");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'max' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("max", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "maxLength", {
  get() {
    return this[impl]["maxLength"];
  },
  set(V) {
    V = conversions["long"](V, {
      context: "Failed to set the 'maxLength' property on 'HTMLInputElement': The provided value"
    });
    this[impl]["maxLength"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "min", {
  get() {
    const value = this.getAttribute("min");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'min' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("min", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "minLength", {
  get() {
    return this[impl]["minLength"];
  },
  set(V) {
    V = conversions["long"](V, {
      context: "Failed to set the 'minLength' property on 'HTMLInputElement': The provided value"
    });
    this[impl]["minLength"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "multiple", {
  get() {
    return this.hasAttribute("multiple");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'multiple' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("multiple", "");
    } else {
      this.removeAttribute("multiple");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "name", {
  get() {
    const value = this.getAttribute("name");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'name' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("name", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "pattern", {
  get() {
    const value = this.getAttribute("pattern");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'pattern' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("pattern", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "placeholder", {
  get() {
    const value = this.getAttribute("placeholder");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'placeholder' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("placeholder", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "readOnly", {
  get() {
    return this.hasAttribute("readOnly");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'readOnly' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("readOnly", "");
    } else {
      this.removeAttribute("readOnly");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "required", {
  get() {
    return this.hasAttribute("required");
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'required' property on 'HTMLInputElement': The provided value"
    });
    if (V) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "size", {
  get() {
    return this[impl]["size"];
  },
  set(V) {
    V = conversions["unsigned long"](V, {
      context: "Failed to set the 'size' property on 'HTMLInputElement': The provided value"
    });
    this[impl]["size"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "src", {
  get() {
    const value = this.getAttribute("src");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'src' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("src", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "step", {
  get() {
    const value = this.getAttribute("step");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'step' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("step", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "type", {
  get() {
    return this[impl]["type"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'type' property on 'HTMLInputElement': The provided value"
    });
    this[impl]["type"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "defaultValue", {
  get() {
    const value = this.getAttribute("value");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'defaultValue' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("value", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "value", {
  get() {
    return this[impl]["value"];
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'value' property on 'HTMLInputElement': The provided value",
      treatNullAsEmptyString: true
    });
    this[impl]["value"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "selectionStart", {
  get() {
    return this[impl]["selectionStart"];
  },
  set(V) {
    if (V === null || V === undefined) {
      V = null;
    } else {
      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'selectionStart' property on 'HTMLInputElement': The provided value"
      });
    }
    this[impl]["selectionStart"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "selectionEnd", {
  get() {
    return this[impl]["selectionEnd"];
  },
  set(V) {
    if (V === null || V === undefined) {
      V = null;
    } else {
      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'selectionEnd' property on 'HTMLInputElement': The provided value"
      });
    }
    this[impl]["selectionEnd"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "selectionDirection", {
  get() {
    return this[impl]["selectionDirection"];
  },
  set(V) {
    if (V === null || V === undefined) {
      V = null;
    } else {
      V = conversions["DOMString"](V, {
        context: "Failed to set the 'selectionDirection' property on 'HTMLInputElement': The provided value"
      });
    }
    this[impl]["selectionDirection"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "align", {
  get() {
    const value = this.getAttribute("align");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'align' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("align", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, "useMap", {
  get() {
    const value = this.getAttribute("useMap");
    return value === null ? "" : value;
  },
  set(V) {
    V = conversions["DOMString"](V, {
      context: "Failed to set the 'useMap' property on 'HTMLInputElement': The provided value"
    });
    this.setAttribute("useMap", V);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(HTMLInputElement.prototype, Symbol.toStringTag, {
  value: "HTMLInputElement",
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
    throw new TypeError(`${context} is not of type 'HTMLInputElement'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(HTMLInputElement.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(HTMLInputElement.prototype);
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
  interface: HTMLInputElement,
  expose: {
    Window: { HTMLInputElement: HTMLInputElement }
  }
};
module.exports = iface;

const Impl = require("../nodes/HTMLInputElement-impl.js");
