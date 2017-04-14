"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n};!function(n){"function"==typeof define&&define.amd?define("WidgetCommands",[],n):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports?module.exports=n():window.WidgetCommands=n()}(function(){var n={};return n.Button={onInitialize:"\n\n            var(a,'this.mode')\n            set(a,3)\n            if(a>=100){\n                set('this.layers.1.hidden',1)\n            }else{\n                set('this.layers.1.hidden',0)\n            }\n        ",onMouseDown:"\n            var(b,'this.mode')\n            if(b==0){\n                set('this.layers.0.hidden',1)\n                set('this.layers.1.hidden',0)\n                setTag(0)\n            }else{\n                var(c,0)\n                getTag(c)\n                if(c>0){\n                    setTag(0)\n                }else{\n                    setTag(1)\n                }\n            }\n        ",onMouseUp:"\n            var(b,'this.mode')\n            if(b==0){\n                set('this.layers.0.hidden',0)\n                set('this.layers.1.hidden',1)\n                setTag(12)\n            }\n        ",onTagChange:"\n            var(a,0)\n            var(b,'this.mode')\n            getTag(a)\n            if(b==1){\n                if(a>0){\n                    set('this.layers.0.hidden',1)\n                    set('this.layers.1.hidden',0)\n                }else{\n                    set('this.layers.0.hidden',0)\n                    set('this.layers.1.hidden',1)\n                }\n            }\n        "},n.ButtonGroup={onInitialize:"\n            var(a,1)\n        ",onMouseDown:"\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(c,'this.layers.length')\n            minus(c,2)\n            set(a,'this.innerX')\n            set(b,'this.innerY')\n            var(lx,0)\n            var(ly,0)\n            var(lw,0)\n            var(lh,0)\n            var(rx,0)\n            var(ry,0)\n            while(c>=0){\n                set(lx,'this.layers.c.x')\n                set(ly,'this.layers.c.y')\n                set(lw,'this.layers.c.width')\n                set(lh,'this.layers.c.height')\n                set(rx,lx)\n                set(ry,ly)\n                add(rx,lw)\n                add(ry,lh)\n                if(a>=lx){\n                    if(rx>a){\n                        if(b>=ly){\n                            if(ry>b){\n                                divide(c,2)\n                                setTag(c)\n                                set(c,0)\n                            }\n                        }\n                    }\n                }\n                minus(c,2)\n            }\n        ",onMouseUp:"\n            var(d,1)\n        ",onTagChange:"\n            var(a,0)\n            var(b,0)\n            var(c,0)\n            set(a,'this.layers.length')\n            set(c,a)\n            divide(c,2)\n            while(a>0){\n                minus(a,1)\n                set('this.layers.a.hidden',1)\n                minus(a,1)\n                set('this.layers.a.hidden',0)\n            }\n            getTag(a)\n            if(a>=0){\n                if(c>a){\n                    multiply(a,2)\n                    set('this.layers.a.hidden',1)\n                    add(a,1)\n                    set('this.layers.a.hidden',0)\n                }\n            }\n\n        "},n});