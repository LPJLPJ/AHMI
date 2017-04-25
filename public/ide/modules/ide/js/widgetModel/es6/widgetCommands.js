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

            var(a,'this.mode')
            set(a,3)
            if(a>=100){
                set('this.layers.1.hidden',1)
            }else{
                set('this.layers.1.hidden',0)
            }
        `,
        onMouseDown:`
            var(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',0)
                set('this.layers.1.hidden',1)
                setTag(0)
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
            var(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',0)
                setTag(12)
            }
        `,
        onTagChange:`
            var(a,0)
            var(b,'this.mode')
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
            minus(c,2)
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
                                divide(c,2)
                                setTag(c)
                                set(c,0)
                            }
                        }
                    }
                }
                minus(c,2)
            }
        `,
        onMouseUp:`
            var(d,1)
            set(d,1)
        `,
        onTagChange:`
            var(a,0)
            var(b,0)
            var(c,0)
            set(a,'this.layers.length')
            set(c,a)
            divide(c,2)
            while(a>0){
                minus(a,1)
                set('this.layers.a.hidden',0)
                minus(a,1)
                set('this.layers.a.hidden',1)
            }
            getTag(a)
            if(a>=0){
                if(c>a){
                    multiply(a,2)
                    set('this.layers.a.hidden',0)
                    add(a,1)
                    set('this.layers.a.hidden',1)
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
            
            checkalarm(0)
            set('this.oldValue',ttagValue)

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
            var(mod,'this.mode')
            var(cur,'this.otherAttrs.19')
            set('this.layers.0.hidden',0)
            set('this.layers.1.hidden',0)
            if(cur==1){
                set('this.layers.2.hidden',0)
                set('this.layers.2.x',0)
            }
        `,
        onMouseUp:`
            var(a,1)
        `,
        onMouseDown:`
            var(a,1)
        `,
        onTagChange:`
            var(m,'this.mode')
            var(tag,0)
            getTag(tag)
            var(min,'this.minValue')
            var(max,'this.maxValue')
            if(tag>=min){
               if(tag<=max){
                  var(v,0)
                  var(temp1,0)
                  var(temp2,0)
                  set(temp1,tag)
                  set(temp2,max)
                  minus(temp1,min)
                  minus(temp2,min)
                  var(w,'this.layers.0.width')
                  var(h,'this.layers.0.height')
                  if(m==0){
                      print(m,'m')
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
                      var(r1,'this.otherAttrs.0')
                      var(g1,'this.otherAttrs.1')
                      var(b1,'this.otherAttrs.2')
                      var(a1,'this.otherAttrs.3')
                      var(r2,'this.otherAttrs.4')
                      var(g2,'this.otherAttrs.5')
                      var(b2,'this.otherAttrs.6')
                      var(a2,'this.otherAttrs.7')
                      var(rt,r2)
                      var(gt,g2)
                      var(bt,b2)
                      var(at,a2)
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
                      var(thresM,'this.otherAttrs.0')
                      var(r1,'this.otherAttrs.3')
                      var(g1,'this.otherAttrs.4')
                      var(b1,'this.otherAttrs.5')
                      var(a1,'this.otherAttrs.6')
                      var(r2,'this.otherAttrs.7')
                      var(g2,'this.otherAttrs.8')
                      var(b2,'this.otherAttrs.9')
                      var(a2,'this.otherAttrs.10')
                      if(thresM==1){
                         var(thres1,'this.otherAttrs.1')
                         if(tag<thres1){
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
                         var(r3,'this.otherAttrs.11')
                         var(g3,'this.otherAttrs.12')
                         var(b3,'this.otherAttrs.13')
                         var(a3,'this.otherAttrs.14')
                         var(thres1,'this.otherAttrs.1')
                         var(thres2,'this.otherAttrs.2')
                         if(tag<thres1){
                            set('this.layers.1.subLayers.color.r',r1)
                            set('this.layers.1.subLayers.color.g',g1)
                            set('this.layers.1.subLayers.color.b',b1)
                            set('this.layers.1.subLayers.color.a',a1)
                         }else{
                            if(tag<thres2){
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
               var(cur,'this.otherAttrs.19')
               print(cur,'cur')
               if(cur==1){
                  print(temp1,'temp1')
                  set('this.layers.2.x',temp1)
               }
            }
            checkalarm(0)
            set('this.oldValue',tag)

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
            var(bt,'this.otherAttrs.0')
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
            var(len,'this.layers.length')
            while(len>=0){
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
                if(tInnerX<tBrx){
                    if (tInnerY>=tBy) {
                        if (tInnerY<tBry) {
                            set('this.otherAttrs.4',1)
                            set('this.otherAttrs.0',tInnerX)
                            set('this.otherAttrs.1',tInnerY)
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
            if (tHit==1) {
                
                print(tArrange,'tArrange')
                if (tArrange==0) {
                    set(tLastX,'this.otherAttrs.0')
                    set('this.otherAttrs.0',tInnerX)
                    set(tDist,tInnerX)
                    minus(tDist,tLastX)
                    set(tBx,'this.layers.1.x')
                    add(tBx,tDist)
                    set(tBw,'this.layers.1.width')
                    set(tMaxLength,'this.info.width')
                    minus(tMaxLength,tBw)
                    
                }else{
                    set(tLastX,'this.otherAttrs.1')
                    set('this.otherAttrs.0',tInnerY)
                    set(tDist,tInnerY)
                    minus(tDist,tLastX)
                    set(tBx,'this.layers.1.y')
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
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
            var(tTagValue,0)
            getTag(tTagValue)
            var(tMinValue,0)
            set(tMinValue,'this.minValue')
            var(tMaxValue,0)
            set(tMaxValue,'this.maxValue')
            var(tFacCount,0)
            var(tNumOfDigits,0)
            var(tDecimalCount,0)
            var(tMaxWidth,0)
            set(tMaxWidth,'this.otherAttrs.6')
            set(tFacCount,'this.otherAttrs.3')
            var(tHasDot,0)
            if (tFacCount>0) {
                set(tHasDot,1)
            }
            set(tNumOfDigits,'this.otherAttrs.4')
            set(tDecimalCount,tNumOfDigits)
            minus(tDecimalCount,tFacCount)
            var(tAlign,0)
            set(tAlign,'this.otherAttrs.7')
            var(tFrontZero,0)
            set(tFrontZero,'this.otherAttrs.1')
            var(tSymbol,0)
            set(tSymbol,'this.otherAttrs.2')
            var(tTotalLayers,0)
            set(tTotalLayers,'this.layers.length')
            var(tHasNeg,0)
            if (tTagValue<0) {
                if (tSymbol==1) {
                    set(tHasNeg,1)
                }
            }
            var(tCurValue,0)
            set(tCurValue,tTagValue)
            if (tCurValue<0) {
                multiply(tCurValue,-1)
            }
            var(tCurValue2,0)
            set(tCurValue2,tCurValue)
            var(tRealNum,0)
            set(tRealNum,1)
            while(tCurValue>0){
                divide(tCurValue,10)
                add(tRealNum,1)
            }
            var(tFrontNum,0)
            var(tDecimalNum,0)
            var(tOverflowNum,0)
            if (tRealNum<=tFacCount) {
                set(tDecimalNum,0)
                if (tFrontZero==1) {
                    set(tFrontNum,tDecimalCount)
                }else{
                    set(tFrontNum,1)
                }
            }else{
                if (tRealNum>tNumOfDigits) {
                    set(tDecimalNum,tDecimalCount)
                    set(tOverflowNum,tRealNum)
                    minus(tOverflowNum,tNumOfDigits)
                }else{
                    set(tDecimalNum,tRealNum)
                    minus(tDecimalNum,tFacCount)
                    if (tFrontZero==1) {
                        set(tFrontNum,tDecimalCount)
                        minus(tFrontNum,tDecimalNum)
                    }else{
                        set(tFrontNum,0)
                    }
                }
            }
            var(tCurTotalNum,0)
            add(tCurTotalNum,tHasNeg)
            add(tCurTotalNum,tFrontNum)
            add(tCurTotalNum,tDecimalNum)
            add(tCurTotalNum,tHasDot)
            add(tCurTotalNum,tFacCount)
            var(tLeftPadding,0)
            set(tLeftPadding,tTotalLayers)
            minus(tLeftPadding,tCurTotalNum)
            var(tLeftPaddingPixel,0)
            if (tLeftPadding>0) {
                if (tAlign==1) {
                    set(tLeftPaddingPixel,tLeftPadding)
                    multiply(tLeftPaddingPixel,tMaxWidth)
                    divide(tLeftPaddingPixel,2)
                }else{
                    if (tAlign==2) {
                        set(tLeftPaddingPixel,tLeftPadding)
                        multiply(tLeftPaddingPixel,tMaxWidth)
                    }
                }
            }
            var(tCurX,0)
            var(tLayerIdx,0)
            var(tDotWidth,0)
            set(tDotWidth,tMaxWidth)
            divide(tDotWidth,2)
            if (tDotWidth==0) {
                set(tDotWidth,1)
            }
            set(tCurX,tLeftPaddingPixel)
            if (tHasNeg==1) {
                set('this.layers.tLayerIdx.x',tCurX)
                set('this.layers.tLayerIdx.width',tMaxWidth)
                set('this.layers.tLayerIdx.subLayers.font.text',45)
                add(tLayerIdx,1)
                add(tCurX,tMaxWidth)
            }
            while(tFrontNum>0){
                set('this.layers.tLayerIdx.x',tCurX)
                set('this.layers.tLayerIdx.width',tMaxWidth)
                set('this.layers.tLayerIdx.subLayers.font.text',48)
                add(tLayerIdx,1)
                add(tCurX,tMaxWidth)
                minus(tFrontNum,1)
            }
            var(tDivider,0)
            set(tDivider,1)
            set(tRealNum,tDecimalNum)
            add(tRealNum,tFacCount)
            while(tRealNum>0){
                multiply(tDivider,10)
                minus(tRealNum,1)
            }
            mod(tCurValue2,tDivider)
            var(tCurValue3,0)
            while(tDecimalNum>0){
                set('this.layers.tLayerIdx.x',tCurX)
                set('this.layers.tLayerIdx.width',tMaxWidth)
                set(tCurValue3,tCurValue2)
                divide(tDivider,10)
                mod(tCurValue2,tDivider)
                divide(tCurValue3,tDivider)
                add(tCurValue3,48)
                set('this.layers.tLayerIdx.subLayers.font.text',tCurValue3)
                add(tLayerIdx,1)
                add(tCurX,tMaxWidth)
                minus(tDecimalNum,1)
            }
            if (tHasDot==1) {
                set('this.layers.tLayerIdx.x',tCurX)
                set('this.layers.tLayerIdx.width',tDotWidth)
                set('this.layers.tLayerIdx.subLayers.font.text',46)
                add(tLayerIdx,1)
                add(tCurX,tDotWidth)
                while(tFacCount>0){
                    set('this.layers.tLayerIdx.x',tCurX)
                    set('this.layers.tLayerIdx.width',tMaxWidth)
                    set(tCurValue3,tCurValue2)
                    divide(tDivider,10)
                    mod(tCurValue2,tDivider)
                    divide(tCurValue3,tDivider)
                    add(tCurValue3,48)
                    set('this.layers.tLayerIdx.subLayers.font.text',tCurValue3)
                    add(tLayerIdx,1)
                    add(tCurX,tMaxWidth)
                    minus(tFacCount,1)
                }
            }
            while(tLayerIdx<tTotalLayers){
                set('this.layers.tLayerIdx.subLayers.font.text',0)
            }

            checkalarm(0)
            set('this.oldValue',tTagValue)


        `
    };

    WidgetCommands['DateTime'] = {
        onInitialize:`
        `,
        onMouseUp:`
        `,
        onMouseDown:`
        `,
        onTagChange:`
            var(m,'this.mode')
            var(tag,0)
            getTag(tag)
            var(tTag,0)
            if(tag==0){
                print(tag,'tag is 0')
            }else{
                set(tTag,tag)
                var(len,'this.layers.length')
                minus(len,1)
                var(flag1,10)
                var(flag2,10)
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


