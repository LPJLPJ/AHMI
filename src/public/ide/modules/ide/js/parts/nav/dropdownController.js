ide.controller('addWidgetController', ['$scope', 'Type', function ($scope, Type) {
    $scope.widgets=[
        {name:"图层",icon:"slide"},
        {name:"开关",icon:"switch"},
        {name:"进度条",icon:"progress"},
        {name:"仪表盘",icon:"dashboard"},
        // {name:"示波器",icon:"&#xe62d;"},
        {name:"旋转图",icon:"rotate-img"},
        {name:"时间",icon:"time"},
        {name:"数字",icon:"num"},
        {name:"文本",icon:"text"},
        {name:"按钮",icon:"button"},
        // {name:"旋钮",icon:"&#xe628;"},
        {name:"滑块",icon:"slide-block"},
        {name:"按钮组",icon:"button-group"},
        {name:"触发器",icon:"script-trigger"},
        {name:"影像",icon:"video"},
        {name:"开机动画",icon:"animation"},
        {name:"图层数字",icon:"tex-num"},
        {name:"图层时间",icon:"tex-time"},
        {name:"触摸追踪",icon:"touch-track"},
        {name:"透明度图层",icon:"alpha-slide"},
        {name:"文本输入",icon:"text-input"},
        {name:"照片栏",icon:"gallery",enable:false},
        {name:"动态透明图",icon:"alpha-img"},
        {name:"按钮开关",icon:"button-switch"},
        {name:"时钟",icon:"time"},
        {name:"图表",icon:"chart",enable:false},
        {name:"表格",icon:"grid"},
        {name:"选择器",icon:"selector"}
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

}]);