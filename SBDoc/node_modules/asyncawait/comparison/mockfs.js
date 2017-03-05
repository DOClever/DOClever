var mock = require('mock-fs');
var Promise = require('bluebird');


var config = {
    'mocks/m1': {
        dir11: {
            file111: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            file112: 'bbbbbbbbbbbbbb',
            file113: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
            file114: 'dddddddddddddddddddddddddddddddddddddddd',
            file115: 'eeeeeee',
            file116: 'ffffffffffffffffff',
            file117: 'gggggggggggggggggggggggggggggggggggggggggggggggggggg',
            file118: 'hhhhhhhhhhhhhhhhhhhhhhhhhhh',
            file119: 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
        },
        dir12: {},
        file11: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        file12: 'b',
        file13: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    },
    'mocks/m2': {
        file21: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    },
    'mocks/m3': {
    }
};


var fs = Promise.promisifyAll(mock.fs(config));
module.exports = fs;
