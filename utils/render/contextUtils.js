"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by zzen1ss on 16/6/21.
 */

var contextUtils = {};
contextUtils.clipRect = function (ctx, originPos, originSize) {
    ctx.beginPath();
    ctx.moveTo(originPos.x, originPos.y);
    ctx.lineTo(originPos.x + originSize.w, originPos.y);
    ctx.lineTo(originPos.x + originSize.w, originPos.y + originSize.h);
    ctx.lineTo(originPos.x, originPos.y + originSize.h);
    ctx.closePath();
    ctx.clip();
};

exports.default = contextUtils;