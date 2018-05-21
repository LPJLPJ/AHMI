ideServices.service('ProjectTransformService',['Type','ResourceService','TemplateProvider',function(Type,ResourceService,TemplateProvider){

    /**
     * 暴露对外接口
     */
    this.transDataFile = transDataFile;

    var idStart=0;

    /**
     * 转换工程数据
     */
    function transDataFile(rawProject){
        var targetProject = {};
        targetProject.version = rawProject.version;
        targetProject.name = rawProject.name || 'default project';
        targetProject.author = rawProject.author || 'author';
        targetProject.size = rawProject.currentSize;
        //register general commands
        var commandsObj = registerGeneralCommands();
        targetProject.generalWidgetCommands = commandsObj.commands;
        targetProject.cppWidgetCommands = commandsObj.cppModels;
        //add last save info
        targetProject.lastSaveTimeStamp = rawProject.lastSaveTimeStamp;
        targetProject.lastSaveUUID = rawProject.lastSaveUUID;
        targetProject.pageList = [];
        for (var i=0;i<rawProject.pages.length;i++){
            targetProject.pageList.push(transPage(rawProject.pages[i],i));
        }

        //添加系统控件
        transSysWidgets(targetProject);

        //添加系统控件页面
        var sysWidgetPageTemplate = {
            "name": "NewPage",
            backgroundColor: 'rgb(212,212,212)',
            backgroundImage: '',
            actions: undefined,
            tag: '',
            triggers: undefined,
            type:'MyPage',
            transition: {
                "name": "NO_TRANSITION",
                "show": "无动画",
                "duration": 0
            },
            canvasList: [
                {
                    "type": "MyLayer",
                    "name": "NewCanvas",
                    "transition": {
                        "name": "NO_TRANSITION",
                        "show": "无动画",
                        "duration": 0
                    },
                    curSubCanvasIdx: 0,
                    w: targetProject.size.width,
                    h: targetProject.size.height,
                    x: 0,
                    y: 0,
                    zIndex: 0,
                    subCanvasList: [
                        {
                            "type": "MySubLayer",
                            "name": "NewSubCanvas",
                            widgetList: [

                            ]
                        }
                    ]

                }
            ]

        };
        //添加系统控件页面返回按钮
        var defaultMargin = 5
        var sysCanvas = sysWidgetPageTemplate.canvasList[0]
        var minReturnButtonSize = Math.ceil(0.05*Math.min(sysCanvas.w,sysCanvas.h))

        var returnButtonImgSrc = '/public/images/returnButton/returnIcon.png'
        // var returnButtonData = {
        //     type:'widget',
        //     subType:'MyReturnButton',
        //     buttonModeId:'0',
        //     info :{
        //         width:minReturnButtonSize,
        //         height: minReturnButtonSize,
        //         left: sysCanvas.w-minReturnButtonSize-defaultMargin, top: defaultMargin,
        //         originX: 'center', originY: 'center',
        //         arrange:true,
        //
        //         text:'',
        //         fontFamily:"宋体",
        //         fontSize:20,
        //         fontColor:'rgba(0,0,0,1)',
        //         fontBold:"100",
        //         fontItalic:'',
        //     },
        //     texList:[{
        //         name:'按钮纹理',
        //         currentSliceIdx:0,
        //         slices:[{
        //             color:'rgba(255,0,0,0)',
        //             imgSrc:returnButtonImgSrc,
        //             name:'按下前'
        //         },{
        //             color:'rgba(0,255,0,0)',
        //             imgSrc:returnButtonImgSrc,
        //             name:'按下后'
        //         },{
        //             color:'rgba(244,244,244,0.3)',
        //             imgSrc:'',
        //             name:'高亮'
        //         }]
        //     }]
        // }
        var returnButtonData = {
            "info": {
                width:minReturnButtonSize,
                height: minReturnButtonSize,
                left: sysCanvas.w-minReturnButtonSize-defaultMargin,
                top: defaultMargin,

            },
            "enableHighLight": true,
            "highLightNum": 0,
            "maxHighLightNum": 1,
            "mode": 0,
            "layers": [
                {
                    "subLayers": {
                        "roi": null,
                        "font": null,
                        "image": {
                            "textureList": [
                                returnButtonImgSrc
                            ],
                            "texture": 0,
                            "type": 0
                        },
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0,
                            "a": 0
                        }
                    },
                    "x": 0,
                    "y": 0,
                    "width": minReturnButtonSize,
                    "height": minReturnButtonSize,
                    "rotateAngle": 0,
                    "hidden": false,
                    "validSubLayer": 7,
                    "rotateCenterX": 0,
                    "rotateCenterY": 0
                },
                {
                    "subLayers": {
                        "roi": null,
                        "font": null,
                        "image": {
                            "textureList": [
                                returnButtonImgSrc
                            ],
                            "texture": 0,
                            "type": 0
                        },
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0,
                            "a": 0
                        }
                    },
                    "x": 0,
                    "y": 0,
                    "width": minReturnButtonSize,
                    "height": minReturnButtonSize,
                    "rotateAngle": 0,
                    "hidden": false,
                    "validSubLayer": 7,
                    "rotateCenterX": 0,
                    "rotateCenterY": 0
                },
                {
                    "subLayers": {
                        "roi": null,
                        "font": null,
                        "image": null,
                        "color": {
                            "r": 244,
                            "g": 244,
                            "b": 244,
                            "a": 76.5
                        }
                    },
                    "x": 0,
                    "y": 0,
                    "width": minReturnButtonSize,
                    "height": minReturnButtonSize,
                    "rotateAngle": 0,
                    "hidden": true,
                    "validSubLayer": 7,
                    "rotateCenterX": 0,
                    "rotateCenterY": 0
                }
            ],
            "otherAttrs": [],
            "generalType": "Button",
            "subType": "general",
            "actions": [
                {
                    "title": "action0",
                    "trigger": "Release",
                    "commands": [
                        {
                            "label": "",
                            "cmd": [
                                {
                                    "name": "GOTO",
                                    "symbol": "->"
                                },
                                {
                                    "tag": "a",
                                    "value": ""
                                },
                                {
                                    "tag": "",
                                    "value": -1
                                }
                            ]
                        }
                    ],
                    "newAction": false
                }
            ],
            "id": "0.0.0.1",
            "type": "widget",
            "wId": 1
        }
        var systemWidgetResources = []
        var systemWidgetPages = (targetProject.systemWidgets||[]).map(function (sw,i) {
            var pageData = _.cloneDeep(sysWidgetPageTemplate)
            pageData.canvasList[0].subCanvasList[0].widgetList[0] = sw
            //push return button
            pageData.canvasList[0].subCanvasList[0].widgetList[1] = _.cloneDeep(returnButtonData)
            // targetProject.pageList.push(pageData)
            var swRes = [];
            (sw.layers||[]).forEach(function (layer) {
                layer.subLayers.image && (swRes = swRes.concat(layer.subLayers.image.textureList))
            })
            systemWidgetResources = systemWidgetResources.concat(swRes)
            return pageData
        })
        systemWidgetResources = systemWidgetResources.map(function (r) {
            return {id:getFileName(r),name:getFileName, type:'image/png',src:r}
        }.bind(this))


        for (var i=0;i<systemWidgetPages.length;i++){
            targetProject.pageList.push(systemWidgetPages[i])
        }

        targetProject.systemWidgetResources = systemWidgetResources



        return targetProject;
    }

    function getFileName(fileUrl) {
        var parts =  (fileUrl||'').split('/')
        return parts[parts.length-1]
    }

    /**
     * 注册指令
     * 敲黑板！WidgetModel,WidgetCommands，widgetCompiler,ASTTransformer,cppWidgetCommandTranslator是全局变量，
     * 分别从widget.js、widgetCommands.js、widgetCompiler.js,ASTTransformer.js,cppWidgetCommandTranslator.js导出。
     * 这里体现了es5没有声明式模块化的短板。
     * 很尴尬，这里的局部变量commands也被弃用了,核心是第二个循环。
     */
    function registerGeneralCommands() {
        var generalWidgetFunctions = ['onInitialize','onDestroy','onMouseUp','onMouseDown','onTagChange','onMouseMove','onKeyBoardLeft','onKeyBoardRight','onKeyBoardOK','onAnimationFrame','onHighlightFrame'];
        var commands = {};
        var models = WidgetModel.models;

        var testModels = _.cloneDeep(WidgetCommands);

        for (var model in models){
            if (models.hasOwnProperty(model)) {
                //Button
                var modelCommands = _.cloneDeep(models[model].prototype.commands);
                transGeneralWidgetMultiCommands(modelCommands,generalWidgetFunctions);
                commands[model] = modelCommands;
            }
        }

        var cppModels = {};
        for (var model in testModels){
            cppModels[model] = {};
            if (testModels.hasOwnProperty(model)) {
                var modelObj = testModels[model];
                for(var i=0;i<generalWidgetFunctions.length;i++){
                    var curF = generalWidgetFunctions[i];
                    if (curF in modelObj) {
                        /**for web**/
                        var ast = widgetCompiler.parse(modelObj[curF]);
                        // console.log('ast',ast)
                        modelObj[curF] = ASTTransformer.transAST(ast);
                        //trans to jump end
                        transGeneralWidgetCommands(modelObj,curF);

                        /**for embedded**/
                        cppModels[model][curF] = cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[curF])
                    }
                }
            }
        }

        console.log('testModels',testModels);
        console.log('cppModels',cppModels);
        // return commands;
        return {
            commands:testModels,
            cppModels:cppModels
        }
    }

    /**
     * 转换控件指令
     */
    function transGeneralWidgetMultiCommands(widget,mfs) {
        for (var i=0;i<mfs.length;i++){
            var curF = mfs[i];
            transGeneralWidgetCommands(widget,curF)
        }
    }
    function transGeneralWidgetCommands(widget,f) {
        if (f in widget) {
            widget[f] = WidgetModel.WidgetCommandParser.complier.transformer.trans(WidgetModel.WidgetCommandParser.complier.parser.parse(widget[f]),true).map(function (cmd) {
                return cmd['cmd']
            })
        }

    }


    /**
     * 转换page数据
     */
    function transPage(rawPage, index){
        var targetPage = {};
        targetPage.id = ''+index;
        targetPage.type = Type.MyPage;
        // console.log(rawPage);
        deepCopyAttributes(rawPage,targetPage,['name','backgroundImage','backgroundColor','triggers','actions','tag','transition']);
        transActions(targetPage);
        //CanvasList
        targetPage.canvasList = [];
        for (var i=0;i<rawPage.layers.length;i++){
            targetPage.canvasList.push(transLayer(rawPage.layers[i],i,targetPage.id));
        }
        return targetPage;
    }

    /**
     * 转换图层数据
     */
    function transLayer(rawLayer,layerIdx,pageIdx){
        var targetLayer = {};
        targetLayer.id = pageIdx+'.'+layerIdx;
        targetLayer.type = Type.MyLayer;
        deepCopyAttributes(rawLayer,targetLayer,['name','triggers','actions','tag','zIndex','animations','transition']);
        transActions(targetLayer);
        targetLayer.w = rawLayer.info.width;
        targetLayer.h = rawLayer.info.height;
        targetLayer.x = rawLayer.info.left;
        targetLayer.y = rawLayer.info.top;

        targetLayer.subCanvasList = [];
        //curSubCanvasIdx
        for (var i=0;i<rawLayer.subLayers.length;i++){
            var curSubLayer = rawLayer.subLayers[i];
            if (rawLayer.showSubLayer.id == curSubLayer){
                targetLayer.curSubCanvasIdx = i;
            }
            targetLayer.subCanvasList.push(transSubLayer(curSubLayer,i,targetLayer.id));
        }
        return targetLayer;
    }

    /**
     * 转换子图层数据
     */
    function transSubLayer(rawSubLayer,subLayerIdx,layerIdx){
        var targetSubLayer = {};
        targetSubLayer.id = layerIdx+'.'+subLayerIdx;
        targetSubLayer.type = Type.MySubLayer;
        deepCopyAttributes(rawSubLayer,targetSubLayer,['name','info','tag','actions','zIndex','backgroundImage','backgroundColor']);
        transActions(targetSubLayer);

        targetSubLayer.widgetList = [];
        for (var i=0;i<rawSubLayer.widgets.length;i++){
            var curWidget = rawSubLayer.widgets[i];
            var transedWidget=transWidget(curWidget,i,targetSubLayer.id);
            if(transedWidget){
                targetSubLayer.widgetList.push(transedWidget);
            }

        }

        return targetSubLayer;
    }

    /**
     * 转换控件数据
     */
    function transWidget(rawWidget,widgetIdx,subLayerIdx){
        var targetWidget = {};
        var generalWidget = {};
        var fps = 30;
        var defaultDuration = 1000;

        targetWidget = _.cloneDeep(rawWidget);
        transActions(targetWidget);
        if (targetWidget.type != 'general') {
            var info = targetWidget.info;
            var texList = targetWidget.texList;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            var highLight = false;
            switch (targetWidget.type) {
                case 'MyButton':
                    highLight = !targetWidget.info.disableHighlight;
                    var fontStyle = {};
                    for (var key in info) {
                        switch (key) {
                            case "fontItalic":
                                fontStyle['font-style'] = info[key];
                                break;
                            case "fontBold":
                                fontStyle['font-weight'] = info[key];
                                break;
                            case "fontSize":
                                fontStyle['font-size'] = info[key];
                                break;
                            case "fontFamily":
                                fontStyle['font-family'] = info[key];
                                break;
                            case "fontColor":
                                fontStyle['font-color'] = info[key];
                                break;
                        }
                    }
                    generalWidget = new WidgetModel.models['Button'](x, y, w, h, info.text, fontStyle, targetWidget.texList[0].slices, highLight);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Button';
                    generalWidget.mode = Number(rawWidget.buttonModeId);
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);

                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions
                    break;
                case 'MyButtonGroup':
                    highLight = !info.disableHighlight;
                    var slices = [];
                    texList.map(function (curTex) {
                        curTex.slices.map(function (slice) {
                            slices.push(slice)
                        })
                    });

                    generalWidget = new WidgetModel.models['ButtonGroup'](x, y, w, h, info.count || 1, (info.arrange === "horizontal" ? 0 : 1), info.interval || 0, slices, highLight);
                    generalWidget = generalWidget.toObject();

                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.generalType = 'ButtonGroup';
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;

                    generalWidget['totalHLFrame'] = highLight ? (200 / 1000 * fps) : undefined;

                    //other attrs
                    generalWidget.otherAttrs[0] = info.interval; //间距
                    generalWidget.otherAttrs[1] = info.count;    //按钮个数
                    generalWidget.otherAttrs[2] = 1;             //高亮动画起始值
                    generalWidget.otherAttrs[3] = 1;             //高亮动画终止值
                    //Todo:默认属性中有arrange，但是在simulaor中无法解析错误，故使用otherAttrs
                    generalWidget.otherAttrs[4] = (info.arrange === "horizontal" ? 0 : 1); //排列方向
                    break;
                case 'MyDashboard':
                    generalWidget = new WidgetModel.models['Dashboard'](x, y, w, h, targetWidget.dashboardModeId, targetWidget.texList, targetWidget.info)
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Dashboard';
                    generalWidget.mode = Number(rawWidget.dashboardModeId);
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'minValue,maxValue,minAngle,maxAngle,lowAlarmValue,highAlarmValue';
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    })
                    //animation
                    // console.log('enableAnimation',info.enableAnimation)
                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration / 1000 * fps;
                    }
                    //otherAttrs
                    generalWidget.otherAttrs[0] = info['offsetValue'] || 0
                    generalWidget.otherAttrs[1] = Number(info['clockwise'])
                    generalWidget.actions = targetWidget.actions
                    break;
                case 'MyProgress':
                    var slices = [];
                    targetWidget.texList.map(function (tex) {
                        slices.push(tex.slices[0]);
                    });
                    generalWidget = new WidgetModel.models['Progress'](x, y, w, h, targetWidget.info, slices);
                    generalWidget = generalWidget.toObject();
                    console.log('generalWidget progress',generalWidget);
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.mode = Number(rawWidget.info.progressModeId);
                    generalWidget.arrange = targetWidget.info.arrange==='horizontal'?0:1 //0水平，1竖直
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue';
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    });
                    //animation
                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration / 1000 * fps;
                    }
                    generalWidget.actions = targetWidget.actions;
                    generalWidget.generalType = 'Progress';
                    generalWidget.subType = 'general';
                    //otherAttrs
                    var colorElems
                    if (generalWidget.mode == 1) {
                        colorElems = parseColor(slices[1].color);
                        generalWidget.otherAttrs[0] = colorElems.r;
                        generalWidget.otherAttrs[1] = colorElems.g;
                        generalWidget.otherAttrs[2] = colorElems.b;
                        generalWidget.otherAttrs[3] = colorElems.a;
                        colorElems = parseColor(slices[2].color);
                        generalWidget.otherAttrs[4] = colorElems.r;
                        generalWidget.otherAttrs[5] = colorElems.g;
                        generalWidget.otherAttrs[6] = colorElems.b;
                        generalWidget.otherAttrs[7] = colorElems.a;
                    } else if (generalWidget.mode == 3) {
                        generalWidget.otherAttrs[0] = Number(targetWidget.info.thresholdModeId);
                        generalWidget.otherAttrs[1] = targetWidget.info.threshold1;
                        generalWidget.otherAttrs[2] = targetWidget.info.threshold2;
                        colorElems = parseColor(slices[1].color);
                        generalWidget.otherAttrs[3] = colorElems.r;
                        generalWidget.otherAttrs[4] = colorElems.g;
                        generalWidget.otherAttrs[5] = colorElems.b;
                        generalWidget.otherAttrs[6] = colorElems.a;
                        colorElems = parseColor(slices[2].color);
                        generalWidget.otherAttrs[7] = colorElems.a;
                        generalWidget.otherAttrs[8] = colorElems.g;
                        generalWidget.otherAttrs[9] = colorElems.b;
                        generalWidget.otherAttrs[10] = colorElems.a;
                        if (targetWidget.info.thresholdModeId == 2) {
                            colorElems = parseColor(slices[3].color);
                            generalWidget.otherAttrs[11] = colorElems.a;
                            generalWidget.otherAttrs[12] = colorElems.g;
                            generalWidget.otherAttrs[13] = colorElems.b;
                            generalWidget.otherAttrs[14] = colorElems.a;
                        }
                    }
                    generalWidget.otherAttrs[19] = Number(rawWidget.info.cursor);
                    if (rawWidget.info.cursor == '1') {
                        var imgSrc = slices[slices.length - 1].imgSrc;
                        if (imgSrc) {
                            var cursorImg = ResourceService.getResourceFromCache(imgSrc);
                            generalWidget.layers[2].width = cursorImg.width;
                            generalWidget.layers[2].height = cursorImg.height;
                            rawH = generalWidget.layers[0].height;
                            yTemp = parseInt((rawH - cursorImg.height) / 2);
                            generalWidget.layers[2].y = yTemp;
                        }
                    }


                    break;
                case 'MyRotateImg':
                    generalWidget = new WidgetModel.models['RotateImg'](x, y, w, h, targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'RotateImg';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'minValue,maxValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    })
                    //otherAttrs
                    generalWidget.actions = targetWidget.actions
                    break;
                case 'MyTextArea':
                    // "fontFamily": "宋体",
                    // "fontSize": 15,
                    // "fontColor": "rgba(0,0,0,1)",
                    // "fontBold": "100",
                    // "fontItalic": "",
                    // "fontUnderline": null,
                    var styleElems = "fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline"
                    var fontStyle = {}
                    styleElems.split(',').forEach(function (elem) {
                        fontStyle[elem] = info[elem]
                    });
                    generalWidget = new WidgetModel.models['TextArea'](x, y, w, h, info.text, fontStyle, targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'TextArea';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    break;
                case 'MySwitch':
                    var slices = [];
                    targetWidget.texList.map(function (tex) {
                        slices.push(tex.slices[0]);
                    });
                    generalWidget = new WidgetModel.models['Switch'](x, y, w, h, targetWidget.info, slices);
                    generalWidget = generalWidget.toObject();
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.generalType = 'Switch';
                    generalWidget.subType = 'general';
                    generalWidget.otherAttrs[0] = Number(targetWidget.info.bindBit);
                    break;
                case 'MyScriptTrigger':
                    generalWidget = new WidgetModel.models['ScriptTrigger'](x, y, w, h)
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'ScriptTrigger';

                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    });
                    //add minValue, maxValue
                    generalWidget['minValue'] = generalWidget['lowAlarmValue'] - 1
                    generalWidget['maxValue'] = generalWidget['highAlarmValue'] + 1
                    generalWidget.actions = targetWidget.actions;

                    break;
                case 'MyVideo':
                    generalWidget = new WidgetModel.models['Video'](x, y, w, h, targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Video';
                    if (info.scource == 'HDMI') {
                        generalWidget.mode = 0
                    } else {
                        generalWidget.mode = 1
                    }
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    break;
                case 'MySlide':
                    generalWidget = new WidgetModel.models['Slide'](x, y, w, h, targetWidget.info, _.cloneDeep(targetWidget.texList[0].slices));
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Slide';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MySlideBlock':
                    var imgSrc = targetWidget.texList[1].slices[0].imgSrc;
                    var blockInfo = {w: 0, h: 0}
                    if (imgSrc) {
                        var blockImg = ResourceService.getResourceFromCache(imgSrc);
                        if (blockImg) {
                            blockInfo.w = blockImg.width;
                            blockInfo.h = blockImg.height;
                        }else{
                            console.log("slideBlock need img slice!");
                            return null;
                        }

                    }else{
                        console.log("slideBlock need img slice!");
                        return null;
                    }
                    generalWidget = new WidgetModel.models['SlideBlock'](x, y, w, h, info.arrange, blockInfo, [targetWidget.texList[0].slices[0], targetWidget.texList[1].slices[0]]);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'SlideBlock';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    })
                    generalWidget.arrange = (info.arrange == 'horizontal') ? 0 : 1
                    // console.log(generalWidget,targetWidget)
                    generalWidget.otherAttrs[0] = 0 //lastX
                    generalWidget.otherAttrs[1] = 0 //lastY
                    generalWidget.otherAttrs[2] = blockInfo.w
                    generalWidget.otherAttrs[3] = blockInfo.h
                    generalWidget.otherAttrs[4] = 0 //hit block
                    generalWidget.otherAttrs[5] = 0 // last block x
                    generalWidget.otherAttrs[6] = 0 //last block y
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MyNum':
                    var styleElems = "fontFamily,fontSize,fontColor,fontBold,fontItalic,fontUnderline"
                    var fontStyle = {}
                    for (var key in info) {
                        switch (key) {
                            case "fontItalic":
                                fontStyle['font-style'] = info[key];
                                break;
                            case "fontBold":
                                fontStyle['font-weight'] = info[key];
                                break;
                            case "fontSize":
                                fontStyle['font-size'] = info[key];
                                break;
                            case "fontFamily":
                                fontStyle['font-family'] = info[key];
                                break;
                            case "fontColor":
                                fontStyle['font-color'] = info[key];
                                break;
                        }
                    }
                    generalWidget = new WidgetModel.models['Num'](x, y, w, h, info, fontStyle);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    })
                    generalWidget.mode = Number(info.numModeId);
                    generalWidget.otherAttrs[0] = Number(info['noInit'] != 'NO');
                    generalWidget.otherAttrs[1] = Number(info['frontZeroMode']);
                    generalWidget.otherAttrs[2] = Number(info['symbolMode']);
                    generalWidget.otherAttrs[3] = info['decimalCount'];
                    generalWidget.otherAttrs[4] = info['numOfDigits'];
                    generalWidget.otherAttrs[5] = Number(info['overFlowStyle']);
                    generalWidget.otherAttrs[6] = Number(info['maxFontWidth']);
                    switch (info['align']) {
                        case 'left':
                            generalWidget.otherAttrs[7] = 0
                            break;
                        case 'center':
                            generalWidget.otherAttrs[7] = 1
                            break;
                        case 'right':
                            generalWidget.otherAttrs[7] = 2
                            break;
                        default:
                            generalWidget.otherAttrs[7] = 1
                    }

                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration / 1000 * fps;
                    }

                    generalWidget.otherAttrs[8] = Number(info['width']);
                    generalWidget.otherAttrs[9] = Number(info['spacing']);
                    generalWidget.otherAttrs[10] = Number(info['paddingRatio']);

                    generalWidget.generalType = 'Num';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MyTexNum':
                    generalWidget = new WidgetModel.models['TexNum'](x, y, w, h, info, targetWidget.texList[0].slices);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    })
                    generalWidget.mode = Number(info.numModeId)
                    generalWidget.otherAttrs[0] = Number(info['numValue']);//初始化的数字值
                    generalWidget.otherAttrs[1] = Number(info['frontZeroMode']);//前导零模式
                    generalWidget.otherAttrs[2] = Number(info['symbolMode']);//符号模式
                    generalWidget.otherAttrs[3] = Number(info['decimalCount']);//小数位数
                    generalWidget.otherAttrs[4] = Number(info['numOfDigits']);//字符位数
                    generalWidget.otherAttrs[5] = Number(info['overFlowStyle']);//溢出显示
                    generalWidget.otherAttrs[6] = Number(info['characterW']);//字符宽度
                    generalWidget.otherAttrs[7] = Number(info['characterH']);//字符高度
                    generalWidget.otherAttrs[8] = Number(info['width']);//控件宽度
                    switch (info['align']) {
                        case 'left':
                            generalWidget.otherAttrs[9] = 0
                            break;
                        case 'center':
                            generalWidget.otherAttrs[9] = 1
                            break;
                        case 'right':
                            generalWidget.otherAttrs[9] = 2
                            break;
                        default:
                            generalWidget.otherAttrs[9] = 1
                    }
                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration / 1000 * fps;
                    }
                    generalWidget.generalType = 'TexNum';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    console.log('texnum', generalWidget);
                    break;
                case 'MyRotaryKnob':
                    generalWidget = new WidgetModel.models['RotaryKnob'](x, y, w, h, info, targetWidget.texList);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue';
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr] || 0
                    });
                    generalWidget.otherAttrs[1] = 0;//此位置代表了是否按下ok键，按下为1，否则为0
                    generalWidget.otherAttrs[2] = w / 2;//旋转中心x
                    generalWidget.otherAttrs[3] = h / 2;//旋转中心y
                    generalWidget.otherAttrs[4] = 0;//isHited 此位置代表了是否在mouseDown状态
                    generalWidget.otherAttrs[5] = 0 //lastArea
                    generalWidget.otherAttrs[6] = 0 //over是否非法越过原点

                    generalWidget.generalType = 'RotaryKnob';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MyColorBlock':
                    generalWidget = new WidgetModel.models['ColorBlock'](x, y, w, h);
                    generalWidget = generalWidget.toObject();

                    generalWidget.generalType = 'ColorBlock';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MySelector':
                    //纹理
                    var tempSlices = targetWidget.texList[1].slices;
                    var slicesItem = [];
                    for (var i = 0, il = tempSlices.length; i < il; i++) {
                        slicesItem[i] = {};
                        slicesItem[i].color = tempSlices[i].color;
                        slicesItem[i].text = tempSlices[i].text;
                        slicesItem[i].img = ResourceService.getResourceFromCache(tempSlices[i].imgSrc);
                    }
                    tempSlices = targetWidget.texList[2].slices;
                    var slicesSelected = [];
                    for (var i = 0, il = tempSlices.length; i < il; i++) {
                        slicesSelected[i] = {};
                        slicesSelected[i].color = tempSlices[i].color;
                        slicesSelected[i].text = tempSlices[i].text;
                        slicesSelected[i].img = ResourceService.getResourceFromCache(tempSlices[i].imgSrc);
                    }
                    var itemFontString = info.itemFont.fontItalic + " " + info.itemFont.fontBold + " " + info.itemFont.fontSize + "px" + " " + '"' + info.itemFont.fontFamily + '"';
                    var selectorFontString = info.selectorFont.fontItalic + " " + info.selectorFont.fontBold + " " + info.selectorFont.fontSize + "px" + " " + '"' + info.selectorFont.fontFamily + '"';

                    //生成前景item大图
                    var selectedImg = jointImageText(info.selectorWidth, info.selectorHeight * info.itemCount, info.selectorHeight, slicesSelected, selectorFontString, info.selectorFont.fontColor);
                    //生成后景item大图
                    var unSelectedImg = jointImageText(info.itemWidth, info.itemHeight * info.itemCount, info.itemHeight, slicesItem, itemFontString, info.itemFont.fontColor);

                    var id1 = 'selector' + (++idStart).toString() + '.png';
                    var id2 = 'selector' + (++idStart).toString() + '.png';
                    var file1 = {
                        id: id1,
                        name: 'selectedImg',
                        type: "image/png",
                        src: selectedImg.src
                    };
                    var file2 = {
                        id: id2,
                        name: 'unSelectedImg',
                        type: "image/png",
                        src: unSelectedImg.src
                    };
                    var fcb = function (e, resourceObj) {
                        if (e.type === 'error') {
                            toastr.warning('资源加载失败: ' + resourceObj.name);
                            resourceObj.complete = false;
                        } else {
                            resourceObj.complete = true;
                        }

                    }.bind(this);
                    var globalResources=ResourceService.getGlobalResources();
                    if (!isFileInGlobalResources('selector001')) {
                        ResourceService.cacheFile(file1, globalResources, null, fcb);
                    }
                    if (!isFileInGlobalResources('selector002')) {
                        ResourceService.cacheFile(file2, globalResources, null, fcb);
                    }
                    var newSelectedImgSrc = '/' + id1;
                    changeSrcInResourcesArray(globalResources,id1, newSelectedImgSrc);
                    var newUnSelectedImgSrc = '/' + id2;
                    changeSrcInResourcesArray(globalResources,id2, newUnSelectedImgSrc);
                    //实例化一个选择器控件
                    generalWidget = new WidgetModel.models['Selector'](x, y, w, h, info, targetWidget.texList[0].slices[0], newUnSelectedImgSrc, newSelectedImgSrc, targetWidget.texList[3].slices[0]);
                    generalWidget = generalWidget.toObject();

                    // generalWidget.otherAttrs[0] = Number(info['noInit'] != 'NO');//
                    //属性
                    generalWidget.otherAttrs[1] = Number(info['curValue']);//当前item
                    generalWidget.otherAttrs[2] = Number(info['itemCount']);//item总数
                    generalWidget.otherAttrs[3] = Number(info['itemShowCount']);//item总数
                    //宽高
                    generalWidget.otherAttrs[4] = Number(info['width']);//控件宽
                    generalWidget.otherAttrs[5] = Number(info['height']);//控件高
                    generalWidget.otherAttrs[6] = Number(info['itemWidth']);//未选中元素宽
                    generalWidget.otherAttrs[7] = Number(info['itemHeight']);//未选中元素高
                    generalWidget.otherAttrs[8] = Number(info['selectorWidth']);//选中元素宽
                    generalWidget.otherAttrs[9] = Number(info['selectorHeight']);//选中元素高
                    generalWidget.otherAttrs[10] = 0;//此位置代表了是否按下ok键，按下为1，否则为0
                    generalWidget.otherAttrs[11] = x;//控件坐标x
                    generalWidget.otherAttrs[12] = y;//控件坐标y
                    generalWidget.otherAttrs[13] = 0;//选择框是否展开
                    generalWidget.otherAttrs[14] = 0;//isMoved,是否已经被拖拽
                    generalWidget.otherAttrs[15] = 0;//lastlastInnery


                    generalWidget.generalType = 'Selector';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;

                case 'MyTexTime':
                    generalWidget = new WidgetModel.models['TexTime'](x,y,w,h,info,texList[0].slices,texList[1].slices[0]);
                    generalWidget = generalWidget.toObject();
                    //数字个数
                    var digitCount=0;
                    switch (info['dateTimeModeId']) {
                        case '0'://时分秒
                            digitCount = 6;
                            generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量时分秒';
                            break;
                        case '1'://时分
                            digitCount = 4;
                            generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量时分秒';
                            break;
                        case '2'://斜杠日期
                            digitCount = 8;
                            generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量年月日';
                            break;
                        case '3'://减号日期
                            digitCount = 8;
                            generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量年月日';
                            break;
                        default:
                    }
                    generalWidget.otherAttrs[1] = 0;//此位置代表了是否按下ok键，按下为1，否则为0
                    generalWidget.otherAttrs[2] = digitCount;//数字个数
                    generalWidget.otherAttrs[3] = Number(info['dateTimeModeId']);//模式
                    generalWidget.otherAttrs[4] = Number(info['characterW']);//单个字符宽度

                    generalWidget.generalType = 'TexTime';
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;

                case 'MyDateTime':
                    var fontStyle = {},
                        baseLayerNum = 0;
                    for (var key in info) {
                        switch (key) {
                            case "fontItalic":
                                fontStyle['font-style'] = info[key];
                                break;
                            case "fontBold":
                                fontStyle['font-weight'] = info[key];
                                break;
                            case "fontSize":
                                fontStyle['font-size'] = info[key];
                                break;
                            case "fontFamily":
                                fontStyle['font-family'] = info[key];
                                break;
                            case "fontColor":
                                fontStyle['font-color'] = info[key];
                                break;
                        }
                    }
                    generalWidget = new WidgetModel.models['DateTime'](x, y, w, h, targetWidget.info, fontStyle, targetWidget.texList[0].slices[0]);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'DateTime';
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    generalWidget.mode = targetWidget.info.dateTimeModeId;
                    if (generalWidget.mode == '0' || generalWidget.mode == '1') {
                        generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量时分秒';
                    } else {
                        generalWidget.tag = _.cloneDeep(rawWidget.tag) || '时钟变量年月日';
                    }
                    switch (Number(targetWidget.info.dateTimeModeId)) {
                        case 0:
                            baseLayerNum = 8;
                            break;
                        case 1:
                            baseLayerNum = 5;
                            break;
                        case 2:
                        case 3:
                            baseLayerNum = 10;
                            break;
                        default:
                            baseLayerNum = 8;
                            break;
                    }
                    generalWidget.otherAttrs[0] = baseLayerNum;//除去高亮，font layer的数量
                    generalWidget.otherAttrs[1] = 0;//此位置代表了是否按下ok键，按下为1，否则为0
                    break;

                case 'MyAnimation':
                    generalWidget = new WidgetModel.models['Animation'](x, y, w, h, targetWidget.info, _.cloneDeep(targetWidget.texList[0].slices));
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Slide';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;

                default:
                    targetWidget.subType = rawWidget.type;
                    generalWidget = targetWidget
            }
            generalWidget.id = subLayerIdx + '.' + widgetIdx;
            generalWidget.type = 'widget';
        } else {
            //default Button
            var info = targetWidget.info;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            generalWidget = new WidgetModel.models['Button'](x, y, w, h, 'button', null, targetWidget.texList[0].slices)
            generalWidget = generalWidget.toObject();

            generalWidget.generalType = 'Button'
            generalWidget.id = subLayerIdx + '.' + widgetIdx;
            generalWidget.type = 'widget';
            generalWidget.tag = rawWidget.tag;
            generalWidget.subType = 'general';
        }
        return generalWidget;
    }

    /**
     * 转换actions
     */
    function transActions(object,changelt) {
        changelt = changelt||true;
        if (object&&object.actions&&object.actions.length){
            for (var i=0;i<object.actions.length;i++){
                var curAction = object.actions[i];
                curAction.commands = transCmds(curAction.commands,changelt);
            }
        }
    }

    /**
     * 转化actions中的指令（commands）
     */
    function transCmds(cmds,changelt){
        // actionCompiler
        return actionCompiler.transformer.trans(actionCompiler.parser.parse(cmds),changelt);
    }

    /**
     * 转换系统控件
     */
    function transSysWidgets(targetProject){
        var colorPicker = GenColorPicker(targetProject.size.width,targetProject.size.height);
        var texDatePicker = GenTexDatePicker();

        targetProject.systemWidgets = [];
        //push system widgets
        targetProject.systemWidgets.push(colorPicker);
        targetProject.systemWidgets.push(texDatePicker);
    }

    /**
     * 生成颜色选择器
     */
    function GenColorPicker(width,height){
        var colorPickerData = TemplateProvider.getSysColorPicker()
        var info = colorPickerData.info
        var slices = [];
        colorPickerData.texList.map(function (curTex) {
            curTex.slices.map(function(slice){
                slices.push(slice)
            })
        });
        var colorPicker = new WidgetModel.models.ColorPicker(info.left,info.top,info.width,info.height,slices)
        colorPicker = colorPicker.toObject()
        colorPicker.generalType = colorPickerData.generalType
        colorPicker.type = 'widget'
        colorPicker.subType = 'general'
        return colorPicker;
    }

    /**
     * 生成日期选择器
     */
    function GenDatePicker(){
        var datePickerDate = TemplateProvider.getSystemDatePicker();
        var info = datePickerDate.info;
        var texList = datePickerDate.texList||[];

        var slices = [];
        texList.map(function (curTex) {
            curTex.slices.map(function(slice){
                slices.push(slice)
            })
        });

        var datePicker = new WidgetModel.models.DatePicker(info.left,info.top,info.width,info.height,info,slices);

        datePicker = datePicker.toObject();
        datePicker.generalType = Type.SysDatePicker;
        datePicker.type = 'widget';
        datePicker.subType = 'general';

        //other attrs
        datePicker.otherAttrs[0] = 2018;  //year
        datePicker.otherAttrs[1] = 1;     //month
        datePicker.otherAttrs[2] = 3 ;     //日图层在所有图层中的起始坐标
        datePicker.otherAttrs[3] = 35;    //所有的日图层个数。
        datePicker.otherAttrs[4] = info.buttonSize;  //按钮大小
        datePicker.otherAttrs[5] = info.paddingX;             //日图层区域的起始x坐标,用于计算日图层区域范围
        datePicker.otherAttrs[6] = info.paddingX+info.dayW*7; //日图层区域的终止x坐标
        datePicker.otherAttrs[7] = info.paddingY;             //日图层区域的起始y坐标
        datePicker.otherAttrs[8] = info.paddingY+info.dayH*5; //日图层区域的终止y坐标
        datePicker.otherAttrs[9] = info.dayW;
        datePicker.otherAttrs[10] = info.dayH;
        datePicker.otherAttrs[11] = 31;                       //此月日数，默认一月31
        datePicker.otherAttrs[12] = 1;                        //此月一号是星期几，默认2018一月一号星期一

        return datePicker;
    }

    /**
     * 生成图层日期选择器
     */
    function GenTexDatePicker(){
        var texDatePickerDate = TemplateProvider.getSystemTexDatePicker();
        var info = texDatePickerDate.info;
        var texList = texDatePickerDate.texList||[];

        var texDatePicker = new WidgetModel.models.TexDatePicker(info.left,info.top,info.width,info.height,info,texList);
        texDatePicker = texDatePicker.toObject();
        texDatePicker.generalType = Type.SysTexDatePicker;
        texDatePicker.type = 'widget';
        texDatePicker.subType = 'general';

        //other attrs
        texDatePicker.otherAttrs[0] = 2018;  //year
        texDatePicker.otherAttrs[1] = 1;     //month
        texDatePicker.otherAttrs[2] = 7 ;     //日图层在所有图层中的起始坐标
        texDatePicker.otherAttrs[3] = 31;    //所有的日图层个数。
        texDatePicker.otherAttrs[4] = info.buttonSize;  //按钮大小
        texDatePicker.otherAttrs[5] = info.paddingX;             //日图层区域的起始x坐标,用于计算日图层区域范围
        texDatePicker.otherAttrs[6] = info.paddingX+info.dayW*7; //日图层区域的终止x坐标
        texDatePicker.otherAttrs[7] = info.paddingY;             //日图层区域的起始y坐标
        texDatePicker.otherAttrs[8] = info.paddingY+info.dayH*6; //日图层区域的终止y坐标
        texDatePicker.otherAttrs[9] = info.dayW;
        texDatePicker.otherAttrs[10] = info.dayH;
        texDatePicker.otherAttrs[11] = 31;                       //此月日数，默认一月31
        texDatePicker.otherAttrs[12] = 1;                        //此月一号是星期几，默认2018一月一号星期一

        return texDatePicker;
    }

    /**
     * 工具函数，深拷贝属性
     */
    function deepCopyAttributes(srcObj,dstObj,attrList){
        for (var i=0;i<attrList.length;i++){
            var curAttr = attrList[i];
            if ((typeof srcObj[curAttr])=='object'){
                dstObj[curAttr] = _.cloneDeep(srcObj[curAttr]);
            }else{
                dstObj[curAttr] = srcObj[curAttr];
            }
        }
    }

    /**
     * 工具函数，把color字符串解析成对象
     * @param color
     * @returns {{r: number, g: number, b: number, a: number}}
     */
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


    /**
     * edit in 2017/09/15
     * use for save simple project date
     */
    this.transDateFileBase = transDataFileBase;

    function transDataFileBase(rawProject){
        var targetProject = {};
        targetProject.DSFlag = 'base';
        targetProject.projectId = rawProject.projectId;
        targetProject.version = rawProject.version;
        targetProject.name = rawProject.name || 'default project';
        targetProject.author = rawProject.author || 'author';

        targetProject.CANId = rawProject.CANId;
        targetProject.lastSaveTimeStamp = rawProject.lastSaveTimeStamp;
        targetProject.lastSaveUUID = rawProject.lastSaveUUID;

        targetProject.size = rawProject.currentSize;
        var pages = rawProject.pages;
        targetProject.pages = [];
        for (var i=0;i<pages.length;i++){
            targetProject.pages.push(transPageBase(pages[i]));
        }
        return targetProject;
    }

    function transPageBase(rawPage){
        // console.log(rawPage);
        var targetPage = {};
        deepCopyAttributes(rawPage,targetPage,['id','name','url','type','mode','selected','expand','current','currentFablayer','backgroundImage','backgroundColor','triggers','actions','tag','transition']);
        transActions(targetPage);
        //CanvasList
        var layers = rawPage.layers;
        targetPage.layers = [];
        for (var i=0;i<layers.length;i++){
            targetPage.layers.push(transLayerBase(layers[i]));
        }
        return targetPage;
    }

    function transLayerBase(rawLayer){
        var targetLayer = {};
        deepCopyAttributes(rawLayer,targetLayer,['id','name','url','type','zIndex','info','selected','current','expand','actions','animations','transition']);
        targetLayer.w = rawLayer.info.width;
        targetLayer.h = rawLayer.info.height;
        targetLayer.x = rawLayer.info.left;
        targetLayer.y = rawLayer.info.top;

        var subLayers = rawLayer.subLayers
        targetLayer.subLayers = [];
        //curSubCanvasIdx
        for (var i=0;i<subLayers.length;i++){
            var curSubLayer = subLayers[i];
            if (rawLayer.showSubLayer.id == curSubLayer){
                targetLayer.curSubCanvasIdx = i;
            }
            targetLayer.subLayers.push(transSubLayerBase(curSubLayer));
        }
        return targetLayer;
    }

    function transSubLayerBase(rawSubLayer){
        var targetSubLayer = {};
        console.log(rawSubLayer)
        deepCopyAttributes(rawSubLayer,targetSubLayer,['id','name','info','url','type','selected','expand','current','tag','actions','zIndex','backgroundImage','backgroundColor']);
        var widgets = rawSubLayer.widgets;
        targetSubLayer.widgets = [];
        for (var i=0;i<widgets.length;i++){
            var curWidget = widgets[i];
            targetSubLayer.widgets.push(transWidgetBase(curWidget));
        }

        return targetSubLayer;
    }

    function transWidgetBase(rawWidget){
        var targetWidget = {};
        targetWidget = _.cloneDeep(rawWidget);
        return targetWidget;
    }

    /**
     * joint image&Text by canvas; returns new image
     * @param  {[type]} w             [生成图片的宽]
     * @param  {[type]} h             [生成图片的高]
     * @param  {[type]} imgH          [输入图片的高]
     * @param  {[type]} slices        [纹理列表]
     * @param  {[type]} fontString    [字体格式]
     * @param  {[type]} fontColor     [文字颜色]
     * @return {[type]}               [description]
     * @author LH 2018/01/03
     */
    function jointImageText(w,h,imgH,slices,fontString,fontColor) {
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx=canvas.getContext("2d");

        for(var i=0;i<slices.length;i++){
            if(slices[i].color){
                ctx.fillStyle=slices[i].color;
                ctx.fillRect( 0,imgH*i,w,imgH);
            }
            if(slices[i].img){
                ctx.drawImage(slices[i].img, 0,imgH*i,w,imgH);
            }
            if(slices[i].text){
                ctx.font=fontString;
                ctx.fillStyle=fontColor;
                ctx.textAlign='center';
                ctx.textBaseline='middle';
                ctx.fillText(slices[i].text,w/2,imgH*i+imgH/2);
            }
        }

        var image = new Image();
        image.src = canvas.toDataURL("image/png");

        return image;
    }

    function isFileInGlobalResources(id){
        try{
            for(var i=0;i<globalResources.length;i++){
                if(id===globalResources[i].id){
                    return true;
                }
            }
            return false;
        }catch(e){
            return false;
        }

    }

    function changeSrcInResourcesArray(globalResources,id, newSrc){
        for(var i=0;i<globalResources.length;i++){
            if(id===globalResources[i].id){
                globalResources[i].src=newSrc;
                return true;
            }
        }
        return false;
    }

}]);