ideServices.service('ProjectTransformService',['Type','ResourceService',function(Type,ResourceService){

    this.transDataFile = transDataFile;

    var idStart=0;


    function transCmds(cmds,changelt){
        // actionCompiler
        return actionCompiler.transformer.trans(actionCompiler.parser.parse(cmds),changelt);
    }
    
    function transActions(object,changelt) {
        changelt = changelt||true;
        if (object&&object.actions&&object.actions.length){
            for (var i=0;i<object.actions.length;i++){
                var curAction = object.actions[i];
                curAction.commands = transCmds(curAction.commands,changelt);
            }
        }
    }
    function registerGeneralCommands() {
        // mWDGOnInitializeFunc
        // mWDGOnDestroyFunc
        // mWDGOnTagChangeFunc
        // mWDGOnMouseUpFunc
        // mWDGOnMouseDownFunc
        // mWDGOnMouseMoveFunc
        // mWDGOnKeyBoardLeft
        // mWDGOnKeyBoardRight
        // mWDGOnKeyBoardOK
        // mWDGOnAnimationFrame
        var generalWidgetFunctions = ['onInitialize','onDestroy','onMouseUp','onMouseDown','onTagChange','onMouseMove','onKeyBoardLeft','onKeyBoardRight','onKeyBoardOK','onAnimationFrame']
        var commands = {}
        var models = WidgetModel.models;
        var testModels = _.cloneDeep(WidgetCommands);

        console.log('models',models);
        for (var model in models){
            if (models.hasOwnProperty(model)) {
                //Button

                var modelCommands = _.cloneDeep(models[model].prototype.commands);

                transGeneralWidgetMultiCommands(modelCommands,generalWidgetFunctions)
                commands[model] = modelCommands;
            }
        }
        console.log('registered commands',commands)
        // testModels['Button'].onInitialize = ASTTransformer.transAST(widgetCompiler.parse(testModels['Button'].onInitialize))
        // testModels.map(function (model) {
        //     //Button
        //     for(var i=0;i<generalWidgetFunctions.length;i++){
        //         var curF = generalWidgetFunctions[i]
        //         if (curF in model) {
        //             //button.onInitialize
        //             model[curF] = ASTTransformer.transAST(widgetCompiler.parse(model[curF]))
        //             //trans to jump end
        //             model[curF] = transGeneralWidgetCommands(model,curF)
        //         }
        //     }
        //     return model;
        // })
        var cppModels = {}
        for (var model in testModels){
            cppModels[model] = {}
            if (testModels.hasOwnProperty(model)) {
                modelObj = testModels[model]
                for(var i=0;i<generalWidgetFunctions.length;i++){
                    var curF = generalWidgetFunctions[i]
                    if (curF in modelObj) {
                        //button.onInitialize
                        var ast = widgetCompiler.parse(modelObj[curF])
                        console.log(ast)
                        modelObj[curF] = ASTTransformer.transAST(ast)
                        //trans to jump end
                        transGeneralWidgetCommands(modelObj,curF)

                        cppModels[model][curF] = cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[curF])

                    }
                }
            }
        }

        console.log('testModels',testModels)
        console.log('cppModels',cppModels)
        // return commands;
        return {
            commands:testModels,
            cppModels:cppModels
        }

        //new
        // return testModels
    }





    function transDataFile(rawProject){
        var targetProject = {};
        targetProject.version = rawProject.version;
        targetProject.name = rawProject.name || 'default project';
        targetProject.author = rawProject.author || 'author';
        targetProject.size = rawProject.currentSize;
        //register general commands
        var commandsObj = registerGeneralCommands()
        targetProject.generalWidgetCommands = commandsObj.commands
        targetProject.cppWidgetCommands = commandsObj.cppModels;
        //add last save info
        targetProject.lastSaveTimeStamp = rawProject.lastSaveTimeStamp;
        targetProject.lastSaveUUID = rawProject.lastSaveUUID;
        targetProject.pageList = [];
        for (var i=0;i<rawProject.pages.length;i++){
            targetProject.pageList.push(transPage(rawProject.pages[i],i));
        }

        var colorPicker = new WidgetModel.models.ColorPicker(0,0,200,200,[{color:'rgba(255,0,0,255)',imgSrc:'/public/images/colorPicker/slide.png'},{color:'rgba(255,0,0,255)',imgSrc:'/public/images/colorPicker/bg.png'}])
        colorPicker = colorPicker.toObject()
        colorPicker.generalType = 'ColorPicker'
        colorPicker.type = 'widget'
        colorPicker.subType = 'general'
        //
        // targetProject.pageList.push({
        //     type:Type.MyPage,
        //     canvasList:[
        //         {
        //             x:0,
        //             y:0,
        //             w:200,
        //             h:200,
        //             type:Type.MyLayer,
        //             subCanvasList:[{
        //                 type:Type.MySubLayer,
        //                 widgetList:[
        //                     colorPicker
        //                 ]
        //             }]
        //         }
        //     ]
        // })
        targetProject.systemWidgets = []

        //push system widgets
        targetProject.systemWidgets.push(colorPicker)

        return targetProject;
    }

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

    function transSubLayer(rawSubLayer,subLayerIdx,layerIdx){
        var targetSubLayer = {};
        targetSubLayer.id = layerIdx+'.'+subLayerIdx;
        targetSubLayer.type = Type.MySubLayer;
        deepCopyAttributes(rawSubLayer,targetSubLayer,['name','tag','actions','zIndex','backgroundImage','backgroundColor']);
        transActions(targetSubLayer);

        targetSubLayer.widgetList = [];
        for (var i=0;i<rawSubLayer.widgets.length;i++){
            var curWidget = rawSubLayer.widgets[i];
            targetSubLayer.widgetList.push(transWidget(curWidget,i,targetSubLayer.id));
        }

        return targetSubLayer;
    }

    function transWidget(rawWidget,widgetIdx,subLayerIdx){
        var targetWidget = {};
        var generalWidget = {};
        var fps = 30
        var defaultDuration = 1000;
        //targetWidget.id = subLayerIdx+'.'+widgetIdx;
        //targetWidget.type = 'widget';
        //targetWidget.subType = rawWidget.type;
        //deepCopyAttributes(rawWidget,targetWidget,['name','triggers','actions','tag','zIndex','texList']);
        //targetWidget.w = rawWidget.info.width;
        //targetWidget.h = rawWidget.info.height;
        //targetWidget.x = rawWidget.info.left;
        //targetWidget.y = rawWidget.info.top;
        //targetWidget.info = rawWidget.info;

        targetWidget = _.cloneDeep(rawWidget);
        transActions(targetWidget);
        // console.log(_.cloneDeep(targetWidget))
        if (targetWidget.type == 'general'){
            //default Button
            var info = targetWidget.info;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            generalWidget =  new WidgetModel.models['Button'](x,y,w,h,'button',null,targetWidget.texList[0].slices)
            generalWidget = generalWidget.toObject();

            generalWidget.generalType = 'Button'
            generalWidget.id = subLayerIdx+'.'+widgetIdx;
            generalWidget.type = 'widget';
            generalWidget.tag = rawWidget.tag;
            generalWidget.subType = 'general';
            // transGeneralWidgetCommands(targetWidget,'onInitialize')
            // console.log(targetWidget)

        }else{
            var info = targetWidget.info;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            var highLight = false;
            switch(targetWidget.type){
                case 'MyButton':
                    highLight = !targetWidget.info.disableHighlight;
                    var fontStyle = {};
                    for(var key in info){
                        switch (key){
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
                    generalWidget =  new WidgetModel.models['Button'](x,y,w,h,'button',fontStyle,targetWidget.texList[0].slices,highLight);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Button';
                    generalWidget.mode = Number(rawWidget.buttonModeId);
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);

                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions
                break;
                case 'MyButtonGroup':
                    //console.log(targetWidget)
                    highLight = !targetWidget.info.disableHighlight;
                    var slices = [];
                    var curTex;
                    if (highLight) {
                       var highLightTex = targetWidget.texList[targetWidget.texList.length-1].slices[0];
                       for(var i=0;i<targetWidget.info.count;i++){
                            curTex = targetWidget.texList[i]
                            slices.push(curTex.slices[0])
                            slices.push(curTex.slices[1])
                            slices.push(highLightTex)
                        }
                    }else{
                        for(var i=0;i<targetWidget.info.count;i++){
                            curTex = targetWidget.texList[i]
                            slices.push(curTex.slices[0])
                            slices.push(curTex.slices[1])
                        }
                    }

                    generalWidget =  new WidgetModel.models['ButtonGroup'](x,y,w,h,targetWidget.info.count||1,(targetWidget.info.arrange=="horizontal"?0:1),targetWidget.info.interval||0,slices,highLight)
                    generalWidget = generalWidget.toObject();
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);

                    generalWidget.generalType = 'ButtonGroup';
                    // targetWidget.mode = Number(rawWidget.buttonModeId);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions
                break;
                case 'MyDashboard':
                    generalWidget =  new WidgetModel.models['Dashboard'](x,y,w,h,targetWidget.dashboardModeId,targetWidget.texList,targetWidget.info)
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Dashboard';
                    generalWidget.mode = Number(rawWidget.dashboardModeId);
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'minValue,maxValue,minAngle,maxAngle,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    })
                    //animation
                    console.log('enableAnimation',info.enableAnimation)
                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration/1000 * fps;
                    }
                    //otherAttrs
                    generalWidget.otherAttrs[0] = info['offsetValue']||0
                    generalWidget.otherAttrs[1] = Number(info['clockwise'])
                    generalWidget.actions = targetWidget.actions
                break;
                case 'MyProgress':
                    var  slices = [];
                    targetWidget.texList.map(function(tex){
                        slices.push(tex.slices[0]);
                    });
                    generalWidget = new  WidgetModel.models['Progress'](x,y,w,h,targetWidget.info,slices);
                    generalWidget= generalWidget.toObject();
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.mode= Number(rawWidget.info.progressModeId);
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue';
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    });
                    //animation
                    console.log('progress',info.enableAnimation)
                    if (info.enableAnimation) {
                        generalWidget['totalFrame'] = defaultDuration/1000 * fps;
                    }
                    generalWidget.actions = targetWidget.actions;
                    generalWidget.generalType = 'Progress';
                    generalWidget.subType = 'general';
                    //otherAttrs
                    var colorElems
                    if(generalWidget.mode==1){
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
                    }else if(generalWidget.mode==3){
                        generalWidget.otherAttrs[0] = targetWidget.info.thresholdModeId;
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
                        if(targetWidget.info.thresholdModeId==2){
                            colorElems = parseColor(slices[3].color);
                            generalWidget.otherAttrs[11] = colorElems.a;
                            generalWidget.otherAttrs[12] = colorElems.g;
                            generalWidget.otherAttrs[13] = colorElems.b;
                            generalWidget.otherAttrs[14] = colorElems.a;
                        }
                    }
                    generalWidget.otherAttrs[19] = Number(rawWidget.info.cursor);
                    if(rawWidget.info.cursor=='1'){
                        var imgSrc = slices[slices.length-1].imgSrc;
                        if(imgSrc){
                            var cursorImg = ResourceService.getResourceFromCache(imgSrc);
                            generalWidget.layers[2].width = cursorImg.width;
                            generalWidget.layers[2].height = cursorImg.height;
                            rawH = generalWidget.layers[0].height;
                            yTemp = parseInt((rawH-cursorImg.height)/2);
                            generalWidget.layers[2].y = yTemp;
                        }
                    }


                    break;
                case 'MyRotateImg':
                    generalWidget =  new WidgetModel.models['RotateImg'](x,y,w,h,targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'RotateImg';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'minValue,maxValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
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
                    var fontStyle={}
                    styleElems.split(',').forEach(function (elem) {
                        fontStyle[elem] = info[elem]
                    });
                    generalWidget =  new WidgetModel.models['TextArea'](x,y,w,h,info.text,fontStyle,targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'TextArea';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                break;
                case 'MySwitch':
                    var  slices = [];
                    targetWidget.texList.map(function(tex){
                        slices.push(tex.slices[0]);
                    });
                    generalWidget = new  WidgetModel.models['Switch'](x,y,w,h,targetWidget.info,slices);
                    generalWidget= generalWidget.toObject();
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.generalType = 'Switch';
                    generalWidget.subType = 'general';
                    generalWidget.otherAttrs[0] = Number(targetWidget.info.bindBit);
                break;
                case 'MyScriptTrigger':
                    generalWidget =  new WidgetModel.models['ScriptTrigger'](x,y,w,h)
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'ScriptTrigger';

                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    //additional attrs
                    var attrs = 'lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    });
                    //add minValue, maxValue
                    generalWidget['minValue'] = generalWidget['lowAlarmValue']-1
                    generalWidget['maxValue'] = generalWidget['highAlarmValue']+1
                    generalWidget.actions = targetWidget.actions;

                break;
                case 'MyVideo':
                    generalWidget =  new WidgetModel.models['Video'](x,y,w,h,targetWidget.texList[0].slices[0])
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Video';
                    if (info.scource=='HDMI') {
                        generalWidget.mode = 0
                    }else{
                        generalWidget.mode = 1
                    }
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                break;
                case 'MySlide':
                    generalWidget = new WidgetModel.models['Slide'](x,y,w,h,targetWidget.info,_.cloneDeep(targetWidget.texList[0].slices));
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'Slide';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                break;
                case 'MySlideBlock':
                    var imgSrc = targetWidget.texList[1].slices[0].imgSrc;
                    var blockInfo = {w:0,h:0}
                    if(imgSrc){
                        var blockImg = ResourceService.getResourceFromCache(imgSrc);
                        if(blockImg){
                            blockInfo.w = blockImg.width;
                            blockInfo.h = blockImg.height;
                        }

                    }
                    generalWidget = new WidgetModel.models['SlideBlock'](x,y,w,h,info.arrange,blockInfo,[targetWidget.texList[0].slices[0],targetWidget.texList[1].slices[0]]);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'SlideBlock';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    })
                    generalWidget.arrange = (info.arrange=='horizontal')?0:1
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
                    var fontStyle={}
                    for(var key in info){
                        switch (key){
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
                    generalWidget = new WidgetModel.models['Num'](x,y,w,h,info,fontStyle);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    })
                    generalWidget.mode = Number(info.numModeId);
                    generalWidget.otherAttrs[0] = Number(info['noInit'] != 'NO');
                    generalWidget.otherAttrs[1] = Number(info['frontZeroMode']);
                    generalWidget.otherAttrs[2] = Number(info['symbolMode']);
                    generalWidget.otherAttrs[3] = info['decimalCount'];
                    generalWidget.otherAttrs[4] = info['numOfDigits'];
                    generalWidget.otherAttrs[5] = Number(info['overFlowStyle']);
                    generalWidget.otherAttrs[6] = Number(info['maxFontWidth']);
                    switch(info['align']){
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
                    generalWidget.otherAttrs[8] = Number(info['width']);

                    generalWidget.generalType = 'Num';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                break;
                case 'MyTexNum':
                    generalWidget = new WidgetModel.models['TexNum'](x,y,w,h,info,targetWidget.texList[0].slices);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue,lowAlarmValue,highAlarmValue'
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
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
                    switch(info['align']){
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

                    generalWidget.generalType = 'TexNum';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MyRotaryKnob':
                    generalWidget = new WidgetModel.models['RotaryKnob'](x,y,w,h,info,targetWidget.texList);
                    generalWidget = generalWidget.toObject();
                    var attrs = 'minValue,maxValue';
                    attrs.split(',').forEach(function (attr) {
                        generalWidget[attr] = info[attr]||0
                    });
                    generalWidget.otherAttrs[1] = 0;//此位置代表了是否按下ok键，按下为1，否则为0
                    generalWidget.otherAttrs[2] = w/2;//旋转中心x
                    generalWidget.otherAttrs[3] = h/2;//旋转中心y
                    generalWidget.otherAttrs[4] = 0;//isHited 此位置代表了是否在mouseDown状态
                    generalWidget.otherAttrs[5] = 0 //lastArea
                    generalWidget.otherAttrs[6] = 0 //over是否非法越过原点

                    generalWidget.generalType = 'RotaryKnob';
                    generalWidget.tag = _.cloneDeep(rawWidget.tag);
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    break;
                case 'MySelector':
                    //纹理
                    var tempSlices=targetWidget.texList[1].slices;
                    var slicesItem = [];
                    for(var i=0,il=tempSlices.length;i<il;i++){
                        slicesItem[i] = {};
                        slicesItem[i].color = tempSlices[i].color;
                        slicesItem[i].text = tempSlices[i].text;
                        slicesItem[i].img = ResourceService.getResourceFromCache(tempSlices[i].imgSrc);
                    }
                    tempSlices=targetWidget.texList[2].slices;
                    var slicesSelected = [];
                    for(var i=0,il=tempSlices.length;i<il;i++){
                        slicesSelected[i] = {};
                        slicesSelected[i].color = tempSlices[i].color;
                        slicesSelected[i].text = tempSlices[i].text;
                        slicesSelected[i].img = ResourceService.getResourceFromCache(tempSlices[i].imgSrc);
                    }
                    var itemFontString=info.itemFont.fontItalic+" "+info.itemFont.fontBold+" "+info.itemFont.fontSize+"px"+" "+'"'+info.itemFont.fontFamily+'"';
                    var selectorFontString=info.selectorFont.fontItalic+" "+info.selectorFont.fontBold+" "+info.selectorFont.fontSize+"px"+" "+'"'+info.selectorFont.fontFamily+'"';

                    //生成前景item大图
                    var selectedImg=jointImageText(info.selectorWidth,info.selectorHeight*info.itemCount,info.selectorHeight,slicesSelected,selectorFontString,info.selectorFont.fontColor);
                    //生成后景item大图
                    var unSelectedImg=jointImageText(info.itemWidth,info.itemHeight*info.itemCount,info.itemHeight,slicesItem,itemFontString,info.itemFont.fontColor);

                    var id1='selector'+(++idStart).toString()+'.png';
                    var id2='selector'+(++idStart).toString()+'.png';
                    var file1={
                        id:id1,
                        name:'selectedImg',
                        type:"image/png",
                        src:selectedImg.src
                    };
                    var file2={
                        id:id2,
                        name:'unSelectedImg',
                        type:"image/png",
                        src:unSelectedImg.src
                    };
                    var fcb=function (e, resourceObj) {
                        if (e.type === 'error'){
                            toastr.warning('资源加载失败: ' + resourceObj.name);
                            resourceObj.complete = false;
                        } else {
                            resourceObj.complete = true;
                        }

                    }.bind(this);
                    if(!isFileInGlobalResources('selector001')){
                        ResourceService.cacheFile(file1, globalResources, null, fcb);
                    }
                    if(!isFileInGlobalResources('selector002')){
                        ResourceService.cacheFile(file2, globalResources, null, fcb);
                    }
                    var newSelectedImgSrc='/'+id1;
                    changeSrcInGlobalResources(id1,newSelectedImgSrc);
                    var newUnSelectedImgSrc='/'+id2;
                    changeSrcInGlobalResources(id2,newUnSelectedImgSrc);
                    //实例化一个选择器控件
                    generalWidget = new WidgetModel.models['Selector'](x,y,w,h,info,targetWidget.texList[0].slices[0],newUnSelectedImgSrc,newSelectedImgSrc,targetWidget.texList[3].slices[0]);
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
                case 'MyDateTime':
                    var fontStyle = {},
                        baseLayerNum = 0;
                    for(var key in info){
                        switch (key){
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
                    generalWidget = new WidgetModel.models['DateTime'](x,y,w,h,targetWidget.info,fontStyle,targetWidget.texList[0].slices[0]);
                    generalWidget = generalWidget.toObject();
                    generalWidget.generalType = 'DateTime';
                    generalWidget.subType = 'general';
                    generalWidget.actions = targetWidget.actions;
                    generalWidget.mode = targetWidget.info.dateTimeModeId;
                    if(generalWidget.mode=='0'||generalWidget.mode=='1'){
                        generalWidget.tag = _.cloneDeep(rawWidget.tag)||'时钟变量时分秒';
                    }else{
                        generalWidget.tag = _.cloneDeep(rawWidget.tag)||'时钟变量年月日';
                    }
                    switch (Number(targetWidget.info.dateTimeModeId)){
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

                default:
                    targetWidget.subType = rawWidget.type;
                    generalWidget = targetWidget
            }





            generalWidget.id = subLayerIdx+'.'+widgetIdx;
            generalWidget.type = 'widget';



        }

        return generalWidget;
    }

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
        deepCopyAttributes(rawSubLayer,targetSubLayer,['id','name','url','type','selected','expand','current','tag','actions','zIndex','backgroundImage','backgroundColor']);
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
        for(var i=0;i<globalResources.length;i++){
            if(id===globalResources[i].id){
                return true;
            }
        }
        return false;
    }
    function changeSrcInGlobalResources(id,newSrc){
        for(var i=0;i<globalResources.length;i++){
            if(id===globalResources[i].id){
                globalResources[i].src=newSrc;
                return true;
            }
        }
        return false;
    }

}]);