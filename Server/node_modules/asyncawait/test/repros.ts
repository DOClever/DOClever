import chai = require('chai');
import Promise = require('bluebird');
import async = require('../src/async/index');
import await = require('../src/await/index');
var expect = chai.expect;


describe('Fixed issues', () => {

    it('#44', async.cps (() => {

        var test = async (function(a, b, c, d, e, f, g, h, i) {
            return [a, b, c, d, e, f, g, h, i];
        });

        let expected = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        let actual = await (test.apply(null, expected));
        expect(actual).to.deep.equal(expected);
    }));
});
