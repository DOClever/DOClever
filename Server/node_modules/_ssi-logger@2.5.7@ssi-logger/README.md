# ssi-logger

Simplified logging for node.js modules.

## Features

* any code running in the `node` instance, including external modules, can append log messages.
* the external modules don't need any configuration knowledge to send messages to the log.
* there is no need to pass around a `syslog` object to every function that needs to log something.
* log messages can be directed anywhere, not just to syslog and console.
* log messages can go to 0, 1, or many destinations (/dev/null, syslog, file, rabbitmq, e-mail, XMPP, etc).
* a log destination can be turned on or off at runtime.
* logged objects are automatically formatted into key=value strings (great for sending messages to [splunk](http://www.splunk.com/)).
* certain fields can be censored to avoid accidentally logging sensitive information.
* formatted log messages are returned by SSi Logger to the caller.
* it accepts multiple arguments and printf-style formats just like `console.log`.
* defaults can be supplied that are included in every message.
* your choice of API: `log(level, message, ...)` or `log.level(message, ...)`

## Theory of Operation

The module provides a `log(level, message, ...)` function which accepts the log level (`INFO`, `NOTICE`, `DEBUG`, etc)
and a log message. The message argument(s) work just like [console.log()](https://nodejs.org/api/console.html#console_console_log_data),
supporting a variable number of arguments plus formatting.

When invoked, the logger will format the log message using [logformat](https://github.com/tcort/logformat)
(for example, a JSON object like `[ { name: 'Tom' }, { name: 'Phil' } ]` becomes `0.name=Tom 1.name=Phil`).
The log level and message are emitted as a `log` event though the `process` event emitter. The main
application will provide an event listener to forward the log message to syslog or any other destination
(RabbitMQ, log file, database, etc). Finally, the logging function returns the formatted log message
which can be displayed/returned to the user if desired.

## Installation

    npm install --save ssi-logger

## Examples

Basic Usage:

    var log = require('ssi-logger');

    // install some transports
    process.on('log', log.syslogTransport('LOG_LOCAL5', 'INFO'));
    process.on('log', log.consoleTransport());

    log('INFO', 'Hello, World!');
    // emits ---> { level: 'INFO', message: 'Hello, World!' }

Multiple message arguments:

    log('INFO', 'Hello,', 'World!');
    // emits ---> { level: 'INFO', message: 'Hello, World!' }

[Formatting](http://nodejs.org/api/util.html#util_util_format_format):

    log('INFO', 'CC Charge amount=%d username=%s', 12.85, 'thomasc');
    // emits ---> { level: 'INFO', message: 'CC Charge amount=12.85 username=thomasc' }

Non-string message arguments:

    log('INFO', 'IP Whitelist Accept', { remote_ip: remote_ip });
    // emits ---> { level: 'INFO', message: 'IP Whitelist Accept remote_ip=123.123.123.123' }

With censorship:

    var log = require('ssi-logger');

    log.censor([
        'card_number', // can contain property names
        /pass(word)?/  // and/or regular expressions
    ]);

    process.on('log', log.syslogTransport('LOG_LOCAL5', 'INFO'));
    process.on('log', log.consoleTransport());

    log('INFO', { first_name: 'John', last_name: 'Doe', card_number: '1234123412341234' });
    // emits ---> { level: 'INFO', message: 'first_name=John last_name=Doe card_number=[redacted]' }


Return value:

    if (err) {
        var human_readble_error_string = log('ERROR', err);
        displayError(human_readble_error_string);
        callback(err);
    }

Logging to a file with daily log rotation:

    var FileStreamRotator = require('file-stream-rotator');
    var log = require('ssi-logger');
    var path = require('path');

    var logfile = FileStreamRotator.getStream({
        filename: path.join(__dirname, 'application-%DATE%.log'),
        frequency: 'daily',
        verbose: false,
        date_format: 'YYYY-MM-DD'
    });
    process.on('log', log.streamTransport(logfile));

    log('INFO', 'This message gets logged to a file');

Setting defaults that are included in every log message:

    var app = express();

    app.use(function loggingConfig(req, res, next) {
        req.log = log.defaults({
            request_id: uuid.v1(),
            client_ip: req.ip
        });
    });

    app.get('/users/:uid', function getRoot(req, res) {
        req.log('INFO', 'User Get', req.params);
        // emits ---> { level: 'INFO', message: 'User Get uid=thomasc request_id=e3aec5a8-12af-11e6-a148-3e1d05defe78 client_ip=127.0.0.1' }

        res.render('user', db.getUser(req.params.uid));
    });

    app.listen(3000);

Convience methods:

    log.info('Hello, World!');
    // emits ---> { level: 'INFO', message: 'Hello, World!' }

    log.alert('/dev/lp0 on fire!');
    // emits ---> { level: 'ALERT', message: '/dev/lp0 on fire!' }

Standard Log Levels: `EMERG`, `ALERT`, `CRIT`, `ERR`, `WARNING`, `NOTICE`, `INFO`, `DEBUG`

## Transports

Log messages are emitted as `log` events. Event listeners should be installed to receive the events and send them over
the appropriate transport. SSi Logger provides a couple of common transports.

Here's an example of the standard usage where logs go to syslog. Depending on the value of `mask`, log messages may or
may not go to syslog. Here, 'INFO' means that log messages with levels up to 'INFO' are logged (i.e. 'DEBUG' messages are
not logged). If `verbose` is `true`, logs also go to the console.

    process.on('log', log.syslogTransport(facility, mask)); // facility='LOG_LOCAL5', mask='INFO'
    if (verbose) {
        process.on('log', log.consoleTransport());
    }

This is a very powerful pattern. It allows for many different combinations of actions. For example, one could write
a transport such that a LOG_ALERT message about the database being down will trigger an e-mail to go out to the sysadmin.

## Available Transports

Here are the available transports.

### lib/transports/console

`consoleTransport(color, timestamp, stderr)` logs all messages to the console in the form "[level] message". The `color`
parameter is a boolean to enable or disable color coded log messages. When not supplied, `color` defaults to
`true`. Colors can also be disabled at runtime with the `--no-color` command line option. The `timestamp`
parameter causes an ISO 8601 format timestamp to be prepended to all console messages. If the `stderr` parameter is
`true`, then the logs messages are directed to process.stderr instead.

    process.on('log', log.consoleTransport(true, true, true));

### lib/transports/stream ###

`streamTransport(stream, color, timestamp` writes messages to the `stream`, one per line, in the form
"[level] message". The `color` parameter is a boolean to enable or disable color coded log messages.
When not supplied, `color` defaults to `false`. Colors can also be disabled at runtime with the
`--no-color` command line option.  The `timestamp` parameter causes an ISO 8601 format timestamp
to be prepended to all console messages. When not supplied, `timestamp` defaults to `true`.

    process.on('log', log.streamTransport(logfile));

### lib/transports/syslog ###

`syslogTransport(log_facility[, mask])` logs messages to the system log using the specified `log_facility` (e.g.
`LOG_LOCAL5`, `LOG_SYSLOG`, `LOG_USER`). The `mask` parameter will set the minimum logging level (e.g. `INFO`,
`DEBUG`, `ERR`, etc). If `mask` is not specified, the default value is `INFO`. For legacy
compatibility, a value of `true` sets `mask` to `DEBUG`.

Standard Log Facilities: `LOG_KERN`, `LOG_USER`, `LOG_MAIL`, `LOG_DAEMON`, `LOG_AUTH`, `LOG_SYSLOG`, `LOG_LPR`,
`LOG_NEWS`, `LOG_UUCP`, `LOG_LOCAL0`, `LOG_LOCAL1`, `LOG_LOCAL2`, `LOG_LOCAL3`, `LOG_LOCAL4`, `LOG_LOCAL5`,
`LOG_LOCAL6`, `LOG_LOCAL7`

Examples:

    // default minimum log level to INFO
    process.on('log', log.syslogTransport('LOG_LOCAL1'));

    // set minimum log level to ERR
    process.on('log', log.syslogTransport('LOG_LOCAL2', 'ERR'));

    // set minimum log level to DEBUG
    process.on('log', log.syslogTransport('LOG_LOCAL3', 'DEBUG'));
    process.on('log', log.syslogTransport('LOG_LOCAL4', true)); // support legacy 'debug' parameter

#### Configuring syslog on Mac OS X

Edit `/etc/syslog.conf`:

    sudo -e /etc/syslog.conf

Add the following line to `/etc/syslog.conf`:

    local5.*                        /var/log/local5.log

Send `syslogd` the HUP signal:

    sudo killall -HUP syslogd

Test with `logger`:

    logger -p local5.info "Test"
    tail /var/log/local5.log

#### Configuring rsyslog on Debain

Edit `/etc/rsyslog.conf`:

    sudo -e /etc/rsyslog.conf

Add the following line to `/etc/rsyslog.conf`:

    local5.*                        /var/log/local5.log

Restart `rsyslog`:

    sudo service rsyslog restart

Test with `logger`:

    logger -p local5.info "Test"
    tail /var/log/local5.log


## Developing a custom Transport

Implementing a custom transport involves writing an event listener that receives log events.
At present, the log events are objects that have `level` and `message` properties.

    function smsTransport(evt) {
        // evt = { level: 'EMERG', message: '/dev/lp0 on fire!' }

        switch (evt.level) { // only act on important log messages
            case 'EMERG':
            case 'ALERT':
            case 'CRIT':
                twilloClient.messages.create({
                    from: ssiSmsNumber,
                    to: tcSmsNumber,
                    body: '[' + evt.level + ']' + evt.message
                });
                break;
        }
    }

    process.on('log', smsTransport);

    if (printerOnFire) {
        log('EMERG', '/dev/lp0 on fire!');
    }

## Censorship

Any number of fields may be censored. This is useful when logging request objects to avoid accidentally logging
a credit card number, password, or other sensitive information.

### API

#### log.defaults(...)

Returns a new curried `log()` function with baked in parameters that are included in all log messages.

Example:

    var mylog = log.defaults({ request_id: '7423927D-6F4E-43FE-846E-C474EA3488A3' }, 'foobar');

    mylog('INFO', 'I love golf!');

    // emits --> { level: 'INFO', message: 'I love golf! request_id=7423927D-6F4E-43FE-846E-C474EA3488A3 foobar' }


#### log.censor(arr)

Sets the list of fields to censor from all log messages. The parameter `arr` is an array which may contain any combination of strings and regular expression objects. The strings and regular expressions are used to match against the log message. To turn off censorship, call this function with an empty array `[]`.

Example:

    // set the list
    log.censor([ 'card_number', /pass(word)?/ ]);

    log('INFO', 'first_name=John last_name=Doe card_number=1234123412341234 password=pizza');
    log('INFO', 'first_name=%s last_name=%s card_number=%s password=%s', first_name_var, last_name_var, card_number_var, password_var);
    log('INFO', { first_name: 'John', last_name: 'Doe', card_number: '1234123412341234', password: 'pizza' });

    // each one above emits the same thing -->
    // { level: 'INFO', message: 'first_name=John last_name=Doe card_number=[redacted] password=[redacted]' }

#### log.censor()

Returns a list of fields that are presently being censored from all log messages.

Example:

    // get the list of censored fields
    console.log(log.censor());
    // prints --> [ 'card_number', /pass(word)?/ ]

## Testing

There is an automated test suite:

    npm test

As well as several manual tests:

    cd test
    node manual-colors-test.js
    node manual-colors-test.js --no-color
    node manual-test.js && tail /var/log/local5.log

## License

See [LICENSE.md](https://github.com/ssimicro/ssi-logger/blob/master/LICENCE.md).
