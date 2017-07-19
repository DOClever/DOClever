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
var largest = function (dir, options, internal, callback) {

    // Parse arguments.
    options = options || largest.options;
    if (arguments.length == 3) callback = internal, internal = null;

    // Enumerate all files and subfolders in 'dir' to get their stats.
    function getAllPathsAndStats(callback) {
        fs.readdir(dir, function (err, files) {
            if (err) { callback(err); return; }
            var paths = _.map(files, function (file) { return path.join(dir, file); });
            var stats = [];
            var remaining = paths.length;
            if (remaining === 0) {

                // Directory is empty.
                callback(null, { paths: paths, stats: stats });
            } else {

                // Get all file stats in parallel.
                paths.forEach(function (path, i) {
                    fs.stat(path, function (err, stat) {
                        if (remaining === 0) return;
                        if (err) {
                            remaining = 0;
                            callback(err);
                        } else {
                            stats[i] = stat;
                            --remaining;
                            if (remaining === 0) callback(null, { paths: paths, stats: stats });
                        }
                    });
                });
            }
        });
    }

    // Build up a list of possible candidates, recursing into subfolders if requested.
    function listCandidates(paths, stats, callback) {
        var candidates = [];
        var remaining = paths.length;
        for (var i = 0; i < paths.length; ++i) {
            if (stats[i].isFile()) {
                candidates.push({ path: paths[i], size: stats[i].size, searched: 1 });
                --remaining;
            } else if (!options.recurse) {
                --remaining;
            } else {
                largest(paths[i], options, true, function (err, cand) { // recurse
                    if (err) { callback(err); return; }
                    if (cand) candidates.push(cand);
                    --remaining;
                    if (!remaining) callback(null, candidates);
                });
            }
        }
        if (!remaining) callback(null, candidates); // catch fully synchronous cases
    }

    // Choose the best candidate.
    function selectBestCandidate(candidates, callback) {
        var result = _(candidates)
            .reduce(function (best, cand) {
                if (cand.size > best.size) var temp = cand, cand = best, best = temp;
                best.searched += cand.searched;
                return best;
            });
        callback(null, result);
    }

    // Add a preview if requested (but skip if this is an internal step in a recursive search).
    function addPreviewIfAppropriate(result, callback) {
        if (result && options.preview && !internal) {
            fs.open(result.path, 'r', function (err, fd) {
                if (err) { callback(err); return; }
                var buffer = new Buffer(40);
                fs.read(fd, buffer, 0, 40, 0, function (err, bytesRead, buffer) {
                    if (err) { callback(err); return; }
                    result.preview = buffer.toString('utf-8', 0, bytesRead);
                    fs.close(fd, function (err) {
                        if (err) callback(err);
                        else callback(null, result);
                    });
                });
            });
        } else {
            callback(null, result); // Return without adding preview.
        }
    }

    // Put it all together.
    getAllPathsAndStats(function (err, ps) {
        if (err) { callback(err); return; }
        listCandidates(ps.paths, ps.stats, function (err, candidates) {
            if (err) { callback(err); return; }
            selectBestCandidate(candidates, function (err, result) {
                if (err) { callback(err); return; }
                addPreviewIfAppropriate(result, callback);
            });
        });
    });
};


module.exports = largest;
