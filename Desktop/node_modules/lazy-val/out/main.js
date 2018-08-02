"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Lazy {
    constructor(creator) {
        this.creator = creator;
    }
    get hasValue() {
        return this.creator == null;
    }
    get value() {
        if (this.creator == null) {
            return this._value;
        }
        this.value = this.creator();
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.creator = null;
    }
}
exports.Lazy = Lazy; //# sourceMappingURL=main.js.map