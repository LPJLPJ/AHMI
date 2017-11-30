     /**
 * Created by changecheng on 2017/3/8.
 */


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('LayerModel',[], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.LayerModel = factory();
    }
}(function () {
    function Layer(x,y,w,h,hidden,interaction,validSubLayer) {
        this.subLayers = {
            roi:null,
            font:null,
            image:null,
            color:null
        };
        this.x = x||0;
        this.y = y||0;
        this.width = w||0;
        this.height = h||0;
        this.rotateAngle = 0;
        this.hidden = hidden||false;
        this.validSubLayer = validSubLayer||7;//0111
        this.rotateCenterX = 0
        this.rotateCenterY = 0
    }

    function SubLayer() {
        // this.width = w
        // this.height = h
    }

//roi
    function ROISubLayer(mode,p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,alpha,beta) {
        SubLayer.call(this)
        this.p1x = p1x||0;
        this.p1y = p1y||0;

        this.p2x = p2x||0;
        this.p2y = p2y||0;
        this.p3x = p3x||0;
        this.p3y = p3y||0;
        this.p4x = p4y||0;
        this.p4y = p4y||0;
        this.mode = mode||0 // four points
        this.alpha = alpha ||0
        this.beta = beta || 0
    }


    ROISubLayer.prototype = Object.create(SubLayer.prototype);

    ROISubLayer.prototype.constructor = ROISubLayer;

//font
    function FontSubLayer(text,fontStyle) {
        SubLayer.call(this)
        this.text = text;
        this.fontStyle = fontStyle;
    }
    FontSubLayer.prototype = Object.create(SubLayer.prototype);

    FontSubLayer.prototype.constructor = FontSubLayer;

//img
    function TextureSubLayer(imgSrc) {
        SubLayer.call(this)
        this.imgSrc = imgSrc;
    }
    TextureSubLayer.prototype = Object.create(SubLayer.prototype);

    TextureSubLayer.prototype.constructor = TextureSubLayer;

//color
    function ColorSubLayer(colorElems) {
        SubLayer.call(this);
        this.r = colorElems.r;
        this.g = colorElems.g;
        this.b = colorElems.b;
        this.a = colorElems.a;
    }
    ColorSubLayer.prototype = Object.create(SubLayer.prototype);

    ColorSubLayer.prototype.constructor = ColorSubLayer;

    var LayerModel = {
        Layer:Layer,
        ROISubLayer:ROISubLayer,
        FontSubLayer:FontSubLayer,
        TextureSubLayer:TextureSubLayer,
        ColorSubLayer:ColorSubLayer
    }

    return LayerModel


}))

