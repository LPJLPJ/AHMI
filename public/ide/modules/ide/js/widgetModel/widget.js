/**
 * Created by changecheng on 2017/3/9.
 */
;(function (window) {

    function Widget(x,y,w,h,layers) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if (!layers||!layers.length){
            this.layers= [new Layer(w,h)]
        }else{
            this.layers = layers
        }
    }

    Widget.prototype.toObject = function () {
        return {
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h,
            layers:this.layers,
            onInitialize:this.onInitialize
        }
    }
    
    
    function Button(x,y,w,h,text,fontStyle,slices) {
        var layerUp = new Layer(w,h);
        layerUp.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        layerUp.subLayers.texture =slices[0].imgSrc;
        layerUp.subLayers.color = slices[0].color;
        var layerDown = new Layer(w,h);
        layerDown.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        layerDown.subLayers.texture =slices[1].imgSrc;
        layerDown.subLayers.color = slices[1].color;
        var layers = [layerUp,layerDown]
        Widget.call(this,x,y,w,h,layers)
    }

    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.onInitialize = function () {
        console.log('onInitializing')
        this.layers[1].hidden = true;
    }
    

    var WidgetModel = {};

    WidgetModel.Button = Button;

    window.WidgetModel = WidgetModel;
}(window))