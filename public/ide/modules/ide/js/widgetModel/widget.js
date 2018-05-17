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
        this.tag = 'defaultTag'
        this.type = 'general'
        this.mode = 0
        this.arrange = 0
        this.otherAttrs = []
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
            enableHighLight:this.enableHighLight||false,
            highLightNum:0,
            maxHighLightNum:this.maxHighLightNum||0,
            mode:this.mode,
            arrange:this.arrange,
            tag:this.tag,
            layers:this.layers,
            otherAttrs:this.otherAttrs,
            // onInitialize:this.onInitialize,
            // onMouseDown:this.onMouseDown,
            // onMouseUp:this.onMouseUp
        }
    }
    Widget.prototype.commands = {}

    // Widget.getTag = function (tag) {
    //     console.log('ctx tag',tag)
    //     return 100;
    // }

    // Widget.setTag = function (tag,value) {
    //     console.log('set tag: ',value)
    //     return 1;
    // }

    Widget.execute = function (ctx,exp,value) {
        if (exp == '__tag'){
            return this.getTag(ctx.tag)
        }else if (typeof  exp == 'string'){
            return "\""+exp+"\"";
        }else{
            return exp;
        }
    }

    function Param(type,value) {
        this.type = type
        this.value = value
    }

    var Int = 'Int';
    var Str = 'String'
    var ID = 'ID'
    var EXP = 'EXP'

    //general button
    function parseColor(color) {
        var colorElems = []
        var result = {
            r:0,
            g:0,
            b:0,
            a:0
        }
        if (color.indexOf('rgba')!==-1) {
            //rgba(r,g,b,a)
            colorElems = color.split(/[\(|\)]/)[1].split(',').map(function (c) {
                return Number(c)
            })
            result = {
                r:colorElems[0],
                g:colorElems[1],
                b:colorElems[2],
                a:colorElems[3]*255
            }
        }else if (color.indexOf('rgb')!==-1){
            colorElems = color.split(/[\(|\)]/)[1].split(',').map(function (c) {
                    return Number(c)
                })
            result = {
                r:colorElems[0],
                g:colorElems[1],
                b:colorElems[2],
                a:255
            }
        }else{
            throw new Error('parsing color error: '+color)
        }
        return result
    }

    function Button(x,y,w,h,text,fontStyle,slices,highLight) {
        var layerUp = new Layer(0,0,w,h);
        // var textureList = (slices||[]).map(function (s) {
        //     return s.imgSrc
        // })
        var colorElems
        layerUp.subLayers.font = new FontSubLayer(text,fontStyle);
        layerUp.subLayers.image =new TextureSubLayer([slices[0].imgSrc]);
        colorElems = parseColor(slices[0].color)
        layerUp.subLayers.color = new ColorSubLayer(colorElems);
        var layerDown = new Layer(0,0,w,h);
        layerDown.subLayers.font = new FontSubLayer(text,fontStyle);
        layerDown.subLayers.image =new TextureSubLayer([slices[1].imgSrc]);
        colorElems = parseColor(slices[1].color)
        layerDown.subLayers.color = new ColorSubLayer(colorElems);
        var layers = [layerDown,layerUp];
        var layerHighlight;
        if (highLight) {
            layerHighlight = new Layer(0,0,w,h);
            layerHighlight.subLayers.image =new TextureSubLayer([slices[2].imgSrc]);
            colorElems = parseColor(slices[2].color)
            layerHighlight.subLayers.color = new ColorSubLayer(colorElems);
            layerHighlight.hidden = true;
            layers.push(layerHighlight)
            this.enableHighLight  = true;
            this.maxHighLightNum = 1;
        }
        this.subType = 'Button'
        Widget.call(this,x,y,w,h,layers)
    }
    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;
    // function () {
    //     console.log('onInitializing')
    //     this.layers[1].hidden = true;
    // }
    Button.prototype.commands = {}
    Button.prototype.commands.onInitialize = [
        ['temp','a',new Param(EXP,'this.mode')],
        ['setTag',new Param(Int,1)],
        ['set',new Param(ID,'a'),new Param(Int,3)],
        ['if'],
        ['gte',new Param(ID,'a'),new Param(Int,100)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        ['else'],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['end']
    ]
    Button.prototype.commands.onMouseDown = [
        ['temp','b',new Param(EXP,'this.mode')],
        ['print',new Param(ID,'b')],
        ['if'],
        ['eq',new Param(ID,'b'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['setTag',new Param(Int,0)],
        ['else'],
        ['temp','c',new Param(Int,0)],
        ['getTag','c'],
        ['if'],
        ['gt',new Param(ID,'c'),new Param(Int,0)],
        //bounce up
        // ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,1)],
        // ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['setTag',new Param(Int,0)],
        ['else'],
        // ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,0)],
        // ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        ['setTag',new Param(Int,1)],
        ['end'],
        ['end']

        //

    ]
    Button.prototype.commands.onMouseUp = [
        ['temp','b',new Param(EXP,'this.mode')],
        ['if'],
        ['eq',new Param(ID,'b'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        ['setTag',new Param(Int,12)],
        ['end']
    ]
    Button.prototype.commands.onTagChange = [
        ['temp','a',new Param(Int,0)],
        ['temp','b',new Param(EXP,'this.mode')],
        ['getTag','a'],
        ['if'],
        ['eq',new Param(ID,'b'),new Param(Int,1)],
        ['if'],
        ['gt',new Param(ID,'a'),new Param(Int,0)],
        //bounce up
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['else'],
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        ['end'],
        ['end']
    ]


    //button group
    function ButtonGroup(x,y,w,h,num,align,space,slices,highLight) {
        var sWidth = 0;
        var sHeight = 0;
        var colorElems;
        var layers = [];
        // this.arrange = align;
        if (align==0) {
            //hori
            sWidth = Math.floor((w-(num-1)*space)/num);
            sHeight = h;
            for (var i=0;i<num;i++){
                var upLayer = new Layer(i*(sWidth+space),0,sWidth,sHeight);
                upLayer.subLayers.image = new TextureSubLayer(slices[2*i].imgSrc);
                colorElems = parseColor(slices[2*i].color);
                upLayer.subLayers.color = new ColorSubLayer(colorElems);
                var downLayer = new Layer(i*(sWidth+space),0,sWidth,sHeight,true);
                downLayer.subLayers.image = new TextureSubLayer(slices[2*i+1].imgSrc);
                colorElems = parseColor(slices[2*i+1].color);
                downLayer.subLayers.color = new ColorSubLayer(colorElems);
                layers.push(upLayer);
                layers.push(downLayer);
            }
            if(highLight){
                var highLightLayer = new Layer(0,0,sWidth,sHeight,true);
                highLightLayer.subLayers.image = new TextureSubLayer(slices[slices.length-1].imgSrc);
                colorElems = parseColor(slices[slices.length-1].color);
                highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                layers.push(highLightLayer);
                this.enableHighLight = true;
                this.maxHighLightNum = num;
            }
        }else{
            //ver
            sWidth = w;
            sHeight = Math.floor((h-(num-1)*space)/num);
            for (var i=0;i<num;i++){
                var upLayer = new Layer(0,i*(sHeight+space),sWidth,sHeight);
                upLayer.subLayers.image = new TextureSubLayer(slices[2*i].imgSrc);
                colorElems = parseColor(slices[2*i].color);
                upLayer.subLayers.color = new ColorSubLayer(colorElems);
                var downLayer = new Layer(0,i*(sHeight+space),sWidth,sHeight,true);
                downLayer.subLayers.image = new TextureSubLayer(slices[2*i+1].imgSrc);
                colorElems = parseColor(slices[2*i+1].color);
                downLayer.subLayers.color = new ColorSubLayer(colorElems);
                layers.push(upLayer);
                layers.push(downLayer);
            }
            if(highLight){
                var highLightLayer = new Layer(0,0,sWidth,sHeight,true);
                highLightLayer.subLayers.image = new TextureSubLayer(slices[slices.length-1].imgSrc);
                colorElems = parseColor(slices[slices.length-1].color);
                highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                layers.push(highLightLayer);
                this.enableHighLight = true;
                this.maxHighLightNum = num;
            }
        }
        this.subType = 'ButtonGroup';
        Widget.call(this,x,y,w,h,layers)
    }
    ButtonGroup.prototype = Object.create(Widget.prototype);
    ButtonGroup.prototype.constructor = ButtonGroup;
    ButtonGroup.prototype.commands.onInitialize = [
        // ['temp','a',new Param(EXP,'this.mode')],
        // ['setTag',new Param(Int,1)],
        // ['set',new Param(ID,'a'),new Param(Int,3)],
        // ['if'],
        // ['gte',new Param(ID,'a'),new Param(Int,100)],
        // ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        // ['else'],
        // ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        // ['end']
    ]
    ButtonGroup.prototype.commands.onMouseDown = [
        ['temp','a',new Param(Int,0)],
        ['temp','b',new Param(Int,0)],
        ['temp','c',new Param(Int,0)],
        ['set',new Param(ID,'c'),new Param(EXP,'this.layers.length')],
        // ['divide','c',new Param(Int,2)],
        ['minus','c',new Param(Int,2)],
        // ['getMouseRW','a',new Param(Int,0)],
        // ['getMouseRW','b',new Param(Int,1)],
        ['set',new Param(ID,'a'),new Param(EXP,'this.innerX')],
        ['set',new Param(ID,'b'),new Param(EXP,'this.innerY')],
        // ['print',new Param(ID,'a'),'innerX'],
        // ['print',new Param(ID,'b'),'innerY'],
        ['temp','lx',new Param(Int,0)],
        ['temp','ly',new Param(Int,0)],
        ['temp','lw',new Param(Int,0)],
        ['temp','lh',new Param(Int,0)],
        ['temp','rx',new Param(Int,0)],
        ['temp','ry',new Param(Int,0)],
        ['while'],
        ['gte',new Param(ID,'c'),new Param(Int,0)],
        // ['print',new Param(ID,'c'),'while c'],
        ['set',new Param(ID,'lx'),new Param(EXP,'this.layers.c.x')],
        ['set',new Param(ID,'ly'),new Param(EXP,'this.layers.c.y')],
        ['set',new Param(ID,'lw'),new Param(EXP,'this.layers.c.width')],
        ['set',new Param(ID,'lh'),new Param(EXP,'this.layers.c.height')],
        ['set',new Param(ID,'rx'),new Param(ID,'lx')],
        ['set',new Param(ID,'ry'),new Param(ID,'ly')],
        ['add','rx',new Param(ID,'lw')],
        ['add','ry',new Param(ID,'lh')],
        // ['print',new Param(ID,'lx'),'lx'],
        // ['print',new Param(ID,'rx'),'rx'],
        // ['print',new Param(ID,'ly'),'ly'],
        // ['print',new Param(ID,'ry'),'ry'],
        ['if'],
        ['gte',new Param(ID,'a'),new Param(ID,'lx')],
        // ['print',new Param(Int,0),'lx ok'],
        ['if'],
        ['gt',new Param(ID,'rx'),new Param(ID,'a')],
        // ['print',new Param(Int,0),'rx ok'],
        ['if'],
        ['gte',new Param(ID,'b'),new Param(ID,'ly')],
        // ['print',new Param(Int,0),'ly ok'],
        ['if'],
        ['gt',new Param(ID,'ry'),new Param(ID,'b')],
        // ['print',new Param(Int,0),'ry ok'],
        //hit
        ['print',new Param(ID,'c'),'hit'],
        ['divide','c',new Param(Int,2)],
        ['setTag',new Param(ID,'c')],
        ['set',new Param(ID,'c'),new Param(Int,0)],
        ['end'],
        ['end'],
        ['end'],
        ['end'],
        ['minus','c',new Param(Int,2)],
        ['end']


    ]
    ButtonGroup.prototype.commands.onMouseUp = [
        // ['temp','b',new Param(EXP,'this.mode')],
        // ['if'],
        // ['eq',new Param(ID,'b'),new Param(Int,0)],
        // ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,0)],
        // ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
        // ['setTag',new Param(Int,12)],
        // ['end']
    ]
    ButtonGroup.prototype.commands.onTagChange = [
        ['temp','a',new Param(Int,0)],
        ['temp','b',new Param(Int,0)],
        ['temp','c',new Param(Int,0)],
        ['set',new Param(ID,'a'),new Param(EXP,'this.layers.length')],
        ['set',new Param(ID,'c'),new Param(ID,'a')],
        ['divide','c',new Param(Int,2)],
        ['while'],
        ['gt',new Param(ID,'a'),new Param(Int,0)],
        ['minus','a',new Param(Int,1)],
        ['print',new Param(ID,'a')],
        ['set',new Param(EXP,'this.layers.a.hidden'),new Param(Int,1)],
        ['minus','a',new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.a.hidden'),new Param(Int,0)],
        ['end'],
        ['getTag','a'],
        ['print',new Param(ID,'a')],
        ['if'],
        ['gte',new Param(ID,'a'),new Param(Int,0)],
        ['if'],
        ['gt',new Param(ID,'c'),new Param(ID,'a')],
        ['multiply','a',new Param(Int,2)],
        ['set',new Param(EXP,'this.layers.a.hidden'),new Param(Int,1)],
        ['add','a',new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.a.hidden'),new Param(Int,0)],
        ['end'],
        ['end']
        
    ]

    //minAngle,maxAngle,minValue,maxValue,lowAlarmValue,maxAlarmValue
    function Dashboard(x,y,w,h,mode,texList,valueObj) {
        valueObj = valueObj||{}
        var slices
        var bgLayer,pointerLayer,lightLayer
        var layers = []
        if (mode == 0) {
            // console.log(slices)
            slices = [texList[0].slices[0],texList[1].slices[0]]
            bgLayer = new Layer(0,0,w,h)
            bgLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
            bgLayer.subLayers.color = new ColorSubLayer(parseColor(slices[0].color))
            var pointerW = valueObj.pointerLength/Math.sqrt(2)
            pointerLayer = new Layer(w/2,h/2,pointerW,pointerW)
            pointerLayer.subLayers.image = new TextureSubLayer(slices[1].imgSrc);
            pointerLayer.subLayers.color = new ColorSubLayer(parseColor(slices[1].color))
            layers.push(bgLayer)
            layers.push(pointerLayer)
        }else if(mode==1){
            slices = [texList[0].slices[0],texList[1].slices[0],texList[2].slices[0]]
            bgLayer = new Layer(0,0,w,h)
            bgLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
            bgLayer.subLayers.color = new ColorSubLayer(parseColor(slices[0].color))
            lightLayer = new Layer(0,0,w,h)
            lightLayer.subLayers.image = new TextureSubLayer(slices[2].imgSrc);
            lightLayer.subLayers.color = new ColorSubLayer(parseColor(slices[2].color))
            lightLayer.subLayers.roi = new ROISubLayer(1)
            var pointerW = valueObj.pointerLength/Math.sqrt(2)
            pointerLayer = new Layer(w/2,h/2,pointerW,pointerW)
            pointerLayer.subLayers.image = new TextureSubLayer(slices[1].imgSrc);
            pointerLayer.subLayers.color = new ColorSubLayer(parseColor(slices[1].color))

            layers.push(bgLayer)
            layers.push(pointerLayer)
            layers.push(lightLayer)
        }else if (mode==2) {
            slices = [texList[0].slices[0]]
            lightLayer = new Layer(0,0,w,h)
            lightLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
            lightLayer.subLayers.color = new ColorSubLayer(parseColor(slices[0].color))
            lightLayer.subLayers.roi = new ROISubLayer(1)
            layers.push(lightLayer)
            
        }
        Widget.call(this,x,y,w,h,layers)
        
    }
    Dashboard.prototype = Object.create(Widget.prototype);
    Dashboard.prototype.constructor = Dashboard;


    function RotateImg(x,y,w,h,slice) {

        var bgLayer
        var layers = []
        bgLayer = new Layer(0,0,w,h)
        bgLayer.subLayers.image = new TextureSubLayer(slice.imgSrc);
        bgLayer.subLayers.color = new ColorSubLayer(parseColor(slice.color))
        layers.push(bgLayer)
        Widget.call(this,x,y,w,h,layers)

    }
    RotateImg.prototype = Object.create(Widget.prototype);
    RotateImg.prototype.constructor = RotateImg;

    //TextArea
    function TextArea(x,y,w,h,text,fontStyle,slice) {

        var bgLayer
        var layers = []
        bgLayer = new Layer(0,0,w,h)
        bgLayer.subLayers.font = new FontSubLayer(text,fontStyle)
        bgLayer.subLayers.image = new TextureSubLayer(slice.imgSrc);
        bgLayer.subLayers.color = new ColorSubLayer(parseColor(slice.color))
        layers.push(bgLayer)
        Widget.call(this,x,y,w,h,layers)

    }
    TextArea.prototype = Object.create(Widget.prototype);
    TextArea.prototype.constructor = TextArea;

    //
    function ScriptTrigger(x,y,w,h) {

        var layers = []

        Widget.call(this,x,y,w,h,layers)

    }
    ScriptTrigger.prototype = Object.create(Widget.prototype);
    ScriptTrigger.prototype.constructor = ScriptTrigger;

    function Video(x,y,w,h,slice) {

        var bgLayer
        var layers = []
        bgLayer = new Layer(0,0,w,h)
        bgLayer.subLayers.image = new TextureSubLayer(slice.imgSrc);
        bgLayer.subLayers.color = new ColorSubLayer(parseColor(slice.color))
        layers.push(bgLayer)

        Widget.call(this,x,y,w,h,layers)

    }
    Video.prototype = Object.create(Widget.prototype);
    Video.prototype.constructor = Video;


    //num
    // "minValue": 0,
    // "maxValue": 100,
    // "lowAlarmValue": 0,
    // "highAlarmValue": 100,
    // "noInit": "NO",
    // "numModeId": "0",
    // "frontZeroMode": "0",
    // "symbolMode": "0",
    // "decimalCount": 2,
    // "numOfDigits": 3,
    // "overFlowStyle": "0",
    // "align": "center",
    // "arrange": "horizontal",
    // "numValue": 4,
    // "fontFamily": "宋体",
    // "fontSize": 30,
    // "fontColor": "rgba(255,255,255,1)",
    // "fontBold": "100",
    // "fontItalic": "",
    // "maxFontWidth": 21,

    function Num(x,y,w,h,valueObj,fontStyle) {

        // var bgLayer
        // var layers = []
        // bgLayer = new Layer(0,0,w,h)
        // bgLayer.subLayers.image = new TextureSubLayer(slice.imgSrc);
        // bgLayer.subLayers.color = new ColorSubLayer(parseColor(slice.color))
        // layers.push(bgLayer)
        console.log(valueObj)
        var decimalCount = valueObj.decimalCount
        var numOfDigits = valueObj.numOfDigits

        var maxFontWidth = valueObj.maxFontWidth

        var spacing = Number(valueObj.spacing);
        var paddingRatio = Number(valueObj.paddingRatio)||0;

        var xCoordinate = (maxFontWidth * decimalCount > w) ? maxFontWidth/2 :(w-maxFontWidth*decimalCount)/2;//如果装不下字符串，从maxFontWidth处开始显示
        if(paddingRatio!==0)xCoordinate=paddingRatio*maxFontWidth;

        var layers = []
        var symbol,symbolLayer
        if (valueObj.symbolMode==0) {
            symbol = false
        }else{
            symbol = true;
        }
        var mW = valueObj.maxFontWidth
        if (!mW) {
            return
        }

        var curX = xCoordinate;
        if (symbol) {
            symbolLayer = new Layer(curX,0,mW,h);
            symbolLayer.subLayers.font = new FontSubLayer('+',fontStyle)
            layers.push(symbolLayer)
            curX +=mW+spacing;
        }



        var curDigitLayer
        for (var i=0;i<(numOfDigits-decimalCount);i++){
            //add decimal digits
            curDigitLayer = new Layer(curX,0,mW,h)
            console.log(curX,mW)
            curDigitLayer.subLayers.font= new FontSubLayer('0',fontStyle)
            // curDigitLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(255,0,0)'))
            layers.push(curDigitLayer)
            curX = curX+mW+spacing

        }
        if (decimalCount>0) {
            var curDotLayer = new Layer(curX,0,0.5*mW,h)
            curDotLayer.subLayers.font = new FontSubLayer('.',fontStyle)
            layers.push(curDotLayer)
            curX = Math.floor(curX+0.5*mW+spacing);
            for(var i=0;i<decimalCount;i++){
                curDigitLayer = new Layer(curX,0,mW,h)
                curDigitLayer.subLayers.font = new FontSubLayer('0',fontStyle)
                // curDigitLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(255,0,0)'))
                layers.push(curDigitLayer)
                curX+=mW+spacing
            }
        }

        if (valueObj.enableAnimation){
            layers = layers.concat(_.cloneDeep(layers))
        }


        Widget.call(this,x,y,w,h,layers)

    }
    Num.prototype = Object.create(Widget.prototype);
    Num.prototype.constructor = Num;


    function SlideBlock(x,y,w,h,arrange,blockInfo,slices) {
        var layers=[]
        var bgLayer,blockLayer
        bgLayer = new Layer(0,0,w,h)
        bgLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        bgLayer.subLayers.color = new ColorSubLayer(parseColor(slices[0].color))
        layers.push(bgLayer)
        var blockW = blockInfo.w
        var blockH = blockInfo.h
        if (blockW&&blockH) {
            if (arrange == 'horizontal') {
                blockLayer = new Layer(0,-(blockH-h)/2,blockW,blockH)
            }else{
                blockLayer = new Layer(-(blockW-w)/2,0,blockW,blockH)
            }
            blockLayer.subLayers.image = new TextureSubLayer(slices[1].imgSrc)
            blockLayer.subLayers.color = new ColorSubLayer(parseColor(slices[1].color))
            layers.push(blockLayer)
        }

        Widget.call(this,x,y,w,h,layers)

    }
    SlideBlock.prototype = Object.create(Widget.prototype);
    SlideBlock.prototype.constructor = SlideBlock;

    //progress
    function Progress(x,y,w,h,info,slices){
        var layerBackground = new Layer(0,0,w,h);
        var layerProcess = new Layer(0,0,w,h);
        var layerCursor = new Layer(0,0,w,h);
        var colorElems;

        var mode = Number(info.progressModeId);
        var cursor = Number(info.cursor);
        var layersCnt = slices.length;

        //background
        colorElems = parseColor(slices[0].color);
        layerBackground.subLayers.color = new ColorSubLayer(colorElems);
        layerBackground.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        if(mode==0){
            //progress
            colorElems = parseColor(slices[1].color);
            layerProcess.subLayers.color = new ColorSubLayer(colorElems);
            layerProcess.subLayers.image = new TextureSubLayer(slices[1].imgSrc);
            layerProcess.subLayers.roi =  new ROISubLayer(0);
        }else if(mode==1){
            //color
            colorElems = parseColor(slices[1].color);
            layerProcess.subLayers.color = new ColorSubLayer(colorElems);
        }else if(mode==3){
            colorElems = parseColor(slices[1].color);
            layerProcess.subLayers.color = new ColorSubLayer(colorElems);
        }
        //cursor
        if(cursor==1){
            layerCursor.subLayers.image = new TextureSubLayer(slices[layersCnt-1].imgSrc);
        }

        var layers = [layerBackground,layerProcess,layerCursor];
        this.subType = 'Progress';
        Widget.call(this,x,y,w,h,layers);
    }
    Progress.prototype = Object.create(Widget.prototype);
    Progress.prototype.constructor = Progress;

    //switch
    function Switch(x,y,w,h,info,slices){
        var layer = new Layer(0,0,w,h);
        var colorElems = parseColor(slices[0].color);
        layer.subLayers.color = new ColorSubLayer(colorElems);
        layer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        var layers = [layer];
        this.subType = 'Switch';
        Widget.call(this,x,y,w,h,layers);
    }
    Switch.prototype = Object.create(Widget.prototype);
    Switch.prototype.constructor = Switch;

    //slide
    function Slide(x,y,w,h,info,slices){
        var layers = [];
        var colorElems;
        for(var i=0;i<slices.length;i++){
            layers[i] = new Layer(0,0,w,h);
            colorElems = parseColor(slices[i].color);
            layers[i].subLayers.color = new ColorSubLayer(colorElems);
            layers[i].subLayers.image = new TextureSubLayer(slices[i].imgSrc);
        }
        this.subType = 'Slide';
        Widget.call(this,x,y,w,h,layers);
    }
    Slide.prototype = Object.create(Widget.prototype);
    Slide.prototype.constructor = Slide;

    //Animation
    function Animation(x,y,w,h,info,slices){
        var layers = [];
        var colorElems;
        for(var i=0;i<slices.length;i++){
            layers[i] = new Layer(0,0,w,h);
            colorElems = parseColor(slices[i].color);
            layers[i].subLayers.color = new ColorSubLayer(colorElems);
            layers[i].subLayers.image = new TextureSubLayer(slices[i].imgSrc);
        }
        this.subType = 'Slide';
        Widget.call(this,x,y,w,h,layers);
    }
    Animation.prototype = Object.create(Widget.prototype);
    Animation.prototype.constructor = Animation;

    //DateTime
    function DateTime(x,y,w,h,info,fontStyle,slices){
        var dateTimeModeId = Number(info.dateTimeModeId),
            maxFontWidth = info.maxFontWidth,
            sWidth = maxFontWidth,
            sHeight = h,
            highLight = !info.disableHighlight,
            dx = 0,
            fontLayer = null,
            highLightLayer = null,
            fontLayersNum = 0,
            highLightLayerNum = 0,
            layers = [],
            colorElems = '',
            i = 0;

        var textNum = 0

        switch(dateTimeModeId){
            case 0:
                textNum = 8
                break
            case 1:
                textNum = 5
                break
            case 2:
            case 3:
                textNum = 10
                break
        }

        var spacing = Number(info.spacing);
        var paddingRatio = Number(info.paddingRatio)||0;

        var xCoordinate = (maxFontWidth * textNum > w) ? maxFontWidth/2 :(w-maxFontWidth*textNum)/2;//如果装不下字符串，从maxFontWidth处开始显示
        if(paddingRatio!==0)xCoordinate=paddingRatio*maxFontWidth;


        switch (dateTimeModeId){
            case 0:
                //console.log('时分秒');
                fontLayersNum = 8;
                for(i=0;i<fontLayersNum;i++){
                    dx = xCoordinate+i*(maxFontWidth+spacing);
                    fontLayer = new Layer(dx,0,sWidth,sHeight);
                    if(i==2||i==5){
                        fontLayer.subLayers.font = new FontSubLayer(':',fontStyle);
                    }else{
                        fontLayer.subLayers.font = new FontSubLayer('0',fontStyle);
                    }
                    layers.push(fontLayer);
                    // dx = dx+maxFontWidth;
                }
                if(highLight){
                    highLightLayerNum = 3;
                    sWidth = 2*maxFontWidth+spacing;
                    dx = xCoordinate;
                    for(i=0;i<highLightLayerNum;i++){
                        highLightLayer = new Layer(dx,0,sWidth,sHeight);
                        highLightLayer.subLayers.image = new TextureSubLayer(slices.imgSrc);
                        colorElems = parseColor(slices.color);
                        highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                        layers.push(highLightLayer);
                        dx += 3*(maxFontWidth+spacing);
                    }
                    this.enableHighLight = true;
                    this.maxHighLightNum = highLightLayerNum;
                }
                break;
            case 1:
                //console.log('时分');
                fontLayersNum = 5;
                for(i=0;i<fontLayersNum;i++){
                    dx = xCoordinate+i*(maxFontWidth+spacing);
                    fontLayer = new Layer(dx,0,sWidth,sHeight);
                    if(i==2){
                        fontLayer.subLayers.font = new FontSubLayer(':',fontStyle);
                    }else{
                        fontLayer.subLayers.font = new FontSubLayer('0',fontStyle);
                    }
                    layers.push(fontLayer);
                }
                if(highLight){
                    highLightLayerNum = 2;
                    sWidth = 2*maxFontWidth+spacing;
                    dx = xCoordinate;
                    for(i=0;i<highLightLayerNum;i++){
                        highLightLayer = new Layer(dx,0,sWidth,sHeight);
                        highLightLayer.subLayers.image = new TextureSubLayer(slices.imgSrc);
                        colorElems = parseColor(slices.color);
                        highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                        layers.push(highLightLayer);
                        dx += 3*(maxFontWidth+spacing);
                    }
                    this.enableHighLight = true;
                    this.maxHighLightNum = highLightLayerNum;
                }
                break;
            case 2:
                //console.log('斜杠日期');
                fontLayersNum = 10;
                for(i=0;i<fontLayersNum;i++){
                    dx = xCoordinate+i*(maxFontWidth+spacing);
                    fontLayer = new Layer(dx,0,sWidth,sHeight);
                    if(i==4||i==7){
                        fontLayer.subLayers.font = new FontSubLayer('/',fontStyle);
                    }else{
                        fontLayer.subLayers.font = new FontSubLayer('0',fontStyle);
                    }
                    layers.push(fontLayer);
                }
                if(highLight){
                    highLightLayerNum = 3;
                    sWidth = 4*maxFontWidth+3*spacing;
                    dx = xCoordinate;
                    for(i=0;i<highLightLayerNum;i++){
                        highLightLayer = new Layer(dx,0,sWidth,sHeight);
                        highLightLayer.subLayers.image = new TextureSubLayer(slices.imgSrc);
                        colorElems = parseColor(slices.color);
                        highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                        layers.push(highLightLayer);
                        if(i===0){
                            dx += 5*(maxFontWidth+spacing);
                            sWidth = 2*maxFontWidth+spacing;
                        }else{
                            dx += 3*(maxFontWidth+spacing);
                        }
                    }
                    this.enableHighLight = true;
                    this.maxHighLightNum = highLightLayerNum;
                }
                break;
            case 3:
                //console.log('减号日期');
                fontLayersNum = 10;
                for(i=0;i<fontLayersNum;i++){
                    dx = xCoordinate+i*(maxFontWidth+spacing);
                    fontLayer = new Layer(dx,0,sWidth,sHeight);
                    if(i==4||i==7){
                        fontLayer.subLayers.font = new FontSubLayer('-',fontStyle);
                    }else{
                        fontLayer.subLayers.font = new FontSubLayer('0',fontStyle);
                    }
                    layers.push(fontLayer);
                    // dx =  dx+maxFontWidth;
                }
                if(highLight){
                    highLightLayerNum = 3;
                    sWidth = 4*maxFontWidth+3*spacing;
                    dx = xCoordinate;
                    for(i=0;i<highLightLayerNum;i++){
                        highLightLayer = new Layer(dx,0,sWidth,sHeight);
                        highLightLayer.subLayers.image = new TextureSubLayer(slices.imgSrc);
                        colorElems = parseColor(slices.color);
                        highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                        layers.push(highLightLayer);
                        if(i===0){
                            dx += 5*(maxFontWidth+spacing);
                            sWidth = 2*maxFontWidth;
                        }else{
                            dx += 3*(maxFontWidth+spacing);
                        }
                    }
                    this.enableHighLight = true;
                    this.maxHighLightNum = highLightLayerNum;
                }
                break;
            default:
                //console.log('时分秒');
                fontLayersNum = 8;
                for(i=0;i<fontLayersNum;i++){
                    dx = xCoordinate+i*(maxFontWidth+spacing);
                    fontLayer = new Layer(dx,0,sWidth,sHeight);
                    if(i==2||i==5){
                        fontLayer.subLayers.font = new FontSubLayer(':',fontStyle);
                    }else{
                        fontLayer.subLayers.font = new FontSubLayer('0',fontStyle);
                    }
                    layers.push(fontLayer);
                    // dx = dx+maxFontWidth;
                }
                if(highLight){
                    highLightLayerNum = 3;
                    sWidth = 2*maxFontWidth+spacing;
                    dx = xCoordinate;
                    for(i=0;i<highLightLayerNum;i++){
                        highLightLayer = new Layer(dx,0,sWidth,sHeight);
                        highLightLayer.subLayers.image = new TextureSubLayer(slices.imgSrc);
                        colorElems = parseColor(slices.color);
                        highLightLayer.subLayers.color = new ColorSubLayer(colorElems);
                        layers.push(highLightLayer);
                        dx += 3*(maxFontWidth+spacing);
                    }
                    this.enableHighLight = true;
                    this.maxHighLightNum = highLightLayerNum;
                }
                break;
        }

        this.subType = 'Datetime';
        Widget.call(this,x,y,w,h,layers);
    };
    DateTime.prototype = Object.create(Widget.prototype);
    DateTime.prototype.constructor = DateTime;


    //TexNum
    function TexNum(x,y,w,h,valueObj,slices){
        var layers = [];                           //图层数组
        var layerCount=valueObj.numOfDigits;       //数字位数
        var symbol=valueObj.symbolMode;            //符号模式
        var decimalCount = valueObj.decimalCount;  //小数位
        var mH = valueObj.characterH;              //字符宽度
        var mW = valueObj.characterW;              //字符宽度

        //生成textureList
        var textureList=[];
        for(var i=0;i<slices.length;i++){
            textureList.push(slices[i].imgSrc)
        }
        //字符总数
        // if (symbol==1) {layerCount++;}
        // if(decimalCount>0){layerCount++;}
        layerCount+=2;//无论是否有符号和小数点，都按有算

        //添加图层
        var curDigitLayer;
        for (i=0;i<layerCount;i++){
                curDigitLayer = new Layer(0,0,mW,mH,true);
                curDigitLayer.subLayers.image = new TextureSubLayer(textureList);
                layers.push(curDigitLayer);
        }

        this.subType = 'TexNum';
        Widget.call(this,x,y,w,h,layers);
    };
    TexNum.prototype = Object.create(Widget.prototype);
    TexNum.prototype.constructor = TexNum;

    //Selector
    function Selector(x,y,w,h,valueObj,sliceBg,unSelectedImg,selectedImg,sliceHighlight){
        //图层数组
        var layers = [];

        //位置，宽高
        var x=x;
        var y=y;
        var w=w;
        var h=h;
        var itemHeight=valueObj.itemHeight;
        var itemWidth=valueObj.itemWidth;
        var selectorHeight=valueObj.selectorHeight;
        var selectorWidth=valueObj.selectorWidth;

        //属性
        var itemCount=valueObj.itemCount;
        var curValue=valueObj.curValue;
        var itemShowCount=valueObj.itemShowCount;
        //字体
        var titleFont={
            'font-family':valueObj.titleFont.fontFamily,
            'font-color':valueObj.titleFont.fontColor,
            'font-size':valueObj.titleFont.fontSize,
            'font-italic':valueObj.titleFont.fontItalic,
            'font-bold':valueObj.titleFont.fontBold,
            'text-align':'start',
            'text-baseline':'top'
        }

        //标题
        var selectorTitle=valueObj.selectorTitle;

        //高亮
        this.disableHighlight=valueObj.disableHighlight;

        //纹理
        var sliceBg=sliceBg;
        var selectedImg=selectedImg;
        var unSelectedImg=unSelectedImg;

        //后景层（下）
        tempH=h/2+selectorHeight/2-(curValue+1)*itemHeight;
        curLayer = new Layer(selectorWidth/2-itemWidth/2,tempH,itemWidth,itemHeight*itemCount,true);
        curLayer.subLayers.image = new TextureSubLayer(unSelectedImg);
        curLayer.subLayers.roi = new ROISubLayer(0,0, (curValue+1)*itemHeight,itemWidth,(curValue+1)*itemHeight,itemWidth,(curValue+1)*itemHeight+itemShowCount*itemHeight,0,(curValue+1)*itemHeight+itemShowCount*itemHeight);
        layers.push(curLayer);

        //后景层（上）
        tempH=-(curValue-itemShowCount)*itemHeight;
        curLayer = new Layer(selectorWidth/2-itemWidth/2,tempH,itemWidth,itemHeight*itemCount,true);
        curLayer.subLayers.image = new TextureSubLayer(unSelectedImg);
        curLayer.subLayers.roi = new ROISubLayer(0,0,-tempH,itemWidth,-tempH,itemWidth,-tempH+itemShowCount*itemHeight,0,-tempH+itemShowCount*itemHeight);
        layers.push(curLayer);

        //背景层
        curLayer = new Layer(0,h/2-selectorHeight/2,selectorWidth,selectorHeight,true);
        if(sliceBg.imgSrc){
            curLayer.subLayers.image = new TextureSubLayer(sliceBg.imgSrc);
        }else{
            var colorElems = parseColor(sliceBg.color);
            curLayer.subLayers.color = new ColorSubLayer(colorElems);
        }
        layers.push(curLayer);

        //前景层
        var startH=h/2-selectorHeight/2;
        var tempH=startH-curValue*selectorHeight;
        curLayer = new Layer(0,tempH,selectorWidth,selectorHeight*itemCount,true);
        curLayer.subLayers.image = new TextureSubLayer(selectedImg);
        tempH=curValue*selectorHeight;
        curLayer.subLayers.roi = new ROISubLayer(0,0,tempH,w,tempH,w,tempH+selectorHeight,0,tempH+selectorHeight);
        layers.push(curLayer);

        //标题层
        if(selectorTitle){
            var curLayer = new Layer(0,h/2-selectorHeight/2,selectorWidth,selectorHeight,true);
            curLayer.subLayers.font = new FontSubLayer(selectorTitle,titleFont);
            layers.push(curLayer);
        }

        //高亮层
        this.enableHighLight = !(valueObj.disableHighlight);
        if(this.enableHighLight){
            curLayer = new Layer(0,h/2-selectorHeight/2,selectorWidth,selectorHeight,true);
            if(sliceHighlight.imgSrc){
                curLayer.subLayers.image = new TextureSubLayer(sliceHighlight.imgSrc);
            }else{
                var colorElems = parseColor(sliceHighlight.color);
                curLayer.subLayers.color = new ColorSubLayer(colorElems);
            }
            layers.push(curLayer);
            this.maxHighLightNum = 1;
        }

        this.subType = 'Selector';
        Widget.call(this,x,y,w,h,layers);
    };
    Selector.prototype = Object.create(Widget.prototype);
    Selector.prototype.constructor = Selector;

    //RotaryKnob
    function RotaryKnob(x,y,w,h,valueObj,texList){
        //图层数组
        var layers = [];

        //位置，宽高
        var x=x;
        var y=y;
        var w=w;
        var h=h;

        //高亮
        this.disableHighlight=valueObj.disableHighlight;

        //纹理
        var sliceBackground =  texList[0].slices[0].imgSrc;
        var sliceRotarySlit = texList[1].slices[0].imgSrc;
        var slicecursor = texList[2].slices[0].imgSrc;
        var sliceHighlight=texList[3].slices[0];

        //背景层
        curLayer = new Layer(0,0,w,h,true);
        curLayer.subLayers.image = new TextureSubLayer(sliceBackground);
        layers.push(curLayer);

        //光带层
        curLayer = new Layer(0,0,w,h,true);
        curLayer.subLayers.image = new TextureSubLayer(sliceRotarySlit);
        // curLayer.subLayers.roi = new ROISubLayer(1,0,0,0,0,0,0,0,0);
        curLayer.subLayers.roi = new ROISubLayer(1);
        layers.push(curLayer);

        //光标层
        curLayer = new Layer(0,0,w,h,true);
        curLayer.subLayers.image = new TextureSubLayer(slicecursor);
        layers.push(curLayer);

        //高亮层
        // this.enableHighLight = !(valueObj.disableHighlight);
        this.enableHighLight = true;
        if(this.enableHighLight){
            curLayer = new Layer(0,0,w,h,true);
            if(sliceHighlight.imgSrc){
                curLayer.subLayers.image = new TextureSubLayer(sliceHighlight.imgSrc);
            }else{
                var colorElems = parseColor(sliceHighlight.color);
                curLayer.subLayers.color = new ColorSubLayer(colorElems);
            }
            layers.push(curLayer);
            this.maxHighLightNum = 1;
        }

        this.subType = 'RotaryKnob';
        Widget.call(this,x,y,w,h,layers);
    };
    RotaryKnob.prototype = Object.create(Widget.prototype);
    RotaryKnob.prototype.constructor = RotaryKnob;



    function ColorPicker(x,y,w,h,slices) {
        var layers = []
        var d = 5
        //hue layer
        var hLayer = new Layer(w*0.8+d*2,d,0.1*w-d*2,0.8*h)
        hLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc)
        //alpha layer
        var alphaLayer = new Layer(0.9*w+d,d,0.1*w-d*2,0.8*h)
        alphaLayer.subLayers.image = new TextureSubLayer(slices[1].imgSrc)
        //saturation volume layer
        var svLayer = new Layer(d,d,0.8*w,0.8*h)
        svLayer.subLayers.image = new TextureSubLayer(slices[2].imgSrc)
        svLayer.subLayers.color = new ColorSubLayer(parseColor(slices[2].color))
        //svLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(0,0,0)'))
        //preview layer
        var pLayer = new Layer(d,0.8*h+d*2,w-d*2,0.2*h-d*3)
        pLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(0,0,0)'))

        //backgroundLayer
        var bgLayer = new Layer(0,0,w,h)
        bgLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(255,255,255'))

        //hue indicator
        var hIndicatorLayer = new Layer(w*0.8+d*2,d,0.1*w-2*d,0.01*h)
        hIndicatorLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(255,255,255)'))

        //alpha indicator
        var alphaIndicatorLayer = new Layer(0.9*w+d,d,0.1*w-2*d,0.01*h)
        alphaIndicatorLayer.subLayers.color = new ColorSubLayer(parseColor('rgb(0,0,0)'))

        //picker indicator
        var minD = Math.min(w,h)
        var pIndicatorLayer = new Layer(d,d,0.02*minD,0.02*minD)
        pIndicatorLayer.subLayers.image = new TextureSubLayer(slices[3].imgSrc)

        layers.push(bgLayer)
        layers.push(hLayer)
        layers.push(alphaLayer)
        layers.push(svLayer)
        layers.push(pLayer)
        layers.push(hIndicatorLayer)
        layers.push(alphaIndicatorLayer)
        layers.push(pIndicatorLayer)
        this.subType = 'ColorPicker'
        Widget.call(this,x,y,w,h,layers)
    }

    ColorPicker.prototype = Object.create(Widget.prototype);
    ColorPicker.prototype.constructor = ColorPicker;

    //日期选择器
    function DatePicker(x,y,w,h,opts,slices){
        var layers = [];
        var fontStyle={};
        var bgLayer,yLayer,mLayer,dLayer,hlLayer;

        //background image
        bgLayer = new Layer(0,0,w,h);
        bgLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        layers.push(bgLayer);

        //year text
        yLayer = new Layer(opts.yearX,opts.yearY,opts.yearW,opts.yearH);
        fontStyle['font-size'] = opts.titleFontSize;
        fontStyle['font-family'] = opts.titleFontFamily;
        fontStyle['font-color'] = opts.titleFontColor;
        yLayer.subLayers.font = new FontSubLayer('2018',fontStyle);
        layers.push(yLayer);

        //month text
        mLayer = new Layer(opts.monthX,opts.monthY,opts.monthW,opts.monthH);
        mLayer.subLayers.font = new FontSubLayer('1',fontStyle);
        layers.push(mLayer);

        //day image and text
        var initX = opts.paddingX,
            initY = opts.paddingY;
        for(var j=0;j<5;j++){
            for(var i=0;i<7;i++){
                dLayer = new Layer(initX,initY,opts.dayW,opts.dayH);
                fontStyle = {};
                fontStyle['font-size'] = opts.itemFontSize;
                fontStyle['font-family'] = opts.itemFontFamily;
                fontStyle['font-color'] = opts.itemFontColor;
                dLayer.subLayers.image = new TextureSubLayer(slices[3].imgSrc);
                dLayer.subLayers.font = new FontSubLayer(String(i+1),fontStyle);
                layers.push(dLayer);
                initX+=opts.dayW;
            }
            initX = opts.paddingX;
            initY += opts.dayH;
        }

        //highlight image
        hlLayer = new Layer(0,0,opts.dayW,opts.dayH);
        hlLayer.subLayers.image = new TextureSubLayer(slices[slices.length-1].imgSrc);
        layers.push(hlLayer);

        Widget.call(this,x,y,w,h,layers)
    }
    DatePicker.prototype = Object.create(Widget.prototype);
    DatePicker.prototype.constructor = DatePicker;


    //图层日期选择器
    function TexDatePicker(x,y,w,h,opts,texList){
        var layers = [];
        var fontStyle = {},slices;
        var bgLayer,yLayer,mLayer,dLayer,hlLayer;
        var i=0,j=0;

        fontStyle['font-size'] = opts.titleFontSize;
        fontStyle['font-family'] = opts.titleFontFamily;
        fontStyle['font-color'] = opts.titleFontColor;

        //background image
        slices = texList[0].slices;
        bgLayer = new Layer(0,0,w,h);
        bgLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        layers.push(bgLayer);

        //year
        slices = texList[1].slices;
        var year = opts.year,
            yearPos = year.pos;
        for(i=0;i<yearPos.length;i++){
            yLayer = new Layer(yearPos[i].x,yearPos[i].y,year.w,year.h);
            yLayer.subLayers.font = new FontSubLayer('0',fontStyle);
            layers.push(yLayer);
        }

        //month
        slices = texList[2].slices;
        var month = opts.month,
            monthPos = month.pos;
        for(i=0;i<monthPos.length;i++){
            mLayer = new Layer(monthPos[i].x,monthPos[i].y,month.w,month.h);
            mLayer.subLayers.font = new FontSubLayer('0',fontStyle);
            layers.push(mLayer);
        }

        //day image and text
        slices = texList[3].slices;
        var initX = opts.paddingX,
            initY = opts.paddingY;

        for(i=0;i<slices.length;i++){
            dLayer = new Layer(initX,initY,opts.dayW,opts.dayH);
            dLayer.subLayers.image = new TextureSubLayer(slices[i].imgSrc);
            layers.push(dLayer);
        }

        //highlight image
        slices = texList[4].slices;
        hlLayer = new Layer(0,0,opts.dayW,opts.dayH);
        hlLayer.subLayers.image = new TextureSubLayer(slices[0].imgSrc);
        layers.push(hlLayer);

        Widget.call(this,x,y,w,h,layers);
    }
    TexDatePicker.prototype = Object.create(Widget.prototype);
    TexDatePicker.prototype.constructor = TexDatePicker;

    //TexTime
    function TexTime(x,y,w,h,valueObj,texTimeSlices,highlightSlice) {
        //图层数组
        var layers = [];

        //属性
        var charH = valueObj.characterH;                      //字符高度
        var charW = valueObj.characterW;                      //字符宽度
        var dateTimeModeId = Number(valueObj.dateTimeModeId); //显示模式
        // var enableHighlight=valueObj.disableHighlight;        //是否显示高亮
        var digitTextureList=[];                              //digitTextureList中存放了所有数字的图片
        for(var i=0;i<=9;i++){
            digitTextureList.push(texTimeSlices[i].imgSrc)
        }

        //变量
        var digitCount=0;                                     //数字位数
        var opeCount=0;                                       //符号位数
        var firstOpe=0;                                       //第一个符号位置
        var opeSliceNum=0;                                    //符号纹理编号
        var dx = 0;                                           //偏移
        var curLayer=[];                                      //当前图层


        switch (dateTimeModeId){
            case 0://时分秒
                digitCount=6;
                opeCount=2;
                firstOpe=2;
                opeSliceNum=10;
                this.maxHighLightNum = 3;
            case 1://
                digitCount=4;
                opeCount=1;
                firstOpe=2;
                opeSliceNum=10;
                this.maxHighLightNum = 2;
                break;
            case 2://
                digitCount=8;
                opeCount=2;
                firstOpe=4;
                opeSliceNum=11;
                this.maxHighLightNum = 3;
                break;
            case 3://
                digitCount=8;
                opeCount=2;
                firstOpe=4;
                opeSliceNum=12;
                this.maxHighLightNum = 3;
                break;
            default:
                console.log('error');
        }

        //添加数字图层
        for (i=0;i<digitCount;i++){
            if(i==firstOpe || i==firstOpe+2){
                dx += charW;
            }
            curLayer = new Layer(dx,0,charW,charH,true);
            curLayer .subLayers.image = new TextureSubLayer(digitTextureList);
            layers.push(curLayer);
            dx += charW;
        }
        //添加符号图层
        for (i=0;i<opeCount;i++){
            curLayer = new Layer((firstOpe+3*i)*charW,0,charW,charH,true);
            curLayer .subLayers.image = new TextureSubLayer(texTimeSlices[opeSliceNum].imgSrc);
            layers.push(curLayer);
        }

        //高亮层
        this.enableHighLight = !(valueObj.disableHighlight);
        if(this.enableHighLight){
            curLayer = new Layer(0,0,charW,charH,true);
            if(highlightSlice.imgSrc){
                curLayer.subLayers.image = new TextureSubLayer(highlightSlice.imgSrc);
            }else{
                var colorElems = parseColor(highlightSlice.color);
                curLayer.subLayers.color = new ColorSubLayer(colorElems);
            }
            layers.push(curLayer);
        }else{
            this.maxHighLightNum = 0;
        }

        this.subType = 'TexTime';
        Widget.call(this,x,y,w,h,layers);
    }
    TexTime.prototype = Object.create(Widget.prototype);
    TexTime.prototype.constructor = TexTime;

    //ColorBlock
    function ColorBlock(x,y,w,h) {
        //图层数组
        var layers = [];

        //颜色层
        var curLayer = new Layer(0,0,w,h,true);
        var colorElems = parseColor('rgba(111,111,111,1)');
        curLayer .subLayers.color = new ColorSubLayer(colorElems);
        layers.push(curLayer);

        this.subType = 'ColorBlock';
        Widget.call(this,x,y,w,h,layers);
    }
    ColorBlock.prototype = Object.create(Widget.prototype);
    ColorBlock.prototype.constructor = ColorBlock;

    var WidgetCommandParser = {};
    var scope = {};
    WidgetCommandParser.transCommand = function (ctx,command) {
        var op = command[0];
        var result;
        var variable;
        var value;
        switch (op){
            case 'temp':
                variable = command[1];
                value = Widget.execute(ctx,command[2])
                scope[variable] = value;
                result = 'var '+variable+'='+value+';\n';
                break;
            case 'set':
                variable = command[1];
                value = Widget.execute(ctx,command[2])
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
                    pred1 = Widget.execute(ctx,pred1)
                }
                if (!(pred2 in scope)){
                    pred2 = Widget.execute(ctx,pred2)
                }

                result = "("+pred1+command[1]+pred2+"){\n"
                break;
            case 'else':
                result = '}else{\n'
                break;
            case 'end':
                result = '}\n';
                break;
            case 'setTag':
                result = "WidgetExecutor.setTag("+"\""+ctx.tag+"\""+","+command[1]+")"
                
                break;
        }
        return result;
    }
    WidgetCommandParser.transFunction = function (ctx,commands) {
        scope = {}
        var result = "";
        for (var i=0;i<commands.length;i++){
            result +=this.transCommand(ctx,commands[i])
        }
        return result;
    }

    // WidgetCommandParser.transIfAndWhile = function (commands) {
    //     console.log(parse(commands))
    // }

    WidgetCommandParser.complier = {}

    ;(function (actionCompiler) {
        'use strict';
        var parser = {};
        parser.parse = parse;

        /**
         * parse a program;
         */
        function parse(program) {
            var results = [];
            var loopFLag = true;
            while (program.length&&loopFLag) {
                var line = program[0];
                var block;
                // console.log(line[0]);
                switch (line[0]) {
                    //if
                    case 'if':
                        block = {};
                        block.type = 'IF';
                        block.args = [];
                        program.shift(); // if
                        block.args.push(program.shift()); //condition
                        block.args.push(parse(program)); //then
                        if (program[0][0]==='else') {
                            program.shift();
                            block.args.push(parse(program)); //else
                        }
                        program.shift();
                        results.push(block);
                        break;
                    //while
                    case 'while':
                        block = {
                            type:'WHILE',
                            args:[]
                        };
                        program.shift();
                        block.args.push(program.shift());
                        block.args.push(parse(program));
                        program.shift();
                        results.push(block);
                        break;
                    case 'else':
                    case 'end':
                        loopFLag = false;
                        break;
                    default:
                        results.push({
                            type:'EXP',
                            args:[line]
                        });
                        program.shift();
                        break;

                }
            }
            return results;
        }



        var transformer = {};
        var labelCount = 0;

        function Command(label,cmd) {
            this.label = String(label);
            this.cmd = cmd;
        }

        var targetCompareOps = {
            'gte':'lt',
            'lte':'gt'
        };

        // transformer.transSingleIf = transSingleIf;
        // transformer.transBlock = transBlock;
        transformer.trans = trans;

        var JUMP = 'jump'

        var END = 'end'

        var BLANK = ''
        
        function trans(block,changeIfConditon) {
            labelCount = 0;
            var tempResult = transBlock(block,changeIfConditon);
            // console.log(_.cloneDeep(tempResult))
            adjustJumps(tempResult);
            return tempResult;
        }

        function adjustJumps(transedBlockResults) {
            var labels = {};
            var curLine;
            //build label index
            for (var i = 0; i < transedBlockResults.length; i++) {
                curLine = transedBlockResults[i];
                if (curLine.label !== '') {
                    labels[curLine.label] = i;
                }
            }
            //change jumps
            for (i = 0; i < transedBlockResults.length; i++) {
                curLine = transedBlockResults[i];
                var curCmd = curLine.cmd;
                if (curCmd[0] === 'jump') {
                    //jump
                    var labelIdx = labels[curCmd[2]];
                    curCmd[2] = labelIdx - i;
                }
            }
        }

        function transBlock(block,changeIfConditon) {
            var results = [];
            for (var i = 0; i < block.length; i++) {
                var curExp = block[i];
                switch (curExp.type) {
                    case 'EXP':
                        results.push(new Command('', curExp.args[0]));
                        break;
                    case 'IF':
                        [].push.apply(results, transSingleIf(curExp,changeIfConditon));
                        break;
                    case 'WHILE':
                        [].push.apply(results, transSingleWhile(curExp,changeIfConditon));
                        break;
                    default:
                        results.push(new Command('', curExp.args[0]));
                        break;
                }
            }
            return results;
        }



        function transSingleIf(ifBlock, changeCondition) {
            var results = [];
            var args = ifBlock.args;
            if (args.length === 2) {
                //only then
                args.push([]);
            }
            var condition = args[0];
            var thenBlock = args[2];
            var elseBlock = args[1];

            changeCondition = changeCondition || false;
            if (changeCondition){
                //adjust if then else
                ///

                var ifBlockOp = condition[0];
                var oppositeOp = targetCompareOps[ifBlockOp];
                if (!!oppositeOp){
                    condition[0] = oppositeOp;
                    thenBlock = args[1];
                    elseBlock = args[2];
                }
            }

            //condition
            results.push(new Command('', condition));
            
            //jump to then
            var l1 = labelCount;
            labelCount = labelCount + 1;
            results.push(new Command('', [JUMP, BLANK, l1]));

            [].push.apply(results, transBlock(elseBlock,changeCondition));
            //jump to END
            var l2 = labelCount;
            labelCount = labelCount + 1;
            results.push(new Command('', [JUMP, BLANK, l2]));

            //then block;
            var transedThenBlock = transBlock(thenBlock,changeCondition);
            if (transedThenBlock.length > 0) {
                transedThenBlock[0].label = String(l1);
            } else {
                // transedThenBlock.push({
                //   label:String(l1),
                //   cmd:['END','','']
                // });
                transedThenBlock.push(new Command(l1, [END, '', '']));
            }

            // results.concat(transedThenBlock);
            [].push.apply(results, transedThenBlock);
            //END

            // results.push({
            //   label:String(l2),
            //   cmd:['END','','']
            // });
            results.push(new Command(l2, [END, '', '']));
            return results;


        }


        function transSingleWhile(whileBlock,changeCondition) {
            var results = [];
            var args = whileBlock.args;
            var condition = args[0];
            var block = args[1];
            var l1 = labelCount++;
            var l2 = labelCount++;
            var l3 = labelCount++;

            if (changeCondition){
                var oppositeOp = targetCompareOps[condition[0]];
                if (!!oppositeOp){
                    condition[0] = oppositeOp;
                    //condition
                    results.push(new Command(l1, condition));

                    //jump to then block;
                    results.push(new Command('', [JUMP, BLANK, l2]));
                    //jump to end;
                    results.push(new Command('', [JUMP, BLANK, l3]));
                }else{
                    //condition
                    results.push(new Command(l1, condition));

                    //jump to then block;
                    results.push(new Command('', [JUMP, BLANK, l3]));
                    //jump to end;
                    results.push(new Command('', [JUMP, BLANK, l2]));
                }
            }



            //then block;
            var transedThenBlock = transBlock(block,changeCondition);
            transedThenBlock.push(new Command('', [JUMP, BLANK, l1]));
            transedThenBlock[0].label = String(l2);
            [].push.apply(results, transedThenBlock);
            results.push(new Command(l3, [END, '', '']));
            // console.log('while', _.cloneDeep(results))
            return results;
        }


    
        actionCompiler.parser = parser;
        actionCompiler.transformer = transformer;
        
    })(WidgetCommandParser.complier);


    var WidgetModel = {};
    WidgetModel.models = {};

    WidgetModel.models.Button = Button;
    WidgetModel.models.ButtonGroup = ButtonGroup;
    WidgetModel.models.Dashboard = Dashboard;
    WidgetModel.models.RotateImg = RotateImg;
    WidgetModel.models.TextArea = TextArea;
    WidgetModel.models.Progress = Progress;
    WidgetModel.models.Switch = Switch;
    WidgetModel.models.ScriptTrigger = ScriptTrigger;
    WidgetModel.models.Video = Video;
    WidgetModel.models.Slide = Slide;
    WidgetModel.models.Num = Num;
    WidgetModel.models.SlideBlock = SlideBlock;
    WidgetModel.models.DateTime = DateTime;
    WidgetModel.models.TexNum = TexNum;
    WidgetModel.models.Selector = Selector;
    WidgetModel.models.RotaryKnob = RotaryKnob;
    WidgetModel.models.ColorPicker = ColorPicker;
    WidgetModel.models.DatePicker = DatePicker;
    WidgetModel.models.TexDatePicker = TexDatePicker;
    WidgetModel.models.TexTime = TexTime;
    WidgetModel.models.ColorBlock = ColorBlock;
    WidgetModel.models.Animation = Animation;
    WidgetModel.Widget = Widget;
    WidgetModel.WidgetCommandParser = WidgetCommandParser;

    return WidgetModel;


}));

