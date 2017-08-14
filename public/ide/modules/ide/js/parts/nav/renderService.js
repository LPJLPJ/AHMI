/**
 * Created by zzen1ss on 16/7/11.
 */
ideServices.service('RenderSerive',['ResourceService','Upload','$http',function (ResourceService,Upload,$http) {

    var local=false;
    var path;
    try {
        path = require('path');
        var fs = require('fs');
        local = true;
    }catch (e){
        path = {}

        path.sep = "/"
        path.join = function (srcA, srcB) {
            if (srcA[srcA.length-1] == path.sep){
                srcA = srcA.slice(0,srcA.length-1)
            }

            if (srcB[0] == path.sep){
                srcB = srcB.slice(1)
            }

            return srcA+path.sep+srcB
        }
    }

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }


    function uploadDataURI(dataURI,name, url,scb,fcb) {
        var blob = dataURItoBlob(dataURI)

        var successHandler = function () {
            console.log('save tex ok')
            scb && scb()
        }

        var errHandler = function (err) {
            console.log(err)
            fcb && fcb()
        }
        Upload.upload({
            //url:baseUrl+'/resource',
            //url:'/api/upload',
            url:url,
            data:{file:blob,name:name}

        }).then(
            successHandler,
            errHandler

        )
    }


    function prepareCachedRes() {
        var curRes = ResourceService.getGlobalResources()
        var resRepo = {}
        for (var i=0;i<curRes.length;i++){
            var res = curRes[i]
            resRepo[res['id']] = res['content']
        }
        return resRepo
    }

    //track resources usage
    function TextInfo(text,style) {
        this.text = text;
        this.style = style

    }
    function ResTrack(img,color,text,outFile,w,h,slice) {
        this.img = img;
        this.color = color;
        this.text = text;
        this.outFile = outFile;
        this.w = w;
        this.h = h;
        this.slice = slice;
    }

    ResTrack.prototype.equal = function (nextResTrack) {
        var comparedKeys = ['img','color','text','w','h'];
        for (var i=0;i<comparedKeys.length;i++){
            var curKey = comparedKeys[i];
            if (this[curKey] != nextResTrack[curKey]){
                return false
            }
        }
        return true;
    }



    //define canvas object

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
        if (local){
            var dataBuffer = new Buffer(data.split(',')[1],'base64');
            return dataBuffer;
        }else{
            return data
        }


    };

    Canvas.prototype.toBuffer =function () {
        var data = this.canvasObj.toDataURL();
        var dataBuffer = new Buffer(data.split(',')[1],'base64');
        return dataBuffer;

    };

    Canvas.prototype.output = function (outpath, cb ) {
        var stream = this.pngStream();
        var fileName = getLastName(outpath)
        if (local){
            try {
                fs.writeFileSync(outpath,stream);
                cb && cb();
            }catch (e) {
                cb && cb(e);
            }
        }else{
            uploadDataURI(stream,fileName,'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/generatetex',cb,cb)
        }

    }


    function checkFileType(fileExt) {
        switch (fileExt){
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
                break;
            case 'png':
                return 'image/png';
                break;
            case 'bmp':
                return 'image/bmp';
                break;
            default:
                return 'image/png';
        }
    }


    function loadImageSync(imgUrl) {
        if (local){
            var ext = path.extname(imgUrl);
            var type = checkFileType(ext);
            var prefix = 'data:'+type+';base64,';

            return prefix+fs.readFileSync(imgUrl).toString('base64');
        }else{
            return imgUrl
        }

    }

    var Size = renderingX.Size;
    var Pos = renderingX.Pos;



    function getLastName(path) {
        var array = path.split('/');
        return array[array.length-1];
    }


    function renderer(images,customFonts) {
        this.images = images||{};
        window.images = this.images;
        this.customFonts = customFonts || {};
        this.trackedRes = [];
    }

    //compare tracked resources
    renderer.prototype.compareTrackedRes = function (nextTrackedRes) {
        for (var i=0;i<this.trackedRes.length;i++){
            var curTrackedRes = this.trackedRes[i];
            if (curTrackedRes.eq(nextTrackedRes)){
                //hit
                return true;
            }
        }
        return false;
    }

    renderer.prototype.getTargetImage = function (url) {
        if (local){
            if (this.images[url]!=='undefined'){
                return this.images[url];
            }else{
                return null;
            }
        }else{
            return this.images[getLastName(url)]
        }
    };

    renderer.prototype.addImage = function (imageUrl, image) {
        this.images[imageUrl] = image;
    };

    renderer.prototype.renderButton = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (info ){
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
            // var beforePressSlice = widget.texList[0].slices[0];
            // var afterPressSlice = widget.texList[0].slices[1];
            var slices = widget.texList[0].slices;
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
                    renderingX.renderImage(ctx,new Size(info.width,info.height),new Pos(),targetImageObj,new Pos(),new Size(info.width,info.height));
                }
                //draw text
                if (index<2){
                    renderingX.renderText(ctx,new Size(info.width,info.height),new Pos(),info.text,style,true,null,this.customFonts);
                }

                //generate file
                var imgName = widget.id.split('.').join('');
                var outputFilename = imgName +'-'+ index+'.png';


                var outpath = path.join(dstDir,outputFilename);
                _canvas.output(outpath,function (err) {
                    if (err){
                        totalSlices-=1;
                        if (totalSlices<=0){
                            cb && cb(err);
                        }
                    }else{
                        //track res
                        this.trackedRes.push(new ResTrack(img,slice.color,new TextInfo(info.text,style),outputFilename,info.width,info.height,slice))
                        //
                        // console.log(_.cloneDeep(this.trackedRes))
                        widget.texList[0].slices[index].originSrc = widget.texList[0].slices[index].imgSrc;
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


    renderer.prototype.renderButtonGroup = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.width;
            var height = info.height;

            var interval = info.interval;
            var count = info.count;
            var arrange = (info.arrange === 'horizontal');
            if (arrange){
                width = (width-(count-1)*interval)/count;
            }else{
                height = (height-(count-1)*interval)/count;
            }

            var texList = widget.texList;
            var totalSlices = 2*count;

            var slices = [];
            for (var i=0;i<count;i++){
                for (var j=0;j<2;j++){
                    slices.push(texList[i].slices[j]);
                }
            }
            if (texList[count]){
                slices.push((texList[count].slices[0]));
                totalSlices++;
            }
            slices.map(function (slice,i) {
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');

                var curSlice = slice;
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
                        var imgObj = new Image();
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
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        totalSlices-=1;
                        if (totalSlices<=0){
                            cb && cb(err);
                        }
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,slice))
                        // console.log(_.cloneDeep(this.trackedRes))
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
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

    renderer.prototype.renderDashboard = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //trans each slide


            var texList = widget.texList;
            var totalSlices = texList.length;
            texList.map(function (tex,i) {
                var width = info.width;
                var height = info.height;
                if (i===1){
                    //pointer
                    width = height = info.pointerLength/Math.sqrt(2);
                }
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                var curSlice = texList[i].slices[0];
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
                        var imgObj = new Image();
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
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        totalSlices-=1;
                        if (totalSlices<=0){
                            cb && cb(err);
                        }
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,curSlice))
                        // console.log(_.cloneDeep(this.trackedRes))
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
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
            //font
            var text = '';
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

            //trans each slide
            var width = info.width;
            var height = info.height;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
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
                        var imgObj = new Image();
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

                //render font --20170705
                text = curSlice.text;
                if(!!text){
                    renderingX.renderText(ctx,new Size(info.width,info.height),new Pos(),text,style,true,null,this.customFonts);
                }

                //output
                var imgName = widget.id.split('.').join('');
                var outputFilename = imgName +'-'+ i+'.png';
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,curSlice))
                        // console.log(_.cloneDeep(this.trackedRes))
                        //write widget
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
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

    renderer.prototype.renderTexNum = function(widget,srcRootDir,dstDir,imgUrlPrefix,cb){
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.characterW;
            var height = info.characterH;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
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
                        var imgObj = new Image();
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
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,curSlice));
                        // console.log(_.cloneDeep(this.trackedRes))
                        //write widget
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        console.log('keke',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
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

    renderer.prototype.renderRotateImg = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.width;
            var height = info.height;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
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
                        var imgObj = new Image();
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
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,curSlice))
                        // console.log(_.cloneDeep(this.trackedRes))
                        //write widget
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
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
                    bgSlice.originSrc = bgSlice.imgSrc;
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
            style.arrange = widget.info.arrange;
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
                    this.trackedRes.push(new ResTrack(bgSlice.imgSrc,bgSlice.color,new TextInfo(info.text,style),outputFilename,width,height,bgSlice))
                    // console.log(_.cloneDeep(this.trackedRes))
                    bgSlice.originSrc = bgSlice.imgSrc;
                    bgSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                    var stopTime = new Date();
                    console.log('Output stream costs: ',(stopTime-startTime)/1000.0+'s');
                    cb && cb();
                }
            }.bind(this))


        }else{
            cb&&cb();
        }

    };

    renderer.prototype.renderWidget = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        switch (widget.subType){
            case 'MyButton':
            case 'MySwitch':
                this.renderButton(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyButtonGroup':
                this.renderButtonGroup(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MySlide':
                this.renderSlide(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyAnimation':
                this.renderSlide(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyOscilloscope':
                this.renderOscilloscope(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyTextArea':
                this.renderTextArea(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyDashboard':
                this.renderDashboard(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyRotateImg':
                this.renderRotateImg(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyTexNum':
                this.renderTexNum(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            default:
                cb&&cb();
        }
    };

    renderer.prototype.removeSameOutputFiles = function () {
        var needRemoveFiles = []
        for (var i=0;i<this.trackedRes.length;i++){
            var curJudgeTrack = this.trackedRes[i];
            for (var j=0;j<i;j++){
                //compare with former restracks
                // console.log(this.trackedRes[j])
                if (this.trackedRes[j].equal(curJudgeTrack)){
                    //same;
                    needRemoveFiles.push(curJudgeTrack.slice.imgSrc)
                    curJudgeTrack.slice.imgSrc = this.trackedRes[j].slice.imgSrc;

                    break;
                }
            }
        }
        return needRemoveFiles;
    }

    this.renderProject = function (dataStructure,sCb, fCb) {
        var Renderer
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


        function zipResources(dst,src) {
            // var SrcUrl = path.join(ProjectBaseUrl,'resources');
            // var DistUrl = path.join(ProjectBaseUrl,'file.zip');

            MyZip.compress(dst,src,function (err) {
                if (err) {
                    errHandler(err);
                } else {
                    successHandler();
                }
            }.bind(this));
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
                            var shouldRemoveFiles = Renderer.removeSameOutputFiles();
                            // console.log('trackedRes',Renderer.trackedRes,shouldRemoveFiles)
                            if (local){
                                fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                                    if (err){
                                        errHandler(err);
                                    }else{
                                        //write ok
                                        console.log('write ok');
                                        // successHandler();
                                        var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                        var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                        zipResources(DistUrl,SrcUrl);
                                    }
                                })
                            }else{
                                //browser
                                $http({
                                    method:'POST',
                                    url:'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/savedatacompress',
                                    data:{
                                        dataStructure:dataStructure
                                    }
                                })
                                    .success(function (data) {
                                        if (data == 'ok'){
                                            //download
                                            window.location.href = '/project/'+ResourceService.getResourceUrl().split('/')[2]+'/download'

                                        }else{
                                            console.log(data);
                                            toastr.info('生成失败')
                                        }
                                        sCb && sCb()
                                    })
                                    .error(function (err) {
                                        errHandler(err);
                                        fCb && fCb()
                                    })
                            }

                        }else{
                            //fail
                        }
                    }
                }
            }.bind(this);


            if (local){
                Renderer = new renderer();
                var ViewUrl = path.join(global.__dirname,path.dirname(window.location.pathname));
                console.log('viewUrl',ViewUrl)
                for (var m=0;m<allWidgets.length;m++){
                    var curWidget = allWidgets[m];
                    Renderer.renderWidget(curWidget,ViewUrl,ResourceUrl,ResourceUrl,cb);
                }
            }else{
                Renderer = new renderer(prepareCachedRes());
                for (var m=0;m<allWidgets.length;m++){
                    var curWidget = allWidgets[m];
                    Renderer.renderWidget(curWidget,'/',ResourceUrl,ResourceUrl,cb);
                }
            }
        }else{
            if (local){
                fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                    if (err){
                        errHandler(res,500,err);
                    }else{
                        //write ok
                        // successHandler();
                        var SrcUrl = path.join(ProjectBaseUrl,'resources');
                        var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                        zipResources(DistUrl,SrcUrl);
                    }
                })
            }else{
                $http({
                    method:'POST',
                    url:'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/savedatacompress',
                    data:{
                        dataStructure:dataStructure
                    }
                })
                    .success(function (data) {
                        if (data == 'ok'){
                            //download
                            window.location.href = '/project/'+ResourceService.getResourceUrl().split('/')[2]+'/download'

                        }else{
                            console.log(data);
                            toastr.info('生成失败')
                        }
                        sCb && sCb()
                    })
                    .error(function (err) {
                        errHandler(err);
                        fCb && fCb()
                    })
            }

        }
    }

    if (local){

        // my zip
        var spawn = require('child_process').spawn;


        function MyZipClass() {
            var _arguments;
            var platform = require('os').platform()==='win32'?'win':'other';
            var zipCommand = 'zip';
            if (platform === 'win'){
                zipCommand = '.\\utils\\7z\\7z.exe';
                _arguments = ['a']
            }else{
                _arguments = ['-rj'];
            }

            var _file,
                _fileList,
                _callback;

            var zip = function() {
                if (platform === 'win') {
                    if (_fileList[_fileList.length-1]!=='\\') {
                        _fileList = _fileList + '\\*';
                    }
                }
                var params = _arguments.concat(_file).concat(_fileList);
                var command = spawn(zipCommand, params);
                console.log('command',zipCommand,params)

                command.stdout.on('data', function(data) {
                    // TODO: stdout

                });

                command.stderr.on('data', function(data) {
                    // TODO: stderr

                });
                command.on('error',function (err) {
                    console.log(err);
                    _callback(err);
                })
                command.on('exit', function(code) {
                    if(code === 0) {
                        _callback();
                    } else {
                        _callback(new Error(code));
                    }
                });
            }



            this.compress = function(file, fileList, callback) {
                // TODO: extract method fs.exists
                // TODO: extract method fs.unlink

                _file = file;
                _fileList = fileList;
                _callback = callback;


                fs.stat(file, function (err, stats) {
                    if (stats&&stats.isFile()){
                        fs.unlink(file, function (err) {
                            if (err){
                                _callback(err);
                            }else{
                                zip();
                            }
                        });
                        // zip();
                    }else{
                        zip();
                    }
                })
            }


        };


        var MyZip = new MyZipClass();










    }



}]);