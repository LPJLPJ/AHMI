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

    WidgetCommands['Progress'] = {
        onInitialize:`
            var(mod,'this.mode')
            var(cur,'this.cursor')
            set('this.layers.0.hidden',0)
            set('this.layers.1.hidden',0)
            if(cur==1){
                set('this.layers.2.hidden',0)
            }
            set('this.layers.1.width',0)
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
                  if(m==0){
                      multiply(temp1,w)
                      divide(temp1,temp2)
                      set('this.layers.1.width',temp1)
                      set('this.layers.1.hidden',0)
                  }
                  if(m==1){
                      var(r1,'this.otherAttrs.initColor.r')
                      var(g1,'this.otherAttrs.initColor.g')
                      var(b1,'this.otherAttrs.initColor.b')
                      var(a1,'this.otherAttrs.initColor.a')
                      var(r2,'this.otherAttrs.endColor.r')
                      var(g2,'this.otherAttrs.endColor.g')
                      var(b2,'this.otherAttrs.endColor.b')
                      var(a2,'this.otherAttrs.endColor.a')
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
                      var(thresM,'this.otherAttrs.thresholdModeId')
                      var(r1,'this.otherAttrs.color1.r')
                      var(g1,'this.otherAttrs.color1.g')
                      var(b1,'this.otherAttrs.color1.b')
                      var(a1,'this.otherAttrs.color1.a')
                      var(r2,'this.otherAttrs.color2.r')
                      var(g2,'this.otherAttrs.color2.g')
                      var(b2,'this.otherAttrs.color2.b')
                      var(a2,'this.otherAttrs.color2.a')
                      if(thresM==1){
                         var(thres1,'this.otherAttrs.threshold1')
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
                         var(r3,'this.otherAttrs.color3.r')
                         var(g3,'this.otherAttrs.color3.g')
                         var(b3,'this.otherAttrs.color3.b')
                         var(a3,'this.otherAttrs.color3.a')
                         var(thres1,'this.otherAttrs.threshold1')
                         var(thres2,'this.otherAttrs.threshold2')
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

