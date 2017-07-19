var chai = require('chai');
var Promise = require('bluebird');
var async = require('../src/async/index');
var await = require('../src/await/index');
var expect = chai.expect;
//TODO: tests for long stack traces across async calls?
function runTestsFor(variant, acceptsCallback) {
    if (acceptsCallback === void 0) { acceptsCallback = false; }
    var name = 'async' + (variant ? ('.' + variant) : '');
    var func = async;
    if (variant)
        variant.split('.').forEach(function (prop) { return func = func[prop]; });
    var arity = function (fn) { return fn.length + (acceptsCallback ? 1 : 0); };
    describe('The ' + name + '(...) function', function () {
        //it('throws if not passed a single function', () => {
        //    expect(() => func.call(func, 1)).to.throw(Error);
        //    expect(() => func.call(func, 'sss')).to.throw(Error);
        //    expect(() => func.call(func, ()=>{}, true)).to.throw(Error);
        //    expect(() => func.call(func, ()=>{}, ()=>{})).to.throw(Error);
        //});
        it('synchronously returns a function', function () {
            var foo = func(function () { });
            expect(foo).to.be.a('function');
        });
        it('returns a function whose arity matches that of its definition', function () {
            var defns = [
                function (a, b, c) { },
                function () { },
                function (a, b, c, d, e, f, g, h) { },
                function (x) { }
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
describe('A suspendable function returned by async(...)', function () {
    it('synchronously returns a promise', function () {
        var foo = async(function () { });
        var syncResult = foo();
        expect(syncResult).instanceOf(Promise);
    });
    it('begins executing synchronously and completes asynchronously', function (done) {
        var x = 5;
        var foo = async(function () { x = 7; });
        foo()
            .then(function () { return expect(x).to.equal(9); })
            .then(function () { return done(); })
            .catch(done);
        expect(x).to.equal(7);
        x = 9;
    });
    it("preserves the 'this' context of the call", function (done) {
        var foo = { bar: async(function () { return this; }) }, baz = { x: 7 };
        foo.bar()
            .then(function (result) { return expect(result).to.equal(foo); })
            .then(function () { return foo.bar.call(baz); })
            .then(function (result) { return expect(result).to.equal(baz); })
            .then(function () { return done(); })
            .catch(done);
    });
    it('eventually resolves with its definition\'s returned value', function (done) {
        var foo = async(function () { return 'blah'; });
        foo()
            .then(function (result) { return expect(result).to.equal('blah'); })
            .then(function () { return done(); })
            .catch(done);
    });
    it('eventually rejects with its definition\'s thrown value', function (done) {
        var act, exp = new Error('Expected thrown value to match rejection value');
        var foo = async(function () { throw exp; return 'blah'; });
        foo()
            .catch(function (err) { return act = err; })
            .then(function () {
            if (!act)
                done(new Error("Expected function to throw"));
            else if (act !== exp)
                done(exp);
            else
                done();
        });
    });
    it('works with await', function (done) {
        var foo = async(function () { return await(Promise.delay(20).then(function () { return 'blah'; })); });
        foo()
            .then(function (result) { return expect(result).to.equal('blah'); })
            .then(function () { return done(); })
            .catch(done);
    });
    it('triggers the global unhandledException event if a rejection goes unhandled', function (done) {
        var foo = async(function () { throw new Error('nobody handled me'); });
        foo(); // NB: no .catch()
        var didTrigger = false;
        process.on('unhandledRejection', function (err) {
            didTrigger = true;
            done();
        });
        setTimeout(function () {
            if (!didTrigger)
                done(new Error('unhandledRejection event not triggered'));
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
//# sourceMappingURL=async.js.map