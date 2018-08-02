"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultChannelName = getDefaultChannelName;
exports.getCustomChannelName = getCustomChannelName;
exports.getCurrentPlatform = getCurrentPlatform;
exports.isUseOldMacProvider = isUseOldMacProvider;
exports.getChannelFilename = getChannelFilename;
exports.newBaseUrl = newBaseUrl;
exports.newUrlFromBase = newUrlFromBase;
Object.defineProperty(exports, "AppUpdater", {
  enumerable: true,
  get: function () {
    return _AppUpdater().AppUpdater;
  }
});
Object.defineProperty(exports, "NoOpLogger", {
  enumerable: true,
  get: function () {
    return _AppUpdater().NoOpLogger;
  }
});
Object.defineProperty(exports, "CancellationToken", {
  enumerable: true,
  get: function () {
    return _builderUtilRuntime().CancellationToken;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function () {
    return _Provider().Provider;
  }
});
exports.UpdaterSignal = exports.UPDATE_DOWNLOADED = exports.DOWNLOAD_PROGRESS = void 0;

function _url() {
  const data = require("url");

  _url = function () {
    return data;
  };

  return data;
}

function _AppUpdater() {
  const data = require("./AppUpdater");

  _AppUpdater = function () {
    return data;
  };

  return data;
}

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _Provider() {
  const data = require("./Provider");

  _Provider = function () {
    return data;
  };

  return data;
}

// autoUpdater to mimic electron bundled autoUpdater
let _autoUpdater;

function _load_autoUpdater() {
  // tslint:disable:prefer-conditional-expression
  if (process.platform === "win32") {
    _autoUpdater = new (require("./NsisUpdater").NsisUpdater)();
  } else if (process.platform === "darwin") {
    _autoUpdater = new (require("./MacUpdater").MacUpdater)();
  } else {
    _autoUpdater = new (require("./AppImageUpdater").AppImageUpdater)();
  }

  return _autoUpdater;
}

Object.defineProperty(exports, "autoUpdater", {
  enumerable: true,
  get: () => {
    return _autoUpdater || _load_autoUpdater();
  }
}); // due to historical reasons for windows we use channel name without platform specifier

function getDefaultChannelName() {
  return `latest${getChannelFilePrefix()}`;
}

function getChannelFilePrefix() {
  const currentPlatform = getCurrentPlatform();

  if (currentPlatform === "linux") {
    const arch = process.env.TEST_UPDATER_ARCH || process.arch;
    const archSuffix = arch === "x64" ? "" : `-${arch}`;
    return "-linux" + archSuffix;
  } else {
    return currentPlatform === "darwin" ? "-mac" : "";
  }
}

function getCustomChannelName(channel) {
  return `${channel}${getChannelFilePrefix()}`;
}

function getCurrentPlatform() {
  return process.env.TEST_UPDATER_PLATFORM || process.platform;
}

function isUseOldMacProvider() {
  // getCurrentPlatform() === "darwin"
  return false;
}

function getChannelFilename(channel) {
  return `${channel}.yml`;
}

const DOWNLOAD_PROGRESS = "download-progress";
exports.DOWNLOAD_PROGRESS = DOWNLOAD_PROGRESS;
const UPDATE_DOWNLOADED = "update-downloaded";
exports.UPDATE_DOWNLOADED = UPDATE_DOWNLOADED;

class UpdaterSignal {
  constructor(emitter) {
    this.emitter = emitter;
  }
  /**
   * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
   */


  login(handler) {
    addHandler(this.emitter, "login", handler);
  }

  progress(handler) {
    addHandler(this.emitter, DOWNLOAD_PROGRESS, handler);
  }

  updateDownloaded(handler) {
    addHandler(this.emitter, UPDATE_DOWNLOADED, handler);
  }

  updateCancelled(handler) {
    addHandler(this.emitter, "update-cancelled", handler);
  }

}

exports.UpdaterSignal = UpdaterSignal;
const isLogEvent = false;

function addHandler(emitter, event, handler) {
  if (isLogEvent) {
    emitter.on(event, (...args) => {
      console.log("%s %s", event, args);
      handler.apply(null, args);
    });
  } else {
    emitter.on(event, handler);
  }
} // if baseUrl path doesn't ends with /, this path will be not prepended to passed pathname for new URL(input, base)

/** @internal */


function newBaseUrl(url) {
  const result = new (_url().URL)(url);

  if (!result.pathname.endsWith("/")) {
    result.pathname += "/";
  }

  return result;
}
/** @internal */


function newUrlFromBase(pathname, baseUrl) {
  const result = new (_url().URL)(pathname, baseUrl); // search is not propagated

  if (!result.search && baseUrl.search) {
    result.search = baseUrl.search;
  }

  return result;
} 
//# sourceMappingURL=main.js.map