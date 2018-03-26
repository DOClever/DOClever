"use strict";

var _ = require('lodash');
var moment = require('moment');

// Error objects have a lot of non-enumerable properties
// Here's we include them (plus whatever properties the user set)
function getKeys(obj) {
    var keys = _.keys(obj);

    if (_.isError(obj)) {
        var errKeys = _.filter([
            'message',              // standard keys
            'name',

            'description',          // Microsoft keys
            'number',

            'fileName',             // Mozilla keys
            'lineNumber',
            'columnNumber',

        ], function (key) {
            return _.has(obj, key);
        });

        keys = _.uniq(keys.concat(errKeys));
    }

    return keys;
}

function toString(str) {
    try {
        return _.has(str, 'toString') ? str.toString() : ''+str;
    } catch (err) {
        // some properties of mysql connection pools are objects that
        // cannot be converted to a primitive type using ''+str
        // mimic util.inspect() by simply returning an empty object string
        return '{}';
    }
}

function applyQuotes(str) {
    return str.indexOf(' ') !== -1 ? '"' + str + '"' : str;
}

module.exports = function logformat(obj) {
    if (_.isString(obj)) {
        return obj;
    } else if (_.isNumber(obj) || _.isBoolean(obj) || _.isRegExp(obj)) {
        return toString(obj);
    } else if (_.isDate(obj)) {
        return moment(obj).format();
    } else if (_.isObject(obj)) {
        var r = [];

        var keys = getKeys(obj);
        if (_.isError(obj)) {
            r.push('ERROR');
            r.push(toString(obj.message));
            keys = _.difference(keys, ['stack', 'message']);
        }

        _.each(keys, function (key) {
            var val = obj[key];
            if (_.isNull(val) || _.isUndefined(val)) {
                r.push(key + '=' + val);
            } else if (_.isDate(val)) {
                r.push(key + '=' + moment(val).format());
            } else if (_.isObject(val) && !_.isRegExp(val)) {
                _.each(getKeys(val), function (innerKey) {
                    var innerVal = val[innerKey];
                    if (_.isNull(innerVal) || _.isUndefined(innerVal)) {
                        r.push(key + '.' + innerKey + '=' + innerVal);
                    } else if (!_.isFunction(innerVal)) {
                        r.push(key + '.' + innerKey + '=' + applyQuotes(toString(innerVal)));
                    }
                });
            } else if (!_.isFunction(val)) {
                r.push(key + '=' + applyQuotes(toString(val)));
            }
        });
        return r.join(' ');
    } else {
        return '';
    }
};
