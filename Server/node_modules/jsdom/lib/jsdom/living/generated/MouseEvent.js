"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const UIEvent = require("./UIEvent.js");
const impl = utils.implSymbol;
const convertMouseEventInit = require("./MouseEventInit").convert;
const convertEventTarget = require("./EventTarget").convert;

function MouseEvent(typeArg) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'MouseEvent'. Please use the 'new' operator; this constructor cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'MouseEvent': 1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'MouseEvent': parameter 1" });
  args[1] = convertMouseEventInit(args[1], { context: "Failed to construct 'MouseEvent': parameter 2" });

  iface.setup(this, args);
}
Object.setPrototypeOf(MouseEvent.prototype, UIEvent.interface.prototype);
Object.setPrototypeOf(MouseEvent, UIEvent.interface);

MouseEvent.prototype.getModifierState = function getModifierState(keyArg) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'getModifierState' on 'MouseEvent': 1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'getModifierState' on 'MouseEvent': parameter 1"
  });
  return this[impl].getModifierState(...args);
};

MouseEvent.prototype.initMouseEvent = function initMouseEvent(
  typeArg,
  bubblesArg,
  cancelableArg,
  viewArg,
  detailArg,
  screenXArg,
  screenYArg,
  clientXArg,
  clientYArg,
  ctrlKeyArg,
  altKeyArg,
  shiftKeyArg,
  metaKeyArg,
  buttonArg,
  relatedTargetArg
) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 15) {
    throw new TypeError(
      "Failed to execute 'initMouseEvent' on 'MouseEvent': 15 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 15; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 1"
  });
  args[1] = conversions["boolean"](args[1], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 2"
  });
  args[2] = conversions["boolean"](args[2], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 3"
  });
  if (args[3] === null || args[3] === undefined) {
    args[3] = null;
  } else {
    args[3] = utils.tryImplForWrapper(args[3]);
  }
  args[4] = conversions["long"](args[4], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 5"
  });
  args[5] = conversions["long"](args[5], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 6"
  });
  args[6] = conversions["long"](args[6], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 7"
  });
  args[7] = conversions["long"](args[7], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 8"
  });
  args[8] = conversions["long"](args[8], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 9"
  });
  args[9] = conversions["boolean"](args[9], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 10"
  });
  args[10] = conversions["boolean"](args[10], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 11"
  });
  args[11] = conversions["boolean"](args[11], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 12"
  });
  args[12] = conversions["boolean"](args[12], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 13"
  });
  args[13] = conversions["short"](args[13], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 14"
  });
  if (args[14] === null || args[14] === undefined) {
    args[14] = null;
  } else {
    args[14] = convertEventTarget(args[14], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 15"
    });
  }
  return this[impl].initMouseEvent(...args);
};
Object.defineProperty(MouseEvent.prototype, "screenX", {
  get() {
    return this[impl]["screenX"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "screenY", {
  get() {
    return this[impl]["screenY"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "clientX", {
  get() {
    return this[impl]["clientX"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "clientY", {
  get() {
    return this[impl]["clientY"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "ctrlKey", {
  get() {
    return this[impl]["ctrlKey"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "shiftKey", {
  get() {
    return this[impl]["shiftKey"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "altKey", {
  get() {
    return this[impl]["altKey"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "metaKey", {
  get() {
    return this[impl]["metaKey"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "button", {
  get() {
    return this[impl]["button"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "relatedTarget", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["relatedTarget"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "buttons", {
  get() {
    return this[impl]["buttons"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, Symbol.toStringTag, {
  value: "MouseEvent",
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
    throw new TypeError(`${context} is not of type 'MouseEvent'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(MouseEvent.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(MouseEvent.prototype);
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
  interface: MouseEvent,
  expose: {
    Window: { MouseEvent: MouseEvent }
  }
};
module.exports = iface;

const Impl = require("../events/MouseEvent-impl.js");
