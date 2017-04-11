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
        onInitialize: '\n            var(a,1)\n            set(\'this.otherAttrs.1\',1)\n            set(\'this.layers.1.subLayers.color.r\',a)\n            set(\'this.layers.a.subLayers.color.r\',a)\n            set(a,\'this.layers.2.subLayers.roi.p1x\')\n            setTag(1)\n            set(a,3)\n            if(a>=100){\n                set(\'this.layers.1.hidden\',1)\n            }else{\n                set(\'this.layers.1.hidden\',0)\n            }\n        ',
        onMouseDown: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',1)\n                set(\'this.layers.1.hidden\',0)\n                setTag(0)\n            }else{\n                var(c,0)\n                getTag(c)\n                if(c>0){\n                    setTag(0)\n                }else{\n                    setTag(1)\n                }\n            }\n        ',
        onMouseUp: '\n            var(b,\'this.mode\')\n            if(b==0){\n                set(\'this.layers.0.hidden\',0)\n                set(\'this.layers.0.hidden\',1)\n                setTag(12)\n            }\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,\'this.mode\')\n            getTag(a)\n            if(b==1){\n                if(a>0){\n                    set(\'this.layers.0.hidden\',1)\n                    set(\'this.layers.1.hidden\',0)\n                }else{\n                    set(\'this.layers.0.hidden\',0)\n                    set(\'this.layers.1.hidden\',1)\n                }\n            }\n        '
    };
    WidgetCommands['ButtonGroup'] = {
        onMouseDown: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(c,\'this.layers.length\')\n            minus(c,2)\n            var(lx,0)\n            var(ly,0)\n            var(lw,0)\n            var(lh,0)\n            var(rx,0)\n            var(ry,0)\n            while(c>=0){\n                set(lx,\'this.layers.c.x\')\n                set(ly,\'this.layers.c.y\')\n                set(lw,\'this.layers.c.width\')\n                set(lh,\'this.layers.c.height\')\n                set(rx,lx)\n                set(ry,ly)\n                add(rx,lw)\n                add(ry,lh)\n                if(a>=lx){\n                    if(rx>a){\n                        if(b>=ly){\n                            if(ry>b){\n                                divide(c,2)\n                                setTag(c)\n                                set(c,0)\n                            }\n                        }\n                    }\n                }\n                minus(c,2)\n            }\n        ',
        onTagChange: '\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(a,\'this.layers.length\')\n            set(c,a)\n            divide(c,2)\n            while(a>0){\n                minus(a,1)\n                set(\'this.layers.a.hidden\',1)\n                minus(a,1)\n                set(\'this.layers.a.hidden\',0)\n            }\n            getTag(a)\n            if(a>=0){\n                if(c>a){\n                    multiply(a,2)\n                    set(\'this.layers.a.hidden\',1)\n                    add(a,1)\n                    set(\'this.layers.a.hidden\',0)\n                }\n            }\n\n        '
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