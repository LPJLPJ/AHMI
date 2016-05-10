/**
 * Created by franky on 16/3/13.
 */

ide.controller('ProjectFileCtrl', function ($scope,$timeout,
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
		$scope.open = function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'projectFile.html',
				controller: 'ProjectFileInstanceCtrl',
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
})
	.controller('ProjectFileInstanceCtrl',  function ($scope, $uibModalInstance, items, $timeout) {

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
		}, 2);

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
	})
;

