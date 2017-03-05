# Comparing Node.js Asynchronous Alternatives



### The Sample Functions
The `largest`, `countFiles`, and `fibonacci` folders each contain a sample function implemented in six different ways:

* **async**: using the [`async`](https://github.com/caolan/async) library.
* **asyncawait**: using this `asyncawait` library.
* **bluebird**: using the [`bluebird`](https://github.com/petkaantonov/bluebird) library.
* **callbacks**: using plain callbacks.
* **co**: using the [`co`](https://github.com/visionmedia/co) library (requires node >= 0.11.2 with the `--harmony` flag).
* **synchronous**: using plain blocking code (just for comparison).

This gives a good indication of the trade-offs between the different coding styles. For the remainer of this document, we'll focus on the most complex sample function, the `largest()` function.



### The `largest()` Function
The `largest()` sample function is designed to be of moderate complexity, like a real-world problem.

`largest(dir, options)` finds the largest file in the given directory, optionally performing a recursive search. `dir` is the path of the directory to search. `options`, if provided, is a hash with the following two keys, both optional:

* `recurse` (`boolean`, defaults to `false`): if true, `largest()` will recursively search all subdirectories.
* `preview` (`boolean`, defaults to `false`): if true, `largest()` will include a small preview of the largest file's content in it's results.

The requirements of `largest()` may be summarised as:

1. Find the largest file in the given directory (recursively searching subdirectories if the option is selected).
2. Keep track of how many files/directories have been processed.
3. Get a preview of the file contents (first several characters) if the option is selected.
4. Return the details about the largest file and the number of files/directories searched.
5. Exploit concurrency wherever possible.
6. Don't block Node's event loop anywhere.

The last two requirements are obviously violated by the 'synchronous' variant, but it is worth including for comparison.



### Metrics for Comparison
Some interesting metrics with which to compare the six variants are:

* **Lines of code (SLOC)**: Shorter code that does the same thing is usually a good thing.
* **Levels of Indenting**: Each indent represents a context-shift and therefore higher complexity.
* **Anachrony**: Asynchronous code may execute in an order very different from its visual representation, which may make it harder to read and reason about in some cases.
* **Speed**: Node.js is built for speed and throughput, so any loss of speed imposed by a variant may count against it 


# Comparison Summary
The following metrics are for the `largest()` example function:

| Variant       | SLOC <sup>[1]</sup> | Indents <sup>[2]</sup> | Anachrony <sup>[3]</sup> | Ops/sec <sup>[4]</sup> |
| :------------ | -------: | ----------: | ------------: | ----------: |
| async         |       67 |           7 |             5 |     ~65     |
| asyncawait    |       23 |           2 |             - |     ~79     |
| bluebird      |       44 |           3 |             8 |     ~89     |
| callbacks     |       84 |           6 |             9 |    ~100     |
| co            |       23 |           2 |             - |     ~68 <sup>[5]</sup> |
| synchronous   |       23 |           2 |             - |     ~63 <sup>[6]</sup> |

###### Footnotes:

<sup>[1]</sup> Includes only lines in the function body; excludes blank lines and comment lines.

<sup>[2]</sup> Maximum indentation from the outermost statements in the function body.

<sup>[3]</sup> Count of times in the function body when visually lower statements execute before visually higher statements due to asynchronous callbacks.

<sup>[4]</sup> Scaled (callbacks = 100), higher is better. Using [benchmark.js](./benchmark.js) on my laptop. All benchmarks run in Node v0.10.25 except for `co` - see [5] below.

<sup>[5]</sup> `co` benchmark run in Node v0.11.12 with the `--harmony` flag.

<sup>[6]</sup> Not strictly comparable because it blocks Node's event loop.



# Observations
The following observations are based on the above results and obviously may differ substantially with other code and/or on other machines. **YMMV**. Having said that, at least in this case:

* Plain callbacks are the speed king.
* All other asynchronous variants achieve at least 65% of the speed of plain callbacks.
* Bluebird achieves almost 90% of plain callback speed, living up to its reputation of being extremely well optimised.
* `asyncawait` is third-fastest in this benchmark, achieving almost 80% of the performance of plain callbacks.
* The source code of `co`, `asyncawait`, and `synchronous` are virtually identical, with purely mechanical syntax differences.
* `co` and `asyncawait`, each using different coroutine technology, are very similar on these metrics. In a choice between these two, the biggest deciding factor may be whether you can use ES6.
* The synchronous approach is actually the slowest, which perhaps makes sense since it can't exploit concurrency.
* `async` looks relatively unfavourable compared to the other asynchronous options on these metrics.
