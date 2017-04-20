ide.controller('addWidgetController', ['$scope', 'Type', function ($scope, Type) {
    $scope.widgets=[
        {name:"图层",icon:"&#xe640;"},
        {name:"开关",icon:"&#xe64e;"},
        {name:"进度条",icon:"&#xe62a;"},
        {name:"仪表盘",icon:"&#xe632;"},
        // {name:"示波器",icon:"&#xe62d;"},
        {name:"旋转图",icon:"&#xe64f;"},
        {name:"时间",icon:"&#xe64d;"},
        {name:"数字",icon:"&#xe631;"},
        {name:"文本",icon:"&#xe62f;"},
        {name:"按钮",icon:"&#xe636;"},
        // {name:"旋钮",icon:"&#xe628;"},
        {name:"滑块",icon:"&#xe62e;"},
        {name:"按钮组",icon:"&#xe637;"},
        {name:"触发器",icon:"&#xe634;"},
        {name:"影像",icon:"&#xe650;"},
        {name:"G",icon:"&#xe650;"}
    ];
    $scope.addWidget = function (index) {
        var widgets = $scope.widgets;
        if (index<0 || index >widgets.length-1){
            return;
        }
        $scope.component.tool.addWidget(index);
    }
}]);

ide.directive('widgetIcon',[function () {
    return {
        restrict:'AE',
        link: function (scope,elem,iAttrs) {
                elem.html(iAttrs.iconfont);
            }
        }

}])