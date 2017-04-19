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
            mode:this.mode,
            tag:this.tag,
            layers:this.layers,
            otherAttrs:this.otherAttrs
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
            colorElems = color.split(/[\(|\)]/)[1].split(',')
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

    function Button(x,y,w,h,text,fontStyle,slices) {
        var layerUp = new Layer(0,0,w,h);
        var colorElems;
        layerUp.subLayers.font = new FontSubLayer(text,fontStyle);
        layerUp.subLayers.image =new TextureSubLayer(slices[0].imgSrc);
        colorElems = parseColor(slices[0].color);
        layerUp.subLayers.color = new ColorSubLayer(colorElems);
        var layerDown = new Layer(0,0,w,h);
        layerDown.subLayers.font = new FontSubLayer(text,fontStyle);
        layerDown.subLayers.image =new TextureSubLayer(slices[1].imgSrc);
        colorElems = parseColor(slices[1].color);
        layerDown.subLayers.color = new ColorSubLayer(colorElems);
        var layers = [layerUp,layerDown];
        this.subType = 'Button';
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
    function ButtonGroup(x,y,w,h,num,align,space,slices) {
        // var layerUp = new Layer(w,h);
        // layerUp.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        // layerUp.subLayers.texture =new TextureSubLayer(0,0,w,h,slices[0].imgSrc);
        // layerUp.subLayers.color = new ColorSubLayer(0,0,w,h,slices[0].color);
        // var layerDown = new Layer(w,h);
        // layerDown.subLayers.font = new FontSubLayer(0,0,w,h,text,fontStyle);
        // layerDown.subLayers.texture =new TextureSubLayer(0,0,w,h,slices[1].imgSrc);
        // layerDown.subLayers.color = new ColorSubLayer(0,0,w,h,slices[1].color);
        // var layers = [layerUp,layerDown]
        var sWidth = 0;
        var sHeight = 0;
        var colorElems;
        var layers = [];
        if (align==0) {
                //hori
            sWidth = (w-(num-1)*space)/num;
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
                layers.push(downLayer)
            }
            
        }else{
            // sWidth = w;
            // sHeight = (h-(num-1)*space)/num;

            // for (var i=0;i<num;i++){
            //     var curLayer = new Layer(x,y+i*(sHeight+space),sWidth,sWidth)
            //     curLayer.subLayers.texture = new TextureSubLayer(sWidth,sHeight,slices[i].imgSrc)
            //     curLayer.subLayers.color = new ColorSubLayer(sWidth,sHeight,slices[i].color)
            //     layers.push(curLayer)
            // }

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
            var pointerW = valueObj.pointerLength/Math.sqrt(2)
            pointerLayer = new Layer(w/2,h/2,pointerW,pointerW)
            pointerLayer.subLayers.image = new TextureSubLayer(slices[1].imgSrc);
            pointerLayer.subLayers.color = new ColorSubLayer(parseColor(slices[1].color))
            pointerLayer.subLayers.roi = new ROISubLayer(1)
            layers.push(bgLayer)
            layers.push(pointerLayer)
            layers.push(lightLayer)
        }
        Widget.call(this,x,y,w,h,layers)
        
    }

    Dashboard.prototype = Object.create(Widget.prototype);
    Dashboard.prototype.constructor = Dashboard;









    //progress
    function Progress(x,y,w,h,cursor,slices){
        var layerBackground = new Layer(0,0,w,y);
        var layerProcess = new Layer(0,0,w,y);
        var layerCursor = new Layer(0,0,w,y);
        var colorElems;

        //background
        colorElems = parseColor(slices[0].color);
        layerBackground.subLayers.color = new ColorSubLayer(colorElems);
        layerBackground.subLayers.image = new TextureSubLayer(slices[0].imgSrc);

        //progress
        colorElems = parseColor(slices[1].color);
        layerProcess.subLayers.color = new ColorSubLayer(colorElems);
        layerProcess.subLayers.image = new TextureSubLayer(slices[1].imgSrc);

        //cursor
        if(cursor=='1'){
            layerCursor.subLayers.image = new TextureSubLayer(slices[2].imgSrc);
        }

        var layers = [layerCursor,layerProcess,layerBackground];
        this.subType = 'Progress';
        Widget.call(this,x,y,w,h,layers);
    }

    Progress.prototype = Object.create(Widget.prototype);
    Progress.prototype.constructor = Progress;
    Progress.prototype.commands.onInitialize = [
        ['temp','a',new Param(Int,0)]
    ];
    Progress.prototype.commands.onMouseDown = [
        ['temp','a',new Param(Int,0)]
    ];
    Progress.prototype.commands.onMouseUp = [
        ['temp','a',new Param(Int,0)]
    ];
    Progress.prototype.commands.onTagChange = [
        ['temp','a',new Param(Int,0)]
    ];


    var WidgetCommandParser = {};
    var scope = {}
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
    WidgetModel.models.Progress = Progress;
    WidgetModel.Widget = Widget;
    WidgetModel.WidgetCommandParser = WidgetCommandParser;

    return WidgetModel;


}));
