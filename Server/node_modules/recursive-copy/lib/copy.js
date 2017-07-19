'use strict';

var Promise = global.Promise || require('promise');

var fs = require('graceful-fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var pify = require('pify');
var mkdirp = require('mkdirp');
var del = require('del');
var junk = require('junk');
var errno = require('errno');
var maximatch = require('maximatch');
var slash = require('slash');
var emitterMixin = require('emitter-mixin');

var CopyError = errno.custom.createError('CopyError');

var EVENT_ERROR = 'error';
var EVENT_COMPLETE = 'complete';
var EVENT_CREATE_DIRECTORY_START = 'createDirectoryStart';
var EVENT_CREATE_DIRECTORY_ERROR = 'createDirectoryError';
var EVENT_CREATE_DIRECTORY_COMPLETE = 'createDirectoryComplete';
var EVENT_CREATE_SYMLINK_START = 'createSymlinkStart';
var EVENT_CREATE_SYMLINK_ERROR = 'createSymlinkError';
var EVENT_CREATE_SYMLINK_COMPLETE = 'createSymlinkComplete';
var EVENT_COPY_FILE_START = 'copyFileStart';
var EVENT_COPY_FILE_ERROR = 'copyFileError';
var EVENT_COPY_FILE_COMPLETE = 'copyFileComplete';


module.exports = function(src, dest, options, callback) {
	if ((arguments.length === 3) && (typeof options === 'function')) {
		callback = options;
		options = undefined;
	}
	options = options || {};

	var hasFinished = false;

	var mkdir = wrapFsMethod(mkdirp);
	var stat = wrapFsMethod(fs.stat);
	var lstat = wrapFsMethod(fs.lstat);
	var readlink = wrapFsMethod(fs.readlink);
	var symlink = wrapFsMethod(fs.symlink);
	var readdir = wrapFsMethod(fs.readdir);
	var chmod = wrapFsMethod(fs.chmod);

	var parentDirectory = path.dirname(dest);
	var shouldExpandSymlinks = Boolean(options.expand);
	var srcStat = (shouldExpandSymlinks ? stat : lstat);

	var emitter;
	var promise = ensureDirectoryExists(parentDirectory)
		.then(function() {
			return srcStat(src)
				.then(function(stats) {
					if (stats.isDirectory()) {
						return getFileListing(src)
							.then(function(filenames) {
								return [src].concat(filenames);
							});
					} else {
						return [src];
					}
				});
		})
		.then(function(filePaths) {
			var relativePaths = filePaths.map(function(filePath) {
				return path.relative(src, filePath);
			});
			var filteredPaths = getFilteredPaths(relativePaths, options.filter, {
				dot: options.dot,
				junk: options.junk
			});
			var absolutePaths = filteredPaths.map(function(relativePath) {
				return path.join(src, relativePath);
			});
			return absolutePaths;
		})
		.then(function(filteredPaths) {
			return copyFileset(filteredPaths, src, dest, options)
		})
		.catch(function(error) {
			if (error instanceof CopyError) {
				emitEvent(EVENT_ERROR, error.error, error.data);
				throw error.error;
			} else {
				throw error;
			}
		})
		.then(function(results) {
			emitEvent(EVENT_COMPLETE, results);
			return results;
		})
		.then(function(results) {
			hasFinished = true;
			return results;
		})
		.catch(function(error) {
			hasFinished = true;
			throw error;
		});

	if (typeof callback === 'function') {
		promise.then(function(results) {
			callback(null, results);
		})
		.catch(function(error) {
			callback(error);
		});
		emitter = new EventEmitter();
	} else {
		emitter = emitterMixin(promise);
	}

	return emitter;


	function wrapFsMethod(fn) {
		// Convert from node-style callbacks to promises
		var wrappedFn = pify(fn, Promise);
		return function() {
			// Multiple chains of promises are fired in parallel,
			// so when one fails we need to prevent any future
			// filesystem operations
			if (hasFinished) { return Promise.reject(); }
			return wrappedFn.apply(null, arguments);
		};
	}

	function emitEvent(event, args) {
		if (hasFinished) { return; }
		emitter.emit.apply(emitter, arguments);
	}

	function ensureDirectoryExists(path) {
		return mkdir(path);
	}

	function getFileListing(srcPath) {
		return readdir(srcPath)
			.then(function(filenames) {
				return Promise.all(
					filenames.map(function(filename) {
						var filePath = path.join(srcPath, filename);
						return srcStat(filePath)
							.then(function(stats) {
								if (stats.isDirectory()) {
									return getFileListing(filePath)
										.then(function(childPaths) {
											return [filePath].concat(childPaths);
										});
								} else {
									return [filePath];
								}
							});
					})
				)
				.then(function mergeArrays(arrays) {
					return Array.prototype.concat.apply([], arrays);
				});
			});
	}

	function getFilteredPaths(paths, filter, options) {
		var useDotFilter = !options.dot;
		var useJunkFilter = !options.junk;
		if (!filter && !useDotFilter && !useJunkFilter) { return paths; }
		return paths.filter(function(path) {
			return (!useDotFilter || dotFilter(path)) && (!useJunkFilter || junkFilter(path)) && (!filter || (maximatch(slash(path), filter, options).length > 0));
		});


		function dotFilter(relativePath) {
			var filename = path.basename(relativePath);
			return filename.charAt(0) !== '.';
		}

		function junkFilter(relativePath) {
			var filename = path.basename(relativePath);
			return !junk.is(filename);
		}
	}

	function copyFileset(filePaths, srcRoot, destRoot, options) {
		var copyOperations = filePaths.map(function(filePath) {
			return path.relative(srcRoot, filePath);
		}).map(function(relativePath) {
			var inputPath = relativePath;
			var outputPath = options.rename ? options.rename(inputPath) : inputPath;
			return {
				src: path.join(srcRoot, inputPath),
				dest: path.join(destRoot, outputPath)
			};
		});
		return Promise.all(copyOperations.map(function(copyOperation) {
			return copy(copyOperation.src, copyOperation.dest, options);
		}));


		function copy(srcPath, destPath, options) {
			return prepareForCopy(srcPath, destPath, options)
				.then(function(stats) {
					var copyFunction = getCopyFunction(stats, options);
					return copyFunction(srcPath, destPath, stats, options);
				})
				.catch(function(error) {
					if (error instanceof CopyError) {
						throw error;
					}
					var copyError = new CopyError(error.message);
					copyError.error = error;
					copyError.data = {
						src: srcPath,
						dest: destPath
					};
					throw copyError;
				});


			function prepareForCopy(srcPath, destPath, options) {
				return srcStat(srcPath)
					.then(function(stats) {
						return ensureDestinationIsWritable(destPath, options, stats)
							.then(function() {
								return stats;
							});
					});


					function ensureDestinationIsWritable(destPath, options, srcStats) {
						return lstat(destPath)
							.catch(function(error) {
								var shouldIgnoreError = error.code === 'ENOENT';
								if (shouldIgnoreError) { return null; }
								throw error;
							})
							.then(function(destStats) {
								var destExists = Boolean(destStats);
								if (!destExists) { return true; }

								var isMergePossible = srcStats.isDirectory() && destStats.isDirectory();
								if (isMergePossible) { return true; }

								if (options.overwrite) {
									return del(destPath, { force: true })
										.then(function(paths) {
											return true;
										});
								} else {
									throw fsError('EEXIST', destPath);
								}
							});
					}
			}

			function getCopyFunction(stats, options) {
				if (stats.isDirectory()) {
					return createCopyFunction(copyDirectory, {
						startEvent: EVENT_CREATE_DIRECTORY_START,
						completeEvent: EVENT_CREATE_DIRECTORY_COMPLETE,
						errorEvent: EVENT_CREATE_DIRECTORY_ERROR
					});
				} else if (stats.isSymbolicLink()) {
					return createCopyFunction(copySymlink, {
						startEvent: EVENT_CREATE_SYMLINK_START,
						completeEvent: EVENT_CREATE_SYMLINK_COMPLETE,
						errorEvent: EVENT_CREATE_SYMLINK_ERROR
					});
				} else {
					return createCopyFunction(copyFile, {
						startEvent: EVENT_COPY_FILE_START,
						completeEvent: EVENT_COPY_FILE_COMPLETE,
						errorEvent: EVENT_COPY_FILE_ERROR
					});
				}


				function createCopyFunction(fn, options) {
					var startEvent = options.startEvent;
					var completeEvent = options.completeEvent;
					var errorEvent = options.errorEvent;
					return function(srcPath, destPath, stats, options) {
						var metadata = {
							src: srcPath,
							dest: destPath,
							stats: stats
						};
						emitEvent(startEvent, metadata);
						var parentDirectory = path.dirname(destPath);
						return ensureDirectoryExists(parentDirectory)
							.then(function() {
								return fn(srcPath, destPath, options);
							})
							.then(function() {
								emitEvent(completeEvent, metadata);
								return metadata;
							})
							.catch(function(error) {
								emitEvent(errorEvent, error, metadata);
								throw error;
							});
					};
				}

				function copyFile(srcPath, destPath, options) {
					return new Promise(function(resolve, reject) {
						var hasFinished = false;

						var read = fs.createReadStream(srcPath);
						read.on('error', handleCopyFailed);

						var write = fs.createWriteStream(destPath, { flags: 'w' });
						write.on('error', handleCopyFailed);
						write.on('finish', function() {
							chmod(destPath, stats.mode)
								.then(function() {
									hasFinished = true;
									resolve();
								})
								.catch(function(error) {
									handleCopyFailed(error);
								});
						});

						var transformStream = null;
						if (options.transform) {
							transformStream = options.transform(srcPath, destPath, stats);
							if (transformStream) {
								transformStream.on('error', handleCopyFailed);
								read.pipe(transformStream).pipe(write);
							} else {
								read.pipe(write);
							}
						} else {
							read.pipe(write);
						}


						function handleCopyFailed(error) {
							if (hasFinished) { return; }
							hasFinished = true;
							if (typeof read.close === 'function') {
								read.close();
							}
							if (typeof write.close === 'function') {
								write.close();
							}
							return reject(error);
						}
					});
				}

				function copySymlink(srcPath, destPath, options) {
					return readlink(srcPath)
						.then(function(link) {
							return symlink(link, destPath);
						});
				}

				function copyDirectory(srcPath, destPath, options) {
					return mkdir(destPath)
						.catch(function(error) {
							var shouldIgnoreError = error.code === 'EEXIST';
							if (shouldIgnoreError) { return; }
							throw error;
						});
				}
			}
		}
	}

	function fsError(code, path) {
		var errorType = errno.code[code];
		var message = errorType.code + ', ' + errorType.description + ' ' + path;
		var error = new Error(message);
		error.errno = errorType.errno;
		error.code = errorType.code;
		error.path = path;
		return error;
	}
};

module.exports.events = {
	ERROR: EVENT_ERROR,
	COMPLETE: EVENT_COMPLETE,
	CREATE_DIRECTORY_START: EVENT_CREATE_DIRECTORY_START,
	CREATE_DIRECTORY_ERROR: EVENT_CREATE_DIRECTORY_ERROR,
	CREATE_DIRECTORY_COMPLETE: EVENT_CREATE_DIRECTORY_COMPLETE,
	CREATE_SYMLINK_START: EVENT_CREATE_SYMLINK_START,
	CREATE_SYMLINK_ERROR: EVENT_CREATE_SYMLINK_ERROR,
	CREATE_SYMLINK_COMPLETE: EVENT_CREATE_SYMLINK_COMPLETE,
	COPY_FILE_START: EVENT_COPY_FILE_START,
	COPY_FILE_ERROR: EVENT_COPY_FILE_ERROR,
	COPY_FILE_COMPLETE: EVENT_COPY_FILE_COMPLETE
};
