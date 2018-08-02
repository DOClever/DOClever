"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseUpdater = void 0;

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

var path = _interopRequireWildcard(require("path"));

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class BaseUpdater extends _AppUpdater().AppUpdater {
  constructor(options, app) {
    super(options, app);
    this.quitAndInstallCalled = false;
    this.quitHandlerAdded = false;
  }

  async quitAndInstall(isSilent = false, isForceRunAfter = false) {
    this._logger.info(`Install on explicit quitAndInstall`);

    const isInstalled = await this.install(isSilent, isSilent ? isForceRunAfter : true);

    if (isInstalled) {
      setImmediate(() => {
        if (this.app.quit !== undefined) {
          this.app.quit();
        }
      });
    } else {
      this.quitAndInstallCalled = false;
    }
  }

  async executeDownload(taskOptions) {
    if (this.listenerCount(_main().DOWNLOAD_PROGRESS) > 0) {
      taskOptions.downloadOptions.onProgress = it => this.emit(_main().DOWNLOAD_PROGRESS, it);
    }

    const updateInfo = taskOptions.updateInfo;
    const version = updateInfo.version;
    const fileInfo = taskOptions.fileInfo;
    const packageInfo = fileInfo.packageInfo;
    const cacheDir = this.downloadedUpdateHelper.cacheDir;
    await (0, _fsExtraP().ensureDir)(cacheDir);
    const updateFileName = taskOptions.fileExtension === "AppImage" ? path.basename(updateInfo.path) : `installer-${version}.${taskOptions.fileExtension}`;
    const updateFile = path.join(cacheDir, updateFileName);
    const packageFile = packageInfo == null ? null : path.join(cacheDir, `package-${version}.${path.extname(packageInfo.path) || "7z"}`);

    const done = () => {
      this.downloadedUpdateHelper.setDownloadedFile(updateFile, packageFile, updateInfo, fileInfo);
      this.addQuitHandler();
      this.emit(_main().UPDATE_DOWNLOADED, updateInfo);
      return packageFile == null ? [updateFile] : [updateFile, packageFile];
    };

    const log = this._logger;

    if (await this.downloadedUpdateHelper.validateDownloadedPath(updateFile, updateInfo, fileInfo, log)) {
      return done();
    }

    const removeFileIfAny = () => {
      this.downloadedUpdateHelper.clear();
      return (0, _fsExtraP().unlink)(updateFile).catch(() => {// ignored
      });
    }; // https://github.com/electron-userland/electron-builder/pull/2474#issuecomment-366481912


    let nameCounter = 0;
    let tempUpdateFile = path.join(cacheDir, `temp-${updateFileName}`);

    for (let i = 0; i < 3; i++) {
      try {
        await (0, _fsExtraP().unlink)(tempUpdateFile);
      } catch (e) {
        if (e.code === "ENOENT") {
          break;
        }

        log.warn(`Error on remove temp update file: ${e}`);
        tempUpdateFile = path.join(cacheDir, `temp-${nameCounter++}-${updateFileName}`);
      }
    }

    try {
      await taskOptions.task(tempUpdateFile, packageFile, removeFileIfAny);
      await (0, _fsExtraP().rename)(tempUpdateFile, updateFile);
    } catch (e) {
      await removeFileIfAny();

      if (e instanceof _builderUtilRuntime().CancellationError) {
        log.info("Cancelled");
        this.emit("update-cancelled", updateInfo);
      }

      throw e;
    }

    log.info(`New version ${version} has been downloaded to ${updateFile}`);
    return done();
  }

  async install(isSilent, isRunAfter) {
    if (this.quitAndInstallCalled) {
      this._logger.warn("install call ignored: quitAndInstallCalled is set to true");

      return false;
    }

    const installerPath = this.downloadedUpdateHelper.file; // todo check (for now it is ok to no check as before, cached (from previous launch) update file checked in any case)
    // const isValid = await this.isUpdateValid(installerPath)

    if (installerPath == null) {
      this.dispatchError(new Error("No valid update available, can't quit and install"));
      return false;
    } // prevent calling several times


    this.quitAndInstallCalled = true;

    try {
      this._logger.info(`Install: isSilent: ${isSilent}, isRunAfter: ${isRunAfter}`);

      return this.doInstall(installerPath, isSilent, isRunAfter);
    } catch (e) {
      this.dispatchError(e);
      return false;
    }
  }

  addQuitHandler() {
    if (this.quitHandlerAdded || !this.autoInstallOnAppQuit) {
      return;
    }

    this.quitHandlerAdded = true;
    this.app.once("quit", async () => {
      if (!this.quitAndInstallCalled) {
        this._logger.info("Auto install update on quit");

        await this.install(true, false);
      } else {
        this._logger.info("Update installer has already been triggered. Quitting application.");
      }
    });
  }

} exports.BaseUpdater = BaseUpdater;
//# sourceMappingURL=BaseUpdater.js.map