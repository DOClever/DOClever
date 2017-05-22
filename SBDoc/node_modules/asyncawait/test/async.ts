import chai = require('chai');
import Promise = require('bluebird');
import async = require('../src/async/index');
import await = require('../src/await/index');
var expect = chai.expect;


//TODO: tests for long stack traces across async calls?


function runTestsFor(variant?: string, acceptsCallback = false) {
    var name = 'async' + (variant ? ('.' + variant) : '');
    var func = async;
    if (variant) variant.split('.').forEach(prop => func = func[prop]);
    var arity = fn => fn.length + (acceptsCallback ? 1 : 0);

    describe('The ' + name + '(...) function', () => {

        //it('throws if not passed a single function', () => {
        //    expect(() => func.call(func, 1)).to.throw(Error);
        //    expect(() => func.call(func, 'sss')).to.throw(Error);
        //    expect(() => func.call(func, ()=>{}, true)).to.throw(Error);
        //    expect(() => func.call(func, ()=>{}, ()=>{})).to.throw(Error);
        //});

        it('synchronously returns a function', () => {
            var foo = func(() => { });
            expect(foo).to.be.a('function');
        });

        it('returns a function whose arity matches that of its definition', () => {

            var defns: any[] = [
                (a, b, c) => {},
                () => {},
                (a, b, c, d, e, f, g, h) => {},
                x => {}
            ];
            for (var i = 0; i < defns.length; ++i) {
                var foo = func(defns[i]);
                expect(foo.length).to.equal(arity(defns[i]));
            }
        });
    });
}
runTestsFor(null);
runTestsFor('cps', true);
runTestsFor('thunk');
runTestsFor('iterable');


describe('A suspendable function returned by async(...)', () => {

    it('synchronously returns a promise', () => {
        var foo = async (() => {});
        var syncResult = foo();
        expect(syncResult).instanceOf(Promise);
    });

    it('begins executing synchronously and completes asynchronously', done => {
        var x = 5;
        var foo = async (() => { x = 7; });
        foo()
        .then(() => expect(x).to.equal(9))
        .then(() => done())
        .catch(done);
        expect(x).to.equal(7);
        x = 9;
    });

    it("preserves the 'this' context of the call", done => {
        var foo = { bar: async (function () { return this; }) }, baz = {x:7};
        foo.bar()
        .then(result => expect(result).to.equal(foo))
        .then(() => foo.bar.call(baz))
        .then(result => expect(result).to.equal(baz))
        .then(() => done())
        .catch(done);
    });

    it('eventually resolves with its definition\'s returned value', done => {
        var foo = async (() => { return 'blah'; });
        (<Promise<any>> foo())
        .then(result => expect(result).to.equal('blah'))
        .then(() => done())
        .catch(done);
    });

    it('eventually rejects with its definition\'s thrown value', done => {
        var act, exp = new Error('Expected thrown value to match rejection value');
        var foo = async (() => { throw exp; return 'blah'; });
        (<Promise<any>> foo())
        .catch(err => act = err)
        .then(() => {
            if (!act) done(new Error("Expected function to throw"))
            else if (act !== exp) done(exp);
            else done();
        });
    });

    it('works with await', done => {
        var foo = async (() => { return await (Promise.delay(20).then(() => 'blah')); });
        foo()
        .then(result => expect(result).to.equal('blah'))
        .then(() => done())
        .catch(done);
    });

    it('triggers the global unhandledException event if a rejection goes unhandled', done => {
        var foo = async (() => { throw new Error('nobody handled me'); });
        foo(); // NB: no .catch()

        var didTrigger = false;
        process.on('unhandledRejection', err => {
            didTrigger = true;
            done();
        });
        setTimeout(() => {
            if (!didTrigger) done(new Error('unhandledRejection event not triggered'));
        }, 20);
    });    

    //it('emits progress with each yielded value', done => {
    //    var foo = async(() => { yield_(111); yield_(222); yield_(333); return 444; });
    //    var yields = [];
    //    (<Promise<any>> foo())
    //        .progressed(value => yields.push(value))
    //        .then(result => expect(result).to.equal(444))
    //        .then(() => expect(yields).to.deep.equal([111, 222, 333]))
    //        .then(() => done())
    //        .catch(done);
    //});
});
