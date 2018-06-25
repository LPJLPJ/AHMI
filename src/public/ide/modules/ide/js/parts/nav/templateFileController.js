

ide.controller('TemplateFileCtrl', ['$scope','$timeout',
    '$uibModal','$log',
    'GlobalService',
    'ProjectService',
    'TemplateProvider',
    'ProjectFileManage',
    'OperateQueService',function ($scope,$timeout,
                                            $uibModal,$log,
                                            GlobalService,
                                            ProjectService,
                                            TemplateProvider,
                                            ProjectFileManage,
                                            OperateQueService) {


		$scope.$on('GlobalProjectReceived', function () {

			initUserInterface();

			initProject();
			$scope.$emit('LoadUp');

		});

		function initUserInterface(){
			$scope.items=['http://i13.tietuku.cn/c2f97e2245d519e0.jpg',
				'http://i13.tietuku.cn/05910ed1cab0abfe.jpg',
				'http://i13.tietuku.cn/ac9b0472df29b450.jpg'];
			$scope.dataGetted = false;
		}
		function initProject() {
			$scope.animationsEnabled = true;
			$scope.open = function (size) {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'templateFile.html',
					controller: 'TemplateFileInstanceCtrl',
					size: size,
					resolve: {
						items: function () {
							return $scope.items;
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
	.controller('TemplateFileInstanceCtrl',  ['$scope', '$uibModalInstance', 'items', '$timeout',function ($scope, $uibModalInstance, items, $timeout) {

		$scope.items = items;
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
		$timeout(function(){
			$scope.itemsGetted = true;
		}, 2000);

		$scope.ok = function () {
			//$uibModalInstance.close($scope.selected.item);
			console.log($scope.downloading.item);
			console.log($scope.isStartDownloaded);
			$scope.downloading.item = $scope.selected.item;
			$scope.isStartDownloaded = true;
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}])
;

