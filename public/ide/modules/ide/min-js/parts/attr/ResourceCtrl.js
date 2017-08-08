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
        $scope.component.top.files = ResourceService.getAllCustomResources();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();
        $scope.$emit('ChangeCurrentPage');
    });

    function initUserInterface(){

    }

    function initProject(){
        $scope.component={
            top:{
                uploadingArray:[],
                files:[],
                deleteFile:deleteFile,
                toggleOperation:toggleOperation,
                basicUrl:'',
                resources:[],
                showDel:true,
                selectIndexArr:[]
            }
        };

        $scope.component.top.resources = ResourceService.getAllResource();

        $scope.component.top.basicUrl = ResourceService.getResourceUrl();
        $scope.component.top.maxSize = ResourceService.getMaxTotalSize();
        $scope.component.top.files = ResourceService.getAllCustomResources();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();


        
        
        /**
         * 删除资源按钮的弹窗
         */
        $scope.openPanel = function(index,cb){
            $scope.resIndex = index;
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
            modalInstance.result.then(function(resIndex){
                var resIndexArr = [];
                if(_.isNumber(resIndex)){
                    //删除单个文件
                    resIndexArr.push(resIndex);
                    deleteFile(resIndexArr);
                }else if(_.isArray(resIndex)){
                    //批量删除
                    for(var key in resIndex){
                        if(resIndex[key]){
                            resIndexArr.push(Number(key));
                        }
                    }
                    deleteFile(resIndexArr);
                    cb&&cb();
                }
            })
        }
    }


    /**
     * 删除文件
     * @param indexArr
     */
    function deleteFile(indexArr){
        var requiredResourceNames=ProjectService.getRequiredResourceNames(),
            files = _.cloneDeep($scope.component.top.files),
            resourceId = [],
            j,
            fileIsNotUsed = true;
        for(j=0;j<indexArr.length;j++){
            var fileIndex = indexArr[j];
            fileIsNotUsed = requiredResourceNames.every(function(itemSrc){
                return itemSrc!==files[fileIndex].src
            });
            if(fileIsNotUsed){
                resourceId = files[fileIndex].id;
                ResourceService.deleteFileById(resourceId, function () {
                    //$scope.component.top.files = ResourceService.getAllImages();
                    $scope.$emit('ResourceUpdate');
                }.bind(this));
            }else{
                toastr.warning('资源-'+files[fileIndex].name+'已经被使用');
            }
        }
    }

    /**
     * 批量操作函数
     * @param keyword 操作关键字
     */
    function toggleOperation(keyword){
        var i = 0,
            haveSelectRes = false,
            selectIndexArr = _.cloneDeep($scope.component.top.selectIndexArr);
        switch (keyword){
            case 'operate':
                $scope.component.top.showDel = !$scope.component.top.showDel;
                break;
            case 'cancel':
                $scope.component.top.selectIndexArr = [];
                $scope.component.top.showDel = !$scope.component.top.showDel;
                break;
            case 'delete':
                haveSelectRes = !selectIndexArr.every(function (item) {
                    return !item;
                });
                if(haveSelectRes){
                    //have select res
                    $scope.openPanel(selectIndexArr,function () {
                        $scope.component.top.selectIndexArr = [];
                    });
                }else{
                    //do not select
                    toastr.warning('未选择文件！');
                }
                break;
        }
    }


}])

    .controller('deleteResCtrl', ['$scope','$uibModalInstance','selectedResIndex',function ($scope, $uibModalInstance, selectedResIndex) {
        $scope.confirm = function () {
            $uibModalInstance.close(selectedResIndex);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }]);

