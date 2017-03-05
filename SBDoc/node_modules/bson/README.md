# BSON parser

If you don't yet know what BSON actually is, read [the spec](http://bsonspec.org).

The browser version of the BSON parser is compiled using webpack and the current
version is pre-compiled in the browser_build directory. To build a new version perform the following operation.

```
npm install
npm run build
```

A simple example of how to use BSON in the browser:

```html
<script src="./browser_build/bson.js"></script>

<script>
  function start() {
    // Get the Long type
    var Long = BSON.Long;
    // Create a bson parser instance
    var bson = new BSON();

    // Serialize document
    var doc = { long: Long.fromNumber(100) }

    // Serialize a document
    var data = bson.serialize(doc)
    // De serialize it again
    var doc_2 = bson.deserialize(data)
  }
</script>
```

A simple example of how to use BSON in `node.js`:

```js
// Get BSON parser class
var BSON = require('bson')
// Get the Long type
var Long = BSON.Long;
// Create a bson parser instance
var bson = new BSON();

// Serialize document
var doc = { long: Long.fromNumber(100) }

// Serialize a document
var data = bson.serialize(doc)
console.log('data:', data)

// Deserialize the resulting Buffer
var doc_2 = bson.deserialize(data)
console.log('doc_2:', doc_2)
```

## Installation

`npm install bson`

## API

### BSON types

For all BSON types documentation, please refer to the documentation for the mongodb driver.

https://github.com/mongodb/node-mongodb-native

### BSON serialization and deserialiation

**`new BSON()`** - Creates a new BSON seralizer/deserializer you can use to serialize and deserialize BSON.

#### BSON.serialize

The BSON serialize method takes a javascript object and an optional options object and returns a Node.js Buffer.

  * BSON.serialize(object, options)
    * @param {Object} object the Javascript object to serialize.
    * @param {Boolean} [options.checkKeys=false] the serializer will check if keys are valid.
    * @param {Boolean} [options.serializeFunctions=false] serialize the javascript. functions.
    * @param {Boolean} [options.ignoreUndefined=true]
    * @return {Buffer} returns a Buffer instance.

#### BSON.serializeWithBufferAndIndex

The BSON serializeWithBufferAndIndex method takes an object, a target buffer instance and an optional options object and returns the end serialization index in the final buffer.

  * BSON.serializeWithBufferAndIndex(object, buffer, options)
    * @param {Object} object the Javascript object to serialize.
    * @param {Buffer} buffer the Buffer you pre-allocated to store the serialized BSON object.
    * @param {Boolean} [options.checkKeys=false] the serializer will check if keys are valid.
    * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions.
    * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields.
    * @param {Number} [options.index=0] the index in the buffer where we wish to start serializing into.
    * @return {Number} returns the index pointing to the last written byte in the buffer.

#### BSON.calculateObjectSize

The BSON calculateObjectSize method takes a javascript object and an optional options object and returns the size of the BSON object.

  * BSON.calculateObjectSize(object, options)
    * @param {Object} object the Javascript object to serialize.
    * @param {Boolean} [options.serializeFunctions=false] serialize the javascript. functions.
    * @param {Boolean} [options.ignoreUndefined=true]
    * @return {Buffer} returns a Buffer instance.

#### BSON.deserialize

The BSON deserialize method takes a node.js Buffer and an optional options object and returns a deserialized Javascript object.

  * BSON.deserialize(buffer, options)
    * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
    * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
    * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
    * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
    * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
    * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
    * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
    * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
    * @return {Number} returns the next index in the buffer after deserialization **x** numbers of documents.

#### BSON.deserializeStream

The BSON deserializeStream method takes a node.js Buffer, startIndex and allow more control over deserialization of a Buffer containing concatenated BSON documents.

  * BSON.deserializeStream(buffer, startIndex, numberOfDocuments, documents, docStartIndex, options)
    * @param {Buffer} buffer the buffer containing the serialized set of BSON documents.
    * @param {Number} startIndex the start index in the data Buffer where the deserialization is to start.
    * @param {Number} numberOfDocuments number of documents to deserialize.
    * @param {Array} documents an array where to store the deserialized documents.
    * @param {Number} docStartIndex the index in the documents array from where to start inserting documents.
    * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
    * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
    * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
    * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
    * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
    * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
    * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
    * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
    * @return {Object} returns the deserialized Javascript Object.
