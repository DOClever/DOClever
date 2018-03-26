"use strict";

var log = require('../');

function genLogs(color, timestamp) {
    var logger = log.consoleTransport(color, timestamp);
    process.on('log', logger);
    var levels = [ 'EMERG', 'ALERT', 'CRIT', 'ERR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG' ];
    for (var i = 0; i < levels.length; i++) {
        log(levels[i], "The quick brown fox jumps over the lazy dog");
    }
    process.removeListener('log', logger);
}


console.log('Here are some colorized log messages: ');
console.log('');
genLogs(true, false);
console.log('');
console.log('');
console.log('Here are some non-colorized log messages: ');
console.log('');
genLogs(false, false);
console.log('');
console.log('');
console.log('Here are some colorized log messages with timestamps: ');
console.log('');
genLogs(true, true);
console.log('');
console.log('');

console.log('Rerun with --no-color command line option to disable all colors');
