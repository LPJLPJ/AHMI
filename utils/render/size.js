"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by ChangeCheng on 16/6/20.
 */

var Size = function Size() {
    var w = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var h = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Size);

    this.w = w;
    this.h = h;
};

exports.default = Size;