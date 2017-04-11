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


    function Attr(name,bytes,index) {
        this.name = name||''
        this.bytes = bytes||0
        this.index = index||0
    }

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
        new Attr('startTag',4),
        new Attr('stopTag',4),
        new Attr('minValue',4),
        new Attr('maxValue',4),
        new Attr('lowAlarmValue',4),
        new Attr('highAlarmValue',4),
        new Attr('minAngle',4),
        new Attr('maxAngle',4),
        new Attr('oldValue',4),
        new Attr('mATag',4),
        new Attr('numOfLayers',4),
        new Attr('startAddrOfLayers',4),
        new Attr('widgetWidth',4),
        new Attr('widgetHeight',4),
        new Attr('mWidgetOffsetX',4),
        new Attr('mWidgetOffsetY',4),
        new Attr('mBindTagID',4),
        new Attr('attatchCanvasID',4),
        new Attr('preWidgetID',4),
        new Attr('nextWidgetID',4),
        new Attr('totalFrame',4),
        new Attr('nowFrame',4),
        new Attr('mInteraction',4),
        new Attr('mMode',4),
        new Attr('mArrange',4),
        new Attr('generalType',4)
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

    console.log('cppWidgetAttrsTable',cppWidgetAttrsTable)

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
        new Attr('mLayerOffsetX',4),
        new Attr('mLayerOffsetY',4),
        new Attr('tileBoxClass',4),
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
        new Attr('mHidden',4)
    ]

    var layerAttrTable = {

    }

    for (var i=0;i<cppLayerAttrs.length;i++){
        var curLayerAttr = cppLayerAttrs[i]
        curLayerAttr.index = i;
        layerAttrTable[curLayerAttr.name] = curLayerAttr
    }

    console.log('layerAttrTable',layerAttrTable)

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

    var subLayerAttrTable = {
        'SubLayerClassROI':new Attr('SubLayerClassROI',16,0),
        'SubLayerClassFont':new Attr('SubLayerClassFOnt',8,1),
        'SubLayerClassImage':new Attr('SubLayerClassImage',4,2),
        'SubLayerClassColor':new Attr('SubLayerClassColor',4,3)
    }

    var roiAttrs = ['p1x','p1y','p2x','p2y','p3x','p3y','p4x','p4y','p5x','p5y','p6x','p6y','p7x','p7y','p8x','p8y']

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
        text:new Attr('text',4,1)
    }

    var textureAttrTable = {
        texture:new Attr('texture',4,0)
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
    }

    var cppWidgetInsts = {
        OPEND :new Instruction('OPEND',new InstOperand(7,true)),
        OPSTART:new Instruction('OPSTART',new InstOperand(1),new InstOperand(2),new InstOperand(4,true)),
        OPSETLAY:new Instruction('OPSETLAY',new InstOperand(1),new InstOperand(2),new InstOperand(4)),
        OPSETLAYTE:new Instruction('OPSETLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1,true),new InstOperand(4)),
        OPGETLAY:new Instruction('OPGETLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4,true)),
        OPGETLAYTE:new Instruction('OPGETLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPSETSUBLAY:new Instruction('OPSETSUBLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4)),
        OPSETSUBLAYTE:new Instruction('OPSETSUBLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(4)),
        OPGETSUBLAY:new Instruction('OPGETSUBLAY',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPGETSUBLAYTE:new Instruction('OPGETSUBLAYTE',new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(1),new InstOperand(3,true)),
        OPSETTEMP:new Instruction('OPSETTEMP',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGETTEMP:new Instruction('OPGETTEMP',new InstOperand(1),new InstOperand(1),new InstOperand(5,true)),
        OPGETTAG:new Instruction('OPGETTAG',new InstOperand(1),new InstOperand(6,true)),
        OPSETTAGIM:new Instruction('OPSETTAGIM',new InstOperand(3,true),new InstOperand(4)),
        OPSETTAGTE:new Instruction('OPSETTAGTE',new InstOperand(1),new InstOperand(6,true)),
        OPEQIM:new Instruction('OPEQIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPEQTE:new Instruction('OPEQTE',new InstOperand(1),new InstOperand(1),new Instruction(5,true)),
        OPGTIM:new Instruction('OPGTIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGTTE:new Instruction('OPGTTE',new InstOperand(1),new InstOperand(1),new Instruction(5,true)),
        OPGTEIM:new Instruction('OPGTEIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPGTETE:new Instruction('OPGTETE',new InstOperand(1),new InstOperand(1),new Instruction(5,true)),
        OPLTIM:new Instruction('OPLTIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPLTTE:new Instruction('OPLTTE',new InstOperand(1),new InstOperand(1),new Instruction(5,true)),
        OPLTEIM:new Instruction('OPLTEIM',new InstOperand(1),new InstOperand(2,true),new InstOperand(4)),
        OPLTETE:new Instruction('OPLTETE',new InstOperand(1),new InstOperand(1),new Instruction(5,true)),
        OPJUMP:new Instruction('OPJUMP',new InstOperand(5,true),new InstOperand(2)),
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
        OPNOP:new Instruction('OPNOP',new InstOperand(7,true))

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

            if ((attrs[0] == 'this') && (attrs[1] =='layers')) {
                if (attrs[2] == 'length'){
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

        return null;
    }

    function WidgetAttrID(attr) {
        return attr;
    }

    function LayerAttrID(attr) {
        return attr
    }
    function SubLayerID(attr) {
        return attr
    }
    function SubLayerAttrID(sublayer,attr) {
        return attr
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
                inst = ['OPSETTEMP',command[1],command[2].value]
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
                        inst = ['OPSETTEMP',command[1].value,command[2].value]
                    }else if (param2.type == 'ID'){
                        // a = b
                        
                        inst = ['OPGETTEMP',command[1].value,command[2].value];
                    }else if (param2.type == 'EXP'){
                        // a = this.layers.1.hidden
                        curExp = expDepth(param2)
                        if (curExp) {
                            switch(curExp.type){
                                case 'widget':
                    
                                    inst = ['OPGETWIDTE',WidgetAttrID(curExp.value),param1.value]
                                break;
                                case 'layer':
                                    if (curExp.aVals[1]=='IMM'){
                                        // inst = {
                                        //     type:'OPGETLAY1',
                                        //     tempID:param1.value,
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0]
                                        // }
                                        inst = ['OPGETLAY',curExp.aVals[0],LayerAttrID(curExp.value),param1.value]
                                    }else{
                                        // inst = {
                                        //     type:'OPGETLAY2',
                                        //     tempID:param1.value,
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0]
                                        // }
                                        inst = ['OPGETLAYTE',curExp.aVals[0],LayerAttrID(curExp.value),param1.value]
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
                                       inst = ['OPGETSUBLAY',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param1.value]
                                    }else{
                                        // inst = {
                                        //     type:'OPGETSUBLAY2',
                                        //     tempID:param1.value,
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0]
                                        // }
                                       inst = ['OPGETSUBLAYTE',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param1.value]
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
                                    inst = ['OPSETWIDIM',WidgetAttrID(curExp.value),param2.value]
                                break;
                                case 'layer':
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
                                        inst = ['OPSETLAY',curExp.aVals[0],LayerAttrID(curExp.value),1,param2.value]
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
                                        inst = ['OPSETSUBLAYTE',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param2.value]
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
                                    if (curExp.aVals[1]=='IMM'){
                                        // inst = {
                                        //     type:'OPSETLAY1',
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETLAYTE',curExp.aVals[0],LayerAttrID(curExp.value),0,param2.value]
                                    }else{
                                        // inst = {
                                        //     type:'OPSETLAY1',
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETLAYTE',curExp.aVals[0],LayerAttrID(curExp.value),1,param2.value]
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
                                        inst = ['OPSETSUBLAYT',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param2.value]
                                    }else{
                                        // inst = {
                                        //     type:'OPSETSUBLAY1',
                                            
                                        //     attrID:curExp.value,
                                        //     layerID:curExp.aVals[0],
                                        //     imm:param2.value
                                        // }
                                        inst = ['OPSETSUBLAYTET',curExp.aVals[1],SubLayerID(curExp.value),SubLayerAttrID(curExp.value,curExp.aVals[0]),param2.value]
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
                inst =['OPGETTAG',command[1].value]
                break;
            case 'setTag':
                if (command[1].type == 'ID'){
                    // inst = {
                    //     type:'OPSETTAGTE',
                    //     tempID:command[1].value
                    // }
                    inst = ['OPSETTAGTE',command[1].value]
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
                    inst = ['OPEQTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPEQIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPEQIM',command[1].value,command[2].value]
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

                    inst = ['OPLTTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPLTIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPLTIM',command[1].value,command[2].value]
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
                    inst = ['OPLTETE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPLTEIM',
                    //     tempID1:command[1].value,
                    //     imm:command[2].value

                    // }
                    inst = ['OPLTIM',command[1].value,command[2].value]
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
                    inst = ['OPGTTE',command[1].value,command[2].value]
                }else{
                    inst = ['OPGTIM',command[1].value,command[2].value]
                }
                break;
            case 'gte':
                if (command[2].type == 'ID'){
                    //comapare two id
                    inst = ['OPGTETE',command[1].value,command[2].value]
                }else{
                    inst = ['OPGTEIM',command[1].value,command[2].value]
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
                    inst = ['OPADDTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPADDIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPADDIM',command[1].value,command[2].value]
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
                    inst = ['OPMINUSTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPMINUSIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMINUSIM',command[1].value,command[2].value]
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
                    inst = ['OPMULTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPMULIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMULIM',command[1].value,command[2].value]
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
                    inst = ['OPDIVTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPDIVIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPDIVIM',command[1].value,command[2].value]
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
                    inst = ['OPMODTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPMODIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPMODIM',command[1].value,command[2].value]
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
                    inst = ['OPANDTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPANDIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPANDIM',command[1].value,command[2].value]
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
                    inst = ['OPORTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPORIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPORIM',command[1].value,command[2].value]
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
                    inst = ['OPXORTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPXORIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPXORIM',command[1].value,command[2].value]
                }
                break;
            case 'not':
                if (command[2].type == 'ID'){
                    //comapare two id
                    // inst = {
                    //     type:'OPNOTTE',
                    //     tempID1:command[1].value,
                    //     tempID2:command[2].value
                    // }
                    inst = ['OPNOTTE',command[1].value,command[2].value]
                }else{
                    // inst = {
                    //     type:'OPNOTIM',
                    //     tempID:command[1].value,
                    //     imm:command[2].value
                    // }
                    inst = ['OPNOTIM',command[1].value]
                }
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