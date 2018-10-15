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
                downloadFile:downloadFile,
                toggleOperation:toggleOperation,
                basicUrl:'',
                resources:[],
                showDel:true,
                selectIndexArr:[],
                selectAll:selectAll,
                oppSelect:oppSelect,
                allSelected:false,
                unSelAll:unSelAll,
                imageType:imageType,
                mask:[]
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
        var requiredTextNames = ProjectService.getRequiredTextNames();
        var requiredResourceNames=ProjectService.getRequiredResourceNames(),
            files = _.cloneDeep($scope.component.top.files),
            resourceId = [],
            j,
            fileIsNotUsed = true,
            TextIsNotUsed = true;

        for(j=0;j<indexArr.length;j++){
            var fileIndex = indexArr[j];
            fileIsNotUsed = requiredResourceNames.every(function(itemSrc){
                return itemSrc!==files[fileIndex].src
            });
            TextIsNotUsed = requiredTextNames.every(function(textName){
                return textName!==files[fileIndex].name
            });
            if(fileIsNotUsed&&TextIsNotUsed){
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
     * 下载资源
     * @author tang
     */
    function downloadFile(index){
        var file = _.cloneDeep($scope.component.top.files)[index];
        var projectId = $scope.project.projectId;
        ResourceService.downloadFile(file,projectId);
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
                //点击取消后全选不选中
                $scope.component.top.unSelAll();
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
                    //删除文件后全选不选中
                    $scope.component.top.unSelAll();
                }else{
                    //do not select
                    toastr.warning('未选择文件！');
                }
                break;
        }
    }

    //全选
    function selectAll(selected){
        for(var i=0;i<$scope.component.top.files.length;i++){
            $scope.component.top.selectIndexArr[i]=selected;
        }
    }
    //反选
    function oppSelect(){
        //点击反选后全选不选中
        $scope.component.top.unSelAll();
        for(var i=0;i<$scope.component.top.files.length;i++){
            if($scope.component.top.selectIndexArr[i]==null){
                $scope.component.top.selectIndexArr[i]=true;
            }else{
                $scope.component.top.selectIndexArr[i]=(!$scope.component.top.selectIndexArr[i]);
            }

        }
    }
    //全选框重置
    function unSelAll(){
        $scope.component.top.allSelected=false;
    }
    //判断文件的图片类型
    function imageType(file){
        if(file.type.match(/image/)){
            return 1;//文件是图片
        }else if(file.type.match(/font/)){
            return 2;//文件是字体文件
        }else{
            return 1;//预留
        }

    }

    var restoreValue;
    var validation=true;
    //保存旧值
    $scope.store=function(th){
        console.log("store",th);
        restoreValue=th.file.name;

    };

    //恢复旧值
    $scope.restore = function (th) {
        th.file.name=restoreValue;
        console.log("restore");
    };

    //验证新值
    $scope.enterName=function(th){

        console.log("enterName");
        //判断是否和初始一样
        if (th.file.name===restoreValue){
            return;
        }
        //输入有效性检测
        validation=ProjectService.resourceValidate(th.file.name);
        if(!validation){
            console.log("input error!");
            $scope.restore(th);
            return;
        }
        toastr.info('修改成功');
        restoreValue=th.file.name;
    };

    //验证enter键
    $scope.enterPress=function(e,th){
        if (e.keyCode==13){
            $scope.enterName(th);


        }
    };


}])

    .controller('deleteResCtrl', ['$scope','$uibModalInstance','selectedResIndex',function ($scope, $uibModalInstance, selectedResIndex) {
        $scope.confirm = function () {
            $uibModalInstance.close(selectedResIndex);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }]);

