# logformat

Stringify objects into searchable strings.

## Motivation

JSON is a great format for exchanging data, but it isn't so great for
logging. Say I want to log the follow user request object:

```
{
    date: '2015-11-19',
    client: {
        agent: 'firefox',
        ip: '10.1.32.1'
    },
    server: {
        ip: '192.168.2.222'
    }
}
```

If I use the traditional `JSON.stringify()`, I get something like this:

    {"date":"2015-11-19","client":{"agent":"firefox","ip":"10.1.32.1"},"server":{"ip":"192.168.2.222"}}

That isn't very readable and hard to [grep](https://www.gnu.org/software/grep/).
This library solves those problems by nicely formatting objects as `key=value` pairs:

    date=2015-11-19 client.agent=firefox client.ip=10.1.32.1 server.ip=192.168.2.222

## Installation

    npm install --save logformat

## API

### logformat(any)

Parameters:

* `any` anything you wish to stringify... booleans, strings, numbers, objects, arrays, etc.

Returns:

* formatted string

## Example

```
var logformat = require('logformat');
var fs = require('fs');

console.log(logformat(fs.statSync('/dev/null')));

// -> 'dev=287613608 mode=8630 nlink=1 uid=0 gid=0 rdev=50331650 blksize=131072 ino=303 size=0 blocks=0'
```

## Testing

There is an automated test suite:

    npm test

## License

See [LICENSE.md](https://github.com/ssimicro/logformat/blob/master/LICENCE.md)
