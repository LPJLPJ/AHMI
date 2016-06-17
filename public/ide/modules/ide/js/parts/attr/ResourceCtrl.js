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

    $scope.$on('ResourceChanged', function () {
        $scope.component.top.files = ResourceService.getAllImages();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();
    });

    function initUserInterface(){

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
        ProjectService.getProjectTo($scope);

        $scope.component.top.resources=$scope.project.resourceList;

        $scope.component.top.basicUrl = ResourceService.getResourceUrl();
        $scope.component.top.maxSize = ResourceService.getMaxTotalSize();
        $scope.component.top.files = ResourceService.getAllImages();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();


        
        
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

        for (var i=0;i<requiredResourceNames.length;i++){
            if ($scope.component.top.files[index].src==requiredResourceNames[i]){
                toastr.warning('该资源已经被使用');
                return;
            }
        }
        var resourceId = $scope.component.top.files[index].id;
        ResourceService.deleteFileById(resourceId, function () {
            //$scope.component.top.files = ResourceService.getAllImages();
            scope.$emit('ResourceUpdate');
            //delete on server
            //$http({
            //    method:'DELETE',
            //    url:'/project/'+$scope.project.projectId+'/deleteresource/'+resourceId
            //})
            //.success(function (data, status, xhr) {
            //    if (data == 'ok'){
            //        toastr.info('删除成功');
            //    }
            //
            //})
            //.error(function (err) {
            //    console.log('delete failed');
            //    toastr.info('删除失败')
            //})
        }.bind(this));
        

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

