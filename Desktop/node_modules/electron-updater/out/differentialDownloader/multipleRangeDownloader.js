"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTasks = executeTasks;
exports._executeTasks = _executeTasks;
exports.checkIsRangesSupported = checkIsRangesSupported;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
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

function executeTasks(differentialDownloader, tasks, out, oldFileFd, reject) {
  const w = taskOffset => {
    if (taskOffset >= tasks.length) {
      if (differentialDownloader.fileMetadataBuffer != null) {
        out.write(differentialDownloader.fileMetadataBuffer);
      }

      out.end();
      return;
    }

    const nextOffset = taskOffset + (differentialDownloader.options.useMultipleRangeRequest === false ? 1 : 1000);

    _executeTasks(differentialDownloader, {
      tasks,
      start: taskOffset,
      end: Math.min(tasks.length, nextOffset),
      oldFileFd
    }, out, () => w(nextOffset), reject);
  };

  return w;
}

function _executeTasks(differentialDownloader, options, out, resolve, reject) {
  let ranges = "bytes=";
  let partCount = 0;
  const partIndexToTaskIndex = new Map();
  const partIndexToLength = [];

  for (let i = options.start; i < options.end; i++) {
    const task = options.tasks[i];

    if (task.kind === _downloadPlanBuilder().OperationKind.DOWNLOAD) {
      ranges += `${task.start}-${task.end - 1}, `;
      partIndexToTaskIndex.set(partCount, i);
      partCount++;
      partIndexToLength.push(task.end - task.start);
    }
  }

  if (partCount <= 1) {
    // the only remote range - copy
    const w = index => {
      if (index >= options.end) {
        resolve();
        return;
      }

      const task = options.tasks[index++];

      if (task.kind === _downloadPlanBuilder().OperationKind.COPY) {
        (0, _DataSplitter().copyData)(task, out, options.oldFileFd, reject, () => w(index));
      } else {
        const requestOptions = differentialDownloader.createRequestOptions("get");
        requestOptions.headers.Range = `bytes=${task.start}-${task.end - 1}`;
        const request = differentialDownloader.httpExecutor.doRequest(requestOptions, response => {
          if (!checkIsRangesSupported(response, reject)) {
            return;
          }

          response.pipe(out, {
            end: false
          });
          response.once("end", () => w(index));
        });
        differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
        request.end();
      }
    };

    w(options.start);
    return;
  }

  const requestOptions = differentialDownloader.createRequestOptions("get");
  requestOptions.headers.Range = ranges.substring(0, ranges.length - 2);
  const request = differentialDownloader.httpExecutor.doRequest(requestOptions, response => {
    if (!checkIsRangesSupported(response, reject)) {
      return;
    }

    const contentType = (0, _builderUtilRuntime().safeGetHeader)(response, "content-type");
    const m = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(contentType);

    if (m == null) {
      reject(new Error(`Content-Type "multipart/byteranges" is expected, but got "${contentType}"`));
      return;
    }

    const dicer = new (_DataSplitter().DataSplitter)(out, options, partIndexToTaskIndex, m[1] || m[2], partIndexToLength, resolve);
    dicer.on("error", reject);
    response.pipe(dicer);
  });
  differentialDownloader.httpExecutor.addErrorAndTimeoutHandlers(request, reject);
  request.end();
}

function checkIsRangesSupported(response, reject) {
  // Electron net handles redirects automatically, our NodeJS test server doesn't use redirects - so, we don't check 3xx codes.
  if (response.statusCode >= 400) {
    reject((0, _builderUtilRuntime().createHttpError)(response));
    return false;
  }

  if (response.statusCode !== 206) {
    const acceptRanges = (0, _builderUtilRuntime().safeGetHeader)(response, "accept-ranges");

    if (acceptRanges == null || acceptRanges === "none") {
      reject(new Error(`Server doesn't support Accept-Ranges (response code ${response.statusCode})`));
      return false;
    }
  }

  return true;
} 
//# sourceMappingURL=multipleRangeDownloader.js.map