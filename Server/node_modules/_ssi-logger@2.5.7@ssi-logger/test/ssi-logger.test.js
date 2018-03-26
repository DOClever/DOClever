
"use strict";

var expect = require('expect.js');
var log = require('../');

describe('ssi-logger', function() {
    var level = 'INFO';
    var message = 'Test Message';
    var complex = {
        count: 5,
        price: 12.34,
        greeting: "Hello, World",
        shortGreeting: 'Hi'
    };
    var arr = [ { name: 'Tom' }, { name: 'Phil' } ];
    var arr_logformat = '0.name=Tom 1.name=Phil';

    var ip_message = 'IP Whitelist Reject';
    var ip_address = '8.8.8.8';
    var ip_expect = ip_message + ' ip_address=' + ip_address;

    describe('logging', function () {
    
        it('should emit log events', function (done) {

            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message);
                done();
            });

            log(level, message);
        });
    });

    describe('convience', function () {

        it('should provide log.info()', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be('INFO');
                expect(obj.message).to.be(message);
                done();
            });

            log.info(message);
        });

        it('should provide log.debug()', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be('DEBUG');
                expect(obj.message).to.be(message);
                done();
            });

            log.debug(message);
        });

        it('should provide log.warn()', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be('WARN');
                expect(obj.message).to.be(message);
                done();
            });

            log.warn(message);
        });

        it('should provide log.error()', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be('ERROR');
                expect(obj.message).to.be(message);
                done();
            });

            log.error(message);
        });

    });

    describe('defaults', function () {

        it('should emit log events with defaults', function (done) {

            var mylog = log.defaults({ request_id: '7423927D-6F4E-43FE-846E-C474EA3488A3' }, 'foobar');

            process.on('log', function testfx(obj) {
                process.removeListener('log', testfx);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message + ' request_id=7423927D-6F4E-43FE-846E-C474EA3488A3 foobar');
                done();
            });

            mylog(level, message);
        });

        it('should emit log events with defaults using the .level() interface', function (done) {

            var mylog = log.defaults({ request_id: '7423927D-6F4E-43FE-846E-C474EA3488A3' }, 'foobar');

            process.on('log', function testfx(obj) {
                process.removeListener('log', testfx);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message + ' request_id=7423927D-6F4E-43FE-846E-C474EA3488A3 foobar');
                done();
            });

            mylog[level.toLowerCase()](message);
        });

        it('should work with an object reference', function (done) {

            var meta = {};
            var mylog = log.defaults(meta);

            process.on('log', function testfx(obj) {
                process.removeListener('log', testfx);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message + ' foo=bar');
                done();
            });

            meta.foo = 'bar';
            mylog(level, message);
        });

        it('should support multiple levels of nesting', function (done) {

            var level0 = log.defaults({ request_id: '7423927D-6F4E-43FE-846E-C474EA3488A3' });
            var level1 = level0.defaults('foobar');
            var level2 = level1.defaults({ cheese: 'cake' });

            expect(level2).to.have.property('consoleTransport');
            expect(level2.consoleTransport).to.be.a('function');

            process.on('log', function testfx(obj) {
                process.removeListener('log', testfx);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message + ' request_id=7423927D-6F4E-43FE-846E-C474EA3488A3 foobar cheese=cake');
                done();
            });

            level2(level, message);
        });

    });

    describe('formatting', function () {

        it('should concatinate multiple message arguments', function (done) {

            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(message);
                done();
            });

            log(level, 'Test', 'Message');
        });

        it('should format complex objects', function (done) {
 
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('count=5 price=12.34 greeting="Hello, World" shortGreeting=Hi');
                done();
            });

            log(level, complex);
        });

        it('should format arrays', function (done) {
 
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(arr_logformat);
                done();
            });

            log(level, arr);
        });

        it('should support varargs like console.log([data], [...])', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(ip_expect);
                done();
            });

            log(level, ip_message, { ip_address: ip_address });
        });

        it('should support printf() style formatting of strings like console.log([data], [...])', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(ip_expect);
                done();
            });

            log(level, ip_message + ' ip_address=%s', ip_address);
        });

        it('should support printf() style formatting of numbers like console.log([data], [...])', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be(ip_expect);
                done();
            });

            log(level, ip_message + ' ip_address=%d.%d.%d.%d', 8, 8, 8, 8);
        });

    });
        
    describe('censorship', function () {

        it('should support censoring sensitive fields in an object', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('cc=[redacted] name=[redacted] rank=7');
                log.censor([]);
                done();
            });

            log.censor([ 'cc', 'name' ]);

            log(level, {
                cc: '1234123412341234',
                name: 'apple sauce',
                rank: 7
            });
        });

        it('should support censoring strings with whitespace', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('Authorization=[redacted] Authorization=[redacted] Authorization=[redacted] headers.Authorization=[redacted]');
                log.censor([]);
                done();
            });

            log.censor([ 'Authorization' ]);

            log(level, 'Authorization="passcode 123456" Authorization="%s"', 'passcode 123456', {
		Authorization: 'passcode 123456'
            }, { headers: { Authorization: 'passcode 123456' } });
        });

        it('should support censoring sensitive fields in a formatted string', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('cc=[redacted] name=[redacted] rank=7');
                log.censor([]);
                done();
            });

            log.censor([ 'cc', 'name' ]);

            log(level, 'cc=%s name="%s" rank=%d', '1234123412341234', 'apple sauce', 7);
        });

        it('should support censoring sensitive fields in a plain string', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('cc=[redacted] name=[redacted] rank=7');
                log.censor([]);
                done();
            });

            log.censor([ 'cc', 'name' ]);

            log(level, 'cc=1234123412341234 name="apple sauce" rank=7');
        });

        it('should support censoring sensitive fields with regular expressions for field names', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('cc=[redacted] name=[redacted] rank=7');
                log.censor([]);
                done();
            });

            log.censor([ /c{2}/, /n..e/ ]);

            log(level, 'cc=1234123412341234 name="apple sauce" rank=7');
        });

        it('should support censoring sensitive fields based on key names (e.g. "ip") and deep key names (e.g. "client.agent").', function (done) {
            process.on('log', function testf(obj) {
                process.removeListener('log', testf);
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('date=[redacted] client.agent=[redacted] client.ip=[redacted] server.ip=[redacted]');
                log.censor([]);
                done();
            });

            log.censor([ "ip", /date/, "client.agent" ]);

            log(level, {"date":"2015-11-19","client":{"agent":"firefox","ip":"10.1.32.1"},"server":{"ip":"192.168.2.222"}});
        });

        it('should work with the example from the README', function (done) {

            var count = 3;

            process.on('log', function testf(obj) {
                expect(obj.level).to.be(level);
                expect(obj.message).to.be('first_name=John last_name=Doe card_number=[redacted] password=[redacted]');
                if (--count === 0) {
                    process.removeListener('log', testf);
                    log.censor([]);
                    done();
                }
            });

            log.censor([ 'card_number', /pass(word)?/ ]);

            var first_name_var = 'John';
            var last_name_var = 'Doe';
            var card_number_var = '1234123412341234';
            var password_var = 'pizza';

            log('INFO', 'first_name=John last_name=Doe card_number=1234123412341234 password=pizza');
            log('INFO', 'first_name=%s last_name=%s card_number=%s password=%s', first_name_var, last_name_var, card_number_var, password_var);
            log('INFO', { first_name: 'John', last_name: 'Doe', card_number: '1234123412341234', password: 'pizza' });

        });
    });
});
