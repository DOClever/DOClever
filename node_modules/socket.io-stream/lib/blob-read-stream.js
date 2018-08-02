var util = require('util');
var Readable = require('stream').Readable;
var bind = require('component-bind');


module.exports = BlobReadStream;

util.inherits(BlobReadStream, Readable);

/**
 * Readable stream for Blob and File on browser.
 *
 * @param {Object} options
 * @api private
 */
function BlobReadStream(blob, options) {
  if (!(this instanceof BlobReadStream)) {
    return new BlobReadStream(blob, options);
  }

  Readable.call(this, options);

  options = options || {};
  this.blob = blob;
  this.slice = blob.slice || blob.webkitSlice || blob.mozSlice;
  this.start = 0;
  this.sync = options.synchronous || false;

  var fileReader;

  if (options.synchronous) {
    fileReader = this.fileReader = new FileReaderSync();
  } else {
    fileReader = this.fileReader = new FileReader();
  }

  fileReader.onload = bind(this, '_onload');
  fileReader.onerror = bind(this, '_onerror');
}

BlobReadStream.prototype._read = function(size) {
  var start = this.start;
  var end = this.start = this.start + size;
  var chunk = this.slice.call(this.blob, start, end);

  if (chunk.size) {
    if (this.sync) {
      var bufferChunk = new Buffer(new Uint8Array(this.fileReader.readAsArrayBuffer(chunk)));
      this.push(bufferChunk);
    } else {
      this.fileReader.readAsArrayBuffer(chunk);
    }
  } else {
    this.push(null);
  }
}

BlobReadStream.prototype._onload = function(e) {
  var chunk = new Buffer(new Uint8Array(e.target.result));
  this.push(chunk);
};

BlobReadStream.prototype._onerror = function(e) {
  var err = e.target.error;
  this.emit('error', err);
};

