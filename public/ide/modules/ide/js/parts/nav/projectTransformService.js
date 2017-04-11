ideServices.service('ProjectTransformService',['Type',function(Type){

    this.transDataFile = transDataFile;


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
        var generalWidgetFunctions = ['onInitialize','onMouseUp','onMouseDown','onTagChange']
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
                        modelObj[curF] = ASTTransformer.transAST(widgetCompiler.parse(modelObj[curF]))
                        //trans to jump end
                        transGeneralWidgetCommands(modelObj,curF)

                        cppModels[model][curF] = cppWidgetCommandTranslator.transJSWidgetCommands(modelObj[curF])

                    }
                }
            }
        }
        
        
        console.log('cppModels',cppModels)
        // return commands;
        return {
            commands:commands,
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
        targetProject.pageList = [];
        for (var i=0;i<rawProject.pages.length;i++){
            targetProject.pageList.push(transPage(rawProject.pages[i],i));
        }
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
        if (targetWidget.type == 'general'){
            //default Button
            var info = targetWidget.info;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            targetWidget =  new WidgetModel.models['Button'](x,y,w,h,'button',null,targetWidget.texList[0].slices)
            targetWidget = targetWidget.toObject();
            
            targetWidget.generalType = 'Button'
            targetWidget.id = subLayerIdx+'.'+widgetIdx;
            targetWidget.type = 'widget';
            targetWidget.tag = rawWidget.tag;
            targetWidget.subType = 'general';
            // transGeneralWidgetCommands(targetWidget,'onInitialize')
            // console.log(targetWidget)

        }else{
            var info = targetWidget.info;
            var x = info.left;
            var y = info.top;
            var w = info.width;
            var h = info.height;
            switch(targetWidget.type){
                case 'MyButton':

                    targetWidget =  new WidgetModel.models['Button'](x,y,w,h,'button',null,targetWidget.texList[0].slices)
                    targetWidget = targetWidget.toObject();
                    targetWidget.generalType = 'Button';
                    targetWidget.mode = Number(rawWidget.buttonModeId);
                    targetWidget.tag = _.cloneDeep(rawWidget.tag);
                    targetWidget.subType = 'general';
                break;
                case 'MyButtonGroup':
                    //console.log(targetWidget)
                    var slices = [];
                   targetWidget.texList.map(function (tex) {
                        slices.push(tex.slices[0])
                        slices.push(tex.slices[1])
                    })
                    targetWidget =  new WidgetModel.models['ButtonGroup'](x,y,w,h,targetWidget.info.count||1,(targetWidget.info.arrange=="horizontal"?0:1),targetWidget.info.interval||0,slices)
                    targetWidget = targetWidget.toObject();
                    targetWidget.tag = _.cloneDeep(rawWidget.tag);

                    targetWidget.generalType = 'ButtonGroup';
                    // targetWidget.mode = Number(rawWidget.buttonModeId);
                    targetWidget.subType = 'general';
                break;
                default:
                    transActions(targetWidget);
                    targetWidget.subType = rawWidget.type;
                    

            }
            //console.log(_.cloneDeep(targetWidget))
            
            
            
            targetWidget.id = subLayerIdx+'.'+widgetIdx;
            targetWidget.type = 'widget'; 
            

            
        }



        return targetWidget;
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
}]);