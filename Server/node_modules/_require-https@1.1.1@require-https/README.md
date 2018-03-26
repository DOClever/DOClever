# require-https

[express](http://expressjs.com/) middleware to require requests to be secure.
Unlike other similar middleware, this function does not perform redirects or attempt
to deal with insecure requests. Instead, this module fails fast and fails hard by
returning an error immediately when an insecure connection is detected.

## Installation

    npm install --save require-https

## API

### requireHttps(status, message)

Parameters:

* `status` - optional HTTP status code to include in the error when an insecure connection is detected. Defaults to `403 Forbidden`.
* `message` - optional error message to include in the error when an insecure connection is detected. Defaults to `Insecure Connection. Use HTTPS instead.`.

Returns:

* standard express middleware function.
  * middleware function accepts `(req, res, next)`
  * middleware function calls `next()` when a secure connection is detected and `next(err)` when an insecure connection is detected.

## Example

HTTPS Everywhere:
```
"use strict";

var requireHttps = require('require-https');
var express = require('express');
var app = express();

app.enable('trust proxy');
app.use(requireHttps());

app.get('/', function (req, res) {
    res.send('Hello, World!');
});

app.listen(3000);
```

HTTPS for specific routes with custom error message:
```
"use strict";

var requireHttps = require('require-https');
var express = require('express');
var app = express();

app.enable('trust proxy');

app.get('/', function (req, res) {
    res.send('Hello, World!');
});

app.get('/sensitive', requireHttps(403, 'HTTPS is required to view top secret info.'), function (req, res) {
    res.send('Top Secret!');
});

app.listen(3000);
```

## Tips

If behind a reverse proxy server such as [nginx](http://nginx.org/en/),
the `trust proxy` option must be set. See [Express behind proxies](http://expressjs.com/guide/behind-proxies.html)
for more details.

    app.enable('trust proxy');

## License

See [LICENSE.md](https://github.com/tcort/require-https/blob/master/LICENSE.md)
