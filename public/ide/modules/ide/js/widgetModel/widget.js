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
            layers:this.layers
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
        ['if'],
        ['eq',new Param(ID,'b'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['setTag',new Param(Int,101)],
        ['else'],
        ['temp','c',new Param(Int,0)],
        ['getTag','c'],
        ['if'],
        ['gt',new Param(ID,'c'),new Param(Int,0)],
        //bounce up
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,1)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,0)],
        ['setTag',new Param(Int,0)],
        ['else'],
        ['set',new Param(EXP,'this.layers.0.hidden'),new Param(Int,0)],
        ['set',new Param(EXP,'this.layers.1.hidden'),new Param(Int,1)],
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
            var tempResult = transBlock(block,changeIfConditon);
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

            return results;
        }


    
        actionCompiler.parser = parser;
        actionCompiler.transformer = transformer;
        
    })(WidgetCommandParser.complier);


    var WidgetModel = {};
    WidgetModel.models = {}

    WidgetModel.models.Button = Button;
    WidgetModel.Widget = Widget;
    WidgetModel.WidgetCommandParser = WidgetCommandParser;

    return WidgetModel;


}))
