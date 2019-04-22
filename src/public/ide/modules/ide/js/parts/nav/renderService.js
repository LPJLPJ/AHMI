/**
 * Created by zzen1ss on 16/7/11.
 */
ideServices.service('RenderSerive',['ResourceService','Upload','$http','FontGeneratorService',function (ResourceService,Upload,$http,FontGeneratorService) {

    var local=false;
    var path;
    var createHashForFile = function () {

    }
    try {
        path = require('path');
        var fs = require('fs');
        var crypto = require('crypto')
        local = true;
        //add hash function
        createHashForFile = function (fileUrl,algo,cb) {
            algo = algo||'md5'
            var hash = crypto.createHash(algo),
                stream = fs.createReadStream(fileUrl);

            stream.on('data', function (data) {
                hash.update(data, 'utf8')
            })

            stream.on('error',function (err) {
                cb && cb(err)
            })
            stream.on('end', function () {
                cb && cb(null,hash.digest('hex'))
            })
        }
    }catch (e){
        path = {};

        path.sep = "/";
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
    if(!local){
            document.getElementById("ACF").style.visibility="hidden";
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
        var blob = dataURItoBlob(dataURI);

        var successHandler = function () {
            // console.log('save tex ok')
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

    function uploadDataURIToMemory(dataURI,name,scb,fcb) {
        var blob = dataURItoBlob(dataURI);

        var successHandler = function () {
            // console.log('save tex ok')
            scb && scb()
        }

        var errHandler = function (err) {
            console.log(err)
            fcb && fcb()
        }

        window.renderedTex = window.renderedTex||{}

        window.renderedTex[name] = blob

        successHandler()
       
    }


    function prepareCachedRes() {
        var curRes = ResourceService.getGlobalResources();
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

    function compareStyle(style1,style2){
        var keys = ['color','font','textAlign','textBaseline']
        if(style1 && style2){
            for(var i=0;i<keys.length;i++){
                var curKey = keys[i]
                if(style1[curKey]!=style2[curKey]){
                    return false
                }
            }
            return true
        }else{
            return false
        }
        
    }

    ResTrack.prototype.equal = function (nextResTrack) {
        var comparedKeys = ['img','color','text','w','h'];
        for (var i=0;i<comparedKeys.length;i++){
            var curKey = comparedKeys[i];
            if (curKey == 'text'){
                if(this[curKey]&&nextResTrack[curKey]){
                    if(!(this[curKey]['text']==nextResTrack[curKey]['text']) || !compareStyle(this[curKey]['style'],nextResTrack[curKey]['style'])){
                        return false
                    }else{
                        
                    }
                }else if(!this[curKey]&&!nextResTrack[curKey]){
                    
                }else{
                    return false
                }
                
            }else{
                if (this[curKey] != nextResTrack[curKey]){
                
                    return false
                }
            }
            
        }
        return true;
    };



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
            // uploadDataURI(stream,fileName,'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/generatetex',cb,cb)
            uploadDataURIToMemory(stream,fileName,cb,cb)
        }

    };


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

    function makeOutputFilenameFromId(id,index,type) {
        type = type||'png'
        var imgName = id.split('.').join('-');
        var outputFilename = 'r-'+imgName +'-'+ index+'.'+type;
        return outputFilename
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
    };

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


    //render page background

    renderer.prototype.renderPage = function (width,height,page,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var _canvas = new Canvas(width,height);
        var ctx = _canvas.getContext('2d');
        var img =page.backgroundImage;
        ctx.clearRect(0,0,width,height);
        ctx.save();
        //color
        if(page.backgroundColor){
            renderingX.renderColor(ctx,new Size(width,height),new Pos(),page.backgroundColor);
        }

        var imgUrl;
        if (img && img !== ''){
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
            renderingX.renderImage(ctx,new Size(width,height),new Pos(),targetImageObj,new Pos(),new Size(width,height));
            //generate file
            // var imgName = widget.id.split('.').join('-');
            // var outputFilename = imgName +'-'+ index+'.png';

            var outputFilename = makeOutputFilenameFromId(page.id,0,'png')

            // console.log('dstDir',dstDir,'outputFilename',outputFilename);
            var outpath = path.join(dstDir,outputFilename);
            _canvas.output(outpath,function (err) {
                if(err){
                    cb&&cb(err)
                }else{
                    //this.trackedRes.push(new ResTrack(img,page.backgroundColor,null,outputFilename,width,height,page))

                    page.originBackgroundImage = page.backgroundImage;
                    page.backgroundImage = path.join(imgUrlPrefix||'',outputFilename);

                    cb && cb()
                }


            }.bind(this));

            ctx.restore();

        }else{
            cb && cb()
        }



    }

    renderer.prototype.renderButton = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (info ){
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
                    if(info.text!==undefined&&!!info.text){
                        renderingX.renderText(ctx,new Size(info.width,info.height),new Pos(),info.text,style,true,null,this.customFonts);
                    }
                }

                //generate file
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ index+'.png';

                var outputFilename = makeOutputFilenameFromId(widget.id,index)

                // console.log('dstDir',dstDir,'outputFilename',outputFilename);
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
            slices.forEach(function (slice,i) {
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
                var curSlice = texList[i].slices[0];
                var imgSrc = curSlice.imgSrc;
                if (i===1){
                    //pointer
                    if(imgSrc===''){
                        width = height = width/2;
                    }else{
                        width = height = info.pointerLength/Math.sqrt(2);
                    }
                }
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,width,height);
                ctx.save();
                //render color
                if(i===1){
                    renderingX.renderColor(ctx,new Size(width,height),new Pos(),'rgba(0,0,0,0)');
                }else{
                    renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
                }
                
                //render image;
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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

                        if (i===1&&imgSrc!==''){
                            //pointer


                        }else{
                            curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        }
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
                var curText = curSlice.text;
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,new TextInfo(curText,style),outputFilename,width,height,curSlice))
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


    renderer.prototype.renderAlphaSlide = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
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
                var curText = curSlice.text;
                // console.log('slice: ',i,' canas ',canvas,' slice: ',curSlice,width,height);
                ctx.clearRect(0,0,width,height);
                ctx.save();
                //render color
                //renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,new TextInfo(curText,style),outputFilename,width,height,curSlice))
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


    renderer.prototype.renderGallery = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //font
            

            //trans each slide
            var width = info.photoWidth;
            var height = info.height;

            
            var totalSlices = widget.texList.length;
            widget.texList.forEach(function (t,i) {
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                var curSlice = t.slices[0];
                
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        //this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,width,height,curSlice));
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

    renderer.prototype.renderTexTime = function(widget,srcRootDir,dstDir,imgUrlPrefix,cb){
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.characterW;
            var height = info.characterH;

            // var slideTex = widget.texList[0];
            var slideTex = _.cloneDeep(widget.texList[0]);
            slideTex.slices.push(widget.texList[1].slices[0]);
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
                // var imgName = widget.id.split('.').join('');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
                        //if last trigger cb
                        totalSlices -= 1;
                        if (totalSlices<=0){
                            cb && cb();
                        }
                    }
                }.bind(this));
                var numberSlice=[];
                for(var j=0;j<13;j++){
                    numberSlice.push(slideTex.slices[j]);
                }
                widget.texList[0].slices=numberSlice;

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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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

    renderer.prototype.renderProgress = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        //progressModeId
        var info = widget.info;
        if (!!info){



            //trans each slide
            var width = info.width;
            var height = info.height;
            var totalSlices
            var slices
            if(info.cursor == '1'){
                slices = widget.texList.slice(0,widget.texList.length-1).map(function (t) {
                    return t.slices[0]
                })
            }else{
                slices = widget.texList.map(function (t) {
                    return t.slices[0]
                })
            }
            totalSlices = slices.length
            slices.map(function (slice,i) {
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                var curSlice = slice
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
                        if (totalSlices===0){
                            cb && cb();
                        }
                    }
                }.bind(this));

                ctx.restore();
            }.bind(this));

        }else{
            cb&&cb();
        }
    }

    renderer.prototype.renderSlideBlock = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        //progressModeId
        var info = widget.info;
        if (!!info){



            //trans each slide
            var width = info.width;
            var height = info.height;
            var totalSlices
            var slices
            slices = widget.texList.map(function (t) {
                return t.slices[0]
            })
            totalSlices = slices.length
            slices.map(function (slice,i) {
                var curSlice = slice
                var imgObj
                var imgSrc = curSlice.imgSrc;
                if (imgSrc!==''){
                    var imgUrl = path.join(srcRootDir,imgSrc);
                    var targetImageObj = this.getTargetImage(imgUrl);
                    if (!targetImageObj){
                        //not added to images
                        imgObj = new Image();
                        try{
                            imgObj.src = loadImageSync(imgUrl);
                            this.addImage(imgUrl,imgObj);
                            targetImageObj = imgObj;
                        }catch (err){
                            targetImageObj = null;
                        }

                    }

                }
                var tWidth,tHeight
                tWidth = targetImageObj&&targetImageObj.width||0
                tHeight = targetImageObj&&targetImageObj.height||0
                var canvas,ctx
                if(i==1){
                    canvas = new Canvas(tWidth,tHeight);
                    ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,tWidth,tHeight);

                }else{
                    canvas = new Canvas(width,height);
                    ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,width,height);
                }



                // console.log('slice: ',i,' canas ',canvas,' slice: ',curSlice,width,height);

                ctx.save();

                if(i==0){
                    //render color
                    renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
                }

                //render image;
                if (targetImageObj){
                    if (i==1){
                        renderingX.renderImage(ctx,new Size(tWidth,tHeight),new Pos(),targetImageObj,new Pos(),new Size(tWidth,tHeight));
                    }else{
                        renderingX.renderImage(ctx,new Size(width,height),new Pos(),targetImageObj,new Pos(),new Size(width,height));
                    }

                }


                //output
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
                var outpath = path.join(dstDir,outputFilename);
                if (i==1&&!targetImageObj){
                    //no output
                    totalSlices -= 1;
                    if (totalSlices===0){
                        cb && cb();
                    }
                }else{
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
                            if (totalSlices===0){
                                cb && cb();
                            }
                        }
                    }.bind(this));
                }


                ctx.restore();
            }.bind(this));

        }else{
            cb&&cb();
        }
    }

    renderer.prototype.renderTouchTrack = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //trans each slide


            var texList = widget.texList;
            var totalSlices = texList.length;
            texList.map(function (tex,i) {
                var width = info.width;
                var height = info.height;
                var curSlice = texList[i].slices[0];
                var imgSrc = curSlice.imgSrc;
                if (i===1){
                    //tracker
                    width = Math.min(width,height)/10
                    height = width
                }
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,width,height);
                ctx.save();
                //render color
                renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
                //render image;
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
    }


    renderer.prototype.renderChart = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            //trans each slide


            var texList = widget.texList;
            var totalSlices = texList.length;
            texList.map(function (tex,i) {
                var width = info.width;
                var height = info.height;
                var curSlice = texList[i].slices[0];
                var imgSrc = curSlice.imgSrc;
                if (i===1){
                    //tracker
                    width = Math.min(width,height)/20
                    height = width
                }else if(i==2){
                    height = 1
                }
                var canvas = new Canvas(width,height);
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,width,height);
                ctx.save();
                //render color
                renderingX.renderColor(ctx,new Size(width,height),new Pos(),curSlice.color);
                //render image;
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
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
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
    }


    renderer.prototype.renderButtonSwitch = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        //progressModeId
        var info = widget.info;
        if (!!info){



            //trans each slide
            var width = info.width;
            var height = info.height;
            var totalSlices
            var slices
            slices = widget.texList.map(function (t) {
                return t.slices[0]
            })
            totalSlices = slices.length
            slices.map(function (slice,i) {
                var curSlice = slice
                var imgObj
                var imgSrc = curSlice.imgSrc;
                if (imgSrc!==''){
                    var imgUrl = path.join(srcRootDir,imgSrc);
                    var targetImageObj = this.getTargetImage(imgUrl);
                    if (!targetImageObj){
                        //not added to images
                        imgObj = new Image();
                        try{
                            imgObj.src = loadImageSync(imgUrl);
                            this.addImage(imgUrl,imgObj);
                            targetImageObj = imgObj;
                        }catch (err){
                            targetImageObj = null;
                        }

                    }

                }
                
                var canvas,ctx
                var tWidth,tHeight
                if(i==1){
                    tWidth = width/2
                    tHeight = height

                }else{
                    tWidth = width
                    tHeight = height
                }
                canvas = new Canvas(tWidth,tHeight);
                ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,tWidth,tHeight);


                // console.log('slice: ',i,' canas ',canvas,' slice: ',curSlice,width,height);

                ctx.save();

                //render color
                renderingX.renderColor(ctx,new Size(tWidth,tHeight),new Pos(),curSlice.color);

                //render image;
                if (targetImageObj){
                    renderingX.renderImage(ctx,new Size(tWidth,tHeight),new Pos(),targetImageObj,new Pos(),new Size(tWidth,tHeight));

                }


                //output
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i)
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,tWidth,tHeight,curSlice))
                        // console.log(_.cloneDeep(this.trackedRes))
                        //write widget
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
                        if (totalSlices===0){
                            cb && cb();
                        }
                    }
                }.bind(this));


                ctx.restore();
            }.bind(this));

        }else{
            cb&&cb();
        }
    }

    renderer.prototype.renderClock = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){

            //trans each slide
            var width = info.width;
            var height = info.height;
            var totalSlices;
            var slices;
            slices = widget.texList.map(function (t) {
                return t.slices[0]
            });
            totalSlices = slices.length;
            slices.map(function (slice,i) {
                var curSlice = slice;
                var imgObj;
                var imgSrc = curSlice.imgSrc;
                if (imgSrc!==''){
                    var imgUrl = path.join(srcRootDir,imgSrc);
                    var targetImageObj = this.getTargetImage(imgUrl);
                    if (!targetImageObj){
                        //not added to images
                        imgObj = new Image();
                        try{
                            imgObj.src = loadImageSync(imgUrl);
                            this.addImage(imgUrl,imgObj);
                            targetImageObj = imgObj;
                        }catch (err){
                            targetImageObj = null;
                        }

                    }

                }

                var canvas,ctx;
                var tWidth,tHeight;


                switch (i) {
                    case 0:
                        tWidth = width;
                        tHeight = height;
                        break;
                    case 1:
                        tWidth = info.hourImgWidth||width/2;
                        tHeight = info.hourImgHeight||height/2;
                        break;
                    case 2:
                        tWidth = info.minuteImgWidth||width/2;
                        tHeight = info.minuteImgHeight||height/2;
                        break;
                    case 3:
                        tWidth = info.secondImgWidth||width/2;
                        tHeight = info.secondImgHeight||height/2;
                        break;
                }
                canvas = new Canvas(tWidth,tHeight);
                ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,tWidth,tHeight);


                // console.log('slice: ',i,' canas ',canvas,' slice: ',curSlice,width,height);

                ctx.save();

                //render color
                renderingX.renderColor(ctx,new Size(tWidth,tHeight),new Pos(),curSlice.color);

                //render image;
                if (targetImageObj){
                    renderingX.renderImage(ctx,new Size(tWidth,tHeight),new Pos(),targetImageObj,new Pos(),new Size(tWidth,tHeight));

                }


                //output
                // var imgName = widget.id.split('.').join('-');
                // var outputFilename = imgName +'-'+ i+'.png';
                var outputFilename = makeOutputFilenameFromId(widget.id,i);
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,tWidth,tHeight,curSlice));
                        // console.log(_.cloneDeep(this.trackedRes))
                        //write widget
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
                        if (totalSlices===0){
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

    renderer.prototype.renderGrid = function (widget,srcRootDir,dstDir,imgUrlPrefix,cb) {
        var info = widget.info;
        if (!!info){
            var width = info.width;
            var height = info.height;
            var totalSlices;
            var slices;

            var border = info.border,
                borderColor = info.borderColor,
                cellWidth = info.cellWidth,
                cellHeight = info.cellHeight;


            slices = widget.texList.map(function (t) {
                return t.slices[0]
            });
            totalSlices = slices.length;
            slices.map(function (slice,i) {
                var curSlice = slice;
                var imgObj;
                var imgSrc = curSlice.imgSrc;
                if (imgSrc!==''){
                    var imgUrl = path.join(srcRootDir,imgSrc);
                    var targetImageObj = this.getTargetImage(imgUrl);
                    if (!targetImageObj){
                        //not added to images
                        imgObj = new Image();
                        try{
                            imgObj.src = loadImageSync(imgUrl);
                            this.addImage(imgUrl,imgObj);
                            targetImageObj = imgObj;
                        }catch (err){
                            targetImageObj = null;
                        }

                    }

                }

                var canvas,ctx;
                var tWidth,tHeight;

                tWidth = width;
                tHeight = height;

                canvas = new Canvas(tWidth,tHeight);
                ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,tWidth,tHeight);
                ctx.save();

                //render color
                renderingX.renderColor(ctx,new Size(tWidth,tHeight),new Pos(),curSlice.color);

                //render image;
                if (targetImageObj){
                    renderingX.renderImage(ctx,new Size(tWidth,tHeight),new Pos(),targetImageObj,new Pos(),new Size(tWidth,tHeight));
                }

                paintGridWidget(ctx,0,0,width,height,border,borderColor,cellWidth,cellHeight);

                //output
                var outputFilename = makeOutputFilenameFromId(widget.id,i);
                var outpath = path.join(dstDir,outputFilename);
                canvas.output(outpath,function (err) {
                    if (err){
                        cb && cb(err);
                    }else{
                        this.trackedRes.push(new ResTrack(imgSrc,curSlice.color,null,outputFilename,tWidth,tHeight,curSlice));
                        curSlice.originSrc = curSlice.imgSrc;
                        curSlice.imgSrc = path.join(imgUrlPrefix||'',outputFilename);
                        //if last trigger cb
                        totalSlices -= 1;
                        if (totalSlices===0){
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

    function paintGridWidget(ctx,x,y,width,height,lineWidth,lineColor,row,col){
        ctx = ctx || this.offctx;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;

        //行
        var initRowX,initRowY;
        //加上 lineWidth/2（边框宽度的一半） 是为了防止最外层边框超出被裁剪掉
        initRowX = x;
        initRowY = y + lineWidth/2;
        for(var i=0;i<=col.length;i++){
            if (i !== 0)  {
                initRowY += col[i-1].height;
            }
            ctx.moveTo(initRowX,initRowY);
            //如果不设置moveTo，当前画笔没有位置
            ctx.lineTo(initRowX+width,initRowY);
        }

        //列
        var initColX,initColY;
        initColX = x + lineWidth/2;
        initColY = y;

        for(var j=0;j<=row.length;j++){
            if (j !== 0) {
                initColX += row[j-1].width;
            }
            ctx.moveTo(initColX,initColY);
            //如果不设置moveTo，当前画笔没有位置
            ctx.lineTo(initColX,initColY + height);
        }

        ctx.stroke();
        ctx.closePath();
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
            // var imgName = widget.id.split('.').join('-');
            // var outputFilename = imgName +'-'+ 1+'.png';
            var outputFilename = makeOutputFilenameFromId(widget.id,1)

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
            if(info.mode!=1){
                if (info.text&&info.text!==''){
                    //draw text
                    renderingX.renderText(ctx,new Size(width,height),new Pos(),info.text,style,true,new Pos(0.5*width,0.5*height),this.customFonts);
                }
            }else{
                if(info.textContent&&info.textContent!==''){
                    var fontAttrs = {
                        fontSize:info.fontSize,
                        fontFamily:info.fontFamily,
                        fontBold:info.fontBold,
                        fontItalic:info.fontItalic,
                        fontColor:info.fontColor,
                        fontSpacing:Number(info.fontSpacing)||0,
                        fontHalfSpacing:Number(info.halfFontSpacing)||0,
                        // fontVerticalOffset:0
                    }

                    var paragraphAttrs = {
                        align:'left',
                            // indentationLeft:0,
                            // indentationRight:0,
                            // firstLineIndentation:0,
                            spacingBetweenLines:info.fontSize,
                            // spacingBeforeParagraph:(this.height-this.fontSize)/2,
                            spacingAfterParagraph:info.fontSize
                    }
                    var article = {
                        paragraphs:info.textContent.split('\n').map(function(p){
                            return {
                                paragraphAttrs:paragraphAttrs,
                                spans:[
                                    {
                                        fontAttrs:fontAttrs,
                                        text:p
                                    }
                                ]
                            }
                        })
                    }
                    FontLayoutEngine.layoutArticle(article,new FontLayoutEngine.LayoutBox(0,0,info.width,info.height))
                    ctx.save()
                    ctx.fillStyle = info.fontColor
                    FontLayoutEngine.showArticleLayout(article,ctx)
                    ctx.restore()
                }
            }
            
            //output
            // var imgName = widget.id.split('.').join('-');
            // var outputFilename = imgName +'-'+ 1+'.png';
            var outputFilename = makeOutputFilenameFromId(widget.id,1)
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
                    // console.log('Output stream costs: ',(stopTime-startTime)/1000.0+'s');
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
            case 'MyGallery':
                this.renderGallery(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MySlide':
            // case 'MyAlphaSlide':
            case 'MyAlphaImg':
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
            case 'MyTexTime':
                this.renderTexTime(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyProgress':
                this.renderProgress(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MySlideBlock':
                this.renderSlideBlock(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyTouchTrack':
                this.renderTouchTrack(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyButtonSwitch':
                this.renderButtonSwitch(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyAlphaSlide':
                this.renderAlphaSlide(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyClock':
                this.renderClock(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyChart':
                this.renderChart(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            case 'MyGrid':
                this.renderGrid(widget,srcRootDir,dstDir,imgUrlPrefix,cb);
                break;
            default:
                cb&&cb();
        }
    };

    renderer.prototype.removeSameOutputFiles = function () {
        var needRemoveFiles = [];
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
    };


    // add by lixiang in 2017/12/7
    renderer.prototype.renderFontPng = function(font,srcRootDir,dstDir,imgUrlPrefix,cb){
        var fontFamily = font['font-family'];
        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if(reg.test(fontFamily)){
            var str = '';
            for(var i=0;i<fontFamily.length;i++){
                str += fontFamily.charCodeAt(i).toString(32);
            }
            fontFamily = str;
        }

        var imgNamePrefix = ''+fontFamily+'-'+font['font-size']+'-'+font['font-bold']+'-'+(font['font-italic']||'null')+'-'+(font['fullFont']?'full':'short')
        var imagePostfix = '.png'
        var options = {
            full:font.fullFont||false,
            encoding:font.encoding,
            showGrid:false,
            paddingRatio:font.paddingRatio||1.2 //read from font info
        };
        //var stream = '';
        //var outpath = path.join(dstDir,imgName);
        //options.paddingRatio = 1.2;
        // options.showGrid = true;
        //upload multi font lib file
        // var startTime = Date.now()
        // var pngDataUrls = FontGeneratorService.generateSingleFont(font,options);
        // var stopTime = Date.now()
        // console.log("render single font png: ",imgNamePrefix,stopTime - startTime)
        // var count = pngDataUrls.length
        // var lastErr = null
        // var coutDownCB = function(err){
        //     if(err){
        //         lastErr = err
        //     }
        //     count--
        //     if(count == 0){
        //         cb && cb(lastErr)
        //     }
            
        // }
        // pngDataUrls.forEach(function(stream,idx){
        //     stream = FontGeneratorService.pngStream(stream,local);
        //     var curStreamName = imgNamePrefix+(idx>0?'-'+idx:'')+imagePostfix
        //     if(local){
        //         try {
        //             fs.writeFileSync(path.join(dstDir,curStreamName),stream);
        //             coutDownCB()
        //         }catch (e) {
        //             coutDownCB(e)
        //         }
        //     }else{
        //         uploadDataURI(stream,curStreamName,'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/generatetex',coutDownCB,coutDownCB)
        //     }
        // })

        //async version
        FontGeneratorService.generateSingleFontAsync(font,options,function(error,pngDataUrls){
            if(error){
                cb && cb(error)
            }else{
                var count = pngDataUrls.length
                var lastErr = null
                var coutDownCB = function(err){
                    if(err){
                        lastErr = err
                    }
                    count--
                    if(count == 0){
                        cb && cb(lastErr)
                    }
                    
                }
                pngDataUrls.forEach(function(stream,idx){
                    stream = FontGeneratorService.pngStream(stream,local);
                    var curStreamName = imgNamePrefix+(idx>0?'-'+idx:'')+imagePostfix
                    if(local){
                        try {
                            fs.writeFileSync(path.join(dstDir,curStreamName),stream);
                            coutDownCB()
                        }catch (e) {
                            coutDownCB(e)
                        }
                    }else{
                        // uploadDataURI(stream,curStreamName,'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/generatetex',coutDownCB,coutDownCB)
                        uploadDataURIToMemory(stream,curStreamName,coutDownCB,coutDownCB)
                    }
                })
            }
        })
        
    };

    this.renderProject = function (dataStructure,sCb, fCb) {
        var Renderer;
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
                    createHashForFile(dst,null,function (err,hash) {
                        if (err){
                            errHandler(err)
                        }else{
                            fs.rename(dst,path.join(ProjectBaseUrl,'file_'+hash+'.zip'))
                            window.zipfilename = 'file_'+hash+'.zip';
                            successHandler();
                        }
                    })

                }
            }.bind(this));
        }

        function downloadZipData(dataStructure,sCb,fCb){
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
                        window.location.href = '/project/'+ResourceService.getResourceUrl().split('/')[2]+'/download?hash=true'
    
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
    
        
    
        function downloadZipDataFromMemory(dataStructure,sCb,fCb){
            var zip = new JSZip();
            zip.file("data.json", JSON.stringify(dataStructure,null,4));
            for(var key in window.renderedTex){
                if(window.renderedTex.hasOwnProperty(key)){
                    zip.file(key,window.renderedTex[key])
                }
            }
            
            var resourcesRemainToBeRendered = getImageUrlsNotRendered(dataStructure)
            // console.log(resourcesRemainToBeRendered)
            var count = resourcesRemainToBeRendered.length
            var lastErr = null
            var cb = function(err){
                if(err){
                    lastErr = err
                }
                count--
                if(count == 0){
                    //finish
                    if(lastErr){
                        fcb(lastErr)
                    }else{
                        zip.generateAsync({type:"blob"})
                        .then(function (blob) {
                            var reader = new FileReader()
                            reader.onload = function(e){
                                var md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result)).toString();
                                saveAs(blob, "file_"+md5+".zip");
                                window.zipfilename = "file_"+md5+".zip"
                                console.log(window.zipfilename)
                                sCb && sCb()
                            }
                            reader.onerror = function(e){
                                fCb && fCb(e)
                            }
                            reader.readAsBinaryString(blob)
                        }, function (err) {
                            errHandler(err);
                            fCb && fCb()
                        })
                    }
                }
            }
            if(count > 0){
                resourcesRemainToBeRendered.forEach(function(url){
                    $http({
                        url:url,
                        responseType: "arraybuffer"
                    }).success(function(data){
                        //blob
                        zip.file(url.split('resources/')[1],data)
                        cb()
                    }).error(function(err){
                        cb(err)
                    })
                })
            }else{
                zip.generateAsync({type:"blob"})
                .then(function (blob) {
                    var reader = new FileReader()
                    reader.onload = function(e){
                        var md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result)).toString();
                        saveAs(blob, "file_"+md5+".zip");
                        sCb && sCb()
                    }
                    reader.onerror = function(e){
                        fCb && fCb(e)
                    }
                    reader.readAsBinaryString(blob)
                }, function (err) {
                    errHandler(err);
                    fCb && fCb()
                })
            }
            
            
            // zip.generateAsync({type:"blob"})
            // .then(function (blob) {
            //     saveAs(blob, "hello.zip");
            // })
            
    
    
            
        }

        var encoding = dataStructure.encoding||'ascii'
        var ProjectBaseUrl = ResourceService.getProjectUrl();
        var ResourceUrl = ResourceService.getResourceUrl();
        var DataFileUrl = path.join(ResourceUrl,'data.json');
        var allWidgets = [];
        var allPageList = []
        for (var i=0;i<dataStructure.pageList.length;i++){
            var curPage = dataStructure.pageList[i];
            allPageList.push(curPage)
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
        var fontList =  FontGeneratorService.getFontCollections(allWidgets),
            totalNum = allPageList.length+allWidgets.length+fontList.length,
            m = 0,
            curWidget = null,
            curFont = null,
            curRenderPage = null;
        // console.log(fontList)
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
                                        // successHandler();
                                        var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                        var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                        zipResources(DistUrl,SrcUrl);
                                    }
                                })
                            }else{
                                //browser
                                // downloadZipData(dataStructure,sCb,fCb)
                                downloadZipDataFromMemory(dataStructure,sCb,fCb)
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
                if(allPageList.length){
                    for(m=0;m<allPageList.length;m++){
                        curRenderPage = allPageList[m]
                        Renderer.renderPage(dataStructure.size.width,dataStructure.size.height,curRenderPage,ViewUrl,ResourceUrl,ResourceUrl,cb)
                    }
                }
                if(fontList.length!==0){
                    for(m=0;m<fontList.length;m++){
                        fontList[m].encoding = encoding
                        Renderer.renderFontPng(fontList[m],ViewUrl,ResourceUrl,ResourceUrl,cb);
                    }
                }
                for (m=0;m<allWidgets.length;m++){
                    curWidget = allWidgets[m];
                    Renderer.renderWidget(curWidget,ViewUrl,ResourceUrl,ResourceUrl,cb);
                }
            }else{
                Renderer = new renderer(prepareCachedRes());
                if(allPageList.length){
                    for(m=0;m<allPageList.length;m++){
                        curRenderPage = allPageList[m]
                        Renderer.renderPage(dataStructure.size.width,dataStructure.size.height,curRenderPage,'/',ResourceUrl,ResourceUrl,cb)
                    }
                }
                //生成不同种类的字符列表
                if(fontList.length!==0){
                    for(m=0;m<fontList.length;m++){
                        fontList[m].encoding = encoding
                        Renderer.renderFontPng(fontList[m],'/',ResourceUrl,ResourceUrl,cb);
                    }
                }
                for (m=0;m<allWidgets.length;m++){
                    curWidget = allWidgets[m];
                    Renderer.renderWidget(curWidget,'/',ResourceUrl,ResourceUrl,cb);
                }
            }
        }else{
            if (local){
                fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                    if (err){
                        errHandler(err);
                    }else{
                        //write ok
                        // successHandler();
                        var SrcUrl = path.join(ProjectBaseUrl,'resources');
                        var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                        zipResources(DistUrl,SrcUrl);
                    }
                })
            }else{
                // downloadZipData(dataStructure,sCb,fCb)
                downloadZipDataFromMemory(dataStructure,sCb,fCb)
            }

        }
    };

    function getImageUrlsNotRendered(dataStructure){
        var regx = /r(-\d+)+/
        var urls = []
        for(var i=0;i<dataStructure.pageList.length;i++){
            var page = dataStructure.pageList[i]
            for(var j=0;j<page.canvasList.length;j++){
                var canvas = page.canvasList[j]
                for(var k=0;k<canvas.subCanvasList.length;k++){
                    var subCanvas = canvas.subCanvasList[k]
                    for(var l=0;l<subCanvas.widgetList.length;l++){
                        var widget = subCanvas.widgetList[l]
                        if(widget.texList){
                            for(var m=0;m<widget.texList.length;m++){
                                var tex = widget.texList[m]
                                tex.slices.forEach(function(s){
                                    if(s.imgSrc!=''){
                                        if(s.imgSrc.search(regx)==-1){
                                            //not rendered
                                            for(var u = 0;u<urls.length;u++){
                                                if(urls[u]==s.imgSrc){
                                                    return
                                                }
                                            }
                                            urls.push(s.imgSrc)
                                        }
                                    }
                                    
                                })
                            }
                        }
                        
                    }
                }
            }
        }
        return urls
    }


    /**
     * 检测生成大小
     */
    function SizeCalculator() {
        this.totalSize = 0
    }

    SizeCalculator.prototype.convertTotalSize = function () {
        return (this.totalSize )/1024 +'KB'
    }
    SizeCalculator.prototype.addSize = function (width,height,bytePerPixel) {
        var curSize = Number(Number(width) * Number(height)) || 0
        this.totalSize += curSize * (bytePerPixel||4)
    }

    SizeCalculator.prototype.calcButton = function (widget) {
        var info = widget.info;
        if (info ){
            //font style

            var slices = widget.texList[0].slices;
            var totalSlices = slices.length;
            slices.map(function (slice,index) {
                this.addSize(widget.info.width,widget.info.height)

            }.bind(this));

        }
    };


    SizeCalculator.prototype.calcButtonGroup = function (widget) {
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
            slices.forEach(function (slice,i) {
                this.addSize(width,height)
            }.bind(this));

        }

    };

    SizeCalculator.prototype.calcDashboard = function (widget) {
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

                this.addSize(width,height)


            }.bind(this));



        }

    };

    SizeCalculator.prototype.calcSlide = function (widget) {
        var info = widget.info;
        if (!!info){
            //font
            var text = '';

            //trans each slide
            var width = info.width;
            var height = info.height;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
                this.addSize(width,height)
            }.bind(this));

        }

    };

    SizeCalculator.prototype.calcTexNum = function(widget){
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.characterW;
            var height = info.characterH;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
                this.addSize(width,height)
            }.bind(this));


        }
    };

    SizeCalculator.prototype.calcTexTime = function(widget){
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.characterW;
            var height = info.characterH;

            // var slideTex = widget.texList[0];
            var slideTex = _.cloneDeep(widget.texList[0]);
            slideTex.slices.push(widget.texList[1].slices[0]);
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
                this.addSize(width,height)
            }.bind(this));

        }
    };

    SizeCalculator.prototype.calcRotateImg = function (widget) {
        var info = widget.info;
        if (!!info){
            //trans each slide
            var width = info.width;
            var height = info.height;

            var slideTex = widget.texList[0];
            var totalSlices = slideTex.slices.length;
            slideTex.slices.map(function (slice,i) {
                this.addSize(width,height)
            }.bind(this));

        }

    };

    SizeCalculator.prototype.calcOscilloscope = function (widget) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        if (info){
            //draw bg
            //draw grid
            this.addSize(width,height)

        }
    };


    SizeCalculator.prototype.calcTextArea = function (widget) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        if (info){
            this.addSize(width,height)



        }

    };

    SizeCalculator.prototype.calcPage = function (page,width,height) {
        if (page.backgroundImage){
            this.addSize(width,height)
        }
    }

    SizeCalculator.prototype.calcWidget = function (widget) {
        switch (widget.subType){
            case 'MyButton':
            case 'MySwitch':
                this.calcButton(widget);
                break;
            case 'MyButtonGroup':
                this.calcButtonGroup(widget);
                break;
            case 'MySlide':
                this.calcSlide(widget);
                break;
            case 'MyAnimation':
                this.calcSlide(widget);
                break;
            case 'MyOscilloscope':
                this.calcOscilloscope(widget);
                break;
            case 'MyTextArea':
                this.calcTextArea(widget);
                break;
            case 'MyDashboard':
                this.calcDashboard(widget);
                break;
            case 'MyRotateImg':
                this.calcRotateImg(widget);
                break;
            case 'MyTexNum':
                this.calcTexNum(widget);
                break;
            case 'MyTexTime':
                this.calcTexTime(widget);
                break;
            default:
                break;
        }
    };


    this.calcProjectSize = function (dataStructure) {
        var allWidgets = []
        var curSizeCalulator = new SizeCalculator()
        for (var i=0;i<dataStructure.pageList.length;i++){
            var curPage = dataStructure.pageList[i];
            curSizeCalulator.calcPage(curPage,dataStructure.size.width,dataStructure.size.height)
            for (var j=0;j<curPage.canvasList.length;j++){
                var curCanvas = curPage.canvasList[j];
                for (var k=0;k<curCanvas.subCanvasList.length;k++){
                    var curSubCanvas = curCanvas.subCanvasList[k];
                    for (var l=0;l<curSubCanvas.widgetList.length;l++){
                        allWidgets.push(curSubCanvas.widgetList[l])
                        curSizeCalulator.calcWidget(curSubCanvas.widgetList[l]);
                    }
                }
            }
        }
        var fontList =  FontGeneratorService.getFontCollections(allWidgets)
        console.log('fontList',fontList);
        for(var i=0;i<fontList.length;i++){
            var curFont = fontList[i]
            var curFontSize = curFont['font-size']||24
            var width = 1.2*Math.sqrt(128)*curFontSize
            curSizeCalulator.addSize(width,width,0.5)
        }

        return curSizeCalulator.convertTotalSize()
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
                console.log('command',zipCommand,params);

                command.stdout.on('data', function(data) {
                    // TODO: stdout

                });

                command.stderr.on('data', function(data) {
                    // TODO: stderr

                });
                command.on('error',function (err) {
                    console.log(err);
                    _callback(err);
                });
                command.on('exit', function(code) {
                    if(code === 0) {
                        _callback();
                    } else {
                        _callback(new Error(code));
                    }
                });
            };


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