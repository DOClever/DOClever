var chai = require('chai');
var async = require('../src/async/index');
var await = require('../src/await/index');
var expect = chai.expect;
describe('Fixed issues', function () {
    it('#44', async.cps(function () {
        var test = async(function (a, b, c, d, e, f, g, h, i) {
            return [a, b, c, d, e, f, g, h, i];
        });
        var expected = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        var actual = await(test.apply(null, expected));
        expect(actual).to.deep.equal(expected);
    }));
});
//# sourceMappingURL=repros.js.map