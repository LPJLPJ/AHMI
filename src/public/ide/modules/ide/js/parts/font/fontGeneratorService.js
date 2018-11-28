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
        var x=0,y=0;
        var column = 0;
        var row = 0;
        options = options||{}
        var curIdx,curCharCode
        var encoding = options.encoding||'utf-8'
        switch(encoding){
            case 'gb2312':
                for(var i = 0;i<(to-from+1);i++){
                    curIdx = i + startIdx
                    row = Math.ceil(curIdx/gridSize.w);
                    column = curIdx - (row-1)*gridSize.w;
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
                for(var i = 0;i<(to-from+1);i++){
                    curIdx = i + startIdx
                    row = Math.ceil(curIdx/gridSize.w);
                    column = curIdx - (row-1)*gridSize.w;
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
        var idxInCanvas = 0
        for(var i=0;i<ranges.length;i++){
            var curRange = ranges[i]
            drawCharsWithRange(idxInCanvas,curRange[0],curRange[1],fontSize,fontStr,options)
            idxInCanvas += curRange[1] - curRange[0] + 1
        }

        //return fontCanvas.toDataURL()
    }


    function drawCharsWithRangesFrom(idxInCanvas,ranges,fontSize,fontStr,options){
        //var idxInCanvas = 0
        for(var i=0;i<ranges.length;i++){
            var curRange = ranges[i]
            drawCharsWithRange(idxInCanvas,curRange[0],curRange[1],fontSize,fontStr,options)
            idxInCanvas += curRange[1] - curRange[0] + 1
        }

        //return fontCanvas.toDataURL()
    }

    /**
     * 绘制字符
     * @param fontSize 字符大小
     * @param fontStr  字符
     * @param options  选项。showGrid，显示格子
     */
    function drawChars(fontSize,fontStr,options) {
        ctx.font = fontStr;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var x=0,y=0;
        var column = 0;
        var row = 0;
        options = options||{}

        var restStart,restCharNum
        if(options.full){
            switch (options.encoding){
                case 'utf-8':
                    restStart = 0x9fff
                    restCharNum = 0x9fff - 0x4e00+1
                break;
                case 'gb2312':
                    restStart = 129
                    restCharNum = 7445-128
                break;
                default:
                    //ascii
                    restStart = 0
                    restCharNum = 0
    
            }
        }else{
            restStart = 0
            restCharNum = 0
        }

        //normal 128 chars
        for(var i = 0;i<128;i++){
            row = Math.ceil(i/gridSize.w);
            column = i - (row-1)*gridSize.w;
            if (options.showGrid) {
                ctx.strokeRect((column-1)*fontSize,(row-1)*fontSize,fontSize,fontSize)
            }

            if(i>=45){
                // 从破折号(减号)开始
                if(i===46){
                    //小数点往左边偏移百分之20%
                    drawChar(i,(column-0.7)*fontSize,(row-0.5)*fontSize)
                }else {
                    drawChar(i,(column-0.5)*fontSize,(row-0.5)*fontSize)
                }
            }

        }

        var curCharIdx,curCharCode
        for(i = 0;i<restCharNum;i++){
            curCharIdx = i + 128
            curCharCode = i + 0x4e00
            row = Math.ceil(curCharIdx/gridSize.w);
            column = curCharIdx - (row-1)*gridSize.w;
            if (options.showGrid) {
                ctx.strokeRect((column-1)*fontSize,(row-1)*fontSize,fontSize,fontSize)
            }

            drawChar(curCharCode,(column-0.5)*fontSize,(row-0.5)*fontSize)

        }
        return fontCanvas.toDataURL()
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
            num += ranges[i][1] - ranges[i][0] + 1
        }

        return num
    }

    function generateSingleFont(font,options) {
        var fontSize = font['font-size']||24;
        options = options||{};
        //add padding
        var paddingRatio = options.paddingRatio||1.0;
        var paddingFontSize= Math.ceil(paddingRatio*fontSize);
        var totalChars 
        var charRanges = []
        if(options.full){
            switch (options.encoding){
                case 'utf-8':
                    charRanges = [
                        [0x4e00,0x9fff]
                    ]
                    
                break;
                case 'gb2312':
                    charRanges = [
                        [0xa1a1,0xfefe]
                    ]
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

        totalChars = getTotalCharsByRangs(charRanges) + getTotalCharsByRangs([[0,127]])

        
        gridSize = calCanvasSize(paddingFontSize,totalChars);
        if (gridSize) {
            initCanvas(gridSize.w*paddingFontSize, gridSize.h*paddingFontSize);
            var fontStr = (font['font-italic'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-bold'] || '') + ' ' + (fontSize) + 'px' + ' ' + ('"' + font['font-family'] + '"');
            //padding
            //return drawChars(paddingFontSize,fontStr,options)
            //draw ascii
            var ogEncoding = options.encoding
            options.encoding = 'utf-8'
            drawCharsWithRangesFrom(0,[[0,127]],paddingFontSize,fontStr,options)
            options.encoding = ogEncoding
            drawCharsWithRangesFrom(128,charRanges,paddingFontSize,fontStr,options)
            return fontCanvas.toDataURL()
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