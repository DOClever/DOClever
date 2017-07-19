import chai = require('chai');
import Promise = require('bluebird');
import async = require('../src/async/index');
import await = require('../src/await/index');
var expect = chai.expect;

//TODO more tests here and other await API parts (eg for thunk cf async.thunk.ts)

//TODO: all await.x tests: test handling of single/multiple args as appropriate

describe('The await(...) function', () => {

    it('throws if not called within a suspendable function', () => {
        expect(() => await(111)).to.throw(Error);
    });

    it('suspends the suspendable function until the expression produces a result', done => {
        var x = 5;
        var foo = async (() => {
            await (Promise.delay(40));
            x = 7;
            await (Promise.delay(40));
            x = 9;
        });
        foo();
        Promise.delay(20)
        .then(() => expect(x).to.equal(5))
        .then(() => Promise.delay(40))
        .then(() => expect(x).to.equal(7))
        .then(() => Promise.delay(40))
        .then(() => expect(x).to.equal(9))
        .then(() => done())
        .catch(done);
        expect(x).to.equal(5);
    });

    it('resumes the suspendable function with the value of the awaited expression', done => {
        var foo = async (() => await (Promise.delay(20).then(() => 'blah')));
        foo()
        .then(result => expect(result).to.equal('blah'))
        .then(() => done())
        .catch(done);
    });

    it('throws into the suspendable function the error produced by the awaited expression', done => {
        var foo = async (() => await (Promise.delay(20).then(() => { throw new Error('blah'); })));
        foo()
        .then(() => done(new Error('foo() should have rejected')))
        .catch(err => { expect(err.message).to.equal('blah'); done(); });
    });

    it('resumes the suspendable function with all the results of a concurrent expression', done => {
        var foo = async (() => await (Promise.delay(40).then(() => 'foo')));
        var bar = async (() => await (Promise.delay(20).then(() => 'bar')));
        var all = async (() => await([foo(), bar()]));
        all()
        .then(result => expect(result).to.deep.equal(['foo', 'bar']))
        .then(() => done())
        .catch(done);
    });

    it('throws into the suspendable function the first error in a concurrent expression', done => {
        var foo = async (() => await (Promise.delay(40).then(() => { throw new Error('foo'); })));
        var bar = async (() => await (Promise.delay(20).then(() => { throw new Error('bar'); })));
        var all = async (() => await([foo(), bar()]));
        all()
        .then(() => done(new Error('all() should have rejected')))
        .catch(err => { expect(err.message).to.equal('bar'); done(); });
    });
});

//TODO: test with: promise, thunk, array, graph, value
