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
    var temps = {}

    function Attr(name,bytes,index) {
        this.name = name||''
        this.bytes = bytes||4
        this.index = index||0
    }

    var opCodes = [
        'OPEND' ,	//end;
        'OPSTART',
        'OPSETLAY',	//set layer attribute;
        'OPSETLAYTE',
        'OPGETLAY',
        'OPGETLAYTE',
        'OPSETSUBLAY',//set sublayer attribute;
        'OPSETSUBLAYT',
        'OPSETSUBLAYTE',
        
        'OPSETSUBLAYTET',
        'OPGETSUBLAY',
        'OPGETSUBLAYTE',
        'OPSETTEMP',	//set temp value;
        'OPGETTEMP',
        'OPGETTAG',	//set tag value;
        'OPSETTAGIM',	//get the value of tag;
        'OPSETTAGTE',
        
        'OPEQIM',		//if a EQ (int)Imm jump 1;
        'OPEQTE',
        'OPGTIM',
        'OPGTTE',
        'OPGTEIM',
        'OPGTETE',
        'OPLTIM',
        'OPLTTE',
        'OPLTEIM',
        'OPLTETE',

        'OPJUMP',		//jump Imm codes;

        'OPADDIM',		//a = a + Imm;
        'OPADDTE',
        'OPMINUSIM',	//a = a - Imm;   
        'OPMINUSTE',
        'OPMULIM',		//a = a * Imm;  
        'OPMULTE',   
        'OPDIVIM',		//a = a / Imm;
        'OPDIVTE',
        'OPMODIM',
        'OPMODTE',

        'OPANDIM',		//a = a & Imm;    
        'OPANDTE', 
        'OPORIM',		//a = a | Imm;   
        'OPORTE', 
        'OPXORIM',		//a = a ^ Imm;
        'OPXORTE',
        'OPNOTIM',		//a = !a;
        'OPNOTTE',

        'OPSETWIDIM',
        'OPSETWIDTE',
        'OPGETWIDTE',
        'OPSETWIDOFFSETIM',
        'OPSETWIDOFFSETTE',
        'OPGETWIDOFFSET',
        'OPSETLAYOFFSETIM',
        'OPSETLAYOFFSETTE',
        'OPGETLAYOFFSET',
        'OPCHKVALALARM',
        'OPNOP',
        'OPSTARTANIMATION',
        'OPEXECUTEACTION',
        'OPSETGLOBALVAR'

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
        new Attr('mWDGStartTag',4),
        new Attr('mWDGStopTag',4),
        new Attr('mWDGMinValue',4),
        new Attr('mWDGMaxValue',4),
        new Attr('mWDGLowAlarmValue',4),
        new Attr('mWDGHighAlarmValue',4),
        new Attr('mWDGMinAngle',4),
        new Attr('mWDGMaxAngle',4),
        new Attr('mWDGOldValue',4),
        new Attr('mWDGAnTag',4),
        new Attr('mWDGNumOfLayers',4),
        new Attr('mWDGStartAddrOfLayers',4),
        new Attr('mWDGWidgetWidth',4),
        new Attr('mWDGWidgetHeight',4),
        new Attr('mWDGWidgetOffsetX',4),
        new Attr('mWDGWidgetOffsetY',4),
        new Attr('mWDGBindTagID',4),
        new Attr('mWDGAttatchCanvasID',4),
        new Attr('mWDGPreWidgetID',4),
        new Attr('mWDGNextWidgetID',4),
        new Attr('mWDGTotalFrame',4),
        new Attr('mWDGNowFrame',4),
        new Attr('mWDGInteractionMode',4),
        new Attr('mWDGMode',4),
        new Attr('mWDGArrange',4),
        new Attr('mWDGType'),
        new Attr('mWDGAnimationSclerX'),   
        new Attr('mWDGAnimationSclerY'),
        new Attr('mWDGAnimationMovingX'),
        new Attr('mWDGAnimationMovingY'),
        new Attr('mWDGAnimationRotateAngle'),
        new Attr('mWDGAnimationShearAngleX'), 
        new Attr('mWDGAnimationShearAngleY'), 
        new Attr('mWDGAnimationProjectionAngleX'),
        new Attr('mWDGAnimationProjectionAngleY'),
        new Attr('mWDGOnInitializeFunc'),
        new Attr('mWDGOnDestroyFunc'),
        new Attr('mWDGOnTagChangeFunc'),
        new Attr('mWDGOnMouseUpFunc'),
        new Attr('mWDGOnMouseDownFunc'),
        new Attr('mWDGOnMouseMove'),
        new Attr('mWDGOnKeyBoardLeft'),
        new Attr('mWDGOnKeyBoardRight'),
        new Attr('mWDGOnKeyBoardOK'),
        new Attr('mWDGMouseInnerX'),
        new Attr('mWDGMouseInnerY'),
        new Attr('mWDGOnAnimationFrame'),
        new Attr('mWDGEnterLowAlarmAction'),
        new Attr('mWDGLeaveLowAlarmAction'),
        new Attr('mWDGEnterHighAlarmAction'),
        new Attr('mWDGLeaveHighAlarmAction'),
        new Attr('mWDGMouseReleaseAction'),
        new Attr('mWDGOldValueInit'),
        new Attr('maxHighLightNum'),
        new Attr('highLightNum'),

        //add
        new Attr('curHLAnimationFactor')
    ]

    var cppWidgetAttrsTable = {}
    for (var i=0;i<cppWidgetAttrs.length;i++){
        var curWidgetAttr = cppWidgetAttrs[i]
        curWidgetAttr.index = i;
        cppWidgetAttrsTable[curWidgetAttr.name] = curWidgetAttr
    }
    for(var j=0;j<20;j++){
        //20 reserve attrs
        var curIdx = i +j;
        cppWidgetAttrsTable['a'+curIdx] = new Attr('a'+curIdx,4,curIdx) 
    }

    //TODO:加入curAnimationFactor，curHLAnimationFactor,totalHLFrame,nowHLFrame
    var widgetAttrMap = {
        info:{
            left:'x',
            top:'y',
            width:'mWDGWidgetWidth',
            height:'mWDGWidgetHeight'
        },
        startAnimationTag:'mWDGStartTag',
        stopAnimationTag:'mWDGStopTag',
        curAnimationTag:'mWDGAnTag',
        totalFrame:'mWDGTotalFrame',
        nowFrame:'mWDGNowFrame',
        arrange:'mWDGArrange',
        mode:'mWDGMode',
        oldValue:'mWDGOldValue',
        minValue:'mWDGMinValue',
        maxValue:'mWDGMaxValue',
        lowAlarmValue:'mWDGLowAlarmValue',
        highAlarmValue:'mWDGHighAlarmValue',
        minAngle:'mWDGMinAngle',
        maxAngle:'mWDGMaxAngle',
        numOfLayers:'mWDGNumOfLayers',
        interaction:'mWDGInteractionMode',
        tag:'mWDGBindTagID',
        generalType:'mWDGType',
        otherAttrs:'otherAttrs',
        innerX:'mWDGMouseInnerX',
        innerY:'mWDGMouseInnerY',
        oldValueInit:'mWDGOldValueInit',
        maxHighLightNum:'maxHighLightNum',
        highLightNum:'highLightNum',

        //add
        curHLAnimationFactor:'curHLAnimationFactor'
    };


    //layer attrs
    var cppLayerAttrs = [
        new Attr('mLayerOffsetX',4),
        new Attr('mLayerOffsetY',4),
        
        new Attr('scalerX',4),
        new Attr('scalerY',4),
        new Attr('MovingX',4),
        new Attr('MovingY',4),
        new Attr('rotateAngle',4),
        new Attr('shearAngleX',4),
        new Attr('shearAngleY',4),
        new Attr('projectX',4),
        new Attr('projectY',4),
        new Attr('mWidth',4),
        new Attr('mHeight',4),
        new Attr('mValidSubLayer',4),
        new Attr('mHidden',4),
        new Attr('tileBoxClass',4),
        new Attr('mRotaCenterX',4),
        new Attr('mRotaCenterY',4)
    ]

    var layerAttrTable = {

    }

    for (var i=0;i<cppLayerAttrs.length;i++){
        var curLayerAttr = cppLayerAttrs[i]
        curLayerAttr.index = i;
        layerAttrTable[curLayerAttr.name] = curLayerAttr
    }

    // console.log('layerAttrTable',layerAttrTable)

    var layerAttrMap = {
        x:'x',
        y:'y',
        width:'mWidth',
        height:'mHeight',
        hidden:'mHidden',
        rotateAngle:'rotateAngle',
        rotateCenterX:'mRotaCenterX',
        rotateCenterY:'mRotaCenterY'
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

    var subLayerAttrTable = {
        'SubLayerClassROI':new Attr('SubLayerClassROI',16,0),
        'SubLayerClassFont':new Attr('SubLayerClassFOnt',8,1),
        'SubLayerClassImage':new Attr('SubLayerClassImage',4,2),
        'SubLayerClassColor':new Attr('SubLayerClassColor',4,3)
    }

    var roiAttrs = ['p1x','p1y','p2x','p2y','p3x','p3y','p4x','p4y','alpha','beta','mode']

    var roiAttrTable = {
        // p1x:new Attr('p1x',1,0),
        // p1y:new Attr('p1y',1,0),
        // p2x:new Attr('p1x',1,0),
        // p2y:new Attr('p1x',1,0),
        // p3x:new Attr('p1x',1,0),
        // p3y:new Attr('p1x',1,0),
        // p1x:new Attr('p1x',1,0),
        // p1x:new Attr('p1x',1,0),
    }
    for (var i=0;i<roiAttrs.length;i++){
        roiAttrTable[roiAttrs[i]] = new Attr(roiAttrs[i],1,i);
    }

    var fontAttrTable = {
        fontStyle:new Attr('fontStyle',4,0),
        text:new Attr('text',1,1)
    }

    var textureAttrTable = {
        textureList:new Attr('texture',4,0),
        texture:new Attr('texture',4,1),
        type:new Attr('type',4,2)
    }


    var colorAttrTable = {
        r:new Attr('r',1,0),
        g:new Attr('g',1,1),
        b:new Attr('b',1,2),
        a:new Attr('a',1,3)
    }

    function InstOperand(bytes,reserve) {
        this.bytes = bytes
        this.reserve = reserve || false;
    }
    function Instruction(op) {
        this.op = op;
        this.operands = [].slice.call(arguments,1)
        this.index = 0
    }

    var cppWidgetInsts = {
        OPEND :new Instruction('OPEND',new InstOperand(7,true)),
        OPSTART:new Instruction('OPSTART',new InstOperand(1),new InstOperand(2),new InstOperand(4,true)),
        //lay
        OPSETLAY:new Instruction('OPSETLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4)),
        OPSETLAYTE:new Instruction('OPSETLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPGETLAY:new Instruction('OPGETLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4,true)),
        OPGETLAYTE:new Instruction('OPGETLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4,true)),
        //sublay
        OPSETSUBLAY:new Instruction('OPSETSUBLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4)),
        OPSETSUBLAYTE:new Instruction('OPSETSUBLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4)),
        OPSETSUBLAYT:new Instruction('OPSETSUBLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPSETSUBLAYTET:new Instruction('OPSETSUBLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPGETSUBLAY:new Instruction('OPGETSUBLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPGETSUBLAYTE:new Instruction('OPGETSUBLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        //temp
        OPSETTEMP:new Instruction('OPSETTEMP',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGETTEMP:new Instruction('OPGETTEMP',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGETTAG:new Instruction('OPGETTAG',new InstOperand(1),new InstOperand(6,true)),
        OPSETTAGIM:new Instruction('OPSETTAGIM',new InstOperand(3,true),new InstOperand(4)),
        OPSETTAGTE:new Instruction('OPSETTAGTE',new InstOperand(1),new InstOperand(6,true)),
        OPEQIM:new Instruction('OPEQIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPEQTE:new Instruction('OPEQTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGTIM:new Instruction('OPGTIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGTTE:new Instruction('OPGTTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGTEIM:new Instruction('OPGTEIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGTETE:new Instruction('OPGTETE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPLTIM:new Instruction('OPLTIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPLTTE:new Instruction('OPLTTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPLTEIM:new Instruction('OPLTEIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPLTETE:new Instruction('OPLTETE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPJUMP:new Instruction('OPJUMP',new InstOperand(1,true),new InstOperand(2),new InstOperand(4,true)),
        OPADDIM:new Instruction('OPADDIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPMINUSIM:new Instruction('OPMINUSIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPMULIM:new Instruction('OPMULIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPDIVIM:new Instruction('OPDIVIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPMODIM:new Instruction('OPMODIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPADDTE:new Instruction('OPADDTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPMINUSTE:new Instruction('OPMINUSTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPMULTE:new Instruction('OPMULTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPDIVTE:new Instruction('OPDIVTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPMODTE:new Instruction('OPMODTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPANDIM:new Instruction('OPANDIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPORIM:new Instruction('OPORIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPXORIM:new Instruction('OPXORIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPNOTIM:new Instruction('OPNOTIM',new InstOperand(1),new InstOperand(6,true)),
        OPANDTE:new Instruction('OPANDTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPORTE:new Instruction('OPORTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPXORTE:new Instruction('OPXORTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPNOTTE:new Instruction('OPNOTTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPSETWIDIM:new Instruction('OPSETWIDIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPSETWIDTE:new Instruction('OPSETWIDTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGETWIDTE:new Instruction('OPGETWIDTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        //widget offset
        OPSETWIDOFFSETIM:new Instruction('OPSETWIDOFFSETIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPSETWIDOFFSETTE:new Instruction('OPSETWIDOFFSETTE',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGETWIDOFFSET:new Instruction('OPGETWIDOFFSET',new InstOperand(1),new InstOperand(1),new InstOperand(5)),
        //layer offset
        OPSETLAYOFFSETIM:new Instruction('OPSETLAYOFFSETIM',new InstOperand(1),new InstOperand(1),new InstOperand(1,true),new InstOperand(4)),
        OPSETLAYOFFSETTE:new Instruction('OPSETLAYOFFSETTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4,true)),
        OPGETLAYOFFSET:new Instruction('OPGETLAYOFFSET',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4,true)),
        OPCHKVALALARM:new Instruction('OPCHKVALALARM',new InstOperand(7,true)),
        OPNOP:new Instruction('OPNOP',new InstOperand(7,true)),
        OPSTARTANIMATION:new Instruction('OPSTARTANIMATION',new InstOperand(7,true)),
        OPEXECUTEACTION:new Instruction('OPEXECUTEACTION',new InstOperand(7,true)),
        OPSETGLOBALVAR:new Instruction('OPSETGLOBALVAR',new InstOperand(1),new InstOperand(4),new InstOperand(3,true))

    }
    for (var i=0;i<opCodes.length;i++){
        cppWidgetInsts[opCodes[i]].index = i;
    }

    // console.log('cppWidgetInsts',cppWidgetInsts)

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

            if ((attrs[0] == 'this') && (attrs[1] =='layers')) {
                if (attrs[2] == 'length'){
                    // console.log('layers length')
                    return new AttrType('widget',widgetAttrMap['numOfLayers'])
                }
            }

            //otherAttrs
            //this.otherAttrs.1 = 2
            if ((attrs[0] == 'this' )&& (attrs[1] == 'otherAttrs')&&isNum(attrs[2])){
                return new AttrType('widget','a'+(cppWidgetAttrs.length+Number(attrs[2])))
            }

            
        }

        if (attrs.length == 4){
            //this.layers.0.hidden
            if ((attrs[0] == 'this') && (attrs[1] == 'layers') ) {
                if (isNum(attrs[2])){
                    return new AttrType('layer',layerAttrMap[attrs[3]],Number(attrs[2]),'IMM')
                }else{
                    return new AttrType('layer',layerAttrMap[attrs[3]],attrs[2],'ID')
                }
            }



        }

        if (attrs.length==6){
            //this.layers.0.subLayers.texture.texture
            if ((attrs[0] == 'this') && (attrs[1] == 'layers') && (attrs[3]=='subLayers')) {
                // var subLayer = attrs[4]
                // var subLayerAttr = attrs[5]
                if (isNum(attrs[2])){
                    return new AttrType('subLayer',subLayerAttrMap[attrs[4]],attrs[5],Number(attrs[2]),'IMM')
                }else{
                    return new AttrType('subLayer',subLayerAttrMap[attrs[4]],attrs[5],attrs[2],'ID')
                }

            }
        }
        throw new Error('unsupported exp '+param.value)
        return null;
    }

    function TempID(attr) {
        return temps[attr]
    }

    function WidgetAttrID(attr) {
        // return attr;
        if (!cppWidgetAttrsTable[attr]) {
            console.log('unsupported attr',attr)
        }
        return cppWidgetAttrsTable[attr].index
    }

    function LayerAttrID(attr) {
        // return attr
        return layerAttrTable[attr].index
    }
    function SubLayerID(attr) {
        // return attr
        return subLayerAttrTable[attr].index
    }
    function SubLayerAttrID(subLayer,attr) {
        // return attr
        switch(subLayer){
            case 'SubLayerClassROI':
                return roiAttrTable[attr].index
            case 'SubLayerClassImage':
                return textureAttrTable[attr].index
            case 'SubLayerClassFont':
                return fontAttrTable[attr].index
            case 'SubLayerClassColor':
                return colorAttrTable[attr].index
        }
    }

    function transJSWidgetCommandToCPPForm(command) {
        var op = command[0]
        var inst
        var curExp
        switch (op){
            case 'temp':
                // inst = {
                //     type:'OPSETTEMP',
                //     tempID:command[1],
                //     imm:command[2].value
                // }
                inst = ['OPSETTEMP',TempID(command[1]),command[2].value]
                break;
            case 'set':
                var param1 = command[1]
                var param2 = command[2]
                if (param1.type == 'ID') {
                    if (param2.type == 'Int') {
                        //a = 2
                        // inst = {
                        //     type:'OPSETTEMP',
                        //     tempID:command[1].value,
                        //     imm:command[2].value
                        // }
                        inst = ['OPSETTEMP',TempID(command[1].value),command[2].value]
                    }else if (param2.type == 'ID'){
                        // a = b
                        
                        inst = ['OPGETTEMP',TempID(command[1].value),TempID(command[2].value)];
                    }else if (param2.type == 'EXP'){
                        // a = this.layers.1.hidden
                        curExp = expDepth(param2)
                        // console.log(curExp,'curExp')
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    switch(curExp.value){
                                        case 'x':
                                            inst = ['OPGETWIDOFFSET',TempID(param1.value),0]
                                        break;
                                        case 'y':
                                            inst = ['OPGETWIDOFFSET',TempID(param1.value),1]
                                        break;
                                        default:
                                            // console.log('command',command,curExp)
                                            inst = ['OPGETWIDTE',WidgetAttrID(curExp.value),TempID(param1.value)]
                                            // console.log('command',command,curExp,inst)
                                    }
                    
                                    
                                break;
                                case 'layer':
                                    switch(curExp.value){
                                        case 'x':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPGETLAYOFFSET',curExp.aVals[0],0,TempID(param1.value),0]
                                            }else{
                                                inst = ['OPGETLAYOFFSET',TempID(curExp.aVals[0]),0,TempID(param1.value),1]
                                            }
                                            
                                        break;
                                        case 'y':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPGETLAYOFFSET',curExp.aVals[0],1,TempID(param1.value),0]
                                            }else{
                                                inst = ['OPGETLAYOFFSET',TempID(curExp.aVals[0]),1,TempID(param1.value),1]
                                            }
                                        break;
                                        default:
                                            if (curExp.aVals[1]=='IMM'){
                                            // inst = {
                                            //     type:'OPGETLAY1',
                                            //     tempID:param1.value,
                                            //     attrID:curExp.value,
                                            //     layerID:curExp.aVals[0]
                                            // }
                                            inst = ['OPGETLAY',curExp.aVals[0],LayerAttrID(curExp.value),TempID(param1.value)]
                                        }else{
                                            // inst = {
                                            //     type:'OPGETLAY2',
                                            //     tempID:param1.value,
                                            //     attrID:curExp.value,
                                            //     layerID:curExp.aVals[0]
                                            // }
                                            inst = ['OPGETLAYTE',TempID(curExp.aVals[0]),LayerAttrID(curExp.value),TempID(param1.value)]
                                        }
                                    }
                                    

                                break;
                                case 'subLayer':

                                    if (curExp.aVals[2]=='IMM'){
                                        // inst = {
                                        //     type:'OPGETSUBLAY1',
                                        //     tempID:param1.value,
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0]
                                        // }
                                        // curExp.value = sublayAttr,sublayattr,layerID,imm
                                       inst = ['OPGETSUBLAY',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),TempID(param1.value)]
                                    }else{
                                        // inst = {
                                        //     type:'OPGETSUBLAY2',
                                        //     tempID:param1.value,
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0]
                                        // }
                                       inst = ['OPGETSUBLAYTE',TempID(curExp.aVals[1]),SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),TempID(param1.value)]
                                    }
                                break;
                            }
                        }else{
                            console.log(param2)
                            throw new Error('invalid exp',param2)
                        }
                    }
                }else if (param1.type == 'EXP'){
                    if (param2.type == 'Int') {
                        curExp = expDepth(param1)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    // inst = {
                                    //     type:'OPSETWIDIM',
                                    //     attrID:curExp.value,
                                    //     imm:param2.value
                                    // }
                                    switch(curExp.value){
                                        case 'x':
                                            inst = ['OPSETWIDOFFSETIM',0,param1.value]
                                        break;
                                        case 'y':
                                            inst = ['OPSETWIDOFFSETIM',1,param1.value]
                                        break;
                                        default:
                                            inst = ['OPSETWIDIM',WidgetAttrID(curExp.value),param2.value]
                                    }
                                    
                                break;
                                case 'layer':
                                    switch(curExp.value){
                                        case 'x':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPSETLAYOFFSETIM',curExp.aVals[0],0,0,param2.value]
                                            }else{
                                                inst = ['OPSETLAYOFFSETIM',TempID(curExp.aVals[0]),0,1,param2.value]
                                            }
                                            
                                        break;
                                        case 'y':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPSETLAYOFFSETIM',curExp.aVals[0],1,0,param2.value]
                                            }else{
                                                inst = ['OPSETLAYOFFSETIM',TempID(curExp.aVals[0]),1,1,param2.value]
                                            }
                                        break;
                                        default:
                                            if (curExp.aVals[1]=='IMM'){
                                                // inst = {
                                                //     type:'OPSETLAY1',
                                                //     attrID:curExp.value,
                                                //     layerID:curExp.aVals[0],
                                                //     imm:param2.value
                                                // }
                                                inst = ['OPSETLAY',curExp.aVals[0],LayerAttrID(curExp.value),0,param2.value]
                                            }else{
                                                // inst = {
                                                //     type:'OPSETLAY1',
                                                //     attrID:curExp.value,
                                                //     layerID:curExp.aVals[0],
                                                //     imm:param2.value
                                                // }
                                                inst = ['OPSETLAY',TempID(curExp.aVals[0]),LayerAttrID(curExp.value),1,param2.value]
                                            }
                                    }
                                    
                                    
                                break;
                                case 'subLayer':
                                    if (curExp.aVals[2]=='IMM'){
                                        // inst = {
                                        //     type:'OPSETSUBLAY1',
                                            
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETSUBLAY',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param2.value]
                                    }else{
                                        // inst = {
                                        //     type:'OPSETSUBLAY1',
                                            
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETSUBLAYTE',TempID(curExp.aVals[1]),SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param2.value]
                                    }
                                break;
                            }
                        }else{
                            console.log(param1)
                            throw new Error('invalid exp')
                        }
                    }else if(param2.type == 'ID'){
                        curExp = expDepth(param1)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                                    // inst = {
                                    //     type:'OPSETWIDTE',
                                    //     attrID:curExp.value,
                                    //     tempID:param2.value
                                    // }
                                    inst = ['OPSETWIDTE',WidgetAttrID(curExp.value),param2.value]
                                break;
                                case 'layer':
                                    switch(curExp.value){
                                        case 'x':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPSETLAYOFFSETTE',curExp.aVals[0],0,TempID(param2.value),0]
                                            }else{
                                                inst = ['OPSETLAYOFFSETTE',TempID(curExp.aVals[0]),0,TempID(param2.value),1]
                                            }
                                            
                                        break;
                                        case 'y':
                                            if (curExp.aVals[1]=='IMM') {
                                                inst = ['OPSETLAYOFFSETTE',curExp.aVals[0],1,TempID(param2.value),0]
                                            }else{
                                                inst = ['OPSETLAYOFFSETTE',TempID(curExp.aVals[0]),1,TempID(param2.value),1]
                                            }
                                        break;
                                        default:
                                            if (curExp.aVals[1]=='IMM'){
                                                // inst = {
                                                //     type:'OPSETLAY1',
                                                //     attrID:curExp.value,
                                                //     layerID:curExp.aVals[0],
                                                //     imm:param2.value
                                                // }
                                                inst = ['OPSETLAYTE',curExp.aVals[0],LayerAttrID(curExp.value),0,TempID(param2.value)]
                                            }else{
                                                // inst = {
                                                //     type:'OPSETLAY1',
                                                //     attrID:curExp.value,
                                                //     layerID:curExp.aVals[0],
                                                //     imm:param2.value
                                                // }
                                                inst = ['OPSETLAYTE',TempID(curExp.aVals[0]),LayerAttrID(curExp.value),1,TempID(param2.value)]
                                            }
                                    }
                                    
                                break;
                                case 'subLayer':
                                    if (curExp.aVals[2]=='IMM'){
                                        // inst = {
                                        //     type:'OPSETSUBLAY1',
                                            
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETSUBLAYT',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),TempID(param2.value)]
                                    }else{
                                        // inst = {
                                        //     type:'OPSETSUBLAY1',
                                            
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETSUBLAYTET',TempID(curExp.aVals[1]),SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),TempID(param2.value)]
                                    }
                                break;
                            }
                        }else{
                            console.log(param2)
                            throw new Error('invalid exp',param2)
                        }
                    }
                }
                break;
            case 'jump':
                // inst = {
                //     type:'OPJUMP',
                //     imm:command[2]
                // }
                inst = ['OPJUMP',command[2]]
                break;
            case 'end':
                // inst = {
                //     type:'OPNOP'
                // }
                inst = ['OPNOP']
                break;
            //tag
            case 'getTag':
                // inst = {
                //     type:'OPGETTAG',
                //     tempID:command[1].value
                // }
                inst =['OPGETTAG',TempID(command[1].value)]
                break;
            case 'setTag':
                if (command[1].type == 'ID'){
                    // inst = {
                    //     type:'OPSETTAGTE',
                    //     tempID:command[1].value
                    // }
                    inst = ['OPSETTAGTE',TempID(command[1].value)]
                }else{
                    // inst = {
                    //     type:'OPSETTAGIM',
                    //     imm:command[1].value
                    // }
                    inst = ['OPSETTAGIM',command[1].value]
                }
                break;
            //compare
            case 'eq':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPEQTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value

                    // }
                    inst = ['OPEQTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPEQIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPEQIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'lt':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPLTTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value

                    // }

                    inst = ['OPLTTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPLTIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPLTIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'lte':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPLTETE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value

                    // }
                    inst = ['OPLTETE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPLTEIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPLTIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'gt':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPGTTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value

                    // }
                    inst = ['OPGTTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    inst = ['OPGTIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'gte':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = ['OPGTETE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    inst = ['OPGTEIM',TempID(command[1].value),command[2].value]
                }
                break;
            //algebra
            case 'add':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPADDTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPADDTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPADDIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPADDIM',TempID(command[1].value),command[2].value]
                }
                
                break;
            case 'minus':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPMINUSTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPMINUSTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPMINUSIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMINUSIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'multiply':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPMULTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPMULTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPMULIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMULIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'divide':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPDIVTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPDIVTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPDIVIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPDIVIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'mod':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPMODTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPMODTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPMODIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMODIM',TempID(command[1].value),command[2].value]
                }
                break;
            //bit operation
            case 'and':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPANDTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPANDTE',TempID(command[1].value),cTempID(ommand[2].value)]
                }else{
                    // inst = {
                    //     type:'OPANDIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPANDIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'or':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPORTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPORTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPORIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPORIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'xor':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPXORTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPXORTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPXORIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPXORIM',TempID(command[1].value),command[2].value]
                }
                break;
            case 'not':
                if (command[2]&&command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPNOTTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPNOTTE',TempID(command[1].value),TempID(command[2].value)]
                }else{
                    // inst = {
                    //     type:'OPNOTIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPNOTIM',TempID(command[1].value)]
                }
                break;
            case 'checkalarm':
                inst = ['OPCHKVALALARM']
            break;
            case 'startanimation':
                inst = ['OPSTARTANIMATION']
                break;
            case 'setglobalvar':
                inst = ['OPSETGLOBALVAR',command[1].value,command[2].value];
                break;
            case 'executeaction':
                inst = ['OPEXECUTEACTION',command[1].value]
            break;
            default:
                console.log('warning: ',op)
                inst = ['OPNOP']

        }
        return inst;
    }

    function buf2hex(buffer) { // buffer is an ArrayBuffer
      return Array.prototype.map.call(new Uint8Array(buffer), function (x) {
          return ('00' + x.toString(16)).slice(-2)
      }).join('')
    }

    function mapArrayCmdToBuffer(cmd) {
        var bigEndian = true;
        var buf = new ArrayBuffer(8)
        var dv = new DataView(buf)
        var count = 1//cmd parameters
        var bytesCount = 0
        // console.log(cmd)
        var op = cmd[0]
        var cmdProto = cppWidgetInsts[op];
        if (!cmdProto) {
            console.log('unsupported op',op)
        }
        var bytes = 0;
        var reserve = false;
        dv.setUint8(bytesCount,cmdProto.index,bigEndian);
        bytesCount +=1;
        for (var i=0;i<cmdProto.operands.length;i++){
            bytes = cmdProto.operands[i].bytes
            reserve = cmdProto.operands[i].reserve
            if (!reserve) {
                //write cmd[count]
                switch(bytes){
                    case 1:
                        dv.setUint8(bytesCount,cmd[count],bigEndian)
                    break;
                    case 2:
                        dv.setUint16(bytesCount,cmd[count],bigEndian)
                    break;
                    case 4:
                        dv.setUint32(bytesCount,cmd[count],bigEndian)
                    break;
                    default:
                        console.log('writing to buffer error',cmd)
                }

                count = count +1;
            }else{

            }
            bytesCount += bytes;
        }
        // console.log(new Uint8Array(buf))
        return buf2hex(buf)

    }

    function mapArrayCmdsToBuffer(cmds) {
        return cmds.map(function (c) {
            return mapArrayCmdToBuffer(c)
        })
    }

    function transJSWidgetCommands(commands){
        var transedCommands = []
        //scan temps
        var tempCommands = commands.filter(function (cmd) {
            return cmd[0] == 'temp'
        })
        var count = 0;
        temps = {}
        for (var i=0;i<tempCommands.length;i++){
            var curTemp = tempCommands[i][1]
            if (!(curTemp in temps)) {
                temps[curTemp] = count
                count++;
            }
        }
        //total num count
        transedCommands.push(['OPSTART',count,commands.length])
        for (var j=0;j<commands.length;j++){
            transedCommands.push(transJSWidgetCommandToCPPForm(commands[j]))
        }
        transedCommands.push(['OPEND'])
        // console.log('transedCmd',transedCommands)
        var bufCommands = mapArrayCmdsToBuffer(transedCommands)
        // console.log(bufCommands)
        return bufCommands
    }
    translator.transJSWidgetCommandToCPPForm = transJSWidgetCommandToCPPForm
    translator.transJSWidgetCommands = transJSWidgetCommands;
    return translator;
}))