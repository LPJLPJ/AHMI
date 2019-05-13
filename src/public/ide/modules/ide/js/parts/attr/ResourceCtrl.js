/**
 * Created by shenaolin on 16/3/10.
 */

ide.controller('ResourceCtrl',['ResourceService','$scope','$timeout', 'ProjectService', 'Type', 'CanvasService','$uibModal', 'Upload','TrackService',function(ResourceService,$scope,$timeout,
                                          ProjectService,
                                          Type,
                                          CanvasService,$uibModal,Upload,TrackService) {
    $scope.$on('GlobalProjectReceived', function () {
        initUserInterface();
        initProject();
    });

    $scope.$on('ResourceChanged', function () {
        $scope.component.top.files = ResourceService.getAllCustomResources();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();
        if($scope.component.search.status){
            enterResourceSearch(1);
        }else {
            initResourcesList($scope.component.paging.currentIndex);
        }

        $scope.$emit('ChangeCurrentPage');
    });

    $scope.$on('trackListChanged',function(){
        $scope.component.top.tracks = TrackService.getAllTracks();
    })

    function initUserInterface(){
        $scope.trackListCollapsed = false
    }

    //初始化资源
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
                tracks:[],
                showDel:true,
                selectIndexArr:[],
                selectAll:selectAll,
                oppSelect:oppSelect,
                allSelected:false,
                unSelAll:unSelAll,
                imageType:imageType,
                playMusic:playMusic,
                mask:[]
            },
            paging:{
                pagingAmount:100,
                currentIndex:0,
                indexCount:1,
                changeFileIndex:changeFileIndex,
            },
            resourcesList:[],
            search:{
                searchText:'',
                enterResourceSearch:enterResourceSearch,
                status:false,
                cancelSearch:cancelSearch
            }
        };

        $scope.component.top.resources = ResourceService.getAllResource();
        $scope.component.top.tracks = TrackService.getAllTracks();
        $scope.component.top.basicUrl = ResourceService.getResourceUrl();
        $scope.component.top.maxSize = ResourceService.getMaxTotalSize();
        $scope.component.top.files = ResourceService.getAllCustomResources();
        $scope.component.top.totalSize = ResourceService.getCurrentTotalSize();

        //console.log($scope.component.top.files);
        $scope.stopProp = function(e){
            e.stopPropagation();
        };

        $scope.collapseTrackList = function(){
            $scope.trackListCollapsed = !$scope.trackListCollapsed
        }

        /**
         * 删除资源按钮的弹窗
         */
        $scope.openTrackPanel = function(index,cb){
            var curTrack
            if(index<=-1){
                //new track
                curTrack = TrackService.getNewTrack()
            }else{
                curTrack = _.cloneDeep(TrackService.getTrackByIndex(index))
            }
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'trackPanelModal.html',
                controller: 'trackPanelCtrl',
                size: 'md',
                resolve: {

                    track:function(){
                        return curTrack
                    }
                }
            });
            modalInstance.result.then(function(_track){
                var oldOperate = ProjectService.SaveCurrentOperate();


                if(index<=-1){
                    TrackService.appendTrack(_track)
                }else{
                    TrackService.updateTrackByIndex(index,_track)
                }
                //$scope.component.top.tracks = TrackService.getAllTracks()
                console.log(TrackService.getAllTracks(),ProjectService.getAllTrackList())
                $scope.$emit('ChangeCurrentPage', oldOperate);
            })
        }


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
        };

        $scope.prevent = function(e){
            e.preventDefault();
        };

        //排序
        /*$scope.resourcesTree = {
            update:function(e){

            },
            stop:function(e){
                ResourceService.syncFiles($scope.component.top.files);
                $scope.$emit('ResourceUpdate');
            }
        };*/
        initResourcesList($scope.component.paging.currentIndex);
    }

    //初始化资源列表
    function initResourcesList(currentIndex) {
        var files = $scope.component.top.files,
            startIndex = currentIndex*$scope.component.paging.pagingAmount,
            endIndex = startIndex + $scope.component.paging.pagingAmount;

        $scope.component.paging.indexCount = Math.ceil(files.length/$scope.component.paging.pagingAmount);
        $scope.component.resourcesList = files.filter(function (file, index) {
            return startIndex <= index && index < endIndex;
        });
    }

    // 搜索
    function enterResourceSearch(e) {
        if(e.keyCode == 13 || e == 1){
            var text = $scope.component.search.searchText,
                files = $scope.component.top.files;
            if (text){
                $scope.component.search.status = true;
                $scope.component.resourcesList = files.filter(function (file, index) {
                    return file.name.search(text) != -1;
                });
                //console.log($scope.component.resourcesList);
            } else {
                $scope.component.search.status = false;
                initResourcesList($scope.component.paging.currentIndex);
            }
        }
    }

    // 取消搜索
    function cancelSearch(){
        $scope.component.search.searchText = '';
        $scope.component.search.status = false;
        initResourcesList($scope.component.paging.currentIndex);

        $scope.component.top.unSelAll();
        $scope.component.top.selectIndexArr = [];
    }

    //切换资源分页
    function changeFileIndex(n) {
        var indexCount = $scope.component.paging.indexCount,
            currentIndex = $scope.component.paging.currentIndex;
        console.log(currentIndex,indexCount);
        if (n === 1) {
            if (currentIndex < indexCount - 1) {
                $scope.component.paging.currentIndex ++;
            }
        }else {
            if (currentIndex > 0) {
                $scope.component.paging.currentIndex --;
            }
        }
        initResourcesList($scope.component.paging.currentIndex);
    }
    /**
     * 删除文件
     * @param indexArr
     */
    function deleteFile(indexArr){
        var requiredTextNames = ProjectService.getRequiredTextNames();
        var requiredResourceNames=ProjectService.getRequiredResourceNames(),
            files = _.cloneDeep($scope.component.resourcesList),
            resourceId = [],
            j,
            fileIsNotUsed = true,
            TextIsNotUsed = true;

        //console.log(indexArr);
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
                    $scope.$emit('ResourceUpdate');
                }.bind(this));
            }else{
                toastr.warning('资源-'+files[fileIndex].name+'已经被使用');
            }
        }
    }


    $scope.deleteTrack = function(index){
        var oldOperate = ProjectService.SaveCurrentOperate();
        TrackService.deleteTrackByIndex(index)
        $scope.$emit('ChangeCurrentPage', oldOperate);

    }

    /**
     * 下载资源
     * @author tang
     */
    function downloadFile(index){
        var file = $scope.component.resourcesList[index];
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
        for(var i=0;i<$scope.component.resourcesList.length;i++){
            $scope.component.top.selectIndexArr[i]=selected;
        }

        //console.log($scope.component.top.selectIndexArr)
    }
    //反选
    function oppSelect(){
        //点击反选后全选不选中
        $scope.component.top.unSelAll();
        for(var i=0;i<$scope.component.resourcesList.length;i++){
            if($scope.component.top.selectIndexArr[i]==null){
                $scope.component.top.selectIndexArr[i]=true;
            }else{
                $scope.component.top.selectIndexArr[i]=(!$scope.component.top.selectIndexArr[i]);
            }
        }

        //console.log($scope.component.top.selectIndexArr)
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
        }else if(file.type.match(/audio/)){
            return 3
        }else{
            return 1;//预留
        }

    }

    function playMusic(file){
        var curAudio = ResourceService.getResourceObjFromCache(file.src,'src')
        if(curAudio){
            if(curAudio.playing){
                // curAudio.playing = false
                // file.playing = false
                curAudio.audioSrc.stop()
            }else{
                var bufferSrc = audioCtx.createBufferSource();
                bufferSrc.buffer = curAudio.content;

                bufferSrc.connect(window.audioCtx.destination);
                bufferSrc.onended = function(){
                    $scope.$apply(function(){
                        curAudio.playing = false
                        file.playing = false
                    })

                }
                curAudio.audioSrc = bufferSrc
                bufferSrc.start(0)
                curAudio.playing = true
                file.playing = true
            }

        }
    }

    var restoreValue;
    var validation=true;
    //保存旧值
    $scope.store=function(th){
        // console.log("store",th);
        restoreValue=th.file.name;

    };

    //恢复旧值
    $scope.restore = function (th) {
        th.file.name=restoreValue;
        console.log("restore");
    };

    //验证新值
    $scope.enterName=function(th){
        //console.log("enterName");
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
    }])

    .controller('trackPanelCtrl', ['$scope', '$uibModalInstance', 'ResourceService','track', function ($scope, $uibModalInstance,ResourceService, track) {
        $scope.track = track;     // 动画配置

        $scope.trackSources = ResourceService.getAllAudios()

        $scope.confirm = function(){
            $uibModalInstance.close($scope.track)
        }

        $scope.cancel = function(){
            $uibModalInstance.dismiss()
        }
    }])
