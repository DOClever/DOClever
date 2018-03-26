
"use strict";

var nodeSyslog = new require('modern-syslog');
var _ = require('lodash');
var util = require('util');

function SysLog(name, options) {
    var self = this;

    if (!(this instanceof SysLog)) {
        return new SysLog(name, options);
    }

    // options.log_facility is text as in "LOG_LOCAL5", if such a property of
    // syslog exists, use it else use a default
    this.log_facility = nodeSyslog[options.log_facility] || nodeSyslog.LOG_MESSAGES;

    nodeSyslog.init(name, nodeSyslog.LOG_PID | nodeSyslog.LOG_ODELAY, this.log_facility);

    // input log level mask is allowed to be nodeSyslog.LOG_LEVEL, 'LOG_LEVEL', or simply 'LEVEL'
    // convert all input to nodeSyslog.LOG_LEVEL values
    if (options.mask && _.isString(options.mask)) {
        if (options.mask.indexOf('LOG_') === -1) { // 'LEVEL' form to 'LOG_LEVEL'
            options.mask = 'LOG_' + options.mask;
        }
        options.mask = nodeSyslog[options.mask]; // 'LOG_LEVEL' form to nodeSyslog.LOG_LEVEL
    }

    // options.mask sets the upTo log level mask.
    // for legacy compatibility, mask === true is LOG_DEBUG
    // if no mask is provided, default to LOG_INFO
    this.mask = (options.mask === true) ? nodeSyslog.LOG_DEBUG : options.mask || nodeSyslog.LOG_INFO;

    // set an upTo mask, all log messages up to this level get logged.
    nodeSyslog.setMask(this.mask, true);

    // some helper functions so you don't have to nodeSyslog.blah.blah.LOG_SOMETHING
    this.log_emerg = function(msg, doinspect) {
        log(self.LOG_EMERG, msg, doinspect);
    };

    this.log_alert = function(msg, doinspect) {
        log(self.LOG_ALERT, msg, doinspect);
    };

    this.log_crit = function(msg, doinspect) {
        log(self.LOG_CRIT, msg, doinspect);
    };

    this.log_err = function(msg, doinspect) {
        log(self.LOG_ERR, msg, doinspect);
    };

    this.log_error = function(msg, doinspect) {
        log(self.LOG_ERR, msg, doinspect);
    };

    this.log_warning = function(msg, doinspect) {
        log(self.LOG_WARNING, msg, doinspect);
    };

    this.log_warn = function(msg, doinspect) {
        log(self.LOG_WARNING, msg, doinspect);
    };

    this.log_notice = function(msg, doinspect) {
        log(self.LOG_NOTICE, msg, doinspect);
    };

    this.log_info = function(msg, doinspect) {
        log(self.LOG_INFO, msg, doinspect);
    };

    this.log_debug = function(msg, doinspect) {
        log(self.LOG_DEBUG, msg, doinspect);
    };

    // log level: LOG_*
    // log message : text
    // bool doinspect : parse out multiple spaces and linefeeds, or not (default false)
    function log(lvl, msg, doinspect) {

        // if only a message is provided, assume level is INFO
        if (lvl && !msg) {
            msg = lvl;
            lvl = nodeSyslog.LOG_INFO;
        }

        // make it an array if needed
        if (!util.isArray(msg)) {
            msg = [ msg ];
        }

        for (var el in msg) {
            var m = msg[el];

            if (!_.isString(m)) {
                m = m.toString();
            }

            // the debug messages in particular need to be parsed a bit
            if (lvl >= nodeSyslog.LOG_DEBUG || doinspect) {
                m = util.inspect(m, false, null, false)
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/^\'|\'/g,'');
            }

            nodeSyslog.log(lvl, m);
        }
    }

    this.log = log;

    this.LOG_EMERG    = nodeSyslog.LOG_EMERG;
    this.LOG_ALERT    = nodeSyslog.LOG_ALERT;
    this.LOG_CRIT     = nodeSyslog.LOG_CRIT;
    this.LOG_ERR      = nodeSyslog.LOG_ERR;
    this.LOG_ERROR    = nodeSyslog.LOG_ERR;
    this.LOG_WARNING  = nodeSyslog.LOG_WARNING;
    this.LOG_WARN     = nodeSyslog.LOG_WARNING;
    this.LOG_NOTICE   = nodeSyslog.LOG_NOTICE;
    this.LOG_INFO     = nodeSyslog.LOG_INFO;
    this.LOG_DEBUG    = nodeSyslog.LOG_DEBUG;
    this.LOG_LOCAL0   = nodeSyslog.LOG_LOCAL0;
    this.LOG_LOCAL1   = nodeSyslog.LOG_LOCAL1;
    this.LOG_LOCAL2   = nodeSyslog.LOG_LOCAL2;
    this.LOG_LOCAL3   = nodeSyslog.LOG_LOCAL3;
    this.LOG_LOCAL4   = nodeSyslog.LOG_LOCAL4;
    this.LOG_LOCAL5   = nodeSyslog.LOG_LOCAL5;
    this.LOG_LOCAL6   = nodeSyslog.LOG_LOCAL6;
    this.LOG_MESSAGES = nodeSyslog.LOG_MESSAGES;

    return this;
}

module.exports = function syslogTransport(log_facility, mask) {

    var self = this;

    self.syslog = new SysLog(process.title, { log_facility: log_facility, mask: mask });

    return function syslogTransportClosure(obj) {
        var level = 'LOG_' + obj.level.toUpperCase(); // validate requested log level.
        if (_.has(self.syslog, level)) {
            self.syslog.log(self.syslog[level], obj.message);
        } else {
            self.syslog.log(self.syslog.LOG_ERR, 'Invalid log level: "' + level + '", defaulting to INFO.');
            self.syslog.log(self.syslog.LOG_INFO, obj.message);
        }
    };
};
