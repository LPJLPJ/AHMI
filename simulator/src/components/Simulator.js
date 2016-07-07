var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var TagList = require('./TagList');
var LoadState = require('./LoadState')
var defaultState = {
    loadDone: false,
    curPageIdx: 0,
    tagList: [],
    resourceList: [],
    imageList: [],
    timerList: [],
    currentPressedTargets: []

};

var defaultSimulator = {
    project: {},
    curPageIdx: 0,
    scale: 1.0,
    tagList: [],
    resourceList: [],
    imageList: [],
    timerList: [],
    currentPressedTargets: [],
    totalResourceNum: 0
}
module.exports = React.createClass({
    getInitialState: function () {
        return _.cloneDeep(defaultSimulator)
    },
    initCanvas: function (data, callBack) {
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


        var ctx = canvas.getContext('2d');
        ctx.font = "italic bold 48px serif";
        ctx.fillStyle = "white";
        ctx.fillText("加载中...", 0.5 * projectWidth, 0.5 * projectHeight);


        //initialize tagList
        //check curPage tag


        var curPageTag = {
            name: '当前页面序号',
            register: true,
            writeOrRead: 'true',
            indexOfRegister: -1,
            value: 0
        };


        data.tagList.push(curPageTag);
        data.tag = '当前页面序号';
        // this.state.tagList = data.tagList
        this.setState({tagList: data.tagList})
        console.log('tagList loaded', data.tagList)

        //initialize timer
        var timerList = this.state.timerList;
        // var postfix = ['Start','Stop','Step','Interval','CurVal','Mode'];
        for (var i = 0; i < parseInt(data.timers); i++) {
            var newTimer = {};
            newTimer['timerID'] = 0;
            newTimer['SysTmr_' + i + '_Start'] = 0;
            newTimer['SysTmr_' + i + '_Stop'] = 0;
            newTimer['SysTmr_' + i + '_Step'] = 0;
            newTimer['SysTmr_' + i + '_CurVal'] = 0;
            newTimer['SysTmr_' + i + '_Interval'] = 0;
            newTimer['SysTmr_' + i + '_Mode'] = 0;
            timerList.push(newTimer);
        }

        this.state.timerList = timerList
        console.log('timerList loaded', timerList)

        //loading resources
        var resourceList = [];
        var imageList = []
        var allResources = data.resourceList || [];
        this.state.resourceList = resourceList
        this.state.imageList = imageList
        var basicUrl = data.basicUrl;
        var num = allResources.length;
        this.state.totalResourceNum = num;
        if (num > 0) {
            allResources.map(function (resource) {
                var newResource = {};
                newResource.id = resource.id;
                newResource.name = resource.name;
                newResource.type = resource.type;
                switch (resource.type.split('/')[0]) {
                    case 'image':
                        var newImg = new Image();
                        newImg.src = resource.src;
                        newImg.onload = function () {
                            num = num - 1;
                            //update loading progress
                            this.drawLoadingProgress(this.state.totalResourceNum, num, true, projectWidth, projectHeight)
                            if (num == 0) {
                                callBack(data);
                            }
                            ;
                        }.bind(this);
                        newResource.content = newImg;
                        imageList.push(newResource)
                        break;
                    default:
                        num = num - 1
                        this.drawLoadingProgress(this.state.totalResourceNum, num, true)

                        //update loading progress
                        break;

                }

                resourceList.push(newResource);

            }.bind(this));
        } else {
            callBack(data)
        }
    },
    initProject: function () {

        if (this.state.project && this.state.project.size) {
            this.initCanvas(this.state.project, this.draw);
        } else {
            this.draw();
        }
    },
    componentDidMount: function () {
        //this.load();
        this.state = _.cloneDeep(defaultSimulator);
        this.state.project = _.cloneDeep(this.props.projectData);
        console.log('receive new project data', this.state.project)

        this.initProject();

    },
    componentWillReceiveProps: function (newProps) {
        this.state = _.cloneDeep(defaultSimulator);
        this.state.project = _.cloneDeep(newProps.projectData);
        this.initProject();
        console.log('receive new project data', this.state.project)

    },
    drawLoadingProgress: function (total, currentValue, countDown, projectWidth, projectHeight) {
        var progress = '0.0%';
        if (countDown && countDown == true) {
            progress = '' + (total - currentValue) * 100.0 / total + '%'
        } else {
            progress = '' + currentValue * 100.0 / total + '%'
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

            //handle unload
            for (var i = 0; i < project.pageList.length; i++) {
                if (project.pageList[i].state && project.pageList[i].state == LoadState.loaded) {
                    if (i != curPageIdx) {
                        //handle unload
                        this.handleTargetAction(project.pageList[i], 'Unload')
                        break
                    }
                }
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
    getValueByTagName: function (name, defaultValue) {
        var curTag = this.findTagByName(name);
        if (curTag && curTag.value != undefined) {
            return curTag.value;
        } else if (defaultValue) {
            return defaultValue;
        } else {
            return null
        }

    },
    compareZIndex: function (canvasA, canvasB) {
        return (canvasA.zIndex || 0) - (canvasB.zIndex || 0);
    },
    drawPage: function (page, options) {
        //will load
        if (!page.state || page.state == LoadState.notLoad) {
            page.state = LoadState.willLoad
            //generate load trigger
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
            ;
        }
        ;


        page.state = LoadState.loaded


    },
    handleTimers: function (num) {

        var timerList = this.state.timerList;
        var timer = timerList[num];
        //update timer
        var postfix = ['Start', 'Stop', 'Step', 'Interval', 'CurVal', 'Mode'];
        for (var i = 0; i < postfix.length; i++) {
            var key = 'SysTmr_' + num + '_' + postfix[i];
            var curTag = this.findTagByName(key);
            console.log(curTag,timerList);
            timer[key] = (curTag&&curTag.value) || 0;
            // timer[key] = this.findTagByName(key)['value'] || 0;
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
            console.log('start');
            // timer['SysTmr_'+num+'_CurVal'] = timer['SysTmr_'+num+'_Start'];
            var targetTag = this.findTagByName('SysTmr_' + num + '_CurVal');
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

                    if (targetTag.name != '') {
                        targetTag.value -= timer['SysTmr_' + num + '_Step'];
                        if (targetTag.value < timer['SysTmr_' + num + '_Stop']) {
                            //clear timer
                            clearInterval(timer.timerID);
                            timer.timerID = 0;
                        } else {
                            this.draw()
                        }

                    }
                } else {
                    if (targetTag.name != '') {
                        targetTag.value += timer['SysTmr_' + num + '_Step'];
                        if (targetTag.value > timer['SysTmr_' + num + '_Stop']) {
                            //clear timer
                            clearInterval(timer.timerID);
                            timer.timerID = 0;
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
        var canvasTag = this.findTagByName(canvasData.tag && canvasData.tag.name);
        var nextSubCanvasIdx = (canvasTag && canvasTag.value) || 0;
        canvasData.curSubCanvasIdx = nextSubCanvasIdx
        //handle unload subcanvas
        // if (canvasData.curSubCanvasIdx != nextSubCanvasIdx) {
        // 	//unload lastsubcanvas
        // 	this.handleTargetAction(canvasData,'Unload');
        // }
        // canvasData.curSubCanvasIdx = nextSubCanvasIdx;
        // var subCanvas = subCanvasList[canvasData.curSubCanvasIdx];
        for (var i = 0; i < subCanvasList.length; i++) {
            if (subCanvasList[i].state && subCanvasList[i].state == LoadState.loaded) {
                if ((nextSubCanvasIdx - 1 ) != i) {
                    //another sc loaded
                    //unload sc of i
                    this.handleTargetAction(subCanvasList[i], 'Unload')
                    break
                }
            }
        }
        var subCanvas = subCanvasList[nextSubCanvasIdx];
        if (subCanvas) {
            this.drawSubCanvas(subCanvas, canvasData.x, canvasData.y, canvasData.w, canvasData.h, options);


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
        }
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
        var text = widget.info.buttonText;
        var font = {};
        font['font-style'] = widget.info.buttonFontItalic;
        font['font-weight'] = widget.info.buttonFontBold;
        font['font-size'] = widget.info.buttonFontSize;
        font['font-family'] = widget.info.buttonFontFamily;
        font['font-color'] = widget.info.buttonFontColor;
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
            console.log('drawing color progress',widget.info.progressModeId);
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
                    var mixedColor = this.addTwoColor(progressSlice.color,lastSlice.color,curScale);

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
            console.log(widget.curValue);
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
                        slideRatio = (height-slideImg.height)*1.0/height;
                        this.drawCursor(curX,curY+ height * (1.0 - curScale*slideRatio)+0.5*slideImg.height,width,height,false,height*(1-curScale*slideRatio),slideSlice.imgSrc,slideSlice.color);
                        break;
                    case 'horizontal':
                    default:
                        // console.log(slideRatio,curScale);
                        slideRatio = (width-slideImg.width)*1.0/width;

                        this.drawCursor(curScale*(width-slideImg.width)+curX,curY,width,height,true,width-curScale*(width-slideImg.width),slideSlice.imgSrc,slideSlice.color);
                        break
                }
            }




            //handle action
            this.handleAlarmAction(curSlide, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
            widget.oldValue = curSlide;

        }
    },
    drawCursor:function (beginX, beginY, width, height, align,alignLimit, img,color) {

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
    drawTime:function (curX,curY,widget,options) {
        var width = widget.info.width;
        var height = widget.info.height;
        var dateTimeModeId = widget.info.dateTimeModeId;
        var curDate = new Date();
        var dateTimeString = '';
        if (dateTimeModeId == '0'){
            //time
            dateTimeString = this.getCurTime(curDate);
        }else{
            //date
            dateTimeString = this.getCurDate(curDate);
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
        tempctx.font = '24px arial';
        tempctx.fillText(dateTimeString,0.5*width,0.5*height);
        tempctx.restore();
        offctx.drawImage(tempcanvas,curX,curY,width,height);

        //timer 1 s
        if (!(widget.timerId && widget.timerId!==0)){
            widget.timerId = setInterval(function () {
                this.draw();
            }.bind(this),1000)
        }
    },
    getCurTime:function (date) {
        var date = date||new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return ''+hour+':'+minute+':'+second;
    },
    getCurDate:function (date) {
        var date = date||new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDay();
        return ''+year+'/'+month+'/'+day;
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
    findValue: function (array, key1, value, key2) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key1] == value) {
                return array[i][key2];

            }
        }
    },
    limitValueBetween: function (curVal, minVal, maxVal) {
        if (curVal < minVal) {
            return minVal
        } else if (curVal > maxVal) {
            return maxVal
        } else {
            return curVal
        }
    },
    multiDigits: function (digit, num) {
        var result = ''
        for (var i = 0; i < num; i++) {
            result += String(digit)
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
        // console.log(widget.info);
        var offcanvas = this.refs.offcanvas
        var offctx = offcanvas.getContext('2d')
        //get current value
        var curValue = this.getValueByTagName(widget.tag)
        var minValue = widget.info.minValue
        var maxValue = widget.info.maxValue
        var lowAlarmValue = widget.info.lowAlarmValue
        var highAlarmValue = widget.info.highAlarmValue
        var numModeId = widget.info.numModeId
        var frontZeroMode = widget.info.frontZeroMode
        var symbolMode = widget.info.symbolMode
        var decimalCount = widget.info.decimalCount || 0
        var numOfDigits = widget.info.numOfDigits
        var numFamily = widget.info.numFamily
        var numSize = widget.info.numSize
        var numColor = widget.info.numColor
        var numBold = widget.info.numBold
        var numItalic = widget.info.numItalic
        //size
        var curWidth = widget.info.width;
        var curHeight = widget.info.height;

        var tempcanvas = this.refs.tempcanvas
        tempcanvas.width = curWidth
        tempcanvas.height = curHeight
        var tempCtx = tempcanvas.getContext('2d')
        tempCtx.clearRect(0, 0, curWidth, curHeight)
        //offCtx.scale(1/this.scaleX,1/this.scaleY);
        var numString = numItalic + " " + numBold + " " + numSize + "px" + " " + numFamily;
        //offCtx.fillStyle = this.numColor;
        tempCtx.font = numString;
        tempCtx.textAlign = widget.info.align||'center';
        tempCtx.textBaseline= 'middle';
        // console.log(curValue);

        widget.oldValue = widget.oldValue || 0

        if (curValue != undefined && curValue != null) {
            //offCtx.save();
            //handle action before
            curValue = this.limitValueBetween(curValue, minValue, maxValue)
            if (numModeId == '0' || (numModeId == '1' && widget.oldValue != undefined && widget.oldValue == curValue)) {


                var tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode)


                //drawbackground
                var bgTex = widget.texList[0].slices[0]
                // this.drawBg(0,0,curWidth,curHeight,bgTex.imgSrc,bgTex.color,tempCtx)
                // tempCtx.globalCompositeOperation = "destination-in";
                // console.log(tempNumValue);
                // tempCtx.fillText(tempNumValue, curWidth/2, curHeight/2+numSize/4);
                // // tempCtx.fillText(tempNumValue,0,)
                // tempCtx.restore()
                this.drawStyleString(tempNumValue, curWidth, curHeight, numSize, bgTex, tempCtx)
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
                this.drawStyleString(tempNumValue, curWidth, curHeight, numSize, bgTex, tempCtx)
                var oldHeight = (totalFrameNum - widget.curFrameNum) * 1.0 / totalFrameNum * curHeight
                offctx.drawImage(tempcanvas, 0, 0, curWidth, oldHeight, curX, curY + curHeight - oldHeight, curWidth, oldHeight)

                var tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode)
                this.drawStyleString(tempNumValue, curWidth, curHeight, numSize, bgTex, tempCtx)
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
    drawStyleString: function (tempNumValue, curWidth, curHeight, numSize, bgTex, tempCtx) {
        tempCtx.clearRect(0, 0, curWidth, curHeight)
        tempCtx.save()
        this.drawBg(0, 0, curWidth, curHeight, bgTex.imgSrc, bgTex.color, tempCtx)
        tempCtx.globalCompositeOperation = "destination-in";
        // console.log(tempNumValue);
        tempCtx.fillText(tempNumValue, curWidth / 2, curHeight / 2 );
        // tempCtx.fillText(tempNumValue,0,)
        tempCtx.restore()
    },
    generateStyleString: function (curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode) {
        var tempNumValue = String(curValue)
        console.log(tempNumValue);
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
                intPart = this.changeNumDigits(intPart, intDigits, ' ', true)
            }
            if (tempNumValue.split('.').length > 1) {
                tempNumValue = intPart + '.' + fracPart;
            } else {
                tempNumValue = intPart
            }
        }

        //配置正负号
        if (symbolMode == '1') {
            var value = parseFloat(tempNumValue)
            var symbol = ''
            if (value > 0) {
                symbol = '+'
            } else if (value < 0) {
                symbol = '-'
            }
            tempNumValue = symbol + tempNumValue
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
            var minArc = widget.info.minValue;
            var maxArc = widget.info.maxValue;
            // var curArc = widget.info.value;
            var curDashboardTag = this.findTagByName(widget.tag);
            var curArc = (curDashboardTag && curDashboardTag.value) || 0;
            var clockwise = widget.info.clockwise == '1'?1:-1;
            var lowAlarm = widget.info.lowAlarmValue;
            var highAlarm = widget.info.highAlarmValue;
            var pointerLength = widget.info.pointerLength;
            var pointerWidth,pointerHeight;
            pointerWidth=pointerLength / Math.sqrt(2);
            pointerHeight = pointerWidth;


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
            } else {
                // complex mode
                //background
                var bgTex = widget.texList[0].slices[0];
                this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color);
                //draw light strip
                var lightStripTex = widget.texList[2].slices[0]
                this.drawLightStrip(curX, curY, width, height, minArc + 90 + offset, curArc + 90 + offset, widget.texList[2].slices[0].imgSrc)
                //draw pointer
                this.drawRotateElem(curX, curY, width, height, pointerWidth, pointerHeight, clockwise*(curArc + offset)+arcPhase, widget.texList[1].slices[0]);

                //draw circle
                // var circleTex = widget.texList[3].slices[0]
                // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)

            }


            this.handleAlarmAction(curArc, widget, lowAlarm, highAlarm);
            widget.oldValue = curArc;

        }
    },
    drawRotateImg: function (curX, curY, widget, options) {

        var width = widget.info.width;
        var height = widget.info.height;
        if (widget.texList) {

            //pointer
            var minArc = widget.info.minValue;
            var maxArc = widget.info.maxValue;
            // var curArc = widget.info.value;
            var curArc = this.getValueByTagName(widget.tag,0);

            var lowAlarm = widget.info.lowAlarmValue;
            var highAlarm = widget.info.highAlarmValue;


            if (curArc > maxArc) {
                curArc = maxArc
            } else if (curArc < minArc) {
                curArc = minArc;
            }
            this.drawRotateElem(curX, curY, width, height, width, height, curArc , widget.texList[0].slices[0],-0.5,-0.5);


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

            var newPoint = false;
            var curValue;

            if (!widget.maxPoints){
                var maxPoints = Math.floor(width/spacing)+1;
                widget.maxPoints = maxPoints;
                widget.flag = -1;
                widget.curPoints = [];
            }

            if (options && (options.updatedTagName==widget.tag)){
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
            this.drawGrid(curX,curY,width,height,0,0,1.2*spacing,1.2*spacing);
            //draw points lines

            var coverSlice = widget.texList[1].slices[0];
            this.drawPointsLine(curX,curY,width,height,spacing,widget.curPoints,minValue,maxValue,coverSlice);

            //handle action
            if (newPoint){
                this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
                widget.oldValue = curValue;
            }


        }
    },
    drawPointsLine:function (curX, curY, width, height,spacing,points,minValue, maxValue,bgSlice) {
        var tranedPoints = points.map(function (point) {
            return 1.0*(point-minValue)/(maxValue-minValue)*height;
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
                offctx.moveTo(i*spacing,height-tranedPoints[i]);
            }else{
                offctx.lineTo(i*spacing,height-tranedPoints[i]);
            }
        }
        offctx.lineTo((i-1)*spacing,height);
        offctx.lineTo(0,height);
        offctx.closePath();
        offctx.clip();
        //draw bg
        this.drawBg(0,0,width,height,bgSlice.imgSrc,bgSlice.color);

        offctx.restore();
        //draw lines
        offctx.beginPath();
        for (var i =0 ;i<tranedPoints.length;i++){
            if (i===0){
                offctx.moveTo(i*spacing,height-tranedPoints[i]);
            }else{
                offctx.lineTo(i*spacing,height-tranedPoints[i]);
            }
        }
        //stroke
        offctx.stroke();
        offctx.restore();
    },
    drawGrid:function (curX, curY, width, height,offsetX, offsetY,gridWidth, gridHeight, gridStyle) {
        var offsetX = offsetX % gridWidth;
        var offsetY = offsetY % gridHeight;
        var vertGrids = Math.floor((width - offsetX)/gridWidth)+1;
        var horiGrids = Math.floor((height - offsetY)/gridHeight)+1;
        var offcanvas = this.refs.offcanvas;
        var offctx = offcanvas.getContext('2d');
        offctx.save();
        offctx.translate(curX,curY);
        offctx.beginPath();
        //draw verts
        for (var i=0;i<vertGrids;i++){
            var vertX = i * gridWidth + offsetX;
            offctx.moveTo(vertX,0);
            offctx.lineTo(vertX,height);
        }
        for (var i=0;i<horiGrids;i++){
            var horiY = i * gridHeight + offsetY;
            offctx.moveTo(0,horiY);
            offctx.lineTo(width,horiY);
        }
        offctx.fillStyle = (gridStyle&&gridStyle.color) || 'light gray';
        offctx.stroke();
        offctx.restore();
    },
    drawLightStrip: function (curX, curY, width, height, minArc, curArc, image) {
        //clip a fan shape
        // console.log(minArc, curArc);
        if (Math.abs(curArc - minArc) > 360) {
            //no need to clip
            this.drawBg(curX, curY, width, height, image, null)
        } else {
            //clip
            var offcanvas = this.refs.offcanvas;
            var offctx = offcanvas.getContext('2d');
            offctx.save();
            offctx.beginPath()
            offctx.moveTo(curX + 0.5 * width, curY + 0.5 * height)
            offctx.save()
            offctx.translate(curX + 0.5 * width, curY + 0.5 * height)
            offctx.rotate(Math.PI * minArc / 180)
            offctx.lineTo(0.5 * width, 0)
            offctx.restore()
            offctx.arc(curX + 0.5 * width, curY + 0.5 * height, 0.5 * width, Math.PI * minArc / 180, Math.PI * curArc / 180, false)

            offctx.lineTo(curX + 0.5 * width, curY + 0.5 * height)

            offctx.clip()
            this.drawBg(curX, curY, width, height, image, null)
            offctx.restore()

        }
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
            offctx.fillStyle = color;
            offctx.fillRect(x, y, w, h);
        }

    },
    drawBgImg: function (x, y, w, h, imageName, ctx) {
        //console.log('x: '+x+' y: '+y+' w: '+w+' h: '+h);
        var imageName = this.getImageName(imageName)
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
            var names = imageName.split('/')
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
                    ;
                }
                ;
                if (canvas == '') {
                    return targets;
                }
                ;
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
                        ;
                    }
                    ;
                }
                ;

                return targets;
            }
            ;
        }
        ;

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
                console.log('relative rect',x,y)
                this.handleSlideBlockInnerPress(widget,x,y);

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
        }else{
            bgRange = (height - widget.slideSize.h)||1;
            curValue = (height-y-0.5*widget.slideSize.h)/bgRange * (widget.info.maxValue-widget.info.minValue)+widget.info.minValue;
        }
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
                    this.setTagByTag(targetTag, parseInt(curButtonIdx));
                }
                widget.mouseState = mouseState;
                needRedraw = true;

                break;
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
            console.log(cmds);
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
        console.log('inst: ',inst[0],inst[1],inst[2]);

        var op = inst[0].name;
        var param1 = inst[1];
        var param2 = inst[2];
        //timer?
        var timerFlag = -1;
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
                //     //handle unload
                //     this.handleTargetAction(lastPage, 'Unload');


                // }
                var param2Value = this.getParamValue(param2);
                if (curPageTag) {
                    if (param2Value > 0 && param2Value <= project.pageList.length) {
                        // curPageTag.value = param2;
                        this.setTagByTag(curPageTag, param2Value);
                        this.draw(null,{
                            updatedTagName:project.tag
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
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'NEQ':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue != secondValue){
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'GT':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                console.log(param1);
                console.log('GT',firstValue,secondValue);
                if (firstValue > secondValue){
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'GTE':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue >= secondValue){
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'LT':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue < secondValue){
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'LTE':
                var firstValue = Number(this.getValueByTagName(param1.tag,0));
                var secondValue = Number(this.getParamValue(param2));
                if (firstValue <= secondValue){
                    nextStep.step = 1;
                }else{
                    nextStep.step = 2;
                }
                break;
            case 'JUMP':
                nextStep.step = Number(this.getParamValue(param2));
                break;
            case 'END':
                break;



        }
        //handle timer
        if (timerFlag != -1) {
            this.handleTimers(timerFlag);
        }

        //process next
        if (nextStep.process){
            this.process(cmds,index+nextStep.step);
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
    render: function () {

        return (
            < div className='simulator'>
                < div className='canvas-wrapper col-md-9' onMouseDown={this.handlePress} onMouseMove={this.handleMove} onMouseUp={this.handleRelease}>
                    <canvas ref='canvas' className='simulator-canvas' />
                    < canvas ref='offcanvas' hidden className='simulator-offcanvas' />
                    < canvas ref='tempcanvas' hidden className='simulator-tempcanvas'/>
                </div>
                < TagList tagList={_.cloneDeep(this.state.tagList)} updateTag={this.updateTag}/>
            </div >);
    }
});