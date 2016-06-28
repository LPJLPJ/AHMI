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

    function transDataFile(rawProject){
        var targetProject = {};
        targetProject.name = rawProject.name || 'default project';
        targetProject.author = rawProject.author || 'author';
        targetProject.size = rawProject.currentSize;
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
        
        deepCopyAttributes(rawPage,targetPage,['name','backgroundImage','backgroundColor','triggers','actions','tag']);
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
        deepCopyAttributes(rawLayer,targetLayer,['name','triggers','actions','tag','zIndex']);
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
        deepCopyAttributes(rawSubLayer,targetSubLayer,['name','tag','zIndex','backgroundImage','backgroundColor']);


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
        transActions(targetWidget);
        targetWidget.type = 'widget';
        targetWidget.subType = rawWidget.type;
        targetWidget.id = subLayerIdx+'.'+widgetIdx;

        return targetWidget;
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