/**
 * Created by Zzen1sS on 25/3/2016
 */
ide.controller('TexCtl',['$scope','$uibModal','ProjectService','Type','TexService', function ($scope,$uibModal,ProjectService,Type,TexService) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
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
            if  (index == -1){
                transTex = {
                    name:'default',
                    currentSliceIdx:0,
                    slices:[]
                };
            }else{
                transTex = _.cloneDeep($scope.texList[index]);
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
                        tex: transTex
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
                var oldOperate=ProjectService.SaveCurrentOperate();
                ProjectService.ChangeAttributeTexList(_.cloneDeep($scope.texList), function () {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });



        };


    }

    function readCurrentObjectInfo(){
        var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
        if (!currentSelectedObject){
            console.warn('空!');

            return;
        }


        if (Type.isWidget(currentSelectedObject.type)){
            $scope.showTexPanel = true;
        }else{
            $scope.showTexPanel = false;
        }
        $scope.widgetName = currentSelectedObject.name;
        $scope.widgetType = currentSelectedObject.type;
        if (currentSelectedObject.texList && currentSelectedObject.texList.length){
            $scope.texList = currentSelectedObject.texList;
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