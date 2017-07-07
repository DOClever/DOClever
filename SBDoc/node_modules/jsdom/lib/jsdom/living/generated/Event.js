"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;
const convertEventInit = require("./EventInit").convert;

function Event(type) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'Event'. Please use the 'new' operator; this constructor cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'Event': 1 argument required, but only " + arguments.length + " present.");
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'Event': parameter 1" });
  args[1] = convertEventInit(args[1], { context: "Failed to construct 'Event': parameter 2" });

  iface.setup(this, args);
}

Event.prototype.stopPropagation = function stopPropagation() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].stopPropagation();
};

Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].stopImmediatePropagation();
};

Event.prototype.preventDefault = function preventDefault() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return this[impl].preventDefault();
};

Event.prototype.initEvent = function initEvent(type) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'initEvent' on 'Event': 1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }
  args[0] = conversions["DOMString"](args[0], { context: "Failed to execute 'initEvent' on 'Event': parameter 1" });
  if (args[1] !== undefined) {
    args[1] = conversions["boolean"](args[1], { context: "Failed to execute 'initEvent' on 'Event': parameter 2" });
  } else {
    args[1] = false;
  }
  if (args[2] !== undefined) {
    args[2] = conversions["boolean"](args[2], { context: "Failed to execute 'initEvent' on 'Event': parameter 3" });
  } else {
    args[2] = false;
  }
  return this[impl].initEvent(...args);
};
Object.defineProperty(Event.prototype, "type", {
  get() {
    return this[impl]["type"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "target", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["target"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "currentTarget", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["currentTarget"]);
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event, "NONE", {
  value: 0,
  enumerable: true
});
Object.defineProperty(Event.prototype, "NONE", {
  value: 0,
  enumerable: true
});

Object.defineProperty(Event, "CAPTURING_PHASE", {
  value: 1,
  enumerable: true
});
Object.defineProperty(Event.prototype, "CAPTURING_PHASE", {
  value: 1,
  enumerable: true
});

Object.defineProperty(Event, "AT_TARGET", {
  value: 2,
  enumerable: true
});
Object.defineProperty(Event.prototype, "AT_TARGET", {
  value: 2,
  enumerable: true
});

Object.defineProperty(Event, "BUBBLING_PHASE", {
  value: 3,
  enumerable: true
});
Object.defineProperty(Event.prototype, "BUBBLING_PHASE", {
  value: 3,
  enumerable: true
});

Object.defineProperty(Event.prototype, "eventPhase", {
  get() {
    return this[impl]["eventPhase"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "cancelBubble", {
  get() {
    return this[impl]["cancelBubble"];
  },
  set(V) {
    V = conversions["boolean"](V, {
      context: "Failed to set the 'cancelBubble' property on 'Event': The provided value"
    });
    this[impl]["cancelBubble"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "bubbles", {
  get() {
    return this[impl]["bubbles"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "cancelable", {
  get() {
    return this[impl]["cancelable"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "defaultPrevented", {
  get() {
    return this[impl]["defaultPrevented"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, "timeStamp", {
  get() {
    return this[impl]["timeStamp"];
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Event.prototype, Symbol.toStringTag, {
  value: "Event",
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
    throw new TypeError(`${context} is not of type 'Event'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(Event.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(Event.prototype);
    this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Object.defineProperty(obj, "isTrusted", {
      get() {
        return obj[impl]["isTrusted"];
      },
      enumerable: true,
      configurable: false
    });
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
  interface: Event,
  expose: {
    Window: { Event: Event },
    Worker: { Event: Event }
  }
};
module.exports = iface;

const Impl = require("../events/Event-impl.js");
