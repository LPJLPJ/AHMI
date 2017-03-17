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
    function Layer(x,y,w,h,hidden,interaction) {
        this.subLayers = {
            roi:null,
            font:null,
            texture:null,
            color:null
        };
        this.x = x||0;
        this.y = y||0;
        this.width = w||0;
        this.height = h||0;
        this.hidden = hidden||false;
        this.interaction = interaction||true;
    }

    function SubLayer(w,h) {
        this.width = w
        this.height = h
        this.hidden = false
    }

//roi
    function ROISubLayer(w,h,basePoint,theta,beta) {
        SubLayer.call(this,w,h)
        this.basePoint = basePoint;
        this.theta = theta;
        this.beta = beta
    }


    ROISubLayer.prototype = Object.create(SubLayer.prototype);

    ROISubLayer.prototype.constructor = ROISubLayer;

//font
    function FontSubLayer(w,h,text,fontStyle) {
        SubLayer.call(this,w,h)
        this.text = text;
        this.fontStyle = fontStyle;
    }
    FontSubLayer.prototype = Object.create(SubLayer.prototype);

    FontSubLayer.prototype.constructor = FontSubLayer;

//img
    function TextureSubLayer(w,h,texture) {
        SubLayer.call(this,w,h)
        this.texture = texture;
    }
    TextureSubLayer.prototype = Object.create(SubLayer.prototype);

    TextureSubLayer.prototype.constructor = TextureSubLayer;

//color
    function ColorSubLayer(w,h,color) {
        SubLayer.call(this,w,h)
        this.color = color;
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

