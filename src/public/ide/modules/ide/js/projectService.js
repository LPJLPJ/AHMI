/**
 * Created by shenaolin on 16/2/26.
 */

var projectRecord=[];
ideServices
//IDE界面共享整个项目资源
    .service('ProjectService',['$rootScope','$timeout',
        'CanvasService',
        'GlobalService',
        'Preference',
        'TemplateProvider',
        'ViewService',
        'Type',
        'ResourceService',
        'TrackService',
        'TagService',
        'NameIncrementer',function ($rootScope,$timeout,
                                    CanvasService,
                                    GlobalService,
                                    Preference,
                                    TemplateProvider,
                                    ViewService,
                                    Type,
                                    ResourceService,
                                    TrackService,
                                    TagService,
                                    NameIncrementer) {


            var _self=this;
            // var fabric = WidgetService.fabric

            /**
             * IDE当前项目
             * @type {{}}
             */
            var project = {};

            /**
             * IDEPage剪切板
             */
            var shearPagePlate = {
                type: '',
                objects: []
            };

            this.shearPlate={
                type: '',
                objects: [],
                mode:0,
                target:null
            };

            var shearPlate=this.shearPlate;

            var pageRendering = false;

            var timeStamp='';

            /**
             * 设置渲染状态
             * @param _rendering
             */
            this.setRendering = function (_rendering) {
                pageRendering = _rendering;
            };

            /**
             * 返回当前是否在渲染
             * @returns {boolean}
             */
            this.isRendering = function () {
                return pageRendering;
            };

            /**
             * 判断是否处于编辑Page的模式
             */
            this.isEditingPage = function () {
                var currentPage=_self.getCurrentPage();
                return currentPage.mode==0
            };

            /**
             * 获得当前选中的对象
             * @returns {{type: string, target: *, level: *}}  类型/fabric对象/图层对象
             */
            var getCurrentSelectObject=this.getCurrentSelectObject= function () {
                var type='none';
                var target=null;
                var level=null;
                var mode=0;
                var pageNode=CanvasService.getPageNode();
                var subLayerNode=CanvasService.getSubLayerNode();
                _.forEach(project.pages, function (_page) {
                    if (_page.current){
                        if (_page.selected){
                            type= Type.MyPage;
                            target=pageNode;
                            level=_page;
                            mode=0;
                        }
                        if (_page.currentFabLayer&&_page.currentFabLayer.type==Type.MyLayerGroup){

                            type=Type.MyLayerGroup;
                            target=pageNode.getActiveGroup();

                            level={
                                info:{

                                    left:target?Math.round(target.getLeft()):null,
                                    top:target?Math.round(target.getTop()):null,
                                }
                            };
                            mode=0;

                        }
                        _.forEach(_page.layers, function (_layer) {

                            if (_layer.current){
                                if (_layer.selected){
                                    type= Type.MyLayer;
                                    target=_page.currentFabLayer;
                                    level=_layer;
                                    mode=0;

                                }
                                _.forEach(_layer.subLayers, function (_subLayer) {
                                    if (_subLayer.current){
                                        if (_subLayer.selected){

                                            type= Type.MySubLayer;
                                            target=CanvasService.getSubLayerNode();
                                            level=_subLayer;
                                            mode=1;

                                        }
                                        if (_subLayer.currentFabWidget&&_subLayer.currentFabWidget.type==Type.MyWidgetGroup){



                                            type=Type.MyWidgetGroup;
                                            target=subLayerNode.getActiveGroup();
                                            level={
                                                info:{
                                                    left:target?Math.round(target.getLeft()):null,
                                                    top:target?Math.round(target.getTop()):null,
                                                }
                                            };
                                            mode=1;

                                        }
                                        _.forEach(_subLayer.widgets, function (_widget) {


                                            if ((_widget.current)&&(_widget.selected)){


                                                type=getFabricObject(_widget.id,true).type;
                                                target=_subLayer.currentFabWidget;
                                                level=_widget;
                                                mode=1;

                                            }
                                        })
                                    }
                                })
                            }

                        })
                    }

                });

                // console.log(type,target,level,mode);

                return {
                    type: type,
                    target: target,
                    level: level,
                    mode:mode
                };
            };

            /**
             * 存储全局的项目
             * @param _globalProject
             * @param _successCallback
             */
            this.saveProjectFromGlobal = function (_globalProject,_successCallback) {
                project = _globalProject;

                _.forEach(project.pages,function (_page) {
                    _.forEach(_page.layers,function (_layer) {
                        _.forEach(_layer.subLayers,function (_subLayer) {
                            if (_subLayer.id==_layer.showSubLayer.id){
                                _layer.showSubLayer=_subLayer;
                            }
                        })
                    })
                });
                var pageCount=project.pages.length;
                openAllPage(0,_successCallback);

                function openAllPage(_index, _successCallback) {
                    if (_index==pageCount){
                        _self.changeCurrentPageIndex(0,_successCallback,true);
                    }else{
                        _self.changeCurrentPageIndex(_index,function () {
                            openAllPage(_index+1,_successCallback);

                        },true);
                    }
                }
            };

            //add by tang    save mask info
            this.saveMaskInfo=function(data){
                if(data){
                    project.mask=_.cloneDeep(data);
                }
            };

            //add save timestamp and uuid
            this.addSaveInfo = function () {
                project.lastSaveTimeStamp = Date.now();
                project.lastSaveUUID = window.uuidv1();
            };



            /**
             * 将当前项目赋值到scope.project
             * 不可在其他controller中直接改动scope.project
             * @param scope
             * @param _successCallback
             */
            this.getProjectTo = function (scope, _successCallback) {
                scope.project = project;
                _successCallback && _successCallback();
            };

            //get project copy to

            this.getProjectCopyTo = function (scope, scb) {
                scope.project = _.cloneDeep(project);
                scb && scb();
            };

            //get project id
            this.getProjectId = function(){
                return project.projectId;
            };

            this.getProjectName = function(){
                if(project.name){
                    return project.name;
                }
            }

            this.getProjectInitSize = function(){
                if(project.initSize){
                    return project.initSize
                }else{
                    return {
                        width:0,
                        height:0
                    }
                }
            }

            /**
             * 获得当前Page
             * @returns {*}
             */
            this.getCurrentPage= function () {
                var currentPage=null;
                _.forEach(project.pages, function (_page) {
                    if (_page.current){
                        currentPage=_page;
                    }
                });
                return currentPage;
            };

            /**
             * 获得当前SubLayer
             * @returns {*}
             */
            this.getCurrentSubLayer= function () {
                var currentPage=_self.getCurrentPage();
                var currentSubLayer=null;
                _.forEach(currentPage.layers, function (_layer) {
                    if (_layer.current){
                        _.forEach(_layer.subLayers, function (_subLayer) {
                            if (_subLayer.current){
                                currentSubLayer=_subLayer
                            }
                        })
                    }
                });
                return currentSubLayer;
            }

            /**
             * 根据当前的Page找到当前的Layer
             * @returns {*}
             */
            var getCurrentLayer=this.getCurrentLayer = function (_currentPage) {
                var currentPage=_currentPage;
                if (!currentPage){
                    currentPage = _self.getCurrentPage();
                }
                var currentLayer=null;
                if(currentPage){
                    _.forEach(currentPage.layers, function (_layer) {
                        if (_layer.current){
                            currentLayer=_layer;
                        }
                    });
                }
                return currentLayer;
            };

            /**
             * 按照id获得项目中的level
             * 效率很低,不建议在循环中使用
             * @type {getLevelById}
             */
            this.getLevelById = function (_id) {
                var level=null;
                _.forEach(project.pages, function (_page) {
                    if (_page.id==_id){
                        level= _page;
                    }
                    _.forEach(_page.layers, function (_layer) {
                        if (_layer.id==_id){
                            level= _layer;
                        }
                        _.forEach(_layer.subLayers, function (_subLayer) {
                            if (_subLayer.id==_id){
                                level= _subLayer;
                            }
                            _.forEach(_subLayer.widgets, function (_widget) {
                                if (_widget.id==_id){
                                    level= _widget;
                                }
                            })
                        })
                    })

                });
                return level;
            };

            var getResourceList=this.getResourceList=function () {

                return project.resourceList;
            }

            var getCurrentWidget=this.getCurrentWidget= function (_currentSubLayer) {
                var currentSubLayer=getCurrentSubLayer();
                if (!currentSubLayer){
                    currentSubLayer=_currentSubLayer;
                }

                if (!currentSubLayer){
                    console.warn('找不到SubLayer');
                    alertErr()
                    return;

                }
                var currentWidget=null;
                _.forEach(currentSubLayer.widgets, function (_widget) {
                    if (_widget.current){
                        currentWidget=_widget;
                    }
                });
                return currentWidget;

            }

            //add by tang  设置widget相对于page的绝对坐标
            this.getLayerInfo=true;//当执行attr服务里的调用时就不使用stage服务的调用
            this.setAbsolutePosition=function (widgetInfo,layerInfo) {
                var currentLayer=this.getCurrentLayer(),
                    absoluteX=null,absoluteY=null,
                    currentLayerInfo=null;
                //如果传入layerInfo就不使用getCurrentLayer()获取的参数；
                if(widgetInfo&&layerInfo){
                    absoluteX=widgetInfo.left+layerInfo.left;
                    absoluteY=widgetInfo.top+layerInfo.top;
                    currentLayerInfo=layerInfo;
                }else{
                    if(widgetInfo&&currentLayer){
                        absoluteX=widgetInfo.left+currentLayer.info.left;
                        absoluteY=widgetInfo.top+currentLayer.info.top;
                        currentLayerInfo=currentLayer.info;
                    }
                }
                $rootScope.position={
                    absoluteX:Math.round(absoluteX),
                    absoluteY:Math.round(absoluteY),
                    currentLayerInfo:currentLayerInfo,
                    initAbsoluteX:Math.round(absoluteX),
                    initAbsoluteY:Math.round(absoluteY)
                };
            };

            //输入相对坐标，预先计算绝对坐标
            this.getFutureAbsolutePosition = function (widgetInfo,layerInfo) {
                var currentLayer=this.getCurrentLayer(),
                    absoluteX=null,absoluteY=null
                    
                //如果传入layerInfo就不使用getCurrentLayer()获取的参数；
                if(widgetInfo&&layerInfo){
                    absoluteX=widgetInfo.left+layerInfo.left;
                    absoluteY=widgetInfo.top+layerInfo.top;
                    
                }else{
                    if(widgetInfo&&currentLayer){
                        absoluteX=widgetInfo.left+currentLayer.info.left;
                        absoluteY=widgetInfo.top+currentLayer.info.top;
                        
                    }
                }
                return {
                    absoluteX:Math.round(absoluteX),
                    absoluteY:Math.round(absoluteY)
                    
                };
            };

            /**
             * 找到画布对应的Fabric对象
             * @returns {null}
             * @param _id
             * @param _isSubLayer
             */
            var getFabricObject=this.getFabricObject = function (_id, _isSubLayer) {
                var canvasNode;
                if (!_isSubLayer){
                    canvasNode=CanvasService.getPageNode();
                }else {
                    canvasNode=CanvasService.getSubLayerNode();

                }
                var fobj = null;

                _.forEach(canvasNode.getObjects(), function (_fobj) {

                    if (_fobj.id == _id) {
                        fobj =_fobj;
                    }
                });

                return fobj;
            };

            /**
             * 搜寻所有被项目引用过的图片资源名
             * 用于删除资源时判断  该资源是否可以被删除
             * @type {getRequiredResourceNames}
             */
            var getRequiredResourceNames=this.getRequiredResourceNames=function () {
                var names=[];
                _.forEach(project.pages,function (page) {
                    if (page.backgroundImage){
                        names.push(page.backgroundImage);
                    }
                    if (page.matte&&page.matte.info.backgroundImg){
                        names.push(page.matte.info.backgroundImg);
                    }
                    _.forEach(page.layers,function (layer) {
                        _.forEach(layer.subLayers,function (subLayer) {
                            if (subLayer.backgroundImage){
                                names.push(subLayer.backgroundImage);
                            }
                            _.forEach(subLayer.widgets,function (widget) {
                                _.forEach(widget.texList,function (tex) {
                                    _.forEach(tex.slices,function (slice) {
                                        if (slice.imgSrc){
                                            names.push(slice.imgSrc);
                                        }
                                    })
                                })
                            })
                        })
                    })
                });
                return names;
            };
            /**
             * 搜寻所有被项目引用过的tag名
             * 用于删除资源时判断  该资源是否可以被删除
             * @type {getRequiredResourceNames}
             */
            var getRequiredTagNames=this.getRequiredTagNames=function(){
                var names=[];
                _.forEach(project.pages,function(page){
                    //page tag
                    if(page.tag){
                        names.push(page.tag);
                    }
                    //page actions
                    if (page.actions) {
                        var pageActions = page.actions;
                        _.forEach(pageActions,function (pageAction) {
                            _.forEach(pageAction.commands,function(action){
                                names.push(action[1].tag)
                            });
                        });
                    }

                    _.forEach(page.layers,function(layer){
                        //layer tag
                        if(layer.tag){
                            names.push(layer.tag);
                        }
                        _.forEach(layer.subLayers,function(subLayer){
                            _.forEach(subLayer.widgets,function(widget){
                                //widget tag
                                if(widget.tag){
                                    names.push(widget.tag);
                                }
                                //widget actions
                                if (widget.actions) {
                                    var widgetActions = widget.actions;
                                    _.forEach(widgetActions,function (widgetAction) {
                                        _.forEach(widgetAction.commands,function(action){
                                            names.push(action[1].tag)
                                        });
                                    });
                                }

                            })
                        })
                    })
                });
                return names
            };

            /**
             * 搜寻所有被项目引用过的字体
             * 用于删除资源时判断  该资源是否可以被删除
             */
            this.getRequiredTextNames=function(){
                var names=[];
                _.forEach(project.pages,function(page){
                    _.forEach(page.layers,function(layer){
                        _.forEach(layer.subLayers,function(subLayer){
                            _.forEach(subLayer.widgets,function(widget){
                                if(widget.info.fontFamily){
                                    names.push(widget.info.fontFamily);
                                }
                            })
                        })
                    })
                });
                return names
            };

            function replaceActions(target,oldTagName,newTagName) {
                if (target&&target.actions){
                    target.actions.forEach(function (action) {

                        replaceActionTag(action,oldTagName,newTagName)
                    })
                }
            }

            function replaceActionTag(action,oldTagName,newTagName) {
                if (action&&action.commands&&action.commands.length){
                    action.commands.forEach(function (cmd) {
                        replaceCommandTag(cmd,oldTagName,newTagName)
                    })
                }
            }

            function replaceCommandTag(cmd,oldTagName,newTagName) {
                for(var i=1;i<3;i++){
                    if (cmd[i]){
                        if (cmd[i].tag === oldTagName){
                            cmd[i].tag = newTagName
                        }
                    }
                }
            }

            /**
             * 替换所有oldTag
             * @param oldTag
             * @param newTag
             */
            this.replaceAllRelatedTag = function (oldTag,newTag) {
                var oldTagName,newTagName
                if (typeof oldTag === 'object'){
                    oldTagName = oldTag.name
                    newTagName = newTag.name
                }else{
                    oldTagName = oldTag
                    newTagName = newTag
                }
                console.log(oldTagName,newTagName)
                _.forEach(project.pages,function(page){
                    if(page.tag === oldTagName){
                        page.tag = newTagName
                    }
                    replaceActions(page,oldTagName,newTagName)
                    _.forEach(page.layers,function(layer){
                        if(layer.tag=== oldTagName){
                            layer.tag = newTagName
                        }
                        replaceActions(layer,oldTagName,newTagName)
                        _.forEach(layer.subLayers,function(subLayer){
                            replaceActions(subLayer,oldTagName,newTagName)
                            _.forEach(subLayer.widgets,function(widget){
                                if(widget.tag=== oldTagName){
                                    widget.tag = newTagName
                                }
                                replaceActions(widget,oldTagName,newTagName)
                            })
                        })
                    })
                });
                console.log(project.pages)
            }

            /**
             * Page之间的切换
             * @param _pageIndex
             * @param _successCallback
             */

            var inChangingPage = false;
            this.changeCurrentPageIndex = function (_pageIndex, successCallback,isInit) {
                // timeStamp = Date.now();

                var _successCallback = function () {
                    inChangingPage = false;
                    successCallback && successCallback()
                };
                var oldPage=_self.getCurrentPage();
                var oldPageIndex=-1;

                if (inChangingPage) {
                    console.log('inChangingPage');
                    return;
                }
                inChangingPage = true;
                if (isInit){
                    // 初始化
                    // console.log('初始化页面');
                    if(oldPage){
                        if(oldPage.mode==1){
                            //oldstate is editing sublayer
                            _.forEach(project.pages, function (__page,__pageIndex) {

                                if (__page.id==oldPage.id){
                                    oldPageIndex=__pageIndex;
                                }
                            });
                            if (oldPageIndex!=_pageIndex){
                                _self.OnPageSelected(oldPageIndex,intoNewPage,true);
                            }
                        }else{
                            intoNewPage();
                        }
                    }else{
                        intoNewPage();
                    }
                }else if (_pageIndex>=0){
                    //切换page
                    if (oldPage){
                        _.forEach(project.pages, function (__page,__pageIndex) {
                            if (__page.id==oldPage.id){
                                oldPageIndex=__pageIndex;
                            }
                        });
                        if (oldPageIndex!=_pageIndex){
                            // 页面切换
                            if (oldPage.mode==1){
                                //从sublayer切换到page,进入不同的页面
                                _self.OnPageSelected(oldPageIndex,intoNewPage,true);
                            }else{
                                //从page a 进入 page b
                                _self.OnPageSelected(_pageIndex,intoNewPage,true);
                            }
                        }else{
                            if (oldPage.mode==1){
                                //进入同一个页面，从sublayer状态进入
                                _self.OnPageSelected(_pageIndex,function(){
                                    _successCallback&&_successCallback();
                                },isInit);
                            }else{
                                //same page
                                _successCallback&&_successCallback();
                            }
                            
                        }
                    }else {
                        console.log('异常情况');
                        intoNewPage();
                    }
                }

                /**
                 * 进入一个新page
                 * private function
                 */
                function intoNewPage(){
                    var pageNode=CanvasService.getPageNode();
                    var currentPage=project.pages[_pageIndex];
                    if (!currentPage){
                        console.warn('找不到Page');
                        inChangingPage = false;
                        return;
                    }

                    OnPageClicked(_pageIndex);

                    var pageCount=currentPage.layers.length;
                    var options = !!currentPage.backgroundImage?{
                        width:project.initSize.width,
                        height:project.initSize.height
                    }:null;
                    // if(!currentPage.initSize){
                    //     currentPage.initSize = project.initSize
                    // }
                    pageNode.setBackgroundColor(currentPage.backgroundColor,function(){
                        pageNode.setBackgroundImage(currentPage.backgroundImage||null,function(){
                            //-
                            // pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                            //     if (isInit){
                            //         // console.log('init layer');
                            //         updateLayerImage(0,function () {
                            //             _self.ScaleCanvas('page');
                            //             // console.log('currentPage',_.cloneDeep(currentPage))
                            //             pageNode.deactivateAll();
                            //             pageNode.renderAll();
                            //             currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                            //             _self.OnPageSelected(_pageIndex,_successCallback,true);
                            //         })
                            //     }else{
                            //         console.log('不更新layer');
                            //         _self.ScaleCanvas('page');
                            //         pageNode.renderAll();
                            //         currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                            //         _self.OnPageSelected(_pageIndex,_successCallback);
                            //     }
                            // })

                            //+
                            _drawCanvasNode(currentPage,pageNode,function(){
                                if (isInit){
                                    updateLayerImage(0,function () {
                                        _self.ScaleCanvas('page');
                                        pageNode.deactivateAll();
                                        pageNode.renderAll();
                                        currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                                        _self.OnPageSelected(_pageIndex,_successCallback,true);
                                    })
                                }else{
                                    console.log('不更新layer');
                                    console.log('cb in intoNewPage',currentPage.name);
                                    var layers = currentPage.layers||[];
                                    layers.forEach(function(layer,index){
                                        var layerFab = _self.getFabLayerByLayer(layer);
                                        if(layerFab){
                                            layerFab.fire('OnRefresh',function(){
                                                if(index===layers.length-1){
                                                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                                                }
                                            });
                                        }
                                    });
                                    _self.ScaleCanvas('page');
                                    pageNode.renderAll();
                                    _successCallback&&_successCallback();

                                    // console.log('cost time is:',Date.now()-timeStamp);
                                    // _self.OnPageSelected(_pageIndex,_successCallback);
                                }
                            })
                        },options);
                    });

                    /**
                     * private function
                     * @param _index
                     * @param _successCallback
                     */
                    function updateLayerImage(_index,_successCallback) {
                        // console.log('updating layer image')
                        if (_index==pageCount){
                            _successCallback&&_successCallback();
                        }else {
                            var layer=currentPage.layers[_index];
                            // console.log("layer: ",layer);
                            _self.SyncSubLayerImage(layer,layer.showSubLayer,function () {
                                updateLayerImage(_index+1,_successCallback);
                            })
                        }
                    }
                }
            };

            this.changeCurrentSubLayerIndex= function (_subLayerIndex,_successCallback) {
                if (_subLayerIndex<0){
                    console.warn('输入不合法');
                    return;
                }
                var subLayerNode=CanvasService.getSubLayerNode();
                var currentLayer=getCurrentLayer();
                var layerIndex= _indexById(_self.getCurrentPage().layers,currentLayer);
                var currentSubLayer=currentLayer.subLayers[_subLayerIndex];
                if (!currentSubLayer){
                    console.warn('找不到SubLayer');
                    alertErr()
                    return;
                }
                currentLayer.showSubLayer=currentSubLayer;

                _self.SyncSubLayerImage(currentLayer,currentSubLayer,function () {
                    var selectObj=_self.getCurrentSelectObject();
                    selectObj.target.fire('OnScaleRelease',selectObj.target.id);
                    selectObj.target.fire('OnRelease',selectObj.target.id);

                    _successCallback&&_successCallback();
                });

            }
            /**
             * 询问当前的复制粘贴状态
             * @returns {boolean}
             */
            this.shearPagePlateEnable = function () {
                return (shearPagePlate.objects.length != 0);
            };

            this.shearPlateEnable= function () {
                if (shearPlate.objects.length==0){
                    return false;
                }
                var selectObj=getCurrentSelectObject();
                var currentPage=_self.getCurrentPage();
                if (selectObj.type==Type.MyPage){
                    //Page下面只有Layer或者Layer组可以粘贴
                    if (shearPlate.type==Type.MyLayer){
                        return true;
                    }else if(shearPlate.type == Type.MyGroup && shearPlate.mode == 0){
                        return true;
                    }else{
                        return false;
                    }
                }else if (selectObj.type==Type.MyLayer||(selectObj.type==Type.MyGroup&&selectObj.mode==0)){
                    //Layer下面只有Layer或者Layer组可以粘贴

                    if (shearPlate.type==Type.MyLayer){
                        return true;
                    }else if(shearPlate.type==Type.MySubLayer){//add by tang
                        return true;
                    }else if(shearPlate.type == Type.MyGroup && shearPlate.mode == 0){
                        return true;
                    }else{
                        return false;
                    }
                }else if (selectObj.type==Type.MySubLayer){
                    //SubLayer下面只有Widget或者Widget组可以粘贴
                    if (Type.isWidget(shearPlate.type)){
                        return true;
                    }else if(shearPlate.type==Type.MySubLayer){//tang
                        return true;
                    }else return (shearPlate.type == Type.MyGroup && shearPlate.mode == 1);
                }else if (Type.isWidget(selectObj.type)||(selectObj.type==Type.MyGroup&&selectObj.mode==1)){
                    //Widget下面只有Widget或者Widget组可以粘贴
                    if (Type.isWidget(shearPlate.type)){
                        return true;
                    }else return (shearPlate.type == Type.MyGroup && shearPlate.mode == 1);
                }else {
                    return false;
                }
            }

            /**
             * 主要操作
             * 添加新Page
             * @param _newPage 新的页面
             * @param _successCallback 成功的回调
             * @constructor
             */
            this.AddNewPage = function (_newPage, _successCallback) {
                setRendering(true);

                var newPage = _.cloneDeep(_newPage);
                // console.log('newPage',newPage);
                var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
                var newPageIndex=-1;
                if (currentPageIndex == project.pages.length - 1) {
                    project.pages.push(newPage);
                    newPageIndex=project.pages.length - 1;
                } else {
                    project.pages.splice(currentPageIndex + 1, 0, newPage);
                    newPageIndex=currentPageIndex + 1;

                }

                _self.changeCurrentPageIndex(newPageIndex, function () {
                    _cleanPageHashKey();
                    _successCallback && _successCallback();
                },true);

            };
            /**
             * 主要操作
             * 在当前Page添加一个新Layer
             * @param _newLayer
             * @param _successCallback
             * @constructor
             */
            this.AddNewLayerInCurrentPage = function (_newLayer, _successCallback) {

                var pageNode = CanvasService.getPageNode();
                //init zindex
                _newLayer.zIndex = pageNode.getObjects().length;

                var currentPage=_self.getCurrentPage();
                var initiator = {
                    width: _newLayer.info.width,
                    height: _newLayer.info.height,
                    top: _newLayer.info.top,
                    left: _newLayer.info.left,
                    id: _newLayer.id,
                    lockScalingFlip:true,
                    hasRotatingPoint:false,
                    shadow:{
                        color:'rgba(0,0,0,0.4)',blur:2
                    }
                };
                //make name unique
                _newLayer.name = NameIncrementer.getNewName(_newLayer.name,(currentPage.layers||[]).map(function(l){return l.name}))
                currentPage.layers.push(_newLayer);

                var fabLayer=new fabric.MyLayer(_newLayer.id,initiator);
                pageNode.add(fabLayer);

                pageNode.renderAll.bind(pageNode)();
                _newLayer.info.width=fabLayer.getWidth();
                _newLayer.info.height=fabLayer.getHeight();

                currentPage.currentFabLayer=fabLayer;
                pageNode.renderAll.bind(pageNode)();

                _self.currentFabLayerIdList=[];
                _self.currentFabLayerIdList.push(_newLayer.id);
                _self.OnLayerSelected(_newLayer,_successCallback);

            };

            this.AddNewSubLayerInCurrentLayer= function (_newSubLayer,_successCallback) {

                var newSubLayer = _.cloneDeep(_newSubLayer);
                var currentLayer=getCurrentLayer();
                var currentLayerIndex= _indexById(_self.getCurrentPage().layers,currentLayer);
                //make name unique
                newSubLayer.name = NameIncrementer.getNewName(newSubLayer.name,(currentLayer.subLayers||[]).map(function(s){return s.name}))
                currentLayer.subLayers.push(newSubLayer);
                var newSubLayerIndex=currentLayer.subLayers.length - 1;

                _self.OnSubLayerSelected(currentLayerIndex,newSubLayerIndex,_successCallback,true);

            }
            /**
             * 主要操作
             * 在当前SubLayer添加一个新Widget
             * @constructor
             */
            this.AddNewWidgetInCurrentSubLayer = function (_newWidget, _successCallback) {
                var subLayerNode = CanvasService.getSubLayerNode();
                var currentSubLayer=getCurrentSubLayer();
                //init zindex
                _newWidget.zIndex = subLayerNode.getObjects().length;
                _newWidget.name = NameIncrementer.getNewName(_newWidget.name,(currentSubLayer.widgets||[]).map(function(s){return s.name}))
                var initiator = {
                    width: _newWidget.info.width,
                    height: _newWidget.info.height,
                    top: _newWidget.info.top,
                    left: _newWidget.info.left,
                    id: _newWidget.id,
                    lockScalingFlip:true,
                    hasRotatingPoint:false,
                    shadow:{
                        color:'rgba(0,0,0,0.4)',blur:2
                    }
                };

                _self.currentFabWidgetIdList=[];
                _self.currentFabWidgetIdList.push(_newWidget.id);

                var syncSublayer = function(fabWidget) {
                    // currentSubLayer.proJsonStr= subLayerNode.toJSON();
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                }

                if (_newWidget.type==Type.MySlide){
                    fabric.MySlide.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');


                        syncSublayer(fabWidget);


                    }, initiator);

                }
                else if (_newWidget.type==Type.MyProgress){

                    if (_newWidget.backgroundImg==''){
                        _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                    }
                    if (_newWidget.progressImg==''){
                        _newWidget.progressImg=Preference.BLANK_LAYER_URL;
                    }
                    fabric.MyProgress.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.backgroundUrl=_newWidget.backgroundImg;
                        fabWidget.progressUrl=_newWidget.progressImg;

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll();

                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);


                }
                else if(_newWidget.type==Type.MyDashboard){
                    if (_newWidget.backgroundImg==''){
                        _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                    }
                    if (_newWidget.progressImg==''){
                        _newWidget.progressImg=Preference.BLANK_LAYER_URL;
                    }
                    fabric.MyDashboard.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.backgroundUrl=_newWidget.backgroundImg;
                        fabWidget.progressUrl=_newWidget.progressImg;

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll();

                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');

                        syncSublayer(fabWidget);
                    },initiator);

                }
                else if (_newWidget.type==Type.MyButton){

                    fabric.MyButton.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.normalImg=_newWidget.backgroundImg;
                        fabWidget.pressImg=_newWidget.progressImg;

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);


                }
                else  if (_newWidget.type==Type.MyButtonGroup){
                    fabric.MyButtonGroup.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }
                else if(_newWidget.type==Type.MyNumber){
                    fabric.MyNumber.fromLevel(_newWidget, function (fabWidget) {

                        _self.currentFabWidgetIdList=[fabWidget.id];
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    }, initiator);
                } else if(_newWidget.type==Type.MyTextArea){
                    fabric.MyTextArea.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);

                    }, initiator);
                } else if(_newWidget.type == Type.MyNum){
                    fabric.MyNum.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll();

                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyKnob){
                    if (_newWidget.backgroundImg==''){
                        _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                    }
                    if (_newWidget.knobImg==''){
                        _newWidget.knobImg=Preference.BLANK_LAYER_URL;
                    }
                    fabric.MyKnob.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.backgroundUrl=_newWidget.backgroundImg;
                        fabWidget.knobUrl=_newWidget.KnobImg;

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll();

                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyOscilloscope){

                    if (_newWidget.backgroundImg==''){
                        _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                    }
                    if (_newWidget.oscillationImg==''){
                        _newWidget.oscillationImg=Preference.BLANK_LAYER_URL;
                    }
                    fabric.MyOscilloscope.fromLevel(_newWidget, function (fabWidget) {
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.backgroundUrl=_newWidget.backgroundImg;
                        fabWidget.oscillationImg=_newWidget.oscillationImg;

                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll();

                        subLayerNode.renderAll.bind(subLayerNode)();
                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');

                        syncSublayer(fabWidget);
                    },initiator)
                }else if(_newWidget.type==Type.MySwitch){
                    fabric.MySwitch.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];

                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();
                        //console.log('-');


                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyRotateImg){
                    fabric.MyRotateImg.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyDateTime){
                    fabric.MyDateTime.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyTexTime){
                    fabric.MyTexTime.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;//?
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyScriptTrigger){
                    fabric.MyScriptTrigger.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MySlideBlock){
                    fabric.MySlideBlock.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyVideo){
                    fabric.MyVideo.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabLayerIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type==Type.MyAnimation){
                    fabric.MyAnimation.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabLayerIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyTexNum){
                    fabric.MyTexNum.fromLevel(_newWidget,function (fabWidget) {
                        _self.currentFabLayerIdList = [fabWidget.id];
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();
                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyTouchTrack){
                    fabric.MyTouchTrack.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyAlphaImg){
                    fabric.MyAlphaImg.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyButtonSwitch){
                    fabric.MyButtonSwitch.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyClock){
                    fabric.MyClock.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else if(_newWidget.type===Type.MyGrid){
                    fabric.MyGrid.fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }else{
                    fabric[_newWidget.type].fromLevel(_newWidget,function(fabWidget){
                        _self.currentFabWidgetIdList=[fabWidget.id];
                        fabWidget.urls=_newWidget.subSlides;
                        subLayerNode.add(fabWidget);
                        subLayerNode.renderAll.bind(subLayerNode)();

                        _newWidget.info.width=fabWidget.getWidth();
                        _newWidget.info.height=fabWidget.getHeight();

                        syncSublayer(fabWidget);
                    },initiator);
                }

            };

            /**
             * 主要操作
             * 绑定缩略图的拖拽
             * @param _dragStartCallback
             * @param _droppedCallback
             * @returns {{dragStart: ProjectService.dragStart, dropped: ProjectService.dropped}}
             * @constructor
             */
            this.BindPageTree = function (_dragStartCallback, _droppedCallback) {
                var startOperate;
                var startIndex;
                var endIndex;
                var endOperate;
                return {

                    dragStart: function (e) {
                        startOperate = SaveCurrentOperate();
                        startIndex = e.source.index;
                        _dragStartCallback(e);
                    },
                    dropped: function (e) {
                        endIndex = e.dest.index;
                        if (endIndex != startIndex) {
                            endOperate = SaveCurrentOperate();
                        }
                        _droppedCallback(e, endOperate)
                    },
                    accept: function (sourceNodeScope, destNodesScope, destIndex) {
                        if (destNodesScope.isParent(sourceNodeScope)) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                };
            };

            /**
             * 主要操作
             * 根据序号删除一个页面
             * @param _index
             * @param _successCallback
             * @constructor
             */
            this.DeletePageByIndex = function (_index, _successCallback) {
                var currentPageIndex=-1;
                if (_index == 0 && project.pages.length == 1) {

                    project.pages = [];
                    var newPage = TemplateProvider.getRandomPage();
                    project.pages.push(newPage);
                    currentPageIndex = 0;
                } else if (_index == 0) {
                    project.pages.shift();
                    currentPageIndex = 0;

                } else {
                    project.pages.splice(_index, 1);
                    currentPageIndex = _index - 1;
                }
                _cleanPageHashKey();

                _self.changeCurrentPageIndex(currentPageIndex,_successCallback);




            };

            /**
             * 主要操作
             * 删除Layer
             * @param _successCallback
             * @constructor
             */
            this.DeleteActiveLayers = function (_successCallback) {
                var pageNode = CanvasService.getPageNode();
                var currentPage=_self.getCurrentPage();
                var currentPageIndex= _indexById(project.pages,currentPage);
                var activeGroup = pageNode.getActiveGroup();
                var activeObject = pageNode.getActiveObject();


                if (activeGroup && activeGroup.objects.length > 0) {
                    _.forEach(activeGroup.getObjects(), function (_fabLayer) {
                        pageNode.fxRemove(_fabLayer,{
                            onComplete: function () {
                                deleteLayerFromJson(_fabLayer);
                            }
                        });
                    });
                    pageNode.fxRemove(activeGroup, {
                        onComplete: function () {
                            pageNode.deactivateAll();
                            pageNode.renderAll();

                            _self.OnPageSelected(currentPageIndex,_successCallback);
                        }
                    });


                }
                else if (activeObject) {

                    pageNode.fxRemove(activeObject, {
                        onComplete: function () {
                            deleteLayerFromJson(activeObject);
                            _self.OnPageSelected(currentPageIndex,_successCallback);


                        }
                    });
                }

                function deleteLayerFromJson(object) {
                    var layers = _self.getCurrentPage().layers;
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        if (layer.id == object.id) {
                            layers.splice(i, 1);
                        }
                    }
                }


            };

            /**
             *主要操作
             * 删除当前的SubLayer
             * 如果是当前的showSubLayer要另外判断
             * @param _successCallback
             * @constructor
             */
            this.DeleteCurrentSubLayer= function (_successCallback) {
                var currentLayer= _self.getCurrentLayer();
                var currentSubLayer=_self.getCurrentSubLayer();
                var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
                var currentSubLayerIndex=-1;
                _.forEach(currentLayer.subLayers, function (_subLayer,_subLayerIndex) {
                    if (_subLayer.id==currentSubLayer.id){
                        currentSubLayerIndex=_subLayerIndex;
                    }
                });
                if (currentSubLayerIndex<0){
                    console.warn('找不到SubLayer');
                    alertErr()
                    return;
                }
                var shown=(currentLayer.showSubLayer.id==currentSubLayer.id);

                if (!shown){
                    _self.OnLayerSelected(currentLayer, function () {
                        currentLayer.subLayers.splice(currentSubLayerIndex,1);
                        _successCallback&&_successCallback();
                    });
                }else if(currentLayer.subLayers.length>1){
                    var showSubLayer= currentLayer.subLayers[1];
                    currentLayer.showSubLayer=showSubLayer;
                    _self.SyncSubLayerImage(currentLayer,showSubLayer, function () {
                        _self.OnLayerSelected(currentLayer, function () {
                            currentLayer.subLayers.splice(currentSubLayerIndex,1);
                            _successCallback&&_successCallback();
                        });
                    })

                }else {
                    var newSubLayer=TemplateProvider.getDefaultSubLayer();
                    currentLayer.subLayers.push(newSubLayer);
                    currentLayer.showSubLayer=newSubLayer;
                    _self.SyncSubLayerImage(currentLayer,newSubLayer, function () {
                        _self.OnLayerSelected(currentLayer, function () {
                            currentLayer.subLayers.splice(currentSubLayerIndex,1);
                            _successCallback&&_successCallback();
                        });
                    })

                }


            };

            this.DeleteActiveWidgets= function (_successCallback) {
                var subLayerNode = CanvasService.getSubLayerNode();
                var currentSubLayer=_self.getCurrentSubLayer();
                var currentPage= _self.getCurrentPage();
                var currentLayer= _self.getCurrentLayer();
                var layerIndex= _indexById(currentPage.layers,currentLayer);
                var subLayerIndex= _indexById(currentLayer.subLayers,currentSubLayer);
                var activeGroup = subLayerNode.getActiveGroup();
                var activeObject = subLayerNode.getActiveObject();


                if (activeGroup && activeGroup.objects.length > 0) {
                    _.forEach(activeGroup.getObjects(), function (_fabWidget) {
                        subLayerNode.fxRemove(_fabWidget,{
                            onComplete: function () {
                                deleteLayerFromJson(_fabWidget);
                            }
                        });
                    });
                    subLayerNode.fxRemove(activeGroup, {
                        onComplete: function () {
                            subLayerNode.deactivateAll();
                            subLayerNode.renderAll();

                            // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                            _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback);
                        }
                    });


                }
                else if (activeObject) {

                    subLayerNode.fxRemove(activeObject, {
                        onComplete: function () {
                            deleteLayerFromJson(activeObject);
                            _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback);

                        }
                    });
                }

                function deleteLayerFromJson(object) {
                    var widgets = _self.getCurrentSubLayer().widgets;
                    for (var i = 0; i < widgets.length; i++) {
                        var widget = widgets[i];
                        if (widget.id == object.id) {
                            widgets.splice(i, 1);
                        }
                    }
                }
            }





            /**
             * 主要操作
             * Move Layer
             * @param _successCallback
             * @constructor
             */
            this.MoveActiveObjects = function (type,direction,step,_successCallback) {
                var fabNode;
                var layerMode = true;
                if (type === 'layers'){
                    fabNode = CanvasService.getPageNode();
                }else if (type === 'widgets'){
                    fabNode = CanvasService.getSubLayerNode();
                    layerMode = false;
                }else{
                    return;
                }

                var activeGroup = fabNode.getActiveGroup();
                var activeObject = fabNode.getActiveObject();

                step = step || 0;
                var leftStep  = 0;
                var topStep = 0;
                switch (direction){
                    case 'up':
                        topStep = 0-step;
                        break;
                    case 'down':
                        topStep = step;
                        break;
                    case 'left':
                        leftStep = 0-step;
                        break;
                    case 'right':
                        leftStep = step;
                        break;
                }
                var tempLeft;
                var tempTop;

                if (activeGroup && activeGroup.objects.length > 0) {
                    tempLeft = activeGroup.get('left') + leftStep;
                    tempTop = activeGroup.get('top')+topStep;
                    activeGroup.set('left',tempLeft);
                    activeGroup.set('top',tempTop);


                }else if (activeObject) {

                    tempLeft = activeObject.get('left') + leftStep;
                    tempTop = activeObject.get('top')+topStep;
                    activeObject.set('left',tempLeft);
                    activeObject.set('top',tempTop);

                }

                fabNode.renderAll();
                //var currentSubLayer = _self.getCurrentSubLayer();
                //currentSubLayer.proJsonStr=JSON.stringify(fabNode.toJSON());

                var selectObj = getCurrentSelectObject();
                var fabGroup = selectObj.target;
                var baseLeft=selectObj.level.info.left+fabGroup.width/2;
                var baseTop=selectObj.level.info.top+fabGroup.height/2;

                if (layerMode){
                    var layer=_self.getCurrentLayer();
                    if (layer){
                        var fabLayer=_self.getFabricObject(layer.id);
                        if (fabLayer){
                            _self.SyncLevelFromFab(layer,fabLayer);
                            // var currentPage=_self.getCurrentPage();
                            // currentPage.proJsonStr=JSON.stringify(fabNode.toJSON());
                        }
                    }
                    fabGroup.forEachObject(function(item){
                        var layer = getLevelById(item.id,'layer');
                        layer.info.left = Math.round(baseLeft+item.left);
                        layer.info.top = Math.round(baseTop+item.top);
                    })
                }else{
                    if(selectObj.type=='group'&&selectObj.mode==1){
                        fabGroup.forEachObject(function(item){
                            var widget = getLevelById(item.id,'widget');
                            widget.info.left = Math.round(baseLeft+item.left);
                            widget.info.top = Math.round(baseTop+item.top);
                        });
                    }else{
                        var widget=_self.getCurrentWidget();
                        if (widget){
                            var fabWidget=_self.getFabricObject(widget.id,true);
                            if (fabWidget){
                                _self.SyncLevelFromFab(widget,fabWidget);
                            }
                        }
                    }
                    // var currentSubLayer = getCurrentSubLayer();
                    // currentSubLayer.proJsonStr=JSON.stringify(fabNode.toJSON());
                }

                _self.UpdateCurrentThumb();

                _successCallback && _successCallback();

            };

            /**
             * 辅助
             * 获得一个Layer对象的拷贝
             * @param _layer
             * @private
             */
            function _getCopyLayer(_layer){
                var copyLayer= _.cloneDeep(_layer);
                //change name
                copyLayer.name += '副本'
                copyLayer.id=_genUUID();
                if(copyLayer&&copyLayer.info){
                    copyLayer.info.left+=10;
                    copyLayer.info.top+=10;
                }
                _.forEach(copyLayer.subLayers, function (_subLayer) {
                    _subLayer.id=_genUUID();
                    // var proJson1=_subLayer.proJsonStr;
                    // if(typeof proJson1==='string'){
                    //     proJson1=JSON.parse(_subLayer.proJsonStr);
                    // }
                    // _.forEach(proJson1.objects, function (_fabWidget) {
                    //     _.forEach(_subLayer.widgets, function (_widget) {
                    //         _widget.$$hashKey=undefined;
                    //         if (_widget.id==_fabWidget.id){
                    //             var newId=_genUUID();
                    //             _widget.id=newId;
                    //             _fabWidget.id=newId;
                    //         }
                    //     })
                    // });
                    // _subLayer.proJsonStr=proJson1;
                    _subLayer.widgets&&_subLayer.widgets.forEach(function(_widget,index){
                        _widget.id = _genUUID();
                    })

                });
                return copyLayer;
            }

            //subLayer拷贝 tang
            function _getCopySubLayer(_subLayer){
                var copySubLayer= _.cloneDeep(_subLayer);
                copySubLayer.name += '副本'
                copySubLayer.id=_genUUID();

                copySubLayer.widgets&&copySubLayer.widgets.forEach(function(_widget,index){
                    _widget.id = _genUUID();
                });


                return copySubLayer;
            }

            function _getCopyPage(_page){
                var pageCopy= _.cloneDeep(_page);
                pageCopy.id=Math.random().toString(36).substr(2);   //重置id
                pageCopy.mode=0;    //显示page模式
                pageCopy.current = false;
                pageCopy.$$hashKey = undefined;
                // var proJson=pageCopy.proJsonStr;    //改proJson
                // _.forEach(proJson.objects, function (_fabLayer) {
                //     _.forEach(pageCopy.layers, function (_layer) {
                //         if (_layer.id==_fabLayer.id){
                //             var newId=Math.random().toString(36).substr(2);
                //             _layer.id=newId;
                //             _fabLayer.id=newId;
                //         }
                //     })
                // });
                // pageCopy.proJsonStr=proJson;
                // _.forEach(pageCopy.layers, function (_layer) {
                //     _.forEach(_layer.subLayers, function (_subLayer) {
                //         _subLayer.id=Math.random().toString(36).substr(2);
                //         var proJson1=_subLayer.proJsonStr;
                //         _.forEach(proJson1.objects, function (_fabWidget) {
                //             _.forEach(_subLayer.widgets, function (_widget) {
                //                 if (_widget.id==_fabWidget.id){
                //                     var newId=Math.random().toString(36).substr(2);
                //                     _widget.id=newId;
                //                     _fabWidget.id=newId;
                //                 }
                //             })
                //         });
                //         _subLayer.proJsonStr=proJson1;
                //     })
                // });

                var layers = pageCopy.layers;
                var subLayers;
                var widgets;
                layers&&layers.forEach(function(_layer){
                    _layer.id = _genUUID();
                    subLayers = _layer.subLayers;
                    subLayers&&subLayers.forEach(function(_subLayer){
                        _subLayer.id=_genUUID();
                        widgets = _subLayer.widgets;
                        widgets&&widgets.forEach(function(_widget){
                            _widget.id=_genUUID();
                        })
                    })
                });
                return pageCopy;
            }

            /**
             * 辅助
             * 获得一个Widget拷贝对象
             * @param _widget
             * @private
             */
            function _getCopyWidget(_widget){
                var copyWidget= _.cloneDeep(_widget);
                copyWidget.name += '副本'
                copyWidget.id=_genUUID();
                if(copyWidget&&copyWidget.info){
                    copyWidget.info.left+=5;
                    copyWidget.info.top+=5;
                }
                return copyWidget;
            }

            /**
             * 辅助
             * 生成uuid
             */
            function _genUUID(){
                var f = function(){
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };
                return ''+f()+f();
            }

            /**
             * 主要操作
             * 根据序号拷贝一个页面
             * @param _index
             * @param _successCallback
             * @constructor
             */
            this.CopyPageByIndex = function (_index, _successCallback) {
                _self.changeCurrentPageIndex(_index, function () {

                    var tempPage = _.cloneDeep(project.pages[_index]);
                    shearPagePlate = {
                        type: Type.MyPage,
                        objects: [tempPage]
                    };

                    _successCallback&&_successCallback();
                },false);


            };

            this.CopyLayer= function (_layer, _successCallback) {
                var fabLayer=_self.getFabricObject(_layer.id);
                shearPlate = {
                    type: Type.MyLayer,
                    objects: [_layer],
                    mode:0,
                    target:fabLayer
                };
                toastr.info('复制成功');
                _successCallback&&_successCallback();

            };
            //add by tang
            this.CopySubLayer=function(_subLayer,_successCallback){
                var fabSubLayer=_self.getFabricObject(_subLayer.id);

                shearPlate={
                    type:Type.MySubLayer,
                    objects:[_subLayer],
                    mode:0,
                    target:fabSubLayer
                };

                toastr.info('复制成功');
                _successCallback&&_successCallback();
            };


            this.CopyWidget= function (_widget, _successCallback) {
                // var copyWidget= _getCopyWidget(_widget);
                var fabWidget=_self.getFabricObject(_widget.id,true);
                shearPlate = {
                    type:_widget.type,
                    objects: [_widget],
                    mode:0,
                    target:fabWidget
                };
                toastr.info('复制成功');
                _successCallback&&_successCallback();
            }

            this.CopyLayerGroup= function (_groupTarget, _successCallback) {
                var pageIndex= _indexById(project.pages,_self.getCurrentPage());
                var groupCopy= _.cloneDeep(_groupTarget);

                _self.OnPageSelected(pageIndex, function () {
                    var layers=_self.getCurrentPage().layers;
                    _.forEach(layers, function (_layer) {
                        SyncLevelFromFab(_layer,_self.getFabricObject(_layer.id));
                    });

                    _self.OnLayerGroupSelected(_createGroup(groupCopy), function () {
                        var layers=[];
                        var fabGroup=_groupTarget;
                        _.forEach(_groupTarget.getObjects(), function (_fabLayer) {
                            var layer=_.cloneDeep(_self.getLevelById(_fabLayer.id));
                            if (!layer){
                                console.warn('layer不存在');
                                alertErr();
                                return;
                            }
                            layers.push(layer);
                        });
                        shearPlate = {
                            type: Type.MyLayerGroup,
                            objects:layers,
                            mode:0,
                            target:fabGroup
                        };
                        toastr.info('复制成功');
                        _successCallback&&_successCallback();

                    })


                })

            };

            this.CopyWidgetGroup= function (_groupTarget, _successCallback) {
                var layerIndex= _indexById(_self.getCurrentPage().layers,_self.getCurrentLayer());
                var subLayerIndex= _indexById(_self.getCurrentLayer().subLayers,_self.getCurrentSubLayer());
                var groupCopy= _.cloneDeep(_groupTarget);
                _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {
                    var widgets=_self.getCurrentSubLayer().widgets;
                    _.forEach(widgets, function (_widget) {
                        SyncLevelFromFab(_widget,_self.getFabricObject(_widget.id,true));
                    });
                    _self.OnWidgetGroupSelected(_createGroup(groupCopy,true), function () {
                        var widgets=[];
                        var fabGroup=_groupTarget;
                        _.forEach(_groupTarget.getObjects(), function (_fabWidget) {

                            var widget= _.cloneDeep(_self.getLevelById(_fabWidget.id));
                            _fabWidget.id=widget.id;
                            if (!widget){
                                console.warn('layer不存在');
                                alertErr()
                                return;
                            }
                            widgets.push(widget);

                        });
                        shearPlate = {
                            type: Type.MyWidgetGroup,
                            objects:widgets,
                            mode:1,
                            target:fabGroup,
                        };
                        toastr.info('复制成功');
                        _successCallback&&_successCallback();
                    })



                })

            }
            this.DoPaste= function (_successCallback) {
                //记录新生成Layer或Widget组成员的数组
                var fabLayerItems=[];
                var fabWidgetItems=[];

                if (shearPlate.type==Type.MyLayer){
                    var newLayer= _getCopyLayer(shearPlate.objects[0]);
                    newLayer.$$hashKey=undefined;
                    _self.AddNewLayerInCurrentPage(newLayer,_successCallback);

                }else if(shearPlate.type==Type.MySubLayer){//add by tang
                    var newSubLayer= _getCopySubLayer(shearPlate.objects[0]);
                    newSubLayer.$$hashKey=undefined;
                    _self.AddNewSubLayerInCurrentLayer(newSubLayer,_successCallback)

                }else if (shearPlate.type==Type.MyGroup&&shearPlate.mode==0){
                    //粘贴LayerGroup
                    //添加Layer然后选中Group
                    addLayers(0, function () {
                        _self.OnLayerGroupSelected(new fabric.Group(fabLayerItems),_successCallback,true);

                    })
                }else if (Type.isWidget(shearPlate.type)){
                    var newWidget= _getCopyWidget(shearPlate.objects[0]);
                    newWidget.$$hashKey=undefined;
                    _self.AddNewWidgetInCurrentSubLayer(newWidget,_successCallback);

                }else if (shearPlate.type==Type.MyGroup&&shearPlate.mode==1){
                    //粘贴widgetGroup
                    //添加widget然后选中Group
                    addWidgets(0, function () {

                        _self.OnWidgetGroupSelected(new fabric.Group(fabWidgetItems),_successCallback);
                    })
                }

                /**
                 * 递归函数,往当前Page添加Layer数组
                 * @param _index 当前Layer的index
                 * @param _callback 递归的出口
                 */
                function addLayers(_index,_callback){

                    var layer=_getCopyLayer(shearPlate.objects[_index]);
                    layer.name += '副本'
                    layer.$$hashKey=undefined;
                    _self.AddNewLayerInCurrentPage(layer, function (_fabLayer) {
                        //如果不是Group中最后一个Layer,继续添加下一个
                        //否则运行回调
                        fabLayerItems.push(_fabLayer);
                        if (_index==shearPlate.objects.length-1){
                            _callback&&_callback();
                            return;
                        }
                        addLayers(_index+1,_callback);
                    })
                }

                /**
                 * 递归函数,往当前SubLayer添加Widget数组
                 * @param _index 当前Layer的index
                 * @param _callback 递归的出口
                 */
                function addWidgets(_index,_callback){
                    var widget=_getCopyWidget(shearPlate.objects[_index]);
                    widget.name += '副本'
                    widget.$$hashKey=undefined;
                    _self.AddNewWidgetInCurrentSubLayer(widget, function (_fabWidget) {
                        //如果不是Group中最后一个Layer,继续添加下一个
                        //否则运行回调

                        fabWidgetItems.push(_fabWidget);

                        if (_index==shearPlate.objects.length-1){
                            _callback&&_callback();
                            return;
                        }
                        addWidgets(_index+1,_callback);
                    })
                }

            }
            /**
             * 主要操作
             * 根据序号粘贴一个页面
             * @param _successCallback
             * @constructor
             */
            this.PastePageByIndex = function (_successCallback) {

                if (shearPagePlate.type != Type.MyPage) {
                    console.warn('当前剪切板中不是页面');
                    return;
                }
                //change copied page name
                var pastePage = _getCopyPage(shearPagePlate.objects[0]);
                pastePage.name = pastePage.name+'副本'

                this.AddNewPage(pastePage, function () {
                    _successCallback && _successCallback();
                });

            };

            //var holdOperate={};
            /**
             * 主要操作
             * 拿起一个可操作对象
             * @param status
             * @param _successCallback
             */
            this.HoldObject = function (status, _successCallback) {

                status.holdOperate = SaveCurrentOperate();
                _successCallback && _successCallback();
            };
            var scalingOperate={
                scaling:false,
                objId:''
            };
            this.scalingOperate = scalingOperate;
            this.ScaleLayer= function (status, _successCallback) {
                scalingOperate.scaling=true;
                scalingOperate.objId=getCurrentSelectObject().level.id;
                var layer=getCurrentLayer();
                status.holdOperate = SaveCurrentOperate();
                _successCallback && _successCallback();
            }


            this.calculateCurrentSizeToSurroundLayers = function(){
                var _page = this.getCurrentPage()
                var layers = _page.layers;
                var leftMost = 0
                var rightMost = project.initSize.width
                var topMost = 0
                var bottomMost = project.initSize.height
                var curLayer, curRight, curBottom
                for(var i=0;i<layers.length;i++){
                    curLayer = layers[i]
                    if(curLayer.info.left < leftMost){
                        leftMost = curLayer.info.left
                    }
                    if(curLayer.info.top < topMost){
                        topMost = curLayer.info.top
                    }
                    curRight = curLayer.info.left + curLayer.info.width
                    if(curRight > rightMost){
                        rightMost = curRight
                    }
                    curBottom = curLayer.info.top + curLayer.info.height
                    if(curBottom > bottomMost){
                        bottomMost = curBottom
                    }
                }
                _page.currentSize = {
                    width:parseInt(2*Math.max(Math.abs(rightMost- project.initSize.width/2),Math.abs(leftMost- project.initSize.width/2))),
                    height:parseInt(2*Math.max(Math.abs(topMost- project.initSize.height/2),Math.abs(bottomMost- project.initSize.height/2)))
                }

                // console.log(_page.currentSize)
            }

            this.updateOutBorder = function(){
                var pageNode=CanvasService.getPageNode();
                var page = _self.getCurrentPage()
                _.forEach(pageNode.getObjects(), function (_fabObj) {
                    if (_fabObj.type == 'MyOutBorder') {
                        _fabObj.fire('changeCurrentSize',page.currentSize)
                    }
                });
            }

            /**
             * 主要操作
             * 放下一个可操作对象
             * @param status
             * @param _successCallback
             * @constructor
             */
            this.ReleaseObject = function (status, _successCallback) {
                var selectObj=getCurrentSelectObject();

                //如果缩放了Layer,需要和subLayer同步
                if (scalingOperate.scaling){
                    scalingOperate.scaling=false;
                    scalingOperate.objId='';
                    if (selectObj.type==Type.MyLayer){
                        _self.SyncSubLayerImage(selectObj.level,selectObj.level.showSubLayer, function () {
                            selectObj.target.fire('OnScaleRelease',selectObj.target.id);
                        })
                    }

                }
                if (selectObj.type==Type.MyLayer){
                    
                    selectObj.target.fire('OnRelease',selectObj.target.id);
                    //calculate new page border
                    this.calculateCurrentSizeToSurroundLayers()
                    //update border
                    this.updateOutBorder();
                    _self.ScaleCanvas('page');

                }else if (selectObj.type==Type.MyGroup&&selectObj.mode==0) {
                    var fabGroup = selectObj.target;
                    var baseLeft=selectObj.level.info.left+fabGroup.width/2;
                    var baseTop=selectObj.level.info.top+fabGroup.height/2;
                    fabGroup.forEachObject(function(item){
                        var layer = getLevelById(item.id,'layer');
                        layer.info.left = Math.round(baseLeft+item.left);
                        layer.info.top = Math.round(baseTop+item.top);
                    })

                    // _.forEach(selectObj.target.getObjects(), function (_obj) {
                    //     var fabLayer = getFabricObject(_obj.id);
                    //     fabLayer.fire('OnRelease', fabLayer.id);
                    // })
                }
                else if (Type.isWidget(selectObj.type)){
                    selectObj.target.fire('OnRelease',selectObj.target.id);

                }else if (selectObj.type==Type.MyGroup&&selectObj.mode==1){
                    var fabGroup = selectObj.target;
                    var baseLeft=selectObj.level.info.left+fabGroup.width/2;
                    var baseTop=selectObj.level.info.top+fabGroup.height/2;
                    // _.forEach(selectObj.target.getObjects(), function (_obj) {
                    //     var fabWidget=getFabricObject(_obj.id,true);
                    //     fabWidget.fire('OnRelease',fabWidget.id);
                    // })
                    fabGroup.forEachObject(function(item){
                        var widget = getLevelById(item.id,'widget');
                        widget.info.left = Math.round(baseLeft+item.left);
                        widget.info.top = Math.round(baseTop+item.top);
                    })
                }
                if (status.holdOperate) {
                    var currentPage=_self.getCurrentPage();
                    if (!currentPage){
                        console.warn('找不到Page');
                        alertErr();
                        return;
                    }
                    // currentPage.proJsonStr = JSON.stringify(CanvasService.getPageNode().toJSON());

                    // var currentSubLayer=_self.getCurrentSubLayer();
                    // if (currentSubLayer){
                    //     currentSubLayer.proJsonStr=JSON.stringify(CanvasService.getSubLayerNode().toJSON());
                    // }
                    _successCallback && _successCallback();
                }
            };

            /**
             * 根据id获取一个控件widget level
             * @param _id
             */
            var getLevelById = function(_id,type){
                if(type=='widget'){
                    var currentSublayer = _self.getCurrentSubLayer();
                    var widget=null;
                    if(currentSublayer){
                        var widgets = currentSublayer.widgets;
                        for(var i=0;i<widgets.length;i++){
                            if(widgets[i].id==_id){
                                widget = widgets[i];
                            }
                        }
                    }
                    return widget;
                }else if(type=='layer'){
                    var currentPage = _self.getCurrentPage();
                    var layer=null;
                    if(currentPage){
                        var layers = currentPage.layers;
                        for(var i=0;i<layers.length;i++){
                            if(layers[i].id==_id){
                                layer=layers[i];
                            }
                        }
                    }
                    return layer;
                }

            };

            this.SaveCurrentOperate= function () {

                var currentPage=_self.getCurrentPage();
                var pageNode=CanvasService.getPageNode();
                //currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                //console.log(currentPage.proJsonStr);

                var currentSubLayer=_self.getCurrentSubLayer();
                if (currentSubLayer){
                    var subLayerNode=CanvasService.getSubLayerNode();

                    //currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                }
                //console.log(project);
                return _.cloneDeep(project);
            };

            this.LoadCurrentOperate = function (_operate, _successCallback,_errCallback) {
                for(var key in _operate){
                    if(_operate.hasOwnProperty(key)){
                        if(project.hasOwnProperty(key)){
                            project[key] = _.cloneDeep(_operate[key]);
                        }
                    }
                }
                //project=_operate;
                TagService.syncCustomTags(project.customTags);
                TagService.syncTimerTags(project.timerTags);
                TagService.setTimerNum(project.timerTags.length||0);
                TagService.syncTagClasses(project.tagClasses);

                _cleanPageHashKey();
                var pageNode=CanvasService.getPageNode();
                var subCanvasNode=CanvasService.getSubLayerNode();
                _.forEach(project.pages, function (_page,_pageIndex) {
                    if (_page.current){
                        if (_page.selected){
                            _self.OnPageSelected(_pageIndex,_successCallback,true,false,_errCallback);
                            return;
                        }
                        if (_page.currentFabLayer&&_page.currentFabLayer.type!=Type.MyLayer){
                            _self.OnLayerGroupSelected(_createGroup(_page.currentFabLayer),_successCallback,true);
                            return;
                        }
                        _.forEach(_page.layers, function (_layer, _layerIndex) {
                            if (_layer.current){
                                if (_layer.selected){
                                    _self.OnLayerSelected(_layer,_successCallback,true);
                                    return;
                                }

                                _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {
                                    if (_subLayer.current){
                                        if (_subLayer.selected){
                                            _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);
                                            return;
                                        }

                                        if (!Type.isWidget(_subLayer.currentFabWidget.type)){

                                            //选中组
                                            _self.OnWidgetGroupSelected(_createGroup(_subLayer.currentFabWidget,true),_successCallback,true);
                                            return;
                                        }
                                        _.forEach(_subLayer.widgets, function (_widget) {
                                            if (_widget.current){
                                                if (_widget.selected){
                                                    _self.OnWidgetSelected(_widget,_successCallback,true);
                                                }
                                            }
                                        })
                                    }
                                })
                            }

                        })
                    }
                });



            };


            /**edit in 2017/9/18 by lixiang
             * 这个操作要遍历一遍数据结构，非常影响速度.
             * 次要操作，重置所有的page、layer、subLayer的selected和current属性
             * Page空白被点击后的响应
             * @param pageIndex         序号
             * @param _successCallback  回调
             * @param skipClean         是否跳过[清理currentFabLayerIdList]
             * @constructor
             */
            this.OnPageClicked= function (pageIndex, _successCallback,skipClean) {
                if (pageIndex<0){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }
                if (!skipClean){
                    _self.currentFabLayerIdList=[];

                }
                _self.currentFabWidgetIdList=[];
                _.forEach(project.pages, function (_page,_pageIndex) {
                        if (_pageIndex != pageIndex) {
                            _page.selected = false;
                            _page.current = false;
                        } else {
                            _page.selected = true;
                            _page.current = true;
                            _page.currentFabLayer = null;
                        }
                        _.forEach(_page.layers, function (_layer) {
                            _layer.selected = false;
                            _layer.current = false;
                            _.forEach(_layer.subLayers, function (_subLayer) {
                                _subLayer.selected = false;
                                _subLayer.current = false;
                                _subLayer.currentFabWidget = null;

                                _.forEach(_subLayer.widgets, function (_widget) {
                                    _widget.selected = false;
                                    _subLayer.current = false;
                                })
                            })
                        })
                    }
                );
                _successCallback&&_successCallback();


            };
            function alertErr(message) {
                message = message || '出现错误，请刷新页面以避免后续错误！'
                toastr.error(message)
            }

            /**
             * 次要操作
             * 选择一个Page
             * @param pageIndex 序号
             * @param _successCallback  回调
             * @param forceReload   是否强制刷新
             * @param skipClean 跳过[清理选中的缓存]
             * @constructor
             */
            this.OnPageSelected= function (pageIndex,_successCallback,forceReload,skipClean,_errCallback) {
                //除了当前的Page,取消所有Page,Layer,SubLayer,Widget的current

                //如果当前在编辑Page,需要使所有Layer失焦,如果在编辑SubLayer,需要重新loadFromJSON
                var currentPage=project.pages[pageIndex];

                if (!currentPage){
                    currentPage=_self.getCurrentPage();
                }
                if (!currentPage){
                    console.warn('找不到操作前的Page');
                    alertErr();
                    return;
                }

                var editInSamePage=false;
                if (!_self.getCurrentPage()){
                    editInSamePage=true;

                }else if (_self.getCurrentPage()&&_self.getCurrentPage().id==currentPage.id){
                    editInSamePage=true;
                }
                var pageNode = CanvasService.getPageNode();

                if (currentPage.mode==0&&editInSamePage&&!forceReload){
                    //当前在page a状态，并且点击了page a
                    _self.OnPageClicked(pageIndex,null,skipClean);
                    pageNode.deactivateAll();
                    pageNode.renderAll();
                    // currentPage.proJsonStr=pageNode.toJSON();

                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                    _successCallback && _successCallback();
                }else if (currentPage.mode==1){
                    //当前在sublayer状态
                    _backToPage(currentPage, function () {
                        _self.OnPageClicked(pageIndex,null,skipClean);
                        pageNode.deactivateAll();

                        pageNode.renderAll();
                        // currentPage.proJsonStr=pageNode.toJSON();

                        console.log('cb in _backToPage',currentPage.name);
                        currentPage.mode=0;
                        currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                        _successCallback && _successCallback();

                    });
                }else{
                    //当前在page a状态，并且点击了page b
                    //-
                    // pageNode.setBackgroundImage(null, function () {
                    //     pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                    //         _self.OnPageClicked(pageIndex,null,skipClean);
                    //
                    //         pageNode.deactivateAll();
                    //         pageNode.renderAll();
                    //         currentPage.proJsonStr=pageNode.toJSON();
                    //
                    //
                    //         currentPage.mode=0;
                    //         currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                    //
                    //         _successCallback && _successCallback();
                    //     });
                    // });

                    //+
                    //切换到另一页，不需要更新这一页的缩率图
                    var options = !!currentPage.backgroundImage?{
                        width:project.initSize.width,
                        height:project.initSize.height
                    }:null;
                    //+
                    pageNode.setBackgroundColor(currentPage.backgroundColor,function(){
                        pageNode.setBackgroundImage(currentPage.backgroundImage||null,function(){
                            _drawCanvasNode(currentPage,pageNode,function(){
                                //重新draw layer的背景图片,这些将展示在page上
                                // var layers = currentPage.layers||[];
                                // layers.map(function(layer,index){
                                //     var layerFab = _self.getFabLayerByLayer(layer);
                                //     if(layerFab){
                                //         layerFab.fire('OnRefresh',function(){
                                //             // if(index===layers.length-1){
                                //             //     currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                                //             // }
                                //         });
                                //     }
                                // });
                                _self.OnPageClicked(pageIndex,null,skipClean);
                                pageNode.deactivateAll();
                                pageNode.renderAll();
                                // currentPage.proJsonStr=pageNode.toJSON();
                                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                                currentPage.mode=0;

                                _self.ScaleCanvas('page');
                                _successCallback && _successCallback();

                                // console.log('cost time is:',Date.now()-timeStamp);
                            })
                        },options);
                    });
                }
            };


            /**
             * 当前选中的layer列表
             * @type {Array}
             */
            this.currentFabLayerIdList=[];
            this.currentFabWidgetIdList=[];
            this.OnLayerClicked= function (_target,_successCallback) {
                //除了选中的layer,清除所有Layer,SubLayer,Widget的current
                _self.currentFabWidgetIdList=[];
                var currentPage=_self.getCurrentPage();
                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }
                currentPage.selected=false;

                _.forEach(currentPage.layers, function (_layer) {
                    if (_target.id==_layer.id){

                        _layer.current=true;
                        _layer.selected=true;
                        currentPage.currentFabLayer=_target;
                        _target.hasControls=true;

                        SyncLevelFromFab(_layer,_target);
                    }else if (belongToGroup(_layer,_target)){

                        _target.lockScalingX=true;
                        _target.lockScalingY=true;
                        _layer.current=false;
                        _layer.selected=true;
                        currentPage.currentFabLayer=_target;
                        var controlsVisibility=Preference.GROUP_CONTROL_VISIBLE;
                        _target.setControlsVisibility(controlsVisibility);

                    }else {
                        _layer.current=false;
                        _layer.selected=false;

                    }
                    _.forEach(_layer.subLayers, function (_subLayer) {
                        _subLayer.selected=false;
                        _subLayer.current=false;
                        _subLayer.currentFabWidget=null;
                        _.forEach(_subLayer.widgets, function (_widget) {
                            _widget.selected=false;
                            _subLayer.current=false;
                        })
                    })
                });

                _successCallback&&_successCallback();
            };
            /**
             * 在多选模式下的选择
             * @constructor
             */


               this.OnLayerMultiSelected= function (_successCallback) {
                var currentFabLayerIdList=_self.currentFabLayerIdList;
                var pageNode=CanvasService.getPageNode();


                var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());

                if (currentFabLayerIdList.length>1){
                    _self.OnPageSelected(currentPageIndex, function () {

                        var fabLayerList=[];
                        pageNode.forEachObject(function (fabLayer) {
                            if (_indexById(currentFabLayerIdList,fabLayer.id)>=0){
                                fabLayerList.push(fabLayer);
                            }
                        })
                        if (fabLayerList.length!=currentFabLayerIdList.length){
                            console.warn('数据不一致');
                        }
                        var fabGroup=new fabric.Group(fabLayerList,{
                            canvas:pageNode
                        });
                        _self.OnLayerGroupSelected(fabGroup,_successCallback,false);
                    },false,true)

                }else if (currentFabLayerIdList.length==1){
                    _self.OnPageSelected(currentPageIndex, function () {

                        _self.OnLayerSelected(_self.getLevelById(currentFabLayerIdList[0]),_successCallback,false);
                    },false,true)

                }else{
                    console.warn('currentFabLayerIdList为空');
                }


            };

            /**
             * 次要操作
             * 双击Layer
             * @param _layerId
             * @param _successCallback
             * @constructor
             */
            this.OnLayerDoubleClicked=function(_layerId,_successCallback){

                var currentPage=_self.getCurrentPage();
                var currentPageIndex=_indexById(project.pages,currentPage);
                var currentLayer=_self.getLevelById(_layerId);
                var layerIndex=_indexById(currentPage.layers,currentLayer);

                var subLayerIndex=-1;

                _.forEach(currentLayer.subLayers,function (_subLayer, _index) {
                    if (_subLayer.id==currentLayer.showSubLayer.id){
                        subLayerIndex=_index;
                    }
                })
                //console.log(currentPageIndex+'/'+layerIndex+'/'+subLayerIndex);
                _self.OnPageSelected(currentPageIndex,function () {
                    _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback,true);

                });
            }
            this.OnWidgetMultiSelected= function (_successCallback) {
                var currentFabWidgetIdList=_self.currentFabWidgetIdList;
                var subLayerNode=CanvasService.getSubLayerNode();

                var layerIndex= _indexById(_self.getCurrentPage().layers,_self.getCurrentLayer());
                var subLayerIndex= _indexById(_self.getCurrentLayer().subLayers,_self.getCurrentSubLayer());

                if (currentFabWidgetIdList.length>1){
                    _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {

                        var fabWidgetList=[];
                        subLayerNode.forEachObject(function (fabWidget) {
                            if (_indexById(currentFabWidgetIdList,fabWidget.id)>=0){
                                fabWidgetList.push(fabWidget);
                            }
                        })
                        if (fabWidgetList.length!=currentFabWidgetIdList.length){
                            console.warn('数据不一致');
                        }
                        var fabGroup=new fabric.Group(fabWidgetList,{
                            canvas:subLayerNode
                        });
                        _self.OnWidgetGroupSelected(fabGroup,_successCallback,false);
                    },false,true)
                }else if (currentFabWidgetIdList.length==1){

                    _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {

                        _self.OnWidgetSelected(_self.getLevelById(currentFabWidgetIdList[0]),_successCallback,false);
                    },false,true)

                }else{
                    console.warn('currentFabWidgetList为空');
                }


            }
            /**
             * 次要操作
             * 选中Layer组
             * @param fabGroup
             * @param _successCallback
             * @param forceReload
             * @param preventPop
             * @constructor
             */
            this.OnLayerGroupSelected= function (fabGroup, _successCallback, forceReload,preventPop) {
                var currentPage=_self.getCurrentPage();
                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr()
                    return;
                }
                //如果当前在编辑Page,需要选择Layer,如果在编辑SubLayer,需要重新loadFromJSON
                var pageNode = CanvasService.getPageNode();
                if (currentPage.mode==0&&!forceReload){
                    currentPage.currentFabLayer=fabGroup;
                    var currentFabLayer= currentPage.currentFabLayer;
                    pageNode.setActive(currentFabLayer);
                    currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                    pageNode.renderAll();
                    // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                    //console.log(currentPage.proJsonStr);

                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                    _successCallback && _successCallback();
                }else {
                    _backToPage(currentPage, function () {
                        currentPage.currentFabLayer=fabGroup;
                        var currentFabLayer= _createGroup(currentPage.currentFabLayer);
                        pageNode.setActive(currentFabLayer);
                        currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                        pageNode.renderAll();
                        // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                        //console.log(currentPage.proJsonStr);

                        currentPage.mode=0;
                        currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                        _successCallback && _successCallback();

                    });
                }
            };

            /**
             * 次要操作
             * stage以外选中Layer
             * @param _layer Layer对象
             * @param _successCallback  回调
             * @param forceReload   是否强制刷新
             * @param _fabLayer
             * @constructor
             */
            this.OnLayerSelected= function (_layer,_successCallback,forceReload,_fabLayer) {
                var currentPage=_self.getCurrentPage();
                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }

                //如果当前在编辑Page,需要选择Layer,如果在编辑SubLayer,需要重新loadFromJSON
                var pageNode = CanvasService.getPageNode();

                if (currentPage.mode==0&&!forceReload){

                    pageNode.deactivateAll();
                    pageNode.renderAll();

                    currentPage.currentFabLayer=_fabLayer?_fabLayer:getFabricObject(_layer.id);
                    var currentFabLayer=currentPage.currentFabLayer;
                    //console.log('currentFabLayer',currentFabLayer);
                    if(!currentFabLayer){
                        //error
                        alertErr();
                        return
                    }

                    pageNode.setActive(currentFabLayer);

                    currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                    pageNode.renderAll();
                    // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                    //console.log(currentPage.proJsonStr);

                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                    _self.SyncSubLayerImage(_layer,_layer.showSubLayer, function () {
                        _successCallback&&_successCallback(currentFabLayer)
                    });
                }else {
                    //从sublayer选择layer，需要先返回page
                    _backToPage(currentPage, function () {
                        currentPage.currentFabLayer=getFabricObject(_layer.id);
                        var currentFabLayer= currentPage.currentFabLayer;
                        if(!currentFabLayer){
                            //error
                            alertErr();
                            return;
                        }

                        pageNode.deactivateAll();
                        pageNode.renderAll();

                        pageNode.setActive(currentFabLayer);
                        currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);

                        pageNode.renderAll();
                        // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());

                        currentPage.mode=0;
                        currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                        _self.SyncSubLayerImage(_layer,_layer.showSubLayer, function () {
                            _successCallback&&_successCallback(currentFabLayer);
                        });
                    });
                }
            };

            /**
             * 效率低
             * 遍历所有的layer、sublayer、widgets
             * 重置所有的selected、current、currentSublayer属性
             * @param layerIndex
             * @param subLayerIndex
             * @param _successCallback
             */
            this.OnSubLayerClicked= function (layerIndex,subLayerIndex,_successCallback) {
                _self.currentFabLayerIdList=[];

                var currentPage=_self.getCurrentPage();
                var currentLayer=currentPage.layers[layerIndex];
                var currentSubLayer=currentLayer.subLayers[subLayerIndex];
                currentPage.selected=false;
                _.forEach(currentPage.layers, function (_layer,_layerIndex) {
                    if (layerIndex>=0){
                        if (_layerIndex==layerIndex) {
                            _layer.current = true;
                            _layer.selected = false;
                            currentLayer = _layer;

                        }else {
                            _layer.current=false;
                            _layer.selected=false;
                        }
                    }

                    _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {
                        if (subLayerIndex>=0){
                            if (_subLayerIndex==subLayerIndex&&_layerIndex==layerIndex){
                                _subLayer.current=true;
                                _subLayer.selected=true;
                                currentSubLayer=_subLayer;
                                currentSubLayer.currentFabWidget=null;
                            }else {
                                _subLayer.current=false;
                                _subLayer.selected=false;
                            }
                        }
                        _.forEach(_subLayer.widgets, function (_widget) {
                            _widget.current=false;
                            _widget.selected=false;
                        })
                    })
                });
                _successCallback&&_successCallback();
            };

            this.OnSubLayerSelected= function (layerIndex,subLayerIndex,_successCallback,forceReload) {
                //除了当前的SubLayer,取消所有Page,Layer,SubLayer,Widget的current
                var currentPage=_self.getCurrentPage();
                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }
                //如果当前正在编辑subLayer,需要保存之前的subLayer再跳转
                if (currentPage.mode==1){
                    _leaveFromSubLayer(_self.getCurrentSubLayer());
                }
                try{
                    var currentLayer=currentPage.layers[layerIndex];

                }catch(e){
                    alertErr()
                }
                if (!currentLayer){
                    alertErr();
                    return;
                }
                var currentSubLayer=currentLayer.subLayers[subLayerIndex];
                if (!currentSubLayer){
                    console.warn('找不到SubLayer');
                    alertErr();
                    return;
                }
                drawBackgroundCanvas(currentLayer.info.width,currentLayer.info.height,currentLayer.info.left,currentLayer.info.top);
                var editInSameSubLayer=false;
                if (getCurrentSubLayer()&&getCurrentSubLayer().id==currentSubLayer.id){
                    editInSameSubLayer=true;
                }
                OnSubLayerClicked(layerIndex,subLayerIndex);
                //如果当前在编辑SubLayer,需要使所有Widget失焦,如果在编辑Page,需要重新loadFromJSON
                var subLayerNode = CanvasService.getSubLayerNode();
                var fabLayer=getFabricObject(currentLayer.id);
                if (currentPage.mode==1&&editInSameSubLayer&&!forceReload){

                    //subLayerNode.setWidth(currentLayer.info.width);
                    //subLayerNode.setHeight(currentLayer.info.height);
                    _self.ScaleCanvas('subCanvas',currentLayer);

                    subLayerNode.deactivateAll();
                    subLayerNode.renderAll();

                    // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    _successCallback && _successCallback();
                }
                else {
                    subLayerNode.clear();
                    //-
                    // subLayerNode.setBackgroundImage(null, function () {
                    //     subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {
                    //         _self.ScaleCanvas('subCanvas',currentLayer);
                    //         subLayerNode.deactivateAll();
                    //         subLayerNode.renderAll();
                    //         currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    //         currentPage.mode=1;
                    //         renderingSubLayer=false;
                    //         _successCallback && _successCallback();
                    //     });
                    //
                    // });

                    //+
                    _drawCanvasNode(currentSubLayer, subLayerNode, function () {
                        _self.ScaleCanvas('subCanvas', currentLayer);
                        subLayerNode.deactivateAll();
                        subLayerNode.renderAll();
                        // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        currentPage.mode = 1;
                        renderingSubLayer = false;
                        _successCallback && _successCallback();
                    });
                }
            };
            var renderingSubLayer=false;


            this.getFabLayerByLayer = function (layer) {
                var fabLayer = null;
                var pageNode = CanvasService.getPageNode();
                _.forEach(pageNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == layer.id) {
                        fabLayer = _fabObj;
                    }
                });
                return fabLayer;
            };

            /**
             * 同步subalyer的背景图片,用于page上的layer显示
             * @param layer
             * @param subLayer
             * @param _successCallback
             * @constructor
             */
            this.SyncSubLayerImage= function (layer,subLayer,_successCallback) {

                var self = this;
                var subLayerNode=CanvasService.getSubLayerNode();
                var currentSubLayer=subLayer;
                var currentLayer=layer;
                var layerFab = null;

                if (currentLayer.showSubLayer.backgroundImage&&currentLayer.showSubLayer.backgroundImage!=''){
                    subLayerNode.clear();
                    //-
                    // subLayerNode.loadFromJSON(currentLayer.showSubLayer.proJsonStr, function () {
                    //     _self.ScaleCanvas('subCanvas',currentLayer);
                    //     subLayerNode.setBackgroundImage(currentLayer.showSubLayer.backgroundImage, function () {
                    //         subLayerNode.deactivateAll();
                    //         subLayerNode.renderAll();
                    //         currentSubLayer.proJsonStr=subLayerNode.toJSON();
                    //         currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                    //         layerFab = self.getFabLayerByLayer(currentLayer);
                    //         if (layerFab) {
                    //             layerFab.fire('OnRefresh',function () {
                    //                 _successCallback && _successCallback();
                    //             })
                    //         }else{
                    //             _successCallback && _successCallback();
                    //         }
                    //     },{
                    //         width:currentLayer.info.width,
                    //         height:currentLayer.info.height
                    //     })
                    // })

                    //+
                    _drawCanvasNode(currentLayer.showSubLayer,subLayerNode,function(){
                        _self.ScaleCanvas('subCanvas',currentLayer);
                        subLayerNode.setBackgroundImage(currentLayer.showSubLayer.backgroundImage, function () {
                            subLayerNode.deactivateAll();
                            subLayerNode.renderAll();
                            // currentSubLayer.proJsonStr=subLayerNode.toJSON();
                            currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                            layerFab = self.getFabLayerByLayer(currentLayer);
                            if (layerFab) {
                                layerFab.fire('OnRefresh',function () {
                                    _successCallback && _successCallback();
                                })
                            }else{
                                _successCallback && _successCallback();
                            }
                        },{
                            width:currentLayer.info.width,
                            height:currentLayer.info.height
                        })
                    });
                }else{
                    //subLayerNode.clear();
                    subLayerNode.setBackgroundImage(null, function () {
                        subLayerNode.setBackgroundColor(currentLayer.showSubLayer.backgroundColor, function () {
                            //-
                            // subLayerNode.loadFromJSON(currentLayer.showSubLayer.proJsonStr, function () {
                            //     _self.ScaleCanvas('subCanvas',currentLayer);
                            //     subLayerNode.deactivateAll();
                            //     subLayerNode.renderAll();
                            //     currentSubLayer.proJsonStr= subLayerNode.toJSON();
                            //     currentSubLayer.url = subLayerNode.toDataURL({format:'png'});
                            //     layerFab = self.getFabLayerByLayer(currentLayer);
                            //     if (layerFab) {
                            //         layerFab.fire('OnRefresh',function () {
                            //             renderingSubLayer = false;
                            //             _successCallback && _successCallback();
                            //         })
                            //     }else{
                            //         _successCallback && _successCallback();
                            //     }
                            // });

                            //+
                            _drawCanvasNode(currentLayer.showSubLayer,subLayerNode,function(){
                                _self.ScaleCanvas('subCanvas',currentLayer);
                                subLayerNode.deactivateAll();
                                subLayerNode.renderAll();
                                // currentSubLayer.proJsonStr= subLayerNode.toJSON();
                                currentSubLayer.url = subLayerNode.toDataURL({format:'png'});
                                layerFab = self.getFabLayerByLayer(currentLayer);
                                if (layerFab) {
                                    layerFab.fire('OnRefresh',function () {
                                        renderingSubLayer = false;
                                        _successCallback && _successCallback();
                                    })
                                }else{
                                    _successCallback && _successCallback();
                                }
                            })
                        })
                    });
                }
            };



            this.OnWidgetClicked= function (_target, _successCallback) {
                //除了选中的layer,清除所有Layer,SubLayer,Widget的current
                _self.currentFabLayerIdList=[];
                var currentPage=_self.getCurrentPage();
                currentPage.selected=false;
                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }
                currentPage.selected=false;
                _.forEach(currentPage.layers, function (_layer) {
                    _layer.current=false;
                    _layer.selected=false;

                    _.forEach(_layer.subLayers, function (_subLayer) {
                        _subLayer.selected=false;
                        _subLayer.current=false;
                        _.forEach(_subLayer.widgets, function (_widget) {

                            if (_widget.id==_target.id){

                                _widget.selected=true;
                                _widget.current=true;

                                _subLayer.current=true;
                                _subLayer.currentFabWidget= _.cloneDeep(_target);
                                _layer.current=true;

                                _target.hasControls=true;
                                SyncLevelFromFab(_widget,_target);
                            }else if (belongToGroup(_widget,_target)){
                                _widget.selected=true;
                                _widget.current=false;
                                _subLayer.current=true;
                                _layer.current=true;
                                _subLayer.currentFabWidget= _.cloneDeep(_target);

                                //组的缩放要隐藏
                                var controlsVisibility=Preference.GROUP_CONTROL_VISIBLE;
                                _target.setControlsVisibility(controlsVisibility);
                            } else {
                                _widget.selected=false;
                                _widget.current=false;
                            }
                        })
                    })
                });
                _successCallback&&_successCallback();

            };
            var OnWidgetSelected=this.OnWidgetSelected= function (_widget,_successCallback,forceReload,_fabWidget) {

                var currentPage=_self.getCurrentPage();

                //如果当前正在编辑subLayer,需要保存之前的subLayer再跳转
                if (currentPage.mode==1){
                    //_leaveFromSubLayer(_self.getCurrentSubLayer());
                }

                var currentSubLayer=null;
                var currentLayer=null;

                _.forEach(currentPage.layers, function (_layer) {
                    _.forEach(_layer.subLayers, function (_subLayer) {
                        _.forEach(_subLayer.widgets, function (widget) {

                            if (widget.id==_widget.id){
                                currentSubLayer=_subLayer;
                                currentLayer=_layer;
                            }
                        })
                    })
                });

                if (!currentPage){
                    console.warn('找不到Page');
                    alertErr();
                    return;
                }
                if (!currentSubLayer){
                    console.warn('找不到SubLayer');
                    alertErr();
                    return;
                }

                var editInSameSubLayer=false;
                if (getCurrentSubLayer()&&getCurrentSubLayer().id==currentSubLayer.id){
                    editInSameSubLayer=true;
                }

                //如果当前在编辑SubLayer,需要选择Widget,如果在编辑Page,需要重新loadFromJSON
                var subLayerNode = CanvasService.getSubLayerNode();

                if (currentPage.mode==1&&editInSameSubLayer&&!forceReload){
                    //console.log('----');
                    _self.ScaleCanvas('subCanvas',currentLayer);
                    subLayerNode.deactivateAll();

                    subLayerNode.renderAll();
                    currentSubLayer.currentFabWidget=_fabWidget?_fabWidget:getFabricObject(_widget.id,true);

                    var currentFabWidget= currentSubLayer.currentFabWidget;
                    subLayerNode.setActive(currentFabWidget);
                    //console.log('subLayerNode toJson',subLayerNode.toJSON());
                    currentSubLayer.currentFabWidget= _.cloneDeep(currentFabWidget);

                    // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                    subLayerNode.renderAll();

                    _successCallback && _successCallback(currentFabWidget);
                }else {
                    subLayerNode.clear();
                    subLayerNode.setBackgroundImage(null, function () {
                        // subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {
                        //     _self.ScaleCanvas('subCanvas',currentLayer);
                        //     subLayerNode.deactivateAll();
                        //     subLayerNode.renderAll();
                        //     currentSubLayer.currentFabWidget=getFabricObject(_widget.id,true);
                        //     var currentFabWidget= currentSubLayer.currentFabWidget;
                        //     subLayerNode.setActive(currentFabWidget);
                        //     currentSubLayer.currentFabWidget=_.cloneDeep(currentFabWidget);
                        //     currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        //     subLayerNode.renderAll();
                        //     currentPage.mode=1;
                        //     _successCallback && _successCallback(currentFabWidget);
                        // });
                        _drawCanvasNode(currentSubLayer,subLayerNode,function(){
                            _self.ScaleCanvas('subCanvas',currentLayer);
                            subLayerNode.deactivateAll();
                            subLayerNode.renderAll();
                            currentSubLayer.currentFabWidget=getFabricObject(_widget.id,true);
                            var currentFabWidget= currentSubLayer.currentFabWidget;
                            subLayerNode.setActive(currentFabWidget);
                            currentSubLayer.currentFabWidget=_.cloneDeep(currentFabWidget);
                            // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                            subLayerNode.renderAll();
                            currentPage.mode=1;
                            _successCallback && _successCallback(currentFabWidget);
                        });
                    })
                }

            };
            /**
             * 选择WidgetGroup
             * @param fabWidgets    klass数组
             * @param fabGroup      fabric group对象,获取位置用
             * @param _successCallback
             * @param forceReload
             * @constructor
             */
            this.OnWidgetGroupSelected= function (fabGroup, _successCallback, forceReload) {

                var currentPage=_self.getCurrentPage();
                var currentSubLayer=_self.getCurrentSubLayer();

                var subLayerNode = CanvasService.getSubLayerNode();

                if (currentPage.mode==1&&!forceReload){

                    currentSubLayer.currentFabwidget =fabGroup;
                    var currentFabWidget=currentSubLayer.currentFabwidget;
                    subLayerNode.setActive(currentFabWidget);
                    currentSubLayer.currentFabwidget= _.cloneDeep(currentFabWidget);
                    subLayerNode.renderAll();
                    // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                    _successCallback && _successCallback();
                }else {
                    subLayerNode.clear();
                    subLayerNode.setBackgroundImage(null, function () {
                        // subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {
                        //     subLayerNode.renderAll();
                        //     currentSubLayer.currentFabwidget=fabGroup;
                        //
                        //     //重载时,需要重新创建一个group
                        //     var currentFabWidget=_createGroup(currentSubLayer.currentFabwidget,true);
                        //     subLayerNode.setActive(currentFabWidget);
                        //     currentSubLayer.currentFabwidget= _.cloneDeep(currentFabWidget);
                        //     subLayerNode.renderAll();
                        //     currentPage.mode=1;
                        //
                        //     currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        //
                        //     currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                        //     _successCallback && _successCallback();
                        // });

                        _drawCanvasNode(currentSubLayer,subLayerNode,function(){
                            subLayerNode.renderAll();
                            currentSubLayer.currentFabwidget=fabGroup;
                            //重载时,需要重新创建一个group
                            var currentFabWidget=_createGroup(currentSubLayer.currentFabwidget,true);
                            subLayerNode.setActive(currentFabWidget);
                            currentSubLayer.currentFabwidget= _.cloneDeep(currentFabWidget);
                            subLayerNode.renderAll();
                            currentPage.mode=1;
                            // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                            currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                            _successCallback && _successCallback();
                        })

                    })
                }
            };

            this.OnSelectAll= function (_successCallback) {
                if (_self.isEditingPage()){
                    //如果在编辑Page,选中所有的Layer
                    var pageNode=CanvasService.getPageNode();
                    var currentPage=_self.getCurrentPage();
                    var fabObjects=pageNode.getObjects();
                    if (fabObjects.length==0){
                        return;
                    }else if (fabObjects.length==1){
                        //只有一个Layer则直接选中
                        _self.OnLayerSelected(currentPage.layers[0],_successCallback);

                    }else {
                        var fabGroup=new fabric.Group(fabObjects,{
                            originX:'left',originY:'top'
                        });
                        //只有一个Layer则直接选中
                        _self.OnLayerGroupSelected(fabGroup,_successCallback);

                    }
                }else {
                    //如果在编辑SubCanvas,选中所有Widget
                    var subLayerNode=CanvasService.getSubLayerNode();
                    var currentSubLayer=_self.getCurrentSubLayer();
                    var fabWidgets=subLayerNode.getObjects();
                    if (fabWidgets.length==0){
                    }else if (fabWidgets.length==1){
                        //只有一个Layer则直接选中
                        _self.OnWidgetSelected(currentSubLayer.widgets[0],_successCallback);

                    }else {
                        var fabGroup=new fabric.Group(fabWidgets,{
                            originX:'left',originY:'top'
                        })
                        //只有一个Layer则直接选中
                        _self.OnWidgetGroupSelected(fabGroup,_successCallback);

                    }
                }
            }
            var SyncLevelFromFab=this.SyncLevelFromFab=function(level,fabNode){
                var width = level.info.width,
                    height = level.info.height,
                    left = level.info.left,
                    top = level.info.top;
                level.info.width = (Math.abs(fabNode.getWidth()-width)<=1)?width:Math.round(fabNode.getWidth());
                level.info.height = (Math.abs(fabNode.getHeight()-height)<=1)?height:Math.round(fabNode.getHeight());
                level.info.left = Math.round(fabNode.getLeft());
                level.info.top = Math.round(fabNode.getTop());

                if (level.type==Type.MyButtonGroup){
                    //如果是按钮组,要同步放大其间距
                    if (level.info.arrange=='horizontal'){
                        //横向用scaleX
                        level.info.interval=level.info.intervalScale*fabNode.getWidth();
                    }else {
                        //纵向
                        level.info.interval=level.info.intervalScale*fabNode.getHeight();
                    }
                }else if(level.type==Type.MyNum||level.type==Type.MyTextArea||level.type==Type.MyButton||level.type==Type.MyDateTime){
                    //如果是数字或者文本的竖直模式，需要改变他们的长宽
                    if(level.info.arrange&&level.info.arrange=='vertical'){
                        level.info.width = (Math.abs(fabNode.getHeight()-height)<=1)?height:Math.round(fabNode.getHeight());
                        level.info.height = (Math.abs(fabNode.getWidth()-width)<=1)?width:Math.round(fabNode.getWidth());
                    }
                }
                else if(level.type==Type.MyDashboard||level.type==Type.MyRotateImg){
                    //重置旋转中心
                    if(width!=level.info.width || height != level.info.height){
                        level.info.posRotatePointX = Math.round(level.info.width/2)
                        level.info.posRotatePointY = Math.round(level.info.height/2)
                    }
                    
                }


            }

            /**
             *更新当前Page的预览图
             * @param _callback
             * @constructor
             */
            this.UpdateCurrentThumb = function (_callback) {
                var pageNode = CanvasService.getPageNode();
                var currentPage=_self.getCurrentPage();
                currentPage.url = pageNode.toDataURL({format: 'jpeg', quality: '0.2'});
                _callback && _callback();
            };

            this.updateCurrentThumbInPage = function () {
                var subLayerNode = CanvasService.getSubLayerNode();
                if (!getCurrentLayer()) {
                    console.warn('当前Layer为空');
                    alertErr();
                    return;
                }
                getCurrentLayer().url = subLayerNode.toDataURL({format:'png'});
            };

            this.enterGenerateAttrs = function(_option, _successCallback){
            
                var selectObj=_self.getCurrentSelectObject();

                var arg={
                    attrs:{
                        
                    },
                    callback:_successCallback
                }

                for(var key in _option){
                    if(_option.hasOwnProperty(key)){
                        arg.attrs[key] = _option[key]
                        selectObj.level.info[key] = _option[key]
                    }
                }

                selectObj.target.fire('changeGeneralAttrs',arg);
            }

            this.ChangeAttributeName= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();
                object.level.name=_option.name;
                _successCallback&&_successCallback(currentOperate);
            };

            this.ChangeAttributeBackgroundColor= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();
                switch (object.type){
                    case Type.MyPage:
                        var currentPage=_self.getCurrentPage();
                        var pageNode=CanvasService.getPageNode();
                        pageNode.setBackgroundColor(_option.color, function () {
                            pageNode.renderAll();
                            currentPage.backgroundColor=_option.color;
                            // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                            //console.log(currentPage.proJsonStr);
                            var currentPageIndex= _indexById(project.pages, currentPage);
                            _self.OnPageSelected(currentPageIndex, function () {
                                _successCallback&&_successCallback(currentOperate);
                            });
                        });

                        break;

                    case Type.MySubLayer:
                        var currentSubLayer=getCurrentSubLayer();
                        var subLayerNode=CanvasService.getSubLayerNode();
                        subLayerNode.setBackgroundColor(_option.color, function () {
                            subLayerNode.renderAll();
                            currentSubLayer.backgroundColor=_option.color;
                            // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                            var currentPageIndex= _indexById(project.pages, _self.getCurrentPage());
                            var currentLayerIndex=_indexById(project.pages[currentPageIndex].layers,_self.getCurrentLayer());
                            var currentSubLayerIndex= _indexById(project.pages[currentPageIndex].layers[currentLayerIndex].subLayers, _self.getCurrentSubLayer());
                            _self.OnSubLayerSelected(currentPageIndex,currentSubLayerIndex, function () {
                                _successCallback&&_successCallback(currentOperate);
                            });
                        })
                }

            };

            /**
             * 是否禁用高亮
             * @param _option
             * @param _successCallback
             * @constructor
             */
            this.ChangeAttributeHighLightMode = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj = getCurrentSelectObject();
                //console.log('_option',_option);
                if(_option.highlightMode=='0'){
                    selectObj.level.info.disableHighlight=false;
                }else{
                    selectObj.level.info.disableHighlight=true;
                }
                //console.log('selectObje.level',selectObj.level);
                _successCallback && _successCallback(currentOperate)
            };

            /**
             * 是否启用动画，适用于仪表盘和进度条和数字
             * @param _option
             * @param _successCallback
             * @constructor
             */
            this.ChangeEnableAnimationMode = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj = getCurrentSelectObject();
                if(_option.enableAnimationModeId=='1'){
                    selectObj.level.info.enableAnimation=false;
                }else {
                    selectObj.level.info.enableAnimation=true;
                }
                _successCallback&&_successCallback(currentOperate);
            };

            this.ChangeAttributeBackgroundImage= function (_option,_successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();
                var currentPage=_self.getCurrentPage();

                switch (object.type){
                    case Type.MyPage:
                        var pageNode=CanvasService.getPageNode();
                        var opts = (!!_option.image)?{
                            width:project.initSize.width,
                            height:project.initSize.height
                        }:null;
                        var img = _option.image?_option.image:null;
                        pageNode.setBackgroundImage(img, function () {
                                pageNode.renderAll();
                                currentPage.backgroundImage=_option.image;
                                // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                                var currentPageIndex= _indexById(project.pages, currentPage);
                                _self.OnPageSelected(currentPageIndex, function () {
                                    _successCallback&&_successCallback(currentOperate);
                                });
                            },
                            opts
                        );

                        break;
                    case Type.MySubLayer:
                        var currentLayer=getCurrentLayer();
                        var currentSubLayer=getCurrentSubLayer();
                        var subLayerNode=CanvasService.getSubLayerNode();
                        subLayerNode.setBackgroundImage(_option.image, function () {
                            subLayerNode.renderAll();
                            currentSubLayer.backgroundImage=_option.image;
                            // currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                            var currentLayerIndex= _indexById(_self.getCurrentPage().layers, currentLayer);
                            var currentSubLayerIndex= _indexById(currentLayer.subLayers, currentSubLayer);
                            _self.OnSubLayerSelected(currentLayerIndex,currentSubLayerIndex, function () {
                                _successCallback&&_successCallback(currentOperate);
                            });
                        },{
                            width:currentLayer.info.width,
                            height:currentLayer.info.height
                        })
                }
            };

            this.ChangeAttributePressImage=function (_option,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                if (!_option.image||_option.image==''){
                    console.warn('内容为空');
                    return;
                }
                selectObj.level.pressImg=_option.image;
            };

            this.ChangeAttributePhotoWidth = function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();


                selectObj.level.info.photoWidth=_option.photoWidth;

                var arg={
                    photoWidth:_option.photoWidth,
                    callback:_successCallback
                };
                selectObj.target.fire('changePhotoWidth',arg);


            };

            this.ChangeAttributeCurValue = function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();


                selectObj.level.info.curValue=_option.curValue;

                var arg={
                    curValue:_option.curValue,
                    callback:_successCallback
                };
                selectObj.target.fire('changeCurValue',arg);


            };

            this.ChangeAttributeProgressValue= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();

                var progress=(_option.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);
                var progressValueOri=_option.progressValue;

                selectObj.level.info.progressValue=_option.progressValue;

                var arg={
                    progress:progress,
                    progressValueOri:progressValueOri,
                    callback:_successCallback
                };
                selectObj.target.fire('changeProgressValue',arg);


            };
            this.ChangeAttributeArrange= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.arrange=selectObj.level.info.arrange||'horizontal';
                if(selectObj.level.info.arrange==_option.arrange){
                    return;
                }
                selectObj.level.info.arrange=_option.arrange;
                var arg={
                    arrange:_option.arrange,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                };
                selectObj.target.fire('changeArrange',arg);

            };

            /**
             * 切换滑块模式
             */
            this.ChangeAttributeSlideBlockModeId = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.slideBlockModeId = _option.slideBlockModeId;
                var level = selectObj.level;
                selectObj.level.slideBlockModeId = _option.slideBlockModeId;
                level.texList = TemplateProvider.getSlideBlockTex(level.slideBlockModeId);
                var arg={
                    level:level,
                    backgroundColor: _.cloneDeep(selectObj.level.texList[0].slices[0].color),
                    slideBlockModeId:_option.slideBlockModeId,
                    callback:_successCallback
                };
                selectObj.target.fire('changeSlideBlockMode',arg);
            };

            /**
             * 是否禁止控件的高亮属性
             * @param _option
             * @param _successCallback
             * @constructor
             */
            this.ChangeAttributeHighlightMode = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                if(_option.highlightMode&&_option.highlightMode=='1'){
                    selectObj.level.info.disableHighlight=false;
                }else{
                    selectObj.level.info.disableHightlight=true;
                }
                console.log('selectObj.level',selectObj.level);
            };

            /**
             * 进度条tex的构造函数
             * @param name
             * @param templateId
             * @constructor
             */
            function ProgressTex(name,templateId,color,fileName){
                var baseUrl = '/public/templates/defaultTemplate/defaultResources/';
                this.currentSliceIdx = 0;
                this.name = name;
                this.slices = [
                    {
                        color:templateId?'rgba(0,0,0,0)':color,
                        imgSrc:templateId?baseUrl+fileName:'',
                        name:name
                    }
                ]
            }

            /**
             * 改变所选进度条的光标和模式
             * @param _option
             * @param _successCallback
             */
            this.ChangeAttributeCursor = function(_option,_successCallback){
                var templateId = TemplateProvider.getTemplateId();
                var arg={};
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.cursor=_option.cursor;
                selectObj.level.info.progressModeId=_option.progressModeId;
                if(_option.progressModeId=='0'){
                    //普通进度条
                    selectObj.level.texList=[];
                    selectObj.level.texList.push(new ProgressTex('进度条底纹',templateId,'rgba(240,145,66,1)','barBackground.png'),new ProgressTex('进度条',templateId,'rgba(125,27,27,1)','barAll.png'));
                }else if(_option.progressModeId=='1'){
                    //变色进度条
                    selectObj.level.texList=[];
                    selectObj.level.texList.push(new ProgressTex('进度条背景',null,'rgba(240,145,66,1)'),new ProgressTex('初始颜色',null,'rgba(170,80,80,1)'),new ProgressTex('结束颜色',null,'rgba(243,204,82,1)'));
                    arg.initColor=selectObj.level.texList[1].slices[0].color;
                    arg.endColor=selectObj.level.texList[2].slices[0].color;
                }else if(_option.progressModeId=='3'){
                    //多色进度条
                    selectObj.level.texList=[];
                    selectObj.level.texList.push(new ProgressTex('进度条背景',null,'rgba(240,145,66,1)'),new ProgressTex('颜色1',null,'rgba(0,255,0,1)'),new ProgressTex('颜色2',null,'rgba(255,0,0,1)'));
                    if(_option.thresholdModeId=='2'){
                        selectObj.level.texList.push(new ProgressTex('颜色3',null,'rgba(0,0,255,1)'));
                    }
                }
                if(_option.cursor=='1'){
                    selectObj.level.texList.push(new ProgressTex('光标纹理',null,'rgba(0,0,0,0)'));
                }
                arg.backgroundColor= selectObj.level.texList[0].slices[0].color;
                arg.progressColor=selectObj.level.texList[1].slices[0].color;
                arg.progressModeId=selectObj.level.info.progressModeId;
                arg.cursor=selectObj.level.info.cursor;
                arg.level=_.cloneDeep(selectObj.level);

                _successCallback&&_successCallback();
                selectObj.target.fire('changeAttributeCursor',arg);
            };

            /**
             * 在多色进度条模式下，更改颜色段数与颜色值
             * @param _option
             * @param _successCallback
             */
            this.ChangeAttributeProgressThreshold = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var arg={};
                if(_option.hasOwnProperty('thresholdModeId')){
                    selectObj.level.info.thresholdModeId=_option.thresholdModeId;
                    selectObj.level.info.threshold2=null;
                    if(_option.thresholdModeId=='1'){
                        selectObj.level.texList.splice(3,1);
                    }else if(_option.thresholdModeId=='2'){
                        selectObj.level.texList.splice(3,0,new ProgressTex('颜色3',null,'rgba(0,0,255,1)'));
                        arg.color3=selectObj.level.texList[3].slices[0].color;
                    }
                    arg.thresholdModeId=_option.thresholdModeId;
                }else if(_option.hasOwnProperty('threshold1')){
                    selectObj.level.info.threshold1=_option.threshold1;
                    arg.threshold1=_option.threshold1;
                }else if(_option.hasOwnProperty('threshold2')){
                    selectObj.level.info.threshold2=_option.threshold2;
                    arg.threshold2=_option.threshold2;
                }
                arg.callback=_successCallback;
                selectObj.target.fire('changeThreshold',arg);
            };

            this.ChangeAttributeDashboardOffsetValue = function(_option, _successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var offsetValue=_option.offsetValue;


                selectObj.level.info.offsetValue=offsetValue;

                var arg={
                    offsetValue:offsetValue,
                    callback:_successCallback
                };
                selectObj.target.fire('changeDashboardOffsetValue',arg);
            };

            this.ChangeAttributeDashboardValue= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var value=_option.value;


                selectObj.level.info.value=_option.value;

                var arg={
                    value:value,
                    callback:_successCallback
                }
                selectObj.target.fire('changeDashboardValue',arg);


            };

            this.ChangeAttributeDashboardPointerLength= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var value=_option.pointerLength;

                var fabDashboardObj = getFabricObject(selectObj.level.id,true);
                //console.log(fabDashboardObj,fabDashboardObj.getWidth(),fabDashboardObj.getHeight(),fabDashboardObj.getScaleX(),fabDashboardObj.getScaleY());

                selectObj.level.info.pointerLength=value;

                var arg={
                    pointerLength:value,
                    scaleX:fabDashboardObj.getScaleX(),
                    scaleY:fabDashboardObj.getScaleY(),
                    callback:_successCallback
                }

                selectObj.target.fire('changeDashboardPointerLength',arg);


            };

            this.ChangeAttributePointerOffset= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var posRotatePointX=_option.posRotatePointX;
                var posRotatePointY = _option.posRotatePointY;

                var fabDashboardObj = getFabricObject(selectObj.level.id,true);
                //console.log(fabDashboardObj,fabDashboardObj.getWidth(),fabDashboardObj.getHeight(),fabDashboardObj.getScaleX(),fabDashboardObj.getScaleY());

                selectObj.level.info.posRotatePointX=posRotatePointX;
                selectObj.level.info.posRotatePointY=posRotatePointY;

                var arg={
                    posRotatePointX:posRotatePointX,
                    posRotatePointY:posRotatePointY,
                    // scaleX:fabDashboardObj.getScaleX(),
                    // scaleY:fabDashboardObj.getScaleY(),
                    callback:_successCallback
                }
                switch(selectObj.type){
                    case Type.MyDashboard:
                        selectObj.target.fire('changeDashboardPointerOffset',arg);
                    break
                    case Type.MyRotateImg:
                        selectObj.target.fire('changeRotateImgPointerOffset',arg);
                    break
                }
                // _successCallback()
                //selectObj.target.fire('changeDashboardPointerOffset',arg);


            };

            this.ChangeAttributeDashboardInnerRadius = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var innerRadius=_option.innerRadius;
                
                selectObj.level.info.innerRadius=innerRadius;

                var arg={
                    innerRadius:innerRadius,
                    callback:_successCallback
                }
                selectObj.target.fire('changeDashboardPointerInnerRadius',arg);
            }

            this.ChangeAttributeKnobSize = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var value=_option.knobSize;

                var fabDashboardObj = getFabricObject(selectObj.level.id,true);
                //console.log(fabDashboardObj,fabDashboardObj.getWidth(),fabDashboardObj.getHeight(),fabDashboardObj.getScaleX(),fabDashboardObj.getScaleY());

                selectObj.level.info.knobSize=value;

                var arg={
                    knobSize:value,
                    scaleX:fabDashboardObj.getScaleX(),
                    scaleY:fabDashboardObj.getScaleY(),
                    callback:_successCallback
                }

                selectObj.target.fire('changeKnobSize',arg);
            };

            this.ChangeAttributeKnobValue= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var value=_option.value;


                selectObj.level.info.value=_option.value;

                var arg={
                    value:value,
                    callback:_successCallback
                }
                selectObj.target.fire('changeKnobValue',arg);


            };

            this.ChangeAttributeTextContent = function (_option,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    //level:selectObj.level,
                    callback:function () {
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                };
                

                for(var key in _option){
                    if(_option.hasOwnProperty(key)){
                        selectObj.level.info[key] = _option[key]
                        arg[key] = _option[key]
                    }
                }



                selectObj.target.fire('changeTextContent',arg);
            };

            //改变如下数字属性，需要重新渲染预览界面
            this.ChangeAttributeNumContent = function(_option,_successCallback){
                var currentOperate=SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,function(){
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                };

                //下面是数字字体属性，如字体，字体大小，粗体，斜体
                if(_option.fontFamily){
                    var tempFontFamily=_option.fontFamily;
                    selectObj.level.info.fontFamily=tempFontFamily;
                    arg.fontFamily=tempFontFamily;
                }
                if(_option.fontSize){
                    var tempFontSize=_option.fontSize;
                    selectObj.level.info.fontSize=tempFontSize;
                    arg.fontSize=tempFontSize;
                }
                if(_option.fontBold){
                    var tempFontBold=_option.fontBold;
                    selectObj.level.info.fontBold=tempFontBold;
                    arg.fontBold=tempFontBold;
                }
                if(_option.hasOwnProperty('fontItalic')){
                    var tempFontItalic=_option.fontItalic;
                    selectObj.level.info.fontItalic=tempFontItalic;
                    arg.fontItalic=tempFontItalic;
                }
                if(_option.hasOwnProperty('fontColor')){
                    var tempFontColor=_option.fontColor;
                    selectObj.level.info.fontColor=tempFontColor;
                    arg.fontColor=tempFontColor;
                }

                //下面是数字模式属性，如小数位数，字符数，切换模式，有无符号模式，前导0模式
                if(_option.numOfDigits){
                    var tempNumOfDigits=_option.numOfDigits;
                    selectObj.level.info.numOfDigits=tempNumOfDigits;
                    arg.numOfDigits=tempNumOfDigits;
                }
                if(_option.decimalCount||(_option.decimalCount==0)){
                    var tempDecimalCount=_option.decimalCount;
                    selectObj.level.info.decimalCount=tempDecimalCount;
                    arg.decimalCount=tempDecimalCount;
                }
                if(_option.symbolMode){
                    var tempSymbolMode=_option.symbolMode;
                    selectObj.level.info.symbolMode=tempSymbolMode;
                    arg.symbolMode=tempSymbolMode;
                }
                if(_option.frontZeroMode){
                    var tempFrontZeroMode=_option.frontZeroMode;
                    selectObj.level.info.frontZeroMode=tempFrontZeroMode;
                    arg.frontZeroMode=tempFrontZeroMode;
                }
                if(_option.hasOwnProperty('spacing')){
                    selectObj.level.info.spacing=_option.spacing;
                    arg.spacing=_option.spacing;
                }

                //下面是数字数值
                if(_option.hasOwnProperty('numValue')){
                    var tempNumValue = _option.numValue;
                    selectObj.level.info.numValue=tempNumValue;
                    arg.numValue=tempNumValue;
                }
                if(_option.hasOwnProperty('enableWaitingValue')){
                    selectObj.level.info.enableWaitingValue=_option.enableWaitingValue;
                    arg.enableWaitingValue=_option.enableWaitingValue;
                }
                if(_option.hasOwnProperty('waitingValue')){
                    selectObj.level.info.waitingValue=_option.waitingValue;
                    arg.waitingValue=_option.waitingValue;
                }
                if(_option.align){
                    var tempAlign = _option.align;
                    selectObj.level.info.align=tempAlign;
                    arg.align=tempAlign;
                }
                selectObj.target.fire('changeNumContent',arg);
            };
            //如下属性改变，但是不用重新渲染界面，包括切换模式
            this.ChangeAttributeOfNum=function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                if(_option.numModeId){
                    selectObj.level.info.numModeId=_option.numModeId;
                }
                if(_option.overFlowStyle){
                    selectObj.level.info.overFlowStyle=_option.overFlowStyle;
                }
                _successCallback&&_successCallback(currentOperate);
            };

            /**
             * 切换数字进制
             * 切换16进制的 进制符，大小写
             * @author tang
             * @param _option
             * @param _successCallback
             * @constructor
             */
            this.ChangeNumSystem = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,function(){
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                };

                if(_option.numSystem){//改进制
                    selectObj.level.info.numSystem=_option.numSystem;
                    arg.numSystem=_option.numSystem;
                }
                if(_option.markingMode){//16进制 0x标识
                    selectObj.level.info.hexControl.markingMode=_option.markingMode;
                    arg.markingMode=_option.markingMode;
                }
                if(_option.transformMode){//16进制 大小写
                    selectObj.level.info.hexControl.transformMode=_option.transformMode;
                    arg.transformMode=_option.transformMode;
                }
                selectObj.target.fire('changeNumSystem',arg);
            };

            //数字字体
            this.ChangeAttributeTexNumContent = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,function(){
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                };
                if(_option.characterW){
                    selectObj.level.info.characterW=_option.characterW;
                    arg.characterW=_option.characterW;
                }
                if(_option.characterH){
                    selectObj.level.info.characterH=_option.characterH;
                    arg.characterH=_option.characterH;
                }
                //下面是数字模式属性，如小数位数，字符数，切换模式，有无符号模式，前导0模式
                if(_option.numOfDigits){
                    var tempNumOfDigits=_option.numOfDigits;
                    selectObj.level.info.numOfDigits=tempNumOfDigits;
                    arg.numOfDigits=tempNumOfDigits;
                }
                if(_option.decimalCount||(_option.decimalCount==0)){
                    var tempDecimalCount=_option.decimalCount;
                    selectObj.level.info.decimalCount=tempDecimalCount;
                    arg.decimalCount=tempDecimalCount;
                }
                if(_option.symbolMode){
                    var tempSymbolMode=_option.symbolMode;
                    selectObj.level.info.symbolMode=tempSymbolMode;
                    arg.symbolMode=tempSymbolMode;
                }
                if(_option.frontZeroMode){
                    var tempFrontZeroMode=_option.frontZeroMode;
                    selectObj.level.info.frontZeroMode=tempFrontZeroMode;
                    arg.frontZeroMode=tempFrontZeroMode;
                }

                //下面是数字数值
                if(_option.hasOwnProperty('numValue')){
                    var tempNumValue = _option.numValue;
                    selectObj.level.info.numValue=tempNumValue;
                    arg.numValue=tempNumValue;
                }
                if(_option.hasOwnProperty('enableWaitingValue')){
                    selectObj.level.info.enableWaitingValue=_option.enableWaitingValue;
                    arg.enableWaitingValue=_option.enableWaitingValue;
                }
                if(_option.hasOwnProperty('waitingValue')){
                    selectObj.level.info.waitingValue=_option.waitingValue;
                    arg.waitingValue=_option.waitingValue;
                }

                if(_option.align){
                    var tempAlign = _option.align;
                    selectObj.level.info.align=tempAlign;
                    arg.align=tempAlign;
                }
                selectObj.target.fire('changeTexNumContent',arg);
            };

            this.ChangeAttributeOfTexNum=function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                if(_option.numModeId){
                    selectObj.level.info.numModeId=_option.numModeId;
                }
                if(_option.overFlowStyle){
                    selectObj.level.info.overFlowStyle=_option.overFlowStyle;
                }
                _successCallback&&_successCallback(currentOperate);
            };

            //改变按钮模式
            this.ChangeAttributeButtonModeId= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.buttonModeId=_option.buttonModeId;
                _successCallback&&_successCallback();
            };

            //改变示波器的一些需要重新渲染的属性，如点距离，添加网格，
            this.ChangeAttributeOscilloscopeForRender = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    callback:_successCallback
                };
                if(_option.hasOwnProperty('spacing')){
                    selectObj.level.info.spacing= _option.spacing;
                    arg.spacing=_option.spacing;
                }
                if(_option.hasOwnProperty('grid')){
                    selectObj.level.info.grid=_option.grid;
                    arg.grid=_option.grid;
                }
                if(_option.hasOwnProperty('lineWidth')){
                    selectObj.level.info.lineWidth=_option.lineWidth;
                    arg.lineWidth=_option.lineWidth;
                }
                if(_option.hasOwnProperty('gridInitValue')){
                    selectObj.level.info.gridInitValue=_option.gridInitValue;
                    arg.gridInitValue=_option.gridInitValue;
                }
                if(_option.hasOwnProperty('gridUnitX')){
                    selectObj.level.info.gridUnitX=_option.gridUnitX;
                    arg.gridUnitX=_option.gridUnitX;
                }
                if(_option.hasOwnProperty('gridUnitY')){
                    selectObj.level.info.gridUnitY=_option.gridUnitY;
                    arg.gridUnitY=_option.gridUnitY;
                }
                selectObj.target.fire('ChangeAttributeOscilloscope',arg);
            };
            //改变示波器的不需要重新渲染的属性，如线条颜色
            this.ChangeAttributeOscilloscope = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                if(_option.hasOwnProperty("lineColor")){
                    //console.log('keke',_option.lineColor);
                    selectObj.level.info.lineColor= _option.lineColor;
                }
            };
            //改变开关纹理所绑定的tag的位
            this.ChangeAttributeBindBit = function(_option,_successCallback){
                var bindBit=_option.bindBit;
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.info.bindBit=_option.bindBit;
                _successCallback&&_successCallback();
            };

            this.ChangeAttributeSwitchFlashDur = function(_option,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.info.flashDur=_option.flashDur;
                _successCallback&&_successCallback();
            };

            this.ChangeAttributeSwitchModeId = function(_option,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.info.mode=_option.mode;
                _successCallback&&_successCallback();
            };

            //改变字体样式，适用于开关控件，图层控件
            this.ChangeAttributeFontStyle=function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function () {
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                };

                if(_option.hasOwnProperty('text')){
                    selectObj.level.info.text=_option.text;
                    arg.text=_option.text;
                }
                if(_option.fontFamily){
                    selectObj.level.info.fontFamily=_option.fontFamily;
                    arg.fontFamily=_option.fontFamily;
                }
                if(_option.fontSize){
                    selectObj.level.info.fontSize=_option.fontSize;
                    arg.fontSize=_option.fontSize;
                }
                if(_option.fontColor){
                    selectObj.level.info.fontColor=_option.fontColor;
                    arg.fontColor=_option.fontColor;
                }
                if(_option.fontBold){
                    selectObj.level.info.fontBold=_option.fontBold;
                    arg.fontBold=_option.fontBold;
                }
                if(_option.hasOwnProperty('fontItalic')){
                    selectObj.level.info.fontItalic=_option.fontItalic;
                    arg.fontItalic=_option.fontItalic;
                }
                if(_option.fontName){
                    selectObj.level.info.fontName=_option.fontName;
                }

                selectObj.target.fire('changeFontStyle',arg);
            };
            //改变控件初始值
            this.ChangeAttributeInitValue = function(_option,_successCallback){
                var initValue=_option.initValue;
                var selectObj= _self.getCurrentSelectObject();
                selectObj.level.info.initValue=_option.initValue;
                var arg={
                    initValue:initValue,
                    callback:_successCallback
                };
                selectObj.target.fire('changeInitValue',arg);
            };
            //改变时间控件的属性值，added by LH 2017/12/13
            this.ChangeAttributeOfDateTime=function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,function(){
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                };
                if(_option.hasOwnProperty('spacing')){
                    selectObj.level.info.spacing=_option.spacing;
                    arg.spacing=_option.spacing;
                }
                selectObj.target.fire('changeDateTimeAttr',arg);
            };

            this.ChangeAttributeOfTextInput=function(_option,_successCallback){
                //var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    callback:_successCallback
                };
                if(_option.hasOwnProperty('spacing')){
                    selectObj.level.info.spacing=_option.spacing;
                    arg.spacing=_option.spacing;
                }
                if(_option.hasOwnProperty('halfSpacing')){
                    selectObj.level.info.halfSpacing=_option.halfSpacing;
                    arg.halfSpacing=_option.halfSpacing;
                }
                if(_option.hasOwnProperty('lineSpacing')){
                    selectObj.level.info.lineSpacing=_option.lineSpacing;
                    arg.lineSpacing=_option.lineSpacing;
                }
                selectObj.target.fire('changeTextInputAttr',arg);
            };



            //改变时间控件的显示模式
            this.ChangeAttributeDateTimeModeId = function(_option,_successCallback){
                var dateTimeModeId = _option.dateTimeModeId;
                var RTCModeId = _option.RTCModeId;
                var selectObj= _self.getCurrentSelectObject();
                selectObj.level.info.dateTimeModeId=dateTimeModeId;
                selectObj.level.info.RTCModeId=RTCModeId;
                var arg={
                    dateTimeModeId:dateTimeModeId,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                };
                selectObj.target.fire('changeDateTimeModeId',arg);
            };
            this.ChangeAttributeDateTimeText = function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function () {
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                }

                if(_option.hasOwnProperty('fontFamily')){
                    selectObj.level.info.fontFamily=_option.fontFamily;
                    arg.fontFamily = _option.fontFamily;
                }
                if(_option.hasOwnProperty('fontSize')){
                    selectObj.level.info.fontSize=_option.fontSize;
                    arg.fontSize = _option.fontSize;
                }
                if(_option.hasOwnProperty('fontColor')){
                    selectObj.level.info.fontColor=_option.fontColor;
                    arg.fontColor = _option.fontColor;
                }
                if(_option.hasOwnProperty('fontBold')){
                    selectObj.level.info.fontBold=_option.fontBold;
                    arg.fontBold = _option.fontBold;
                }
                if(_option.hasOwnProperty('fontItalic')){
                    selectObj.level.info.fontItalic=_option.fontItalic;
                    arg.fontItalic = _option.fontItalic;
                }

                selectObj.target.fire('changeDateTimeText',arg);
            };
            //改变时间图层控件的显示模式
            this.ChangeAttributeTexTimeModeId = function(_option,_successCallback){
                var dateTimeModeId = _option.dateTimeModeId;
                var RTCModeId = _option.RTCModeId;
                var selectObj= _self.getCurrentSelectObject();
                selectObj.level.info.dateTimeModeId=dateTimeModeId;
                selectObj.level.info.RTCModeId=RTCModeId;
                var arg={
                    dateTimeModeId:dateTimeModeId,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                };
                selectObj.target.fire('changeTexTimeModeId',arg);
            };
            this.ChangeAttributeTexTimeContent = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    level:selectObj.level,
                    callback:function(){
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,function(){
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                };
                if(_option.characterW){
                    selectObj.level.info.characterW=_option.characterW;
                    arg.characterW=_option.characterW;
                }
                if(_option.characterH){
                    selectObj.level.info.characterH=_option.characterH;
                    arg.characterH=_option.characterH;
                }

                selectObj.target.fire('changeTexTimeContent',arg);
            };

            this.ChangeAttributeGroupAlign=function(_option,_successCallback){
                var currentOperate=SaveCurrentOperate();
                var pageNode=CanvasService.getPageNode();
                var subLayerNode=CanvasService.getSubLayerNode();
                var currentPage=_self.getCurrentPage();
                var object = _self.getCurrentSelectObject();
                var fabGroup = object.target;
                var currentGroup = object.level;
                var groupWidth = fabGroup.getWidth();
                var groupHeight = fabGroup.getHeight();
                switch(_option.align){
                    case 'left':
                        fabGroup.forEachObject(function(item){
                            item.setLeft(-groupWidth/2);
                        });
                        break;
                    case 'top':
                        fabGroup.forEachObject(function(item){
                            item.setTop(-groupHeight/2);
                        });
                        break;
                    case 'bottom':
                        fabGroup.forEachObject(function(item){
                            var itemHeight=item.getHeight();
                            var top = groupHeight/2-itemHeight;
                            item.setTop(top);
                        });
                        break;
                    case 'right':
                        fabGroup.forEachObject(function(item){
                            var itemWidth=item.getWidth();
                            var left=groupWidth/2-itemWidth;
                            item.setLeft(left);
                        });
                        break;
                    default :break;
                }
                _self.ReleaseObject({});
                subLayerNode.renderAll();
                pageNode.renderAll();
                _successCallback && _successCallback(currentOperate);

            };

            //改变仪表盘模式，相应地改变此仪表盘控件的的slice内容
            this.ChangeAttributeDashboardModeId = function(_option,_successCallback){
                var templateId = TemplateProvider.getTemplateId();
                var selectObj = _self.getCurrentSelectObject();
                var level = selectObj.level;
                selectObj.level.dashboardModeId = _option.dashboardModeId;
                level.texList = TemplateProvider.getDashboardTex(level.dashboardModeId,level.backgroundModeId);

                //改变slice，背景颜色会成为新值，需要将此新的颜色值传递给render，来重绘canvas
                var level = _.cloneDeep(selectObj.level);
                var arg={
                    level:level,
                    backgroundColor: _.cloneDeep(selectObj.level.texList[0].slices[0].color),
                    dashboardModeId:_option.dashboardModeId,
                    callback:_successCallback
                };
                selectObj.target.fire('changeDashboardMode',arg);
            };

            this.ChangeAttributeBackgroundModeId = function(_option,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                var level = selectObj.level;
                if(_option.backgroundModeId===level.backgroundModeId){
                    return;
                }
                selectObj.level.backgroundModeId = _option.backgroundModeId;
                var arg = {
                    backgroundModeId:_option.backgroundModeId,
                    callback:_successCallback,
                };
                selectObj.target.fire('changeBackgroundMode',arg)
            };

            this.changeVideoSource=function(_option,_successCallback){
                var VideoSource = _option.source;
                var selectObj= _self.getCurrentSelectObject();
                selectObj.level.info.source=VideoSource;
            };
            this.changeVideoScale=function(_option,_successCallback){
                var VideoScale = _option.scale;
                var selectObj= _self.getCurrentSelectObject();
                selectObj.level.info.scale=VideoScale;
            };
            //改变仪表盘的转动方向
            this.ChangeAttributeDashboardClockwise=function(_option,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.info.clockwise = _option.clockwise;
                var arg={
                    clockwise: _option.clockwise,
                    callback:_successCallback
                };
                selectObj.target.fire('changeDashboardClockwise',arg);
            };

            this.ChangeAttributeRotateImgClockwise=function(_option,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.info.clockwise = _option.clockwise;
                var arg={
                    clockwise: _option.clockwise,
                    callback:_successCallback
                };
                selectObj.target.fire('changeRotateImgClockwise',arg);
            };



            //改变仪表盘的覆盖角度
            this.ChangeAttributeDashboardCoverAngle=function(_option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var arg={
                    callback:_successCallback
                };
                if(_option.hasOwnProperty('minCoverAngle')){
                    arg.minCoverAngle=_option.minCoverAngle;
                    selectObj.level.info.minCoverAngle=_option.minCoverAngle;
                }
                else if(_option.hasOwnProperty('maxCoverAngle')){
                    arg.maxCoverAngle=_option.maxCoverAngle;
                    selectObj.level.info.maxCoverAngle=_option.maxCoverAngle;
                }
                toastr.info('修改成功!');
                selectObj.target.fire('changeDashboardCoverAngle',arg);
            };
            this.ChangeAttributeInterval= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.interval=_option.interval;

                var fabInterval=selectObj.level.info.interval;

                //更新间距的比例
                var fabButtonGroup=getFabricObject(selectObj.level.id,true);

                if (selectObj.level.info.arrange=='horizontal'){
                    selectObj.level.info.intervalScale=selectObj.level.info.interval/fabButtonGroup.getWidth();
                    fabInterval=selectObj.level.info.interval/fabButtonGroup.getScaleX();
                }else {
                    selectObj.level.info.intervalScale=selectObj.level.info.interval/fabButtonGroup.getHeight();
                    fabInterval=selectObj.level.info.interval/fabButtonGroup.getScaleY();
                }

                var arg={
                    interval:fabInterval,
                    callback:_successCallback
                };
                selectObj.target.fire('changeInterval',arg);

            };


            this.ChangeAttributeCount= function (_option, _successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.count=_option.count;
                var ignoreHighlight = false
                var defaultTexFun

                switch(selectObj.type){
                    case Type.MyButtonGroup:
                        ignoreHighlight = false

                        defaultTexFun = TemplateProvider.getDefaultButtonTex
                        break
                    case Type.MyGallery:
                        ignoreHighlight = true
                        defaultTexFun = TemplateProvider.getDefaultTex
                        break
                }
                var reserved = ignoreHighlight ? 0 : 1
                checkTexList(selectObj.level,selectObj.level.info.count, function () {
                    var arg={
                        level:selectObj.level,
                        callback:_successCallback,
                    };
                    selectObj.target.fire('changeTex',arg);

                });

                /**
                 * 递归函数,根据count改变TexList
                 * @param _level    buttonGroup对象
                 * @param _count    要求的数目
                 * @param _callback 回调函数
                 */
                function checkTexList(_level,_count,_callback){
                    if (_level.texList.length<_count+reserved){
                        _level.texList.splice(_level.texList.length-1,0,defaultTexFun());
                        checkTexList(_level,_count,_callback);
                    }else if (_level.texList.length>_count+reserved){
                        _level.texList.splice(_level.texList.length-(1+reserved),1);
                        checkTexList(_level,_count,_callback);

                    }else {
                        _callback&&_callback();
                        return;
                    }
                }

            }

            this.ChangeTexSlicesCount = function(_option, _successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var targetTex = selectObj.level.texList[_option.texIdx]
                if(targetTex){
                    var targetCount = _option.count
                    var i
                    var changeNum
                    if(targetCount > targetTex.slices.length){
                        changeNum = targetCount-targetTex.slices.length
                        for(i=0;i<changeNum;i++){
                            targetTex.slices.push(TemplateProvider.getDefaultSlice())
                        }
                    }else if(targetCount < targetTex.slices.length){
                        changeNum = targetTex.slices.length - targetCount
                        for(i=0;i<changeNum;i++){
                            targetTex.slices.pop()
                        }
                    }else{
                        return
                    }
                }else{
                    return
                }
                

                selectObj.target.fire('changeTex',{
                    level:selectObj.level,
                    callback:_successCallback
                });
            }

            this.ChangeAttributePosition= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=_self.getCurrentSelectObject();
                var pageNode=CanvasService.getPageNode();
                var subLayerNode=CanvasService.getSubLayerNode();
                var currentPage=_self.getCurrentPage();

                if (object.type==Type.MyLayer) {

                    var fabLayer = null;
                    var currentLayer = getCurrentLayer();
                    _.forEach(pageNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabLayer = _fabObj;
                        }
                    });

                    if (_.isNumber(_option.left)) {
                        fabLayer.setLeft(_option.left);
                        currentLayer.info.left = _option.left;

                    }
                    if (_.isNumber(_option.top)) {
                        fabLayer.setTop(_option.top);
                        currentLayer.info.top = _option.top;

                    }
                    //calculate new page border
                    this.calculateCurrentSizeToSurroundLayers()
                    //update border
                    this.updateOutBorder();
                    _self.ScaleCanvas('page');

                    pageNode.renderAll();
                    // currentPage.proJsonStr = JSON.stringify(pageNode.toJSON());
                    _self.OnLayerSelected(currentLayer, function () {
                        _successCallback && _successCallback(currentOperate);

                    });
                }else if (Type.isWidget(object.type)) {
                    var fabWidget = null;
                    var currentSubLayer = getCurrentSubLayer();
                    var currentWidget = getCurrentWidget(currentSubLayer);
                    _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabWidget = _fabObj;
                        }
                    });
                    fabWidget = getFabricObject(object.target.id, true);
                    if (!fabWidget) {
                        console.warn('找不到fabSlide');
                        return;
                    }

                    if (_.isNumber(_option.left)) {
                        fabWidget.setLeft(_option.left);
                        currentWidget.info.left = _option.left;

                    }
                    if (_.isNumber(_option.top)) {
                        fabWidget.setTop(_option.top);
                        currentWidget.info.top = _option.top;

                    }

                    subLayerNode.renderAll();

                    // currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    _self.OnWidgetSelected(currentWidget, function () {
                        _successCallback && _successCallback(currentOperate);

                    });
                }else if (object.type==Type.MyGroup){
                    var currentObject=_self.getCurrentSelectObject();
                    var fabGroup=object.target;
                    var currentGroup=object.level;
                    if (!fabGroup) {
                        console.warn('找不到fabWidget');
                        alertErr()
                        return;
                    }

                    if (_.isNumber(_option.left)) {
                        fabGroup.setLeft(_option.left);
                        object.level.info.left=currentGroup.info.left = _option.left

                    }
                    if (_.isNumber(_option.top)) {
                        fabGroup.setTop(_option.top);
                        object.level.info.top=currentGroup.info.top = _option.top;
                    }
                    var baseLeft=object.level.info.left+fabGroup.width/2;
                    var baseTop=object.level.info.top+fabGroup.height/2;
                    fabGroup.forEachObject(function(item){
                        var obj = '';
                        if(currentObject.mode=='0'){
                            obj = getLevelById(item.id,'layer');
                        }else if(currentObject.mode=='1'){
                            obj = getLevelById(item.id,'widget');
                        }
                        obj.info.left = Math.round(baseLeft+item.left);
                        obj.info.top = Math.round(baseTop+item.top);
                    });
                    subLayerNode.renderAll();
                    pageNode.renderAll();
                    _successCallback && _successCallback(currentOperate);

                }
            };

            this.ChangeAttributeAnimation = function(_animationObj,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.animations=_animationObj;
                _successCallback&&_successCallback();
            };

            this.ChangeLayerAnimation = function(_animation,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                var arg = {
                    animation:_animation,
                    cb:_successCallback
                }
                selectObj.target.fire('updateAnimation',arg);
                
            };

            this.turnOffLayerAnimation = function(obj,_successCallback){
                
                var arg = {
                    animation:null,
                    cb:_successCallback
                }
                obj.target.fire('updateAnimation',arg);
                
            }

            this.AddAttributeTransition = function(_transition,_successCallback){
                var selectObj = _self.getCurrentSelectObject();
                selectObj.level.transition=_transition;
                _successCallback&&_successCallback();
            };
            this.ChangeAttributeTransition = function(_option,_successCallback){
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                if(_option.hasOwnProperty('name')){
                    selectObj.level.transition.name=_option.name;
                    selectObj.level.transition.show=_option.show;
                }else if(_option.hasOwnProperty('duration')){
                    selectObj.level.transition.duration=_option.duration;
                }else if(_option.hasOwnProperty('timingFun')){
                    selectObj.level.transition.timingFun=_option.timingFun;
                }
                _successCallback&&_successCallback(currentOperate);
            };

            /**
             * 主要操作
             * 改变对象的Action
             * @param _actionObj
             * @param _successCallback
             * @constructor
             */
            this.ChangeAttributeAction= function (_actionObj,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.actions=_actionObj;
                _successCallback&&_successCallback();
            };


            this.ChangeAttributeTexList= function (_actionObj,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var level = selectObj.level;
                level.texList=_actionObj;
                switch(level.type){
                    case Type.MyDashboard:
                        var info = level.info;
                        var texList = level.texList;
                        if(level.dashboardModeId!=='2'&&!!texList[1].slices[0].imgSrc){
                            var img = ResourceService.getResourceFromCache(texList[1].slices[0].imgSrc);
                            info.pointerImgWidth = img.width;
                            info.pointerImgHeight = img.height;
                        }
                        break;
                    case Type.MyClock:
                        var info = level.info;
                        var texList = level.texList;

                        var hourImg = ResourceService.getResourceFromCache(texList[1].slices[0].imgSrc);
                        var minuteImg = ResourceService.getResourceFromCache(texList[2].slices[0].imgSrc);
                        var secondImg = ResourceService.getResourceFromCache(texList[3].slices[0].imgSrc);

                        if (hourImg){
                            info.hourImgWidth = hourImg.width;
                            info.hourImgHeight = hourImg.height;
                        }

                        if (minuteImg){
                            info.minuteImgWidth = minuteImg.width;
                            info.minuteImgHeight = minuteImg.height;
                        }

                        if (secondImg){
                            info.secondImgWidth = secondImg.width;
                            info.secondImgHeight = secondImg.height;
                        }
                        break;
                    default:
                        break;
                }
                var arg={
                    level:level,
                    callback:_successCallback
                };
                selectObj.target.fire('changeTex',arg);
            };


            //track list
            this.getAllTrackList = function(){
                return project.trackList
            }

            this.updateTrackList = function(newTrackList){
                project.trackList = newTrackList

            }

            /**
             * 用于一键配置控件大小，使控件大小与纹理大小相同
             * @constructor
             */
            this.ChangeAttributeWidgetSize=function(_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var image;
                switch (selectObj.type){
                    case 'MySlide':
                    case 'MyRotateImg':
                    case 'MyTextArea':
                    case 'MyButton':
                    case 'MySlideBlock':
                    case 'MyAnimation':
                    case 'MySwitch':
                    case 'MyTouchTrack':
                    case 'MyAlphaSlide':
                    case 'MyTextInput':
                    case 'MyButtonSwitch':
                    case 'MyAlphaImg':
                    case 'MyGird':
                    case 'MyClock':
                        image = ResourceService.getResourceFromCache(selectObj.level.texList[0].slices[0].imgSrc);
                        break;
                    case 'MyProgress':
                        image = ResourceService.getResourceFromCache(selectObj.level.texList[1].slices[0].imgSrc);
                        break;
                    case 'MyDashboard':
                        image = ResourceService.getResourceFromCache(selectObj.level.texList[0].slices[0].imgSrc);
                        selectObj.level.info.posRotatePointX = Math.round(image.width/2);
                        selectObj.level.info.posRotatePointY = Math.round(image.height/2);
                        break;
                    default :
                        break;
                }

                if(!image){
                    return;
                }

                if(image.width==selectObj.level.info.width&&image.height==selectObj.level.info.height&&selectObj.target.scaleX==1&&selectObj.target.scaleY==1){
                    return;
                }
                var arg={
                    callback:_successCallback,
                    widgetWidth:image.width,
                    WidgetHeight:image.height
                };
                selectObj.level.info.width=image.width;
                selectObj.level.info.height=image.height;
                selectObj.target.fire('changeWidgetSize',arg);
            };

            this.ChangeAttributeTag= function (_tagObj, _successCallback) {
                var currentOperate = SaveCurrentOperate();
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.tag=_tagObj;
                _successCallback&&_successCallback(currentOperate);
            };
            this.ChangeAttributeValue= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var subLayerNode=CanvasService.getSubLayerNode();
                var arg=null;
                var progress=null;

                var selectObj=getCurrentSelectObject();
                if (_option.hasOwnProperty('maxValue')){
                    selectObj.level.info.maxValue=_option.maxValue;

                    if(selectObj.type==Type.MyProgress){
                        progress=(selectObj.level.info.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);

                        arg={
                            progress:progress,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeProgressValue',arg);
                    }
                    if(selectObj.type==Type.MyDashboard){
                        arg={
                            maxValue:_option.maxValue,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeDashboardValue',arg);
                    }
                    if(selectObj.type==Type.MyOscilloscope){
                        arg={
                            maxValue:_option.maxValue,
                            callback:_successCallback
                        };
                        selectObj.target.fire('ChangeAttributeOscilloscope',arg);
                    }
                    if(selectObj.type==Type.MySlideBlock){
                        arg={
                            maxValue:_option.maxValue,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeInitValue',arg);
                    }

                    if(selectObj.type==Type.MyAlphaImg){
                        arg={
                            maxValue:_option.maxValue,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeInitValue',arg);
                    }

                }
                if (_option.hasOwnProperty('minValue')){
                    selectObj.level.info.minValue=_option.minValue;

                    if(selectObj.type==Type.MyProgress){
                        progress=(selectObj.level.info.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);

                        arg={
                            progress:progress,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeProgressValue',arg);
                    }
                    if(selectObj.type==Type.MyDashboard){
                        arg={
                            minValue:_option.minValue,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeDashboardValue',arg);
                    }
                    if(selectObj.type==Type.MyOscilloscope){
                        arg={
                            minValue:_option.minValue,
                            callback:_successCallback
                        }
                        selectObj.target.fire('ChangeAttributeOscilloscope',arg);
                    }
                    if(selectObj.type==Type.MySlideBlock){
                        arg={
                            minValue:_option.minValue,
                            callback:_successCallback
                        }
                        selectObj.target.fire('changeInitValue',arg);
                    }

                    if(selectObj.type==Type.MyAlphaImg){
                        arg={
                            minValue:_option.minValue,
                            callback:_successCallback
                        }
                        selectObj.target.fire('changeInitValue',arg);
                    }
                }
                if(_option.hasOwnProperty('minAngle')){
                    selectObj.level.info.minAngle=_option.minAngle;

                    if(selectObj.type==Type.MyDashboard){
                        arg={
                            minAngle:_option.minAngle,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeDashboardValue',arg);
                    }
                }
                if(_option.hasOwnProperty('maxAngle')){
                    selectObj.level.info.maxAngle=_option.maxAngle;
                    if(selectObj.type==Type.MyDashboard){
                        arg={
                            maxAngle:_option.maxAngle,
                            callback:_successCallback
                        };
                        selectObj.target.fire('changeDashboardValue',arg);
                    }
                }
                if (_option.hasOwnProperty('highAlarmValue')){
                    selectObj.level.info.highAlarmValue=_option.highAlarmValue;
                }
                if (_option.hasOwnProperty('lowAlarmValue')){
                    selectObj.level.info.lowAlarmValue=_option.lowAlarmValue;
                }
                if (_option.hasOwnProperty('initValue')){
                    selectObj.level.info.initValue=_option.initValue;
                    selectObj.target.fire('changeNumber',selectObj.level);
                    subLayerNode.renderAll();
                }
                toastr.info('修改成功!');
                _successCallback&&_successCallback(currentOperate);
            }

            this.ChangeAttributeNoInit= function (_option,_successCallback) {
                var selectObj=getCurrentSelectObject();
                if (_option.noInit){
                    selectObj.level.info.noInit=_option.noInit;
                }
                toastr.info('修改成功!');
                //_successCallback&&_successCallback();
            }


            this.ChangeAttributeZIndex= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();
                if (object.type==Type.MyLayer){
                    var pageNode = CanvasService.getPageNode();
                    var fabLayer = null;
                    var currentPage=_self.getCurrentPage();
                    var currentLayer = getCurrentLayer();
                    _.forEach(pageNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabLayer = _fabObj;
                        }
                    });
                    if (!fabLayer) {
                        console.warn('找不到Layer');
                        alertErr();
                        return;
                    }
                    if (_option.index===0){
                        fabLayer.bringForward();
                    }else if(_option.index===1){
                        fabLayer.sendBackwards();
                    }else if(_option.index==='front'){
                        fabLayer.bringToFront();
                    }else if(_option.index==='back'){
                        fabLayer.sendToBack();
                    }
                    // currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                    var layers = pageNode.getObjects();
                    _.forEach(currentPage.layers, function (_layer,index) {
                        for (var i=0;i<layers.length;i++){
                            if (layers[i].id == _layer.id){
                                _layer.zIndex = i;
                                break;
                            }
                        }
                    });
                    currentPage.layers.sort(function(item1,item2){
                        return item1.zIndex-item2.zIndex;
                    });
                }else if (Type.isWidget(object.type)){
                    var subLayerNode = CanvasService.getSubLayerNode();
                    var fabWidget = null;
                    var currentSubLayer=getCurrentSubLayer();
                    //console.log(currentSubLayer.widgets);
                    var currentWidget = getCurrentWidget();
                    _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabWidget = _fabObj;
                        }
                    });
                    if (!fabWidget) {
                        console.warn('找不到Widget');
                        alertErr()
                        return;
                    }
                    if (_option.index===0){
                        fabWidget.bringForward();
                    }else if(_option.index===1) {
                        fabWidget.sendBackwards();
                    }else if(_option.index==='front'){
                        fabWidget.bringToFront();
                    }else if(_option.index==='back'){
                        fabWidget.sendToBack();
                    }
                    // currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    var widgetObjs = subLayerNode.getObjects();
                    _.forEach(currentSubLayer.widgets, function (_widget,index) {
                        for (var i=0;i<widgetObjs.length;i++){
                            if (widgetObjs[i].id == _widget.id){
                                _widget.zIndex = i;
                                break;
                            }
                        }
                    });
                    currentSubLayer.widgets.sort(function(item1,item2){
                        return  item1.zIndex-item2.zIndex;
                    });
                }else if(object.type==Type.MySubLayer){
                    var currentLayer = getCurrentLayer();
                    var subLayers = currentLayer.subLayers;
                    var currentSubLayer = getCurrentSubLayer();
                    var temp;
                    for(var i=0;i<subLayers.length;i++){
                        if(subLayers[i].id==currentSubLayer.id){
                            if(_option.index==0){
                                if(i>0){
                                    temp = subLayers[i-1];
                                    subLayers[i-1] = currentSubLayer;
                                    subLayers[i] = temp;
                                }
                            }else if(_option.index==1){
                                if(i<subLayers.length-1){
                                    temp = subLayers[i+1];
                                    subLayers[i+1] = currentSubLayer;
                                    subLayers[i] = temp;
                                }
                            }else if(_option.index==='front'){
                                subLayers.splice(i,1);
                                subLayers.unshift(currentSubLayer);
                            }else if(_option.index==='back'){
                                subLayers.splice(i,1);
                                subLayers.push(currentSubLayer);
                            }
                            currentLayer.showSubLayer = subLayers[0];
                            break;
                        }
                    }
                }else{
                    //无匹配返回
                    return
                }

                _successCallback&&_successCallback(currentOperate);
            };


            /**
             * 右下角图层菜单拖拽切换层级操作
             * layer和widget调整zIndex,subLayer调整layer的showSubLayer
             * @author tang
             * @param _endIndex 拖拽落点坐标
             * @param _cb 回调函数
             */
            this.ChangeDragZIndex=function (_endIndex,_cb){
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();
                if (object.type==Type.MyLayer){
                    var pageNode = CanvasService.getPageNode();
                    var fabLayer = null;
                    var currentPage=_self.getCurrentPage();
                    _.forEach(pageNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabLayer = _fabObj;
                        }
                    });
                    if (!fabLayer) {
                        console.warn('找不到Layer');
                        alertErr();
                        return;
                    }

                    fabLayer.moveTo(_endIndex);
                    var layers = pageNode.getObjects();
                    _.forEach(currentPage.layers, function (_layer) {
                        for (var i=0;i<layers.length;i++){
                            if (layers[i].id == _layer.id){
                                _layer.zIndex = i;
                                break;
                            }
                        }
                    });

                }else if (Type.isWidget(object.type)){
                    var subLayerNode = CanvasService.getSubLayerNode();
                    var fabWidget = null;
                    var currentSubLayer=getCurrentSubLayer();
                    _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabWidget = _fabObj;
                        }
                    });
                    if (!fabWidget) {
                        console.warn('找不到Widget');
                        alertErr();
                        return;
                    }

                    fabWidget.moveTo(_endIndex);
                    var widgetObjs = subLayerNode.getObjects();
                    _.forEach(currentSubLayer.widgets, function (_widget) {
                        for (var i=0;i<widgetObjs.length;i++){
                            if (widgetObjs[i].id == _widget.id){
                                _widget.zIndex = i;
                                break;
                            }
                        }
                    });
                }else if(object.type==Type.MySubLayer){
                    var currentLayer = getCurrentLayer();
                    var subLayers = currentLayer.subLayers;
                    currentLayer.showSubLayer=subLayers[0];
                }else{
                    //无匹配返回
                    return
                }
                _cb&&_cb(currentOperate);
            };

            this.ChangeAttributeSize= function (_option, _successCallback) {
                var currentOperate=SaveCurrentOperate();
                var object=getCurrentSelectObject();

                if (object.type==Type.MyLayer) {

                    var pageNode = CanvasService.getPageNode();
                    var fabLayer = null;
                    var currentLayer = getCurrentLayer();
                    _.forEach(pageNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabLayer = _fabObj;
                        }
                    });
                    if (!fabLayer) {
                        console.warn('找不到Layer');
                        alertErr()
                        return;
                    }
                    var currentPage = _self.getCurrentPage();
                    if (_option.width) {
                        //fabLayer.setScaleX(_option.width / fabLayer.width);
                        fabLayer.set({width:_option.width,scaleX:1});
                        currentLayer.info.width = _option.width;
                    }
                    if (_option.height) {
                        //fabLayer.setScaleY(_option.height / fabLayer.height);
                        fabLayer.set({height:_option.height,scaleY:1});
                        currentLayer.info.height = _option.height;
                    }

                    //for fix scale bug!!!
                    object.target.fire('OnRelease',object.target.id);

                    //calculate new page border
                    this.calculateCurrentSizeToSurroundLayers()
                    //update border
                    this.updateOutBorder();
                    _self.ScaleCanvas('page');

                    pageNode.renderAll();
                    // currentPage.proJsonStr = JSON.stringify(pageNode.toJSON());
                    //console.log(currentPage.proJsonStr);

                    var layer = getCurrentLayer();
                    _self.OnLayerSelected(layer, function () {
                        _successCallback && _successCallback(currentOperate);

                    });
                }else if (Type.isWidget(object.type)) {
                    var subLayerNode = CanvasService.getSubLayerNode();
                    var fabWidget = null;
                    var currentSubLayer = getCurrentSubLayer();
                    var currentWidget = getCurrentWidget(currentSubLayer);
                    _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                        if (_fabObj.id == object.target.id) {
                            fabWidget = _fabObj;
                        }
                    });
                    if (!fabWidget) {
                        console.warn('找不到Widget');
                        alertErr()
                        return;
                    }
                    if (_option.width) {
                        //fabWidget.setScaleX(_option.width / fabWidget.width);
                        fabWidget.set({width:_option.width,scaleX:1});
                        currentWidget.info.width = _option.width;
                    }
                    if (_option.height) {
                        //fabWidget.setScaleY(_option.height / fabWidget.height);
                        fabWidget.set({height:_option.height,scaleY:1});
                        currentWidget.info.height = _option.height;
                    }
                    
                    var arg={
                        posRotatePointX:Math.round(currentWidget.info.width/2),
                        posRotatePointY:Math.round(currentWidget.info.height/2),
                        // scaleX:fabDashboardObj.getScaleX(),
                        // scaleY:fabDashboardObj.getScaleY(),
                        callback:function(){
                            OnWidgetSelected(currentWidget, function () {
                                _successCallback && _successCallback(currentOperate);
        
                            });
                        }
                    }
                    switch(object.type){
                        case Type.MyDashboard:
                            object.level.info.posRotatePointX = arg.posRotatePointX
                            object.level.info.posRotatePointY = arg.posRotatePointY
                            object.target.fire('changeDashboardPointerOffset',arg);
                        break
                        case Type.MyRotateImg:
                            object.level.info.posRotatePointX = arg.posRotatePointX
                            object.level.info.posRotatePointY = arg.posRotatePointY
                            object.target.fire('changeRotateImgPointerOffset',arg);
                        break
                        default:
                            subLayerNode.renderAll();

                            // currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                            OnWidgetSelected(currentWidget, function () {
                                _successCallback && _successCallback(currentOperate);
        
                            });
                    }

                    
                }


            };

            /**
             * 次要操作
             * 按照名字搜索一个对象
             * @param _nameString   名字
             * @param _successCallback  回调
             * @constructor
             */
            this.SearchObjectByName= function (_nameString, _successCallback) {
                var resultList=[];
                _.forEach(project.pages, function (_page) {
                    if (_page.name==_nameString){
                        resultList.push({
                            id:_page.id,
                            type:Type.MyPage
                        });
                    }
                    _.forEach(_page.layers, function (_layer) {
                        if (_layer.name==_nameString){
                            resultList.push({
                                id:_layer.id,
                                type:Type.MyLayer
                            });
                        }
                        _.forEach(_layer.subLayers, function (_subLayer) {
                            if (_subLayer.name==_nameString){
                                resultList.push({
                                    id:_subLayer.id,
                                    type:Type.MySubLayer
                                });
                            }
                            _.forEach(_subLayer.widgets, function (_widget) {
                                if (_widget.name==_nameString){
                                    resultList.push({
                                        id:_widget.id,
                                        type:_widget.type
                                    });
                                }
                            });
                        });
                    });

                });

                _successCallback(resultList);
            };

            /**
             * 次要操作
             * 从搜索结果中选中
             * @param _result   需要选中的resultList中的item
             * @param _successCallback  回调
             * @constructor
             */
            this.SelectInSearchResults= function (_result, _successCallback) {
                if (!_result){
                    console.warn('无效的参数');
                    return;
                }

                //如果在当前Page内部搜索,则不必先切换Page
                var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
                _.forEach(project.pages, function (_page,_pageIndex) {
                    if (_page.id==_result.id&&_result.type==Type.MyPage){
                        _self.changeCurrentPageIndex(_pageIndex,_successCallback);
                        return;
                    }
                    _.forEach(_page.layers, function (_layer, _layerIndex) {
                        if (_layer.id==_result.id&&_result.type==Type.MyLayer){
                            if (currentPageIndex==_pageIndex){
                                _self.OnLayerSelected(_layer,_successCallback,true);

                            }else {
                                _self.changeCurrentPageIndex(_pageIndex, function () {
                                    _self.OnLayerSelected(_layer,_successCallback,true);
                                })
                            }

                            return;
                        }
                        _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {


                            if (_subLayer.id==_result.id&&_result.type==Type.MySubLayer){
                                if (currentPageIndex==_pageIndex){
                                    _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);

                                }else {
                                    _self.changeCurrentPageIndex(_pageIndex, function () {
                                        _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);
                                    });
                                }

                                return;

                            }
                            _.forEach(_subLayer.widgets, function (_widget) {
                                if (_widget.id==_result.id&&Type.isWidget(_result.type)){
                                    if (currentPageIndex==_pageIndex){
                                        _self.OnSubLayerSelected(_layerIndex,_subLayerIndex, function () {
                                            _self.OnWidgetSelected(_widget,_successCallback,true);

                                        },true);


                                    }else {
                                        _self.changeCurrentPageIndex(_pageIndex, function () {
                                            _self.OnSubLayerSelected(_layerIndex,_subLayerIndex, function () {
                                                _self.OnWidgetSelected(_widget,_successCallback,true);

                                            },true);
                                        })
                                    }
                                }


                                return;
                            })
                        })

                    })
                })
            };

            this.calculatePanWithCurrentSize = function(currentSize,initSize){
                var pan =  {
                    x:parseInt((initSize.width - currentSize.width)/2),
                    y:parseInt((initSize.height - currentSize.height)/2)
                }
                // console.log(pan)
                return pan
            }

            /**
             * 缩放画布
             * @param _scaleMode 模式 'page' or 'subCanvas'
             * @constructor
             */
            this.ScaleCanvas= function (_scaleMode,_level) {
                var currentPage=_self.getCurrentPage();
                var _scale=1;
                if (_scaleMode=='page'){
                    var pageNode=CanvasService.getPageNode();
                    _scale=ViewService.getScaleFloat('page');
                    pageNode.setZoom(_scale);
                    if(!currentPage.currentSize){
                        currentPage.currentSize = {
                            width:project.initSize.width,
                            height:project.initSize.height
                        }
                    }
                    // console.log('scale',currentPage.currentSize.width,currentPage.currentSize.height)
                    pageNode.setWidth(currentPage.currentSize.width*_scale);
                    pageNode.setHeight(currentPage.currentSize.height*_scale);
                    //move viewPoint make current center at init center
                    pageNode.absolutePan(_self.calculatePanWithCurrentSize(currentPage.currentSize,project.initSize))

                }else if (_scaleMode=='subCanvas'){
                    var currentLayer=_level?_level:_self.getCurrentLayer();
                    var subLayerNode=CanvasService.getSubLayerNode();
                    _scale=ViewService.getScaleFloat('subCanvas');

                    drawBackgroundCanvas(currentLayer.info.width,currentLayer.info.height,currentLayer.info.left,currentLayer.info.top,_scale);
                    subLayerNode.setZoom(_scale);

                    subLayerNode.setWidth(currentLayer.info.width*_scale);
                    subLayerNode.setHeight(currentLayer.info.height*_scale);

                }else {
                    console.warn('传参有问题');
                }
            }



            /**
             * 清除page的HashKeys
             * @private
             */
            function _cleanPageHashKey() {
                _.forEach(project.pages, function (_page) {
                    _page.$$hashKey = undefined;
                })
            }

            /**
             * 生成一个给定fabric.Group的最新体
             * @param oldFabGroup   旧的fabric group
             * @param is
             * @private
             */
            function _createGroup(oldFabGroup,isSubLayer){
                if(!oldFabGroup||oldFabGroup.type!=Type.MyGroup){
                    console.warn('传参不对');
                    return;
                }
                var canvasNode=null;
                if(!isSubLayer){
                    canvasNode=CanvasService.getPageNode();
                }else{
                    canvasNode=CanvasService.getSubLayerNode();
                }
                var groupItems=[];
                canvasNode.forEachObject(function (fabItem) {
                    _.forEach(oldFabGroup.getObjects(), function (_fabLayer) {
                        if (_fabLayer.id==fabItem.id){
                            groupItems.push(fabItem);

                        }
                    })
                })
                if (groupItems.length==oldFabGroup.getObjects().length){
                    var fabGroup=new fabric.Group(groupItems,{
                        canvas:canvasNode
                    });
                    return fabGroup;

                }else {
                    return oldFabGroup;
                }

            }

            /**
             * 辅助函数
             * 从subLayer模式返回Page模式
             * @param currentPage
             * @param _successCallback
             * @private
             */
            var _backToPage= function (currentPage,_successCallback) {
                var currentSubLayer=getCurrentSubLayer();
                var pageNode=CanvasService.getPageNode();

                // if (currentSubLayer){
                //     currentSubLayer.proJsonStr=JSON.stringify(CanvasService.getSubLayerNode().toJSON());
                // }

                //-
                // pageNode.setBackgroundImage(null, function () {
                //     pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                //         if (currentPage.mode==1){
                //             _leaveFromSubLayer(currentSubLayer,_successCallback);
                //         }else {
                //             _successCallback&&_successCallback();
                //         }
                //
                //
                //     });
                //     //console.log('pageNode',pageNode);
                // });

                //+ 离开page之前，更新layer的backgroundImage
                if(currentPage.mode===1){
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.deactivateAll();
                    subLayerNode.renderAll();
                    currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                }
                _drawCanvasNode(currentPage,pageNode,function(){
                    //-
                    if (currentPage.mode==1){
                        _leaveFromSubLayer(currentSubLayer,_successCallback);
                    }else {
                        _successCallback&&_successCallback();
                    }

                })
            };


            var _indexById= function (_array, _item) {
                var index=-1;
                if (!_array){
                    return index;
                }
                if(!_item){
                    console.log(_item)
                    throw Error('_item is null')
                }
                _.forEach(_array, function (__item,_index) {
                    if (__item.id==_item.id){
                        index=_index;
                    }
                })
                return index;
            }

            /**
             * 辅助函数，用来更新layer在page上的显示图片
             * 当离开当前SubLayer触发
             * @param _successCallback
             * @private
             */
            var _leaveFromSubLayer = function (currentSubLayer, _successCallback) {
                if (!currentSubLayer){
                    console.warn('找不到SubLayer');
                    alertErr();
                    return;
                }

                var subLayerNode=CanvasService.getSubLayerNode();
                var pageNode=CanvasService.getPageNode();

                subLayerNode.deactivateAll();
                subLayerNode.renderAll();

                // currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                //-
                var pageNodeObjs = pageNode.getObjects();
                var totalNum = pageNodeObjs.length;
                if (totalNum > 0) {
                    var cb = function () {
                        totalNum -= 1;
                        if (totalNum <= 0) {
                            _successCallback && _successCallback();
                        }
                    }.bind(this);
                    _.forEach(pageNodeObjs, function (_fabLayer) {
                        _fabLayer.fire('OnRenderUrl', cb);
                    }.bind(this));
                } else {
                    _successCallback && _successCallback();
                }
            };

            function belongToGroup(_obj,_target){
                var result=false;
                if (_target.type!='group'){
                    return result;
                }
                _.forEach(_target.getObjects(), function (_item) {
                    if (_item.id==_obj.id){
                        result=true;
                    }
                });
                return result;
            }

            var setRendering = this.setRendering;
            var getCurrentSubLayer=this.getCurrentSubLayer;

            var OnPageClicked=this.OnPageClicked;
            var OnSubLayerClicked=this.OnSubLayerClicked;
            var SaveCurrentOperate=this.SaveCurrentOperate;


            /**
             * 用于求渐变色
             * @param initColor
             * @param endColor
             * @param value
             */
            function changeColor(initColor,endColor,progressValue){
                var initColorArr = initColor.slice(5,initColor.length-1).split(','),
                    endColorArr = endColor.slice(5,endColor.length-1).split(',');
                var initColorR = parseInt(initColorArr[0]),
                    initColorG = parseInt(initColorArr[1]),
                    initColorB = parseInt(initColorArr[2]),
                    initColorA = parseInt(initColorArr[3]),
                    endColorR = parseInt(endColorArr[0]),
                    endColorG = parseInt(endColorArr[1]),
                    endColorB = parseInt(endColorArr[2]),
                    endColorA = parseInt(endColorArr[3]);

                var progressColorR = parseInt(initColorR+(endColorR-initColorR)*progressValue),
                    progressColorG = parseInt(initColorG+(endColorG-initColorG)*progressValue),
                    progressColorB = parseInt(initColorB+(endColorB-initColorB)*progressValue),
                    progressColorA = 1;

                return  'rgba('+progressColorR+','+progressColorG+','+progressColorB+','+progressColorA+')';

            }

            /**
             * get image name(id)
             * @param imageName
             * @returns {*}
             */
            function getImageName(imageName) {
                if (imageName && typeof imageName === 'string') {
                    var names = imageName.split('/');
                    return names[names.length - 1];
                } else {
                    return '';
                }
            }



            /**
             * 进入sublayer后，背景为page的透视,在backgroundCanvas上画出page的透视。
             * @param width
             * @param height
             */
            function drawBackgroundCanvas(width,height,x,y,scale){
                var _scale = scale||1;
                var _width = parseInt(width*_scale);
                var _height = parseInt(height*_scale);
                var currentPage = _self.getCurrentPage();

                var pageColor = currentPage.backgroundColor||'rgba(191,191,191,0.3)';
                var pageBackgroundImgSrc = currentPage.backgroundImage||"";
                var pageWidth = (project.initSize&&project.initSize.width)||1280;
                var pageHeight = (project.initSize&&project.initSize.height)||480;

                var backgroundCanvas=document.getElementById('backgroundCanvas');
                backgroundCanvas.width=_width;
                backgroundCanvas.height=_height;
                var ctx=backgroundCanvas.getContext('2d');
                //add by tang
                if(currentPage.matte&&currentPage.matte.info.backgroundImg){
                    var matteImgSrc=currentPage.matte.info.backgroundImg;
                    var matteColor=currentPage.matte.info.backgroundColor;
                    var matteOpacity=currentPage.matte.info.opacity/100;
                    var matteImg=ResourceService.getResourceFromCache(matteImgSrc);
                    var matteX = parseInt(matteImg.width/pageWidth*x);
                    var matteY = parseInt(matteImg.height/pageHeight*y);
                    var matteWidth =parseInt(matteImg.width/pageWidth*width);
                    var matteHeight =parseInt(matteImg.height/pageHeight*height)
                }

                if(pageBackgroundImgSrc!=""&&pageBackgroundImgSrc!="/public/images/blank.png"){
                    var pageBackgroundImg = ResourceService.getResourceFromCache(pageBackgroundImgSrc);
                    var sourceX = parseInt(pageBackgroundImg.width/pageWidth*x);
                    var sourceY = parseInt(pageBackgroundImg.height/pageHeight*y);
                    var sourceWidth =parseInt(pageBackgroundImg.width/pageWidth*width);
                    var sourceHeight =parseInt(pageBackgroundImg.height/pageHeight*height);
                    ctx.beginPath();
                    ctx.drawImage(pageBackgroundImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,_width,_height);
                    ctx.closePath();

                    //draw matte  add by tang
                    if(currentPage.matte&&currentPage.matte.matteOn&&currentPage.matte.info.backgroundImg){
                        drawSubLayerMatte(ctx,matteX,matteY,matteWidth,matteHeight,_width,_height,matteImg,matteColor,matteOpacity);
                    }
                }else{
                    ctx.beginPath();
                    ctx.rect(0,0,_width,_height);
                    ctx.fillStyle=pageColor;
                    ctx.fill();
                    ctx.closePath();

                    if(currentPage.matte&&currentPage.matte.matteOn&&currentPage.matte.info.backgroundImg){
                        drawSubLayerMatte(ctx,matteX,matteY,matteWidth,matteHeight,_width,_height,matteImg,matteColor,matteOpacity);
                    }
                }
            }
            /**
             * 绘制在subLayer上的蒙板
             * @author tang
             */
            function drawSubLayerMatte(ctx,matteX,matteY,matteWidth,matteHeight,_width,_height,matteImg,matteColor,matteOpacity){
                try{
                    ctx.beginPath();
                    ctx.globalAlpha=matteOpacity;
                    ctx.drawImage(matteImg,matteX,matteY,matteWidth,matteHeight,0,0,_width,_height);
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.globalAlpha=matteOpacity;
                    ctx.rect(0,0,_width,_height);
                    ctx.fillStyle=matteColor;
                    ctx.fill();
                    ctx.closePath();
                }
                catch(err){
                    console.log("绘制matte错误")
                }
            }

            /**
             * to resize widget
             * @param self
             */
            function setWidthAndHeight(self){
                var w = parseInt((self.width*self.scaleX).toFixed(0)),
                    h = parseInt((self.height*self.scaleY).toFixed(0));
                self.set({
                    'height' :h,
                    'width'  :w,
                    'scaleX'  :1,
                    'scaleY'  :1,
                });

            }

            /**
             * to reset top and left
             * @param self
             */
            function setTopAndLeft(self){
                var t = parseInt(self.top);
                var l = parseInt(self.left);
                var selectObj=_self.getCurrentSelectObject();
                selectObj.level.info.top=t;
                selectObj.level.info.left=l;
                self.set({
                    top:t,
                    left:l
                })

            }

            /**
             * edit in 2017/9/18 by lixiang
             * 刷新一个Canvas节点，重新绘制展示的page或者layer,不重新渲染
             * @param node canvas节点
             * @param data 数据
             * @param _cb
             */
            function _drawCanvasNode(data,node,_cb){
                var type = data.type,
                    layers,
                    widgets;
                //clear node
                node.clear();

                //add obj then render node
                switch(type){
                    case Type.MyPage:
                        layers = data.layers;
                        if(layers){
                            layers.map(function(layer,index){
                                _addFabricObjInCanvasNode(layer,node);
                            });
                            _cb&&_cb();
                        }

                        //draw matte -->add by tang
                        if(data.matte){
                            if(data.matte.matteOn){
                                _addMatteInCanvasNode(data.matte)
                            }
                        }

                        //draw outborder
                        addOutBorder()

                        break;
                    case Type.MySubLayer:
                        widgets = data.widgets;
                        if(widgets){
                            widgets.map(function(widget,index){
                               _addFabricObjInCanvasNode(widget,node);
                            });
                            _cb&&_cb();
                        }
                        break;
                    default:
                        console.error('not match data type when refreash Canvas');
                        break
                }
            }

            /**
             * eidt 2017/9/18 by lixiang
             *
             * 将fabric对象添加到Canvas
             * 1、将layer添加到pageNode。2、将widget添加到subLayerNode。
             * @param dataStructure 数据机构
             * @param node canvas节点
             * @param _successCallback 回调函数
             * @private
             */
            function _addFabricObjInCanvasNode(dataStructure,node,_cb){
                var initiator = {
                    width: dataStructure.info.width,
                    height: dataStructure.info.height,
                    top: dataStructure.info.top,
                    left: dataStructure.info.left,
                    id: dataStructure.id,
                    lockScalingFlip:true,
                    hasRotatingPoint:false,
                    shadow:{
                        color:'rgba(0,0,0,0.4)',blur:2
                    }
                };
                var addFabWidget = function(fabWidget){
                    node.add(fabWidget);
                };

                switch (dataStructure.type){
                    case 'MySlide':
                        fabric.MySlide.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyProgress':
                        fabric.MyProgress.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyDashboard':
                        fabric.MyDashboard.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyButton':
                        fabric.MyButton.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyButtonGroup':
                        fabric.MyButtonGroup.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyNumber':
                        fabric.MyNumber.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyTextArea':
                        fabric.MyTextArea.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyKnob':
                        fabric.MyKnob.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MySlideBlock':
                        fabric.MySlideBlock.fromLevel(dataStructure,addFabWidget,initiator);
                        break;
                    case 'MyOscilloscope':
                        fabric.MyOscilloscope.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MySwitch':
                        fabric.MySwitch.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyRotateImg':
                        fabric.MyRotateImg.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyDateTime':
                        fabric.MyDateTime.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyScriptTrigger':
                        fabric.MyScriptTrigger.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyVideo':
                        fabric.MyVideo.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyAnimation':
                        fabric.MyAnimation.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyLayer':
                        fabric.MyLayer.fromLevel(dataStructure,addFabWidget,initiator);
                        // node.add(new fabric.MyLayer(dataStructure,initiator));
                        break;
                    case 'MyNum':
                        node.add(new fabric.MyNum(dataStructure,initiator));
                        break;
                    case 'MyTexNum':
                        node.add(new fabric.MyTexNum(dataStructure,initiator));
                        break;
                    case 'MyTexTime':
                        node.add(new fabric.MyTexTime(dataStructure,initiator));
                        break;
                    case 'MyTouchTrack':
                        fabric.MyTouchTrack.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    case 'MyAlphaImg':
                        fabric.MyAlphaImg.fromLevel(dataStructure, addFabWidget, initiator);
                        break;
                    default :
                        //console.error('not match widget in _addFabricObjInCanvasNode!');
                        if (dataStructure.type in fabric){
                            fabric[dataStructure.type].fromLevel(dataStructure, addFabWidget, initiator);
                        }
                        
                        
                }
                _cb&&_cb();
            }

            /**
             * add by tang
             * 将蒙板对象添加到Canvas
             * @param matteData 蒙板数据
             * @private
             */
            function _addMatteInCanvasNode(matteData){
                _self.addMatte(matteData);
            }




            /**
             * input内容有效性验证
             *
             * @param dataString 要验证的数据
             * @return
             * true：input有效
             * false：input无效
             * @public
             * @author 2017/10/18 by LH
             */
            this.inputValidate=function(dataString){
                //是否为空
                if (dataString.match(/^$|^\s+$/)){
                    toastr.error('名称不能为空');
                    return false;
                }//是否大于30个字
                if(dataString.length>30){
                    toastr.error('长度不能大于30个字');
                    return false;
                }
                //是否含有非法字符
                if (dataString.match(/[^\d|A-Z|a-z|\u4E00-\u9FFF|_|\-|—]/)){
                    toastr.error('名称和作者只能包含：汉字、英文、数字、下划线_、英文破折号-、中文破折号—');
                    return false;
                }
                return true;

            }

            /**
             * resource内容有效性验证
             *
             * @param dataString 要验证的数据
             * @return
             * true：input有效
             * false：input无效
             * @public
             * @author 2017/10/18 by LH
             */
            this.resourceValidate=function(dataString){
                //是否为空
                if (dataString.match(/^$|^\s+$/)){
                    toastr.error('名称不能为空');
                    return false;
                }//是否大于225个字
                if(dataString.length>30){
                    toastr.error('长度不能大于225个字');
                    return false;
                }
                //是否含有非法字符
                if (dataString.match(/<|>|\/|\\|\||:|"|\*|\?/)){
                    toastr.error('文件名不能包含下列任何字符之一：< > / \\ | : " * ?');
                    return false;
                }
                return true;

            };

            //add OutBorder

            function addOutBorder(borderData){

                var pageNode = CanvasService.getPageNode();
                
                var currentPage=_self.getCurrentPage();

                if(!currentPage.currentSize){
                    currentPage.currentSize = {
                        width:project.initSize.width,
                        height:project.initSize.height
                    }
                }
                var pan = _self.calculatePanWithCurrentSize(currentPage.currentSize,project.initSize)
                var outBorder=new fabric.MyOutBorder({
                    width:currentPage.currentSize.width,
                    height:currentPage.currentSize.height,
                    left:pan.x,
                    top:pan.y,
                    currentSize:currentPage.currentSize,
                    initSize:project.initSize
                });
                pageNode.add(outBorder);
                outBorder.moveTo(pageNode,0);
                pageNode.renderAll.bind(pageNode)();

                
                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                
            }

            /**
             * 模具框
             * @return maskStyle
             * @author add by tang
             */
            this.initMaskAttr=function(){
                var mask=project.mask;
                var maskStyle={};

                if(mask){
                    maskStyle={
                        "width":mask.width,
                        "height":mask.height,
                        "top":mask.top,
                        "left":mask.left,
                        "name":mask.name,
                        "src":mask.src
                    }
                }else{
                    maskStyle={
                        "width":800,
                        "height":480,
                        "top":0,
                        "left":0,
                        "name":'模具框',
                        "src":""
                    }
                }
                return maskStyle;
            };

            /**
             * @name 蒙板
             * 说明：定义蒙板的zIndex在page最底层,介于背景图之上，layer层之下。
             * 开启:addMatte，关闭:offMate。若page存在matte属性则按属性生成，若无则添加默认模板。
             * 修改蒙板 背景图:changeMatteBgi、颜色:changeMatteBgc、透明度:changeMatteOpacity。
             * changeMatteAttr：操作完成后通知
             * @author tang
             */

            this.addMatte=function (matteData){
                var defaultMatte = TemplateProvider.getDefaultMatte();
                var pageNode = CanvasService.getPageNode();
                var object=getCurrentSelectObject();
                var currentPage=_self.getCurrentPage();

                var initiator="",matteInfo="";
                if(matteData){
                    matteData.matteOn=true;
                    matteInfo=matteData;
                    initiator={
                        width:project.initSize.width,
                        height:project.initSize.height,
                        top:matteData.info.top,
                        left:matteData.info.left,
                        backgroundImg:matteData.info.backgroundImg,
                        opacity:matteData.info.opacity,
                        backgroundColor:matteData.info.backgroundColor
                    };
                }else{
                    defaultMatte.matteOn=true;
                    matteInfo=defaultMatte;
                    initiator={
                        width:defaultMatte.info.width,
                        height:defaultMatte.info.height,
                        top:defaultMatte.info.top,
                        left:defaultMatte.info.left,
                        backgroundImg:defaultMatte.info.backgroundImg,
                        opacity:defaultMatte.info.opacity,
                        backgroundColor:defaultMatte.info.backgroundColor
                    }
                }

                var matte=new fabric.MyMatte(initiator);
                pageNode.add(matte);
                matte.moveTo(pageNode,0);
                pageNode.renderAll.bind(pageNode)();

                object.level.matte=matteInfo;
                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                changeMatteAttr();
            };

            this.offMatte=function(){
                var object=getCurrentSelectObject();
                var pageNode = CanvasService.getPageNode();
                var matteNode = getMatteNode();
                var currentPage=_self.getCurrentPage();
                pageNode.remove(matteNode);

                object.level.matte.matteOn=false;
                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                changeMatteAttr();
            };

            this.changeMatteBgi=function(img){
                var matte=getMatteNode();
                var object=getCurrentSelectObject();

                matte.fire('changeBgi',img);
                object.level.matte.info.backgroundImg=img;

                changeMatteAttr();
            };

            this.changeMatteOpacity=function(op){
                var matte=getMatteNode();
                var object=getCurrentSelectObject();

                matte.fire('changeOpacity',op);
                object.level.matte.info.opacity=op;

                changeMatteAttr();
            };

            this.changeMatteBgc=function(co){
                var matte=getMatteNode();
                var object=getCurrentSelectObject();

                matte.fire('changeBgc',co);
                object.level.matte.info.backgroundColor=co;
                changeMatteAttr();
            };

            var getMatteNode=this.getMatteNode=function(){
                var pageNode=CanvasService.getPageNode();
                var matteNode=pageNode.getObjects('MyMatte')[0];
                if(matteNode){
                    return matteNode;
                }else{
                    console.log('matte错误')
                }
            };

            //更改matte属性时通知attr属性面板区
            this.setScope=function(scope){
                this.attrScope=scope;
            };
            function changeMatteAttr(){
                _self.attrScope.$emit('ChangeMatte');
            }


            /**
             * 表格空控件相关方法
             */

            this.changeGridBorderColor = function (color,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var level = selectObj.level;
                level.info.borderColor = color;
                var arg={
                    level:level,
                    callback:_successCallback
                };
                selectObj.target.fire('changeBorderColor',arg);
            };

            this.changeGridCellNum = function(option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var level = selectObj.level;
                var cellInfo = TemplateProvider.calcGridCell(option.row,option.col,option.border);
                //console.log(cellInfo);

                level.info.row = option.row;
                level.info.col = option.col;
                level.info.width = cellInfo.width;
                level.info.height = cellInfo.height;
                level.info.cellWidth = cellInfo.cellWidth;
                level.info.cellHeight = cellInfo.cellHeight;
                //console.log(level);

                var arg={
                    level:level,
                    callback:_successCallback
                };
                selectObj.target.fire('changeCellNum',arg);
            };

            this.changeGridCellSize = function(option,_successCallback){
                var selectObj=_self.getCurrentSelectObject();
                var level = selectObj.level;

                var calWidth = level.info.border;
                if (option.cellWidth) {
                    for (var i = 0; i < option.cellWidth.length;i++){
                        calWidth += option.cellWidth[i].width;
                    }
                    level.info.width = calWidth;
                    level.info.cellWidth = option.cellWidth;
                }

                var calHeight = level.info.border;
                if (option.cellHeight) {
                    for (var i = 0; i < option.cellHeight.length;i++){
                        calHeight += option.cellHeight[i].height;
                    }
                    level.info.height = calHeight;
                    level.info.cellHeight = option.cellHeight;
                }

                var arg={
                    level:level,
                    callback:_successCallback
                };
                selectObj.target.fire('changeCellSize',arg);
            };

            this.changeGridCellBorder = function (option,_successCallback) {
                var selectObj=_self.getCurrentSelectObject();
                var level = selectObj.level;

                level.info.width = level.info.width - level.info.border + option.border;
                level.info.height = level.info.height - level.info.border + option.border;
                level.info.border = option.border;

                var arg={
                    level:level,
                    callback:_successCallback
                };
                selectObj.target.fire('changeCellBorder',arg);
            }
        }]);