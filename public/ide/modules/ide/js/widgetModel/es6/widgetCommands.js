;(function (factory) {
	if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetCommands',[], factory);
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
        onInitialize:`

            var(a,0)
            set(a,'this.mode')
            set(a,3)
            if(a>=100){
                set('this.layers.1.hidden',1)
            }else{
                set('this.layers.1.hidden',0)
            }
        `,
        onMouseDown:`
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
        onMouseUp:`
            var(b,0)
            set(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',0)
            }
        `,
        onTagChange:`
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
        onKeyBoardLeft:`
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
        onKeyBoardRight:`
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
        onKeyBoardOK:`
          executeaction(5)
        `
    };

    WidgetCommands['ButtonGroup'] = {
        onInitialize:`
            
        `,
        onMouseDown:`
            var(a,0)
            var(b,0)
            var(c,0)
            set(c,'this.layers.length')
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
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
                                setTag(c)
                                set(c,0)
                            }
                        }
                    }
                }
                minus(c,tSingleButtonLayers)
            }
        `,
        onMouseUp:`
        `,
        onTagChange:`
            var(a,0)
            var(b,0)
            var(c,0)
            var(tMaxHighLightNum,0)
            set(tMaxHighLightNum,'this.maxHighLightNum')
            var(tSingleButtonLayers,0)
            if (tMaxHighLightNum>0) {
              set(tSingleButtonLayers,3)
            }else{
              set(tSingleButtonLayers,2)
            }
            set(a,'this.layers.length')
            set(c,a)
            divide(c,tSingleButtonLayers)
            while(a>0){
                if (tMaxHighLightNum>0) {
                  minus(a,1)
                  minus(a,1)
                  set('this.layers.a.hidden',0)
                  minus(a,1)
                  set('this.layers.a.hidden',1)
                }else{
                  minus(a,1)
                  set('this.layers.a.hidden',0)
                  minus(a,1)
                  set('this.layers.a.hidden',1)
                }
                
            }
            getTag(a)
            if(a>=0){
                if(c>a){
                    multiply(a,tSingleButtonLayers)
                    set('this.layers.a.hidden',0)
                    add(a,1)
                    set('this.layers.a.hidden',1)
                }
            }

        `,
        onKeyBoardLeft:`
          var(tMaxHighLightNum,0)
          set(tMaxHighLightNum,'this.maxHighLightNum')
          if (tMaxHighLightNum>0) {
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')

            if (tHighLightNum>0) {
              minus(tHighLightNum,1)
              multiply(tHighLightNum,3)
              add(tHighLightNum,2)

              var(tTotalLayers,0)
              set(tTotalLayers,'this.layers.length')
              if (tHighLightNum < tTotalLayers) {
                //valid
                //reset 
                var(tCurLayer,0)
                while(tMaxHighLightNum>0){
                  minus(tMaxHighLightNum,1)
                  set(tCurLayer,tMaxHighLightNum)
                  multiply(tCurLayer,3)
                  add(tCurLayer,2)
                  set('this.layers.tCurLayer.hidden',1)
                }
                //set target highlight 
                set('this.layers.tHighLightNum.hidden',0)
              }
            }else{
                if(tHighLightNum==0){
                    add(tHighLightNum,2)
                    set('this.layers.tHighLightNum.hidden',1)
                }
            }
          }
        `,
        onKeyBoardRight:`
          var(tMaxHighLightNum,0)
          set(tMaxHighLightNum,'this.maxHighLightNum')
          if (tMaxHighLightNum>0) {
            var(tHighLightNum,0)
            set(tHighLightNum,'this.highLightNum')
            if (tHighLightNum>0) {
              minus(tHighLightNum,1)
              multiply(tHighLightNum,3)
              add(tHighLightNum,2)

              var(tTotalLayers,0)
              set(tTotalLayers,'this.layers.length')
              if (tHighLightNum  < tTotalLayers) {
                //valid
                //reset 
                var(tCurLayer,0)
                while(tMaxHighLightNum>0){
                  minus(tMaxHighLightNum,1)
                  set(tCurLayer,tMaxHighLightNum)
                  multiply(tCurLayer,3)
                  add(tCurLayer,2)
                  set('this.layers.tCurLayer.hidden',1)
                }
                //set target highlight 
                set('this.layers.tHighLightNum.hidden',0)
              }
            }else{
                if(tHighLightNum==0){
                    var(lastHighLight,0)
                    set(lastHighLight,'this.layers.length')
                    minus(lastHighLight,1)
                    set('this.layers.lastHighLight.hidden',1)
                }
            }
          }
        `,
        onKeyBoardOK:`
          var(tHighLightNum,0)
          set(tHighLightNum,'this.highLightNum')
          if (tHighLightNum>0) {
            minus(tHighLightNum,1)
            var(tTotalLayers,0)
            set(tTotalLayers,'this.layers.length')

            divide(tTotalLayers,3)
            if (tHighLightNum<tTotalLayers) {
              //valid
              //reset 
              //set target tag
              setTag(tHighLightNum)
              
            }
          }

        `
    };

    WidgetCommands['Dashboard'] = {
        onInitialize:`
        `,
        onMouseDown:``,
        onMouseUp:``,
        onTagChange:`
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
        onAnimationFrame:`
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
        onInitialize:`
        `,
        onTagChange:`
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
        onInitialize:`
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
        onMouseUp:`
            
        `,
        onMouseDown:`
            
        `,
        onTagChange:`
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
                      var(g2,'this.otherAttrs.5')
                
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
                      multiply(temp1,w)
                      divide(temp1,temp2)
                      set('this.layers.1.width',temp1)
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
                      multiply(temp1,w)
                      divide(temp1,temp2)
                      set('this.layers.1.width',temp1)
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
        onAnimationFrame:`
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
                    multiply(temp1,w)
                    divide(temp1,temp2)
                    set('this.layers.1.width',temp1)
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
                    multiply(temp1,w)
                    divide(temp1,temp2)
                    set('this.layers.1.width',temp1)
                    set('this.layers.1.hidden',0)
                }
             }
             var(cur,0)
             set(cur,'this.otherAttrs.19')
             if(cur==1){
                set('this.layers.2.x',temp1)
             }
            }
          
        `
    };

    WidgetCommands['TextArea']={
        onInitialize:``
    };

    WidgetCommands['Switch']={
        onInitialize:`
            set('this.layers.0.hidden',1)
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
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

    WidgetCommands['ScriptTrigger']={
        onInitialize:``,
        onTagChange:`
            var(tTagValue,0)
            getTag(tTagValue)
            checkalarm(0)
            set('this.oldValue',tTagValue)
        `
    };

    WidgetCommands['Video']={
        
    };

    WidgetCommands['Slide']={
        onInitialize:`
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
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

    WidgetCommands['SlideBlock']={
        onInitialize:`
        `,
        onMouseUp:`
        `,
        onMouseDown:`
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
        onMouseMove:`
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
        onTagChange:`
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

    WidgetCommands['Num']={
        onInitialize:`
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
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
            //清空所有数字内容
            var(tIndex,0)   //用于循环
            var(tLaysLen,0)     //图层长度
            set(tLaysLen,'this.layers.length')
            set(tIndex,0)
            while(tIndex<tLaysLen){
                set('this.layers.tIndex.subLayers.font.text',0)
                add(tIndex,1)
            }
            
            // draw num
            
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
            var(isOverFlow,0)     //是否溢出
            
            getTag(tCurVal)
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
            
            set(needDraw,1)      
            
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
                set(tempVal,tCurVal)
                //--while 没有>=，故tCurVal为0时，curValCnt为1
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
                print(decimalCnt,'decimalCnt')
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
                print(allFontCnt,'allFontCnt')
                print(decimalIndex,'decimalIndex')
                
                //计算起始坐标
                set(tempVal,allFontCnt)
                var(tempValW,0)     //总字符所占宽度
                var(fontWidthHalf,0) //半个字符所占宽度
                set(fontWidthHalf,fontWidth)
                divide(fontWidthHalf,2)
                while(tempVal>0){
                    add(tempValW,fontWidth)
                    minus(tempVal,1)
                }
                if(decimalCnt>0){
                    minus(tempValW,fontWidthHalf)
                }                
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
                
                //开始绘制
                var(tempValText,0)  //保存要绘制的数字
                var(tempValMid1,0)  //保存临时中间结果
                var(tempValMid2,0)  //保存临时中间结果
                set(tempVal,0)
                if(tempVal==0){
                    if(symbolCnt==1){
                        //有负号
                        set('this.layers.tempVal.x',initPos)
                        set('this.layers.tempVal.subLayers.font.text',45)
                        add(tempVal,1)
                        add(initPosX,fontWidth)
                    }else{
                        print(initPos,'跳过')
                    }  
                }else{
                    print(initPos,'跳过')
                }
                
                while(tempVal<allFontCnt){
                    set('this.layers.tempVal.x',initPosX)
                    set('this.layers.tempVal.width',fontWidth)
                    
                    if(decimalIndex==tempVal){
                        //绘制小数点
                        set('this.layers.tempVal.width',fontWidthHalf)
                        set(tempValMid1,46)
                        set('this.layers.tempVal.subLayers.font.text',46)
                        add(initPosX,fontWidthHalf)
                    }else{
                        if(frontZeroCnt>0){
                            //绘制前导零
                            set(tempValText,0)
                            add(tempValText,48)
                            set('this.layers.tempVal.subLayers.font.text',tempValText)
                            minus(frontZeroCnt,1)
                            add(initPosX,fontWidth)
                        }else{
                            if(decimalZeroCnt>0){
                                set(tempValText,0)
                                add(tempValText,48)
                                set('this.layers.tempVal.subLayers.font.text',tempValText)
                                add(initPosX,fontWidth)
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
                            }
                        }
                    }
                    
                    
                    add(tempVal,1)
                }
            }           
        `
    };

    WidgetCommands['DateTime'] = {
        onInitialize:`
            var(offset,0)
            var(len,0)
            set(offset,'this.otherAttrs.0')
            set(len,'this.layers.length')
            while(offset<len){
                set('this.layers.offset.hidden',1)
                add(offset,1)
            }
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
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
                while(len>=0){
                    if(len==flag1){
                        minus(len,1)
                    }else{
                        if(len==flag2){
                            minus(len,1)
                        }else{
                            mod(tTag,16)
                            add(tTag,48)
                            set('this.layers.len.subLayers.font.text',tTag)
                            divide(tag,16)
                            set(tTag,tag)
                            minus(len,1)
                        }
                    }
                }
            }
        `,
        onKeyBoardLeft:`
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
                    while(offset<totalLayerNum){
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
        `,
        onKeyBoardRight:`
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
                    while(offset<totalLayerNum){
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
                    var(ttxr,0)
                    set(ttTag,tTag)
                    set(txr,xr)
                    set(ttxr,xr)
                    while(xr>0){
                        divide(ttTag,16)
                        minus(xr,1)
                    }
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
        `,
        onKeyBoardOK:`
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

// mod(ttTag,16)
// print(ttTag,'ttTag')
// //while(xr>0){
// //    multiply(addNum,16)
// //    minus(xr,1)
// //}
// add(tTag,addNum)


// //old code
// var(tTagValue,0)
// getTag(tTagValue)
// // print(tTagValue,'tTagValue')
// var(tMinValue,0)
// set(tMinValue,'this.minValue')
// var(tMaxValue,0)
// set(tMaxValue,'this.maxValue')
// var(tFacCount,0)
// var(tNumOfDigits,0)
// var(tDecimalCount,0)
// var(tMaxWidth,0)
// set(tMaxWidth,'this.otherAttrs.6')
// set(tFacCount,'this.otherAttrs.3')
// var(tHasDot,0)
// if (tFacCount>0) {
//     set(tHasDot,1)
// }
// set(tNumOfDigits,'this.otherAttrs.4')
// set(tDecimalCount,tNumOfDigits)
// minus(tDecimalCount,tFacCount)
// var(tAlign,0)
// set(tAlign,'this.otherAttrs.7')
// var(tFrontZero,0)
// set(tFrontZero,'this.otherAttrs.1')
// var(tSymbol,0)
// set(tSymbol,'this.otherAttrs.2')
// var(tTotalLayers,0)
// set(tTotalLayers,'this.layers.length')
// var(tHasNeg,0)
// if (tTagValue<0) {
//     if (tSymbol==1) {
//         set(tHasNeg,1)
//     }
// }
// var(tCurValue,0)
// set(tCurValue,tTagValue)
// if (tCurValue<0) {
//     multiply(tCurValue,-1)
// }
// var(tCurValue2,0)
// set(tCurValue2,tCurValue)
// var(tRealNum,0)
// set(tRealNum,1)
// while(tCurValue>0){
//     print(tCurValue,'tCurValue')
//     divide(tCurValue,10)
//     add(tRealNum,1)
// }
// var(tFrontNum,0)
// var(tDecimalNum,0)
// var(tOverflowNum,0)
// if (tRealNum<=tFacCount) {
//     set(tDecimalNum,0)
//     if (tFrontZero==1) {
//         set(tFrontNum,tDecimalCount)
//     }else{
//         set(tFrontNum,1)
//     }
// }else{
//     if (tRealNum>tNumOfDigits) {
//         set(tDecimalNum,tDecimalCount)
//         set(tOverflowNum,tRealNum)
//         minus(tOverflowNum,tNumOfDigits)
//     }else{
//         set(tDecimalNum,tRealNum)
//         minus(tDecimalNum,tFacCount)
//         if (tFrontZero==1) {
//             set(tFrontNum,tDecimalCount)
//             minus(tFrontNum,tDecimalNum)
//         }else{
//             set(tFrontNum,0)
//         }
//     }
// }
// // print(tFront,'tFront')
// // print(tDecimalNum,'tDecimalNum')
// // print(tOverflowNum,'tOverflowNum')
// var(tCurTotalNum,0)
// add(tCurTotalNum,tHasNeg)
// add(tCurTotalNum,tFrontNum)
// add(tCurTotalNum,tDecimalNum)
// add(tCurTotalNum,tHasDot)
// add(tCurTotalNum,tFacCount)
// var(tLeftPadding,0)
// set(tLeftPadding,tTotalLayers)
// minus(tLeftPadding,tCurTotalNum)
// var(tLeftPaddingPixel,0)
// if (tLeftPadding>0) {
//     if (tAlign==1) {
//         set(tLeftPaddingPixel,tLeftPadding)
//         multiply(tLeftPaddingPixel,tMaxWidth)
//         divide(tLeftPaddingPixel,2)
//     }else{
//         if (tAlign==2) {
//             set(tLeftPaddingPixel,tLeftPadding)
//             multiply(tLeftPaddingPixel,tMaxWidth)
//         }
//     }
// }
// var(tCurX,0)
// var(tLayerIdx,0)
// var(tDotWidth,0)
// set(tDotWidth,tMaxWidth)
// divide(tDotWidth,2)
// if (tDotWidth==0) {
//     set(tDotWidth,1)
// }
// set(tCurX,tLeftPaddingPixel)
// if (tHasNeg==1) {
//     set('this.layers.tLayerIdx.x',tCurX)
//     set('this.layers.tLayerIdx.width',tMaxWidth)
//     print(tLayerIde,'in tHasNeg')
//     set('this.layers.tLayerIdx.subLayers.font.text',45)
//     add(tLayerIdx,1)
//     add(tCurX,tMaxWidth)
// }
// while(a>0){
//     set('this.layers.tLayerIdx.x',tCurX)
//     set('this.layers.tLayerIdx.width',tMaxWidth)
//     print(tLayerIdx,'in while a>0')
//     set('this.layers.tLayerIdx.subLayers.font.text',48)
//     add(tLayerIdx,1)
//     add(tCurX,tMaxWidth)
//     minus(tFrontNum,1)
// }
// var(tDivider,0)
// set(tDivider,1)
// set(tRealNum,tDecimalNum)
// add(tRealNum,tFacCount)
// while(tRealNum>0){
//     multiply(tDivider,10)
//     minus(tRealNum,1)
// }
// mod(tCurValue2,tDivider)
// var(tCurValue3,0)
// while(tDecimalNum>0){
//     set('this.layers.tLayerIdx.x',tCurX)
//     set('this.layers.tLayerIdx.width',tMaxWidth)
//     set(tCurValue3,tCurValue2)
//     divide(tDivider,10)
//     mod(tCurValue2,tDivider)
//     divide(tCurValue3,tDivider)
//     add(tCurValue3,48)
//     print(tLayerIdx,'in while tDecimalNum>0')
//     print(tCurValue,'tCurValue')
//     set('this.layers.tLayerIdx.subLayers.font.text',tCurValue3)
//     add(tLayerIdx,1)
//     add(tCurX,tMaxWidth)
//     minus(tDecimalNum,1)
// }
// if (tHasDot==1) {
//     set('this.layers.tLayerIdx.x',tCurX)
//     set('this.layers.tLayerIdx.width',tDotWidth)
//     set('this.layers.tLayerIdx.subLayers.font.text',46)
//     add(tLayerIdx,1)
//     add(tCurX,tDotWidth)
//     while(tFacCount>0){
//         set('this.layers.tLayerIdx.x',tCurX)
//         set('this.layers.tLayerIdx.width',tMaxWidth)
//         set(tCurValue3,tCurValue2)
//         divide(tDivider,10)
//         mod(tCurValue2,tDivider)
//         divide(tCurValue3,tDivider)
//         add(tCurValue3,48)
//         print(tLayerIdx,'in hasDot')
//         set('this.layers.tLayerIdx.subLayers.font.text',tCurValue3)
//         add(tLayerIdx,1)
//         add(tCurX,tMaxWidth)
//         minus(tFacCount,1)
//     }
// }
//
// checkalarm(0)
// set('this.oldValue',tTagValue)


