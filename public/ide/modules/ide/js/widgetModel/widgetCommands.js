'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetCommands', [], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        window.WidgetCommands = factory();
    }
})(function () {
    var WidgetCommands = {};
    WidgetCommands['Button'] = {
        onInitialize: '\n\n            var(a,\'this.mode\')\n            set(a,3)\n            if(a>=100){\n                set(\'this.layers.1.hidden\',1)\n            }else{\n                set(\'this.layers.1.hidden\',0)\n            }\n        ',
        onMouseDown: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',0)\n                set(\'this.layers.1.hidden\',1)\n                setTag(0)\n            }else{\n                var(c,0)\n                getTag(c)\n                if(c>0){\n                    setTag(0)\n                }else{\n                    setTag(1)\n                }\n            }\n        ',
        onMouseUp: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',1)\n                set(\'this.layers.1.hidden\',0)\n                setTag(12)\n            }\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,\'this.mode\')\n            getTag(a)\n            if(b==1){\n                if(a>0){\n                    set(\'this.layers.0.hidden\',0)\n                    set(\'this.layers.1.hidden\',1)\n                }else{\n                    set(\'this.layers.0.hidden\',1)\n                    set(\'this.layers.1.hidden\',0)\n                }\n            }\n        '
    };
    WidgetCommands['ButtonGroup'] = {
        onInitialize: '\n            \n        ',
        onMouseDown: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(c,\'this.layers.length\')\n            minus(c,2)\n            set(a,\'this.innerX\')\n            set(b,\'this.innerY\')\n            var(lx,0)\n            var(ly,0)\n            var(lw,0)\n            var(lh,0)\n            var(rx,0)\n            var(ry,0)\n            while(c>=0){\n                set(lx,\'this.layers.c.x\')\n                set(ly,\'this.layers.c.y\')\n                set(lw,\'this.layers.c.width\')\n                set(lh,\'this.layers.c.height\')\n                set(rx,lx)\n                set(ry,ly)\n                add(rx,lw)\n                add(ry,lh)\n                if(a>=lx){\n                    if(rx>a){\n                        if(b>=ly){\n                            if(ry>b){\n                                divide(c,2)\n                                setTag(c)\n                                set(c,0)\n                            }\n                        }\n                    }\n                }\n                minus(c,2)\n            }\n        ',
        onMouseUp: '\n            var(d,1)\n            set(d,1)\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(a,\'this.layers.length\')\n            set(c,a)\n            divide(c,2)\n            while(a>0){\n                minus(a,1)\n                set(\'this.layers.a.hidden\',0)\n                minus(a,1)\n                set(\'this.layers.a.hidden\',1)\n            }\n            getTag(a)\n            if(a>=0){\n                if(c>a){\n                    multiply(a,2)\n                    set(\'this.layers.a.hidden\',0)\n                    add(a,1)\n                    set(\'this.layers.a.hidden\',1)\n                }\n            }\n\n        '
    };

    WidgetCommands['Dashboard'] = {
        onInitialize: '\n        ',
        onMouseDown: '',
        onMouseUp: '',
        onTagChange: '\n            var(toffsetValue,0)\n            var(tminValue,0)\n            var(tmaxValue,0)\n            var(tminAngle,0)\n            var(tmaxAngle,0)\n            var(ttagValue,0)\n            var(tangleDist,0)   \n            set(tminValue,\'this.minValue\')\n            set(tmaxValue,\'this.maxValue\')\n            set(tminAngle,\'this.minAngle\')\n            set(tmaxAngle,\'this.maxAngle\')\n            set(tangleDist,tmaxAngle)\n            minus(tangleDist,tminAngle)\n            var(ttempDist,0)\n            set(toffsetValue,\'this.otherAttrs.0\')\n            getTag(ttagValue)\n            if (ttagValue>tmaxValue) {\n                set(ttagValue,tmaxValue)\n            }\n            if (ttagValue<tminValue) {\n                set(ttagValue,tminValue)\n            }\n            set(ttempDist,tmaxValue)\n            minus(ttempDist,tminValue)\n            var(ttagDist,0)\n            set(ttagDist,ttagValue)\n            minus(ttagValue,tminValue)\n            var(tvalueRatio,0)\n            set(tvalueRatio,ttagDist)\n            multiply(tvalueRatio,tangleDist)\n            divide(tvalueRatio,ttempDist)\n            add(tvalueRatio,tminAngle)\n            var(tclockwise,0)\n            var(tStartAngle,0)\n            set(tclockwise,\'this.otherAttrs.1\')\n            if (tclockwise==1) {\n                add(tvalueRatio,45)\n                add(tvalueRatio,toffsetValue)\n                add(tStartAngle,toffsetValue)\n                add(tStartAngle,90)\n            }else{\n                var(uValueRatio,0)\n                minus(uValueRatio,tvalueRatio)\n                minus(uValueRatio,toffsetValue)\n                set(tvalueRatio,uValueRatio)\n                minus(tStartAngle,toffsetValue)\n                add(tStartAngle,90)\n                add(tvalueRatio,45)\n            }\n            var(tp1x,0)\n            var(tp1y,0)\n            var(tMode,0)\n            var(talpha,0)\n            var(tbeta,0)\n            set(tMode,\'this.mode\')\n            if (tMode==1) {\n                set(\'this.layers.1.rotateAngle\',tvalueRatio)\n            }\n            if (tMode==0) {\n                set(\'this.layers.1.rotateAngle\',tvalueRatio)\n            }\n            add(tvalueRatio,45)\n            if (tMode==1) {\n                set(tp1x,\'this.layers.1.x\')\n                set(tp1y,\'this.layers.1.y\')\n                set(\'this.layers.2.subLayers.roi.p1x\',tp1x)\n                set(\'this.layers.2.subLayers.roi.p1y\',tp1y)\n                if (tclockwise==1) {\n                    set(\'this.layers.2.subLayers.roi.alpha\',tStartAngle)\n                    set(\'this.layers.2.subLayers.roi.beta\',tvalueRatio)\n                }else{\n                    set(\'this.layers.2.subLayers.roi.alpha\',tvalueRatio)\n                    set(\'this.layers.2.subLayers.roi.beta\',tStartAngle)\n                }\n\n            }else{\n                if (tMode==2) {\n                    set(tp1x,\'this.layers.0.width\')\n                    set(tp1y,\'this.layers.0.height\')\n                    divide(tp1x,2)\n                    divide(tp1y,2)\n                    set(\'this.layers.0.subLayers.roi.p1x\',tp1x)\n                    set(\'this.layers.0.subLayers.roi.p1y\',tp1y)\n                    if (tclockwise==1) {\n                        set(\'this.layers.0.subLayers.roi.alpha\',tStartAngle)\n                        set(\'this.layers.0.subLayers.roi.beta\',tvalueRatio)\n                    }else{\n                        set(\'this.layers.0.subLayers.roi.alpha\',tvalueRatio)\n                        set(\'this.layers.0.subLayers.roi.beta\',tStartAngle)\n                    }\n                }\n            }\n            \n            checkalarm(0)\n            set(\'this.oldValue\',ttagValue)\n\n        '
    };

    WidgetCommands['RotateImg'] = {
        onInitialize: '\n        ',
        onTagChange: '\n            var(tTagValue,0)\n            getTag(tTagValue)\n            var(tMinAngle,0)\n            var(tMaxAngle,0)\n            var(tWidth,0)\n            set(tWidth,\'this.layers.0.width\')\n            divide(tWidth,2)\n            var(tHeight,0)\n            set(tHeight,\'this.layers.0.height\')\n            divide(tHeight,2)\n            set(tMinAngle,\'this.minValue\')\n            set(tMaxAngle,\'this.maxValue\')\n            if (tTagValue>tMaxAngle) {\n                set(tTagValue,tMaxAngle)\n            }\n            if(tTagValue<tMinAngle){\n                set(tTagValue,tMinAngle)\n            }\n            set(\'this.layers.0.rotateCenterX\',tWidth)\n            set(\'this.layers.0.rotateCenterY\',tHeight)\n            set(\'this.layers.0.rotateAngle\',tTagValue)\n        '
    };

    WidgetCommands['Progress'] = {
        onInitialize: '\n            var(mod,\'this.mode\')\n            var(cur,\'this.otherAttrs.19\')\n            set(\'this.layers.0.hidden\',0)\n            set(\'this.layers.1.hidden\',0)\n            if(cur==1){\n                set(\'this.layers.2.hidden\',0)\n                set(\'this.layers.2.x\',0)\n            }\n        ',
        onMouseUp: '\n            var(a,1)\n        ',
        onMouseDown: '\n            var(a,1)\n        ',
        onTagChange: '\n            var(m,\'this.mode\')\n            var(tag,0)\n            getTag(tag)\n            var(min,\'this.minValue\')\n            var(max,\'this.maxValue\')\n            if(tag>=min){\n               if(tag<=max){\n                  var(v,0)\n                  var(temp1,0)\n                  var(temp2,0)\n                  set(temp1,tag)\n                  set(temp2,max)\n                  minus(temp1,min)\n                  minus(temp2,min)\n                  var(w,\'this.layers.0.width\')\n                  var(h,\'this.layers.0.height\')\n                  if(m==0){\n                      print(m,\'m\')\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.subLayers.roi.p1x\',0)\n                      set(\'this.layers.1.subLayers.roi.p1y\',0)\n                      set(\'this.layers.1.subLayers.roi.p2x\',temp1)\n                      set(\'this.layers.1.subLayers.roi.p2y\',0)\n                      set(\'this.layers.1.subLayers.roi.p3x\',temp1)\n                      set(\'this.layers.1.subLayers.roi.p3y\',h)\n                      set(\'this.layers.1.subLayers.roi.p4x\',0)\n                      set(\'this.layers.1.subLayers.roi.p4y\',h)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n                  if(m==1){\n                      var(r1,\'this.otherAttrs.0\')\n                      var(g1,\'this.otherAttrs.1\')\n                      var(b1,\'this.otherAttrs.2\')\n                      var(a1,\'this.otherAttrs.3\')\n                      var(r2,\'this.otherAttrs.4\')\n                      var(g2,\'this.otherAttrs.5\')\n                      var(b2,\'this.otherAttrs.6\')\n                      var(a2,\'this.otherAttrs.7\')\n                      var(rt,r2)\n                      var(gt,g2)\n                      var(bt,b2)\n                      var(at,a2)\n                      minus(rt,r1)\n                      minus(gt,g1)\n                      minus(bt,b1)\n                      minus(at,a1)\n                      multiply(rt,temp1)\n                      multiply(gt,temp1)\n                      multiply(bt,temp1)\n                      multiply(at,temp1)\n                      divide(rt,temp2)\n                      divide(gt,temp2)\n                      divide(bt,temp2)\n                      divide(at,temp2)\n                      add(rt,r1)\n                      add(gt,g1)\n                      add(bt,b1)\n                      add(at,a1)\n                      set(\'this.layers.1.subLayers.color.r\',rt)\n                      set(\'this.layers.1.subLayers.color.g\',gt)\n                      set(\'this.layers.1.subLayers.color.b\',bt)\n                      set(\'this.layers.1.subLayers.color.a\',at)\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.width\',temp1)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n                  if(m==3){\n                      var(thresM,\'this.otherAttrs.0\')\n                      var(r1,\'this.otherAttrs.3\')\n                      var(g1,\'this.otherAttrs.4\')\n                      var(b1,\'this.otherAttrs.5\')\n                      var(a1,\'this.otherAttrs.6\')\n                      var(r2,\'this.otherAttrs.7\')\n                      var(g2,\'this.otherAttrs.8\')\n                      var(b2,\'this.otherAttrs.9\')\n                      var(a2,\'this.otherAttrs.10\')\n                      if(thresM==1){\n                         var(thres1,\'this.otherAttrs.1\')\n                         if(tag<thres1){\n                            set(\'this.layers.1.subLayers.color.r\',r1)\n                            set(\'this.layers.1.subLayers.color.g\',g1)\n                            set(\'this.layers.1.subLayers.color.b\',b1)\n                            set(\'this.layers.1.subLayers.color.a\',a1)\n                         }else{\n                            set(\'this.layers.1.subLayers.color.r\',r2)\n                            set(\'this.layers.1.subLayers.color.g\',g2)\n                            set(\'this.layers.1.subLayers.color.b\',b2)\n                            set(\'this.layers.1.subLayers.color.a\',a2)\n                         }\n                      }\n                      if(thresM==2){\n                         var(r3,\'this.otherAttrs.11\')\n                         var(g3,\'this.otherAttrs.12\')\n                         var(b3,\'this.otherAttrs.13\')\n                         var(a3,\'this.otherAttrs.14\')\n                         var(thres1,\'this.otherAttrs.1\')\n                         var(thres2,\'this.otherAttrs.2\')\n                         if(tag<thres1){\n                            set(\'this.layers.1.subLayers.color.r\',r1)\n                            set(\'this.layers.1.subLayers.color.g\',g1)\n                            set(\'this.layers.1.subLayers.color.b\',b1)\n                            set(\'this.layers.1.subLayers.color.a\',a1)\n                         }else{\n                            if(tag<thres2){\n                                set(\'this.layers.1.subLayers.color.r\',r2)\n                                set(\'this.layers.1.subLayers.color.g\',g2)\n                                set(\'this.layers.1.subLayers.color.b\',b2)\n                                set(\'this.layers.1.subLayers.color.a\',a2)\n                            }else{\n                                set(\'this.layers.1.subLayers.color.r\',r3)\n                                set(\'this.layers.1.subLayers.color.g\',g3)\n                                set(\'this.layers.1.subLayers.color.b\',b3)\n                                set(\'this.layers.1.subLayers.color.a\',a3)\n                            }\n                         }\n\n                      }\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.width\',temp1)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n               }\n               var(cur,\'this.otherAttrs.19\')\n               print(cur,\'cur\')\n               if(cur==1){\n                  print(temp1,\'temp1\')\n                  set(\'this.layers.2.x\',temp1)\n               }\n            }\n            checkalarm(0)\n            set(\'this.oldValue\',tag)\n\n        '
    };

    WidgetCommands['TextArea'] = {
        onInitialize: ''
    };

    WidgetCommands['Switch'] = {
        onInitialize: '\n            set(\'this.layers.0.hidden\',1)\n        ',
        onMouseUp: '\n        ',
        onMouseDown: '\n        ',
        onTagChange: '\n            var(tag,0)\n            var(bt,\'this.otherAttrs.0\')\n            getTag(tag)\n            var(tBt,0)\n            set(tBt,bt)\n            var(t,0)\n            set(t,tag)\n            while(tBt>=0){\n                if(tBt==0){\n                    mod(t,2)\n                    if(t==1){\n                        set(\'this.layers.0.hidden\',0)\n                    }else{\n                        set(\'this.layers.0.hidden\',1)\n                    }\n                }\n                divide(t,2)\n                minus(tBt,1)\n            }\n        '
    };

    WidgetCommands['ScriptTrigger'] = {
        onInitialize: '',
        onTagChange: '\n            var(tTagValue,0)\n            getTag(tTagValue)\n            checkalarm(0)\n            set(\'this.oldValue\',tTagValue)\n        '
    };

    WidgetCommands['Video'] = {};

    WidgetCommands['Slide'] = {
        onInitialize: '\n        ',
        onMouseUp: '\n        ',
        onMouseDown: '\n        ',
        onTagChange: '\n            var(len,\'this.layers.length\')\n            while(len>=0){\n                minus(len,1)\n                set(\'this.layers.len.hidden\',1)\n            }\n            var(t,0)\n            getTag(t)\n            set(\'this.layers.t.hidden\',0)\n\n        '
    };

    WidgetCommands['SlideBlock'] = {
        onInitialize: '\n        ',
        onMouseUp: '\n        ',
        onMouseDown: '\n            var(tBx,0)\n            var(tBy,0)\n            var(tBw,0)\n            var(tBh,0)\n            var(tInnerX,0)\n            var(tInnerY,0)\n            var(tBrx,0)\n            var(tBry,0)\n            set(tBx,\'this.layers.1.x\')\n            set(tBy,\'this.layers.1.y\')\n            set(tBw,\'this.layers.1.width\')\n            set(tBh,\'this.layers.1.height\')\n            set(tBrx,tBx)\n            add(tBrx,tBw)\n            set(tBry,tBy)\n            add(tBry,tBh)\n            set(tInnerX,\'this.innerX\')\n            set(tInnerY,\'this.innerY\')\n            set(\'this.otherAttrs.4\',0)\n            if (tInnerX>=tBx) {\n                if(tInnerX<tBrx){\n                    if (tInnerY>=tBy) {\n                        if (tInnerY<tBry) {\n                            set(\'this.otherAttrs.4\',1)\n                            set(\'this.otherAttrs.0\',tInnerX)\n                            set(\'this.otherAttrs.1\',tInnerY)\n                        }\n                    }\n                }\n            }\n        ',
        onMouseMove: '\n            var(tArrange,0)\n            set(tArrange,\'this.arrange\')\n            var(tInnerX,0)\n            var(tInnerY,0)\n            set(tInnerX,\'this.innerX\')\n            set(tInnerY,\'this.innerY\')\n            var(tHit,0)\n            set(tHit,\'this.otherAttrs.4\')\n            var(tDist,0)\n            var(tLastX,0)\n            var(tBx,0)\n            var(tMaxLength,0)\n            var(tBw,0)\n            var(tMinValue,0)\n            var(tMaxValue,0)\n            var(tValueDist,0)\n            if (tHit==1) {\n                \n                print(tArrange,\'tArrange\')\n                if (tArrange==0) {\n                    set(tLastX,\'this.otherAttrs.0\')\n                    set(\'this.otherAttrs.0\',tInnerX)\n                    set(tDist,tInnerX)\n                    minus(tDist,tLastX)\n                    set(tBx,\'this.layers.1.x\')\n                    add(tBx,tDist)\n                    set(tBw,\'this.layers.1.width\')\n                    set(tMaxLength,\'this.info.width\')\n                    minus(tMaxLength,tBw)\n                    \n                }else{\n                    set(tLastX,\'this.otherAttrs.1\')\n                    set(\'this.otherAttrs.0\',tInnerY)\n                    set(tDist,tInnerY)\n                    minus(tDist,tLastX)\n                    set(tBx,\'this.layers.1.y\')\n                    add(tBx,tDist)\n                    set(tBw,\'this.layers.1.height\')\n                    set(tMaxLength,\'this.info.height\')\n                    minus(tMaxLength,tBw)\n                }\n\n                if (tBx<0) {\n                    set(tBx,0)\n                }\n                if (tBx>tMaxLength) {\n                    set(tBx,tMaxLength)\n                }\n                set(tMinValue,\'this.minValue\')\n                set(tMaxValue,\'this.maxValue\')\n                set(tValueDist,tMaxValue)\n                minus(tValueDist,tMinValue)\n                multiply(tBx,tValueDist)\n                divide(tBx,tMaxLength)\n                add(tBx,tMinValue)\n                setTag(tBx)\n\n            }\n        ',
        onTagChange: '\n            var(tMinValue,0)\n            var(tMaxValue,0)\n            var(tValueDist,0)\n            var(tTagValue,0)\n            getTag(tTagValue)\n            var(tCurValue,0)\n            var(tMaxLength,0)\n            var(tBw,0)\n            set(tCurValue,tTagValue)\n            set(tMinValue,\'this.minValue\')\n            set(tMaxValue,\'this.maxValue\')\n            if (tCurValue>tMaxValue) {\n                set(tCurValue,tMaxValue)\n            }\n            if (tCurValue<tMinValue) {\n                set(tCurValue,tMinValue)\n            }\n            var(tArrange,0)\n            set(tArrange,\'this.arrange\')\n            if (tArrange==0) {\n                set(tMaxLength,\'this.info.width\')\n                set(tBw,\'this.layers.1.width\')\n            }else{\n                set(tMaxLength,\'this.info.height\')\n                set(tBw,\'this.layers.1.height\')\n            }\n            \n            minus(tMaxLength,tBw)\n            var(tValueDist,0)\n            var(tValueRatio,0)\n            set(tValueDist,tMaxValue)\n            minus(tValueDist,tMinValue)\n            set(tValueRatio,tCurValue)\n            minus(tValueRatio,tMinValue)\n            multiply(tValueRatio,tMaxLength)\n            divide(tValueRatio,tValueDist)\n            if (tArrange==0) {\n                set(\'this.layers.1.x\',tValueRatio)\n            }else{\n                set(\'this.layers.1.y\',tValueRatio)\n            }\n            checkalarm(0)\n            set(\'this.oldValue\',tCurValue)\n\n\n        '
    };

    WidgetCommands['Num'] = {
        onInitialize: '\n        ',
        onMouseUp: '\n        ',
        onMouseDown: '\n        ',
        onTagChange: '\n            var(tTagValue,0)\n            getTag(tTagValue)\n            var(tMinValue,0)\n            set(tMinValue,\'this.minValue\')\n            var(tMaxValue,0)\n            set(tMaxValue,\'this.maxValue\')\n            var(tFacCount,0)\n            var(tNumOfDigits,0)\n            var(tDecimalCount,0)\n            var(tMaxWidth,0)\n            set(tMaxWidth,\'this.otherAttrs.6\')\n            set(tFacCount,\'this.otherAttrs.3\')\n            var(tHasDot,0)\n            if (tFacCount>0) {\n                set(tHasDot,1)\n            }\n            set(tNumOfDigits,\'this.otherAttrs.4\')\n            set(tDecimalCount,tNumOfDigits)\n            minus(tDecimalCount,tFacCount)\n            var(tAlign,0)\n            set(tAlign,\'this.otherAttrs.7\')\n            var(tFrontZero,0)\n            set(tFrontZero,\'this.otherAttrs.1\')\n            var(tSymbol,0)\n            set(tSymbol,\'this.otherAttrs.2\')\n            var(tTotalLayers,0)\n            set(tTotalLayers,\'this.layers.length\')\n            var(tHasNeg,0)\n            if (tTagValue<0) {\n                if (tSymbol==1) {\n                    set(tHasNeg,1)\n                }\n            }\n            var(tCurValue,0)\n            set(tCurValue,tTagValue)\n            if (tCurValue<0) {\n                multiply(tCurValue,-1)\n            }\n            var(tCurValue2,0)\n            set(tCurValue2,tCurValue)\n            var(tRealNum,0)\n            set(tRealNum,1)\n            while(tCurValue>0){\n                divide(tCurValue,10)\n                add(tRealNum,1)\n            }\n            var(tFrontNum,0)\n            var(tDecimalNum,0)\n            var(tOverflowNum,0)\n            if (tRealNum<=tFacCount) {\n                set(tDecimalNum,0)\n                if (tFrontZero==1) {\n                    set(tFrontNum,tDecimalCount)\n                }else{\n                    set(tFrontNum,1)\n                }\n            }else{\n                if (tRealNum>tNumOfDigits) {\n                    set(tDecimalNum,tDecimalCount)\n                    set(tOverflowNum,tRealNum)\n                    minus(tOverflowNum,tNumOfDigits)\n                }else{\n                    set(tDecimalNum,tRealNum)\n                    minus(tDecimalNum,tFacCount)\n                    if (tFrontZero==1) {\n                        set(tFrontNum,tDecimalCount)\n                        minus(tFrontNum,tDecimalNum)\n                    }else{\n                        set(tFrontNum,0)\n                    }\n                }\n            }\n            var(tCurTotalNum,0)\n            add(tCurTotalNum,tHasNeg)\n            add(tCurTotalNum,tFrontNum)\n            add(tCurTotalNum,tDecimalNum)\n            add(tCurTotalNum,tHasDot)\n            add(tCurTotalNum,tFacCount)\n            var(tLeftPadding,0)\n            set(tLeftPadding,tTotalLayers)\n            minus(tLeftPadding,tCurTotalNum)\n            var(tLeftPaddingPixel,0)\n            if (tLeftPadding>0) {\n                if (tAlign==1) {\n                    set(tLeftPaddingPixel,tLeftPadding)\n                    multiply(tLeftPaddingPixel,tMaxWidth)\n                    divide(tLeftPaddingPixel,2)\n                }else{\n                    if (tAlign==2) {\n                        set(tLeftPaddingPixel,tLeftPadding)\n                        multiply(tLeftPaddingPixel,tMaxWidth)\n                    }\n                }\n            }\n            var(tCurX,0)\n            var(tLayerIdx,0)\n            var(tDotWidth,0)\n            set(tDotWidth,tMaxWidth)\n            divide(tDotWidth,2)\n            if (tDotWidth==0) {\n                set(tDotWidth,1)\n            }\n            set(tCurX,tLeftPaddingPixel)\n            if (tHasNeg==1) {\n                set(\'this.layers.tLayerIdx.x\',tCurX)\n                set(\'this.layers.tLayerIdx.width\',tMaxWidth)\n                set(\'this.layers.tLayerIdx.subLayers.font.text\',45)\n                add(tLayerIdx,1)\n                add(tCurX,tMaxWidth)\n            }\n            while(tFrontNum>0){\n                set(\'this.layers.tLayerIdx.x\',tCurX)\n                set(\'this.layers.tLayerIdx.width\',tMaxWidth)\n                set(\'this.layers.tLayerIdx.subLayers.font.text\',48)\n                add(tLayerIdx,1)\n                add(tCurX,tMaxWidth)\n                minus(tFrontNum,1)\n            }\n            var(tDivider,0)\n            set(tDivider,1)\n            set(tRealNum,tDecimalNum)\n            add(tRealNum,tFacCount)\n            while(tRealNum>0){\n                multiply(tDivider,10)\n                minus(tRealNum,1)\n            }\n            mod(tCurValue2,tDivider)\n            var(tCurValue3,0)\n            while(tDecimalNum>0){\n                set(\'this.layers.tLayerIdx.x\',tCurX)\n                set(\'this.layers.tLayerIdx.width\',tMaxWidth)\n                set(tCurValue3,tCurValue2)\n                divide(tDivider,10)\n                mod(tCurValue2,tDivider)\n                divide(tCurValue3,tDivider)\n                add(tCurValue3,48)\n                set(\'this.layers.tLayerIdx.subLayers.font.text\',tCurValue3)\n                add(tLayerIdx,1)\n                add(tCurX,tMaxWidth)\n                minus(tDecimalNum,1)\n            }\n            if (tHasDot==1) {\n                set(\'this.layers.tLayerIdx.x\',tCurX)\n                set(\'this.layers.tLayerIdx.width\',tDotWidth)\n                set(\'this.layers.tLayerIdx.subLayers.font.text\',46)\n                add(tLayerIdx,1)\n                add(tCurX,tDotWidth)\n                while(tFacCount>0){\n                    set(\'this.layers.tLayerIdx.x\',tCurX)\n                    set(\'this.layers.tLayerIdx.width\',tMaxWidth)\n                    set(tCurValue3,tCurValue2)\n                    divide(tDivider,10)\n                    mod(tCurValue2,tDivider)\n                    divide(tCurValue3,tDivider)\n                    add(tCurValue3,48)\n                    set(\'this.layers.tLayerIdx.subLayers.font.text\',tCurValue3)\n                    add(tLayerIdx,1)\n                    add(tCurX,tMaxWidth)\n                    minus(tFacCount,1)\n                }\n            }\n            while(tLayerIdx<tTotalLayers){\n                set(\'this.layers.tLayerIdx.subLayers.font.text\',0)\n            }\n\n            checkalarm(0)\n            set(\'this.oldValue\',tTagValue)\n\n\n        '
    };

    WidgetCommands['DateTime'] = {
        onInitialize: '\n        ',
        onMouseUp: '\n        ',
        onMouseDown: '\n        ',
        onTagChange: '\n            var(m,\'this.mode\')\n            var(tag,0)\n            getTag(tag)\n            var(tTag,0)\n            if(tag==0){\n                print(tag,\'tag is 0\')\n            }else{\n                set(tTag,tag)\n                var(len,\'this.layers.length\')\n                minus(len,1)\n                var(flag1,10)\n                var(flag2,10)\n                if(m==0){\n                    set(flag1,2)\n                    set(flag2,5)\n                }else{\n                    if(m==1){\n                        set(flag1,2)\n                    }else{\n                        if(m==2){\n                            set(flag1,4)\n                            set(flag2,7)\n                        }else{\n                            if(m==3){\n                                set(flag1,4)\n                                set(flag2,7)\n                            }else{\n                                print(m,\'mode is unknown\')\n                            }\n                        }\n                    }\n                }\n                while(len>=0){\n                    if(len==flag1){\n                        minus(len,1)\n                    }else{\n                        if(len==flag2){\n                            minus(len,1)\n                        }else{\n                            mod(tTag,16)\n                            add(tTag,48)\n                            set(\'this.layers.len.subLayers.font.text\',tTag)\n                            divide(tag,16)\n                            set(tTag,tag)\n                            minus(len,1)\n                        }\n                    }\n                }\n            }\n        '
    };

    return WidgetCommands;
});

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