
// Since checking the system log and console output requires a lot of acrobatics,
// we skip that and just have the developer run this script and manually
// check the console and syslog.

"use strict";

var log = require('../');

var facility = "LOG_LOCAL5";
var debug = true;
var verbose = true;

process.on('log', log.syslogTransport(facility, debug));
if (verbose) {
    process.on('log', log.consoleTransport());
}

log('INFO', 'This should go to the console and syslog.');

process.on('exit', function () {
    log('INFO', 'exit event listener');
});
