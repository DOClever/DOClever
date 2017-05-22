'use strict';
var minimatch = require('minimatch');
var arrayUnion = require('array-union');
var arrayDiffer = require('array-differ');
var arrify = require('arrify');

module.exports = function (list, patterns, options) {
	list = arrify(list);
	patterns = arrify(patterns);

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	options = options || {};

	return patterns.reduce(function (ret, pattern) {
		if (typeof pattern === 'function') {

			return arrayUnion(ret, list.filter(pattern));

		} else if (pattern instanceof RegExp) {

			return arrayUnion(ret, list.filter(function(item) {
				return pattern.test(item);
			}));

		} else {
			var process = arrayUnion;

			if (pattern[0] === '!') {
				pattern = pattern.slice(1);
				process = arrayDiffer;
			}

			return process(ret, minimatch.match(list, pattern, options));
		}
	}, []);
};
