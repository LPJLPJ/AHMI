;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetCommands', [], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.WidgetCommands = factory();
    }
}(function () {
    var WidgetCommands = {};
    WidgetCommands['Button'] = {
        onInitialize: `
            var(a,0)
            set(a,'this.mode')
            set(a,3)
            if(a>=100){
                set('this.layers.1.hidden',1)
            }else{
                set('this.layers.1.hidden',0)
            }
        `,
        onMouseDown: `
            var(b,0)
            set(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',0)
                set('this.layers.1.hidden',1)
            }else{
                var(c,0)
                getTag(c)
                if(c>0){
                    setTag(0)
                }else{
                    setTag(1)
                }
            }
        `,
        onMouseUp: `
            var(b,0)
            set(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',0)
            }
        `,
        onTagChange: `
            var(a,0)
            var(b,0)
            set(b,'this.mode')
            getTag(a)
            if(b==1){
                if(a>0){
                    set('this.layers.0.hidden',0)
                    set('this.layers.1.hidden',1)
                }else{
                    set('this.layers.0.hidden',1)
                    set('this.layers.1.hidden',0)
                }
            }
        `,
        onKeyBoardLeft: `
          var(tMaxHighLightNum,0)
          set(tMaxHighLightNum,'this.maxHighLightNum')
          if (tMaxHighLightNum>0) {
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')
            if (tHighLightNum==1) {
              //hashighlight
              set('this.layers.2.hidden',0)
            }else{
              set('this.layers.2.hidden',1)
            }
          }
        `,
        onKeyBoardRight: `
          var(tMaxHighLightNum,0)
          set(tMaxHighLightNum,'this.maxHighLightNum')
          if (tMaxHighLightNum>0) {
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')
            if (tHighLightNum==1) {
              //hashighlight
              set('this.layers.2.hidden',0)
            }else{
              set('this.layers.2.hidden',1)
            }
          }
        `,
        onKeyBoardOK: `
          executeaction(5)
        `
    };

    WidgetCommands['ButtonGroup'] = {
        onInitialize: `
        `,
        onMouseDown: `
            var(a,0)
            var(b,0)
            var(c,0)
            set(c,'this.layers.length')
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            set(tMaxHighLightNum,0)   //add by lx 不知道为什么以前会用到，所以置0
            var(tSingleButtonLayers,0)
            if (tMaxHighLightNum>0) {
              set(tSingleButtonLayers,3)
            }else{
              set(tSingleButtonLayers,2)
            }
            minus(c,tSingleButtonLayers)
            set(a,'this.innerX')
            set(b,'this.innerY')
            var(lx,0)
            var(ly,0)
            var(lw,0)
            var(lh,0)
            var(rx,0)
            var(ry,0)
            while(c>=0){
                set(lx,'this.layers.c.x')
                set(ly,'this.layers.c.y')
                set(lw,'this.layers.c.width')
                set(lh,'this.layers.c.height')
                set(rx,lx)
                set(ry,ly)
                add(rx,lw)
                add(ry,lh)
                if(a>=lx){
                    if(rx>a){
                        if(b>=ly){
                            if(ry>b){
                                divide(c,tSingleButtonLayers)
                                add(c,1)
                                setTag(c)
                                set(c,0)
                            }
                        }
                    }
                }
                minus(c,tSingleButtonLayers)
            }
        `,
        onMouseUp: `
        `,
        onTagChange:`  
          var(laylen,0)                                //图层数目
          var(spacing,0)                               //按钮间距
          var(btnCnt,0)                                //按钮个数
          var(tMaxHighLightNum,0)                      //高亮数目
          var(highlightIndex,0)                        //高亮层坐标
          var(tTag,0)                                  //记录tag值
          var(t1,0)                                    //临时变量1
          var(t2,0)                                    //临时变量2
          
          //set value
          set(laylen,'this.layers.length')
          set(spacing,'this.otherAttrs.0')
          set(btnCnt,'this.otherAttrs.1')             
          set(tMaxHighLightNum,'this.maxHighLightNum')
          getTag(tTag) 
          
          if(tMaxHighLightNum>0){
            minus(laylen,1)
            set(highlightIndex,laylen)
          }
          
          //清空显示
          while(t1<laylen){
            set('this.layers.t1.hidden',0)
            add(t1,1)
            set('this.layers.t1.hidden',1)
            add(t1,1)
          }
                    
          //显示当前值
          if(tTag>0){
            if(tTag<laylen){
              multiply(tTag,2)
              minus(tTag,1)
              set('this.layers.tTag.hidden',0)
            }
          }
         
        `,
        onKeyBoardLeft: `
          var(arrange,0)
          var(laylen,0)                                //图层数目
          var(spacing,0)                               //按钮间距
          var(btnCnt,0)                                //按钮个数
          var(tMaxHighLightNum,0)                      //高亮数目
          var(highlightIndex,0)                        //高亮层坐标
          var(startValue,0)                            //当前位置,即动画起始位置
          var(stopValue,0)                             //高亮位置偏移量,即动画终止位置
          var(t1,0)                                    //临时变量
          
          //set value
          set(arrange,'this.otherAttrs.4')
          set(laylen,'this.layers.length')
          set(spacing,'this.otherAttrs.0')
          set(btnCnt,'this.otherAttrs.1')             
          set(tMaxHighLightNum,'this.maxHighLightNum')
          
          if(tMaxHighLightNum>0){
            minus(laylen,1)
            set(highlightIndex,laylen)
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')
            
            if(tHighLightNum>0){
                if(arrange==0){
                  //水平方向
                  //stopValue = (tHightLightNum-1)*(width+spacing)
                  set(stopValue,tHighLightNum)
                  minus(stopValue,1)
                  set(t1,'this.layers.0.width')
                  add(t1,'this.otherAttrs.0')
                  multiply(stopValue,t1)
                  
                  //设置动画起始与终止值
                  set(t1,'this.layers.highlightIndex.x')
                  set('this.otherAttrs.2',t1)
                  set('this.otherAttrs.3',stopValue)
                  
                  //显示高量层
                  set('this.layers.highlightIndex.hidden',0)
                }else{
                  //竖直方向
                  //stopValue = (tHightLightNum-1)*(height+spacing)
                  set(stopValue,tHighLightNum)
                  minus(stopValue,1)
                  set(t1,'this.layers.0.height')
                  add(t1,'this.otherAttrs.0') 
                  multiply(stopValue,t1)
                  
                  //设置动画起始与终止值
                  set(t1,'this.layers.highlightIndex.y')
                  set('this.otherAttrs.2',t1)
                  set('this.otherAttrs.3',stopValue)
                  print('this.otherAttrs.2','this.otherAttrs.3')
                  
                  //显示高量层
                  set('this.layers.highlightIndex.hidden',0)
                }
                starthlanimation(0)
                
            }else{
                set('this.layers.highlightIndex.hidden',1)
            } 
          }
        `,
        onKeyBoardRight: `
          var(arrange,0)
          var(laylen,0)                                //图层数目
          var(spacing,0)                               //按钮间距
          var(btnCnt,0)                                //按钮个数
          var(tMaxHighLightNum,0)                      //高亮数目
          var(highlightIndex,0)                        //高亮层坐标
          var(startValue,0)                            //当前位置,即动画起始位置
          var(stopValue,0)                             //高亮位置偏移量,即动画终止位置
          var(t1,0)                                    //临时变量
          
          //set value
          set(arrange,'this.otherAttrs.4')
          set(laylen,'this.layers.length')
          set(spacing,'this.otherAttrs.0')
          set(btnCnt,'this.otherAttrs.1')             
          set(tMaxHighLightNum,'this.maxHighLightNum')
          
          if(tMaxHighLightNum>0){
            minus(laylen,1)
            set(highlightIndex,laylen)
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')
            
            if(tHighLightNum>0){
                if(arrange==0){
                  //水平方向
                  //计算公式:stopValue = (tHightLightNum-1)*(width+spacing)
                  set(stopValue,tHighLightNum)
                  minus(stopValue,1)
                  set(t1,'this.layers.0.width')
                  add(t1,'this.otherAttrs.0')
                  multiply(stopValue,t1)
                  
                  //设置动画起始与终止值
                  set(t1,'this.layers.highlightIndex.x')
                  set('this.otherAttrs.2',t1)
                  set('this.otherAttrs.3',stopValue)
                  
                  //显示高量层
                  set('this.layers.highlightIndex.hidden',0)
                }else{
                  //竖直方向
                  //stopValue = (tHightLightNum-1)*(height+spacing)
                  set(stopValue,tHighLightNum)
                  minus(stopValue,1)
                  set(t1,'this.layers.0.height')
                  add(t1,'this.otherAttrs.0') 
                  multiply(stopValue,t1)
                  
                  //设置动画起始与终止值
                  set(t1,'this.layers.highlightIndex.y')
                  set('this.otherAttrs.2',t1)
                  set('this.otherAttrs.3',stopValue)
                  print('this.otherAttrs.2','this.otherAttrs.3')
                  
                  //显示高量层
                  set('this.layers.highlightIndex.hidden',0)
                }
                starthlanimation(0)
            }else{
                set('this.layers.highlightIndex.hidden',1)
            } 
          }
        `,
        onKeyBoardOK: `
          var(tHighLightNum,0)
          var(laylen,0)
          
          set(tHighLightNum,'this.highLightNum')
          set(laylen,'this.layers.length')
          
          if(tHighLightNum>0){
            minus(laylen,1)
            if(tHighLightNum<laylen){
               print(tHighLightNum,'tHighLightNum')
               setTag(tHighLightNum)
            }
          }
        `,
        onHighlightFrame: `
          //curHLAnimationFactor理论上为0~1的小数，为了指令的计算取curHLAnimationFactor理论上为0~1000的正数
          
          var(highlightIndex,0)                     //高亮层坐标
          var(tFactor,0)                            //动画进度
          var(startValue,0)                         //起始值
          var(stopValue,0)                          //结束值
          var(offset,0)                             //偏移值
          var(arrange,0)
          
          set(arrange,'this.otherAttrs.4')
          set(highlightIndex,'this.layers.length')
          minus(highlightIndex,1)
          set(tFactor,'this.curHLAnimationFactor')
          set(startValue,'this.otherAttrs.2')
          set(stopValue,'this.otherAttrs.3')
          set(offset,stopValue)
          
          //公式:offset = startValue + (stopValue-startValue)*curHLAnimationFactor/1000
          minus(offset,startValue)
          multiply(offset,tFactor)
          divide(offset,1000)
          add(offset,startValue)
          // print(tFactor,offset)
          
          if(arrange==0){
            set('this.layers.highlightIndex.x',offset)
          }else{
            set('this.layers.highlightIndex.y',offset)
          }
          
        `
    };

    WidgetCommands['Dashboard'] = {
        onInitialize: `
        `,
        onMouseDown: ``,
        onMouseUp: ``,
        onTagChange: `
            var(toffsetValue,0)
            var(tminValue,0)
            var(tmaxValue,0)
            var(tminAngle,0)
            var(tmaxAngle,0)
            var(ttagValue,0)
            var(tangleDist,0)   
            set(tminValue,'this.minValue')
            set(tmaxValue,'this.maxValue')
            set(tminAngle,'this.minAngle')
            set(tmaxAngle,'this.maxAngle')
            set(tangleDist,tmaxAngle)
            minus(tangleDist,tminAngle)
            var(ttempDist,0)
            set(toffsetValue,'this.otherAttrs.0')
            getTag(ttagValue)
            if (ttagValue>tmaxValue) {
                set(ttagValue,tmaxValue)
            }
            if (ttagValue<tminValue) {
                set(ttagValue,tminValue)
            }
            var(tTotalFrame,0)
            set(tTotalFrame,'this.totalFrame')
            if (tTotalFrame>0) {
              var(tOldValue,0)
              set(tOldValue,'this.oldValue')
              set('this.startAnimationTag',tOldValue)
              set('this.stopAnimationTag',ttagValue)
              
            }else{
              set(ttempDist,tmaxValue)
              minus(ttempDist,tminValue)
              var(ttagDist,0)
              set(ttagDist,ttagValue)
              minus(ttagValue,tminValue)
              var(tvalueRatio,0)
              set(tvalueRatio,ttagDist)
              multiply(tvalueRatio,tangleDist)
              divide(tvalueRatio,ttempDist)
              add(tvalueRatio,tminAngle)
              var(tclockwise,0)
              var(tStartAngle,0)
              set(tclockwise,'this.otherAttrs.1')
              if (tclockwise==1) {
                  add(tvalueRatio,45)
                  add(tvalueRatio,toffsetValue)
                  add(tStartAngle,toffsetValue)
                  add(tStartAngle,90)
              }else{
                  var(uValueRatio,0)
                  minus(uValueRatio,tvalueRatio)
                  minus(uValueRatio,toffsetValue)
                  set(tvalueRatio,uValueRatio)
                  minus(tStartAngle,toffsetValue)
                  add(tStartAngle,90)
                  add(tvalueRatio,45)
              }
              var(tp1x,0)
              var(tp1y,0)
              var(tMode,0)
              var(talpha,0)
              var(tbeta,0)
              set(tMode,'this.mode')
              if (tMode==1) {
                  set('this.layers.1.rotateAngle',tvalueRatio)
              }
              if (tMode==0) {
                  set('this.layers.1.rotateAngle',tvalueRatio)
              }
              add(tvalueRatio,45)
              if (tMode==1) {
                  set(tp1x,'this.layers.1.x')
                  set(tp1y,'this.layers.1.y')
                  set('this.layers.2.subLayers.roi.p1x',tp1x)
                  set('this.layers.2.subLayers.roi.p1y',tp1y)
                  if (tclockwise==1) {
                      set('this.layers.2.subLayers.roi.alpha',tStartAngle)
                      set('this.layers.2.subLayers.roi.beta',tvalueRatio)
                  }else{
                      set('this.layers.2.subLayers.roi.alpha',tvalueRatio)
                      set('this.layers.2.subLayers.roi.beta',tStartAngle)
                  }

              }else{
                  if (tMode==2) {
                      set(tp1x,'this.layers.0.width')
                      set(tp1y,'this.layers.0.height')
                      divide(tp1x,2)
                      divide(tp1y,2)
                      set('this.layers.0.subLayers.roi.p1x',tp1x)
                      set('this.layers.0.subLayers.roi.p1y',tp1y)
                      if (tclockwise==1) {
                          set('this.layers.0.subLayers.roi.alpha',tStartAngle)
                          set('this.layers.0.subLayers.roi.beta',tvalueRatio)
                      }else{
                          set('this.layers.0.subLayers.roi.alpha',tvalueRatio)
                          set('this.layers.0.subLayers.roi.beta',tStartAngle)
                      }
                  }
              }
            }
            checkalarm(0)
            
            set('this.oldValue',ttagValue)
            if (tTotalFrame>0) {
              startanimation(0)
            }

        `,
        onAnimationFrame: `
          var(tStartTag,0)
          var(tStopTag,0)
          set(tStartTag,'this.startAnimationTag')
          set(tStopTag,'this.stopAnimationTag')
          var(tTotalFrame,0)
          set(tTotalFrame,'this.totalFrame')
          var(tCurFrame,0)
          set(tCurFrame,'this.nowFrame')
          var(tCurTag,0)
          var(tDist,0)
          set(tDist,tStopTag)
          minus(tDist,tStartTag)
          multiply(tDist,tCurFrame)
          divide(tDist,tTotalFrame)
          add(tDist,tStartTag)
          set(tCurTag,tDist)
          set('this.curAnimationTag',tCurTag) //set AnTag 
          var(toffsetValue,0)
          var(tminValue,0)
          var(tmaxValue,0)
          var(tminAngle,0)
          var(tmaxAngle,0)
          var(ttagValue,0)
          var(tangleDist,0)   
          set(tminValue,'this.minValue')
          set(tmaxValue,'this.maxValue')
          set(tminAngle,'this.minAngle')
          set(tmaxAngle,'this.maxAngle')
          set(tangleDist,tmaxAngle)
          minus(tangleDist,tminAngle)
          var(ttempDist,0)
          set(toffsetValue,'this.otherAttrs.0')
          set(ttagValue,tCurTag)
          if (ttagValue>tmaxValue) {
              set(ttagValue,tmaxValue)
          }
          if (ttagValue<tminValue) {
              set(ttagValue,tminValue)
          }
          set(ttempDist,tmaxValue)
          minus(ttempDist,tminValue)
          var(ttagDist,0)
          set(ttagDist,ttagValue)
          minus(ttagValue,tminValue)
          var(tvalueRatio,0)
          set(tvalueRatio,ttagDist)
          multiply(tvalueRatio,tangleDist)
          divide(tvalueRatio,ttempDist)
          add(tvalueRatio,tminAngle)
          var(tclockwise,0)
          var(tStartAngle,0)
          set(tclockwise,'this.otherAttrs.1')
          if (tclockwise==1) {
              add(tvalueRatio,45)
              add(tvalueRatio,toffsetValue)
              add(tStartAngle,toffsetValue)
              add(tStartAngle,90)
          }else{
              var(uValueRatio,0)
              minus(uValueRatio,tvalueRatio)
              minus(uValueRatio,toffsetValue)
              set(tvalueRatio,uValueRatio)
              minus(tStartAngle,toffsetValue)
              add(tStartAngle,90)
              add(tvalueRatio,45)
          }
          var(tp1x,0)
          var(tp1y,0)
          var(tMode,0)
          var(talpha,0)
          var(tbeta,0)
          set(tMode,'this.mode')
          if (tMode==1) {
              set('this.layers.1.rotateAngle',tvalueRatio)
          }
          if (tMode==0) {
              set('this.layers.1.rotateAngle',tvalueRatio)
          }
          add(tvalueRatio,45)
          if (tMode==1) {
              set(tp1x,'this.layers.1.x')
              set(tp1y,'this.layers.1.y')
              set('this.layers.2.subLayers.roi.p1x',tp1x)
              set('this.layers.2.subLayers.roi.p1y',tp1y)
              if (tclockwise==1) {
                  set('this.layers.2.subLayers.roi.alpha',tStartAngle)
                  set('this.layers.2.subLayers.roi.beta',tvalueRatio)
              }else{
                  set('this.layers.2.subLayers.roi.alpha',tvalueRatio)
                  set('this.layers.2.subLayers.roi.beta',tStartAngle)
              }

          }else{
              if (tMode==2) {
                  set(tp1x,'this.layers.0.width')
                  set(tp1y,'this.layers.0.height')
                  divide(tp1x,2)
                  divide(tp1y,2)
                  set('this.layers.0.subLayers.roi.p1x',tp1x)
                  set('this.layers.0.subLayers.roi.p1y',tp1y)
                  if (tclockwise==1) {
                      set('this.layers.0.subLayers.roi.alpha',tStartAngle)
                      set('this.layers.0.subLayers.roi.beta',tvalueRatio)
                  }else{
                      set('this.layers.0.subLayers.roi.alpha',tvalueRatio)
                      set('this.layers.0.subLayers.roi.beta',tStartAngle)
                  }
              }
          }
          
        `
    };

    WidgetCommands['RotateImg'] = {
        onInitialize: `
        `,
        onTagChange: `
            var(tTagValue,0)
            getTag(tTagValue)
            var(tMinAngle,0)
            var(tMaxAngle,0)
            var(tWidth,0)
            set(tWidth,'this.layers.0.width')
            divide(tWidth,2)
            var(tHeight,0)
            set(tHeight,'this.layers.0.height')
            divide(tHeight,2)
            set(tMinAngle,'this.minValue')
            set(tMaxAngle,'this.maxValue')
            if (tTagValue>tMaxAngle) {
                set(tTagValue,tMaxAngle)
            }
            if(tTagValue<tMinAngle){
                set(tTagValue,tMinAngle)
            }
            set('this.layers.0.rotateCenterX',tWidth)
            set('this.layers.0.rotateCenterY',tHeight)
            set('this.layers.0.rotateAngle',tTagValue)
        `
    }

    WidgetCommands['Progress'] = {
        onInitialize: `
            var(mod,0)
            set(mod,'this.mode')
            var(cur,0)
            set(cur,'this.otherAttrs.19')
            set('this.layers.0.hidden',0)
            set('this.layers.1.hidden',0)
            if(cur==1){
                set('this.layers.2.hidden',0)
                set('this.layers.2.x',0)
            }
        `,
        onMouseUp: `
            
        `,
        onMouseDown: `
            
        `,
        onTagChange: `
            var(arr,0)                //方向
            set(arr,'this.arrange')        
            var(tTotalFrame,0)
            set(tTotalFrame,'this.totalFrame')
            var(m,0)
            set(m,'this.mode')
            var(tTag,0)
            getTag(tTag)
            var(min,0)
            set(min,'this.minValue')
            var(max,0)
            set(max,'this.maxValue')
            if (tTotalFrame>0) {
              var(tOldValue,0)
              set(tOldValue,'this.oldValue')
              set('this.startAnimationTag',tOldValue)
              set('this.stopAnimationTag',tTag)
            }else{
              if(tTag>=min){
               if(tTag<=max){
                  var(v,0)
                  var(temp1,0)
                  var(temp2,0)
                  set(temp1,tTag)
                  set(temp2,max)
                  minus(temp1,min)
                  minus(temp2,min)
                  var(w,0)
                  set(w,'this.layers.0.width')
                  var(h,0)
                  set(h,'this.layers.0.height')
                  if(m==0){
                    if(arr==0){
                      //水平
                      multiply(temp1,w)
                      divide(temp1,temp2)
                      set('this.layers.1.subLayers.roi.p1x',0)
                      set('this.layers.1.subLayers.roi.p1y',0)
                      set('this.layers.1.subLayers.roi.p2x',temp1)
                      set('this.layers.1.subLayers.roi.p2y',0)
                      set('this.layers.1.subLayers.roi.p3x',temp1)
                      set('this.layers.1.subLayers.roi.p3y',h)
                      set('this.layers.1.subLayers.roi.p4x',0)
                      set('this.layers.1.subLayers.roi.p4y',h)
                      set('this.layers.1.hidden',0)
                    }else{
                      //竖直
                      multiply(temp1,h)
                      divide(temp1,temp2)
                      set(temp2,h)
                      minus(temp2,temp1)
                      set('this.layers.1.subLayers.roi.p1x',0)
                      set('this.layers.1.subLayers.roi.p1y',temp2)
                      set('this.layers.1.subLayers.roi.p2x',w)
                      set('this.layers.1.subLayers.roi.p2y',temp2)
                      set('this.layers.1.subLayers.roi.p3x',w)
                      set('this.layers.1.subLayers.roi.p3y',h)
                      set('this.layers.1.subLayers.roi.p4x',0)
                      set('this.layers.1.subLayers.roi.p4y',h)
                      set('this.layers.1.hidden',0)
                    }
                      
                  }
                  if(m==1){
                      var(r1,0)
                      set(r1,'this.otherAttrs.0')
                      var(g1,0)
                      set(g1,'this.otherAttrs.1')
                      var(b1,0)
                      set(b1,'this.otherAttrs.2')
                      var(a1,0)
                      set(a1,'this.otherAttrs.3')
                      var(r2,0)
                      set(r2,'this.otherAttrs.4')
                      var(g2,0)
                      set(g2,'this.otherAttrs.5')
                
                      var(b2,0)
                      set(b2,'this.otherAttrs.6')
                      var(a2,0)
                      set(a2,'this.otherAttrs.7')
                      var(rt,0)
                      set(rt,r2)
                      var(gt,0)
                      set(gt,g2)
                      var(bt,0)
                      set(bt,b2)
                      var(at,0)
                      set(at,a2)
                      minus(rt,r1)
                      minus(gt,g1)
                      minus(bt,b1)
                      minus(at,a1)
                      multiply(rt,temp1)
                      multiply(gt,temp1)
                      multiply(bt,temp1)
                      multiply(at,temp1)
                      divide(rt,temp2)
                      divide(gt,temp2)
                      divide(bt,temp2)
                      divide(at,temp2)
                      add(rt,r1)
                      add(gt,g1)
                      add(bt,b1)
                      add(at,a1)
                      set('this.layers.1.subLayers.color.r',rt)
                      set('this.layers.1.subLayers.color.g',gt)
                      set('this.layers.1.subLayers.color.b',bt)
                      set('this.layers.1.subLayers.color.a',at)
                      
                      if(arr==0){
                        //水平
                        multiply(temp1,w)
                        divide(temp1,temp2)
                        set('this.layers.1.width',temp1)
                      }else{
                        //竖直
                        multiply(temp1,h)
                        divide(temp1,temp2)
                        set(temp2,h)
                        minus(temp2,temp1)
                        set('this.layers.1.y',temp2)
                        set('this.layers.1.height',temp1)
                      }
                      set('this.layers.1.hidden',0)
                  }
                  if(m==3){
                      var(thresM,0)
                      set(thresM,'this.otherAttrs.0')
                      var(r1,0)
                      set(r1,'this.otherAttrs.3')
                      var(g1,0)
                      set(g1,'this.otherAttrs.4')
                      var(b1,0)
                      set(b1,'this.otherAttrs.5')
                      var(a1,0)
                      set(a1,'this.otherAttrs.6')
                      var(r2,0)
                      set(r2,'this.otherAttrs.7')
                      var(g2,0)
                      set(g2,'this.otherAttrs.8')
                      var(b2,0)
                      set(b2,'this.otherAttrs.9')
                      var(a2,0)
                      set(a2,'this.otherAttrs.10')
                      if(thresM==1){
                         var(thres1,0)
                         set(thres1,'this.otherAttrs.1')
                         if(tTag<thres1){
                            set('this.layers.1.subLayers.color.r',r1)
                            set('this.layers.1.subLayers.color.g',g1)
                            set('this.layers.1.subLayers.color.b',b1)
                            set('this.layers.1.subLayers.color.a',a1)
                         }else{
                            set('this.layers.1.subLayers.color.r',r2)
                            set('this.layers.1.subLayers.color.g',g2)
                            set('this.layers.1.subLayers.color.b',b2)
                            set('this.layers.1.subLayers.color.a',a2)
                         }
                      }
                      if(thresM==2){
                         var(r3,0)
                         set(r3,'this.otherAttrs.11')
                         var(g3,0)
                         set(g3,'this.otherAttrs.12')
                         var(b3,0)
                         set(b3,'this.otherAttrs.13')
                         var(a3,0)
                         set(a3,'this.otherAttrs.14')
                         var(thres1,0)
                         set(thres1,'this.otherAttrs.1')
                         var(thres2,0)
                         set(thres2,'this.otherAttrs.2')
                         if(tTag<thres1){
                            set('this.layers.1.subLayers.color.r',r1)
                            set('this.layers.1.subLayers.color.g',g1)
                            set('this.layers.1.subLayers.color.b',b1)
                            set('this.layers.1.subLayers.color.a',a1)
                         }else{
                            if(tTag<thres2){
                                set('this.layers.1.subLayers.color.r',r2)
                                set('this.layers.1.subLayers.color.g',g2)
                                set('this.layers.1.subLayers.color.b',b2)
                                set('this.layers.1.subLayers.color.a',a2)
                            }else{
                                set('this.layers.1.subLayers.color.r',r3)
                                set('this.layers.1.subLayers.color.g',g3)
                                set('this.layers.1.subLayers.color.b',b3)
                                set('this.layers.1.subLayers.color.a',a3)
                            }
                         }

                      }
                      
                      if(arr==0){
                        //水平
                        multiply(temp1,w)
                        divide(temp1,temp2)
                        set('this.layers.1.width',temp1)
                        
                      }else{
                        //竖直
                        multiply(temp1,h)
                        divide(temp1,temp2)
                        set(temp2,h)
                        minus(temp2,temp1)
                        set('this.layers.1.y',temp2)
                        set('this.layers.1.height',temp1)
                      }
                      
                      set('this.layers.1.hidden',0)
                  }
               }
               var(cur,0)
               set(cur,'this.otherAttrs.19')
               if(cur==1){
                  set('this.layers.2.x',temp1)
               }
              }
            }
            
            checkalarm(0)
            set('this.oldValue',tTag)
            if (tTotalFrame>0) {
              startanimation(0)
            }

        `,
        onAnimationFrame: `
          var(arr,0)
          set(arr,'this.arrange')
          var(m,0)
          set(m,'this.mode')
          var(tTag,0)

          var(tStartTag,0)
          var(tStopTag,0)
          set(tStartTag,'this.startAnimationTag')
          set(tStopTag,'this.stopAnimationTag')
          var(tTotalFrame,0)
          set(tTotalFrame,'this.totalFrame')
          var(tCurFrame,0)
          set(tCurFrame,'this.nowFrame')
          var(tCurTag,0)
          var(tDist,0)
          set(tDist,tStopTag)
          minus(tDist,tStartTag)
          multiply(tDist,tCurFrame)
          divide(tDist,tTotalFrame)
          add(tDist,tStartTag)
          set(tTag,tDist)
          set('this.curAnimationTag',tTag)
          var(min,0)
          set(min,'this.minValue')
          var(max,0)
          set(max,'this.maxValue')
          if(tTag>=min){
             if(tTag<=max){
                var(v,0)
                var(temp1,0)
                var(temp2,0)
                set(temp1,tTag)
                set(temp2,max)
                minus(temp1,min)
                minus(temp2,min)
                var(w,0)
                set(w,'this.layers.0.width')
                var(h,0)
                set(h,'this.layers.0.height')
                if(m==0){
                    if(arr==0){
                      //水平
                      multiply(temp1,w)
                      divide(temp1,temp2)
                      set('this.layers.1.subLayers.roi.p1x',0)
                      set('this.layers.1.subLayers.roi.p1y',0)
                      set('this.layers.1.subLayers.roi.p2x',temp1)
                      set('this.layers.1.subLayers.roi.p2y',0)
                      set('this.layers.1.subLayers.roi.p3x',temp1)
                      set('this.layers.1.subLayers.roi.p3y',h)
                      set('this.layers.1.subLayers.roi.p4x',0)
                      set('this.layers.1.subLayers.roi.p4y',h)
                      set('this.layers.1.hidden',0)
                    }else{
                      //竖直
                      multiply(temp1,h)
                      divide(temp1,temp2)
                      set(temp2,h)
                      minus(temp2,temp1)
                      set('this.layers.1.subLayers.roi.p1x',0)
                      set('this.layers.1.subLayers.roi.p1y',temp2)
                      set('this.layers.1.subLayers.roi.p2x',w)
                      set('this.layers.1.subLayers.roi.p2y',temp2)
                      set('this.layers.1.subLayers.roi.p3x',w)
                      set('this.layers.1.subLayers.roi.p3y',h)
                      set('this.layers.1.subLayers.roi.p4x',0)
                      set('this.layers.1.subLayers.roi.p4y',h)
                      set('this.layers.1.hidden',0)
                    }
                }
                if(m==1){
                    var(r1,0)
                    set(r1,'this.otherAttrs.0')
                    var(g1,0)
                    set(g1,'this.otherAttrs.1')
                    var(b1,0)
                    set(b1,'this.otherAttrs.2')
                    var(a1,0)
                    set(a1,'this.otherAttrs.3')
                    var(r2,0)
                    set(r2,'this.otherAttrs.4')
                    var(g2,0)
                    set(g2,'this.otherAttrs.5')
                    var(b2,0)
                    set(b2,'this.otherAttrs.6')
                    var(a2,0)
                    set(a2,'this.otherAttrs.7')
                    var(rt,0)
                    set(rt,r2)
                    var(gt,0)
                    set(gt,g2)
                    var(bt,0)
                    set(bt,b2)
                    var(at,0)
                    set(at,a2)
                    minus(rt,r1)
                    minus(gt,g1)
                    minus(bt,b1)
                    minus(at,a1)
                    multiply(rt,temp1)
                    multiply(gt,temp1)
                    multiply(bt,temp1)
                    multiply(at,temp1)
                    divide(rt,temp2)
                    divide(gt,temp2)
                    divide(bt,temp2)
                    divide(at,temp2)
                    add(rt,r1)
                    add(gt,g1)
                    add(bt,b1)
                    add(at,a1)
                    set('this.layers.1.subLayers.color.r',rt)
                    set('this.layers.1.subLayers.color.g',gt)
                    set('this.layers.1.subLayers.color.b',bt)
                    set('this.layers.1.subLayers.color.a',at)
                    if(arr==0){
                        //水平
                        multiply(temp1,w)
                        divide(temp1,temp2)
                        set('this.layers.1.width',temp1)
                      }else{
                        //竖直
                        multiply(temp1,h)
                        divide(temp1,temp2)
                        set(temp2,h)
                        minus(temp2,temp1)
                        set('this.layers.1.y',temp2)
                        set('this.layers.1.height',temp1)
                      }
                    set('this.layers.1.hidden',0)
                }
                if(m==3){
                    var(thresM,0)
                    set(thresM,'this.otherAttrs.0')
                    var(r1,0)
                    set(r1,'this.otherAttrs.3')
                    var(g1,0)
                    set(g1,'this.otherAttrs.4')
                    var(b1,0)
                    set(b1,'this.otherAttrs.5')
                    var(a1,0)
                    set(a1,'this.otherAttrs.6')
                    var(r2,0)
                    set(r2,'this.otherAttrs.7')
                    var(g2,0)
                    set(g2,'this.otherAttrs.8')
                    var(b2,0)
                    set(b2,'this.otherAttrs.9')
                    var(a2,0)
                    set(a2,'this.otherAttrs.10')
                    if(thresM==1){
                       var(thres1,0)
                       set(thres1,'this.otherAttrs.1')
                       if(tTag<thres1){
                          set('this.layers.1.subLayers.color.r',r1)
                          set('this.layers.1.subLayers.color.g',g1)
                          set('this.layers.1.subLayers.color.b',b1)
                          set('this.layers.1.subLayers.color.a',a1)
                       }else{
                          set('this.layers.1.subLayers.color.r',r2)
                          set('this.layers.1.subLayers.color.g',g2)
                          set('this.layers.1.subLayers.color.b',b2)
                          set('this.layers.1.subLayers.color.a',a2)
                       }
                    }
                    if(thresM==2){
                       var(r3,0)
                       set(r3,'this.otherAttrs.11')
                       var(g3,0)
                       set(g3,'this.otherAttrs.12')
                       var(b3,0)
                       set(b3,'this.otherAttrs.13')
                       var(a3,0)
                       set(a3,'this.otherAttrs.14')
                       var(thres1,0)
                       set(thres1,'this.otherAttrs.1')
                       var(thres2,0)
                       set(thres2,'this.otherAttrs.2')
                       if(tTag<thres1){
                          set('this.layers.1.subLayers.color.r',r1)
                          set('this.layers.1.subLayers.color.g',g1)
                          set('this.layers.1.subLayers.color.b',b1)
                          set('this.layers.1.subLayers.color.a',a1)
                       }else{
                          if(tTag<thres2){
                              set('this.layers.1.subLayers.color.r',r2)
                              set('this.layers.1.subLayers.color.g',g2)
                              set('this.layers.1.subLayers.color.b',b2)
                              set('this.layers.1.subLayers.color.a',a2)
                          }else{
                              set('this.layers.1.subLayers.color.r',r3)
                              set('this.layers.1.subLayers.color.g',g3)
                              set('this.layers.1.subLayers.color.b',b3)
                              set('this.layers.1.subLayers.color.a',a3)
                          }
                       }

                   }
                   if(arr==0){
                     //水平
                     multiply(temp1,w)
                     divide(temp1,temp2)
                     set('this.layers.1.width',temp1)
                      
                   }else{
                     //竖直
                     multiply(temp1,h)
                     divide(temp1,temp2)
                     set(temp2,h)
                     minus(temp2,temp1)
                     set('this.layers.1.y',temp2)
                     set('this.layers.1.height',temp1)
                   }
                      
                  set('this.layers.1.hidden',0)
                }
             }
             var(cur,0)
             set(cur,'this.otherAttrs.19')
             if(cur==1){
                set('this.layers.2.x',temp1)
             }
             

             //reset oldValue
             getTag(tTag)
             set('this.oldValue',tTag)

             
            }
          
        `
    };

    WidgetCommands['TextArea'] = {
        onInitialize: ``
    };

    WidgetCommands['Switch'] = {
        onInitialize: `
            set('this.layers.0.hidden',1)
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            var(tag,0)
            var(bt,0)
            set(bt,'this.otherAttrs.0')
            getTag(tag)
            var(tBt,0)
            set(tBt,bt)
            var(t,0)
            set(t,tag)
            while(tBt>=0){
                if(tBt==0){
                    mod(t,2)
                    if(t==1){
                        set('this.layers.0.hidden',0)
                    }else{
                        set('this.layers.0.hidden',1)
                    }
                }
                divide(t,2)
                minus(tBt,1)
            }
        `
    }

    WidgetCommands['ScriptTrigger'] = {
        onInitialize: ``,
        onTagChange: `
            var(tTagValue,0)
            getTag(tTagValue)
            checkalarm(0)
            set('this.oldValue',tTagValue)
        `
    };

    WidgetCommands['Video'] = {};

    WidgetCommands['Slide'] = {
        onInitialize: `
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            var(len,0)
            set(len,'this.layers.length')
            while(len>0){
                minus(len,1)
                set('this.layers.len.hidden',1)
            }
            var(t,0)
            getTag(t)
            set('this.layers.t.hidden',0)

        `
    };

    WidgetCommands['Animation'] = {
        onInitialize: `
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            var(len,0)
            set(len,'this.layers.length')
            while(len>0){
                minus(len,1)
                set('this.layers.len.hidden',1)
            }
            var(t,0)
            getTag(t)
            set('this.layers.t.hidden',0)

        `
    };

    WidgetCommands['SlideBlock'] = {
        onInitialize: `
        `,
        onMouseUp: `
        `,
        onMouseDown: `
            var(tBx,0)
            var(tBy,0)
            var(tBw,0)
            var(tBh,0)
            var(tInnerX,0)
            var(tInnerY,0)
            var(tBrx,0)
            var(tBry,0)
            set(tBx,'this.layers.1.x')
            set(tBy,'this.layers.1.y')
            set(tBw,'this.layers.1.width')
            set(tBh,'this.layers.1.height')
            set(tBrx,tBx)
            add(tBrx,tBw)
            set(tBry,tBy)
            add(tBry,tBh)
            set(tInnerX,'this.innerX')
            set(tInnerY,'this.innerY')
            set('this.otherAttrs.4',0)
            if (tInnerX>=tBx) {
                if(tInnerX < tBrx){
                    if (tInnerY>=tBy) {
                        if (tInnerY<tBry) {
                            set('this.otherAttrs.4',1)
                            set('this.otherAttrs.0',tInnerX)
                            set('this.otherAttrs.1',tInnerY)
                            set('this.otherAttrs.5',tBx)
                            set('this.otherAttrs.6',tBy)
                        }
                    }
                }
            }
        `,
        onMouseMove: `
            var(tArrange,0)
            set(tArrange,'this.arrange')
            var(tInnerX,0)
            var(tInnerY,0)
            set(tInnerX,'this.innerX')
            set(tInnerY,'this.innerY')
            var(tHit,0)
            set(tHit,'this.otherAttrs.4')
            var(tDist,0)
            var(tLastX,0)
            var(tBx,0)
            var(tMaxLength,0)
            var(tBw,0)
            var(tMinValue,0)
            var(tMaxValue,0)
            var(tValueDist,0)
            var(tOriginX,0)
            var(tOriginY,0)
            if (tHit==1) {
                set(tOriginX,'this.otherAttrs.5')
                set(tOriginY,'this.otherAttrs.6')
                
                if (tArrange==0) {
                    set(tLastX,'this.otherAttrs.0')
                    
                    set(tDist,tInnerX)
                    minus(tDist,tLastX)
                    set(tBx,tOriginX)
                    add(tBx,tDist)
                    set(tBw,'this.layers.1.width')
                    set(tMaxLength,'this.info.width')
                    minus(tMaxLength,tBw)
                    
                }else{
                    set(tLastX,'this.otherAttrs.1')
                    
                    set(tDist,tInnerY)
                    minus(tDist,tLastX)
                    set(tBx,tOriginY)
                    add(tBx,tDist)
                    set(tBw,'this.layers.1.height')
                    set(tMaxLength,'this.info.height')
                    minus(tMaxLength,tBw)
                }

                if (tBx<0) {
                    set(tBx,0)
                }
                if (tBx>tMaxLength) {
                    set(tBx,tMaxLength)
                }
                set(tMinValue,'this.minValue')
                set(tMaxValue,'this.maxValue')
                set(tValueDist,tMaxValue)
                minus(tValueDist,tMinValue)
                multiply(tBx,tValueDist)
                divide(tBx,tMaxLength)
                add(tBx,tMinValue)
                setTag(tBx)

            }
        `,
        onTagChange: `
            var(tMinValue,0)
            var(tMaxValue,0)
            var(tValueDist,0)
            var(tTagValue,0)
            getTag(tTagValue)
            var(tCurValue,0)
            var(tMaxLength,0)
            var(tBw,0)
            set(tCurValue,tTagValue)
            set(tMinValue,'this.minValue')
            set(tMaxValue,'this.maxValue')
            if (tCurValue>tMaxValue) {
                set(tCurValue,tMaxValue)
            }
            if (tCurValue<tMinValue) {
                set(tCurValue,tMinValue)
            }
            var(tArrange,0)
            set(tArrange,'this.arrange')
            if (tArrange==0) {
                set(tMaxLength,'this.info.width')
                set(tBw,'this.layers.1.width')
            }else{
                set(tMaxLength,'this.info.height')
                set(tBw,'this.layers.1.height')
            }
            
            minus(tMaxLength,tBw)
            var(tValueDist,0)
            var(tValueRatio,0)
            set(tValueDist,tMaxValue)
            minus(tValueDist,tMinValue)
            set(tValueRatio,tCurValue)
            minus(tValueRatio,tMinValue)
            multiply(tValueRatio,tMaxLength)
            divide(tValueRatio,tValueDist)
            if (tArrange==0) {
                set('this.layers.1.x',tValueRatio)
            }else{
                set('this.layers.1.y',tValueRatio)
            }
            checkalarm(0)
            set('this.oldValue',tCurValue)


        `
    };

    WidgetCommands['Num'] = {
        onInitialize: `
            // var(tInitValue,0)
            // var(tLen,0)
            // var(tIndex,0)
            // var(tDecimalCount,0)
            // var(tDecimalIndex,0)
            // //init value
            // add(tInitValue,48)
            // set(tLen,'this.layers.length')
            // set(tDecimalCount,'this.otherAttrs.3')
            // set(tDecimalIndex,tLen)
            // if(tDecimalCount>0){
            //     minus(tDecimalIndex,1)
            //     minus(tDecimalIndex,tDecimalCount)
            // }
            // // print(tDecimalIndex,'tDecimalIndex')
            // // print(tLen,'tLen')
            // while(tIndex<tLen){
            //     // print(tIndex,'tIndex') 
            //     if(tDecimalIndex==tIndex){
            //         set('this.layers.tIndex.subLayers.font.text',46)
            //     }else{
            //         // print(tIndex,'tIndex')
            //         set('this.layers.tIndex.subLayers.font.text',tInitValue)
            //     }
            //     add(tIndex,1)
            // }
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            //清空所有数字内容
            var(tIndex,0)   //用于循环
            var(tLaysLen,0)     //图层长度
            set(tLaysLen,'this.layers.length')
            set(tIndex,0)
            while(tIndex<tLaysLen){
                set('this.layers.tIndex.subLayers.font.text',0)
                add(tIndex,1)
            }
            
           
            
            //初始化变量
            var(tCurVal,0)        //当前值
            var(tTrueCurVal,0)    //backup of tCurVal
            var(tMaxVal,0)        //最大值
            var(tMinVal,0)        //最小值
            var(hasFrontZero,0)   //是否有前导零
            var(hasSymbol,0)      //是否有符号
            var(decimalCnt,0)     //小数位数
            var(numOfDigits,0)    //字符数
            var(overflow,0)       //溢出模式，0不显示，1显示
            var(fontWidth,0)      //字符图层宽度
            var(align,0)          //对齐方式，0左，1中，2右
            var(widgetWidth,0)    //控件宽度
            var(fontSpacing,0)    //字符间距
            var(paddingRatio,0)   //padddingRatio
            
            var(initPosX,0)       //绘制起始坐标
            var(symbolCnt,0)      //要绘制的符号的个数
            var(decimalIndex,0)   //小数点的标识坐标，即在第几个图层位置绘制小数点
            var(decimalCnt,0)     //要绘制的小数点的个数
            var(decimalZeroCnt,0) //要补齐的小数点后的0的个数
            var(frontZeroCnt,0)   //要绘制的前导零的个数
            var(curValCnt,0)      //要绘制的当前值数字的个数
            var(allFontCnt,0)     //要绘制的总字符的个数
            var(tempVal,0)        //临时变量
            var(needDraw,0)       //是否需要绘制，在溢出不显示的情况下，不需要绘制。0不需要，1需要
            var(isOverflow,0)     //是否溢出
            var(tTotalFrame,0)    //总帧数
            
            getTag(tCurVal)
            print('tagVal',tCurVal)
           
            set(tTotalFrame,'this.totalFrame')
            
            if(tTotalFrame > 0){
                set(tTrueCurVal,tCurVal)
                set(tCurVal,'this.oldValue')
            }   
            set(tMaxVal,'this.maxValue')
            set(tMinVal,'this.minValue')
            set(hasFrontZero,'this.otherAttrs.1')
            set(hasSymbol,'this.otherAttrs.2')
            set(decimalCnt,'this.otherAttrs.3')
            set(numOfDigits,'this.otherAttrs.4')
            set(overflow,'this.otherAttrs.5')
            set(fontWidth,'this.otherAttrs.6')
            set(align,'this.otherAttrs.7')
            set(widgetWidth,'this.otherAttrs.8')
            set(fontSpacing,'this.otherAttrs.9')
            set(paddingRatio,'this.otherAttrs.10')      
            
            multiply(paddingRatio,fontWidth)
            
            set(needDraw,1)
            // print(needDraw,'needDrawInit')   
            
          
            
            //处理要显示的值
            if(tCurVal>tMaxVal){
                //溢出最大值
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            
            
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }
            //判断是否需要绘制
            if(needDraw==1){
                //符号
                if(hasSymbol==1){
                    if(tCurVal<0){
                        set(symbolCnt,1)
                    }
                }
                
                //当前值数字个数
                //--while 没有>=，故tCurVal为0时，curValCnt为1
                if(tCurVal<0){
                   set(tempVal,0)
                   minus(tempVal,tCurVal)
                   set(tCurVal,tempVal) 
                }
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }
                
                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }
                
                //总字符数
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)
                
                //小数  add
                set(decimalIndex,-1)
               
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt<curValCnt){
                        //小数位数小于于字符位数
                        set(decimalIndex,0)
                    }else{
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        set(decimalIndex,0)
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)
                            add(allFontCnt,decimalZeroCnt)
                        }else{
                            set(decimalIndex,0)
                        }
                    }
                    //计算小数点坐标
                    set(decimalIndex,allFontCnt)
                    minus(decimalIndex,decimalCnt)
                    minus(decimalIndex,1)
                }else{
                    set(decimalIndex,-1)
                }
               
                
                //计算起始坐标
                set(tempVal,allFontCnt)
                var(tempValW,0)     //总字符所占宽度
                var(fontWidthHalf,0) //半个字符所占宽度
                set(fontWidthHalf,fontWidth)
                divide(fontWidthHalf,2)
                
                if(tempVal>0){
                    add(tempValW,fontWidth)
                    minus(tempVal,1)
                }
                while(tempVal>0){
                   
                    add(tempValW,fontWidth)
                    add(tempValW,fontSpacing)
                    minus(tempVal,1)
                }
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }
                //考虑起始位置
                                
                if(align==0){
                    //左对齐
                    if(paddingRatio>0){
                        set(initPosX,paddingRatio)
                       
                    }else{
                        set(initPosX,0)
                    }
                    
                }else{
                    if(align==2){
                        //右对齐
                        if(paddingRatio>0){
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            minus(initPosX,paddingRatio)
                        }else{
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }
                        
                    }else{
                        //居中对齐
                        set(initPosX,widgetWidth)
                        minus(initPosX,tempValW)
                        divide(initPosX,2)
                    }
                }
                
                //开始绘制
                var(tempValText,0)  //保存要绘制的数字
                var(tempValMid1,0)  //保存临时中间结果
                var(tempValMid2,0)  //保存临时中间结果
                set(tempVal,0)
                while(tempVal<allFontCnt){
                    set('this.layers.tempVal.x',initPosX)
                    set('this.layers.tempVal.width',fontWidth)
                    if(symbolCnt==1){
                        //绘制
                        // print(symbolCnt,'symbolCnt')
                        set(tempValText,0)
                        add(tempValText,45)
                        set('this.layers.tempVal.subLayers.font.text',tempValText)
                        set(symbolCnt,0)
                        add(initPosX,fontWidth)
                        add(initPosX,fontSpacing)
                    }else{
                        if(decimalIndex==tempVal){
                            //绘制小数点
                            set('this.layers.tempVal.width',fontWidthHalf)
                            set(tempValMid1,46)
                            set('this.layers.tempVal.subLayers.font.text',46)
                            add(initPosX,fontWidthHalf)
                            add(initPosX,fontSpacing)
                        }else{
                            if(frontZeroCnt>0){
                                //绘制前导零
                                set(tempValText,0)
                                add(tempValText,48)
                                set('this.layers.tempVal.subLayers.font.text',tempValText)
                                minus(frontZeroCnt,1)
                                add(initPosX,fontWidth)
                                add(initPosX,fontSpacing)
                            }else{
                                if(decimalZeroCnt>0){
                                    set(tempValText,0)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                    minus(decimalZeroCnt,1)
                                }else{
                                    //绘制数字值
                                    set(tempValMid1,curValCnt)
                                    set(tempValMid2,1)
                                    while(tempValMid1>1){
                                        multiply(tempValMid2,10)
                                        minus(tempValMid1,1)
                                    }
                                    set(tempValText,tCurVal)
                                    divide(tempValText,tempValMid2)
                                    mod(tempValText,10)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    minus(curValCnt,1)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                }
                            }
                        }
                    }
                    add(tempVal,1)
                }
            } 
            
            
            
            
            if(tTotalFrame > 0){
                if(tTrueCurVal>tMaxVal){
                    //溢出最大值
                    set(tTrueCurVal,tMaxVal)
                   
                }else{
                    //溢出最小值
                    if(tTrueCurVal<tMinVal){
                        set(tTrueCurVal,tMinVal)
                        
                    }
                }
                var(tOldValue,0)
                set(tOldValue,'this.oldValue')
                set('this.startAnimationTag',tOldValue)
                set('this.stopAnimationTag',tTrueCurVal)
                checkalarm(0)
                set('this.oldValue',tTrueCurVal)
                startanimation(0)
            }else{
                checkalarm(0)
                set('this.oldValue',tCurVal)
            }
                
          
        `,
        onAnimationFrame:`
            var(tStartTag,0)
            var(tStopTag,0)
            set(tStartTag,'this.startAnimationTag')
            set(tStopTag,'this.stopAnimationTag')
            var(tTotalFrame,0)
            set(tTotalFrame,'this.totalFrame')
            var(tCurFrame,0)
            set(tCurFrame,'this.nowFrame')
            var(tYOffset,0)
            var(tYOffset2,0)
            var(tHeight,0)
            set(tHeight,'this.info.height')
            set(tYOffset,tHeight)
            multiply(tYOffset,tCurFrame)
            divide(tYOffset,tTotalFrame)
            set(tYOffset2,tYOffset)
            minus(tYOffset2,tHeight)
            
            
            // var(tCurTag,0)
            // var(tDist,0)
            // set(tDist,tStopTag)
            // minus(tDist,tStartTag)
            // multiply(tDist,tCurFrame)
            // divide(tDist,tTotalFrame)
            // add(tDist,tStartTag)
            // set(tCurTag,tDist)
            //set('this.curAnimationTag',tCurTag) //set AnTag 
            //清空所有数字内容
            var(tIndex,0)   //用于循环
            var(tLaysLen,0)     //图层长度
            set(tLaysLen,'this.layers.length')
            var(halfLayersLen,0)
            set(halfLayersLen,tLaysLen)
            divide(halfLayersLen,2)
            set(tIndex,0)
            // print(tLaysLen,'tLaysLen')
            // print(halfLayersLen,'halfLayersLen')
            // print(tYOffset,tYOffset2)
            while(tIndex<tLaysLen){
                set('this.layers.tIndex.subLayers.font.text',0)
                if(tIndex < halfLayersLen){
                    set('this.layers.tIndex.y',tYOffset)
                }else{
                    set('this.layers.tIndex.y',tYOffset2)
                }
                add(tIndex,1)
            }
            // print('this.layers.0.y','layersy')
            
           
            
            //初始化变量
            var(tCurVal,0)        //当前值
            var(tMaxVal,0)        //最大值
            var(tMinVal,0)        //最小值
            var(hasFrontZero,0)   //是否有前导零
            var(hasSymbol,0)      //是否有符号
            var(decimalCnt,0)     //小数位数
            var(numOfDigits,0)    //字符数
            var(overflow,0)       //溢出模式，0不显示，1显示
            var(fontWidth,0)      //字符图层宽度
            var(align,0)          //对齐方式，0左，1中，2右
            var(widgetWidth,0)    //控件宽度
            var(fontSpacing,0)    //字符间距
            var(paddingRatio,0)   //padddingRatio
            
            var(initPosX,0)       //绘制起始坐标
            var(symbolCnt,0)      //要绘制的符号的个数
            var(decimalIndex,0)   //小数点的标识坐标，即在第几个图层位置绘制小数点
            var(decimalCnt,0)     //要绘制的小数点的个数
            var(decimalZeroCnt,0) //要补齐的小数点后的0的个数
            var(frontZeroCnt,0)   //要绘制的前导零的个数
            var(curValCnt,0)      //要绘制的当前值数字的个数
            var(allFontCnt,0)     //要绘制的总字符的个数
            var(tempVal,0)        //临时变量
            var(needDraw,0)       //是否需要绘制，在溢出不显示的情况下，不需要绘制。0不需要，1需要
            var(isOverflow,0)     //是否溢出
            var(tTotalFrame,0)    //总帧数
            
            set(tCurVal,tStartTag)
            // print('tagVal',tCurVal)
            set(tMaxVal,'this.maxValue')
            set(tMinVal,'this.minValue')
            set(hasFrontZero,'this.otherAttrs.1')
            set(hasSymbol,'this.otherAttrs.2')
            set(decimalCnt,'this.otherAttrs.3')
            set(numOfDigits,'this.otherAttrs.4')
            set(overflow,'this.otherAttrs.5')
            set(fontWidth,'this.otherAttrs.6')
            set(align,'this.otherAttrs.7')
            set(widgetWidth,'this.otherAttrs.8')
            set(fontSpacing,'this.otherAttrs.9')
            set(paddingRatio,'this.otherAttrs.10')      
            
            multiply(paddingRatio,fontWidth)
            
            set(needDraw,1)
            // print(needDraw,'needDrawInit')      
            
            
            //处理前一个数字
            //处理要显示的值
            if(tCurVal>tMaxVal){
                //溢出最大值
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }
            //判断是否需要绘制
            if(needDraw==1){
                //符号
                if(hasSymbol==1){
                    if(tCurVal<0){
                        set(symbolCnt,1)
                    }
                }
                
                //当前值数字个数
                //--while 没有>=，故tCurVal为0时，curValCnt为1
                if(tCurVal<0){
                   set(tempVal,0)
                   minus(tempVal,tCurVal)
                   set(tCurVal,tempVal) 
                }
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }
                
                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }
                
                //总字符数
                set(allFontCnt,0)
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)
                
                //小数  add
                set(decimalIndex,-1)
               
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt<curValCnt){
                        //小数位数小于于字符位数
                        set(decimalIndex,0)
                    }else{
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        set(decimalIndex,0)
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)
                            add(allFontCnt,decimalZeroCnt)
                        }else{
                            set(decimalIndex,0)
                        }
                    }
                    //计算小数点坐标
                    set(decimalIndex,allFontCnt)
                    minus(decimalIndex,decimalCnt)
                    minus(decimalIndex,1)
                }else{
                    set(decimalIndex,-1)
                }
               
                
                //计算起始坐标
                set(tempVal,allFontCnt)
                var(tempValW,0)     //总字符所占宽度
                set(tempValW,0)
                var(fontWidthHalf,0) //半个字符所占宽度
                set(fontWidthHalf,fontWidth)
                divide(fontWidthHalf,2)
                
                if(tempVal>0){
                    add(tempValW,fontWidth)
                    minus(tempVal,1)
                }
                while(tempVal>0){
                   
                    add(tempValW,fontWidth)
                    add(tempValW,fontSpacing)
                    minus(tempVal,1)
                }
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }
                //考虑起始位置
                                
                if(align==0){
                    //左对齐
                    if(paddingRatio>0){
                        set(initPosX,paddingRatio)
                       
                    }else{
                        set(initPosX,0)
                    }
                    
                }else{
                    if(align==2){
                        //右对齐
                        if(paddingRatio>0){
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            minus(initPosX,paddingRatio)
                        }else{
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }
                        
                    }else{
                        //居中对齐
                        set(initPosX,widgetWidth)
                        minus(initPosX,tempValW)
                        divide(initPosX,2)
                    }
                }
                
                var(initPosXBackup,0)
                set(initPosXBackup,initPosX)
                
                //开始绘制
                var(tempValText,0)  //保存要绘制的数字
                var(tempValMid1,0)  //保存临时中间结果
                var(tempValMid2,0)  //保存临时中间结果
                set(tempVal,0)
                while(tempVal<allFontCnt){
                  
                    set('this.layers.tempVal.x',initPosX)
                    set('this.layers.tempVal.width',fontWidth)
                    if(symbolCnt==1){
                        //绘制
                        // print(symbolCnt,'symbolCnt')
                        set(tempValText,0)
                        add(tempValText,45)
                        set('this.layers.tempVal.subLayers.font.text',tempValText)
                        set(symbolCnt,0)
                        add(initPosX,fontWidth)
                        add(initPosX,fontSpacing)
                    }else{
                        if(decimalIndex==tempVal){
                            //绘制小数点
                            set('this.layers.tempVal.width',fontWidthHalf)
                            set(tempValMid1,46)
                            set('this.layers.tempVal.subLayers.font.text',46)
                            add(initPosX,fontWidthHalf)
                            add(initPosX,fontSpacing)
                        }else{
                            if(frontZeroCnt>0){
                                //绘制前导零
                                set(tempValText,0)
                                add(tempValText,48)
                                set('this.layers.tempVal.subLayers.font.text',tempValText)
                                minus(frontZeroCnt,1)
                                add(initPosX,fontWidth)
                                add(initPosX,fontSpacing)
                            }else{
                                if(decimalZeroCnt>0){
                                    set(tempValText,0)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                    minus(decimalZeroCnt,1)
                                }else{
                                    //绘制数字值
                                    set(tempValMid1,curValCnt)
                                    set(tempValMid2,1)
                                    while(tempValMid1>1){
                                        multiply(tempValMid2,10)
                                        minus(tempValMid1,1)
                                    }
                                    set(tempValText,tCurVal)
                                    divide(tempValText,tempValMid2)
                                    mod(tempValText,10)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    minus(curValCnt,1)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                }
                            }
                        }
                    }
                    add(tempVal,1)
                }
            } 
            
            
            set(tCurVal,tStopTag)
           
            //处理要显示的值
            set(needDraw,1)
            if(tCurVal>tMaxVal){
                //溢出最大值
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }
            
            
            //判断是否需要绘制
            if(needDraw==1){
                //符号
                if(hasSymbol==1){
                    if(tCurVal<0){
                        set(symbolCnt,1)
                    }
                }
                
                //当前值数字个数
                //--while 没有>=，故tCurVal为0时，curValCnt为1
                if(tCurVal<0){
                   set(tempVal,0)
                   minus(tempVal,tCurVal)
                   set(tCurVal,tempVal) 
                }
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }
                
                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }
                
                //总字符数
                set(allFontCnt,0)
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)
                
                //小数  add
                set(decimalIndex,-1)
               
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt<curValCnt){
                        //小数位数小于于字符位数
                        set(decimalIndex,0)
                    }else{
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        set(decimalIndex,0)
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)
                            add(allFontCnt,decimalZeroCnt)
                        }else{
                            set(decimalIndex,0)
                        }
                    }
                    //计算小数点坐标
                    set(decimalIndex,allFontCnt)
                    minus(decimalIndex,decimalCnt)
                    minus(decimalIndex,1)
                }else{
                    set(decimalIndex,-1)
                }
               
                
                //计算起始坐标
                set(tempVal,allFontCnt)
                set(tempValW,0)
                
                if(tempVal>0){
                    add(tempValW,fontWidth)
                    minus(tempVal,1)
                }
                while(tempVal>0){
                   
                    add(tempValW,fontWidth)
                    add(tempValW,fontSpacing)
                    minus(tempVal,1)
                }
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }
                //考虑起始位置
                                
                if(align==0){
                    //左对齐
                    if(paddingRatio>0){
                        set(initPosX,paddingRatio)
                       
                    }else{
                        set(initPosX,0)
                    }
                    
                }else{
                    if(align==2){
                        //右对齐
                        if(paddingRatio>0){
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            minus(initPosX,paddingRatio)
                        }else{
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }
                        
                    }else{
                        //居中对齐
                        set(initPosX,widgetWidth)
                        minus(initPosX,tempValW)
                        divide(initPosX,2)
                    }
                }
                
                
                
                //开始绘制
                
                set(tempVal,halfLayersLen)
                var(allFontCnt2,0)
                set(allFontCnt2,halfLayersLen)
                add(allFontCnt2,allFontCnt)
                var(tRelativeLayerNum,0)
                while(tempVal<allFontCnt2){
                    // print(initPosX,'initPosX')
                    set('this.layers.tempVal.x',initPosX)
                    set('this.layers.tempVal.width',fontWidth)
                    if(symbolCnt==1){
                        //绘制
                        // print(symbolCnt,'symbolCnt')
                        set(tempValText,0)
                        add(tempValText,45)
                        set('this.layers.tempVal.subLayers.font.text',tempValText)
                        set(symbolCnt,0)
                        add(initPosX,fontWidth)
                        add(initPosX,fontSpacing)
                    }else{
                        set(tRelativeLayerNum,tempVal)
                        minus(tRelativeLayerNum,halfLayersLen)
                        if(decimalIndex==tRelativeLayerNum){
                            //绘制小数点
                            set('this.layers.tempVal.width',fontWidthHalf)
                            set(tempValMid1,46)
                            set('this.layers.tempVal.subLayers.font.text',46)
                            add(initPosX,fontWidthHalf)
                            add(initPosX,fontSpacing)
                        }else{
                            if(frontZeroCnt>0){
                                //绘制前导零
                                set(tempValText,0)
                                add(tempValText,48)
                                set('this.layers.tempVal.subLayers.font.text',tempValText)
                                minus(frontZeroCnt,1)
                                add(initPosX,fontWidth)
                                add(initPosX,fontSpacing)
                            }else{
                                if(decimalZeroCnt>0){
                                    set(tempValText,0)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                    minus(decimalZeroCnt,1)
                                }else{
                                    //绘制数字值
                                    set(tempValMid1,curValCnt)
                                    set(tempValMid2,1)
                                    while(tempValMid1>1){
                                        multiply(tempValMid2,10)
                                        minus(tempValMid1,1)
                                    }
                                    set(tempValText,tCurVal)
                                    divide(tempValText,tempValMid2)
                                    mod(tempValText,10)
                                    add(tempValText,48)
                                    set('this.layers.tempVal.subLayers.font.text',tempValText)
                                    minus(curValCnt,1)
                                    add(initPosX,fontWidth)
                                    add(initPosX,fontSpacing)
                                }
                            }
                        }
                    }
                    add(tempVal,1)
                }
            } 
            
            
        `
    };

    WidgetCommands['TexNum'] = {
        "onInitialize": `
            //隐藏所有图层
            var(offset,0)
            var(len,0)
            set(len,'this.layers.length')
            while(offset<len){
                set('this.layers.offset.hidden',1)
                add(offset,1)
            }

            // draw num
            //初始化变量

            var(tCurVal,0)                       //当前值
            set(hasFrontZero,'this.otherAttrs.0')

            var(tMaxVal,0)                       //最大值
            set(tMaxVal,'this.maxValue')
            
            var(tMinVal,0)                       //最小值
            set(tMinVal,'this.minValue')

            var(hasFrontZero,0)                  //是否有前导零
            set(hasFrontZero,'this.otherAttrs.1')

            var(hasSymbol,0)                     //是否有符号
            set(hasSymbol,'this.otherAttrs.2')

            var(decimalCnt,0)                    //小数位数
            set(decimalCnt,'this.otherAttrs.3')

            var(numOfDigits,0)                   //字符数
            set(numOfDigits,'this.otherAttrs.4')

            var(overflow,0)                      //溢出模式，0不显示，1显示
            set(overflow,'this.otherAttrs.5')

            var(fontWidth,0)                     //字符图层宽度
            set(fontWidth,'this.otherAttrs.6')

            var(align,0)                         //对齐方式，0左，1中，2右
            set(align,'this.otherAttrs.9')

            var(widgetWidth,0)                   //控件宽度
            set(widgetWidth,'this.otherAttrs.8')

            var(symbolCnt,0)                     //要绘制的符号的个数
            set(symbolCnt,0)

            var(curValCnt,0)                     //要绘制的当前值数字的个数

            var(allFontCnt,0)                    //要绘制的总字符的个数

            var(initPosX,0)                      //绘制起始坐标

            var(decimalIndex,0)                  //小数点的标识坐标，即在第几个图层位置绘制小数点

            var(decimalZeroCnt,0)                //要补齐的小数点后的0的个数

            var(frontZeroCnt,0)                  //要绘制的前导零的个数

            var(needDraw,0)                      //是否需要绘制，在溢出不显示的情况下，不需要绘制。0不需要，1需要
            set(needDraw,1)

            var(isOverflow,0)                    //数字值是否溢出

            var(tempValW,0)                      //总字符所占宽度

            var(fontWidthHalf,0)                 //半个字符所占宽度

            var(tempVal,0)                       //临时变量
            
            var(layersCount,0)                   //layer数
            
            var(index,0)                         //layer index
            
            var(curl,0)                          //当前字符
            
            var(i,0)                             //循环变量
            
      
            

            //溢出处理
            if(tCurVal>tMaxVal){
                //溢出最大值
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }

            //判断是否需要绘制
            if(needDraw==1){
                //符号&取绝对值
                if(tCurVal<0){
                    if(hasSymbol==1){
                        set(symbolCnt,1)
                    }
                    multiply(tCurVal,-1)//取绝对值
                }

                //当前值位数
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }

                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }

                //总字符数=前导0/自动补0+数字位
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)

                //小数点位置
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt>=curValCnt){
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)//decimalZeroCnt：要补齐的小数点后的0的个数=小数位数-数字位数
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)//小数点前面的0
                            add(allFontCnt,decimalZeroCnt)
                        }
                    }
                }
                //计算字符所占总宽度
                set(tempVal,allFontCnt)
                multiply(tempVal,fontWidth)
                set(tempValW,tempVal)//tempValW:总字符所占宽度
                set(fontWidthHalf,fontWidth)//fontWidthHalf:半个字符所占宽度
                divide(fontWidthHalf,2)
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }

                //计算起始坐标
                if(widgetWidth>tempValW){
                    if(align==0){
                        //左对齐
                        set(initPosX,0)
                    }else{
                        if(align==2){
                            //右对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }else{
                            //居中对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            divide(initPosX,2)
                        }
                    }
                }else{
                    set(initPosX,0)
                }                
                
                //layer数
                set(layersCount,allFontCnt)

                //绘制符号
                if(symbolCnt==1){
                    //有负号
                    set('this.layers.0.subLayers.image.texture',11)
                    set('this.layers.0.x',initPosX)
                    set('this.layers.0.hidden',0)
                    minus(layersCount,1)
                }
                
                
                //设置每一个字符的初始位置
                set(xCoordinate,initPosX)
                add(xCoordinate,tempValW)

                
                //绘制逻辑              
                while(i<layersCount){
                    if(i==decimalCnt){
                        if(decimalCnt==0){
                        }else{
                           //畫小數點
                            
                           //xCoordinate-=fontWidth/2;
                           set(tempVal,fontWidth)
                           divide(tempVal,2)
                           minus(xCoordinate,tempVal)
                            
                           //draw(index,xCoordinate)
                           set('this.layers.1.hidden',0)
                           set('this.layers.1.x',xCoordinate)
                           set('this.layers.1.subLayers.image.texture',10)
                           
                           minus(layersCount,1)
                        }
                        set(decimalCnt,-1)
                        minus(i,1)
                    }else{
                        //畫數字
                        if(i<curValCnt){
                            //畫real數字
                            //curl=tCurVal-tCurVal/10*10
                            set(tempVal,tCurVal)
                            divide(tempVal,10)
                            multiply(tempVal,10)
                            set(curl,tCurVal)
                            minus(curl,tempVal)
                            
                            //tCurVal=tCurVal/10
                            divide(tCurVal,10)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //xCoordinate-=fontWidth
                            minus(xCoordinate,fontWidth)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',curl)
                        }else{
                            //畫零
                            //xCoordinate-=fontWidth;
                            minus(xCoordinate,fontWidth)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',0)
                        }
                    }
                    //i++
                    add(i,1)
                }
            }
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            //隐藏所有图层
            var(offset,0)
            var(len,0)
            set(len,'this.layers.length')
            while(offset<len){
                set('this.layers.offset.hidden',1)
                add(offset,1)
            }

            // draw num
            //初始化变量
            var(tTrueCurVal,0)
            var(tTotalFrame,0)
            set(tTotalFrame,'this.totalFrame')

            var(tCurVal,0)                       //当前值
            getTag(tCurVal)
            if(tTotalFrame > 0){
                set(tTrueCurVal,tCurVal)
                set(tCurVal,'this.oldValue')
            }

            var(tMaxVal,0)                       //最大值
            set(tMaxVal,'this.maxValue')
            
            var(tMinVal,0)                       //最小值
            set(tMinVal,'this.minValue')

            var(hasFrontZero,0)                  //是否有前导零
            set(hasFrontZero,'this.otherAttrs.1')

            var(hasSymbol,0)                     //是否有符号
            set(hasSymbol,'this.otherAttrs.2')

            var(decimalCnt,0)                    //小数位数
            set(decimalCnt,'this.otherAttrs.3')

            var(numOfDigits,0)                   //字符数
            set(numOfDigits,'this.otherAttrs.4')

            var(overflow,0)                      //溢出模式，0不显示，1显示
            set(overflow,'this.otherAttrs.5')

            var(fontWidth,0)                     //字符图层宽度
            set(fontWidth,'this.otherAttrs.6')

            var(align,0)                         //对齐方式，0左，1中，2右
            set(align,'this.otherAttrs.9')

            var(widgetWidth,0)                   //控件宽度
            set(widgetWidth,'this.otherAttrs.8')

            var(symbolCnt,0)                     //要绘制的符号的个数
            set(symbolCnt,0)

            var(curValCnt,0)                     //要绘制的当前值数字的个数

            var(allFontCnt,0)                    //要绘制的总字符的个数

            var(initPosX,0)                      //绘制起始坐标

            var(decimalIndex,0)                  //小数点的标识坐标，即在第几个图层位置绘制小数点

            var(decimalZeroCnt,0)                //要补齐的小数点后的0的个数

            var(frontZeroCnt,0)                  //要绘制的前导零的个数

            var(needDraw,0)                      //是否需要绘制，在溢出不显示的情况下，不需要绘制。0不需要，1需要
            set(needDraw,1)

            var(isOverflow,0)                    //数字值是否溢出

            var(tempValW,0)                      //总字符所占宽度

            var(fontWidthHalf,0)                 //半个字符所占宽度

            var(tempVal,0)                       //临时变量
            
            var(layersCount,0)                   //layer数
            
            var(index,0)                         //layer index
            
            var(curl,0)                          //当前字符
            
            var(i,0)                             //循环变量
            
      
            

            //溢出处理
            if(tCurVal>tMaxVal){
                //溢出最大值
                print('溢出最大值',tMaxVal)
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    print('溢出最小值',tMinVal)
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }

            //判断是否需要绘制
            if(needDraw==1){
                //符号&取绝对值
                if(tCurVal<0){
                    if(hasSymbol==1){
                        set(symbolCnt,1)
                    }
                    multiply(tCurVal,-1)//取绝对值
                }

                //当前值位数
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }

                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }

                //总字符数=前导0/自动补0+数字位
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)

                //小数点位置
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt>=curValCnt){
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)//decimalZeroCnt：要补齐的小数点后的0的个数=小数位数-数字位数
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)//小数点前面的0
                            add(allFontCnt,decimalZeroCnt)
                        }
                    }
                }
                //计算字符所占总宽度
                set(tempVal,allFontCnt)
                multiply(tempVal,fontWidth)
                set(tempValW,tempVal)//tempValW:总字符所占宽度
                set(fontWidthHalf,fontWidth)//fontWidthHalf:半个字符所占宽度
                divide(fontWidthHalf,2)
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }

                //计算起始坐标
                if(widgetWidth>tempValW){
                    if(align==0){
                        //左对齐
                        set(initPosX,0)
                    }else{
                        if(align==2){
                            //右对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }else{
                            //居中对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            divide(initPosX,2)
                        }
                    }
                }else{
                    set(initPosX,0)
                }                
                
                //layer数
                set(layersCount,allFontCnt)

                //绘制符号
                if(symbolCnt==1){
                    //有负号
                    set('this.layers.0.subLayers.image.texture',12)
                    set('this.layers.0.x',initPosX)
                    set('this.layers.0.hidden',0)
                    minus(layersCount,1)
                    minus(allFontCnt,1)
                }
                
                
                //设置每一个字符的初始位置
                set(xCoordinate,initPosX)
                add(xCoordinate,tempValW)
                set(i,0)
                
                //绘制逻辑              
                while(i<layersCount){
                    if(i==decimalCnt){
                        if(decimalCnt==0){
                        }else{
                           //畫小數點
                            
                           //xCoordinate-=fontWidth/2;
                           set(tempVal,fontWidth)
                           divide(tempVal,2)
                           minus(xCoordinate,tempVal)
                            
                           //draw(index,xCoordinate)
                           set('this.layers.1.hidden',0)
                           set('this.layers.1.x',xCoordinate)
                           set('this.layers.1.subLayers.image.texture',10)
                           
                           minus(layersCount,1)
                        }
                        set(decimalCnt,-1)
                        minus(i,1)
                    }else{
                        //畫數字
                        if(i<curValCnt){
                            //畫real數字
                            //curl=tCurVal-tCurVal/10*10
                            set(tempVal,tCurVal)
                            divide(tempVal,10)
                            multiply(tempVal,10)
                            set(curl,tCurVal)
                            minus(curl,tempVal)
                            
                            //tCurVal=tCurVal/10
                            divide(tCurVal,10)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //xCoordinate-=fontWidth
                            minus(xCoordinate,fontWidth)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',curl)
                        }else{
                            //畫零
                            //xCoordinate-=fontWidth;
                            minus(xCoordinate,fontWidth)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',0)
                        }
                    }
                    //i++
                    add(i,1)
                }
            }
            if(tTotalFrame > 0){
                if(tTrueCurVal>tMaxVal){
                    //溢出最大值
                    set(tTrueCurVal,tMaxVal)
                   
                }else{
                    //溢出最小值
                    if(tTrueCurVal<tMinVal){
                        set(tTrueCurVal,tMinVal)
                        
                    }
                }
                var(tOldValue,0)
                set(tOldValue,'this.oldValue')
                set('this.startAnimationTag',tOldValue)
                set('this.stopAnimationTag',tTrueCurVal)
                checkalarm(0)
                set('this.oldValue',tTrueCurVal)
                startanimation(0)
            }else{
                checkalarm(0)
                set('this.oldValue',tCurVal)
            }
        `,
        onAnimationFrame:`
            //print('animation','aa')
            var(tStartTag,0)
            var(tStopTag,0)
            set(tStartTag,'this.startAnimationTag')
            set(tStopTag,'this.stopAnimationTag')
            var(tTotalFrame,0)
            set(tTotalFrame,'this.totalFrame')
            var(tCurFrame,0)
            set(tCurFrame,'this.nowFrame')
            var(tYOffset,0)
            var(tYOffset2,0)
            var(tHeight,0)
            set(tHeight,'this.info.height')
            set(tYOffset,tHeight)
            multiply(tYOffset,tCurFrame)
            divide(tYOffset,tTotalFrame)
            set(tYOffset2,tYOffset)
            minus(tYOffset2,tHeight)
            
            //隐藏所有图层
            var(offset,0)
            var(len,0)
            var(halfLen,0)
            set(len,'this.layers.length')
            set(halfLen,len)
            divide(halfLen,2)
            while(offset<len){
                set('this.layers.offset.hidden',1)
                if(offset < halfLen){
                    set('this.layers.offset.y',tYOffset)
                }else{
                    set('this.layers.offset.y',tYOffset2)
                }
                add(offset,1)
            }
            // while(tIndex<tLaysLen){
            //     set('this.layers.tIndex.subLayers.font.text',0)
            //     if(tIndex < halfLayersLen){
            //         set('this.layers.tIndex.y',tYOffset)
            //     }else{
            //         set('this.layers.tIndex.y',tYOffset2)
            //     }
            //     add(tIndex,1)
            // }

            // draw num
            //初始化变量
            var(tTrueCurVal,0)
           

            var(tCurVal,0)                       //当前值
            
            

            var(tMaxVal,0)                       //最大值
            set(tMaxVal,'this.maxValue')
            
            var(tMinVal,0)                       //最小值
            set(tMinVal,'this.minValue')

            var(hasFrontZero,0)                  //是否有前导零
            set(hasFrontZero,'this.otherAttrs.1')

            var(hasSymbol,0)                     //是否有符号
            set(hasSymbol,'this.otherAttrs.2')

            var(decimalCnt,0)                    //小数位数
            set(decimalCnt,'this.otherAttrs.3')

            var(numOfDigits,0)                   //字符数
            set(numOfDigits,'this.otherAttrs.4')

            var(overflow,0)                      //溢出模式，0不显示，1显示
            set(overflow,'this.otherAttrs.5')

            var(fontWidth,0)                     //字符图层宽度
            set(fontWidth,'this.otherAttrs.6')

            var(align,0)                         //对齐方式，0左，1中，2右
            set(align,'this.otherAttrs.9')

            var(widgetWidth,0)                   //控件宽度
            set(widgetWidth,'this.otherAttrs.8')

            var(symbolCnt,0)                     //要绘制的符号的个数
            set(symbolCnt,0)

            var(curValCnt,0)                     //要绘制的当前值数字的个数

            var(allFontCnt,0)                    //要绘制的总字符的个数

            var(initPosX,0)                      //绘制起始坐标

            var(decimalIndex,0)                  //小数点的标识坐标，即在第几个图层位置绘制小数点

            var(decimalZeroCnt,0)                //要补齐的小数点后的0的个数

            var(frontZeroCnt,0)                  //要绘制的前导零的个数

            var(needDraw,0)                      //是否需要绘制，在溢出不显示的情况下，不需要绘制。0不需要，1需要
            set(needDraw,1)

            var(isOverflow,0)                    //数字值是否溢出

            var(tempValW,0)                      //总字符所占宽度

            var(fontWidthHalf,0)                 //半个字符所占宽度

            var(tempVal,0)                       //临时变量
            
            var(layersCount,0)                   //layer数
            
            var(index,0)                         //layer index
            
            var(curl,0)                          //当前字符
            
            var(i,0)                             //循环变量
            
      
            //startTag
            set(tCurVal, tStartTag)

            //溢出处理
            if(tCurVal>tMaxVal){
                //溢出最大值
                print('溢出最大值',tMaxVal)
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    print('溢出最小值',tMinVal)
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }

            //判断是否需要绘制
            if(needDraw==1){
                //符号&取绝对值
                if(tCurVal<0){
                    if(hasSymbol==1){
                        set(symbolCnt,1)
                    }
                    multiply(tCurVal,-1)//取绝对值
                }

                //当前值位数
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }

                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }

                //总字符数=前导0/自动补0+数字位
                set(allFontCnt,0)
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)

                //小数点位置
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt>=curValCnt){
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)//decimalZeroCnt：要补齐的小数点后的0的个数=小数位数-数字位数
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)//小数点前面的0
                            add(allFontCnt,decimalZeroCnt)
                        }
                    }
                }
                //计算字符所占总宽度
                set(tempVal,allFontCnt)
                multiply(tempVal,fontWidth)
                set(tempValW,tempVal)//tempValW:总字符所占宽度
                set(fontWidthHalf,fontWidth)//fontWidthHalf:半个字符所占宽度
                divide(fontWidthHalf,2)
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }

                //计算起始坐标
                if(widgetWidth>tempValW){
                    if(align==0){
                        //左对齐
                        set(initPosX,0)
                    }else{
                        if(align==2){
                            //右对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }else{
                            //居中对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            divide(initPosX,2)
                        }
                    }
                }else{
                    set(initPosX,0)
                }                
                
                //layer数
                set(layersCount,allFontCnt)

                //绘制符号
                if(symbolCnt==1){
                    //有负号
                    set('this.layers.0.subLayers.image.texture',12)
                    set('this.layers.0.x',initPosX)
                    set('this.layers.0.hidden',0)
                    minus(layersCount,1)
                    minus(allFontCnt,1)
                }
                
                
                //设置每一个字符的初始位置
                set(xCoordinate,initPosX)
                add(xCoordinate,tempValW)
                
                //print('start xc',xCoordinate)
                
                //绘制逻辑              
                while(i<layersCount){
                    if(i==decimalCnt){
                        if(decimalCnt==0){
                        }else{
                           //畫小數點
                            
                           //xCoordinate-=fontWidth/2;
                           set(tempVal,fontWidth)
                           divide(tempVal,2)
                           minus(xCoordinate,tempVal)
                            
                           //draw(index,xCoordinate)
                           set('this.layers.1.hidden',0)
                           set('this.layers.1.x',xCoordinate)
                           set('this.layers.1.subLayers.image.texture',10)
                           
                           minus(layersCount,1)
                        }
                        set(decimalCnt,-1)
                        minus(i,1)
                    }else{
                        //畫數字
                        if(i<curValCnt){
                            //畫real數字
                            //curl=tCurVal-tCurVal/10*10
                            set(tempVal,tCurVal)
                            divide(tempVal,10)
                            multiply(tempVal,10)
                            set(curl,tCurVal)
                            minus(curl,tempVal)
                            
                            //tCurVal=tCurVal/10
                            divide(tCurVal,10)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //xCoordinate-=fontWidth
                            minus(xCoordinate,fontWidth)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',curl)
                        }else{
                            //畫零
                            //xCoordinate-=fontWidth;
                            minus(xCoordinate,fontWidth)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //draw(index,xCoordinate)
                            set('this.layers.index.hidden',0)
                            set('this.layers.index.x',xCoordinate)
                            set('this.layers.index.subLayers.image.texture',0)
                        }
                    }
                    //i++
                    add(i,1)
                }
            }
            
            
            //stopTag
            set(tCurVal, tStopTag)
            set(isOverflow,0)
            set(needDraw,1)
            set(curValCnt,0)
            set(symbolCnt,0)
            set(frontZeroCnt,0)
            var(tFloatIndex,0)

            //溢出处理
            if(tCurVal>tMaxVal){
                //溢出最大值
                print('溢出最大值',tMaxVal)
                set(tCurVal,tMaxVal)
                set(isOverflow,1)
            }else{
                //溢出最小值
                if(tCurVal<tMinVal){
                    print('溢出最小值',tMinVal)
                    set(tCurVal,tMinVal)
                    set(isOverflow,1)
                }
            }
            if(isOverflow==1){
                //溢出
                if(overflow==0){
                    //溢出不显示
                    set(needDraw,0)
                }
            }

            //判断是否需要绘制
            if(needDraw==1){
                //符号&取绝对值
                if(tCurVal<0){
                    if(hasSymbol==1){
                        set(symbolCnt,1)
                    }
                    multiply(tCurVal,-1)//取绝对值
                }

                //当前值位数
                set(tempVal,tCurVal)
                while(tempVal>0){
                    add(curValCnt,1)
                    divide(tempVal,10)
                }
                if(curValCnt==0){
                    set(curValCnt,1) 
                }

                //前导零
                if(hasFrontZero==1){
                    set(tempVal,numOfDigits)
                    minus(tempVal,curValCnt)
                    set(frontZeroCnt,tempVal)
                }

                //总字符数=前导0/自动补0+数字位
                set(allFontCnt,0)
                add(allFontCnt,symbolCnt)
                add(allFontCnt,frontZeroCnt)
                add(allFontCnt,curValCnt)

                //小数点位置
                if(decimalCnt>0){
                    add(allFontCnt,1)
                    if(decimalCnt>=curValCnt){
                        //小数位数大于等于字符位数，在非前导零模式下需要补零
                        if(hasFrontZero==0){
                            set(decimalZeroCnt,decimalCnt)//decimalZeroCnt：要补齐的小数点后的0的个数=小数位数-数字位数
                            minus(decimalZeroCnt,curValCnt)
                            add(decimalZeroCnt,1)//小数点前面的0
                            add(allFontCnt,decimalZeroCnt)
                        }
                    }
                }
                //计算字符所占总宽度
                set(tempVal,allFontCnt)
                multiply(tempVal,fontWidth)
                set(tempValW,tempVal)//tempValW:总字符所占宽度
                set(fontWidthHalf,fontWidth)//fontWidthHalf:半个字符所占宽度
                divide(fontWidthHalf,2)
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }

                //计算起始坐标
                set(initPosX,0)
                if(widgetWidth>tempValW){
                    if(align==0){
                        //左对齐
                        set(initPosX,0)
                    }else{
                        if(align==2){
                            //右对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                        }else{
                            //居中对齐
                            set(initPosX,widgetWidth)
                            minus(initPosX,tempValW)
                            divide(initPosX,2)
                        }
                    }
                }else{
                    set(initPosX,0)
                }                
                
                //layer数
                set(layersCount,allFontCnt)

                //绘制符号
                if(symbolCnt==1){
                    //有负号
                    set(tFloatIndex,halfLen)
                    set('this.layers.tFloatIndex.subLayers.image.texture',12)
                    set('this.layers.tFloatIndex.x',initPosX)
                    set('this.layers.tFloatIndex.hidden',0)
                    minus(layersCount,1)
                    minus(allFontCnt,1)
                }
                
                
                //设置每一个字符的初始位置
                set(xCoordinate,initPosX)
                add(xCoordinate,tempValW)
                //print('stoptag xc',xCoordinate)
                
                //绘制逻辑 
                //print(i,layersCount,'i layersCount')   
                set(i,0)          
                while(i<layersCount){
                    if(i==decimalCnt){
                        if(decimalCnt==0){
                        }else{
                           //畫小數點
                            
                           //xCoordinate-=fontWidth/2;
                           set(tempVal,fontWidth)
                           divide(tempVal,2)
                           minus(xCoordinate,tempVal)
                            
                           //draw(index,xCoordinate)
                           set(tFloatIndex,halfLen)
                           add(tFloatIndex,1)
                           set('this.layers.tFloatIndex.hidden',0)
                           set('this.layers.tFloatIndex.x',xCoordinate)
                           set('this.layers.tFloatIndex.subLayers.image.texture',10)
                           
                           minus(layersCount,1)
                        }
                        set(decimalCnt,-1)
                        minus(i,1)
                    }else{
                        //畫數字
                        if(i<curValCnt){
                            //畫real數字
                            //curl=tCurVal-tCurVal/10*10
                            set(tempVal,tCurVal)
                            divide(tempVal,10)
                            multiply(tempVal,10)
                            set(curl,tCurVal)
                            minus(curl,tempVal)
                            
                            //tCurVal=tCurVal/10
                            divide(tCurVal,10)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //xCoordinate-=fontWidth
                            minus(xCoordinate,fontWidth)
                            
                            //draw(index,xCoordinate)
                            set(tFloatIndex,halfLen)
                            add(tFloatIndex,index)
                            set('this.layers.tFloatIndex.hidden',0)
                            set('this.layers.tFloatIndex.x',xCoordinate)
                            set('this.layers.tFloatIndex.subLayers.image.texture',curl)
                        }else{
                            //畫零
                            //xCoordinate-=fontWidth;
                            minus(xCoordinate,fontWidth)
                            
                            //index=allFontCnt-i
                            set(index,allFontCnt)
                            minus(index,i)
                            
                            //draw(index,xCoordinate)
                            set(tFloatIndex,halfLen)
                            add(tFloatIndex,index)
                            set('this.layers.tFloatIndex.hidden',0)
                            set('this.layers.tFloatIndex.x',xCoordinate)
                            set('this.layers.tFloatIndex.subLayers.image.texture',0)
                        }
                    }
                    //i++
                    add(i,1)
                }
                //print('curWidget','this')
            }
            
        `
    };

    WidgetCommands['Selector'] = {
        onInitialize: `
            var(offset,0)
            set(offset,2)
            var(len,0)
            set(len,'this.layers.length')
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            if(tMaxHighLightNum>0){
                minus(len,1)
            }
            while(offset<len){
                set('this.layers.offset.hidden',0)
                add(offset,1)
            }
        `,
        onTagChange: `
            var(curItem,0)                            //curValue当前元素 = tag值
            getTag(curItem)
                       
            var(itemCount,0)                          //元素总个数
            set(itemCount,'this.otherAttrs.2')
            
            var(itemShowCount,0)                      //待选元素展示个数（单边）
            set(itemShowCount,'this.otherAttrs.3')
           
            var(w,0)                                  //控件宽度 = 选中元素宽度
            set(w,'this.otherAttrs.4')
            
            var(h,0)                                  //控件高度
            set(h,'this.otherAttrs.5')
            
            var(itemWidth,0)                          //待选元素宽度
            set(itemWidth,'this.otherAttrs.6')
            
            var(itemHeight,0)                         //待选元素高度
            set(itemHeight,'this.otherAttrs.7')
            
            var(selectorHeight,0)                     //选中元素高度
            set(selectorHeight,'this.otherAttrs.9')
            
            var(temp1,0)                              //临时变量
            var(temp2,0)
           
            //curItem取模
            mod(curItem,itemCount)
            //负数处理
            if(curItem<0){
                add(curItem,itemCount)
            }
            set('this.otherAttrs.1',curItem)
           
           
            //标题层背景层不用动
            
            
            //前景层
            //前景层位置
            //var startH=h/2-selectorHeight/2
            var(startH,0)
            set(temp1,h)
            divide(temp1,2)
            set(temp2,selectorHeight)
            divide(temp2,2)
            minus(temp1,temp2)
            set(startH,temp1)
         
            //var temp2=startH-curValue*selectorHeight
            set(temp1,curItem)
            multiply(temp1,selectorHeight)
            set(temp2,startH)
            minus(temp2,temp1)
            
            //Layer(0,temp2,selectorWidth,selectorHeight*itemCount,true)
            set('this.layers.3.y',temp2)
            
            //前景层roi
            //temp1=curValue*selectorHeight;
            set(temp1,curItem)
            multiply(temp1,selectorHeight)
            set(temp2,temp1)
            add(temp2,selectorHeight)
            
            //ROISubLayer(0,0,temp1,w,temp1,w,temp1+selectorHeight,0,temp1+selectorHeight);
            set('this.layers.3.subLayers.roi.p1y',temp1)
            set('this.layers.3.subLayers.roi.p2y',temp1)
            set('this.layers.3.subLayers.roi.p3y',temp2)
            set('this.layers.3.subLayers.roi.p4y',temp2)
            
            
            //后景层(上)
            //后景层(上)位置
            //temp1=-(curValue-itemShowCount)*itemHeight;
            set(temp1,curItem)
            minus(temp1,itemShowCount)
            multiply(temp1,itemHeight)
            multiply(temp1,-1)
            
            //Layer(selectorWidth/2-itemWidth/2,temp1,itemWidth,itemHeight*itemCount,true);
            set('this.layers.1.y',temp1)
            
            //后景层(上)roi
            //-tempH
            multiply(temp1,-1)
            //-tempH+itemShowCount*itemHeight
            set(temp2,itemShowCount)
            multiply(temp2,itemHeight)
            add(temp2,temp1)
            
            //ROISubLayer(0,0,-tempH,itemWidth,-tempH,itemWidth,-tempH+itemShowCount*itemHeight,0,-tempH+itemShowCount*itemHeight)
            set('this.layers.1.subLayers.roi.p1y',temp1)
            set('this.layers.1.subLayers.roi.p2y',temp1)
            set('this.layers.1.subLayers.roi.p3y',temp2)
            set('this.layers.1.subLayers.roi.p4y',temp2)
            
            
            //后景层(下)
            //后景层(下)位置
            //tempH=h/2+selectorHeight/2-(curValue+1)*itemHeight;
            set(temp1,curItem)
            add(temp1,1)
            multiply(temp1,itemHeight)
            multiply(temp1,-1)
            set(temp2,h)
            divide(temp2,2)
            add(temp1,temp2)
            set(temp2,selectorHeight)
            divide(temp2,2)
            add(temp1,temp2)

            //Layer(selectorWidth/2-itemWidth/2,tempH,itemWidth,itemHeight*itemCount,true);
            set('this.layers.0.y',temp1)
            
            
            //后景层(下)roi
            //(curValue+1)*itemHeight
            set(temp1,curItem)
            add(temp1,1)
            multiply(temp1,itemHeight)
            //(curValue+1)*itemHeight+itemShowCount*itemHeight
            set(temp2,itemShowCount)
            multiply(temp2,itemHeight)
            add(temp2,temp1)
            
            //ROISubLayer(0,0,(curValue+1)*itemHeight,itemWidth,(curValue+1)*itemHeight,itemWidth,(curValue+1)*itemHeight+itemShowCount*itemHeight,0,(curValue+1)*itemHeight+itemShowCount*itemHeight);
            set('this.layers.0.subLayers.roi.p1y',temp1)
            set('this.layers.0.subLayers.roi.p2y',temp1)
            set('this.layers.0.subLayers.roi.p3y',temp2)
            set('this.layers.0.subLayers.roi.p4y',temp2)
            
        `,
        onMouseUp: `
            var(curValue,0)                                 //tag值
            getTag(curValue) 

            var(itemCount,0)                                //元素总个数
            set(itemCount,'this.otherAttrs.2')

            var(itemShowCount,0)                            //待选元素展示个数（单边）
            set(itemShowCount,'this.otherAttrs.3')

            var(itemHeight,0)                               //待选元素高度
            set(itemHeight,'this.otherAttrs.7')

            var(selectorHeight,0)                           //选中元素高度
            set(selectorHeight,'this.otherAttrs.9')

            var(tInnerX,0)                                  //鼠标坐标x
            set(tInnerX,'this.innerX')

            var(tInnerY,0)                                  //鼠标坐标y
            set(tInnerY,'this.innerY')

            var(tStartX,0)                                  //控件左上角坐标x
            // set(tStartX,'this.otherAttrs.11')   

            var(tStartY,0)                                  //控件左上角坐标y
            // set(tStartY,'this.otherAttrs.12')

            var(tSelectedStartY,0)                          //选择框左上角坐标y
            set(tSelectedStartY,itemShowCount)            
            multiply(tSelectedStartY,itemHeight)            
            add(tSelectedStartY,tStartY)            

            var(tWidth,0)                                   //控件宽度
            set(tWidth,'this.otherAttrs.4')            

            var(tHeight,0)                                  //控件高度
            set(tHeight,'this.otherAttrs.5')  

            var(tEndX,0)                                    //控件右下角坐标x
            set(tEndX,tStartX)
            add(tEndX,tWidth)           

            var(tEndY,0)                                    //控件右下角坐标y
            set(tEndY,tStartY)
            add(tEndY,tHeight)

            var(tSelectedEndY,0)                            //选择框左上角坐标y
            set(tSelectedEndY,tSelectedStartY)                       
            add(tSelectedEndY,selectorHeight)   

            var(temp1,0)                                    //临时变量
            var(temp2,0)

            // print('tInnerX',tInnerX)
            // print('tInnerY',tInnerY)
            // print('tStartX',tStartX)
            // print('tStartY',tStartY)
            // print('tEndX',tEndX)
            // print('tEndY',tEndY)
            // print('tSelectedStartY',tSelectedStartY)
            // print('tSelectedEndY',tSelectedEndY)

            var(okFlag,0)                                                 //高亮是否已选中
            set(okFlag,'this.otherAttrs.10')
            var(isMoved,0)
            set(isMoved,'this.otherAttrs.14')                             //isMoved 

            if(isMoved==0){                                               //isMoved==0，没有被拖拽过
                if(okFlag==1){
                    if (tInnerX>=tStartX) {
                        if(tInnerX < tEndX){
                            if (tInnerY>=tStartY) {
                                if (tInnerY<tEndY) {                      //在控件内
                                    if (tInnerY<tSelectedStartY) {        //不在选择框里，在选择框上方
                                        set(temp1,tSelectedStartY)
                                        minus(temp1,tInnerY)
                                        divide(temp1,itemHeight)
                                        add(temp1,1)
                                        set(temp2,curValue)
                                        minus(temp2,temp1)
                                        if(temp2>=0){
                                            // set(temp2,0)
                                            setTag(temp2)
                                        }

                                    }else{
                                        if (tInnerY>tSelectedEndY) {      //不在选择框里，在选择框下方
                                            set(temp1,tInnerY)
                                            minus(temp1,tSelectedEndY)
                                            divide(temp1,itemHeight)
                                            add(temp1,1)
                                            set(temp2,curValue)
                                            add(temp2,temp1)
                                            set(temp1,itemCount)
                                            minus(temp1,1)
                                            if(temp2<=temp1){
                                                // set(temp2,temp1)
                                                setTag(temp2)
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{

                    var(isItemShow,0)                                     //选项是否已展开
                    set(isItemShow,'this.otherAttrs.13')
                    if(isItemShow==1){
                        if (tInnerX>=tStartX) {
                            if(tInnerX <=tEndX){
                                if (tInnerY>=tStartY) {
                                    if (tInnerY<=tEndY) {                 //在控件里
                                        if (tInnerY<tSelectedStartY) {    //不在选择框里，在选择框上方
                                            set(temp1,tSelectedStartY)
                                            minus(temp1,tInnerY)
                                            divide(temp1,itemHeight)
                                            add(temp1,1)
                                            set(temp2,curValue)
                                            minus(temp2,temp1)
                                            if(temp2>=0){
                                                // set(temp2,0)
                                                setTag(temp2)
                                            }

                                        }else{
                                            if (tInnerY>tSelectedEndY) {  //不在选择框里，在选择框下方
                                                set(temp1,tInnerY)
                                                minus(temp1,tSelectedEndY)
                                                divide(temp1,itemHeight)
                                                add(temp1,1)
                                                set(temp2,curValue)
                                                add(temp2,temp1)
                                                set(temp1,itemCount)
                                                minus(temp1,1)
                                                if(temp2<=temp1){
                                                    // set(temp2,temp1)
                                                    setTag(temp2)
                                                }

                                            }else{                         //在选择框里
                                                                           //收起选项
                                                set('this.layers.0.hidden',1)
                                                set('this.layers.1.hidden',1)
                                                set('this.otherAttrs.13',0)  
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        if (tInnerX>=tStartX) {
                            if(tInnerX <=tEndX){
                                if (tInnerY>=tSelectedStartY) {
                                    if (tInnerY<=tSelectedEndY) {          //在选择框里
                                        var(hiddenValue,0)
                                        set(hiddenValue,'this.layers.len.hidden')
                                        if(hiddenValue==1){   //不能展开被高亮的选择器
                                                                           //展开选项 
                                            set('this.layers.0.hidden',0)
                                            set('this.layers.1.hidden',0)
                                            set('this.otherAttrs.13',1)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            set('this.otherAttrs.14',0)                     //isMoved = 0
        `,
        onMouseDown: `
            var(tInnerY,0)
            set(tInnerY,'this.innerY')
            set('this.otherAttrs.15',tInnerY)               //记录鼠标上一坐标y       
        `,
        onMouseMove: `
            var(curValue,0)                                 //tag值
            getTag(curValue) 

            var(itemCount,0)                                //元素总个数
            set(itemCount,'this.otherAttrs.2')

            var(itemShowCount,0)                            //待选元素展示个数（单边）
            set(itemShowCount,'this.otherAttrs.3')

            var(itemHeight,0)                               //待选元素高度
            set(itemHeight,'this.otherAttrs.7')

            var(selectorHeight,0)                           //选中元素高度
            set(selectorHeight,'this.otherAttrs.9')

            var(tInnerX,0)                                  //鼠标坐标x
            set(tInnerX,'this.innerX')

            var(tInnerY,0)                                  //鼠标坐标y
            set(tInnerY,'this.innerY')

            var(tLastInnerY,0)                              //鼠标上一有效坐标y
            set(tLastInnerY,'this.otherAttrs.15')

            var(tStartX,0)                                  //控件左上角坐标x
            // set(tStartX,'this.otherAttrs.11')   

            var(tStartY,0)                                  //控件左上角坐标y
            // set(tStartY,'this.otherAttrs.12')

            var(tSelectedStartY,0)                          //选择框左上角坐标y
            set(tSelectedStartY,itemShowCount)            
            multiply(tSelectedStartY,itemHeight)            
            add(tSelectedStartY,tStartY)            

            var(tWidth,0)                                   //控件宽度
            set(tWidth,'this.otherAttrs.4')            

            var(tHeight,0)                                  //控件高度
            set(tHeight,'this.otherAttrs.5')  

            var(tEndX,0)                                    //控件右下角坐标x
            set(tEndX,tStartX)
            add(tEndX,tWidth)           

            var(tEndY,0)                                    //控件右下角坐标y
            set(tEndY,tStartY)
            add(tEndY,tHeight)

            var(tSelectedEndY,0)                            //选择框左上角坐标y
            set(tSelectedEndY,tSelectedStartY)                       
            add(tSelectedEndY,selectorHeight)   

            var(temp1,0)                                    //临时变量
            var(temp2,0)

            var(isItemShow,0)                                              //选项是否已展开
            set(isItemShow,'this.otherAttrs.13')
            if(isItemShow==1){
                if (tInnerX>=tStartX) {
                    if(tInnerX <=tEndX){
                        if (tInnerY>=tStartY) {
                            if (tInnerY<=tEndY) {                           //在控件里              
                                set(temp1,tLastInnerY)                      //鼠标纵向移动距离
                                minus(temp1,tInnerY)
                                set(temp2,itemHeight)
                                divide(temp2,2)                             //itemHeight的一半
                                if(temp1>0){                                //移动方向向上
                                    if(temp1>=temp2){                       //认为移动有效
                                        set(temp2,curValue)
                                        add(temp2,1)
                                        set(temp1,itemCount)
                                        minus(temp1,1)
                                        if(temp2<=temp1){
                                            setTag(temp2)
                                        }
                                        set('this.otherAttrs.15',tInnerY)
                                        set('this.otherAttrs.14',1)         //isMoved = 1
                                    }
                                }else{                                      //移动方向向下
                                    multiply(temp1,-1)
                                    if(temp1>=temp2){                       //认为移动有效
                                        set(temp2,curValue)
                                        minus(temp2,1)
                                        if(temp2>=0){
                                            setTag(temp2)
                                        }
                                        set('this.otherAttrs.15',tInnerY)
                                        set('this.otherAttrs.14',1)         //isMoved = 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        onKeyBoardLeft: `
            var(tMaxHighLightNum,0)                          //控件内高亮块数
            set(tMaxHighLightNum,'this.maxHighLightNum')
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.10')
            var(len,0)                                       //图层总数
            set(len,'this.layers.length')
            minus(len,1)
            //判断是否启用高亮
            if (tMaxHighLightNum>0) {
                if(okFlag==0){//控件间高亮选择
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    if (tHighLightNum==1) {
                        //hashighlight
                        set('this.layers.len.hidden',0)
                    }else{
                        set('this.layers.len.hidden',1)
                    }
                }else{//高亮已选择，左移tag值减1
                    var(curItem,0)
                    set(curItem,'this.otherAttrs.1')
                    minus(curItem,1)
                    //curItem取模
                    mod(curItem,itemCount)
                    if(curItem<0){
                        add(curItem,itemCount)
                    }
                    set('this.otherAttrs.1',curItem)
                    setTag(curItem)
                }
            }
          
        `,
        onKeyBoardRight: `
            var(tMaxHighLightNum,0)                          //控件内高亮块数
            set(tMaxHighLightNum,'this.maxHighLightNum')
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.10')
            var(len,0)                                       //图层总数
            set(len,'this.layers.length')
            minus(len,1)
            //判断是否启用高亮
            if (tMaxHighLightNum>0) {
                if(okFlag==0){//控件间高亮选择
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    if (tHighLightNum==1) {
                        //hashighlight
                        set('this.layers.len.hidden',0)
                    }else{
                        set('this.layers.len.hidden',1)
                    }
                }else{//高亮已选择，右移tag值加1
                    var(curItem,0)
                    set(curItem,'this.otherAttrs.1')
                    add(curItem,1)
                    //curItem取模
                    mod(curItem,itemCount)
                    if(curItem<0){
                        add(curItem,itemCount)
                    }
                    set('this.otherAttrs.1',curItem)
                    setTag(curItem)
                }
            }
        `,
        onKeyBoardOK: `
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.10')
            if(okFlag==0){
                setglobalvar(0,1)
                set('this.otherAttrs.10',1)
                set('this.layers.0.hidden',0)
                set('this.layers.1.hidden',0)
                //选项已展开
                set('this.otherAttrs.13',1)
                
            }else{
                setglobalvar(0,0)
                set('this.otherAttrs.10',0)
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',1)
                //选项已收起
                set('this.otherAttrs.13',0)
            }
        `
    };

    WidgetCommands['RotaryKnob'] = {
        onInitialize: `
            var(offset,0)
            set(offset,0)
            var(len,0)
            set(len,'this.layers.length')
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            if(tMaxHighLightNum>0){
                minus(len,1)                                       //高亮层初始化时不显示
            }
            while(offset<len){
                set('this.layers.offset.hidden',0)
                add(offset,1)
            }
        `,
        onMouseUp: `
            var(tHit,0)                                 //isHited
            set(tHit,'this.otherAttrs.4')
            
            var(tMinValue,0)                            //最小值
            set(tMinValue,'this.minValue')
            
            var(tMaxValue,0)                            //最大值
            set(tMaxValue,'this.maxValue')

            if (tHit==1) {                              //isHited==1 此时鼠标被按下
                var(tInnerX,0)                          //鼠标坐标x
                set(tInnerX,'this.innerX')

                var(tInnerY,0)                          //鼠标坐标y
                set(tInnerY,'this.innerY')

                var(tLastArea,0)                        //鼠标上一个区域
                set(tLastArea,'this.otherAttrs.5') 

                var(tOver,0)                            //鼠标上一个区域
                set(tOver,'this.otherAttrs.6')      

                var(tRotateX,0)                         //旋转中心坐标X
                set(tRotateX,'this.otherAttrs.2')

                var(tRotateY,0)                         //旋转中心坐标Y
                set(tRotateY,'this.otherAttrs.3')

                var(tX,0)                               //鼠标相对于旋转中心坐标X
                set(tX,tInnerX)
                minus(tX,tRotateX)

                var(tY,0)                               //鼠标相对于旋转中心坐标Y
                set(tY,tRotateY)
                minus(tY,tInnerY)

                var(tBaseAngle,0)                       //区域基角
                var(tTanSymbol,0)                       //tan角的是否取余:不是真正取余角，取45-tTanAngle
                var(tTan,0)                             //tan值
                var(tTanAngle,0)                        //tan角

                var(tRotateAngle,0)                     //旋转角

                var(temp1,0)                            //临时变量
                var(temp2,0)

                                                        //划分区域
                if(tX>0){
                    if(tY>0){
                        if(tY>=tX){
                            if(tOver==1){
                                if(tLastArea==8){
                                     set(tOver,0)       //未溢出合法
                                }
                            }else{
                                if(tLastArea==8){
                                     set(tOver,1)       //溢出不合法
                                }
                            }
                            set(tLastArea,1)            //1
                            set(tBaseAngle,0)           //基角=0        
                            set(tTan,tX)                //tan值
                            multiply(tTan,10)
                            divide(tTan,tY)
                            set(tTanSymbol,0)           //不取余

                        }else{
                            set(tLastArea,2)            //2
                            set(tBaseAngle,45)          //基角=45
                            set(tTan,tY)                //tan值
                            multiply(tTan,10)
                            divide(tTan,tX)
                            set(tTanSymbol,1)           //取余
                        }
                    }else{         
                        set(temp1,tY)                   //取绝对值
                        multiply(temp1,-1)

                        if(tX>=temp1){
                            set(tLastArea,3)            //3
                            set(tBaseAngle,90)          //基角=90
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,tX)
                            set(tTanSymbol,0)           //不取余

                        }else{
                            set(tLastArea,4)            //4
                            set(tBaseAngle,135)         //基角=135
                            set(tTan,tX)                //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,1)           //取余
                        }
                    }
                }else{
                    if(tY<0){
                        set(temp1,tX)                   //取绝对值
                        multiply(temp1,-1)
                        set(temp2,tY)
                        multiply(temp2,-1)

                        if(temp2>=temp1){
                            set(tLastArea,5)            //5
                            set(tBaseAngle,180)         //基角=180
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,temp2)
                            set(tTanSymbol,0)           //不取余

                        }else{
                            set(tLastArea,6)            //6
                            set(tBaseAngle,225)         //基角=225
                            set(tTan,temp2)             //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,1)           //取余
                        }
                    }else{
                        set(temp1,tX)                   //取绝对值
                        multiply(temp1,-1)

                        if(temp1>=tY){
                            set(tLastArea,7)            //7
                            set(tBaseAngle,270)         //基角=270
                            set(tTan,tY)                //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,0)           //不取余

                        }else{
                            if(tOver==1){
                                if(tLastArea==1){
                                     set(tOver,0)       //未溢出合法
                                }
                            }else{
                                if(tLastArea==1){
                                     set(tOver,1)       //溢出不合法
                                }
                            }
                            set(tLastArea,8)            //8
                            set(tBaseAngle,315)         //基角=315
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,tY)
                            set(tTanSymbol,1)           //取余
                        } 
                    }
                }   
                                                        //判断是否溢出
                if(tOver==0){
                                                        //tan值查表，计算tanAngle
                    if(tTan==0){
                        set(tTanAngle,0)
                    }else{
                        if(tTan==1){
                            set(tTanAngle,6)  
                        }else{
                            if(tTan==2){
                                set(tTanAngle,12)  
                            }else{
                                if(tTan==3){
                                    set(tTanAngle,17)  
                                }else{
                                    if(tTan==4){
                                        set(tTanAngle,22)  
                                    }else{
                                        if(tTan==5){
                                            set(tTanAngle,27)  
                                        }else{
                                            if(tTan==6){
                                                set(tTanAngle,31)  
                                            }else{
                                                if(tTan==7){
                                                    set(tTanAngle,35)  
                                                }else{
                                                    if(tTan==8){
                                                        set(tTanAngle,39)  
                                                    }else{
                                                        if(tTan==9){
                                                            set(tTanAngle,42)  
                                                        }else{
                                                            if(tTan==10){
                                                                set(tTanAngle,45)  
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                                                          //取余
                    if(tTanSymbol==1){
                        set(temp1,45)
                        minus(temp1,tTanAngle)
                        set(tTanAngle,temp1)
                    }

                                                          //计算旋转角
                    set(tRotateAngle,tBaseAngle)
                    add(tRotateAngle,tTanAngle)
                }else{                                    //溢出
                                                          //溢出补满整圆，或清除整圆
                    if(tLastArea==1){
                        set(tRotateAngle,360)
                    }
                    if(tLastArea==8){
                        set(tRotateAngle,0)
                    }
                }
                                                          //计算tag值
                set(temp1,tMaxValue) 
                minus(temp1,tMinValue)
                multiply(temp1,tRotateAngle)
                divide(temp1,360)
                add(temp1,tMinValue)

                                                           //setTag
                setTag(temp1)

                set('this.otherAttrs.5',tLastArea)         //lastArea
                set('this.otherAttrs.6',tOver)             //over

            }
        `,
        onMouseDown: `
            var(curValue,0)                                        //tag值
            getTag(curValue)
            
            var(tMinValue,0)                                       //最小值
            set(tMinValue,'this.minValue')
            
            var(tMaxValue,0)                                       //最大值
            set(tMaxValue,'this.maxValue')
            
            if(curValue>= tMinValue){
                if(tMaxValue>= curValue){
                    var(tStartX,0)                                  //控件左上角坐标x
                    set(tStartX,'this.layers.1.x')   
                             
                    var(tStartY,0)                                  //控件左上角坐标y
                    set(tStartY,'this.layers.1.y')            
                    
                    var(tWidth,0)                                   //控件宽度
                    set(tWidth,'this.layers.1.width')            
                    
                    var(tHeight,0)                                  //控件高度
                    set(tHeight,'this.layers.1.height')  
                    
                    var(tEndX,0)                                    //控件右下角坐标x
                    set(tEndX,tStartX)
                    add(tEndX,tWidth)           
                    
                    var(tEndY,0)                                    //控件右下角坐标y
                    set(tEndY,tStartY)
                    add(tEndY,tHeight)
                    
                    var(tInnerX,0)                                  //鼠标坐标x
                    set(tInnerX,'this.innerX')
                    
                    var(tInnerY,0)                                  //鼠标坐标y
                    set(tInnerY,'this.innerY')
                    
                    var(tRotateX,0)                                 //旋转中心坐标X
                    set(tRotateX,'this.otherAttrs.2')
                    
                    var(tRotateY,0)                                 //旋转中心坐标Y
                    set(tRotateY,'this.otherAttrs.3')
                    
                    var(tX,0)                                       //鼠标相对于旋转中心坐标X
                    set(tX,tInnerX)
                    minus(tX,tRotateX)
                    
                    var(tY,0)                                       //鼠标相对于旋转中心坐标Y
                    set(tY,tRotateY)
                    minus(tY,tInnerY)
                    
                    var(temp1,0)                                    //临时变量
                    var(temp2,0)
                    
                                                                    //鼠标点与旋转中心距离的平方
                    set(temp1,tX)
                    multiply(temp1,tX)
                    set(temp2,tY)
                    multiply(temp2,tY)
                    add(temp1,temp2)
                    
                                                                    //半径
                    if(tWidth>tHeight){
                        set(temp2,tWidth)      
                    }else{
                        set(temp2,tHeight)      
                    }
                    
                                                                   //半径的一半的平方
                    divide(temp2,4)
                    multiply(temp2,temp2)
        
                    set('this.otherAttrs.4',0)                     //isHited = 0
        
                    if(temp1>=temp2){
                        if (tInnerX>=tStartX) {
                            if(tInnerX < tEndX){
                                if (tInnerY>=tStartY) {
                                    if (tInnerY<tEndY) {
                                                                               //在有效区域内
                                        set('this.otherAttrs.4',1)             //isHited = 1
                                        set('this.otherAttrs.5',4)             //lastArea不等于1或者8
                                        set('this.otherAttrs.6',0)             //over=0
                                    }
                                }
                            }
                        }
                    } 
                }
            }        
        `,
        onMouseMove: `
            var(tHit,0)                                 //isHited
            set(tHit,'this.otherAttrs.4')
            
            var(tMinValue,0)                            //最小值
            set(tMinValue,'this.minValue')
            
            var(tMaxValue,0)                            //最大值
            set(tMaxValue,'this.maxValue')
        
            if (tHit==1) {                              //isHited==1 此时鼠标被按下
                var(tInnerX,0)                          //鼠标坐标x
                set(tInnerX,'this.innerX')
                
                var(tInnerY,0)                          //鼠标坐标y
                set(tInnerY,'this.innerY')

                var(tLastArea,0)                        //鼠标上一个区域
                set(tLastArea,'this.otherAttrs.5') 
                                
                var(tOver,0)                            //鼠标上一个区域
                set(tOver,'this.otherAttrs.6')      
                
                var(tRotateX,0)                         //旋转中心坐标X
                set(tRotateX,'this.otherAttrs.2')
                
                var(tRotateY,0)                         //旋转中心坐标Y
                set(tRotateY,'this.otherAttrs.3')
                
                var(tX,0)                               //鼠标相对于旋转中心坐标X
                set(tX,tInnerX)
                minus(tX,tRotateX)
                
                var(tY,0)                               //鼠标相对于旋转中心坐标Y
                set(tY,tRotateY)
                minus(tY,tInnerY)
                
                var(tBaseAngle,0)                       //区域基角
                var(tTanSymbol,0)                       //tan角的是否取余:不是真正取余角，取45-tTanAngle
                var(tTan,0)                             //tan值
                var(tTanAngle,0)                        //tan角
                            
                var(tRotateAngle,0)                     //旋转角
                
                var(temp1,0)                            //临时变量
                var(temp2,0)
                
                                                        //划分区域
                if(tX>0){
                    if(tY>0){
                        if(tY>=tX){
                            if(tOver==1){
                                if(tLastArea==8){
                                     set(tOver,0)       //未溢出合法
                                }
                            }else{
                                if(tLastArea==8){
                                     set(tOver,1)       //溢出不合法
                                }
                            }
                            set(tLastArea,1)            //1
                            set(tBaseAngle,0)           //基角=0        
                            set(tTan,tX)                //tan值
                            multiply(tTan,10)
                            divide(tTan,tY)
                            set(tTanSymbol,0)           //不取余
                            
                        }else{
                            set(tLastArea,2)            //2
                            set(tBaseAngle,45)          //基角=45
                            set(tTan,tY)                //tan值
                            multiply(tTan,10)
                            divide(tTan,tX)
                            set(tTanSymbol,1)           //取余
                        }
                    }else{         
                        set(temp1,tY)                   //取绝对值
                        multiply(temp1,-1)
                        
                        if(tX>=temp1){
                            set(tLastArea,3)            //3
                            set(tBaseAngle,90)          //基角=90
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,tX)
                            set(tTanSymbol,0)           //不取余
                            
                        }else{
                            set(tLastArea,4)            //4
                            set(tBaseAngle,135)         //基角=135
                            set(tTan,tX)                //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,1)           //取余
                        }
                    }
                }else{
                    if(tY<0){
                        set(temp1,tX)                   //取绝对值
                        multiply(temp1,-1)
                        set(temp2,tY)
                        multiply(temp2,-1)
                        
                        if(temp2>=temp1){
                            set(tLastArea,5)            //5
                            set(tBaseAngle,180)         //基角=180
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,temp2)
                            set(tTanSymbol,0)           //不取余
                            
                        }else{
                            set(tLastArea,6)            //6
                            set(tBaseAngle,225)         //基角=225
                            set(tTan,temp2)             //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,1)           //取余
                        }
                    }else{
                        set(temp1,tX)                   //取绝对值
                        multiply(temp1,-1)
                        
                        if(temp1>=tY){
                            set(tLastArea,7)            //7
                            set(tBaseAngle,270)         //基角=270
                            set(tTan,tY)                //tan值
                            multiply(tTan,10)
                            divide(tTan,temp1)
                            set(tTanSymbol,0)           //不取余
                            
                        }else{
                            if(tOver==1){
                                if(tLastArea==1){
                                     set(tOver,0)       //未溢出合法
                                }
                            }else{
                                if(tLastArea==1){
                                     set(tOver,1)       //溢出不合法
                                }
                            }
                            set(tLastArea,8)            //8
                            set(tBaseAngle,315)         //基角=315
                            set(tTan,temp1)             //tan值
                            multiply(tTan,10)
                            divide(tTan,tY)
                            set(tTanSymbol,1)           //取余
                        } 
                    }
                }   
                                                        //判断是否溢出
                if(tOver==0){
                                                        //tan值查表，计算tanAngle
                    if(tTan==0){
                        set(tTanAngle,0)
                    }else{
                        if(tTan==1){
                            set(tTanAngle,6)  
                        }else{
                            if(tTan==2){
                                set(tTanAngle,12)  
                            }else{
                                if(tTan==3){
                                    set(tTanAngle,17)  
                                }else{
                                    if(tTan==4){
                                        set(tTanAngle,22)  
                                    }else{
                                        if(tTan==5){
                                            set(tTanAngle,27)  
                                        }else{
                                            if(tTan==6){
                                                set(tTanAngle,31)  
                                            }else{
                                                if(tTan==7){
                                                    set(tTanAngle,35)  
                                                }else{
                                                    if(tTan==8){
                                                        set(tTanAngle,39)  
                                                    }else{
                                                        if(tTan==9){
                                                            set(tTanAngle,42)  
                                                        }else{
                                                            if(tTan==10){
                                                                set(tTanAngle,45)  
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
    
                                                          //取余
                    if(tTanSymbol==1){
                        set(temp1,45)
                        minus(temp1,tTanAngle)
                        set(tTanAngle,temp1)
                    }
                    
                                                          //计算旋转角
                    set(tRotateAngle,tBaseAngle)
                    add(tRotateAngle,tTanAngle)
                }else{                                    //溢出
                                                          //溢出补满整圆，或清除整圆
                    if(tLastArea==1){
                        set(tRotateAngle,360)
                    }
                    if(tLastArea==8){
                        set(tRotateAngle,0)
                    }
                }
                                                          //计算tag值
                set(temp1,tMaxValue) 
                minus(temp1,tMinValue)
                multiply(temp1,tRotateAngle)
                divide(temp1,360)
                add(temp1,tMinValue)
                
                                                           //setTag
                setTag(temp1)

                set('this.otherAttrs.5',tLastArea)         //lastArea
                set('this.otherAttrs.6',tOver)             //over
                
            }
        `,
        onTagChange: `
            var(curValue,0)                                //tag值
            getTag(curValue)
            
            var(tMinValue,0)                               //最小值
            set(tMinValue,'this.minValue')
            
            var(tMaxValue,0)                               //最大值
            set(tMaxValue,'this.maxValue')
            
            var(tRotateX,0)                                //旋转中心坐标X
            set(tRotateX,'this.otherAttrs.2')
            
            var(tRotateY,0)                                //旋转中心坐标Y
            set(tRotateY,'this.otherAttrs.3')
            
            var(tRotateAngle,0)                            //旋转角
            
            var(tAlpha,0)                                  //roi起始点角度
            set(tAlpha,-90)

            var(tBbeta,0)                                  //roi终点角度
            set(tBbeta,tAlpha)
            
            var(temp1,0)                                   //临时变量
            var(temp2,0)
            
                                                            //计算偏转角
            if(curValue<tMinValue){
                                                            //小于最小值，偏转角为0
                set(tRotateAngle,0)
            }else{
                if(tMaxValue<curValue){
                                                            //大于最大值，偏转角为360
                    set(tRotateAngle,360)
                }else{
                                                            //tRotateAngle=(curValue-minValue)/(maxValue-minValue)*360;
                    set(temp1,tMaxValue)     
                    minus(temp1,tMinValue)
                    set(temp2,curValue)
                    minus(temp2,tMinValue)
                    multiply(temp2,360)
                    divide(temp2,temp1)
                    set(tRotateAngle,temp2)
                }
            }
                                                             //计算beta值
            add(tBbeta,tRotateAngle)

                                                             //光带层roi设置
            set('this.layers.1.subLayers.roi.p1x',tRotateX)
            set('this.layers.1.subLayers.roi.p1y',tRotateY)
            set('this.layers.1.subLayers.roi.alpha',tAlpha)
            set('this.layers.1.subLayers.roi.beta',tBbeta)
            
                                                             //光标层旋转设置
            set('this.layers.2.rotateCenterX',tRotateX)
            set('this.layers.2.rotateCenterY',tRotateY)
            set('this.layers.2.rotateAngle',tRotateAngle)  
            
        `,
        onKeyBoardLeft: `
            var(tMaxHighLightNum,0)                          //控件内高亮块数
            set(tMaxHighLightNum,'this.maxHighLightNum')
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.1')
            var(len,0)                                       //图层总数
            set(len,'this.layers.length')
            minus(len,1)
                                                             //判断是否启用高亮
            if (tMaxHighLightNum>0) {
                if(okFlag==0){                               //控件间高亮选择
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    if (tHighLightNum==1) {
                                                             //hashighlight
                        set('this.layers.len.hidden',0)
                    }else{
                        set('this.layers.len.hidden',1)
                    }
                }else{                                       //高亮已选择，左移tag值减1
                    var(curItem,0)
                    getTag(curItem)
                    minus(curItem,1)
                    setTag(curItem)
                }
            }
          
        `,
        onKeyBoardRight: `
            var(tMaxHighLightNum,0)                          //控件内高亮块数
            set(tMaxHighLightNum,'this.maxHighLightNum')
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.1')
            var(len,0)                                       //图层总数
            set(len,'this.layers.length')
            minus(len,1)
                                                             //判断是否启用高亮
            if (tMaxHighLightNum>0) {
                if(okFlag==0){                               //控件间高亮选择
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    if (tHighLightNum==1) {
                        //hashighlight
                        set('this.layers.len.hidden',0)
                    }else{
                        set('this.layers.len.hidden',1)
                    }
                }else{                                       //高亮已选择，右移tag值加1
                    var(curItem,0)
                    getTag(curItem)
                    add(curItem,1)
                    setTag(curItem)
                }
            }
        `,
        onKeyBoardOK: `
            var(okFlag,0)                                    //高亮是否已选中
            set(okFlag,'this.otherAttrs.1')
            if(okFlag==0){
                setglobalvar(0,1)
                set('this.otherAttrs.1',1)
            }else{
                setglobalvar(0,0)
                set('this.otherAttrs.1',0)
            }
        `
    };

    WidgetCommands['DateTime'] = {
        onInitialize: `
            var(offset,0)
            var(len,0)
            set(offset,'this.otherAttrs.0')
            set(len,'this.layers.length')
            while(offset<len){
                set('this.layers.offset.hidden',1)
                add(offset,1)
            }
        `,
        onMouseUp: `
        `,
        onMouseDown: `
        `,
        onTagChange: `
            var(m,0)
            set(m,'this.mode')
            var(tag,0)
            getTag(tag)
            var(tTag,0)
            if(tag==0){
                print(tag,'tag is 0')
            }else{
                set(tTag,tag)
                var(len,0)
                set(len,'this.otherAttrs.0')
                minus(len,1)
                var(flag1,0)
                set(flag1,10)
                var(flag2,0)
                set(flag2,10)
                if(m==0){
                    set(flag1,2)
                    set(flag2,5)
                }else{
                    if(m==1){
                        set(flag1,2)
                    }else{
                        if(m==2){
                            set(flag1,4)
                            set(flag2,7)
                        }else{
                            if(m==3){
                                set(flag1,4)
                                set(flag2,7)
                            }else{
                                print(m,'mode is unknown')
                            }
                        }
                    }
                }
                if(m==1){
                    divide(tag,16)
                    divide(tag,16)
                    set(tTag,tag)
                }
                while(len>=0){
                    if(len==flag1){
                        minus(len,1)
                    }else{
                        if(len==flag2){
                            minus(len,1)
                        }else{
                            mod(tTag,16)
                            add(tTag,48)
                            // print(tTag,'curDigit')
                            set('this.layers.len.subLayers.font.text',tTag)
                            divide(tag,16)
                            set(tTag,tag)
                            minus(len,1)
                        }
                    }
                }
            }
        `,
        onKeyBoardLeft: `
            var(tMaxHighLightNum,0)
            var(okFlag,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            set(okFlag,'this.otherAttrs.1')
            if(tMaxHighLightNum>0){
                if(okFlag==0){
                    var(totalLayerNum,0)
                    set(totalLayerNum,'this.layers.length')
                    var(offset,0)
                    var(tHighLightNum,0)
                    //clear
                    set(offset,'this.otherAttrs.0')
                    while(offset < totalLayerNum){
                        set('this.layers.offset.hidden',1)
                        add(offset,1)
                    }
                    //set target highlight
                    set(offset,'this.otherAttrs.0')
                    set(tHighLightNum,'this.highLightNum')
                    add(offset,tHighLightNum)
                    minus(offset,1)
                    set('this.layers.offset.hidden',0)   
                }else{
                    print(okFlag,'ok mode')
                    var(tHighLightNum,0)
                    var(tTag,0)
                    var(tMode,0)
                    var(xr,0)
                    var(minusNum,0)
                    set(minusNum,1)
                    set(tHighLightNum,'this.highLightNum')
                    getTag(tTag)
                    set(tMode,'this.mode')
                    if(tMode==1){
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            set(xr,2)
                        }
                    }else{
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            if(tHighLightNum==2){
                                set(xr,2)
                            }else{
                                set(xr,0)
                            }
                        }
                    }
                    var(ttTag,0)
                    var(txr,0)
                    set(ttTag,tTag)
                    set(txr,xr)
                    while(xr>0){
                        divide(ttTag,16)
                        minus(xr,1)
                    }
                    var(ttTagBeforeChange,0)
                    set(ttTagBeforeChange,ttTag)
                   
                    mod(ttTagBeforeChange,256)
                    var(tOverFlow,0)
                    set(tOverFlow,0)
                    //判断是否溢出
                    if(ttTagBeforeChange <= 0){
                        set(tOverFlow,1)
                    }
                    if(tOverFlow == 0){
                        mod(ttTag,16)
                        var(rawttTag,0)
                        set(rawttTag,ttTag)
                        minus(ttTag,1)
                        if(ttTag<0){
                            set(ttTag,-7)
                        }
                        while(txr>0){
                            multiply(ttTag,16)
                            multiply(rawttTag,16)
                            minus(txr,1)
                        }
                        minus(ttTag,rawttTag)
                        add(tTag,ttTag)
                        setTag(tTag)
                    }
                    
                }              
            }
        `,
        onKeyBoardRight: `
            var(tMaxHighLightNum,0)
            var(okFlag,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            set(okFlag,'this.otherAttrs.1')
            if(tMaxHighLightNum>0){
                if(okFlag==0){
                    var(totalLayerNum,0)
                    set(totalLayerNum,'this.layers.length')
                    var(offset,0)
                    var(tHighLightNum,0)
                    //clear
                    set(offset,'this.otherAttrs.0')
                    while(offset < totalLayerNum){
                        set('this.layers.offset.hidden',1)
                        add(offset,1)
                    }
                    //set target highlight
                    set(offset,'this.otherAttrs.0')
                    set(tHighLightNum,'this.highLightNum')
                    add(offset,tHighLightNum)
                    minus(offset,1)
                    set('this.layers.offset.hidden',0)
                }else{
                    //change num in ok mode
                    var(tHighLightNum,0)
                    var(tTag,0)
                    var(tMode,0)
                    var(xr,0)
                    var(addNum,0)
                    set(addNum,1)
                    set(tHighLightNum,'this.highLightNum')
                    getTag(tTag)
                    set(tMode,'this.mode')
                    if(tMode==1){
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            set(xr,2)
                        }
                    }else{
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            if(tHighLightNum==2){
                                set(xr,2)
                            }else{
                                set(xr,0)
                            }
                        }
                    }
                    var(ttTag,0)
                    var(txr,0)
                    var(ttxr,0)
                    set(ttTag,tTag)
                    set(txr,xr)
                    set(ttxr,xr)
                    while(xr>0){
                        divide(ttTag,16)
                        minus(xr,1)
                    }
                    var(ttTagBeforeChange,0)
                    set(ttTagBeforeChange,ttTag)
                   
                    mod(ttTagBeforeChange,256)
                    var(tOverFlow,0)
                    set(tOverFlow,0)
                    //判断是否溢出
                    if(tMode == 0){
                        //时分秒
                        if(tHighLightNum == 1){
                            //时
                            if(ttTagBeforeChange >= 35){
                                set(tOverFlow,1)
                            }
                        }else{
                            if(ttTagBeforeChange >= 89){
                                set(tOverFlow,1)
                            }
                        }
                    }else{
                        if(tMode == 1){
                            //时分
                            if(tHighLightNum == 1){
                                //时
                                if(ttTagBeforeChange >= 35){
                                    set(tOverFlow,1)
                                }
                            }else{
                                if(ttTagBeforeChange >= 89){
                                    set(tOverFlow,1)
                                }
                            }
                        }else{
                            //年月日
                            if(tHighLightNum == 1){
                                //年
                                // if(ttTagBeforeChange >= 35){
                                //     set(tOverFlow,1)
                                // }
                            }else{
                                if(tHighLightNum == 2){
                                    //月
                                    if(ttTagBeforeChange >= 18){
                                        set(tOverFlow,1)
                                    }
                                }else{
                                    if(ttTagBeforeChange >= 49){
                                        set(tOverFlow,1)
                                    }
                                }
                                
                            }
                        }
                    }
                    if(tOverFlow == 0){
                        mod(ttTag,16)
                        var(rawttTag,0)
                        set(rawttTag,ttTag)
                        add(ttTag,1)
                        if(ttTag>=10){
                            set(ttTag,16)
                        }
                        
                        while(txr>0){
                            multiply(ttTag,16)
                            multiply(rawttTag,16)
                            minus(txr,1)
                        }
                        minus(ttTag,rawttTag)
                        add(tTag,ttTag)
                        //check value in limit
                        setTag(tTag)
                    }
                    
                }                
            }
        `,
        onKeyBoardOK: `
            var(okFlag,0)
            set(okFlag,'this.otherAttrs.1')
            if(okFlag==0){
                setglobalvar(0,1)
                set('this.otherAttrs.1',1)
            }else{
                setglobalvar(0,0)
                set('this.otherAttrs.1',0)
            }
        `
    };

    WidgetCommands['ColorBlock'] = {
        'onInitialize': ` 
            //显示除高亮以外所有图层
            var(tOffset,0)
            var(len,0)
            set(len,'this.layers.length')
            while(tOffset < len){
                set('this.layers.tOffset.hidden',0)
                add(tOffset,1)
            }
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
            //初始化属性
            var(tCurValue,0)                      //tag值
            getTag(tCurValue)
            print('tCurValue',tCurValue)

            var(tempCurValue,0)                   //临时变量tempCurValue           
            set(tempCurValue,tCurValue)

            var(tOverFlow,0)                        //溢出标志
                        
            var(temp1,0)                          //临时变量1
            var(temp2,0)                          //临时变量2
            
            if(tCurValue<0){
                //负溢出
                set(tOverFlow,1)
            }

            //a
            //temp2=tempCurValue-tempCurValue/1000*1000
            //tempCurValue=tempCurValue/1000
            set(temp1,tempCurValue)
            set(temp2,tempCurValue)
            divide(temp1,1000)
            set(tempCurValue,temp1)            
            multiply(temp1,1000)
            minus(temp2,temp1)
            
            //溢出标记
            if(temp2>255){
                set(tOverFlow,1)
            }
                        
            //change
            set('this.layers.0.subLayers.color.a',temp2)

            //b
            //temp2=tempCurValue-tempCurValue/1000*1000
            //tempCurValue=tempCurValue/1000
            set(temp1,tempCurValue)
            set(temp2,tempCurValue)
            divide(temp1,1000)
            set(tempCurValue,temp1)            
            multiply(temp1,1000)
            minus(temp2,temp1)
            
            //溢出标记
            if(temp2>255){
                set(tOverFlow,1)
            }
                        
            //change
            set('this.layers.0.subLayers.color.b',temp2)

            //g
            //temp2=tempCurValue-tempCurValue/1000*1000
            //tempCurValue=tempCurValue/1000
            set(temp1,tempCurValue)
            set(temp2,tempCurValue)
            divide(temp1,1000)
            set(tempCurValue,temp1)            
            multiply(temp1,1000)
            minus(temp2,temp1)
            
            //溢出标记
            if(temp2>255){
                set(tOverFlow,1)
            }
                        
            //change
            set('this.layers.0.subLayers.color.g',temp2)
            
            //r
            //temp2=tempCurValue-tempCurValue/1000*1000
            //tempCurValue=tempCurValue/1000
            set(temp1,tempCurValue)
            set(temp2,tempCurValue)
            divide(temp1,1000)
            set(tempCurValue,temp1)            
            multiply(temp1,1000)
            minus(temp2,temp1)
            
            //溢出标记
            if(temp2>255){
                set(tOverFlow,1)
            }
                        
            //change
            set('this.layers.0.subLayers.color.r',temp2)

            //溢出处理:全部置为零
            if(tOverFlow==1){
                set('this.layers.0.subLayers.color.r',0)
                set('this.layers.0.subLayers.color.g',0)
                set('this.layers.0.subLayers.color.b',0)
                set('this.layers.0.subLayers.color.a',0)
            }

        `,
        onKeyBoardLeft: `
        `,
        onKeyBoardRight: `
        `,
        onKeyBoardOK: `
        `
    };

    WidgetCommands['ColorPicker'] = {
        "onInitialize": `
            var(tInitValue,0)
            set(tInitValue,'this.otherAttrs.0')
           
            var(tR,0)
            var(tG,0)
            var(tB,0)
            set(tR,'this.otherAttrs.1')
            set(tG,'this.otherAttrs.1')
            set(tB,'this.otherAttrs.1')
            mod(tB,256)
            divide(tG,256)
            mod(tG,256)
            divide(tR,256)
            divide(tR,256)
            //rgbToHSV
            var(tMin,0)
            var(tMax,0)
            var(tDelta,0)
            var(tH,0)
            var(tS,0)
            var(tV,0)
            if(tR > tG){
                set(tMax,tR)
                set(tMin,tG)
            }else{
                set(tMin,tR)
                set(tMax,tG)
            }
            if(tB>tMax){
                set(tMax,tB)
            }else{
                if(tB<tMin){
                    set(tMin,tB)
                }
            }
            
            print('tMax',tMax)
            print('tMin',tMin)
            
            //set v
            set(tV,tMax)
            //set delta
            set(tDelta,tMax)
            minus(tDelta,tMin)
            if(tMax == 0 ){
                set(tS,0)
                set(tH,-1)
               
            }else{
                //set s, x255
                set(tS,255)
                
                multiply(tS,tDelta)
                divide(tS,tMax)
                //set h
                if(tDelta == 0){
                    set(tH,-1)
                }else{
                    if(tR==tMax){
                        set(tH,tG)
                        minus(tH,tB)
                        multiply(tH,60)
                        divide(tH,tDelta)
                    }else{
                        if(tG == tMax){
                            set(tH,tB)
                            minus(tH,tR)
                            multiply(tH,60)
                            divide(tH,tDelta)
                            add(tH,120)
                        }else{
                            set(tH,tR)
                            minus(tH,tG)
                            multiply(tH,60)
                            divide(tH,tDelta)
                            add(tH,240)
                        }
                    }
                    if(tH<0){
                        add(tH,360) 
                    }
                }
            }
            
            print('h',tH)
            print('s',tS)
            print('v',tV)
            
        `,
        'onMouseDown': `
            var(tTemp,0)
            var(tH,0)
            var(tS,0)
            var(tV,0)
            
            //get Last HSV
            set(tH,'this.otherAttrs.1')
            set(tS,'this.otherAttrs.2')
            set(tV,'this.otherAttrs.3')
            var(tR,0)
            var(tG,0)
            var(tB,0)
            var(tA,0)
            var(tI,0)
            var(tF,0)
            var(tP,0)
            var(tQ,0)
            var(tT,0)
            var(tChangeFlag,0)
            //get current h,s,v
            var(tInnerX,0)
            var(tInnerY,0)
            set(tInnerX,'this.innerX')
            set(tInnerY,'this.innerY')
            var(tPickerX,0)
            var(tPickerY,0)
            var(tPickerW,0)
            var(tPickerH,0)
            var(tPickerRightX,0)
            var(tPickerBottomY,0)
            set(tPickerX,'this.layers.3.x')
            set(tPickerY,'this.layers.3.y')
            set(tPickerW,'this.layers.3.width')
            set(tPickerH,'this.layers.3.height')
            set(tPickerRightX,tPickerX)
            add(tPickerRightX,tPickerW)
            set(tPickerBottomY,tPickerY)
            add(tPickerBottomY,tPickerH)
            if(tInnerX >= tPickerX){
                if(tInnerX < tPickerRightX){
                    if(tInnerY >= tPickerY){
                        if(tInnerY < tPickerBottomY){
                            set(tChangeFlag,1)
                            //hit picker area
                            //otherAttr 4 hit area 0:none 1:hue 2:picker
                            set('this.otherAttrs.4',1)
                            //move picker indicator
                            set('this.layers.7.x',tInnerX)
                            set('this.layers.7.y',tInnerY)
                            set(tS,tInnerX)
                            minus(tS,tPickerX)
                            multiply(tS,255)
                            divide(tS,tPickerW)
                            set(tV,tPickerH)
                            minus(tV,tInnerY)
                            add(tV,tPickerY)
                            multiply(tV,255)
                            divide(tV,tPickerH)
                            set('this.otherAttrs.2',tS)
                            set('this.otherAttrs.3',tV)
                        }
                    }
                }
            }
            
            //hue
            var(tHueX,0)
            var(tHueY,0)
            var(tHueW,0)
            var(tHueH,0)
            var(tHueRightX,0)
            var(tHueBottomY,0)
            set(tHueX,'this.layers.1.x')
            set(tHueY,'this.layers.1.y')
            set(tHueW,'this.layers.1.width')
            set(tHueH,'this.layers.1.height')
            set(tHueRightX,tHueX)
            add(tHueRightX,tHueW)
            set(tHueBottomY,tHueY)
            add(tHueBottomY,tHueH)
            var(tSBack,0)
            var(tVBack,0)
            if(tInnerX>=tHueX){
                if(tInnerX<tHueRightX){
                    if(tInnerY>=tHueY){
                        if(tInnerY<tHueBottomY){
                            set(tChangeFlag,1)
                            set('this.otherAttrs.4',2)
                            //move hue indicator
                            // set('this.layers.4.x',tInnerX)
                            set('this.layers.5.y',tInnerY)
                            //set h
                            set(tH,tInnerY)
                            minus(tH,tHueY)
                            multiply(tH,360)
                            divide(tH,tHueH)
                            set('this.otherAttrs.1',tH)
                            
                            //change picker bg color
                            set(tSBack,tS)
                            set(tVBack,tV)
                            set(tS,255)
                            set(tV,255)
                            if(tS == 0){
                                set(tR,tV)
                                set(tG,tV)
                                set(tB,tV)
                            }else{
                                set(tI,tH)
                                divide(tI,60)
                                set(tF,tH)
                                set(tTemp,tI)
                                multiply(tTemp,60)
                                //tF = 60*f
                                minus(tF,tTemp)
                                
                                //set p
                                set(tP,255)
                                minus(tP,tS)
                                multiply(tP,tV)
                                divide(tP,255)
                                
                                //set q
                                set(tTemp,tS)
                                multiply(tTemp,tF)
                                set(tQ,15300)
                                minus(tQ,tTemp)
                                multiply(tQ,tV)
                                divide(tQ,15300)
                                
                                //set t
                                set(tTemp,60)
                                minus(tTemp,tF)
                                multiply(tTemp,tS)
                                set(tT,15300)
                                minus(tT,tTemp)
                                multiply(tT,tV)
                                divide(tT,15300)
                               
                                
                                if(tI == 0){
                                    set(tR,tV)
                                    set(tG,tT)
                                    set(tB,tP)
                                }else{
                                    if(tI == 1){
                                        set(tR,tQ)
                                        set(tG,tV)
                                        set(tB,tP)
                                    }else{
                                        if(tI == 2){
                                            set(tR,tP)
                                            set(tG,tV)
                                            set(tB,tT)
                                        }else{
                                            if(tI == 3){
                                                set(tR,tP)
                                                set(tG,tQ)
                                                set(tB,tV)
                                            }else{
                                                if(tI == 4){
                                                    set(tR,tT)
                                                    set(tG,tP)
                                                    set(tB,tV)
                                                }else{
                                                    set(tR,tV)
                                                    set(tG,tP)
                                                    set(tB,tQ)
                                                }
                                            }
                                        }
                                    }
                                }    
                                
                            }
                            //set picker bg color
                            set('this.layers.3.subLayers.color.r',tR)
                            set('this.layers.3.subLayers.color.g',tG)
                            set('this.layers.3.subLayers.color.b',tB)
                            set('this.layers.3.subLayers.color.a',255)
                            //restore tS,tV
                            set(tS,tSBack)
                            set(tV,tVBack)
                        }
                    }
                }
            }
            
            //alpha
            var(tAlphaX,0)
            var(tAlphaY,0)
            var(tAlphaRightX,0)
            var(tAlphaBottomY,0)
            var(tAlphaW,0)
            var(tAlphaH,0)
            set(tAlphaX,'this.layers.2.x')
            set(tAlphaY,'this.layers.2.y')
            set(tAlphaW,'this.layers.2.width')
            set(tAlphaH,'this.layers.2.height')
            set(tAlphaRightX,tAlphaX)
            add(tAlphaRightX,tAlphaW)
            set(tAlphaBottomY,tAlphaY)
            add(tAlphaBottomY,tAlphaH)
            if(tInnerX > tAlphaX){
                if(tInnerX < tAlphaRightX){
                    if(tInnerY > tAlphaY){
                        if(tInnerY < tAlphaBottomY){
                            // hit alpha
                            set(tChangeFlag,1)
                            set('this.otherAttrs.4',3)
                            //change alpha
                            set('this.layers.6.y',tInnerY)
                            set(tA,tInnerY)
                            minus(tA,tAlphaY)
                            multiply(tA,255)
                            divide(tA,tAlphaH)
                            set('this.layers.4.subLayers.color.a',tA)
                            
                        }
                    }
                }
            }
            
            if(tChangeFlag == 1){
            
                
                if(tS == 0){
                    set(tR,tV)
                    set(tG,tV)
                    set(tB,tV)
                }else{
                    set(tI,tH)
                    divide(tI,60)
                    set(tF,tH)
                    set(tTemp,tI)
                    multiply(tTemp,60)
                    //tF = 60*f
                    minus(tF,tTemp)
                    
                    //set p
                    set(tP,255)
                    minus(tP,tS)
                    multiply(tP,tV)
                    divide(tP,255)
                    
                    //set q
                    set(tTemp,tS)
                    multiply(tTemp,tF)
                    set(tQ,15300)
                    minus(tQ,tTemp)
                    multiply(tQ,tV)
                    divide(tQ,15300)
                    
                    //set t
                    set(tTemp,60)
                    minus(tTemp,tF)
                    multiply(tTemp,tS)
                    set(tT,15300)
                    minus(tT,tTemp)
                    multiply(tT,tV)
                    divide(tT,15300)
                   
                    
                    if(tI == 0){
                        set(tR,tV)
                        set(tG,tT)
                        set(tB,tP)
                    }else{
                        if(tI == 1){
                            set(tR,tQ)
                            set(tG,tV)
                            set(tB,tP)
                        }else{
                            if(tI == 2){
                                set(tR,tP)
                                set(tG,tV)
                                set(tB,tT)
                            }else{
                                if(tI == 3){
                                    set(tR,tP)
                                    set(tG,tQ)
                                    set(tB,tV)
                                }else{
                                    if(tI == 4){
                                        set(tR,tT)
                                        set(tG,tP)
                                        set(tB,tV)
                                    }else{
                                        set(tR,tV)
                                        set(tG,tP)
                                        set(tB,tQ)
                                    }
                                }
                            }
                        }
                    }    
                    
                }
               
                set('this.layers.4.subLayers.color.r',tR)
                set('this.layers.4.subLayers.color.g',tG)
                set('this.layers.4.subLayers.color.b',tB)
                
                var(tResult,0)
                set(tResult,tR)
                multiply(tResult,256)
                add(tResult,tG)
                multiply(tResult,256)
                add(tResult,tB)
                multiply(tResult,256)
                add(tResult,tA)
                setTag(tResult)
                
                print('r',tR)
                print('g',tG)
                print('b',tB)
            
            }
           
            
            
            
        `,
        'onMouseMove': `
            // var(tTemp,0)
            // var(tH,0)
            // var(tS,0)
            // var(tV,0)
            //
            // //get Last HSV
            // set(tH,'this.otherAttrs.1')
            // set(tS,'this.otherAttrs.2')
            // set(tV,'this.otherAttrs.3')
            // var(tR,0)
            // var(tG,0)
            // var(tB,0)
            // var(tA,0)
            // var(tI,0)
            // var(tF,0)
            // var(tP,0)
            // var(tQ,0)
            // var(tT,0)
            // var(tChangeFlag,0)
            // //get current h,s,v
            // var(tInnerX,0)
            // var(tInnerY,0)
            // set(tInnerX,'this.innerX')
            // set(tInnerY,'this.innerY')
            // var(tPickerX,0)
            // var(tPickerY,0)
            // var(tPickerW,0)
            // var(tPickerH,0)
            // var(tPickerRightX,0)
            // var(tPickerBottomY,0)
            // set(tPickerX,'this.layers.3.x')
            // set(tPickerY,'this.layers.3.y')
            // set(tPickerW,'this.layers.3.width')
            // set(tPickerH,'this.layers.3.height')
            // set(tPickerRightX,tPickerX)
            // add(tPickerRightX,tPickerW)
            // set(tPickerBottomY,tPickerY)
            // add(tPickerBottomY,tPickerH)
            // if(tInnerX >= tPickerX){
            //     if(tInnerX < tPickerRightX){
            //         if(tInnerY >= tPickerY){
            //             if(tInnerY < tPickerBottomY){
            //                 set(tChangeFlag,1)
            //                 //hit picker area
            //                 //otherAttr 4 hit area 0:none 1:hue 2:picker
            //                 set('this.otherAttrs.4',1)
            //                 //move picker indicator
            //                 set('this.layers.7.x',tInnerX)
            //                 set('this.layers.7.y',tInnerY)
            //                 set(tS,tInnerX)
            //                 minus(tS,tPickerX)
            //                 multiply(tS,255)
            //                 divide(tS,tPickerW)
            //                 set(tV,tPickerH)
            //                 minus(tV,tInnerY)
            //                 add(tV,tPickerY)
            //                 multiply(tV,255)
            //                 divide(tV,tPickerH)
            //                 set('this.otherAttrs.2',tS)
            //                 set('this.otherAttrs.3',tV)
            //             }
            //         }
            //     }
            // }
            //
            // //hue
            // var(tHueX,0)
            // var(tHuey,0)
            // var(tHueW,0)
            // var(tHueH,0)
            // var(tHueRightX,0)
            // var(tHueBottomY,0)
            // set(tHueX,'this.layers.1.x')
            // set(tHueY,'this.layers.1.y')
            // set(tHueW,'this.layers.1.width')
            // set(tHueH,'this.layers.1.height')
            // set(tHueRightX,tHueX)
            // add(tHueRightX,tHueW)
            // set(tHueBottomY,tHueY)
            // add(tHueBottomY,tHueH)
            // var(tSBack,0)
            // var(tVBack,0)
            // if(tInnerX>=tHueX){
            //     if(tInnerX<tHueRightX){
            //         if(tInnerY>=tHueY){
            //             if(tInnerY<tHueBottomY){
            //                 set(tChangeFlag,1)
            //                 set('this.otherAttrs.4',2)
            //                 //move hue indicator
            //                 // set('this.layers.4.x',tInnerX)
            //                 set('this.layers.5.y',tInnerY)
            //                 //set h
            //                 set(tH,tInnerY)
            //                 minus(tH,tHueY)
            //                 multiply(tH,360)
            //                 divide(tH,tHueH)
            //                 set('this.otherAttrs.1',tH)
            //                
            //                 //change picker bg color
            //                 set(tSBack,tS)
            //                 set(tVBack,tV)
            //                 set(tS,255)
            //                 set(tV,255)
            //                 if(tS == 0){
            //                     set(tR,tV)
            //                     set(tG,tV)
            //                     set(tB,tV)
            //                 }else{
            //                     set(tI,tH)
            //                     divide(tI,60)
            //                     set(tF,tH)
            //                     set(tTemp,tI)
            //                     multiply(tTemp,60)
            //                     //tF = 60*f
            //                     minus(tF,tTemp)
            //                    
            //                     //set p
            //                     set(tP,255)
            //                     minus(tP,tS)
            //                     multiply(tP,tV)
            //                     divide(tP,255)
            //                    
            //                     //set q
            //                     set(tTemp,tS)
            //                     multiply(tTemp,tF)
            //                     set(tQ,15300)
            //                     minus(tQ,tTemp)
            //                     multiply(tQ,tV)
            //                     divide(tQ,15300)
            //                    
            //                     //set t
            //                     set(tTemp,60)
            //                     minus(tTemp,tF)
            //                     multiply(tTemp,tS)
            //                     set(tT,15300)
            //                     minus(tT,tTemp)
            //                     multiply(tT,tV)
            //                     divide(tT,15300)
            //                   
            //                    
            //                     if(tI == 0){
            //                         set(tR,tV)
            //                         set(tG,tT)
            //                         set(tB,tP)
            //                     }else{
            //                         if(tI == 1){
            //                             set(tR,tQ)
            //                             set(tG,tV)
            //                             set(tB,tP)
            //                         }else{
            //                             if(tI == 2){
            //                                 set(tR,tP)
            //                                 set(tG,tV)
            //                                 set(tB,tT)
            //                             }else{
            //                                 if(tI == 3){
            //                                     set(tR,tP)
            //                                     set(tG,tQ)
            //                                     set(tB,tV)
            //                                 }else{
            //                                     if(tI == 4){
            //                                         set(tR,tT)
            //                                         set(tG,tP)
            //                                         set(tB,tV)
            //                                     }else{
            //                                         set(tR,tV)
            //                                         set(tG,tP)
            //                                         set(tB,tQ)
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }    
            //                    
            //                 }
            //                 //set picker bg color
            //                 set('this.layers.3.subLayers.color.r',tR)
            //                 set('this.layers.3.subLayers.color.g',tG)
            //                 set('this.layers.3.subLayers.color.b',tB)
            //                 //restore tS,tV
            //                 set(tS,tSBack)
            //                 set(tV,tVBack)
            //             }
            //         }
            //     }
            // }
            //
            // //alpha
            // var(tAlphaX,0)
            // var(tAlphaY,0)
            // var(tAlphaRightX,0)
            // var(tAlphaBottomY,0)
            // var(tAlphaW,0)
            // var(tAlphaH,0)
            // set(tAlphaX,'this.layers.2.x')
            // set(tAlphaY,'this.layers.2.y')
            // set(tAlphaW,'this.layers.2.width')
            // set(tAlphaH,'this.layers.2.height')
            // set(tAlphaRightX,tAlphaX)
            // add(tAlphaRightX,tAlphaW)
            // set(tAlphaBottomY,tAlphaY)
            // add(tAlphaBottomY,tAlphaH)
            // if(tInnerX > tAlphaX){
            //     if(tInnerX < tAlphaRightX){
            //         if(tInnerY > tAlphaY){
            //             if(tInnerY < tAlphaBottomY){
            //                 // hit alpha
            //                 set(tChangeFlag,1)
            //                 set('this.otherAttrs.4',3)
            //                 //change alpha
            //                 set('this.layers.6.y',tInnerY)
            //                 set(tA,tInnerY)
            //                 minus(tA,tAlphaY)
            //                 multiply(tA,255)
            //                 divide(tA,tAlphaH)
            //                 set('this.layers.4.subLayers.color.a',tA)
            //                
            //             }
            //         }
            //     }
            // }
            //
            // if(tChangeFlag == 1){
            //
            //    
            //     if(tS == 0){
            //         set(tR,tV)
            //         set(tG,tV)
            //         set(tB,tV)
            //     }else{
            //         set(tI,tH)
            //         divide(tI,60)
            //         set(tF,tH)
            //         set(tTemp,tI)
            //         multiply(tTemp,60)
            //         //tF = 60*f
            //         minus(tF,tTemp)
            //        
            //         //set p
            //         set(tP,255)
            //         minus(tP,tS)
            //         multiply(tP,tV)
            //         divide(tP,255)
            //        
            //         //set q
            //         set(tTemp,tS)
            //         multiply(tTemp,tF)
            //         set(tQ,15300)
            //         minus(tQ,tTemp)
            //         multiply(tQ,tV)
            //         divide(tQ,15300)
            //        
            //         //set t
            //         set(tTemp,60)
            //         minus(tTemp,tF)
            //         multiply(tTemp,tS)
            //         set(tT,15300)
            //         minus(tT,tTemp)
            //         multiply(tT,tV)
            //         divide(tT,15300)
            //       
            //        
            //         if(tI == 0){
            //             set(tR,tV)
            //             set(tG,tT)
            //             set(tB,tP)
            //         }else{
            //             if(tI == 1){
            //                 set(tR,tQ)
            //                 set(tG,tV)
            //                 set(tB,tP)
            //             }else{
            //                 if(tI == 2){
            //                     set(tR,tP)
            //                     set(tG,tV)
            //                     set(tB,tT)
            //                 }else{
            //                     if(tI == 3){
            //                         set(tR,tP)
            //                         set(tG,tQ)
            //                         set(tB,tV)
            //                     }else{
            //                         if(tI == 4){
            //                             set(tR,tT)
            //                             set(tG,tP)
            //                             set(tB,tV)
            //                         }else{
            //                             set(tR,tV)
            //                             set(tG,tP)
            //                             set(tB,tQ)
            //                         }
            //                     }
            //                 }
            //             }
            //         }    
            //        
            //     }
            //   
            //     set('this.layers.4.subLayers.color.r',tR)
            //     set('this.layers.4.subLayers.color.g',tG)
            //     set('this.layers.4.subLayers.color.b',tB)
            //    
            //     var(tResult,0)
            //     set(tResult,tR)
            //     multiply(tResult,1000)
            //     add(tResult,tG)
            //     multiply(tResult,1000)
            //     add(tResult,tB)
            //     multiply(tResult,1000)
            //     add(tResult,tA)
            //     setTag(tResult)
            //    
            //     print('r',tR)
            //     print('g',tG)
            //     print('b',tB)
            //
            // }
            //
        `
    };

    WidgetCommands['SysDatePicker'] = {
        onInitialize:`
            var(tTag,0)
            var(tY,0)        //年
            var(tM,0)        //月
            var(tD,0)        //日

            var(zM,0)        //月份[3,14]，用于蔡勒公式
            var(zY,0)        //年的后两位，用于蔡勒公式
            var(zC,0)        //世纪-1  用于蔡勒公式
            var(zW,0)        //星期几 用于蔡勒公式

            var(temp1,0)     //临时变量1
            var(temp2,0)
            var(daysCnt,0)   //此月的天数
            var(initIndex,0) //日图层的起始索引坐标
            var(layersCnt,0) //图层个数

            //设置tY，tM和tD。
            getTag(tTag)
            if(tTag==0){
                set(tY,'this.otherAttrs.0')
                set(tM,'this.otherAttrs.1')
                set(tD,1)
            }else{
                //使用tag设置变量
                print('use tag','init')
            }

            //设置蔡勒公式相关变量
            set(zC,tY)
            set(zY,tY)
            set(zM,tM)
            if(tM<3){    
                add(zM,12)
                minus(zC,1)
                minus(zY,1)
            }
            divide(zC,100)
            mod(zY,100)
            
            //显示年、月
            set('this.layers.1.subLayers.font.text',tY)
            set('this.layers.2.subLayers.font.text',tM)
            
            //计算zW:w=[c/4]-2c+y+[y/4]+[13(m+1)/5]+d-1;d=1;
            set(zW,zC)
            divide(zW,4)
            set(temp1,zC)
            multiply(temp1,2)
            minus(zW,temp1)
            add(zW,zY)
            set(temp1,zY)
            divide(temp1,4)
            add(zW,temp1)
            set(temp1,zM)
            add(temp1,1)
            multiply(temp1,13)
            divide(temp1,5)
            add(zW,temp1)
            mod(zW,7)
            
            //根据月份设置天数
            if(tM==4){
                set(daysCnt,30)
            }else{
                if(tM==6){
                    set(daysCnt,30)
                }else{
                    if(tM==9){
                        set(daysCnt,30)
                    }else{
                        if(tM==11){
                            set(daysCnt,30)
                        }else{
                            if(tM==2){
                                //非闰年28天
                                set(daysCnt,28)
                                
                                //判断闰年
                                set(temp1,tY)
                                mod(temp1,100)
                                if(temp1==0){
                                    //世纪年
                                    set(temp2,tY)
                                    mod(temp2,400)
                                    if(temp2==0){
                                        set(daysCnt,29)
                                    }
                                }else{
                                    //普通年
                                    set(temp2,tY)
                                    mod(temp2,4)
                                    if(temp2==0){
                                        set(temp2,tY)
                                        mod(temp2,100)
                                        if(temp2>0){
                                            set(daysCnt,29)
                                        }
                                    }
                                }
                            }else{
                                set(daysCnt,31)
                            }
                        }
                    }
                }
            }
            //保存daysCnt
            set('this.otherAttrs.11',daysCnt)
            
            //开始绘制日图层上的数字
            set(initIndex,'this.otherAttrs.2')
            set(layersCnt,'this.layers.length')            
           
            set(temp1,zW)
            add(temp1,initIndex)            //起始显示坐标
            add(daysCnt,temp1)

            
            set(temp2,1)                    //显示的日字符
            while(initIndex<layersCnt){
                if(initIndex>=temp1){
                    if(initIndex<daysCnt){
                        set('this.layers.initIndex.hidden',0)
                        set('this.layers.initIndex.subLayers.font.text',temp2)
                        add(temp2,1)
                    }else{
                        // set('this.layers.initIndex.subLayers.font.text',0)
                        set('this.layers.initIndex.hidden',1)
                    }
                }else{
                    // set('this.layers.initIndex.subLayers.font.text',0)
                    set('this.layers.initIndex.hidden',1)
                }
                add(initIndex,1)
            }
            
        `,
        onMouseDown:`
            //***********mouseDown事件独有变量***********
            var(mouseX,0)             //鼠标x位置
            var(mouseY,0)             //鼠标y位置
            var(btnSize,0)            //按键大小
            var(lSide,0)              //左边界，左右按钮的边界
            var(rSide,0)              //右边界
            var(tSide,0)              //上边界
            var(bSide,0)              //下边界
            var(btnFlag,0)            //左、右按键标志位,代表是否按下按键。0,1
            var(highLightIndex,0)
             
            
            set(mouseX,'this.innerX')
            set(mouseY,'this.innerY')
            set(btnSize,'this.otherAttrs.4')
            set(highLightIndex,'this.layers.length')
            minus(highLightIndex,1)
            
            //***********绘制数字变量，与onInitialize事件相同***********
            var(tTag,0)
            var(tY,0)        //年
            var(tM,0)        //月
            var(tD,0)        //日
            
            //设置tY，tM和tD。
            getTag(tTag)
            if(tTag==0){
                set(tY,'this.otherAttrs.0')
                set(tM,'this.otherAttrs.1')
                set(tD,1)
            }else{
                //使用tag设置变量
                print('use tag','init')
            }
            
            //按下左键,日期减
            if(mouseX>0){
                if(mouseX<btnSize){
                    if(mouseY>0){
                        if(mouseY<btnSize){
                            set(btnFlag,1)
                            minus(tM,1)
                            if(tM==0){
                                set(tM,12)
                                minus(tY,1)
                            }
                            set('this.otherAttrs.0',tY)
                            set('this.otherAttrs.1',tM)
                        }
                    }
                }
            }
            //按下右键，日期加
            set(lSide,'this.layers.0.width')
            minus(lSide,btnSize)
            set(rSide,'this.layers.0.width')
            if(mouseX>lSide){
                if(mouseX<rSide){
                    if(mouseY>0){
                        if(mouseY<btnSize){
                            set(btnFlag,1)
                            add(tM,1)
                            if(tM==13){
                                set(tM,1)
                                add(tY,1)
                            }
                            set('this.otherAttrs.0',tY)
                            set('this.otherAttrs.1',tM)
                        }
                    }
                }
            }
            
            //******开始重新绘制日图层，逻辑与onInitialize一致
            if(btnFlag==1){
                //隐藏高亮
                set('this.layers.highLightIndex.hidden',0)
                
                var(zM,0)        //月份[3,14]，用于蔡勒公式
                var(zY,0)        //年的后两位，用于蔡勒公式
                var(zC,0)        //世纪-1  用于蔡勒公式
                var(zW,0)        //星期几 用于蔡勒公式
    
                var(temp1,0)     //临时变量1
                var(temp2,0)
                var(daysCnt,0)   //此月的天数
                var(initIndex,0) //日图层的起始索引坐标
                var(layersCnt,0) //图层个数
    
                //设置蔡勒公式相关变量
                set(zC,tY)
                set(zY,tY)
                set(zM,tM)
                if(tM<3){    
                    add(zM,12)
                    minus(zC,1)
                    minus(zY,1)
                }
                divide(zC,100)
                mod(zY,100)
                
                //显示年、月
                set('this.layers.1.subLayers.font.text',tY)
                set('this.layers.2.subLayers.font.text',tM)
                
                //计算zW:w=[c/4]-2c+y+[y/4]+[13(m+1)/5]+d-1;d=1;
                set(zW,zC)
                divide(zW,4)
                set(temp1,zC)
                multiply(temp1,2)
                minus(zW,temp1)
                add(zW,zY)
                set(temp1,zY)
                divide(temp1,4)
                add(zW,temp1)
                set(temp1,zM)
                add(temp1,1)
                multiply(temp1,13)
                divide(temp1,5)
                add(zW,temp1)
                mod(zW,7)
                
                //保存zW
                set('this.otherAttrs.12',zW)
                
                //根据月份设置天数
                if(tM==4){
                    set(daysCnt,30)
                }else{
                    if(tM==6){
                        set(daysCnt,30)
                    }else{
                        if(tM==9){
                            set(daysCnt,30)
                        }else{
                            if(tM==11){
                                set(daysCnt,30)
                            }else{
                                if(tM==2){
                                    //非闰年28天
                                    set(daysCnt,28)
                                    
                                    //判断闰年
                                    set(temp1,tY)
                                    mod(temp1,100)
                                    if(temp1==0){
                                        //世纪年
                                        set(temp2,tY)
                                        mod(temp2,400)
                                        if(temp2==0){
                                            set(daysCnt,29)
                                        }
                                    }else{
                                        //普通年
                                        set(temp2,tY)
                                        mod(temp2,4)
                                        if(temp2==0){
                                            set(temp2,tY)
                                            mod(temp2,100)
                                            if(temp2>0){
                                                set(daysCnt,29)
                                            }
                                        }
                                    }
                                }else{
                                    set(daysCnt,31)
                                }
                            }
                        }
                    }
                }
                //保存daysCnt
                set('this.otherAttrs.11',daysCnt)
                
                //开始绘制日图层上的数字
                set(initIndex,'this.otherAttrs.2')
                set(layersCnt,'this.layers.length')            
               
                set(temp1,zW)
                add(temp1,initIndex)            //起始显示坐标
                add(daysCnt,temp1)
    
                set(temp2,1)                    //显示的日字符
                while(initIndex<layersCnt){
                    if(initIndex>=temp1){
                        if(initIndex<daysCnt){
                            set('this.layers.initIndex.hidden',0)
                            set('this.layers.initIndex.subLayers.font.text',temp2)
                            add(temp2,1)
                        }else{
                            // set('this.layers.initIndex.subLayers.font.text',0)
                            set('this.layers.initIndex.hidden',1)
                        }
                    }else{
                        // set('this.layers.initIndex.subLayers.font.text',0)
                        set('this.layers.initIndex.hidden',1)
                    }
                    add(initIndex,1)
                }
            
            }
            
            //********开始绘制高亮选中层**********
            var(daysLayerMinX,0)      
            var(daysLayerMaxX,0)
            var(daysLayerMinY,0)
            var(daysLayerMaxY,0)
            var(highLightX,0)
            var(highLightY,0)
            var(dayW,0)
            var(dayH,0)
            var(selectedDayIndex,0)
            var(daysCnt,0)
            
            set(daysLayerMinX,'this.otherAttrs.5')
            set(daysLayerMaxX,'this.otherAttrs.6')
            set(daysLayerMinY,'this.otherAttrs.7')
            set(daysLayerMaxY,'this.otherAttrs.8')
            set(dayW,'this.otherAttrs.9')
            set(dayH,'this.otherAttrs.10')
            set(daysCnt,'this.otherAttrs.11')
            set(zW,'this.otherAttrs.12')
            
            if(mouseX>=daysLayerMinX){
                if(mouseX<=daysLayerMaxX){
                    if(mouseY>=daysLayerMinY){
                        if(mouseY<=daysLayerMaxY){
                            //计算第几层被选中,首先是第几行，然后是此行第几列
                            set(temp1,mouseY)
                            minus(temp1,daysLayerMinY)
                            divide(temp1,dayH)
                            set(selectedDayIndex,7)
                            multiply(selectedDayIndex,temp1)
                            
                            set(temp2,mouseX)
                            minus(temp2,daysLayerMinX)
                            divide(temp2,dayW)
                            add(selectedDayIndex,temp2)
                            
                            set(initIndex,'this.otherAttrs.2') //获取日图层起始坐标
                            add(selectedDayIndex,initIndex)
                            
                            set(temp1,zW)
                            add(temp1,initIndex)
                            set(temp2,daysCnt)
                            add(temp2,temp1)
                            minus(temp2,1)
                            
                            if(selectedDayIndex>=temp1){
                                if(selectedDayIndex<=temp2){
                                    set(highLightX,'this.layers.selectedDayIndex.x')
                                    set(highLightY,'this.layers.selectedDayIndex.y')
                                    set('this.layers.highLightIndex.x',highLightX)
                                    set('this.layers.highLightIndex.y',highLightY)
                                    set('this.layers.highLightIndex.hidden',0)
                                }
                            }
                            
                        }
                    }
                }
            }
            
            
        `,
        onMouseUp:`

        `,
        onTagChange:`

        `,
        onKeyBoardLeft:`

        `,
        onKeyBoardRight:`

        `,
        onKeyBoardOK:`

        `
    };

    WidgetCommands['SysTexDatePicker'] = {
        onInitialize:`
            var(tTag,0)
            var(tY,0)        //年
            var(tM,0)        //月
            var(tD,0)        //日

            var(zM,0)        //月份[3,14]，用于蔡勒公式
            var(zY,0)        //年的后两位，用于蔡勒公式
            var(zC,0)        //世纪-1  用于蔡勒公式
            var(zW,0)        //星期几 用于蔡勒公式

            var(temp1,0)     //临时变量1
            var(temp2,0)
            var(daysCnt,0)   //此月的天数
            var(initIndex,0) //日图层的起始索引坐标
            var(layersCnt,0) //图层个数
            
            var(dayW,0)
            var(dayH,0)
            var(daysLayerMinX,0)
            var(daysLayerMaxX,0)
            var(daysLayerMinY,0)
            var(daysLayerMaxY,0)

            //设置tY，tM和tD。
            getTag(tTag)
            if(tTag==0){
                set(tY,'this.otherAttrs.0')
                set(tM,'this.otherAttrs.1')
                set(tD,1)
            }else{
                //使用tag设置变量
                print('use tag','init')
            }

            //设置蔡勒公式相关变量
            set(zC,tY)
            set(zY,tY)
            set(zM,tM)
            if(tM<3){    
                add(zM,12)
                minus(zC,1)
                minus(zY,1)
            }
            divide(zC,100)
            mod(zY,100)
            
            //显示年
            set(temp1,1)
            while(temp1<5){
                set(temp2,tY)
                if(temp1==1){
                    divide(temp2,1000)
                }else{
                    if(temp1==2){
                        divide(temp2,100)
                    }else{
                        if(temp1==3){
                            divide(temp2,10)
                        }
                    }
                }
                mod(temp2,10)
                add(temp2,48)
                set('this.layers.temp1.subLayers.font.text',temp2)
                add(temp1,1)
            }
            
            //显示月
            while(temp1<7){
                set(temp2,tM)
                if(temp1==5){
                    divide(temp2,10)
                }
                mod(temp2,10)
                add(temp2,48)
                set('this.layers.temp1.subLayers.font.text',temp2)
                add(temp1,1)
            }
            
            //计算zW:w=[c/4]-2c+y+[y/4]+[13(m+1)/5]+d-1;d=1;
            set(zW,zC)
            divide(zW,4)
            set(temp1,zC)
            multiply(temp1,2)
            minus(zW,temp1)
            add(zW,zY)
            set(temp1,zY)
            divide(temp1,4)
            add(zW,temp1)
            set(temp1,zM)
            add(temp1,1)
            multiply(temp1,13)
            divide(temp1,5)
            add(zW,temp1)
            mod(zW,7)
            
            //根据月份设置天数
            if(tM==4){
                set(daysCnt,30)
            }else{
                if(tM==6){
                    set(daysCnt,30)
                }else{
                    if(tM==9){
                        set(daysCnt,30)
                    }else{
                        if(tM==11){
                            set(daysCnt,30)
                        }else{
                            if(tM==2){
                                //非闰年28天
                                set(daysCnt,28)
                                
                                //判断闰年
                                set(temp1,tY)
                                mod(temp1,100)
                                if(temp1==0){
                                    //世纪年
                                    set(temp2,tY)
                                    mod(temp2,400)
                                    if(temp2==0){
                                        set(daysCnt,29)
                                    }
                                }else{
                                    //普通年
                                    set(temp2,tY)
                                    mod(temp2,4)
                                    if(temp2==0){
                                        set(temp2,tY)
                                        mod(temp2,100)
                                        if(temp2>0){
                                            set(daysCnt,29)
                                        }
                                    }
                                }
                            }else{
                                set(daysCnt,31)
                            }
                        }
                    }
                }
            }
            //保存daysCnt
            set('this.otherAttrs.11',daysCnt)
            
            //开始绘制日图层上的数字            
            set(initIndex,'this.otherAttrs.2')
            set(layersCnt,'this.layers.length')
            set(dayW,'this.otherAttrs.9')
            set(dayH,'this.otherAttrs.10')
            set(daysLayerMinX,'this.otherAttrs.5')
            set(daysLayerMaxX,'this.otherAttrs.6')
            set(daysLayerMinY,'this.otherAttrs.7')
            set(daysLayerMaxY,'this.otherAttrs.8')  
                      
            add(daysCnt,initIndex)
            set(temp1,zW)
            multiply(temp1,dayW)              
            add(temp1,daysLayerMinX)        //日图层的x坐标
            set(temp2,daysLayerMinY)        //日图层的y坐标
            while(initIndex<layersCnt){
                
                if(initIndex<daysCnt){
                    //排列日期
                    if(temp1>=daysLayerMaxX){
                        set(temp1,daysLayerMinX)
                        add(temp2,dayH)
                    }
                    set('this.layers.initIndex.x',temp1)
                    set('this.layers.initIndex.y',temp2)
                    add(temp1,dayW)
                }else{
                    //多于的日期隐藏
                    set('this.layers.initIndex.hidden',1)
                }
                
                add(initIndex,1)
            }
        `,
        onMouseDown:`
            //***********mouseDown事件独有变量***********
            var(mouseX,0)             //鼠标x位置
            var(mouseY,0)             //鼠标y位置
            var(btnSize,0)            //按键大小
            var(lSide,0)              //左边界，左右按钮的边界
            var(rSide,0)              //右边界
            var(tSide,0)              //上边界
            var(bSide,0)              //下边界
            var(btnFlag,0)            //左、右按键标志位,代表是否按下按键。0,1
            var(highLightIndex,0) 
            
            set(mouseX,'this.innerX')
            set(mouseY,'this.innerY')
            set(btnSize,'this.otherAttrs.4')
            set(highLightIndex,'this.layers.length')
            minus(highLightIndex,1)
            
            //***********绘制年月日、高亮变量***********
            var(tTag,0)
            var(tY,0)        //年
            var(tM,0)        //月
            var(tD,0)        //日
            var(zM,0)        //月份[3,14]，用于蔡勒公式
            var(zY,0)        //年的后两位，用于蔡勒公式
            var(zC,0)        //世纪-1  用于蔡勒公式
            var(zW,0)        //星期几 用于蔡勒公式

            var(temp1,0)     //临时变量1
            var(temp2,0)
            var(daysCnt,0)   //此月的天数
            var(initIndex,0) //日图层的起始索引坐标
            var(layersCnt,0) //图层个数
            
            var(daysLayerMinX,0)      
            var(daysLayerMaxX,0)
            var(daysLayerMinY,0)
            var(daysLayerMaxY,0)
            var(highLightX,0)
            var(highLightY,0)
            var(dayW,0)
            var(dayH,0)
            var(selectedDayIndex,0)
            var(daysCnt,0)
            
            //设置tY，tM和tD。
            getTag(tTag)
            if(tTag==0){
                set(tY,'this.otherAttrs.0')
                set(tM,'this.otherAttrs.1')
                set(tD,1)
            }else{
                //使用tag设置变量
                print('use tag','init')
            }
            
            //按下左键,日期减
            if(mouseX>0){
                if(mouseX<btnSize){
                    if(mouseY>0){
                        if(mouseY<btnSize){
                            set(btnFlag,1)
                            minus(tM,1)
                            if(tM==0){
                                set(tM,12)
                                minus(tY,1)
                            }
                            set('this.otherAttrs.0',tY)
                            set('this.otherAttrs.1',tM)
                        }
                    }
                }
            }
            //按下右键，日期加
            set(lSide,'this.layers.0.width')
            minus(lSide,btnSize)
            set(rSide,'this.layers.0.width')
            if(mouseX>lSide){
                if(mouseX<rSide){
                    if(mouseY>0){
                        if(mouseY<btnSize){
                            set(btnFlag,1)
                            add(tM,1)
                            if(tM==13){
                                set(tM,1)
                                add(tY,1)
                            }
                            set('this.otherAttrs.0',tY)
                            set('this.otherAttrs.1',tM)
                        }
                    }
                }
            }
            
            if(btnFlag==1){
                //隐藏高亮
                set('this.layers.highLightIndex.hidden',0)
                
                //设置蔡勒公式相关变量
                set(zC,tY)
                set(zY,tY)
                set(zM,tM)
                if(tM<3){    
                    add(zM,12)
                    minus(zC,1)
                    minus(zY,1)
                }
                divide(zC,100)
                mod(zY,100)
                
                //显示年
                set(temp1,1)
                while(temp1<5){
                    set(temp2,tY)
                    if(temp1==1){
                        divide(temp2,1000)
                    }else{
                        if(temp1==2){
                            divide(temp2,100)
                        }else{
                            if(temp1==3){
                                divide(temp2,10)
                            }
                        }
                    }
                    mod(temp2,10)
                    add(temp2,48)
                    set('this.layers.temp1.subLayers.font.text',temp2)
                    add(temp1,1)
                }
                
                //显示月
                while(temp1<7){
                    set(temp2,tM)
                    if(temp1==5){
                        divide(temp2,10)
                    }
                    mod(temp2,10)
                    add(temp2,48)
                    set('this.layers.temp1.subLayers.font.text',temp2)
                    add(temp1,1)
                }
                
                //计算zW:w=[c/4]-2c+y+[y/4]+[13(m+1)/5]+d-1;d=1;
                set(zW,zC)
                divide(zW,4)
                set(temp1,zC)
                multiply(temp1,2)
                minus(zW,temp1)
                add(zW,zY)
                set(temp1,zY)
                divide(temp1,4)
                add(zW,temp1)
                set(temp1,zM)
                add(temp1,1)
                multiply(temp1,13)
                divide(temp1,5)
                add(zW,temp1)
                mod(zW,7)
                if(zW<0){
                    set(temp1,zW)
                    set(zW,0)
                    minus(zW,temp1)
                }
                
                //保存zW
                set('this.otherAttrs.12',zW)
                
                //根据月份设置天数
                if(tM==4){
                    set(daysCnt,30)
                }else{
                    if(tM==6){
                        set(daysCnt,30)
                    }else{
                        if(tM==9){
                            set(daysCnt,30)
                        }else{
                            if(tM==11){
                                set(daysCnt,30)
                            }else{
                                if(tM==2){
                                    //非闰年28天
                                    set(daysCnt,28)
                                    
                                    //判断闰年
                                    set(temp1,tY)
                                    mod(temp1,100)
                                    if(temp1==0){
                                        //世纪年
                                        set(temp2,tY)
                                        mod(temp2,400)
                                        if(temp2==0){
                                            set(daysCnt,29)
                                        }
                                    }else{
                                        //普通年
                                        set(temp2,tY)
                                        mod(temp2,4)
                                        if(temp2==0){
                                            set(temp2,tY)
                                            mod(temp2,100)
                                            if(temp2>0){
                                                set(daysCnt,29)
                                            }
                                        }
                                    }
                                }else{
                                    set(daysCnt,31)
                                }
                            }
                        }
                    }
                }
                //保存daysCnt
                set('this.otherAttrs.11',daysCnt)
                
                //*****开始绘制日图层上的数字*****
                set(initIndex,'this.otherAttrs.2')
                set(layersCnt,'this.layers.length')
                set(dayW,'this.otherAttrs.9')
                set(dayH,'this.otherAttrs.10')
                set(daysLayerMinX,'this.otherAttrs.5')
                set(daysLayerMaxX,'this.otherAttrs.6')
                set(daysLayerMinY,'this.otherAttrs.7')
                set(daysLayerMaxY,'this.otherAttrs.8')  
                          
                add(daysCnt,initIndex)
                set(temp1,zW)
                multiply(temp1,dayW)              
                add(temp1,daysLayerMinX)        //日图层的x坐标
                set(temp2,daysLayerMinY)        //日图层的y坐标
                while(initIndex<layersCnt){
                    
                    if(initIndex<daysCnt){
                        //排列日期
                        set('this.layers.initIndex.hidden',0)
                        if(temp1>=daysLayerMaxX){
                            set(temp1,daysLayerMinX)
                            add(temp2,dayH)
                        }
                        set('this.layers.initIndex.x',temp1)
                        set('this.layers.initIndex.y',temp2)
                        add(temp1,dayW)
                    }else{
                        //多于的日期隐藏
                        set('this.layers.initIndex.hidden',1)
                    }
                    
                    add(initIndex,1)
                }
            }
            
            
            //********开始绘制高亮选中层**********
            set(daysLayerMinX,'this.otherAttrs.5')
            set(daysLayerMaxX,'this.otherAttrs.6')
            set(daysLayerMinY,'this.otherAttrs.7')
            set(daysLayerMaxY,'this.otherAttrs.8')
            set(dayW,'this.otherAttrs.9')
            set(dayH,'this.otherAttrs.10')
            set(daysCnt,'this.otherAttrs.11')
            set(zW,'this.otherAttrs.12')
            
            if(mouseX>=daysLayerMinX){
                if(mouseX<=daysLayerMaxX){
                    if(mouseY>=daysLayerMinY){
                        if(mouseY<=daysLayerMaxY){
                            //计算第几层被选中,并且是否在有效层的范围内
                            set(temp1,mouseY)
                            minus(temp1,daysLayerMinY)
                            divide(temp1,dayH)
                            set(selectedDayIndex,7)
                            multiply(selectedDayIndex,temp1)
                            
                            set(temp2,mouseX)
                            minus(temp2,daysLayerMinX)
                            divide(temp2,dayW)
                            add(selectedDayIndex,temp2)
                            
                            set(initIndex,'this.otherAttrs.2') //获取日图层起始坐标
                            add(selectedDayIndex,initIndex)
                            
                            set(temp1,zW)
                            add(temp1,initIndex)
                            set(temp2,daysCnt)
                            add(temp2,temp1)
                            minus(temp2,1)
                            
                            if(selectedDayIndex>=temp1){
                                if(selectedDayIndex<=temp2){
                                    //计算高亮层x，y坐标
                                    set(highLightX,mouseX)
                                    minus(highLightX,daysLayerMinX)
                                    divide(highLightX,dayW)
                                    
                                    set(highLightY,mouseY)
                                    minus(highLightY,daysLayerMinY)
                                    divide(highLightY,dayH)
                                    
                                    multiply(highLightX,dayW)
                                    add(highLightX,daysLayerMinX)
                                    multiply(highLightY,dayH)
                                    add(highLightY,daysLayerMinY)
                                    
                                    set('this.layers.highLightIndex.x',highLightX)
                                    set('this.layers.highLightIndex.y',highLightY)
                                    set('this.layers.highLightIndex.hidden',0)
                                }
                            }
                        }
                    }
                }
            }
        `,
        onMouseUp:`

        `,
        onTagChange:`

        `,
        onKeyBoardLeft:`

        `,
        onKeyBoardRight:`

        `,
        onKeyBoardOK:`

        `
    };

    WidgetCommands['TexTime'] = {
        'onInitialize': ` 
            //显示除高亮以外所有图层
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum') 
            var(tOffset,0)
            var(len,0)
            set(len,'this.layers.length')
            if(tMaxHighLightNum > 0){
                minus(len,1)
                set('this.layers.len.hidden',1)
            }
           
            while(tOffset < len){
                set('this.layers.tOffset.hidden',0)
                add(tOffset,1)
            }
            
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
            //初始化属性
            var(tCurValue,0)                      //tag值
            getTag(tCurValue)

            var(tDigitCount,0)                    //数字个数
            set(tDigitCount,'this.otherAttrs.2')
            
            var(tMode,0) //模式
            set(tMode,'this.otherAttrs.3')
            if(tMode == 1){
                //时分模式
                divide(tCurValue,256)
            }
            
            var(tempCurValue,0)                   //临时变量tempCurValue
            set(tempCurValue,tCurValue)            

            var(index,0)                          //数字图片序号
            var(i,0)                              //循环变量
            var(tOverFlow,0)                        //溢出标志
                        
            var(temp1,0)                          //临时变量1
            var(temp2,0)                          //临时变量2
            
            if(tCurValue<0){
                //负溢出
                set(tOverFlow,1)
            }
            while(tDigitCount>i){
                //循环因子
                add(i,1)
            
                //当前位的数字值
                //temp2=tempCurValue-tempCurValue/16*16
                //tempCurValue=tempCurValue/16
                set(temp1,tempCurValue)
                set(temp2,tempCurValue)
                divide(temp1,16)
                set(tempCurValue,temp1)            
                multiply(temp1,16)
                minus(temp2,temp1)
                
                //溢出处理
                if(temp2>9){
                    set(temp2,0)
                    set(tOverFlow,1)
                }
                            
                //index=tDigitCount-i
                set(index,tDigitCount)
                minus(index,i)

                //draw(index)
                set('this.layers.index.subLayers.image.texture',temp2)
            }

            //溢出处理:全部置为零
            if(tOverFlow==1){
                set(i,0)
                while(tDigitCount>i){
                    //循环因子
                    add(i,1)
                         
                    //index=tDigitCount-i
                    set(index,tDigitCount)
                    minus(index,i)
    
                    //draw(index)
                    set('this.layers.index.subLayers.image.texture',0)
                }
            }
        `,
        onKeyBoardLeft: `
            var(tMaxHighLightNum,0)                           //maxHighLightNum
            set(tMaxHighLightNum,'this.maxHighLightNum')   
                     
            var(okFlag,0)                                     //okFlag
            set(okFlag,'this.otherAttrs.1')
            
            var(offset,0)                                     //highlight图层位置
            set(offset,'this.layers.length')
            minus(offset,1)
            var(tMode,0)
            set(tMode,'this.otherAttrs.3')
            if(tMaxHighLightNum>0){                         
                if(okFlag==0){                                  
                    //隐藏高亮层                
                    set('this.layers.offset.hidden',1)
                    
                    //set target highlight
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    
                    
                    
                    var(tCharW,o)
                    set(tCharW,'this.otherAttrs.4')
                         
                    var(xOffset,0)                    
                    var(tHighlightWidth,0)                   
                    var(temp1,0)
                    
                    //跳入下一个有高亮的控件
                    if(tHighLightNum==0){
                        set('this.layers.offset.hidden',1)
                    }else{
                        //控件内部高亮
                        if(tHighLightNum==1){
                            if(tMode==0){
                                set(tHighlightWidth,2)
                            }else{
                                if(tMode==1){
                                    set(tHighlightWidth,2)
                                }else{
                                    set(tHighlightWidth,4)
                                }
                            }
                            set(xOffset,0)
                        }else{
                            if(tHighLightNum==2){
                                if(tMode==0){
                                    set(xOffset,3)
                                }else{
                                    if(tMode==1){
                                        set(xOffset,3)
                                    }else{
                                        set(xOffset,5)
                                    }
                                }
                                set(tHighlightWidth,2)
                            }else{
                                if(tMode==0){
                                    set(xOffset,6)
                                }else{
                                    if(tMode==1){
                                        set(xOffset,6)
                                    }else{
                                        set(xOffset,8)
                                    }
                                }
                                set(tHighlightWidth,2)
                            }
                        }
                        //修改高亮层位置
                        set(temp1,tCharW)
                        multiply(temp1,xOffset)
                        set('this.layers.offset.x',temp1)
                        
                        //修改高亮层宽度
                        set(temp1,tCharW)
                        multiply(temp1,tHighlightWidth)
                        set('this.layers.offset.width',temp1)
                        
                        //显示高亮图层
                        set('this.layers.offset.hidden',0)
                    }
                }else{
                    var(tHighLightNum,0)
                    var(tTag,0)
                    
                    var(xr,0)
                    var(minusNum,0)
                    set(minusNum,1)
                    set(tHighLightNum,'this.highLightNum')
                    getTag(tTag)
                    
                    if(tMode==1){
                        if(tHighLightNum==1){
                            set(xr,2)
                        }else{
                            set(xr,0)
                        }
                    }else{
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            if(tHighLightNum==2){
                                set(xr,2)
                            }else{
                                set(xr,0)
                            }
                        }
                    }
                    var(ttTag,0)
                    var(txr,0)
                    set(ttTag,tTag)
                    set(txr,xr)
                    while(xr>0){
                        divide(ttTag,16)
                        minus(xr,1)
                    }
                    var(ttTagBeforeChange,0)
                    set(ttTagBeforeChange,ttTag)
                   
                    mod(ttTagBeforeChange,256)
                    var(tOverFlow,0)
                    set(tOverFlow,0)
                    //判断是否溢出
                    if(ttTagBeforeChange <= 0){
                        set(tOverFlow,1)
                    }
                    if(tOverFlow==0){
                        mod(ttTag,16)
                        var(rawttTag,0)
                        set(rawttTag,ttTag)
                        minus(ttTag,1)
                        if(ttTag<0){
                            set(ttTag,-7)
                        }
                        while(txr>0){
                            multiply(ttTag,16)
                            multiply(rawttTag,16)
                            minus(txr,1)
                        }
                        minus(ttTag,rawttTag)
                        add(tTag,ttTag)
                        setTag(tTag)
                    }
                    
                }              
            }
        `,
        onKeyBoardRight: `
            var(tMaxHighLightNum,0)                           //maxHighLightNum
            set(tMaxHighLightNum,'this.maxHighLightNum')   
                     
            var(okFlag,0)                                     //okFlag
            set(okFlag,'this.otherAttrs.1')
            
            var(offset,0)                                     //highlight图层位置
            set(offset,'this.layers.length')
            minus(offset,1)
            var(tMode,0)
            set(tMode,'this.otherAttrs.3')
            
            if(tMaxHighLightNum>0){                         
                if(okFlag==0){                                  
                    //隐藏高亮层                
                    set('this.layers.offset.hidden',1)
                    
                    //set target highlight
                    var(tHighLightNum,0)
                    set(tHighLightNum,'this.highLightNum')
                    
                    
                    
                    var(tCharW,o)
                    set(tCharW,'this.otherAttrs.4')
                         
                    var(xOffset,0)                    
                    var(tHighlightWidth,0)                   
                    var(temp1,0)
                    
                    //跳入下一个有高亮的控件
                    if(tHighLightNum==0){
                        set('this.layers.offset.hidden',1)
                    }else{
                        //控件内部高亮
                        if(tHighLightNum==1){
                            if(tMode==0){
                                set(tHighlightWidth,2)
                            }else{
                                if(tMode==1){
                                    set(tHighlightWidth,2)
                                }else{
                                    set(tHighlightWidth,4)
                                }
                            }
                            set(xOffset,0)
                        }else{
                            if(tHighLightNum==2){
                                if(tMode==0){
                                    set(xOffset,3)
                                }else{
                                    if(tMode==1){
                                        set(xOffset,3)
                                    }else{
                                        set(xOffset,5)
                                    }
                                }
                                set(tHighlightWidth,2)
                            }else{
                                if(tMode==0){
                                    set(xOffset,6)
                                }else{
                                    if(tMode==1){
                                        set(xOffset,6)
                                    }else{
                                        set(xOffset,8)
                                    }
                                }
                                set(tHighlightWidth,2)
                            }
                        }
                        //修改高亮层位置
                        set(temp1,tCharW)
                        multiply(temp1,xOffset)
                        set('this.layers.offset.x',temp1)
                        
                        //修改高亮层宽度
                        set(temp1,tCharW)
                        multiply(temp1,tHighlightWidth)
                        set('this.layers.offset.width',temp1)
                        
                        //显示高亮图层
                        set('this.layers.offset.hidden',0)
                    }
                }else{
                    //change num in ok mode
                    var(tHighLightNum,0)
                    var(tTag,0)
                    
                    var(xr,0)
                    var(addNum,0)
                    set(addNum,1)
                    set(tHighLightNum,'this.highLightNum')
                    getTag(tTag)
                    
                    if(tMode==1){
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            set(xr,2)
                        }
                    }else{
                        if(tHighLightNum==1){
                            set(xr,4)
                        }else{
                            if(tHighLightNum==2){
                                set(xr,2)
                            }else{
                                set(xr,0)
                            }
                        }
                    }
                    var(ttTag,0)
                    var(txr,0)
                    var(ttxr,0)
                    set(ttTag,tTag)
                    set(txr,xr)
                    set(ttxr,xr)
                    while(xr>0){
                        divide(ttTag,16)
                        minus(xr,1)
                    }
                    var(ttTagBeforeChange,0)
                    set(ttTagBeforeChange,ttTag)
                   
                    mod(ttTagBeforeChange,256)
                    var(tOverFlow,0)
                    set(tOverFlow,0)
                    //判断是否溢出
                   
                    if(tMode == 0){
                        //时分秒
                        if(tHighLightNum == 1){
                            //时
                            if(ttTagBeforeChange >= 35){
                                set(tOverFlow,1)
                            }
                        }else{
                            if(ttTagBeforeChange >= 89){
                                set(tOverFlow,1)
                            }
                        }
                    }else{
                        if(tMode == 1){
                            //时分
                            if(tHighLightNum == 1){
                                //时
                                if(ttTagBeforeChange >= 35){
                                    set(tOverFlow,1)
                                }
                            }else{
                                if(ttTagBeforeChange >= 89){
                                    set(tOverFlow,1)
                                }
                            }
                        }else{
                            //年月日
                           
                            if(tHighLightNum == 1){
                                //年
                                // if(ttTagBeforeChange >= 35){
                                //     set(tOverFlow,1)
                                // }
                            }else{
                                if(tHighLightNum == 2){
                                    //月
                                    if(ttTagBeforeChange >= 18){
                                        set(tOverFlow,1)
                                    }
                                }else{
                                    if(ttTagBeforeChange >= 49){
                                        set(tOverFlow,1)
                                    }
                                }
                                
                            }
                        }
                    }
                    if(tOverFlow == 0){
                        mod(ttTag,16)
                        var(rawttTag,0)
                        set(rawttTag,ttTag)
                        add(ttTag,1)
                        if(ttTag>=10){
                            set(ttTag,16)
                        }
                        while(txr>0){
                            multiply(ttTag,16)
                            multiply(rawttTag,16)
                            minus(txr,1)
                        }
                        minus(ttTag,rawttTag)
                        add(tTag,ttTag)
                        //check value in limit
                        setTag(tTag)
                    }
                    
                }                
            }
        `,
        onKeyBoardOK: `
            var(okFlag,0)
            set(okFlag,'this.otherAttrs.1')
            if(okFlag==0){
                setglobalvar(0,1)
                set('this.otherAttrs.1',1)
            }else{
                setglobalvar(0,0)
                set('this.otherAttrs.1',0)
            }
        `
    };
    return WidgetCommands;

}));


/**
 * commands example
 * set(a,3)
 * setTag(1)
 * getTag(a)
 * set(a,b)
 * add(a,1)
 * minus(a,1)
 * multiply(a,2)
 * divide(a,2)
 * mod(a,2)
 * set('this.layers.1.hidden',1)
 */
