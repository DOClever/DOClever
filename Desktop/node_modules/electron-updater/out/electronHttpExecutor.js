"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElectronHttpExecutor = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _electron() {
  const data = require("electron");

  _electron = function () {
    return data;
  };

  return data;
}

function _fsExtraP() {
  const data = require("fs-extra-p");

  _fsExtraP = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class ElectronHttpExecutor extends _builderUtilRuntime().HttpExecutor {
  constructor(proxyLoginCallback) {
    super();
    this.proxyLoginCallback = proxyLoginCallback;
  }

  async download(url, destination, options) {
    if (options == null || !options.skipDirCreation) {
      await (0, _fsExtraP().ensureDir)(path.dirname(destination));
    }

    return await options.cancellationToken.createPromise((resolve, reject, onCancel) => {
      this.doDownload(Object.assign({}, (0, _builderUtilRuntime().configureRequestOptionsFromUrl)(url, {
        headers: options.headers || undefined
      }), {
        redirect: "manual"
      }), destination, 0, options, error => {
        if (error == null) {
          resolve(destination);
        } else {
          reject(error);
        }
      }, onCancel);
    });
  }

  doRequest(options, callback) {
    const request = _electron().net.request(options);

    request.on("response", callback);
    this.addProxyLoginHandler(request);
    return request;
  }

  addProxyLoginHandler(request) {
    if (this.proxyLoginCallback != null) {
      request.on("login", this.proxyLoginCallback);
    }
  }

  addRedirectHandlers(request, options, reject, redirectCount, handler) {
    request.on("redirect", (statusCode, method, redirectUrl) => {
      if (redirectCount > 10) {
        reject(new Error("Too many redirects (> 10)"));
        return;
      }

      handler(_builderUtilRuntime().HttpExecutor.prepareRedirectUrlOptions(redirectUrl, options));
    });
  }

} exports.ElectronHttpExecutor = ElectronHttpExecutor;
//# sourceMappingURL=electronHttpExecutor.js.map