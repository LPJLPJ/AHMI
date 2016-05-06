/**
 * Created by lenovo on 2016/3/2.
 */
$(document).ready(function() {


    //添加项目
    $(".btn-primary:first").click(function(){

        /*var _html=$(".all ul li:nth-child(2)").html();
        $(".all ul li:eq(0)").after("<li>"+_html+"</li>");*/
        var _html="<li><div class='img'><i class='iconfont'>&#xe607;</i><a href='#'><img src='../images/Grgc/pro_1.png'></a><div class='img_bot'><div class='img_bg'></div><div class='img_bot_test'><a href='#'>编辑</a><a href='#'>预览</a></div></div></div><p class='text'><span>项目名称</span><span class='day'> </span></p></li>";
        $(".all ul li:eq(0)").after(_html);

        //时间
        var d=new Date();
        m=d.getMonth()+1;
        day=d.getDate();
        $(".day").text(m+"."+day);

        //项目名称
        var _input=$(".modal_input").val();
        if(_input==""){
            $(".text span:first").text("项目名称");
        }else{
            $(".text span:first").text(_input);
        };



        $(".img").hover(function () {
            var _this = $(".img").index($(this));
            $(".img_bot:eq(" + _this + ")").stop().css({"display": "block"});
            $(".img i:eq(" + _this + ")").css({"display": "block"});
        }, function () {
            $(".img_bot").stop().css({"display": "none"});
            $(".img i").css({"display": "none"});
        });

        $(".iconfont").not(".all ul li .iconfont:first").click(function () {
            if (confirm("确认要删除？")==true) {
                $(this).parents(".all ul li").remove();
            };
        });

        $(".text span:nth-child(1)").dblclick(function () {
            var span = $(this);
            var txt = $(this).text();
            var input = $("<input type='text'class='ent' value='" + txt + "'/>");
            span.html(input);
            //获取焦点
            input.trigger("focus");
            input.click(function() {
                txt=span.html();
                return false;
            });
            input.keydown(function(e){
                var newtxt=$(this).val();
                if(e.keyCode == 13 || e.keyCode == 108){
                    span.html(newtxt);
                };
            });
//文本框失去焦点后提交内容，重新变为文本
            input.blur(function () {
                var newtxt = $(this).val();
//判断文本有没有修改
                if (newtxt != txt) {
                    span.html(newtxt);
                }else{
                    span.html("项目名称");
                };
            });
        });
    });


    $(".right").hover(function(){
        $(".menu").stop().animate({"height":"60px"})
    },function(){
        $(".menu").stop().animate({"height":"0px"})
    })
});