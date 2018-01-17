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
    /**
     * layer构造函数
     * @param  {[type]} x             [起始点x坐标]
     * @param  {[type]} y             [起始点y坐标]
     * @param  {[type]} w             [宽]
     * @param  {[type]} h             [高]
     * @param  {[type]} hidden        [是否隐藏]
     * @param  {[type]} interaction   [是否响应数控（保留参数）]
     * @param  {[type]} validSubLayer [4个图层是否有效，一个15（1111）以内的数字，每个二进制位代表一个subLayer（保留参数）]
     * @return {[type]}               []
     */
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
        this.rotateAngle = 0;  //旋转角
        this.hidden = hidden||false;
        this.validSubLayer = validSubLayer||7;//0111
        this.rotateCenterX = 0;//旋转中心
        this.rotateCenterY = 0;
    }

    function SubLayer() {
        // this.width = w
        // this.height = h
    }

//roi
    function ROISubLayer(mode,p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,alpha,beta) {
        SubLayer.call(this)
        //mode=0:四点模式，四点内图层显示；mode=1，点射模式
        this.mode = mode||0 // four points

        //mode=0时有效,是按顺时针方向的四点相对于layer的坐标
        this.p1x = p1x||0;//mode=1时有效，表示旋转中心x坐标；mode=0时有效，四点模式第一个点的x坐标
        this.p1y = p1y||0;//mode=1时有效，表示旋转中心y坐标；mode=0时有效，四点模式第一个点的y坐标
        this.p2x = p2x||0;
        this.p2y = p2y||0;
        this.p3x = p3x||0;
        this.p3y = p3y||0;
        this.p4x = p4x||0;
        this.p4y = p4y||0;

        //mode=1时有效
        this.alpha = alpha ||0;//起始角，以 ‘以旋转中心点为起始点，水平向右的射线’ 为基线
        this.beta = beta || 0;//偏转后角度
    }


    ROISubLayer.prototype = Object.create(SubLayer.prototype);

    ROISubLayer.prototype.constructor = ROISubLayer;

//font
    /**
     * FontSubLayer构造函数
     * @param  {[type]} text          [文字内容]
     * @param  {[type]} fontStyle     [文字格式对象]
                     * fontStyle{
                            'font-family'
                            'font-color'
                            'font-size'
                            'font-italic'
                            'font-bold'
                            'text-align'
                            'text-baseline'
                    }
     * @return {[type]}               []
     */
    function FontSubLayer(text,fontStyle) {
        SubLayer.call(this)
        this.text = text;
        this.fontStyle = fontStyle;
    }
    FontSubLayer.prototype = Object.create(SubLayer.prototype);
    FontSubLayer.prototype.layerName = 'FontSubLayer';

    FontSubLayer.prototype.constructor = FontSubLayer;

//img
    function TextureSubLayer(textureList,imgSrc,type) {
        SubLayer.call(this)
        if(typeof textureList !== 'object'){
            if (textureList){
                this.textureList = [textureList]
            }else{
                this.textureList = []
            }

        }else{
            this.textureList = textureList||[]
        }

        this.texture = imgSrc||0;
        this.type = type||0 // 0 png
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

