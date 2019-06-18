ide.controller('addWidgetController', ['$scope', 'Type', function ($scope, Type) {
    // $scope.widgets=[
    //     {id:'slide',name:"图层",icon:"slide"},
    //     {id:'switch',name:"开关",icon:"switch"},
    //     {id:'progress',name:"进度条",icon:"progress"},
    //     {id:'dashboard',name:"仪表盘",icon:"dashboard"},
    //     // {name:"示波器",icon:"&#xe62d;"},
    //     {id:'rotateImg',name:"旋转图",icon:"rotate-img"},
    //     {id:'dateTime',name:"时间",icon:"time"},
    //     {id:'num',name:"数字",icon:"num"},
    //     {id:'textArea',name:"文本",icon:"text"},
    //     {id:'button',name:"按钮",icon:"button"},
    //     // {name:"旋钮",icon:"&#xe628;"},
    //     {id:'slideBlock',name:"滑块",icon:"slide-block"},
    //     {id:'buttonGroup',name:"按钮组",icon:"button-group"},
    //     {id:'scriptTrigger',name:"触发器",icon:"script-trigger"},
    //     {id:'video',name:"影像",icon:"video"},
    //     {id:'animation',name:"开机动画",icon:"animation"},
    //     {id:'texNum',name:"图层数字",icon:"tex-num"},
    //     {id:'texTime',name:"图层时间",icon:"tex-time"},
    //     {id:'touchTrack',name:"触摸追踪",icon:"touch-track"},
    //     {id:'alphaSlide',name:"透明度图层",icon:"alpha-slide"},
    //     {id:'textInput',name:"文本输入",icon:"text-input"},
    //     {id:'gallery',name:"照片栏",icon:"gallery",enable:false},
    //     {id:'alphaImg',name:"动态透明图",icon:"alpha-img"},
    //     {id:'buttonSwitch',name:"按钮开关",icon:"button-switch"},
    //     {id:'clock',name:"时钟",icon:"time"},
    //     {id:'chart',name:"图表",icon:"chart",enable:false},
    //     {id:'grid',name:"表格",icon:"grid"}
    // ];
    $scope.widgets=[
        {id:'button',name:"按钮",icon:"button"},
        {id:'buttonGroup',name:"按钮组",icon:"button-group"},
        {id:'buttonSwitch',name:"按钮开关",icon:"button-switch"},
        {id:'slide',name:"图层",icon:"slide"},
        {id:'animation',name:"开机动画",icon:"animation"},
        {id:'alphaSlide',name:"透明度图层",icon:"alpha-slide"},
        {id:'gallery',name:"照片栏",icon:"gallery",enable:false},
        {id:'switch',name:"开关",icon:"switch"},
        {id:'progress',name:"进度条",icon:"progress"},
        {id:'dashboard',name:"仪表盘",icon:"dashboard"},
        // {name:"示波器",icon:"&#xe62d;"},
        {id:'rotateImg',name:"旋转图",icon:"rotate-img"},
        {id:'alphaImg',name:"动态透明图",icon:"alpha-img"},
        {id:'dateTime',name:"时间",icon:"time"},
        {id:'texTime',name:"图层时间",icon:"tex-time"},
        {id:'clock',name:"时钟",icon:"time"},
        {id:'num',name:"数字",icon:"num"},
        {id:'texNum',name:"图层数字",icon:"tex-num"},
        {id:'textArea',name:"文本",icon:"text"},
        {id:'textInput',name:"文本输入",icon:"text-input"},
        // {name:"旋钮",icon:"&#xe628;"},
        {id:'slideBlock',name:"滑块",icon:"slide-block"},
        {id:'touchTrack',name:"触摸追踪",icon:"touch-track"},
        {id:'video',name:"影像",icon:"video"},
        {id:'chart',name:"图表",icon:"chart",enable:false},
        {id:'grid',name:"表格",icon:"grid"},
        {id:'scriptTrigger',name:"触发器",icon:"script-trigger"}  
    ];
   
    $scope.addWidget = function (index) {
        var widgets = $scope.widgets;
        if (index<0 || index >widgets.length-1){
            return;
        }
        $scope.component.tool.addWidgetByName(index);
    }

    $scope.addWidgetByName = function (name) {
       
        $scope.component.tool.addWidgetByName(name);
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