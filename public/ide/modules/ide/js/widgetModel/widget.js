/**
 * Created by changecheng on 2017/3/9.
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetModel',['./layer'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        console.log(__dirpath)
        var LayerModel = require('./layer');
        module.exports = factory(LayerModel)
    } else {
        // Browser globals
        window.WidgetModel = factory(window.LayerModel);
    }
}(function (LayerModel) {
    var Layer = LayerModel.Layer;
    var ROISubLayer = LayerModel.ROISubLayer;
    var FontSubLayer = LayerModel.FontSubLayer;
    var TextureSubLayer = LayerModel.TextureSubLayer;
    var ColorSubLayer = LayerModel.ColorSubLayer;

    function Widget(x,y,w,h,layers) {
        // this.x = x;
        // this.y = y;
        // this.w = w;
        // this.h = h;
        this.info = {
            left:x,
            top:y,
            width:w,
            height:h
        }
        this.type = 'general'
        if (!layers||!layers.length){
            this.layers= [new Layer(w,h)]
        }else{
            this.layers = layers
        }
    }

    Widget.prototype.toObject = function () {
        return {
            info:{
                left:this.info.left,
                top:this.info.top,
                width:this.info.width,
                height:this.info.height
            },
            layers:this.layers,
            onInitialize:this.onInitialize,
            onMouseDown:this.onMouseDown,
            onMouseUp:this.onMouseUp
        }
    }

    Widget.getTag = function () {
        return 100;
    }

    Widget.setTag = function (value) {
        console.log('set tag: ',value)
        return 1;
    }

    Widget.execute = function (exp) {
        if (exp == '__tag'){
            return this.getTag()
        }else if (typeof  exp == 'string'){
            return "\""+exp+"\"";
        }else{
            return exp;
        }
    }


    function Button(x,y,w,h,text,fontStyle,slices) {
        var layerUp = new Layer(w,h);
        layerUp.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        layerUp.subLayers.texture =new TextureSubLayer(0,0,w,h,slices[0].imgSrc);
        layerUp.subLayers.color = new ColorSubLayer(0,0,w,h,slices[0].color);
        var layerDown = new Layer(w,h);
        layerDown.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        layerDown.subLayers.texture =new TextureSubLayer(0,0,w,h,slices[1].imgSrc);
        layerDown.subLayers.color = new ColorSubLayer(0,0,w,h,slices[1].color);
        var layers = [layerUp,layerDown]
        this.subType = 'Button'
        Widget.call(this,x,y,w,h,layers)
    }

    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;


    // function () {
    //     console.log('onInitializing')
    //     this.layers[1].hidden = true;
    // }
    Button.prototype.onInitialize = [
        // ['temp','a','__tag'],
        // ['if'],

        // ['pred','==','a','100'],
        // ['set','this.layers[1].hidden',true],
        // ['else'],
        // ['set','this.layers[1].hidden',false],
        // ['end if']
    ]

    Button.prototype.onMouseDown = [
        ['set','this.layers[1].hidden',false],
        ['set','this.layers[0].hidden',true]
    ]

    Button.prototype.onMouseUp = [
        ['set','this.layers[1].hidden',true],
        ['set','this.layers[0].hidden',false]
    ]

    var WidgetCommandParser = {};
    var scope = {}
    WidgetCommandParser.transCommand = function (command) {
        var op = command[0];
        var result;
        var variable;
        var value;
        switch (op){
            case 'temp':
                variable = command[1];
                value = Widget.execute(command[2])
                scope[variable] = value;
                result = 'var '+variable+'='+value+';\n';
                break;
            case 'set':
                variable = command[1];
                value = Widget.execute(command[2])
                if (variable in scope){
                    scope[variable] = value;
                }
                result = variable+'='+value+';\n';
                break;
            case 'if':
                result = 'if';
                break;
            case 'pred':
                var pred1 = command[2];
                var pred2 = command[3];
                if (!(pred1 in scope)){
                    pred1 = Widget.execute(pred1)
                }
                if (!(pred2 in scope)){
                    pred2 = Widget.execute(pred2)
                }

                result = "("+pred1+command[1]+pred2+"){\n"
                break;
            case 'else':
                result = '}else{\n'
                break;
            case 'end if':
                result = '}\n';
                break;
        }
        return result;
    }
    WidgetCommandParser.transFunction = function (commands) {
        console.log(JSON.stringify(commands))
        scope = {}
        var result = "";
        for (var i=0;i<commands.length;i++){
            result +=this.transCommand(commands[i])
        }
        return result;
    }


    var WidgetModel = {};

    WidgetModel.Button = Button;
    WidgetModel.Widget = Widget;
    WidgetModel.WidgetCommandParser = WidgetCommandParser;

    return WidgetModel;


}))
