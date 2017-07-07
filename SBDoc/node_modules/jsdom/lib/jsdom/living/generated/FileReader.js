"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");
const EventTarget = require("./EventTarget.js");
const impl = utils.implSymbol;
const convertBlob = require("./Blob").convert;

module.exports = {
  createInterface: function(defaultPrivateData = {}) {
    function FileReader() {
      iface.setup(this);
    }
    Object.setPrototypeOf(FileReader.prototype, EventTarget.interface.prototype);
    Object.setPrototypeOf(FileReader, EventTarget.interface);

    FileReader.prototype.readAsArrayBuffer = function readAsArrayBuffer(blob) {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsArrayBuffer' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }

      const args = [];
      for (let i = 0; i < arguments.length && i < 1; ++i) {
        args[i] = arguments[i];
      }
      args[0] = convertBlob(args[0], { context: "Failed to execute 'readAsArrayBuffer' on 'FileReader': parameter 1" });
      return this[impl].readAsArrayBuffer(...args);
    };

    FileReader.prototype.readAsText = function readAsText(blob) {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsText' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }

      const args = [];
      for (let i = 0; i < arguments.length && i < 2; ++i) {
        args[i] = arguments[i];
      }
      args[0] = convertBlob(args[0], { context: "Failed to execute 'readAsText' on 'FileReader': parameter 1" });
      if (args[1] !== undefined) {
        args[1] = conversions["DOMString"](args[1], {
          context: "Failed to execute 'readAsText' on 'FileReader': parameter 2"
        });
      }
      return this[impl].readAsText(...args);
    };

    FileReader.prototype.readAsDataURL = function readAsDataURL(blob) {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'readAsDataURL' on 'FileReader': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }

      const args = [];
      for (let i = 0; i < arguments.length && i < 1; ++i) {
        args[i] = arguments[i];
      }
      args[0] = convertBlob(args[0], { context: "Failed to execute 'readAsDataURL' on 'FileReader': parameter 1" });
      return this[impl].readAsDataURL(...args);
    };

    FileReader.prototype.abort = function abort() {
      if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl].abort();
    };
    Object.defineProperty(FileReader, "EMPTY", {
      value: 0,
      enumerable: true
    });
    Object.defineProperty(FileReader.prototype, "EMPTY", {
      value: 0,
      enumerable: true
    });

    Object.defineProperty(FileReader, "LOADING", {
      value: 1,
      enumerable: true
    });
    Object.defineProperty(FileReader.prototype, "LOADING", {
      value: 1,
      enumerable: true
    });

    Object.defineProperty(FileReader, "DONE", {
      value: 2,
      enumerable: true
    });
    Object.defineProperty(FileReader.prototype, "DONE", {
      value: 2,
      enumerable: true
    });

    Object.defineProperty(FileReader.prototype, "readyState", {
      get() {
        return this[impl]["readyState"];
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(FileReader.prototype, "result", {
      get() {
        return utils.tryWrapperForImpl(this[impl]["result"]);
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(FileReader.prototype, "error", {
      get() {
        return utils.tryWrapperForImpl(this[impl]["error"]);
      },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(FileReader.prototype, "onloadstart", {
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

    Object.defineProperty(FileReader.prototype, "onprogress", {
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

    Object.defineProperty(FileReader.prototype, "onload", {
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

    Object.defineProperty(FileReader.prototype, "onabort", {
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

    Object.defineProperty(FileReader.prototype, "onerror", {
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

    Object.defineProperty(FileReader.prototype, "onloadend", {
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

    Object.defineProperty(FileReader.prototype, Symbol.toStringTag, {
      value: "FileReader",
      writable: false,
      enumerable: false,
      configurable: true
    });

    const iface = {
      create(constructorArgs, privateData) {
        let obj = Object.create(FileReader.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
      },
      createImpl(constructorArgs, privateData) {
        let obj = Object.create(FileReader.prototype);
        this.setup(obj, constructorArgs, privateData);
        return utils.implForWrapper(obj);
      },
      _internalSetup(obj) {
        EventTarget._internalSetup(obj);
      },
      setup(obj, constructorArgs, privateData) {
        if (!privateData) privateData = {};
        for (var prop in defaultPrivateData) {
          if (!(prop in privateData)) {
            privateData[prop] = defaultPrivateData[prop];
          }
        }
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
      interface: FileReader,
      expose: {
        Window: { FileReader: FileReader },
        Worker: { FileReader: FileReader }
      }
    };
    return iface;
  },
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
    throw new TypeError(`${context} is not of type 'FileReader'.`);
  }
};

const Impl = require("../file-api/FileReader-impl.js");
