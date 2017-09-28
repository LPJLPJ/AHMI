//create:LH 2017/09/26

$(function(){

    var currentVideo;
    initAll();

    function initAll(){
        initQA();
        initVedioModal();
        initMyQuestion();
    }

    //常见问题模块初始化
    function initQA(){
        // $(".my-Block").odd
    }
    //vedio序列初始化
    function initVedioModal(){
        //
    }
    //我要提问模块初始化
    function initMyQuestion(){
        //
    }

    //为视频预览添加hover-play效果
    $(".view-box").hover(function(){
        $(this).find(".my-play-icon").addClass("my-play-icon-hover");
        $(this).find(".s-mask").addClass("s-mask-hover");
    },function(){
        $(this).find(".my-play-icon").removeClass("my-play-icon-hover");
        $(this).find(".s-mask").removeClass("s-mask-hover");
    });

    //从模态框的视频序列中选择要播放的视频
    $(".view-box").click(function(){
        var cur=$(this).parents(".view-box").find(".my-font-h2")?$(this).parents(".view-box"):$(this);
        var txt=cur.context.innerText;

        if(txt.search(/视频1/)>0){
            currentVideo=$("#myModal").find("#video1");
        }else if(txt.search(/星凯龙视频/)>0){
            currentVideo=$("#myModal").find("#video2");
        }
        currentVideo.css("display","block");

    });
    $("#myModal").on("hidden.bs.modal", function(){
        currentVideo.css("display","none");
    });


    //打开模态框时，模态框居中
    $("#myModal").on("show.bs.modal", centerModals);
    //禁用空白处点击关闭
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false,//禁止键盘
        show:false
    });
    //页面大小变化是仍然保证模态框水平垂直居中
    $(window).on('resize', centerModals);

    //模态框居中
    function centerModals() {
        $("#myModal").each(function(i) {
            var $clone = $(this).clone().css('display','block').appendTo('body');
            var top = Math.round(($clone.height() - $clone.find('.my-video-modal').height()) / 4);
            top = top > 0 ? top : 0;
            // var left = Math.round(($clone.find('.modal-dialog').width() - $clone.find('.my-video-modal').width()) / 2);
            $clone.remove();
            $(this).find('.modal-content').css("margin-top", top);
            // $(this).find('.modal-content').css("margin-left", left);
        });
    }

    //点击问题，显示答案
    $(".my-question").click(function(){
        $(this).next().slideToggle("slow");
    });

    //根据留言角色显示邮箱输入框
    $(".my-radio").on("click",function(){
        console.log($("input[name='loginUser']:checked").val());
        if($("input[name='loginUser']:checked").val()==="true"){
            $("#guestInfo").slideUp();
        }else{
            $("#guestInfo").slideDown();
        }
    });

    //我的问题-提交
    $("#questionSubmit").click(function(){
        var userName="";
        var email="";
        //验证输入的问题是不是为空
        var questionTxt=$("#questionTxt").val();
        if(isEmpty(questionTxt)){
            alert("问题不能为空！");
            return;
        }

        //
        var loginUser=$("input[name='loginUser']:checked").val();
        if(loginUser==="true"){
            var isLogin="false";
            //验证登陆状态
            //..................................

            if(isLogin=="false"){//没有登陆
                alert("请先登录！");
                return;
            }else{//已登录
                //get userName & guestMail
            }
        }else{
            //验证游客邮箱
            email=$("input[aria-describedby='guestMail']").val();
            if(isEmail(email)){
                userName=$("input[aria-describedby='guestName']").val();
                alert("success!");
            }else{
                alert("请输入正确的邮箱地址！");
                return;
            }

        }
        //提交问题
        //...........
        alert("问题已经提交，请稍作等待，我们会尽快通过邮箱给您反馈^^");

        //正确提交问题后重新加载模块
        // initMyQuestion();
    });

    //判断字符串是否为空
    function isEmpty( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    //判断邮箱格式是否正确
    function isEmail(str) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(str);
    }


    });