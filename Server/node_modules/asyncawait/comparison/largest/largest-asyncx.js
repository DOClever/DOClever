var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');
var asyncx = require('asyncx');
var async = asyncx.async;
var await = asyncx.await;
asyncx.config('Fiber', require('fibers'));


/**
  * Finds the largest file in the given directory, optionally performing a recursive search.
  * @param {string} dir - the directory to search.
  * @param {object?} options - optional settings: { recurse?: boolean; preview?: boolean }.
  * @returns {object?} null if no files found, otherwise an object of the form
  *                    { path: string; size: number; preview?: string, searched: number; }.
  */
var largest = async.cps (function self(dir, options, internal) {

    // Parse arguments.
    options = options || largest.options;

    // Enumerate all files and subfolders in 'dir' to get their stats.
    var files = await (fs.readdirAsync(dir));
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = await (_.map(paths, function (path) { return fs.statAsync(path); }));

    // Build up a list of possible candidates, recursing into subfolders if requested.
    var candidates = /*await*/ (_.map(stats, function (stat, i) {
        if (stat.isFile()) return { path: paths[i], size: stat.size, searched: 1 };
        return options.recurse ? self(paths[i], options, true) : null;
    }));

    // Choose the best candidate.
    var result = _(candidates)
        .compact()
        .reduce(function (best, cand) {
            if (cand.size > best.size) var temp = cand, cand = best, best = temp;
            best.searched += cand.searched;
            return best;
        });

    // Add a preview if requested (but skip if this is an internal step in a recursive search).
    if (result && options.preview && !internal) {
        var fd = await (fs.openAsync(result.path, 'r'));
        var buffer = new Buffer(40);
        var bytesReadAndBuffer = await (fs.readAsync(fd, buffer, 0, 40, 0));
        result.preview = bytesReadAndBuffer[1].toString('utf8');
        await (fs.closeAsync(fd));
    }
    return result;
});
largest.options = {};


module.exports = largest;
