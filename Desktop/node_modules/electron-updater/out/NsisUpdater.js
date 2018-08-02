"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NsisUpdater = void 0;

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

function _GenericDifferentialDownloader() {
  const data = require("./differentialDownloader/GenericDifferentialDownloader");

  _GenericDifferentialDownloader = function () {
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

function _fsExtraP() {
  const data = require("fs-extra-p");

  _fsExtraP = function () {
    return data;
  };

  return data;
}

function _windowsExecutableCodeSignatureVerifier() {
  const data = require("./windowsExecutableCodeSignatureVerifier");

  _windowsExecutableCodeSignatureVerifier = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class NsisUpdater extends _BaseUpdater().BaseUpdater {
  constructor(options, app) {
    super(options, app);
  }
  /*** @private */


  async doDownloadUpdate(updateInfo, cancellationToken) {
    const provider = await this.provider;
    const fileInfo = (0, _Provider().findFile)(provider.resolveFiles(updateInfo), "exe");
    const requestHeaders = await this.computeRequestHeaders();
    const downloadOptions = {
      skipDirCreation: true,
      headers: requestHeaders,
      cancellationToken,
      sha512: fileInfo.info.sha512
    };
    return await this.executeDownload({
      fileExtension: "exe",
      downloadOptions,
      fileInfo,
      updateInfo,
      task: async (destinationFile, packageFile, removeTempDirIfAny) => {
        if (await this.differentialDownloadInstaller(fileInfo, destinationFile, requestHeaders, provider)) {
          await this.httpExecutor.download(fileInfo.url.href, destinationFile, downloadOptions);
        }

        const signatureVerificationStatus = await this.verifySignature(destinationFile);

        if (signatureVerificationStatus != null) {
          await removeTempDirIfAny(); // noinspection ThrowInsideFinallyBlockJS

          throw (0, _builderUtilRuntime().newError)(`New version ${updateInfo.version} is not signed by the application owner: ${signatureVerificationStatus}`, "ERR_UPDATER_INVALID_SIGNATURE");
        }

        const packageInfo = fileInfo.packageInfo;

        if (packageInfo != null && packageFile != null) {
          if (await this.differentialDownloadWebPackage(packageInfo, packageFile, provider)) {
            try {
              await this.httpExecutor.download(packageInfo.path, packageFile, {
                skipDirCreation: true,
                headers: requestHeaders,
                cancellationToken,
                sha512: packageInfo.sha512
              });
            } catch (e) {
              try {
                await (0, _fsExtraP().unlink)(packageFile);
              } catch (ignored) {// ignore
              }

              throw e;
            }
          }
        }
      }
    });
  } // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }


  async verifySignature(tempUpdateFile) {
    let publisherName;

    try {
      publisherName = (await this.configOnDisk.value).publisherName;

      if (publisherName == null) {
        return null;
      }
    } catch (e) {
      if (e.code === "ENOENT") {
        // no app-update.yml
        return null;
      }

      throw e;
    }

    return await (0, _windowsExecutableCodeSignatureVerifier().verifySignature)(Array.isArray(publisherName) ? publisherName : [publisherName], tempUpdateFile, this._logger);
  }

  doInstall(installerPath, isSilent, isForceRunAfter) {
    const args = ["--updated"];

    if (isSilent) {
      args.push("/S");
    }

    if (isForceRunAfter) {
      args.push("--force-run");
    }

    const packagePath = this.downloadedUpdateHelper.packageFile;

    if (packagePath != null) {
      // only = form is supported
      args.push(`--package-file="${packagePath}"`);
    }

    const spawnOptions = {
      detached: true,
      stdio: "ignore"
    };

    try {
      (0, _child_process().spawn)(installerPath, args, spawnOptions).unref();
    } catch (e) {
      // yes, such errors dispatched not as error event
      // https://github.com/electron-userland/electron-builder/issues/1129
      if (e.code === "UNKNOWN" || e.code === "EACCES") {
        // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
        this._logger.info("Access denied or UNKNOWN error code on spawn, will be executed again using elevate");

        try {
          (0, _child_process().spawn)(path.join(process.resourcesPath, "elevate.exe"), [installerPath].concat(args), spawnOptions).unref();
        } catch (e) {
          this.dispatchError(e);
        }
      } else {
        this.dispatchError(e);
      }
    }

    return true;
  }

  async differentialDownloadInstaller(fileInfo, installerPath, requestHeaders, provider) {
    if (process.env.__NSIS_DIFFERENTIAL_UPDATE__ == null) {
      return true;
    }

    try {
      const blockMapData = JSON.parse((await provider.httpRequest((0, _main().newUrlFromBase)(`${fileInfo.url.pathname}.blockMap.json`, fileInfo.url))));
      await new (_GenericDifferentialDownloader().GenericDifferentialDownloader)(fileInfo.info, this.httpExecutor, {
        newUrl: fileInfo.url.href,
        oldFile: path.join(this.app.getPath("userData"), "installer.exe"),
        logger: this._logger,
        newFile: installerPath,
        useMultipleRangeRequest: provider.useMultipleRangeRequest,
        requestHeaders
      }).download(blockMapData);
    } catch (e) {
      this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`); // during test (developer machine mac) we must throw error


      return process.platform === "win32";
    }

    return false;
  }

  async differentialDownloadWebPackage(packageInfo, packagePath, provider) {
    if (packageInfo.blockMapSize == null) {
      return true;
    }

    try {
      await new (_FileWithEmbeddedBlockMapDifferentialDownloader().FileWithEmbeddedBlockMapDifferentialDownloader)(packageInfo, this.httpExecutor, {
        newUrl: packageInfo.path,
        oldFile: path.join(process.resourcesPath, "..", "package.7z"),
        logger: this._logger,
        newFile: packagePath,
        requestHeaders: this.requestHeaders,
        useMultipleRangeRequest: provider.useMultipleRangeRequest
      }).download();
    } catch (e) {
      this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`); // during test (developer machine mac or linux) we must throw error


      return process.platform === "win32";
    }

    return false;
  }

} exports.NsisUpdater = NsisUpdater;
//# sourceMappingURL=NsisUpdater.js.map