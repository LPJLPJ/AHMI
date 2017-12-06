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
    var fontCanvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    // font['font-style'] = widget.info.fontItalic;
    // font['font-weight'] = widget.info.fontBold;
    // font['font-size'] = widget.info.fontSize;
    // font['font-family'] = widget.info.fontFamily;
    // font['font-color'] = widget.info.fontColor;
    
    function initCanvas(width,height) {
        fontCanvas.width = width
        fontCanvas.height = height
        fontCanvas.clearRect(0,0,width,height)
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

    function generateSingleFont(font) {
        var fontSize = font['font-size']||24
        var canvasSize = canvasSize(fontSize,128)
        if (canvasSize) {
            initCanvas(canvasSize.w, canvasSize.h)
            var fontStr = (font['font-style'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-weight'] || '') + ' ' + (fontSize) + 'px' + ' ' + ('"' + font['font-family'] + '"');



        }else{
            //
            console.log('font num invalid')
        }
    }
}))