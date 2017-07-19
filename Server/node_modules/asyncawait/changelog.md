# 1.0.3 (2016-02-10)

#### Bug Fixes
- Fix #32

#### Improvements
- additional tests for await(...) scenarios
- switch to vscode for authoring


# 1.0.2 (2016-01-05)

#### Bug Fixes
- Fix #29

#### Improvements
- update deps


# 1.0.0 (2015-09-12)

#### Bug Fixes
- benchmark: work without memwatch

#### Improvements
- Bump version to stable release
- add asyncx to comparisons
- update build/test system (remove gulp)
- use pure external typescript typings
- update deps

# 0.7.4 (2014-11-14)

#### Bug Fixes
- Removed `memwatch` from `optionalDependencies`. It should be an `optionalDevDependency`, but npm doesn't support that.

# 0.7.3 (2014-11-14)

#### Improvements

- Added build script (gulp)
- Added unit tests (mocha)
- Upgraded bluebird dependency from 1.x to to 2.x
- asyncawait.d.ts directly references bluebird.d.ts for promise types

# 0.7.2 (2014-06-17)

#### Bug Fixes

 - Workaround problem if multiple node-fibers instances in process ([more info](./src/fibers.ts)).

# 0.7.1 (2014-04-22)

#### Bug Fixes

 - Added missing files to root folder (`require('asyncawait/async')` was failing)

# 0.7.0 (2014-04-21)

#### New Features

 - Suspendable functions can accept node-style callbacks (`async.cps`)
 - Suspendable functions can return a thunk (`async.thunk`)
 - Suspendable function can await and return their result directly (`async.result`)
 - Suspendable functions can yield multiple values (`async.iterable`)
 - Custom `async` functions can be created by modding existing `async` functions (`async.mod`)
 - `await` supports a variant equivalent to bluebird's `race()` (`await.top(n)`)
 - `await` supports a variant that reuses existing arrays/objects (`await.in`)

#### Improvements

 - Suspendable functions have the same arity (i.e. `function.length`) as their definition
 - benchmark.js supports a configurable concurrency factor
 - benchmark.js supports optionally mocking the `fs` module
 - benchmark.js provides more GC details
 - Various optimisations for heavy concurrent loads
 - Added bluebird to comparisons
 - Added fibonacci function to comparisons
 - Added automatic management of fiber pool size

#### Bug Fixes

 - fixed memory leak under heavy concurrent loads (see this [node-fibers issue](https://github.com/laverdet/node-fibers/issues/169))

# 0.6.1 (2014-03-28)

No changes logged for this or prior versions.
