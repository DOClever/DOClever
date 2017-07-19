cron-parser
================

[![Build Status](https://travis-ci.org/harrisiirak/cron-parser.png?branch=master)](https://travis-ci.org/harrisiirak/cron-parser)
[![NPM version](https://badge.fury.io/js/cron-parser.png)](http://badge.fury.io/js/cron-parser)

Node.js library for parsing crontab instructions

Setup
========
```bash
npm install cron-parser
```

Supported format
========

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)
```

Supports mixed use of ranges and range increments (L, W and # characters are not supported currently). See tests for examples.

Usage
========

Simple expression.

```javascript
var parser = require('cron-parser');

try {
  var interval = parser.parseExpression('*/2 * * * *');

  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toUTC().toString()); // Sat Dec 28 2012 22:46:00 GMT+0200 (EET)
} catch (err) {
  console.log('Error: ' + err.message);
}

```

Iteration with limited timespan. Also returns ES6 compatible iterator (when iterator flag is set to true).

```javascript
var parser = require('cron-parser');

var options = {
  currentDate: new Date('Wed, 26 Dec 2012 12:38:53 UTC'),
  endDate: new Date('Wed, 26 Dec 2012 14:40:00 UTC'),
  iterator: true
};

try {
  var interval = parser.parseExpression('*/22 * * * *', options);

  while (true) {
    try {
      var obj = interval.next();
      console.log('value:', obj.value.toString(), 'done:', obj.done);
    } catch (e) {
      break;
    }
  }

  // value: Wed Dec 26 2012 14:44:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:00:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:22:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:44:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 16:00:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 16:22:00 GMT+0200 (EET) done: true
} catch (err) {
  console.log('Error: ' + err.message);
}

```

Options
========

* *currentDate* - Start date of the iteration
* *endDate* - End date of the iteration
* *iterator* - Return ES6 compatible iterator object 
* *utc* - Enable UTC
