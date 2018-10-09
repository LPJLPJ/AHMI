var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var TagList = require('./TagList');
var RegisterList = require('./RegisterList');
var LoadState = require('./LoadState');
var InputKeyboard = require('./inputKeyboard');
var Utils = require('../utils/utils');
var VideoSource = require('./VideoSource');
var Debugger = require('./Debugger');
var EasingFunctions = require('../utils/easing');
var AnimationManager = require('../utils/animationManager');
var AnimationAPI = require('../utils/animationAPI')
var math = require('mathjs');
var StringConverter = require('./StringConverter')
var WidgetExecutor = {

}
window.WidgetExecutor = WidgetExecutor;

var env = 'dev' //dev or build
var lg = (function () {
    if (env === 'dev') {
        return function () {
            return console.log([].slice.apply(arguments));
        };
    } else {
        return function () {

        }
    }
}());

var sep = '/';
var defaultState = {
    loadDone: false,
    curPageIdx: 0,
    tagList: [],
    resourceList: [],
    imageList: [],
    timerList: [],
    currentPressedTargets: [],
    registers: {}


};

if (global && global.process && global.process.platform.indexOf('win') !== -1) {
    sep = '\\';
}

var defaultSimulator = {
    project: {},
    curPageIdx: 0,
    scale: 1.0,
    tagList: [],
    resourceList: [],
    imageList: [],
    timerList: [],
    innerTimerList: [],
    currentPressedTargets: [],
    totalResourceNum: 0,
    fps:0,
    debugInfo:{
        widgetType:null,
        trigger:null,
        line:null
    }
}
module.exports = React.createClass({
    getInitialState: function () {
        return _.cloneDeep(defaultSimulator)
    },
    componentWillUnmount: function () {
        this.state.timerList.map(function (timer, i) {
            var curTimeID = timer.timerID;
            clearInterval(curTimeID);
        }.bind(this));
        this.state.innerTimerList.map(function (timerId) {
            clearInterval(timerId);
        }.bind(this));
        this.simState = {};
        VideoSource.pause();
        AnimationManager.clearAllAnimationKeys();
        cancelAnimationFrame(this.paintKey)
    },
    initCanvas: function (data, callBack) {
        var i;
        this.mouseState = {
            state: 'release',
            position: {
                x: 0,
                y: 0
            },
            timeStamp:Date.now()
        }
        var offcanvas = this.refs.offcanvas;
        var projectWidth = data.size.width;
        var projectHeight = data.size.height;
        offcanvas.width = projectWidth;
        offcanvas.height = projectHeight;
        var canvas = this.refs.canvas;
        canvas.width = projectWidth;
        canvas.height = projectHeight;
        //draw initialization
        lg('initializing: ', data)
        //initialize canvas context
        this.generalCommands = data.generalWidgetCommands||{}

        this.originalPageNum = data.pageList.length

        //initialize inputkeyboard
        var keyboardData = InputKeyboard.getInputKeyboard(projectWidth, projectHeight, 0, 0);
        // console.log(keyboardData);
        // data.pageList.push(keyboardData);

        //remember inputkeyboard page and widget
        this.inputKeyboard = {};
        this.inputKeyboard.page = keyboardData;
        this.inputKeyboard.widget = keyboardData.canvasList[0].subCanvasList[0].widgetList[0];

        //initialize return button
        var defaultMargin = this.defaultMargin || 5
        var sysCanvas = keyboardData.canvasList[0]
        var minReturnButtonSize = Math.ceil(0.05*Math.min(sysCanvas.w,sysCanvas.h))

        var returnButtonImgSrc = '/public/images/returnButton/returnIcon.png'
        var returnButtonData = {
                type:'widget',
                subType:'MyReturnButton',
                buttonModeId:'0',
                info :{
                    width:minReturnButtonSize,
                    height: minReturnButtonSize,
                    left: sysCanvas.w-minReturnButtonSize-defaultMargin, top: defaultMargin,
                    originX: 'center', originY: 'center',
                    arrange:true,

                    text:'',
                    fontFamily:"宋体",
                    fontSize:20,
                    fontColor:'rgba(0,0,0,1)',
                    fontBold:"100",
                    fontItalic:'',
                },
                texList:[{
                    name:'按钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:'rgba(255,0,0,0)',
                        imgSrc:returnButtonImgSrc,
                        name:'按下前'
                    },{
                        color:'rgba(0,255,0,0)',
                        imgSrc:returnButtonImgSrc,
                        name:'按下后'
                    },{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]
            }


        //handle system widgets
        var systemWidgetResources = []
        this.systemWidgets = data.systemWidgets

        this.systemWidgetPages = (data.systemWidgets||[]).map(function (sw,i) {
            var pageData = _.cloneDeep(keyboardData)
            pageData.canvasList[0].subCanvasList[0].widgetList[0] = sw
            //push return button
            pageData.canvasList[0].subCanvasList[0].widgetList[1] = _.cloneDeep(returnButtonData)
            // data.pageList.push(pageData)
            var swRes = [];
            (sw.layers||[]).forEach(function (layer) {
                layer.subLayers.image && (swRes = swRes.concat(layer.subLayers.image.textureList))
            })
            systemWidgetResources = systemWidgetResources.concat(swRes)
            return pageData
        })
        systemWidgetResources = systemWidgetResources.map(function (r) {
            return {id:this.getImageName(r),name:this.getImageName(r), type:'image/png',src:r}
        }.bind(this))
        systemWidgetResources.push({id:this.getImageName(returnButtonImgSrc),name:this.getImageName(returnButtonImgSrc), type:'image/png',src:returnButtonImgSrc})
        console.log('systemWidgetResources',systemWidgetResources)



        var ctx = canvas.getContext('2d');
        ctx.font = "italic bold 48px serif";
        ctx.fillStyle = "white";
        ctx.fillText("加载中...", 0.5 * projectWidth, 0.5 * projectHeight);

        //initialize tagList
        //check curPage tag


        data.tag = '当前页面序号';
        // this.state.tagList = data.tagList
        // this.setState({tagList: data.tagList})
        // this.state.tagList = data.tagList;
        // data.tagList.push({
        //     name:'stringTest',
        //     valueType:1,
        //     value:StringConverter.convertStrToUint8Array('hello').slice(0,32),
        //     register:true,
        //     indexOfRegister:3,
        //     type:'custom'
        // })
        this.state.tagList = data.tagList;
        this.setState({tagList: data.tagList});
        console.log('tagList loaded', data.tagList, this.state.tagList);
        //initialize registers
        this.registers = {};
        var curTag;
        var curRegIdx;
        for (var i = 0; i < data.tagList.length; i++) {
            curTag = data.tagList[i];
            curRegIdx = curTag.indexOfRegister;
            if (curTag.register && curRegIdx !== undefined && curRegIdx !== '' && curRegIdx !== null) {
                if (this.registers[curRegIdx]) {
                    this.registers[curRegIdx].tags.push(curTag)
                } else {
                    this.registers[curRegIdx] = {
                        tags: [curTag],
                        value: 0
                    }
                }
            }
        }
        // console.log(this.registers);
        this.state.registers = this.registers;
        this.setState({registers: this.registers});

        //initialize timer
        var timerList = [];
        // var postfix = ['Start','Stop','Step','Interval','CurVal','Mode'];
        for (var i = 0; i < parseInt(data.timers); i++) {
            var newTimer = {};
            newTimer['timerID'] = 0;
            newTimer['SysTmr_' + i + '_Start'] = 0;
            newTimer['SysTmr_' + i + '_Stop'] = 0;
            newTimer['SysTmr_' + i + '_Step'] = 0;
            newTimer['SysTmr_' + i + '_t'] = 0;
            newTimer['SysTmr_' + i + '_Interval'] = 0;
            newTimer['SysTmr_' + i + '_Mode'] = 0;
            timerList.push(newTimer);
        }

        // this.setState({timerList:timerList});
        this.state.timerList = timerList;


        // console.log('timerList loaded', timerList);

        /*init animation keys */

        //loading resources
        var resourceList = [];
        var imageList = []
        var allResources = data.resourceList || [];
        this.state.resourceList = resourceList
        //this.state.imageList = imageList
        var basicUrl = data.basicUrl;
        var num = allResources.length;
        this.state.totalResourceNum = num;

        // process window.cachedResourceList


        //if resource.complete == false  content set to be blank

        imageList = window.cachedResourceList;
        this.state.imageList = imageList;
        var requiredResourceList = [];
        //handle required resources like key tex
        requiredResourceList = requiredResourceList.concat(InputKeyboard.texList);
        requiredResourceList = requiredResourceList.concat(systemWidgetResources||[])
        // console.log(requiredResourceList)

        var requiredResourceNum = requiredResourceList.length;
        this.totalRequiredResourceNum = requiredResourceNum;

        this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
        //console.log('haha',resourceList);
        // callBack(data);


        //load widgets
        this.registerWidgets();


        //set basic parameters
        this.fps = 30
        this.defaultDuration = 1000


        if (requiredResourceNum > 0) {
            requiredResourceList.forEach(function (resource) {
                if (this.isIn(resource, imageList, 'id')) {
                    requiredResourceNum -= 1;
                    this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
                    if (requiredResourceNum <= 0) {
                        callBack(data);
                    }
                    return;
                }
                var newResource = {};
                newResource.id = resource.id;
                newResource.name = resource.name;
                newResource.type = resource.type;
                switch (resource.type.split('/')[0]) {
                    case 'image':
                        var newImg = new Image();
                        newImg.src = resource.src;
                        newImg.onload = function () {
                            requiredResourceNum = requiredResourceNum - 1;
                            //update loading progress
                            this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
                            if (requiredResourceNum <= 0) {
                                // console.log(imageList);
                                callBack(data);
                            }
                        }.bind(this);
                        newImg.onerror = function (e) {
                            console.log(e);
                            newImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII="

                        }.bind(this);
                        newResource.content = newImg;
                        imageList.push(newResource)

                        break;
                    default:
                        num = num - 1
                        this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
                        if (requiredResourceNum == 0) {
                            callBack(data);
                            return;
                        }
                        //update loading progress
                        break;

                }


            }.bind(this));

        } else {
            callBack(data)
        }
    },
    transFunction:function (widget,f) {
        console.log(widget[f])
    },
    registerWidgets:function () {
        this.gWidgets = {}
        //register getTag setTag

        console.log(this.project)
        WidgetExecutor.setTag = function (tag,value) {
            // console.log('aaa',tag,value)
            this.setTagByName(tag,value)
            this.draw(null,{
                updatedTagName:tag
            })
        }.bind(this)
        WidgetExecutor.getTag = function (tag) {
            return this.getValueByTagName(tag)
        }.bind(this)
    },
    transGeneralWidget:function (widget) {


    },
    drawGeneralWidget:function (curX,curY,widget,options,cb) {
        if (!widget.initialzed){
            widget.initialzed = true;
            this.interpretGeneralCommand(widget,'onInitialize');
            this.interpretGeneralCommand(widget,'onTagChange')
        }else{

            if (options && widget.tag!==undefined){
                if ((options.updatedTagName !==undefined && options.updatedTagName === widget.tag) || (options.updatedTagNames && this.isIn(widget.tag,options.updatedTagNames))){
                    //change
                    this.handleTargetAction(widget,'TagChange')
                    this.interpretGeneralCommand(widget,'onTagChange')
                }
            }
        }


    },
    drawGeneralButton:function (curX,curY,widget,options,cb) {


    },
    paintGeneralWidget:function (curX,curY,widget,options,cb,ctx) {
        var offCtx = ctx||offcanvas.getContext('2d');
        offCtx.save()
        offCtx.beginPath()
        offCtx.rect(curX,curY,widget.info.width,widget.info.height)
        offCtx.clip()
        for (var i=0;i<widget.layers.length;i++){
            this.paintGeneralLayer(curX,curY,widget.layers[i],widget,ctx);
        }
        offCtx.restore()
        cb &&cb();
    },
    paintGeneralButton:function (curX,curY,widget,options,cb) {

    },
    paintGeneralLayer:function (curX,curY,layer,widget,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offCtx = ctx||offcanvas.getContext('2d');
        var transX,transY;
        if (!layer.hidden) {
            var subLayers = layer.subLayers;
            var baseX = curX+ layer.x;
            var baseY =  curY+layer.y;
            if (!!layer.rotateAngle) {
                transX = baseX+(layer.rotateCenterX||0)
                transY = baseY+(layer.rotateCenterY||0)
                offCtx.save()
                offCtx.translate(transX,transY)
                offCtx.rotate((layer.rotateAngle)/180.0*Math.PI)
                offCtx.translate(-transX,-transY)

                this.paintSubLayers(baseX,baseY,layer.width,layer.height,subLayers,widget,offCtx)
                offCtx.restore()
            }else{
                this.paintSubLayers(baseX,baseY,layer.width,layer.height,subLayers,widget,offCtx)
            }




        }

    },
    paintSubLayers:function (baseX,baseY,width,height,subLayers,widget,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offCtx = ctx||offcanvas.getContext('2d');
        var hasROI = false
        var roi
        var p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,alpha,beta

        if (subLayers.roi) {
            hasROI = true;
            roi = subLayers.roi;
            p1x = roi.p1x;
            p1y = roi.p1y;
            p2x = roi.p2x;
            p2y = roi.p2y;
            p3x = roi.p3x;
            p3y = roi.p3y;
            p4x = roi.p4x;
            p4y = roi.p4y;
            alpha = roi.alpha;
            beta = roi.beta;
        }
        if (hasROI) {
            offCtx.save()
            //console.log('roi.mode',roi.mode)
            if (roi.mode == 1) {
                //ray
                var lt = Math.pow(p1x,2)+Math.pow(p1y,2)
                var rt = Math.pow(width-p1x,2)+Math.pow(p1y,2)
                var lb = Math.pow(p1x,2)+Math.pow(height-p1y,2)
                var rb = Math.pow(width-p1x,2)+Math.pow(height-p1y,2)
                var longestD = Math.max(lt,rt,lb,rb)
                longestD = Math.sqrt(longestD)
                offCtx.beginPath()
                offCtx.moveTo(baseX+p1x,baseY+p1y)
                offCtx.arc(baseX+p1x, baseY+p1y,longestD,Math.PI * (alpha) / 180, Math.PI * (beta) / 180);
                offCtx.closePath()
                offCtx.clip()
            }else{
                //four points
                //console.log('unsupported')
                offCtx.beginPath();
                offCtx.moveTo(baseX+p1x,baseY+p1y);
                offCtx.lineTo(baseX+p2x,baseY+p2y);
                offCtx.lineTo(baseX+p3x,baseY+p3y);
                offCtx.lineTo(baseX+p4x,baseY+p4y);
                offCtx.closePath();
                offCtx.clip();
            }

        }
        this.paintColorSL(baseX,baseY,width,height,subLayers.color,offCtx)
        this.paintTextureSL(baseX,baseY,width,height,subLayers.image,offCtx)
        this.paintFontSL(baseX,baseY,width,height,subLayers.font,offCtx)

        if (hasROI) {
            offCtx.restore()
        }
    },
    paintROISL:function (curX,curY,subLayer) {

    },
    paintFontSL:function (curX,curY,slWidth,slHeight,subLayer,ctx) {
        // var slX = curX + subLayer.x;
        // var slY = curY + subLayer.y;
        if (subLayer&&subLayer.text!==undefined&&subLayer.text!==null) {
            var self = this
            this.drawTextByTempCanvas(ctx,curX,curY,slWidth,slHeight,subLayer.text,self.transFont(subLayer.fontStyle));
        }


    },
    transFont:function(widgetFont){
        // fontBold: "100"
        //
        // fontColor: "rgba(0,0,0,1)"
        //
        // fontFamily: "宋体"
        //
        // fontItalic: ""
        //
        // fontSize: 15
        //
        // fontUnderline: null
        if(widgetFont['font-family']&&widgetFont['font-size']!==undefined){
            return widgetFont
        }else{
            return {
                "font-size":widgetFont.fontSize,
                "font-family":widgetFont.fontFamily,
                "font-weight":widgetFont.fontBold,
                "font-color":widgetFont.fontColor,
                "font-style":widgetFont.fontItalic?'italic':''
            }
        }

    },
    paintTextureSL:function (curX,curY,slWidth,slHeight,subLayer,ctx) {
        // var slX = curX + subLayer.x;
        // var slY = curY + subLayer.y;
        if (subLayer){
            var imgSrc = (subLayer.textureList||[])[subLayer.texture]
            if (imgSrc) {

                this.drawBgImg(curX,curY,slWidth,slHeight,imgSrc,ctx)
            }
        }


    },
    paintColorSL:function (curX,curY,slWidth,slHeight,subLayer,ctx) {
        if (subLayer) {
            var color = subLayer;
            var colorStr = 'rgba('+color.r+','+color.g+','+color.b+','+(color.a/255.0)+')'
            this.drawBg(curX,curY,slWidth,slHeight,null,colorStr,ctx)
        }


    },
    isIn: function (res, resList, key) {
        if (key) {
            for (var i = 0; i < resList.length; i++) {
                if (res[key] === resList[i][key]) {
                    return true;
                }
            }
            return false;
        } else {
            for (var i = 0; i < resList.length; i++) {
                if (res === resList[i]) {
                    return true;
                }
            }
            return false;
        }

    },
    initProject: function () {

        if (this.state.project && this.state.project.size) {
            this.inModifing = 0;
            this.initCanvas(this.state.project, this.draw.bind(this, null, {reLinkWidgets: true}));
        } else {
            this.draw.bind(this, null, {reLinkWidgets: true})
        }
    },
    interpretGeneralCommand:function (widget,f) {
        // console.log(widget,f)
        this.processGeneralWidgetCommand(widget,f,0)
    },
    evalParam:function (widget,param) {
        var value = param.value;
        switch (param.type){
            case 'Int':
                return parseInt(value)||0
            case 'String':
                return ""+value
            case 'ID':
                return widget.scope[value]||0
            case 'EXP':
                var variables = value.split('.')
                var result;
                var isCharCode = true;

                for (var i=0;i<variables.length;i++){
                    var curV = variables[i];
                    if (curV == 'this') {
                        result = widget;
                    }else{
                        curV = this.evalVariable(widget,curV)
                        // console.log('curV',curV);
                        if (result!==undefined){
                            result = result[curV]
                        }else{
                            console.log('get param error: ',result,curV)
                        }


                        // console.log('result',result)
                    }
                }
                return result||0;
        }
    },
    charFromCode:function (code) {
        if (code>=48&&code<=57) {
            return ''+(code-48)
        }
        switch(code){
            case 0:
                return ''
            break;
            case 45:
                return '-';
            break;
            case 46:
                return '.'
            break;
            default:
                console.log('unsupported code: '+code)
                return code
        }
    },
    evalVariable:function (widget,v) {
        if (widget.scope && (v in widget.scope)) {
            return widget.scope[v]
        }else{
            return v;
        }
    },
    setByParam:function (widget,param,value) {
        switch (param.type){
            case 'ID':
                widget.scope[param.value] = this.evalParam(widget,value)
                break;
            case 'EXP':
                var refs = param.value.split('.');
                var rLen = refs.length;
                if (rLen<2) {
                    return
                }else {
                    var upperRef = this.evalParam(widget,{type:'EXP',value:refs.slice(0,rLen-1).join('.')})
                    if (upperRef===undefined){
                        //not exists
                        console.log('upperRef undefined: ',refs)
                        break
                    }
                    var nextV = this.evalVariable(widget,refs[rLen-1])
                    if (nextV=='text' && (upperRef.layerName==='FontSubLayer')) {
                        var charCode = this.evalParam(widget,value)
                        upperRef[nextV] = this.charFromCode(charCode)
                    }else{
                        // console.log('nextV ',nextV)
                        upperRef[nextV] = this.evalParam(widget,value)
                    }

                }
                break;
            default:
                console.error('set error')
        }
    },
    processGeneralWidgetCommand:function (widget,f,index) {
        // console.log('widget hahaha',widget,f);
        // console.log('generalCommands',this.generalCommands)
        var cmds = this.generalCommands[widget.generalType][f];

        var totalLength = (cmds && cmds.length)||-1;
        if (index<0) {
            return;
        }else if (index>totalLength-1) {
            return;
        }
        if (Debugger.shouldPause(this.generalCommands,widget.generalType,f,index)) {
            // console.log(widget.generalType,'debugging',index)
            Debugger.pause(null,widget.scope,cmds,index)
        }
        var step = 1;
        var curInst = cmds[index]
        // console.log(curInst)
        var op = curInst[0]
        // console.log(_.cloneDeep(curInst),_.cloneDeep(widget.scope))
        switch(op){
            case 'temp':
                if (!widget.scope) {
                    widget.scope = {}
                }
                widget.scope[curInst[1]] = this.evalParam(widget,curInst[2])
                break;
            case 'set':
                // console.log('set ',_.cloneDeep(curInst))
                this.setByParam(widget,curInst[1],curInst[2])
                // console.log(widget)
                break;
            case 'get':
                widget.scope[curInst[1]] = this.evalParam(widget,curInst[2])
                break;
            case 'eq':
                // console.log(this.evalParam(widget,curInst[1]),this.evalParam(widget,curInst[2]))
                if (this.evalParam(widget,curInst[1])==this.evalParam(widget,curInst[2])) {
                    step = 2;
                }else{
                    step = 1;
                }
                break;
            case 'gte':
                if (this.evalParam(widget,curInst[1])>=this.evalParam(widget,curInst[2])) {
                    step = 2;
                }else{
                    step = 1;
                }

                break;
            case 'gt':
                if (this.evalParam(widget,curInst[1])>this.evalParam(widget,curInst[2])) {
                    step = 2;
                }else{
                    step = 1;
                }

                break;
            case 'lt':
                if (this.evalParam(widget,curInst[1])<this.evalParam(widget,curInst[2])) {
                    step = 2;
                }else{
                    step = 1;
                }

                break;
            case 'lte':
                if (this.evalParam(widget,curInst[1])<=this.evalParam(widget,curInst[2])) {
                    step = 2;
                }else{
                    step = 1;
                }

                break;
            case 'jump':
                step = curInst[2];
                break;
            case 'end':
                step = 1;
                break;
            //algorithm:
            case 'add':
                widget.scope[curInst[1].value] = parseInt(widget.scope[curInst[1].value] + this.evalParam(widget,curInst[2]))
                break;
            case 'minus':
                widget.scope[curInst[1].value] = parseInt(widget.scope[curInst[1].value] - this.evalParam(widget,curInst[2]))
                break;
            case 'multiply':
                widget.scope[curInst[1].value] = parseInt(widget.scope[curInst[1].value] * this.evalParam(widget,curInst[2]))
                break;
            case 'divide':
                widget.scope[curInst[1].value] = parseInt(widget.scope[curInst[1].value] / this.evalParam(widget,curInst[2]))
                break;
            case 'mod':
                widget.scope[curInst[1].value] = parseInt(widget.scope[curInst[1].value] % this.evalParam(widget,curInst[2]))
                break;
            case 'setTag':
                WidgetExecutor.setTag(widget.tag,parseInt(this.evalParam(widget,curInst[1])))
                break;
            case 'getTag':
                this.setByParam(widget,{type:'ID',value:curInst[1].value},{type:'Int',value:parseInt(WidgetExecutor.getTag(widget.tag))})
                break;
            case 'not':
                widget.scope[curInst[1].value] = ~parseInt(widget.scope[curInst[1].value])
            break;
            //mouse
            case 'getMouse':
                var mouseV = this.evalParam(widget,curInst[2])
                mouseV = (mouseV==1)?'y':'x';
                this.setByParam(widget,{type:'ID',value:curInst[1]},{type:'Int',value:this.mouseState.position[mouseV]||0})
                break;
            case 'getMouseRW':
                //relative widget
                var mouseV = this.evalParam(widget,curInst[2])
                mouseV = (mouseV==1)?'y':'x';
                this.setByParam(widget,{type:'ID',value:curInst[1]},{type:'Int',value:this.mouseState.position[mouseV]||0})
                break;
            case 'checkalarm':
                //checkalarm
                var curValue = this.getValueByTagName(widget.tag)
                if (curValue > widget.maxValue) {
                    curValue = widget.maxValue
                }
                if (curValue<widget.minValue) {
                    curValue = widget.minValue
                }

                var alarmValue = this.shouldHandleAlarmAction(curValue,widget,widget.lowAlarmValue,widget.highAlarmValue)
                if (alarmValue) {
                    this.handleTargetAction(widget, alarmValue);
                }

                break;
            case 'setglobalvar':
                var globalVars = ['inModifing'];
                this[globalVars[parseInt(this.evalParam(widget,curInst[1]))]]=parseInt(this.evalParam(widget,curInst[2]))
                break;
            case 'startanimation':
                var nowFrame = 1;
                var totalFrame = widget.totalFrame||0;
                if (widget.curAnimationId) {
                    widget.startAnimationTag = widget.curAnimationTag
                    clearInterval(widget.curAnimationId)
                }
                widget.curAnimationId = setInterval(function () {
                    if (nowFrame>totalFrame) {
                        clearInterval(widget.curAnimationId)
                        widget.curAnimationId = 0;
                        return;
                    }
                    widget.nowFrame = nowFrame||0
                    this.interpretGeneralCommand(widget,'onAnimationFrame')
                    nowFrame++;
                }.bind(this),1000/30);

            break;
            case 'starthlanimation':
                // console.log('starthlanimaton in simulator');
                var nowHLFrame = 1;
                var totalHLFrame = widget.totalHLFrame||0;
                if (widget.curHLAnimationId) {
                    clearInterval(widget.curHLAnimationId)
                }
                widget.curHLAnimationId = setInterval(function(){
                    if (nowHLFrame>totalHLFrame) {
                        clearInterval(widget.curHLAnimationId);
                        widget.curHLAnimationId = null;
                        return;
                    }
                    widget.curHLAnimationFactor = Math.round(nowHLFrame/totalHLFrame*1000);
                    this.interpretGeneralCommand(widget,'onHighlightFrame');
                    nowHLFrame++;
                }.bind(this),33);
            break;
            case 'executeaction':
                console.log('trigger action: ',curInst[1])
            break;
            case 'print':
                if (window.disablePrint){

                }else{
                    console.log('print value: ',this.evalParam(widget,curInst[1]),this.evalParam(widget,curInst[2]||''))
                }

                break;

            default:
                console.log("inst",curInst)
                break;

        }
        // Debugger.pause(this.processGeneralWidgetCommand.bind(this,widget,cmds,index+step),widget.scope,cmds)
        this.processGeneralWidgetCommand(widget,f,index+step)

    },
    componentDidMount: function () {
        //this.load();
        this.state = _.cloneDeep(defaultSimulator);
        this.state.project = _.cloneDeep(this.props.projectData);
        // console.log('receive new project data', this.state.project)
        this.simState = {};
        this.initProject();
        this.paintKey = requestAnimationFrame(this.paint);

    },
    componentWillReceiveProps: function (newProps) {
        this.state.timerList.map(function (timer, i) {
            var curTimeID = timer.timerID;
            clearInterval(curTimeID);
        }.bind(this));
        this.state.innerTimerList.map(function (timerId) {
            clearInterval(timerId);
        }.bind(this));
        this.simState = {};
        VideoSource.setVideoSrc('');
        //init animation keys
        AnimationManager.clearAllAnimationKeys();
        var nextState = _.cloneDeep(defaultSimulator);
        nextState.project = _.cloneDeep(newProps.projectData);
        console.log('reced', nextState.project)
        if (!nextState.project.size) {
            //close
            cancelAnimationFrame(this.paintKey)
            this.setState(nextState, this.initProject);

        } else {
            cancelAnimationFrame(this.paintKey)
            this.setState(nextState, this.initProject);

            this.paintKey = requestAnimationFrame(this.paint);

        }

        // this.initProject();
        // console.log('receive new project data', this.state.project)

    },
    drawLoadingProgress: function (total, currentValue, countDown, projectWidth, projectHeight) {
        var progress = '0.0%';
        if (countDown && countDown == true) {
            progress = '' + ((total - currentValue) * 100.0 / total).toFixed(2) + '%'
        } else {
            progress = '' + (currentValue * 100.0 / total).toFixed(2) + '%'
        }
        var canvas = this.refs.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, projectWidth, projectHeight)
        ctx.font = "italic bold 48px serif";
        ctx.fillStyle = "white";
        ctx.fillText("加载中... " + progress, 0.5 * projectWidth, 0.5 * projectHeight);

    },
    draw: function (_project, options) {
        var offcanvas = this.refs.offcanvas;
        var canvas = this.refs.canvas;
        this.ctx = canvas.getContext('2d');
        this.offctx = offcanvas.getContext('2d');
        this.offctx.setTransform(1, 0, 0, 1, 0, 0);
        // if (this.originalCanvasContext){
        //     this.offctx =this.originalCanvasContext;
        // }else{
        //     this.originalCanvasContext = _.cloneDeep(this.offctx);
        // }
        if (!this.drawingArray) {
            this.drawingArray = [];
        }
        this.drawingArray.push(
            {
                project: _.cloneDeep(_project),
                options: _.cloneDeep(options)
            }
        )
        this.manageDraw();
    },
    manageDraw: function () {
        if (!this.drawingStatus || this.drawingStatus === 'idle') {
            if (this.drawingArray.length) {
                var nextDrawElem = this.drawingArray.shift();
                this.drawingStatus = 'drawing';
                this.currentDrawedProject = this.drawSingleProject(nextDrawElem.project, nextDrawElem.options);
                this.drawingStatus = 'idle';
                this.manageDraw();
            }
        }
    },
    paint: function () {
        //timer for fps
        var shouldTestFPS;
        if (this.shouldTestFPS == undefined) {
            this.shouldTestFPS = true;
        }
        if (this.shouldTestFPS) {
            shouldTestFPS = true;
        }

        if (shouldTestFPS) {
            var startT = new Date()
        }
        var offcanvas = this.refs.offcanvas;

        var offctx = offcanvas.getContext('2d');

        var canvas = this.refs.canvas;
        var ctx = canvas.getContext('2d');
        if (this.currentDrawedProject) {
            offctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
            var project = this.currentDrawedProject;

            var page = project.pageList[(project&&project.curPageIdx)||0];
            if (page){
                if(page.animating){
                    if(page.transition&&page.transition.name==='SWIPE_H'||page.transition&&page.transition.name==='SWIPE_V'){
                        for(var i=0;i<project.pageList.length-project.systemWidgets.length;i++){
                            this.paintPage(project.pageList[i])
                        }
                    }else{
                        if (project.pageList[project.pageUnloadIdx]){
                            this.paintPage(project.pageList[project.pageUnloadIdx])
                        }
                        this.paintPage(page)
                    }
                }else{
                    this.paintPage(page);
                }

            }
            ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);

            //paint with pixelRatio
            this.pixelRatio = this.pixelRatio || 1.0
            ctx.drawImage(offcanvas, 0, 0, offcanvas.width, offcanvas.height, 0, 0, offcanvas.width, offcanvas.height * this.pixelRatio);
        }

        if (shouldTestFPS) {
            var stopT = new Date();
            var fps = (1000 / (stopT - startT)).toFixed(1)
            this.setState({fps: fps})
            //disable
            this.shouldTestFPS = false;
            setTimeout(function () {
                this.shouldTestFPS = true;
            }.bind(this), 500)
        }


        this.paintKey = requestAnimationFrame(this.paint)
    },
    dropCurrentDraw: function () {
        this.currentDrawedProject && (this.currentDrawingProject.shouldPaint = false);
    },
    drawSingleProject: function (_project, options) {
        var project;
        if (_project) {
            project = _project;
        } else {
            project = this.state.project;
        }

        this.currentDrawingProject = project;
        this.currentDrawingProject.shouldPaint = true;

        var offcanvas = this.refs.offcanvas;

        var offctx = this.offctx;

        var ctx = this.ctx;


        if (project.pageList && project.pageList.length > 0) {
            //curPageIdx
            var curPageIdx = 0;

            var curPageIdxTag = this.findTagByName(project.tag);

            if (curPageIdxTag == null) {
                curPageIdxTag = {
                    name: '当前页面序号',
                    register: true,
                    writeOrRead: 'true',
                    indexOfRegister: -1,
                    value: 1
                };

            }
            curPageIdx = curPageIdxTag.value;
            if (curPageIdx > 0 && curPageIdx <= project.pageList.length) {
                curPageIdx = curPageIdx - 1;
            } else {
                curPageIdx = 0;
            }

            //handle UnLoad
            var pageUnloadIdx = null;
            for (var i = 0; i < project.pageList.length; i++) {
                if (project.pageList[i].state && project.pageList[i].state == LoadState.loaded) {
                    if (i != curPageIdx) {
                        //handle UnLoad
                        pageUnloadIdx = i;
                        project.pageList[i].state = LoadState.notLoad;
                        break
                    }
                }
            }

            if (pageUnloadIdx !== null){
                project.pageList[pageUnloadIdx].curPageImg = this.generatePageCopy(project.pageList[pageUnloadIdx],offcanvas.width,offcanvas.height)
                this.handleTargetAction(project.pageList[pageUnloadIdx], 'UnLoad')
                //reset pageUnloadIdx translate
                project.pageList[pageUnloadIdx].translate = null
                project.pageList[pageUnloadIdx].transform = null
                var unloadPageCanvasList = project.pageList[pageUnloadIdx].canvasList
                if(unloadPageCanvasList&&unloadPageCanvasList.length){
                    unloadPageCanvasList.forEach(function(uc){
                        uc.translate = null
                        uc.transform = null
                    })
                }
            }
            project.pageUnloadIdx = pageUnloadIdx
            project.curPageIdx = curPageIdx;
            var page = project.pageList[curPageIdx];
            this.state.curPageIdx = curPageIdx


            this.drawPage(project,page, options);
            //update
            // ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
            // ctx.drawImage(offcanvas, 0, 0, offcanvas.width, offcanvas.height);
        } else {
            // ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
        }
        if (this.currentDrawingProject && this.currentDrawingProject.shouldPaint) {
            return project
        } else {
            return null;
        }


    },
    getRawValueByTagName: function (name) {
        var curTag = this.findTagByName(name);
        if (curTag) {
            return curTag.value;
        } else {
            return null;
        }
    },
    //get num value
    getValueByTagName: function (name, defaultValue) {
        var curTag = this.findTagByName(name);
        if (curTag) {
            return this.getTagTrueValue(curTag);
        } else if (defaultValue) {
            return defaultValue;
        } else {
            return null
        }

    },
    compareZIndex: function (canvasA, canvasB) {
        return (canvasA.zIndex || 0) - (canvasB.zIndex || 0);
    },
    addLinkWidgetInfo:function (widget,pre,next,totalNum) {
        widget.preWidget = pre;
        widget.nextWidget = next;
        widget.totalNum = totalNum;
    },
    addLinkWidgetInfoForPage:function (page) {
        if (page && page.linkedAllWidgets) {
            var len = page.linkedAllWidgets.length;
            if (len) {
                var widgets = page.linkedAllWidgets;
                var pre;
                var next;
                for(var i=0;i<len;i++){
                    if (i<1) {
                        pre = null;
                    }else{
                        pre = widgets[i-1].target
                    }

                    if (i>=len-1) {
                        next = null
                    }else{
                        next = widgets[i+1].target
                    }
                    this.addLinkWidgetInfo(widgets[i].target,pre,next,len)
                }
            }
        }
    },
    drawPage:function (project,page,options) {
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx;
        var canvas = this.refs.canvas;
        var ctx = this.ctx;
        var frames = this.fps;
        var easing = (page.transition &&page.transition.timingFun )||'easeInOutCubic';
        var method = page.transition&&page.transition.name;
        var duration = (page.transition && page.transition.duration )|| 1000;
        var count = frames;
        var maxD = -100;
        var hWidth = canvas.width / 2
        var hHeight = canvas.height / 2;
        if (!options) {
            options = {};
        }
        var flag = false;
        var unloadPage = project.pageList[project.pageUnloadIdx];

        if (!page.state || page.state == LoadState.notLoad) {
            page.state = LoadState.willLoad
            //generate load trigger

            options.reLinkWidgets = true;

            switch (method){
                case 'PUSH_LR':
                    page.translate = {
                        x:-offcanvas.width,
                        y:0
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.animating = true
                        unloadPage.translate = {
                            x:0,
                            y:0
                        }
                    }
                    options.pageAnimate = true
                    AnimationManager.step(-offcanvas.width,0,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false
                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true

                        if (unloadPage){
                            unloadPage.translate = {
                                x:deltas.curX+offcanvas.width,
                                y:deltas.curY
                            }
                            unloadPage.animating = true
                        }

                        options.pageAnimate = true
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        page.state = LoadState.loaded
                        options.pageAnimate = false
                        if (unloadPage){
                            unloadPage.translate = null
                            unloadPage.animating = false
                        }
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))

                    break;
                case 'MOVE_LR':
                    //移动距离
                    page.translate = {
                        x:-offcanvas.width,
                        y:0
                    }
                    //
                    page.animating = true
                    //
                    if (unloadPage){
                        unloadPage.translate = null
                        unloadPage.animating = false
                    }

                    options.pageAnimate = true
                    AnimationManager.step(-offcanvas.width,0,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false
                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true

                        options.pageAnimate = true
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        page.state = LoadState.loaded
                        options.pageAnimate = false
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))

                    break;
                case 'PUSH_RL':
                    page.translate = {
                        x:offcanvas.width,
                        y:0
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = {
                            x:0,
                            y:0
                        }
                        unloadPage.animating = true
                    }
                    options.pageAnimate = true
                    AnimationManager.step(offcanvas.width,0,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true
                        if (unloadPage){
                            unloadPage.translate = {
                                x:deltas.curX - offcanvas.width,
                                y:deltas.curY
                            }
                            unloadPage.animating = true
                        }
                        options.pageAnimate = true;
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false
                        page.animating = false
                        if (unloadPage){
                            unloadPage.translate = null
                            unloadPage.animating = false
                        }
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))
                    break;
                case 'MOVE_RL':
                    page.translate = {
                        x:offcanvas.width,
                        y:0
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = null
                        unloadPage.animating = false
                    }
                    options.pageAnimate = true
                    AnimationManager.step(offcanvas.width,0,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true
                        options.pageAnimate = true;
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))
                    break;
                case 'PUSH_TB':
                    page.translate = {
                        x:0,
                        y:-offcanvas.height
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = {
                            x:0,
                            y:0
                        }
                        unloadPage.animating = true
                    }
                    options.pageAnimate = true
                    AnimationManager.step(0,-offcanvas.height,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true

                        if (unloadPage){
                            unloadPage.translate = {
                                x:deltas.curX ,
                                y:deltas.curY+offcanvas.height
                            }
                            unloadPage.animating = true
                        }
                        options.pageAnimate = true;
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false
                        page.animating = false
                        if (unloadPage){
                            unloadPage.translate = null
                            unloadPage.animating = false
                        }
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options);
                    }.bind(this))
                    break;
                case 'MOVE_TB':
                    page.translate = {
                        x:0,
                        y:-offcanvas.height
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = null
                        unloadPage.animating = false
                    }
                    options.pageAnimate = true
                    AnimationManager.step(0,-offcanvas.height,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        page.animating = true
                        options.pageAnimate = true;
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options);
                    }.bind(this))
                    break;
                case 'PUSH_BT':
                    page.translate = {
                        x:0,
                        y:offcanvas.height
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = {
                            x:0,
                            y:0
                        }
                        unloadPage.animating = true
                    }
                    AnimationManager.step(0,offcanvas.height,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        options.pageAnimate = true;
                        page.animating = true
                        if (unloadPage){
                            unloadPage.translate = {
                                x:deltas.curX ,
                                y:deltas.curY-offcanvas.height
                            }
                            unloadPage.animating = true
                        }
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false;
                        page.animating = false
                        if (unloadPage){
                            unloadPage.translate = null
                            unloadPage.animating = false
                        }
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))
                    break;
                case 'MOVE_BT':
                    page.translate = {
                        x:0,
                        y:offcanvas.height
                    }
                    page.animating = true
                    if (unloadPage){
                        unloadPage.translate = null
                        unloadPage.animating = false
                    }
                    AnimationManager.step(0,offcanvas.height,0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }
                        page.translate = {
                            x:deltas.curX,
                            y:deltas.curY
                        }
                        options.pageAnimate = true;
                        page.animating = true
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        options.pageAnimate = false;
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))
                    break;
                case 'SCALE':
                    var beforeTranslateMatrix = [
                        [1,0,-hWidth],
                        [0,1,-hHeight],
                        [0,0,1]
                    ];
                    var afterTranslateMatrix = [
                        [1,0,hWidth],
                        [0,1,hHeight],
                        [0,0,1]
                    ];
                    var beforeScaleMatrix = [
                        [0.1,0,0],
                        [0,0.1,0],
                        [0,0,1]
                    ];
                    var afterScaleMatrix = [
                        [1,0,0],
                        [0,1,0],
                        [0,0,1]
                    ];
                    page.transform = math.multiply(math.multiply(afterTranslateMatrix,beforeScaleMatrix),beforeTranslateMatrix)
                    options.pageAnimate = true
                    page.animating = true
                    if (unloadPage){
                        unloadPage.transform = [
                            [1,0,0],
                            [0,1,0],
                            [0,0,1]
                        ]
                        unloadPage.animating = true
                    }
                    AnimationManager.stepObj(this.matrixToObj(beforeScaleMatrix),this.matrixToObj(afterScaleMatrix),duration,frames,easing,function (deltas) {

                        if (!flag){
                            page.animating = false

                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true

                        }

                        var curScaleMatrix = [
                            [deltas.a.curValue,deltas.c.curValue,deltas.e.curValue],
                            [deltas.b.curValue,deltas.d.curValue,deltas.f.curValue],
                            [0,0,1]
                        ];
                        // console.log(curScaleMatrix)
                        var combinedMatrix = math.multiply(afterTranslateMatrix,curScaleMatrix)
                        combinedMatrix = math.multiply(combinedMatrix,beforeTranslateMatrix);
                        page.transform = combinedMatrix;
                        options.pageAnimate = true;
                        page.animating = true
                        // this.draw(null,options);
                    }.bind(this),function () {
                        page.transform = null
                        options.pageAnimate = false;
                        page.animating = false
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options);
                    }.bind(this))



                    break;
                case 'FADE-IN_FADE-OUT':
                    options.pageAnimate = true
                    page.alpha = 0
                    page.animating = true
                    if (unloadPage){
                        unloadPage.animating = true
                        unloadPage.alpha = 1.0
                    }
                    AnimationManager.step(0,0,1.0,0,duration,frames,easing,function (deltas) {

                        // offctx.translate(deltas.curX,deltas.curY);
                        if (!flag){
                            page.animating = false
                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height)
                            flag = true
                        }
                        page.alpha = deltas.curX
                        page.animating = true
                        if (unloadPage){
                            unloadPage.alpha = 1.0- page.alpha
                            unloadPage.animating = true
                        }
                        options.pageAnimate = true
                        // this.draw(null,options);


                    }.bind(this),function () {
                        page.translate = null;
                        page.state = LoadState.loaded
                        options.pageAnimate = false
                        page.animating = false
                        if (unloadPage){
                            unloadPage.alpha = 1.0
                            unloadPage.animating = false
                        }
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options)
                    }.bind(this))
                    break;
                case 'SWIPE_H':
                    var pageNum=project.pageList.length-project.systemWidgets.length;
                    var xTranslate=(project.curPageIdx-project.pageUnloadIdx)*offcanvas.width;
                    var pagesList=[];
                    var startX=-project.pageUnloadIdx*offcanvas.width;

                    for(var i=0;i<pageNum;i++){
                        pagesList[i]=project.pageList[i];
                        pagesList[i].animating = false;
                        pagesList[i].curPageImg = this.generatePageCopy(pagesList[i],offcanvas.width,offcanvas.height);
                        pagesList[i].animating = true;
                        pagesList[i].translate = {
                            x:startX+i*offcanvas.width,
                            y:0
                        }
                    }
                    page.animating = true;
                    options.pageAnimate = true;
                    AnimationManager.step(xTranslate,0,0,0,duration,frames,easing,function (deltas) {
                        if (!flag){
                            page.animating = false;
                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height);
                            flag = true;

                        }
                        page.animating = true;
                        for(var j=0;pagesList[j];j++){
                            pagesList[j].animating = true;
                            pagesList[j].translate = {
                                x:deltas.curX-offcanvas.width*(project.curPageIdx-j),
                                y:deltas.curY
                            }
                        }

                        options.pageAnimate = true;
                    }.bind(this),function () {
                        page.translate = null;
                        page.state = LoadState.loaded;
                        options.pageAnimate = false;
                        for(var j=0;pagesList[j];j++){
                            pagesList[j].animating = false;
                            pagesList[j].translate = null;
                        }
                        page.animating = false;
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options);
                    }.bind(this));
                    break;
                case 'SWIPE_V':
                    var pageNum=project.pageList.length-project.systemWidgets.length;
                    var yTranslate=(project.curPageIdx-project.pageUnloadIdx)*offcanvas.height;
                    var pagesList=[];
                    var startY=-project.pageUnloadIdx*offcanvas.height;

                    for(var i=0;i<pageNum;i++){
                        pagesList[i]=project.pageList[i];
                        pagesList[i].animating = false;
                        pagesList[i].curPageImg = this.generatePageCopy(pagesList[i],offcanvas.width,offcanvas.height)
                        pagesList[i].animating = true;
                        pagesList[i].translate = {
                            x:0,
                            y:startY+i*offcanvas.height
                        }
                    }
                    page.animating = true;
                    options.pageAnimate = true;
                    AnimationManager.step(0,yTranslate,0,0,duration,frames,easing,function (deltas) {
                        if (!flag){
                            page.animating = false;
                            page.curPageImg = this.generatePageCopy(page,offcanvas.width,offcanvas.height);
                            flag = true;
                        }
                        page.animating = true;
                        for(var j=0;pagesList[j];j++){
                            pagesList[j].animating = true;
                            pagesList[j].translate = {
                                x:deltas.curX,
                                y:deltas.curY-offcanvas.height*(project.curPageIdx-j)
                            }
                        }

                        options.pageAnimate = true;
                    }.bind(this),function () {
                        page.translate = null;
                        page.state = LoadState.loaded;
                        options.pageAnimate = false;
                        for(var j=0;pagesList[j];j++){
                            pagesList[j].animating = false;
                            pagesList[j].translate = null;
                        }
                        page.animating = false;
                        this.handleTargetAction(page, 'Load');
                        this.draw(null,options);
                    }.bind(this));
                    break;
                default:
                    this.handleTargetAction(page, 'Load');
                    this.draw(null,options);
            }






        }
        if(page.state === LoadState.willLoad || page.state === LoadState.loaded){
            // offctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
            // ctx.clearRect(0,0,canvas.width,canvas.height);
            // this.paintPage(page,options)
            // // ctx.drawImage(offcanvas, 0, 0, offcanvas.width, offcanvas.height);
            //
            // ctx.drawImage(offcanvas, 0, 0, offcanvas.width, offcanvas.height);

            page.state = LoadState.loading




            //drawCanvas
            page.canvasList = page.canvasList || []
            var canvasList = page.canvasList;
            if (canvasList.length) {
                canvasList.sort(this.compareZIndex);
                // console.log(canvasList);
                for (var i = 0; i < canvasList.length; i++) {
                    this.drawCanvas(canvasList[i], options);
                }
            }
            page.state = LoadState.loaded;


            if (options && options.reLinkWidgets) {
                Utils.linkPageWidgets(page);
                // console.log('page', page);
            }

        }


    },
    generatePageCopy:function (page,width,height) {
        var curPageImg = document.createElement('canvas')
        curPageImg.width = width
        curPageImg.height = height
        var ctx = curPageImg.getContext('2d')
        ctx.clearRect(0,0,width,height)
        this.paintPage(page,{resetTransform:true},curPageImg)
        return curPageImg
    },
    paintPage: function (page, options,offcanvas) {

        offcanvas = offcanvas|| this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');


        //drawPage
        offctx.save();

        if (options&&options.resetTransform){
            // console.log('resetTransform')
            // offctx.fillRect(0,0,100,100)
        }else{
            if (page.transform){
                var m = page.transform;
                offctx.transform(m[0][0],m[1][0],m[0][1],m[1][1],m[0][2],m[1][2]);
            }else{
                if (page.translate){
                    offctx.translate(page.translate.x,page.translate.y);
                }

                if (page.scale){
                    offctx.scale(page.scale.w,page.scale.h);
                }
            }
        }


        // offctx.clearRect(0, 0, offcanvas.width, offcanvas.height);

        if (page.animating){
            // console.log('page animating',page.curPageImg)
            if (page.alpha!==undefined){
                offctx.globalAlpha = page.alpha
            }
            if (page.curPageImg){
                offctx.drawImage(page.curPageImg, 0,0,offcanvas.width, offcanvas.height);
            }


        }else{
            this.drawBgColor(0, 0, offcanvas.width, offcanvas.height, page.backgroundColor,offctx);
            this.drawBgImg(0, 0, offcanvas.width, offcanvas.height, page.backgroundImage,offctx);
            //drawCanvas
            var canvasList = page.canvasList
            if (canvasList.length) {
                // console.log(canvasList);
                for (var i = 0; i < canvasList.length; i++) {
                    this.paintCanvas(canvasList[i],options,offctx);
                }
            }
        }



        offctx.restore();


    },
    handleTimers: function (num, postfix, value) {

        var timerList = this.state.timerList;

        var timer = timerList[num];
        var key;
        if (postfix === 't' || postfix === 'CurVal') {
            //curval
            key = 'SysTmr_' + num + '_' + 't';
            var curTag = this.findTagByName(key);
            timer[key] = (curTag && Number(curTag.value)) || 0;
        } else {
            key = 'SysTmr_' + num + '_' + postfix;
            timer[key] = value;
        }


        // console.log(timer);
        if (timer.timerID == 0) {
            //start timer or not
            this.startNewTimer(timer, num, false);
        } else if (timer.timerID > 0) {
            //update timer
            clearInterval(timer.timerID);
            // timer.timerID = 0;
            this.startNewTimer(timer, num, true);

        }


    },
    startNewTimer: function (timer, num, cont) {
        if ((timer['SysTmr_' + num + '_Mode'] & 1) == 1) {
            //start
            var loop = ((timer['SysTmr_' + num + '_Mode'] & 2) == 2);
            // console.log('start', loop);
            // timer['SysTmr_'+num+'_CurVal'] = timer['SysTmr_'+num+'_Start'];
            var targetTag = this.findTagByName('SysTmr_' + num + '_t');
            targetTag.value = Number(targetTag.value) || 0;
            var startValue = timer['SysTmr_' + num + '_Start'];
            if (cont) {
                if (targetTag.value > startValue) {
                    // targetTag.value = startValue;
                    this.setTagByTag(targetTag, startValue)
                }
            } else {
                // targetTag.value = startValue;
                this.setTagByTag(targetTag, startValue)
            }


            timer.timerID = setInterval(function () {
                var direction = timer['SysTmr_' + num + '_Mode'];
                var curValue = 0;
                // console.log(timer['SysTmr_' + num + '_Interval'])
                //clock
                if (direction >= 4) {
                    //decrease

                    if (targetTag && targetTag.name != '') {
                        curValue = Number(targetTag.value) || 0;
                        curValue -= timer['SysTmr_' + num + '_Step'];
                        this.setTagByTag(targetTag, curValue)

                        if (targetTag.value < timer['SysTmr_' + num + '_Stop'] || targetTag.value > timer['SysTmr_' + num + '_Start']) {
                            //clear timer
                            targetTag.value = (targetTag.value < timer['SysTmr_' + num + '_Stop']) ? timer['SysTmr_' + num + '_Stop'] : timer['SysTmr_' + num + '_Start'];
                            if (loop) {
                                this.setTagByTag(targetTag, startValue)
                                this.draw(null,{
                                    updatedTagName: targetTag.name
                                });
                            }else{
                                clearInterval(timer.timerID);
                                timer.timerID = 0;
                            }

                        } else {
                            this.draw(null,{
                                updatedTagName: targetTag.name
                            })
                        }

                    }
                } else {
                    // console.log((targetTag.value))
                    if (targetTag && targetTag.name != '') {
                        curValue = Number(targetTag.value) || 0;
                        curValue += timer['SysTmr_' + num + '_Step'];
                        this.setTagByTag(targetTag, curValue);
                        if (targetTag.value > timer['SysTmr_' + num + '_Stop'] || targetTag.value < timer['SysTmr_' + num + '_Start']) {
                            //clear timer
                            if (loop){
                                this.setTagByTag(targetTag, startValue);
                                this.draw(null,{
                                    updatedTagName: targetTag.name
                                });
                            }else{
                                clearInterval(timer.timerID);
                                timer.timerID = 0;
                            }
                        } else {
                            this.draw(null,{
                                updatedTagName: targetTag.name
                            })
                        }

                    }
                }
            }.bind(this), timer['SysTmr_' + num + '_Interval']);
        }
    },
    matrixToObj: function (m) {
        return {
            a: m[0][0],
            b: m[1][0],
            c: m[0][1],
            d: m[1][1],
            e: m[0][2],
            f: m[1][2]
        }
    },
    objToMatrix: function (o) {
        return [
            [o.a, o.c, o.e],
            [o.b, o.d, o.f],
            [0, 0, 1]
        ]
    },
    generateTransformMatrix: function (animations) {
        var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
        if (animations.translate) {
            e = animations.translate.x;
            f = animations.translate.y;
        }

        if (animations.scale) {
            a = animations.scale.w;
            d = animations.scale.h;
        }

        return {
            a: a,
            b: b,
            c: c,
            d: d,
            e: e,
            f: f
        }
    },
    executeAnimation: function (target, animation) {
        var animationAttrs;
        if (!animation || !animation.animationAttrs) {
            return;
        } else {
            animationAttrs = animation.animationAttrs;
        }
        // this.animationAttrs={
        //     translate:{
        //         dstPos:{
        //             x:xTranslate,
        //             y:yTranslate
        //         }
        //     },
        //     scale:{
        //         dstScale:{
        //             x:xScale,
        //             y:yScale
        //         }
        //     }
        // };
        var srcScale = (animationAttrs.scale&&animationAttrs.scale.srcScale&&this.getAnimationAtrr(animationAttrs.scale.srcScale))||{x:1,y:1};
        var dstScale = (animationAttrs.scale&&animationAttrs.scale.dstScale&&this.getAnimationAtrr(animationAttrs.scale.dstScale))||{x:1,y:1};
        var srcTranslate = (animationAttrs.translate&&animationAttrs.translate.srcPos&&this.getAnimationAtrr(animationAttrs.translate.srcPos))||{x:0,y:0};
        var dstTranslate = (animationAttrs.translate&&animationAttrs.translate.dstPos&&this.getAnimationAtrr(animationAttrs.translate.dstPos))||{x:0,y:0};
        var type = target.type;
        var duration = (animation&&animation.duration) || 1000;
        // console.log(scale,translate,duration)
        var frames = this.fps;
        var srcTransformObj={};
        var dstTransformObj={};
        var srcRelativeTranslate = {}
        var dstRelativeTranslate = {}
        var tempTranslate = {}
        if (type == 'MyLayer') {
            srcRelativeTranslate = {
                x: srcTranslate.x - target.x,
                y: srcTranslate.y - target.y
            }

            dstRelativeTranslate = {
                x: dstTranslate.x - target.x,
                y: dstTranslate.y - target.y
            }

            tempTranslate = {
                x: target.x,
                y: target.y
            }
        } else {
            srcRelativeTranslate = {
                x: srcTranslate.x - target.info.left,
                y: srcTranslate.y - target.info.top
            }

            dstRelativeTranslate = {
                x: dstTranslate.x - target.info.left,
                y: dstTranslate.y - target.info.top
            }
            tempTranslate = {
                x: target.info.left,
                y: target.info.top
            }
        }

        srcTransformObj = this.matrixToObj(this.matrixMultiply([
            [
                [1, 0, srcRelativeTranslate.x],
                [0, 1, srcRelativeTranslate.y],
                [0, 0, 1]
            ],
            [
                [1, 0, tempTranslate.x],
                [0, 1, tempTranslate.y],
                [0, 0, 1]
            ],
            [
                [srcScale.x, 0, 0],
                [0, srcScale.y, 0],
                [0, 0, 1]
            ],
            [
                [1, 0, -tempTranslate.x],
                [0, 1, -tempTranslate.y],
                [0, 0, 1]
            ]

        ]))

        dstTransformObj = this.matrixToObj(this.matrixMultiply([
            [
                [1, 0, dstRelativeTranslate.x],
                [0, 1, dstRelativeTranslate.y],
                [0, 0, 1]
            ],
            [
                [1, 0, tempTranslate.x],
                [0, 1, tempTranslate.y],
                [0, 0, 1]
            ],
            [
                [dstScale.x, 0, 0],
                [0, dstScale.y, 0],
                [0, 0, 1]
            ],
            [
                [1, 0, -tempTranslate.x],
                [0, 1, -tempTranslate.y],
                [0, 0, 1]
            ]

        ]))


        var easingFunc = 'easeInOutCubic';
        // console.log('anAttr',animationAttrs)
        // console.log('srcT',srcTransformObj,'dstT',dstTransformObj)


        AnimationManager.stepObj(srcTransformObj,dstTransformObj,duration,frames,easingFunc,function (deltas) {

            // offctx.translate(deltas.curX,deltas.curY);
            if (!target.animating){
                this.prepareTarget(target)
            }

            var transformMatrix = {

            }
            for (var key in deltas){
                if (deltas.hasOwnProperty(key)){
                    transformMatrix[key] = deltas[key].curValue;
                }
            }
            target.transform = transformMatrix;
            target.animating = true
            // this.draw();


        }.bind(this),function () {
            target.animating = false
        })

    },
    getAnimationAtrr:function (attr) {
        var values = {}
        for(var key in attr){
            if (attr.hasOwnProperty(key)){
                //own key
                values[key] = this.getParamValue(attr[key])
            }
        }
        return values
    },
    prepareTarget:function (target) {
        console.log(target.type)
        if (target.type === 'MyLayer'){
            var sc = target.subCanvasList[target.curSubCanvasIdx]
            sc.curSubCanvasImg = this.generateSubCanvasCopy(sc,target.w,target.h,{ratio:1})
        }
    },
    matrixMultiply: function (matrixArray) {
        var length = matrixArray.length
        if (length < 1) {
            return null
        }
        var result = matrixArray[0]
        for (var i = 1; i < length; i++) {
            result = math.multiply(result, matrixArray[i])
        }
        return result
    },
    scaleElement: function (target, scaleFactor) {
        // console.log('scaling element',target)
        switch (target.type) {
            case 'MyLayer':
                this.scaleCanvas(target, scaleFactor);
                break;
            case 'MyWidget':
                this.scaleWidget(target, scaleFactor);
                break;
        }
    },
    scaleCanvas: function (target, scaleFactor) {
        target.w *= scaleFactor.w;
        target.h *= scaleFactor.h;
        var subCanvasList = target.subCanvasList;
        for (var i = 0; i < subCanvasList.length; i++) {
            var curSubCanvas = subCanvasList[i];
            for (var j = 0; j < curSubCanvas.widgetList.length; j++) {
                var curWidget = curSubCanvas.widgetList[j];
                this.scaleWidget(curWidget, scaleFactor);
            }
        }
    },
    scaleWidget: function (target, scaleFactor) {
        var info = target.info;
        switch (target.subType) {
            case 'MyButton':
                info.width *= scaleFactor.w;
                info.height *= scaleFactor.h;
                info.left *= scaleFactor.w;
                info.top *= scaleFactor.h;
                break;
        }
    },
    drawCanvas: function (canvasData, options) {
        var willExecuteAnimation = false;
        if (options && options.animation) {
            //has animation execute
            // console.log('execute animation')
            if (canvasData.tag === options.animation.tag) {
                // willExecuteAnimation = true;
                //execute animation which number is number
                if (canvasData.animations && canvasData.animations.length) {
                    for (var i = 0; i < canvasData.animations.length; i++) {
                        if (Number(canvasData.animations[i].id) === options.animation.number) {
                            //hit
                            //execute this animation
                            willExecuteAnimation = true;
                            this.executeAnimation(canvasData, canvasData.animations[i]);
                            break;
                        }
                    }
                }

                // this.executeAnimation(canvasData);
            }
        }
        if (!willExecuteAnimation) {
            //draw
            canvasData.subCanvasList = canvasData.subCanvasList || [];
            var subCanvasList = canvasData.subCanvasList;
            var canvasTag = this.findTagByName(canvasData.tag);
            var nextSubCanvasIdx = (canvasTag && canvasTag.value) || 0;
            nextSubCanvasIdx = nextSubCanvasIdx >= subCanvasList.length ? subCanvasList.length - 1 : nextSubCanvasIdx;
            var oldSubCanvas = subCanvasList[canvasData.curSubCanvasIdx];
            var firstSubCanvas = false
            if (!oldSubCanvas) {
                firstSubCanvas = true;
            }
            canvasData.curSubCanvasIdx = nextSubCanvasIdx;
            //handle UnLoad subcanvas
            // if (canvasData.curSubCanvasIdx != nextSubCanvasIdx) {
            // 	//UnLoad lastsubcanvas
            // 	this.handleTargetAction(canvasData,'UnLoad');
            // }
            // canvasData.curSubCanvasIdx = nextSubCanvasIdx;
            // var subCanvas = subCanvasList[canvasData.curSubCanvasIdx];
            var subCanvasUnloadIdx = null;
            for (var i = 0; i < subCanvasList.length; i++) {
                if (subCanvasList[i].state && (subCanvasList[i].state == LoadState.loaded)) {
                    if ((nextSubCanvasIdx ) != i) {
                        //another sc loaded
                        //UnLoad sc of i
                        if (!options) {
                            options = {};
                        }
                        options.reLinkWidgets = true;
                        subCanvasUnloadIdx = i;
                        subCanvasList[i].state = LoadState.notLoad;
                        break
                    }
                }
            }

            canvasData.subCanvasUnloadIdx = subCanvasUnloadIdx



            if (subCanvasUnloadIdx !== null){
                // console.log('handle unload sc')
                subCanvasList[subCanvasUnloadIdx].curSubCanvasImg = this.generateSubCanvasCopy(subCanvasList[subCanvasUnloadIdx],canvasData.w, canvasData.h)
                this.handleTargetAction(subCanvasList[subCanvasUnloadIdx], 'UnLoad');
            }
            var subCanvas = subCanvasList[nextSubCanvasIdx];
            // if (subCanvas) {
            //     // this.clipToRect(offctx,canvasData.x, canvasData.y, canvasData.w, canvasData.h);
            //     var transition = canvasData.transition;
            //
            //     this.drawSubCanvas(subCanvas, canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,transition,firstSubCanvas);
            //
            // }
            var transition = canvasData.transition;
            var method = transition && transition.name
            // method = 'SWIPE_H'
            if (method == 'SWIPE_H'){
                if (!subCanvas.translate){
                    //init
                    this.syncSubCanvasOffsetForSwipe(canvasData,canvasData.curSubCanvasIdx,true)
                }
            }else if(method == 'SWIPE_V'){
                if (!subCanvas.translate){
                    //init
                    this.syncSubCanvasOffsetForSwipe(canvasData,canvasData.curSubCanvasIdx,false,true)
                }
            }


            for (var i=0;i<subCanvasList.length;i++){
                this.drawSubCanvas(canvasData,subCanvasList[i], canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,transition,firstSubCanvas,(i!=nextSubCanvasIdx));
            }
        }


    },
    paintCanvas: function (canvasData, options,ctx) {
        //draw

        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        var subCanvasList = canvasData.subCanvasList || [];

        var subCanvas = subCanvasList[canvasData.curSubCanvasIdx];
        if (subCanvas) {
            // console.log('painting canvas')
            offctx.save();

            // if (canvasData.translate){
            //     offctx.translate(canvasData.translate.x,canvasData.translate.y);
            // }
            //
            // if (canvasData.scale){
            //     offctx.scale(canvasData.scale.w,canvasData.scale.h);
            // }
            if (canvasData.transform) {
                var t = canvasData.transform;
                offctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
            }


            // this.showBorder(offctx,canvasData.x,canvasData.y,canvasData.w,canvasData.h)

            this.clipToRect(offctx,canvasData.x,canvasData.y,canvasData.w,canvasData.h)

            this.showScrollBar(offctx,canvasData,subCanvas,subCanvas.shouldShowScrollBarH,subCanvas.shouldShowScrollBarV)

            // offctx.translate(canvasData.contentOffsetX,canvasData.contentOffsetY)

            // this.clipToRect(offctx,canvasData.x, canvasData.y, canvasData.w, canvasData.h);
            var transition = canvasData.transition;
            if (canvasData.animating&&subCanvas.curSubCanvasImg){
                // console.log('animating canvas',subCanvas.curSubCanvasImg)
                offctx.drawImage(subCanvas.curSubCanvasImg,canvasData.x, canvasData.y, canvasData.w, canvasData.h)
            }else{
                if (subCanvas.animating){



                    var transitionMethod = canvasData.transition && canvasData.transition.name
                    // transitionMethod = 'SWIPE_H'
                    switch (transitionMethod){
                        case 'SWIPE_H':
                            for (var i=0;i<canvasData.subCanvasList.length;i++){
                                this.paintSubCanvas(canvasData.subCanvasList[i], canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,offctx);
                            }
                            break
                        case 'SWIPE_V':
                            for (var i=0;i<canvasData.subCanvasList.length;i++){
                                this.paintSubCanvas(canvasData.subCanvasList[i], canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,offctx);
                            }
                            break
                        default:
                            //MOVE_LR, MOVE_RL,...
                            if (canvasData.subCanvasUnloadIdx!==null){
                                canvasData.subCanvasList[canvasData.subCanvasUnloadIdx].animating = true
                                this.paintSubCanvas(canvasData.subCanvasList[canvasData.subCanvasUnloadIdx], canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,offctx);
                            }
                            this.paintSubCanvas(subCanvas, canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,offctx);
                    }

                }else{
                    if (canvasData.subCanvasUnloadIdx!==null&&canvasData.subCanvasUnloadIdx!==undefined){
                        console.log(canvasData.subCanvasUnloadIdx)
                        canvasData.subCanvasList[canvasData.subCanvasUnloadIdx].animating = false

                    }
                    this.paintSubCanvas(subCanvas, canvasData.x, canvasData.y, canvasData.w, canvasData.h, options,offctx);
                }


            }


            offctx.restore();
        } else {

        }
    },
    showScrollBar:function (ctx,canvasData,subCanvas,h,v) {
        var ratioX = canvasData.w / (subCanvas.info && subCanvas.info.width||canvasData.w)
        var ratioY = canvasData.h / (subCanvas.info&&subCanvas.info.height||canvasData.h)
        var scrollBarX = - (subCanvas.contentOffsetX||0) * ratioX
        var scrollBarY = - (subCanvas.contentOffsetY||0) * ratioY

        var scox = subCanvas.contentOffsetX || 0
        var scoy = subCanvas.contentOffsetY || 0
        var cw = canvasData.w
        var ch = canvasData.h
        var scw = subCanvas.info && subCanvas.info.width || canvasData.w
        var sch = subCanvas.info && subCanvas.info.height || canvasData.h

        var alpha = subCanvas.scrollBarAlpha

        if (alpha === undefined){
            alpha = 1.0
        }
        var maxAlpha = 0.5
        alpha = alpha * maxAlpha

        if (scox > 0){
            scw += scox
            scox = 0
        }else if(scox+scw<cw){
            scw += cw -(scox+scw)
        }

        if (scoy >0){
            sch += scoy
            scoy = 0
        }else if(scoy + sch < ch){
            sch += ch - (scoy+sch)
        }

        ratioX = cw /scw
        ratioY = ch / sch
        scrollBarX = -(scox)*ratioX
        scrollBarY = -(scoy)*ratioY

        var originX = canvasData.x
        var originY = canvasData.y

        if (h){
            this.paintLine(ctx,originX+scrollBarX,originY+canvasData.h,originX+scrollBarX+canvasData.w*ratioX,originY+canvasData.h,alpha)
        }
        if (v){
            this.paintLine(ctx,originX+canvasData.w,originY+scrollBarY,originX+canvasData.w,originY+scrollBarY+canvasData.h*ratioY,alpha)
        }



    },
    paintLine:function (ctx,sx,sy,tx,ty,alpha) {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 10
        ctx.strokeStyle = '#888888'
        ctx.globalAlpha = alpha
        ctx.moveTo(sx,sy)
        ctx.lineTo(tx,ty)
        ctx.stroke()
        ctx.restore()
    },
    showBorder:function (ctx,originX,originY,w,h) {
        ctx.beginPath()
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + w, originY);
        ctx.lineTo(originX + w, originY + h);
        ctx.lineTo(originX, originY + h);
        ctx.closePath();
        ctx.stroke()
    },
    clipToRect:function (ctx,originX,originY,w,h) {
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + w, originY);
        ctx.lineTo(originX + w, originY + h);
        ctx.lineTo(originX, originY + h);
        ctx.closePath();
        ctx.clip();
    },
    drawSubCanvas:function (canvas,subCanvas, x, y, w, h, options,transition,firstSubCanvas,updateOnly) {
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx;
        var method = transition && transition.name;

        // method = 'SWIPE_H'
        if (updateOnly){
            return this.drawSingleSubCanvas(subCanvas, x, y, w, h, options,updateOnly)
        }
        if (!subCanvas.state || subCanvas.state == LoadState.notLoad) {
            subCanvas.state = LoadState.willLoad;
            //init subcanvas pos and size
            // subCanvas.info = {};
            // subCanvas.info.x = x;
            // subCanvas.info.y = y;
            // subCanvas.info.w = w;
            // subCanvas.info.h = h;
            //generate load trigger

            //transition animation
            var moveX = w;
            var moveY = 0;


            var duration = (transition && transition.duration )|| 1000;
            var frames = this.fps;
            var easing = (transition && transition.timingFun )||'easeInOutCubic';
            var hWidth = w/2+x
            var hHeight = h/2+y
            var newCopyFlag = false
            if (!firstSubCanvas&&(!options||(options&&!options.pageAnimate))){
                //has animation
                var unloadSC = null
                if (canvas.subCanvasUnloadIdx!==null){
                    unloadSC = canvas.subCanvasList[canvas.subCanvasUnloadIdx]
                }
                console.log("method",method)
                switch (method){
                    case 'MOVE_LR':
                    case 'MOVE_RL':
                        var fromLeft = (method == 'MOVE_LR'?-1:1)
                        subCanvas.translate = {
                            x:w*fromLeft,
                            y:0
                        }

                        subCanvas.animating = true
                        AnimationManager.step(w*fromLeft,0,0,0,duration,frames,easing,function (deltas) {
                            // offctx.save();
                            // offctx.translate(deltas.curX,deltas.curY);
                            if (!newCopyFlag){
                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }
                            subCanvas.animating = true
                            subCanvas.translate = {
                                x: deltas.curX,
                                y: deltas.curY
                            }
                            // unloadSC && (unloadSC.translate = {x:deltas.curX+w,y:deltas.curY })
                            // subCanvas.info.x += deltas.deltaX;
                            // subCanvas.info.y += deltas.deltaY;
                            // this.draw();
                            // offctx.restore();
                        }.bind(this), function () {
                            // offctx.restore()
                            subCanvas.translate = null;
                            // unloadSC.translate = null;
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.handleTargetAction(subCanvas, 'Load')
                            this.draw()
                        }.bind(this))
                        // this.dropCurrentDraw()
                        break;
                    case 'MOVE_BT':
                    case 'MOVE_TB':
                        var fromTop = (method == 'MOVE_TB'?-1:1)
                        subCanvas.translate = {
                            x:0,
                            y:h*fromTop
                        }

                        subCanvas.animating = true
                        AnimationManager.step(0,h*fromTop,0,0,duration,frames,easing,function (deltas) {
                            // offctx.save();
                            // offctx.translate(deltas.curX,deltas.curY);
                            if (!newCopyFlag){
                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }
                            subCanvas.animating = true
                            subCanvas.translate = {
                                x: deltas.curX,
                                y: deltas.curY
                            }
                            // unloadSC && (unloadSC.translate = {x:deltas.curX+w,y:deltas.curY })
                            // subCanvas.info.x += deltas.deltaX;
                            // subCanvas.info.y += deltas.deltaY;
                            // this.draw();
                            // offctx.restore();
                        }.bind(this), function () {
                            // offctx.restore()
                            subCanvas.translate = null;
                            // unloadSC.translate = null;
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.handleTargetAction(subCanvas, 'Load')
                            this.draw()
                        }.bind(this))
                        // this.dropCurrentDraw()
                        break;
                    case 'SCALE':
                        var beforeTranslateMatrix = [
                            [1, 0, -hWidth],
                            [0, 1, -hHeight],
                            [0, 0, 1]
                        ];
                        var afterTranslateMatrix = [
                            [1, 0, hWidth],
                            [0, 1, hHeight],
                            [0, 0, 1]
                        ];
                        var beforeScaleMatrix = [
                            [0.1, 0, 0],
                            [0, 0.1, 0],
                            [0, 0, 1]
                        ];
                        var afterScaleMatrix = [
                            [1, 0, 0],
                            [0, 1, 0],
                            [0, 0, 1]
                        ];
                        subCanvas.transform = math.multiply(math.multiply(afterTranslateMatrix,beforeScaleMatrix),beforeTranslateMatrix)
                        subCanvas.animating = true
                        AnimationManager.stepObj(this.matrixToObj(beforeScaleMatrix),this.matrixToObj(afterScaleMatrix),duration,frames,easing,function (deltas) {

                            // console.log(curScaleMatrix)
                            if (!newCopyFlag){
                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }
                            var curScaleMatrix = [
                                [deltas.a.curValue, deltas.c.curValue, deltas.e.curValue],
                                [deltas.b.curValue, deltas.d.curValue, deltas.f.curValue],
                                [0, 0, 1]
                            ];

                            subCanvas.animating = true
                            var combinedMatrix = math.multiply(afterTranslateMatrix,curScaleMatrix)
                            combinedMatrix = math.multiply(combinedMatrix,beforeTranslateMatrix);
                            subCanvas.transform = combinedMatrix;
                            // this.draw(null,options);
                        }.bind(this),function () {
                            subCanvas.transform = null
                            this.handleTargetAction(subCanvas, 'Load')
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.draw()
                        }.bind(this))

                        // this.dropCurrentDraw()



                        break;
                    case 'PUSH_LR':
                    case 'PUSH_RL':
                        var fromLeft = (method == 'PUSH_LR'?-1:1)
                        subCanvas.translate = {
                            x:w*fromLeft,
                            y:0
                        }
                        subCanvas.animating = true
                        AnimationManager.step(w*fromLeft,0,0,0,duration,frames,easing,function (deltas) {
                            // offctx.save();
                            // offctx.translate(deltas.curX,deltas.curY);
                            if (!newCopyFlag){
                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }
                            subCanvas.animating = true
                            subCanvas.translate = {
                                x:deltas.curX,
                                y:deltas.curY
                            }
                            unloadSC && (unloadSC.translate = {x:deltas.curX-w*fromLeft,y:deltas.curY })
                            // subCanvas.info.x += deltas.deltaX;
                            // subCanvas.info.y += deltas.deltaY;
                            // this.draw();
                            // offctx.restore();
                        }.bind(this),function () {
                            // offctx.restore()
                            subCanvas.translate = null;
                            unloadSC.translate = null;
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.handleTargetAction(subCanvas, 'Load')
                            this.draw()
                        }.bind(this))
                        // this.dropCurrentDraw()
                        break;
                    case 'PUSH_BT':
                    case 'PUSH_TB':
                        var fromTop = (method == 'PUSH_TB'?-1:1)
                        subCanvas.translate = {
                            x:0,
                            y:h*fromTop
                        }
                        subCanvas.animating = true
                        AnimationManager.step(0,h*fromTop,0,0,duration,frames,easing,function (deltas) {
                            // offctx.save();
                            // offctx.translate(deltas.curX,deltas.curY);
                            if (!newCopyFlag){
                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }
                            subCanvas.animating = true
                            subCanvas.translate = {
                                x:deltas.curX,
                                y:deltas.curY
                            }
                            unloadSC && (unloadSC.translate = {x:deltas.curX,y:deltas.curY-h*fromTop })
                            // subCanvas.info.x += deltas.deltaX;
                            // subCanvas.info.y += deltas.deltaY;
                            // this.draw();
                            // offctx.restore();
                        }.bind(this),function () {
                            // offctx.restore()
                            subCanvas.translate = null;
                            unloadSC.translate = null;
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.handleTargetAction(subCanvas, 'Load')
                            this.draw()
                        }.bind(this))
                        // this.dropCurrentDraw()
                        break;
                    case 'FADE-IN_FADE-OUT':
                        subCanvas.alpha = 0

                        subCanvas.animating = true
                        AnimationManager.step(0,0,1.0,0,duration,frames,easing,function (deltas) {
                            // offctx.save();
                            // offctx.translate(deltas.curX,deltas.curY);


                            if (!newCopyFlag){

                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }

                            subCanvas.animating = true

                            subCanvas.alpha = deltas.curX
                            unloadSC && (unloadSC.alpha = 1.0 - subCanvas.alpha)
                            // subCanvas.info.x += deltas.deltaX;
                            // subCanvas.info.y += deltas.deltaY;
                            // this.draw();
                            // offctx.restore();
                        }.bind(this),function () {
                            // offctx.restore()
                            subCanvas.alpha = 1.0;
                            unloadSC.alpha = 1.0;
                            subCanvas.animating = false
                            subCanvas.lastSubCanvasImg = subCanvas.curSubCanvasImg
                            subCanvas.curSubCanvasImg = null
                            this.handleTargetAction(subCanvas, 'Load')
                            this.draw()
                        }.bind(this))
                        // this.dropCurrentDraw()
                        break;
                    case 'SWIPE_H':

                        var startX = subCanvas.translate && subCanvas.translate.x || 0

                        subCanvas.animating = true

                        var self = this
                        var swipeAnime = new AnimationAPI.SpringAnimation(null,'x',0,26,170,{x:-100},{x:0},duration,(startX+100)/100)
                        swipeAnime.onFrameCB = function () {


                            if (!newCopyFlag){

                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = self.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }

                            subCanvas.animating = true

                            subCanvas.translate = {
                                x:this.state.curValue.x,
                                y:0
                            }
                            // console.log(this.state.curValue.x)

                            self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,true,false)
                        }
                        swipeAnime.didStopCB = function () {
                            for(var i=0;i<canvas.subCanvasList.length;i++){
                                var curSC = canvas.subCanvasList[i]
                                // curSC.translate = null
                                curSC.animating = false
                            }
                            // self.draw()
                            self.handleTargetAction(subCanvas, 'Load')
                            self.draw()
                        }
                        if (subCanvas.swipeAnimation){
                            subCanvas.swipeAnimation.stop()
                        }
                        subCanvas.swipeAnimation = swipeAnime
                        swipeAnime.start()
                        // this.startSwipeAnimation(canvas,subCanvas)
                        // this.dropCurrentDraw()
                        break;
                    case 'SWIPE_V':

                        var startY = subCanvas.translate && subCanvas.translate.y || 0

                        subCanvas.animating = true

                        var self = this
                        var swipeAnime = new AnimationAPI.SpringAnimation(null,'x',0,26,170,{y:-100},{y:0},duration,(startY+100)/100)
                        swipeAnime.onFrameCB = function () {


                            if (!newCopyFlag){

                                subCanvas.animating = false
                                subCanvas.curSubCanvasImg = self.generateSubCanvasCopy(subCanvas,w,h,options)
                                newCopyFlag = true
                            }

                            subCanvas.animating = true

                            subCanvas.translate = {
                                x:0,
                                y:this.state.curValue.y
                            }
                            // console.log(this.state.curValue.x)

                            self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,false,true)
                        }
                        swipeAnime.didStopCB = function () {
                            for(var i=0;i<canvas.subCanvasList.length;i++){
                                var curSC = canvas.subCanvasList[i]
                                // curSC.translate = null
                                curSC.animating = false
                            }
                            // self.draw()
                            self.handleTargetAction(subCanvas, 'Load')
                            self.draw()
                        }
                        if (subCanvas.swipeAnimation){
                            subCanvas.swipeAnimation.stop()
                        }
                        subCanvas.swipeAnimation = swipeAnime
                        swipeAnime.start()
                        // this.startSwipeAnimation(canvas,subCanvas)
                        // this.dropCurrentDraw()
                        break;
                    default:
                        this.handleTargetAction(subCanvas, 'Load')
                        // this.drawSingleSubCanvas(subCanvas, x, y, w, h, options)

                }
                this.drawSingleSubCanvas(subCanvas, x, y, w, h, options)
            }else {
                var unloadSC = null
                if (canvas.subCanvasUnloadIdx!==null){
                    unloadSC = canvas.subCanvasList[canvas.subCanvasUnloadIdx]
                }
                if (unloadSC){
                    //sync
                    switch (method){
                        case 'SWIPE_H':
                            subCanvas.translate = {
                                x:0,
                                y:0
                            }
                            this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,true)
                            break
                        case 'SWIPE_V':
                            subCanvas.translate = {
                                x:0,
                                y:0
                            }
                            this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,false,true)
                            break
                    }

                }
                this.drawSingleSubCanvas(subCanvas, x, y, w, h, options)

            }


        } else {
            this.drawSingleSubCanvas(subCanvas, x, y, w, h, options)
        }

    },
    syncSubCanvasOffsetForSwipe:function (canvas,base,xEnable,yEnable) {
        var subCanvas = canvas.subCanvasList[base||0]
        subCanvas.translate = subCanvas.translate || {x:0,y:0}
        for(var i=0;i<canvas.subCanvasList.length;i++){
            if (base == i){
                continue
            }else{
                var curSC = canvas.subCanvasList[i]
                curSC.translate = curSC.translate||{x:0,y:0}
                if (xEnable){
                    curSC.translate.x = subCanvas.translate.x + (i-base)*canvas.w
                }

                if (yEnable){
                    curSC.translate.y = subCanvas.translate.y + (i-base)*canvas.h
                }



            }
        }
    },
    generateSubCanvasCopy:function (subcanvas, w, h, options) {
        options = options||{}
        options.resetTransform = true
        var ratio = options.ratio||1
        w = w*ratio
        h = h*ratio
        var subcanvasCopy = document.createElement('canvas')
        // var subcanvasCopy = this.refs.pagecanvas
        subcanvasCopy.width = w
        subcanvasCopy.height = h
        // subcanvasCopy.style.width = ratio*w
        // subcanvasCopy.style.height = ratio*h
        var scCtx = subcanvasCopy.getContext('2d')
        scCtx.save()
        scCtx.scale(ratio,ratio)
        this.paintSubCanvas(subcanvas,0,0,w,h,options,scCtx)

        scCtx.restore()
        return subcanvasCopy
    },
    paintSubCanvas:function (subCanvas, x, y, w, h, options,ctx) {
        // x = subCanvas.info.x;
        // y = subCanvas.info.y;
        // w = subCanvas.info.w;
        // h = subCanvas.info.h;
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        offctx.save()
        //scroll sublayer
        offctx.translate(subCanvas.contentOffsetX,subCanvas.contentOffsetY)
        if (options && options.resetTransform){

        }else{

            if (subCanvas.transform) {
                var m = subCanvas.transform;
                offctx.transform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
            }else{
                if (subCanvas.translate){

                    offctx.translate(subCanvas.translate.x,subCanvas.translate.y);
                }
                if (subCanvas.scale){
                    offctx.scale(subCanvas.scale.w,subCanvas.scale.h);
                }
            }
        }

        if (subCanvas.animating){
            // console.log('sc animating')
            if (subCanvas.alpha!==undefined){
                offctx.globalAlpha = subCanvas.alpha
            }
            if (subCanvas.curSubCanvasImg){
                offctx.drawImage(subCanvas.curSubCanvasImg, x,y,w, h);
            }

        }else{
            //paint
            this.drawBgColor(x, y, w, h, subCanvas.backgroundColor,offctx);
            this.drawBgImg(x, y, w, h, subCanvas.backgroundImage,offctx);
            var widgetList = subCanvas.widgetList;
            if (widgetList.length) {
                for (var i = 0; i < widgetList.length; i++) {
                    this.paintWidget(widgetList[i], x, y, options,offctx);
                }

            }
        }



        offctx.restore();
    },
    drawSingleSubCanvas: function (subCanvas, x, y, w, h, options, updateOnly) {

        if (!updateOnly) {
            subCanvas.state = LoadState.loading;
        }


        subCanvas.widgetList = subCanvas.widgetList || []
        var widgetList = subCanvas.widgetList;
        if (widgetList.length) {
            widgetList.sort(this.compareZIndex);
            for (var i = 0; i < widgetList.length; i++) {
                this.drawWidget(widgetList[i], x, y, options, updateOnly);
            }

        }

        if (!updateOnly) {
            subCanvas.state = LoadState.loaded
        }


    },
    drawWidget: function (widget, sx, sy, options, updateOnly) {
        var willExecuteAnimation = false;
        if (updateOnly) {
            return updateWidget.call(this)
        }
        if (options && options.animation) {
            //has animation execute
            if (widget.tag === options.animation.tag && widget.animations) {
                // willExecuteAnimation = true;
                //execute animation which number is number
                for (var i = 0; i < widget.animations.length; i++) {
                    if (Number(widget.animations[i].id) === options.animation.number) {
                        //hit
                        //execute this animation
                        willExecuteAnimation = true;
                        this.executeAnimation(widget, widget.animations[i]);
                        break;
                    }
                }
                // this.executeAnimation(widget);
            }
        }
        if (!willExecuteAnimation) {
            // console.log('drawing widget',widget);
            updateWidget.call(this)

        }


        function updateWidget() {
            var curX = widget.info.left + sx;
            var curY = widget.info.top + sy;
            //this.drawBgColor(curX,curY,widget.w,widget.h,widget.bgColor);
            var subType = widget.subType;
            widget.parentX = sx;
            widget.parentY = sy;


            var cb = function () {
            }

            //handle onTagChange
            var oldValue = widget.oldValue
            var curTagValue = this.getValueByTagName(widget.tag)
            // console.log(widget.name,oldValue,curTagValue)
            if(curTagValue!==undefined && curTagValue!==null){
                //has value
                if (curTagValue!==oldValue){
                    //tag change
                    this.handleTargetAction(widget,'TagChange')
                }

            }


            switch (subType) {
                case 'MySlide':
                    this.drawSlide(curX, curY, widget, options, cb);
                    break;
                case 'MyButton':
                    this.drawButton(curX, curY, widget, options, cb);
                    break;
                case 'MySwitch':
                    this.drawSwitch(curX, curY, widget, options, cb);
                    break;
                case 'MyButtonGroup':
                    this.drawButtonGroup(curX, curY, widget, options, cb);
                    break;
                case 'MyNumber':
                    this.drawNumber(curX, curY, widget, options, cb);
                    break;
                case 'MyProgress':
                    //draw progressbar
                    this.drawProgress(curX, curY, widget, options, cb);
                    break;
                case 'MyDashboard':
                    this.drawDashboard(curX, curY, widget, options, cb);
                    break;
                case 'MyOscilloscope':
                    this.drawOscilloscope(curX, curY, widget, options, cb);
                    break;
                case 'MyRotateImg':
                    this.drawRotateImg(curX, curY, widget, options, cb);
                    break;
                case 'MyNum':
                    this.drawNum(curX, curY, widget, options, cb)
                    break;
                case 'MyTexNum':
                    this.drawTexNum(curX, curY, widget, options, cb)
                    break;
                case 'MyDateTime':
                    this.drawTime(curX, curY, widget, options, cb);
                    break;
                case 'MyTexTime':
                    this.drawTexTime(curX, curY, widget, options, cb);
                    break;
                case 'MyTextArea':
                    this.drawTextArea(curX, curY, widget, options, cb);
                    break;
                case 'MySlideBlock':
                    this.drawSlideBlock(curX, curY, widget, options, cb);
                    break;
                case 'MyScriptTrigger':
                    this.drawScriptTrigger(curX, curY, widget, options, cb);
                    break;
                case 'MyVideo':
                    this.drawVideo(curX, curY, widget, options, cb);
                    break;
                case 'MyInputKeyboard':
                    this.drawInputKeyboard(curX, curY, widget, options, cb);
                    break;
                case 'MyAnimation':
                    this.drawAnimation(curX, curY, widget, options, cb);
                    break;
                case 'MyAlphaImg':
                    this.drawAlphaImg(curX, curY, widget, options, cb);
                    break;
                case 'general':
                    this.drawGeneralWidget(curX,curX,widget,options,cb);
                    break;
            }

        }

    },
    paintWidget: function (widget, sx, sy, options,ctx) {
        // console.log('drawing widget',widget);
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        var curX = widget.info.left + sx;
        var curY = widget.info.top + sy;
        //this.drawBgColor(curX,curY,widget.w,widget.h,widget.bgColor);
        var subType = widget.subType;
        widget.parentX = sx;
        widget.parentY = sy;
        offctx.save();

        // console.log('widget',JSON.stringify(widget.translate),JSON.stringify(widget.scale))
        // if (widget.translate){
        //     offctx.translate(widget.translate.x,widget.translate.y);
        // }
        // offctx.translate(curX,curY);
        // if (widget.scale){
        //     offctx.scale(widget.scale.w,widget.scale.h);
        // }
        offctx.translate(curX, curY);

        if (widget.transform) {
            var t = widget.transform;
            offctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
        }

        curX = 0;
        curY = 0;


        var cb = function () {
            offctx.restore();
        }


        switch (subType) {
            case 'MySlide':
                this.paintSlide(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyButton':
                this.paintButton(curX, curY, widget, options,cb,offctx);
                break;
            case 'MySwitch':
                this.paintSwitch(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyButtonGroup':
                this.paintButtonGroup(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyNumber':
                this.paintNumber(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyProgress':
                //paint progressbar
                this.paintProgress(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyDashboard':
                this.paintDashboard(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyOscilloscope':
                this.paintOscilloscope(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyRotateImg':
                this.paintRotateImg(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyNum':
                this.paintNum(curX, curY, widget, options,cb,offctx)
                break;
            case 'MyTexNum':
                this.paintTexNum(curX,curY,widget,options,cb,offctx)
                break;
            case 'MyDateTime':
                this.paintTime(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyTexTime':
                this.paintTexTime(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyTextArea':
                this.paintTextArea(curX,curY,widget,options,cb,offctx);
                break;
            case 'MySlideBlock':
                this.paintSlideBlock(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyScriptTrigger':
                this.paintScriptTrigger(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyVideo':
                this.paintVideo(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyInputKeyboard':
                this.paintInputKeyboard(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyReturnButton':
                this.paintButton(curX, curY, widget, options,cb,offctx);
                break;
            case 'MyAnimation':
                this.paintAnimation(curX, curY, widget, options,cb,offctx);
                break;
            case 'general':
                this.paintGeneralWidget(curX,curY,widget,options,cb,offctx);
                break;
            case 'MyAlphaImg':
                this.paintAlphaImg(curX,curY,widget,options,cb);
                break;
        }


    },
    drawInputKeyboard: function (curX, curY, widget, options, cb) {

    },
    paintInputKeyboard:function(curX, curY, widget, options,cb,ctx){
        var offcanvas = this.refs.offcanvas;
        var offCtx = ctx||this.offctx;
        var tempcanvas = this.refs.tempcanvas;

        var tempCtx = tempcanvas.getContext('2d');
        var width = widget.info.width;
        var height = widget.info.height;
        var curSlice = widget.texList[0].slices[0];
        this.drawBg(curX, curY, width, height, curSlice.imgSrc, curSlice.color,offCtx);

        //draw num
        var num = widget.info.num;

        this.drawBg(curX + num.x, curY + num.y, num.width, num.height, num.slices[0].imgSrc, num.slices[0].color,offCtx);
        //num display
        if (widget.curValue === undefined) {
            //no cur value
            widget.curValue = '0';
        }

        offCtx.save();
        offCtx.textAlign = 'right';
        offCtx.textBaseline = 'middle';
        //font
        var fontSize = 0.5 * num.height + 'px Helvetica';
        offCtx.font = fontSize;
        offCtx.fillStyle = num.color;
        offCtx.fillText(widget.curValue, curX + num.x + 0.9 * num.width, curY + num.y + 0.5 * num.height);
        offCtx.restore();

        //draw key

        tempCtx.save();
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        var keys = widget.info.keys;
        var curKey;
        var keyState = false;
        var keySlice;
        for (var i = 0; i < keys.length; i++) {
            keyState = false;
            curKey = keys[i];
            tempcanvas.width = curKey.width;
            tempcanvas.height = curKey.height;
            tempCtx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);

            if (curKey == widget.curPressedKey) {
                keyState = true;
            }


            if (!keyState) {
                keySlice = curKey.slices[0];
            } else {
                keySlice = curKey.slices[1];
            }

            this.drawBg(0, 0, curKey.width, curKey.height, keySlice.imgSrc, keySlice.color, tempCtx);
            tempCtx.font = keySlice.display.style;
            tempCtx.fillText(keySlice.display.value, 0.5 * curKey.width, 0.5 * curKey.height);

            offCtx.drawImage(tempcanvas, curX + curKey.x, curY + curKey.y, curKey.width, curKey.height);

        }
        tempCtx.restore();
        if (widget.highlight) {
            var index = widget.highlightValue;
            var length = keys.length;
            if (index >= 0 && index < length) {
                curKey = keys[index]
                this.drawHighLight( curX + curKey.x, curY + curKey.y, curKey.width, curKey.height,null,offCtx);
            }
        }
        cb && cb()

    },
    drawSlide: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        widget.curSlideIdx = slideIdx;
    },
    paintSlide: function (curX, curY, widget, options,cb,ctx) {
        var slideSlices = widget.texList[0].slices;
        var slideIdx = widget.curSlideIdx;
        var text = '';
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;

        if (slideIdx >= 0 && slideIdx < slideSlices.length) {
            var curSlice = slideSlices[slideIdx];
            var width = widget.info.width;
            var height = widget.info.height;
            this.drawBg(curX, curY, width, height, curSlice.imgSrc, curSlice.color,ctx);
            text = curSlice.text;
            if(!!text){
                this.drawTextByTempCanvas(ctx,curX,curY,width,height,text,font,'horizontal');
            }
        }
        cb && cb();
    },
    drawAnimation: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        widget.curSlideIdx = slideIdx;
    },
    paintAnimation:function(curX, curY, widget, options,cb,ctx){
        var slideSlices = widget.texList[0].slices;
        var slideIdx = widget.curSlideIdx;
        if (slideIdx >= 0 && slideIdx < slideSlices.length) {
            var curSlice = slideSlices[slideIdx];
            var width = widget.info.width;
            var height = widget.info.height;
            this.drawBg(curX, curY, width, height, curSlice.imgSrc, curSlice.color,ctx);
        }
        cb && cb();
    },
    drawButton: function (curX, curY, widget, options, cb) {

    },
    paintButton: function (curX, curY, widget, options,cb,ctx) {
        // console.log(widget);
        var tex = widget.texList[0];
        var width = widget.info.width;
        var height = widget.info.height;
        var text = widget.info.text;
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;
        switch (widget.buttonModeId) {
            case '0':
                //normal
                if (widget.mouseState && widget.mouseState.state && (widget.mouseState.state == 'press' || widget.mouseState.state == 'hold')) {
                    //pressed slice
                    this.drawBg(curX, curY, width, height, tex.slices[1].imgSrc, tex.slices[1].color,ctx);
                } else {
                    //normal slice
                    this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color,ctx);
                }
                break;
            case '1':
                //switch mode
                var switchState = this.getValueByTagName(widget.tag, 0);
                if (switchState == 0) {
                    this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color,ctx);
                } else {
                    this.drawBg(curX, curY, width, height, tex.slices[1].imgSrc, tex.slices[1].color,ctx);
                }
                break
        }

        //draw tint
        // lg('arrange',widget.info.arrange);
        this.drawTextByTempCanvas(ctx,curX,curY,width,height,text,font,widget.info.arrange);

        //draw highlight
        // lg('highlight',widget.highlight)
        // console.log('highlight',widget.highlight);
        if (widget.highlight) {
            this.drawHighLight(curX, curY, width, height,tex.slices[2],ctx);
        }

        cb && cb();
    },
    drawSwitch: function (curX, curY, widget, options, cb) {
        var bindTagValue = this.getValueByTagName(widget.tag, 0);
        var switchState;
        var bindBit = parseInt(widget.info.bindBit);
        if (bindBit < 0 || bindBit > 31) {
            switchState = 0;
        } else {
            switchState = bindTagValue & (Math.pow(2, bindBit));
        }
        widget.curSwitchState = switchState;
    },
    paintSwitch: function (curX, curY, widget, options,cb,ctx) {
        // console.log(widget);
        var tex = widget.texList[0];
        var width = widget.info.width;
        var height = widget.info.height;

        var text = widget.info.text;
        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;

        //switch mode
        var switchState = widget.curSwitchState;
        if (switchState == 0) {
            // this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color);
        } else {
            // console.log(tex);
            this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color,ctx);
            if(!!text){
                this.drawTextByTempCanvas(ctx,curX,curY,width,height,text,font,'horizontal');
            }
        }
        cb && cb();
    },
    drawTextArea:function (curX,curY,widget,options,cb) {},
    paintTextArea:function (curX,curY,widget,options,cb,ctx) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        var bgSlice = widget.texList[0].slices[0];
        var arrange = info.arrange === 'vertical'?'vertical': 'horizontal';
        this.drawBg(curX,curY,width,height,bgSlice.imgSrc,bgSlice.color,ctx);
        //draw text
        if (info.text) {
            //
            var font = {};
            font['font-style'] = info.fontItalic;
            font['font-weight'] = info.fontBold;
            font['font-size'] = info.fontSize;
            font['font-family'] = info.fontFamily;
            font['font-color']=info.fontColor;
            this.drawTextByTempCanvas(ctx,curX,curY,width,height,info.text,font,arrange);
        }
        cb && cb();
    },
    drawTextByTempCanvas:function (ctx,curX,curY,width,height,text,font,arrange,byteMode,maxFontWidth,spacing,paddingRatio) {

        var text = String(text)||'';
        var font = font||{};
        // console.log(font);
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        var tempcanvas = this.refs.tempcanvas;
        tempcanvas.width = width;
        tempcanvas.height = height;
        var tempctx = tempcanvas.getContext('2d');
        tempctx.save();
        if (spacing === undefined) spacing = 0;
        if (paddingRatio === undefined) paddingRatio = 0;
        if (arrange === 'vertical') {
            tempctx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
            tempctx.rotate(Math.PI / 2);
            tempctx.translate(-tempcanvas.width / 2, -tempcanvas.height / 2);
            // tempctx.translate(0,-tempcanvas.width)
        }
        tempctx.clearRect(0, 0, width, height);
        tempctx.textAlign = font.textAlign || 'center';
        tempctx.textBaseline = font.textBaseline || 'middle';
        //font style
        var fontStr = (font['font-style'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-weight'] || '') + ' ' + (font['font-size'] || 24) + 'px' + ' ' + ('"' + font['font-family'] + '"' || 'arial');
        tempctx.font = fontStr;
        // console.log('tempctx.font',fontStr,font);
        tempctx.fillStyle = font['font-color']||font['fontColor'];
        if(byteMode){
            // var widthOfDateTimeStr=maxFontWidth*text.length;
            // var initXPos = (width-widthOfDateTimeStr)/2;
            // var xCoordinate = initXPos+maxFontWidth/2;
            var xCoordinate = (maxFontWidth * text.length > width) ? maxFontWidth / 2 : ((width - maxFontWidth * text.length) + maxFontWidth) / 2;//如果装不下字符串，从maxFontWidth处开始显示
            if (paddingRatio !== 0) xCoordinate = paddingRatio * maxFontWidth + 0.5 * maxFontWidth;
            var notItalic = (-1 == fontStr.indexOf('italic'));
            var italicAjust = notItalic ? 0 : maxFontWidth / 2; //如果是斜体的话，需要斜体往右伸出的宽度
            // var displayStep = (maxFontWidth*text.length > width) ? ((width - maxFontWidth - italicAjust)/(text.length - 1)) : maxFontWidth;
            // displayStep+=spacing;
            var yCoordinate = 0.5 * height;
            for (i = 0; i < text.length; i++) {
                tempctx.fillText(text[i], xCoordinate, yCoordinate);
                xCoordinate += spacing;
                xCoordinate += maxFontWidth;

            }

        } else {
            tempctx.fillText(text, 0.5 * width, 0.5 * height);
        }
        tempctx.restore();
        offctx.drawImage(tempcanvas, curX, curY, width, height);
    },
    drawButtonGroup: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var curButtonIdx = (tag && tag.value) || 0;
        widget.curButtonIdx = curButtonIdx;
    },
    paintButtonGroup: function (curX, curY, widget, options,cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var interval = widget.info.interval;
        var count = widget.info.count;

        var curButtonIdx = widget.curButtonIdx;
        var texList = widget.texList;
        var highlightTex = texList[texList.length - 1];
        if (widget.info.arrange == 'horizontal') {
            //horizontal
            var singleWidth = Math.floor((width - interval * (count - 1)) / count);
            for (var i = 0; i < texList.length-1; i++) {
                var curButtonTex = texList[i];
                if (i == curButtonIdx - 1) {
                    //pressed tex
                    this.drawBg(curX + i * (singleWidth + interval), curY, singleWidth, height, curButtonTex.slices[1].imgSrc, curButtonTex.slices[1].color,ctx);

                } else {
                    //normal tex
                    this.drawBg(curX + i * (singleWidth + interval), curY, singleWidth, height, curButtonTex.slices[0].imgSrc, curButtonTex.slices[0].color,ctx);
                }
                //draw highlight
                if (widget.highlight) {
                    this.drawHighLight(curX + widget.highlightValue * (singleWidth + interval), curY, singleWidth, height,highlightTex.slices[0],ctx);
                }
            }
        } else {
            //vertical
            var singleHeight = Math.floor((height - interval * (count - 1)) / count);
            for (var i = 0; i < texList.length-1; i++) {
                var curButtonTex = texList[i];
                if (i == curButtonIdx - 1) {
                    //pressed tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[1].imgSrc, curButtonTex.slices[1].color,ctx);

                } else {
                    //normal tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[0].imgSrc, curButtonTex.slices[0].color,ctx);
                }
                if (widget.highlight) {
                    this.drawHighLight(curX, curY + widget.highlightValue * (singleHeight + interval), width, singleHeight,highlightTex.slices[0],ctx);
                }
            }
        }

        cb && cb();
    },

    drawProgress: function (curX, curY, widget, options, cb) {

        // widget.currentValue = curProgress
        // this.handleAlarmAction(curProgress, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
        // widget.oldValue = curProgress;

        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;

        var curProgressTag = this.findTagByName(widget.tag);
        var curProgress = parseFloat(curProgressTag && curProgressTag.value) || 0;

        if (curProgress != widget.oldValue) {
            var alarmValue = this.shouldHandleAlarmAction(curProgress, widget, lowAlarm, highAlarm)


            //newValue consider animation
            var oldValue;
            if (widget.info.enableAnimation){
                //using animation

                var duration = (widget.transition && widget.transition.duration) || 0

                //clear old animation

                if (widget.animationKey != -1 && widget.animationKey != undefined) {
                    oldValue = widget.currentValue || 0
                    AnimationManager.clearAnimationKey(widget.animationKey)
                    widget.animationKey = -1
                } else {
                    oldValue = widget.oldValue || 0
                }

                widget.oldValue = curProgress
                if (alarmValue.length) {
                    //hanlde alarm
                    this.handleTargetAction(widget, alarmValue);
                }


                widget.animationKey = AnimationManager.stepValue(oldValue, curProgress, duration, 30, null, function (obj) {
                    widget.currentValue = obj.curX
                    this.draw()
                }.bind(this), function () {
                    widget.currentValue = curProgress

                }.bind(this))

                //initial
                widget.currentValue = oldValue


            } else {
                widget.oldValue = curProgress
                if (alarmValue.length) {
                    //hanlde alarm
                    this.handleTargetAction(widget, alarmValue);
                }
                //paint

                widget.currentValue = curProgress

            }

            // this.paintProgress(curX,curY,widget,options,cb)


        } else {
            // this.paintProgress(curX,curY,widget,options,cb)
        }
    },
    paintProgress: function (curX, curY, widget, options,cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var cursor = (widget.info.cursor == '1');
        //get current value
        var curProgress = widget.currentValue || 0
        var curScale = 1.0 * (curProgress - widget.info.minValue) / (widget.info.maxValue - widget.info.minValue);

        curScale = (curScale >= 0 ? curScale : 0.0);
        curScale = (curScale <= 1 ? curScale : 1.0);
        if (widget.texList) {
            //has tex
            //draw background
            var texSlice = widget.texList[0].slices[0];

            //draw progress


            var progressSlice = widget.texList[1].slices[0];
            // console.log('drawing color progress',widget.info.progressModeId);
            switch (widget.info.progressModeId) {
                case '0':
                    this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color,ctx);

                    switch (widget.info.arrange) {

                        case 'vertical':
                            // console.log(curScale);
                            // this.drawBg(curX,curY+height-height*curScale,width,height*curScale,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY + height * (1.0 - curScale), width, height * curScale, progressSlice.imgSrc, progressSlice.color,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawVerCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color,curY,ctx);
                                //this.drawCursor(curX,curY+ height * (1.0 - curScale),width,height,false,height*(1.0-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, progressSlice.imgSrc, progressSlice.color,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawCursor(width*curScale+curX,curY,width,height,true,width*(1-curScale),cursorSlice.imgSrc,cursorSlice.color,ctx);
                            }
                            break;
                    }
                    break;
                case '1':

                    this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color,ctx);
                    var lastSlice = widget.texList[2].slices[0];
                    var mixedColor = this.addTwoColor(lastSlice.color, progressSlice.color, curScale);

                    // console.log('mixedColor',mixedColor);
                    switch (widget.info.arrange) {

                        case 'vertical':
                            // console.log(curScale);
                            // this.drawBg(curX,curY+height-height*curScale,width,height*curScale,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY + height * (1.0 - curScale), width, height * curScale, '', mixedColor,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color,curY,ctx);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, '', mixedColor,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawCursor(width*curScale+curX,curY,width,height,true,width*(1-curScale),cursorSlice.imgSrc,cursorSlice.color,ctx);
                            }
                            break;
                    }

                    break;
                case '2':
                    break;
                case '3':
                    this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color,ctx);
                    var drawColor = this.confirmOneColor(widget, curProgress);
                    var drawImg = this.confirmOneImage(widget,curProgress)
                    switch (widget.info.arrange) {
                        case 'vertical':
                            this.drawBgClip(curX, curY, width, height, curX, curY + height * (1.0 - curScale), width, height * curScale, drawImg, drawColor,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[widget.texList.length-1].slices[0];
                                this.drawVerCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color,curY,ctx);
                             }
                            break;
                        case 'horizontal':
                        default:
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, drawImg, drawColor,ctx);
                            if (cursor){
                                var cursorSlice = widget.texList[widget.texList.length-1].slices[0];
                                this.drawCursor(width*curScale+curX,curY,width,height,true,width*(1-curScale),cursorSlice.imgSrc,cursorSlice.color,ctx);
                            }
                            break;
                    }
                    break;
            }


        }

        cb && cb();


        //handle action

    },
    drawSlideBlock: function (curX, curY, widget, options, cb) {
        var width = widget.info.width;
        var height = widget.info.height;
        //get current value
        var curSlideTag = this.findTagByName(widget.tag);
        //console.log(widget.curValue);
        var curSlide = (curSlideTag && curSlideTag.value) || widget.curValue || 0;
        var curScale = 1.0 * (curSlide - widget.info.minValue) / (widget.info.maxValue - widget.info.minValue);

        curScale = (curScale >= 0 ? curScale : 0.0);
        curScale = (curScale <= 1 ? curScale : 1.0);
        widget.curSlide = curSlide;
        widget.curScale = curScale;

        //handle action
        this.handleAlarmAction(curSlide, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
        widget.oldValue = curSlide;

    },
    paintSlideBlock: function (curX, curY, widget, options,cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;

        if (widget.texList) {
            var hori = widget.info.arrange == 'horizontal';
            if (!widget.slideSize) {
                var defaultSize = hori ? widget.info.h : widget.info.w;
                widget.slideSize = this.getImageSize(widget.texList[1].slices[0].imgSrc, defaultSize, defaultSize);
            }
            //has tex
            //draw background
            var texSlice = widget.texList[0].slices[0];
            this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color,ctx);

            var curScale = widget.curScale;


            var slideSlice = widget.texList[1].slices[0];
            var slideImg = this.getImage(slideSlice.imgSrc);
            slideImg = (slideImg && slideImg.content) || null;
            if (slideImg) {
                var slideRatio;
                switch (widget.info.arrange) {
                    case 'vertical':

                        this.drawCursor(curX,curY+ height-curScale*(height-slideImg.height),width,height,false,height-curScale*(height-slideImg.height),slideSlice.imgSrc,slideSlice.color,ctx);
                        break;
                    case 'horizontal':
                    default:
                        // console.log(slideRatio,curScale);


                        this.drawCursor(curScale*(width-slideImg.width)+curX,curY,width,height,true,width-curScale*(width-slideImg.width),slideSlice.imgSrc,slideSlice.color,ctx);
                        break
                }
            }

        }
        cb && cb();
    },
    paintScriptTrigger:function (curX, curY, widget, options,cb,ctx) {
        cb&&cb()
    },
    drawScriptTrigger: function (curX, curY, widget, options, cb) {
        //get current value
        var curScriptTriggerTag = this.findTagByName(widget.tag);

        var curScriptTrigger = (curScriptTriggerTag && curScriptTriggerTag.value) || 0;
        cb && cb();
        //handle action
        // console.log(this.shouldHandleAlarmAction(curScriptTrigger, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue))
        this.handleAlarmAction(curScriptTrigger, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
        widget.oldValue = curScriptTrigger;
    },
    drawVideo: function (curX, curY, widget, options, cb) {
        var videoSrc = this.getRawValueByTagName(widget.tag) || '';
        // var videoSrc = 'http://blog.zzen1ss.me/media/video/saraba.mp4';
        if (VideoSource.setVideoSrc(videoSrc)) {
            //first set
            VideoSource.play();
        }
        widget.curVideoSrc = videoSrc
        // if (!(widget.timerId && widget.timerId!==0)){
        //     widget.timerId = setInterval(function () {
        //         this.draw();
        //     }.bind(this),40);
        //     var innerTimerList = this.state.innerTimerList;
        //     innerTimerList.push(widget.timerId);
        //     this.setState({innerTimerList:innerTimerList});
        // }
    },
    paintVideo:function(curX,curY,widget,options,cb,ctx){
        var width = widget.info.width;
        var height = widget.info.height;
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        offctx.fillStyle=widget.texList[0].slices[0].color;
        offctx.fillRect(curX,curY,width,height);
        //draw video
        //draw video
        offctx.drawImage(VideoSource.videoObj, curX, curY, width, height);


        cb && cb();
    },
    drawVerCursor: function (beginX, beginY, width, height, align, alignLimit, img, color,limitY,ctx) {

        var cursorImg = this.getImage(img);
        cursorImg = cursorImg && cursorImg.content || null;
        if (cursorImg) {
            var imgW = cursorImg.width;
            var imgH = cursorImg.height;
            if (align) {
                //horizontal
                this.drawBgClip(beginX, beginY - (imgH - height) * 0.5, imgW, imgH, beginX, beginY, Math.min(imgW, alignLimit), height, img, color,ctx);
            } else {
                //vertical
                var Ymin = beginY-imgH;
                if(Ymin<limitY)
                    Ymin=limitY;
                this.drawBgClip(beginX - (imgW - width) * 0.5, beginY-imgH, imgW, imgH, beginX, Ymin, width, Math.min(imgH,alignLimit), img, color,ctx);
            }
        }
    },
    drawCursor:function(beginX, beginY, width, height, align,alignLimit, img,color,ctx) {

        var cursorImg = this.getImage(img);
        cursorImg = (cursorImg && cursorImg.content) || null;
        if (cursorImg) {
            var imgW = cursorImg.width;
            var imgH = cursorImg.height;
            if (align) {
                //horizontal
                this.drawBgClip(beginX,beginY-(imgH-height)*0.5,imgW,imgH,beginX,beginY,Math.min(imgW,alignLimit),height,img,color,ctx);
            }else{
                //vertical
                this.drawBgClip(beginX-(imgW-width)*0.5,beginY-imgH,imgW,imgH,beginX,beginY-imgH,width,Math.min(imgH,alignLimit),img,color,ctx);
            }
        }


    },
    addTwoColor: function (color1, color2, ratio) {
        var color1Array = this.transColorToArray(color1);
        var color2Array = this.transColorToArray(color2);
        var mixedColor = [];
        for (var i = 0; i < 4; i++) {
            mixedColor[i] = parseInt(color1Array[i] * ratio + (1 - ratio) * color2Array[i]);
        }
        return 'rgba(' + mixedColor.join(',') + ')';
    },
    confirmOneColor: function (widget, curProgress) {
        var progressValue = parseInt(curProgress);
        var color1 = widget.texList[1].slices[0].color,
            color2 = widget.texList[2].slices[0].color,
            thresholdModeId = widget.info.thresholdModeId,
            threshold1 = widget.info.threshold1,
            threshold2 = widget.info.threshold2;
        if (thresholdModeId == '2') {
            var color3 = widget.texList[3].slices[0].color;
        }
        ;
        var drawColor = 'rgba(0,0,0,1)';
        if (thresholdModeId == '1') {
            if (progressValue < threshold1) {
                drawColor = color1;
            } else if (progressValue >= threshold2) {
                drawColor = color2;
            }
        } else if (thresholdModeId == '2') {
            if (progressValue < threshold1) {
                drawColor = color1;
            } else if (progressValue >= threshold1 && progressValue < threshold2) {
                drawColor = color2;
            } else if (progressValue >= threshold2) {
                drawColor = color3;
            }
        }
        return drawColor;
    },
    confirmOneImage: function (widget, curProgress) {
        var progressValue = parseInt(curProgress);
        var img1 = widget.texList[1].slices[0].imgSrc,
            img2 = widget.texList[2].slices[0].imgSrc,
            thresholdModeId = widget.info.thresholdModeId,
            threshold1 = widget.info.threshold1,
            threshold2 = widget.info.threshold2;
        if (thresholdModeId == '2') {
            var img3 = widget.texList[3].slices[0].imgSrc;
        }
        ;
        var img = null
        if (thresholdModeId == '1') {
            if (progressValue < threshold1) {
                img = img1;
            } else if (progressValue >= threshold2) {
                img = img2;
            }
        } else if (thresholdModeId == '2') {
            if (progressValue < threshold1) {
                img = img1;
            } else if (progressValue >= threshold1 && progressValue < threshold2) {
                img = img2;
            } else if (progressValue >= threshold2) {
                img = img3;
            }
        }
        return img;
    },
    transColorToArray: function (color) {
        //rgba to array
        var temp = color.split('(')[1].split(')')[0];
        var colorArray = temp.split(',').map(function (colorbit) {
            return Number(colorbit);
        });
        return colorArray;
    },
    getCurDateOriginalData: function (widget, source, offset) {
        var curDate;
        if (source === 'outer') {
            var time1 = parseInt(this.getValueByTagName('时钟变量年月日', 0)) || 0;
            var time2 = parseInt(this.getValueByTagName('时钟变量时分秒', 0)) || 0;
            var year, month, day, hour, minute, seconds;
            year = parseInt(time1 / 10000);
            month = parseInt((time1 - year * 10000) / 100);
            day = (time1 - year * 10000 - month * 100);

            hour = parseInt(time2 / 10000);
            minute = parseInt((time2 - hour * 10000) / 100);
            seconds = (time2 - hour * 10000 - minute * 100);
            var realMonth = month - 1;
            curDate = new Date(year, realMonth, day, hour, minute, seconds);
            // console.log(year,realMonth,day,hour,minute,seconds,curDate)

        } else {

            // if (widget.baseDate===undefined){
            //     widget.baseDate = new Date();
            // }
            // curDate = widget.baseDate;
            curDate = new Date();
            if (offset !== undefined) {
                curDate = new Date(curDate.getTime() + offset);
            }
        }

        return curDate;
    },
    drawTime: function (curX, curY, widget, options, cb) {
        var curDate;
        if (widget.info.RTCModeId == '0') {
            curDate = this.getCurDateOriginalData(widget, 'inner', widget.timeOffset);
        } else {
            curDate = this.getCurDateOriginalData(widget, 'outer');
        }
        widget.curDate = curDate;
        //timer 1 s
        if (!(widget.timerId && widget.timerId !== 0)) {
            widget.timerId = setInterval(function () {
                this.draw();
            }.bind(this), 1000)
            var innerTimerList = this.state.innerTimerList;
            innerTimerList.push(widget.timerId);
            this.setState({innerTimerList: innerTimerList});
        }
    },
    paintTime:function (curX,curY,widget,options,cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var dateTimeModeId = widget.info.dateTimeModeId;
        var fontFamily = widget.info.fontFamily;
        var fontSize = widget.info.fontSize;
        var fontColor = widget.info.fontColor;
        var tex = widget.texList && widget.texList[0];
        var maxFontWidth = widget.info.maxFontWidth;
        var spacing = widget.info.spacing;
        var paddingRatio = widget.info.paddingRatio;
        // lg(tex,widget)

        var font = {};
        font['font-style'] = widget.info.fontItalic;
        font['font-weight'] = widget.info.fontBold;
        font['font-size'] = widget.info.fontSize;
        font['font-family'] = widget.info.fontFamily;
        font['font-color'] = widget.info.fontColor;

        var curDate = widget.curDate;

        var dateTimeString = '';
        if (dateTimeModeId == '0') {
            //time
            dateTimeString = this.getCurTime(curDate);
        } else if (dateTimeModeId == '1') {
            dateTimeString = this.getCurTimeHM(curDate);
        } else {
            //date
            dateTimeString = this.getCurDate(curDate, dateTimeModeId);
        }
        //draw
        //this.drawTextByTempCanvas(curX,curY,width,height,dateTimeString,font,widget.info.arrange);
        //逐字渲染字符串
        this.drawTextByTempCanvas(ctx,curX,curY,width,height,dateTimeString,font,widget.info.arrange,true,widget.info.fontSize,spacing,paddingRatio);
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        var tempcanvas = this.refs.tempcanvas;
        // tempcanvas.width = width;
        // tempcanvas.height = height;
        // var tempctx = tempcanvas.getContext('2d');
        // tempctx.save();
        // tempctx.clearRect(0,0,width,height);
        // tempctx.textAlign = 'center';
        // tempctx.textBaseline = 'middle';
        // //font style
        // tempctx.fillStyle=fontColor;
        // tempctx.font = fontSize+'px '+fontFamily;
        // tempctx.fillText(dateTimeString,0.5*width,0.5*height);
        // tempctx.restore();


        offctx.drawImage(tempcanvas, curX, curY, width, height);


        //hightlight
        var eachWidth = 0;
        var delimiterWidth = 0;
        var eachHeight = 0;
        var delimiterHeight = 0;

        if (widget.highlight) {
            // console.log(widget)
            if (widget.info.arrange == 'vertical') {
                delimiterHeight = widget.delimiterWidth;
                if (dateTimeModeId=='0'){
                    eachHeight = (widget.info.height - 2*delimiterHeight)/3;
                    this.drawHighLight(curX,(eachHeight+delimiterHeight)*widget.highlightValue+curY,width,eachHeight,tex.slices[0],offctx);
                }else if(dateTimeModeId=='1'){
                    eachHeight = (widget.info.height - delimiterHeight)/2;
                    this.drawHighLight(curX,(eachHeight+delimiterHeight)*widget.highlightValue+curY,width,eachHeight,tex.slices[0],offctx);
                }else{
                    eachHeight = (widget.info.height - 2*delimiterHeight)/4;
                    if (widget.highlightValue == 0){
                        this.drawHighLight(curX,curY,width,eachHeight*2,tex.slices[0],offctx);
                    }else{
                        this.drawHighLight(curX,curY+(eachHeight+delimiterHeight)*widget.highlightValue+eachHeight,width,eachHeight,tex.slices[0],offctx);
                    }

                }
            } else {
                delimiterWidth = widget.delimiterWidth;
                if (dateTimeModeId=='0'){
                    eachWidth = (widget.info.width - 2*delimiterWidth)/3;
                    this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height,tex.slices[0],offctx);
                }else if(dateTimeModeId=='1'){
                    eachWidth = (widget.info.width - widget.delimiterWidth)/2;
                    this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height,tex.slices[0],offctx);
                }else{
                    eachWidth = (widget.info.width - 2*widget.delimiterWidth)/4;
                    if (widget.highlightValue == 0){
                        this.drawHighLight(curX,curY,eachWidth*2,height,tex.slices[0],offctx);
                    }else{
                        this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue+eachWidth,curY,eachWidth,height,tex.slices[0],offctx);
                    }

                }
            }

        }

        cb && cb();


    },
    getCurTime: function (date) {
        var date = date || new Date();
        var hour = (date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours();
        var minute = (date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes();
        var second = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : date.getSeconds();
        return '' + hour + ':' + minute + ':' + second;
    },
    getCurTimeHM: function (date) {
        var date = date || new Date();
        var hour = (date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours();
        var minute = (date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes();
        return '' + hour + ':' + minute;
    },
    getCurDate: function (date, mode) {
        var date = date || new Date();
        var year = date.getFullYear();
        var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
        var day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate();
        var dateString;
        if (mode == '2') {
            dateString = '' + year + '/' + month + '/' + day;
        } else {
            dateString = '' + year + '-' + month + '-' + day;
        }
        return dateString
    },

    drawTexTime: function (curX, curY, widget, options, cb) {
        var curDate;
        if (widget.info.RTCModeId == '0') {
            curDate = this.getCurDateOriginalData(widget, 'inner', widget.timeOffset);
        } else {
            curDate = this.getCurDateOriginalData(widget, 'outer');
        }
        widget.curDate = curDate;
        //timer 1 s
        if (!(widget.timerId && widget.timerId !== 0)) {
            widget.timerId = setInterval(function () {
                this.draw();
            }.bind(this), 1000)
            var innerTimerList = this.state.innerTimerList;
            innerTimerList.push(widget.timerId);
            this.setState({innerTimerList: innerTimerList});
        }
    },
    paintTexTime:function (curX,curY,widget,options,cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var dateTimeModeId = widget.info.dateTimeModeId;
        var highlightTex = widget.texList && widget.texList[1];
        var numTex = widget.texList && widget.texList[0];

        //生成时间日期字符串
        var curDate = widget.curDate;
        var dateTimeString = '';
        if (dateTimeModeId == '0') {
            //time
            dateTimeString = this.getCurTime(curDate);
        } else if (dateTimeModeId == '1') {
            dateTimeString = this.getCurTimeHM(curDate);
        } else {
            //date
            dateTimeString = this.getCurDate(curDate, dateTimeModeId);
        }

        //逐字渲染字符串
        this.paintStyledTexTime(widget,dateTimeString,curX,curY,width,height,ctx);

        //hightlight
        var eachWidth = 0;
        var delimiterWidth = 0;
        var eachHeight = 0;
        var delimiterHeight = 0;
// console.log(widget)
        if (widget.highlight) {

            if (widget.info.arrange == 'vertical') {
                delimiterHeight = widget.delimiterWidth;
                if (dateTimeModeId=='0'){
                    eachHeight = (widget.info.height - 2*delimiterHeight)/3;
                    this.drawHighLight(curX,(eachHeight+delimiterHeight)*widget.highlightValue+curY,width,eachHeight,highlightTex.slices[0],ctx);
                }else if(dateTimeModeId=='1'){
                    eachHeight = (widget.info.height - delimiterHeight)/2;
                    this.drawHighLight(curX,(eachHeight+delimiterHeight)*widget.highlightValue+curY,width,eachHeight,highlightTex.slices[0],ctx);
                }else{
                    eachHeight = (widget.info.height - 2*delimiterHeight)/4;
                    if (widget.highlightValue == 0){
                        this.drawHighLight(curX,curY,width,eachHeight*2,highlightTex.slices[0],ctx);
                    }else{
                        this.drawHighLight(curX,curY+(eachHeight+delimiterHeight)*widget.highlightValue+eachHeight,width,eachHeight,highlightTex.slices[0],ctx);
                    }

                }
            } else {
                delimiterWidth = widget.delimiterWidth;
                if (dateTimeModeId=='0'){
                    eachWidth = (widget.info.width - 2*delimiterWidth)/3;
                    this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height,highlightTex.slices[0],ctx);
                }else if(dateTimeModeId=='1'){
                    eachWidth = (widget.info.width - widget.delimiterWidth)/2;
                    this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height,highlightTex.slices[0],ctx);
                }else{
                    eachWidth = (widget.info.width - 2*widget.delimiterWidth)/4;
                    if (widget.highlightValue == 0){
                        this.drawHighLight(curX,curY,eachWidth*2,height,highlightTex.slices[0],ctx);
                    }else{
                        this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue+eachWidth,curY,eachWidth,height,highlightTex.slices[0],ctx);
                    }

                }
            }

        }

        cb && cb();


    },
    paintStyledTexTime:function(widget,numElems,clipX,clipY,clipW,clipH,ctx){
        var offctx = ctx||this.offctx
        var charW = widget.info.characterW;
        var charH = widget.info.characterH;

        offctx.save()
        offctx.beginPath()
        offctx.rect(clipX, clipY, clipW, clipH);
        offctx.clip();

        var leftOffset = 0
        var curTexSlice = null;
        for (var i = 0; i < numElems.length; i++) {
            switch (numElems[i]) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    curTexSlice = widget.texList[0].slices[parseInt(numElems[i])];
                    break;
                case ':':
                    curTexSlice = widget.texList[0].slices[10];
                    break;
                case '/':
                    curTexSlice = widget.texList[0].slices[11];
                    break;
                case '-':
                    curTexSlice = widget.texList[0].slices[12];
                    break;
            }
            if (curTexSlice) {
                this.drawBg(clipX + leftOffset, clipY, charW, charH, curTexSlice.imgSrc, curTexSlice.color, offctx)
            }
            leftOffset += charW;
        }
        offctx.restore()
    },

    drawBgClip: function (curX, curY, parentWidth, parentHeight, childX, childY, childWidth, childHeight, imageName, color,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;

        offctx.save();

        offctx.beginPath();

        if ((childX + childWidth) > (curX + parentWidth)) {
            childWidth = curX + parentWidth - childX;
        }

        if ((childY + childHeight) > (curY + parentHeight)) {
            childHeight = curY + parentHeight - childY;
        }


        offctx.rect(childX, childY, childWidth, childHeight);


        offctx.clip();


        this.drawBg(curX, curY, parentWidth, parentHeight, imageName, color, offctx);
        // this.drawBg(childX,childY,childWidth,childHeight,imageName,color);
        offctx.restore();

    },
    drawHighLight: function (curX, curY, width, height,slice,ctx) {
        if (slice){
            this.drawBg(curX,curY,width,height,slice.imgSrc,slice.color,ctx);
        }else{
            this.drawBgColor(curX, curY, width, height, 'rgba(244,244,244,0.3)',ctx);
        }

    },
    findValue: function (array, key1, value, key2) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key1] == value) {
                return array[i][key2];

            }
        }
    },
    limitValueBetween: function (curVal, minVal, maxVal, overFlowStyle) {
        if (curVal < minVal) {
            return minVal;
        }
        else if (curVal > maxVal) {
            return maxVal;
        } else {
            return curVal;
        }
    },
    multiDigits: function (digit, num) {
        var result = ''
        for (var i = 0; i < num; i++) {
            result += digit;
        }
        return result
    },
    changeNumDigits: function (originalNum, digits, appendNum, beforeOrFalse) {
        var originalNum = String(parseInt(originalNum || 0))
        var originalLength = originalNum.length
        var resultNum = ''
        if (originalLength > digits) {
            //cut front
            resultNum = originalNum.slice(originalLength - digits - 1, -1)
        } else if (originalLength < digits) {
            //append
            if (beforeOrFalse) {
                //append front
                resultNum = this.multiDigits(appendNum, (digits - originalLength)) + originalNum
            } else {
                resultNum = originalNum + this.multiDigits(appendNum, (digits - originalLength))
            }
        } else {
            resultNum = originalNum
        }
        return resultNum
    },
    drawNumber: function (curX, curY, widget, options, cb) {
        var maxOverflow = false;
        var minOverflow = false;
        var needDrawNumber = false;
        var numberTag;
        //handle initial number
        if (this.pageOnload == false) {
            //show init number ?
            if (widget.info.noInit == false) {
                //init, draw
                needDrawNumber = true;
                numberTag = this.findTagByName(widget.tag);

                if (numberTag) {
                    // numberTag.value = widget.info.initValue
                    this.setTagByTag(numberTag, widget.info.initValue)
                }
            }
        } else {
            needDrawNumber = true;
        }

        if (needDrawNumber) {



            //find current number

            numberTag = this.findTagByName(widget.tag);

            var currentValue = 0;
            if (numberTag) {
                currentValue = numberTag.value;
            } else {
                currentValue = Number(widget.info.initValue) || 0;
            }


            //currentValue
            if (currentValue > widget.info.maxValue) {
                currentValue = widget.info.maxValue;
                maxOverflow = true;
            } else if (currentValue < widget.info.minValue) {
                currentValue = widget.info.minValue;
                minOverflow = true;
            }

            widget.currentValue = currentValue;
        }

        //handle action
        if (maxOverflow) {
            //handle max overflow
            this.handleTargetAction(widget, 'MaxOverflow');
        } else if (minOverflow) {
            //handle min overflow
            this.handleTargetAction(widget, 'MinOverflow');
        }

    },
    paintNumber: function (curX, curY, widget, options,cb,ctx) {
        // console.log(widget);
        var maxDigits = parseInt(widget.info.initValue) / 10 + 1;
        var singleNumberWidth = widget.info.width / maxDigits;
        var singleNumberHeight = widget.info.height;
        var currentValue = widget.currentValue
        var currentDigits = String(currentValue).split('').map(function (digit) {
            return parseInt(digit);
        });
        for (var i = 0; i < currentDigits.length; i++) {
            this.drawDigit(currentDigits[i], widget, curX + i * singleNumberWidth, curY, singleNumberWidth, singleNumberHeight,ctx);
        }

        cb && cb();


    },
    drawNum: function (curX, curY, widget, options, cb) {

        var overFlowStyle = widget.info.overFlowStyle;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var lowAlarmValue = widget.info.lowAlarmValue;
        var highAlarmValue = widget.info.highAlarmValue;
        var curValue = this.getValueByTagName(widget.tag);
        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        // console.log(curValue)
        if (curValue === null || curValue === 'undefined') {
            curValue = widget.info.numValue;
        }

        widget.oldValue = widget.oldValue || 0;
        var shouldHandleAlarmAction = false;
        if (curValue != undefined && curValue != null) {


            if (overFlowStyle == '0' && (curValue > maxValue || curValue < minValue)) {
                widget.curValue = null
            } else {

                curValue = Number(this.limitValueBetween(curValue, minValue, maxValue)) || 0;
                widget.curValue = curValue

            }
            if (widget.curValue !== widget.oldValue) {
                //update
                widget.animateOldValue = widget.oldValue

                this.handleAlarmAction(curValue, widget, lowAlarmValue, highAlarmValue)
                widget.oldValue = curValue


                if(enableAnimation){
                    var fps = this.fps
                    var duration = (widget.transition&&widget.transition.duration)||0
                    var totalFrameNum = duration/1000 * fps

                    totalFrameNum = totalFrameNum > 1 ? totalFrameNum : 1

                    if (widget.animateTimerId == undefined || widget.animateTimerId === 0) {
                        // console.log(totalFrameNum)
                        widget.curTotalFrameNum = totalFrameNum
                        // var startTime = new Date()
                        // console.log('start time',startTime)
                        widget.animateTimerId = setInterval(function () {
                            if (widget.curFrameNum != undefined) {
                                widget.curFrameNum += 1
                            } else {
                                widget.curFrameNum = 1
                            }
                            if (widget.curFrameNum > totalFrameNum - 1) {
                                clearInterval(widget.animateTimerId)
                                // var endTime = new Date()
                                // console.log('end time',endTime,endTime-startTime)

                                widget.animateTimerId = 0
                                widget.curFrameNum = 0

                            }
                            this.draw()
                        }.bind(this), 1000 / fps)
                    }
                }

            }


        }


    },
    paintNum: function (curX, curY, widget, options,cb,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx
        //get current value
        var curValue = widget.curValue
        // console.log(curValue)
        // console.log(curValue);

        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        var frontZeroMode = widget.info.frontZeroMode;
        var symbolMode = widget.info.symbolMode;
        var decimalCount = widget.info.decimalCount || 0;
        var numOfDigits = widget.info.numOfDigits;
        var numFamily = widget.info.fontFamily;
        var numSize = widget.info.fontSize;
        var numColor = widget.info.fontColor;
        var numBold = widget.info.fontBold;
        var numItalic = widget.info.fontItalic;
        var overFlowStyle = widget.info.overFlowStyle;
        var maxFontWidth = widget.info.maxFontWidth;
        var align = widget.info.align;
        var spacing = widget.info.spacing;
        //console.log('maxFontWidth',maxFontWidth,'align',align);
        //size
        var curWidth = widget.info.width;
        var curHeight = widget.info.height;

        var hexMode = {
            numSystem: widget.info.numSystem,
            markingMode: widget.info.hexControl.markingMode,
            transformMode: widget.info.hexControl.transformMode
        };

        if(symbolMode=='0'){
            curValue = Math.abs(curValue);
        }
        //arrange
        var arrange = widget.info.arrange === 'vertical' ? 'vertical' : 'horizontal';
        // console.log(arrange)

        var tempcanvas = this.refs.tempcanvas;

        tempcanvas.width = curWidth;
        tempcanvas.height = curHeight;
        var tempCtx = tempcanvas.getContext('2d');
        tempCtx.clearRect(0, 0, curWidth, curHeight);
        //offCtx.scale(1/this.scaleX,1/this.scaleY);
        var numString = numItalic + " " + numBold + " " + numSize + "px" + " " + '"' + numFamily + '"';
        //offCtx.fillStyle = this.numColor;
        tempCtx.font = numString;
        //tempCtx.textAlign=widget.info.align;
        //tempCtx.textAlign = tempCtx.textAlign||'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillStyle = numColor;


        var tempNumValue = '';
        if (curValue != undefined && curValue != null) {

            var changeDirection = curValue - widget.animateOldValue

            if (!enableAnimation || (enableAnimation && widget.animateTimerId == 0)) {


                tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode ,hexMode)

                //drawbackground
                var bgTex = {
                    color: numColor,
                    imgSrc: '',
                    name: '数字背景'
                }

                this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing);
                offctx.drawImage(tempcanvas, curX, curY, tempcanvas.width, tempcanvas.height)

            } else {
                //animate number


                //drawbackground
                var bgTex = widget.texList[0].slices[0]
                var totalFrameNum = widget.curTotalFrameNum || 1
                // //draw
                var oldHeight = 0;
                var oleWidth = 0;
                var curFrameNum = changeDirection < 0 ? (totalFrameNum - widget.curFrameNum) : widget.curFrameNum
                var newTempNumValue = ''
                if (arrange === 'horizontal') {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    }

                    this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing)
                    oldHeight = (totalFrameNum - curFrameNum) / totalFrameNum * curHeight
                    if (oldHeight > 0) {
                        offctx.drawImage(tempcanvas, 0, 0, curWidth, oldHeight, curX, curY + curHeight - oldHeight, curWidth, oldHeight)
                    }


                    this.drawStyleString(newTempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing)
                    oldHeight = curFrameNum / totalFrameNum * curHeight
                    if (oldHeight > 0) {
                        offctx.drawImage(tempcanvas, 0, curHeight - oldHeight, curWidth, oldHeight, curX, curY, curWidth, oldHeight)
                    }

                } else {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    }
                    this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing)
                    oldWidth = (totalFrameNum - curFrameNum) / totalFrameNum * curWidth
                    if (oleWidth > 0) {
                        offctx.drawImage(tempcanvas, 0, 0, oldWidth, curHeight, curX + curWidth - oldWidth, curY, oldWidth, curHeight)
                    }

                    this.drawStyleString(newTempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing)

                    oldWidth = curFrameNum / totalFrameNum * curWidth;
                    if (oleWidth > 0) {
                        offctx.drawImage(tempcanvas, curWidth - oleWidth, 0, oldWidth, curHeight, curX, curY, oldWidth, curHeight)
                    }

                }


                // var transY = curHeight * 1.0 / totalFrameNum * (widget.curFrameNum|| 0


            }


            // offctx.restore();


        }

        cb && cb();

    },
    drawTexNum: function (curX, curY, widget, options, cb) {

        var overFlowStyle = widget.info.overFlowStyle;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var lowAlarmValue = widget.info.lowAlarmValue;
        var highAlarmValue = widget.info.highAlarmValue;
        var curValue = this.getValueByTagName(widget.tag);
        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        // console.log(curValue)
        if (curValue === null || curValue === 'undefined') {
            curValue = widget.info.numValue;
        }

        widget.oldValue = widget.oldValue || 0;
        var shouldHandleAlarmAction = false;
        if (curValue != undefined && curValue != null) {


            if (overFlowStyle == '0' && (curValue > maxValue || curValue < minValue)) {
                widget.curValue = null
            } else {

                curValue = Number(this.limitValueBetween(curValue, minValue, maxValue)) || 0;
                widget.curValue = curValue

            }
            if (widget.curValue !== widget.oldValue) {
                //update
                widget.animateOldValue = widget.oldValue

                this.handleAlarmAction(curValue, widget, lowAlarmValue, highAlarmValue)
                widget.oldValue = curValue


                if(enableAnimation){
                    var fps = this.fps
                    var duration = (widget.transition&&widget.transition.duration)||0
                    var totalFrameNum = duration/1000 * fps
                    totalFrameNum = totalFrameNum>1? totalFrameNum:1

                    if (widget.animateTimerId == undefined || widget.animateTimerId === 0) {
                        widget.curTotalFrameNum = totalFrameNum
                        widget.animateTimerId = setInterval(function () {
                            if (widget.curFrameNum != undefined) {
                                widget.curFrameNum += 1
                            } else {
                                widget.curFrameNum = 1
                            }
                            if (widget.curFrameNum > totalFrameNum - 1) {
                                clearInterval(widget.animateTimerId)
                                widget.animateTimerId = 0
                                widget.curFrameNum = 0

                            }
                            this.draw()
                        }.bind(this), 1000 / fps)
                    }
                }

            }


        }


    },
    paintTexNum: function (curX, curY, widget, options,cb,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx
        //get current value
        var curValue = widget.curValue
        // console.log(curValue)
        // console.log(curValue);

        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        var frontZeroMode = widget.info.frontZeroMode;
        var symbolMode = widget.info.symbolMode;
        var decimalCount = widget.info.decimalCount || 0;
        var numOfDigits = widget.info.numOfDigits;
        // var numFamily = widget.info.fontFamily;
        // var numSize = widget.info.fontSize;
        // var numColor = widget.info.fontColor;
        // var numBold = widget.info.fontBold;
        // var numItalic = widget.info.fontItalic;
        //font size
        var charW = widget.info.characterW;
        var charH = widget.info.characterH;
        var overFlowStyle = widget.info.overFlowStyle;
        // var maxFontWidth = widget.info.maxFontWidth;
        var align = widget.info.align;
        //console.log('maxFontWidth',maxFontWidth,'align',align);
        //size
        var curWidth = widget.info.width;
        var curHeight = widget.info.height;

        //arrange
        var arrange = widget.info.arrange === 'vertical' ? 'vertical' : 'horizontal';
        // console.log(arrange)

        if(symbolMode=='0'){
            curValue = Math.abs(curValue);
        }
        //16进制
        var hexMode = {
            numSystem: widget.info.numSystem,
            markingMode: widget.info.hexControl.markingMode,
            transformMode: widget.info.hexControl.transformMode
        };

        var tempcanvas = this.refs.tempcanvas;

        tempcanvas.width = curWidth;
        tempcanvas.height = curHeight;
        var tempCtx = tempcanvas.getContext('2d');
        tempCtx.clearRect(0, 0, curWidth, curHeight);


        var tempNumValue = '';
        if (curValue != undefined && curValue != null) {

            var changeDirection = curValue - widget.animateOldValue

            if (!enableAnimation || (enableAnimation && widget.animateTimerId == 0)) {


                tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                // console.log('tempNumValue',tempNumValue)
                this.paintStyledTexNum(widget,tempNumValue,curX,curY,curX,curY,curWidth,curHeight,ctx)


            } else {
                //animate number


                //drawbackground

                var totalFrameNum = widget.curTotalFrameNum || 1
                // //draw
                var oldHeight = 0;
                var oleWidth = 0;
                var curFrameNum = changeDirection < 0 ? (totalFrameNum - widget.curFrameNum) : widget.curFrameNum
                var newTempNumValue = ''
                if (arrange === 'horizontal') {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    }


                    oldHeight = (totalFrameNum - curFrameNum) / totalFrameNum * curHeight
                    if (oldHeight>0){
                        this.paintStyledTexNum(widget,tempNumValue,curX, curY + curHeight - oldHeight,curX, curY + curHeight - oldHeight, curWidth, oldHeight,ctx)
                    }
                    oldHeight = curFrameNum / totalFrameNum * curHeight
                    if (oldHeight > 0) {

                        this.paintStyledTexNum(widget,newTempNumValue, curX, curY-curHeight+oldHeight,curX,curY, curWidth, oldHeight,ctx)
                    }

                } else {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode)
                    }

                    oldWidth = (totalFrameNum - curFrameNum)  / totalFrameNum * curWidth
                    if (oleWidth>0){
                        this.paintStyledTexNum(widget,tempNumValue,curX-curWidth+oldWidth, curY,curX, curY , curWidth, oldHeight,ctx)
                    }
                    oldWidth = curFrameNum  / totalFrameNum * curWidth;
                    if (oleWidth>0){
                        this.paintStyledTexNum(widget,newTempNumValue,curX+curWidth-oldWidth, curY,curX+curWidth-oldWidth, curY, curWidth, oldHeight,ctx)
                    }

                }


                // var transY = curHeight * 1.0 / totalFrameNum * (widget.curFrameNum|| 0


            }


            // offctx.restore();


        }

        cb && cb();

    },
    paintStyledTexNum:function(widget,tempNumValue,dstX,dstY,clipX,clipY,clipW,clipH,ctx){
        var offctx = ctx||this.offctx
        var charW = widget.info.characterW;
        var charH = widget.info.characterH;
        var widgetW = widget.info.width;
        var widgetH = widget.info.height;
        var align = widget.info.align;
        offctx.save()
        offctx.beginPath()
        offctx.rect(clipX, clipY, clipW, clipH);
        // offctx.stroke()
        offctx.clip();
        var numLength = 0;
        var numElems = tempNumValue.split('')
        numElems.forEach(function (elem) {
            if (elem == '.') {
                numLength += 0.5 * charW
            } else {
                numLength += charW
            }
        })
        var leftOffset = 0
        switch (align) {
            case 'center':
                leftOffset = (widgetW - numLength) * 0.5
                break;
            case 'right':
                leftOffset = widgetW - numLength
                break;
            default:
            //left
        }
        var curTexSlice = null;
        var drawW = charW;
        // console.log(numElems)
        for (var i = 0; i < numElems.length; i++) {
            var curElem = numElems[i]
            drawW = charW;
            switch (curElem) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    curTexSlice = widget.texList[0].slices[curElem];
                    break;
                case '.':
                    curTexSlice = widget.texList[0].slices[10];
                    break;
                case '+':
                    curTexSlice = widget.texList[0].slices[11];
                    break;
                case '-':
                    curTexSlice = widget.texList[0].slices[12];
                    break;
                case 'x':
                    curTexSlice = widget.texList[0].slices[13];
                    break;
                case 'a':
                    curTexSlice = widget.texList[0].slices[14];
                    break;
                case 'b':
                    curTexSlice = widget.texList[0].slices[15];
                    break;
                case 'c':
                    curTexSlice = widget.texList[0].slices[16];
                    break;
                case 'd':
                    curTexSlice = widget.texList[0].slices[17];
                    break;
                case 'e':
                    curTexSlice = widget.texList[0].slices[18];
                    break;
                case 'f':
                    curTexSlice = widget.texList[0].slices[19];
                    break;
                case 'A':
                    curTexSlice = widget.texList[0].slices[20];
                    break;
                case 'B':
                    curTexSlice = widget.texList[0].slices[21];
                    break;
                case 'C':
                    curTexSlice = widget.texList[0].slices[22];
                    break;
                case 'D':
                    curTexSlice = widget.texList[0].slices[23];
                    break;
                case 'E':
                    curTexSlice = widget.texList[0].slices[24];
                    break;
                case 'F':
                    curTexSlice = widget.texList[0].slices[25];
                    break;

            }
            if (curTexSlice) {
                this.drawBg(dstX + leftOffset, dstY, drawW, charH, curTexSlice.imgSrc, curTexSlice.color, offctx)
            }
            if (curElem === '.') {
                leftOffset += drawW / 2;
            } else {
                leftOffset += drawW;
            }


        }

        offctx.restore()

    },
    drawStyleString: function (numStr, curWidth, curHeight, font, bgTex, tempcanvas, _arrange, align, maxFontWidth, decimalCount, spacing) {
        var tempCtx = tempcanvas.getContext('2d');
        var arrange = _arrange || 'horizontal';
        tempCtx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
        tempCtx.save();
        tempCtx.baseLine = 'middle';
        tempCtx.textAlign = 'center';
        // console.log('arrange',arrange)
        if (arrange === 'vertical') {
            tempCtx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
            tempCtx.rotate(Math.PI / 2);
            tempCtx.translate(-tempcanvas.width / 2, -tempcanvas.height / 2);
            // tempCtx.translate(0,-tempcanvas.width)
        }

        tempCtx.font = font;
        // console.log('curWidth',curWidth,'tempcanvas.width',tempcanvas.width);
        // tempCtx.strokeStyle="#000";/*设置边框*/
        // tempCtx.lineWidth=1;/*边框的宽度*/
        // tempCtx.strokeRect(0,0,curWidth,curHeight);
        var xCoordinate,         //渲染每个字符的x坐标
            initXPos,            //渲染每个字符的起始位置
            widthOfNumStr,       //渲染的字符串的长度
            paddingX;
        paddingX = Math.ceil(maxFontWidth / 10);
        widthOfNumStr = (decimalCount == 0 ? (maxFontWidth * numStr.length) : (maxFontWidth * (numStr.length - 0.5)));
        widthOfNumStr += (numStr.length - 1) * spacing;

        switch (align) {
            case 'left':
                initXPos = 0;
                break;
            case 'right':
                curWidth -= paddingX * 2;
                initXPos = widthOfNumStr > curWidth ? 0 : curWidth - (widthOfNumStr);
                break;
            case 'center':
            default:
                curWidth -= paddingX * 2;
                initXPos = widthOfNumStr > curWidth ? 0 : (curWidth - widthOfNumStr) / 2;
                break;
        }
        // console.log('initXPos',initXPos,'paddingX',paddingX);
        xCoordinate = initXPos + paddingX;
        xCoordinate += maxFontWidth / 2;
        /*
         修改数字控件字符的渲染位置的计算方式，步长改为当字符总的长度大于控件的宽度时为控件宽度的等分，否则为字符宽度
         */
        var displayStep = maxFontWidth;

        for (var i = 0; i < numStr.length; i++) {
            if (numStr[i] == '.') {
                // console.log('displayStep',displayStep);
                tempCtx.fillText(numStr[i], xCoordinate - maxFontWidth / 5, curHeight / 2);
                // tempCtx.strokeRect(xCoordinate-maxFontWidth/2,0+6,maxFontWidth/2,maxFontWidth);
                xCoordinate += displayStep / 2;
            } else {
                tempCtx.fillText(numStr[i], xCoordinate, curHeight / 2);
                // tempCtx.strokeRect(xCoordinate-maxFontWidth/2,0+6,maxFontWidth,maxFontWidth);
                xCoordinate += displayStep;
            }
            xCoordinate += spacing;
        }
        // switch(tempCtx.textAlign){
        //     case 'left':
        //         tempCtx.fillText(tempNumValue, 0, tempcanvas.height / 2 );
        //         break;
        //     case 'right':
        //         tempCtx.fillText(tempNumValue, tempcanvas.width , tempcanvas.height / 2 );
        //         break;
        //     case 'center':
        //     default :
        //         tempCtx.fillText(tempNumValue, tempcanvas.width / 2, tempcanvas.height / 2 );
        //         break;
        // }
        // tempCtx.fillText(tempNumValue,0,)
        tempCtx.restore()
    },
    generateStyleString: function (curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode) {
        var negative = false;
        if (curValue < 0) {
            negative = true;
        }
        var tempNumValue = Math.abs(curValue);
        tempNumValue = tempNumValue.toString();
        //console.log(tempNumValue);
        //配置小数位数
        if (parseInt(decimalCount) > 0) {
            var baseCount = Math.pow(10, decimalCount);
            tempNumValue = (Math.abs(curValue) / baseCount).toString();
            var tempNumValuePair = tempNumValue.split('.');
            if (tempNumValuePair.length > 1) {
                //has original fraction
                var tempValue = tempNumValuePair[1];
                for (var i = 0; i < decimalCount - tempNumValuePair[1].length; i++) {
                    tempValue = tempValue + '0';
                }
                tempNumValue = tempNumValuePair[0] + '.' + this.changeNumDigits(tempValue, decimalCount, 0, true)
            } else {
                //only int
                tempNumValue = tempNumValuePair[0] + '.' + this.changeNumDigits('', decimalCount, 0, false)
            }
        }
        if (numOfDigits) {
            //配置前导0模式
            var intPart = tempNumValue.split('.')[0]
            var fracPart = tempNumValue.split('.')[1];
            var intDigits = numOfDigits - decimalCount
            if (frontZeroMode == '1') {
                intPart = this.changeNumDigits(intPart, intDigits, 0, true)
            } else {
                intPart = this.changeNumDigits(intPart, intDigits, '', true)
            }
            if (tempNumValue.split('.').length > 1) {
                tempNumValue = intPart + '.' + fracPart;
            } else {
                tempNumValue = intPart
            }
        }

        //配置正负号
        if (!negative) {
            var symbol = '';
            if (symbolMode == '1') {
                symbol = '';
            }
            tempNumValue = symbol + tempNumValue;
        } else if (negative) {
            symbol = '-';
            tempNumValue = symbol + tempNumValue;
        }

        if (hexMode && hexMode.numSystem == '1') {
            tempNumValue = parseInt(tempNumValue).toString(16);
            if (hexMode.transformMode == '1') {
                tempNumValue = tempNumValue.toUpperCase();
            }
            if (hexMode.markingMode == '1') {
                tempNumValue = '0x' + tempNumValue;
            }
        }

        return tempNumValue
    },
    drawDigit: function (digit, widget, originX, originY, width, height,ctx) {

        if (widget.texList && widget.texList[digit]) {
            var slice = widget.texList[digit].slices[0];
            this.drawBg(originX, originY, width, height, slice.imgSrc || (digit + '.png'), slice.color,ctx);
        }

    },
    drawDashboard: function (curX, curY, widget, options, cb) {

        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var curDashboardTag = this.findTagByName(widget.tag);
        var curDashboardTagValue;


        curDashboardTagValue = parseFloat(curDashboardTag && curDashboardTag.value || 0);

        if (curDashboardTagValue != widget.oldValue) {
            var alarmValue = this.shouldHandleAlarmAction(curDashboardTagValue, widget, lowAlarm, highAlarm)


            //newValue consider animation
            var oldValue
            if (widget.info.enableAnimation) {
                //using animation

                var duration = (widget.transition && widget.transition.duration) || 0


                //clear old animation

                if (widget.animationKey != -1 && widget.animationKey != undefined) {
                    oldValue = widget.currentValue || 0
                    AnimationManager.clearAnimationKey(widget.animationKey)
                    widget.animationKey = -1
                } else {
                    oldValue = widget.oldValue || 0
                }

                widget.oldValue = curDashboardTagValue
                if (alarmValue.length) {
                    //hanlde alarm
                    this.handleTargetAction(widget, alarmValue);
                }


                widget.animationKey = AnimationManager.stepValue(oldValue, curDashboardTagValue, duration, 30, null, function (obj) {
                    widget.currentValue = obj.curX
                    this.draw()
                }.bind(this), function () {
                    widget.currentValue = curDashboardTagValue

                }.bind(this))

                //initial
                widget.currentValue = oldValue
                // this.paintDashboard(curX,curY,widget,options,cb)

            } else {
                widget.oldValue = curDashboardTagValue
                if (alarmValue.length) {
                    //hanlde alarm
                    this.handleTargetAction(widget, alarmValue);
                }
                //paint

                widget.currentValue = curDashboardTagValue

                // this.paintDashboard(curX,curY,widget,options,cb)


            }


        } else {
            // this.paintDashboard(curX,curY,widget,options,cb)
        }


    },
    paintDashboard: function (curX, curY, widget, options,cb,ctx) {

        var width = widget.info.width;
        var height = widget.info.height;
        var offset = widget.info.offsetValue || 0;
        if (widget.texList) {

            //pointer
            var minArc = widget.info.minAngle;
            var maxArc = widget.info.maxAngle;
            var minValue = widget.info.minValue;
            var maxValue = widget.info.maxValue;
            var minCoverAngle = widget.info.minCoverAngle;
            var maxCoverAngle = widget.info.maxCoverAngle;

            //var curArc = widget.info.value;

            var curDashboardTagValue = widget.currentValue || 0;
            if (curDashboardTagValue > maxValue) {
                curDashboardTagValue = maxValue;
            } else if (curDashboardTagValue < minValue) {
                curDashboardTagValue = minValue;
            }
            var curArc = (maxArc - minArc) / (maxValue - minValue) * (curDashboardTagValue - minValue);

            var clockwise = widget.info.clockwise;// == '1' ? 1 : -1;
            var pointerLength = widget.info.pointerLength;
            var pointerWidth, pointerHeight;
            //pointerWidth = pointerLength / Math.sqrt(2);
            //pointerHeight = pointerLength / Math.sqrt(2);
            pointerWidth = widget.info.pointerImgWidth;
            pointerHeight = widget.info.pointerImgHeight;


            //console.log('curDashboardTagValue',curDashboardTagValue,'curArc',curArc);
            //if (curArc > maxArc) {
            //    curArc = maxArc;
            //} else if (curArc < minArc) {
            //    curArc = minArc;
            //}
            minCoverAngle = minCoverAngle * Math.PI / 180 + Math.PI / 2;
            maxCoverAngle = maxCoverAngle * Math.PI / 180 + Math.PI / 2;
            // console.log(curArc,widget.oldValue);
            var arcPhase = 45;
            if (clockwise != '2') {
                clockwise = clockwise == '1' ? 1 : -1;
                if (widget.dashboardModeId == '0') {
                    //simple mode
                    //background
                    var bgTex = widget.texList[0].slices[0];
                    if (widget.backgroundModeId === '0') {
                        this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                    }
                    //draw pointer
                    this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, clockwise * (curArc + offset + minArc) + arcPhase, widget.texList[1].slices[0], null, null, null, minCoverAngle, maxCoverAngle,ctx,true,this.pixelRatio);
                    //draw circle
                    // var circleTex = widget.texList[2].slices[0]
                    // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)
                } else if (widget.dashboardModeId == '1') {
                    // complex mode
                    //background
                    var bgTex = widget.texList[0].slices[0];
                    if (widget.backgroundModeId === '0') {
                        this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                    }
                    //draw light strip
                    var lightStripTex = widget.texList[2].slices[0];
                    this.drawLightStrip(curX, curY, width, height, clockwise * (minArc + offset) + 90, clockwise * (curArc + offset + minArc) + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId,ctx);
                    //draw pointer
                    this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, clockwise * (curArc + offset+minArc) + arcPhase, widget.texList[1].slices[0], null, null, null, minCoverAngle, maxCoverAngle,ctx,true,this.pixelRatio);

                    //draw circle
                    // var circleTex = widget.texList[3].slices[0]
                    // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)
                } else if (widget.dashboardModeId == '2') {
                    var lightStripTex = widget.texList[0].slices[0];
                    this.drawLightStrip(curX, curY, width, height, clockwise * (minArc + offset) + 90, clockwise * (curArc + offset) + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId,ctx);
                }
            } else {
                if (widget.dashboardModeId == '0') {
                    //simple mode
                    //background
                    var bgTex = widget.texList[0].slices[0];
                    if (widget.backgroundModeId === '0') {
                        this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                    }
                    //draw pointer
                    this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], null, null, null, minCoverAngle, maxCoverAngle,ctx,true,this.pixelRatio);
                    //draw circle
                    // var circleTex = widget.texList[2].slices[0]
                    // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)
                } else if (widget.dashboardModeId == '1') {
                    // complex mode
                    //background
                    if (curArc >= 0) {
                        var bgTex = widget.texList[0].slices[0];
                        if (widget.backgroundModeId === '0') {
                            this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                        }
                        //draw light strip
                        var lightStripTex = widget.texList[2].slices[0];
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId,ctx);
                        //draw pointer

                        this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], null, null, null, minCoverAngle, maxCoverAngle,ctx,true,this.pixelRatio);
                    } else if (curArc < 0) {
                        var bgTex = widget.texList[0].slices[0];
                        if (widget.backgroundModeId === '0') {
                            this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                        }
                        //draw light strip
                        var lightStripTex = widget.texList[2].slices[0];
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId, curArc,ctx);
                        //draw pointer
                        this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], null, null, null, minCoverAngle, maxCoverAngle,ctx,true,this.pixelRatio);
                    }
                } else if (widget.dashboardModeId == '2') {
                    var lightStripTex = widget.texList[0].slices[0];
                    if (curArc >= 0) {
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId,ctx);
                    } else if (curArc < 0) {
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId, curArc,ctx);
                    }
                }
            }


            cb && cb()

        }
    },
    drawRotateImg: function (curX, curY, widget, options,cb,ctx) {
        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var minArc = widget.info.minValue;
        var maxArc = widget.info.maxValue;
        var curArc = this.getValueByTagName(widget.tag, 0) % 360;
        if (curArc > maxArc) {
            curArc = maxArc
        } else if (curArc < minArc) {
            curArc = minArc;
        }
        widget.curArc = curArc;
        this.handleAlarmAction(curArc, widget, lowAlarm, highAlarm);
        widget.oldValue = curArc;
    },
    paintRotateImg: function (curX, curY, widget, options,cb,ctx) {

        var width = widget.info.width;
        var height = widget.info.height;
        if (widget.texList) {

            //pointer

            var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
            var curArc = widget.curArc;

            this.drawRotateElem(curX, curY, width, height, width, height, curArc + initValue, widget.texList[0].slices[0], -0.5, -0.5, widget.subType,ctx,null,null,false,this.pixelRatio);


        }

        cb && cb();

    },
    drawAlphaImg: function (curX, curY, widget, options, cb) {
        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var curValue = this.getValueByTagName(widget.tag, 0) ;
        if (curValue > maxValue) {
            curValue = maxValue
        } else if (curValue < minValue) {
            curValue = minValue;
        }
        widget.curValue = curValue;
        this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
        widget.oldValue = curValue;
    },
    paintAlphaImg: function (curX, curY, widget, options, cb) {
        var offctx = this.offctx
        var width = widget.info.width;
        var height = widget.info.height;
        if (widget.texList) {

            //pointer

            //var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
            var curValue = widget.curValue||0;
            var maxValue = widget.info.maxValue||0
            var minValue = widget.info.minValue||0


            var curAlpha = Number((curValue-minValue)/(maxValue-minValue))||0
            curAlpha = this.limitValueBetween(curAlpha,0,1)
            offctx.save()
            offctx.globalAlpha = curAlpha
            this.drawBg(curX,curY,width,height,widget.texList[0].slices[0].imgSrc,widget.texList[0].slices[0].color,offctx)
            offctx.restore()

        }

        cb && cb();

    },
    drawOscilloscope: function (curX, curY, widget, options, cb) {
        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var newPoint = false;
        var curValue;
        if (!widget.maxPoints) {
            var maxPoints = Math.floor((width - blankX) / spacing) + 1;
            widget.maxPoints = maxPoints;
            widget.flag = -1;
            widget.curPoints = [];
        }

        if (options && (options.updatedTagName == widget.tag || this.isIn(widget.tag, options.updatedTagNames))) {
            newPoint = true;
            curValue = this.getValueByTagName(widget.tag, 0);
            curValue = this.limitValueBetween(curValue, minValue, maxValue);
            if (widget.flag >= widget.maxPoints - 1) {
                //overflow refresh
                widget.curPoints = [];
                widget.curPoints.push(curValue);
                widget.flag = 0;
            } else {
                widget.curPoints.push(curValue);
                widget.flag += 1;
            }
        }

        //handle action
        if (newPoint) {
            this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
            widget.oldValue = curValue;
        }
    },
    paintOscilloscope: function (curX, curY, widget, options, cb) {
        if (widget.texList) {
            var width = widget.info.width;
            var height = widget.info.height;
            var minValue = widget.info.minValue;
            var maxValue = widget.info.maxValue;


            var spacing = widget.info.spacing;
            var grid = widget.info.grid;
            var lineColor = widget.info.lineColor;
            var lineWidth = widget.info.lineWidth;
            var blankX = widget.info.blankX;
            var blankY = widget.info.blankY;
            var gridInitValue = widget.info.gridInitValue;
            var gridUnitX = widget.info.gridUnitX;
            var gridUnitY = widget.info.gridUnitY;





           //draw bg
            var bgSlice = widget.texList[0].slices[0];
            this.drawBg(curX, curY, width, height, bgSlice.imgSrc, bgSlice.color);

            //draw grid
            if (grid != '0') {
                var gridStyle = {
                    lineWidth: lineWidth,
                    grid: grid,
                    gridInitValue: gridInitValue,
                    gridUnitX: gridUnitX,
                    gridUnitY: gridUnitY
                }
                this.drawGrid(curX, curY, width, height, blankX, blankY, spacing, spacing, gridStyle, minValue);
            }
            //draw points lines

            var coverSlice = widget.texList[1].slices[0];
            this.drawPointsLine(curX, curY, width, height, spacing, widget.curPoints, minValue, maxValue, coverSlice, blankX, blankY, lineColor);


        }

        cb && cb();

    },
    drawPointsLine: function (curX, curY, width, height, spacing, points, minValue, maxValue, bgSlice, blankX, blankY, lineColor) {
        var tranedPoints = points.map(function (point) {
            return 1.0 * (point - minValue) / (maxValue - minValue) * (height - blankY);
        });
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx
        offctx.save();
        offctx.translate(curX, curY);
        //draw bg
        offctx.save();
        offctx.beginPath();
        for (var i = 0; i < tranedPoints.length; i++) {
            if (i === 0) {
                offctx.moveTo(i * spacing + blankX, height - tranedPoints[i] - blankY);
            } else {
                offctx.lineTo(i * spacing + blankX, height - tranedPoints[i] - blankY);
            }
        }
        offctx.lineTo((i - 1) * spacing + blankX, height - blankY);
        offctx.lineTo(blankX, height - blankY);
        offctx.closePath();
        offctx.clip();
        //draw bg
        this.drawBg(0, 0, width, height, bgSlice.imgSrc, bgSlice.color);

        offctx.restore();
        //draw lines
        offctx.beginPath();
        for (var i = 0; i < tranedPoints.length; i++) {
            if (i === 0) {
                offctx.moveTo(i * spacing + blankX, height - tranedPoints[i] - blankY);
            } else {
                offctx.lineTo(i * spacing + blankX, height - tranedPoints[i] - blankY);
            }
        }
        //stroke
        offctx.strokeStyle = lineColor;
        offctx.stroke();
        offctx.restore();
    },
    drawGrid: function (curX, curY, width, height, offsetX, offsetY, gridWidth, gridHeight, gridStyle, minValue) {
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx
        var _offsetX = offsetX % (2 * gridWidth);
        var _offsetY = offsetY % (2 * gridHeight);
        var _gridWidth = gridWidth;
        var _gridHeight = gridHeight;
        var vertGrids = Math.floor((width - _offsetX)/_gridWidth)+1;
        var horiGrids = Math.floor((height - _offsetY)/_gridHeight)+1;
        offctx.save();
        offctx.translate(curX, curY);
        offctx.beginPath();
        //draw verts
        offctx.save();
        offctx.translate(_offsetX, 0);
        if (gridStyle && gridStyle.grid && gridStyle.grid == '1' || gridStyle.grid == '3') {
            offctx.textAlign = 'center';
            offctx.textBaseline = 'top';
            offctx.fillStyle = 'rgba(255,255,255,1)';
            offctx.font = '10px';
            var maxXValue = gridStyle.gridInitValue + (vertGrids - 1) * gridStyle.gridUnitX;
            var q = Math.floor(offctx.measureText(maxXValue).width / (2 * gridWidth / 3)) + 1;
            for (var i = 0; i < vertGrids; i++) {
                var vertX = i * _gridWidth;
                var xValue = gridStyle.gridInitValue + i * gridStyle.gridUnitX;
                offctx.moveTo(vertX, 0);
                offctx.lineTo(vertX, height - _offsetY);
                if (i % q == 0) {
                    offctx.fillText(xValue, vertX, height - _offsetY + 2);
                }
            }
        }
        offctx.restore();
        offctx.save();
        offctx.translate(_offsetX, height - _offsetY);
        if (gridStyle && gridStyle.grid && gridStyle.grid == '1' || gridStyle.grid == '2') {
            for (i = 0; i < horiGrids; i++) {
                var horiY = i * _gridHeight;
                var yValue = minValue + gridStyle.gridInitValue + i * gridStyle.gridUnitY;
                offctx.moveTo(0, -horiY);
                offctx.lineTo(width - _offsetX, -horiY);

                offctx.textAlign = 'right';
                offctx.textBaseline = 'middle';
                offctx.fillStyle = 'rgba(255,255,255,1)';
                offctx.font = '10px';
                offctx.fillText(yValue, 0 - 2, -horiY);
            }
        }
        offctx.restore();
        offctx.lineWidth = (gridStyle && gridStyle.lineWidth) || 1;
        offctx.strokeStyle = (gridStyle && gridStyle.color) || 'lightgrey';
        offctx.stroke();
        offctx.restore();
    },
    drawLightStrip: function (curX, curY, width, height, minArc, curArc, image,clockWise,dashboardModeId,nowArc,ctx) {
        //clip a fan shape
        // console.log(minArc, curArc);
        var wise = false;
        if (clockWise == -1) {
            wise = true;
        }
        if (clockWise == '2' && nowArc < 0) {
            wise = true;
        }
        //var radius = this.calculateRadius(dashboardModeId,width,height);
        var radius = (dashboardModeId == '1' ? Math.sqrt(width * width + height * height) / 2 : Math.max(width, height) / 2);
        if (Math.abs(curArc - minArc) > 360) {
            //no need to clip
            this.drawBg(curX, curY, width, height, image, null,offctx)
        } else {
            var offcanvas = this.refs.offcanvas;
            var offctx = ctx||this.offctx;
            offctx.save();
            offctx.beginPath();
            if (dashboardModeId == '1') {
                offctx.moveTo(curX + 0.5 * width, curY + 0.5 * height);
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);

            } else if (dashboardModeId == '2') {
                offctx.moveTo(curX + 0.5 * width, curY + 0.5 * height);
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius * 3 / 4, Math.PI * curArc / 180, Math.PI * minArc / 180, !wise);
            }
            offctx.closePath();
            offctx.clip();
            this.drawBg(curX, curY, width, height, image, null,offctx);
            offctx.restore();
        }
    },
    calculateRadius: function (mode, width, height) {
        var radius = mode == '1' ? Math.sqrt(width * width + height * height) / 2 : Math.max(width, height) / 2;
        radius = Math.floor(radius);
        return radius;
    },
    handleAlarmAction: function (curValue, widget, lowAlarm, highAlarm) {
        //handle action

        if (curValue <= lowAlarm && widget.oldValue !== undefined && widget.oldValue > lowAlarm) {

            this.handleTargetAction(widget, 'EnterLowAlarm');
        }

        if (curValue > lowAlarm && widget.oldValue !== undefined && widget.oldValue <= lowAlarm) {
            //leave low alarm

            this.handleTargetAction(widget, 'LeaveLowAlarm');

        }
        if (curValue >= highAlarm && widget.oldValue !== undefined && widget.oldValue < highAlarm) {
            //enter high alarm


            this.handleTargetAction(widget, 'EnterHighAlarm');
        }
        if (curValue < highAlarm && widget.oldValue !== undefined && widget.oldValue >= highAlarm) {
            //leave high alarm
            this.handleTargetAction(widget, 'LeaveHighAlarm');
        }
        widget.oldValue = curValue
    },
    shouldHandleAlarmAction: function (curValue, widget, lowAlarm, highAlarm) {
        //handle action
        var alarms = []


        if (curValue <= lowAlarm && widget.oldValue !== undefined && widget.oldValue > lowAlarm) {
            alarms.push('EnterLowAlarm')
        }
        if (curValue > lowAlarm && widget.oldValue !== undefined && widget.oldValue <= lowAlarm) {
            //leave low alarm

            alarms.push('LeaveLowAlarm')

        }
        if (curValue >= highAlarm && widget.oldValue !== undefined && widget.oldValue < highAlarm) {
            //enter high alarm
            alarms.push('EnterHighAlarm')
        }
        if (curValue < highAlarm && widget.oldValue !== undefined && widget.oldValue >= highAlarm) {
            //leave high alarm
            alarms.push('LeaveHighAlarm')
        }
        return alarms
    },
    drawRotateElem: function (x, y, w, h, elemWidth, elemHeight, arc, texSlice, transXratio, transYratio, type, minCoverAngle, maxCoverAngle,ctx,keepSize,verticalPixelScale) {
        var transXratio = transXratio || 0;
        var transYratio = transYratio || 0;
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx
        offctx.save();
        if ((typeof minCoverAngle != 'undefined') && (typeof maxCoverAngle != 'undefined') && (minCoverAngle != maxCoverAngle)) {
            var radius = Math.max(w, h) / 2;
            offctx.beginPath();
            offctx.moveTo(x + w * 0.5, y + h * 0.5);
            offctx.arc(x + w * 0.5, y + h * 0.5, radius, maxCoverAngle, minCoverAngle, false);
            offctx.closePath();
            //offctx.stroke();
            offctx.clip();
        }
        if (!(type && type == 'MyRotateImg')) {
            offctx.beginPath();
            offctx.rect(x, y, w, h);
            offctx.clip();
        }

        offctx.translate(x + 0.5 * w, y + 0.5 * h);
        if(verticalPixelScale){
            offctx.scale(1,1.0/verticalPixelScale)
        }

        offctx.rotate(Math.PI * arc / 180);
        offctx.translate(transXratio * elemWidth, transYratio * elemHeight);


        //draw color
        offctx.fillStyle = texSlice.color;
        offctx.fillRect(0,0,elemWidth,elemHeight);

        var image = this.getImageName(texSlice.imgSrc);
        if (image && image != '') {
            var imageList = this.state.imageList;
            for (var i = 0; i < imageList.length; i++) {
                if (imageList[i].id == image) {
                    var imgElement=imageList[i].content;
                    // offctx.drawImage(imageList[i].content,0,0,w,h,x,y,w,h);
                    if(keepSize){
                        offctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
                    }else{
                        offctx.drawImage(imageList[i].content,x,y,w,h)
                    }
                    break;
                }
            }

        }
        offctx.restore();
    },
    drawBg: function (x, y, w, h, imageName, color, ctx) {
        this.drawBgColor(x, y, w, h, color, ctx);
        this.drawBgImg(x, y, w, h, imageName, ctx);
    },
    drawBgColor: function (x, y, w, h, color, ctx) {
        var offcanvas, offctx;
        if (!ctx) {
            offcanvas = this.refs.offcanvas;
            offctx = offcanvas.getContext('2d');
        } else {
            offctx = ctx;
        }

        //console.log(color);
        if (color && color != '') {
            offctx.save();
            offctx.fillStyle = color;
            offctx.fillRect(x, y, w, h);
            offctx.restore();
        }

    },
    drawBgImg: function (x, y, w, h, imageName, ctx) {
        //console.log('x: '+x+' y: '+y+' w: '+w+' h: '+h);
        var imageName = this.getImageName(imageName);
        var offcanvas, offctx;
        if (!ctx) {
            offcanvas = this.refs.offcanvas;
            offctx = offcanvas.getContext('2d');
        } else {
            offctx = ctx;
        }
        var imageList = this.state.imageList;
        for (var i = 0; i < imageList.length; i++) {
            if (imageList[i].id == imageName) {
                // offctx.drawImage(imageList[i].content,0,0,w,h,x,y,w,h);
                offctx.drawImage(imageList[i].content, x, y, w, h);
                break;
            }
        }
        ;
    },
    getImageName: function (imageName) {
        if (imageName && (typeof imageName === 'string')) {
            var names = imageName.split(sep)
            return names[names.length - 1]
        } else {
            return ''
        }

    },
    getImage: function (imageName) {
        var name = this.getImageName(imageName)
        var imageList = this.state.imageList || []
        for (var i = 0; i < imageList.length; i++) {
            if (imageList[i].id == name) {
                return imageList[i]
            }
        }
        return null
    },
    inRect: function (x, y, target, type) {
        // console.log(x, y, target, type);
        //additional condition for transformation
        var realPoint = {
            x: x,
            y: y
        }

        if (type && type == 'widget') {
            // if (target.translate || target.scale){
            //   realPoint =  this.recoverTargetPointFromTransformation({x:x,y:y},{x:target.info.left,y:target.info.top},target.translate,target.scale);
            // }
            // x = realPoint.x;
            // y = realPoint.y;
            if (x >= target.info.left && x <= (target.info.left + target.info.width) && y >= target.info.top && y <= (target.info.top + target.info.height)) {
                return true;
            } else {
                return false;
            }
        } else {
            // ealPoint.y;
            if (x >= target.x && x <= (target.x + target.w) && y >= target.y && y <= (target.y + target.h)) {
                return true;
            } else {
                return false;
            }
        }

    },
    transformTargetPoint: function (targetPoint, basePoint, translate, scale) {
        var dstPoint = {
            x: 0,
            y: 0
        }
        dstPoint.x = (targetPoint.x - basePoint.x) * scale.w + basePoint.x + translate.x;
        dstPoint.y = (targetPoint.y - basePoint.y) * scale.h + basePoint.y + translate.y;
        return dstPoint;
    },
    recoverTargetPointFromTransformation: function (dstPoint, basePoint, translate, scale) {
        if (!translate) {
            translate = {
                x: 0,
                y: 0
            }
        }
        if (!scale) {
            scale = {
                w: 1.0,
                h: 1.0
            }
        }
        if (scale && (scale.w === 0 || scale.h === 0)) {
            return {
                x: 0,
                y: 0
            }
        }
        return {
            x: (dstPoint.x - translate.x - basePoint.x) / scale.w + basePoint.x,
            y: (dstPoint.y - translate.y - basePoint.y) / scale.h + basePoint.y
        }
    },
    inRawRect: function (x, y, offsetX, offsetY, width, height) {
        if (x >= offsetX && x <= offsetX + width && y >= offsetY && y <= offsetY + height) {
            return true;
        } else {
            return false;
        }
    },
    invertPointFromTransform: function (point, basePoint, transform) {
        var transformMatrix = [
            [transform.a, transform.c, transform.e],
            [transform.b, transform.d, transform.f],
            [0, 0, 1]
        ];
        var translateMatrix = [
            [1, 0, -basePoint.x],
            [0, 1, -basePoint.y],
            [0, 0, 1]
        ]
        // var combinedMatrix = math.multiply(math.inv(transformMatrix),translateMatrix);
        var combinedMatrix = math.inv(transformMatrix);
        var realPoint = math.multiply(combinedMatrix, [point.x, point.y, 1]);
        return {
            x: realPoint[0],
            y: realPoint[1]
        }

    },
    findClickTargets: function (x, y) {
        var project = this.state.project;
        var targets = [];
        if (project.pageList && project.pageList.length) {
            var page = project.pageList[this.state.curPageIdx];
            if (page) {
                targets.push(page);
                //if canvas clicked
                var canvases = [];
                // console.log(page.canvasList);
                if (page.canvasList && page.canvasList.length) {
                    var canvasList = page.canvasList;
                    canvasList.sort(this.compareZIndex);
                    // console.log(canvasList);

                    for (var i = canvasList.length - 1; i >= 0; i--) {
                        // console.log(canvasList[i]);
                        var curCanvasRealPoint = {x: x, y: y};
                        // if (canvasList[i].translate || canvasList[i].scale){
                        //     curCanvasRealPoint=this.recoverTargetPointFromTransformation({x:x,y:y},{x:canvasList[i].x,y:canvasList[i].y},canvasList[i].translate,canvasList[i].scale);
                        // }
                        if (canvasList[i].transform) {
                            curCanvasRealPoint = this.invertPointFromTransform({x: x, y: y}, {
                                x: canvasList[i].x,
                                y: canvasList[i].y
                            }, canvasList[i].transform);
                        }
                        // this.recoverTargetPointFromTransformation({x:x,y:y},{x:canvasList[i].x,y:canvasList[i].y},canvasList[i].translate,canvasList[i].scale);
                        if (this.inRect(curCanvasRealPoint.x, curCanvasRealPoint.y, canvasList[i])) {
                            // console.log('inrect');
                            canvasList[i].innerX = curCanvasRealPoint.x;
                            canvasList[i].innerY = curCanvasRealPoint.y;
                            targets.push(canvasList[i]);
                            canvases.push(canvasList[i]);
                        }
                    }

                }

                if (canvases.length === 0) {
                    return targets;
                }

                //if widget clicked
                for (var j = 0; j < canvases.length; j++) {
                    var subCanvas = '';
                    curCanvasRealPoint = {
                        x: x,
                        y: y
                    }
                    var canvas = canvases[j];
                    // if (canvas.translate || canvas.scale){
                    //     curCanvasRealPoint = this.recoverTargetPointFromTransformation({x:x,y:y},{x:canvas.x,y:canvas.y},canvas.translate,canvas.scale);
                    // }
                    if (canvas.transform) {
                        curCanvasRealPoint = this.invertPointFromTransform({x: x, y: y}, {
                            x: canvas.x,
                            y: canvas.y
                        }, canvas.transform);
                    }
                    //canvas.subCanvasList[canvas.curSubCanvasIdx];
                    if (canvas.subCanvasList && canvas.subCanvasList.length) {
                        subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx];
                        if (subCanvas.widgetList && subCanvas.widgetList.length) {
                            var widgetList = subCanvas.widgetList;
                            widgetList.sort(this.compareZIndex);
                            var curWidgetRealPoint = {
                                x:curCanvasRealPoint.x-canvas.x-(subCanvas.contentOffsetX||0),
                                y:curCanvasRealPoint.y-canvas.y-(subCanvas.contentOffsetY||0)
                            }

                            for (var i = widgetList.length - 1; i >= 0; i--) {
                                var widget = widgetList[i];
                                // if (widget.translate || widget.scale){
                                //
                                //
                                //     curWidgetRealPoint = this.recoverTargetPointFromTransformation({x:curWidgetRealPoint.x,y:curWidgetRealPoint.y},{x:widget.info.left,y:widget.info.top},widget.translate,widget.scale);
                                // }
                                if (widget.transform) {
                                    curWidgetRealPoint = this.invertPointFromTransform({
                                        x: curWidgetRealPoint.x,
                                        y: curWidgetRealPoint.y
                                    }, {x: widget.info.left, y: widget.info.top}, widget.transform);
                                }
                                if (this.inRect(curWidgetRealPoint.x, curWidgetRealPoint.y, widget, 'widget')) {
                                    // console.log(_.cloneDeep(widget),_.cloneDeep(canvas))
                                    widget.innerX = curWidgetRealPoint.x-widget.info.left;
                                    widget.innerY = curWidgetRealPoint.y-widget.info.top;
                                    targets.push(widget);
                                    //handle widget like buttongroup
                                    // console.log('inner rect',x-canvas.x,y-canvas.y,canvas);
                                    this.handleInnerClickedElement(widget, curWidgetRealPoint.x, curWidgetRealPoint.y);
                                }
                            }
                        }
                    }
                }


                return targets;
            }
        }
        return targets;


    },
    handleInnerClickedElement: function (widget, x, y) {
        var left = widget.info.left;
        var top = widget.info.top;
        var width = widget.info.width;
        var height = widget.info.height;
        switch (widget.subType) {
            case 'MyButtonGroup':
                var interval = widget.info.interval;
                var count = widget.info.count;
                if (widget.info.arrange == 'horizontal') {
                    var singleWidth = (width - interval * (count - 1)) / count;
                    for (var i = 0; i < count; i++) {
                        if (x >= left + i * (singleWidth + interval) && x <= left + i * (singleWidth + interval) + singleWidth) {
                            widget.curButtonIdx = i + 1;
                            break;
                        }
                    }
                } else {

                    var singleHeight = (height - interval * (count - 1)) / count;
                    for (var i = 0; i < count; i++) {
                        if (y >= top + i * (singleHeight + interval) && y <= top + i * (singleHeight + interval) + singleHeight) {
                            widget.curButtonIdx = i + 1;
                            break;
                        }
                    }
                }
                break;
            case 'MySlideBlock':

                x = x - left;
                y = y - top;
                //console.log('relative rect',x,y)
                this.handleSlideBlockInnerPress(widget, x, y);

                break;
            case 'MyInputKeyboard':
                //relative pos
                var keys = widget.info.keys;
                var curKey;
                for (var i = 0; i < keys.length; i++) {
                    curKey = keys[i];
                    if (this.inRawRect(x, y, curKey.x, curKey.y, curKey.width, curKey.height)) {
                        //hit
                        widget.curPressedKey = curKey;
                        this.handleInputKeyboardKeyPressed(curKey, widget);
                        break;
                    }
                }
                x = x - left;
                y = y - top;
                break;
        }
    },
    handleInputKeyboardKeyPressed: function (curKey, widget) {
        var project = this.state.project;
        switch (curKey.value) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (widget.curValue == '0') {
                    widget.curValue = curKey.value;
                } else {
                    if (widget.curValue[0] === '-') {
                        // -
                        if (widget.curValue.length < 10) {
                            widget.curValue += curKey.value;
                        }
                    } else {
                        // +
                        if (widget.curValue.length < 9) {
                            widget.curValue += curKey.value;
                        }
                    }
                }
                break;
            case 'back':
                if (widget.curValue.length === 1) {
                    widget.curValue = '0';
                } else if (widget.curValue.length === 2 && widget.curValue[0] === '-') {
                    widget.curValue = '0';
                } else {
                    widget.curValue = widget.curValue.slice(0, -1);
                }
                break;
            case 'pm':
                if (widget.curValue[0] === '-') {
                    widget.curValue = widget.curValue.slice(1, widget.curValue.length);
                } else {
                    widget.curValue = '-' + widget.curValue;
                }
                break;
            case 'esc':
                this.setTagByName(project.tag, widget.returnPageId);
                this.draw(null, {
                    updatedTagName: project.tag
                });
                break;
            case 'enter':
                this.setTagByName(widget.targetTag, Number(widget.curValue));
                this.draw(null, {
                    updatedTagName: widget.targetTag
                });
                this.setTagByName(project.tag, widget.returnPageId);
                this.draw(null, {
                    updatedTagName: project.tag
                });
                break;
        }
    },
    handleSlideBlockInnerPress: function (widget, x, y) {
        var left = widget.info.left;
        var top = widget.info.top;
        var width = widget.info.width;
        var height = widget.info.height;
        var hori = widget.info.arrange == 'horizontal';
        if (!widget.slideSize) {

            var defaultSize = hori ? height : width;
            widget.slideSize = this.getImageSize(widget.texList[1].slices[0].imgSrc, defaultSize, defaultSize);

        }

        var curValue = 0;
        var bgRange;
        if (hori) {
            bgRange = (width - widget.slideSize.w) || 1;
            curValue = (x - 0.5 * widget.slideSize.w) / bgRange * (widget.info.maxValue - widget.info.minValue) + widget.info.minValue;
            // console.log(curValue,x)
        } else {
            bgRange = (height - widget.slideSize.h) || 1;
            curValue = (height - y - 0.5 * widget.slideSize.h) / bgRange * (widget.info.maxValue - widget.info.minValue) + widget.info.minValue;
        }
        curValue = parseInt(curValue);
        curValue = this.limitValueBetween(curValue, widget.info.minValue, widget.info.maxValue);
        widget.curValue = curValue;
        // console.log(curValue,widget.info);
    },
    handlePress: function (e) {
        // console.log(e);
        // console.log(e.target.scrollLeft,e.targetTag.scrollTop);
        var relativeRect = this.getRelativeRect(e);
        var x = relativeRect.x;
        var y = relativeRect.y;
        this.mouseState.state = 'press';
        this.mouseState.position.x = x;
        this.mouseState.position.y = y;
        this.mouseState.timeStamp = Date.now()
        this.mouseState.pressedPosition = {
            x:x,
            y:y
        }

        var targets = this.findClickTargets(x, y);
        this.state.currentPressedTargets = targets;
        // console.log(targets);
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].type == 'widget') {
                this.handleWidgetPress(targets[i], _.cloneDeep(this.mouseState));
                this.handleTargetAction(targets[i], 'Press');

            }else if (targets[i].type == 'MyLayer'){
                this.handleCanvasPress(targets[i],_.cloneDeep(this.mouseState))
            }
        }

    },
    handleOk: function (type) {
        var page = this.state.project.pageList[this.state.curPageIdx];
        // if (page && page.linkedWidgets && page.curHighlightIdx != undefined) {
        //     //has highlight
        //     var curLinkWidget = page.linkedWidgets[page.curHighlightIdx];
        //     switch (curLinkWidget.type) {
        //         case 'MyButtonGroup':
        //             curLinkWidget.target.curButtonIdx = curLinkWidget.value + 1;
        //             break;
        //         case 'MyDateTime':

        //             if (type === 'release'){

        //                 if (this.simState.inModifingState){
        //                     this.simState.inModifingState = false;
        //                 }else{
        //                     this.simState.inModifingState = true;
        //                 }
        //             }
        //             break;
        //     }

        //     this.mouseState.position.x = 0;
        //     this.mouseState.position.y = 0;
        //     if (type === 'press') {
        //         this.mouseState.state = 'press';
        //         this.handleWidgetPress(curLinkWidget.target, _.cloneDeep(this.mouseState));
        //         this.handleTargetAction(curLinkWidget.target, 'Press');
        //     } else if (type === 'release') {
        //         this.mouseState.state = 'release';
        //         this.handleElementRelease(curLinkWidget.target, _.cloneDeep(this.mouseState));
        //         this.handleTargetAction(curLinkWidget.target, 'Release');
        //     }
        // }

        if (page && page.linkedAllWidgets && page.linkedAllWidgets.length && page.curHighlightIdx != undefined) {
            var curLinkWidget = page.linkedAllWidgets[page.curHighlightIdx].target
            if (type=='press') {
                // this.interpretGeneralCommand(curLinkWidget,'onMouseDown')
            }else{
                this.interpretGeneralCommand(curLinkWidget,'onKeyBoardOK')
                this.draw(null)
                // this.interpretGeneralCommand(curLinkWidget,'onMouseUp')
            }

        }
    },
    handleModifyHighlightingWidget: function (widget, direction) {
        switch (widget.subType) {
            case 'MyDateTime':
            case 'MyTexTime':

                if (direction == 'right') {
                    direction = 1;
                } else {
                    direction = -1;
                }
                //handle time modifing
                var curDate = new Date();
                var curOffset = 0;
                var curWidgetDate = new Date(curDate.getTime() + (widget.timeOffset || 0)); // cur displaying time
                var oldWidgetDateStr = curWidgetDate.toString();
                var oldWidgetDateTime = curWidgetDate.getTime();
                // console.log(curWidgetDate,oldWidgetDateStr);
                //changed to time
                var changedDateTypes = ['year', 'month', 'day', 'hour', 'minute', 'second'];
                var changedType;
                if (widget.info.dateTimeModeId == '0') {
                    changedType = changedDateTypes[widget.highlightValue + 3];
                } else if (widget.info.dateTimeModeId == '1') {
                    changedType = changedDateTypes[widget.highlightValue + 3];
                } else {
                    changedType = changedDateTypes[widget.highlightValue];
                }
                if (widget.info.RTCModeId == '0') {
                    switch (changedType) {
                        case 'year':
                            curWidgetDate.setFullYear(curWidgetDate.getFullYear() + direction);

                            break;
                        case 'month':
                            curWidgetDate.setMonth(curWidgetDate.getMonth() + direction);

                            break;
                        case 'day':
                            curWidgetDate.setDate(curWidgetDate.getDate() + direction);

                            break;
                        case 'hour':
                            curWidgetDate.setHours(curWidgetDate.getHours() + direction);

                            break;
                        case 'minute':
                            curWidgetDate.setMinutes(curWidgetDate.getMinutes() + direction);

                            break;
                        case 'second':
                            curWidgetDate.setSeconds(curWidgetDate.getSeconds() + direction);

                            break;
                    }
                    curOffset = curWidgetDate.getTime() - oldWidgetDateTime;
                    // console.log(curWidgetDate,oldWidgetDateStr,curOffset);
                    widget.timeOffset = widget.timeOffset || 0;
                    widget.timeOffset += curOffset;
                } else {
                    var ymd = this.findTagByName('时钟变量年月日');
                    var hms = this.findTagByName('时钟变量时分秒');
                    var ymdValue;
                    var hmsValue;
                    var monthValue;
                    var yearValue;
                    switch (changedType) {
                        case 'year':
                            ymdValue = Number(ymd.value) + 10000 * direction;
                            ymd.value = ymdValue.toString();
                            break;
                        case 'month':
                            ymdValue = Number(ymd.value) + 100 * direction;
                            if (parseInt(ymdValue % 10000 / 100) > 12) ymdValue = ymdValue + (10000 - 1200) * parseInt(parseInt(ymdValue % 10000 / 100) / 12);
                            if (parseInt(ymdValue % 10000 / 100) === 0) ymdValue = ymdValue + (1200 - 10000);
                            ymd.value = ymdValue.toString();
                            break;
                        case 'day':
                            ymdValue = Number(ymd.value) + 1 * direction;
                            monthValue = parseInt(ymdValue % 10000 / 100) % 12;
                            switch (monthValue) {
                                case 0:
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                    if (ymdValue % 100 > 31) ymdValue = ymdValue + (100 - 31) * parseInt(ymdValue % 100 / 31);
                                    if (ymdValue % 100 === 0) ymdValue = ymdValue + (31 - 100);
                                    break;
                                case 4:
                                case 6:
                                case 9:
                                case 11:
                                    if (ymdValue % 100 >= 30) ymdValue = ymdValue + (100 - 30) * parseInt(ymdValue % 100 / 30);
                                    if (ymdValue % 100 === 0) ymdValue = ymdValue + (30 - 100);
                                    break;
                                case 2:
                                    yearValue = parseInt(ymdValue / 10000);
                                    if (yearValue % 4 === 0) {
                                        if (ymdValue % 100 >= 29) ymdValue = ymdValue + (100 - 29) * parseInt(ymdValue % 100 / 29);
                                        if (ymdValue % 100 === 0) ymdValue = ymdValue + (29 - 100);
                                    } else {
                                        if (ymdValue % 100 >= 28) ymdValue = ymdValue + (100 - 28) * parseInt(ymdValue % 100 / 28);
                                        if (ymdValue % 100 === 0) ymdValue = ymdValue + (28 - 100);
                                    }
                                    break;
                                default:
                                    console.log("error!");
                            }
                            ymd.value = ymdValue.toString();
                            break;
                        case 'hour':
                            hmsValue = Number(hms.value) + 10000 * direction;
                            // if(parseInt(hmsValue%1000000/10000)==99){
                            //     hmsValue=hmsValue-760000;
                            // }
                            // if(parseInt(hmsValue%1000000/10000)>=24)hmsValue=hmsValue-240000;
                            hms.value = hmsValue.toString();
                            break;
                        case 'minute':
                            hmsValue = Number(hms.value) + 100 * direction;
                            if (parseInt(hmsValue % 10000 / 100) == 99) {
                                hmsValue = hmsValue - 4000;
                            } else {
                                if (parseInt(hmsValue % 10000 / 100) >= 60) hmsValue = hmsValue - 6000 + 10000;
                            }
                            hms.value = hmsValue.toString();
                            break;
                        case 'second':
                            hmsValue = Number(hms.value) + 1 * direction;
                            if (hmsValue % 100 == 99) {
                                hmsValue = hmsValue - 40;
                            } else {
                                if (hmsValue % 100 >= 60) hmsValue = hmsValue - 60 + 100;
                            }
                            hms.value = hmsValue.toString();
                            break;
                    }
                }
                console.log("parseInt(this.getValueByTagName('时钟变量年月日',0))", parseInt(this.getValueByTagName('时钟变量年月日', 0)))
                this.draw();
                break;
        }
    },
    handleMoveNext: function (direction) {
        var page = this.state.project.pageList[this.state.curPageIdx];
        var curDirection;
        if (direction === 'left') {
            curDirection = 'left';
        } else {
            curDirection = 'right';
        }
        console.log(curDirection)
        // console.log(page);
        /*old logic
        if (this.simState.inModifingState){
            //handle modifing highlighted widget
            if (page && page.linkedWidgets) {
                var targetWidget = page.linkedWidgets[page.curHighlightIdx].target;
                this.handleModifyHighlightingWidget(targetWidget, direction);
            }
        } else {
            if (page && page.linkedWidgets && page.linkedWidgets.length) {
                if (page.curHighlightIdx === undefined) {
                    page.curHighlightIdx = 0;
                } else {
                    page.linkedWidgets[page.curHighlightIdx].target.highlight = false;
                    if (curDirection === 'right') {
                        page.curHighlightIdx = (page.curHighlightIdx + 1);
                        if (page.curHighlightIdx >= page.linkedWidgets.length) {
                            page.curHighlightIdx = page.linkedWidgets.length - 1;
                        }
                    } else {
                        page.curHighlightIdx = (page.curHighlightIdx - 1);
                        if (page.curHighlightIdx < 0) {
                            page.curHighlightIdx = 0;
                        }
                    }


                }
                page.linkedWidgets[page.curHighlightIdx].target.highlight = true;
                page.linkedWidgets[page.curHighlightIdx].target.highlightValue = page.linkedWidgets[page.curHighlightIdx].value;
                // console.log('highlighting',page);
                this.draw();


            }
        }
        */
        //prepare highLightNum
        var lastWidget
        var curWidget
        if (this.inModifing){
            //handle modifing highlighted widget
            if (page && page.linkedAllWidgets){
                curWidget = page.linkedAllWidgets[page.curHighlightIdx].target;
                if (curDirection=='right') {
                    this.interpretGeneralCommand(curWidget,'onKeyBoardRight')
                }else{
                    this.interpretGeneralCommand(curWidget,'onKeyBoardLeft')
                }
            }
        }else{
            if (page && page.linkedAllWidgets && page.linkedAllWidgets.length) {
                if (page.curHighlightIdx === undefined) {
                    page.curHighlightIdx = 0;
                    curWidget = page.linkedAllWidgets[page.curHighlightIdx].target
                    curWidget.highLightNum = 1;
                    // this.interpretGeneralCommand(curWidget,'onKeyboard')
                    if (curDirection=='right') {
                        this.interpretGeneralCommand(curWidget,'onKeyBoardRight')
                    }else{
                        this.interpretGeneralCommand(curWidget,'onKeyBoardLeft')
                    }
                } else {
                    lastWidget = page.linkedAllWidgets[page.curHighlightIdx].target

                    if (curDirection === 'right') {


                        if (page.curHighlightIdx+1 >= page.linkedAllWidgets.length) {

                        }else{
                            page.curHighlightIdx+=1
                            curWidget = page.linkedAllWidgets[page.curHighlightIdx].target
                            if (curWidget == lastWidget) {
                                curWidget.highLightNum+=1
                                this.interpretGeneralCommand(curWidget,'onKeyBoardRight')
                            }else{
                                lastWidget.highLightNum = 0
                                curWidget.highLightNum = 1
                                this.interpretGeneralCommand(lastWidget,'onKeyBoardRight')
                                this.interpretGeneralCommand(curWidget,'onKeyBoardRight')
                            }
                        }

                    } else {
                        if (page.curHighlightIdx-1 <0) {

                        }else{
                            page.curHighlightIdx-=1
                            curWidget = page.linkedAllWidgets[page.curHighlightIdx].target
                            if (curWidget == lastWidget) {
                                curWidget.highLightNum-=1
                                this.interpretGeneralCommand(curWidget,'onKeyBoardLeft')
                            }else{
                                lastWidget.highLightNum=0
                                curWidget.highLightNum = curWidget.maxHighLightNum
                                this.interpretGeneralCommand(lastWidget,'onKeyBoardLeft')
                                this.interpretGeneralCommand(curWidget,'onKeyBoardLeft')
                            }
                        }

                    }


                }



            }
        }
        this.draw()



    },
    handleWidgetKeyboardMove:function (linkedAllWidgets,i,next,minus) {
    },
    getRelativeRect: function (e) {
        var originalW = e.target.width;
        var originalH = e.target.height;

        var clientRect = e.target.getBoundingClientRect()
        var ratioW = originalW / clientRect.width;
        var ratioH = originalH / clientRect.height;
        var x = Math.round(e.clientX - clientRect.left);
        var y = Math.round(e.clientY - clientRect.top);var originalW = e.target.width;
        var originalH = e.target.height;

        var clientRect = e.target.getBoundingClientRect()
        var ratioW = originalW / clientRect.width;
        var ratioH = originalH / clientRect.height;
        var x = Math.round(e.clientX - clientRect.left);
        var y = Math.round(e.clientY - clientRect.top);
        if (ratioW && ratioH) {
            x = x * ratioW
            y = y * ratioH
        }
        //pixelRatio
        y = y / (this.pixelRatio || 1.0)

        return {
            x: x,
            y: y
        }
    },
    handleMove:function (e) {

        var relativeRect = this.getRelativeRect(e);
        var x = relativeRect.x;
        var y = relativeRect.y;
        if (!this.mouseState) {
            return;
        }

        var lastMouseState = _.cloneDeep(this.mouseState)

        this.mouseState.position.x = x;
        this.mouseState.position.y = y;
        this.mouseState.timeStamp = Date.now()

        var timeD = (this.mouseState.timeStamp - lastMouseState.timeStamp)/1000.0
        this.mouseState.speedX = parseInt((this.mouseState.position.x - lastMouseState.position.x)/timeD) || 0
        this.mouseState.speedY = parseInt((this.mouseState.position.y - lastMouseState.position.y)/timeD) || 0

        if (this.mouseState.state === 'press' || this.mouseState.state === 'dragging') {
            this.mouseState.state = 'dragging';
            // console.log('dragging',_.cloneDeep(this.mouseState),lastMouseState)
            this.handleDragging(_.cloneDeep(this.mouseState),lastMouseState);
        }else{
            this.mouseState.state = 'move';

        }
    },
    handleHolding: function () {

    },
    handleDragging:function (mouseState,lastMouseState) {
        var targets = this.state.currentPressedTargets;

        var workTarget = targets[targets.length-1]
        if(workTarget.type == 'widget'){
            this.handleWidgetDrag(workTarget, mouseState);
            this.handleTargetAction(workTarget, 'drag');
        }else if(workTarget.type == 'MyLayer'){
            this.handleCanvasDrag(workTarget,mouseState,lastMouseState)
        }
    },
    handleCanvasPress:function (canvas,mouseState) {
        var subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx]
        if (subCanvas.scrollXTimerId){
            clearInterval(subCanvas.scrollXTimerId)
        }
        if (subCanvas.scrollYTimerId){
            clearInterval(subCanvas.scrollYTimerId)
        }
        // if (subCanvas.scrollBarHideAnime){
        //     subCanvas.scrollBarHideAnime.stop()
        //     subCanvas.scrollBarHideAnime = null
        //     subCanvas.scrollBarAlpha = 1.0
        //     console.log('cancel anime')
        // }
        if(subCanvas.hideScrollBarTimerId){
            clearTimeout(subCanvas.hideScrollBarTimerId)
        }

        if (subCanvas.swipeXTimerId){
            clearInterval(subCanvas.swipeXTimerId)
        }

        if (subCanvas.swipeYTimerId){
            clearInterval(subCanvas.swipeYTimerId)
        }

        if (subCanvas.swipeAnimation){
            subCanvas.swipeAnimation.stop()
        }
        this.stopBounceAnimation(subCanvas,'bounceAnimeX','bounceAnimeY')

        subCanvas.pressedOffsetX = subCanvas.contentOffsetX || 0
        subCanvas.pressedOffsetY = subCanvas.contentOffsetY || 0
        //prepare img cache
        this.prepareSubCanvasCaches(canvas)

    },
    prepareSubCanvasCaches:function (canvas) {
        for(var i=0;i<canvas.subCanvasList.length;i++){
            canvas.subCanvasList[i].curSubCanvasImg = this.generateSubCanvasCopy(canvas.subCanvasList[i],canvas.w,canvas.h)
        }
    },

    handleCanvasDrag:function (canvas,mouseState,lastMouseState) {


        // var originalPointX = canvas.innerX || 0
        // var originalPointY = canvas.innerY || 0
        var lastMousePointX = lastMouseState.position.x || 0
        var lastMousePointY = lastMouseState.position.y || 0
        var mousePointX = mouseState.position.x || 0
        var mousePointY = mouseState.position.y || 0
        var offsetX = mousePointX - lastMousePointX
        var offsetY = mousePointY - lastMousePointY
        var pressedPos = mouseState.pressedPosition||{x:0,y:0}

        var subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx]

        //reset scrollbar

        if(subCanvas.hideScrollBarTimerId){
            clearTimeout(subCanvas.hideScrollBarTimerId)
        }

        if (subCanvas.scrollBarHideAnime){
            subCanvas.scrollBarHideAnime.stop()
            subCanvas.scrollBarHideAnime = null
            subCanvas.scrollBarAlpha = 1.0
        }


        if (subCanvas.scrollXTimerId){
            clearInterval(subCanvas.scrollXTimerId)
        }
        if (subCanvas.scrollYTimerId){
            clearInterval(subCanvas.scrollYTimerId)
        }


        this.stopBounceAnimation(subCanvas,'bounceAnimeX','bounceAnimeY')


        subCanvas.width = subCanvas.info && subCanvas.info.width || canvas.w
        subCanvas.height = subCanvas.info && subCanvas.info.height || canvas.h

        //transition
        var curTransition = canvas.transition
        var method = curTransition && curTransition.name
        // method = 'SWIPE_H'


        //scroll

        var leftLimit = canvas.w - subCanvas.width
        var rightLimit = 0
        var topLimit = canvas.h-subCanvas.height
        var bottomLimit = 0

        var mouseMovementX = mousePointX - pressedPos.x
        var mouseMovementY = mousePointY - pressedPos.y

        subCanvas.contentOffsetX =  subCanvas.contentOffsetX || 0
        subCanvas.contentOffsetY  = subCanvas.contentOffsetY || 0
        var lastContentOffsetX = subCanvas.contentOffsetX
        var lastContentOffsetY = subCanvas.contentOffsetY

        var nextContentOffsetX = subCanvas.pressedOffsetX + mouseMovementX
        var nextContentOffsetY = subCanvas.pressedOffsetY + mouseMovementY


        var timeD = (mouseState.timeStamp - lastMouseState.timeStamp)
        timeD = timeD < 1 ? 1:timeD
        timeD = timeD/1000.0



        //horizontal scroll
        if (subCanvas.info &&subCanvas.info.scrollHEnabled){
            // console.log('dragging')

            subCanvas.shouldShowScrollBarH = true
            subCanvas.scrollBarAlpha = 1.0
            if (nextContentOffsetX>rightLimit ){
                // offsetX = this.calMovementWithFaction(offsetX,subCanvas.contentOffsetX-rightLimit,100)
                subCanvas.contentOffsetX = rightLimit+this.calMovementWithFaction(nextContentOffsetX-rightLimit,canvas.w)
                // console.log('rubber banding',subCanvas.contentOffsetX)
            }else if (nextContentOffsetX<leftLimit ){
                subCanvas.contentOffsetX = leftLimit- this.calMovementWithFaction(leftLimit-nextContentOffsetX,canvas.w)
            }else {
                subCanvas.contentOffsetX = nextContentOffsetX
            }

            subCanvas.speedX =  ((subCanvas.contentOffsetX - lastContentOffsetX)/timeD) || 0
        }else{
            //swipe transition
            if (method == 'SWIPE_H'){
                subCanvas.translate = subCanvas.translate||{x:0,y:0}
                subCanvas.translate.x += offsetX
                //rest sc
                this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,true)
                subCanvas.animating = true

                subCanvas.speedX = (offsetX/timeD) || 0
            }
        }


        //vertical scroll
        if (subCanvas.info && subCanvas.info.scrollVEnabled){
            // console.log('dragging')
            subCanvas.shouldShowScrollBarV = true
            subCanvas.scrollBarAlpha = 1.0
            if (nextContentOffsetY>bottomLimit){
                subCanvas.contentOffsetY = bottomLimit+this.calMovementWithFaction(nextContentOffsetY-bottomLimit,canvas.h)
            }else if (nextContentOffsetY<topLimit){
                subCanvas.contentOffsetY = topLimit - this.calMovementWithFaction(topLimit-nextContentOffsetY,canvas.h)
            }else{
                subCanvas.contentOffsetY += offsetY
            }

            subCanvas.speedY = ((subCanvas.contentOffsetY - lastContentOffsetY)/timeD) || 0
        }else{
            if (method == 'SWIPE_V'){
                subCanvas.translate = subCanvas.translate||{x:0,y:0}
                subCanvas.translate.y += offsetY
                //rest sc
                this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,false,true)
                subCanvas.animating = true
                subCanvas.speedX = (offsetY/timeD) || 0
            }
        }








    },
    calMovementWithFaction:function (x,d) {
        var c = 0.55
        return (1.0 - (1.0 / ((x * c / d) + 1.0))) * d

    },
    stopBounceAnimation:function (elem) {
        for(var i=1;i<arguments.length;i++){
            if (elem[arguments[i]]){
                elem[arguments[i]].stop()
                elem[arguments[i]] = null
            }
        }
    },
    startBounceAnimation:function (elem,animation,offset,initialVelocity,zeroPos,onePos,duration,startPos) {
        var self = this
        elem[animation] = new AnimationAPI.SpringAnimation(null,'x',initialVelocity,26,170,{x:zeroPos},{x:onePos},duration,startPos)
        elem[animation].onFrameCB = function () {
            elem[offset] = this.state.curValue.x
            // elem.shouldShowScrollBar = true
            self.addHideScrollBarTimeout(elem)

        }
        elem[animation].start()
    },
    handleWidgetDrag: function (widget, mouseState) {
        var subType = widget.subType;
        var left = widget.info.left;
        var top = widget.info.top;
        var relativeX = mouseState.position.x-widget.parentX-left;
        var relativeY = mouseState.position.y-widget.parentY-top;
        widget.innerX = relativeX
        widget.innerY = relativeY
        var needRedraw = false;
        switch (subType) {
            case 'MySlideBlock':
                this.handleSlideBlockInnerPress(widget, relativeX, relativeY);
                widget.mouseState = mouseState;
                needRedraw = true;
                this.setTagByName(widget.tag, widget.curValue || 0);
                break;
            case 'general':
                this.interpretGeneralCommand(widget,'onMouseMove');
                needRedraw = false;
                break;

        }

        if (needRedraw) {
            this.drawAfterMouseAction(mouseState);
        }
    },
    handleWidgetPress: function (widget, mouseState) {
        var needRedraw = false;
        switch (widget.subType) {
            case 'MyButton':
            case 'MyReturnButton':
                if (widget.buttonModeId == '0') {
                    //normal
                } else if (widget.buttonModeId == '1') {
                    //switch
                    //if (widget.switchState) {
                    //	widget.switchState = !widget.switch
                    //}else{
                    //	widget.switchState = 1;
                    //}
                    //update its tag
                    var targetTag = this.findTagByName(widget.tag);
                    if (targetTag) {
                        targetTag.value = parseInt(targetTag.value);
                        // targetTag.value = targetTag.value > 0 ? 0 : 1;
                        this.setTagByTag(targetTag, (targetTag.value > 0 ? 0 : 1))
                    }

                }
                widget.mouseState = mouseState;
                needRedraw = true;
                break;
            case 'MyButtonGroup':
                //change button tag
                var curButtonIdx = widget.curButtonIdx || 0;
                var targetTag = this.findTagByName(widget.tag);
                if (targetTag && targetTag.name != '') {
                    // targetTag.value = parseInt(curButtonIdx);
                    this.setTagByTag(targetTag, parseInt(curButtonIdx))

                    needRedraw = true;
                }
                break;
            case 'MySlideBlock':
                var targetTag = this.findTagByName(widget.tag);
                if (targetTag && targetTag.name != '') {
                    this.setTagByTag(targetTag, parseInt(widget.curValue));
                }
                widget.mouseState = mouseState;
                needRedraw = true;

                break;
            // case 'MyInputKeyboard':
            case 'general':
                this.interpretGeneralCommand(widget,'onMouseDown');
                needRedraw = false;
                break;

            default:
                widget.mouseState = mouseState;
                needRedraw = true;
        }
        if (needRedraw) {
            this.drawAfterMouseAction(mouseState);
        }
    },
    getImageSize: function (imgName, defaultValueW, defaultValueH) {
        var img = this.getImage(imgName);
        img = (img && img.content) || null;
        if (!!img) {
            // console.log(img,img.width,img.height)
            return {
                w: img.width,
                h: img.height
            }
        } else {
            return {
                w: defaultValueW,
                h: defaultValueH
            }
        }
    },
    handleRelease: function (e) {
        // var x = Math.round(e.pageX - e.target.offsetLeft);
        // var y = Math.round(e.pageY - e.target.offsetTop);
        var x=0
        var y = 0
        var pos = this.getRelativeRect(e) || {x:0,y:0}
        y = pos.y
        x = pos.x
        var lastMouseState = _.cloneDeep(this.mouseState)
        this.mouseState.state = 'release';
        this.mouseState.position.x = x;
        this.mouseState.position.y = y;
        this.mouseState.timeStamp = Date.now()
        this.mouseState.speedX = 0
        this.mouseState.speedY = 0


        // console.log('releasing',_.cloneDeep(this.mouseState),lastMouseState)


        if (lastMouseState.state == 'dragging'){
            this.handleDraggingEnd(_.cloneDeep(this.mouseState),lastMouseState)
        }


        var pressedTargets = this.state.currentPressedTargets;

        for (var i = 0; i < pressedTargets.length; i++) {
            this.handleElementRelease(pressedTargets[i], _.cloneDeep(this.mouseState),lastMouseState);
            this.handleTargetAction(pressedTargets[i], 'Release');
        }
        this.state.currentPressedTargets = []


    },
    handleDraggingEnd:function (mouseState,lastMouseState) {
        var pressedTargets = this.state.currentPressedTargets;
        var canvas = pressedTargets[pressedTargets.length-1]
        if (canvas.type !== 'MyLayer'){
            return
        }

        var subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx]
        var stepX = subCanvas.speedX/(1000/30) ||0
        var stepY = subCanvas.speedY/(1000/30) ||0
        var factor = 2
        var signX  = (stepX>=0)?1:-1
        var signY = (stepY>0)?1:-1
        if ((subCanvas.info&&subCanvas.info.scrollHEnabled) || (subCanvas.info&&subCanvas.info.scrollVEnabled)){
            //canvas scroll effect
            var elem = subCanvas


            // console.log(stepX,stepY)
            elem.scrollXTimerId = setInterval(function () {

                var leftLimit = canvas.w - subCanvas.width
                var rightLimit = 0
                var topLimit = canvas.h-subCanvas.height
                var bottomLimit = 0

                // elem.contentOffsetX =  this.limitValueBetween(elem.contentOffsetX + stepX,canvas.w - subCanvas.width,0)
                // elem.contentOffsetY = this.limitValueBetween(elem.contentOffsetY+stepY,canvas.h - subCanvas.height,0)
                elem.contentOffsetX = elem.contentOffsetX + stepX
                this.addHideScrollBarTimeout(elem)

                var bounceDuration = 2000
                var bounceLimit = 100
                //test x bounce
                if (elem.contentOffsetX>0 ){
                    clearInterval(elem.scrollXTimerId)

                    this.startBounceAnimation(elem,'bounceAnimeX','contentOffsetX',stepX,-bounceLimit,0,bounceDuration,elem.contentOffsetX/bounceLimit + 1)

                }else if (elem.contentOffsetX<canvas.w - subCanvas.width){
                    clearInterval(elem.scrollXTimerId)
                    //left

                    this.startBounceAnimation(elem,'bounceAnimeX','contentOffsetX',stepX,leftLimit-bounceLimit,leftLimit,bounceDuration,(elem.contentOffsetX-leftLimit)/bounceLimit + 1)
                }




                stepX -= factor * signX
                // stepY -= factor * signY
                stepX = (stepX * signX <= 0 ? 0 : stepX)

                if (stepX==0 ){
                    clearInterval(elem.scrollXTimerId)
                }

            }.bind(this),1000/this.fps)


            elem.scrollYTimerId = setInterval(function () {

                var leftLimit = canvas.w - subCanvas.width
                var rightLimit = 0
                var topLimit = canvas.h-subCanvas.height
                var bottomLimit = 0

                // elem.contentOffsetX =  this.limitValueBetween(elem.contentOffsetX + stepX,canvas.w - subCanvas.width,0)
                // elem.contentOffsetY = this.limitValueBetween(elem.contentOffsetY+stepY,canvas.h - subCanvas.height,0)

                elem.contentOffsetY = elem.contentOffsetY + stepY

                this.addHideScrollBarTimeout(elem)

                var bounceDuration = 2000
                var bounceLimit = 100
                //test x bounce


                if (elem.contentOffsetY>0 ){
                    clearInterval(elem.scrollYTimerId)

                    console.log('stepY',stepY,'-bounceLimit',-bounceLimit,'bounceDuration',bounceDuration,'elem.contentOffsetY',elem.contentOffsetY);
                    this.startBounceAnimation(elem,'bounceAnimeY','contentOffsetY',stepY,-bounceLimit,0,bounceDuration,elem.contentOffsetY/bounceLimit + 1)


                }else if (elem.contentOffsetY<canvas.h - subCanvas.height ){
                    clearInterval(elem.scrollYTimerId)
                    //left
                    console.log('stepY',stepY,'-bounceLimit',-bounceLimit,'bounceDuration',bounceDuration,'elem.contentOffsetY',elem.contentOffsetY);

                    this.startBounceAnimation(elem,'bounceAnimeY','contentOffsetY',stepY,topLimit-bounceLimit,topLimit,bounceDuration,(elem.contentOffsetY-topLimit)/bounceLimit + 1)
                }


                // stepX -= factor * signX
                stepY -= factor * signY
                // console.log('stepY',stepY)

                stepY = (stepY * signY) <= 0 ? 0 : stepY
                if (stepY == 0){
                    clearInterval(elem.scrollYTimerId)
                }

            }.bind(this),this.fps)
        }else{
            var method = canvas.transition && canvas.transition.name
            // method = 'SWIPE_H'
            var elem = subCanvas
            switch (method){
                case 'SWIPE_H':
                    elem.stepX = 0

                    elem.swipeXTimerId = setInterval(function () {
                        var curTranslateXABS = math.abs(elem.translate&&elem.translate.x||0)
                        var leftTranslateX = canvas.subCanvasList[0].translate && canvas.subCanvasList[0].translate.x ||0
                        var rightTranslateX = canvas.subCanvasList[canvas.subCanvasList.length-1].translate && canvas.subCanvasList[canvas.subCanvasList.length-1].translate.x ||0
                        if (stepX==0 ||curTranslateXABS>0.5*canvas.w||leftTranslateX>0||rightTranslateX<0){
                            clearInterval(elem.swipeXTimerId)
                            elem.stepX = stepX
                            for(var i=0;i<canvas.subCanvasList.length;i++){
                                canvas.subCanvasList[i].animating = false
                            }
                            var pos = this.findClosetSubCanvas(canvas,'x')
                            var targetTag = this.findTagByName(canvas.tag);
                            if (targetTag) {
                                if (targetTag.value == pos){
                                    this.startSwipeAnimation(canvas,subCanvas)
                                }else{
                                    this.setTagByTag(targetTag, pos)
                                    this.draw(null,{updatedTagName:canvas.tag})
                                }


                            }else{
                                this.startSwipeAnimation(canvas,subCanvas)
                            }


                        }
                        elem.translate.x += stepX

                        this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,true)


                        stepX -= factor * signX
                        // stepY -= factor * signY
                        stepX = (stepX * signX <= 0 ? 0 : stepX)
                        // console.log(stepX)


                    }.bind(this),1000/this.fps)



                    break;
                case 'SWIPE_V':
                    elem.stepY = 0
                    elem.swipeYTimerId = setInterval(function () {
                        var curTranslateYABS = math.abs(elem.translate&&elem.translate.y||0)
                        var leftTranslateY = canvas.subCanvasList[0].translate && canvas.subCanvasList[0].translate.y ||0
                        var rightTranslateY = canvas.subCanvasList[canvas.subCanvasList.length-1].translate && canvas.subCanvasList[canvas.subCanvasList.length-1].translate.y ||0
                        if (stepY==0 ||curTranslateYABS>0.5*canvas.w||leftTranslateY>0||rightTranslateY<0){
                            clearInterval(elem.swipeYTimerId)
                            elem.stepY = stepY
                            for(var i=0;i<canvas.subCanvasList.length;i++){
                                canvas.subCanvasList[i].animating = false
                            }
                            var pos = this.findClosetSubCanvas(canvas,'y')
                            var targetTag = this.findTagByName(canvas.tag);
                            if (targetTag) {
                                if (targetTag.value == pos){
                                    this.startSwipeAnimation(canvas,subCanvas,true)
                                }else{
                                    this.setTagByTag(targetTag, pos)
                                    this.draw(null,{updatedTagName:canvas.tag})
                                }


                            }else{
                                this.startSwipeAnimation(canvas,subCanvas,true)
                            }


                        }
                        elem.translate.y += stepY

                        this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,false,true)


                        // stepX -= factor * signX
                        stepY -= factor * signY
                        stepY = (stepY * signY <= 0 ? 0 : stepY)
                        // console.log(stepX)


                    }.bind(this),1000/this.fps)


                    break;
            }
        }

    },
    startSwipeAnimation:function (canvas,subCanvas,vertical) {
        vertical = !!vertical
        var startX = subCanvas.translate && subCanvas.translate.x || 0
        var startY = subCanvas.translate && subCanvas.translate.y || 0
        if (vertical){
            startX = 0
        }else{
            startY = 0
        }
        var frames = this.fps
        var duration = this.defaultDuration
        var easing = 'linear'

        window.swipingSC = subCanvas


        subCanvas.animating = true
        // subCanvas.swipeAnimationKey = AnimationManager.step(startX,startY,0,0,duration,frames,easing,function (deltas) {
        //     // offctx.save();
        //     // offctx.translate(deltas.curX,deltas.curY);
        //
        //
        //     // if (!newCopyFlag){
        //     //
        //     //     subCanvas.animating = false
        //     //     subCanvas.curSubCanvasImg = this.generateSubCanvasCopy(subCanvas,w,h,options)
        //     //     newCopyFlag = true
        //     // }
        //
        //     subCanvas.animating = true
        //
        //     subCanvas.translate = {
        //         x:deltas.curX,
        //         y:deltas.curY
        //     }
        //
        //     this.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
        //
        //
        // }.bind(this),function () {
        //     // offctx.restore()
        //     for(var i=0;i<canvas.subCanvasList.length;i++){
        //         var curSC = canvas.subCanvasList[i]
        //         // curSC.translate = null
        //         curSC.animating = false
        //     }
        //
        // }.bind(this))

        var springLen

        var swipeAnime
        var self = this
        if (!vertical){
            springLen = canvas.w
            swipeAnime = new AnimationAPI.SpringAnimation(null,'x',subCanvas.stepX*1000/self.fps||0,26,170,{x:-springLen},{x:0},duration,(startX+springLen)/springLen)
            swipeAnime.onFrameCB = function () {
                subCanvas.animating = true

                subCanvas.translate = {
                    x:this.state.curValue.x,
                    y:0
                }
                // console.log(this.state.curValue.x)

                self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
            }
        }else {
            springLen = canvas.h
            swipeAnime = new AnimationAPI.SpringAnimation(null,'y',subCanvas.stepY*1000/self.fps||0,26,170,{y:-springLen},{y:0},duration,(startX+springLen)/springLen)
            swipeAnime.onFrameCB = function () {
                subCanvas.animating = true

                subCanvas.translate = {
                    x:0,
                    y:this.state.curValue.y
                }
                // console.log(this.state.curValue.x)

                self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
            }
        }

        swipeAnime.didStopCB = function () {
            for(var i=0;i<canvas.subCanvasList.length;i++){
                var curSC = canvas.subCanvasList[i]
                // curSC.translate = null
                curSC.animating = false
            }
            // self.draw()
        }
        if (subCanvas.swipeAnimation){
            subCanvas.swipeAnimation.stop()
        }
        subCanvas.swipeAnimation = swipeAnime
        swipeAnime.start()



    },
    findClosetSubCanvas:function (canvas,direction) {
        var min
        var pos = 0
        direction = direction||'x'
        for(var i=0;i<canvas.subCanvasList.length;i++){
            var curSC = canvas.subCanvasList[i]
            var curD = curSC.translate && curSC.translate[direction]
            curD = math.abs(curD)
            if (min === undefined){
                min = curD
                pos = i
            }else{
                if (curD < min){
                    min = curD
                    pos = i
                }
            }
        }
        return pos
    },
    addHideScrollBarTimeout:function (elem) {


        if (elem.scrollBarHideAnime){
            elem.scrollBarHideAnime.stop()
            elem.scrollBarHideAnime = null
            elem.scrollBarAlpha = 1.0

        }

      if(elem.hideScrollBarTimerId){
          clearTimeout(elem.hideScrollBarTimerId)
      }
        // console.log('added ')
      elem.hideScrollBarTimerId = setTimeout(function () {

          this.easeOutScrollBar(elem)
      }.bind(this),100)
    },
    easeOutScrollBar:function (elem) {

        elem.scrollBarHideAnime =  new AnimationAPI.Animation(null,'alpha',1.0,0.0,500)
        elem.scrollBarHideAnime.onFrameCB = function () {
            elem.scrollBarAlpha = this.state.curValue

        }
        // elem.scrollBarHideAnime.timingFunction = AnimationAPI.timingFunctions.easeOutCubic
        elem.scrollBarHideAnime.start()
        if (!window.animes){
            window.animes = []
        }
        window.animes.push(elem.scrollBarHideAnime)
    },
    handleElementRelease: function (elem, mouseState,lastMouseState) {
        var needRedraw = false;
        switch (elem.type) {
            case 'widget':
                switch (elem.subType) {
                    case 'MyButton':
                    case 'MyReturnButton':
                        elem.mouseState = mouseState;
                        needRedraw = true;
                        break;
                    case 'MyInputKeyboard':
                        elem.mouseState = mouseState;
                        elem.curPressedKey = null;
                        needRedraw = true;
                        break;
                    case 'general':
                        this.interpretGeneralCommand(elem,'onMouseUp');
                        needRedraw = false;
                        break;
                }

                break
            case 'MyLayer':

                // elem.lastContentOffsetX = elem.contentOffsetX
                // elem.lastContentOffsetY = elem.contentOffsetY

                break

        }
        if (needRedraw) {
            this.drawAfterMouseAction(mouseState);
        }

    },
    drawAfterMouseAction: function (mouseState) {
        var options = {};
        options.mouseState = _.cloneDeep(mouseState);
        this.draw(null, options);
    },
    getCertainAction: function (action, type) {
        var certainAction = [];
        var flag = 0;
        for (var i = 0; i < action.length; i++) {
            if (flag == 0) {
                if (action[i][0] == 'On' && action[i][1] == type) {
                    flag = 1;
                }
                ;
            } else if (flag == 1) {
                if (action[i][0] == 'On') {
                    flag = 0;
                } else {
                    certainAction.push(action[i]);
                }
            }
        }
        ;
        return certainAction;
    },
    handleTargetAction: function (target, type) {
        if (typeof type == 'string') {
            if (target.actions && target.actions.length) {
                for (var i = 0; i < target.actions.length; i++) {
                    if (target.actions[i].trigger == type) {
                        var curCmds = target.actions[i].commands;
                        //console.log(curCmds)
                        this.processCmds(curCmds);

                    }
                }
            }
        } else if (type instanceof Array) {
            for (var j = 0; j < type.length; j++) {
                this.handleTargetAction(target, type[j])
            }
        }

    },
    findTagByName: function (tag) {
        var tagList = this.state.tagList;
        // console.log(tag,tagList);
        if (tag && tag != "") {

            for (var i = 0; i < tagList.length; i++) {
                if (tagList[i].name == tag) {
                    return tagList[i];
                }
            }
        }

        return null;
    },
    findTagByTag: function (tag) {

        if (tag && tag != "") {
            tag = JSON.parse(tag);


            var tagList = this.state.tagList;
            for (var i = 0; i < tagList.length; i++) {
                if (tagList[i].name == tag.name) {
                    return tagList[i];
                }
            }
            ;
        }

        return null;
    },
    setTagByName: function (name, value) {
        var tag = this.findTagByName(name);
        if (tag) {
            this.setTagByType(tag,value)
            this.setState({tag: tag})
        }
    },
    setTagByType:function (tag,_value) {
        if(tag){
            switch (tag.valueType){
                case 1:
                    //str
                     tag.value = StringConverter.convertStrToUint8Array(_value,tag.encoding||StringConverter.supportedEncodings['utf-8']).slice(0,32)
                    break;
                default:
                    //num
                    tag.value = Number(_value)||0

            }
        }
    },
    getTagTrueValue:function (tag) {
        if(tag){
            switch (tag.valueType){
                case 0:
                    //num
                    return Number(tag.value)||0
                case 1:
                    //str
                    return StringConverter.convertUint8ArrayToStr(tag.value,tag.encoding||StringConverter.supportedEncodings['utf-8'])
                default:
                    console.log('tag type unsupported')
            }
        }
    },
    setTagByTag: function (tag, value) {
        if (tag) {
            this.setTagByType(tag,value)
            this.setState({tag: tag})
        }
    },
    setTagByTagRawValue:function (tag, rawValue) {
        if (tag) {
            tag.value = rawValue
            this.setState({tag: tag})
        }
    },
    timerFlag: function (param) {
        if (param && param.tag) {
            if (param.tag.search(/SysTmr_(\d+)_\w+/) != -1) {
                //get SysTmr
                return parseInt(param.tag.match(/\d+/)[0]);

            }
        }

        return -1;
    },
    processCmds: function (cmds) {
        // for (var i = 0; i < cmds.length; i++) {
        //     this.process(cmds[i]);
        // }
        if (cmds && cmds.length) {
            // console.log(cmds);
            this.process(cmds, 0);
        }

    },
    getParamValue: function (param) {
        var value;
        // if (param.tag && param.tag !== ''){
        //     value = this.getValueByTagName(param.tag);
        // }else{
        //     if (param.value!=='undefined'){
        //         value = param.value;
        //     }else{
        //         value = Number(param);
        //
        //     }
        //
        // }
        if ((typeof param) === 'number'||(typeof param)==='string') {
            value = Number(param);
        } else {
            if (param) {
                if (param.tag) {
                    value = this.getValueByTagName(param.tag);
                } else {
                    value = Number(param.value);
                }
            } else {
                value = 0;
            }
        }
        // console.log(value,param,(typeof param));
        return value;
    },
    getParamType:function (param) {
        //0: num 1:tagNum 2:tagStr
        if ((typeof param) === 'number'){
            return 0
        }else{
            if (param.tag){
                var tag = this.findTagByName(param.tag)
                if(tag.valueType == 1){
                    return 2
                }else{
                    return 1
                }
            }else{
                return 0
            }
        }
    },
    convertParamValueToStr:function (pValue) {
      if (typeof pValue === 'string'||typeof pValue === 'number'){
          return ''+pValue
      }else{
          return StringConverter.convertUint8ArrayToStr(pValue,StringConverter.supportedEncodings['utf-8'])
      }
    },
    process: function (cmds,index) {
        var cmdsLength = cmds.length;
        if (index >= cmdsLength) {
            return;
        } else if (index < 0) {
            // console.log('processing error');
            return;
        }

        var inst = cmds[index].cmd;
        // console.log('inst: ',inst[0],inst[1],inst[2]);
        //
        var op = inst[0].name;
        var param1 = inst[1];
        var param2 = inst[2];
        //timer?
        var timerFlag = -1;
        var curTimer;
        timerFlag = this.timerFlag(param1);
        var nextStep = {
            process: true,
            step: 1
        }
        switch (op) {
            case 'GOTO':

                var project = this.state.project;
                var curPageTag = this.findTagByName(project.tag);

                // if (curPageTag && curPageTag.value > 0 && curPageTag.value <= project.pageList.length) {
                //     //param2 valid
                //     var lastPage = project.pageList[curPageTag.value - 1];
                //     lastPage.loaded = false;
                //     //handle UnLoad
                //     this.handleTargetAction(lastPage, 'UnLoad');


                // }
                var param2Value = this.getParamValue(param2);
                if (curPageTag) {
                    if (param2Value > 0 && param2Value <= project.pageList.length) {
                        // curPageTag.value = param2;
                        this.setTagByTag(curPageTag, param2Value);
                        this.draw(null, {
                            updatedTagName: project.tag
                        });
                    }
                    // else if (param2Value === -2) {
                    //     //input keyboard
                    //     this.inputKeyboard.widget.returnPageId = curPageTag.value;
                    //     this.inputKeyboard.widget.targetTag = param1.tag;
                    //     this.inputKeyboard.widget.curValue = '' + this.getParamValue(param1);
                    //     this.setTagByTag(curPageTag, this.originalPageNum+1);
                    //     this.draw(null, {
                    //         updatedTagName: project.tag
                    //     });
                    // }
                    else if (param2Value <= -2){
                        var sysIdx = -param2Value-2
                        sysIdx = project.pageList.length - this.systemWidgets.length + sysIdx +1

                        if (project.pageList[sysIdx-1]){
                            // var curWidget = this.systemWidgetPages[sysIdx].canvasList[0].subCanvasList[0].widgetList[0]
                            // var returnButton = this.systemWidgetPages[sysIdx].canvasList[0].subCanvasList[0].widgetList[1]
                            var curWidget = project.pageList[sysIdx-1].canvasList[0].subCanvasList[0].widgetList[0]
                            var returnButton = project.pageList[sysIdx-1].canvasList[0].subCanvasList[0].widgetList[1]
                            //otherAttrs 0 returnPageId
                            //otherAttrs 1 initValue
                            // curWidget.otherAttrs[0] = curPageTag.value
                            // curWidget.otherAttrs[1] = Number(this.getParamValue(param1))||0
                            curWidget.tag = param1.tag
                            //set returnButton
                            returnButton.actions = [
                                {
                                    title:'return',
                                    trigger:'Release',
                                    commands:[
                                        {
                                            cmd:[{name:'GOTO',symbol:'->'},{tag:'',value:''},{tag:'',value:curPageTag.value||1}]
                                        }
                                    ]
                                }
                            ]
                            this.setTagByTag(curPageTag, sysIdx);
                            this.draw(null, {
                                updatedTagName: project.tag
                            });
                        }
                    }
                }
                //next
                nextStep.process = false;

                break;
            case 'INC':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    var nextValue
                    if(targetTag.valueType == 1){
                        //tagStr
                        nextValue = ''+this.getTagTrueValue(targetTag) + this.convertParamValueToStr(this.getParamValue(param2));
                    }else{
                        //tagNum
                        nextValue = Number(targetTag.value) + Number(this.getParamValue(param2));
                    }
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }

                break;
            case 'DEC':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) - Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'MUL':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = parseInt(Number(targetTag.value) * Number(this.getParamValue(param2)));
                    this.setTagByTag(targetTag, nextValue);
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'DIV':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = parseInt(Number(targetTag.value) / Number(this.getParamValue(param2)));
                    this.setTagByTag(targetTag, nextValue);
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'MOD':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) % Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue);
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'OR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) | Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'XOR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) ^ Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'NOT':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = !Number(this.getParamValue(targetTag));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'AND':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) & Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'SL':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) << Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'SR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = Number(targetTag.value) >> Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }
                break;
            case 'SET':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    // targetTag.value = parseInt(param2);
                    this.setTagByTag(targetTag, this.getParamValue(param2))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            //compare
            case 'EQ':
                var firstValue = this.getParamValue(param1)
                var secondValue = this.getParamValue(param2)
                if ((typeof firstValue === typeof secondValue )&& firstValue == secondValue){
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'NEQ':
                var firstValue = this.getParamValue(param1)
                var secondValue = this.getParamValue(param2);
                if ((typeof firstValue !== typeof secondValue )|| firstValue != secondValue){
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'GT':
                var firstValue = Number(this.getValueByTagName(param1.tag, 0));
                var secondValue = Number(this.getParamValue(param2));
                //console.log(param1);
                //console.log('GT',firstValue,secondValue);
                if (firstValue > secondValue) {
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'GTE':
                var firstValue = Number(this.getValueByTagName(param1.tag, 0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue >= secondValue) {
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'LT':
                var firstValue = Number(this.getValueByTagName(param1.tag, 0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue < secondValue) {
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'LTE':
                var firstValue = Number(this.getValueByTagName(param1.tag, 0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue <= secondValue) {
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'JUMP':
                nextStep.step = Number(this.getParamValue(param2));
                break;
            case 'END':
                break;
            case 'SET_TIMER_START':
                if (timerFlag != -1) {
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Start');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag, 'Start', Number(this.getParamValue(param2)))
                }

                break;
            case 'SET_TIMER_STOP':
                if (timerFlag != -1) {
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Stop');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag, 'Stop', Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_STEP':
                if (timerFlag != -1) {
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Step');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag, 'Step', Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_INTERVAL':
                if (timerFlag != -1) {
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Interval');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag, 'Interval', Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_CURVAL':
                if (timerFlag != -1) {
                    var targetTag = this.findTagByName('SysTmr_' + timerFlag + '_t');

                    if (targetTag) {
                        // targetTag.value = parseInt(param2);
                        this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                        this.draw(null, {
                            updatedTagName: param1.tag
                        });
                    }
                    // this.handleTimers(timerFlag,'CurVal',Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_MODE':
                if (timerFlag != -1) {
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Mode');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag, 'Mode', Number(this.getParamValue(param2)))
                }
                break;
            case 'READ_DATA_MODBUS':
            case 'WRITE_DATA_MODBUS':
            case 'READ_DATA_CAN':
            case 'WRITE_DATA_CAN':
                var firstValue = Number(this.getParamValue(param1));
                var secondValue = Number(this.getParamValue(param2));
                var fileType, rwType;
                if (op === 'READ_DATA_CAN' || op === 'WRITE_DATA_CAN') {
                    fileType = 'can';
                } else {
                    fileType = 'modbus';
                }

                if (op === 'READ_DATA_MODBUS' || op === 'READ_DATA_CAN') {
                    rwType = 'read';
                } else {
                    rwType = 'write';
                }


                var readNum, readStartId, canId;
                if (fileType === 'modbus') {
                    readNum = firstValue;
                    readStartId = secondValue;
                    var j;
                    for (var i = readStartId; i < readStartId + readNum; i++) {
                        if (this.registers[i]) {
                            this.rwRegister(i, rwType);
                        }
                    }
                } else if (fileType === 'can') {
                    canId = secondValue;
                }


                break;
            case 'ANIMATE':

                var secondValue = Number(this.getParamValue(param2));
                this.draw(null, {
                    animation: {
                        tag: param1.tag,
                        number: secondValue
                    }
                })
                break;

            case 'SET_STR':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    // targetTag.value = parseInt(param2);
                    this.setTagByTag(targetTag, this.getParamValue(param2))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;

            case 'CONCAT_STR':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    var nextValue
                    if(targetTag.valueType == 1){
                        //tagStr
                        nextValue = ''+this.getTagTrueValue(targetTag) + this.convertParamValueToStr(this.getParamValue(param2));
                    }else{
                        //tagNum
                        nextValue = Number(targetTag.value) + Number(this.getParamValue(param2));
                    }
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null, {
                        updatedTagName: param1.tag
                    });
                }

                break;
            case 'GET_STR_LEN':
                var targetTag = this.findTagByName(param1.tag);
                var param2Tag = this.findTagByName(param2.tag);
                if (targetTag&&param2Tag&&param2Tag.valueType ==1) {
                    // targetTag.value = parseInt(param2);
                    var param2Str = this.convertParamValueToStr(this.getParamValue(param2))
                    this.setTagByTag(targetTag, param2Str.length)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                };
                break;
            case 'DEL_STR_FROM_TAIL':
                var targetTag = this.findTagByName(param1.tag);
                var deleteLen = Number(this.getParamValue(param2))
                if (targetTag&&targetTag.valueType==1) {
                    // targetTag.value = parseInt(param2);
                    var targetStr = this.getParamValue(param1)
                    var oldLen = targetStr.length
                    var newLen = oldLen - deleteLen
                    newLen = newLen<0?0:newLen
                    this.setTagByName(param1.tag,targetStr.slice(0,newLen))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                };
                break;
            case 'DEL_STR_FROM_HEAD':
                var targetTag = this.findTagByName(param1.tag);
                var deleteLen = Number(this.getParamValue(param2))
                if (targetTag&&targetTag.valueType==1) {
                    // targetTag.value = parseInt(param2);
                    var targetStr = this.getParamValue(param1)
                    newLen = newLen<0?0:newLen
                    this.setTagByTag(targetTag,targetStr.slice(deleteLen))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                };
                break;
            default:
                console.log('unsupported cmd: ',op)

        }
        //handle timer
        // if (timerFlag != -1) {
        //     this.handleTimers(timerFlag);
        // }

        //process next
        if (nextStep.process) {
            this.process(cmds, index + nextStep.step);
        }

    },
    rwRegister: function (registerIdx, rwType) {
        var registers = this.state.registers;
        var register = registers[registerIdx];
        var tags = register.tags;
        var tag;
        var i;
        var updatedTagNames = [];
        if (rwType == 'write') {
            //valid

            for (i = 0; i < tags.length; i++) {
                tag = tags[i];
                if (tag.writeOrRead == 'false' || tag.writeOrRead == 'readAndWrite') {
                    //write
                    register.value = tag.value;
                }
            }
            //update
            // this.updateRegisters();
            // console.log(this.registers);
            this.setState({registers: registers});
        } else if (rwType == 'read') {
            for (i = 0; i < tags.length; i++) {
                tag = tags[i];
                if (tag.writeOrRead == 'true' || tag.writeOrRead == 'readAndWrite') {
                    //read
                    updatedTagNames.push(tag.name);
                    this.setTagByTagRawValue(tag, register.value);
                }
            }
            //update
            this.draw(null, {
                updatedTagNames: updatedTagNames
            })

        }
    },
    updateTag: function (curTagIdx, value) {
        var tagList = this.state.tagList;
        if (curTagIdx >= 0 && curTagIdx < tagList.length) {
            // tagList[curTagIdx].value = value;
            this.setTagByTag(tagList[curTagIdx], value)
            this.draw(null, {
                updatedTagName: tagList[curTagIdx].name
            })
        }
    },
    handleRegisterChange: function (key, value) {
        var registers = this.state.registers;
        registers[key].value = value;
        this.setState({registers: registers});
    },
    handleViewScale: function (e) {
        var curScale = Number(e.target.value)
        if (curScale) {
            //change scale
            var canvas = this.refs.canvas
            var offcanvas = this.refs.offcanvas
            canvas.style.width = (curScale * canvas.width) + 'px'
            offcanvas.style.width = (curScale * canvas.width) + 'px'
        }
    },
    setPixelRatio: function (e) {
        if (e.keyCode == 13) {
            //enter
            e.target.blur();
            var curRatio = Number(e.target.value) || 1.0

            this.pixelRatio = curRatio > 0 ? curRatio : 1.0
            //set canvas height
            var canvas = this.refs.canvas
            var offcanvas = this.refs.offcanvas
            canvas.height = offcanvas.height * this.pixelRatio
        }
    },
    handleStep:function () {
        if (Debugger.getMode()=='debugging') {
            Debugger.nextStep()
        }
    },
    handleDebugChooseWidget:function (e) {
        var debugInfo = this.state.debugInfo
        debugInfo.widgetType = e.target.value;
        this.setState({debugInfo:debugInfo})
    },
    handleDebugChooseTrigger:function (e) {
        var debugInfo = this.state.debugInfo
        debugInfo.trigger = e.target.value;
        this.setState({debugInfo:debugInfo})
    },
    handleDebugChooseLine:function (e) {
        var debugInfo = this.state.debugInfo
        debugInfo.line = Number(e.target.value);
        this.setState({debugInfo:debugInfo},function () {
            Debugger.setBreakPoint(debugInfo)
        })
    },
    cmdToString:function (cmd,prefix) {
        var result= ''
        for (var i=0;i<cmd.length;i++){
            var curElem = cmd[i]
            if (curElem) {
                if (typeof curElem == 'object') {
                    result = result +' '+curElem.value||''
                }else{
                    result = result +' '+curElem
                }
            }else{
                result = result + ' '
            }
        }
        if (prefix) {
            result = prefix+result
        }
        return result;
    },
    render: function () {
        // console.log('registers',this.state.registers);
        var generalCommandsDOM =[]
        var triggerDOM = []
        var commandsDOM = []
        for(var widget in this.generalCommands){
            if (this.generalCommands.hasOwnProperty(widget)) {
                generalCommandsDOM.push(<option key={widget} value={widget}>{widget}</option>)
            }
        }
        if (this.state.debugInfo.widgetType) {
            var widgetCommands = this.generalCommands[this.state.debugInfo.widgetType]
            for(var trigger in widgetCommands){
                if (widgetCommands.hasOwnProperty(trigger)) {
                    triggerDOM.push(<option key={trigger} value={trigger}>{trigger}</option>)
                }
            }

            //commands
            if (this.state.debugInfo.trigger) {
                var curCmds = widgetCommands[this.state.debugInfo.trigger]||[]
                commandsDOM = curCmds.map(function (cmd,i) {
                    return (<option key={i} value={i}>{this.cmdToString(cmd,i+': ')}</option>)
                }.bind(this))
                commandsDOM.unshift(<option key={-1} value={null}>--</option>)
            }
        }





        return (
            < div className='simulator'>
                <div className='simulator-tools-wrapper'>
                    <div className='simulator-tools tools-scale'>
                        <select className='btn btn-default' onChange={this.handleViewScale}>
                            <option value='0.5'>50%</option>
                            <option value='0.75'>75%</option>
                            <option value='1'>100%</option>
                            <option value='1.5'>150%</option>
                            <option value='2'>200%</option>
                        </select>

                    </div>
                    <div className='simulator-tools tools-fps'>
                        <span className='btn btn-default'>{this.state.fps}</span>
                    </div>
                    <div className='simulator-tools tools-step'>
                        <div className='btn btn-default' onClick={this.handleStep}>-&gt;</div>
                    </div>
                    <div className='simulator-tools tools-bp'>
                        <select className='btn btn-default select' onChange={this.handleDebugChooseWidget}>
                            {generalCommandsDOM}
                        </select>
                        <select className='btn btn-default' onChange={this.handleDebugChooseTrigger}>
                            {triggerDOM}
                        </select>
                        <select className='btn btn-default' onChange={this.handleDebugChooseLine}>
                            {commandsDOM}
                        </select>
                    </div>
                </div>
                <div className='canvas-wrapper col-md-9' onMouseDown={this.handlePress} onMouseMove={this.handleMove} onMouseUp={this.handleRelease} onMouseOut={this.handleRelease} >
                    <canvas ref='canvas' className='simulator-canvas' />
                    < canvas ref='offcanvas' hidden className='simulator-offcanvas' />
                    < canvas ref='tempcanvas' hidden className='simulator-tempcanvas'/>
                    {/*< canvas ref='pagecanvas' className='simulator-tempcanvas'/>*/}
                </div>
                <div className='col-md-3'>
                    <div className='setting-wrapper'>
                        <div className='row'>
                            <span>像素宽高比： 1：</span><input type='number' min='0' onKeyDown={this.setPixelRatio}/>
                        </div>
                    </div>
                    <div className="phical-keyboard-wrapper" style={{margin: '1em'}}>
                        <button className='btn btn-default'
                                onClick={this.handleMoveNext.bind(null, 'left')}> &lt; </button>
                        <button className='btn btn-default' onMouseDown={this.handleOk.bind(null, 'press')}
                                onMouseUp={this.handleOk.bind(null, 'release')}>OK
                        </button>
                        <button className='btn btn-default'
                                onClick={this.handleMoveNext.bind(null, 'right')}> &gt; </button>

                    </div>
                    < TagList tagList={_.cloneDeep(this.state.tagList)} updateTag={this.updateTag}/>
                    <RegisterList registers={this.state.registers || {}}
                                  handleRegisterChange={this.handleRegisterChange}/>
                </div>

            </div>);
    }
});
