"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MacUpdater = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _http() {
  const data = require("http");

  _http = function () {
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

function _main() {
  const data = require("./main");

  _main = function () {
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

class MacUpdater extends _AppUpdater().AppUpdater {
  constructor(options) {
    super(options);
    this.nativeUpdater = require("electron").autoUpdater;
    this.nativeUpdater.on("error", it => {
      this._logger.warn(it);

      this.emit("error", it);
    });
    this.nativeUpdater.on("update-downloaded", () => {
      this._logger.info(`New version ${this.updateInfo.version} has been downloaded`);

      this.emit(_main().UPDATE_DOWNLOADED, this.updateInfo);
    });
  }

  async doDownloadUpdate(updateInfo, cancellationToken) {
    const files = (await this.provider).resolveFiles(updateInfo);
    const zipFileInfo = (0, _Provider().findFile)(files, "zip", ["pkg", "dmg"]);

    if (zipFileInfo == null) {
      throw (0, _builderUtilRuntime().newError)(`ZIP file not provided: ${(0, _builderUtilRuntime().safeStringifyJson)(files)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    }

    const server = (0, _http().createServer)();
    server.on("close", () => {
      this._logger.info(`Proxy server for native Squirrel.Mac is closed (was started to download ${zipFileInfo.url.href})`);
    });

    function getServerUrl() {
      const address = server.address();
      return `http://${address.address}:${address.port}`;
    }

    const requestHeaders = await this.computeRequestHeaders();
    return await new Promise((resolve, reject) => {
      server.on("request", (request, response) => {
        const requestUrl = request.url;

        this._logger.info(`${requestUrl} requested`);

        if (requestUrl === "/") {
          const data = Buffer.from(`{ "url": "${getServerUrl()}/app.zip" }`);
          response.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Length": data.length
          });
          response.end(data);
        } else if (requestUrl.startsWith("/app.zip")) {
          let errorOccurred = false;
          response.on("finish", () => {
            try {
              setImmediate(() => server.close());
            } finally {
              if (!errorOccurred) {
                this.nativeUpdater.removeListener("error", reject);
                resolve([]);
              }
            }
          });
          this.doProxyUpdateFile(response, zipFileInfo.url.href, requestHeaders, zipFileInfo.info.sha512, cancellationToken, error => {
            errorOccurred = true;

            try {
              response.writeHead(500);
              response.end();
            } finally {
              this.nativeUpdater.removeListener("error", reject);
              reject(new Error(`Cannot download "${zipFileInfo.url}": ${error}`));
            }
          });
        } else {
          this._logger.warn(`${requestUrl} requested, but not supported`);

          response.writeHead(404);
          response.end();
        }
      });
      server.listen(0, "127.0.0.1", 16, () => {
        this.nativeUpdater.setFeedURL(`${getServerUrl()}`, {
          "Cache-Control": "no-cache"
        });
        this.nativeUpdater.once("error", reject);
        this.nativeUpdater.checkForUpdates();
      });
    });
  }

  doProxyUpdateFile(nativeResponse, url, headers, sha512, cancellationToken, errorHandler) {
    const downloadRequest = this.httpExecutor.doRequest((0, _builderUtilRuntime().configureRequestOptionsFromUrl)(url, {
      headers
    }), downloadResponse => {
      if (downloadResponse.statusCode >= 400) {
        try {
          nativeResponse.writeHead(404);
          nativeResponse.end();
        } finally {
          errorHandler(new Error(`Cannot download "${url}", status ${downloadResponse.statusCode}: ${downloadResponse.statusMessage}`));
        }

        return;
      } // in tests Electron NET Api is not used, so, we have to handle redirect.


      const redirectUrl = (0, _builderUtilRuntime().safeGetHeader)(downloadResponse, "location");

      if (redirectUrl != null) {
        this.doProxyUpdateFile(nativeResponse, redirectUrl, headers, sha512, cancellationToken, errorHandler);
        return;
      }

      const nativeHeaders = {
        "Content-Type": "application/zip"
      };
      const streams = [];
      const downloadListenerCount = this.listenerCount(_main().DOWNLOAD_PROGRESS);

      this._logger.info(`${_main().DOWNLOAD_PROGRESS} listener count: ${downloadListenerCount}`);

      if (downloadListenerCount > 0) {
        const contentLength = (0, _builderUtilRuntime().safeGetHeader)(downloadResponse, "content-length");

        this._logger.info(`contentLength: ${contentLength}`);

        if (contentLength != null) {
          nativeHeaders["Content-Length"] = contentLength;
          streams.push(new (_builderUtilRuntime().ProgressCallbackTransform)(parseInt(contentLength, 10), cancellationToken, it => this.emit(_main().DOWNLOAD_PROGRESS, it)));
        }
      }

      nativeResponse.writeHead(200, nativeHeaders); // for mac only sha512 is produced (sha256 is published for windows only to preserve backward compatibility)

      if (sha512 != null) {
        // "hex" to easy migrate to new base64 encoded hash (we already produces latest-mac.yml with hex encoded hash)
        streams.push(new (_builderUtilRuntime().DigestTransform)(sha512, "sha512", sha512.length === 128 && !sha512.includes("+") && !sha512.includes("Z") && !sha512.includes("=") ? "hex" : "base64"));
      }

      streams.push(nativeResponse);
      let lastStream = downloadResponse;

      for (const stream of streams) {
        stream.on("error", errorHandler);
        lastStream = lastStream.pipe(stream);
      }
    });
    downloadRequest.on("redirect", (statusCode, method, redirectUrl) => {
      if (headers.Authorization != null && headers.Authorization.startsWith("token")) {
        const parsedNewUrl = new URL(redirectUrl);

        if (parsedNewUrl.hostname.endsWith(".amazonaws.com")) {
          delete headers.Authorization;
        }
      }

      this.doProxyUpdateFile(nativeResponse, redirectUrl, headers, sha512, cancellationToken, errorHandler);
    });
    downloadRequest.on("error", errorHandler);
    downloadRequest.end();
  }

  quitAndInstall() {
    this.nativeUpdater.quitAndInstall();
  }

} exports.MacUpdater = MacUpdater;
//# sourceMappingURL=MacUpdater.js.map