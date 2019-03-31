
ide.controller('AttrCtrl', ['$scope','$timeout', 'ProjectService',function ($scope,$timeout, ProjectService) {
    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
        $scope.$emit('LoadUp');


    });


    //test
    function initUserInterface(){
        $scope.component={
            out:{
              toolShow:true
            },
            top: {
                currentNav: 0,

                navs: [{name: '属性'},
                    {name: '资源'},
                    {name:'变量'},
                    {name:'字体'}],
                changeNav: changeNav

            },
            bottom:{
                page:null,
                selectPage:selectPage,
                selectLayer:selectLayer,
                selectSubLayer:selectSubLayer,
                selectWidget:selectWidget
            }
        };

        $scope.widgetIcon={
            MySlide:"slide",
            MySwitch:"switch",
            MyProgress:"progress",
            MyDashboard:"dashboard",
            MyRotateImg:"rotate-img",
            MyDateTime:"time",
            MyNum:"num",
            MyTextArea:"text",
            MyButton:"button",
            MySlideBlock:"slide-block",
            MyButtonGroup:"button-group",
            MyScriptTrigger:"script-trigger",
            MyVideo:"video",
            MyAnimation:"animation",
            MyTexNum:"tex-num",
            MyTexTime:"tex-time",
            MyTouchTrack:"touch-track",
            MyAlphaSlide:"alpha-slide",
            MyTextInput:"text-input",
            MyGallery:"gallery",
            MyAlphaImg:"alpha-img",
            MyButtonSwitch:'button-switch',
            MyClock:'time'
        };
    }

    $scope.showRight = function() {
        $scope.$emit('ChangeShownArea', 1);
    };

    $scope.showBottom = function() {
        $scope.$emit('ChangeShownArea', 2);
    };


    function initProject(){
        $timeout(function () {
            ProjectService.getProjectTo($scope);
            switchCurrentPage();
        });

        //loadBottomFromPage($scope.project.pages[$scope.project.currentPageIndex]);


        $scope.toggleShow= toggleShow;
        $scope.$on('ToolShowChanged', function (event, toolShow) {
            $scope.component.out.toolShow=toolShow;
        });

        $scope.$on('PageChangedSwitched', function (event) {
            switchCurrentPage();
        });

        $scope.$on('AttributeChanged', function (event) {
            onAttributeChanged();
        })
    }

    function selectPage(_pageId){

        var pageIndex=-1;
        _.forEach($scope.project.pages,function(page,index){
            if (page.id==_pageId){
                pageIndex=index;
            }
        });
        console.log('选择了第' + pageIndex + '个页面');
        ProjectService.OnPageSelected(pageIndex,function () {
            $scope.$emit('ChangeCurrentPage',null, function () {
            });
        })

    }

    function selectLayer(_layer){

        ProjectService.OnLayerSelected(_layer, function () {
            $scope.$emit('ChangeCurrentPage');
        });

    }



    function selectSubLayer(_layer,_subLayer){

        var currentPage=ProjectService.getCurrentPage();
        var layerIndex= _.indexOf(currentPage.layers,_layer);
        var subLayerIndex= _.indexOf(_layer.subLayers,_subLayer);
        ProjectService.OnSubLayerSelected(layerIndex,subLayerIndex, function () {
            $scope.$emit('ChangeCurrentSubLayer')

        })
    }

    function selectWidget(_layer,_subLayer,_widget){
        //add by tang
        ProjectService.getLayerInfo=false;
        ProjectService.setAbsolutePosition(_widget.info,_layer.info);

        var currentPage=ProjectService.getCurrentPage();
        var layerIndex= _.indexOf(currentPage.layers,_layer);
        var subLayerIndex= _.indexOf(_layer.subLayers,_subLayer);
        var widgetIndex= _.indexOf(_layer.widgets,_subLayer);

        ProjectService.OnWidgetSelected(_widget, function () {
            $scope.$emit('ChangeCurrentSubLayer',null, function () {
            });
        });
    }



    function changeNav(_navIndex){
        $timeout(function () {
            $scope.component.top.currentNav=_navIndex;
        })
    }

    function toggleShow(_id){
        
        var obj=findObjectById(_id);
        obj&&(obj.expand=!obj.expand);

    

    }

    function switchCurrentPage(){
        var currentPage;
        _.forEach($scope.project.pages, function (_page) {
            if (_page.current){
                currentPage=_page;
            }
        });
        $timeout(function () {
            $scope.component.bottom.page=currentPage;
        })

    }

    function findObjectById(_id){

        if (_id==$scope.component.bottom.page.id){
            return $scope.component.bottom.page;
        }
        var layers=$scope.component.bottom.page.layers;
        for (var i =0;i<layers.length;i++){
            var layer=layers[i];
            if (layer.id==_id) {
                return layer;
            }
            else {
                for (var j=0;j<layer.subLayers.length;j++){
                    var subLayer=layer.subLayers[j];
                    if (subLayer.id==_id) {
                        return subLayer;
                    }else {
                        for (var k=0;k<subLayer.widgets.length;k++){
                            var widget=subLayer.widgets[k];
                            if (widget.id==_id){
                                return widget;
                            }
                        }
                    }
                }
            }

        }
    }


    function onAttributeChanged() {
        $timeout(function () {
            $scope.component.bottom.page = ProjectService.getCurrentPage();
        })
    }

    /**
     * @author tang
     * 右下角图层菜单拖拽操作
     * @type {{accept: Function}}
     */

    $scope.myLayerTree = dragTree();

    function dragTree(){
        var dragNodeIndex;
        return{
            dragStart: function (e) {
                var dragNode = e.source.nodeScope.$modelValue;
                var dragNodeId = e.source.nodeScope.$modelValue.id;
                var layers = $scope.component.bottom.page.layers;
                dragNodeIndex= e.source.nodesScope.$modelValue.indexOf(dragNode);

                //拖拽前先选中，且拖拽时关闭菜单展开状态
                if (dragNode.type == 'MyLayer') {
                    selectLayer(dragNode);
                    _.forEach(layers, function (layer) {
                        if (layer.id != dragNodeId) {
                            layer.expand = false;
                        }
                    })
                } else if (dragNode.type == 'MySubLayer') {
                    var sLayer=e.source.nodesScope.$nodeScope.$modelValue;
                    selectSubLayer(sLayer, dragNode);
                    _.forEach(layers, function (layer) {
                        _.forEach(layer.subLayers, function (subLayer) {
                            if (subLayer.id != dragNodeId) {
                                subLayer.expand = false;
                            }
                        })
                    })
                } else{
                    var wSubLayer = e.source.nodesScope.$nodeScope.$modelValue;
                    var wLayer = e.source.nodesScope.$nodeScope.$parentNodeScope.$modelValue;
                    selectWidget(wLayer, wSubLayer, dragNode);
                }
            },
            dropped: function (e) {
                var _endIndex = e.dest.index;

                var oldOperate = ProjectService.SaveCurrentOperate();
                if(_endIndex!==-1){
                    if (_endIndex != dragNodeIndex) {//若落点位置和原位置一样则不执行
                        ProjectService.ChangeDragZIndex(_endIndex,function(){
                            $timeout(function () {
                                $scope.$emit('ChangeCurrentPage', oldOperate);
                            })
                        });
                        toastr.info('调整层级成功');
                    }
                }else{
                    toastr.info('调整出现错误，请保存刷新页面')
                }
            },
            accept: function (sourceNodeScope, destNodesScope, destIndex) {
                //设置同一父级下才能执行拖拽
                if (destNodesScope.isParent(sourceNodeScope)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };


}]);

