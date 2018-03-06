/**
 * Created by tang 2018/01/02
 */
$(function(){
    (function($){
        $.ruler=function(){
            //自定义输入弹出框
            var tpl='<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="rulerModal"><div class="modal-dialog modal-sm" role="document"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">生成指定坐标线</h4> </div> <div class="modal-body"> <label><input type="radio" checked="checked" class="form-group-sm" name="coord" id="createX"/>X</label><label><input type="radio" class="form-group-sm" name="coord" id="createY"/>Y</label><input type="number" class="form-control" id="coordCreat"/></div><div class="modal-footer"><button class="btn btn-primary" id="rulerOk" data-dismiss="modal">确定</button><button class="btn btn-warning" data-dismiss="modal">取消</button></div></div></div></div>';
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
                    console.log(2);
                    var id="lineX"+($(".lineX").length+1),
                        tpl='<div class="lineX line"></div>';
                    $(tpl).appendTo(box).attr({
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
            })



            //按R弹出自定义，S隐藏显示，C清空
            $(window).keyup(function(e){
                var line=$('div.line'),r=82,s=83,c=67,key= e.keyCode;
                if(key===r&&$('.ruler').css('display')==='block'){
                    $("#rulerModal").modal();
                }
                if(key===s&&line.length>0){
                    if(line.css('display')==='block'){
                        line.hide();
                    }else{
                        line.show();
                    }
                }
                if(key===c&&line.length>0){
                    line.remove();
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
    })(jQuery);
});
