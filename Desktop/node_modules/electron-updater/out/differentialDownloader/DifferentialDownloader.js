"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readBlockMap = readBlockMap;
exports.DifferentialDownloader = void 0;

function _bluebirdLst() {
  const data = _interopRequireDefault(require("bluebird-lst"));

  _bluebirdLst = function () {
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

function _fsExtraP() {
  const data = require("fs-extra-p");

  _fsExtraP = function () {
    return data;
  };

  return data;
}

function _DataSplitter() {
  const data = require("./DataSplitter");

  _DataSplitter = function () {
    return data;
  };

  return data;
}

function _downloadPlanBuilder() {
  const data = require("./downloadPlanBuilder");

  _downloadPlanBuilder = function () {
    return data;
  };

  return data;
}

function _multipleRangeDownloader() {
  const data = require("./multipleRangeDownloader");

  _multipleRangeDownloader = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const inflateRaw = _bluebirdLst().default.promisify(require("zlib").inflateRaw);

class DifferentialDownloader {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(blockAwareFileInfo, httpExecutor, options) {
    this.blockAwareFileInfo = blockAwareFileInfo;
    this.httpExecutor = httpExecutor;
    this.options = options;
    this.fileMetadataBuffer = null;
    this.logger = options.logger;
    this.baseRequestOptions = (0, _builderUtilRuntime().configureRequestOptionsFromUrl)(options.newUrl, {});
  }

  createRequestOptions(method = "get", newUrl) {
    return Object.assign({}, newUrl == null ? this.baseRequestOptions : (0, _builderUtilRuntime().configureRequestOptionsFromUrl)(newUrl, {}), {
      method,
      headers: Object.assign({}, this.options.requestHeaders, {
        Accept: "*/*"
      })
    });
  }

  doDownload(oldBlockMap, newBlockMap) {
    // we don't check other metadata like compressionMethod - generic check that it is make sense to differentially update is suitable for it
    if (oldBlockMap.version !== newBlockMap.version) {
      throw new Error(`version is different (${oldBlockMap.version} - ${newBlockMap.version}), full download is required`);
    }

    const logger = this.logger;
    const operations = (0, _downloadPlanBuilder().computeOperations)(oldBlockMap, newBlockMap, logger);

    if (logger.debug != null) {
      logger.debug(JSON.stringify(operations, null, 2));
    }

    let downloadSize = 0;
    let copySize = 0;

    for (const operation of operations) {
      const length = operation.end - operation.start;

      if (operation.kind === _downloadPlanBuilder().OperationKind.DOWNLOAD) {
        downloadSize += length;
      } else {
        copySize += length;
      }
    }

    const newPackageSize = this.blockAwareFileInfo.size;

    if (downloadSize + copySize + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== newPackageSize) {
      throw new Error(`Internal error, size mismatch: downloadSize: ${downloadSize}, copySize: ${copySize}, newPackageSize: ${newPackageSize}`);
    }

    logger.info(`Full: ${formatBytes(newPackageSize)}, To download: ${formatBytes(downloadSize)} (${Math.round(downloadSize / (newPackageSize / 100))}%)`);
    return this.downloadFile(operations);
  }

  async downloadFile(tasks) {
    const oldFileFd = await (0, _fsExtraP().open)(this.options.oldFile, "r");
    const newFileFd = await (0, _fsExtraP().open)(this.options.newFile, "w");
    const fileOut = (0, _fsExtraP().createWriteStream)(this.options.newFile, {
      fd: newFileFd
    });
    await new (_bluebirdLst().default)((resolve, reject) => {
      const streams = [];
      const digestTransform = new (_builderUtilRuntime().DigestTransform)(this.blockAwareFileInfo.sha512); // to simply debug, do manual validation to allow file to be fully written

      digestTransform.isValidateOnEnd = false;
      streams.push(digestTransform); // noinspection JSArrowFunctionCanBeReplacedWithShorthand

      fileOut.on("finish", () => {
        fileOut.close(() => {
          try {
            digestTransform.validate();
          } catch (e) {
            reject(e);
            return;
          }

          resolve();
        });
      });
      streams.push(fileOut);
      let lastStream = null;

      for (const stream of streams) {
        stream.on("error", reject);

        if (lastStream == null) {
          lastStream = stream;
        } else {
          lastStream = lastStream.pipe(stream);
        }
      }

      const firstStream = streams[0];
      let w;

      if (this.options.useMultipleRangeRequest) {
        w = (0, _multipleRangeDownloader().executeTasks)(this, tasks, firstStream, oldFileFd, reject);
      } else {
        let attemptCount = 0;
        let actualUrl = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);

        w = index => {
          if (index >= tasks.length) {
            if (this.fileMetadataBuffer != null) {
              firstStream.write(this.fileMetadataBuffer);
            }

            firstStream.end();
            return;
          }

          const operation = tasks[index++];

          if (operation.kind === _downloadPlanBuilder().OperationKind.COPY) {
            (0, _DataSplitter().copyData)(operation, firstStream, oldFileFd, reject, () => w(index));
          } else {
            const requestOptions = this.createRequestOptions("get", actualUrl);
            const range = `bytes=${operation.start}-${operation.end - 1}`;
            requestOptions.headers.Range = range;
            requestOptions.redirect = "manual";
            const debug = this.logger.debug;

            if (debug != null) {
              debug(`effective url: ${actualUrl == null ? "" : removeQuery(actualUrl)}, range: ${range}`);
            }

            const request = this.httpExecutor.doRequest(requestOptions, response => {
              // Electron net handles redirects automatically, our NodeJS test server doesn't use redirects - so, we don't check 3xx codes.
              if (response.statusCode >= 400) {
                reject((0, _builderUtilRuntime().createHttpError)(response));
              }

              response.pipe(firstStream, {
                end: false
              });
              response.once("end", () => {
                if (++attemptCount === 100) {
                  attemptCount = 0;
                  setTimeout(() => w(index), 1000);
                } else {
                  w(index);
                }
              });
            });
            request.on("redirect", (statusCode, method, redirectUrl) => {
              this.logger.info(`Redirect to ${removeQuery(redirectUrl)}`);
              actualUrl = redirectUrl;
              request.followRedirect();
            });
            this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
            request.end();
          }
        };
      }

      w(0);
    }).then(() => (0, _fsExtraP().close)(oldFileFd)).catch(error => {
      (0, _fsExtraP().closeSync)(oldFileFd);
      (0, _fsExtraP().closeSync)(newFileFd);
      throw error;
    });
  }

  async readRemoteBytes(start, endInclusive) {
    const buffer = Buffer.allocUnsafe(endInclusive + 1 - start);
    const requestOptions = this.createRequestOptions();
    requestOptions.headers.Range = `bytes=${start}-${endInclusive}`;
    let position = 0;
    await this.request(requestOptions, chunk => {
      chunk.copy(buffer, position);
      position += chunk.length;
    });
    return buffer;
  }

  request(requestOptions, dataHandler) {
    return new (_bluebirdLst().default)((resolve, reject) => {
      const request = this.httpExecutor.doRequest(requestOptions, response => {
        if (!(0, _multipleRangeDownloader().checkIsRangesSupported)(response, reject)) {
          return;
        }

        response.on("data", dataHandler);
        response.on("end", () => resolve());
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
      request.end();
    });
  }

}

exports.DifferentialDownloader = DifferentialDownloader;

async function readBlockMap(data) {
  return JSON.parse((await inflateRaw(data)).toString());
}

function formatBytes(value, symbol = " KB") {
  return new Intl.NumberFormat("en").format((value / 1024).toFixed(2)) + symbol;
} // safety


function removeQuery(url) {
  const index = url.indexOf("?");
  return index < 0 ? url : url.substring(0, index);
} 
//# sourceMappingURL=DifferentialDownloader.js.map