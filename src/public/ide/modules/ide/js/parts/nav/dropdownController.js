ide.controller('addWidgetController', ['$scope', 'Type', function ($scope, Type) {
    $scope.widgets=[
        {name:"图层",icon:"&#xe6e0;"},
        {name:"开关",icon:"&#xe64e;"},
        {name:"进度条",icon:"&#xe62a;"},
        {name:"仪表盘",icon:"&#xe632;"},
        // {name:"示波器",icon:"&#xe62d;"},
        {name:"旋转图",icon:"&#xe64f;"},
        {name:"时间",icon:"&#xe64d;"},
        {name:"数字",icon:"&#xe631;"},
        {name:"文本",icon:"&#xe62f;"},
        {name:"按钮",icon:"&#xe658;"},
        // {name:"旋钮",icon:"&#xe628;"},
        {name:"滑块",icon:"&#xe77e;"},
        {name:"按钮组",icon:"&#xe637;"},
        {name:"触发器",icon:"&#xe7d0;"},
        {name:"影像",icon:"&#xe6ad;"},
        {name:"开机动画",icon:"&#xe633"},
        {name:"图层数字",icon:"&#xe675"},
        {name:"图层时间",icon:"&#xe655"},
        {name:"透明度图层",icon:"&#xe6e0;"}
        // {name:"透明图层",icon:"&#xe6e0;"}
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