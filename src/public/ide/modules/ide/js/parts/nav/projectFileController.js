
ide.controller('ProjectFileCtrl', ['$scope','$timeout',
    '$uibModal','$log',function ($scope,$timeout,
                                            $uibModal,$log) {


	$scope.$on('GlobalProjectReceived', function () {

		initUserInterface();

		initProject();
		$scope.$emit('LoadUp');

	});

	function initUserInterface(){
		$scope.items=['http://i13.tietuku.cn/c2f97e2245d519e0.jpg',
			'http://i13.tietuku.cn/05910ed1cab0abfe.jpg',
			'http://i13.tietuku.cn/ac9b0472df29b450.jpg'];
		$scope.projects = [];
		$scope.dataGetted = false;
		$scope.num = 1;
	}
	function initProject() {
		$scope.animationsEnabled = true;
		$scope.open = function (isRecent) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'projectFile.html',
				controller: 'ProjectFileInstanceCtrl',
				resolve: {
					items: function () {
						return $scope.items;
					},
                    isRecent:function () {
                        return isRecent;
                    }
				}
			});
		modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	}
}])
	.controller('ProjectFileInstanceCtrl',  ['$scope', 'ProjectService','ProjectFileManage','$uibModalInstance', 'items','isRecent', '$timeout',function ($scope, ProjectService,ProjectFileManage,$uibModalInstance, items,isRecent, $timeout) {

		console.log('打开项目');
		$scope.items = items;
        console.log(isRecent);
		$scope.selected = {
			item: null
		};
		$scope.isStartDownloaded = false;
		$scope.downloadProgress = {
			value: 100,
			max : 300
		};
		$scope.downloading = {
			item: null
		};
		$scope.changeState =function(item){
			$scope.selected.item = item;
			$scope.isStartDownloaded = false;
			$scope.downloading.item=null;
		};


        var request=isRecent?ProjectFileManage.getRecentProjectFile:ProjectFileManage.getAllProjectFile;
        request(function (result) {
            $timeout(function () {
                $scope.items=isRecent?result.recentProjects:result.projects;
                $scope.itemsGetted = true;
            })
        },function (err) {
            $scope.itemsGetted = true;
            toastr.warning('获取数据失败')

        })

		$scope.ok = function () {

			//$uibModalInstance.close($scope.selected.item);
			// console.log($scope.downloading.item);
			// console.log($scope.isStartDownloaded);
			// $scope.downloading.item = $scope.selected.item;
			// $scope.isStartDownloaded = true;
            ProjectService.getProjectTo($scope);
            var pid=PID;
            window.localStorage.setItem('projectCache'+pid,JSON.stringify($scope.project));
            console.log('项目已自动缓存');
            console.log($scope.selected.item);
            ideScope.$broadcast('ReOpenProject',$scope.selected.item.pid);


            $uibModalInstance.dismiss('cancel');


        };

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}])
;

