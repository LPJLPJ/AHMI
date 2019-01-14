/**
 * Created by tang on 2018/10/15.
 */

$(function(){
    //工程列表 鼠标悬停效果
    var projectList = $("#project-list");
    projectHover(projectList);
    function projectHover(main){
        main.on('mouseenter','.project-item__thumb',function(e){
            getIn($(this),e);
        }).on('mouseleave','.project-item__thumb',function(e){
            getOut($(this),e)
        });
        //方向
        function getDirection(obj,e){
            var bleft=obj.offset().left;
            var btop=obj.offset().top;

            var li_w=obj.width();
            var li_h=obj.height();

            var evt=e||window.event;
            var x=evt.pageX-bleft;
            var y=evt.pageY-btop;
            x=Math.abs(x);
            y=Math.abs(y);

            if(x>li_w){
                x=li_w-(x-li_w);
            }

            var Alltan=Math.atan(li_h/li_w);//α
            var leftTan=Math.atan(y/x);//β
            var rightTan=Math.atan(y/(li_w-x));//θ

            if(0<=leftTan&&leftTan<=Alltan&&0<=rightTan&&rightTan<=Alltan){
                return 1;
            }else if(Alltan<=leftTan&&leftTan<=Math.asin(1)&&0<=rightTan&&rightTan<=Alltan){
                return 2;
            }else if(Alltan<=leftTan&&leftTan<=Math.asin(1)&&Alltan<=rightTan&&rightTan<=Math.asin(1)){
                return 3;
            }else if(0<=leftTan&&leftTan<=Alltan&&Alltan<=rightTan&&rightTan<=Math.asin(1)){
                return 4;
            }
        }
        //移入
        function getIn(obj,e){
            var status=getDirection(obj,e);
            var li_w=obj.width();

            var that=obj.find('.project-item__hover-menu');
            var child_h=that.height();
            if(status===1){
                that.css({
                    "left":0,
                    "top":-child_h
                }).stop().animate({
                    "top":0
                },200)
            }else if(status===2){
                that.css({
                    "left":-li_w,
                    "top":0
                }).stop().animate({
                    "left":0
                },200)
            }else if(status===3){
                that.css({
                    "left":0
                }).stop().animate({
                    "top":0
                },200)
            }else if(status===4){
                that.css({
                    "left":li_w,
                    "top":0
                }).stop().animate({
                    "left":0
                },200)
            }
        }
        //移出
        function getOut(obj,e){
            var status=getDirection(obj,e);
            var li_w=obj.width();

            var that=obj.find('.project-item__hover-menu');
            var child_h=that.height();
            if(status===1){
                that.stop().animate({
                    "top":-child_h
                },200,function(){
                    $(this).css({
                        "left":0,
                        "top":child_h
                    })
                })
            }else if(status===2){
                that.stop().animate({
                    "left":-li_w
                },200,function(){
                    $(this).css({
                        "left":0,
                        "top":child_h
                    })
                })
            }else if(status===3){
                that.css({
                    "left":0
                }).stop().animate({
                    "top":child_h
                },200)
            }else if(status===4){
                that.stop().animate({
                    "left":li_w
                },200,function(){
                    $(this).css({
                        "left":0,
                        "top":child_h
                    })
                })
            }
        }
    }
});
