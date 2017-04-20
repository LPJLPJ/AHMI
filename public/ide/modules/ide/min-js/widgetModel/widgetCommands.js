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
        onTagChange: '\n            var(toffsetValue,0)\n            var(tminValue,0)\n            var(tmaxValue,0)\n            var(tminAngle,0)\n            var(tmaxAngle,0)\n            var(ttagValue,0)\n            var(tangleDist,0)   \n            set(tminValue,\'this.minValue\')\n            set(tmaxValue,\'this.maxValue\')\n            set(tminAngle,\'this.minAngle\')\n            set(tmaxAngle,\'this.maxAngle\')\n            set(tangleDist,tmaxAngle)\n            minus(tangleDist,tminAngle)\n            var(ttempDist,0)\n            set(toffsetValue,\'this.otherAttrs.0\')\n            getTag(ttagValue)\n            if (ttagValue>tmaxValue) {\n                set(ttagValue,tmaxValue)\n            }\n            if (ttagValue<tminValue) {\n                set(ttagValue,tminValue)\n            }\n            set(ttempDist,tmaxValue)\n            minus(ttempDist,tminValue)\n            var(ttagDist,0)\n            set(ttagDist,ttagValue)\n            minus(ttagValue,tminValue)\n            var(tvalueRatio,0)\n            set(tvalueRatio,ttagDist)\n            divide(tvalueRatio,ttempDist)\n            multiply(tvalueRatio,tangleDist)\n            add(tvalueRatio,tminAngle)\n            var(tclockwise,0)\n            var(tStartAngle,0)\n            set(tclockwise,\'this.otherAttrs.1\')\n            if (tclockwise==1) {\n                add(tvalueRatio,45)\n                add(tvalueRatio,toffsetValue)\n                add(tStartAngle,toffsetValue)\n                add(tStartAngle,90)\n            }else{\n                var(uValueRatio,0)\n                minus(uValueRatio,tvalueRatio)\n                minus(uValueRatio,toffsetValue)\n                set(tvalueRatio,uValueRatio)\n                minus(tStartAngle,toffsetValue)\n                add(tStartAngle,90)\n                add(tvalueRatio,45)\n            }\n            var(tp1x,0)\n            var(tp1y,0)\n            var(tMode,0)\n            var(talpha,0)\n            var(tbeta,0)\n            set(tMode,\'this.mode\')\n            set(\'this.layers.1.rotateAngle\',tvalueRatio)\n            add(tvalueRatio,45)\n            if (tMode==1) {\n                set(tp1x,\'this.layers.1.x\')\n                set(tp1y,\'this.layers.1.y\')\n                set(\'this.layers.2.subLayers.roi.p1x\',tp1x)\n                set(\'this.layers.2.subLayers.roi.p1y\',tp1y)\n                if (tclockwise==1) {\n                    set(\'this.layers.2.subLayers.roi.alpha\',tStartAngle)\n                    set(\'this.layers.2.subLayers.roi.beta\',tvalueRatio)\n                }else{\n                    set(\'this.layers.2.subLayers.roi.alpha\',tvalueRatio)\n                    set(\'this.layers.2.subLayers.roi.beta\',tStartAngle)\n                }\n\n            }\n            \n            checkalarm(0)\n            set(\'this.oldValue\',ttagValue)\n\n        '
    };

    WidgetCommands['Progress'] = {
        onInitialize: '\n            var(mod,\'this.mode\')\n            var(cur,\'this.cursor\')\n            set(\'this.layers.0.hidden\',0)\n            set(\'this.layers.1.hidden\',0)\n            if(cur==1){\n                set(\'this.layers.2.hidden\',0)\n            }\n            set(\'this.layers.1.width\',0)\n        ',
        onMouseUp: '\n            var(a,1)\n        ',
        onMouseDown: '\n            var(a,1)\n        ',
        onTagChange: '\n            var(m,\'this.mode\')\n            var(tag,0)\n            getTag(tag)\n            var(min,\'this.minValue\')\n            var(max,\'this.maxValue\')\n            if(tag>=min){\n               if(tag<=max){\n                  var(v,0)\n                  var(temp1,0)\n                  var(temp2,0)\n                  set(temp1,tag)\n                  set(temp2,max)\n                  minus(temp1,min)\n                  minus(temp2,min)\n                  var(w,\'this.layers.0.width\')\n                  if(m==0){\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.width\',temp1)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n                  if(m==1){\n                      var(r1,\'this.otherAttrs.initColor.r\')\n                      var(g1,\'this.otherAttrs.initColor.g\')\n                      var(b1,\'this.otherAttrs.initColor.b\')\n                      var(a1,\'this.otherAttrs.initColor.a\')\n                      var(r2,\'this.otherAttrs.endColor.r\')\n                      var(g2,\'this.otherAttrs.endColor.g\')\n                      var(b2,\'this.otherAttrs.endColor.b\')\n                      var(a2,\'this.otherAttrs.endColor.a\')\n                      var(rt,r2)\n                      var(gt,g2)\n                      var(bt,b2)\n                      var(at,a2)\n                      minus(rt,r1)\n                      minus(gt,g1)\n                      minus(bt,b1)\n                      minus(at,a1)\n                      multiply(rt,temp1)\n                      multiply(gt,temp1)\n                      multiply(bt,temp1)\n                      multiply(at,temp1)\n                      divide(rt,temp2)\n                      divide(gt,temp2)\n                      divide(bt,temp2)\n                      divide(at,temp2)\n                      add(rt,r1)\n                      add(gt,g1)\n                      add(bt,b1)\n                      add(at,a1)\n                      set(\'this.layers.1.subLayers.color.r\',rt)\n                      set(\'this.layers.1.subLayers.color.g\',gt)\n                      set(\'this.layers.1.subLayers.color.b\',bt)\n                      set(\'this.layers.1.subLayers.color.a\',at)\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.width\',temp1)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n                  if(m==3){\n                      var(thresM,\'this.otherAttrs.thresholdModeId\')\n                      var(r1,\'this.otherAttrs.color1.r\')\n                      var(g1,\'this.otherAttrs.color1.g\')\n                      var(b1,\'this.otherAttrs.color1.b\')\n                      var(a1,\'this.otherAttrs.color1.a\')\n                      var(r2,\'this.otherAttrs.color2.r\')\n                      var(g2,\'this.otherAttrs.color2.g\')\n                      var(b2,\'this.otherAttrs.color2.b\')\n                      var(a2,\'this.otherAttrs.color2.a\')\n                      if(thresM==1){\n                         var(thres1,\'this.otherAttrs.threshold1\')\n                         if(tag<thres1){\n                            set(\'this.layers.1.subLayers.color.r\',r1)\n                            set(\'this.layers.1.subLayers.color.g\',g1)\n                            set(\'this.layers.1.subLayers.color.b\',b1)\n                            set(\'this.layers.1.subLayers.color.a\',a1)\n                         }else{\n                            set(\'this.layers.1.subLayers.color.r\',r2)\n                            set(\'this.layers.1.subLayers.color.g\',g2)\n                            set(\'this.layers.1.subLayers.color.b\',b2)\n                            set(\'this.layers.1.subLayers.color.a\',a2)\n                         }\n                      }\n                      if(thresM==2){\n                         var(r3,\'this.otherAttrs.color3.r\')\n                         var(g3,\'this.otherAttrs.color3.g\')\n                         var(b3,\'this.otherAttrs.color3.b\')\n                         var(a3,\'this.otherAttrs.color3.a\')\n                         var(thres1,\'this.otherAttrs.threshold1\')\n                         var(thres2,\'this.otherAttrs.threshold2\')\n                         if(tag<thres1){\n                            set(\'this.layers.1.subLayers.color.r\',r1)\n                            set(\'this.layers.1.subLayers.color.g\',g1)\n                            set(\'this.layers.1.subLayers.color.b\',b1)\n                            set(\'this.layers.1.subLayers.color.a\',a1)\n                         }else{\n                            if(tag<thres2){\n                                set(\'this.layers.1.subLayers.color.r\',r2)\n                                set(\'this.layers.1.subLayers.color.g\',g2)\n                                set(\'this.layers.1.subLayers.color.b\',b2)\n                                set(\'this.layers.1.subLayers.color.a\',a2)\n                            }else{\n                                set(\'this.layers.1.subLayers.color.r\',r3)\n                                set(\'this.layers.1.subLayers.color.g\',g3)\n                                set(\'this.layers.1.subLayers.color.b\',b3)\n                                set(\'this.layers.1.subLayers.color.a\',a3)\n                            }\n                         }\n\n                      }\n                      multiply(temp1,w)\n                      divide(temp1,temp2)\n                      set(\'this.layers.1.width\',temp1)\n                      set(\'this.layers.1.hidden\',0)\n                  }\n               }\n            }\n\n        '
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