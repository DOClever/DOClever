var chai = require('chai');
var Promise = require('bluebird');
var async = require('../src/async/index');
var await = require('../src/await/index');
var expect = chai.expect;
describe('async.iterable(...)', function () {
    var foo = async.iterable(function (yield_, count, accum) {
        if (count < 1 || count > 9)
            throw new Error('out of range');
        for (var i = 1; i <= count; ++i) {
            if (accum)
                accum.push(111 * i);
            yield_(111 * i);
        }
        return 'done';
    });
    describe('returns a function', function () {
        it('which returns an async iterator with next() and forEach() methods', function () {
            var syncResult = foo();
            expect(syncResult).is.an('object');
            expect(syncResult.next).is.a('function');
            expect(syncResult.forEach).is.a('function');
        });
    });
    describe('provides an iterator whose next() method', function () {
        it('synchronously returns a promise', function () {
            var iter = foo(3);
            expect(iter.next()).instanceOf(Promise);
        });
        it('begins executing synchronously and completes asynchronously', function (done) {
            var arr = [], iter = foo(3, arr);
            iter.next()
                .then(function () { return expect(arr).to.deep.equal([111, '***']); })
                .then(function () { return done(); })
                .catch(done);
            expect(arr).to.deep.equal([111]);
            arr.push('***');
        });
        it("preserves the 'this' context of the call", async.cps(function () {
            var foo = { bar: async.iterable(function (yield_) { yield_(this); return 'done'; }) }, baz = { x: 7 };
            var iter = foo.bar();
            expect(await(iter.next())).to.deep.equal({ done: false, value: foo });
            expect(await(iter.next())).to.deep.equal({ done: true });
            iter = foo.bar.call(baz);
            expect(await(iter.next())).to.deep.equal({ done: false, value: baz });
            expect(await(iter.next())).to.deep.equal({ done: true });
        }));
        it('eventually resolves with the definition\'s yielded value', async.cps(function () {
            var iter = foo(3);
            expect(await(iter.next())).to.deep.equal({ done: false, value: 111 });
            expect(await(iter.next())).to.deep.equal({ done: false, value: 222 });
            expect(await(iter.next())).to.deep.equal({ done: false, value: 333 });
            expect(await(iter.next())).to.deep.equal({ done: true });
        }));
        it('eventually rejects with the definition\'s thrown value', async.cps(function () {
            var err, iter = foo(20);
            expect(function () { return await(iter.next()); }).to.throw(Error, 'out of range');
        }));
        it('eventually rejects if the iteration is already finished', async.cps(function () {
            var err, iter = foo(1);
            expect(await(iter.next())).to.deep.equal({ done: false, value: 111 });
            expect(await(iter.next())).to.deep.equal({ done: true });
            expect(function () { return await(iter.next()); }).to.throw(Error);
        }));
        it('works with await', function (done) {
            var foo = async.iterable(function (yield_) { yield_(await(Promise.delay(20).then(function () { return 'blah'; }))); });
            foo().next()
                .then(function (result) { return expect(result).to.deep.equal({ done: false, value: 'blah' }); })
                .then(function () { return done(); })
                .catch(done);
        });
    });
    describe('provides an iterator whose forEach() method', function () {
        function nullFunc() { }
        //it('expects a single callback as its argument', () => {
        //    expect(() => (<any> foo(3)).forEach()).to.throw(Error);
        //    expect(() => (<any> foo(3)).forEach(1)).to.throw(Error);
        //    expect(() => (<any> foo(3)).forEach(1, nullFunc)).to.throw(Error);
        //});
        it('synchronously returns a promise', function () {
            var iter = foo(3);
            expect(iter.forEach(nullFunc)).instanceOf(Promise);
        });
        it('begins executing synchronously and completes asynchronously', function (done) {
            var arr = [], iter = foo(3, arr);
            iter.forEach(nullFunc)
                .then(function () { return expect(arr).to.deep.equal([111, '***', 222, 333]); })
                .then(function () { return done(); })
                .catch(done);
            expect(arr).to.deep.equal([111]);
            arr.push('***');
        });
        it('iterates over all yielded values', async.cps(function () {
            var arr = [], iter = foo(4);
            await(iter.forEach(function (val) { return arr.push(val); }));
            expect(arr).to.deep.equal([111, 222, 333, 444]);
        }));
        //it('eventually resolves with the definition\'s returned value', async.cps(() => {
        //    var arr = [], iter = foo(7, arr);
        //    var result = await (iter.forEach(nullFunc));
        //    expect(result).to.equal('done');
        //    expect(arr.length).to.equal(7);
        //}));
        it('eventually rejects with the definition\'s thrown value', async.cps(function () {
            var err, iter = foo(20);
            expect(function () { return await(iter.forEach(nullFunc)); }).to.throw(Error, 'out of range');
        }));
        it('eventually rejects if the iteration is already finished', async.cps(function () {
            var err, iter = foo(1);
            await(iter.forEach(nullFunc));
            expect(function () { return await(iter.forEach(nullFunc)); }).to.throw(Error);
        }));
        it('works with await', function (done) {
            var foo = async.iterable(function (yield_) { yield_(await(Promise.delay(20).then(function () { return 'blah'; }))); }), arr = [];
            foo().forEach(function (val) { return arr.push(val); })
                .then(function (result) { return expect(result).to.not.exist; })
                .then(function () { return expect(arr).to.deep.equal(['blah']); })
                .then(function () { return done(); })
                .catch(done);
        });
    });
});
//# sourceMappingURL=async.iterable.js.map