"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoOpLogger = exports.AppUpdater = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _crypto() {
  const data = require("crypto");

  _crypto = function () {
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

function _electronIsDev() {
  const data = _interopRequireDefault(require("electron-is-dev"));

  _electronIsDev = function () {
    return data;
  };

  return data;
}

function _events() {
  const data = require("events");

  _events = function () {
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

function _jsYaml() {
  const data = require("js-yaml");

  _jsYaml = function () {
    return data;
  };

  return data;
}

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _semver() {
  const data = require("semver");

  _semver = function () {
    return data;
  };

  return data;
}

require("source-map-support/register");

function _electronHttpExecutor() {
  const data = require("./electronHttpExecutor");

  _electronHttpExecutor = function () {
    return data;
  };

  return data;
}

function _GenericProvider() {
  const data = require("./GenericProvider");

  _GenericProvider = function () {
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

function _providerFactory() {
  const data = require("./providerFactory");

  _providerFactory = function () {
    return data;
  };

  return data;
}

function _DownloadedUpdateHelper() {
  const data = require("./DownloadedUpdateHelper");

  _DownloadedUpdateHelper = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppUpdater extends _events().EventEmitter {
  constructor(options, app) {
    super();
    /**
     * Whether to automatically download an update when it is found.
     */

    this.autoDownload = true;
    /**
     * Whether to automatically install a downloaded update on app quit (if `quitAndInstall` was not called before).
     *
     * Applicable only on Windows and Linux.
     */

    this.autoInstallOnAppQuit = true;
    /**
     * *GitHub provider only.* Whether to allow update to pre-release versions. Defaults to `true` if application version contains prerelease components (e.g. `0.12.1-alpha.1`, here `alpha` is a prerelease component), otherwise `false`.
     *
     * If `true`, downgrade will be allowed (`allowDowngrade` will be set to `true`).
     */

    this.allowPrerelease = false;
    /**
     * *GitHub provider only.* Get all release notes (from current version to latest), not just the latest.
     * @default false
     */

    this.fullChangelog = false;
    /**
     * Whether to allow version downgrade (when a user from the beta channel wants to go back to the stable channel).
     * @default false
     */

    this.allowDowngrade = false;
    this._channel = null;
    /**
     *  The request headers.
     */

    this.requestHeaders = null;
    this._logger = console;
    /**
     * For type safety you can use signals, e.g. `autoUpdater.signals.updateDownloaded(() => {})` instead of `autoUpdater.on('update-available', () => {})`
     */

    this.signals = new (_main().UpdaterSignal)(this);
    this._appUpdateConfigPath = null;
    this.updateAvailable = false;
    this.clientPromise = null;
    this.stagingUserIdPromise = new (_lazyVal().Lazy)(() => this.getOrCreateStagingUserId()); // public, allow to read old config for anyone

    this.configOnDisk = new (_lazyVal().Lazy)(() => this.loadUpdateConfig());
    this.checkForUpdatesPromise = null;
    this.updateInfo = null;
    this.on("error", error => {
      this._logger.error(`Error: ${error.stack || error.message}`);
    });

    if (app != null || global.__test_app != null) {
      this.app = app || global.__test_app;
      this.untilAppReady = Promise.resolve();
      this.httpExecutor = null;
    } else {
      this.app = require("electron").app;
      this.httpExecutor = new (_electronHttpExecutor().ElectronHttpExecutor)((authInfo, callback) => this.emit("login", authInfo, callback));
      this.untilAppReady = new Promise(resolve => {
        if (this.app.isReady()) {
          resolve();
        } else {
          this.app.on("ready", resolve);
        }
      });
    }

    this.downloadedUpdateHelper = new (_DownloadedUpdateHelper().DownloadedUpdateHelper)(this.app.getPath("userData"));
    const currentVersionString = this.app.getVersion();
    const currentVersion = (0, _semver().valid)(currentVersionString);

    if (currentVersion == null) {
      throw (0, _builderUtilRuntime().newError)(`App version is not a valid semver version: "${currentVersionString}`, "ERR_UPDATER_INVALID_VERSION");
    }

    this.currentVersion = currentVersion;
    this.allowPrerelease = hasPrereleaseComponents(this.currentVersion);

    if (options != null) {
      this.setFeedURL(options);
    }
  }
  /**
   * Get the update channel. Not applicable for GitHub. Doesn't return `channel` from the update configuration, only if was previously set.
   */


  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Not applicable for GitHub. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */


  set channel(value) {
    if (this._channel != null) {
      if (typeof value !== "string") {
        throw (0, _builderUtilRuntime().newError)(`Channel must be a string, but got: ${value}`, "ERR_UPDATER_INVALID_CHANNEL");
      } else if (value.length === 0) {
        throw (0, _builderUtilRuntime().newError)(`Channel must be not an empty string`, "ERR_UPDATER_INVALID_CHANNEL");
      }
    }

    this._channel = value;
    this.allowDowngrade = true;
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */


  get logger() {
    return this._logger;
  }

  set logger(value) {
    this._logger = value == null ? new NoOpLogger() : value;
  } // noinspection JSUnusedGlobalSymbols

  /**
   * test only
   * @private
   */


  set updateConfigPath(value) {
    this.clientPromise = null;
    this._appUpdateConfigPath = value;
    this.configOnDisk = new (_lazyVal().Lazy)(() => this.loadUpdateConfig());
  }

  get provider() {
    return this.clientPromise;
  } //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols


  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](/configuration/publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */


  setFeedURL(options) {
    // https://github.com/electron-userland/electron-builder/issues/1105
    let provider;

    if (typeof options === "string") {
      provider = new (_GenericProvider().GenericProvider)({
        provider: "generic",
        url: options
      }, this);
    } else {
      provider = (0, _providerFactory().createClient)(options, this);
    }

    this.clientPromise = Promise.resolve(provider);
  }
  /**
   * Asks the server whether there is an update.
   */


  checkForUpdates() {
    let checkForUpdatesPromise = this.checkForUpdatesPromise;

    if (checkForUpdatesPromise != null) {
      return checkForUpdatesPromise;
    }

    checkForUpdatesPromise = this._checkForUpdates();
    this.checkForUpdatesPromise = checkForUpdatesPromise;

    const nullizePromise = () => this.checkForUpdatesPromise = null;

    checkForUpdatesPromise.then(nullizePromise).catch(nullizePromise);
    return checkForUpdatesPromise;
  }

  checkForUpdatesAndNotify() {
    if (_electronIsDev().default) {
      return Promise.resolve(null);
    }

    this.signals.updateDownloaded(it => {
      new (_electron().Notification)({
        title: "A new update is ready to install",
        body: `${this.app.getName()} version ${it.version} is downloaded and will be automatically installed on exit`
      }).show();
    });
    return this.checkForUpdates();
  }

  async isStagingMatch(updateInfo) {
    const rawStagingPercentage = updateInfo.stagingPercentage;
    let stagingPercentage = rawStagingPercentage;

    if (stagingPercentage == null) {
      return true;
    }

    stagingPercentage = parseInt(stagingPercentage, 10);

    if (isNaN(stagingPercentage)) {
      this._logger.warn(`Staging percentage is NaN: ${rawStagingPercentage}`);

      return true;
    } // convert from user 0-100 to internal 0-1


    stagingPercentage = stagingPercentage / 100;
    const stagingUserId = await this.stagingUserIdPromise.value;

    const val = _builderUtilRuntime().UUID.parse(stagingUserId).readUInt32BE(12);

    const percentage = val / 0xFFFFFFFF;

    this._logger.info(`Staging percentage: ${stagingPercentage}, percentage: ${percentage}, user id: ${stagingUserId}`);

    return percentage < stagingPercentage;
  }

  async _checkForUpdates() {
    try {
      await this.untilAppReady;

      this._logger.info("Checking for update");

      this.emit("checking-for-update");
      return await this.doCheckForUpdates();
    } catch (e) {
      this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`);
      throw e;
    }
  }

  computeFinalHeaders(headers) {
    if (this.requestHeaders != null) {
      Object.assign(headers, this.requestHeaders);
    }

    return headers;
  }

  async getUpdateInfo() {
    await this.untilAppReady;

    if (this.clientPromise == null) {
      this.clientPromise = this.configOnDisk.value.then(it => (0, _providerFactory().createClient)(it, this));
    }

    const client = await this.clientPromise;
    const stagingUserId = await this.stagingUserIdPromise.value;
    client.setRequestHeaders(this.computeFinalHeaders({
      "X-User-Staging-Id": stagingUserId
    }));
    return await client.getLatestVersion();
  }

  async doCheckForUpdates() {
    const updateInfo = await this.getUpdateInfo();
    const latestVersion = (0, _semver().valid)(updateInfo.version);

    if (latestVersion == null) {
      throw (0, _builderUtilRuntime().newError)(`Latest version (from update server) is not valid semver version: "${latestVersion}`, "ERR_UPDATER_INVALID_VERSION");
    }

    const isStagingMatch = await this.isStagingMatch(updateInfo);

    if (!isStagingMatch || (this.allowDowngrade && !hasPrereleaseComponents(latestVersion) ? (0, _semver().eq)(latestVersion, this.currentVersion) : !(0, _semver().gt)(latestVersion, this.currentVersion))) {
      this.updateAvailable = false;

      this._logger.info(`Update for version ${this.currentVersion} is not available (latest version: ${updateInfo.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}.`);

      this.emit("update-not-available", updateInfo);
      return {
        versionInfo: updateInfo,
        updateInfo
      };
    }

    this.updateAvailable = true;
    this.updateInfo = updateInfo;
    this.onUpdateAvailable(updateInfo);
    const cancellationToken = new (_builderUtilRuntime().CancellationToken)(); //noinspection ES6MissingAwait

    return {
      versionInfo: updateInfo,
      updateInfo,
      cancellationToken,
      downloadPromise: this.autoDownload ? this.downloadUpdate(cancellationToken) : null
    };
  }

  onUpdateAvailable(updateInfo) {
    this._logger.info(`Found version ${updateInfo.version} (url: ${(0, _builderUtilRuntime().asArray)(updateInfo.files).map(it => it.url).join(", ")})`);

    this.emit("update-available", updateInfo);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<string>} Path to downloaded file.
   */


  async downloadUpdate(cancellationToken = new (_builderUtilRuntime().CancellationToken)()) {
    const updateInfo = this.updateInfo;

    if (updateInfo == null) {
      const error = new Error("Please check update first");
      this.dispatchError(error);
      throw error;
    }

    this._logger.info(`Downloading update from ${(0, _builderUtilRuntime().asArray)(updateInfo.files).map(it => it.url).join(", ")}`);

    try {
      return await this.doDownloadUpdate(updateInfo, cancellationToken);
    } catch (e) {
      this.dispatchError(e);
      throw e;
    }
  }

  dispatchError(e) {
    this.emit("error", e, (e.stack || e).toString());
  }

  async loadUpdateConfig() {
    if (this._appUpdateConfigPath == null) {
      this._appUpdateConfigPath = _electronIsDev().default ? path.join(this.app.getAppPath(), "dev-app-update.yml") : path.join(process.resourcesPath, "app-update.yml");
    }

    return (0, _jsYaml().safeLoad)((await (0, _fsExtraP().readFile)(this._appUpdateConfigPath, "utf-8")));
  }
  /*** @private */


  async computeRequestHeaders() {
    const fileExtraDownloadHeaders = (await this.provider).fileExtraDownloadHeaders;

    if (fileExtraDownloadHeaders != null) {
      const requestHeaders = this.requestHeaders;
      return requestHeaders == null ? fileExtraDownloadHeaders : Object.assign({}, fileExtraDownloadHeaders, requestHeaders);
    }

    return this.computeFinalHeaders({
      Accept: "*/*"
    });
  }

  async getOrCreateStagingUserId() {
    const file = path.join(this.app.getPath("userData"), ".updaterId");

    try {
      const id = await (0, _fsExtraP().readFile)(file, "utf-8");

      if (_builderUtilRuntime().UUID.check(id)) {
        return id;
      } else {
        this._logger.warn(`Staging user id file exists, but content was invalid: ${id}`);
      }
    } catch (e) {
      if (e.code !== "ENOENT") {
        this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
      }
    }

    const id = _builderUtilRuntime().UUID.v5((0, _crypto().randomBytes)(4096), _builderUtilRuntime().UUID.OID);

    this._logger.info(`Generated new staging user ID: ${id}`);

    try {
      await (0, _fsExtraP().outputFile)(file, id);
    } catch (e) {
      this._logger.warn(`Couldn't write out staging user ID: ${e}`);
    }

    return id;
  }

}

exports.AppUpdater = AppUpdater;

function hasPrereleaseComponents(version) {
  const versionPrereleaseComponent = (0, _semver().prerelease)(version);
  return versionPrereleaseComponent != null && versionPrereleaseComponent.length > 0;
}
/** @private */


class NoOpLogger {
  info(message) {// ignore
  }

  warn(message) {// ignore
  }

  error(message) {// ignore
  }

} exports.NoOpLogger = NoOpLogger;
//# sourceMappingURL=AppUpdater.js.map