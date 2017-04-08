/**
 * Created by changecheng on 2017/4/6.
 */


;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('cppWidgetCommandTranslator',[], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.cppWidgetCommandTranslator = factory();
    }
}(function () {
    // trans general widget commands to c++ insts
    var translator = {}

    var opCodes = [
        'OPEND' ,	//end;
        'OPSTART',
        'OPSETLAYIM',	//set layer attribute;
        'OPSETLAYIN',
        'OPSETSUBLAYIM',//set sublayer attribute;
        'OPSETSUBLAYIN',
        'OPSETTEMPIM',	//set temp value;
        'OPSETTEMPIN',
        'OPGETTAG',	//set tag value;
        'OPSETTAGIM',	//get the value of tag;
        'OPSETTAGIN',
        'OPSETTAGTE',
        'OPEQIM',		//if a EQ (int)Imm jump 1;
        'OPEQIN',
        'OPJUMP',		//jump Imm codes;
        'OPADDIM',		//a = a + Imm;
        'OPADDIN',
        'OPMINUSIM',	//a = a - Imm;
        'OPMINUSIN',
        'OPMULIM',		//a = a * Imm;
        'OPMULIN',
        'OPDIVIM',		//a = a / Imm;
        'OPDIVIN',
        'OPANDIM',		//a = a & Imm;
        'OPANDIN',
        'OPORIM',		//a = a | Imm;
        'OPORIN',
        'OPXORIM',		//a = a ^ Imm;
        'OPXORIN',
        'OPNOTIM',		//a = !a;
        'OPNOTIN'

    ]
    var cppOPTable = {}
    for (var i=0;i<opCodes.length;i++){
        cppOPTable[opCodes[i]] = i
    }

    var ideOpCodes = {
        temp:'temp',
        set:'set',
        get:'get',
        setTag:'setTag',
        getTag:'getTag',
        if:'if',
        else:'else',
        end:'end',
        gt:'gt',
        lt:'lt',
        eq:'eq',
        gte:'gte',
        lte:'lte'
    }

    //widget attr
    var cppWidgetAttrs = [
        'startTag',
        'stopTag',
        'minValue',
        'maxValue',
        'lowAlarmValue',
        'highAlarmValue',
        'minAngle',
        'maxAngle',
        'oldValue',
        'mATag',
        'numOfLayers',
        'startAddrOfLayers',
        'widgetWidth',
        'widgetHeight',
        'mWidgetOffsetX',
        'mWidgetOffsetY',
        'mBindTagID',
        'attatchCanvasID',
        'preWidgetID',
        'nextWidgetID',
        'totalFrame',
        'nowFrame',
        'mInteraction',
        'mMode',
        'mArrange',
        'generalType',
        'otherAttrs'
    ]

    var cppWidgetAttrsTable = {}
    for (var i=0;i<cppWidgetAttrs.length;i++){
        cppWidgetAttrsTable[cppWidgetAttrs[i]] = i;
    }

    var widgetAttrMap = {
        info:{
            left:'mWidgetOffsetX',
            top:'mWidgetOffsetY',
            width:'widgetWidth',
            height:'widgetHeight'
        },
        minValue:'minValue',
        maxValue:'maxValue',
        lowAlarmValue:'lowAlarmValue',
        highAlarmValue:'highAlarmValue',
        minAngle:'minAngle',
        maxAngle:'maxAngle',
        numOfLayers:'numOfLayers',
        interaction:'mInteraction',
        tag:'mBindTagID',
        generalType:'generalType',
        otherAttrs:'otherAttrs'
    }


    //layer attrs
    var cppLayerAttrs = [
        'mLayerOffsetX',
        'mLayerOffsetY',
        'tileBoxClass',
        'scalerX',
        'scalerY',
        'MovingX',
        'MovingY',
        'rotateAngle',
        'shearAngleX',
        'shearAngleY',
        'projectX',
        'projectY',
        'mWidth',
        'mHeight',
        'mValidSubLayer',
        'mHidden'
    ]

    var layerAttrMap = {
        x:'mLayerOffsetX',
        y:'mLayerOffsetY',
        width:'mWidth',
        height:'mHeight',
        hidden:'mHidden'
    }

    var cppSublayerAttrs = [
        'SubLayerClassROI',
        'SubLayerClassFont',
        'SubLayerClassImage',
        'SubLayerClassColor'   
    ]

    var subLayerAttrMap = {
        'roi':'SubLayerClassROI',
        'font':'SubLayerClassFont',
        'texture':'SubLayerClassImage',
        'color':'SubLayerClassColor'
    }

    function AttrType(type,value) {
        this.type = type
        this.value = value
        this.aVals = [].slice.call(arguments,2)
    }

    function isNum(param) {
        var numReg = /^[0-9]+$/;
        return numReg.test(param);
    }

    function expDepth(param) {
        var attrs = param.value.split('.')
        if ((attrs.length == 2) && (attrs[0] == 'this')){
            return new AttrType('widget',widgetAttrMap[attrs[1]])
        }

        if (attrs.length == 3){
            //info
            if ((attrs[0] == 'this') && (attrs[1] =='info')) {
                return new AttrType('widget',widgetAttrMap.info[attrs[2]])
            }

            //otherAttrs
            if ((attrs[0] == 'this' )&& (attrs[1] == 'otherAttrs')){
                return new AttrType('widget',widgetAttrMap[attrs[1]])
            }
        }

        if (attrs.length == 4){
            //this.layers.0.hidden
            if ((attrs[0] == 'this') && (attrs[1] == 'layers') && isNum(attrs[2])) {
                return new AttrType('layer',layerAttrMap[attrs[3]],attrs[2])
            }
        }

        if (attrs.length==6){
            //this.layers.0.subLayers.texture.texture
            if ((attrs[0] == 'this') && (attrs[1] == 'layers') && isNum(attrs[2]) && (attrs[3]=='subLayers')) {
                return new AttrType('subLayer',subLayerAttrMap[attrs[4]],attrs[2])
            }
        }

        return null;
    }

    function transJSWidgetCommandToCPPForm(command) {
        var op = command[0]
        var inst
        var curExp
        switch (op){
            case 'temp':
                inst = {
                    type:'OPSETTEMP',
                    tempID:command[1],
                    imm:command[2].value
                }
                break;
            case 'set':
                var param1 = command[1]
                var param2 = command[2]
                if (param1.type == 'ID') {
                    if (param2.type == 'Int') {
                        //a = 2
                        inst = {
                            type:'OPSETTEMP',
                            tempID:command[1].value,
                            imm:command[2].value
                        }
                    }else if (param2.type == 'ID'){
                        // a = b
                        inst = {
                            type:'OPSETTEMPTE',
                            tempID:command[1].value,
                            imm:command[2].value
                        }
                    }else if (param2.type == 'EXP'){
                        // a = this.layers.1.hidden
                        curExp = expDepth(param2)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    inst = {
                                        type:'OPGETWID',
                                        tempID:param1.value,
                                        attrID:curExp.value
                                    }
                                break;
                                case 'layer':
                                    inst = {
                                        type:'OPGETLAY',
                                        tempID:param1.value,
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0]
                                    }
                                break;
                                case 'subLayer':
                                    inst = {
                                        type:'OPGETSUBLAY',
                                        tempID:param1.value,
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0]
                                    }
                                break;
                            }
                        }else{
                            throw new Error('invalid exp',param2)
                        }
                    }
                }else if (param1.type == 'EXP'){
                    if (param2.type == 'Int') {
                        curExp = expDepth(param1)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    inst = {
                                        type:'OPSETWIDIM',
                                        attrID:curExp.value,
                                        imm:param2.value
                                    }
                                break;
                                case 'layer':
                                    inst = {
                                        type:'OPSETLAYIM',
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0],
                                        imm:param2.value
                                    }
                                break;
                                case 'subLayer':
                                    inst = {
                                        type:'OPSETSUBLAYIM',
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0],
                                        imm:param2.value
                                    }
                                break;
                            }
                        }else{
                            throw new Error('invalid exp',param2)
                        }
                    }else if(param2.type == 'ID'){
                        curExp = expDepth(param1)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    inst = {
                                        type:'OPSETWIDTE',
                                        attrID:curExp.value,
                                        tempID:param2.value
                                    }
                                break;
                                case 'layer':
                                    inst = {
                                        type:'OPSETLAYTE',
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0],
                                        tempID:param2.value
                                    }
                                break;
                                case 'subLayer':
                                    inst = {
                                        type:'OPSETSUBLAYTE',
                                        attrID:curExp.value,
                                        layerID:curExp.aVals[0],
                                        tempID:param2.value
                                    }
                                break;
                            }
                        }else{
                            throw new Error('invalid exp',param2)
                        }
                    }
                }
                break;
            case 'jump':
                inst = {
                    type:'OPJUMP',
                    imm:command[2]
                }
                break;
            case 'end':
                inst = {
                    type:'OPNOP'
                }
                break;
            //tag
            case 'getTag':
                inst = {
                    type:'OPGETTAG',
                    tempID:command[1]
                }
                break;
            case 'setTag':
                if (command[1].type == 'ID'){
                    inst = {
                        type:'OPSETTAGTE',
                        tempID:command[1].value
                    }
                }else{
                    inst = {
                        type:'OPSETTAGIM',
                        imm:command[1].value
                    }
                }
                break;
            //compare
            case 'eq':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = {
                        type:'OPEQTE',
                        tempID1:command[1].value,
                        tempID2:command[2].value

                    }
                }else{
                    inst = {
                        type:'OPEQIM',
                        tempID1:command[1].value,
                        imm:command[2].value

                    }
                }
                break;
            case 'lt':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = {
                        type:'OPLTTE',
                        tempID1:command[1].value,
                        tempID2:command[2].value

                    }
                }else{
                    inst = {
                        type:'OPLTIM',
                        tempID1:command[1].value,
                        imm:command[2].value

                    }
                }
                break;
            case 'lte':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = {
                        type:'OPLTETE',
                        tempID1:command[1].value,
                        tempID2:command[2].value

                    }
                }else{
                    inst = {
                        type:'OPLTEIM',
                        tempID1:command[1].value,
                        imm:command[2].value

                    }
                }
                break;
            case 'gt':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = {
                        type:'OPGTTE',
                        tempID1:command[1].value,
                        tempID2:command[2].value

                    }
                }else{
                    inst = {
                        type:'OPGTIM',
                        tempID1:command[1].value,
                        imm:command[2].value

                    }
                }
                break;
            case 'gte':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = {
                        type:'OPGTETE',
                        tempID1:command[1].value,
                        tempID2:command[2].value

                    }
                }else{
                    inst = {
                        type:'OPGTEIM',
                        tempID1:command[1].value,
                        imm:command[2].value

                    }
                }
                break;
            //algebra
            case 'add':
                inst = {
                    type:'OPADD',
                    tempID:command[1].value,
                    imm:command[2].value
                }
                break;
            case 'minus':
                inst = {
                    type:'OPMINUS',
                    tempID:command[1].value,
                    imm:command[2].value
                }
                break;
            case 'multiply':
                inst = {
                    type:'OPMUL',
                    tempID:command[1].value,
                    imm:command[2].value
                }
                break;
            case 'divide':
                inst = {
                    type:'OPDIV',
                    tempID:command[1].value,
                    imm:command[2].value
                }
                break;
            case 'mod':
                inst = {
                    type:'OPMOD',
                    tempID:command[1].value,
                    imm:command[2].value
                }
                break;
            //bit operation
            case 'and':
                inst = {
                    type:'OPAND',
                    tempID:command[1].value,
                    imm:command[2].value
                };
                break;
            case 'or':
                inst = {
                    type:'OPOR',
                    tempID:command[1].value,
                    imm:command[2].value
                };
                break;
            case 'xor':
                inst = {
                    type:'OPXOR',
                    tempID:command[1].value,
                    imm:command[2].value
                };
                break;
            case 'not':
                inst = {
                    type:'OPNOT',
                    tempID:command[1].value
                };
                break;

        }
        return inst;
    }


    function transJSWidgetCommands(commands){
        return commands.map(function(c){
            return transJSWidgetCommandToCPPForm(c);
        })
    }
    translator.transJSWidgetCommandToCPPForm = transJSWidgetCommandToCPPForm
    translator.transJSWidgetCommands = transJSWidgetCommands;
    return translator;
}))