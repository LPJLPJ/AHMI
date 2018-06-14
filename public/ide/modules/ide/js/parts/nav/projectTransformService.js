ideServices.service('ProjectTransformService',['Type',function(Type){

    this.transDataFile = transDataFile;

    var tagList;

    function transCmds(cmds,changelt){
        // actionCompiler
        var reg = new RegExp("^[0-9]*$");

        cmds.forEach(function(cmd){
            cmd.forEach(function(op){
                if(op.hasOwnProperty('value')){
                    if(!reg.test(op.value)&&!!op.value){
                        //值为字符串
                        op.value = convertStrToUint8Array(op.value,supportedEncodings.ascii)
                    }
                }
            })
        });

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
        targetProject.version = rawProject.version;
        targetProject.name = rawProject.name || 'default project';
        targetProject.author = rawProject.author || 'author';
        targetProject.size = rawProject.currentSize;
        //add last save info
        targetProject.lastSaveTimeStamp = rawProject.lastSaveTimeStamp;
        targetProject.lastSaveUUID = rawProject.lastSaveUUID;
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
     * edit in 2017/09/15
     * use for trans string type tag
     */

    var supportedEncodings = {
        ascii:'ascii',
        'utf-8':'utf-8'
    };

    var convertStrToUint8Array=function (str,encoding) {
        encoding = encoding || supportedEncodings.ascii;
        var uint8array;
        switch (encoding) {
            case supportedEncodings.ascii:
                uint8array = new TextEncoder(encoding, {NONSTANDARD_allowLegacyEncoding: true}).encode(str);
                break;
            case supportedEncodings['utf-8']:
                uint8array = new TextEncoder().encode(str);
                break;
            default:
                console.log('unsupported encoding');
        }
        return uint8array
    };

    var convertUint8ArrayToStr=function (buf,encoding) {
        encoding = encoding||supportedEncodings.ascii;
        var str = '';
        switch (encoding){
            case supportedEncodings.ascii:
            case supportedEncodings['utf-8']:
                str = new TextDecoder(encoding).decode(buf);
                break;

            default:
                console.log('unsupported encoding')
        }
        return str
    };

    this.supportedEncodings = supportedEncodings;
    this.convertStrToUint8Array = convertStrToUint8Array;
    this.convertUint8ArrayToStr = convertUint8ArrayToStr;
}]);