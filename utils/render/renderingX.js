'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _size = require('./size');

var _size2 = _interopRequireDefault(_size);

var _position = require('./position');

var _position2 = _interopRequireDefault(_position);

var _slice = require('./slice');

var SliceGroup = _interopRequireWildcard(_slice);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderingX = {};

// renderingX.renderImage = function (ctx,originSize,originPos,imgSrc,dstPos,dstSize,srcPos,srcSize,cb) {
//     let curImageSlice = new SliceGroup.ImageSlice(originSize,originPos,imgSrc,dstPos,dstSize,srcPos,srcSize);
//     curImageSlice.draw(ctx,cb);
// };

/**
 * Created by zzen1ss on 16/6/24.
 */
renderingX.renderImage = function (ctx, originSize, originPos, imgObj, dstPos, dstSize, srcPos, srcSize, cb) {
    var curImageSlice = new SliceGroup.ImageSlice(originSize, originPos, imgObj, dstPos, dstSize, srcPos, srcSize);
    curImageSlice.draw(ctx, cb);
};

renderingX.renderText = function (ctx, originSize, originPos, text, style, fillOrStroke, offsetPos, customFonts, cb) {
    var curTextSlice = new SliceGroup.TextSlice(originSize, originPos, text, style, fillOrStroke, offsetPos);
    curTextSlice.draw(ctx, customFonts, cb);
};

renderingX.renderColor = function (ctx, originSize, originPos, color, cb) {
    var curColorSlice = new SliceGroup.ColorSlice(originSize, originPos, color);
    curColorSlice.draw(ctx, cb);
};

renderingX.renderGrid = function (ctx, originSize, originPos, gridSize, gridOffset, gridLineWidth, cb) {
    var curGridSlice = new SliceGroup.GridSlice(originSize, originPos, gridSize, gridOffset, gridLineWidth);
    curGridSlice.draw(ctx, cb);
};

exports.default = renderingX;