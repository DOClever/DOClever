'use strict';

var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var expect = require('expect.js');
var request = require('request');
var express = require('express');
var constants = require('constants');
var requireHttps = require('../index');

describe('require-https', function () {

    var app;

    before(function () {
        app = express();
        app.use(requireHttps());
        app.get('/', function (req, res) {
            res.json({ hello: 'world' });
        });
        app.use(function (err, req, res, next) { res.sendStatus(err.status || 500); });
    });

    it('should complain when https is not used', function (done) {
        var server = http.createServer(app);
        server.listen(1234, '127.0.0.1', function () {
            request('http://127.0.0.1:1234/', { json: true}, function (error, response, body) {
                expect(response.statusCode).to.be(403);
                server.close(done);
            });
        });
    });

    it('should allow requests to pass when https is used', function (done) {
        var server = https.createServer({
            secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
            secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
            key: fs.readFileSync(path.join(__dirname, 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
        }, app);

        server.listen(1234, '127.0.0.1', function () {
            request('https://127.0.0.1:1234/', { strictSSL: false, json: true }, function (error, response, body) {
                expect(response.statusCode).to.be(200);
                expect(body.hello).to.be('world');
                server.close(done);
            });
        });
    });

});

