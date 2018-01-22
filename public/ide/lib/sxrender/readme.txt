created by lixiang on 2018/1/12
github:https://github.com/USTCLX/sxrender

v1.0.0
一个轻量的canvas图形渲染工具，基于animationAPI的设计实现了一些系统自带动画效果

example
var paintBoard = new SXRender({
    id:'c',                     //canvas元素id
    w:300,                      //canvas元素宽度
    h:2000,                     //canvas元素高度
    contentW:300,               //内容宽度
    contentH:2000,              //内容高度，可滚动内容显示
    drawScrollBar:true          //是否显示滚动条
});
paintBoard.add({type:'ball',x:200,y:50,radius:50,color:'rgb(255,0,0)',draggable:true});
paintBoard.reRender();