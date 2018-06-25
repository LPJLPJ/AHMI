
ideServices.
service('ProjectFileManage', ['CanvasService','ProjectService','OperateQueService','$http',function (CanvasService,ProjectService,OperateQueService,$http) {
	this.OpenProject= function (_successCallback) {

		_successCallback&&_successCallback();
	}
	
	this.getAllProjectFile=function (_successCallback, _errCallback) {
		$http({
			method:'GET',
            url:baseUrl+'/project',
            params:{token:window.localStorage.getItem('token')}
		}).success(function (result) {
            console.log(result);
            _successCallback&&_successCallback(result);
        }).error(function (err) {
            console.log(err);
            _errCallback&&_errCallback(err);
        })
	}
    
    this.getRecentProjectFile=function (_successCallback, _errCallback) {
        console.log('打开最近');
        $http({
            method:'GET',
            url:baseUrl+'/project/recent',
            params:{token:window.localStorage.getItem('token')}
        }).success(function (result) {
            console.log(result);
            _successCallback&&_successCallback(result);
        }).error(function (err) {
            console.log(err);
            _errCallback&&_errCallback(err);
        })
    }
}]);
