/**
 * Created by zzen1ss on 16/6/24.
 */
'use strict';

var renderingX  = require('./renderingX');
var Size = require('./size');
var Pos = require('./position');

var Canvas = require('canvas');
var Font = Canvas.Font;
var Image = Canvas.Image;
var path = require('path');
var fs = require('fs');

function getLastName(path) {
    var array = path.split('/');
    return array[array.length-1];
}
function fontFile(name) {
    // console.log(path.join(__dirname, '/fonts/', name));
    return path.join(__dirname, '/fonts/', name);
}

function getRidofDefault(obj) { return obj && obj.__esModule ? obj.default : obj; }
Size = getRidofDefault(Size);
Pos = getRidofDefault(Pos);
renderingX = getRidofDefault(renderingX);


function renderer(images,customFonts) {
    this.images = images||{};
    this.customFonts = customFonts || {'Songti':new Font('Songti',fontFile('Songti.ttc'))};
}

//customfonts
// renderer.customFonts =  {'Songti':new Font('Songti',fontFile('Songti.ttc'))};

renderer.prototype.getTargetImage = function (url) {
    if (this.images[url]!=='undefined'){
        return this.images[url];
    }else{
        return null;
    }
};

renderer.prototype.addImage = function (imageUrl, image) {
    this.images[imageUrl] = image;
};

renderer.prototype.renderButton = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    if (info && info.buttonText && info.buttonText!==''){
        //has text


        //font style
        var style = {};
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;
        style.color = font['font-color'];
        style.font = (font['font-style']||'')+' '+(font['font-variant']||'')+' '+(font['font-weight']||'')+' '+(font['font-size']||24)+'px'+' '+(font['font-family']||'arial');
        style.textAlign = 'center';
        style.textBaseline = 'middle';
        var beforePressSlice = widget.texList[0].slices[0];
        var afterPressSlice = widget.texList[0].slices[1];
        var slices = [beforePressSlice,afterPressSlice];
        var totalSlices = slices.length;
        slices.map(function (slice,index) {
            var canvas = new Canvas(info.width,info.height);
            var ctx = canvas.getContext('2d');
            var img =slice.imgSrc;
            ctx.clearRect(0,0,info.width,info.height);
            ctx.save();
            //color
            renderingX.renderColor(ctx,new Size(info.width,info.height),new Pos(),slice.color);
            var imgUrl;
            if (img !== ''){
                //draw image
                imgUrl = path.join(srcRootDir,img);
                var targetImageObj = this.getTargetImage(imgUrl);
                if (!targetImageObj){
                    //not added to images
                    var imgObj = new Image();
                    try{
                        imgObj.src = fs.readFileSync(imgUrl);
                        this.addImage(imgUrl,imgObj);
                        targetImageObj = imgObj;
                    }catch (err){
                        targetImageObj = null;
                    }

                }
                console.log(targetImageObj);
                renderingX.renderImage(ctx,new Size(info.width,info.height),new Pos(),targetImageObj,new Pos(),new Size(info.width,info.height));
            }
            //draw text
            renderingX.renderText(ctx,new Size(info.width,info.height),new Pos(),info.buttonText,style,true,null,this.customFonts);
            //generate file
            var imgName = widget.id.split('.').join('');
            var outputFilename = imgName +'-'+ index+'.png';
            // fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
            //     if (err){
            //         console.error(err);
            //         cb && cb(err);
            //     }else{
            //         //write widget
            //         widget.texList[0].slices[index].imgSrc = path.join(imgUrlPrefix||'',outputFilename);
            //         totalSlices-=1;
            //         if (totalSlices<=0){
            //             cb && cb();
            //         }
            //     }
            // }.bind(this));

            //using out stream

            var out = fs.createWriteStream(path.join(dstDir,outputFilename));
            var stream = canvas.pngStream();

            stream.on('data', function(chunk){
                out.write(chunk);
            });
            stream.on('error',function (err) {
                console.error(err);
                cb && cb(err);
            }.bind(this));
            stream.on('end', function(){
                widget.texList[0].slices[index].imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                totalSlices-=1;
                if (totalSlices<=0){
                    cb && cb();
                }
            }.bind(this));


            ctx.restore();

        }.bind(this));
    }else{
        cb&&cb();
    }
};

renderer.prototype.renderSlide = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    if (!!info){
        //trans each slide
        var width = info.width;
        var height = info.height;

        var slideTex = widget.texList[0];
        var totalSlices = slideTex.slices.length;
        for (var i=0;i<slideTex.slices.length;i++){
            var canvas = new Canvas(width,height);
            var ctx = canvas.getContext('2d');
            var curSlice = slideTex.slices[i];
            // console.log('slice: ',i,' canas ',canvas,' slice: ',curSlice,width,height);
            ctx.clearRect(0,0,width,height);
            ctx.save();
            //render color
            renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
            //render image;
            var imgSrc = curSlice.imgSrc;
            if (imgSrc!==''){
                var imgUrl = path.join(srcRootDir,imgSrc);
                var targetImageObj = this.getTargetImage(imgUrl);
                if (!targetImageObj){
                    //not added to images
                    var imgObj = new Image;
                    try{
                        imgObj.src = fs.readFileSync(imgUrl);
                        this.addImage(imgUrl,imgObj);
                        targetImageObj = imgObj;
                    }catch (err){
                        targetImageObj = null;
                    }

                }
                renderingX.renderImage(ctx,new Size(width,height),new Pos(),targetImageObj,new Pos(),new Size(width,height));
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

            // var out = fs.createWriteStream(path.join(dstDir,outputFilename));
            // var stream = canvas.pngStream();
            //
            // stream.on('data', function(chunk){
            //     out.write(chunk);
            // });
            // stream.on('error',function (err) {
            //     console.error(err);
            //     cb && cb(err);
            // }.bind(this));
            // stream.on('end', function(){
            //     //write widget
            //     curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
            //     //if last trigger cb
            //     totalSlices -= 1;
            //     if (totalSlices<=0){
            //         cb && cb();
            //     }
            // }.bind(this));

            ctx.restore();
        }

    }else{
        cb&&cb();
    }

};

renderer.prototype.renderOscilloscope = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
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
            var targetImageObj = this.getTargetImage(imgUrl);
            if (!targetImageObj){
                //not added to images
                var imgObj = new Image;
                try{
                    imgObj.src = fs.readFileSync(imgUrl);
                    this.addImage(imgUrl,imgObj);
                    targetImageObj = imgObj;
                }catch (err){
                    targetImageObj = null;
                }

            }
            renderingX.renderImage(ctx,new Size(width,height),new Pos(),targetImageObj,new Pos(),new Size(width,height));
        }
        renderingX.renderGrid(ctx,new Size(width,height),new Pos(),new Size(info.spacing,info.spacing),new Pos());
        //output
        var imgName = widget.id.split('.').join('');
        var outputFilename = imgName +'-'+ 1+'.png';
        // fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
        //     if (err){
        //         console.error(err);
        //         cb && cb(err);
        //     }else{
        //         //write widget
        //         bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
        //         cb && cb();
        //     }
        // }.bind(this));

        var out = fs.createWriteStream(path.join(dstDir,outputFilename));
        var stream = canvas.pngStream();

        stream.on('data', function(chunk){
            out.write(chunk);
        });
        stream.on('error',function (err) {
            console.error(err);
            cb && cb(err);
        }.bind(this));
        stream.on('end', function(){
            //write widget
            bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
            cb && cb();
        }.bind(this));

    }else{
        cb&&cb();
    }
};


renderer.prototype.renderTextArea = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    var info = widget.info;
    var width = info.width;
    var height = info.height;
    if (info){
        var style = {};
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;
        style.color = font['font-color'];
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
            var targetImageObj = this.getTargetImage(imgUrl);
            if (!targetImageObj){
                //not added to images
                var imgObj = new Image;
                try{
                    imgObj.src = fs.readFileSync(imgUrl);
                    this.addImage(imgUrl,imgObj);
                    targetImageObj = imgObj;
                }catch (err){
                    targetImageObj = null;
                }

            }
            renderingX.renderImage(ctx,new Size(width,height),new Pos(),targetImageObj,new Pos(),new Size(width,height));
        }
        if (info.text&&info.text!==''){
            //draw text
            renderingX.renderText(ctx,new Size(width,height),new Pos(),info.text,style,true,new Pos(0.5*width,0.5*height),this.customFonts);
        }
        //output
        var imgName = widget.id.split('.').join('');
        var outputFilename = imgName +'-'+ 1+'.png';

        var startTime = new Date();

        // fs.writeFile(path.join(dstDir,outputFilename),canvas.toBuffer(),function (err) {
        //     if (err){
        //         console.error(err);
        //         cb && cb(err);
        //     }else{
        //         //write widget
        //         bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
        //         var stopTime = new Date();
        //         console.log('Output normal costs: ',(stopTime-startTime)/1000.0+'s');
        //         cb && cb();
        //     }
        // }.bind(this));


        var out = fs.createWriteStream(path.join(dstDir,outputFilename));
        var stream = canvas.pngStream();

        stream.on('data', function(chunk){
            out.write(chunk);
        });
        stream.on('error',function (err) {
            console.error(err);
            cb && cb(err);
        }.bind(this));
        stream.on('end', function(){
            bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
            var stopTime = new Date();
            console.log('Output stream costs: ',(stopTime-startTime)/1000.0+'s');
            cb && cb();
        }.bind(this));

    }else{
        cb&&cb();
    }

};

renderer.prototype.renderWidget = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
    switch (widget.subType){
        case 'MyButton':
            this.renderButton(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MySlide':
            this.renderSlide(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MyOscilloscope':
            this.renderOscilloscope(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        case 'MyTextArea':
            this.renderTextArea(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
            break;
        default:
            cb&&cb();
    }
};

module.exports = renderer;