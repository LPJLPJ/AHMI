/**
 * Created by shenaolin on 16/2/28.
 */

ide.controller('AttrCtrl', function ($scope,$timeout,
                                     ProjectService
                                     ) {
    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
        $scope.$emit('LoadUp');


    });




    function initUserInterface(){
        $scope.component={
            out:{
              toolShow:false
            },
            top: {
                currentNav: 0,

                navs: [{name: '属性'}
                    , {name: '资源'},
                    {name:'变量'},
                    {name:'字符'}],
                changeNav: changeNav,

            },
            bottom:{
                page:null,
                selectPage:selectPage,
                selectLayer:selectLayer,
                selectSubLayer:selectSubLayer,
                selectWidget:selectWidget
            }
        }
    }

    function initProject(){
        $timeout(function () {
            ProjectService.getProjectTo($scope);
            switchCurrentPage();
        })

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

    function selectPage(){

        var pageIndex=-1;
        _.forEach($scope.project.pages,function(page,index){
            if (page.id==ProjectService.getCurrentPage().id){
                pageIndex=index;
            }
        });
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
});

