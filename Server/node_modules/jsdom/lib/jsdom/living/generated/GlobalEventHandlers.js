"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const impl = utils.implSymbol;

function GlobalEventHandlers() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(GlobalEventHandlers.prototype, "onabort", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onabort"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onabort"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onauxclick", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onauxclick"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onauxclick"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onblur", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onblur"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onblur"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oncancel", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oncancel"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oncancel"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oncanplay", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oncanplay"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oncanplay"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oncanplaythrough", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oncanplaythrough"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oncanplaythrough"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onchange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onchange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onchange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onclick", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onclick"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onclick"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onclose", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onclose"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onclose"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oncontextmenu", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oncontextmenu"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oncontextmenu"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oncuechange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oncuechange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oncuechange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondblclick", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondblclick"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondblclick"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondrag", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondrag"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondrag"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragend", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragend"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragend"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragenter", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragenter"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragenter"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragexit", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragexit"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragexit"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragleave", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragleave"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragleave"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragover", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragover"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragover"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondragstart", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondragstart"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondragstart"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondrop", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondrop"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondrop"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ondurationchange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ondurationchange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ondurationchange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onemptied", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onemptied"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onemptied"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onended", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onended"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onended"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onerror", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onerror"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onerror"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onfocus", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onfocus"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onfocus"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oninput", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oninput"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oninput"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "oninvalid", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["oninvalid"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["oninvalid"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onkeydown", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onkeydown"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onkeydown"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onkeypress", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onkeypress"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onkeypress"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onkeyup", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onkeyup"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onkeyup"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onload", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onload"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onload"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onloadeddata", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onloadeddata"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onloadeddata"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onloadedmetadata", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onloadedmetadata"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onloadedmetadata"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onloadend", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onloadend"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onloadend"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onloadstart", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onloadstart"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onloadstart"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmousedown", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmousedown"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmousedown"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmouseenter", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmouseenter"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmouseenter"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmouseleave", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmouseleave"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmouseleave"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmousemove", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmousemove"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmousemove"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmouseout", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmouseout"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmouseout"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmouseover", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmouseover"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmouseover"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onmouseup", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onmouseup"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onmouseup"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onwheel", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onwheel"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onwheel"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onpause", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onpause"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onpause"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onplay", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onplay"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onplay"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onplaying", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onplaying"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onplaying"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onprogress", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onprogress"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onprogress"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onratechange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onratechange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onratechange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onreset", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onreset"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onreset"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onresize", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onresize"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onresize"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onscroll", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onscroll"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onscroll"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onseeked", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onseeked"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onseeked"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onseeking", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onseeking"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onseeking"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onselect", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onselect"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onselect"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onshow", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onshow"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onshow"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onstalled", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onstalled"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onstalled"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onsubmit", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onsubmit"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onsubmit"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onsuspend", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onsuspend"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onsuspend"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ontimeupdate", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ontimeupdate"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ontimeupdate"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "ontoggle", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["ontoggle"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["ontoggle"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onvolumechange", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onvolumechange"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onvolumechange"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, "onwaiting", {
  get() {
    return utils.tryWrapperForImpl(this[impl]["onwaiting"]);
  },
  set(V) {
    V = utils.tryImplForWrapper(V);
    this[impl]["onwaiting"] = V;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(GlobalEventHandlers.prototype, Symbol.toStringTag, {
  value: "GlobalEventHandlers",
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
    throw new TypeError(`${context} is not of type 'GlobalEventHandlers'.`);
  },
  create(constructorArgs, privateData) {
    let obj = Object.create(GlobalEventHandlers.prototype);
    this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(GlobalEventHandlers.prototype);
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
  interface: GlobalEventHandlers,
  expose: {}
};
module.exports = iface;

const Impl = require("../nodes/GlobalEventHandlers-impl.js");
