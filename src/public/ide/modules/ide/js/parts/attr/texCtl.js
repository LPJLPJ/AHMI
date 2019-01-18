/**
 * Created by Zzen1sS on 25/3/2016
 */
ide.controller('TexCtl',['$scope','$uibModal','ProjectService','Type','TexService', function ($scope,$uibModal,ProjectService,Type,TexService) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
    });

    $scope.$on("MaskView",function(event,data){
        $scope.myMask=data;
    });


    function initUserInterface(){
        readCurrentObjectInfo();
        $scope.animationsEnabled = true;
    }

    function initProject(){
        $scope.$on('AttributeChanged', function () {
            readCurrentObjectInfo();
        });

        /**
         * 修改index处的纹理
         * @param index
         */
        $scope.editTex = function(index){
            $scope.selectedIdx = index;
            var transTex = null;
            if  (index === -1){
                transTex = {
                    name:'default',
                    currentSliceIdx:0,
                    slices:[]
                };
            }else{
                if($scope.widgetType===Type.MyButton){
                    if(!$scope.texList[index].slices[2]){
                        $scope.texList[index].slices[2]={
                            color:'rgba(244,244,244,0.3)',
                            imgSrc:'',
                            name:'高亮'
                        }
                    }
                }
                transTex = _.cloneDeep($scope.texList[index]);
                var objInfo = _.cloneDeep($scope.objInfo)
            }
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'imageSelectorModal.html',
                controller: 'ImageSelectorInstanceCtl',
                size: 'lg',
                resolve: {
                    widgetInfo:{
                        name:$scope.widgetName,
                        type:$scope.widgetType,
                        tex: transTex,
                        index:index,
                        objInfo:objInfo
                    }
                }
            });

            modalInstance.result.then(function (newTex) {

                //process save
                if ($scope.selectedIdx == -1){
                    //new tex
                    $scope.texList.push(newTex);

                }else if ($scope.selectedIdx>=0 && $scope.selectedIdx<$scope.texList.length){
                    //update
                    $scope.texList[$scope.selectedIdx] = newTex;
                }
                //console.log('texlist',$scope.texList)
                var oldOperate=ProjectService.SaveCurrentOperate();
                ProjectService.ChangeAttributeTexList(_.cloneDeep($scope.texList), function () {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });



        };

        $scope.configWidgetSize=function(){
            if($scope.texList[0].slices[0].imgSrc!==''||($scope.widgetType === 'MyProgress'&&$scope.texList[1].slices[0].imgSrc!=='')){
                var oldOperate=ProjectService.SaveCurrentOperate();
                ProjectService.ChangeAttributeWidgetSize(function(){
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }
        }


    }

    function readCurrentObjectInfo(){
        var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
        if (!currentSelectedObject){
            console.warn('空!');

            return;
        }


        if (Type.isWidget(currentSelectedObject.type)){
            //$scope.showTexPanel = true;
            switch (currentSelectedObject.type){
                //case "MyDateTime" :
                case "MyVideo":
                case "MyScriptTrigger":
                case "MyNum":
                    $scope.showTexPanel=false;
                    $scope.showSizeButtion=false;
                    break;
                case "MyDateTime":
                case "MyButtonGroup":
                case "MyTexNum":
                    $scope.showTexPanel=true;
                    $scope.showSizeButtion=false;
                    break;
                default :
                    $scope.showTexPanel = true;
                    $scope.showSizeButtion=true;
                    break;
            }
        }else{
            $scope.showTexPanel = false;
            $scope.showSizeButtion = false;
        }
        $scope.widgetName = currentSelectedObject.name;
        $scope.widgetType = currentSelectedObject.type;
        if (currentSelectedObject.texList && currentSelectedObject.texList.length){
            $scope.texList = currentSelectedObject.texList;
            $scope.objInfo = currentSelectedObject.info;
        }else{
            $scope.texList = TexService.getDefaultWidget($scope.widgetType);
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTexList(_.cloneDeep($scope.texList), function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            });
        }

        return currentSelectedObject;

    }

}]);