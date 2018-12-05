/**
 * Created by Zzen1ss on 3/12/2018
 */

ide.controller('WaveFilterCtrl',['$scope','$uibModal','WaveFilterService',function ($scope,$uibModal,WaveFilterService) {

    $scope.$on('GlobalProjectReceived', function () {

        initUserInterface();

        initProject();
        $scope.$emit('LoadUp');

    });




    function initUserInterface(){
        $scope.status={
            collapsed : false
        };
       
        

        $scope.collapse = function ($event) {

            $scope.status.collapsed=!$scope.status.collapsed;

        };
        $scope.animationsEnabled = true;
    }




    function initProject(){
        
        $scope.wavefilters = WaveFilterService.getWaveFilters()

        /**
         * 删除Action
         * @param index
         */
        $scope.deleteWaveFilter = function (index) {
            // ActionService.deleteActionByIndex(index,function(){
            //     $scope.actions = ActionService.getAllActions();
            // }.bind(this))
            WaveFilterService.deleteByIdx(index)
        };

        /**
         * 打开指定Action面板，
         * @param index
         */
        $scope.openPanel = function (index) {
            $scope.selectedIdx = index;
            // console.log($scope.tags);
            var curWaveFilter
            if (index == -1){
                //newAction
                curWaveFilter = WaveFilterService.getNewWaveFilter()
            }else if (index>=0&&index<$scope.wavefilters.length){
                curWaveFilter = _.cloneDeep($scope.wavefilters[index]);
            }
            
            
            /**
             * 利用$uiModal服务，制作模态窗口
             */
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'waveFilterPanelModal.html',
                controller: 'WaveFilterInstanceCtrl',
                size: 'lg',
                resolve: {
                    wavefilter: function () {
                        return curWaveFilter;
                    },
                    index:function(){
                        return index;
                    }
                    
                }
            });

            /**
             * result.then接收两个匿名函数参数
             * calling $uibModalInstance.close will trigger the former function
             * when clicking at the background, pressing the esc button on keyboard, or calling $modalInstance.dismiss will trigger the latter one
             */
            modalInstance.result.then(function (newWaveFilter) {
                //process save
                if ($scope.selectedIdx == -1){
                    //new action
                    WaveFilterService.addWaveFilter(newWaveFilter)
                }else if ($scope.selectedIdx>=0 && $scope.selectedIdx<$scope.wavefilters.length){
                    //update
                    WaveFilterService.updateWaveFilterByIdx(newWaveFilter,$scope.selectedIdx)
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }

}])

/**
 * action 模态窗口控制器
 */
    .controller('WaveFilterInstanceCtrl',['$scope', '$uibModalInstance', 'WaveFilterService','wavefilter','index', function ($scope, $uibModalInstance,WaveFilterService,wavefilter,index) {

       $scope.wavefilter = wavefilter

       $scope.waveFilterTypes = WaveFilterService.waveFilterTypes()

       $scope.attrs = WaveFilterService.getWaveFilterAttrs($scope.wavefilter.type)

        //保存
        $scope.save = function (th) {
            //check title unique
            if(checkWaveFilterTitleUnique()){
                $uibModalInstance.close($scope.wavefilter);
            }else{
                toastr.warning("名称已被占用，请重新输入名称")
            }
            
        };

        $scope.getWaveFilterAttrs = function(){
            return WaveFilterService.getWaveFilterAttrs($scope.wavefilter.type)
        }

        //取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function checkWaveFilterTitleUnique(){
            var wfs = WaveFilterService.getWaveFilters()
            for(var i=0;i<wfs.length;i++){
                if(i!==index){
                    if(wfs[i].title == $scope.wavefilter.title){
                        return false
                    }
                }
                
            }
            return true
        }

       

    }]);