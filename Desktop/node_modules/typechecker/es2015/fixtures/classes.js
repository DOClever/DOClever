'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var A = function A() {
	_classCallCheck(this, A);
};

var a = function a() {
	_classCallCheck(this, a);
};

var b = function b() {
	_classCallCheck(this, b);
};

var C = function (_A) {
	_inherits(C, _A);

	function C() {
		_classCallCheck(this, C);

		return _possibleConstructorReturn(this, (C.__proto__ || Object.getPrototypeOf(C)).apply(this, arguments));
	}

	return C;
}(A);

var D = function () {
	function D() {
		_classCallCheck(this, D);
	}

	_createClass(D, [{
		key: 'z',
		value: function z() {
			return this;
		}
	}]);

	return D;
}();

var E = function (_D) {
	_inherits(E, _D);

	function E() {
		_classCallCheck(this, E);

		return _possibleConstructorReturn(this, (E.__proto__ || Object.getPrototypeOf(E)).apply(this, arguments));
	}

	return E;
}(D);

var F = function (_E) {
	_inherits(F, _E);

	/* :: greeting:?string; */
	function F() {
		_classCallCheck(this, F);

		var _this3 = _possibleConstructorReturn(this, (F.__proto__ || Object.getPrototypeOf(F)).call(this));

		_this3.greeting = 'hello';
		return _this3;
	}

	return F;
}(E);

module.exports = { A: A, a: a, b: b, C: C, D: D, E: E, F: F };