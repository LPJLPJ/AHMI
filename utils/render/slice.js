/**
 * Created by ChangeCheng on 16/6/20.
 */

import Pos from './position';
import Size from './size';
import contextUtils from './contextUtils';
import * as Canvas from 'canvas';
let Image = Canvas.Image;
/**
 * base slice
 */
export class Slice {
    constructor(size=new Size(), originPos=new Pos()){
        this.originPos = originPos;
        this.size = size;
    }

    draw(ctx){

    }
}

/**
 * text
 */
export class TextSlice extends Slice{
    constructor(size, originPos, text,style,fillOrStroke,offsetPos){
        super(size,originPos);
        this.text = text;
        this.style = style||{};
        this.offsetPos = offsetPos||new Pos(size.w/2.0,size.h/2.0);
        this.fillOrStroke = fillOrStroke||true;
    }
    draw(ctx,cb){
        // fontStyleItems.length;
        // const fontStyleItems = ['font-style','font-variant','font-weight','font-size','font-family'];
        ctx.save();
        ctx.translate(this.originPos.x,this.originPos.y);
        //clip
        contextUtils.clipRect(ctx,new Pos(),this.size);
        ctx.font = this.style.font;
        ctx.textAlign = this.style.textAlign;
        ctx.textBaseline = this.style.textBaseline;
        // console.log(this.offsetPos);
        if (this.fillOrStroke){
            ctx.fillText(this.text,this.offsetPos.x,this.offsetPos.y);
        }else{
            ctx.strokeText(this.text,this.offsetPos.x,this.offsetPos.y);
        }

        ctx.restore();
        cb && cb();
    }
}

/**
 * image
 */
export class ImageSlice extends Slice{
    constructor(originSize,originPos,imgSrc,dstPos,dstSize,srcPos,srcSize){
        super(originSize,originPos);
        this.imgSrc = imgSrc;
        if (!dstPos){
            this.type = 1;
        }else if (dstPos&&dstSize){
            this.type = 2;
            this.dstPos = dstPos;
            this.dstSize = dstSize;
        }else if (srcPos&&srcSize ){
            this.type = 3;
            this.dstPos = dstPos;
            this.dstSize = dstSize;
            this.srcPos = srcPos;
            this.srcSize = srcSize;
        }else{
            this.type = 1;
        }
    }

    draw(ctx,cb){
        ctx.save();
        ctx.translate(this.originPos.x,this.originPos.y);
        contextUtils.clipRect(ctx,new Pos(),this.size);
        let img = new Image();
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
        img.src = this.imgSrc;

        try {
            switch (this.type){
                case 1:
                    ctx.drawImage(img,0,0);
                    // ctx.drawImage(img,0,0,100,100);
                    break;
                case 2:
                    ctx.drawImage(img, 0,0,this.dstSize.w,this.dstSize.h);
                    break;
                case 3:
                    ctx.drawImage(img, this.srcPos.x,this.srcPos.y,this.srcSize.w,this.srcSize.h,this.dstPos.x,this.dstPos.y,this.dstSize.w,this.dstSize.h);
                    break;
            }
            ctx.restore();
            cb && cb();
        }catch (e){
            ctx.restore();
            console.error(e);
            cb && cb(e);
        }


    }
}

/**
 * grid
 */
export class GridSlice extends Slice{
    constructor(originSize,originPos,gridSize,gridOffset=new Pos(),gridLineWidth='1px'){
        super(originSize,originPos);
        this.gridSize = gridSize;
        this.gridOffset = gridOffset;
        this.gridLineWidth = gridLineWidth;
    }

    draw(ctx,cb){
        ctx.save();
        ctx.translate(this.originPos.x,this.originPos.y);
        contextUtils.clipRect(ctx,new Pos(),this.size);
        //drawing
        let realOffset = new Pos(this.gridOffset.x % this.gridSize.w,this.gridOffset.y % this.gridSize.h);
        ctx.lineWidth = this.gridLineWidth;
        //draw vertical lines
        ctx.beginPath();
        for (let i = 0;i < (this.size.w / this.gridSize.w);i++){
            //x = vert y=0,size.h
            let gridX = realOffset.x+i*this.gridSize.w;
            ctx.moveTo(gridX,0);
            ctx.lineTo(gridX,this.size.h);

        }
        //draw horizontal lines
        for (let i = 0;i < (this.size.h / this.gridSize.h);i++){
            //y = vert x=0,size.w
            let gridY = realOffset.y+i*this.gridSize.h;
            ctx.moveTo(0,gridY);
            ctx.lineTo(this.size.w,gridY);
        }
        ctx.stroke();
        ctx.restore();
        cb && cb();
    }
}

/**
 * color
 */
export class ColorSlice extends Slice{
    constructor(originSize,originPos,color){
        super(originSize,originPos);
        this.color = color;
    }

    draw(ctx,cb){
        ctx.save();
        ctx.translate(this.originPos.x,this.originPos.y);
        contextUtils.clipRect(ctx,new Pos(),this.size);
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,this.size.w,this.size.h);
        ctx.restore();
        cb && cb();
    }
}