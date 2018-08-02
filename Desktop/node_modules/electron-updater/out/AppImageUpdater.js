"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppImageUpdater = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

function _electronIsDev() {
  const data = _interopRequireDefault(require("electron-is-dev"));

  _electronIsDev = function () {
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

require("source-map-support/register");

function _BaseUpdater() {
  const data = require("./BaseUpdater");

  _BaseUpdater = function () {
    return data;
  };

  return data;
}

function _FileWithEmbeddedBlockMapDifferentialDownloader() {
  const data = require("./differentialDownloader/FileWithEmbeddedBlockMapDifferentialDownloader");

  _FileWithEmbeddedBlockMapDifferentialDownloader = function () {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppImageUpdater extends _BaseUpdater().BaseUpdater {
  constructor(options, app) {
    super(options, app);
  }

  checkForUpdatesAndNotify() {
    if (_electronIsDev().default) {
      return Promise.resolve(null);
    }

    if (process.env.APPIMAGE == null) {
      if (process.env.SNAP == null) {
        this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage");
      } else {
        this._logger.info("SNAP env is defined, updater is disabled");
      }

      return Promise.resolve(null);
    }

    return super.checkForUpdatesAndNotify();
  }
  /*** @private */


  async doDownloadUpdate(updateInfo, cancellationToken) {
    const provider = await this.provider;
    const fileInfo = (0, _Provider().findFile)(provider.resolveFiles(updateInfo), "AppImage");
    const requestHeaders = await this.computeRequestHeaders();
    const downloadOptions = {
      skipDirCreation: true,
      headers: requestHeaders,
      cancellationToken,
      sha512: fileInfo.info.sha512
    };
    return await this.executeDownload({
      fileExtension: "AppImage",
      downloadOptions,
      fileInfo,
      updateInfo,
      task: async updateFile => {
        const oldFile = process.env.APPIMAGE;

        if (oldFile == null) {
          throw (0, _builderUtilRuntime().newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        }

        let isDownloadFull = false;

        try {
          await new (_FileWithEmbeddedBlockMapDifferentialDownloader().FileWithEmbeddedBlockMapDifferentialDownloader)(fileInfo.info, this.httpExecutor, {
            newUrl: fileInfo.url.href,
            oldFile,
            logger: this._logger,
            newFile: updateFile,
            useMultipleRangeRequest: provider.useMultipleRangeRequest,
            requestHeaders
          }).download();
        } catch (e) {
          this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`); // during test (developer machine mac) we must throw error


          isDownloadFull = process.platform === "linux";
        }

        if (isDownloadFull) {
          await this.httpExecutor.download(fileInfo.url.href, updateFile, downloadOptions);
        }

        await (0, _fsExtraP().chmod)(updateFile, 0o755);
      }
    });
  }

  doInstall(installerPath, isSilent, isRunAfter) {
    const appImageFile = process.env.APPIMAGE;

    if (appImageFile == null) {
      throw (0, _builderUtilRuntime().newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    } // https://stackoverflow.com/a/1712051/1910191


    (0, _fsExtraP().unlinkSync)(appImageFile);
    let destination;

    if (path.basename(installerPath) === path.basename(appImageFile)) {
      // no version in the file name, overwrite existing
      destination = appImageFile;
    } else {
      destination = path.join(path.dirname(appImageFile), path.basename(installerPath));
    }

    (0, _child_process().execFileSync)("mv", ["-f", installerPath, destination]);
    const env = Object.assign({}, process.env, {
      APPIMAGE_SILENT_INSTALL: "true"
    });

    if (isRunAfter) {
      (0, _child_process().spawn)(destination, [], {
        detached: true,
        stdio: "ignore",
        env
      }).unref();
    } else {
      env.APPIMAGE_EXIT_AFTER_INSTALL = "true";
      (0, _child_process().execFileSync)(destination, [], {
        env
      });
    }

    return true;
  }

} exports.AppImageUpdater = AppImageUpdater;
//# sourceMappingURL=AppImageUpdater.js.map