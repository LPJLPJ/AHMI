/**
 * create by lixiang in 2017/12/7
 * 基于canvas 生成一张data Url 格式的ASCII码字符集图片
 */


ideServices.service('FontGeneratorService',['Type',function(Type){
    //SingleFontGenrator
    var font = {},
        gridSize,
        fontCanvas = document.createElement('canvas'),
        ctx = fontCanvas.getContext('2d'),
        paddingRatio = 1.2;

    function initCanvas(width,height) {
        fontCanvas.width = width;
        fontCanvas.height = height;
        ctx.clearRect(0,0,width,height)
    }

    function drawChar(charCode,x,y) {
        //console.log(charCode,String.fromCharCode(charCode));
        ctx.fillText(String.fromCharCode(charCode),x,y)
    }

    function drawCharWithChar(c,x,y) {
        //console.log(charCode,String.fromCharCode(charCode));
        ctx.fillText(c,x,y)
    }


    //decode charCode with encoding to str
    function decodeCharCode(charCode,encoding){
        var charCodeArr = []
        do{
            charCodeArr.unshift(charCode%256)
            charCode = charCode>>8
        }while(charCode!=0)
        return new TextDecoder(encoding).decode(Uint8Array.from(charCodeArr));
    }


    function drawCharsWithRange(startIdx,from,to,fontSize,fontStr,options){
        ctx.font = fontStr;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var column = 0;
        var row = 0;
        options = options||{}
        var curIdx,curCharCode
        var encoding = options.encoding||'utf-8'
        switch(encoding){
            case 'gb2312':
                for(var i = 0;i<(to-from+1);i++){
                    curIdx = i + startIdx
                    row = Math.floor(curIdx/gridSize.w)+1;
                    column = curIdx - (row-1)*gridSize.w+1;
                    if (options.showGrid) {
                        ctx.strokeRect((column-1)*fontSize,(row-1)*fontSize,fontSize,fontSize)
                    }
                    curCharCode = i + from 
                    //convert to utf-8
                    
                    
                    var c = decodeCharCode(curCharCode,encoding)
                    
                    if(c==='.'){
                        //小数点往左边偏移百分之20%
                        drawCharWithChar(c,(column-0.7)*fontSize,(row-0.5)*fontSize)
                    }else {
                        drawCharWithChar(c,(column-0.5)*fontSize,(row-0.5)*fontSize)
                    }
                    
        
                }
            break;
            default:
                for(i = 0;i<(to-from+1);i++){
                    curIdx = i + startIdx
                    row = Math.floor(curIdx/gridSize.w)+1;
                    column = curIdx - (row-1)*gridSize.w+1;
                    if (options.showGrid) {
                        ctx.strokeRect((column-1)*fontSize,(row-1)*fontSize,fontSize,fontSize)
                    }
                    curCharCode = i + from
                    
                    
                    if(curCharCode===46){
                        //小数点往左边偏移百分之20%
                        drawChar(curCharCode,(column-0.7)*fontSize,(row-0.5)*fontSize)
                    }else {
                        drawChar(curCharCode,(column-0.5)*fontSize,(row-0.5)*fontSize)
                    }
                    
        
                }
                
        }
        
        

    }

    function drawCharsWithRanges(ranges,fontSize,fontStr,options){
        drawCharsWithRangesFrom(0,ranges,fontSize,fontStr,options)

        //return fontCanvas.toDataURL()
    }


    function drawCharsWithRangesFrom(idxInCanvas,ranges,fontSize,fontStr,options){
        //var idxInCanvas = 0
        for(var i=0;i<ranges.length;i++){
            var curRange = ranges[i]
            options.encoding = curRange[2]||'ascii'
            drawCharsWithRange(idxInCanvas,curRange[0],curRange[1],fontSize,fontStr,options)
            idxInCanvas += curRange[1] - curRange[0] + 1
        }

        //return fontCanvas.toDataURL()
    }

    function calCanvasSize(fontSize,charNum) {
        var wNum = Math.ceil(Math.sqrt(charNum));
        if (wNum){
            return {
                w:wNum,
                h:wNum
            }
        }else{
            return null
        }
    }

    function getTotalCharsByRangs(ranges){
        var num = 0
        for(var i=0;i<ranges.length;i++){
            num += getCharsByRange(ranges[i])
        }

        return num
    }

    function getCharsByRange(range){
        return range[1] - range[0] + 1
    }

    //get new ranges by offset ranges
    function offsetRanges(offset,ranges){
        var result = {
            before:[],
            after:[]
        }

        for(var i=0;i<ranges.length;i++){
            var curRange = ranges[i]
            var curRangeLen = getCharsByRange(curRange)
            var beforePart,afterPart
            if(offset>=curRangeLen){
                //next range
                result.before.push(curRange)
            }else{
                //cur range
                if(offset > 0){
                    //split
                    beforePart = [curRange[0],curRange[0]+offset-1,curRange[2]]
                    result.before.push(beforePart)
                    afterPart = [curRange[0]+offset,curRange[1],curRange[2]]
                    result.after.push(afterPart)
                }else{
                    result.after.push(curRange)
                }
                
                
            }
            offset -= curRangeLen
        }
        return result
    }

    function generateSingleFont(font,options) {
        var fontSize = font['font-size']||24;
        options = options||{};
        //add padding
        var paddingRatio = options.paddingRatio||1.0;
        var paddingFontSize= Math.ceil(paddingRatio*fontSize);
        var totalChars 
        var charRanges = []
        var limitOfEachPNG = 1024;
        var pngDataUrls = [];
        var ASCII_RANGE = [1,127,'ascii']
        if(options.full){
            switch (options.encoding){
                case 'utf-8':
                    charRanges = [
                        [0x4e00,0x9fa5,options.encoding]
                    ]
                    
                break;
                case 'gb2312':
                    for(var i= 1;i<=94;i++){
                        charRanges.push([((0xa0+i)<<8) + (0xa0+1),((0xa0+i)<<8) + (0xa0+94),options.encoding])
                    }
                    // charRanges = [
                    //     [0xa1a1,0xfefe,options.encoding]
                    // ]
                break;
                default:
                    //ascii
                    charRanges = [
                    ]
    
            }
        }else{
            // switch (options.encoding){
                
            //     case 'gb2312':
            //         charRanges = [
            //             [0xa1a1,0xfefe]
            //         ]
            //     break;
            //     default:
            //         //ascii
            //         charRanges = [
            //             [0,127]
            //         ]
    
            // }
            charRanges = []
        }

        totalChars = getTotalCharsByRangs(charRanges) + getTotalCharsByRangs([ASCII_RANGE])

        charRanges = [ASCII_RANGE].concat(charRanges)
        
        if (totalChars) {
            var fontLibPartsNum = Math.ceil(totalChars/limitOfEachPNG)
            var curChars = 0
            var splitedRanges
            var curCharRanges
            for(var i=0;i<fontLibPartsNum;i++){
                splitedRanges = offsetRanges(limitOfEachPNG,charRanges)
                curCharRanges = splitedRanges.before
                charRanges = splitedRanges.after
                curChars = getTotalCharsByRangs(curCharRanges)
                gridSize = calCanvasSize(paddingFontSize,curChars);
                initCanvas(gridSize.w*paddingFontSize, gridSize.h*paddingFontSize);
                var fontStr = (font['font-italic'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-bold'] || '') + ' ' + (fontSize) + 'px' + ' ' + ('"' + font['font-family'] + '"');
                //padding
                //return drawChars(paddingFontSize,fontStr,options)
                //draw ascii
                // var ogEncoding = options.encoding
                // options.encoding = 'utf-8'
                // drawCharsWithRangesFrom(0,[[1,127]],paddingFontSize,fontStr,options)
                // options.encoding = ogEncoding
                drawCharsWithRangesFrom(0,curCharRanges,paddingFontSize,fontStr,options)
                pngDataUrls.push(fontCanvas.toDataURL())
            }
            return pngDataUrls
        }else{
            //
            console.log('font num invalid')
        }
    }

    /**
     * 返回所有字符集
     * @param widgets
     * @returns {Array}
     */
    function getFontCollections(widgets){
        var fontWidgets,
            fonts = [];
        var paddingRatio = 1.0;
        fontWidgets = widgets.filter(function(widget){
            return ((widget.subType===Type.MyNum)||(widget.subType===Type.MyDateTime)||(widget.subType===Type.MyTextInput))
        });
        fontWidgets.forEach(function(widget){
            var info = widget.info,
                font={},
                result,
                fontFamily = info.fontFamily,
                reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(fontFamily)){
                var str = '';
                for(var i=0;i<fontFamily.length;i++){
                    str += fontFamily.charCodeAt(i).toString(32);
                }
                fontFamily = str;
            }
            //font type, isFull
            info.fullFont = (widget.subType===Type.MyTextInput)

            paddingRatio = info.fontItalic ? 1.3:1.2 //set paddingratio by italic
            
            widget.originFont = {};
            widget.originFont.src = '\\'+fontFamily+'-'+info.fontSize+'-'+info.fontBold+'-'+(info.fontItalic||'null')+'-'+(info['fullFont']?'full':'short')+'.png';
            widget.originFont.w = info.fontSize;
            widget.originFont.h = info.fontSize;
            widget.originFont.W = Math.ceil(info.fontSize*paddingRatio);
            widget.originFont.H = Math.ceil(info.fontSize*paddingRatio);
            widget.originFont.paddingX = Math.ceil(info.fontSize*(paddingRatio-1)/2);
            widget.originFont.paddingY = Math.ceil(info.fontSize*(paddingRatio-1)/2);

            

            widget.originFont.paddingRatio = paddingRatio;
            // result = fonts.some(function(item){
            //     return ((item.fontFamily===info.fontFamily)&&(item.fontSize===info.fontSize)&&(item.fontBold===info.fontBold)&&(item.fontItalic===info.fontItalic));
            // });

            var added = false
            for(var i=0;i<fonts.length;i++){
                var item = fonts[i]
                if ((item.fontFamily===info.fontFamily)&&(item.fontSize===info.fontSize)&&(item.fontBold===info.fontBold)&&(item.fontItalic===info.fontItalic)&&(item.fullFont === info.fullFont)){
                    //same infomation
                    //fullFont overlap not full font
                    // if(!curFont.fullFont&&info.fullFont){
                    //     curFont.fullFont = true
                    // }
                    added = true
                    break
                }
            }
            if(!added){
                font['font-family'] = info.fontFamily;
                font['font-size'] = info.fontSize;
                font['font-bold'] = info.fontBold;
                font['font-italic'] = info.fontItalic;
                font.fullFont = info.fullFont
                font.paddingRatio = paddingRatio
                fonts.push(font);
            }
        });
        return fonts;
    }

    /**
     * 返回正确的stream
     * @param dataUrl
     * @param local
     * @returns {*}
     */
    function pngStream(dataUrl,local){
        if (local){
            var dataBuffer = new Buffer(dataUrl.split(',')[1],'base64');
            return dataBuffer;
        }else{
            return dataUrl
        }
    }

    this.generateSingleFont = generateSingleFont;
    this.getFontCollections = getFontCollections;
    this.pngStream = pngStream;
}]);