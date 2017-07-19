# Guide to `asyncawait` v1.0
1. [Introduction](#1-introduction)
2. [Feature/Gotcha Summary](#2-featuregotcha-summary)
3. [How Does it Work?](#3-how-does-it-work)
4. [Compared to...](#4-compared-to)
5. [Performance](#5-performance)
6. [Quick Start](#6-quick-start)
  * [Installation](#installation)
  * [Async/Await 101](#asyncawait-101)
  * [Basic Example](#basic-example)
  * [More Examples](#more-examples)
7. [`async` in Depth: Suspendable Functions](#7-async-in-depth-suspendable-functions)
  * [Accepting Arguments and Returning Values](#accepting-arguments-and-returning-values)
  * [Handling Errors and Exceptions](#handling-errors-and-exceptions)
  * [Obtaining Results from Suspendable Functions](#obtaining-results-from-suspendable-functions)
  * [Preservation of `this` Context](#preservation-of-this-context)
  * [Creating and Using Asynchronous Iterators](#creating-and-using-asynchronous-iterators)
  * [Eager versus Lazy Execution](#eager-versus-lazy-execution)
  * [Nesting, Composition and Recursion](#nesting-composition-and-recursion)
  * [The `async.mod` Function](#the-asyncmod-function)
8. [`await` in Depth: Awaitable Expressions](#8-await-in-depth-awaitable-expressions)
  * [What Works with `await`?](#what-works-with-await)
  * [Obtaining Awaitable Versions of Node-Style APIs](#obtaining-awaitable-versions-of-node-style-apis)
  * [Maximising Concurrency](#maximising-concurrency)
  * [Variations of `await`](#variations-of-await)
9. [Recipes](#9-recipes)
  * [Handling HTTP Routes with Express](#handling-http-routes-with-express)
  * [Asynchronous Testing with Mocha](#asynchronous-testing-with-mocha)
10. [API Reference](#10-api-reference)
11. [Acknowledgements](#11-acknowledgements)
12. [License](#12-license)



# 1. Introduction
`asyncawait` addresses the problem of [callback hell](http://callbackhell.com/) in Node.js JavaScript code. Inspired by [C#'s async/await](http://msdn.microsoft.com/en-us/library/hh191443.aspx) feature, `asyncawait` enables you to write functions that **appear** to block at each asynchronous operation, waiting for the results before continuing with the following statement. For example, you can write the following in plain JavaScript:

```javascript
var foo = async (function() {
    var resultA = await (firstAsyncCall());
    var resultB = await (secondAsyncCallUsing(resultA));
    var resultC = await (thirdAsyncCallUsing(resultB));
    return doSomethingWith(resultC);
});
```

which, with one [proviso](#obtaining-awaitable-versions-of-node-style-apis), is semantically equivalent to:

```javascript
function foo2(callback) {
    firstAsyncCall(function (err, resultA) {
        if (err) { callback(err); return; }
        secondAsyncCallUsing(resultA, function (err, resultB) {
            if (err) { callback(err); return; }
            thirdAsyncCallUsing(resultB, function (err, resultC) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, doSomethingWith(resultC));
                }
            });

        });
    });
}
```

The function `foo` does not block Node's event loop, despite its synchronous appearance. Execution within `foo` is suspended during each of its three asynchronous operations, but Node's event loop can execute other code whilst those operations are pending. You can write code like the above example in a HTTP request handler, and achieve high throughput with many simultaneous connections, just like with callback-based asynchronous handlers.

In short, `asyncawait` marries the high concurrency of asynchronous code with the visual clarity and conciseness of synchronous code. Rather than passing callbacks and error-backs, you can `return` values and use `try/catch` blocks. Rather than `require`ing specialised asynchronous control-flow constructs like [`each`](https://github.com/caolan/async#eacharr-iterator-callback) and [`whilst`](https://github.com/caolan/async#whilsttest-fn-callback), you can use plain JavaScript constructs like `for` and `while` loops.



# 2. Feature/Gotcha Summary
* Eliminates callback spaghetti code.
* Enables the use of ordinary JavaScript control flow constructs for asynchronous operations.
* Syntax is plain JavaScript, and behaves much like C#'s async/await.
* Seamless interoperation with most other libraries, including [Express](expressjs.com), [Mocha](http://visionmedia.github.io/mocha/), [Underscore](http://documentcloud.github.io/underscore/), [Bluebird](https://github.com/petkaantonov/bluebird), etc.
* [Fast](./comparison) and lightweight.
* Completely [non-blocking](http://stackoverflow.com/a/14797359).
* Does not require [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*).
* No code preprocessing or special build steps, simply write and execute your code normally.
* Built with [node-fibers](https://github.com/laverdet/node-fibers).
* [TypeScript](http://www.typescriptlang.org/) and X-to-JavaScript friendly (since ES6 generators are not required).
* TypeScript typings are embedded.
* Works only in Node.js, not in browsers (since it uses node-fibers).



# 3. How does it work?
Like [`co`](https://github.com/visionmedia/co), `asyncawait` can suspend a running function without blocking Node's event loop. Both libraries are built on [coroutines](http://en.wikipedia.org/wiki/Coroutine), but use different technologies. `co` uses [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), which work in Node >= v0.11.2 (with the `--harmony` flag), and will hopefully be supported someday by all popular JavaScript environments and toolchains.

`asyncawait` uses [`node-fibers`](https://github.com/laverdet/node-fibers). It works with plain ES3/ES5 JavaScript, which is great if your tools do not yet support ES6 generators. This may be an important consideration when using [compile-to-JavaScript languages](https://github.com/jashkenas/coffee-script/wiki/List-of-languages-that-compile-to-JS), such as [TypeScript](http://www.typescriptlang.org/) or [CoffeeScript](http://coffeescript.org/).

A similar outcome may be achieved by transforming JavaScript source code in a preprocessing step. [streamline.js](https://github.com/Sage/streamlinejs) is an example of this method. Code using `asyncawait` is executed normally without any code tranformation or preprocessing.



# 4. Compared to...
`asyncawait` represents one of several viable approaches to writing complex asynchronous code in Node.js, with its own particular trade-offs. Notable alternatives include [`async`](https://github.com/caolan/async), [`bluebird`](https://github.com/petkaantonov/bluebird/) and [`co`](https://github.com/visionmedia/co), each with their own trade-offs. The following table summarises some of the alternatives and their pros and cons. For more information about how the alternatives compare, take a look in the [comparison](./comparison) folder.

`asyncawait` may be a good choice if (a) you need highly concurrent throughput, (b) your asynchronous code must be clear and concise, (c) your code targets Node.js, and (d) you are limited to ES3/ES5 syntax (e.g. you write in TypeScript or CoffeeScript).

| | Max. throughput (full event loop utilisation) | Concise, clear code (control-flow, data-flow and error-flow) | Max. support for Node.js dev/build tools | Max. support for JS envs (eg Node + browsers)
|---|---|---|---|---|
| Plain synchronous code | :heavy_exclamation_mark:<sup>[1]</sup> | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Plain callbacks | :white_check_mark: | :heavy_exclamation_mark:<sup>[2]</sup> | :white_check_mark: | :white_check_mark: |
| Callbacks + control-flow (e.g. [`async`](https://github.com/caolan/async)) | :white_check_mark: | :heavy_exclamation_mark:<sup>[3]</sup> | :white_check_mark: | :white_check_mark: |
| Promises + control-flow (e.g. [`bluebird`](https://github.com/petkaantonov/bluebird/)) | :white_check_mark: | :heavy_exclamation_mark:<sup>[3]</sup> | :white_check_mark: | :white_check_mark: |
| Coroutines with [`co`](https://github.com/visionmedia/co) | :white_check_mark: | :white_check_mark: | :heavy_exclamation_mark:<sup>[4]</sup> | :heavy_exclamation_mark:<sup>[5]</sup> |
| Coroutines with `asyncawait` | :white_check_mark: | :white_check_mark: | :white_check_mark: | :heavy_exclamation_mark:<sup>[6]</sup> |

**Footnotes:**
<sup>**[1]**</sup> Each synchronous call blocks Node's event loop. All concurrent tasks are blocked, and the event loop sits idle, until the call completes.
<sup>**[2]**</sup> Plain callbacks rapidly become unwieldy for complex asynchronous tasks. See [comparison](./comparison).
<sup>**[3]**</sup> Whilst better than plain callbacks, these styles still produce longer and more complex code than synchronous or coroutine-based code. See [comparison](./comparison).
<sup>**[4]**</sup> Some tools do not (yet) support ES6 generators, including [compile-to-JavaScript languages](https://github.com/jashkenas/coffee-script/wiki/List-of-languages-that-compile-to-JS) such as [TypeScript](http://www.typescriptlang.org/) and [CoffeeScript](http://coffeescript.org/).
<sup>**[5]**</sup> [ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) still has patchy browser support.
<sup>**[6]**</sup> Strictly limited to Node.js environments (i.e. no browsers) due to the use of [`node-fibers`](https://github.com/laverdet/node-fibers).



# 5. Performance
How well does `asyncawait` perform? The answer depends on what kinds of performance you care about. As a rough guide, compared with bare callbacks, expect your code to be 70% shorter with 66% less indents and run at 79% of the speed of bare callbacks. OK, so don't trust those numbers (which actually are [real](./comparison/README.md#comparison-summary)) but do check out the code in the [comparison](./comparison) folder, and do run your own [benchmarks](./comparison/benchmark.js).



# 6. Quick Start

### Installation
`npm install asyncawait`

### Async/Await 101
`asyncawait` provides just two functions: `async()` and `await()`. You can reference these functions with the code:
```javascript
var async = require('asyncawait/async');
var await = require('asyncawait/await');
```
Use `async` to declare a suspendable function. Inside a suspendable function, use `await` to suspend execution until an awaitable expression produces its result. Awaitable expressions typically involve performing asynchronous operations.

Note the spacing after `async` and `await` in the examples. They are just plain functions, but the space makes them look more like keywords. Alternatively if you really want them to stand out, you could use names like `__await__` or `AWAIT`, or whatever works for you.

### Basic Example
```javascript
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs')); // adds Async() versions that return promises
var path = require('path');
var _ = require('lodash');

/** Returns the number of files in the given directory. */
var countFiles = async (function (dir) {
    var files = await (fs.readdirAsync(dir));
    var paths = _.map(files, function (file) { return path.join(dir, file); });
    var stats = await (_.map(paths, function (path) { return fs.statAsync(path); })); // parallel!
    return _.filter(stats, function (stat) { return stat.isFile(); }).length;
});

// Give it a spin
countFiles(__dirname)
    .then (function (num) { console.log('There are ' + num + ' files in ' + __dirname); })
    .catch(function (err) { console.log('Something went wrong: ' + err); });
```

The function `countFiles` returns the number of files in a given directory. To find this number, it must perform multiple asynchronous operations (using `fs.readdir` and `fs.stat`). `countFiles` is declared as a suspendable function by wrapping its definition inside `async(...)`. When `countFiles` is called with a `dir` string, it begins executing asynchronously and immediately returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) of a result. Internally, `countFiles` appears to have synchronous control flow. Each `await` call suspends execution until its argument produces a result, which then becomes the return value of the `await` call.

### More Examples
The [examples](./examples) folder contains more examples. The [comparison](./comparison) folder also contains several examples, each coded in six different styles (using plain callbacks, using synchronous-only code, using the `async` library, using the `bluebird` library, using the `co` library, and using this `asyncawait` library). 



# 7. `async` in Depth: Suspendable Functions
The subsections below refer to the following code:
```javascript
var suspendable = async (function defn(a, b) {
	assert(...) // may throw
    var result = await (...)
    return result;
});
var suspendable2 = async.cps (function defn(a, b) {...});
var suspendable3 = async.thunk (function defn(a, b) {...});
var suspendable4 = async.result (function defn(a, b) {...});
```

### Accepting Arguments and Returning Values
Suspendable functions may accept arguments. Calling `suspendable(1, 2)` will in turn call `defn(1, 2)`. Suspendable functions may be variadic. They report the same arity as their definition (i.e. `suspendable.length` and `defn.length` both return `2`).

A suspendable function's definition may return with or without a value, or it may throw. Returning without a value is equivalent to returning `undefined`. The return value of the definition function becomes the result of the suspendable function (see [Obtaining Results from Suspendable Functions](#obtaining-results-from-suspendable-functions)). 

### Handling Errors and Exceptions
A suspendable function's definition may throw exceptions directly or indirectly. If any of the `await` calls in `defn` asynchronously produces an error result, that error will be raised as an exception inside `defn`.

Within the definition of a suspendable function, exceptions may be handled using ordinary `try/catch` blocks. Any unhandled exception thrown from within `defn` will become the error result of `suspendable`.

### Obtaining Results from Suspendable Functions
A suspendable function executes asynchronously, so it cannot generally `return` its result (or `throw` an error) directly. By default, `async` produces suspendable functions that return promises. `suspendable` returns a promise that is fulfilled with `defn`'s return value, or rejected with `defn`'s exception. Other ways of communicating results/errors are also supported:

- Returning a promise: `suspendable(1, 2).then(function (val) {...}, function (err) {...});`
- Acceptng a node-style callback: `suspendable2(1, 2, function (err, val) {...});`
- returning a lazily-executed thunk: `suspendable3(1, 2)(function (err, val) {...});`
- returning the value directly: `try { var val = suspendable4(1, 2); } catch (err) {...}`

Note that `suspendable4` can only be called from inside another suspendable function. Also, it is possible to create suspendable functions that comminucate results in multiple ways, such as both accepting a callback and returning a promise. You can use the [`async.mod`](#the-asyncmod-function) function to achieve this.

### Preservation of `this` Context
When a suspendable function is called, its `this` context is passed through to the call to its definition. For example, when `suspendable.call(myObj, 1, 2)` is executed, `defn` will be called with arguments `1` and `2` and a `this` value of `myObj`.

### Creating and Using Asynchronous Iterators
The `async` function can be used to create asynchronous iterators. These are analogous to [ES6 iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/The_Iterator_protocol), except that the `next()` function is a suspendable function obeying all the rules described in this section. `async.iterable` creates an iterable which returns an asynchronous iterator whose `next()` function returns a promise of a `{value, done}` result.

Asynchronous iterators have a `forEach()` method for iterating over their values. For more information, take a look at the [descendentFilePaths.js](./examples/descendentFilePaths.js) and [iteration.js](./examples/iteration.js) examples.

### Eager versus Lazy Execution
Calling a suspendable function such as `suspendable` starts its asynchronous execution immediately, as per the normal semantics of promises. In contrast, thunk-returning suspendable functions do not begin executing until a callback is passed to the thunk. Suspendable functions such as `suspendable3` thus have lazy semantics.

### Nesting, Composition and Recursion
Suspendable functions may be called in `await` expressions, since they return promises (or thunks or values) and are therefore [awaitable](#what-works-with-await). It follows that calls to suspendable functions may be arbitrarily nested and composed, and may be recursive.

### The `async.mod` Function
Every variant of the `async` function (i.e. `async`, `async.cps`, `async.iterable`, etc) has a `mod` method that accepts an `options` object and returns another `async` function variant. The `options` object may contain any combination of the following four properties:

```javascript
{
    returnValue: <string>; // Recognised values: 'none', 'promise', 'thunk', 'result'
    acceptsCallback: <boolean>;
    isIterable: <boolean>;
    maxConcurrency: <number>; // Recognised values: falsy values and positive numbers
}
```
Omitted properties will inherit their value from the `async` variant being modded. For example, the calls `async.mod({acceptsCallback:true})` and `async.cps.mod({returnValue:'promise'})` are equivalent. Both calls return an `async` function that may be used to create suspendable functions that both accept a callback and return a promise.



# 8. `await` in Depth: Awaitable Expressions
The subsections below refer to the following code:
```javascript
var suspendable = async (function () {
	var promise1 = new Promise(.../* eventually produces the value 'p1' */);
	var promise2 = new Promise(.../* eventually produces the value 'p2' */);
    var thunk1 = function(callback) {.../* eventually produces the value 't1' */});
    var thunk2 = function(callback) {.../* eventually produces the value 't2' */});
    var thunk3 = ..., thunk4 = ...;
	var r1 = await (promise1);
	var r2 = await (thunk1);
	var r3 = await (3.14);
	var r4 = await ([promise2, 2, ['222', thunk2]]);
	var r5 = await ({ t3: thunk3, t4: thunk4 });
    return [r1, r2, r3, r4, r5];
});
```

### What Works with `await`?
`await` takes a single argument, which must be an awaitable expression. An awaitable expression may be any of the following:

1. A [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or any [`then`able object](http://wiki.commonjs.org/wiki/Promises/A)), as in `var r1 = await (promise1)`. The function `suspendable` will be suspended until `promise1` is settled. The promise's resolution value (`'p1'`) will become the `await` call's return value, and assigned to `r1`. If `promise1` is rejected, the rejection value will be thrown as an exception inside `suspendable`.
2. A [thunk](https://github.com/visionmedia/co#thunks-vs-promises), as in `var r2 = await (thunk1)`. The thunk `thunk1` will be called immediately, and `suspendable` will be suspended until control is returned to the thunk's callback. The thunk's result (`'t1'`) will become the `await` call's return value, and assigned to `r2`. If `thunk1` returns an error, the error value will be thrown as an exception inside `suspendable`.
3. A primitive value, such as a number, string or null, as in `var r3 = await (3.14)`. The `await` call will return immediately with the primitive value, in this case assigning the value `3.14` to `r3`.
4. An array or [plain object](http://lodash.com/docs#isPlainObject), whose elements are all awaitables, as in `var r4 = await ([promise2, 2, ['222', thunk2]])`. Note this definition is recursive and allows nested object graphs. The function `suspendable` will be suspended until all contained awaitables (`promise2`, `2`, `'222'` and `thunk2`) have produced their value, at which time the `await` call will return a clone of the object graph with all awaitable expressions replaced by their results (`['p2', 2 ['222', 't2']]`). If any of the contained awaitables produces an error, the error value will be thrown as an exception in `suspendable`.

Note that calling `await` with more than one argument (or with zero arguments) is equivalent to calling `await` with a single array containing all the arguments.

### Obtaining Awaitable Versions of Node-Style APIs
In conventional Node.js code, asynchronous functions take a callback as their last parameter and don't return any value. Therefore, calls to these functions are **not awaitable**. However, awaitable versions may be obtained with relative ease using something like [`bluebird's`](https://github.com/petkaantonov/bluebird/) [`promisifyAll()`](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisepromisifyallobject-target---object), or [`thunkify`](https://github.com/visionmedia/node-thunkify).

### Maximising Concurrency
A series of `await` calls are executed serially. For example, execution of `var r1 = await (promise1)` is completed before execution of `var r2 = await (thunk1)` begins.

In contrast, a single `await` call on an array or plain object processes all of the contained awaitables concurrently. For example, when the statement `var r5 = await ({ t3: thunk3, t4: thunk4 })` both `thunk3` and `thunk4` are called immediately, and their asynchronous tasks are executed concurrently. 

Libraries such as [lodash](http://lodash.com) and [underscore](http://underscorejs.org/) interoperate smoothly with `asyncawait`, for both producing arrays of concurrently executing tasks, and for consuming arrays of results.

### Variations of `await`
There are several variations of the `await` function, with alternative behaviour when the awaitable expression is an array or plain object. Take a look at [awaitTop.js](./examples/awaitTop.js) for a usage example.

The `await.top(n)` variant accepts a number `n`, and resumes the suspendable function when the first `n` awaitable expressions contained in the awaitable array or plain object produce their value. The return value of the `await.top(n)` call is an array containing the fastest `n` results in the order they were resolved.

The `await.in` variant is like `await`, but does not clone the awaitable expression it recieves as an argument. The results of the contained awaitables are substituted in place into the original awaitable array or plain object, which becomes the return value of the `await` call.



# 9. Recipes

### Handling HTTP Routes with Express
Coming soon...

### Asynchronous Testing with Mocha
Coming soon...



# 10. API Reference

### `function async(fn: Function) --> (...args) --> Promise`
Creates a function that can be suspended at each asynchronous operation. `fn` contains the body of the suspendable function. `async` returns a function of the form `(...args) --> Promise`. Any arguments passed to this function are passed through to `fn`. The returned promise is resolved when `fn` returns, or rejected if `fn` throws.

### `function async.cps(fn: Function) --> (...args, callback) --> void`
Variant of `async` that produces a suspendable function that accepts a node-style callback and returns nothing. See [Obtaining Results from Suspendable Functions](#obtaining-results-from-suspendable-functions).

### `function async.thunk(fn: Function) --> (...args) --> Thunk`
Variant of `async` that produces a suspendable function that returns a thunk. See [Obtaining Results from Suspendable Functions](#obtaining-results-from-suspendable-functions).

### `function async.result(fn: Function) --> (...args) --> any`
Variant of `async` that produces a suspendable function that returns its result directly, but can only be called from inside another suspendable function. See [Obtaining Results from Suspendable Functions](#obtaining-results-from-suspendable-functions).

### `function async.iterable(fn: Function) --> (...args) --> AsyncIterator`
Variant of `async` that produces a function which returns an asynchronous iterator, whose `next()` method is a suspendable function that returns a promise. See [Creating and Using Asynchronous Iterators](#creating-and-using-asynchronous-iterators).

### `function async.mod(options) --> AsyncFunction`
Enables the creation of arbitrary variants of the `async` function. Accepts an `options` object and returns an `async` function variant. See [The `async.mod` Function](#the-asyncmod-function).

### `function await(expr: Awaitable) --> Any`
Suspends a suspendable function until the [awaitable](#what-works-with-await) expression `expr` produces a result. The result becomes the return value of the `await` call. If `expr` produces an error, then an exception is raised in the suspendable function.

### `function await.top(n: number) --> (expr: Array|Object) --> Array`
Variant of `await` whose result consists of the `n` fastest-resolving awaitables contained in its argument. See [Variations of `await`](#variations-of-await).

### `function await.in(expr: Array|Object) --> Array|Object`
Variant of `await` that returns the original array/object, rather than a cloned array/object, substituting the results of contained awaitables in-place. See [Variations of `await`](#variations-of-await).



# 11. Acknowledgements
`asyncawait` uses the following technologies:

- [node-fibers](https://github.com/laverdet/node-fibers): This implementation of coroutines is unfortunately limited to Node.js. ES6 generators may be simpler, but fibers are more flexible and support a far broader space of design possibilities. It would be great if ES6 generators were this open and flexible.
- [bluebird](https://github.com/petkaantonov/bluebird): this promise library is both a core component of `asyncawait` and a great source of inspiration for writing high-performance JavaScript code.
- [TypeScript](http://www.typescriptlang.org/): `asyncawait` is written in TypeScript (look in the [src folder](./src)), and includes a [type declaration file](./src/typings/asyncawait/asyncawait.d.ts). TypeScript makes JavaScript development faster, less error-prone, more scaleable, and generally more pleasant.
- [lodash](http://lodash.com/): underscore, but better.


# 12. License
Copyright (c) 2014-2015 Troy Gerwien

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
