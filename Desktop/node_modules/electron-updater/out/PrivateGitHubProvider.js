"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrivateGitHubProvider = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
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

var path = _interopRequireWildcard(require("path"));

function _url() {
  const data = require("url");

  _url = function () {
    return data;
  };

  return data;
}

function _GitHubProvider() {
  const data = require("./GitHubProvider");

  _GitHubProvider = function () {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class PrivateGitHubProvider extends _GitHubProvider().BaseGitHubProvider {
  constructor(options, token, executor) {
    super(options, "api.github.com", executor);
    this.token = token;
  }

  createRequestOptions(url, headers) {
    const result = super.createRequestOptions(url, headers);
    result.redirect = "manual";
    return result;
  }

  async getLatestVersion() {
    const cancellationToken = new (_builderUtilRuntime().CancellationToken)();
    const channelFile = (0, _main().getChannelFilename)((0, _main().getDefaultChannelName)());
    const releaseInfo = await this.getLatestVersionInfo(cancellationToken);
    const asset = releaseInfo.assets.find(it => it.name === channelFile);

    if (asset == null) {
      // html_url must be always, but just to be sure
      throw (0, _builderUtilRuntime().newError)(`Cannot find ${channelFile} in the release ${releaseInfo.html_url || releaseInfo.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    }

    const url = new (_url().URL)(asset.url);
    let result;

    try {
      result = (0, _jsYaml().safeLoad)((await this.httpRequest(url, this.configureHeaders("application/octet-stream"), cancellationToken)));
    } catch (e) {
      if (e instanceof _builderUtilRuntime().HttpError && e.statusCode === 404) {
        throw (0, _builderUtilRuntime().newError)(`Cannot find ${channelFile} in the latest release artifacts (${url}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      }

      throw e;
    }

    result.assets = releaseInfo.assets;
    return result;
  }

  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }

  configureHeaders(accept) {
    return {
      Accept: accept,
      Authorization: `token ${this.token}`
    };
  }

  async getLatestVersionInfo(cancellationToken) {
    const url = (0, _main().newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl);

    try {
      return JSON.parse((await this.httpRequest(url, this.configureHeaders("application/vnd.github.v3+json"), cancellationToken)));
    } catch (e) {
      throw (0, _builderUtilRuntime().newError)(`Unable to find latest version on GitHub (${url}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }

  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }

  resolveFiles(updateInfo) {
    return (0, _Provider().getFileList)(updateInfo).map(it => {
      const name = path.posix.basename(it.url).replace(/ /g, "-");
      const asset = updateInfo.assets.find(it => it != null && it.name === name);

      if (asset == null) {
        throw (0, _builderUtilRuntime().newError)(`Cannot find asset "${name}" in: ${JSON.stringify(updateInfo.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      }

      return {
        url: new (_url().URL)(asset.url),
        info: it
      };
    });
  }

} exports.PrivateGitHubProvider = PrivateGitHubProvider;
//# sourceMappingURL=PrivateGitHubProvider.js.map