/**
 * Created by zzen1ss on 16/7/11.
 */
ideServices.service('RenderSerive',['ResourceService',function (ResourceService) {

    var path = require('path');
    var fs = require('fs');

    function Canvas(width, height) {
        this.width = width;
        this.height = height;
        var canavasObj = document.createElement('canvas');
        canavasObj.width = this.width;
        canavasObj.height = this.height;
        canavasObj.hidden = true;
        this.canvasObj = canavasObj;
    }

    Canvas.prototype.getContext = function (type) {
        if (type === '2d'){
            return this.canvasObj.getContext('2d');
        }
    };

    Canvas.prototype.pngStream =function () {
        var data = this.canvasObj.toDataURL();
        console.log('data base64',data);
        var dataBuffer = new Buffer(data.split(',')[1],'base64');
        return dataBuffer;

    };

    Canvas.prototype.toBuffer =function () {
        var data = this.canvasObj.toDataURL();
        var dataBuffer = new Buffer(data.split(',')[1],'base64');
        return dataBuffer;

    };

    Canvas.prototype.output = function (outpath, cb ) {
        var stream = this.pngStream();

        try {
            fs.writeFileSync(outpath,stream);
            console.log(outpath,global.__dirname);
            cb && cb();
        }catch (e) {
            cb && cb(e);
        }

    }

    function checkFileType(fileExt) {
        switch (fileExt){
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            default:
                return 'image/png';
        }
    }
    function loadImageSync(imgUrl) {
        var ext = path.extname(imgUrl);
        var type = checkFileType(ext);
        var prefix = 'data:'+type+';base64,';

        return prefix+fs.readFileSync(imgUrl).toString('base64');
    }

    var Size = renderingX.Size;
    var Pos = renderingX.Pos;



    function getLastName(path) {
        var array = path.split('/');
        return array[array.length-1];
    }


    function renderer(images,customFonts) {
        this.images = images||{};
        this.customFonts = customFonts || {};
    }

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
                var _canvas = new Canvas(info.width,info.height);
                var ctx = _canvas.getContext('2d');
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
                            imgObj.src = loadImageSync(imgUrl);
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


                var outpath = path.join(dstDir,outputFilename);
                console.log(outpath);
                _canvas.output(outpath,function (err) {
                    if (err){
                        totalSlices-=1;
                        if (totalSlices<=0){
                            cb && cb(err);
                        }
                    }else{
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
                            imgObj.src = loadImageSync(imgUrl);
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
                        imgObj.src = loadImageSync(imgUrl);
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


            var outpath = path.join(dstDir,outputFilename);
            canvas.output(outpath,function (err) {
                if (err){
                    cb && cb(err);
                }else{
                    bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                    cb && cb();
                }
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
                        imgObj.src = loadImageSync(imgUrl);
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

            var outpath = path.join(dstDir,outputFilename);

            canvas.output(outpath,function (err) {
                if (err){
                    cb && cb(err);
                }else{
                    bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                    var stopTime = new Date();
                    console.log('Output stream costs: ',(stopTime-startTime)/1000.0+'s');
                    cb && cb();
                }
            })

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
            //     bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
            //     var stopTime = new Date();
            //     console.log('Output stream costs: ',(stopTime-startTime)/1000.0+'s');
            //     cb && cb();
            // }.bind(this));

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


    this.renderTest=function (projectData) {
        var fakeButton = {
            "id": "0.0.0.5",
            "info": {
                "width": 100,
                "height": 75,
                "left": 0,
                "top": 0,
                "originX": "center",
                "originY": "center",
                "arrange": true,
                "buttonText": "button",
                "buttonFontFamily": "Arial",
                "buttonFontSize": 20,
                "buttonFontColor": "rgba(0,0,0,1)",
                "buttonFontBold": "100",
                "buttonFontItalic": "",
                "boldBtnToggle": false,
                "italicBtnToggle": false
            },
            "normalImg": "",
            "pressImg": "",
            "name": "NewButton",
            "type": "widget",
            "expand": true,
            "url": "",
            "buttonModeId": "0",
            "zIndex": 0,
            "texList": [
                {
                    "name": "按钮纹理",
                    "currentSliceIdx": 0,
                    "slices": [
                        {
                            "color": "rgba(158,97,215,1.0)",
                            "imgSrc": "7373737373737373737373731468200611444.jpg",
                            "name": "按下前"
                        },
                        {
                            "color": "rgba(225,136,192,1.0)",
                            "imgSrc": "",
                            "name": "按下后"
                        }
                    ]
                }
            ],
            "selected": false,
            "current": false,
            "actions": [
                {
                    "title": "action0",
                    "trigger": "Press",
                    "commands": [
                        [
                            {
                                "name": "INC",
                                "symbol": "+"
                            },
                            {
                                "tag": "a",
                                "value": ""
                            },
                            {
                                "tag": "",
                                "value": "1"
                            }
                        ]
                    ]
                }
            ],
            "subType": "MyButton"
        };
        var cb = function (e) {
            if (e){
                console.log(e);
            }
            console.log('ok');
        }
        var Renderer = new renderer();
        var resourceDir = ResourceService.getResourceUrl();
        Renderer.renderButton(fakeButton,resourceDir,resourceDir,null,cb);






    }

    this.renderProject = function (dataStructure,sCb, fCb) {
        var MyZip = require('../../utils/MyZip');
        var errReported = false;
        function errHandler(err) {
            console.log(err);
            if (!errReported){

                fCb && fCb();
                errReported = true;
            }
        }

        function successHandler() {
            console.log('zip ok');
            sCb && sCb();
        }
        var ProjectBaseUrl = ResourceService.getProjectUrl();
        var ResourceUrl = ResourceService.getResourceUrl();
        var DataFileUrl = path.join(ResourceUrl,'data.json');
        var allWidgets = [];
        for (var i=0;i<dataStructure.pageList.length;i++){
            var curPage = dataStructure.pageList[i];
            for (var j=0;j<curPage.canvasList.length;j++){
                var curCanvas = curPage.canvasList[j];
                for (var k=0;k<curCanvas.subCanvasList.length;k++){
                    var curSubCanvas = curCanvas.subCanvasList[k];
                    for (var l=0;l<curSubCanvas.widgetList.length;l++){
                        allWidgets.push(curSubCanvas.widgetList[l]);
                    }
                }
            }
        }
        var totalNum = allWidgets.length;
        if (totalNum>0){
            var okFlag = true;
            var cb = function (err) {
                if (err){
                    okFlag = false;
                    errHandler('generate error');
                }else{
                    totalNum-=1;
                    if (totalNum<=0){
                        if (okFlag){
                            //ok
                            console.log('trans finished');
                            fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                                if (err){
                                    errHandler(err);
                                }else{
                                    //write ok
                                    console.log('write ok');
                                    //using myzip
                                    var SrcUrl = ResourceUrl;
                                    var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                    MyZip.zipDir(SrcUrl,DistUrl,function (err) {
                                        if (err) {
                                            errHandler(err);
                                        } else {
                                            successHandler();

                                        }
                                    })
                                }
                            })
                        }else{
                            //fail
                        }
                    }
                }
            }.bind(this);
            var Renderer = new renderer();
            for (var m=0;m<allWidgets.length;m++){
                var curWidget = allWidgets[m];
                Renderer.renderWidget(curWidget,ResourceUrl,ResourceUrl,ResourceUrl,cb);
            }
        }else{
            fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                if (err){
                    errHandler(res,500,err);
                }else{
                    //write ok
                    var SrcUrl = ResourceUrl;
                    var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                    MyZip.zipDir(SrcUrl,DistUrl,function (err) {
                        if (err) {
                            errHandler(err);
                        } else {
                            successHandler();

                        }
                    })
                }
            })
        }
    }

}]);