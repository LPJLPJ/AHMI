/**
 * Created by shenaolin on 16/3/10.
 */
ide.controller('ResourceCtrl',['ResourceService','$scope','$timeout', 'ProjectService', 'Type', 'CanvasService','$uibModal', function(ResourceService,$scope,$timeout,
                                          ProjectService,
                                          Type,
                                          CanvasService,$uibModal) {
    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();

    });

    function initUserInterface(){
        ResourceService.syncFiles()
    }


    function initProject(){
        $scope.component={

            top: {
                uploadingArray:[],

                files:[],

                deleteFile:deleteFile,
                basicUrl:'',
                resources:[]

            }

        };
        $scope.component.top.basicUrl = ResourceService.getResourceUrl();
        //ResourceService.syncFiles()
        $scope.component.top.files = ResourceService.getAllImages();

        ProjectService.getProjectTo($scope);
        $scope.component.top.resources=$scope.project.resources;


        $scope.$on('ResourceUpdate', function () {
            $scope.component.top.files = ResourceService.getAllImages();
        })
        
        /**
         * 删除资源按钮的弹窗
         */
        $scope.openPanel = function(index){
            $scope.resIndex = index;
            //利用uibModal制作模态窗口
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deletePanelModal.html',
                controller: 'deleteResCtrl',
                size: 'sm',
                resolve: {
                    selectedResIndex:function(){
                        return $scope.resIndex;
                    }
                }
            });

            modalInstance.result.then(function(index){

                deleteFile(index);
            })

        }
    }



    function deleteFile(index){
        var requiredResourceNames=ProjectService.getRequiredResourceNames();
        console.log(requiredResourceNames);
        return;
        ResourceService.deleteFileById($scope.component.top.files[index].id, function () {
            $scope.component.top.files = ResourceService.getAllImages();
        }.bind(this));
        console.log($scope.component.top.files);
    }



}])

    .controller('deleteResCtrl', function ($scope, $uibModalInstance, selectedResIndex) {
        $scope.confirm = function () {
            $uibModalInstance.close(selectedResIndex);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

