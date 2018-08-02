"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BintrayProvider = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _bintray() {
  const data = require("builder-util-runtime/out/bintray");

  _bintray = function () {
    return data;
  };

  return data;
}

function _url() {
  const data = require("url");

  _url = function () {
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

class BintrayProvider extends _main().Provider {
  constructor(configuration, httpExecutor) {
    super(httpExecutor);
    this.client = new (_bintray().BintrayClient)(configuration, httpExecutor, new (_builderUtilRuntime().CancellationToken)());
    this.baseUrl = (0, _main().newBaseUrl)(`https://dl.bintray.com/${this.client.owner}/${this.client.repo}`);
  }

  setRequestHeaders(value) {
    super.setRequestHeaders(value);
    this.client.setRequestHeaders(value);
  }

  async getLatestVersion() {
    try {
      const data = await this.client.getVersion("_latest");
      const channelFilename = (0, _main().getChannelFilename)((0, _main().getDefaultChannelName)());
      const files = await this.client.getVersionFiles(data.name);
      const channelFile = files.find(it => it.name.endsWith(`_${channelFilename}`) || it.name.endsWith(`-${channelFilename}`));

      if (channelFile == null) {
        // noinspection ExceptionCaughtLocallyJS
        throw (0, _builderUtilRuntime().newError)(`Cannot find channel file "${channelFilename}", existing files:\n${files.map(it => JSON.stringify(it, null, 2)).join(",\n")}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      }

      const channelFileUrl = new (_url().URL)(`https://dl.bintray.com/${this.client.owner}/${this.client.repo}/${channelFile.name}`);
      return (0, _Provider().parseUpdateInfo)((await this.httpRequest(channelFileUrl)), channelFilename, channelFileUrl);
    } catch (e) {
      if ("statusCode" in e && e.statusCode === 404) {
        throw (0, _builderUtilRuntime().newError)(`No latest version, please ensure that user, package and repository correctly configured. Or at least one version is published. ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }

      throw e;
    }
  }

  resolveFiles(updateInfo) {
    return (0, _Provider().resolveFiles)(updateInfo, this.baseUrl);
  }

} exports.BintrayProvider = BintrayProvider;
//# sourceMappingURL=BintrayProvider.js.map