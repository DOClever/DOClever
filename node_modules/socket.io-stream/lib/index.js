var Socket = require('./socket');
var IOStream = require('./iostream');
var BlobReadStream = require('./blob-read-stream');


exports = module.exports = lookup;

/**
 * Expose Node Buffer for browser.
 *
 * @api public
 */
exports.Buffer = Buffer;

/**
 * Expose Socket constructor.
 *
 * @api public
 */
exports.Socket = Socket;

/**
 * Expose IOStream constructor.
 *
 * @api public
 */
exports.IOStream = IOStream;

/**
 * Forces base 64 encoding when emitting. Must be set to true for Socket.IO v0.9 or lower.
 *
 * @api public
 */
exports.forceBase64 = false;

/**
 * Look up an existing Socket.
 *
 * @param {socket.io#Socket} socket.io
 * @param {Object} options
 * @return {Socket} Socket instance
 * @api public
 */
function lookup(sio, options) {
  options = options || {};
  if (null == options.forceBase64) {
    options.forceBase64 = exports.forceBase64;
  }

  if (!sio._streamSocket) {
    sio._streamSocket = new Socket(sio, options);
  }
  return sio._streamSocket;
}

/**
 * Creates a new duplex stream.
 *
 * @param {Object} options
 * @return {IOStream} duplex stream
 * @api public
 */
exports.createStream = function(options) {
  return new IOStream(options);
};

/**
 * Creates a new readable stream for Blob/File on browser.
 *
 * @param {Blob} blob
 * @param {Object} options
 * @return {BlobReadStream} stream
 * @api public
 */
exports.createBlobReadStream = function(blob, options) {
  return new BlobReadStream(blob, options);
};
