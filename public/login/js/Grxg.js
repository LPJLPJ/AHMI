/**
 * Created by lenovo on 2016/3/4.
 */
$(document).ready(function(){
    $(".img").hover(function(){
        $(".menu").stop().animate({"height":"60px"});
    },function(){
        $(".menu").stop().animate({"height":"0px"});
    })
})