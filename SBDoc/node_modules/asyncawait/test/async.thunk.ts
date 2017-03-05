import chai = require('chai');
import Promise = require('bluebird');
import async = require('../src/async/index');
import await = require('../src/await/index');
var expect = chai.expect;


describe('A suspendable function returned by async.thunk(...)', () => {

    it('synchronously returns a thunk', () => {
        var foo = async.thunk (() => {});
        var syncResult = foo();
        expect(syncResult).instanceOf(Function);
        expect(syncResult.length).to.equal(1);
    });

    it('does not execute if the thunk is not invoked', done => {
        var x = 5;
        var foo = async.thunk (() => { x = 7; });
        var thunk = foo();
        Promise.delay(50)
        .then(() => expect(x).to.equal(5))
        .then(() => done())
        .catch(done);
        expect(x).to.equal(5);
    });

    it('executes if the thunk is invoked without a callback', done => {
        var x = 5;
        var foo = async.thunk (() => { x = 7; });
        foo()();
        Promise.delay(20)
        .then(result => expect(x).to.equal(7))
        .then(() => done())
        .catch(done);
    });

    it('begins executing synchronously and completes asynchronously', done => {
        var x = 5;
        var foo = async.thunk (() => { x = 7; });
        Promise.promisify(foo())()
        .then(() => expect(x).to.equal(9))
        .then(() => done())
        .catch(done);
        expect(x).to.equal(7);
        x = 9;
    });

    it("preserves the 'this' context of the call", done => {
        var foo = { bar: async.thunk (function () { return this; }) }, baz = {x:7};
        Promise.promisify(foo.bar.call(foo))()
        .then(result => expect(result).to.equal(foo))
        .then(() => Promise.promisify(foo.bar.call(baz))())
        .then(result => expect(result).to.equal(baz))
        .then(() => done())
        .catch(done);
    });

    it('eventually resolves with its definition\'s returned value', done => {
        var foo = async.thunk (() => { return 'blah'; });
        Promise.promisify(foo())()
        .then(result => expect(result).to.equal('blah'))
        .then(() => done())
        .catch(done);
    });

    it('eventually rejects with its definition\'s thrown value', done => {
        var act, exp = new Error('Expected thrown value to match rejection value');
        var foo = async.thunk (() => { throw exp; return 'blah'; });
        Promise.promisify(foo())()
        .catch(err => act = err)
        .then(() => {
            if (!act) done(new Error("Expected function to throw"))
            else if (act.message !== exp.message) done(exp);
            else done();
        });
    });

    it('works with await', done => {
        var foo = async.thunk (() => { return await (Promise.delay(20).then(() => 'blah')); });
        Promise.promisify(foo())()
        .then(result => expect(result).to.equal('blah'))
        .then(() => done())
        .catch(done);
    });

    //it('fails if yield() is called', done => {
    //    var foo = async.thunk (() => { yield_(111); yield_(222); yield_(333); return 444; });
    //    var yields = [];
    //    Promise.promisify(foo())()
    //    .progressed(value => yields.push(value))
    //    .then(() => { throw new Error('Expected foo to throw'); })
    //    .catch(() => {
    //        expect(yields).to.be.empty;
    //        done();
    //    });
    //});
});
