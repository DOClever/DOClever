var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');
var async = require('../..').async;
var await = require('../..').await;


/**
  * Finds the largest file in the given directory, optionally performing a recursive search.
  * This is an alternative implementation, using an asynchronous iterator.
  * @param {string} dir - the directory to search.
  * @param {object?} options - optional settings: { recurse?: boolean; preview?: boolean }.
  * @returns {object?} null if no files found, otherwise an object of the form
  *                    { path: string; size: number; preview?: string, searched: number; }
  */
var largest = async.cps (function (dir, options, internal) {

    // Parse arguments.
    options = options || largest.options;

    // Create an iterable to return all files and subfolders (recursively) in dir.
    var descendentFiles = async.iterable (function self(yield_, dir) {
        var files = await (fs.readdirSync(dir));
        var paths = _.map(files, function (file) { return path.join(dir, file); });
        var stats = await.in (_.map(paths, function (path) { return fs.statAsync(path); }));
        _.each(stats, function(stat, i) {
            yield_ ({ in: dir, path: paths[i], stat: stat });
            if (options.recurse && stat.isDirectory()) self(yield_, paths[i]);
        });
    });

    // Enumerate all files and subfolders in 'dir' and choose the largest file.
    var best, searched = 0;
    var fileIterator = descendentFiles(dir);
    await (fileIterator.forEach(function (file) {
        if (file.stat.isFile()) {
            if (!best || file.stat.size > best.stat.size) best = file;
            ++searched;
        }
    }));
    var result = best ? { path: best.path, size: best.stat.size, searched: searched } : null;

    // Add a preview if requested (but skip if this is an internal step in a recursive search).
    if (result && options.preview && !internal) {
        var fd = await (fs.openAsync(result.path, 'r'));
        var buffer = new Buffer(40);
        var bytesRead = await (fs.readAsync(fd, buffer, 0, 40, 0));
        result.preview = buffer.toString('utf-8', 0, bytesRead);
        await (fs.closeSync(fd));
    }
    return result;
});
largest.options = {};


module.exports = largest;
