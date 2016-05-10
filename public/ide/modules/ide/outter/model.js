/**
 * Created by jhwang on 14-6-21.
 */
define(function (require, exports) {
    var WdtType = require('./widgettype');


    // 增加fabric 对象属性,增加id属性,和rid
    fabric.Object.prototype.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                id: this.id, rid: this.rid
            });
        };
    })(fabric.Object.prototype.toObject);


    fabric.Object.prototype.getRelInfo = function () {

        return this.rinfo;

    };

    fabric.Object.prototype.setRelInfo = function (rinfo) {
        return this.rinfo = rinfo;
    };


    /**
     *   widget编辑时弹出的属性框
     * @param opt {"rel":null,"slidePath":"xx"}
     * @param finishcallback
     */

    fabric.Object.prototype.showEditDialog = function (opt, finishcallback) {

        if (!WdtType.isComplexWidget(this.type))
            return;
        else {
            throw this.type + " showEditDialog should implement!";
        }
    };


    fabric.Object.prototype.showEditButton = function (_slide) {
        if(this.type === 'path-group') return;
        var _b = $('#inline-btn');
        for(var s=0;s<_b.length;s++){$(_b[s]).remove();}
        //-------------------------------------------------
        var self = this;
        var _slide =_slide;
        var input = $('<a href="javascript:void(0)" unselectable="none"  type="button" value="编辑"  id="inline-btn" class="btn_common_edit"  style="position: absolute;"></a>');
        $('#stageArea').append(input);
        var _that = this;

        function getAbsoluteCoords(object) {
            var _off = _slide._canvas.upperCanvasEl.getBoundingClientRect();
            var _soffw = (object.width*object.scaleX+object.left)*DEFAULT_STAGE.scale;
            var _soffh = (object.height+object.top)*DEFAULT_STAGE.scale;
            return {
                left: _off.left+_soffw,
//                left: object.left + _slide._canvas._offset.left,
                top: _off.top+_soffh,
                width: object.width * object.scaleX * Number(DEFAULT_STAGE.scale),
                height: object.height * DEFAULT_STAGE.scale,
                angle: object.angle
            };
        };
        function setCss() {
            var absCoords = getAbsoluteCoords(_that);
            var _l = (absCoords.left-32);
            var _t = (absCoords.top- 32-absCoords.height);
            if(_l<=10 || _l>window.outerWidth-100 || _t<=130)
            {
                input.css('display','none');
                return;
            }
            input.css('display','');
            input.css('left', (_l-219) + 'px');
            input.css('top',  (_t-129)+ 'px');
        };

        _that.on('moving', function () {
            setCss();
        });
        _that.on('scaling', function () {
            setCss();
        });
        $('#inline-btn').off();
        $('#inline-btn').on('click', function (e) {
            Global.isVariety = true;
            Global.isEditing = true;
            Global.CurrentSlide.c && Global.CurrentSlide.c._canvas.discardActiveObject();
            _that.showEditDialog(self.rinfo);
        });
        setCss();
        //显示属性操作按钮
        this.showPropertyButton && this.showPropertyButton();
    }
    fabric.Object.prototype.hideEditButton = function () {
        this.off('moving');
        var _b = $('#inline-btn');
        for(var s=0;s<_b.length;s++)
        {
            $(_b[s]).remove();
        }
        this.hidePropertyButton && this.hidePropertyButton();
//        commands.usePropertyCtrlArea(null);
//        $('#propertyArea').html('');
    }


    /**
     * 在编辑时，复杂的widget需要在DOM上渲染
     * @param opt
     * @param finishCallback
     */
    fabric.Object.prototype.getRenderDOM = function (opt) {
        if (!WdtType.isComplexWidget(this.type))
            return;
        else {
            throw this.type + " getRenderDOM should implement!";
        }
    };

    /**
     * 给image 对象添加一个修改图片的方法
     * @param src
     * @param onloadCallback
     */
    fabric.Image.prototype.setSrc = function (src, onloadCallback) {
        var self = this;
        var img = new Image();
        img.src = src+'?'+Math.random()*100;
        img.onload = function () {
            self.setElement(img);
            onloadCallback(img.width,img.height);
        };
    };

    /********************************************************************/
    /****
     /***
     * 时间轴
     * @type {*}
     */
    fabric.History = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.History,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.8;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.History.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.History(img, object));
        });
    };
    fabric.History.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 画廊
     * @type {*}
     */
    fabric.Gallery = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Gallery,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.9;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.Gallery.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Gallery(img, object));
        });
    };
    fabric.Gallery.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 中文评测卡片
     * @type {*}
     */
    fabric.CnEval = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.CnEval,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.lockScalingX = true;
                this.lockScalingY = true;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.CnEval.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.CnEval(img, object));
        });
    };

    fabric.CnEval.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 英文评测卡片
     * @type {*}
     */
    fabric.EnEval = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.EnEval,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.lockScalingX = true;
                this.lockScalingY = true;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.EnEval.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.EnEval(img, object));
        });
    };

    fabric.EnEval.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 情景对话卡片
     * @type {*}
     */
    fabric.Situdlg = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Situdlg,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.lockScalingX = true;
                this.lockScalingY = true;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.Situdlg.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Situdlg(img, object));
        });
    };

    fabric.Situdlg.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 文本
     * @type {*}
     */
    fabric.TextField = fabric.util.createClass(
        fabric.IText, {
            type: WdtType.Types.TextField,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);

            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );

    fabric.TextField.fromObject = function (object, callback) {
        return new fabric.TextField(object.text, fabric.util.object.clone(object));
    };

    /********************************************************************/
    /****
     /***
     * 路径
     * @type {*}
     */
    fabric.Graphica = fabric.util.createClass(
        fabric.PathGroup, {
            type: WdtType.Types.Graphica,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
            },
            toObject: function () {
//                return fabric.util.object.extend(this.callSuper('toObject'));
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['id'] =object.id;
                    return _o;
                })(this);
            }
        }

    );
    fabric.Graphica.fromObject = function (object, callback) {
        if (typeof object.paths === 'string') {
            fabric.loadSVGFromURL(object.paths, function (elements) {

                var pathUrl = object.paths;
                delete object.paths;

                var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);

                callback(pathGroup);
            });
        }
        else {
            fabric.util.enlivenObjects(object.paths, function(enlivenedObjects) {
                delete object.paths;
                callback && callback(new fabric.Graphica(enlivenedObjects, object));
            });
        }
    };
    fabric.Graphica.async = true;
    /********************************************************************/
    /****
     /***
     * 图片
     * @type {*}
     */
    fabric.Img = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Img,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );

    fabric.Img.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Img(img, object));
        });
    };
    fabric.Img.async = true;

    /********************************************************************/
    /****
     /***
     * 动态图
     * @type {*}
     */
    fabric.Gif = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Gif,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
//                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );

    fabric.Gif.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Gif(img, object));
        });
    };
    fabric.Gif.async = true;

    /********************************************************************/
    /****
     /***
     * 热区
     * @type {*}
     */
    fabric.Spot = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Spot,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.hasRotatingPoint =false;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );
    fabric.Spot.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Spot(img, object));
        });
    };
    fabric.Spot.async = true;

    /********************************************************************/
    /****
     /***
     * proc3rd
     * @type {*}
     */
    fabric.Proc3rd = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Proc3rd,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.set('label', options.label || '');
                this.set('file',options.file);
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    _o['label'] =object.label;
                    _o['file'] =object.file;
                    return _o;
                })(this);
            },

            _render: function(ctx) {
                this.callSuper('_render', ctx);

                ctx.font = '12px Microsoft Yahei';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                var str = this.label;
                if(str.length>10){
                    str = str.substr(0,10)+'...';
                }
                ctx.fillText(str, 0, this.height/2+24,200);
            }
        }

    );
    fabric.Proc3rd.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Proc3rd(img, object));
        });
    };
    fabric.Proc3rd.async = true;


    /**
     * 下载时在桌面显示图标
     * */
    fabric.Download = fabric.util.createClass(
        fabric.Image,{
            type : WdtType.Types.Download,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.lockUniScaling=true;
                this.hasRotatingPoint =false;
                this.set('label', options.label || '');
                this.set('process',options.process || 0);
                this.set('remotesrc',options.remotesrc || '');
                this.set('info',options.info || null);
            },
            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['label'] =object.label;
                    _o['process'] =object.process;
                    _o['remotesrc'] = object.remotesrc;
                    _o['info'] = object.info;
                    return _o;
                })(this);
            },
            _render: function(ctx) {
                this.callSuper('_render', ctx);
                if(Global.downloadProcessList && Global.downloadProcessList[this.id]){
                    this.process = Global.downloadProcessList[this.id];
                }
                if(this.process==100 && !this.added){
                    this.added = true;
                    EventBase.fireEvent('downloadToFile',{
                        _t:this,
                        _tar:this.info._tar,
                        _local:this.info._local
                    });
                }

                ctx.font = '16px Microsoft Yahei';
                ctx.fillStyle = '#333';

                ctx.fillText(this.label, -this.width/2, this.height/2+16 ,200);
                //ctx.rect();
                ctx.fillStyle = '#2679eb';
                ctx.strokeStyle = '#2679eb';
                ctx.strokeRect(-this.width/2,this.height/2+30,this.width,8);
                ctx.fillRect(-this.width/2,this.height/2+30,this.width/100.0*this.process,8);
            }
    });

    fabric.Download.fromObject = function (object, callback) {
        fabric.util.loadImage(object.remotesrc, function (img) {
            var _n = new fabric.Download(img, object);
            callback && callback(_n);
        });
    };
    fabric.Download.async = true;

    /**
    * 截取电子课本widget
    * **/
    fabric.Iflybook = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Iflybook,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.lockUniScaling=true;
                this.lockScalingX = true;
                this.lockScalingY = true;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );
    fabric.Iflybook.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Iflybook(img, object));
        });
    };
    fabric.Iflybook.async = true;


    /***
     * 视频
     * @type {*}
     */
    fabric.Video = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Video,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);

                this.lockRotation=true;
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 320/this.width;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );

    fabric.Video.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Video(img, object));
        });
    };
    fabric.Video.async = true;
    /***
     * 音频
     * @type {*}
     */
    fabric.Audio = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Audio,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.lockScalingY = true;
                this.hasRotatingPoint =false;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );

    fabric.Audio.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Audio(img, object));
        });
    };
    fabric.Audio.async = true;
    /********************************************************************/
    /****
     /***
     * 表格
     * @type {*}
     */
    fabric.Table = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Table,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);

            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.Table.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Table(img, object));
        });
    };
    fabric.Table.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 气泡
     * @type {*}
     */
    fabric.Bubble = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Bubble,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockRotation=true;
                this.hasRotatingPoint =false;
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.Bubble.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Bubble(img, object));
        });
    };

    fabric.Bubble.async = true;

    /********************************************************************/

    /********************************************************************/
    /****
     /***
     * 数学图像
     * @type {*}
     */
    fabric.MathGraph = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.MathGraph,
            initialize: function (element, options) {
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.callSuper('initialize', element, options);
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.MathGraph.fromObject = function (object, callback) {
        object.src=object.src+'?'+Math.random()*100;
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.MathGraph(img, object));
        });
    };

    fabric.MathGraph.async = true;

    /********************************************************************/
    /****
     /***
     * 数学公式
     * @type {*}
     */
    fabric.MathEquation = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.MathEquation,
            initialize: function (element, options) {
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.callSuper('initialize', element, options);
            },

            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }

    );
    fabric.MathEquation.fromObject = function (object, callback) {
        object.src=object.src+'?'+Math.random()*100;
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.MathEquation(img, object));
        });
    };

    fabric.MathEquation.async = true;

    /********************************************************************/
    /****
     /***
     * 翻翻卡
     * @type {*}
     */
    fabric.Flipcard = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Flipcard,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.8;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this)
            }
        }

    );
    fabric.Flipcard.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Flipcard(img, object));
        });
    };

    fabric.Flipcard.async = true;

    /**
     * 测验
     */
     fabric.Exercise= fabric.util.createClass(
     fabric.Image, {
            type: WdtType.Types.Exercise,
             initialize: function (element, options) {
                 this.callSuper('initialize', element, options);
                 this.lockUniScaling=true;
                 this.lockRotation=true;
                 this.hasRotatingPoint =false;
                 this.minScaleLimit = 0.9;
             },

             toObject: function () {
                 return (function(object){
                     var _o = fabric.util.object.extend(object.callSuper('toObject'));
                     _o['rinfo'] =object.rinfo;
                     return _o;
                 })(this);
             },
             _render: function (ctx) {
                 this.callSuper('_render', ctx);
                 ctx.strokeStyle = '#eee';
                 ctx.strokeWidth = '10';
                 ctx.rect(this.left, this.top, this.width, this.height);
             }
        }

     );
     fabric.Exercise.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Exercise(img, object));
        });
    };
    fabric.Exercise.async = true;

    /**
     * PPT
     */
    fabric.PPT = fabric.util.createClass(
        fabric.Image,
        {
            type: WdtType.Types.PPT,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.8;
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            }
        }
    );

    fabric.PPT.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.PPT(img, object));
        });
    };

    fabric.PPT.async = true;

    /**
     *分类题
     * @type {*}
     */
    fabric.Pickcard = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Pickcard,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.7;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );
    fabric.Pickcard.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Pickcard(img, object));
        });
    };

    fabric.Pickcard.async = true;


    /**
     * 连线题
     * @type {*}
     */
    fabric.Matchcard = fabric.util.createClass(
        fabric.Image, {
            type: WdtType.Types.Matchcard,
            initialize: function (element, options) {
                this.callSuper('initialize', element, options);
                this.lockUniScaling=true;
                this.lockRotation=true;
                this.hasRotatingPoint =false;
                this.minScaleLimit = 0.8;
            },

            toObject: function () {
                return (function(object){
                    var _o = fabric.util.object.extend(object.callSuper('toObject'));
                    _o['rinfo'] =object.rinfo;
                    return _o;
                })(this);
            }
        }

    );
    fabric.Matchcard.fromObject = function (object, callback) {
        fabric.util.loadImage(object.src, function (img) {
            callback && callback(new fabric.Matchcard(img, object));
        });
    };

    fabric.Matchcard.async = true;

})