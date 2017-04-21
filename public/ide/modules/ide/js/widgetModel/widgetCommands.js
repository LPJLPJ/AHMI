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
        onMouseDown: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',1)\n                set(\'this.layers.1.hidden\',0)\n                setTag(0)\n            }else{\n                var(c,0)\n                getTag(c)\n                if(c>0){\n                    setTag(0)\n                }else{\n                    setTag(1)\n                }\n            }\n        ',
        onMouseUp: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',0)\n                set(\'this.layers.1.hidden\',1)\n                setTag(12)\n            }\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,\'this.mode\')\n            getTag(a)\n            if(b==1){\n                if(a>0){\n                    set(\'this.layers.0.hidden\',1)\n                    set(\'this.layers.1.hidden\',0)\n                }else{\n                    set(\'this.layers.0.hidden\',0)\n                    set(\'this.layers.1.hidden\',1)\n                }\n            }\n        '
    };
    WidgetCommands['ButtonGroup'] = {
        onInitialize: '\n            \n        ',
        onMouseDown: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(c,\'this.layers.length\')\n            minus(c,2)\n            set(a,\'this.innerX\')\n            set(b,\'this.innerY\')\n            var(lx,0)\n            var(ly,0)\n            var(lw,0)\n            var(lh,0)\n            var(rx,0)\n            var(ry,0)\n            while(c>=0){\n                set(lx,\'this.layers.c.x\')\n                set(ly,\'this.layers.c.y\')\n                set(lw,\'this.layers.c.width\')\n                set(lh,\'this.layers.c.height\')\n                set(rx,lx)\n                set(ry,ly)\n                add(rx,lw)\n                add(ry,lh)\n                if(a>=lx){\n                    if(rx>a){\n                        if(b>=ly){\n                            if(ry>b){\n                                divide(c,2)\n                                setTag(c)\n                                set(c,0)\n                            }\n                        }\n                    }\n                }\n                minus(c,2)\n            }\n        ',
        onMouseUp: '\n            var(d,1)\n            set(d,1)\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(a,\'this.layers.length\')\n            set(c,a)\n            divide(c,2)\n            while(a>0){\n                minus(a,1)\n                set(\'this.layers.a.hidden\',1)\n                minus(a,1)\n                set(\'this.layers.a.hidden\',0)\n            }\n            getTag(a)\n            if(a>=0){\n                if(c>a){\n                    multiply(a,2)\n                    set(\'this.layers.a.hidden\',1)\n                    add(a,1)\n                    set(\'this.layers.a.hidden\',0)\n                }\n            }\n\n        '
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

    WidgetCommands['TextArea'] = {
        onInitialize: ''
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