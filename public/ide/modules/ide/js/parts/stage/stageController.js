
    ide.controller('StageCtrl', ['$scope','$timeout','$interval',
        'ProjectService',
        'CanvasService',
        'Preference',
        'Type',
        'KeydownService',
        'OperateQueService',function ($scope,$timeout,$interval,
                                          ProjectService,
                                          CanvasService,
                                          Preference,
                                          Type,
                                          KeydownService,
                                          OperateQueService) {


        initUserInterface();

        //edit by lixiang 初始化offCanvas
        initOffCanvas();

        $scope.$on('GlobalProjectReceived', function () {
            initProject();
            $scope.$emit('LoadUp');

        });

        function initOffCanvas(){
            CanvasService.setOffCanvas(document.getElementById('offCanvas'))
        }


        function initUserInterface(){
            //console.log('initing stage contrller')
            $scope.component={
                out:{
                    toolShow:false
                },
                canvas:{
                    node:null,
                    currentWidth:0,
                    currentHeight:0,
                    holdOperate:null,

                },
                subCanvas:{
                    node:null,
                    currentWidth:0,
                    currentHeight:0,
                    holdOperate:null,
                },
                // scaleSlider:{
                //     Slider:null,
                //     scale:1,
                //     reSetScale:reSetScale,
                //     refreshScaleSlider:refreshScaleSlider
                // },
                menuOptions:{
                    contextMenu:null,
                    allMenuItems:[]
                }

            };
            // $scope.component.scaleSlider.Slider = new Slider("scale-slider", "scale-gauge", {
            //     onMin: function(){  },
            //     onMax: function(){  },
            //     onMid: function(){  },
            //     onMove: $scope.component.scaleSlider.refreshScaleSlider
            // });

            $scope.status={
                gesture:'release',
                holdOperate:null,
                editPage:true
            };

            $scope.component.canvas.node=new fabric.Canvas('c');

            $scope.component.subCanvas.node=new fabric.Canvas('c1',{renderOnAddRemove: false });

            var pageNode=$scope.component.canvas.node;
            CanvasService.setPageNode(pageNode);
            var subLayerNode=$scope.component.subCanvas.node;
            CanvasService.setSubLayerNode(subLayerNode);

        }


        function initProject(){

            ProjectService.getProjectTo($scope);

            $scope.component.menuOptions.allMenuItems=[
                ['上移一层', function () {
                    changeZIndex(0);
                }],
                null,
                ['下移一层', function () {
                    changeZIndex(1);
                }],
                null,
                ['移至顶层',function () {
                    changeZIndex('front');
                }],
                null,
                ['移至底层',function () {
                    changeZIndex('back');
                }]

            ];
            $scope.component.menuOptions.contextMenu=getContextMenu;

            $scope.component.canvas.node.on({
                'object:selected':selectLayer,
                'object:moving': holdLayer,
                'object:scaling':scaleLayer,
                'object:rotating':holdLayer,
                'mouse:down':onPageMouseDown,
                'mouse:up': releaseLayer,
                'selection:cleared':onSelectionLayerCleared,

            });

            $scope.component.subCanvas.node.on({
                'object:selected':selectWidget,
                'object:moving': holdWidget,
                'object:scaling':holdWidget,
                'object:rotating':holdWidget,
                'mouse:down':onSubLayerMouseDown,
                'mouse:up': releaseWidget,
                'selection:cleared':onSelectionWidgetCleared,
            })



            //reSetScale();

            //initCurrentPage();

            $scope.$on('CurrentPageChanged', function (event,operate,callback) {

                renderAllCanvases(operate,callback);
            });

            $scope.$on('CanvasScaleChanged', function (_event,scaleMode) {
                changeCanvasScale({scaleMode:scaleMode});
            })
            $scope.$on('CurrentSubLayerChanged', function (event, operate, callback) {
                renderAllCanvases(operate,callback)
            })
            $scope.$on('ToolShowChanged', function (event, toolShow) {
                $scope.component.out.toolShow=toolShow;
            });
            $scope.$on('PageChangedSwitched', function (event,operate,callback) {
                renderAllCanvases(operate,callback);
            });
            $scope.$on('NewPageAdded', function (event, operate, callback) {
                renderAllCanvases(operate,callback);

            });

            $scope.$on('OperateQueChanged', function (event, operate, callback) {
                renderAllCanvases(operate,callback);
            })

            $scope.$on('SubLayerEntered', function (event) {
                toastr.info('显示子图层');
                renderAllCanvases();

            })


        }


        /**
         * 重置缩放条至初始位置
         */
        function reSetScale(){
            $scope.component.scaleSlider.Slider.SetValue(50);
            $scope.component.scaleSlider.scale= Math.floor($scope.component.scaleSlider.Slider.GetValue())/50;

            var pageNode=$scope.component.canvas.node;
            pageNode.setWidth($scope.project.width);
            pageNode.setHeight($scope.project.height);
            pageNode.zoomToPoint(new fabric.Point(0, 0), 1);

            pageNode.renderAll();

        }


        /**
         * 同步缩放条
         */
        // function refreshScaleSlider(){
        //     $timeout(function() {
        //         // anything you want can go here and will safely be run on the next digest.
        //
        //         $scope.component.scaleSlider.scale= Math.floor($scope.component.scaleSlider.Slider.GetValue())/50;
        //
        //         var pageNode=$scope.component.canvas.node;
        //         if ($scope.component.scaleSlider.Slider.GetPercent()!=0){
        //             var width=$scope.component.scaleSlider.Slider.GetPercent()*2*$scope.project.width;
        //             var height=$scope.component.scaleSlider.Slider.GetPercent()*2*$scope.project.height;
        //             pageNode.zoomToPoint(new fabric.Point(0, 0),
        //                 $scope.component.scaleSlider.Slider.GetPercent()*2);
        //
        //             pageNode.setWidth(width);
        //             pageNode.setHeight(height);
        //
        //             pageNode.renderAll();
        //
        //
        //         }
        //
        //     });
        //
        //
        //
        //
        //
        // };

        function renderAllCanvases(oldOperate,callback){
            var canvasNode;
            if (ProjectService.isEditingPage()){
                canvasNode=$scope.component.canvas.node;

                // $timeout(function(){
                //     $scope.status.editPage=true;
                // });

                $scope.status.editPage=true;
            }else {
                canvasNode=$scope.component.subCanvas.node;
                // $timeout(function(){
                //     $scope.status.editPage=false;
                // });
                $scope.status.editPage=false;
            }

            //canvasNode.renderAll.bind(canvasNode)();

            if (oldOperate){
                var nowOperate=ProjectService.SaveCurrentOperate();
                var operates={
                    undoOperate:oldOperate,
                    redoOperate:nowOperate
                };


                OperateQueService.pushNewOperate(operates)
            }
            //ProjectService.UpdateCurrentThumb(function () {
            //    ProjectService.setRendering(false);
            //});
            ProjectService.setRendering(false);

            callback&&callback();
        }

        function getContextMenu(){
            var selectObj=ProjectService.getCurrentSelectObject();
            if (selectObj.type==Type.MyLayer||Type.isWidget(selectObj.type)){
                return $scope.component.menuOptions.allMenuItems;
            }
            return [];
        }
        function onSelectionLayerCleared(e){

            //如果按住Ctrl,则不能响应清空选择的Layer
            if(KeydownService.isCtrlPressed()){
                return;
            }


            ProjectService.layerClickPop=0;


            var pageIndex=-1;

            //console.log('pages',$scope.project.pages);
            _.forEach($scope.project.pages,function(page,index){
                if (page.id==ProjectService.getCurrentPage().id){
                    pageIndex=index;
                }
            });
            if (pageIndex<0){
                console.warn('找不到Page');
                return;
            }
            ProjectService.OnPageClicked(pageIndex,function () {
                $scope.$emit('ChangeCurrentPage')
            });
        }
        function onSelectionWidgetCleared(){

            //如果按住Ctrl,则不能响应清空选择的Widget
            if(KeydownService.isCtrlPressed()){
                return;
            }
            var currentPage=ProjectService.getCurrentPage();

            _.forEach(currentPage.layers, function (_layer, _layerIndex) {
                if (_layer.current){
                    _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {
                        if (_subLayer.current){
                            ProjectService.OnSubLayerClicked(_layerIndex,_subLayerIndex,function () {
                                $scope.$emit('ChangeCurrentSubLayer')
                            });
                        }
                    })
                }

            })
            return;




        }

        var updateThumbInterval;


        function holdLayer(event){
            //var pageNode = CanvasService.getPageNode();
            //var point = pageNode.getPointer(event.e);
            //console.log('point',point);
            if ($scope.status.gesture=='release'){
                $scope.status.gesture='moving';
                if (Preference.THUMB_REAL_TIME>0){
                    updateThumbInterval=$interval(function () {
                        ProjectService.UpdateCurrentThumb();
                    },Preference.THUMB_REAL_TIME)
                }
                ProjectService.HoldObject($scope.status);
            }

        }

        function scaleLayer(){
            if ($scope.status.gesture=='release'){
                $scope.status.gesture='moving';
                if (Preference.THUMB_REAL_TIME>0){
                    updateThumbInterval=$interval(function () {
                        ProjectService.UpdateCurrentThumb();
                    },Preference.THUMB_REAL_TIME)
                }
                ProjectService.ScaleLayer($scope.status);
            }
        }


        /**
         * pageNode的点击事件
         * 记录点击位置
         * @param event
         */
        function onPageMouseDown(event){
            pageMouseLocation.x=event.e.x;
            pageMouseLocation.y=event.e.y;
            if(event.e.y==undefined&&event.e.x==undefined){
                pageMouseLocation.x=event.e.layerX;
                pageMouseLocation.y=event.e.layerY;
            }
        }

        function selectLayer(event){
            if (layerDoubleClicking){
                console.log('双击中');
                return;
            }
            var _target=event.target;
            //console.log('event:',event,'_target',_target);

            ProjectService.OnLayerClicked(_target, function () {
                if (!KeydownService.isCtrlPressed()){
                    var selectObject=ProjectService.getCurrentSelectObject();
                    if (selectObject.type==Type.MyLayer){

                        var _target=ProjectService.getFabricObject(selectObject.level.id);
                        ProjectService.currentFabLayerIdList=[];
                        ProjectService.currentFabLayerIdList.push(_target.id);
                    }
                    else if (selectObject.type==Type.MyGroup){
                        var targetGroup=selectObject.target;
                        ProjectService.currentFabLayerIdList=[];
                        _.forEach(targetGroup.getObjects(), function (_fabLayer) {
                            ProjectService.currentFabLayerIdList.push(_fabLayer.id);
                        })
                    }
                }
                $scope.$emit('ChangeCurrentPage');
            })



        }

        /**
         * 选中了Widget的事件
         * @param event
         */
        function selectWidget(event){
            var _target=event.target;

            ProjectService.OnWidgetClicked(_target,function () {
                if (!KeydownService.isCtrlPressed()){
                    //如果不是按住Ctrl,用当前选中的Widget作为历史记录
                    var selectObject=ProjectService.getCurrentSelectObject();
                    if (Type.isWidget(selectObject.type)){

                        var _target=ProjectService.getFabricObject(selectObject.level.id,true);
                        ProjectService.currentFabWidgetIdList=[];
                        ProjectService.currentFabWidgetIdList.push(_target.id);
                    }
                    else if (selectObject.type==Type.MyGroup){
                        var targetGroup=selectObject.target;
                        ProjectService.currentFabWidgetIdList=[];
                        _.forEach(targetGroup.getObjects(), function (_fabWidget) {
                            ProjectService.currentFabWidgetIdList.push(_fabWidget.id);
                        })
                    }
                }
                $scope.$emit('ChangeCurrentSubLayer')
            })
        }

        /**
         * pageNode的点击位置,用来判断点击事件
         * @type {{}}
         */
        var pageMouseLocation={};

        /**
         * pageNode的点击时间,用来判断双击事件
         * @type {null}
         */
        var pageMouseUpTime=new Date();


        /**
         *在Ctrl模式下点击
         * @param _target
         */
        function ctrlClickLayer (_target) {
            if (!_target){
                //将Layer数组多选
                ProjectService.OnLayerMultiSelected(function () {
                    //更新缩略图
                    $scope.$emit('ChangeCurrentPage');

                    ProjectService.UpdateCurrentThumb();

                });
                return;
            }
            //如果是Ctrl模式下,currentList加入当前的Layer

            var hasRepeat=false;
            for (var i=0;i<ProjectService.currentFabLayerIdList.length;i++){
                if (ProjectService.currentFabLayerIdList[i]==_target.id){
                    var pageNode=CanvasService.getPageNode();

                    pageNode.renderAll();
                    ProjectService.currentFabLayerIdList.splice(i,1);
                    pageNode.renderAll();

                    toastr.info('多选去除');

                    hasRepeat=true;
                }
            }
            if (!hasRepeat||ProjectService.currentFabLayerIdList.length==0){
                //如果没有和已经选中的layer重复,则加入队列
                ProjectService.currentFabLayerIdList.push(_target.id);
                toastr.info('多选添加');

            }

            //将Layer数组多选
            ProjectService.OnLayerMultiSelected(function () {
                //更新缩略图
                $scope.$emit('ChangeCurrentPage');

                ProjectService.UpdateCurrentThumb();

            });
        }

        var layerDoubleClicking=false;
        /**
         * 双击layer
         * @param _target
         */
        function doubleClickLayer(_target) {
            layerDoubleClicking=true;


            ProjectService.OnLayerDoubleClicked(_target.id,function () {
                $timeout(function () {
                    layerDoubleClicking=false;
                
                },0);
                // layerDoubleClicking=false;
                //更新缩略图
                $scope.$emit('ChangeCurrentPage');

                ProjectService.UpdateCurrentThumb();
            });
        }

        /**
         * subLayerNode的点击位置,用来判断点击事件
         * @type {{}}
         */
        var subLayerMouseLocation={};

        function ctrlClickWidget(_target){
            if (!_target){
                //将Layer数组多选
                ProjectService.OnWidgetMultiSelected(function () {
                    $scope.$emit('ChangeCurrentPage');
                });
                return;
            }
            //如果是Ctrl模式下,currentList加入当前的widget
            var hasRepeat=false;
            for (var i=0; i<ProjectService.currentFabWidgetIdList.length; i++){
                if (ProjectService.currentFabWidgetIdList[i]==_target.id){
                    ProjectService.currentFabWidgetIdList.splice(i,1);
                    toastr.info('多选去除');

                    hasRepeat=true;
                }
            }
            if (!hasRepeat||ProjectService.currentFabWidgetIdList==[]){
                //如果没有和已经选中的widget重复,则加入队列
                ProjectService.currentFabWidgetIdList.push(_target.id);
                toastr.info('多选添加');

            }

            //将widget数组多选
            ProjectService.OnWidgetMultiSelected(function () {
                $scope.$emit('ChangeCurrentPage');

            });
        }
        function onSubLayerMouseDown(event){
            pageMouseLocation.x=event.e.x;
            pageMouseLocation.y=event.e.y;
            if(event.e.y==undefined&&event.e.x==undefined){
                pageMouseLocation.x=event.e.layerX;
                pageMouseLocation.y=event.e.layerY;
            }
        }
        function holdWidget(){

            if ($scope.status.gesture=='release'){
                $scope.status.gesture='moving';
                if (Preference.THUMB_REAL_TIME>0){
                    updateThumbInterval=$interval(function () {
                        ProjectService.updateCurrentThumbInPage();
                    },Preference.THUMB_REAL_TIME)
                }
                ProjectService.HoldObject($scope.status);
            }
        }
        function releaseLayer(event){
            if (layerDoubleClicking){
                console.log('双击layer中');
                return;
            }
            var isDbClick=false;    //这次点击是否是双击

            if (!pageMouseUpTime){
                pageMouseUpTime=new Date();
            }
            else{
                var now=new Date();
                if ((now.getTime()-pageMouseUpTime.getTime())<300){
                    console.log('双击');
                    isDbClick=true;
                }
                pageMouseUpTime=new Date();

            }
            var layer=ProjectService.getCurrentLayer();
            if (layer){
                var fabLayer=ProjectService.getFabricObject(layer.id);
                if (fabLayer){
                    ProjectService.SyncLevelFromFab(layer,fabLayer);
                }
            }
            if ($scope.status.gesture!='release'){
                if (angular.isDefined(updateThumbInterval)) {
                    $interval.cancel(updateThumbInterval);
                    updateThumbInterval = undefined;
                }
                ProjectService.ReleaseObject($scope.status,
                    function () {
                        $scope.$emit('ChangeCurrentPage',$scope.status.holdOperate);
                        $scope.status.gesture='release';

                        clickHandle();

                        ProjectService.UpdateCurrentThumb();

                    });

            }else {
                clickHandle();
            }

            /**
             * 在Ctrl模式下的处理
             */
            function clickHandle(){
                var clickedFabLayer=null;
                    var eventlocationX=null,
                        eventlocationY=null;
                    if(event.e.x&&event.e.y){
                        eventlocationX=event.e.x;
                        eventlocationY=event.e.y;
                    }
                    else if(event.e.layerX&&event.e.layerY){
                        eventlocationX=event.e.layerX;
                        eventlocationY=event.e.layerY;
                    }
                //如果点击了layer,在Ctrl模式下进行多选,否则单选
                if (Math.abs(eventlocationX-pageMouseLocation.x)<=2&&Math.abs(eventlocationY-pageMouseLocation.y)<=2){

                    //生成落点的Point对象
                    var clickPoint=new fabric.Point(event.e.offsetX/$scope.component.canvas.node.getZoom(),
                        event.e.offsetY/$scope.component.canvas.node.getZoom())
                    //获得当前选中的Group,如果落点在group中,则需要坐标变换后判断落点是否选中了group中的object
                    var activeGroup=$scope.component.canvas.node.getActiveGroup();

                    var clickX=null,clickY=null;

                    if (activeGroup&&activeGroup.containsPoint(clickPoint)) {
                        clickX=event.e.offsetX/$scope.component.canvas.node.getZoom()-(activeGroup.left+activeGroup.width/2);
                        clickY=event.e.offsetY/$scope.component.canvas.node.getZoom()-(activeGroup.top+activeGroup.height/2);


                    }else {
                        clickX=event.e.offsetX/$scope.component.canvas.node.getZoom();
                        clickY=event.e.offsetY/$scope.component.canvas.node.getZoom();
                    }
                    _.forEach($scope.component.canvas.node.getObjects(), function (_fabLayer) {

                        //console.log(clickX+'/'+clickY);
                        //console.log(_fabLayer.width+'/'+_fabLayer.getWidth());
                        //console.log(_fabLayer.top+'/'+_fabLayer.getTop());
                        if (clickX<=(_fabLayer.getWidth()+_fabLayer.left)&&clickY<=(_fabLayer.getHeight()+_fabLayer.top)
                            &&clickX>=_fabLayer.left&&clickY>=_fabLayer.top){
                            clickedFabLayer=_fabLayer;

                        }
                    });
                    if (KeydownService.isCtrlPressed()){
                        //如果在Ctrl模式点击了Layer,交给ctrlClickLayer处理
                        ctrlClickLayer(clickedFabLayer);

                    }else if(isDbClick){
                        clickedFabLayer&&doubleClickLayer(clickedFabLayer);
                    }


                }
                else{
                    console.log('偏移');
                }
            }
        }

        function releaseWidget(event){


            var widget=ProjectService.getCurrentWidget();
            if (widget){
                var fabWidget=ProjectService.getFabricObject(widget.id,true);
                if (fabWidget){
                    ProjectService.SyncLevelFromFab(widget,fabWidget);
                }
            }
            if ($scope.status.gesture!='release'){
                if (angular.isDefined(updateThumbInterval)) {
                    $interval.cancel(updateThumbInterval);
                    updateThumbInterval = undefined;
                }
                ProjectService.ReleaseObject($scope.status,
                    function () {
                        $scope.$emit('ChangeCurrentPage',$scope.status.holdOperate);
                        $scope.status.gesture='release';
                        ProjectService.updateCurrentThumbInPage();
                        ctrlHandle();

                    });
            }else {
                ctrlHandle();

            }

            /**
             * 在Ctrl模式下的处理
             */
            function ctrlHandle(){
                var clickedFabWidget=null;

                //如果点击了Widget,在Ctrl模式下进行多选,否则单选
                if (Math.abs(event.e.x-subLayerMouseLocation.x)<=2&&Math.abs(event.e.y-subLayerMouseLocation.y)<=2){

                    //生成落点的Point对象
                    var clickPoint=new fabric.Point(event.e.offsetX/$scope.component.subCanvas.node.getZoom(),
                        event.e.offsetY/$scope.component.subCanvas.node.getZoom())
                    //获得当前选中的Group,如果落点在group中,则需要坐标变换后判断落点是否选中了group中的object
                    var activeGroup=$scope.component.subCanvas.node.getActiveGroup();

                    var clickX=null,clickY=null;

                    if (activeGroup&&activeGroup.containsPoint(clickPoint)) {
                        clickX=event.e.offsetX/$scope.component.subCanvas.node.getZoom()-(activeGroup.left+activeGroup.width/2);
                        clickY=event.e.offsetY/$scope.component.subCanvas.node.getZoom()-(activeGroup.top+activeGroup.height/2);


                    }else {
                        clickX=event.e.offsetX/$scope.component.subCanvas.node.getZoom();
                        clickY=event.e.offsetY/$scope.component.subCanvas.node.getZoom();
                    }
                    _.forEach($scope.component.subCanvas.node.getObjects(), function (_fabWidget) {


                        if (clickX<=(_fabWidget.getWidth()+_fabWidget.getLeft())&&clickY<=(_fabWidget.getHeight()+_fabWidget.getTop())
                            &&clickX>=_fabWidget.getLeft()&&clickY>=_fabWidget.getTop()){
                            clickedFabWidget=_fabWidget;


                        }
                    });

                    if (KeydownService.isCtrlPressed()){
                        //如果在Ctrl模式点击了Widget,交给ctrlClickWidget处理
                        ctrlClickWidget(clickedFabWidget);

                    }
                }




            }

        }

        function changeZIndex(_op){
            var option={
                index:_op
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeZIndex(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);
                ProjectService.updateCurrentThumbInPage();

            });
        }
        function changeCanvasScale(scaleMode){
            ProjectService.ScaleCanvas(scaleMode);
        }

    }]);