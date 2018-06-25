/**
 * Created by Zzen1sS on 16/3/31.
 */

ide.controller('SearchCtl',['$scope','ProjectService', function ($scope,ProjectService) {
    $scope.searchKey = '';
    $scope.hasSearchResult = false;
    $scope.handleEnter = function (e) {
        if (e.keyCode == 13){
            ProjectService.SearchObjectByName($scope.searchKey, function (_results) {
                $scope.results = _.cloneDeep(_results);
                $scope.hasSearchResult = $scope.results && $scope.results.length>1;
                if ($scope.results.length>=1){
                    $scope.curIdx = 0;
                    $scope.searchIdx(0);
                }
            })

        }
    };
    $scope.searchIdx= function (index) {
        console.time('searchIdx')
        ProjectService.SelectInSearchResults($scope.results[index], function () {
            $scope.$emit('ChangeCurrentPage');
            console.timeEnd('searchIdx')

        });
    };
    $scope.searchNext = function () {
        var nextIdx = ($scope.curIdx + 1) % $scope.results.length;
        $scope.curIdx = nextIdx;
        $scope.searchIdx(nextIdx);
    };
    $scope.searchBefore = function () {
        var beforeIdx = ($scope.curIdx + $scope.results.length - 1) % $scope.results.length;
        $scope.curIdx = beforeIdx;
        $scope.searchIdx(beforeIdx);

    };
    $scope.handleBlur = function (e) {
        // $scope.searchKey = '';
    }
}]);
