
[Node](https://nodejs.org) EventEmitter mixin.

## Example

```javascript

var emitter = require('emitter-mixin');

function Person () {}
emitter(Person.prototype);

var person = new Person();
person.on('foo', function (arg) {
  console.log(arg);
}).emit('foo', 'bar');

// > bar
```

You don't have to do `Emitter.call(this)` in your constructor
anymore, the mixin defines an `_events` getter that does the
magic for you.

```javascript
emitter(Person.prototype);
var person = new Person();
person._events == person._events;
// > true
person._events == Person.prototype._events;
// > false
```

## Tests

```bash
$ make test
```

## License

(MIT)
