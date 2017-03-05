var fs = require('fs');
var path = require('path');
var Buffer = require('buffer').Buffer;
var _ = require('lodash');
var async = require('async');


/**
  * Finds the largest file in the given directory, optionally performing a recursive search.
  * @param {string} dir - the directory to search.
  * @param {object?} options - optional settings: { recurse?: boolean; preview?: boolean }.
  * @returns {object?} null if no files found, otherwise an object of the form
  *                    { path: string; size: number; preview?: string, searched: number; }
  */
var largest = function (dir, options, internal, callback) {

    // Parse arguments.
    options = options || largest.options;
    if (arguments.length == 3) callback = internal, internal = null;

    async.waterfall([
        function (callback) {

            // Get all directory entries.
            fs.readdir(dir, callback);
        },
        function (files, callback) {

            // Get all file stats in parallel.
            var paths = _.map(files, function (file) { return path.join(dir, file); });
            async.parallel(
                _.map(paths, function (path) { return fs.stat.bind(fs, path); }),
                function (err, stats) { callback(err, paths, stats); }
            );
        },
        function (paths, stats, callback) {

            // Build up a list of possible candidates, recursing into subfolders if requested.
            async.parallel(
                _.map(stats, function (stat, i) {
                    return (function (path, stat, i, callback) {
                        if (stat.isFile()) {
                            callback(null, { path: path, size: stat.size, searched: 1 });
                        } else if (!options.recurse) {
                            callback();
                        } else {
                            largest(path, options, true, function (err, cand) { // recurse
                                if (err) { callback(err); return; }
                                callback(null, cand);
                            });
                        }
                    }).bind(null, paths[i], stat, i);
                }),
                callback
            );
        },
        function (candidates, callback) {

            // Choose the best candidate.
            var result = _(candidates)
                .compact()
                .reduce(function (best, cand) {
                    if (cand.size > best.size) var temp = cand, cand = best, best = temp;
                    best.searched += cand.searched;
                    return best;
                });
            callback(null, result);
        },
        function (result, callback) {

            // Add a preview if requested (but skip if this is an internal step in a recursive search).
            if (result && options.preview && !internal) {
                var fd_;
                async.waterfall([
                    function(callback) {
                        fs.open(result.path, 'r', callback);
                    },
                    function(fd, callback) {
                        fd_ = fd;
                        var buffer = new Buffer(40);
                        fs.read(fd, buffer, 0, 40, 0, callback);
                    },
                    function(bytesRead, buffer, callback) {
                        result.preview = buffer.toString('utf-8', 0, bytesRead);
                        fs.close(fd_, callback);
                    },
                    function(cb1, cb2) {
                        (cb1 || cb2)(null, result); // bug workaround: mock-fs passes an extra arg to fs.close's callback, but it shouldn't
                    }
                ], callback);
            } else {
                callback(null, result); // Return without adding preview.
            }
        }
    ], callback);
};
largest.options = {};


module.exports = largest;
