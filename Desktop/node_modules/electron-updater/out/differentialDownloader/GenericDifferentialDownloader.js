"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDifferentialDownloader = void 0;

function _blockMapApi() {
  const data = require("builder-util-runtime/out/blockMapApi");

  _blockMapApi = function () {
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

function _DifferentialDownloader() {
  const data = require("./DifferentialDownloader");

  _DifferentialDownloader = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class GenericDifferentialDownloader extends _DifferentialDownloader().DifferentialDownloader {
  async download(newBlockMap) {
    await this.doDownload((await (0, _fsExtraP().readJson)(path.join(process.resourcesPath, "..", _blockMapApi().BLOCK_MAP_FILE_NAME))), newBlockMap);
  }

} exports.GenericDifferentialDownloader = GenericDifferentialDownloader;
//# sourceMappingURL=GenericDifferentialDownloader.js.map