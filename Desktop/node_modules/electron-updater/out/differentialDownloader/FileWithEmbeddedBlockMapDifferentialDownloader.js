"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;

function _blockMapApi() {
  const data = require("builder-util-runtime/out/blockMapApi");

  _blockMapApi = function () {
    return data;
  };

  return data;
}

function _DifferentialDownloader() {
  const data = require("./DifferentialDownloader");

  _DifferentialDownloader = function () {
    return data;
  };

  return data;
}

class FileWithEmbeddedBlockMapDifferentialDownloader extends _DifferentialDownloader().DifferentialDownloader {
  async download() {
    const packageInfo = this.blockAwareFileInfo;
    const fileSize = packageInfo.size;
    const offset = fileSize - (packageInfo.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(offset, fileSize - 1);
    const newBlockMap = await (0, _DifferentialDownloader().readBlockMap)(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(JSON.parse((await (0, _blockMapApi().readEmbeddedBlockMapData)(this.options.oldFile))), newBlockMap);
  }

} exports.FileWithEmbeddedBlockMapDifferentialDownloader = FileWithEmbeddedBlockMapDifferentialDownloader;
//# sourceMappingURL=FileWithEmbeddedBlockMapDifferentialDownloader.js.map