"use strict";

var log = require('ssi-logger');

module.exports = function requireHttps(status, message) {
    return function requireHttpsMiddleware(req, res, next) {
        if (!req.secure) {
            var err = new Error(message || 'Insecure Connection. Use HTTPS instead.');
            err.status = status || 403;
            log('ERR', 'require-https: client is using an insecure connection.', err, { client_ip: req.ip });
            next(err);
            return;
        }
        log('DEBUG', 'require-https: client is using a secure connection.', { client_ip: req.ip });
        next();
    };
};
