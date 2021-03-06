var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var TagList = require('./TagList');
var RegisterList = require('./RegisterList');
var LoadState = require('./LoadState');
var InputKeyboard = require('./inputKeyboard');
var Utils = require('../utils/utils');
var VideoSource = require('./VideoSource');
var EasingFunctions = require('../utils/easing');
var AnimationManager = require('../utils/animationManager');
var AnimationAPI = require('../utils/animationAPI')
var AudioManager = require('../utils/audioManager')
var math = require('mathjs');
var StringConverter = require('./StringConverter')
var WaveFilterManager = require('./WaveFilterManager')
var FreeTimerManager = require('../utils/freeTimerManager')
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
    fps: 0
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
        AudioManager.stopAllAudios();
        this.simState = {};
        VideoSource.pause();
        AnimationManager.clearAllAnimationKeys();
        FreeTimerManager.clearAll();
        WaveFilterManager.reset()
        cancelAnimationFrame(this.paintKey)
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
        lg('initializing: ', data)
        //initialize canvas context

        //encoding
        this.encoding = data.encoding||'ascii'
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


        //init wavefilters
        if(data.waveFilterList&&data.waveFilterList.length){
            data.waveFilterList.forEach(function(wf){
                WaveFilterManager.addWaveFilter(wf.title,wf.type,wf.args)
            })
        }

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
        //init tag init value
        data.tagList.forEach(function(t){
            if(t.valueType != 1){
                t.value = t.initValue || 0
            }
            
        })
        this.state.tagList = data.tagList;
        this.setState({tagList: data.tagList});
        //console.log('tagList loaded', data.tagList, this.state.tagList);
        //initialize registers
        this.registers = {};
        var curTag;
        var curRegIdx;
        for (i = 0; i < data.tagList.length; i++) {
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
            //add to wavefilter
            if(curTag.waveFilter!==undefined&&curTag.waveFilter!==''){
                WaveFilterManager.registerWaveFilter(curTag.waveFilter,curTag.name)
            }
        }
        //console.log(WaveFilterManager.getWaveFilters())
        // console.log(this.registers);
        this.state.registers = this.registers;
        this.setState({registers: this.registers});

        //initialize timer
        var timerList = [];
        // var postfix = ['Start','Stop','Step','Interval','CurVal','Mode'];
        for (i = 0; i < parseInt(data.timers); i++) {
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
        var imageList = [];
        var audioList = [];
        var allResources = data.resourceList || [];
        this.state.resourceList = resourceList
        //this.state.imageList = imageList
        var basicUrl = data.basicUrl;
        var num = allResources.length;
        this.state.totalResourceNum = num;

        // process window.cachedResourceList


        //if resource.complete == false  content set to be blank
        this.fps = 30
        this.defaultDuration = 1000
        this.defaultStifness = 183
        this.defaultDamping = 26

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
                    case 'audio':
                        var curAudio = new Audio(resource.src)
                        curAudio.onload = function(){
                            requiredResourceNum = requiredResourceNum - 1;
                            //update loading progress
                            this.drawLoadingProgress(this.totalRequiredResourceNum, requiredResourceNum, true, projectWidth, projectHeight);
                            if (requiredResourceNum <= 0) {
                                // console.log(imageList);
                                callBack(data);
                            }
                        }.bind(this)
                        newResource.content = curAudio;
                        audioList.push(newResource)
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
        // console.log('receive new project data', this.state.project)
        this.simState = {};
        this.initProject();
        this.paintKey = requestAnimationFrame(this.paint);
        //console.log(this.paintKey)

    },
    componentWillReceiveProps: function (newProps) {
        this.state.timerList.map(function (timer, i) {
            var curTimeID = timer.timerID;
            clearInterval(curTimeID);
        }.bind(this));
        this.state.innerTimerList.map(function (timerId) {
            clearInterval(timerId);
        }.bind(this));
        AudioManager.stopAllAudios();
        this.simState = {};
        VideoSource.setVideoSrc('');
        //init animation keys
        AnimationManager.clearAllAnimationKeys();
        var nextState = _.cloneDeep(defaultSimulator);
        nextState.project = _.cloneDeep(newProps.projectData);
        //console.log('reced', nextState.project)
        if (!nextState.project.size) {
            //close
            cancelAnimationFrame(this.paintKey)
            this.setState(nextState, this.initProject);

        } else {
            cancelAnimationFrame(this.paintKey)
            this.setState(nextState, this.initProject);

            this.paintKey = requestAnimationFrame(this.paint);

        }
        //reset wave filters
        WaveFilterManager.reset()
        FreeTimerManager.clearAll()
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
                project: _project,
                options: options
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
        // console.log('painting')
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
            var project = _.cloneDeep(this.currentDrawedProject);

            var page = project.pageList[(project&&project.curPageIdx)||0];
            if (page){
                if(page.animating){
                    if(page.transition&&page.transition.name==='SWIPE_H'||page.transition&&page.transition.name==='SWIPE_V'){
                        for(var i=0;i<project.pageList.length;i++){
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
    //获取tag值
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
    getEasingFunc:function(elem){
        return (elem.transition && elem.transition.timingFun )||'easeInOutCubic';
    },

    /**
     *  切换动画：page页面 和 subcanvas子画布
     *
     *  load    目标加载页面
     *  unload  目标加载页面之前的页面
     *
     *  1.获取 unload 缩略图  @param page.curPageImg  @function generatePageCopy();
     *  2.设定 load 页面和 unload页面动画位置;
     *  3.调用动画函数 AnimationManager.step() 绘制;
     *
     *  子画布动画  显示区域根据所在画布大小显示,使用clipToRect()截取;
     */
    //page 绘制页面
    drawPage: function (project,page, options) {
        //console.log(1);


        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx;
        var canvas = this.refs.canvas;
        var ctx = this.ctx;
        var frames = 30;
        var easing = this.getEasingFunc(page)
        var method = page.transition && page.transition.name;
        var duration = (page.transition && page.transition.duration ) || 1000;
        var count = frames;
        var maxD = -100;
        var hWidth = canvas.width / 2
        var hHeight = canvas.height / 2;
        if (!options) {
            options = {};
        }
        var flag = false;

        //目标页面的 前一个页面
        var unloadPage = project.pageList[project.pageUnloadIdx];

        if (!page.state || page.state == LoadState.notLoad) {
            page.state = LoadState.willLoad
            //generate load trigger
            options.reLinkWidgets = true;
            //页面动画
            switch (method){
                case 'PUSH_LR':
                    page.translate = {
                        x:-offcanvas.width,
                        y:0
                    };
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
                    };

                    page.animating = true
                    //前一个页面动画设置
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
                        //this.draw(null,options);

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
                    // if (unloadPage){
                    //     unloadPage.transform = [
                    //         [1,0,0],
                    //         [0,1,0],
                    //         [0,0,1]
                    //     ]
                    //     unloadPage.animating = true
                    // }
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
                    var pageNum=project.pageList.length;
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
                    var pageNum=project.pageList.length;
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
            page.state = LoadState.loading
            //drawCanvas
            page.canvasList = page.canvasList || []
            var canvasList = page.canvasList;
            if (canvasList.length) {
                canvasList.sort(this.compareZIndex);
                 //console.log('canvaslist',canvasList);
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
        //console.log('generate',page);
        var curPageImg = document.createElement('canvas')
        curPageImg.width = width
        curPageImg.height = height
        var ctx = curPageImg.getContext('2d')
        ctx.clearRect(0,0,width,height)
        this.paintPage(page,{resetTransform:true},curPageImg)
        return curPageImg
    },
    paintPage: function (page, options,offcanvas) {
        //console.log(page,options,offcanvas,this.refs.offcanvas);
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
        //console.log(page.animating);

        //page动画 ，动画阶段获取page缩略图curPageImg
        if (page.animating){
            // console.log('page animating',page.curPageImg)
            if (page.alpha!==undefined){
                offctx.globalAlpha = page.alpha
            }
            //console.log(page.curPageImg);
            if (page.curPageImg){
                offctx.drawImage(page.curPageImg, 0,0,offcanvas.width, offcanvas.height);
            }


        }else{
            this.drawBgColor(0, 0, offcanvas.width, offcanvas.height, page.backgroundColor,offctx);
            this.drawBgImg(0, 0, offcanvas.width, offcanvas.height, page.backgroundImage,offctx);
            //drawCanvas
            var canvasList = page.canvasList
            if (canvasList.length) {
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
                                this.draw();
                            } else {
                                clearInterval(timer.timerID);
                                timer.timerID = 0;
                            }

                        } else {
                            this.draw()
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
                            targetTag.value = (targetTag.value > timer['SysTmr_' + num + '_Stop']) ? timer['SysTmr_' + num + '_Stop'] : timer['SysTmr_' + num + '_Start'];
                            if (loop) {
                                this.setTagByTag(targetTag, startValue);
                                this.draw();
                            } else {
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
        var srcScale = (animationAttrs.scale&&animationAttrs.scale.srcScale&&this.getAnimationAtrr(animationAttrs.scale.srcScale,true))||{x:1,y:1};
        var dstScale = (animationAttrs.scale&&animationAttrs.scale.dstScale&&this.getAnimationAtrr(animationAttrs.scale.dstScale,true))||{x:1,y:1};
        var srcTranslate = (animationAttrs.translate&&animationAttrs.translate.srcPos&&this.getAnimationAtrr(animationAttrs.translate.srcPos))||{x:0,y:0};
        var dstTranslate = (animationAttrs.translate&&animationAttrs.translate.dstPos&&this.getAnimationAtrr(animationAttrs.translate.dstPos))||{x:0,y:0};
        var type = target.type;
        var duration = (animation && animation.duration) || 1000;
        var easingFunc = (animation && animation.timingFun) || 'easeInOutCubic';
        // console.log(scale,translate,duration)
        var frames = 30;
        var srcTransformObj = {};
        var dstTransformObj = {};
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


        //var easingFunc = 'easeInOutCubic';
        // console.log('anAttr',animationAttrs)
        // console.log('srcT',srcTransformObj,'dstT',dstTransformObj)

        AnimationManager.stepObj(srcTransformObj, dstTransformObj, duration, frames, easingFunc, function (deltas) {

            // offctx.translate(deltas.curX,deltas.curY);
            var transformMatrix = {}
            for (var key in deltas) {
                if (deltas.hasOwnProperty(key)) {
                    transformMatrix[key] = deltas[key].curValue;
                }
            }
            target.transform = transformMatrix;
            this.draw();


        }.bind(this), function () {

        })

    },
    getAnimationAtrr:function (attr,scaleTagValue) {
        var values = {}
        for(var key in attr){
            if (attr.hasOwnProperty(key)){
                //own key
                values[key] = this.getAnimationParamValue(attr[key],scaleTagValue)
            }
        }
        return values
    },
    getAnimationParamValue:function(param,scaleTagValue){
        scaleTagValue = scaleTagValue || false
        var value
        if ((typeof param) === 'number'||(typeof param)==='string') {
            value = Number(param)||0;
        } else {
            if (param) {
                if (param.tag) {
                    if(scaleTagValue){
                        value = this.getValueByTagName(param.tag)/100;//animation from tag will be 100x
                    }else{
                        value = this.getValueByTagName(param.tag);
                    }
                    
                } else {
                    value = Number(param.value)||0;
                }
            } else {
                value = 0;
            }
        }
        // console.log(value,param,(typeof param));
        return value;
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

    //canvas 绘制画布
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

            //this.showScrollBar(offctx,canvasData,subCanvas,subCanvas.shouldShowScrollBarH,subCanvas.shouldShowScrollBarV)

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
    clipToRect: function (ctx, originX, originY, w, h) {
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + w, originY);
        ctx.lineTo(originX + w, originY + h);
        ctx.lineTo(originX, originY + h);
        ctx.closePath();
        ctx.clip();
    },

    //subcanvas 绘制子画布
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
            var duration = (transition && transition.duration ) || 1000;
            var frames = 30;
            var easing = this.getEasingFunc(subCanvas)
            var hWidth = w/2+x
            var hHeight = h/2+y
            var newCopyFlag = false
            if (!firstSubCanvas&&(!options||(options&&!options.pageAnimate))){
                //has animation
                var unloadSC = null
                if (canvas.subCanvasUnloadIdx!==null){
                    unloadSC = canvas.subCanvasList[canvas.subCanvasUnloadIdx]
                }
                //console.log("method",method)
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

                        var springLen = canvas.w

                        var self = this
                        var swipeAnime = new AnimationAPI.SpringAnimation(null,'x',0,this.defaultDamping,this.defaultStifness,{x:-springLen},{x:0},duration,(startX+springLen)/springLen)
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
                        var springLen = canvas.w
                        var self = this
                        var swipeAnime = new AnimationAPI.SpringAnimation(null,'x',0,this.defaultDamping,this.defaultStifness,{y:-springLen},{y:0},duration,(startY+springLen)/springLen)
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
        //offctx.translate(subCanvas.contentOffsetX,subCanvas.contentOffsetY)
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

    //widget 绘制控件
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

            var drawFunc = 'draw'+subType.slice(2)
            if(this[drawFunc]){
                this[drawFunc](curX, curY, widget, options, cb);
            }else{
                cb();
            }
            

        }

    },
    paintWidget: function (widget, sx, sy, options,ctx) {
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

        var paintFunc = 'paint'+subType.slice(2)
        if(this[paintFunc]){
            this[paintFunc](curX,curY,widget,options,cb,offctx)
        }else{
            cb && cb()
        }


    },

    /**
     * 控件
     * draw  --> 初始化参数
     * paint --> 绘制canvas
     * paint阶段的 ctx参数 是用于生成page缩略图的canvas对象
     */
    //inputKeyboard page最后一页
    drawInputKeyboard: function (curX, curY, widget, options, cb) {

    },
    paintInputKeyboard: function (curX, curY, widget, options, cb ,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offCtx = ctx||this.offctx;
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
        if (widget.highlight) {
            var index = widget.highlightValue;
            var length = keys.length;
            if (index >= 0 && index < length) {
                curKey = keys[index]
                this.drawHighLight(curX + curKey.x, curY + curKey.y, curKey.width, curKey.height, null);
            }
        }
        cb && cb()

    },

    //slide
    drawSlide: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        widget.curSlideIdx = slideIdx;
    },
    paintSlide: function (curX, curY, widget, options, cb ,ctx) {
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
            if (!!text) {
                this.drawTextByTempCanvas(ctx,curX, curY, width, height, text, font, 'horizontal');
            }
        }
        cb && cb();
    },

    //alphaSlide
    drawAlphaSlide:function(curX,curY,widget,options,cb){
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        widget.curSlideIdx = slideIdx;
    },
    paintAlphaSlide: function (curX, curY, widget, options, cb,ctx) {
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
            var tempcanvas = this.refs.tempcanvas;
            tempcanvas.width = width;
            tempcanvas.height = height;
            var tempctx = tempcanvas.getContext('2d');
            tempctx.save();
            tempctx.clearRect(0,0,width,height)
            this.drawBgImg(0,0,width,height,curSlice.imgSrc,tempctx)
            tempctx.globalCompositeOperation = 'source-in'
            tempctx.fillStyle = widget.texList[1].slices[0].color
            tempctx.fillRect(0,0,width,height)
            tempctx.restore();
            this.offctx.drawImage(tempcanvas, curX, curY, width, height);
            text = curSlice.text;
            if (!!text) {
                this.drawTextByTempCanvas(ctx,curX, curY, width, height, text, font, 'horizontal');
            }
        }
        cb && cb();
    },

    //animation
    drawAnimation: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var slideIdx = (tag && tag.value) || 0;
        widget.curSlideIdx = slideIdx;
    },
    paintAnimation: function (curX, curY, widget, options, cb,ctx) {
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

    //button
    drawButton: function (curX, curY, widget, options, cb) {

    },
    paintButton: function (curX, curY, widget, options, cb,ctx) {
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
        this.drawTextByTempCanvas(ctx,curX, curY, width, height, text, font, widget.info.arrange);

        //draw highlight
        // lg('highlight',widget.highlight)
        // console.log('highlight',widget.highlight);
        if (widget.highlight) {
            this.drawHighLight(curX, curY, width, height, tex.slices[2],ctx);
        }

        cb && cb();
    },

    //buttonSwitch
    drawButtonSwitch: function (curX, curY, widget, options, cb) {
        /*var slideImg = this.getImage(widget.texList[1].slices[0].imgSrc);
        slideImg = (slideImg && slideImg.content) || null;
        widget.imgWidth = slideImg.width;
        widget.imgHeight = slideImg.height;
        widget.imgPosY = curY - (slideImg.height - widget.info.height) * 0.5;
        console.log(widget.imgPosY);*/
        var buttonSwitchState = this.getValueByTagName(widget.tag, 0)||0;
        var oldPosX = widget.oldPosX||0,curPosX;
        if(buttonSwitchState == 0){
            curPosX = 0;
        }else{
            //curPosX = slideImg?widget.info.width-slideImg.width:widget.info.width/2;
            curPosX = widget.info.width/2;
        }
        if(curPosX != oldPosX){
            var oldValue;
            if(widget.info.enableAnimation){
                var duration = (widget.transition && widget.transition.duration) || 0;
                if (widget.animationKey != -1 && widget.animationKey != undefined) {
                    oldValue = widget.currentPosX || 0;
                    AnimationManager.clearAnimationKey(widget.animationKey);
                    widget.animationKey = -1;
                } else {
                    oldValue = widget.oldPosX || 0;
                }
                widget.oldPosX = curPosX;
                widget.animationKey = AnimationManager.stepValue(oldPosX, curPosX, duration, 30, null, function (obj) {
                    widget.currentPosX = obj.curX;
                    this.draw()
                }.bind(this), function () {
                    widget.currentPosX = curPosX;
                }.bind(this));
                //initial
                widget.currentPosX = oldValue;
            }else{
                widget.oldPosX = curPosX;
                widget.currentPosX = curPosX;
            }
        }else{
        }
    },
    paintButtonSwitch: function (curX, curY, widget, options, cb,ctx) {
        var tex = widget.texList;
        var width = widget.info.width;
        var height = widget.info.height;
        var currentPosX = widget.currentPosX||curX;
        this.drawBg(curX, curY, width, height, tex[0].slices[0].imgSrc, tex[0].slices[0].color,ctx);
        this.drawBg(currentPosX, curY, width/2, height, tex[1].slices[0].imgSrc, tex[1].slices[0].color,ctx);
        cb && cb();

    },

    //clcok
    drawClock: function (curX, curY, widget, options, cb) {

    },
    paintClock: function (curX, curY, widget, options, cb,ctx) {
        var tex = widget.texList;
        var width = widget.info.width;
        var height = widget.info.height;
        var hourImgWidth = widget.info.hourImgWidth,
            hourImgHeight = widget.info.hourImgHeight,
            minuteImgWidth = widget.info.minuteImgWidth,
            minuteImgHeight = widget.info.minuteImgHeight,
            secondImgWidth = widget.info.secondImgWidth,
            secondImgHeight = widget.info.secondImgHeight;

        var arc = Math.PI*90/180;

        var rotateRad,rotateAngle;

        this.drawBg(curX, curY, width, height, tex[0].slices[0].imgSrc, tex[0].slices[0].color,ctx);
        //时
        if (widget.texList[1].slices[0]) {
            rotateRad = Math.atan(hourImgWidth/hourImgHeight);
            rotateAngle = (rotateRad*180/Math.PI + 180) + getTimeDeg('hour');
            this.drawRotateElem(curX, curY, width, height, width/2,height/2,hourImgWidth, hourImgHeight, rotateAngle, widget.texList[1].slices[0], 0, 0, null, 0, 0,true,this.pixelRatio,ctx);
        }
        //分
        if (widget.texList[2].slices[0]) {
            rotateRad = Math.atan(minuteImgWidth/minuteImgHeight);
            rotateAngle = (rotateRad*180/Math.PI + 180) + getTimeDeg('minute');
            this.drawRotateElem(curX, curY, width, height, width/2,height/2,minuteImgWidth, minuteImgHeight, rotateAngle, widget.texList[2].slices[0], 0, 0, null, 0, 0,true,this.pixelRatio,ctx);
        }
        //秒
        if (widget.texList[3].slices[0]) {
            rotateRad = Math.atan(secondImgWidth/secondImgHeight);
            rotateAngle = (rotateRad*180/Math.PI + 180) + getTimeDeg('second');
            this.drawRotateElem(curX, curY, width, height, width/2,height/2,secondImgWidth, secondImgHeight, rotateAngle, widget.texList[3].slices[0], 0, 0, null, 0, 0,true,this.pixelRatio,ctx);
        }

        function getTimeDeg (type){
            var now = new Date();   //定义时间
            var second = now.getSeconds();  //获取秒
            var minute = now.getMinutes();  //获取分钟
            var hour = now.getHours();   //获取小时
            hour=hour>12?hour-12:hour;

            var hour_deg = (hour*30) + (Math.floor(minute / 12) * 6);
            var minute_deg = minute*6;
            var second_deg = second*6;

            var deg = {
                second:second_deg,
                minute:minute_deg,
                hour:hour_deg
            };
            //console.log(deg);
            return deg[type];
        }

        cb && cb();
    },

    //switch
    drawSwitch: function (curX, curY, widget, options, cb) {
        var bindTagValue = this.getValueByTagName(widget.tag, 0);
        
        var mode = widget.info.mode
        var flashDur = widget.info.flashDur || 10
        flashDur = flashDur / 2
        // console.log(mode)
        var switchState;
        var bindBit = parseInt(widget.info.bindBit);
        if (bindBit < 0 || bindBit > 31) {
            switchState = 0;
        } else {
            switchState = bindTagValue & (Math.pow(2, bindBit));
        }
        if(mode == 1){
            if(switchState == 0){
                //clear timer
                if(widget.flashTimerId){
                    FreeTimerManager.clearTimerId(widget.flashTimerId)
                    widget.flashTimerId = null
                }
                widget.curSwitchState = switchState;
            }else{
                if(!widget.flashTimerId){
                    widget.flashTimerId = setInterval(function(){
                        widget.curSwitchState = widget.curSwitchState == 0 ? 1:0
                    },flashDur)
                    FreeTimerManager.addTimerId(widget.flashTimerId)
                }
            }
        }else{
            widget.curSwitchState = switchState;
        }
        
    },
    paintSwitch: function (curX, curY, widget, options, cb,ctx) {
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
            if (!!text) {
                this.drawTextByTempCanvas(ctx,curX, curY, width, height, text, font, 'horizontal');
            }
        }
        cb && cb();
    },

    //textArea
    drawTextArea: function (curX, curY, widget, options, cb) {
    },
    paintTextArea: function (curX, curY, widget, options, cb,ctx) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        var bgSlice = widget.texList[0].slices[0];
        var arrange = info.arrange === 'vertical' ? 'vertical' : 'horizontal';
        this.drawBg(curX, curY, width, height, bgSlice.imgSrc, bgSlice.color,ctx);
        //draw text
        if(info.mode != 1){
            if (info.text) {
                //
                var font = {};
                font['font-style'] = info.fontItalic;
                font['font-weight'] = info.fontBold;
                font['font-size'] = info.fontSize;
                font['font-family'] = info.fontFamily;
                font['font-color'] = info.fontColor;
                this.drawTextByTempCanvas(ctx,curX, curY, width, height, info.text, font, arrange);
            }
        }else{
            if(info.textContent&&info.textContent!==''){
                var fontAttrs = {
                    fontSize:info.fontSize,
                    fontFamily:info.fontFamily,
                    fontBold:info.fontBold,
                    fontItalic:info.fontItalic,
                    fontColor:info.fontColor,
                    fontSpacing:Number(info.fontSpacing)||0,
                    fontHalfSpacing:Number(info.halfFontSpacing)||0,
                    // fontVerticalOffset:0
                }

                var paragraphAttrs = {
                    align:'left',
                        // indentationLeft:0,
                        // indentationRight:0,
                        // firstLineIndentation:0,
                        spacingBetweenLines:info.fontSize,
                        // spacingBeforeParagraph:(this.height-this.fontSize)/2,
                        spacingAfterParagraph:info.fontSize
                }
                var article = {
                    paragraphs:info.textContent.split('\n').map(function(p){
                        return {
                            paragraphAttrs:paragraphAttrs,
                            spans:[
                                {
                                    fontAttrs:fontAttrs,
                                    text:p
                                }
                            ]
                        }
                    })
                }
                var offctx =ctx|| this.offctx
                offctx.save()
                offctx.fillStyle = info.fontColor
                var fontString=info.fontItalic+" "+info.fontBold+" "+info.fontSize+"px"+" "+info.fontFamily;
                //console.log(fontString);
                // offctx.scale(1/this.scaleX,1/this.scaleY);
                offctx.font=fontString;
                offctx.textAlign='center';
                offctx.textBaseline='middle';//使文本垂直居中

                FontLayoutEngine.layoutArticle(article,new FontLayoutEngine.LayoutBox(0,0,info.width,info.height))
                
                FontLayoutEngine.showArticleLayout(article,offctx)
                offctx.restore()
            }
        }
        
        cb && cb();
    },

    //textInput
    drawTextInput: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag)
        if(tag){

            widget.curValue = ''+this.getTagTrueValue(tag) //convert to string even is number tag

        }
    },
    paintTextInput: function (curX, curY, widget, options, cb,ctx) {
        var info = widget.info;
        var width = info.width;
        var height = info.height;
        var bgSlice = widget.texList[0].slices[0];
        var arrange = info.arrange === 'vertical' ? 'vertical' : 'horizontal';
        this.drawBg(curX, curY, width, height, bgSlice.imgSrc, bgSlice.color,ctx);
        //draw text
        if (widget.curValue) {
            //
            
            if(info.mode != 1){
                var font = {};
                font['font-style'] = info.fontItalic;
                font['font-weight'] = info.fontBold;
                font['font-size'] = info.fontSize;
                font['font-family'] = info.fontFamily;
                font['font-color'] = info.fontColor;
                font['text-align'] = info.align;
                this.drawTextByTempCanvas(ctx,curX, curY, width, height, widget.curValue, font, arrange,true,info.fontSize,{
                    spacing:info.spacing||0,
                    halfSpacing:info.halfSpacing||0
                });
            }else{
                var fontAttrs = {
                    fontSize:info.fontSize,
                    fontFamily:info.fontFamily,
                    fontBold:info.fontBold,
                    fontItalic:info.fontItalic,
                    fontColor:info.fontColor,
                    fontSpacing:Number(info.spacing)||0,
                    fontHalfSpacing:Number(info.halfSpacing)||0,
                    // fontVerticalOffset:0
                }
    
                var paragraphAttrs = {
                    align:info.align,
                        // indentationLeft:0,
                        // indentationRight:0,
                        // firstLineIndentation:0,
                        spacingBetweenLines:Number(info.lineSpacing)||0,
                        // spacingBeforeParagraph:(this.height-this.fontSize)/2,
                        spacingAfterParagraph:info.fontSize
                }
                var article = {
                    paragraphs:(widget.curValue||'').split('\n').map(function(p){
                        return {
                            paragraphAttrs:paragraphAttrs,
                            spans:[
                                {
                                    fontAttrs:fontAttrs,
                                    text:p
                                }
                            ]
                        }
                    })
                }
                var offctx = this.offctx
                offctx.save()
                offctx.rect(curX,curY,width,height)
                offctx.clip()
                offctx.fillStyle = info.fontColor
                var fontString=info.fontItalic+" "+info.fontBold+" "+info.fontSize+"px"+" "+info.fontFamily;
                //console.log(fontString);
                // offctx.scale(1/this.scaleX,1/this.scaleY);
                offctx.font=fontString;
                offctx.textAlign='center';
                offctx.textBaseline='middle';//使文本垂直居中
    
                FontLayoutEngine.layoutArticle(article,new FontLayoutEngine.LayoutBox(0,0,info.width,info.height))
                
                FontLayoutEngine.showArticleLayout(article,offctx)
                offctx.restore()
            }
            
        }
        cb && cb();
    },
    drawTextByTempCanvas: function (ctx,curX, curY, width, height, text, font, arrange, byteMode, maxFontWidth, spacing, paddingRatio) {

        var text = text || '';
        var font = font || {};
        // console.log(font);
        var offcanvas = this.refs.offcanvas;
        var halfSpacing = 0
        var curSpacing = 0
        var lastLetterType, curLetterType
        var offctx = ctx || this.offctx;
        var tempcanvas = this.refs.tempcanvas;
        tempcanvas.width = width;
        tempcanvas.height = height;
        var tempctx = tempcanvas.getContext('2d');
        tempctx.save();
        if (spacing === undefined) {
            spacing = 0
        }else if (typeof spacing === 'object'){ //support halfSpacing
            halfSpacing = spacing.halfSpacing
            spacing = spacing.spacing
        }
        if (paddingRatio === undefined) paddingRatio = 0;
        if (arrange === 'vertical') {
            tempctx.translate(tempcanvas.width / 2, tempcanvas.height / 2);
            tempctx.rotate(Math.PI / 2);
            tempctx.translate(-tempcanvas.width / 2, -tempcanvas.height / 2);
            // tempctx.translate(0,-tempcanvas.width)
        }
        tempctx.clearRect(0, 0, width, height);
        
        tempctx.textBaseline = font['text-baseline'] || 'middle';
        //font style
        var fontStr = (font['font-style'] || '') + ' ' + (font['font-variant'] || '') + ' ' + (font['font-weight'] || '') + ' ' + (font['font-size'] || 24) + 'px' + ' ' + ('"' + font['font-family'] + '"' || 'arial');
        tempctx.font = fontStr;
        // console.log('tempctx.font',fontStr);
        tempctx.fillStyle = font['font-color'];
        if (byteMode) {
            // var widthOfDateTimeStr=maxFontWidth*text.length;
            // var initXPos = (width-widthOfDateTimeStr)/2;
            // var xCoordinate = initXPos+maxFontWidth/2;
            var xCoordinate
            tempctx.textAlign = 'center'
            var targetAlign = font['text-align'] || 'center';
            var totalWidth = 0
            for (var i = 0; i < text.length; i++) {
                totalWidth += maxFontWidth;
                if(i+1 < text.length){
                    lastLetterType = this.getLetterType(text[i])
                    curLetterType = this.getLetterType(text[i+1])
                    curSpacing = 0
                    if(lastLetterType === 0){
                        curSpacing = curLetterType ? (spacing + halfSpacing)/2 : halfSpacing
                    }else{
                        curSpacing = curLetterType ? spacing : (spacing + halfSpacing)/2
                    }

                    totalWidth += curSpacing || 0;
                    
                }
                

            }
            curSpacing = 0

            xCoordinate = maxFontWidth / 2
            switch(targetAlign){
                case 'center':
                    xCoordinate += (width - totalWidth)/2
                break;
                case 'left':
                    xCoordinate += 0
                break;
                case 'right':
                    xCoordinate += width - totalWidth
                break;
            }
            
            if (paddingRatio !== 0) xCoordinate = paddingRatio * maxFontWidth + 0.5 * maxFontWidth;
            var notItalic = (-1 == fontStr.indexOf('italic'));
            var italicAjust = notItalic ? 0 : maxFontWidth / 2; //如果是斜体的话，需要斜体往右伸出的宽度
            // var displayStep = (maxFontWidth*text.length > width) ? ((width - maxFontWidth - italicAjust)/(text.length - 1)) : maxFontWidth;
            // displayStep+=spacing;
            var yCoordinate = 0.5 * height;
            for (var i = 0; i < text.length; i++) {
                tempctx.fillText(text[i], xCoordinate, yCoordinate);
                if(i+1 < text.length){
                    lastLetterType = this.getLetterType(text[i])
                    curLetterType = this.getLetterType(text[i+1])

                    if(lastLetterType === 0){
                        curSpacing = curLetterType ? (spacing + halfSpacing)/2 : halfSpacing
                    }else{
                        curSpacing = curLetterType ? spacing : (spacing + halfSpacing)/2
                    }

                    xCoordinate += curSpacing || 0;
                    xCoordinate += maxFontWidth;
                }
                

            }

        } else {
            tempctx.textAlign = font['text-align'] || 'center';
            switch(tempctx.textAlign){
                case 'center':
                    tempctx.fillText(text, 0.5 * width, 0.5 * height);
                break;
                case 'left':
                    tempctx.fillText(text, 0, 0.5 * height);
                break;
                case 'right':
                    tempctx.fillText(text, width, 0.5 * height);
                break;
            }
            
        }
        tempctx.restore();
        offctx.drawImage(tempcanvas, curX, curY, width, height);
    },
    getLetterType(letter){
        var codePoint = letter.codePointAt(0)
        if (codePoint < 128){
            return 0
        }else{
            return 1
        }
    },

    //buttonGroup
    drawButtonGroup: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var curButtonIdx = (tag && tag.value) || 0;
        widget.curButtonIdx = curButtonIdx;
    },
    paintButtonGroup: function (curX, curY, widget, options, cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var interval = widget.info.interval;
        var count = widget.info.count;

        var curButtonIdx = widget.curButtonIdx;
        var texList = widget.texList;
        var highlightTex = texList[texList.length - 1];
        if (widget.info.arrange == 'horizontal') {
            //horizontal
            var singleWidth = (width - interval * (count - 1)) / count;
            for (var i = 0; i < texList.length - 1; i++) {
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
                    this.drawHighLight(curX + widget.highlightValue * (singleWidth + interval), curY, singleWidth, height, highlightTex.slices[0],ctx);
                }
            }
        } else {
            //vertical
            var singleHeight = (height - interval * (count - 1)) / count;
            for (var i = 0; i < texList.length - 1; i++) {
                var curButtonTex = texList[i];
                if (i == curButtonIdx - 1) {
                    //pressed tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[1].imgSrc, curButtonTex.slices[1].color,ctx);

                } else {
                    //normal tex
                    this.drawBg(curX, curY + i * (singleHeight + interval), width, singleHeight, curButtonTex.slices[0].imgSrc, curButtonTex.slices[0].color,ctx);
                }
                if (widget.highlight) {
                    this.drawHighLight(curX, curY + widget.highlightValue * (singleHeight + interval), width, singleHeight, highlightTex.slices[0],ctx);
                }
            }
        }

        cb && cb();
    },

    //gallery
    drawGallery: function (curX, curY, widget, options, cb) {
        var tag = this.findTagByName(widget.tag);
        var count = widget.info.count;
        var curValue = (tag && tag.value) || 0;
        var enableAnimation = widget.info.enableAnimation;
        var width = widget.info.width;
        var interval = widget.info.interval;
        var singleWidth=widget.info.photoWidth
        widget.curValue = curValue;

        var distanceBetweenPhotos = singleWidth*2/3;

        //galleryOffset
        var galleryOffset = 0
        galleryOffset = curValue * distanceBetweenPhotos
        
        if(widget.galleryOffset!==undefined){
            if(enableAnimation){

                if(widget.animateTimerId!==undefined && widget.animateTimerId !== 0){
                    clearInterval(widget.animateTimerId)
                    widget.animateTimerId = 0
                }
                if(widget.animateTimerId===undefined || widget.animateTimerId === 0){

                    var fps = 30
                    var duration = (widget.transition && widget.transition.duration) || 1000
                    var easing = this.getEasingFunc(widget)
                    widget.animateTimerId = AnimationManager.stepValue(widget.galleryOffset, galleryOffset, duration, fps, easing, function (obj) {
                        widget.galleryOffset = obj.curX
                        // console.log(widget.galleryOffset)
                        // this.draw()
                    }.bind(this), function () {
                        widget.galleryOffset = galleryOffset
                        widget.animateTimerId = 0
    
                    }.bind(this))
                }

                
                
            }else{
                widget.galleryOffset = galleryOffset
            }
        }else{
            widget.galleryOffset = galleryOffset
        }
        
    },
    paintGallery:function(curX, curY, widget, options, cb,ctx){
        var curPosXList = []
        
        var ctx = this.offctx
        var width = widget.info.width;
        var height = widget.info.height;
        var interval = widget.info.interval;
        var count = widget.info.count;

        var centerX = curX + width/2
        var centerY = curY + height/2
        var i
        var curValue = widget.curValue;
        var texList = widget.texList
        var curTex
        var singleWidth=widget.info.photoWidth
        var maxSize = Math.max(singleWidth,height)
        var totalFrame = widget.totalFrame||30
        var curFrame = widget.curFrame ||totalFrame

        var distanceBetweenPhotos = singleWidth*2/3;

        var singleSideLimit = 3

        for(i=0;i<count;i++){
            curPosXList.push((i-0)*distanceBetweenPhotos - widget.galleryOffset+ width/2)
        }
        widget.curPosXList = curPosXList
        
        var drawHandler = function(_ctx){
            _ctx.translate(maxSize/2,maxSize/2)
            // if(curTex.image){
            //     _ctx.drawImage(curTex.image, -singleWidth / 2, -height / 2,singleWidth,height);
            // }else{
            //     _ctx.fillStyle=curTex.color
            //     _ctx.fillRect(
            //         -(singleWidth / 2),
            //         -(height / 2) ,
            //         singleWidth ,
            //         height );
            // }
            this.drawBg(-singleWidth / 2, -height / 2,singleWidth,height,curTex.slices[0].imgSrc,curTex.slices[0].color,_ctx)
        }.bind(this)
        
        var targetCanvas = AdvancedDrawEngine.getSharedCanvas()
        //var totalLen = this.texList.length
        var centerIdx = -1
        //calculate the one closest to center
        var curDistanceMin = width
        var curDistance
        for(i=0;i<count;i++){
            curDistance = Math.abs(widget.curPosXList[i] - width/2)
            if(curDistance < curDistanceMin){
                curDistanceMin = curDistance
                centerIdx = i
            }
        }


        var width3d = singleWidth/2
        var rotateRad,z
        
        
        var staticRotateRad = Math.PI/4;
        var staticPositionZ = maxSize/5;
        for(i=0;i<count;i++){
        
            if(i!=centerIdx){
                if(Math.abs(i-centerIdx)<=singleSideLimit){
                    rotateRad = (i>centerIdx?1:-1) * staticRotateRad
                    z = staticPositionZ
                    curTex = texList[i]
                    AdvancedDrawEngine.drawCanvasPerspective(drawHandler,{
                        size:maxSize,
                        position:{
                            z:z
                        },
                        // rotation:{
                        //     y:rotateRad
                        // },
                        shearZ:-rotateRad
                    })
                
                    ctx.drawImage(targetCanvas,0,0,maxSize,maxSize,curX + widget.curPosXList[i] - maxSize, centerY-maxSize,2*maxSize,2*maxSize)
                }
                
            }else{
                break;
            }
            
            //ctx.drawImage(targetCanvas,0,0,maxSize,maxSize,-this.width / 2+(width+interval)*i - (2*maxSize-width)/2, -this.height / 2 - (2*maxSize - height)/2,2*maxSize,2*maxSize)
        }

        for(i=count-1;i>0;i--){
        
            if(i!=centerIdx){
                if(Math.abs(i-centerIdx)<=singleSideLimit){
                    rotateRad = (i>centerIdx?1:-1) * staticRotateRad
                    z = staticPositionZ
                    curTex = texList[i]
                    AdvancedDrawEngine.drawCanvasPerspective(drawHandler,{
                        size:maxSize,
                        position:{
                            z:z
                        },
                        // rotation:{
                        //     y:rotateRad
                        // },
                        shearZ:-rotateRad
                    })
                
                    ctx.drawImage(targetCanvas,0,0,maxSize,maxSize,curX + widget.curPosXList[i] - maxSize, centerY-maxSize,2*maxSize,2*maxSize)

                }
                
            }else{
                break;
            }
            
            //ctx.drawImage(targetCanvas,0,0,maxSize,maxSize,-this.width / 2+(width+interval)*i - (2*maxSize-width)/2, -this.height / 2 - (2*maxSize - height)/2,2*maxSize,2*maxSize)
        }
        //draw center
        var d = widget.curPosXList[centerIdx] - width/2
        rotateRad = d/distanceBetweenPhotos * staticRotateRad
        z = Math.abs(d)/distanceBetweenPhotos * staticPositionZ
        curTex = texList[centerIdx]
        AdvancedDrawEngine.drawCanvasPerspective(drawHandler,{
            size:maxSize,
            position:{
                z:z
            },
            // rotation:{
            //     y:rotateRad
            // },
            shearZ:-rotateRad
        })
    
        ctx.drawImage(targetCanvas,0,0,maxSize,maxSize, curX + widget.curPosXList[i] - maxSize, centerY-maxSize,2*maxSize,2*maxSize)

        cb && cb()
    },

    //progress
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

                widget.oldValue = curProgress
                if (alarmValue.length) {
                    //hanlde alarm
                    this.handleTargetAction(widget, alarmValue);
                }


                widget.animationKey = AnimationManager.stepValue(oldValue, curProgress, duration, 30, null, function (obj) {
                    widget.currentValue = obj.curX;
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
    paintProgress: function (curX, curY, widget, options, cb,ctx) {
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
                            if (cursor) {
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawVerCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color, curY,ctx);
                                //this.drawCursor(curX,curY+ height * (1.0 - curScale),width,height,false,height*(1.0-curScale),cursorSlice.imgSrc,cursorSlice.color);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, progressSlice.imgSrc, progressSlice.color,ctx);
                            if (cursor) {
                                var cursorSlice = widget.texList[2].slices[0];
                                this.drawCursor(width * curScale + curX, curY, width, height, true, width * (1 - curScale), cursorSlice.imgSrc, cursorSlice.color,ctx);
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
                            if (cursor) {
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawVerCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color,curY,ctx);
                            }
                            break;
                        case 'horizontal':
                        default:
                            //default horizontal
                            // this.drawBg(curX,curY,width*curScale,height,progressSlice.imgSrc,progressSlice.color);
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, '', mixedColor,ctx);
                            if (cursor) {
                                var cursorSlice = widget.texList[3].slices[0];
                                this.drawCursor(width * curScale + curX, curY, width, height, true, width * (1 - curScale), cursorSlice.imgSrc, cursorSlice.color,ctx);
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
                            if (cursor) {
                                var cursorSlice = widget.texList[widget.texList.length - 1].slices[0];
                                this.drawVerCursor(curX, curY + height * (1.0 - curScale), width, height, false, height * (1.0 - curScale), cursorSlice.imgSrc, cursorSlice.color, curY,ctx);
                            }
                            break;
                        case 'horizontal':
                        default:
                            this.drawBgClip(curX, curY, width, height, curX, curY, width * curScale, height, drawImg, drawColor,ctx);
                            if (cursor) {
                                var cursorSlice = widget.texList[widget.texList.length - 1].slices[0];
                                this.drawCursor(width * curScale + curX, curY, width, height, true, width * (1 - curScale), cursorSlice.imgSrc, cursorSlice.color,ctx);
                            }
                            break;
                    }
                    break;
            }


        }

        cb && cb();


        //handle action

    },

    //slideBlock
    drawSlideBlock: function (curX, curY, widget, options, cb) {
        var width = widget.info.width;
        var height = widget.info.height;
        //get current value
        var curSlideTag = this.findTagByName(widget.tag);

        var curSlide;
        if (curSlideTag && curSlideTag.value !== '') {
            curSlide = curSlideTag.value;
        }else {
            curSlide = widget.curValue || 0;
        }
        //var curSlide = (curSlideTag && curSlideTag.value !== (undefined||null||'') ) ||

        var curScale = 1.0 * (curSlide - widget.info.minValue) / (widget.info.maxValue - widget.info.minValue);

        curScale = (curScale >= 0 ? curScale : 0.0);
        curScale = (curScale <= 1 ? curScale : 1.0);
        widget.curSlide = curSlide;
        widget.curScale = curScale;

        //handle action
        this.handleAlarmAction(curSlide, widget, widget.info.lowAlarmValue, widget.info.highAlarmValue);
        widget.oldValue = curSlide;

    },
    paintSlideBlock: function (curX, curY, widget, options, cb,ctx) {
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

            if(widget.texList[2]&&widget.texList[2].slices[0]){
                var progressSlice = widget.texList[2].slices[0];
                var progressImg = this.getImage(progressSlice.imgSrc);
                progressImg = (progressImg && progressImg.content) || null;
            }

            var slideSlice = widget.texList[1].slices[0];
            var slideImg = this.getImage(slideSlice.imgSrc);
            slideImg = (slideImg && slideImg.content) || null;
            if (slideImg) {
                var slideRatio;
                switch (widget.info.arrange) {
                    case 'vertical':
                        if(progressImg){
                            this.drawBgClip(curX, curY, width, height, curX, curY + height - (height - slideImg.height) * curScale - slideImg.height/2, width, (height - slideImg.height) * curScale + slideImg.height/2, progressSlice.imgSrc, progressSlice.color,ctx);
                        }
                        //this.drawCursor(curX, curY + height - curScale * (height - slideImg.height), width, height, false, height - curScale * (height - slideImg.height), slideSlice.imgSrc, slideSlice.color);
                        this.drawCursorWithoutLimit(curX, curY + height - curScale * (height - slideImg.height)-slideImg.height,width,height,false, slideSlice.imgSrc, slideSlice.color,ctx)
                        break;
                    case 'horizontal':
                    default:
                        if(progressImg){
                            this.drawBgClip(curX, curY, width, height, curX, curY, (width - slideImg.width) * curScale + slideImg.width/2, height, progressSlice.imgSrc, progressSlice.color,ctx);
                        }
                        //this.drawCursor(curScale * (width - slideImg.width) + curX, curY, width, height, true, width - curScale * (width - slideImg.width), slideSlice.imgSrc, slideSlice.color);
                        this.drawCursorWithoutLimit(curScale * (width - slideImg.width) + curX, curY ,width,height,true, slideSlice.imgSrc, slideSlice.color,ctx)
                        break
                }
            }

        }
        cb && cb();
    },

    //scriptTrigger
    paintScriptTrigger: function (curX, curY, widget, options, cb,ctx) {
        cb && cb()
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

    //video
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
    paintVideo: function (curX, curY, widget, options, cb,ctx) {
        var width = widget.info.width;
        var height = widget.info.height;
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
        offctx.fillStyle = widget.texList[0].slices[0].color;
        offctx.fillRect(curX, curY, width, height);
        //draw video
        //draw video
        offctx.drawImage(VideoSource.videoObj, curX, curY, width, height);


        cb && cb();
    },

    drawVerCursor: function (beginX, beginY, width, height, align, alignLimit, img, color, limitY,ctx) {

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
                var Ymin = beginY - imgH;
                if (Ymin < limitY)
                    Ymin = limitY;
                this.drawBgClip(beginX - (imgW - width) * 0.5, beginY - imgH, imgW, imgH, beginX, Ymin, width, Math.min(imgH, alignLimit), img, color,ctx);
            }
        }
    },
    drawCursor: function (beginX, beginY, width, height, align, alignLimit, img, color,ctx) {

        var cursorImg = this.getImage(img);
        cursorImg = (cursorImg && cursorImg.content) || null;
        if (cursorImg) {
            var imgW = cursorImg.width;
            var imgH = cursorImg.height;
            if (align) {
                //horizontal
                this.drawBgClip(beginX, beginY - (imgH - height) * 0.5, imgW, imgH, beginX, beginY, Math.min(imgW, alignLimit), height, img, color,ctx);
            } else {
                //vertical
                this.drawBgClip(beginX - (imgW - width) * 0.5, beginY - imgH, imgW, imgH, beginX, beginY - imgH, width, Math.min(imgH, alignLimit), img, color,ctx);
            }
        }


    },
    drawCursorWithoutLimit: function (beginX, beginY, width,height,align, img, color,ctx) {

        var cursorImg = this.getImage(img);
        cursorImg = (cursorImg && cursorImg.content) || null;
        if (cursorImg) {
            var imgW = cursorImg.width;
            var imgH = cursorImg.height;
            if (align) {
                //horizontal
                //this.drawBgClip(beginX, beginY - (imgH - height) * 0.5, imgW, imgH, beginX, beginY, Math.min(imgW, alignLimit), height, img, color);
                this.drawBg(beginX,beginY - (imgH - height) * 0.5,imgW,imgH,img,color,ctx);
            } else {
                //vertical
                //this.drawBgClip(beginX - (imgW - width) * 0.5, beginY - imgH, imgW, imgH, beginX, beginY - imgH, width, Math.min(imgH, alignLimit), img, color);
                this.drawBg(beginX - (imgW - width) * 0.5,beginY,imgW,imgH,img,color,ctx);
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

    //dateTime
    drawDateTime: function (curX, curY, widget, options, cb) {
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
    paintDateTime: function (curX, curY, widget, options, cb,ctx) {
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
        this.drawTextByTempCanvas(ctx,curX, curY, width, height, dateTimeString, font, widget.info.arrange, true, widget.info.fontSize, {spacing:spacing,halfSpacing:spacing}, paddingRatio,ctx);
        var offcanvas = this.refs.offcanvas;
        var offctx = this.offctx;
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
                if (dateTimeModeId == '0') {
                    eachHeight = (widget.info.height - 2 * delimiterHeight) / 3;
                    this.drawHighLight(curX, (eachHeight + delimiterHeight) * widget.highlightValue + curY, width, eachHeight, tex.slices[0],ctx);
                } else if (dateTimeModeId == '1') {
                    eachHeight = (widget.info.height - delimiterHeight) / 2;
                    this.drawHighLight(curX, (eachHeight + delimiterHeight) * widget.highlightValue + curY, width, eachHeight, tex.slices[0],ctx);
                } else {
                    eachHeight = (widget.info.height - 2 * delimiterHeight) / 4;
                    if (widget.highlightValue == 0) {
                        this.drawHighLight(curX, curY, width, eachHeight * 2, tex.slices[0],ctx);
                    } else {
                        this.drawHighLight(curX, curY + (eachHeight + delimiterHeight) * widget.highlightValue + eachHeight, width, eachHeight, tex.slices[0],ctx);
                    }

                }
            } else {
                delimiterWidth = widget.delimiterWidth;
                if (dateTimeModeId == '0') {
                    eachWidth = (widget.info.width - 2 * delimiterWidth) / 3;
                    this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue, curY, eachWidth, height, tex.slices[0],ctx);
                } else if (dateTimeModeId == '1') {
                    eachWidth = (widget.info.width - widget.delimiterWidth) / 2;
                    this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue, curY, eachWidth, height, tex.slices[0],ctx);
                } else {
                    eachWidth = (widget.info.width - 2 * widget.delimiterWidth) / 4;
                    if (widget.highlightValue == 0) {
                        this.drawHighLight(curX, curY, eachWidth * 2, height, tex.slices[0],ctx);
                    } else {
                        this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue + eachWidth, curY, eachWidth, height, tex.slices[0],ctx);
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

    //texTime
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
    paintTexTime: function (curX, curY, widget, options, cb,ctx) {
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
        this.paintStyledTexTime(widget, dateTimeString, curX, curY, width, height,ctx);

        //hightlight
        var eachWidth = 0;
        var delimiterWidth = 0;
        var eachHeight = 0;
        var delimiterHeight = 0;
// console.log(widget)
        if (widget.highlight) {

            if (widget.info.arrange == 'vertical') {
                delimiterHeight = widget.delimiterWidth;
                if (dateTimeModeId == '0') {
                    eachHeight = (widget.info.height - 2 * delimiterHeight) / 3;
                    this.drawHighLight(curX, (eachHeight + delimiterHeight) * widget.highlightValue + curY, width, eachHeight, highlightTex.slices[0],ctx);
                } else if (dateTimeModeId == '1') {
                    eachHeight = (widget.info.height - delimiterHeight) / 2;
                    this.drawHighLight(curX, (eachHeight + delimiterHeight) * widget.highlightValue + curY, width, eachHeight, highlightTex.slices[0],ctx);
                } else {
                    eachHeight = (widget.info.height - 2 * delimiterHeight) / 4;
                    if (widget.highlightValue == 0) {
                        this.drawHighLight(curX, curY, width, eachHeight * 2, highlightTex.slices[0],ctx);
                    } else {
                        this.drawHighLight(curX, curY + (eachHeight + delimiterHeight) * widget.highlightValue + eachHeight, width, eachHeight, highlightTex.slices[0],ctx);
                    }

                }
            } else {
                delimiterWidth = widget.delimiterWidth;
                if (dateTimeModeId == '0') {
                    eachWidth = (widget.info.width - 2 * delimiterWidth) / 3;
                    this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue, curY, eachWidth, height, highlightTex.slices[0],ctx);
                } else if (dateTimeModeId == '1') {
                    eachWidth = (widget.info.width - widget.delimiterWidth) / 2;
                    this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue, curY, eachWidth, height, highlightTex.slices[0],ctx);
                } else {
                    eachWidth = (widget.info.width - 2 * widget.delimiterWidth) / 4;
                    if (widget.highlightValue == 0) {
                        this.drawHighLight(curX, curY, eachWidth * 2, height, highlightTex.slices[0],ctx);
                    } else {
                        this.drawHighLight(curX + (eachWidth + delimiterWidth) * widget.highlightValue + eachWidth, curY, eachWidth, height, highlightTex.slices[0],ctx);
                    }

                }
            }

        }

        cb && cb();


    },
    paintStyledTexTime: function (widget, numElems, clipX, clipY, clipW, clipH,ctx) {
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
    drawHighLight: function (curX, curY, width, height, slice,ctx) {
        if (slice) {
            this.drawBg(curX, curY, width, height, slice.imgSrc, slice.color,ctx);
        } else {
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

    //number
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
    paintNumber: function (curX, curY, widget, options, cb,ctx) {
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

    //num
    drawNum: function (curX, curY, widget, options, cb) {

        var overFlowStyle = widget.info.overFlowStyle;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var lowAlarmValue = widget.info.lowAlarmValue;
        var highAlarmValue = widget.info.highAlarmValue;
        var curValue = this.getValueByTagName(widget.tag);
        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        var easing = this.getEasingFunc(widget)
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


                if (enableAnimation) {
                    var fps = 30
                    var duration = (widget.transition && widget.transition.duration) || 0
                    var totalFrameNum = duration / 1000 * fps

                    totalFrameNum = totalFrameNum > 1 ? totalFrameNum : 1

                    if (widget.animateTimerId == undefined || widget.animateTimerId === 0) {
                        // console.log(totalFrameNum)
                        widget.curTotalFrameNum = totalFrameNum
                        // var startTime = new Date()
                        // console.log('start time',startTime)

                        widget.animateTimerId = AnimationManager.stepValue(0, totalFrameNum, duration, 30, easing, function (obj) {
                            widget.curFrameNum = Math.round(obj.curX)
                            this.draw()
                        }.bind(this), function () {
                            widget.curFrameNum = 0
                            widget.animateTimerId = 0
        
                        }.bind(this))

                        // widget.animateTimerId = setInterval(function () {
                        //     if (widget.curFrameNum != undefined) {
                        //         widget.curFrameNum += 1
                        //     } else {
                        //         widget.curFrameNum = 1
                        //     }
                        //     if (widget.curFrameNum > totalFrameNum - 1) {
                        //         clearInterval(widget.animateTimerId)
                        //         // var endTime = new Date()
                        //         // console.log('end time',endTime,endTime-startTime)

                        //         widget.animateTimerId = 0
                        //         widget.curFrameNum = 0

                        //     }
                        //     this.draw()
                        // }.bind(this), 1000 / fps)
                    }


                    
                }

            }


        }


    },
    paintNum: function (curX, curY, widget, options, cb,ctx) {
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
                var oldWidth = 0;
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
                    if (oldWidth > 0) {
                        offctx.drawImage(tempcanvas, 0, 0, oldWidth, curHeight, curX + curWidth - oldWidth, curY, oldWidth, curHeight)
                    }

                    this.drawStyleString(newTempNumValue, curWidth, curHeight, numString, bgTex, tempcanvas, arrange, align, maxFontWidth, decimalCount, spacing)

                    oldWidth = curFrameNum / totalFrameNum * curWidth;
                    if (oldWidth > 0) {
                        offctx.drawImage(tempcanvas, curWidth - oldWidth, 0, oldWidth, curHeight, curX, curY, oldWidth, curHeight)
                    }

                }


                // var transY = curHeight * 1.0 / totalFrameNum * (widget.curFrameNum|| 0


            }


            // offctx.restore();


        }

        cb && cb();

    },

    //texNum
    drawTexNum: function (curX, curY, widget, options, cb) {

        var overFlowStyle = widget.info.overFlowStyle;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var lowAlarmValue = widget.info.lowAlarmValue;
        var highAlarmValue = widget.info.highAlarmValue;
        var curValue = this.getValueByTagName(widget.tag);
        var numModeId = widget.info.numModeId;
        var enableAnimation = widget.info.enableAnimation;
        var easing = this.getEasingFunc(widget)
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


                if (enableAnimation) {
                    var fps = 30
                    var duration = (widget.transition && widget.transition.duration) || 0
                    var totalFrameNum = duration / 1000 * fps
                    totalFrameNum = totalFrameNum > 1 ? totalFrameNum : 1

                    if (widget.animateTimerId == undefined || widget.animateTimerId === 0) {
                        // console.log(totalFrameNum)
                        widget.curTotalFrameNum = totalFrameNum
                        // var startTime = new Date()
                        // console.log('start time',startTime)

                        widget.animateTimerId = AnimationManager.stepValue(0, totalFrameNum, duration, 30, easing, function (obj) {
                            widget.curFrameNum = Math.round(obj.curX)
                            this.draw()
                        }.bind(this), function () {
                            widget.curFrameNum = 0
                            widget.animateTimerId = 0
        
                        }.bind(this))

                        // widget.animateTimerId = setInterval(function () {
                        //     if (widget.curFrameNum != undefined) {
                        //         widget.curFrameNum += 1
                        //     } else {
                        //         widget.curFrameNum = 1
                        //     }
                        //     if (widget.curFrameNum > totalFrameNum - 1) {
                        //         clearInterval(widget.animateTimerId)
                        //         // var endTime = new Date()
                        //         // console.log('end time',endTime,endTime-startTime)

                        //         widget.animateTimerId = 0
                        //         widget.curFrameNum = 0

                        //     }
                        //     this.draw()
                        // }.bind(this), 1000 / fps)
                    }
                }

            }


        }


    },
    paintTexNum: function (curX, curY, widget, options, cb,ctx) {
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

        //16进制
        var hexMode = {
            numSystem: widget.info.numSystem,
            markingMode: widget.info.hexControl.markingMode,
            transformMode: widget.info.hexControl.transformMode
        };
        var waitingInfo = {
            enableWaitingValue:widget.info.enableWaitingValue,
            waitingValue:widget.info.waitingValue
        }
        var tempcanvas = this.refs.tempcanvas;

        tempcanvas.width = curWidth;
        tempcanvas.height = curHeight;
        var tempCtx = tempcanvas.getContext('2d');
        tempCtx.clearRect(0, 0, curWidth, curHeight);


        var tempNumValue = '';
        if (curValue != undefined && curValue != null) {

            var changeDirection = curValue - widget.animateOldValue

            if (!enableAnimation || (enableAnimation && widget.animateTimerId == 0)) {


                tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                // console.log('tempNumValue',tempNumValue)
                this.paintStyledTexNum(widget, tempNumValue, curX, curY, curX, curY, curWidth, curHeight)


            } else {
                //animate number


                //drawbackground

                var totalFrameNum = widget.curTotalFrameNum || 1
                // //draw
                var oldHeight = 0;
                var oldWidth = 0;
                var curFrameNum = changeDirection < 0 ? (totalFrameNum - widget.curFrameNum) : widget.curFrameNum
                var newTempNumValue = ''
                if (arrange === 'horizontal') {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                    }


                    oldHeight = (totalFrameNum - curFrameNum) / totalFrameNum * curHeight
                    if (oldHeight > 0) {
                        this.paintStyledTexNum(widget, tempNumValue, curX, curY + curHeight - oldHeight, curX, curY + curHeight - oldHeight, curWidth, oldHeight)
                    }
                    oldHeight = curFrameNum / totalFrameNum * curHeight
                    if (oldHeight > 0) {

                        this.paintStyledTexNum(widget, newTempNumValue, curX, curY - curHeight + oldHeight, curX, curY, curWidth, oldHeight)
                    }

                } else {
                    if (changeDirection < 0) {
                        newTempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                        tempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                    } else {
                        tempNumValue = this.generateStyleString(widget.animateOldValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                        newTempNumValue = this.generateStyleString(curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo)
                    }

                    oldWidth = (totalFrameNum - curFrameNum) / totalFrameNum * curWidth
                    if (oldWidth > 0) {
                        this.paintStyledTexNum(widget, tempNumValue, curX - curWidth + oldWidth, curY, curX, curY, curWidth, oldHeight)
                    }
                    oldWidth = curFrameNum / totalFrameNum * curWidth;
                    if (oldWidth > 0) {
                        this.paintStyledTexNum(widget, newTempNumValue, curX + curWidth - oldWidth, curY, curX + curWidth - oldWidth, curY, curWidth, oldHeight)
                    }

                }


                // var transY = curHeight * 1.0 / totalFrameNum * (widget.curFrameNum|| 0


            }


            // offctx.restore();


        }

        cb && cb();

    },
    paintStyledTexNum: function (widget, tempNumValue, dstX, dstY, clipX, clipY, clipW, clipH) {
        var offctx = this.offctx
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
                case '_':
                    curTexSlice = widget.texList[0].slices[26];
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
    generateStyleString: function (curValue, decimalCount, numOfDigits, frontZeroMode, symbolMode, hexMode,waitingInfo) {
        var tempNumValue
        if(waitingInfo && waitingInfo.enableWaitingValue && curValue == waitingInfo.waitingValue){
            tempNumValue = ''
            if(decimalCount>0){
                for(var i=0;i<numOfDigits-decimalCount;i++){
                    tempNumValue += '_'
                }
                tempNumValue+='.'
                for(i=0;i<decimalCount;i++){
                    tempNumValue += '_'
                }
            }else{
                for(var i=0;i<numOfDigits;i++){
                    tempNumValue += '_'
                }
            }
            return tempNumValue
        }
        
        var negative = false;
        if (curValue < 0) {
            negative = true;
        }
        tempNumValue = Math.abs(curValue);
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
        var symbol = '';
        if (!negative) {
            tempNumValue = symbol + tempNumValue;
        } else if (negative) {
            if (symbolMode == '1'){
                symbol = '-';
            }
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

    //dashboard
    drawDashboard: function (curX, curY, widget, options, cb) {

        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var curDashboardTag = this.findTagByName(widget.tag);
        var curDashboardTagValue;
        var easing = this.getEasingFunc(widget)

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


                widget.animationKey = AnimationManager.stepValue(oldValue, curDashboardTagValue, duration, 30, easing, function (obj) {
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
    paintDashboard: function (curX, curY, widget, options, cb,ctx) {
        var offctx = this.offctx
        var width = widget.info.width;
        var height = widget.info.height;
        var offset = widget.info.offsetValue || 0;
        var innerRadius = widget.info.innerRadius || 0;
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
            var pointerOffsetX = widget.info.posRotatePointX||0
            var pointerOffsetY = widget.info.posRotatePointY||0
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
            var radPhase = Math.atan(pointerWidth/pointerHeight)
            if (!radPhase){
                radPhase = Math.PI/4
            }
            var arcPhase = radPhase*180/Math.PI;
            var innerW = innerRadius * Math.sin(radPhase)
            var innerH = innerRadius * Math.cos(radPhase)

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

                    this.drawRotateElem(curX, curY, width, height, pointerOffsetX,pointerOffsetY, pointerWidth, pointerHeight, clockwise * (curArc + offset + minArc) + arcPhase, widget.texList[1].slices[0], innerW/pointerWidth, innerH/pointerHeight, null, minCoverAngle, maxCoverAngle,true,this.pixelRatio,ctx);

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
                    this.drawLightStrip(curX, curY, width, height, clockwise * (minArc + offset) + 90, clockwise * (curArc + offset + minArc) + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId,null,this.pixelRatio,ctx);
                    //draw pointer

                    this.drawRotateElem(curX, curY, width, height, pointerOffsetX,pointerOffsetY,pointerWidth, pointerHeight, clockwise * (curArc + offset + minArc) + arcPhase, widget.texList[1].slices[0], innerW/pointerWidth, innerH/pointerHeight, null, minCoverAngle, maxCoverAngle,true,this.pixelRatio,ctx);

                    //draw circle
                    // var circleTex = widget.texList[3].slices[0]
                    // this.drawBg(curX,curY,width,height,circleTex.imgSrc,circleTex.color)
                } else if (widget.dashboardModeId == '2') {
                    var lightStripTex = widget.texList[0].slices[0];
                    this.drawLightStrip(curX, curY, width, height, clockwise * (minArc + offset) + 90, clockwise * (curArc + offset) + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId,null,this.pixelRatio,ctx);
                }
            } else {
                if (widget.dashboardModeId == '0') {
                    //simple mode
                    //background
                    var bgTex = widget.texList[0].slices[0];
                    if (widget.backgroundModeId === '0') {
                        this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color);
                    }
                    //draw pointer

                    this.drawRotateElem(curX, curY, width, height, pointerOffsetX,pointerOffsetY,pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], innerW/pointerWidth, innerH/pointerHeight, null, minCoverAngle, maxCoverAngle,true,this.pixelRatio,ctx);

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
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId,null,this.pixelRatio,ctx);
                        //draw pointer

                        this.drawRotateElem(curX, curY, width, height,pointerOffsetX,pointerOffsetY, pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], innerW/pointerWidth, innerH/pointerHeight, null, minCoverAngle, maxCoverAngle,true,this.pixelRatio,ctx);

                    } else if (curArc < 0) {
                        var bgTex = widget.texList[0].slices[0];
                        if (widget.backgroundModeId === '0') {
                            this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,ctx);
                        }
                        //draw light strip
                        var lightStripTex = widget.texList[2].slices[0];
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[2].slices[0].imgSrc, clockwise, widget.dashboardModeId, curArc,this.pixelRatio,ctx);
                        //draw pointer

                        this.drawRotateElem(curX, curY, width, height,pointerOffsetX,pointerOffsetY, pointerWidth, pointerHeight, curArc + offset + arcPhase, widget.texList[1].slices[0], innerW/pointerWidth, innerH/pointerHeight, null, minCoverAngle, maxCoverAngle,true,this.pixelRatio,ctx);

                    }
                } else if (widget.dashboardModeId == '2') {
                    var lightStripTex = widget.texList[0].slices[0];
                    if (curArc >= 0) {
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId,null,this.pixelRatio,ctx);
                    } else if (curArc < 0) {
                        this.drawLightStrip(curX, curY, width, height, offset + 90, curArc + offset + 90, widget.texList[0].slices[0].imgSrc, clockwise, widget.dashboardModeId, curArc,this.pixelRatio,ctx);
                    }
                }
            }


            cb && cb()

        }
    },

    //rotateImg
    drawRotateImg: function (curX, curY, widget, options, cb) {
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
    paintRotateImg: function (curX, curY, widget, options, cb,ctx) {

        var width = widget.info.width;
        var height = widget.info.height;
        var posRotatePointX = widget.info.posRotatePointX
        var posRotatePointY = widget.info.posRotatePointY
        var clockwise = widget.info.clockwise;
        if (widget.texList) {
            //pointer
            var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
            var curArc = widget.curArc;
            var arc = curArc + initValue;
            if(clockwise==0){
                arc = -arc;
            }
            this.drawRotateElem(curX, curY, width, height,posRotatePointX,posRotatePointY, width, height, arc, widget.texList[0].slices[0], -posRotatePointX/width, -posRotatePointY/height, widget.subType,null,null,false,this.pixelRatio,ctx);
        }

        cb && cb();

    },

    //touchTrack
    drawTouchTrack: function (curX, curY, widget, options, cb) {
        // var lowAlarm = widget.info.lowAlarmValue;
        // var highAlarm = widget.info.highAlarmValue;
        // var minValue = widget.info.minValue;
        // var maxValue = widget.info.maxValue;
        var curValue = this.getValueByTagName(widget.tag, 0) ;
        // if (curValue > maxValue) {
        //     curValue = maxValue
        // } else if (curValue < minValue) {
        //     curValue = minValue;
        // }
        widget.curValue = curValue;
        // this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
        widget.oldValue = curValue;
    },
    paintTouchTrack: function (curX, curY, widget, options, cb,ctx) {
        var offctx = ctx||this.offctx
        var width = widget.info.width;
        var height = widget.info.height;
        if (widget.texList) {

            //pointer

            //var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
            var curValue = widget.curValue||0;
            var x = Math.round(curValue /10000)
            var y = curValue%10000
            var pointL = Math.round(Math.min(width,height)/10)
            offctx.save()

            this.drawBg(curX,curY,width,height,widget.texList[0].slices[0].imgSrc,widget.texList[0].slices[0].color,offctx)

            this.drawBg(curX+x-pointL/2,curY+y-pointL/2,pointL,pointL,widget.texList[1].slices[0].imgSrc,widget.texList[1].slices[0].color,offctx)
            offctx.restore()

        }

        cb && cb();

    },

    //alphaImg
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
    paintAlphaImg: function (curX, curY, widget, options, cb,ctx) {
        var offctx = ctx||this.offctx
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

    //chart
    drawChart: function (curX, curY, widget, options, cb) {
        var lowAlarm = widget.info.lowAlarmValue;
        var highAlarm = widget.info.highAlarmValue;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var curValue = this.getValueByTagName(widget.tag, 0) ;
        var xCount = widget.info.xCount||1
        widget.values = widget.values||[]
        if (curValue > maxValue) {
            curValue = maxValue
        } else if (curValue < minValue) {
            curValue = minValue;
        }
        widget.curValue = curValue;
        if(options.updatedTagName && options.updatedTagName == widget.tag){
            var values = widget.values
            values.push(curValue)
            while(values.length>xCount){
                values.shift()
            }
            widget.values = values
        }
       
        
        this.handleAlarmAction(curValue, widget, lowAlarm, highAlarm);
        widget.oldValue = curValue;
    },
    paintChart: function (curX, curY, widget, options, cb,ctx) {
        var offctx = ctx||this.offctx
        var width = widget.info.width;
        var height = widget.info.height;
        var minValue = widget.info.minValue;
        var maxValue = widget.info.maxValue;
        var xCount = widget.info.xCount||1
        var yCount = widget.info.yCount||1
        var xPadding = widget.info.xPadding||0
        var yPadding = widget.info.yPadding||0
        
        if (widget.texList) {

            //pointer

            //var initValue = widget.info.initValue;
            // var curArc = widget.info.value;
           
            
            
            // ctx.fillStyle = this.bgTex.color
            // ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height)
            // if(this.bgTex.image){
            //     ctx.drawImage(this.bgTex.image,-this.width/2,-this.height/2,this.width,this.height)
            // } 
            offctx.save()
            var bgTex = widget.texList[0].slices[0]
            var dotTex = widget.texList[1].slices[0]
            var lineTex = widget.texList[2].slices[0]
            this.drawBg(curX, curY, width, height, bgTex.imgSrc, bgTex.color,offctx);

            var values = widget.values
            var dotLen = width/20
            var x=0
            var y=0
            
            for(var i=0;i<xCount;i++){
                x = (width-2*xPadding)/xCount * (i + 0.5)+xPadding
                y = height - yPadding - (height-2*yPadding)/(maxValue - minValue) * (values[i] - minValue)
                
                if(i!==0){
                    if(lineTex.color){
                        offctx.strokeStyle = lineTex.color
                        offctx.lineTo(curX+ x ,curY + y)
                    }
                }else{
                    offctx.beginPath()
                    offctx.moveTo(curX + x  ,curY + y )
                }

            }
            offctx.stroke()


            for(i=0;i<xCount;i++){
                x = (width-2*xPadding)/xCount * (i + 0.5)+xPadding
                y = height - yPadding - (height-2*yPadding)/(maxValue - minValue) * (values[i] - minValue)
            

                if(dotTex){
                    this.drawBg(curX+x-dotLen/2,curY+y-dotLen/2,dotLen,dotLen,dotTex.imgSrc,dotTex.color,offctx)
                }
                
            }
            
            offctx.restore()
        }

        cb && cb();

    },
    drawSelector: function (curX, curY, widget, options, cb) {
        if(widget.mouseState&&(widget.mouseState.state=='dragging'||widget.mouseState.state=='press')){
            return
        }
        var height = widget.info.height
        var showCount = widget.info.showCount
        if((showCount&1) === 0){
            showCount++
        }
        var count = widget.info.count
       
        var elementHeight = height/showCount
        var curTag = this.findTagByName(widget.tag);
        var curValue = (curTag && curTag.value) || 0
        if(curValue >= widget.info.count){
            curValue = widget.info.count - 1
        }
        widget.curValue = curValue

        var offset = widget.translateY||0

        var oldValue = widget.oldValue || 0
        

        if(oldValue !== curValue || offset){
            //should move
            if(widget.info.enableAnimation){
                var duration = (widget.transition && widget.transition.duration) || 0;
                var easingFunc = (widget.transition && widget.transition.timingFun) || 'easeInOutCubic';
                offset = (curValue - oldValue) * elementHeight + offset
                if(widget.animationKey){
                    clearInterval(widget.animationKey)
                    widget.animationKey = null
                }
                widget.translateY = offset
                widget.animationKey = AnimationManager.stepValue(offset, 0, duration, 30, easingFunc, function (obj) {
                    widget.translateY = obj.curX;
                    // this.draw()
                }.bind(this), function () {
                    widget.translateY = 0;
                    clearInterval(widget.animationKey)
                    widget.animationKey = null
                }.bind(this));
            }else{
                widget.translateY = 0
            }
            
        }

        widget.oldValue = curValue
        

    },
    paintSelector: function (curX, curY, widget, options, cb,ctx) {
        var info = widget.info
        if (widget.texList) {
            var hori = widget.info.arrange == 'horizontal';
            var width = info.width
            var height = info.height
            var showCount = info.showCount
            if((showCount&1) === 0){
                showCount++
            }
            var count = info.count
            var curValue = widget.curValue||0
            var elementHeight = height/showCount
            var elementWidth = width
            var centerIdx = parseInt(showCount/2)
            var elementTex = widget.texList[0].slices
            var notChosenOverTex = widget.texList[2].slices[0]
            var chosenOverTex = widget.texList[1].slices[0]
            var halfWidth = width / 2
            var halfHeight = height / 2
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            var font = {};
            font['font-style'] = widget.info.fontItalic;
            font['font-weight'] = widget.info.fontBold;
            font['font-size'] = widget.info.fontSize;
            font['font-family'] = widget.info.fontFamily;
            font['font-color'] = widget.info.fontColor;
            // var fontString=info.fontItalic+" "+info.fontBold+" "+info.fontSize+"px"+" "+info.fontFamily;
            // ctx.font = fontString
            var offsetY = widget.translateY || 0
            // for(var i=0;i<showCount;i++){
            //     var curElementIdx = curValue - centerIdx + i
            //     var curElementTex = elementTex[curElementIdx]
            //     if(curElementTex){
            //         this.drawBg(curX, curY+i*elementHeight+offsetY, elementWidth,elementHeight, curElementTex.imgSrc, curElementTex.color,ctx);
            //         if(curElementTex.text){
            //             // ctx.fillStyle = this.fontColor
            //             // var fontY = parseInt((i+0.5)*elementHeight-halfHeight)
            //             // ctx.fillText(curElementTex.text,0,fontY)
            //             this.drawTextByTempCanvas(ctx,curX, curY+i*elementHeight+offsetY, elementWidth, elementHeight, curElementTex.text, font);
            //         }
                    
            //     }
            // }
            ctx.save()
            ctx.beginPath()
            ctx.rect(0,0,width,height)
            ctx.clip()
            for(var i=0;i<count;i++){
                var curElementTex = elementTex[i]
                var curElementTop = (centerIdx - curValue + i)*elementHeight + offsetY
                var curElementBottom = curElementTop + elementHeight
                if(curElementBottom < 0 || curElementTop > height){
                    //overflow
                }else{
                    //paint
                    this.drawBg(curX, curY+curElementTop, elementWidth,elementHeight, curElementTex.imgSrc, curElementTex.color,ctx);
                    if(curElementTex.text){
                        // ctx.fillStyle = this.fontColor
                        // var fontY = parseInt((i+0.5)*elementHeight-halfHeight)
                        // ctx.fillText(curElementTex.text,0,fontY)
                        this.drawTextByTempCanvas(ctx,curX, curY+curElementTop, elementWidth, elementHeight, curElementTex.text, font);
                    }
                }
            }

            ctx.restore()

            ctx.save()
            ctx.beginPath()
            ctx.rect(0,0,width,centerIdx*elementHeight)
            ctx.rect(0,(centerIdx+1)*elementHeight, elementWidth, centerIdx*elementHeight)
            ctx.clip()
            
            this.drawBg(curX, curY, width,height, notChosenOverTex.imgSrc, notChosenOverTex.color,ctx);
            ctx.restore()
            
            this.drawBg(curX, curY+centerIdx*elementHeight, elementWidth,elementHeight, chosenOverTex.imgSrc, chosenOverTex.color,ctx);
            ctx.restore()

        }
        cb && cb();
    },
    //oscilloscope
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
    paintOscilloscope: function (curX, curY, widget, options, cb,ctx) {
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
            this.drawBg(curX, curY, width, height, bgSlice.imgSrc, bgSlice.color,ctx);

            //draw grid
            if (grid != '0') {
                var gridStyle = {
                    lineWidth: lineWidth,
                    grid: grid,
                    gridInitValue: gridInitValue,
                    gridUnitX: gridUnitX,
                    gridUnitY: gridUnitY
                }
                this.drawTable(curX, curY, width, height, blankX, blankY, spacing, spacing, gridStyle, minValue,ctx);
            }
            //draw points lines

            var coverSlice = widget.texList[1].slices[0];
            this.drawPointsLine(curX, curY, width, height, spacing, widget.curPoints, minValue, maxValue, coverSlice, blankX, blankY, lineColor,ctx);


        }

        cb && cb();

    },

    //grid
    drawGrid: function (curX, curY, widget, options, cb) {

    },
    paintGrid: function (curX, curY, widget, options, cb,ctx) {
        var info = widget.info;
        var tex = widget.texList,
            width = info.width,
            height = info.height,
            row = info.row,
            col = info.col,
            border = info.border,
            borderColor = info.borderColor,
            cellWidth = info.cellWidth,
            cellHeight = info.cellHeight;

        this.drawBg(curX, curY, width, height, tex[0].slices[0].imgSrc, tex[0].slices[0].color,ctx);

        this.drawGridWidget(ctx,curX,curY,width,height,border,borderColor,cellWidth,cellHeight);
        cb && cb();
    },
    drawGridWidget:function(ctx,x,y,width,height,lineWidth,lineColor,row,col){
        ctx = ctx || this.offctx;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;

        //行
        var initRowX,initRowY;
        //加上 lineWidth/2（边框宽度的一半） 是为了防止最外层边框超出被裁剪掉
        initRowX = x;
        initRowY = y + lineWidth/2;
        for(var i=0;i<=col.length;i++){
            if (i !== 0)  {
                initRowY += col[i-1].height;
            }
            ctx.moveTo(initRowX,initRowY);
            //如果不设置moveTo，当前画笔没有位置
            ctx.lineTo(initRowX+width,initRowY);
        }

        //列
        var initColX,initColY;
        initColX = x + lineWidth/2;
        initColY = y;

        for(var j=0;j<=row.length;j++){
            if (j !== 0) {
                initColX += row[j-1].width;
            }
            ctx.moveTo(initColX,initColY);
            //如果不设置moveTo，当前画笔没有位置
            ctx.lineTo(initColX,initColY + height);
        }

        ctx.stroke();
        ctx.closePath();
    },

    drawPointsLine: function (curX, curY, width, height, spacing, points, minValue, maxValue, bgSlice, blankX, blankY, lineColor,ctx) {
        var tranedPoints = points.map(function (point) {
            return 1.0 * (point - minValue) / (maxValue - minValue) * (height - blankY);
        });
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx
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
    drawTable: function (curX, curY, width, height, offsetX, offsetY, gridWidth, gridHeight, gridStyle, minValue,ctx) {
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx
        var _offsetX = offsetX % (2 * gridWidth);
        var _offsetY = offsetY % (2 * gridHeight);
        var _gridWidth = gridWidth;
        var _gridHeight = gridHeight;
        var vertGrids = Math.floor((width - _offsetX) / _gridWidth) + 1;
        var horiGrids = Math.floor((height - _offsetY) / _gridHeight) + 1;
        //console.log('keke',width,height,gridWidth,gridHeight,_offsetX,_offsetY);
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
    drawLightStrip: function (curX, curY, width, height, minArc, curArc, image, clockWise, dashboardModeId, nowArc,verticalPixelScale,ctx) {
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
            this.drawBg(curX, curY, width, height, image, null,ctx)
        } else {
            var offcanvas = this.refs.offcanvas;
            var offctx = ctx||this.offctx;
            offctx.save();
            offctx.translate(curX+0.5*width,curY + 0.5 * height)
            if(verticalPixelScale){
                offctx.scale(1,1.0/verticalPixelScale)
            }
            offctx.beginPath();
            if (dashboardModeId == '1') {
                offctx.moveTo(0,0);
                offctx.arc(0,0, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);

            } else if (dashboardModeId == '2') {
                offctx.moveTo(0,0);
                offctx.arc(0,0, radius, Math.PI * minArc / 180, Math.PI * curArc / 180, wise);
                offctx.arc(0,0, radius * 3 / 4, Math.PI * curArc / 180, Math.PI * minArc / 180, !wise);
            }
            offctx.closePath();
            offctx.clip();
            if(verticalPixelScale){
                offctx.scale(1,verticalPixelScale)
            }
            this.drawBg(-0.5*width, -0.5*height, width, height, image, null);
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
    drawRotateElem: function (x, y, w, h, pointerOffsetX,pointerOffsetY,elemWidth, elemHeight, arc, texSlice, transXratio, transYratio, type, minCoverAngle, maxCoverAngle,keepSize,verticalPixelScale,ctx) {
        var transXratio = transXratio || 0;
        var transYratio = transYratio || 0;
        var offcanvas = this.refs.offcanvas;
        var offctx = ctx||this.offctx;
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
        // if (!(type && type == 'MyRotateImg')) {
        //     offctx.beginPath();
        //     offctx.rect(x, y, w, h);
        //     offctx.clip();
        // }

        offctx.translate(x + pointerOffsetX, y + pointerOffsetY);
        if(verticalPixelScale){
            offctx.scale(1,1.0/verticalPixelScale)
        }

        offctx.rotate(Math.PI * arc / 180);
        offctx.translate(transXratio * elemWidth, transYratio * elemHeight);

        //draw color
        offctx.fillStyle = texSlice.color;
        offctx.fillRect(0, 0, elemWidth, elemHeight);

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
            var names = imageName.split(/[\/|\\]/)
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
                                x: curCanvasRealPoint.x - canvas.x,
                                y: curCanvasRealPoint.y - canvas.y
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
            case 'MyTouchTrack':

                x = x - left;
                y = y - top;
                //console.log('relative rect',x,y)
                this.handleTouchTrackInnerPress(widget, x, y);

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
                // this.draw(null, {
                //     updatedTagName: widget.targetTag
                // });
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
    handleTouchTrackInnerPress:function(widget,x,y){
        var curValue = x*10000+y
        var curTag = this.findTagByName(widget.tag)
        if  (curTag){
            this.setTagByTag(curTag,curValue)
        }
    },
    handleSelectorDrag:function(widget,relativeX,yStep){
        if(widget.translateY===undefined||widget.translateY===null){
            widget.translateY = 0
        }
        widget.translateY += yStep
        
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

            }else if (targets[i].type == 'MyLayer'){
                this.handleCanvasPress(targets[i],_.cloneDeep(this.mouseState))
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

                    if (type === 'release') {

                        if (this.simState.inModifingState) {
                            this.simState.inModifingState = false;
                        } else {
                            this.simState.inModifingState = true;
                        }
                    }
                    break;
                case 'MyTexTime':

                    if (type === 'release') {

                        if (this.simState.inModifingState) {
                            this.simState.inModifingState = false;
                        } else {
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
        lg('move', direction)
        var page = this.state.project.pageList[this.state.curPageIdx];
        var curDirection;
        if (direction === 'left') {
            curDirection = 'left';
        } else {
            curDirection = 'right';
        }
        // console.log(page);
        if (this.simState.inModifingState) {
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
    handleMove: function (e) {
        var relativeRect = this.getRelativeRect(e);
        var x = relativeRect.x;
        var y = relativeRect.y;
        if (!this.mouseState) {
            return;
        }
        var lastMouseState = _.cloneDeep(this.mouseState)
        // console.log(lastMouseState,this.mouseState)

        this.mouseState.position.x = x;
        this.mouseState.position.y = y;
        this.mouseState.timeStamp = Date.now()
        var timeD = (this.mouseState.timeStamp - lastMouseState.timeStamp)/1000.0
        this.mouseState.speedX = parseInt((this.mouseState.position.x - lastMouseState.position.x)/timeD) || 0
        this.mouseState.speedY = parseInt((this.mouseState.position.y - lastMouseState.position.y)/timeD) || 0

        if (this.mouseState.state === 'press' || this.mouseState.state === 'dragging') {
            this.mouseState.state = 'dragging';
            this.handleDragging(_.cloneDeep(this.mouseState),lastMouseState);
        } else {
            this.mouseState.state = 'move';
        }
    },
    handleHolding: function () {

    },
    handleDragging: function (mouseState,lastMouseState) {
        var targets = this.state.currentPressedTargets;
        var processed = false
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].type == 'widget') {
                processed = this.handleWidgetDrag(targets[i], mouseState,lastMouseState);
                this.handleTargetAction(targets[i], 'drag');
                if(processed){
                    break
                }
                // console.log('widget')

            }else if(targets[i].type == 'MyLayer'){
                //process canvas
                processed = this.handleCanvasDrag(targets[i],mouseState,lastMouseState)
                if(processed){
                    break
                }
            }else if(targets[i].type == 'MyPage'){
                //process page
                // console.log('page')
            }
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
        this.dragTarget = canvas
        var subCanvas = canvas.subCanvasList[canvas.curSubCanvasIdx]
        //transition
        var curTransition = canvas.transition
        var method = curTransition && curTransition.name
        var handled = false
        if (!((subCanvas.info && (subCanvas.info.scrollHEnabled||scrollVEnabled)) || method == 'SWIPE_H' || method == 'SWIPE_V')){
            return handled
        }

        var lastMousePointX = lastMouseState.position.x || 0
        var lastMousePointY = lastMouseState.position.y || 0
        var mousePointX = mouseState.position.x || 0
        var mousePointY = mouseState.position.y || 0
        var offsetX = mousePointX - lastMousePointX
        var offsetY = mousePointY - lastMousePointY
        var pressedPos = mouseState.pressedPosition||{x:0,y:0}

        

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



        handled = true
        return handled




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
        elem[animation] = new AnimationAPI.SpringAnimation(null,'x',initialVelocity,this.defaultDamping,this.defaultStifness,{x:zeroPos},{x:onePos},duration,startPos)
        elem[animation].onFrameCB = function () {
            elem[offset] = this.state.curValue.x
            // elem.shouldShowScrollBar = true
            self.addHideScrollBarTimeout(elem)

        }
        elem[animation].start()
    },
    handleWidgetDrag: function (widget, mouseState,lastMouseState) {
        var subType = widget.subType;
        var left = widget.info.left;
        var top = widget.info.top;
        var relativeX = mouseState.position.x - widget.parentX - left;
        var relativeY = mouseState.position.y - widget.parentY - top;
        var needRedraw = false;
        switch (subType) {
            case 'MySlideBlock':
                this.handleSlideBlockInnerPress(widget, relativeX, relativeY);
                widget.mouseState = mouseState;
                needRedraw = true;
                this.setTagByName(widget.tag, widget.curValue || 0);
                break;
            case 'MyTouchTrack':
                this.handleTouchTrackInnerPress(widget, relativeX, relativeY);
                widget.mouseState = mouseState;
                needRedraw = true;
                break
            case 'MySelector':
                this.handleSelectorDrag(widget,relativeX,mouseState.position.y - lastMouseState.position.y)
                widget.mouseState = mouseState
                needRedraw = true
                break
        }

        if (needRedraw) {
            this.drawAfterMouseAction(mouseState);
            return true
        }else{
            return false
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
            case 'MyButtonSwitch':
                var targetTag = this.findTagByName(widget.tag);
                if (targetTag) {
                    targetTag.value = parseInt(targetTag.value);
                    // targetTag.value = targetTag.value > 0 ? 0 : 1;
                    this.setTagByTag(targetTag, (targetTag.value > 0 ? 0 : 1))
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
            case 'MySelector':
                if(widget.animationKey){
                    clearInterval(widget.animationKey)
                    widget.animationKey = null
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
        var x = Math.round(e.pageX - e.target.offsetLeft);
        var y = Math.round(e.pageY - e.target.offsetTop);
        var lastMouseState = _.cloneDeep(this.mouseState)
        this.mouseState.state = 'release';
        this.mouseState.position.x = x;
        this.mouseState.position.y = y;
        this.mouseState.timeStamp = Date.now()
        this.mouseState.speedX = 0
        this.mouseState.speedY = 0


        if (lastMouseState.state == 'dragging'){
            this.handleDraggingEnd(_.cloneDeep(this.mouseState),lastMouseState)
        }

        var pressedTargets = this.state.currentPressedTargets;

        for (var i = 0; i < pressedTargets.length; i++) {
            this.handleElementRelease(pressedTargets[i], _.cloneDeep(this.mouseState));
            this.handleTargetAction(pressedTargets[i], 'Release');
        }
        this.state.currentPressedTargets = []


    },
    handleDraggingEnd:function (mouseState,lastMouseState) {
        var pressedTargets = this.state.currentPressedTargets;
        var canvas = this.dragTarget
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

                            var anchor = false
                            if(leftTranslateX>0){
                                anchor = false
                            }else if(rightTranslateX<0){
                                anchor = true
                            }else{
                                if(elem.translate.x > 0.5*canvas.w){
                                    anchor = true
                                }
                            }
                            

                            if (targetTag) {
                                if (targetTag.value == pos){
                                    this.startSwipeAnimation(canvas,subCanvas,false,anchor)
                                }else{
                                    this.setTagByTag(targetTag, pos)
                                    this.draw(null,{updatedTagName:canvas.tag})
                                }


                            }else{
                                this.startSwipeAnimation(canvas,subCanvas,false,anchor)
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

                            var anchor = false
                            if(leftTranslateY>0){
                                anchor = false
                            }else if(rightTranslateY<0){
                                anchor = true
                            }else{
                                if(elem.translate.x > 0.5*canvas.w){
                                    anchor = true
                                }
                            }

                            if (targetTag) {
                                if (targetTag.value == pos){
                                    this.startSwipeAnimation(canvas,subCanvas,true,anchor)
                                }else{
                                    this.setTagByTag(targetTag, pos)
                                    this.draw(null,{updatedTagName:canvas.tag})
                                }


                            }else{
                                this.startSwipeAnimation(canvas,subCanvas,true,anchor)
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
    startSwipeAnimation:function (canvas,subCanvas,vertical,anchor) {
        vertical = !!vertical
        var startX = subCanvas.translate && subCanvas.translate.x || 0
        var startY = subCanvas.translate && subCanvas.translate.y || 0
        if (vertical){
            startX = 0
        }else{
            startY = 0
        }
        var frames = this.fps
        var duration = canvas.transition.duration||this.defaultDuration
        var easing = 'linear'

        window.swipingSC = subCanvas


        subCanvas.animating = true
        

        var springLen
        var initialVelocity

        var swipeAnime
        var self = this
        if (!vertical){
            springLen = canvas.w
            initialVelocity = (subCanvas.stepX*1000/self.fps||0)/springLen
            if(anchor){
                //right
                swipeAnime = new AnimationAPI.SpringAnimation(null,'x',-initialVelocity,this.defaultDamping,this.defaultStifness,{x:springLen},{x:0},duration,(springLen-startX+springLen)/springLen)
                swipeAnime.onFrameCB = function () {
                    subCanvas.animating = true
    
                    subCanvas.translate = {
                        x:this.state.curValue.x,
                        y:0
                    }
                    // console.log(this.state.curValue.x)
    
                    self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
                }
            }else{
                //left
                swipeAnime = new AnimationAPI.SpringAnimation(null,'x',initialVelocity,this.defaultDamping,this.defaultStifness,{x:-springLen},{x:0},duration,(startX+springLen)/springLen)
                swipeAnime.onFrameCB = function () {
                    subCanvas.animating = true
    
                    subCanvas.translate = {
                        x:this.state.curValue.x,
                        y:0
                    }
                    // console.log(this.state.curValue.x)
    
                    self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
                }
            }
            
            
        }else {
            springLen = canvas.h
            initialVelocity = (subCanvas.stepY*1000/self.fps||0)/springLen
            if(anchor){
                //right
                swipeAnime = new AnimationAPI.SpringAnimation(null,'y',-initialVelocity,this.defaultDamping,this.defaultStifness,{y:springLen},{y:0},duration,(springLen-startY+springLen)/springLen)
                swipeAnime.onFrameCB = function () {
                    subCanvas.animating = true
    
                    subCanvas.translate = {
                        x:0,
                        y:this.state.curValue.y
                    }
                    // console.log(this.state.curValue.x)
    
                    self.syncSubCanvasOffsetForSwipe(canvas,canvas.curSubCanvasIdx,!vertical,vertical)
                }
            }else{
                //left
                swipeAnime = new AnimationAPI.SpringAnimation(null,'y',initialVelocity,this.defaultDamping,this.defaultStifness,{y:-springLen},{y:0},duration,(startY+springLen)/springLen)
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
                    case 'MySlideBlock':
                        elem.mouseState = mouseState;
                        /*var targetTag = this.findTagByName(elem.tag);
                        this.setTagByTag(targetTag, 1);*/
                        needRedraw = true;
                        break;
                    case 'MySelector':
                        elem.mouseState = mouseState;
                        var targetTag = this.findTagByName(elem.tag);
                        var minAbsD = Infinity
                        var height = elem.info.height
                        var showCount = elem.info.showCount
                        if((showCount&1) === 0){
                            showCount++
                        }
                        var count = elem.info.count
                        var curValue = elem.curValue||0
                        var elementHeight = height/showCount
                        // var elementWidth = width
                        var centerIdx = parseInt(showCount/2)
                        var centerTop = elementHeight * centerIdx
                        var offsetY = elem.translateY || 0
                        var minPos
                        for(var i=0;i<count;i++){
                            
                            var curElementTop = (centerIdx - curValue + i)*elementHeight + offsetY
                            var curD = Math.abs(curElementTop - centerTop)
                            if(curD<minAbsD){
                                minAbsD = curD
                                minPos = i
                            }
                            
                        }
                        // elem.translateY = 0;
                        this.setTagByTag(targetTag, minPos);
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
        var tag = this.findTagByName(name)
        if (tag) {
            this.setTagByType(tag,value)
            // this.setState({tag: tag})
        }
    },
    setTagByType:function (tag,_value) {
        if(tag){
            switch (tag.valueType){
                case 1:
                    //str
                    tag.value = StringConverter.convertStrToUint8Array(_value,this.encoding).slice(0,32)
                    this.setState({tag:tag})
                    break;
                default:
                    //num
                    //consider wavefilters
                    if(tag.waveFilter!==undefined && tag.waveFilter!==null&& tag.waveFilter!==''){
                        WaveFilterManager.calTagWithWaveFilter(tag.name,tag.value,Number(_value)||0,tag.waveFilter,function(currentVal){
                            tag.value = currentVal
                            this.setState({tag:tag},function(){
                                this.draw(null, {
                                    updatedTagName: tag.name
                                })
                            }.bind(this))
                        }.bind(this))
                    }else{
                        tag.value = Number(_value)||0
                        this.setState({tag:tag})
                    }
                    

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
                    return StringConverter.convertUint8ArrayToStr(tag.value,this.encoding)
                default:
                    console.log('tag type unsupported')
            }
        }
    },
    setTagByTag: function (tag, value) {
        if (tag) {
            this.setTagByType(tag,value)
            // this.setState({tag: tag})
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
                    value = param.value;
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
          return StringConverter.convertUint8ArrayToStr(pValue,this.encoding)
      }
    },
    process: function (cmds,index) {
        //console.log(cmds,index);

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
            step: 1,
            delay: false
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
                var param2Value = Number(this.getParamValue(param2));
                if (curPageTag) {
                    if (param2Value > 0 && param2Value <= project.pageList.length) {
                        // curPageTag.value = param2;
                        this.setTagByTag(curPageTag, param2Value);
                        this.draw(null, {
                            updatedTagName: project.tag
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
                var firstValue = Number(this.getParamValue(param1))
                var secondValue = Number(this.getParamValue(param2))
                if (firstValue == secondValue){
                    nextStep.step = 2;
                } else {
                    nextStep.step = 1;
                }
                break;
            case 'NEQ':
                var firstValue = Number(this.getParamValue(param1))
                var secondValue = Number(this.getParamValue(param2))
                if (firstValue != secondValue){
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
                    // readNum = firstValue;
                    // readStartId = secondValue;
                    readNum = secondValue;
                    readStartId = firstValue;
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
                    this.setTagByTag(targetTag, this.getParamValue(param2))
                    this.draw(null,{
                        updatedTagName:param1.tag
                    });
                }
                break;
            case 'DELAY':
                if (param2.value) {
                    nextStep.delay = true;
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
            case 'PLAY_SOUND':
                // this.state.imageList.forEach(function(res){
                //     if(res.type &&res.type.match(/audio/)){
                //         res.content.play()
                //     }
                // })
                //window.audioList[0].connect(window.audioCtx)
                //window.audioList[0].start(0)

                // var bufferSrc = audioCtx.createBufferSource();
                // bufferSrc.buffer =window.audioList[0];
                // //bufferSrc.connect(gainNode);
                // bufferSrc.connect(window.audioCtx.destination);
                // bufferSrc.start(0)
                // AudioManager.addNewAudioAndPlay(this.state.project.trackList[0].buffer)
                // AudioManager.addNewAudioAndPlay(this.state.project.trackList[1].buffer)



                //window.audioList[0].play()
                // window.audioCtx.play()
                var param2Value = this.getParamValue(param2);

                var playTrackIndex = param2Value

                //console.log(this.state.project.trackList);

                for(var i=0;i<this.state.project.trackList.length;i++){
                    var curTrack = this.state.project.trackList[i]

                    if(curTrack.index == playTrackIndex){
                        //hit
                        if(curTrack.key){
                            AudioManager.playAudioWithKey(curTrack.key)
                        }else{
                            curTrack.key = AudioManager.addNewAudioAndPlay(curTrack.buffer,{
                                loop:curTrack.loop||false
                            })
                        }
                    }
                }

                break;
            case 'PAUSE_SOUND':
            var param2Value = this.getParamValue(param2);

            var playTrackIndex = param2Value
            for(var i=0;i<this.state.project.trackList.length;i++){
                var curTrack = this.state.project.trackList[i]
                if(curTrack.index == playTrackIndex){
                    //hit
                    var key = curTrack.key
                    if(key){
                        AudioManager.pauseAudioWithKey(key)
                    }
                }
            }


            break;
            case 'RESUME_SOUND':
            var param2Value = this.getParamValue(param2);

            var playTrackIndex = param2Value
            for(var i=0;i<this.state.project.trackList.length;i++){
                var curTrack = this.state.project.trackList[i]
                if(curTrack.index == playTrackIndex){
                    //hit
                    var key = curTrack.key
                    if(key){
                        AudioManager.resumeAudioWithKey(key)
                    }
                }
            }


            break;
            case 'STOP_SOUND':
            var param2Value = this.getParamValue(param2);

            var playTrackIndex = param2Value
            for(var i=0;i<this.state.project.trackList.length;i++){
                var curTrack = this.state.project.trackList[i]
                if(curTrack.index == playTrackIndex){
                    //hit
                    var key = curTrack.key
                    if(key){
                        AudioManager.stopAudioWithKey(key)
                    }
                }
            }


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
            if (nextStep.delay){
                setTimeout(function () {
                    this.process(cmds, index + nextStep.step);
                }.bind(this),Number(param2.value))
            }else {
                this.process(cmds, index + nextStep.step);
            }
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
                //if (tag.writeOrRead == 'false' || tag.writeOrRead == 'readAndWrite') {
                    //write
                    register.value = tag.value;
                //}
            }
            //update
            // this.updateRegisters();
            // console.log(this.registers);
            this.setState({registers: registers});
        } else if (rwType == 'read') {
            for (i = 0; i < tags.length; i++) {
                tag = tags[i];
                //if (tag.writeOrRead == 'true' || tag.writeOrRead == 'readAndWrite') {
                    //read
                    updatedTagNames.push(tag.name);
                    this.setTagByTagRawValue(tag, register.value);
                //}
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
    render: function () {
        return (
            < div className='simulator'>
                < div className='simulator-canvas-wrapper' onMouseDown={this.handlePress} onMouseMove={this.handleMove}
                      onMouseUp={this.handleRelease}>
                    <div className='simulator-tools-wrapper'>
                        <div className='simulator-tools__fps'>
                            <span>帧率&nbsp;</span>
                            <span>{this.state.fps}</span>
                        </div>

                        <div className='simulator-tools__scale'>
                            <select onChange={this.handleViewScale} defaultValue='1'>
                                <option value='0.5'>50%</option>
                                <option value='0.75'>75%</option>
                                <option value='1'>100%</option>
                                <option value='1.5'>150%</option>
                                <option value='2'>200%</option>
                            </select>
                        </div>
                    </div>

                    <canvas ref='canvas' className='simulator-canvas' id="simulator-canvas"/>
                    < canvas ref='offcanvas' hidden className='simulator-offcanvas'/>
                    < canvas ref='tempcanvas' hidden className='simulator-tempcanvas'/>
                </div>

                <div className='simulator-attribute-wrapper'>
                    <div className='simulator-setting-wrapper'>
                        <div className='simulator-setting__ratio'>
                            <span>纵横比&nbsp;&nbsp;1&nbsp;:&nbsp;</span><input type='number' min='0' onKeyDown={this.setPixelRatio}/>
                        </div>
                        <div className="simulator-setting__keyboard">
                            <span onClick={this.handleMoveNext.bind(null, 'left')}> &lt; </span>
                            <span onMouseDown={this.handleOk.bind(null, 'press')} onMouseUp={this.handleOk.bind(null, 'release')}>OK</span>
                            <span onClick={this.handleMoveNext.bind(null, 'right')}> &gt; </span>
                        </div>
                    </div>
                    <div className="simulator-tag-wrapper">
                        < TagList tagList={_.cloneDeep(this.state.tagList)} updateTag={this.updateTag} encoding={this.encoding}  />
                        <RegisterList registers={this.state.registers || {}}
                                      handleRegisterChange={this.handleRegisterChange}
                                      encoding={this.encoding}
                                      />
                    </div>
                </div>

            </div>);
    }
});