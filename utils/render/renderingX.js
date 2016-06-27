/**
 * Created by zzen1ss on 16/6/24.
 */
import Size from './size';
import Pos from './position';
import * as SliceGroup from './slice';

let renderingX = {};

renderingX.renderImage = function (ctx,originSize,originPos,imgSrc,dstPos,dstSize,srcPos,srcSize,cb) {
    let curImageSlice = new SliceGroup.ImageSlice(originSize,originPos,imgSrc,dstPos,dstSize,srcPos,srcSize);
    curImageSlice.draw(ctx,cb);
};

renderingX.renderText = function (ctx,originSize, originPos, text,style,fillOrStroke,offsetPos,cb) {
    let curTextSlice = new SliceGroup.TextSlice(originSize, originPos, text,style,fillOrStroke,offsetPos);
    curTextSlice.draw(ctx,cb);
};

renderingX.renderColor = function (ctx,originSize,originPos,color,cb) {
    let curColorSlice = new SliceGroup.ColorSlice(originSize,originPos,color);
    curColorSlice.draw(ctx,cb);
};


renderingX.renderGrid = function (ctx,originSize,originPos,gridSize,gridOffset,gridLineWidth,cb) {
    let curGridSlice = new SliceGroup.GridSlice(originSize,originPos,gridSize,gridOffset,gridLineWidth);
    curGridSlice.draw(ctx,cb);
};

export default renderingX;