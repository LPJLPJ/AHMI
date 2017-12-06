(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.FontGenerator = factory();
    }
}(function () {

    //SingleFontGenrator
    var font = {};
    var gridSize
    var fontCanvas = document.createElement('canvas')
    var ctx = fontCanvas.getContext('2d')

    // font['font-style'] = widget.info.fontItalic;
    // font['font-weight'] = widget.info.fontBold;
    // font['font-size'] = widget.info.fontSize;
    // font['font-family'] = widget.info.fontFamily;
    // font['font-color'] = widget.info.fontColor;

    function initCanvas(width,height) {
        fontCanvas.width = width
        fontCanvas.height = height
        ctx.clearRect(0,0,width,height)
    }

    function drawChar(charCode,x,y) {
        ctx.fillText(String.fromCharCode(charCode),x,y)
    }

    function drawChars(fontSize,fontStr,options) {
        ctx.font = fontStr
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        var x=0,y=0
        var column = 0
        var row = 0
        for(var i = 0;i<128;i++){
            row = Math.ceil(i/gridSize.w)
            column = i - (row-1)*gridSize.w
            if (options.showGrid) {
                ctx.strokeRect((column-1)*fontSize,(row-1)*fontSize,fontSize,fontSize)
            }

            drawChar(i,(column-0.5)*fontSize,(row-0.5)*fontSize)
        }
        return fontCanvas.toDataURL()
    }

    function calCanvasSize(fontSize,charNum) {
        var wNum = Math.ceil(Math.sqrt(charNum))
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
        var fontSize = font['font-size']||24
        options = options||{}
        //add padding
        var paddingRatio = options.paddingRatio||1.0
        paddingFontSize=paddingRatio*fontSize
        gridSize = calCanvasSize(paddingFontSize,128)
        if (gridSize) {
            initCanvas(gridSize.w*paddingFontSize, gridSize.h*paddingFontSize)
            var fontStr = (font['font-style'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-weight'] || '') + ' ' + (fontSize) + 'px' + ' ' + ('"' + font['font-family'] + '"');
            //padding

            return drawChars(paddingFontSize,fontStr,options)

        }else{
            //
            console.log('font num invalid')
        }
    }

    return {
        generateSingleFont:generateSingleFont

    }
}))