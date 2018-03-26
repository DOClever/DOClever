
"use strict";

var moment = require('moment');
var chalk = require('chalk');
var _ = require('lodash');

var theme = {
    EMERG: 'magenta',
    ALERT: 'magenta',
    CRIT: 'magenta',
    CRITICAL: 'magenta',
    ERR: 'red',
    ERROR: 'red',
    WARN: 'yellow',
    WARNING: 'yellow',
    NOTICE: 'yellow',
    INFO: 'green',
    DEBUG: 'blue'
};

module.exports = function streamTransport(stream, color, timestamp) {
    if (_.includes(process.argv, '--no-color')) {
        color = false;
    }
    color = (color === true); // default to false
    timestamp = (timestamp !== false); // default to true

    if (_.has(stream, 'on') && _.isFunction(stream.on)) {
        stream.on('finish', function () {
            // when stream has finished, set to null so we can avoid writing to a finished stream
            stream = null;
        });
    }

    return function streamTransportClosure(obj) {

        var message = '';

        // if timestamps are enabled, prepend a timestamp (ISO8601 format)
        message += (timestamp === true) ? '[' + moment().format() + '] ' : '';

        // append the level tag (e.g. '[INFO]')
        message += '[' + obj.level + ']';

        // append the message text
        message += ' ' + obj.message + '\n';

        // apply colour if there is a theme for that level and colour is enabled
        if (_.has(theme, obj.level) && color === true) {
            message = chalk[theme[obj.level]](message);
        }

        if (stream !== null && stream !== undefined) {
            stream.write(message);
        }
    };
};
