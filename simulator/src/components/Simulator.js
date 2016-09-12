var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var TagList = require('./TagList');
var RegisterList = require('./RegisterList');
var LoadState = require('./LoadState');
var InputKeyboard = require('./inputKeyboard');
var Utils = require('../utils/utils');
var VideoSource = require('./VideoSource');

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

try{
    var os = require('os');
    var platform = os.platform();
    if (platform === 'win32'){
        sep = '\\'
    }
}catch (e){
    //console.log(e);
}

var defaultSimulator = {
    project: {},
    curPageIdx: 0,
    scale: 1.0,
    tagList: [],
    resourceList: [],
    imageList: [],
    timerList: [],
    innerTimerList:[],
    currentPressedTargets: [],
    totalResourceNum: 0
}
module.exports =   React.createClass({
    getInitialState: function () {
        return _.cloneDeep(defaultSimulator)
    },
    componentWillUnmount:function () {
          this.state.timerList.map(function (timer, i) {
              var curTimeID = timer.timerID;
              clearInterval(curTimeID);
          }.bind(this));
        this.state.innerTimerList.map(function (timerId) {
            clearInterval(timerId);
        }.bind(this));
        this.simState = {};
        VideoSource.pause();
    },
    initCanvas: function (data, callBack) {
        var i;
        this.mouseState = {
            state: 'release',
            position: {
                x: 0,
                y: 0
            }
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

        //initialize inputkeyboard
        var keyboardData = InputKeyboard.getInputKeyboard(projectWidth, projectHeight, 0, 0);
        // console.log(keyboardData);
        data.pageList.push(keyboardData);

        //remember inputkeyboard page and widget
        this.inputKeyboard = {};
        this.inputKeyboard.page = keyboardData;
        this.inputKeyboard.widget = keyboardData.canvasList[0].subCanvasList[0].widgetList[0];


        var ctx = canvas.getContext('2d');
        ctx.font = "italic bold 48px serif";
        ctx.fillStyle = "white";
        ctx.fillText("加载中...", 0.5 * projectWidth, 0.5 * projectHeight);

        //initialize tagList
        //check curPage tag


        // var curPageTag = {
        //     name: '当前页面序号',
        //     register: true,
        //     writeOrRead: 'true',
        //     indexOfRegister: -1,
        //     value: 0
        // };
        //
        // var hasCurPageTag = false;
        // for (i=0;i<data.tagList.length;i++){
        //     if (data.tagList[i].name === curPageTag.name){
        //         hasCurPageTag = true;
        //         break;
        //     }
        // }
        // if (!hasCurPageTag){
        //     data.tagList.push(curPageTag);
        // }


        data.tag = '当前页面序号';
        // this.state.tagList = data.tagList
        // this.setState({tagList: data.tagList})
        // this.state.tagList = data.tagList;
        this.setState({tagList: data.tagList});
        console.log('tagList loaded', data.tagList,this.state.tagList);

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
        this.setState({registers: this.registers});

        //initialize timer
        var timerList = this.state.timerList;
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

        this.setState({timerList:timerList});


        console.log('timerList loaded', timerList)

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
        // console.log(requiredResourceList)

        var requiredResourceNum = requiredResourceList.length;
        this.totalRequiredResourceNum = requiredResourceNum;

        this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
        //console.log('haha',resourceList);
        // callBack(data);


        if (requiredResourceNum > 0) {
            requiredResourceList.map(function (resource) {
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
            this.initCanvas(this.state.project, this.draw.bind(this, null, {reLinkWidgets: true}));
        } else {
            this.draw.bind(this, null, {reLinkWidgets: true})
        }
    },
    componentDidMount: function () {
        //this.load();
        this.state = _.cloneDeep(defaultSimulator);
        this.state.project = _.cloneDeep(this.props.projectData);
        console.log('receive new project data', this.state.project)
        this.simState = {};
        this.initProject();
        window.inRawRect = this.inRawRect;

    },
    componentWillReceiveProps: function (newProps) {
        this.state.timerList.map(function (timer, i) {
            var curTimeID = timer.timerID;
            clearInterval(curTimeID);
        }.bind(this));
        this.simState = {};
        VideoSource.setVideoSrc('');
        this.state = _.cloneDeep(defaultSimulator);
        this.state.project = _.cloneDeep(newProps.projectData);
        this.initProject();
        console.log('receive new project data', this.state.project)

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
        var project;
        if (_project) {
            project = _project;
        } else {
            project = this.state.project;
        }


        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        var canvas = this.refs.canvas;
        var ctx = canvas.getContext('2d');

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
                this.handleTargetAction(project.pageList[pageUnloadIdx], 'UnLoad')
            }

            var page = project.pageList[curPageIdx];
            this.state.curPageIdx = curPageIdx

            this.drawPage(page, options);

            //update
            ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
            ctx.drawImage(offcanvas, 0, 0, offcanvas.width, offcanvas.height);
        } else {
            ctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
        }


    },
    getRawValueByTagName:function (name) {
        var curTag = this.findTagByName(name);
        if (curTag) {
            return curTag.value;
        } else{
            return null;
        }
    },
    getValueByTagName: function (name, defaultValue) {
        var curTag = this.findTagByName(name);
        if (curTag && curTag.value != undefined) {
            return Number(curTag.value);
        } else if (defaultValue) {
            return Number(defaultValue);
        } else {
            return null
        }

    },
    compareZIndex: function (canvasA, canvasB) {
        return (canvasA.zIndex || 0) - (canvasB.zIndex || 0);
    },
    drawPage: function (page, options) {
        // console.log(page);
        //will load
        if (!page.state || page.state == LoadState.notLoad) {
            page.state = LoadState.willLoad
            //generate load trigger
            if (!options) {
                options = {};
            }
            options.reLinkWidgets = true;
            this.handleTargetAction(page, 'Load')
        }
        page.state = LoadState.loading

        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');


        //drawPage
        offctx.clearRect(0, 0, offcanvas.width, offcanvas.height);
        this.drawBgColor(0, 0, offcanvas.width, offcanvas.height, page.backgroundColor);
        this.drawBgImg(0, 0, offcanvas.width, offcanvas.height, page.backgroundImage);
        //drawCanvas
        var canvasList = page.canvasList || [];
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
            console.log('page', page);
        }



    },
    handleTimers: function (num,postfix,value) {

        var timerList = this.state.timerList;
        var timer = timerList[num];
        //update timer
        // var postfix = ['Start', 'Stop', 'Step', 'Interval', 't', 'Mode'];
        // for (var i = 0; i < postfix.length; i++) {
        //     var key = 'SysTmr_' + num + '_' + postfix[i];
        //     var curTag = this.findTagByName(key);
        //     //console.log(curTag,timerList);
        //     timer[key] = (curTag&&curTag.value) || 0;
        //     // timer[key] = this.findTagByName(key)['value'] || 0;
        // }
        var key;
        if (postfix === 't'||postfix==='CurVal'){
            //curval
            key = 'SysTmr_' + num + '_' + 't';
            var curTag = this.findTagByName(key);
            timer[key] = (curTag&&curTag.value) || 0;
        }else{
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
            timer.timerID = 0;
            this.startNewTimer(timer, num, true);

        }



    },
    startNewTimer: function (timer, num, cont) {
        if ((timer['SysTmr_' + num + '_Mode'] & 1) == 1) {
            //start
            var loop = ((timer['SysTmr_' + num + '_Mode'] & 2) == 2);
            console.log('start', loop);
            // timer['SysTmr_'+num+'_CurVal'] = timer['SysTmr_'+num+'_Start'];
            var targetTag = this.findTagByName('SysTmr_' + num + '_t');
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


            this.draw();

            var direction = timer['SysTmr_' + num + '_Start'] - timer['SysTmr_' + num + '_Stop']

            timer.timerID = setInterval(function () {
                //clock
                if (direction >= 0) {
                    //decrease

                    if (targetTag&&targetTag.name != '') {
                        targetTag.value -= timer['SysTmr_' + num + '_Step'];
                        if (targetTag.value < timer['SysTmr_' + num + '_Stop']) {
                            //clear timer
                            if (loop){
                                this.setTagByTag(targetTag, startValue)
                                this.draw();
                            }else{
                                clearInterval(timer.timerID);
                                timer.timerID = 0;
                            }

                        } else {
                            this.draw()
                        }

                    }
                } else {
                    if (targetTag&&targetTag.name != '') {
                        targetTag.value += timer['SysTmr_' + num + '_Step'];
                        if (targetTag.value > timer['SysTmr_' + num + '_Stop']) {
                            //clear timer
                            if (loop){
                                this.setTagByTag(targetTag, startValue)
                                this.draw();
                            }else{
                                clearInterval(timer.timerID);
                                timer.timerID = 0;
                            }
                        } else {
                            this.draw()
                        }

                    }
                }
            }.bind(this), timer['SysTmr_' + num + '_Interval']);
        }
    },
    drawCanvas: function (canvasData, options) {
        //draw
        var subCanvasList = canvasData.subCanvasList || [];
        var canvasTag = this.findTagByName(canvasData.tag);
        var nextSubCanvasIdx = (canvasTag && canvasTag.value) || 0;
        nextSubCanvasIdx = nextSubCanvasIdx >= subCanvasList.length ? subCanvasList.length-1:nextSubCanvasIdx;
        var oldSubCanvas = subCanvasList[canvasData.curSubCanvasIdx];
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

        if (subCanvasUnloadIdx !== null){
            // console.log('handle unload sc')
            this.handleTargetAction(subCanvasList[subCanvasUnloadIdx], 'UnLoad');
        }
        var subCanvas = subCanvasList[nextSubCanvasIdx];
        if (subCanvas) {
            this.drawSubCanvas(subCanvas, canvasData.x, canvasData.y, canvasData.w, canvasData.h, options);
        } else {
            this.handleTargetAction(oldSubCanvas, 'UnLoad');
        }
    },
    drawSubCanvas: function (subCanvas, x, y, w, h, options) {
        if (!subCanvas.state || subCanvas.state == LoadState.notLoad) {
            subCanvas.state = LoadState.willLoad
            //generate load trigger
            this.handleTargetAction(subCanvas, 'Load')
        }
        subCanvas.state = LoadState.loading

        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        this.drawBgColor(x, y, w, h, subCanvas.backgroundColor);
        this.drawBgImg(x, y, w, h, subCanvas.backgroundImage);
        var widgetList = subCanvas.widgetList;
        if (widgetList.length) {
            widgetList.sort(this.compareZIndex);
            for (var i = 0; i < widgetList.length; i++) {
                this.drawWidget(widgetList[i], x, y, options);
            }

        }

        subCanvas.state = LoadState.loaded
    },
    drawWidget: function (widget, sx, sy, options) {
        // console.log('drawing widget',widget);
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        var curX = widget.info.left + sx;
        var curY = widget.info.top + sy;
        //this.drawBgColor(curX,curY,widget.w,widget.h,widget.bgColor);
        var subType = widget.subType;
        widget.parentX = sx;
        widget.parentY = sy;
        switch (subType) {
            case 'MySlide':
                this.drawSlide(curX, curY, widget, options);
                break;
            case 'MyButton':
                this.drawButton(curX, curY, widget, options);
                break;
            case 'MySwitch':
                this.drawSwitch(curX,curY,widget,options);
                break;
            case 'MyButtonGroup':
                this.drawButtonGroup(curX, curY, widget, options);
                break;
            case 'MyNumber':
                this.drawNumber(curX, curY, widget, options);
                break;
            case 'MyProgress':
                //draw progressbar
                this.drawProgress(curX, curY, widget, options);
                break;
            case 'MyDashboard':
                this.drawDashboard(curX, curY, widget, options);
                break;
            case 'MyOscilloscope':
                this.drawOscilloscope(curX,curY,widget,options);
                break;
            case 'MyRotateImg':
                this.drawRotateImg(curX,curY,widget,options);
                break;
            case 'MyNum':
                this.drawNum(curX, curY, widget, options)
                break;
            case 'MyDateTime':
                this.drawTime(curX,curY,widget,options);
                break;
            case 'MyTextArea':
                this.drawTextArea(curX,curY,widget,options);
                break;
            case 'MySlideBlock':
                this.drawSlideBlock(curX,curY,widget,options);
                break;
            case 'MyScriptTrigger':
                this.drawScriptTrigger(curX,curY,widget,options);
                break;
            case 'MyVideo':
                this.drawVideo(curX,curY,widget,options);
                break;
            case 'MyInputKeyboard':
                this.drawInputKeyboard(curX, curY, widget, options);
                break;
        }
    },
    drawInputKeyboard:function(curX, curY, widget, options){
        var offcanvas = this.refs.offcanvas;
        var offCtx = offcanvas.getContext('2d');
        var tempcanvas = this.refs.tempcanvas;

        var tempCtx = tempcanvas.getContext('2d');
        var width = widget.info.width;
        var height = widget.info.height;
        var curSlice = widget.texList[0].slices[0];
        this.drawBg(curX, curY, width, height, curSlice.imgSrc, curSlice.color);

        //draw num
        var num = widget.info.num;

        this.drawBg(curX + num.x, curY + num.y, num.width, num.height, num.slices[0].imgSrc, num.slices[0].color);
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

    },
    drawSlide: function (curX, curY, widget, options) {
        var slideSlices = widget.texList[0].slices;
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        if (slideIdx >= 0 && slideIdx < slideSlices.length) {
            var curSlice = slideSlices[slideIdx];
            var width = widget.info.width;
            var height = widget.info.height;
            this.drawBg(curX, curY, width, height, curSlice.imgSrc, curSlice.color);
        }

    },
    drawButton: function (curX, curY, widget, options) {
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
                    this.drawBg(curX, curY, width, height, tex.slices[1].imgSrc, tex.slices[1].color);
                } else {
                    //normal slice
                    this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color);
                }
                break;
            case '1':
                //switch mode
                var switchState = this.getValueByTagName(widget.tag, 0);
                if (switchState == 0) {
                    this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color);
                } else {
                    this.drawBg(curX, curY, width, height, tex.slices[1].imgSrc, tex.slices[1].color);
                }
                break
        }

        //draw tint
        this.drawTextByTempCanvas(curX,curY,width,height,text,font);

        //draw highlight
        if (widget.highlight) {
            this.drawHighLight(curX, curY, width, height);
        }
    },
    drawSwitch: function (curX, curY, widget, options) {
        // console.log(widget);
        var tex = widget.texList[0];
        var width = widget.info.width;
        var height = widget.info.height;
        var bindBit = parseInt(widget.info.bindBit);

        //switch mode
        var bindTagValue = this.getValueByTagName(widget.tag, 0);
        var switchState;
        if (bindBit<0||bindBit>31){
            switchState = 0;
        }else{
            switchState = bindTagValue & (Math.pow(2,bindBit));
        }
        if (switchState == 0) {
            // this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color);
        } else {
            // console.log(tex);
            this.drawBg(curX, curY, width, height, tex.slices[0].imgSrc, tex.slices[0].color);
        }
    },
    drawTextArea:function (curX,curY,widget,options) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        var bgSlice = widget.texList[0].slices[0];
        this.drawBg(curX,curY,width,height,bgSlice.imgSrc,bgSlice.color);
        //draw text
        if (info.text){
            //
            var font = {};
            font['font-style'] = info.fontItalic;
            font['font-weight'] = info.fontBold;
            font['font-size'] = info.fontSize;
            font['font-family'] = info.fontFamily;
            font['font-color']=info.fontColor;
            this.drawTextByTempCanvas(curX,curY,width,height,info.text,font);
        }
    },
    drawTextByTempCanvas:function (curX,curY,width,height,text,font) {

        var text = text||'';
        var font = font||{};
        // console.log(font);
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        var tempcanvas = this.refs.tempcanvas;
        tempcanvas.width = width;
        tempcanvas.height = height;
        var tempctx = tempcanvas.getContext('2d');
        tempctx.save();
        tempctx.clearRect(0,0,width,height);
        tempctx.textAlign = font.textAlign||'center';
        tempctx.textBaseline = font.textBaseline||'middle';
        //font style
        var fontStr = (font['font-style']||'')+' '+(font['font-variant']||'')+' '+(font['font-weight']||'')+' '+(font['font-size']||24)+'px'+' '+(font['font-family']||'arial');
        tempctx.font = fontStr;
        // console.log('tempctx.font',fontStr);
        tempctx.fillStyle = font['font-color'];
        tempctx.fillText(text,0.5*width,0.5*height);
        tempctx.restore();
        offctx.drawImage(tempcanvas,curX,curY,width,height);
    },
    drawButtonGroup: function (curX, curY, widget, options) {
        var width = widget.info.width;
        var height = widget.info.height;
        var interval = widget.info.interval;
        var count = widget.info.count;

        var tag = this.findTagByName(widget.tag);
        var curButtonIdx = (tag && tag.value) || 0;
        var texList = widget.texList;
        if (widget.info.arrange == 'horizontal') {
            //horizontal
            var singleWidth = (width - interval * (count - 1)) / count;
            for (var i = 0; i < texList.length; i++) {
                var curButtonTex = texList[i];
                if (i == curButtonIdx-1) {
                    //pressed tex
                    this.drawBg(curX + i * (singleWidth + interval), curY, singleWidth, height, curButtonTex.slices[1].imgSrc, curButtonTex.slices[1].color);

                } else {
                    //normal tex
                    this.drawBg(curX + i * (singleWidth + interval), curY, singleWidth, height, curButtonTex.slices[0].imgSrc, curButtonTex.slices[0].color);
                }
                //draw highlight
                if (widget.highlight) {
                    this.drawHighLight(curX + widget.highlightValue * (singleWidth + interval), curY, singleWidth, height);
                }
            }
        } else {
            //vertical
            var singleHeight = (height - interval * (count - 1)) / count;
            for (var i = 0; i < texList.length; i++) {
                var curButtonTex = texList[i];
                if (i == curButtonIdx-1) {
                    //pressed tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[1].imgSrc, curButtonTex.slices[1].color);

                } else {
                    //normal tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[0].imgSrc, curButtonTex.slices[0].color);
                }
                if (widget.highlight) {
                    this.drawHighLight(curX, curY + widget.highlightValue * (singleHeight + interval), width, singleHeight);
                }
            }
        }
    },
    drawProgress: function (curX, curY, widget, options) {
        var width = widget.info.width;
        var height = widget.info.height;
        var cursor = widget.info.cursor=='1'? true:false;
        if (widget.texList) {
            //has tex
            //draw background
            var texSlice = widget.texList[0].slices[0];

            //draw progress
            //get current value
            var curProgressTag = this.findTagByName(widget.tag);

            var curProgress = (curProgressTag && curProgressTag.value) || 0;
            var curScale = 1.0 * (curProgress - widget.info.minValue) / (widget.info.maxValue - widget.info.minValue);

            curScale = (curScale >= 0 ? curScale : 0.0);
            curScale = (curScale <= 1 ? curScale : 1.0);

            var progressSlice = widget.texList[1].slices[0];
            // console.log('drawing color progress',widget.info.progressModeId);
            switch (widget.info.progressModeId){
                case '0':
                    this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color);

                    switch (widget.info.arrange) {

                        case 'vertical':
                            // console.log(curScale);
                            // this.drawBg(curX,curY+height-height*curScale,width,height*curScale,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY + height * (1.0 - curScale), width, height * curScale, progressSlice.imgSrc, progressSlice.color);
                            if (cursor){
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawCursor(curX,curY+ height * (1.0 - curScale),width,height,false,height*(1.0-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, progressSlice.imgSrc, progressSlice.color);
                            if (cursor){
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawCursor(width*curScale+curX,curY,width,height,true,width*(1-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                    }
                    break;
                case '1':

                    this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color);
                    var lastSlice = widget.texList[2].slices[0];
                    var mixedColor = this.addTwoColor(lastSlice.color,progressSlice.color,curScale);

                    // console.log('mixedColor',mixedColor);
                    switch (widget.info.arrange) {

                        case 'vertical':
                            // console.log(curScale);
                            // this.drawBg(curX,curY+height-height*curScale,width,height*curScale,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY + height * (1.0 - curScale), width, height * curScale, '', mixedColor);
                            if (cursor){
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawCursor(curX,curY+ height * (1.0 - curScale),width,height,false,height*(1.0-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, '', mixedColor);
                            if (cursor){
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawCursor(width*curScale+curX,curY,width,height,true,width*(1-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                    }

                    break;
                case '2':
                    break;
            }



            //handle action
            this.handleAlarmAction(curProgress, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
            widget.oldValue = curProgress;

        }
    },
    drawSlideBlock: function (curX, curY, widget, options) {
        var width = widget.info.width;
        var height = widget.info.height;

        if (widget.texList) {
            var hori = widget.info.arrange == 'horizontal';
            if (!widget.slideSize){

                var defaultSize = hori? widget.info.h:widget.info.w;
                widget.slideSize = this.getImageSize(widget.texList[1].slices[0].imgSrc,defaultSize,defaultSize);
            }
            //has tex
            //draw background
            var texSlice = widget.texList[0].slices[0];
            this.drawBg(curX, curY, width, height, texSlice.imgSrc, texSlice.color);

            
            //get current value
            var curSlideTag = this.findTagByName(widget.tag);
            //console.log(widget.curValue);
            var curSlide = (curSlideTag && curSlideTag.value) || widget.curValue||0;
            var curScale = 1.0 * (curSlide - widget.info.minValue) / (widget.info.maxValue - widget.info.minValue);

            curScale = (curScale >= 0 ? curScale : 0.0);
            curScale = (curScale <= 1 ? curScale : 1.0);

            var slideSlice = widget.texList[1].slices[0];
            var slideImg  = this.getImage(slideSlice.imgSrc);
            slideImg = (slideImg && slideImg.content) || null;
            if (slideImg){
                var slideRatio;
                switch (widget.info.arrange) {
                    case 'vertical':

                        this.drawCursor(curX,curY+ height-curScale*(height-slideImg.height),width,height,false,height-curScale*(height-slideImg.height),slideSlice.imgSrc,slideSlice.color);
                        break;
                    case 'horizontal':
                    default:
                        // console.log(slideRatio,curScale);


                        this.drawCursor(curScale*(width-slideImg.width)+curX,curY,width,height,true,width-curScale*(width-slideImg.width),slideSlice.imgSrc,slideSlice.color);
                        break
                }
            }




            //handle action
            this.handleAlarmAction(curSlide, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
            widget.oldValue = curSlide;

        }
    },
    drawScriptTrigger:function(curX, curY, widget, options){
        //get current value
        var curScriptTriggerTag = this.findTagByName(widget.tag);

        var curScriptTrigger = (curScriptTriggerTag && curScriptTriggerTag.value) || 0;

        //handle action
        this.handleAlarmAction(curScriptTrigger, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
        widget.oldValue = curScriptTrigger;
    },
    drawVideo:function(curX,curY,widget,options){
        var width = widget.info.width;
        var height = widget.info.height;
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        offctx.fillStyle=widget.texList[0].slices[0].color;
        offctx.fillRect(curX,curY,width,height);
        //draw video
        var videoSrc = this.getRawValueByTagName(widget.tag);
        // var videoSrc = 'http://blog.zzen1ss.me/media/video/saraba.mp4';
        if(VideoSource.setVideoSrc(videoSrc)){
            //first set
            VideoSource.play();
        }
        //draw video
        offctx.drawImage(VideoSource.videoObj,curX,curY,width,height);
        if (!(widget.timerId && widget.timerId!==0)){
            widget.timerId = setInterval(function () {
                this.draw();
            }.bind(this),40);
            var innerTimerList = this.state.innerTimerList;
            innerTimerList.push(widget.timerId);
            this.setState({innerTimerList:innerTimerList});
        }
    },

    drawCursor:function(beginX, beginY, width, height, align,alignLimit, img,color) {

        var cursorImg  = this.getImage(img);
        cursorImg = (cursorImg && cursorImg.content) || null;
        if (cursorImg){
            var imgW = cursorImg.width;
            var imgH = cursorImg.height;
            if (align){
                //horizontal
                this.drawBgClip(beginX,beginY-(imgH-height)*0.5,imgW,imgH,beginX,beginY,Math.min(imgW,alignLimit),height,img,color);
            }else{
                //vertical
                this.drawBgClip(beginX-(imgW-width)*0.5,beginY-imgH,imgW,imgH,beginX,beginY-imgH,width,Math.min(imgH,alignLimit),img,color);
            }
        }


    },
    addTwoColor:function (color1,color2,ratio) {
        var color1Array = this.transColorToArray(color1);
        var color2Array = this.transColorToArray(color2);
        var mixedColor = [];
        for (var i=0;i<4;i++){
            mixedColor[i] = parseInt(color1Array[i] * ratio + (1-ratio)* color2Array[i]);
        }
        return 'rgba('+mixedColor.join(',')+')';
    },
    transColorToArray:function (color) {
        //rgba to array
        var temp = color.split('(')[1].split(')')[0];
        var colorArray = temp.split(',').map(function (colorbit) {
            return Number(colorbit);
        });
        return colorArray;
    },
    getCurDateOriginalData:function (widget,source,offset) {
        var curDate;
        if (source === 'outer'){
            var time1 = parseInt(this.getValueByTagName('时钟变量年月日',0))||0;
            var time2 = parseInt(this.getValueByTagName('时钟变量时分秒',0))||0;
            var year,month,day,hour,minute,seconds;
            year = parseInt(time1/10000);
            month = parseInt((time1-year*10000)/100);
            day = (time1-year*10000-month*100);

            hour = parseInt(time2/10000);
            minute = parseInt((time2-hour*10000)/100);
            seconds = (time2-hour*10000-minute*100);
            var realMonth = month - 1;
            curDate = new Date(year,realMonth,day,hour,minute,seconds);
            console.log(year,realMonth,day,hour,minute,seconds,curDate)

        }else{

            // if (widget.baseDate===undefined){
            //     widget.baseDate = new Date();
            // }
            // curDate = widget.baseDate;
            curDate = new Date();
            if (offset!==undefined){
                curDate = new Date(curDate.getTime() + offset);
            }
        }

        return curDate;
    },
    drawTime:function (curX,curY,widget,options) {
        var width = widget.info.width;
        var height = widget.info.height;
        var dateTimeModeId = widget.info.dateTimeModeId;
        var fontFamily = widget.info.fontFamily;
        var fontSize = widget.info.fontSize;
        var fontColor = widget.info.fontColor;
        var curDate;
            if (widget.info.RTCModeId=='0'){
               curDate =  this.getCurDateOriginalData(widget,'inner',widget.timeOffset);
            }else{
                curDate = this.getCurDateOriginalData(widget,'outer');
            }

        var dateTimeString = '';
        if (dateTimeModeId == '0'){
            //time
            dateTimeString = this.getCurTime(curDate);
        }else if(dateTimeModeId=='1'){
            dateTimeString = this.getCurTimeHM(curDate);
        }else{
            //date
            dateTimeString = this.getCurDate(curDate,dateTimeModeId);
        }
        //draw
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        var tempcanvas = this.refs.tempcanvas;
        tempcanvas.width = width;
        tempcanvas.height = height;
        var tempctx = tempcanvas.getContext('2d');
        tempctx.save();
        tempctx.clearRect(0,0,width,height);
        tempctx.textAlign = 'center';
        tempctx.textBaseline = 'middle';
        //font style
        tempctx.fillStyle=fontColor;
        tempctx.font = fontSize+'px '+fontFamily;
        tempctx.fillText(dateTimeString,0.5*width,0.5*height);
        tempctx.restore();
        offctx.drawImage(tempcanvas,curX,curY,width,height);

        //hightlight
        var eachWidth=0;
        var delimiterWidth=0;

        if (widget.highlight){
            // console.log(widget)
            delimiterWidth = widget.delimiterWidth;
            if (dateTimeModeId=='0'){
                eachWidth = (widget.info.width - 2*delimiterWidth)/3;
                this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height);
            }else if(dateTimeModeId=='1'){
                eachWidth = (widget.info.width - widget.delimiterWidth)/2;
                this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue,curY,eachWidth,height);
            }else{
                eachWidth = (widget.info.width - 2*widget.delimiterWidth)/4;
                if (widget.highlightValue == 0){
                    this.drawHighLight(curX,curY,eachWidth*2,height);
                }else{
                    this.drawHighLight(curX+(eachWidth+delimiterWidth)*widget.highlightValue+eachWidth,curY,eachWidth,height);
                }

            }
        }

        //timer 1 s
        if (!(widget.timerId && widget.timerId!==0)){
            widget.timerId = setInterval(function () {
                this.draw();
            }.bind(this),1000)
            var innerTimerList = this.state.innerTimerList;
            innerTimerList.push(widget.timerId);
            this.setState({innerTimerList:innerTimerList});
        }
    },
    getCurTime:function (date) {
        var date = date||new Date();
        var hour = (date.getHours()<10)?('0'+date.getHours()):date.getHours();
        var minute = (date.getMinutes()<10)?('0'+date.getMinutes()):date.getMinutes();
        var second = (date.getSeconds()<10)?('0'+date.getSeconds()):date.getSeconds();
        return ''+hour+':'+minute+':'+second;
    },
    getCurTimeHM:function(date){
        var date = date||new Date();
        var hour = (date.getHours()<10)?('0'+date.getHours()):date.getHours();
        var minute = (date.getMinutes()<10)?('0'+date.getMinutes()):date.getMinutes();
        return ''+hour+':'+minute;
    },
    getCurDate:function (date,mode) {
        var date = date||new Date();
        var year = date.getFullYear();
        var month = ((date.getMonth()+1)<10)?('0'+(date.getMonth()+1)):date.getMonth()+1;
        var day = (date.getDate()<10)?('0'+date.getDate()):date.getDate();
        var dateString;
        if(mode=='2'){
            dateString=''+year+'/'+month+'/'+day;
        }else{
            dateString=''+year+'-'+month+'-'+day;
        }
        return dateString
    },

    drawBgClip: function (curX, curY, parentWidth, parentHeight, childX, childY, childWidth, childHeight, imageName, color) {
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');

        offctx.save();

        offctx.beginPath();

        if ((childX+childWidth)>(curX+parentWidth)){
            childWidth = curX+parentWidth -childX;
        }

        if ((childY+childHeight)>(curY+parentHeight)){
            childHeight = curY+parentHeight - childY;
        }


        offctx.rect(childX, childY, childWidth, childHeight);


        offctx.clip();


        this.drawBg(curX, curY, parentWidth, parentHeight, imageName, color, offctx);
        // this.drawBg(childX,childY,childWidth,childHeight,imageName,color);
        offctx.restore();

    },
    drawHighLight: function (curX, curY, width, height) {
        this.drawBgColor(curX, curY, width, height, 'rgba(244,244,244,0.3)');
    },
    findValue: function (array, key1, value, key2) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key1] == value) {
                return array[i][key2];

            }
        }
    },
    limitValueBetween: function (curVal, minVal, maxVal,overFlowStyle) {
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
        var originalNum = String(parseInt(originalNum||0))
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
    drawNumber: function (curX, curY, widget, options) {
        // console.log(widget);
        var needDrawNumber = false;
        //handle initial number
        if (this.pageOnload == false) {
            //show init number ?
            if (widget.info.noInit == false) {
                //init, draw
                needDrawNumber = true;
                var numberTag = this.findTagByName(widget.tag);

                if (numberTag) {
                    // numberTag.value = widget.info.initValue
                    this.setTagByTag(numberTag, widget.info.initValue)
                }
                ;
            }
        } else {
            needDrawNumber = true;
        }
        if (needDrawNumber) {
            //draw number
            var maxDigits = parseInt(widget.info.initValue) / 10 + 1;
            var singleNumberWidth = widget.info.width / maxDigits;
            var singleNumberHeight = widget.info.height;

            //find current number

            var numberTag = this.findTagByName(widget.tag);

            var currentValue = 0;
            if (numberTag) {
                currentValue = numberTag.value;
            } else {
                currentValue = Number(widget.info.initValue) || 0;
            }

            var maxOverflow = false;
            var minOverflow = false;
            //currentValue
            if (currentValue > widget.info.maxValue) {
                currentValue = widget.info.maxValue;
                maxOverflow = true;
            } else if (currentValue < widget.info.minValue) {
                currentValue = widget.info.minValue;
                minOverflow = true;
            }

            // console.log(currentValue);
            var currentDigits = String(currentValue).split('').map(function (digit) {
                return parseInt(digit);
            });
            for (var i = 0; i < currentDigits.length; i++) {
                this.drawDigit(currentDigits[i], widget, curX + i * singleNumberWidth, curY, singleNumberWidth, singleNumberHeight);
            }

            //handle action
            if (maxOverflow) {
                //handle max overflow
                this.handleTargetAction(widget, 'MaxOverflow');
            } else if (minOverflow) {
                //handle min overflow
                this.handleTargetAction(widget, 'MinOverflow');
            }
        }

    },
    drawNum: function (curX, curY, widget, options) {
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        //get current value
        var curValue = this.getValueByTagName(widget.tag);
        // console.log(curValue)
        if (curValue === null || curValue === 'undefined') {
            curValue = widget.info.numValue;
        }
        // console.log(curValue);
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var lowAlarmValue = widget.info.lowAlarmValue;
        var highAlarmValue = widget.info.highAlarmValue;
        var numModeId = widget.info.numModeId;
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
        //size
        var curWidth = widget.info.width;
        var curHeight = widget.info.height;

        var tempcanvas = this.refs.tempcanvas;
        tempcanvas.width = curWidth;
        tempcanvas.height = curHeight;
        var tempCtx = tempcanvas.getContext('2d');
        tempCtx.clearRect(0, 0, curWidth, curHeight);
        //offCtx.scale(1/this.scaleX,1/this.scaleY);
        var numString = numItalic + " " + numBold + " " + numSize + "px" + " " + numFamily;
        //offCtx.fillStyle = this.numColor;
        console.log('keke',numColor);
        tempCtx.font = numString;
        tempCtx.textAlign=widget.info.align;
        tempCtx.textAlign = tempCtx.textAlign||'center';
        tempCtx.textBaseline= 'middle';

        widget.oldValue = widget.oldValue || 0;

        if (curValue != undefined && curValue != null) {
            //offCtx.save();
            //handle action before
            if(overFlowStyle=='0'&&(curValue>maxValue||curValue<minValue)){
                return;
            }
            curValue = this.limitValueBetween(curValue, minValue, maxValue);
            if (numModeId == '0' || (numModeId == '1' && widget.oldValue != undefined && widget.oldValue == curValue)) {


                var tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode)


                //drawbackground
                var bgTex = {
                    color:numColor,
                    imgSrc:'',
                    name:'数字背景'
                }
                // this.drawBg(0,0,curWidth,curHeight,bgTex.imgSrc,bgTex.color,tempCtx)
                // tempCtx.globalCompositeOperation = "destination-in";
                // console.log(tempNumValue);
                // tempCtx.fillText(tempNumValue, curWidth/2, curHeight/2+numSize/4);
                // // tempCtx.fillText(tempNumValue,0,)
                // tempCtx.restore()
                this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempCtx)
                offctx.drawImage(tempcanvas, curX, curY, curWidth, curHeight)
                //offCtx.restore();


                //handle action
                this.handleAlarmAction(Number(curValue), widget, lowAlarmValue, highAlarmValue)
                widget.oldValue = Number(curValue)
            } else {
                //animate number


                //drawbackground
                var bgTex = widget.texList[0].slices[0]
                var totalFrameNum = 10
                // //draw
                var tempNumValue = this.generateStyleString(widget.oldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode)
                this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempCtx)
                var oldHeight = (totalFrameNum - widget.curFrameNum) * 1.0 / totalFrameNum * curHeight
                offctx.drawImage(tempcanvas, 0, 0, curWidth, oldHeight, curX, curY + curHeight - oldHeight, curWidth, oldHeight)

                var tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode)
                this.drawStyleString(tempNumValue, curWidth, curHeight, numString, bgTex, tempCtx)
                var oldHeight = widget.curFrameNum * 1.0 / totalFrameNum * curHeight
                offctx.drawImage(tempcanvas, 0, curHeight - oldHeight, curWidth, oldHeight, curX, curY, curWidth, oldHeight)

                // var transY = curHeight * 1.0 / totalFrameNum * (widget.curFrameNum|| 0 )


                if (widget.animateTimerId == undefined || widget.animateTimerId == 0) {
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
                            widget.oldValue = curValue
                        }
                        this.draw()
                    }.bind(this), 16)
                }


            }


        }

    },
    drawStyleString: function (tempNumValue, curWidth, curHeight, font, bgTex, tempCtx) {
        tempCtx.clearRect(0, 0, curWidth, curHeight);
        tempCtx.save()
        this.drawBg(0, 0, curWidth, curHeight, bgTex.imgSrc, bgTex.color, tempCtx);
        tempCtx.globalCompositeOperation = "destination-in";
        // console.log(tempNumValue);
        //tempCtx.textBaseline="middle"
        tempCtx.font=font;
        switch(tempCtx.textAlign){
            case 'left':
                tempCtx.fillText(tempNumValue, 0, curHeight / 2 );
                break;
            case 'right':
                tempCtx.fillText(tempNumValue, curWidth , curHeight / 2 );
                break;
            case 'center':
            default :
                tempCtx.fillText(tempNumValue, curWidth / 2, curHeight / 2 );
                break;
        }
        // tempCtx.fillText(tempNumValue,0,)
        tempCtx.restore()
    },
    generateStyleString: function (curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode) {
        var negative = false;
        if(curValue<0){
            negative = true;
        }
        var tempNumValue = Math.abs(curValue);
        tempNumValue = tempNumValue.toString();
        //console.log(tempNumValue);
        //配置小数位数
        if (parseInt(decimalCount) > 0) {
            tempNumValuePair = tempNumValue.split('.')
            if (tempNumValuePair.length > 1) {
                //has original fraction
                tempNumValue = tempNumValuePair[0] + '.' + this.changeNumDigits(tempNumValuePair[1], decimalCount, 0, false)
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
        if(!negative){
            var symbol='';
            if(symbolMode=='1'){
                symbol ='+';
            }
            tempNumValue = symbol + tempNumValue;
        }else if(negative){
            symbol = '-';
            tempNumValue = symbol + tempNumValue;
        }

        return tempNumValue
    },
    drawDigit: function (digit, widget, originX, originY, width, height) {

        if (widget.texList && widget.texList[digit]) {
            var slice = widget.texList[digit].slices[0];
            this.drawBg(originX, originY, width, height, slice.imgSrc || (digit + '.png'), slice.color);
        }

    },
    drawDashboard: function (curX, curY, widget, options) {

        var width = widget.info.width;
        var height = widget.info.height;
        var offset = widget.info.offsetValue || 0;
        if (widget.texList) {

            //pointer
            var minArc = widget.info.minAngle;
            var maxArc = widget.info.maxAngle;
            var minValue = widget.info.minValue;
            var maxValue = widget.info.maxValue;
            // var curArc = widget.info.value;
            var curDashboardTag = this.findTagByName(widget.tag);
            var curArc = parseInt((maxArc-minArc)/(maxValue-minValue)*(curDashboardTag&&curDashboardTag.value||0));
            var currentValue = curDashboardTag&&curDashboardTag.value||0
            var clockwise = widget.info.clockwise == '1'?1:-1;
            var lowAlarm = widget.info.lowAlarmValue;
            var highAlarm = widget.info.highAlarmValue;
            var pointerLength = widget.info.pointerLength;
            var pointerWidth,pointerHeight;
            pointerWidth=pointerLength / Math.sqrt(2);
            pointerHeight = pointerLength / Math.sqrt(2);


            if (curArc > maxArc) {
                curArc = maxArc
            } else if (curArc < minArc) {
                curArc = minArc;
            }
            // console.log(curArc,widget.oldValue);
            var arcPhase = 45;
            if (widget.dashboardModeId == '0') {
                //simple mode
                //background
                var bgTex = widget.texList[0].slices[0];
                this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color);
                //draw pointer
                this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, clockwise*(curArc+ offset) + arcPhase , widget.texList[1].slices[0]);
                //draw circle
                // var circleTex = widget.texList[2].slices[0]
                // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)
            } else if(widget.dashboardModeId=='1'){
                // complex mode
                //background
                var bgTex = widget.texList[0].slices[0];
                this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color);
                //draw light strip
                var lightStripTex = widget.texList[2].slices[0]
                this.drawLightStrip(curX, curY, width, height, clockwise*(minArc + offset) + 90, clockwise*(curArc + offset) + 90, widget.texList[2].slices[0].imgSrc,clockwise,widget.dashboardModeId);
                //draw pointer
                this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, clockwise*(curArc + offset)+arcPhase, widget.texList[1].slices[0]);

                //draw circle
                // var circleTex = widget.texList[3].slices[0]
                // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)

            } else if(widget.dashboardModeId=='2'){
                var lightStripTex = widget.texList[0].slices[0];
                this.drawLightStrip(curX, curY, width, height, clockwise*(minArc + offset) + 90, clockwise*(curArc + offset) + 90, widget.texList[0].slices[0].imgSrc,clockwise,widget.dashboardModeId);
            }

            this.handleAlarmAction(currentValue, widget, lowAlarm, highAlarm);
            widget.oldValue = currentValue;

        }
    },

    drawRotateImg: function (curX, curY, widget, options) {

        var width = widget.info.width;
        var height = widget.info.height;
        if (widget.texList) {

            //pointer
            var minArc = widget.info.minValue;
            var maxArc = widget.info.maxValue;
            var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
            var curArc = this.getValueByTagName(widget.tag,0);

            var lowAlarm = widget.info.lowAlarmValue;
            var highAlarm = widget.info.highAlarmValue;


            if (curArc > maxArc) {
                curArc = maxArc
            } else if (curArc < minArc) {
                curArc = minArc;
            }
            this.drawRotateElem(curX, curY, width, height, width, height, curArc+initValue , widget.texList[0].slices[0],-0.5,-0.5);


            this.handleAlarmAction(curArc, widget, lowAlarm, highAlarm);
            widget.oldValue = curArc;

        }
    },
    drawOscilloscope: function (curX, curY, widget, options) {
        if (widget.texList) {
            var width = widget.info.width;
            var height = widget.info.height;
            var minValue = widget.info.minValue;
            var maxValue = widget.info.maxValue;
            var lowAlarm = widget.info.lowAlarmValue;
            var highAlarm = widget.info.highAlarmValue;

            var spacing = widget.info.spacing;
            var grid=widget.info.grid;
            var lineColor=widget.info.lineColor;
            var lineWidth=widget.info.lineWidth;
            var blankX = widget.info.blankX;
            var blankY = widget.info.blankY;
            var gridInitValue = widget.info.gridInitValue;
            var gridUnitX = widget.info.gridUnitX;
            var gridUnitY = widget.info.gridUnitY;

            var newPoint = false;
            var curValue;

            if (!widget.maxPoints){
                var maxPoints = Math.floor((width-blankX)/spacing)+1;
                widget.maxPoints = maxPoints;
                widget.flag = -1;
                widget.curPoints = [];
            }

            if (options && (options.updatedTagName == widget.tag || this.isIn(widget.tag, options.updatedTagNames))) {
                newPoint = true;
                curValue = this.getValueByTagName(widget.tag,0);
                curValue = this.limitValueBetween(curValue,minValue,maxValue);
                if (widget.flag >= widget.maxPoints-1){
                    //overflow refresh
                    widget.curPoints = [];
                    widget.curPoints.push(curValue);
                    widget.flag = 0;
                }else{
                    widget.curPoints.push(curValue);
                    widget.flag += 1;
                }
            }
            
           //draw bg
            var bgSlice = widget.texList[0].slices[0];
            this.drawBg(curX,curY,width,height,bgSlice.imgSrc,bgSlice.color);

            //draw grid
            if(grid!='0'){
                var gridStyle={
                    lineWidth:lineWidth,
                    grid:grid,
                    gridInitValue:gridInitValue,
                    gridUnitX:gridUnitX,
                    gridUnitY:gridUnitY
                }
                this.drawGrid(curX,curY,width,height,blankX,blankY,spacing,spacing,gridStyle,minValue);
            }
            //draw points lines

            var coverSlice = widget.texList[1].slices[0];
            this.drawPointsLine(curX,curY,width,height,spacing,widget.curPoints,minValue,maxValue,coverSlice,blankX,blankY,lineColor);

            //handle action
            if (newPoint){
                this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
                widget.oldValue = curValue;
            }


        }
    },
    drawPointsLine:function (curX, curY, width, height,spacing,points,minValue, maxValue,bgSlice,blankX,blankY,lineColor) {
        var tranedPoints = points.map(function (point) {
            return 1.0*(point-minValue)/(maxValue-minValue)*(height-blankY);
        });
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        offctx.save();
        offctx.translate(curX,curY);
        //draw bg
        offctx.save();
        offctx.beginPath();
        for (var i =0 ;i<tranedPoints.length;i++){
            if (i===0){
                offctx.moveTo(i*spacing+blankX,height-tranedPoints[i]-blankY);
            }else{
                offctx.lineTo(i*spacing+blankX,height-tranedPoints[i]-blankY);
            }
        }
        offctx.lineTo((i-1)*spacing+blankX,height-blankY);
        offctx.lineTo(blankX,height-blankY);
        offctx.closePath();
        offctx.clip();
        //draw bg
        this.drawBg(0,0,width,height,bgSlice.imgSrc,bgSlice.color);

        offctx.restore();
        //draw lines
        offctx.beginPath();
        for (var i =0 ;i<tranedPoints.length;i++){
            if (i===0){
                offctx.moveTo(i*spacing+blankX,height-tranedPoints[i]-blankY);
            }else{
                offctx.lineTo(i*spacing+blankX,height-tranedPoints[i]-blankY);
            }
        }
        //stroke
        offctx.strokeStyle=lineColor;
        offctx.stroke();
        offctx.restore();
    },
    drawGrid:function (curX, curY, width, height,offsetX, offsetY,gridWidth, gridHeight, gridStyle,minValue) {
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        var _offsetX = offsetX % (2*gridWidth);
        var _offsetY = offsetY % (2*gridHeight);
        var _gridWidth = gridWidth;
        var _gridHeight = gridHeight;
        var vertGrids = Math.floor((width - _offsetX)/_gridWidth)+1;
        var horiGrids = Math.floor((height - _offsetY)/_gridHeight)+1;
        //console.log('keke',width,height,gridWidth,gridHeight,_offsetX,_offsetY);
        offctx.save();
        offctx.translate(curX,curY);
        offctx.beginPath();
        //draw verts
        offctx.save();
        offctx.translate(_offsetX,0);
        if(gridStyle&&gridStyle.grid&&gridStyle.grid=='1'||gridStyle.grid=='3'){
            offctx.textAlign='center';
            offctx.textBaseline='top';
            offctx.fillStyle='rgba(255,255,255,1)';
            offctx.font='10px';
            var maxXValue =  gridStyle.gridInitValue+(vertGrids-1)*gridStyle.gridUnitX;
            var q = Math.floor(offctx.measureText(maxXValue).width/(2*gridWidth/3))+1;
            for (var i=0;i<vertGrids;i++){
                var vertX = i * _gridWidth;
                var xValue = gridStyle.gridInitValue+i*gridStyle.gridUnitX;
                offctx.moveTo(vertX,0);
                offctx.lineTo(vertX,height-_offsetY);
                if(i%q==0){
                    offctx.fillText(xValue,vertX,height-_offsetY+2);
                }
            }
        }
        offctx.restore();
        offctx.save();
        offctx.translate(_offsetX,height-_offsetY);
        if(gridStyle&&gridStyle.grid&&gridStyle.grid=='1'||gridStyle.grid=='2') {
            for (i = 0; i < horiGrids; i++) {
                var horiY = i * _gridHeight;
                var yValue = minValue+gridStyle.gridInitValue+i*gridStyle.gridUnitY;
                offctx.moveTo(0, -horiY);
                offctx.lineTo(width-_offsetX, -horiY);

                offctx.textAlign='right';
                offctx.textBaseline='middle';
                offctx.fillStyle='rgba(255,255,255,1)';
                offctx.font='10px';
                offctx.fillText(yValue,0-2, -horiY);
            }
        }
        offctx.restore();
        offctx.lineWidth =(gridStyle&&gridStyle.lineWidth)|| 1;
        offctx.strokeStyle = (gridStyle&&gridStyle.color) || 'lightgrey';
        offctx.stroke();
        offctx.restore();
    },
    drawLightStrip: function (curX, curY, width, height, minArc, curArc, image,clockWise,dashboardModeId) {
        //clip a fan shape
        // console.log(minArc, curArc);
        var wise = false;
        if(clockWise==-1){
            wise=true;
        }

        //var radius = this.calculateRadius(dashboardModeId,width,height);
        var radius = Math.max(width,height)/2;
        if (Math.abs(curArc - minArc) > 360) {
            //no need to clip
            this.drawBg(curX, curY, width, height, image, null)
        } else {
            var offcanvas = this.refs.offcanvas;
            var offctx = offcanvas.getContext('2d');
            offctx.save();
            offctx.beginPath();
            if(dashboardModeId=='1'){
                //clip
                offctx.moveTo(curX + 0.5 * width, curY + 0.5 * height);
                offctx.save();
                offctx.translate(curX + 0.5 * width, curY + 0.5 * height);
                offctx.rotate(Math.PI * minArc / 180)
                offctx.lineTo(0.5 * width, 0)
                offctx.restore()
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);

                offctx.lineTo(curX + 0.5 * width, curY + 0.5 * height)

            }else if(dashboardModeId=='2'){
                offctx.moveTo(curX + 0.5 * width, curY + 0.5 * height);
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);
                offctx.arc(curX + 0.5 * width, curY + 0.5 * height, radius * 3 / 4,Math.PI * curArc / 180, Math.PI * minArc / 180, !wise);
                offctx.closePath();
            }
            offctx.clip();
            this.drawBg(curX, curY, width, height, image, null)
            offctx.restore()
        }
    },
    calculateRadius:function (mode,width,height){
        var radius = mode=='1'?Math.sqrt(width*width+height*height)/2:Math.max(width,height)/2;
        radius= Math.floor(radius);
        return radius;
    },
    handleAlarmAction: function (curValue, widget, lowAlarm, highAlarm) {
        //handle action
        if (curValue >= highAlarm && widget.oldValue && widget.oldValue < highAlarm) {
            //enter high alarm
            widget.oldValue = curValue;

            this.handleTargetAction(widget, 'EnterHighAlarm');
        } else if (curValue < highAlarm && widget.oldValue && widget.oldValue >= highAlarm) {
            //leave high alarm
            widget.oldValue = curValue;
            this.handleTargetAction(widget, 'LeaveHighAlarm');
        } else if (curValue > lowAlarm && widget.oldValue && widget.oldValue <= lowAlarm) {
            //leave low alarm
            widget.oldValue = curValue
            this.handleTargetAction(widget, 'LeaveLowAlarm');

        } else if (curValue <= lowAlarm && widget.oldValue && widget.oldValue > lowAlarm) {
            widget.oldValue = curValue
            this.handleTargetAction(widget, 'EnterLowAlarm');
        }
    },
    drawRotateElem: function (x, y, w, h, elemWidth, elemHeight, arc, texSlice,transXratio,transYratio) {
        var transXratio = transXratio || 0;
        var transYratio = transYratio || 0;
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        offctx.save();
        offctx.rect(x,y,w,h);
        offctx.clip();

        //offctx.save();
        offctx.translate(x + 0.5 * w , y + 0.5 * h );
        offctx.rotate(Math.PI * arc / 180);
        offctx.translate(transXratio * elemWidth,transYratio * elemHeight);


        //draw color
        offctx.fillStyle = texSlice.color;
        offctx.fillRect(0,0,elemWidth,elemHeight);
        
        var image = this.getImageName(texSlice.imgSrc);
        if (image && image != '') {
            var imageList = this.state.imageList;
            for (var i = 0; i < imageList.length; i++) {
                if (imageList[i].id == image) {
                    // console.log(image);
                    // offctx.drawImage(imageList[i].content,0,0,w,h,x,y,w,h);
                    offctx.drawImage(imageList[i].content, 0, 0, elemWidth, elemHeight);
                    // offctx.drawImage(imageList[i].content,x,y,w,h)
                    break;
                }
            };

        }
        //offctx.restore();

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
        if (type && type == 'widget') {
            if (x >= target.info.left && x <= (target.info.left + target.info.width) && y >= target.info.top && y <= (target.info.top + target.info.height)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (x >= target.x && x <= (target.x + target.w) && y >= target.y && y <= (target.y + target.h)) {
                return true;
            } else {
                return false;
            }
        }

    },
    inRawRect: function (x, y, offsetX, offsetY, width, height) {
        if (x >= offsetX && x <= offsetX + width && y >= offsetY && y <= offsetY + height) {
            return true;
        } else {
            return false;
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
                var canvas = '';
                // console.log(page.canvasList);
                if (page.canvasList && page.canvasList.length) {
                    var canvasList = page.canvasList;
                    canvasList.sort(this.compareZIndex);
                    // console.log(canvasList);
                    for (var i = canvasList.length - 1; i >= 0; i--) {
                        // console.log(canvasList[i]);
                        if (this.inRect(x, y, canvasList[i])) {
                            // console.log('inrect');
                            targets.push(canvasList[i]);
                            canvas = canvasList[i];
                            break;
                        }
                    }

                }

                if (canvas == '') {
                    return targets;
                }

                //if widget clicked
                var subCanvas = '';
                //canvas.subCanvasList[canvas.curSubCanvasIdx];
                if (canvas.subCanvasList && canvas.subCanvasList.length) {
                    subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx];
                    if (subCanvas.widgetList && subCanvas.widgetList.length) {
                        var widgetList = subCanvas.widgetList;
                        widgetList.sort(this.compareZIndex);
                        for (var i = widgetList.length - 1; i >= 0; i--) {
                            if (this.inRect(x - canvas.x, y - canvas.y, widgetList[i], 'widget')) {
                                targets.push(widgetList[i]);
                                //handle widget like buttongroup
                                // console.log('inner rect',x-canvas.x,y-canvas.y,canvas);
                                this.handleInnerClickedElement(widgetList[i], x - canvas.x, y - canvas.y);
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
                            widget.curButtonIdx = i+1;
                            break;
                        }
                    }
                } else {

                    var singleHeight = (height - interval * (count - 1)) / count;
                    for (var i = 0; i < count; i++) {
                        if (y >= top + i * (singleHeight + interval) && y <= top + i * (singleHeight + interval) + singleHeight) {
                            widget.curButtonIdx = i+1;
                            break;
                        }
                    }
                }
                break;
            case 'MySlideBlock':

                x = x-left;
                y = y-top;
                //console.log('relative rect',x,y)
                this.handleSlideBlockInnerPress(widget,x,y);

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
                    if (widget.curValue[0]==='-'){
                        // -
                        if (widget.curValue.length<10){
                            widget.curValue += curKey.value;
                        }
                    }else{
                        // +
                        if (widget.curValue.length<9){
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
    handleSlideBlockInnerPress:function (widget,x,y) {
        var left = widget.info.left;
        var top = widget.info.top;
        var width = widget.info.width;
        var height = widget.info.height;
        var hori = widget.info.arrange == 'horizontal';
        if (!widget.slideSize){

            var defaultSize = hori? height:width;
            widget.slideSize = this.getImageSize(widget.texList[1].slices[0].imgSrc,defaultSize,defaultSize);

        }

        var curValue=0;
        var bgRange;
        if (hori){
            bgRange = (width - widget.slideSize.w)||1;
            curValue = (x-0.5*widget.slideSize.w)/bgRange * (widget.info.maxValue-widget.info.minValue)+widget.info.minValue;
            // console.log(curValue,x)
        }else{
            bgRange = (height - widget.slideSize.h)||1;
            curValue = (height-y-0.5*widget.slideSize.h)/bgRange * (widget.info.maxValue-widget.info.minValue)+widget.info.minValue;
        }
        curValue = parseInt(curValue);
        curValue = this.limitValueBetween(curValue,widget.info.minValue,widget.info.maxValue);
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

        var targets = this.findClickTargets(x, y);
        this.state.currentPressedTargets = targets;
        // console.log(targets);
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].type == 'widget') {
                this.handleWidgetPress(targets[i], _.cloneDeep(this.mouseState));
                this.handleTargetAction(targets[i], 'Press');

            }
        }

    },
    handleOk: function (type) {
        var page = this.state.project.pageList[this.state.curPageIdx];
        if (page && page.linkedWidgets && page.curHighlightIdx != undefined) {
            //has highlight
            var curLinkWidget = page.linkedWidgets[page.curHighlightIdx];
            switch (curLinkWidget.type) {
                case 'MyButtonGroup':
                    curLinkWidget.target.curButtonIdx = curLinkWidget.value + 1;
                    break;
                case 'MyDateTime':

                    if (type === 'release'){

                        if (this.simState.inModifingState){
                            this.simState.inModifingState = false;
                        }else{
                            this.simState.inModifingState = true;
                        }
                    }
                    break;
            }

            this.mouseState.position.x = 0;
            this.mouseState.position.y = 0;
            if (type === 'press') {
                this.mouseState.state = 'press';
                this.handleWidgetPress(curLinkWidget.target, _.cloneDeep(this.mouseState));
                this.handleTargetAction(curLinkWidget.target, 'Press');
            } else if (type === 'release') {
                this.mouseState.state = 'release';
                this.handleElementRelease(curLinkWidget.target, _.cloneDeep(this.mouseState));
                this.handleTargetAction(curLinkWidget.target, 'Release');
            }





        }
    },
    handleModifyHighlightingWidget:function (widget,direction) {
        switch (widget.subType){
            case 'MyDateTime':

                if (direction=='right'){
                    direction = 1;
                }else{
                    direction = -1;
                }
                //handle time modifing
                var curDate = new Date();
                var curOffset = 0;
                var curWidgetDate = new Date(curDate.getTime() + (widget.timeOffset||0)); // cur displaying time
                var oldWidgetDateStr = curWidgetDate.toString();
                var oldWidgetDateTime = curWidgetDate.getTime();
                // console.log(curWidgetDate,oldWidgetDateStr);
                //changed to time
                var changedDateTypes=['year','month','day','hour','minute','second'];
                var changedType;
                if (widget.info.dateTimeModeId=='0'){
                    changedType = changedDateTypes[widget.highlightValue+3];
                }else if (widget.info.dateTimeModeId == '1'){
                    changedType = changedDateTypes[widget.highlightValue+3];
                }else{
                    changedType = changedDateTypes[widget.highlightValue];
                }
                switch (changedType){
                    case 'year':
                        curWidgetDate.setFullYear(curWidgetDate.getFullYear()+direction);

                        break;
                    case 'month':
                        curWidgetDate.setMonth(curWidgetDate.getMonth()+direction);

                        break;
                    case 'day':
                        curWidgetDate.setDate(curWidgetDate.getDate()+direction);

                        break;
                    case 'hour':
                        curWidgetDate.setHours(curWidgetDate.getHours()+direction);

                        break;
                    case 'minute':
                        curWidgetDate.setMinutes(curWidgetDate.getMinutes()+direction);

                        break;
                    case 'second':
                        curWidgetDate.setSeconds(curWidgetDate.getSeconds()+direction);

                        break;
                }
                curOffset = curWidgetDate.getTime() - oldWidgetDateTime;
                // console.log(curWidgetDate,oldWidgetDateStr,curOffset);
                widget.timeOffset = widget.timeOffset||0;
                widget.timeOffset += curOffset;

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
        // console.log(page);
        if (this.simState.inModifingState){
            //handle modifing highlighted widget
            if (page && page.linkedWidgets){
                var targetWidget = page.linkedWidgets[page.curHighlightIdx].target;
                this.handleModifyHighlightingWidget(targetWidget,direction);
            }
        }else{
            if (page && page.linkedWidgets) {
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


    },
    getRelativeRect:function (e) {
        var clientRect = e.target.getBoundingClientRect()
        var x = Math.round(e.pageX - clientRect.left);
        var y = Math.round(e.pageY - clientRect.top);

        return {
            x:x,
            y:y
        }
    },
    handleMove:function (e) {
        var relativeRect = this.getRelativeRect(e);
        var x = relativeRect.x;
        var y = relativeRect.y;

        this.mouseState.position.x = x;
        this.mouseState.position.y = y;

        if (this.mouseState.state==='press'||this.mouseState.state==='dragging'){
            this.mouseState.state = 'dragging';
            this.handleDragging(_.cloneDeep(this.mouseState));
        }else{
            this.mouseState.state = 'move';
        }
    },
    handleHolding:function () {

    },
    handleDragging:function (mouseState) {
        var targets = this.state.currentPressedTargets;
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].type == 'widget') {
                this.handleWidgetDrag(targets[i], mouseState);
                this.handleTargetAction(targets[i], 'drag');

            }
        }
    },
    handleWidgetDrag:function (widget,mouseState) {
        var subType = widget.subType;
        var left = widget.info.left;
        var top = widget.info.top;
        var relativeX = mouseState.position.x-widget.parentX-left;
        var relativeY = mouseState.position.y-widget.parentY-top;
        var needRedraw = false;
        switch (subType){
            case 'MySlideBlock':
                this.handleSlideBlockInnerPress(widget,relativeX,relativeY);
                widget.mouseState = mouseState;
                needRedraw = true;
                this.setTagByName(widget.tag,widget.curValue||0);
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

            default:
                widget.mouseState = mouseState;
                needRedraw = true;
        }
        if (needRedraw) {
            this.drawAfterMouseAction(mouseState);
        }
    },
    getImageSize:function (imgName,defaultValueW,defaultValueH) {
        var img  = this.getImage(imgName);
        img = (img && img.content) || null;
        if (!!img){
            // console.log(img,img.width,img.height)
            return {
                w:img.width,
                h:img.height
            }
        }else{
            return {
                w:defaultValueW,
                h:defaultValueH
            }
        }
    },
    handleRelease: function (e) {
        var x = Math.round(e.pageX - e.target.offsetLeft);
        var y = Math.round(e.pageY - e.target.offsetTop);
        this.mouseState.state = 'release';
        this.mouseState.position.x = x;
        this.mouseState.position.y = y;

        var pressedTargets = this.state.currentPressedTargets;

        for (var i = 0; i < pressedTargets.length; i++) {
            this.handleElementRelease(pressedTargets[i], _.cloneDeep(this.mouseState));
            this.handleTargetAction(pressedTargets[i], 'Release');
        }
        this.state.currentPressedTargets = []


    },
    handleElementRelease: function (elem, mouseState) {
        var needRedraw = false;
        switch (elem.type) {
            case 'widget':
                switch (elem.subType) {
                    case 'MyButton':
                        elem.mouseState = mouseState;
                        needRedraw = true;
                        break;
                    case 'MyInputKeyboard':
                        elem.mouseState = mouseState;
                        elem.curPressedKey = null;
                        needRedraw = true;
                        break;
                }
                break;
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
        if (target.actions && target.actions.length) {
            for (var i = 0; i < target.actions.length; i++) {
                if (target.actions[i].trigger == type) {
                    var curCmds = target.actions[i].commands;
                    //console.log(curCmds)
                    this.processCmds(curCmds);

                }
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
        var tag = this.findTagByName(name)
        if (tag) {
            tag.value = value
            this.setState({tag: tag})
        }
    },
    setTagByTag: function (tag, value) {
        if (tag) {
            tag.value = value
            this.setState({tag: tag})
        }
    },
    timerFlag: function (param) {
        if (param&&param.tag){
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
        if (cmds && cmds.length){
            // console.log(cmds);
            this.process(cmds,0);
        }

    },
    getParamValue:function (param) {
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
        if ((typeof param) === 'number'){
            value = param;
        }else{
            if (param){
                if (param.tag){
                    value = Number(this.getValueByTagName(param.tag));
                }else{
                    value = Number(param.value);
                }
            }else{
                value = 0;
            }
        }
        // console.log(value,param,(typeof param));
        return value;
    },
    process: function (cmds,index) {
        var cmdsLength = cmds.length;
        if (index>=cmdsLength){
            return;
        }else if (index<0){
            console.log('processing error');
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
            process:true,
            step:1
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
                        this.draw(null,{
                            updatedTagName:project.tag
                        });
                    } else if (param2Value === -2) {
                        //input keyboard
                        this.inputKeyboard.widget.returnPageId = curPageTag.value;
                        this.inputKeyboard.widget.targetTag = param1.tag;
                        this.inputKeyboard.widget.curValue = '' + this.getParamValue(param1);
                        this.setTagByTag(curPageTag, project.pageList.length);
                        this.draw(null, {
                            updatedTagName: project.tag
                        });
                    }
                }
                //next
                nextStep.process = false;

                break;
            case 'INC':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    var nextValue = targetTag.value + Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }

                break;
            case 'DEC':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value - Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'MUL':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value * Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'DIV':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value / Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'MOD':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value % Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'OR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value | Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'XOR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value ^ Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'NOT':
                // var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = !Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'AND':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value & Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'SL':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value << Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'SR':
                var targetTag = this.findTagByName(param1.tag);
                if (targetTag) {
                    var nextValue = targetTag.value >> Number(this.getParamValue(param2));
                    this.setTagByTag(targetTag, nextValue)
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'SET':

                var targetTag = this.findTagByName(param1.tag);

                if (targetTag) {
                    // targetTag.value = parseInt(param2);
                    this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            //compare
            case 'EQ':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue == secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'NEQ':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue != secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'GT':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                //console.log(param1);
                //console.log('GT',firstValue,secondValue);
                if (firstValue > secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'GTE':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue >= secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'LT':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue < secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'LTE':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue <= secondValue){
                    nextStep.step = 2;
                }else{
                    nextStep.step = 1;
                }
                break;
            case 'JUMP':
                nextStep.step = Number(this.getParamValue(param2));
                break;
            case 'END':
                break;
            case 'SET_TIMER_START':
                if (timerFlag != -1){
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Start');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag,'Start',Number(this.getParamValue(param2)))
                }

                break;
            case 'SET_TIMER_STOP':
                if (timerFlag!=-1){
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Stop');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag,'Stop',Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_STEP':
                if (timerFlag!=-1){
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Step');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag,'Step',Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_INTERVAL':
                if (timerFlag!=-1){
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Interval');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag,'Interval',Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_CURVAL':
                if (timerFlag!=-1){
                    var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_t');

                    if (targetTag) {
                        // targetTag.value = parseInt(param2);
                        this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                        this.draw(null,{
                            updatedTagName:param1.tag
                        });
                    }
                    // this.handleTimers(timerFlag,'CurVal',Number(this.getParamValue(param2)))
                }
                break;
            case 'SET_TIMER_MODE':
                if (timerFlag!=-1){
                    // var targetTag = this.findTagByName('SysTmr_'+timerFlag+'_Mode');
                    //
                    // if (targetTag) {
                    //     // targetTag.value = parseInt(param2);
                    //     this.setTagByTag(targetTag, Number(this.getParamValue(param2)))
                    //     this.draw(null,{
                    //         updatedTagName:param1.tag
                    //     });
                    // }
                    this.handleTimers(timerFlag,'Mode',Number(this.getParamValue(param2)))
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

        }
        //handle timer
        // if (timerFlag != -1) {
        //     this.handleTimers(timerFlag);
        // }

        //process next
        if (nextStep.process){
            this.process(cmds,index+nextStep.step);
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
                    this.setTagByTag(tag, register.value);
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
            this.draw(null,{
                updatedTagName:tagList[curTagIdx].name
            })
        }
    },
    handleRegisterChange: function (key, value) {
        var registers = this.state.registers;
        registers[key].value = value;
        this.setState({registers: registers});
    },
    render: function () {
        // console.log('registers',this.state.registers);
        return (
            < div className='simulator'>
                < div className='canvas-wrapper col-md-9' onMouseDown={this.handlePress} onMouseMove={this.handleMove} onMouseUp={this.handleRelease}>
                    <canvas ref='canvas' className='simulator-canvas' />
                    < canvas ref='offcanvas' hidden className='simulator-offcanvas' />
                    < canvas ref='tempcanvas' hidden className='simulator-tempcanvas'/>
                </div>
                <div className="phical-keyboard-wrapper">
                    <button onClick={this.handleMoveNext.bind(null, 'left')}> &lt; </button>
                    <button onMouseDown={this.handleOk.bind(null, 'press')}
                            onMouseUp={this.handleOk.bind(null, 'release')}>OK
                    </button>
                    <button onClick={this.handleMoveNext.bind(null, 'right')}> &gt; </button>

                </div>
                < TagList tagList={_.cloneDeep(this.state.tagList)} updateTag={this.updateTag}/>
                <RegisterList registers={this.state.registers || {}} handleRegisterChange={this.handleRegisterChange}/>
            </div >);
    }
});