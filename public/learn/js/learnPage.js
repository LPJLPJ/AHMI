//create:LH 2017/09/26

$(function($){

    var currentVideo;
    var videoArray=[
        {
            id:"video1",
            src1:'./source/视频1.mp4',
            src2:'./source/视频1.ogg',
            imgSrc:"./source/视频1.png",
            name:"视频1"
        },
        {
            id:"video2",
            src1:'./source/视频2.mp4',
            src2:'./source/视频2.ogg',
            imgSrc:"./source/视频2.png",
            name:"星凯龙视频"
        }

    ];
    var domcumentArray=[
        {
            url:"https://ide.graphichina.com/blog/post?id=598d0dbb9ac7a1a612096077",
            name:"自定义动画的配置2（按比例平移和缩放）"
        },
        {
            url:"https://ide.graphichina.com/blog/post?id=58e5a5db4fbaccc522e7b5be",
            name:"模板动画的使用"
        },
        {
            url:"https://ide.graphichina.com/blog/post?id=58e4922df5fd9fd508193abb",
            name:"自定义动画的配置"
        },
    ];
    var QAArray=[
        {
            question:"问题1",
            answer:"答案1"
        },
        {
            question:"问题2",
            answer:"答案2"
        },
        {
            question:"问题3",
            answer:"答案3"
        },
        {
            question:"问题4",
            answer:"答案4"
        }
    ];

    initAll();

    function initAll(){
        initVedioModal();
        initVedioBlock();
        initDomLearn();
        initQA();
        initMyQuestion();
    }


    //vedio播放模态框序列初始化
    function initVedioModal(){
        var curItem=$(".modal-body");
        var txt="";
        for(var i=0;i<videoArray.length;i++){
            txt="<video id='" + videoArray[i].id+ "' class='my-video' controls='controls'>\n" +
                "<source src='"+ videoArray[i].src1+"'>\n" +
                "<source src='"+videoArray[i].src2+"'>\n" +
                "</video>";
            curItem.append(txt);
        }
    }
    //vedio模块初始化
    function initVedioBlock(){
        var curItem=$("#vedio-body");
        var txt="";
        for(var i=0;i<videoArray.length;i++){
            txt="<li class='view-box col-lg-4 col-md-4 col-sm-4' data-toggle='modal' data-target='#myModal'>\n" +
                "<div>\n" +
                "<div class='view'>\n" +
                "<img class='img' src='"+ videoArray[i].imgSrc+"'>\n" +
                "<span class='s-mask'></span>\n" +
                "<span class='s-play'></span>\n" +
                "<img class='my-play-icon' src='./source/Play12.png'>\n" +
                "</div>\n" +
                "<span class='title my-font-h2'>"+ videoArray[i].name+"</span>\n" +
                "</div>\n" +
                "</li>";
            curItem.append(txt);
        }
    }
    //文档模块初始化
    function initDomLearn(){
        var curItem=$("#dom-learn").find("ul");
        var txt="";
        for(var i=0;i<domcumentArray.length;i++){
            txt="<li>\n" +
                "<a class='my-domLink' href='"+domcumentArray[i].url+"'>"+domcumentArray[i].name+"</a>\n" +
                "</li>";
            curItem.append(txt);
        }
    }

    //常见问题模块初始化
    function initQA(){
        var curItem=$("#QA").find("ul");
        var txt="";
        for(var i=0;i<QAArray.length;i++){
            txt="<li>\n" +
                "<div class='my-question'>"+QAArray[i].question+"</div>\n" +
                "<div class='my-answer'>"+QAArray[i].answer+"</div>\n" +
                "</li>";
            curItem.append(txt);
        }
    }

    //我要提问模块初始化
    function initMyQuestion(){
        //
        $("#questionTxt").val("");
        // $("#loginUserFalse").removeAttr("checked");
        // $("#loginUserTrue").attr("checked","true");
        $("#loginUserTrue").trigger("click");
        $("#guestInfo").slideUp();
        $("input[aria-describedby='guestName']").val("");
        $("input[aria-describedby='guestMail']").val("");
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
        for(var i=0;i<videoArray.length;i++){
            if(txt.search(videoArray[i].name)>0){
                currentVideo=$("#myModal").find("#"+videoArray[i].id);
                currentVideo.css("display","block");
                break;
            }
        }
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
            var top = Math.round(($clone.height() - $clone.find('video').height()) / 3);
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

            if(isLogin==="false"){//没有登陆
                alert("请先登录！");
                return;
            }else{//已登录
                //get userName & guestMail
            }
        }else{
            //验证游客邮箱
            email=$("input[aria-describedby='guestMail']").val();
            if(isEmail(email)){
                // userName=$("input[aria-describedby='guestName']").val();
                alert("success!");
            }else{
                alert("请输入正确的邮箱地址！");
                return;
            }

        }
        //提交问题
        //...........


        //正确提交问题后重新加载模块
        initMyQuestion();

        alert("问题已经提交，请稍作等待，我们会尽快通过邮箱给您反馈^^");
    });

    //判断字符串是否为空
    function isEmpty( str ){
        if ( str === "" ) {
            return true;
        }
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