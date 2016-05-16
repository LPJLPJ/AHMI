ide.controller('addWidgetController',['$scope', function ($scope) {
    $scope.widgets=[
        {name:"图像",icon:"&#xe630;",enable:false},
        {name:"文本",icon:"&#xe62b;",enable:false},
        {name:"多层纹理",icon:"&#xe640;",enable:true},
        {name:"进度条",icon:"&#xe62a;",enable:true},
        {name:"仪表盘",icon:"&#xe632;",enable:true},
        {name:"示波器",icon:"&#xe62d;",enable:false},
        {name:"色块",icon:"&#xe629;",enable:false},
        {name:"动画",icon:"&#xe633;",enable:false},
        {name:"消息",icon:"&#xe62c;",enable:false},
        {name:"数字框",icon:"&#xe631;",enable:true},
        {name:"文本框",icon:"&#xe62f;",enable:true},
        {name:"按钮",icon:"&#xe636;",enable:true},
        {name:"旋钮",icon:"&#xe628;",enable:false},
        {name:"滑块",icon:"&#xe62e;",enable:false},
        {name:"按钮组",icon:"&#xe637;",enable:true},
        {name:"触发器",icon:"&#xe634;",enable:false}
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