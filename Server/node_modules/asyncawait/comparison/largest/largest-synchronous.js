var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');


/**
  * Finds the largest file in the given directory, optionally performing a recursive search.
  * @param {string} dir - the directory to search.
  * @param {object?} options - optional settings: { recurse?: boolean; preview?: boolean }.
  * @returns {object?} null if no files found, otherwise an object of the form
  *                    { path: string; size: number; preview?: string, searched: number; }
  */
var largest = function (dir, options, internal) {

    // Parse arguments.
    options = options || largest.options;

    // Enumerate all files and subfolders in 'dir' to get their stats.
    var files = fs.readdirSync(dir);
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = _.map(paths, function (path) { return fs.statSync(path); });

    // Build up a list of possible candidates, recursing into subfolders if requested.
    var candidates = _.map(stats, function (stat, i) {
        if (stat.isFile()) return { path: paths[i], size: stat.size, searched: 1 };
        return options.recurse ? largest(paths[i], options, true) : null;
    });

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
        var fd = fs.openSync(result.path, 'r');
        var buffer = new Buffer(40);
        var bytesRead = fs.readSync(fd, buffer, 0, 40, 0);
        result.preview = buffer.toString('utf-8', 0, bytesRead);
        fs.closeSync(fd);
    }
    return result;
};
largest.options = {};


function nodeified(dir, options, callback) {
    if (arguments.length == 2) callback = options, options = null;
    try {
        callback(null, largest(dir, options));
    }
    catch (err) {
        callback(err);
    }
}
module.exports = nodeified;
