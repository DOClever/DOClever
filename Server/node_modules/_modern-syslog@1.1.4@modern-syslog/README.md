# modern syslog - streaming, async, native, uses nan

This is the only syslog library that:

- Uses native bindings to the libc syslog API.
- Is async, because the libc APIs can block on localhost IPC under load, but
  that shouldn't block your app.
- Can be used as a stream.
- Has formatted log functions.
- Uses nan, so supports node and io.js, and will continue to do so.
- Is API compatible with [node-syslog][], from which I gathered inspiration
  and owe thanks.

Default mask depends on system.

## Installation

    npm install --save modern-syslog

## API

For detailed descriptions of the core functions, see [man 3
syslog](http://man7.org/linux/man-pages/man3/syslog.3.html).

Note that syslog functions cannot fail, and neither throw errors, nor callback
with errors. This is consistent with the core functions, which do not have error
return values.

### log(priority, msg, callback)

- `priority` {String|Number} OR of a level, and optionally, a facility.
- `msg` {String|Buffer} Message to log.
- `callback` {Function} Called after message is logged (no arguments).

`priority` can be a String, in which case it will be looked up in
`syslog.level`. It can also be a Number, in which case it is expected to be
a numeric value, such as `syslog.level.LOG_INFO`, optionally ORed with a
a numeric facility, such as `syslog.facility.LOG_LOCAL2`.

See below for formatted version of `log()`.

### emerg(fmt, ...)
### alert(fmt, ...)
### crit(fmt, ...)
### error(fmt, ...)
### err(fmt, ...)
### warn(fmt, ...)
### warning(fmt, ...)
### note(fmt, ...)
### notice(fmt, ...)
### info(fmt, ...)
### debug(fmt, ...)

- `fmt` {String} Arguments are formatted as `msg`, and passed to `log()`.

Convenience functions, log level is pre-defined, facility uses default, either
system default or that provided to `open()`, and message is formatted with
`util.format()`.

### new Stream(level, [facility])

- `level` {String|Number} Level to log at.
- `facility` {String|Number} Facility to log with, optional.

Returns a writeable stream that logs all messages at the specified level and
facility.

### open(ident, option, facility)

- `ident` {String} Prepended to every message, usually program name.
- `option` {Number} OR of flags from `syslog.options`.
- `facility` {String|Number} Default facility to be used by `log()`.

Set up defaults for log.

Calling `open()` is optional, all arguments are provided with defaults, though
the defaults depend on the system (see man page).

### close()

Close the socket to the syslog system.

Calling `close()` is optional, the socket is closed automatically by the
system on exit.

### upto(level)

- `level` {String|Number} Level to log up to.

Log all levels upto and including `level`.

### setmask(mask)

- `mask` {Number} OR of levels that should be logged.

Not convenient to use but part of the low-level syslog API. See syslog man page
for details, and consider using `upto()` for most common use-cases.

### curmask()

Returns current log mask, see `setmask()`.

### setMask(...)

Avoid this, its for backwards compatibility with [node-syslog][].

### init(...)

Avoid this, its for backwards compatibility with [node-syslog][].

## Properties

Syslog properties are defined as a bi-directional map from String to Number, and
from Number to String, so:

- `syslog.level.LOG_DEBUG`: `7`, the numeric value of `LOG_DEBUG`
- `syslog.level[7]`: `'LOG_DEBUG'`, string value of level `7`

### syslog.level

Levels are listed from highest priority, to lowest:

- `LOG_EMERG`: System is unusable.
- `LOG_ALERT`: Action must be taken immediately.
- `LOG_CRIT`: Critical condition.
- `LOG_ERR`: Error condition.
- `LOG_WARNING`: Warning condition.
- `LOG_NOTICE`: Normal, but significant, condition.
- `LOG_INFO`: Informational message.
- `LOG_DEBUG`: Debug-level message.

### syslog.option

Object of properties:

- `LOG_CONS`: Log to console if there is error logging to syslog.
- `LOG_PERROR`: Log to stderr as well as syslog. (no-op on Solaris)
- `LOG_PID`: Log process' PID with each message.

These are unlikely to be useful, but are provided for completeness:

- `LOG_NDELAY`: Open  the  connection  immediately (normally, the connection is
  opened when the first message is logged).
- `LOG_ODELAY`: The converse of `LOG_NDELAY`; opening of the connection is
  delayed until the first message is logged (this is the default and need not be
  specified).
- `LOG_NOWAIT`: Archaic option that doesn't do anything on contemporary systems,
  but is provided for backwards compatibility.

### syslog.facility

- `LOG_AUTH`
- `LOG_AUTHPRIV` (not defined on all systems)
- `LOG_CRON`
- `LOG_DAEMON`
- `LOG_FTP` (not defined on all systems)
- `LOG_KERN`
- `LOG_LOCAL0`
- `LOG_LOCAL1`
- `LOG_LOCAL2`
- `LOG_LOCAL3`
- `LOG_LOCAL4`
- `LOG_LOCAL5`
- `LOG_LOCAL6`
- `LOG_LOCAL7`
- `LOG_LPR`
- `LOG_MAIL`
- `LOG_NEWS`
- `LOG_SYSLOG`
- `LOG_USER`
- `LOG_UUCP`

[node-syslog]: https://www.npmjs.com/package/node-syslog
