/**
 * created by lixiang in 2017/12/21
 * 提供一些中间数据处理的接口 Inject
 */
ideServices.service('MiddleWareService', ['AnimationService', 'Type', function (AnimationService, Type) {
    var IDEVersion = window.ideVersion;

    /**
     * 单例模式，构建Inject对象
     * @type {Object}
     */
    var Inject = Object.create({
        num: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.paddingRatio === undefined) {
                var width, height;

                info.paddingRatio = 0.1;
                info.spacing = Math.ceil(-info.fontSize / 3);
                info.maxFontWidth = info.fontSize;
                info.paddingX = Math.ceil(info.fontSize * info.paddingRatio);

                width = info.symbolMode == '0' ? (info.numOfDigits * (info.fontSize + info.spacing) - info.spacing) : ((info.numOfDigits + 1) * (info.fontSize + info.spacing) - info.spacing);
                width += info.paddingX * 2;
                if (info.decimalCount != 0) {
                    width += 0.5 * info.fontSize + this.spacing;
                }
                height = Math.ceil(info.fontSize * 1.2);

                info.width = width;
                info.height = height;
            }
            if (level.transition === undefined) {
                level.transition = AnimationService.getDefaultTransition();
            }
            if (info.enableAnimation === undefined) {
                info.enableAnimation = false;
            }
        },
        texNum: function () {
            var level = arguments[0];
            var info = level.info;
            if (level.transition === undefined) {
                level.transition = AnimationService.getDefaultTransition();
            }
        },
        dateTime: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.paddingRatio === undefined) {
                var widthBeforePadding, width, height;

                info.paddingRatio = 0.1;
                info.spacing = info.spacing = Math.ceil(-info.fontSize / 3);

                if (info.dateTimeModeId == '0') {
                    widthBeforePadding = 8 * info.fontSize + 7 * info.spacing;
                } else if (info.dateTimeModeId == '1') {
                    widthBeforePadding = 5 * info.fontSize + 4 * info.spacing;
                } else {
                    widthBeforePadding = 10 * info.fontSize + 9 * info.spacing;
                }

                width = widthBeforePadding + 2 * info.paddingRatio * info.fontSize;
                height = info.fontSize * (1 + 2 * info.paddingRatio);
                info.width = width;
                info.height = height;
            }
            if (info.disableHighlight == undefined) {
                info.disableHighlight = false;
            }
        },
        texTime: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.disableHighlight == undefined) {
                info.disableHighlight = false;
            }
        },
        progress: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.thresholdModeId === undefined) {
                info.thresholdModeId = '1';
                info.threshold1 = null;
                info.threshold2 = null;
            }
            if (info.enableAnimation === undefined) {
                info.enableAnimation = false;
            }
            if (level.transition === undefined) {
                level.transition = AnimationService.getDefaultTransition();
            }
        },
        dashboard: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.minCoverAngle === undefined) {
                info.minCoverAngle = 0;
                info.maxCoverAngle = 0;
            }
            if (info.enableAnimation === undefined) {
                info.enableAnimation = false;
            }
            if (level.transition === undefined) {
                level.transition = AnimationService.getDefaultTransition();
            }
            if (level.backgroundModeId === undefined) {
                level.backgroundModeId = '0';
            }
        },
        button: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.disableHighlight === undefined) {
                info.disableHighlight = false;
            }
        },
        buttonGroup: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.disableHighlight === undefined) {
                info.disableHighlight = false;
            }
        },
        slide: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.fontFamily === undefined) {
                info.fontFamily = "宋体";
                info.fontSize = 20;
                info.fontColor = 'rgba(0,0,0,1)';
                info.fontBold = "100";
                info.fontItalic = '';
            }
        },
        mySwitch: function () {
            var level = arguments[0];
            var info = level.info;
            if (info.text === undefined) {
                info.text = '';
                info.fontFamily = "宋体";
                info.fontSize = 20;
                info.fontColor = 'rgba(0,0,0,1)';
                info.fontBold = "100";
                info.fontItalic = '';
            }
        }
    });

    Object.assign(Inject, {
        page: function (page) {
            if (page.transition === undefined) {
                page.transition = AnimationService.getDefaultTransition()
            }
        },
        layer: function (layer) {
            if (layer.transition === undefined) {
                layer.transition = AnimationService.getDefaultTransition()
            }
            if (layer.animations) {
                layer.animations.map(function (animation) {
                    var translate = animation.animationAttrs && animation.animationAttrs.translate;
                    var scale = animation.animationAttrs && animation.animationAttrs.scale;
                    var temp, key;
                    if (translate && translate.dstPos ) {
                        for (key in translate) {
                            temp = translate[key].x;
                            translate[key].x = temp || 0
                            temp = translate[key].y;
                            translate[key].y = temp || 0
                        }
                        for (key in scale) {
                            temp = scale[key].x;
                            scale[key].x = temp||1
                            temp = scale[key].y;
                            scale[key].y = temp||1
                        }
                    }
                    if (animation.timingFun === undefined) {
                        animation.timingFun = '';
                    }
                })

            }
        },
        subLayer: function (subLayer, opts) {
            var opts = opts || {};
            if (!subLayer.info) {
                Object.assign(subLayer, {
                    info: {
                        width: opts.width || 400,
                        height: opts.height || 240,
                        scrollVEnabled: false,
                        scrollHEnabled: false
                    }
                });
            }
        },
        widget: function (widget) {
            switch (widget.type) {
                case Type.MyNum:
                    this.num(widget);
                    break;
                case Type.MyDateTime:
                    this.dateTime(widget);
                    break;
                case Type.MyTexNum:
                    this.texNum(widget);
                    break;
                case Type.MyTexTime:
                    this.texTime(widget);
                    break;
                case Type.MyProgress:
                    this.progress(widget);
                    break;
                case Type.MyDashboard:
                    this.dashboard(widget);
                    break;
                case Type.MyButton:
                    this.button(widget);
                    break;
                case Type.MyButtonGroup:
                    this.buttonGroup(widget);
                    break;
                case Type.MySlide:
                    this.slide(widget);
                    break;
                case Type.MySwitch:
                    this.mySwitch(widget);
                    break;
                default:
                    // console.log('not match widget type in inject data');
                    break;
            }
        }
    });

    /**
     * 为旧工程注入数据。
     */
    function injectDataToContent() {
        var project, pages, layers, subLayers, widgets;
        var tags, timers, tagClasses;

        project = arguments[0];

        pages = project.pages || [];
        pages.forEach(function (page) {
            Inject.page(page);

            layers = page.layers || [];
            layers.forEach(function (layer) {
                Inject.layer(layer);

                subLayers = layer.subLayers || [];
                subLayers.forEach(function (subLayer) {
                    Inject.subLayer(subLayer, layer.info || {});

                    widgets = subLayer.widgets || [];
                    widgets.forEach(function (widget) {
                        Inject.widget(widget);
                    })
                });

                layers.showSubLayer = subLayers[0];
            })
        });

        //过滤变量和定时器
        tags = project.customTags;
        var pattern = /SysTmr_\d+_t/;
        var tagList = [];
        var timerList = [];
        tags.forEach(function (tag) {
            if (tag.valueType === undefined) {
                tag.valueType = 0;
            }
            if(pattern.test(tag.name)){
                timerList.push(tag)
            }else{
                tagList.push(tag)
            }
        });
        project.customTags = tagList;

        //定时器去重排序
        timers = project.timerTags;
        if(timerList.length){
            timers = timers.concat(timerList);
        }
        var tmr = [],tmrTest={};
        timers.forEach(function (timer) {
            if (timer.valueType === undefined) {
                timer.valueType = 0;
            }
            if (pattern.test(timer.name)) {
                if(!tmrTest[timer.name]){
                    var index = timer.name.split('_')[1];
                    tmr[index] = timer;
                    tmrTest[timer.name]=true;
                }
            }
        });
        project.timerTags = tmr;



        tagClasses = project.tagClasses;
        if (!tagClasses) {
            tagClasses = [{
                name: '全部',
                type: 'system',
                tagArray: []
            }]
        }
        if (tagClasses[0].name == '全部' || tagClasses[0].name == 'tags') {
            tagClasses[0].name = '变量';
        }
    }

    //检查工程版本是否过时
    function checkProjectVerIsOld(project) {
        var proVerNum = parseInt((project.version || '1.0.0').replace(/\./g, ''));
        var nowVerNum = parseInt((IDEVersion || '').replace(/\./g, ''));

        return proVerNum < nowVerNum || true;

    }


    //数据中间件对外接口
    this.useMiddleWare = function (data) {
        if (checkProjectVerIsOld(data)) {
            injectDataToContent(data);
        }
    };


}]);