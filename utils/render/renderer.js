/**
 * Created by zzen1ss on 16/6/24.
 */
'use strict';

var renderingX  = require('./renderingX');
var Size = require('./size');
var Pos = require('./position');
var renderer = {};
var Canvas = require('canvas');
var path = require('path');
var fs = require('fs');

function getLastName(path) {
    var array = path.split('/');
    return array[array.length-1];
}
function getRidofDefault(obj) { return obj && obj.__esModule ? obj.default : obj; }
Size = getRidofDefault(Size);
Pos = getRidofDefault(Pos);
renderingX = getRidofDefault(renderingX);

renderer.renderButton = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    if (info && info.buttonText && info.buttonText!==''){
        //has text
        var canvas = new Canvas(info.width,info.height);
        var ctx = canvas.getContext('2d');

        //font style
        var style = {};
        var font = {};
        font['font-style'] = widget.info.buttonFontItalic;
        font['font-weight'] = widget.info.buttonFontBold;
        font['font-size'] = widget.info.buttonFontSize;
        font['font-family'] = 'Songti'||widget.info.buttonFontFamily;
        font['font-color'] = widget.info.buttonFontColor;
        style.font = (font['font-style']||'')+' '+(font['font-variant']||'')+' '+(font['font-weight']||'')+' '+(font['font-size']||24)+'px'+' '+(font['font-family']||'arial');
        style.textAlign = 'center';
        style.textBaseline = 'middle';
        var beforePressSlice = widget.texList[0].slices[0];
        var afterPressSlice = widget.texList[0].slices[1];
        var imgs = [beforePressSlice.imgSrc,afterPressSlice.imgSrc];
        var totalSlices = imgs.length;
        imgs.map(function (img,index) {
            ctx.clearRect(0,0,info.width,info.height);
            ctx.save();
            var imgUrl;
            if (img !== ''){
                //draw image
                imgUrl = path.join(srcRootDir,img);
                renderingX.renderImage(ctx,new Size(info.width,info.height),new Pos(),imgUrl,new Pos(),new Size(info.width,info.height));
            }
            //draw text
            renderingX.renderText(ctx,new Size(info.width,info.height),new Pos(),info.buttonText,style);
            //generate file
            var imgName = widget.id.split('.').join('');
            var outputFilename = imgName +'-'+ index+'.png';
            fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
                if (err){
                    console.error(err);
                    cb && cb(err);
                }else{
                    //write widget
                    widget.texList[0].slices[index].imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                    totalSlices-=1;
                    if (totalSlices<=0){
                        cb && cb();
                    }
                }
            }.bind(this));
            ctx.restore();

        }.bind(this));
    }else{
        cb&&cb();
    }
};

renderer.renderSlide = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    if (!!info){
        //trans each slide
        var width = info.width;
        var height = info.height;
        var canvas = new Canvas(width,height);
        var ctx = canvas.getContext('2d');
        var slideTex = widget.texList[0];
        var totalSlices = slideTex.slices.length;
        for (var i=0;i<slideTex.slices.length;i++){
            var curSlice = slideTex.slices[i];
            ctx.clearRect(0,0,width,height);
            ctx.save();
            //render color
            renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
            //render image;
            var imgSrc = curSlice.imgSrc;
            if (imgSrc!==''){
                var imgUrl = path.join(srcRootDir,imgSrc);
                renderingX.renderImage(ctx,new Size(width,height),new Pos(),imgUrl,new Pos(),new Size(width,height));
            }
            //output
            var imgName = widget.id.split('.').join('');
            var outputFilename = imgName +'-'+ i+'.png';
            fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
                if (err){
                    console.error(err);
                    cb && cb(err);
                }else{
                    //write widget
                    curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                    //if last trigger cb
                    totalSlices -= 1;
                    if (totalSlices<=0){
                        cb && cb();
                    }
                }
            }.bind(this));
            ctx.restore();
        }

    }else{
        cb&&cb();
    }

};

renderer.renderOscilloscope = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    var width = info.width;
    var height = info.height;
    if (info){
        //draw bg
        //draw grid
        var canvas = new Canvas(width,height);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,width,height);
        var bgSlice = widget.texList[0].slices[0];
        renderingX.renderColor(ctx,new Size(width,height),new Pos(),bgSlice.color);
        if (bgSlice.imgSrc!==''){
            var imgUrl = path.join(srcRootDir,bgSlice.imgSrc);
            renderingX.renderImage(ctx,new Size(width,height),new Pos(),imgUrl,new Pos(),new Size(width,height));
        }
        renderingX.renderGrid(ctx,new Size(width,height),new Pos(),new Size(info.spacing,info.spacing),new Pos());
        //output
        var imgName = widget.id.split('.').join('');
        var outputFilename = imgName +'-'+ 1+'.png';
        fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
            if (err){
                console.error(err);
                cb && cb(err);
            }else{
                //write widget
                bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                cb && cb();
            }
        }.bind(this));
    }else{
        cb&&cb();
    }
};


renderer.renderTextArea = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    var width = info.width;
    var height = info.height;
    if (info){
        var style = {};
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = 'Songti'||widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;
        style.font = (font['font-style']||'')+' '+(font['font-variant']||'')+' '+(font['font-weight']||'')+' '+(font['font-size']||24)+'px'+' '+(font['font-family']||'arial');
        style.textAlign = 'center';
        style.textBaseline = 'middle';
        var canvas = new Canvas(width,height);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,width,height);
        var bgSlice = widget.texList[0].slices[0];
        renderingX.renderColor(ctx,new Size(width,height),new Pos(),bgSlice.color);
        if (bgSlice.imgSrc!==''){
            var imgUrl = path.join(srcRootDir,bgSlice.imgSrc);
            renderingX.renderImage(ctx,new Size(width,height),new Pos(),imgUrl,new Pos(),new Size(width,height));
        }
        if (info.text&&info.text!==''){
            //draw text
            renderingX.renderText(ctx,new Size(width,height),new Pos(),'文本',style,true,new Pos(0.5*width,0.5*height));
        }
        //output
        var imgName = widget.id.split('.').join('');
        var outputFilename = imgName +'-'+ 1+'.png';
        fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
            if (err){
                console.error(err);
                cb && cb(err);
            }else{
                //write widget
                bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                cb && cb();
            }
        }.bind(this));
    }else{
        cb&&cb();
    }

};

renderer.renderWidget = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    switch (widget.subType){
        case 'MyButton':
            renderer.renderButton(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MySlide':
            renderer.renderSlide(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MyOscilloscope':
            renderer.renderOscilloscope(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MyTextArea':
            renderer.renderTextArea(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        default:
            cb&&cb();
    }
};

module.exports = renderer;