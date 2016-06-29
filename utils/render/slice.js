'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ColorSlice = exports.GridSlice = exports.ImageSlice = exports.TextSlice = exports.Slice = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ChangeCheng on 16/6/20.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _position = require('./position');

var _position2 = _interopRequireDefault(_position);

var _size = require('./size');

var _size2 = _interopRequireDefault(_size);

var _contextUtils = require('./contextUtils');

var _contextUtils2 = _interopRequireDefault(_contextUtils);

var _canvas = require('canvas');

var Canvas = _interopRequireWildcard(_canvas);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Image = Canvas.Image;
var Font = Canvas.Font;
/**
 * base slice
 */

var Slice = exports.Slice = function () {
    function Slice() {
        var size = arguments.length <= 0 || arguments[0] === undefined ? new _size2.default() : arguments[0];
        var originPos = arguments.length <= 1 || arguments[1] === undefined ? new _position2.default() : arguments[1];

        _classCallCheck(this, Slice);

        this.originPos = originPos;
        this.size = size;
    }

    _createClass(Slice, [{
        key: 'draw',
        value: function draw(ctx) {}
    }]);

    return Slice;
}();

/**
 * text
 */


var TextSlice = exports.TextSlice = function (_Slice) {
    _inherits(TextSlice, _Slice);

    function TextSlice(size, originPos, text, style, fillOrStroke, offsetPos) {
        _classCallCheck(this, TextSlice);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextSlice).call(this, size, originPos));

        _this.text = text;
        _this.style = style || {};
        _this.offsetPos = offsetPos || new _position2.default(size.w / 2.0, size.h / 2.0);
        _this.fillOrStroke = fillOrStroke || true;

        return _this;
    }

    _createClass(TextSlice, [{
        key: 'fontFile',
        value: function fontFile(name) {
            // console.log(path.join(__dirname, '/fonts/', name));
            return _path2.default.join(__dirname, '/fonts/', name);
        }
    }, {
        key: 'draw',
        value: function draw(ctx, cb) {
            // fontStyleItems.length;
            // const fontStyleItems = ['font-style','font-variant','font-weight','font-size','font-family'];
            var fonts = { 'Songti': new Font('Songti', this.fontFile('Songti.ttc')) };
            ctx.save();
            ctx.translate(this.originPos.x, this.originPos.y);
            //clip
            _contextUtils2.default.clipRect(ctx, new _position2.default(), this.size);
            ctx.addFont(fonts.Songti);
            ctx.font = this.style.font;
            // console.log(this.style.font);
            ctx.textAlign = this.style.textAlign;
            ctx.textBaseline = this.style.textBaseline;
            // console.log(this.offsetPos);
            if (this.fillOrStroke) {
                ctx.fillText(this.text, this.offsetPos.x, this.offsetPos.y);
            } else {
                ctx.strokeText(this.text, this.offsetPos.x, this.offsetPos.y);
            }

            ctx.restore();
            cb && cb();
        }
    }]);

    return TextSlice;
}(Slice);

/**
 * image
 */


var ImageSlice = exports.ImageSlice = function (_Slice2) {
    _inherits(ImageSlice, _Slice2);

    function ImageSlice(originSize, originPos, imgSrc, dstPos, dstSize, srcPos, srcSize) {
        _classCallCheck(this, ImageSlice);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageSlice).call(this, originSize, originPos));

        _this2.imgSrc = imgSrc;
        if (!dstPos) {
            _this2.type = 1;
        } else if (dstPos && dstSize) {
            _this2.type = 2;
            _this2.dstPos = dstPos;
            _this2.dstSize = dstSize;
        } else if (srcPos && srcSize) {
            _this2.type = 3;
            _this2.dstPos = dstPos;
            _this2.dstSize = dstSize;
            _this2.srcPos = srcPos;
            _this2.srcSize = srcSize;
        } else {
            _this2.type = 1;
        }
        return _this2;
    }

    _createClass(ImageSlice, [{
        key: 'draw',
        value: function draw(ctx, cb) {
            ctx.save();
            ctx.translate(this.originPos.x, this.originPos.y);
            _contextUtils2.default.clipRect(ctx, new _position2.default(), this.size);
            var img = new Image();
            // img.onload = function () {
            //     switch (this.type){
            //         case 1:
            //             // ctx.drawImage(img,this.originPos.x,this.originPos.y);
            //             ctx.drawImage(img,0,0,100,100);
            //             break;
            //         case 2:
            //             ctx.drawImage(img, this.originPos.x,this.originPos.y,this.dstSize.w,this.dstSize.h);
            //             break;
            //         case 3:
            //             ctx.drawImage(img, this.srcPos.x,this.srcPos.y,this.srcSize.w,this.srcSize.h,this.dstPos.x,this.dstPos.y,this.dstSize.w,this.dstSize.h);
            //             break;
            //     }
            // }.bind(this);
            // img.src = this.imgSrc;
            var stats = _fs2.default.statSync(this.imgSrc);
            console.log(this.imgSrc);
            if (stats && stats.isFile()) {
                try {

                    img.src = _fs2.default.readFileSync(this.imgSrc);
                    switch (this.type) {
                        case 1:
                            ctx.drawImage(img, 0, 0);
                            // ctx.drawImage(img,0,0,100,100);
                            break;
                        case 2:
                            ctx.drawImage(img, 0, 0, this.dstSize.w, this.dstSize.h);
                            break;
                        case 3:
                            ctx.drawImage(img, this.srcPos.x, this.srcPos.y, this.srcSize.w, this.srcSize.h, this.dstPos.x, this.dstPos.y, this.dstSize.w, this.dstSize.h);
                            break;
                    }
                    ctx.restore();
                    cb && cb();
                } catch (e) {
                    ctx.restore();
                    console.error(e);
                    cb && cb(e);
                }
            } else {
                cb && cb();
            }
        }
    }]);

    return ImageSlice;
}(Slice);

/**
 * grid
 */


var GridSlice = exports.GridSlice = function (_Slice3) {
    _inherits(GridSlice, _Slice3);

    function GridSlice(originSize, originPos, gridSize) {
        var gridOffset = arguments.length <= 3 || arguments[3] === undefined ? new _position2.default() : arguments[3];
        var gridLineWidth = arguments.length <= 4 || arguments[4] === undefined ? '1px' : arguments[4];

        _classCallCheck(this, GridSlice);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(GridSlice).call(this, originSize, originPos));

        _this3.gridSize = gridSize;
        _this3.gridOffset = gridOffset;
        _this3.gridLineWidth = gridLineWidth;
        return _this3;
    }

    _createClass(GridSlice, [{
        key: 'draw',
        value: function draw(ctx, cb) {
            ctx.save();
            ctx.translate(this.originPos.x, this.originPos.y);
            _contextUtils2.default.clipRect(ctx, new _position2.default(), this.size);
            //drawing
            var realOffset = new _position2.default(this.gridOffset.x % this.gridSize.w, this.gridOffset.y % this.gridSize.h);
            ctx.lineWidth = this.gridLineWidth;
            //draw vertical lines
            ctx.beginPath();
            for (var i = 0; i < this.size.w / this.gridSize.w; i++) {
                //x = vert y=0,size.h
                var gridX = realOffset.x + i * this.gridSize.w;
                ctx.moveTo(gridX, 0);
                ctx.lineTo(gridX, this.size.h);
            }
            //draw horizontal lines
            for (var _i = 0; _i < this.size.h / this.gridSize.h; _i++) {
                //y = vert x=0,size.w
                var gridY = realOffset.y + _i * this.gridSize.h;
                ctx.moveTo(0, gridY);
                ctx.lineTo(this.size.w, gridY);
            }
            ctx.stroke();
            ctx.restore();
            cb && cb();
        }
    }]);

    return GridSlice;
}(Slice);

/**
 * color
 */


var ColorSlice = exports.ColorSlice = function (_Slice4) {
    _inherits(ColorSlice, _Slice4);

    function ColorSlice(originSize, originPos, color) {
        _classCallCheck(this, ColorSlice);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorSlice).call(this, originSize, originPos));

        _this4.color = color;
        return _this4;
    }

    _createClass(ColorSlice, [{
        key: 'draw',
        value: function draw(ctx, cb) {
            ctx.save();
            ctx.translate(this.originPos.x, this.originPos.y);
            _contextUtils2.default.clipRect(ctx, new _position2.default(), this.size);
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.size.w, this.size.h);
            ctx.restore();
            cb && cb();
        }
    }]);

    return ColorSlice;
}(Slice);