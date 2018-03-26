
"use strict";

var _ = require('lodash');
var util = require('util');
var logformat = require('logformat');

function log(level, message) {

    if (arguments.length > 1) {
        message = util.format.apply(null, _.map(_.tail(arguments), logformat));
    }

    // perform censorship
    module.exports.censor().forEach(function (key) {
        var safeKey; // string that can be safely inserted into a regex.

        // when the key is a regexp and it contains a group, we need to offset where we find the value
        var offset = 0;

        if (key instanceof RegExp) {  // if key is already a RegExp, extract the source pattern.
            safeKey = key.source;
            offset = (key.source.match(/\(/g) || []).length;
        } else { // else it's a string, escape regex operators that may be present.
            safeKey = key.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }

        // create a regex that matches key=val and key="val"
        var re = new RegExp("(" + safeKey + ")" + "=([^\"][^\\s]+|\"[^\"]*\")", "g");

        //replace each character of the value with an 'X' to censor it.
        message = message.replace(re, function (match, key) {
            return key + '=[redacted]';
        });
    });

    process.emit('log', {
        level: level,
        message: message
    });

    return message;
}

function censor(list) {
    module.exports.censorList = module.exports.censorList || [];

    if (Array.isArray(list)) {
        module.exports.censorList = _.uniq(list);
    }

    return module.exports.censorList;
}

function defaults() {
    var defaultMessages = Array.prototype.slice.call(arguments);
    var defaultLog = function (level, message) {
        return module.exports.apply(null, _.union(Array.prototype.slice.call(arguments), defaultMessages));
    };
    _.extend(defaultLog, module.exports);
    defaultLog.defaults = function () {
        return defaults.apply(null, _.union(defaultMessages, Array.prototype.slice.call(arguments)));
    };
    addConvenienceFunctions(defaultLog);
    return defaultLog;
}

// Public API
module.exports = log;
module.exports.censor = censor;
module.exports.defaults = defaults;

function addConvenienceFunctions(logger) {
    // Emulate the logger.level() API of winston so we can use our logger implementation as a drop in replacement
    logger.log = function () { logger.apply(null, Array.prototype.slice.call(arguments)); };
    _.forEach(['EMERG', 'ALERT', 'CRIT', 'ERR', 'ERROR', 'WARNING', 'WARN', 'NOTICE', 'INFO', 'VERBOSE', 'DEBUG', 'SILLY'], function (level) {
        logger[level.toLowerCase()] = function () { logger.apply(null, _.union([level], Array.prototype.slice.call(arguments))); };
    });
}

addConvenienceFunctions(module.exports);

// Various transports...
module.exports.consoleTransport = require('./lib/transports/console');
module.exports.streamTransport = require('./lib/transports/stream');
module.exports.syslogTransport = require('./lib/transports/syslog');

