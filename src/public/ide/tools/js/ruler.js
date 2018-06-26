/**
 * Created by tang on 2018/01/02
 */
$(function(){
    (function($){
        //辅助线
        $.ruler=function(){
            //自定义输入弹出框
            var tpl='<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="rulerModal"><div class="modal-dialog modal-sm" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">生成指定坐标线</h5> </div> <div class="modal-body"> <label><input type="radio" checked="checked" class="form-group-sm" name="coord" id="createX"/>X</label><label><input type="radio" class="form-group-sm" name="coord" id="createY"/>Y</label><input type="number" class="form-control" id="coordCreat"/></div><div class="modal-footer"><button class="btn btn-primary" id="rulerOk" data-dismiss="modal">确定</button><button class="btn btn-warning" data-dismiss="modal">取消</button></div></div></div></div>';
            $('body').append(tpl);

            var box=$("#stage"),
                rulerWidth=2000,
                rulerHeight=1000,
                doDrag=null,
                drag=false,
                showCoord=false,
                rulerSwitch=false;


            //刻度尺与拖拽虚线
            $('<div id="rulerX" class="ruler"></div><div id="rulerY" class="ruler"></div><div id="dotLineX"></div><div id="dotLineY"></div><span id="coordNum"></span>').appendTo(box);

            var dotLineX=$('#dotLineX'),
                dotLineY=$('#dotLineY'),
                coordNum=$('#coordNum');
            var draw={
                //绘制尺子刻度
                drawRulerNum:function(){
                    var rulerX=$("#rulerX"),rulerY=$("#rulerY");
                    rulerX.css('width',rulerWidth+'px');
                    rulerY.css('height',rulerHeight+'px');
                    //刻度条
                    for(var i= 0;i<rulerWidth;i++){
                        if(i%50===0){
                            $('<span class="rulerNumX">'+i+'</span>').css("left",i+2).appendTo(rulerX);
                        }
                    }
                    for(var i= 0;i<rulerHeight;i++){
                        if(i%50===0){
                            $('<span class="rulerNumY">'+i+'</span>').css("top",i+2).appendTo(rulerY);
                        }
                    }
                },

                //绘制坐标线
                drawLineX:function(){
                    var id="lineX"+($(".lineX").length+1);
                    $('<div class="lineX line"></div>').appendTo(box).attr({
                        "id":id
                    }).css('top','0');
                    return $('#'+id);
                },
                drawLineY:function(){
                    var id="lineY"+($(".lineY").length+1);
                    $('<div class="lineY line"></div>').appendTo(box).attr({
                        "id":id
                    }).css('left','0');
                    return $("#"+id);
                },

                //拖拽更改坐标位置
                dragX:function(){
                    showCoord=true;
                    dotLineY.hide();
                    if(drag){
                        box.on('mousemove',function(e){
                            if(drag){
                                var t= e.pageY-$(this).offset().top,l= e.pageX-$(this).offset().left;
                                t=parseInt(t);
                                dotLineX.show().css('top',t);
                                coordNum.css({
                                    'top':t,
                                    'left':l+15
                                }).text(t).show();
                            }
                        })
                    }
                },
                dragY:function(){
                    showCoord=true;
                    dotLineX.hide();
                    if(drag){
                        box.on('mousemove',function(e){
                            if(drag){
                                var l= e.pageX-$(this).offset().left,t= e.pageY-$(this).offset().top;
                                l=parseInt(l);
                                dotLineY.show().css('left',l);
                                coordNum.css({
                                    'top':t+15,
                                    'left':l
                                }).text(l).show();
                            }
                        })
                    }
                },
                rulerControl:function(){
                    var ruler=$('.ruler');
                    $('#ruler').on('click',function(){
                        if(ruler.css('display')==='none'){
                            ruler.show();
                            $('.line').show();
                            rulerSwitch=true;
                        }else{
                            ruler.hide();
                            $('.line').hide();
                            rulerSwitch=false;
                        }
                    });
                },
                init:function(){
                    draw.drawRulerNum();
                    draw.rulerControl();
                }
            };
            draw.init();


            //从刻度拖拽到界面生成水平垂直线
            //从界面拖拽到刻度界面移除
            $('#rulerX').on('mousedown',function(e){
                doDrag=draw.drawLineX();
                drag=true;
                draw.dragX();
            }).mouseup(function(){
                doDrag.remove();
                drag=false;
                doDrag=null;
                dotLineX.hide();
            }).mousemove(function(){
                return false;
            });

            $('#rulerY').on('mousedown',function(e){
                doDrag=draw.drawLineY();
                drag=true;
                draw.dragY();
            }).mouseup(function(){
                doDrag.remove();
                dotLineY.hide();
                doDrag=null;
                drag=false;
            }).mousemove(function(){
                return false;
            });

            //坐标线的拖拽
            box.on('mousedown','.lineX',function(){
                doDrag=$(this);
                drag=true;
                draw.dragX();
            });
            box.on('mousedown','.lineY',function(){
                doDrag=$(this);
                drag=true;
                draw.dragY();
            });

            //鼠标松下生成坐标线
            box.on('mouseup',function(e){
                $(this).unbind('mousemove');
                drag=false;
                if(doDrag){
                    if(doDrag.hasClass('lineX')){
                        var t= e.pageY-$(this).offset().top;
                        t=parseInt(t);
                        doDrag.css('top',t);
                    }else{
                        var l= e.pageX-$(this).offset().left;
                        l=parseInt(l);
                        doDrag.css('left',l);
                    }
                }
                doDrag=null;
                dotLineX.hide();
                dotLineY.hide();
                coordNum.hide();
                showCoord=false;
            });



            //按alt+R弹出自定义生成line，alt+C清空line
            $(window).keydown(function(e){
                var line=$('div.line'),display=$(".ruler").css('display');
                var r=82,c=67,key= e.keyCode,altKey = e.altKey;
                if(display=='block'){
                    if(altKey&&key===r){
                        $("#rulerModal").modal();
                    }

                    if(altKey&&key===c&&line.length>0){
                        line.remove();
                    }
                }

            });
            $("#rulerOk").click(function(){
                var msg="超出设置范围",
                    stage=$("#myStageTable"),
                    maxWidth=stage.css('width').replace('px',''),
                    maxHeight=stage.css('height').replace('px','');

                var coordCreat=parseInt($("#coordCreat").val());
                if($("#createX").prop("checked")){
                    if(0<coordCreat&&coordCreat<=maxHeight){
                        doDrag=draw.drawLineX();
                        doDrag.css("top",coordCreat+'px');
                        doDrag=null;
                    }else{
                        alert(msg)
                    }
                }else{
                    if(0<coordCreat&&coordCreat<=maxWidth){
                        doDrag=draw.drawLineY();
                        doDrag.css("left",coordCreat+'px');
                        doDrag=null;
                    }else{
                        alert(msg)
                    }
                }
            });

            //坐标线鼠标悬停显示坐标数
            box.on('mouseover','.lineX',function(e){
                if(!showCoord){
                    var l= e.pageX-$(this).offset().left;
                    l=parseInt(l);
                    var t=$(this).css('top');
                    coordNum.css({
                        'top':t,
                        'left':l+'px'
                    }).text(t.replace('px','')).stop().fadeIn(200);
                }
            }).on('mouseout','.lineX',function(){
                if(!drag){
                    coordNum.stop().fadeOut(800);
                    showCoord=false;
                }
            });
            box.on('mouseover','.lineY',function(e){
                if(!showCoord){
                    var t= e.pageY-$(this).offset().top;
                    t=parseInt(t);
                    var l=$(this).css('left');
                    coordNum.css({
                        'top':t+'px',
                        'left':l
                    }).text(l.replace('px','')).stop().fadeIn(200);
                }
            }).on('mouseout','.lineY',function(){
                if(!drag){
                    coordNum.stop().fadeOut(800);
                    showCoord=false;
                }
            });

            //运行状态下隐藏
            $('.runProject').click(function(){
                if(rulerSwitch){
                    $('.ruler').hide();
                    $('.line').hide();
                }
            });
            $('.offProject').click(function(){
                if(rulerSwitch){
                    $('.ruler').show();
                    $('.line').show();
                }
            })
        };
        $.ruler();

        //模具框
        $.mask=function(){
            var maskWrap='<div id="maskWrap"></div><div class="maskCoor" id="mask_LT" draggable="false"></div><div class="maskCoor" id="mask_T" draggable="true"></div><div class="maskCoor" id="mask_RT" draggable="true"></div><div class="maskCoor" id="mask_LM" draggable="true"></div><div class="maskCoor" id="mask_RM" draggable="true"></div><div class="maskCoor" id="mask_LB" draggable="true"></div><div class="maskCoor" id="mask_B" draggable="true"></div><div class="maskCoor" id="mask_RB" draggable="true"></div>';
            var _mask=$("#mask"),_wrap=$("#stage");
            _mask.append(maskWrap);
            var _maskCoor=$("div .maskCoor");

            //绘制样式
            var maskParams=[
                {left:'-8px',top:'-8px',cursor:'nw-resize'},
                {top:'-8px',left:'calc(50% - 8px)',cursor:'s-resize'},
                {right:'-8px',top:'-8px',cursor:'ne-resize'},
                {left:'-8px',top:'calc(50% - 8px)',cursor:'w-resize'},
                {right:'-8px',top:'calc(50% - 8px)',cursor:'w-resize'},
                {left:'-8px',bottom:'-8px',cursor:'ne-resize'},
                {left:'calc(50% - 8px)',bottom:'-8px',cursor:'s-resize'},
                {right:'-8px',bottom:'-8px',cursor:'nw-resize'}
            ];
            _maskCoor.each(function(n){
                _maskCoor.eq(n).css(maskParams[n]);
            });

            var dragParams={
                left: 0,
                top: 0,
                width:0,
                height:0,
                currentX: 0,
                currentY: 0,
                nowX:0,
                nowY:0,
                dragType:null,
                drag:false
            };

            var maskDrag=function(target,point,type){
                //鼠标按下记录当前按下坐标
                var ratio=null;
                point.on('mousedown',function(e){
                    dragParams.width=parseInt(target.css('width'));
                    dragParams.height=parseInt(target.css('height'));
                    dragParams.left=parseInt(target.css('left'));
                    dragParams.top=parseInt(target.css('top'));
                    dragParams.dragType=type;
                    dragParams.drag=true;
                    dragParams.nowX=parseInt(e.pageX-_wrap.offset().left);
                    dragParams.nowY=parseInt(e.pageY-_wrap.offset().top);

                    ratio=dragParams.width/dragParams.height;
                    return false;
                });

                //松开记录最终尺寸和坐标
                $(document).on('mouseup',function(){
                    dragParams.width=parseInt(target.css('width'));
                    dragParams.height=parseInt(target.css('height'));
                    dragParams.left=parseInt(target.css('left'));
                    dragParams.top=parseInt(target.css('top'));
                    dragParams.drag=false;
                });

                //鼠标拖拽计算
                $(document).on('mousemove',function(e){
                    if(dragParams.drag){
                        var cssParams=null;
                        dragParams.currentX=parseInt(e.pageX-_wrap.offset().left);
                        dragParams.currentY=parseInt(e.pageY-_wrap.offset().top);

                        switch (dragParams.dragType)
                        {
                            case 'mb'://中间
                                cssParams={
                                    top:(dragParams.top+(dragParams.currentY-dragParams.nowY))+'px',
                                    left:(dragParams.left+(dragParams.currentX-dragParams.nowX))+'px'
                                };
                                break;
                            case 'lt'://左上
                                if((dragParams.top-(dragParams.top-dragParams.currentY))>(dragParams.top+dragParams.height)&&(dragParams.left-(dragParams.nowX-dragParams.currentX))<(dragParams.left+dragParams.width)){
                                    cssParams={
                                        left:(dragParams.left-(dragParams.nowX-dragParams.currentX))+'px',
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        top:(dragParams.top+dragParams.height)+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }else if((dragParams.left-(dragParams.nowX-dragParams.currentX))>(dragParams.left+dragParams.width)&&(dragParams.top-(dragParams.top-dragParams.currentY))<(dragParams.top+dragParams.height)){
                                    cssParams={
                                        left:(dragParams.left+dragParams.width)+'px',
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        top:(dragParams.top-(dragParams.top-dragParams.currentY))+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }else if((dragParams.top-(dragParams.top-dragParams.currentY))>(dragParams.top+dragParams.height)&&(dragParams.left-(dragParams.nowX-dragParams.currentX))>(dragParams.left+dragParams.width)){
                                    cssParams={
                                        left:(dragParams.left+dragParams.width)+'px',
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        top:(dragParams.top+dragParams.height)+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }else{
                                    cssParams={
                                        left:(dragParams.left-(dragParams.nowX-dragParams.currentX))+'px',
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        top:(dragParams.top-(dragParams.top-dragParams.currentY))+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }
                                break;
                            case 't'://上
                                if((dragParams.top-(dragParams.top-dragParams.currentY))>(dragParams.top+dragParams.height)){
                                    cssParams={
                                        top:(dragParams.top+dragParams.height)+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }else{
                                    cssParams={
                                        top:(dragParams.top-(dragParams.top-dragParams.currentY))+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }
                                break;
                            case 'rt'://右上
                                if((dragParams.top-(dragParams.top-dragParams.currentY))>(dragParams.top+dragParams.height)){
                                    cssParams={
                                        width:(dragParams.width+(dragParams.currentX-dragParams.nowX))+'px',
                                        top:(dragParams.top+dragParams.height)+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }else{
                                    cssParams={
                                        width:(dragParams.width+(dragParams.currentX-dragParams.nowX))+'px',
                                        top:(dragParams.top-(dragParams.top-dragParams.currentY))+'px',
                                        height:(dragParams.height+(dragParams.top-dragParams.currentY))+'px'
                                    };
                                }
                                break;
                            case 'lm'://左
                                if((dragParams.left-(dragParams.nowX-dragParams.currentX))>(dragParams.left+dragParams.width)){
                                    cssParams={
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        left:(dragParams.left+dragParams.width)+'px'
                                    };
                                }else{
                                    cssParams={
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        left:(dragParams.left-(dragParams.nowX-dragParams.currentX))+'px'
                                    };
                                }
                                break;
                            case 'rm'://右
                                cssParams={
                                    width:(dragParams.currentX-dragParams.left)+'px'
                                };
                                break;
                            case 'lb'://左下
                                if((dragParams.left-(dragParams.nowX-dragParams.currentX))>(dragParams.left+dragParams.width)){
                                    cssParams={
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        height:(dragParams.height+(dragParams.currentY-dragParams.nowY))+'px',
                                        left:(dragParams.left+dragParams.width)+'px'
                                    };
                                }else{
                                    cssParams={
                                        width:(dragParams.width+(dragParams.nowX-dragParams.currentX))+'px',
                                        height:(dragParams.height+(dragParams.currentY-dragParams.nowY))+'px',
                                        left:(dragParams.left-(dragParams.nowX-dragParams.currentX))+'px'
                                    };
                                }
                                break;
                            case 'b'://下
                                cssParams={
                                    height:(dragParams.currentY-dragParams.top)+'px'
                                };
                                break;
                            case 'rb'://右下
                                cssParams={
                                    width:(dragParams.currentX-dragParams.left)+'px',
                                    height:(dragParams.currentY-dragParams.top)+'px'
                                };
                                break;
                        }


                        target.css(cssParams)
                    }
                });
            };

            maskDrag(_mask,$("#maskWrap"),'mb');
            maskDrag(_mask,$("#mask_LT"),'lt');
            maskDrag(_mask,$("#mask_T"),'t');
            maskDrag(_mask,$("#mask_RT"),'rt');
            maskDrag(_mask,$("#mask_LM"),'lm');
            maskDrag(_mask,$("#mask_RM"),'rm');
            maskDrag(_mask,$("#mask_LB"),'lb');
            maskDrag(_mask,$("#mask_B"),'b');
            maskDrag(_mask,$("#mask_RB"),'rb');

            //点击模具框容器进入选中状态
            _mask.on('click',function(e){
                e.stopPropagation();
                $(this).children().show();
            });

            //点击容器外部取消选中状态
            _wrap.on('click',function(){
                _mask.children().not("img").hide();
            });
        };
        $.mask();

    })(jQuery);
});
