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
        console.log(charCode,String.fromCharCode(charCode));
        ctx.fillText(String.fromCharCode(charCode),x,y)
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

    function generateSingleFont(font,options) {
        var fontSize = font['font-size']||24;
        options = options||{};
        //add padding
        var paddingRatio = options.paddingRatio||1.0;
        var paddingFontSize= Math.ceil(paddingRatio*fontSize);
        gridSize = calCanvasSize(paddingFontSize,128);
        if (gridSize) {
            initCanvas(gridSize.w*paddingFontSize, gridSize.h*paddingFontSize);
            var fontStr = (font['font-italic'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-bold'] || '') + ' ' + (fontSize) + 'px' + ' ' + ('"' + font['font-family'] + '"');
            //padding
            return drawChars(paddingFontSize,fontStr,options)

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
            return ((widget.subType===Type.MyNum)||(widget.subType===Type.MyDateTime))
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
            widget.originFont = {};
            widget.originFont.src = '\\'+fontFamily+'-'+info.fontSize+'-'+info.fontBold+'-'+(info.fontItalic||'null')+'.png';
            widget.originFont.w = info.fontSize;
            widget.originFont.h = info.fontSize;
            widget.originFont.W = Math.ceil(info.fontSize*paddingRatio);
            widget.originFont.H = Math.ceil(info.fontSize*paddingRatio);
            widget.originFont.paddingX = Math.ceil(info.fontSize*(paddingRatio-1)/2);
            widget.originFont.paddingY = Math.ceil(info.fontSize*(paddingRatio-1)/2);

            widget.originFont.paddingRatio = paddingRatio;
            result = fonts.some(function(item){
                return ((item.fontFamily===info.fontFamily)&&(item.fontSize===info.fontSize)&&(item.fontBold===info.fontBold)&&(item.fontItalic===info.fontItalic));
            });
            if(!result){
                font['font-family'] = info.fontFamily;
                font['font-size'] = info.fontSize;
                font['font-bold'] = info.fontBold;
                font['font-italic'] = info.fontItalic;
                fonts.push(font);
            }
        });
        return fonts;
    }

    function getFontCollectionsForGeneralWidgets(widgets){
        var fontWidgets,
            fonts = [];
        fontWidgets = widgets.filter(function(widget){
            return (widget.subType===Type.General)
        });
        var fontSubLayers = []
        fontWidgets.forEach(function(fw){
            fw.layers && fw.layers.length && fw.layers.forEach(function(fwl){
                fwl.subLayers && fwl.subLayers.font && fwl.subLayers.font.fontStyle && fontSubLayers.push(fwl.subLayers.font.fontStyle) 
            })
        })

        fontSubLayers.forEach(function(fsl){
            var font={},
                result,
                fontFamily = fsl.fontFamily,
                reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(fontFamily)){
                var str = '';
                for(var i=0;i<fontFamily.length;i++){
                    str += fontFamily.charCodeAt(i).toString(32);
                }
                fontFamily = str;
            }
            fsl.originFont = {};
            fsl.originFont.src = '\\'+fontFamily+'-'+fsl.fontSize+'-'+fsl.fontBold+'-'+(fsl.fontItalic||'null')+'.png';
            fsl.originFont.w = fsl.fontSize;
            fsl.originFont.h = fsl.fontSize;
            fsl.originFont.W = Math.ceil(fsl.fontSize*paddingRatio);
            fsl.originFont.H = Math.ceil(fsl.fontSize*paddingRatio);
            fsl.originFont.paddingX = Math.ceil(fsl.fontSize*(paddingRatio-1)/2);
            fsl.originFont.paddingY = Math.ceil(fsl.fontSize*(paddingRatio-1)/2);

            fsl.originFont.paddingRatio = paddingRatio;
            result = fonts.some(function(item){
                return ((item['font-family']===fsl.fontFamily)&&(item['font-size']===fsl.fontSize)&&(item['font-bold']===fsl.fontBold)&&(item['font-italic']===fsl.fontItalic));
            });
            if(!result){
                font['font-family'] = fsl.fontFamily;
                font['font-size'] = fsl.fontSize;
                font['font-bold'] = fsl.fontBold;
                font['font-italic'] = fsl.fontItalic;
                fonts.push(font);
            }
        })
        
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
    this.getFontCollectionsForGeneralWidgets = getFontCollectionsForGeneralWidgets;
    this.pngStream = pngStream;
}]);