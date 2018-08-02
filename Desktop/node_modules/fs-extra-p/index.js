"use strict"

const fsExtra = require("fs-extra")
const Promise = require('bluebird-lst')

function makeFs(Promise) {
  const fs = Object.create(null)

  for (const methodName of Object.keys(fsExtra)) {
    const method = fsExtra[methodName]
    if (methodName === "createFile" || methodName === "mkdirp") {
      continue
    }

    if (typeof method !== "function" ||
        methodName.endsWith("Sync") ||
        methodName.endsWith("Stream") ||
        methodName.match(/^[A-Z]/) ||
        methodName === "exists" ||
        methodName === "watch" ||
        methodName === "watchFile" ||
        methodName === "unwatchFile") {
      fs[methodName] = method
    }
    else {
      fs[methodName] = Promise.promisify(method)
    }
  }

  fs.createFile = fs.ensureFile
  fs.mkdirp = fs.mkdirs
  return fs
}

module.exports = makeFs(Promise)