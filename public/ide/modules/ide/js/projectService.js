/**
 * Created by shenaolin on 16/2/26.
 */

    var projectRecord=[];
var ideServices = angular.module('IDEServices', ['ngFileUpload']);
ideServices
//IDE界面共享整个项目资源
    .service('ProjectService', function ($rootScope,$timeout,
                                         CanvasService,
                                         GlobalService,
                                         Preference,
                                         TemplateProvider,
                                         ViewService,
                                         Type,
                                         ResourceService) {


        var _self=this;

        fabric.Object.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id
                });
            }
        })(fabric.Object.prototype.toObject);

        /**
         * 设置选中
         * @param obj
         * @param option    只有对Group设置坐标
         */
        fabric.Canvas.prototype.setActive = function (obj) {
            var self = this;
            if (!obj) {
                console.warn('找不到对象');
                return;
            }

            if (obj.type == Type.MyLayer || Type.isWidget(obj.type)) {

                var fabObject=obj;

                self.setActiveObject(fabObject);
                fabObject.setCoords();

            } else if (obj.type == Type.MyLayerGroup || obj.type == Type.MyWidgetGroup) {

                var fabGroup=obj;

                self.deactivateAllWithDispatch();
                fabGroup.addWithUpdate();
                self.setActiveGroup(fabGroup);

                fabGroup.saveCoords();


                self.renderAll();
                var activeGroup = self.getActiveGroup();
                if (activeGroup) {
                    activeGroup.setObjectsCoords().setCoords();
                    activeGroup.isMoving = false;
                    self.setCursor(self.defaultCursor);
                }

                // clear selection and current transformation
                self._groupSelector = null;
                self._currentTransform = null;
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
            img.src = src + '?' + Math.random() * 100;
            img.onload = function () {
                self.setElement(img);
                onloadCallback(img.width, img.height);
            };
        };


        fabric.MyLayer = fabric.util.createClass(fabric.Object, {
            type: Type.MyLayer,

            initialize: function (layerId, options) {

                var self=this;

                //开始移动时Layer的Scale
                if (!this.initScale){
                    this.initScale={
                        X:1,
                        Y:1
                    }
                }

                this.callSuper('initialize', options);
                this.loadAll(layerId);
                this.lockRotation=true;
                this.hasRotatingPoint=false;


                //开始移动时Layer的Scale
                this.on('OnRelease', function () {
                    var currentLayer=_self.getLevelById(self.id);
                    var layerNode=null;
                    layerNode=getFabricObject(self.id);

                    self.initPosition.left = _.cloneDeep(self.getLeft());
                    self.initPosition.top = _.cloneDeep(self.getTop());
                    self.initScale.X=layerNode.getScaleX().toFixed(2);
                    self.initScale.Y=layerNode.getScaleY().toFixed(2);


                });

                this.on('OnScaleRelease', function (objId) {
                    if (objId==self.id){
                        this.renderUrlInPage(self);
                    }
                });
                this.on('OnRenderUrl', function (cb) {
                    this.renderUrlInPage(self, cb);
                });
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle =this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height );

                    var currentLayer=getCurrentLayer();

                    if (currentLayer&&scalingOperate.scaling&&scalingOperate.objId==this.id){
                        this.widgetImgs=[];
                        var layerNode=getFabricObject(currentLayer.id);

                        var angle=layerNode.getAngle()*Math.PI/180;
                        var sin=Math.sin(angle);
                        var cos=Math.cos(angle);
                        var deltaLeft=this.initPosition.left-this.getLeft();
                        var deltaTop=this.initPosition.top-this.getTop();

                        this.backgroundImg.width=this.width/layerNode.getScaleX()*this.initScale.X;
                        this.backgroundImg.height=this.height/layerNode.getScaleY()*this.initScale.Y;

                        this.backgroundImg.top=(-sin*deltaLeft+cos*deltaTop)/layerNode.getScaleY()-this.height/2;
                        this.backgroundImg.left=(cos*deltaLeft+sin*deltaTop)/layerNode.getScaleX()-this.width/2;

                    }

                    if(this.backgroundImg.element){
                        ctx.drawImage(this.backgroundImg.element,
                            this.backgroundImg.left,
                            this.backgroundImg.top,

                            this.backgroundImg.width,
                            this.backgroundImg.height);
                    }
                }
                catch (err) {
                    console.log('错误描述',err);
                    toastr.warning('渲染Layer出错');
                }

            }
        });
        fabric.MyLayer.prototype.loadAll= function (layerId) {
            var backgroundImg = new Image();
            var layerNode=getFabricObject(layerId);

            var layer=getLevelById(layerId);


            var layerWidth=layer.info.width/this.initScale.X;
            var layerHeight=layer.info.height/this.initScale.Y;



            this.initPosition={};


            if (layer.showSubLayer.url==''){
                backgroundImg = null;
            }else{
                backgroundImg.src = _.cloneDeep(layer.showSubLayer.url);
                backgroundImg.onload = (function () {
                    this.width = layerWidth;
                    this.height = layerHeight;
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }).bind(this);
            }

            this.backgroundImg={
                element:backgroundImg,
                width:layerWidth,
                height:layerHeight,
                left:-layerWidth / 2,
                top:-layerHeight/2
            };

            this.backgroundColor=layer.showSubLayer.backgroundColor;
            this.initPosition.left = _.cloneDeep(this.getLeft());
            this.initPosition.top = _.cloneDeep(this.getTop());

        };
        fabric.MyLayer.prototype.renderUrlInPage = function (self, cb) {


            var currentLayer=getLevelById(self.id);
            var backgroundImg = new Image();


            backgroundImg.onload = function () {
                self.backgroundImg.element = backgroundImg;

                self.backgroundImg.width = self.width;
                self.backgroundImg.height = self.height;
                self.backgroundImg.left = -self.width / 2;
                self.backgroundImg.top = -self.height / 2;


                self.initPosition.left = _.cloneDeep(self.getLeft());
                self.initPosition.top = _.cloneDeep(self.getTop());
                var pageNode = CanvasService.getPageNode();
                pageNode.renderAll();
                cb && cb();
            }.bind(self);

            backgroundImg.onerror = function (err) {
                backgroundImg = null;
                cb && cb(err);
            }.bind(self);

            // while(!renderFlag){
            //
            // }
            backgroundImg.src = currentLayer.showSubLayer.url;


        };
        fabric.MyLayer.prototype.toObject = (function (toObject) {
            return function () {


                return fabric.util.object.extend(toObject.call(this), {
                    //id: this.id,
                    loaded: this.loaded,
                    backgroundImg:this.backgroundImg,
                    widgetImgs:this.widgetImgs,
                    initPosition:this.initPosition,
                    initScale:this.initScale,
                    //backgroundColor:this.backgroundColor
                });
            }
        })(fabric.MyLayer.prototype.toObject);
        fabric.MyLayer.fromObject = function (object, callback) {
            callback && callback(new fabric.MyLayer(object.id,object));
        };
        fabric.MyLayer.async = true;

        fabric.MyProgress = fabric.util.createClass(fabric.Object, {
            type: Type.MyProgress,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.progressValue=level.info.progressValue/(level.info.maxValue-level.info.minValue);
                this.progressModeId=level.info.progressModeId;
                this.cursor=level.info.cursor;
                if(this.progressModeId=='1'){
                    this.initColor=level.texList[1].slices[0].color;
                    this.endColor=level.texList[2].slices[0].color;
                }
                if(this.progressModeId=='0'&&this.cursor=='1'){
                    this.cursorColor=level.texList[2].slices[0].color;
                    // if(level.texList[2].slices[0].imgSrc&&level.texList[2].slices[0].imgSrc!=''){
                    //     this.cursorImageElement=new Image();
                    //     this.cursorImageElement.src=level.texList[2].slices[0].imgSrc;
                    //     this.cursorImageElement.onload=function(){
                    //
                    //     }.bind(this);
                    // }else{
                    //     this.cursorImageElement=null;
                    // }

                    this.cursorImageElement = ResourceService.getResourceFromCache(level.texList[2].slices[0].imgSrc);

                }
                if(this.progressModeId=='1'&&this.cursor=='1'){
                    this.cursorColor=level.texList[3].slices[0].color;
                    // if(level.texList[3].slices[0].imgSrc&&level.texList[3].slices[0].imgSrc!=''){
                    //     this.cursorImageElement=new Image();
                    //     this.cursorImageElement.src=level.texList[3].slices[0].imgSrc;
                    //     this.cursorImageElement.onload=function(){
                    //
                    //     }.bind(this);
                    // }else{
                    //     this.cursorImageElement=null;
                    // }
                    this.cursorImageElement = ResourceService.getResourceFromCache(level.texList[3].slices[0].imgSrc);
                }

                this.backgroundColor=level.texList[0].slices[0].color;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.backgroundImageElement=new Image();
                //     this.backgroundImageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.backgroundImageElement.onload = function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }.bind(this);
                // }else {
                //     this.backgroundImageElement=null;
                // }
                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.progressColor=level.texList[1].slices[0].color;
                // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                //
                //     this.progressImageElement=new Image();
                //     this.progressImageElement.src=level.texList[1].slices[0].imgSrc;
                //     this.progressImageElement.onload = function () {
                //
                //     }.bind(this);
                // }else {
                //     this.progressImageElement=null;
                // }

                this.progressImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                this.arrange=level.info.arrange;



                this.on('changeProgressValue', function (arg) {
                    self.progressValue=arg.progress;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;
                    //console.log(level.texList);
                    if(level.texList[0]&&level.texList[0].name=='进度条底纹'){
                        self.backgroundColor=level.texList[0].slices[0].color;
                        self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    }

                    if(level.texList[1]&&level.texList[1].name=='进度条'){
                        self.progressColor=level.texList[1].slices[0].color;
                        self.progressImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                    }else if(level.texList[1]&&level.texList[1].name=='初始颜色'){
                        self.initColor=level.texList[1].slices[0].color;
                    }

                    if(level.texList[2]&&level.texList[2]&&level.texList[2].name=='光标纹理'){
                        self.cursorColor=level.texList[2].slices[0].color;
                        self.cursorImageElement = ResourceService.getResourceFromCache(level.texList[2].slices[0].imgSrc);
                    }else if(level.texList[2]&&level.texList[2].name=='结束颜色'){
                        self.endColor=level.texList[2].slices[0].color;
                    }

                    if(level.texList[3]&&level.texList[3]&&level.texList[3].name=='光标纹理'){
                        self.cursorColor=level.texList[3].slices[0].color;
                        // if(level.texList[3].slices[0].imgSrc&&level.texList[3].slices[0].imgSrc!=''){
                        //     self.cursorImageElement=new Image();
                        //     self.cursorImageElement.src=level.texList[3].slices[0].imgSrc;
                        //     self.cursorImageElement.onload=function(){
                        //
                        //     }.bind(this);
                        // }else{
                        //     self.cursorImageElement=null;
                        // }
                        self.cursorImageElement = ResourceService.getResourceFromCache(level.texList[3].slices[0].imgSrc);
                    }

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();

                });

                this.on('changeArrange', function (arg) {
                    self.arrange=arg.arrange;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                this.on('changeAttributeCursor',function(arg){
                    self.backgroundColor=arg.backgroundColor;
                    self.progressColor=arg.progressColor;
                    self.progressModeId=arg.progressModeId;

                    if(arg.hasOwnProperty('initColor')){
                        self.initColor=arg.initColor;
                    }
                    if(arg.hasOwnProperty('endColor')){
                        self.endColor=arg.endColor;
                    }

                    if(level.texList[0]&&level.texList[0].name=='进度条底纹'){
                        self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    }else{
                        self.backgroundImageElement=null;
                    }

                    if(level.texList[1]&&level.texList[1].name=='进度条'){
                        self.progressImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                    }else{
                        self.progressImageElement=null
                    }

                    if(level.texList[3]&&level.texList[3]&&level.texList[3].name=='光标纹理'){
                        self.cursorImageElement = ResourceService.getResourceFromCache(level.texList[3].slices[0].imgSrc);
                    }else{
                        self.cursorImageElement=null;
                    }

                    var subLayerNode = CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    if(this.progressModeId=='0'){
                        //普通进度条
                        ctx.fillStyle=this.backgroundColor;
                        ctx.fillRect(
                            -this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height
                        );
                        if (this.backgroundImageElement){
                            ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                        }

                        if (this.arrange=='horizontal'){
                            ctx.fillStyle=this.progressColor;
                            ctx.fillRect(
                                -this.width / 2,
                                -this.height / 2,
                                this.width*this.progressValue,
                                this.height
                            );
                            if (this.progressImageElement){
                                ctx.drawImage(this.progressImageElement, -this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);

                            }
                            if(this.cursorImageElement){
                                ctx.drawImage(this.cursorImageElement,-this.width/2+(this.width*this.progressValue),-this.cursorImageElement.height/2/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                            }

                        }else {
                            ctx.fillStyle=this.progressColor;
                            ctx.fillRect(
                                -this.width / 2,
                                this.height / 2-this.height*this.progressValue,
                                this.width,
                                this.height*this.progressValue
                            );
                            if (this.progressImageElement){
                                ctx.drawImage(this.progressImageElement, -this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);
                            }
                            if(this.cursorImageElement){
                                ctx.drawImage(this.cursorImageElement,-this.cursorImageElement.width/2/this.scaleX,this.height/2-this.height*this.progressValue-this.cursorImageElement.height/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                            }
                        }
                    }else if(this.progressModeId=='1'){
                        //变色进度条
                        var progressColor = changeColor(this.initColor,this.endColor,this.progressValue);

                        //console.log(progressColor);
                        if(this.arrange=='horizontal'){
                            if(this.cursorImageElement){
                                ctx.drawImage(this.cursorImageElement,-this.width/2+(this.width*this.progressValue),-this.cursorImageElement.height/2/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                            }
                            ctx.fillStyle=progressColor;
                            ctx.fillRect(-this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);
                        }else{
                            ctx.fillStyle=progressColor;
                            ctx.fillRect(-this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);
                            if(this.cursorImageElement){
                                ctx.drawImage(this.cursorImageElement,-this.cursorImageElement.width/2/this.scaleX,this.height/2-this.height*this.progressValue-this.cursorImageElement.height/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                            }
                        }
                        if(this.backgroundImageElement){
                            ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                        }
                    }else if(this.progressModeId=='2'){
                        //脚本进度条，啥也不画！
                    }

                    //将图片超出canvas的部分裁剪
                    this.clipTo=function(ctx){
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };
                }
                catch(err){
                    console.log('错误描述',err)
                    toastr.warning('渲染进度条出错');
                }

            }
        });
        fabric.MyProgress.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyProgress(level, option));
        };
        fabric.MyProgress.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement:this.backgroundImageElement,
                    progressImageElement:this.progressImageElement,

                    backgroundColor:this.backgroundColor,
                    progressColor:this.progressColor,

                    progressValue:this.progressValue,
                    arrange:this.arrange
                });
            }
        })(fabric.MyProgress.prototype.toObject);
        fabric.MyProgress.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyProgress(level, object));
        };
        fabric.MyProgress.async = true;


        //**oscilloscope**//
        fabric.MyOscilloscope = fabric.util.createClass(fabric.Object, {
            type: Type.MyOscilloscope,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.maxValue=level.info.maxValue;
                this.minValue=level.info.minValue;
                this.spacing=level.info.spacing;
                this.grid=level.info.grid;
                this.lineWidth=level.info.lineWidth;
                this.gridUnitX=level.info.gridUnitX;
                this.gridUnitY=level.info.gridUnitY;
                this.gridInitValue=level.info.gridInitValue;
                this.blankX=level.info.blankX;
                this.blankY=level.info.blankY;
                this.setScaleY((((this.maxValue-this.minValue)/this.gridUnitY+1/2)*this.spacing+this.blankY)/this.height);

                this.backgroundColor=level.texList[0].slices[0].color;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.backgroundImageElement=new Image();
                //     this.backgroundImageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.backgroundImageElement.onload = function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }.bind(this);
                // }else {
                //     this.backgroundImageElement=null;
                // }

                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }


                this.oscilloscopeColor=level.texList[1].slices[0].color;
                // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                //
                //     this.oscilloscopeImageElement=new Image();
                //     this.oscilloscopeImageElement.src=level.texList[1].slices[0].imgSrc;
                //     this.oscilloscopeImageElement.onload = function () {
                //     }.bind(this);
                // }else {
                //     this.oscilloscopeImageElement=null;
                // }

                this.oscilloscopeImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;
                    self.backgroundColor=level.texList[0].slices[0].color;
                    // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                    //     self.backgroundImageElement=new Image();
                    //     self.backgroundImageElement.src=level.texList[0].slices[0].imgSrc;
                    //     self.backgroundImageElement.onload = function () {
                    //
                    //     }.bind(this);
                    // }else {
                    //     self.backgroundImageElement=null;
                    // }

                    this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);



                    self.oscilloscopeColor=level.texList[1].slices[0].color;
                    // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                    //
                    //     self.oscilloscopeImageElement=new Image();
                    //     self.oscilloscopeImageElement.src=level.texList[1].slices[0].imgSrc;
                    //     self.oscilloscopeImageElement.onload = function () {
                    //
                    //     }.bind(this);
                    // }else {
                    //     self.oscilloscopeImageElement=null;
                    // }

                    this.oscilloscopeImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();

                });
                this.on('ChangeAttributeOscilloscope',function(arg){
                    var selectObj=_self.getCurrentSelectObject();
                    var _callback=arg.callback;
                    if(arg.hasOwnProperty('lineColor')){

                    }
                    if(arg.hasOwnProperty('spacing')){
                        self.spacing=arg.spacing;
                        self.setScaleY((((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY)/self.height);
                        selectObj.level.info.height=(((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY);
                    }
                    if(arg.hasOwnProperty('grid')){
                        self.grid=arg.grid;
                    }
                    if(arg.hasOwnProperty('lineWidth')){
                        self.lineWidth=arg.lineWidth;
                    }
                    if(arg.hasOwnProperty('gridInitValue')){
                        self.gridInitValue=arg.gridInitValue;
                    }
                    if(arg.hasOwnProperty('gridUnitX')){
                        self.gridUnitX=arg.gridUnitX;
                    }
                    if(arg.hasOwnProperty('gridUnitY')){
                        self.gridUnitY=arg.gridUnitY;
                        self.setScaleY((((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY)/self.height);
                        selectObj.level.info.height=(((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY);
                    }
                    if(arg.hasOwnProperty('maxValue')){
                        self.maxValue=arg.maxValue;
                        self.setScaleY((((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY)/self.height);
                        selectObj.level.info.height=(((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY);
                    }
                    if(arg.hasOwnProperty('minValue')){
                        self.minValue=arg.minValue;
                        self.setScaleY((((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY)/self.height);
                        selectObj.level.info.height=(((self.maxValue-self.minValue)/self.gridUnitY+1/2)*self.spacing+self.blankY);
                    }
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    if (this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }

                    if(this.oscilloscopeImageElement){
                        ctx.drawImage(this.oscilloscopeImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                    if(this.grid!='0'){
                        var style={
                            lineWidth:this.lineWidth,
                            grid:this.grid,
                            gridInitValue:this.gridInitValue,
                            gridUnitX:this.gridUnitX,
                            gridUnitY:this.gridUnitY,
                            scaleX:this.scaleX,
                            scaleY:this.scaleY,
                        };
                        drawGrid(-this.width/2,-this.height/2,this.width,this.height,this.blankX,this.blankY,this.spacing,this.spacing,style,ctx,this.minValue);
                    }

                    //将图片超出canvas的部分裁剪
                    this.clipTo=function(ctx){
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染示波器出错');
                }

            }
        });
        fabric.MyOscilloscope.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyOscilloscope(level, option));
        };
        fabric.MyOscilloscope.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement:this.backgroundImageElement,
                    oscilloscopeImageElement:this.oscilloscopeImageElement,

                    backgroundColor:this.backgroundColor,
                    oscilloscopeColor:this.oscilloscopeColor,

                });
            }
        })(fabric.MyOscilloscope.prototype.toObject);
        fabric.MyOscilloscope.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyOscilloscope(level, object));
        };
        fabric.MyOscilloscope.async = true;

        //**** Dashboard ****//
        fabric.MyDashboard = fabric.util.createClass(fabric.Object, {
            type: Type.MyDashboard,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.value=level.info.value;
                this.offsetValue=level.info.offsetValue;
                this.minValue=level.info.minValue;
                this.maxValue=level.info.maxValue;
                this.minAngle=level.info.minAngle;
                this.maxAngle=level.info.maxAngle;
                this.pointerLength = level.info.pointerLength;
                this.clockwise=level.info.clockwise;
                this.dashboardModeId=level.dashboardModeId;
          
                if(this.dashboardModeId=='0'||this.dashboardModeId=='1'){
                    this.backgroundColor=level.texList[0].slices[0].color;

                    this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    if (this.backgroundImageElement) {
                        this.loaded = true;
                        this.setCoords();
                        this.fire('image:loaded');
                    }

                    this.pointerColor=level.texList[1].slices[0].color;

                    this.pointerImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                    //初始化光带
                    if(level.texList[2]){
                        this.lightBandImageElement = ResourceService.getResourceFromCache(level.texList[2].slices[0].imgSrc);
                    }
                }else if(this.dashboardModeId=='2'){
                    this.backgroundColor=level.texList[0].slices[0].color;
                    this.backgroundImageElement=null;
                    this.pointerColor=null;
                    this.pointerImageElement=null;
                    this.lightBandImageElement=ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    if(this.lightBandImageElement){
                        this.loaded = true;
                        this.setCoords();
                        this.fire('image:loaded');
                    }
                }


                //this.on('mouseup',function(arg){
                //});
                this.on('changeDashboardOffsetValue', function (arg) {
                    if(arg.offsetValue||arg.offsetValue==0){
                        self.offsetValue=arg.offsetValue;
                    }
                    //console.log('changeDashboardValue',self.value);
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });


                this.on('changeDashboardValue', function (arg) {
                    if(arg.hasOwnProperty('value')){
                        self.value=arg.value;
                    }
                    if(arg.hasOwnProperty('maxValue')){
                        self.maxValue=arg.maxValue;
                    }
                    if(arg.hasOwnProperty('minValue')){
                        self.minValue=arg.minValue;
                    }
                    if(arg.hasOwnProperty('minAngle')){
                        self.minAngle=arg.minAngle;
                    }
                    if(arg.hasOwnProperty('maxAngle')){
                        self.maxAngle=arg.maxAngle;
                    }
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });


                //changeDashboardPointerLength

                this.on('changeDashboardPointerLength', function (arg) {
                    self.pointerLength=arg.pointerLength;
                    self.scaleX = arg.scaleX;
                    self.scaleY = arg.scaleY;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                //change dashboard mode
                this.on('changeDashboardMode',function(arg){
                    var level=arg.level;
                    var _callback=arg.callback;
                    self.dashboardModeId = arg. dashboardModeId;
                    //若改变模式，重置已经画好的仪表盘控件
                    if(self.dashboardModeId=='0'||self.dashboardModeId=='1'){
                        self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                        self.backgroundColor = level.texList[0].slices[0].color;

                        self.pointerImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                        self.pointerColor=level.texList[1].slices[0].color;

                        if(level.texList[2]){
                            self.lightBandImageElement = ResourceService.getResourceFromCache(level.texList[2].slices[0].imgSrc);
                        }else{
                            self.lightBandImageElement=null;
                        }
                    }else if(self.dashboardModeId=='2'){
                        self.backgroundImageElement=null;
                        self.backgroundColor=level.texList[0].slices[0].color;
                        self.pointerImageElement=null;
                        self.pointerColor=null;
                        self.lightBandImageElement=ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    }

                    var subLayerNode = CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
                //chang dashboard clockwise
                this.on('changeDashboardClockwise',function(arg){
                    self.clockwise=arg.clockwise;
                    var _callback=arg.callback;
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var dashboardModeId=level.dashboardModeId;
                    var _callback=arg.callback;
                    if(dashboardModeId=='0'||dashboardModeId=='1'){
                        self.backgroundColor=level.texList[0].slices[0].color;
                        self.pointerColor=level.texList[1].slices[0].color;

                        self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                        self.pointerImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                        //判断是否有第三个纹理，若有则为复杂模式，需要配置光带的纹理
                        if(level.texList[2]){
                            self.lightBandImageElement = ResourceService.getResourceFromCache(level.texList[2].slices[0].imgSrc);
                        }
                    }else if(dashboardModeId=='2'){
                        self.backgroundImageElement=null;
                        self.backgroundColor=level.texList[0].slices[0].color;
                        self.pointerImageElement=null;
                        self.pointerColor=null;
                        self.lightBandImageElement=ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    }


                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    var newValue = parseInt((this.maxAngle-this.minAngle)/(this.maxValue-this.minValue)*this.value);
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    if (this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }


                    if(this.lightBandImageElement){
                        //由于canvas进行了一定的比例变换，所以画扇形时，角度出现了偏差。下面纠正偏差
                        var angle=translateAngle(newValue+this.offsetValue+this.minAngle,this.scaleX,this.scaleY);
                        var minAngle=translateAngle(this.minAngle+this.offsetValue,this.scaleX,this.scaleY);
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(0,0);
                        var radius=calculateRadius(this.dashboardModeId,this.width,this.height);
                        //console.log('radius,width,height',radius,this.width,this.height);
                        //ctx.moveTo(0,0);
                        //如果是逆时针，则反方向旋转
                        if(this.clockwise=='0'){
                            minAngle=-minAngle+Math.PI/2;
                            angle=-angle+Math.PI/2;
                            ctx.arc(0,0,radius,minAngle,angle,true);
                            if(this.dashboardModeId=='2'){
                                ctx.arc(0,0,3*radius/4,angle,minAngle,false);
                            }
                        }
                        else if(this.clockwise=='1'){
                            minAngle=minAngle+Math.PI/2;
                            angle=angle+Math.PI/2;
                            ctx.arc(0,0,radius,minAngle,angle,false);
                            if(this.dashboardModeId=='2'){
                                ctx.arc(0,0,3*radius/4,angle,minAngle,true);
                            }
                            //ctx.stroke();
                        }
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(this.lightBandImageElement, -this.width / 2, -this.height / 2,this.width,this.height);

                        ctx.restore();
                    }
                    if (this.pointerImageElement){
                        ctx.save();
                        var sqrt2 = Math.sqrt(2);
                        var pointerImgWidth = this.pointerLength/sqrt2/this.scaleX;
                        var pointerImgHeight = this.pointerLength/sqrt2/this.scaleY;
                        var angleOfPointer = newValue+this.offsetValue+this.minAngle;
                        if(this.clockwise=='0'){
                            angleOfPointer=-angleOfPointer;
                        }
                        angleOfPointer=angleOfPointer+45;
                        //ctx.rotate((this.value+45+this.offsetValue)*Math.PI/180);
                        ctx.scale(1/this.scaleX,1/this.scaleY);
                        ctx.rotate(angleOfPointer*Math.PI/180);
                        ctx.scale(this.scaleX,this.scaleY);
                        ctx.fillStyle=this.pointerColor;
                        ctx.fillRect(
                            0,
                            0,
                            pointerImgWidth,
                            pointerImgHeight
                        );
                        ctx.drawImage(this.pointerImageElement, 0, 0,pointerImgWidth,pointerImgHeight);
                        ctx.restore();
                    }
                    //将图片超出canvas的部分裁剪
                    this.clipTo = function (ctx) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };

                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染仪表盘出错');
                }
            }
        });
        fabric.MyDashboard.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyDashboard(level, option));
        }
        fabric.MyDashboard.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement:this.backgroundImageElement,
                    pointerImageElement:this.pointerImageElement,

                    backgroundColor:this.backgroundColor,
                    pointerColor:this.pointerColor,

                    value:this.value

                });
            }
        })(fabric.MyDashboard.prototype.toObject);
        fabric.MyDashboard.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyDashboard(level, object));
        };
        fabric.MyDashboard.async = true;


        fabric.MyKnob = fabric.util.createClass(fabric.Object, {
            type: Type.MyKnob,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.value=level.info.value;
                this.knobSize = level.info.knobSize;


                this.backgroundColor=level.texList[0].slices[0].color;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.backgroundImageElement=new Image();
                //     this.backgroundImageElement.src= level.texList[0].slices[0].imgSrc;
                //     this.backgroundImageElement.onload = function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }.bind(this);
                // }else {
                //     this.backgroundImageElement=null;
                // }

                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.knobColor=level.texList[1].slices[0].color;
                // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                //
                //     this.knobImageElement=new Image();
                //     this.knobImageElement.src=level.texList[1].slices[0].imgSrc;
                //     this.knobImageElement.onload = function () {
                //
                //     }.bind(this);
                // }else {
                //     this.knobImageElement=null;
                // }

                this.knobImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);




                this.on('changeKnobValue', function (arg) {
                    self.value=arg.value;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });



                this.on('changeKnobSize', function (arg) {
                    self.knobSize=arg.knobSize;
                    self.scaleX = arg.scaleX;
                    self.scaleY = arg.scaleY;
                    //console.log('change pointer',self.pointerLength,level);
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });


                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;
                    self.backgroundColor=level.texList[0].slices[0].color;
                    // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                    //     self.backgroundImageElement=new Image();
                    //     self.backgroundImageElement.src= level.texList[0].slices[0].imgSrc;
                    //     self.backgroundImageElement.onload = function () {
                    //
                    //     }.bind(this);
                    // }else {
                    //     self.backgroundImageElement=null;
                    // }

                    self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                    self.knobColor=level.texList[1].slices[0].color;
                    // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                    //     self.knobImageElement=new Image();
                    //     self.knobImageElement.src=level.texList[1].slices[0].imgSrc;
                    //     self.knobImageElement.onload = function () {
                    //
                    //     }.bind(this);
                    // }else {
                    //     self.knobImageElement=null;
                    // }

                    self.knobImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                    _callback&&_callback();

                });


            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    if (this.backgroundImageElement){
                        //console.log('bg',this.width,this.height);
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);

                    }
                    if (this.knobImageElement){
                        //console.log('draw knob',this.knobImageElement)
                        var sqrt2 = Math.sqrt(2);
                        var knobImgWidth = this.knobSize/sqrt2/this.scaleX;
                        var knobImgHeight = this.knobSize/sqrt2/this.scaleY;
                        ctx.scale(1/this.scaleX,1/this.scaleY);
                        ctx.rotate((this.value)*Math.PI/180);
                        ctx.scale(this.scaleX,this.scaleY);
                        //console.log(pointerImgWidth,pointerImgHeight,this.width,this.height);
                        ctx.drawImage(this.knobImageElement, -knobImgWidth/2, -knobImgHeight/2,knobImgWidth,knobImgHeight);

                    }
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染旋钮出错');
                }
            }
        });
        fabric.MyKnob.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyKnob(level, option));
        }
        fabric.MyKnob.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement:this.backgroundImageElement,
                    knobImageElement:this.knobImageElement,

                    backgroundColor:this.backgroundColor,
                    knobColor:this.knobColor,

                    value:this.value

                });
            }
        })(fabric.MyKnob.prototype.toObject);
        fabric.MyKnob.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyKnob(level, object));
        };
        fabric.MyKnob.async = true;


        fabric.MySwitch = fabric.util.createClass(fabric.Object, {
            type: Type.MySwitch,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.backgroundColor=level.texList[0].slices[0].color;
                this.bindBit=level.info.bindBit;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.imageElement=new Image();
                //     this.imageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.imageElement.onload = function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }.bind(this);
                // }else {
                //     this.imageElement=null;
                // }

                this.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.imageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }


                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.backgroundColor=tex.slices[0].color;
                    // if (tex.slices[0].imgSrc!='') {
                    //     var currentImageElement=new Image();
                    //     currentImageElement.src=tex.slices[0].imgSrc;
                    //     currentImageElement.onload = (function () {
                    //     }).bind(this);
                    //     self.imageElement=currentImageElement;
                    // }else {
                    //     self.imageElement=null;
                    // }

                    self.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height);

                    if (this.imageElement){
                        ctx.drawImage(this.imageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染开关出错');
                }
            }
        });
        fabric.MySwitch.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MySwitch(level, option));
        };
        fabric.MySwitch.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    imageElement:this.imageElement,
                    backgroundColor:this.backgroundColor
                });
            }
        })(fabric.MySwitch.prototype.toObject);
        fabric.MySwitch.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MySwitch(level, object));
        };
        fabric.MySwitch.async = true;

        fabric.MyScriptTrigger = fabric.util.createClass(fabric.Object, {
            type: Type.MyScriptTrigger,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render:function(ctx){

            }
        });
        fabric.MyScriptTrigger.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyScriptTrigger(level, option));
        };
        fabric.MyScriptTrigger.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                });
            }
        })(fabric.MyScriptTrigger.prototype.toObject);
        fabric.MyScriptTrigger.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyScriptTrigger(level, object));
        };
        fabric.MyScriptTrigger.async = true;

        fabric.MyRotateImg = fabric.util.createClass(fabric.Object, {
            type: Type.MyRotateImg,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.backgroundColor=level.texList[0].slices[0].color;
                this.minValue=level.info.minValue;
                this.maxValue=level.info.maxValue;
                this.initValue=level.info.initValue;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.imageElement=new Image();
                //     this.imageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.imageElement.onload = (function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }).bind(this);
                // }else {
                //     this.imageElement=null;
                // }

                this.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.imageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.backgroundColor=tex.slices[0].color;
                    // if (tex.slices[0].imgSrc!='') {
                    //     var currentImageElement=new Image();
                    //     currentImageElement.src=tex.slices[0].imgSrc;
                    //     currentImageElement.onload = function () {
                    //     }.bind(this);
                    //     self.imageElement=currentImageElement;
                    // }else {
                    //     self.imageElement=null;
                    // }

                    self.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
                this.on('changeInitValue',function(arg){
                    var _callback=arg.callback;
                    self.initValue=arg.initValue;
                    self.setAngle(self.initValue);
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                })
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height);

                    if (this.imageElement){
                        ctx.drawImage(this.imageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染旋转图出错');
                }
            }
        });
        fabric.MyRotateImg.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyRotateImg(level, option));
        };
        fabric.MyRotateImg.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    imageElement:this.imageElement,
                    backgroundColor:this.backgroundColor
                });
            }
        })(fabric.MyRotateImg.prototype.toObject);
        fabric.MyRotateImg.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyRotateImg(level, object));
        };
        fabric.MyRotateImg.async = true;

        fabric.MySlideBlock = fabric.util.createClass(fabric.Object, {
            type: Type.MySlideBlock,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.minValue=level.info.minValue;
                this.maxValue=level.info.maxValue;
                this.initValue=level.info.initValue;
                this.arrange=level.info.arrange;

                this.backgroundColor=level.texList[0].slices[0].color;
                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.backgroundImageElement=new Image();
                //     this.backgroundImageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.backgroundImageElement.onload = (function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }).bind(this);
                // }else {
                //     this.backgroundImageElement=null;
                // }

                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.slideColor=level.texList[1].slices[0].color;
                // if (level.texList[1].slices[0].imgSrc&&level.texList[1].slices[0].imgSrc!=''){
                //     this.slideImageElement=new Image();
                //     this.slideImageElement.src=level.texList[1].slices[0].imgSrc;
                //     this.slideImageElement.onload = (function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }).bind(this);
                // }else {
                //     this.slideImageElement=null;
                // }

                this.slideImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                if (this.slideImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }
                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    if(level.texList&&level.texList[0]){
                        self.backgroundColor=level.texList[0].slices[0].color;

                        self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    }

                    if(level.texList&&level.texList[1]){
                        self.slideColor=level.texList[1].slices[0].color;
                        self.slideImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                    }

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
                this.on('changeInitValue',function(arg){
                    var _callback=arg.callback;
                    console.log('haha',arg);
                    if(arg.hasOwnProperty('minValue')){
                        self.minValue=arg.minValue;
                    }
                    if(arg.hasOwnProperty('maxValue')){
                        self.maxValue=arg.maxValue;
                    }
                    if(arg.hasOwnProperty('initValue')){
                        self.initValue=arg.initValue;
                    }
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
                this.on('changeArrange', function (arg) {
                    self.arrange=arg.arrange;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    var progress = (this.initValue-this.minValue)/(this.maxValue-this.minValue);
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height);

                    if (this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                    if(this.slideImageElement){
                        if(this.arrange=='horizontal'){
                            ctx.drawImage(this.slideImageElement,-this.width/2+((this.width-this.slideImageElement.width/this.scaleX)*progress),-this.slideImageElement.height/(2*this.scaleY),this.slideImageElement.width/this.scaleX,this.slideImageElement.height/this.scaleY);
                        }else{
                            ctx.drawImage(this.slideImageElement,-this.slideImageElement.width/(2*this.scaleX),this.height/2-this.slideImageElement.height/this.scaleY*(1-progress)-this.height*progress,this.slideImageElement.width/this.scaleX,this.slideImageElement.height/this.scaleY);
                        }
                    }

                    //将图片超出canvas的部分裁剪
                    this.clipTo=function(ctx){
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染滑块出错');
                }
            }
        });
        fabric.MySlideBlock.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MySlideBlock(level, option));
        };
        fabric.MySlideBlock.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {

                });
            }
        })(fabric.MySlideBlock.prototype.toObject);
        fabric.MySlideBlock.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MySlideBlock(level, object));
        };
        fabric.MySlideBlock.async = true;

        fabric.MyDateTime = fabric.util.createClass(fabric.Object, {
            type: Type.MyDateTime,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                var ctrlOptions={
                    bl:false,
                    br:false,
                    mb:false,
                    ml:false,
                    mr:false,
                    mt:false,
                    tl:false,
                    tr:false
                };
                this.setControlsVisibility(ctrlOptions);//使时间控件不能拉伸
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                //this.backgroundColor=level.texList[0].slices[0].color;
                this.dateTimeModeId=level.info.dateTimeModeId;
                this.fontFamily=level.info.fontFamily;
                this.fontSize=level.info.fontSize;
                this.fontColor=level.info.fontColor;
                this.align=level.info.align;
                this.initValue=level.info.initValue;

                //设置canvas的宽度和高度
                this.setHeight(this.fontSize*1.5);
                if(this.dateTimeModeId=='0'){
                    this.setWidth(4*this.fontSize);
                }else if(this.dateTimeModeId=='1'){
                    this.setWidth(3*this.fontSize);
                }else
                    this.setWidth(6*this.fontSize);
                
                this.on('changeDateTimeModeId',function(arg){
                    var dateTimeModeId=arg.dateTimeModeId;
                    var _callback=arg.callback;
                    self.dateTimeModeId=dateTimeModeId;
                    self.setHeight(self.fontSize*1.5);
                    if(self.dateTimeModeId=='0'){
                        self.setWidth(4*self.fontSize);
                    }else if(self.dateTimeModeId=='1'){
                        self.setWidth(3*self.fontSize);
                    }else
                        self.setWidth(6*self.fontSize);
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });
                this.on('changeDateTimeText',function(arg){
                    var _callback = arg.callback;
                    if(arg.hasOwnProperty('fontFamily')){
                        self.fontFamily = arg.fontFamily;
                    }
                    if(arg.hasOwnProperty('fontSize')){
                        self.fontSize=arg.fontSize;
                        self.setHeight(self.fontSize*1.5);
                        if(self.dateTimeModeId=='0'){
                            self.setWidth(4*self.fontSize);
                        }else if(self.dateTimeModeId=='1'){
                            self.setWidth(3*self.fontSize);
                        }else
                            self.setWidth(6*self.fontSize);
                    }
                    if(arg.hasOwnProperty('fontColor')){
                        self.fontColor=arg.fontColor;
                    }
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                })
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    var fontString = null;
                    //ctx.fillStyle=this.fontColor;
                    fontString=this.fontSize+'px'+" "+this.fontFamily;
                    drawDateTime(this.dateTimeModeId,ctx,this.scaleX,this.scaleY,fontString,this.align,this.fontColor);
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染时间日期出错');
                };
            }
        });
        fabric.MyDateTime.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyDateTime(level, option));
        };
        fabric.MyDateTime.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    imageElement:this.imageElement,
                    backgroundColor:this.backgroundColor
                });
            }
        })(fabric.MyDateTime.prototype.toObject);
        fabric.MyDateTime.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyDateTime(level, object));
        };
        fabric.MyDateTime.async = true;

        fabric.MyButton = fabric.util.createClass(fabric.Object, {
            type: Type.MyButton,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.normalColor=level.texList[0].slices[0].color;

                this.text=level.info.text;
                this.fontFamily=level.info.fontFamily;
                this.fontSize=level.info.fontSize;
                this.fontColor=level.info.fontColor;
                this.fontBold=level.info.fontBold;
                this.fontItalic=level.info.fontItalic;

                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.normalImageElement=new Image();
                //     this.normalImageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.normalImageElement.onload = (function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }).bind(this);
                //
                //
                // }else {
                //     this.normalImageElement=null;
                // }

                this.normalImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.normalImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.normalColor=tex.slices[0].color;
                    // if (tex.slices[0].imgSrc!='') {
                    //     var currentImageElement=new Image();
                    //     currentImageElement.src=tex.slices[0].imgSrc;
                    //     currentImageElement.onload = (function () {
                    //     }).bind(this);
                    //     self.normalImageElement=currentImageElement;
                    // }else {
                    //     self.normalImageElement=null;
                    // }

                    self.normalImageElement = ResourceService.getResourceFromCache(tex.slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                this.on('changeButtonText',function(arg){
                    if(arg.hasOwnProperty('text')){
                        self.text=arg.text;

                    }
                    if(arg.fontFamily){
                        self.fontFamily=arg.fontFamily;
                    }
                    if(arg.fontBold){
                        self.fontBold=arg.fontBold;
                    }
                    if(arg.hasOwnProperty('fontItalic')){
                        self.fontItalic=arg.fontItalic;
                    }
                    if(arg.fontSize){
                        self.fontSize=arg.fontSize;
                    }
                    if(arg.fontColor){
                        self.fontColor=arg.fontColor;
                    }
                    var _callback=arg.callback;
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.fontColor;
                    ctx.save();
                    ctx.fillStyle=this.normalColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height);

                    if (this.normalImageElement){
                        ctx.drawImage(this.normalImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                    ctx.restore();
                    if(this.text){
                        ctx.save();
                        var fontString=this.fontItalic+" "+this.fontBold+" "+this.fontSize+"px"+" "+this.fontFamily;
                        ctx.scale(1/this.scaleX,1/this.scaleY);
                        ctx.font=fontString;
                        ctx.textAlign='center';
                        ctx.textBaseline='middle';//使文本垂直居中
                        ctx.fillText(this.text,0,0);
                        ctx.restore();
                    }
                    //将图片超出canvas的部分裁剪
                    this.clipTo=function(ctx){
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染按钮出错');
                }
            }
        });
        fabric.MyButton.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyButton(level, option));
        };
        fabric.MyButton.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    normalImageElement:this.normalImageElement,
                    normalColor:this.normalColor
                });
            }
        })(fabric.MyButton.prototype.toObject);
        fabric.MyButton.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyButton(level, object));
        };
        fabric.MyButton.async = true;

        //Text area
        fabric.MyTextArea = fabric.util.createClass(fabric.Object,{
            type: Type.MyTextArea,
            initialize: function (level, options) {
                var self=this;
                var ctrlOptions={
                    bl:false,
                    br:false,
                    mb:true,
                    ml:true,
                    mr:true,
                    mt:true,
                    tl:false,
                    tr:false
                };
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.setControlsVisibility(ctrlOptions);//使text控件只能左右拉伸
                this.hasRotatingPoint=false;
                this.backgroundColor=level.texList[0].slices[0].color;

                this.text=level.info.text;
                this.fontFamily=level.info.fontFamily;
                this.fontSize=level.info.fontSize;
                this.fontColor=level.info.fontColor;
                this.fontBold=level.info.fontBold;
                this.fontItalic=level.info.fontItalic;
                this.fontUnderline=level.info.fontUnderline;

                //设置宽高
                if(this.text&&this.fontSize){
                    this.setWidth(this.fontSize*(this.text.length+1));
                    this.setHeight(this.fontSize*2);
                }

                // if (level.texList[0].slices[0].imgSrc&&level.texList[0].slices[0].imgSrc!=''){
                //     this.backgroundImageElement=new Image();
                //     this.backgroundImageElement.src=level.texList[0].slices[0].imgSrc;
                //     this.backgroundImageElement.onload = (function () {
                //
                //         this.loaded = true;
                //         this.setCoords();
                //         this.fire('image:loaded');
                //     }).bind(this);
                // }else {
                //     this.backgroundImageElement=null;
                // }

                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }


                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.backgroundColor=tex.slices[0].color;

                    self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();

                });

                this.on('changeTextContent', function (arg) {
                    //console.log('enter on changeTextContent');
                    if(arg.text){
                        self.text=arg.text;
                    }
                    if(arg.fontFamily){
                        self.fontFamily=arg.fontFamily;
                    }
                    if(arg.fontSize){
                        self.fontSize=arg.fontSize;
                    }
                    if(arg.fontColor){
                        self.fontColor=arg.fontColor;
                    }
                    if(arg.fontBold){
                        self.fontBold=arg.fontBold;
                    }
                    if(arg.hasOwnProperty('fontItalic')){
                        self.fontItalic=arg.fontItalic;
                    }

                    //重新设置canvas的宽高
                    if(self.fontSize&&self.text){
                        self.setWidth(self.fontSize*(self.text.length+1));
                        self.setHeight(self.fontSize*2);
                    }

                    var _callback=arg.callback;
                    var subLayerNode = CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();

                });




            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.fontColor;
                    ctx.save();
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width,
                        this.height);

                    if (this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }

                    ctx.restore();
                    //var subLayerNode=CanvasService.getSubLayerNode();

                    if(this.text){
                        var fontString=this.fontItalic+" "+this.fontBold+" "+this.fontSize+"px"+" "+this.fontFamily;
                        //console.log(fontString);
                        ctx.scale(1/this.scaleX,1/this.scaleY);
                        ctx.font=fontString;
                        ctx.textAlign='center';
                        ctx.textBaseline='middle';//使文本垂直居中
                        ctx.fillText(this.text,0,0);
                    }
                    //将图片超出canvas的部分裁剪
                    this.clipTo=function(ctx){
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(-this.width / 2,
                            -this.height / 2,
                            this.width,
                            this.height);
                        ctx.closePath();
                        ctx.restore();
                    };
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染文本出错');
                }
            }
        });
        fabric.MyTextArea.fromLevel = function(level,callback,option){
            callback && callback(new fabric.MyTextArea(level, option));
        };
        fabric.MyTextArea.prototype.toObject = (function (toObject){
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement: this.backgroundImageElement,
                    backgroundColor: this.backgroundColor
                });
            }
        })(fabric.MyTextArea.prototype.toObject);
        fabric.MyTextArea.fromObject = function(object,callback){
            var level=_self.getLevelById(object.id);
            callback&&callback(new fabric.MyTextArea(level,object));
        };
        fabric.MyTextArea.async = true;

        fabric.MyNum = fabric.util.createClass(fabric.Object,{
            type: Type.MyNum,
            initialize: function (level, options) {
                var self=this;
                var ctrlOptions={
                    bl:false,
                    br:false,
                    mb:false,
                    ml:false,
                    mr:false,
                    mt:false,
                    tl:false,
                    tr:false
                };
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.setControlsVisibility(ctrlOptions);//使数字控件不能拉伸
                this.hasRotatingPoint=false;
                //this.backgroundColor=level.texList[0].slices[0].color;
                this.backgroundColor=level.info.fontColor;


                this.numValue=level.info.numValue;
                this.fontFamily=level.info.fontFamily;
                this.fontSize=level.info.fontSize;
                this.fontColor=level.info.fontColor;
                this.fontBold=level.info.fontBold;
                this.fontItalic=level.info.fontItalic;
                this.align=level.info.align;
                //下面位数字模式属性
                this.numOfDigits=level.info.numOfDigits;
                this.decimalCount=level.info.decimalCount;
                this.symbolMode=level.info.symbolMode;
                this.fontZeroMode=level.info.frontZeroMode;
                //设置canvas的宽度和高度
                if(this.numOfDigits&&this.fontSize){
                    this.setWidth(this.numOfDigits*(self.symbolMode=='0'?(self.fontSize-3):self.fontSize));
                    this.setHeight(this.fontSize*1.2);
                }


                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if (this.backgroundImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }

                this.on('changeTex', function (arg) {
                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.backgroundColor=tex.slices[0].color;
                    self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();

                });

                this.on('changeNumContent', function (arg) {
                    if(arg.hasOwnProperty('numValue')){
                        self.numValue=arg.numValue;
                    }
                    if(arg.fontFamily){
                        self.fontFamily=arg.fontFamily;
                    }
                    if(arg.fontSize){
                        self.fontSize=arg.fontSize;
                    }
                    if(arg.fontBold){
                        self.fontBold=arg.fontBold;
                    }
                    if(arg.hasOwnProperty('fontItalic')){
                        self.fontItalic=arg.fontItalic;
                    }
                    if(arg.numOfDigits){
                        self.numOfDigits=arg.numOfDigits;
                    }
                    if(arg.hasOwnProperty('decimalCount')){
                        self.decimalCount=arg.decimalCount;
                    }
                    if(arg.symbolMode){
                        self.symbolMode=arg.symbolMode;
                    }
                    if(arg.frontZeroMode){
                        self.frontZeroMode=arg.frontZeroMode;
                    }
                    if(arg.align){
                        self.align=arg.align;
                    }
                    if(arg.fontColor){
                        self.fontColor=arg.fontColor;
                    }

                    //设置宽高
                    if(self.numOfDigits&&self.fontSize){
                        self.setWidth(self.numOfDigits*(self.symbolMode=='0'?(self.fontSize-3):self.fontSize));
                        self.setHeight(self.fontSize*1.2);
                    }

                    var _callback=arg.callback;
                    var subLayerNode = CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });




            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    var offCanvas = CanvasService.getOffCanvas();

                    offCanvas.width = this.width;
                    offCanvas.height = this.height;
                    //获取offCanvas
                    var offCtx = offCanvas.getContext('2d');
                    offCtx.clearRect(0,0,this.width,this.height);




                    offCtx.fillStyle=this.fontColor;
                    offCtx.fillRect(0,0,this.width,this.height);
                    if (this.backgroundImageElement) {
                        offCtx.drawImage(this.backgroundImageElement, 0, 0, this.width, this.height);
                    }

                    //在数字框里展示数字预览效果
                    if(this.numValue||this.numValue==0) {
                        //offCtx.save();

                        offCtx.globalCompositeOperation = "destination-in";
                        offCtx.font =this.fontItalic + " " + this.fontBold + " " + this.fontSize + "px" + " " + this.fontFamily;
                        offCtx.textAlign = this.align;

                        offCtx.textBaseline='middle';//设置数字垂直居中
                        var negative=false;
                        if(this.numValue<0){
                            negative=true;
                        }
                        var tempNumValue=Math.abs(this.numValue);
                        tempNumValue= tempNumValue.toString();
                        var i=0;
                        //配置小数位数
                        if(this.decimalCount){
                            if(tempNumValue.indexOf('.')!=-1){
                                //console.log('输入有小数')
                                var tempDecimalCount=tempNumValue.split('.')[1];
                                for(i=0;i<this.decimalCount-tempDecimalCount.length;i++){
                                    tempNumValue=tempNumValue+'0';
                                }
                            }else{
                                //console.log('输入无小数')
                                tempNumValue= tempNumValue+".";
                                for(i=0;i<this.decimalCount;i++){
                                    tempNumValue=tempNumValue+'0';
                                }
                            }

                        }
                        //配置前导0模式
                        if(this.frontZeroMode=='1'){
                            //console.log('minus',this.numOfDigits-tempNumValue.length);
                            var minus=this.numOfDigits-tempNumValue.length;
                            //console.log('minus',minus);
                            if(this.decimalCount){
                                for(i=0;i<minus+1;i++){
                                    tempNumValue='0'+tempNumValue;
                                }
                            }else{
                                for(i=0;i<minus;i++){
                                    tempNumValue='0'+tempNumValue;
                                }
                            }
                        }
                        //配置正负号
                        if((this.symbolMode=='1')&&(!negative)){
                            tempNumValue='+'+tempNumValue;
                        }else if(negative){
                            tempNumValue='-'+tempNumValue;
                        }
                        ctx.scale(1/this.scaleX,1/this.scaleY);
                        //选择对齐方式，注意：canvas里对齐的有一个参考点，左右是相对于参考点而言
                        if(this.align=='center'){
                            offCtx.fillText(tempNumValue, this.width/2, this.height/2);

                        }else if(this.align=='left') {
                            offCtx.fillText(tempNumValue, 0, this.height/2);
                        }else if(this.align=='right'){
                            offCtx.fillText(tempNumValue,this.width,this.height/2);
                        }
                        //offCtx.restore();
                    }
                    ctx.scale(1/this.scaleX,1/this.scaleY);
                    ctx.drawImage(offCanvas,-this.width/2,-this.height/2);
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染数字出错');
                }
            }
        });
        fabric.MyNum.fromLevel = function(level,callback,option){
            callback && callback(new fabric.MyNum(level, option));
        };
        fabric.MyNum.prototype.toObject = (function (toObject){
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundImageElement: this.backgroundImageElement,
                    backgroundColor: this.backgroundColor
                });
            }
        })(fabric.MyNum.prototype.toObject);
        fabric.MyNum.fromObject = function(object,callback){
            var level=_self.getLevelById(object.id);
            callback&&callback(new fabric.MyNum(level,object));
        };
        fabric.MyNum.async = true;



        fabric.MyButtonGroup = fabric.util.createClass(fabric.Object, {
            type: Type.MyButtonGroup,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                //初始化间距
                self.interval=level.info.interval;
                //初始化方向
                self.arrange=level.info.arrange;
                //初始化列表
                self.normalColors=[];
                self.normalImageElements=[];
                _.forEach(level.texList, function (_tex) {
                    self.normalColors.push(_tex.slices[0].color);
                    // if (_tex.slices[0].imgSrc&&_tex.slices[0].imgSrc!=''){
                    //     var normalImageElement=new Image();
                    //     normalImageElement.src=level.normalImg;
                    //     normalImageElement.onload = (function () {
                    //
                    //     }).bind(this);
                    //     self.normalImageElements.push(normalImageElement);
                    // }else {
                    //     self.normalImageElements.push(null);
                    //
                    // }

                    self.normalImageElements.push(ResourceService.getResourceFromCache(_tex.slices[0].imgSrc));

                });

                this.on('changeArrange', function (arg) {
                    self.arrange=arg.arrange;
                    var _callback=arg.callback;

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                })

                this.on('changeInterval', function (arg) {
                    self.interval=arg.interval;
                    var _callback=arg.callback;
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                })
                this.on('changeTex', function (arg) {
                    //初始化列表
                    //console.log(arg);
                    var level=arg.level;
                    var _callback=arg.callback;
                    self.normalColors=[];
                    self.normalImageElements=[];
                    //console.log(level.texList);
                    _.forEach(level.texList, function (_tex) {
                        self.normalColors.push(_tex.slices[0].color);
                        // if (_tex.slices[0].imgSrc&&_tex.slices[0].imgSrc!=''){
                        //     var normalImageElement=new Image();
                        //     normalImageElement.src=_tex.slices[0].imgSrc;
                        //     normalImageElement.onload = (function () {
                        //
                        //     }).bind(this);
                        //     self.normalImageElements.push(normalImageElement);
                        // }else {
                        //     self.normalImageElements.push(null);
                        //
                        // }

                        self.normalImageElements.push(ResourceService.getResourceFromCache(_tex.slices[0].imgSrc));
                    });

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();

                    _callback&&_callback();
                });


            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    var count=this.normalColors.length;
                    if (this.arrange=='horizontal'){
                        //横向
                        var width=(this.width-this.interval*(count-1))/count;
                        var height=this.height;
                        var interval=this.interval;
                        if (width<0){
                            return;
                        }

                        //按顺序画按钮
                        for (var i=0;i<this.normalColors.length;i++){
                            ctx.fillStyle=this.normalColors[i];
                            ctx.fillRect(
                                -(this.width / 2)+(width+interval)*i,
                                -(this.height / 2) ,
                                width ,
                                height );


                        }
                        for (var i=0;i<this.normalImageElements.length;i++){
                            var normalImageElement=this.normalImageElements[i];
                            if (normalImageElement){
                                ctx.drawImage(normalImageElement, -this.width / 2+(width+interval)*i, -this.height / 2,width,height);


                            }
                        }
                    }else{
                        //纵向
                        var height=(this.height-this.interval*(count-1))/count;
                        var width=this.width;
                        var interval=this.interval;
                        if (height<0){
                            return;
                        }

                        //按顺序画按钮
                        for (var i=0;i<this.normalColors.length;i++){
                            ctx.fillStyle=this.normalColors[i];
                            ctx.fillRect(
                                -(this.width / 2),
                                -(this.height / 2)+(height+interval)*i ,
                                width ,
                                height );

                            var normalImageElement=this.normalImageElements[i];
                            if (normalImageElement){
                                ctx.drawImage(normalImageElement, -this.width / 2, -this.height / 2+(height+interval)*i,width,height);
                            }
                        }
                    }
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染按钮组出错');
                }

            }
        });
        fabric.MyButtonGroup.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyButtonGroup(level, option));
        };
        fabric.MyButtonGroup.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    normalImageElements:this.normalImageElements,
                    normalColors:this.normalColors,
                    interval:this.interval,
                    arrange:this.arrange
                });
            }
        })(fabric.MyButtonGroup.prototype.toObject);
        fabric.MyButtonGroup.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyButtonGroup(level, object));
        };
        fabric.MyButtonGroup.async = true;

        fabric.MyNumber=fabric.util.createClass(fabric.Object,{
            type:Type.MyNumber,
            initialize: function (level, options) {

                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.myNumber=level.info.initValue+'';
                this.numberBackColors=[];
                this.numberImageElements=[];

                for (var i=0;i<13;i++){
                    if (level.texList[i]){

                        var tex=level.texList[i];
                        self.numberBackColors.push(tex.slices[0].color);

                        var imageElement=new Image();
                        if (tex.slices[0].imgSrc){
                            imageElement.src=tex.slices[0].imgSrc;
                        }else{
                            imageElement.src=Preference.NUMBER_IMAGES[i];

                        }
                        imageElement.onload = (function () {}).bind(this);
                        self.numberImageElements.push(imageElement);
                    }else {
                        //填充默认的颜色和数字图片
                        self.numberBackColors.push(Preference.WHITE_COLOR);
                        var imageElement=new Image();
                        imageElement.src=Preference.NUMBER_IMAGES[i];
                        imageElement.onload = (function () {}).bind(this);
                        self.numberImageElements.push(imageElement);
                    }
                }

                this.on('changeNumber', function (newLevel, _callback) {
                    self.myNumber=newLevel.info.initValue+'';
                    this.width=newLevel.info.width;
                    this.height=newLevel.info.height;
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

                this.on('changeTex', function (arg) {
                    //初始化列表
                    var level=arg.level;
                    var _callback=arg.callback;
                    self.numberBackColors=[];
                    self.numberImageElements=[];


                    for (var i=0;i<13;i++){
                        if (level.texList[i]){

                            var tex=level.texList[i];
                            self.numberBackColors.push(tex.slices[0].color);

                            var imageElement=new Image();
                            if (tex.slices[0].imgSrc){
                                imageElement.src=tex.slices[0].imgSrc;
                            }else{
                                imageElement.src=Preference.NUMBER_IMAGES[i];

                            }
                            imageElement.onload = (function () {}).bind(this);
                            self.numberImageElements.push(imageElement);
                        }else {
                            //填充默认的颜色和数字图片
                            self.numberBackColors.push(Preference.WHITE_COLOR);
                            var imageElement=new Image();
                            imageElement.src=Preference.NUMBER_IMAGES[i];
                            imageElement.onload = (function () {}).bind(this);
                            self.numberImageElements.push(imageElement);
                        }
                    }

                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();

                    _callback&&_callback();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {


                //按数字画按钮
                var charArray=this.myNumber.split('');
                var count=charArray.length;
                var width=this.width/count;
                var height=this.height;

                var colors=[];
                var imageElements=[];
                for (var i=0;i<charArray.length;i++) {
                    var _char=charArray[i];
                    switch (_char){
                        case '0':
                            colors.push(this.numberBackColors[0]);
                            imageElements.push(this.numberImageElements[0]);
                            break;
                        case '1':
                            colors.push(this.numberBackColors[1]);
                            imageElements.push(this.numberImageElements[1]);
                            break;
                        case '2':
                            colors.push(this.numberBackColors[2]);
                            imageElements.push(this.numberImageElements[2]);
                            break;
                        case '3':
                            colors.push(this.numberBackColors[3]);
                            imageElements.push(this.numberImageElements[3]);
                            break;
                        case '4':
                            colors.push(this.numberBackColors[4]);
                            imageElements.push(this.numberImageElements[4]);
                            break;
                        case '5':
                            colors.push(this.numberBackColors[5]);
                            imageElements.push(this.numberImageElements[5]);
                            break;
                        case '6':
                            colors.push(this.numberBackColors[6]);
                            imageElements.push(this.numberImageElements[6]);
                            break;
                        case '7':
                            colors.push(this.numberBackColors[7]);
                            imageElements.push(this.numberImageElements[7]);
                            break;
                        case '8':
                            colors.push(this.numberBackColors[8]);
                            imageElements.push(this.numberImageElements[8]);
                            break;
                        case '9':
                            colors.push(this.numberBackColors[9]);
                            imageElements.push(this.numberImageElements[9]);
                            break;
                        case '+':
                            colors.push(this.numberBackColors[10]);
                            imageElements.push(this.numberImageElements[10]);
                            break;
                        case '-':
                            colors.push(this.numberBackColors[11]);
                            imageElements.push(this.numberImageElements[11]);
                            break;
                        case '.':
                            colors.push(this.numberBackColors[12]);
                            imageElements.push(this.numberImageElements[12]);
                            break;

                    }
                }
                for (var i=0;i<colors.length;i++){
                    ctx.fillStyle=colors[i];
                    ctx.fillRect(
                        -(this.width / 2)+width*i,
                        -(this.height / 2) ,
                        width ,
                        height );
                }
                for (var i=0;i<imageElements.length;i++){
                    ctx.fillStyle=imageElements[i];
                    ctx.drawImage(
                        imageElements[i],
                        -(this.width / 2)+width*i,
                        -(this.height / 2) ,
                        width ,
                        height );
                }
            }
        });
        fabric.MyNumber.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyNumber(level, option));
        };
        fabric.MyNumber.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    numberImageElements:this.numberImageElements,
                    numberBackColors:this.numberBackColors,
                    myNumber:this.myNumber
                });
            }
        })(fabric.MyNumber.prototype.toObject);
        fabric.MyNumber.fromObject= function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback&&callback(new fabric.MyNumber(level,object));
        };
        fabric.MyNumber.async = true;




        fabric.MyVideo = fabric.util.createClass(fabric.Object, {
            type: Type.MyVideo,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;
                this.backgroundColor=level.texList[0].slices[0].color;
            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height );
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染Slide出错');
                }
            }
        });
        fabric.MyVideo.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MyVideo(level, option));
        }
        fabric.MyVideo.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    backgroundColor:this.backgroundColor,
                });
            }
        })(fabric.MyVideo.prototype.toObject);
        fabric.MyVideo.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MyVideo(level, object));
        };
        fabric.MyVideo.async = true;

        fabric.MySlide = fabric.util.createClass(fabric.Object, {
            type: Type.MySlide,
            initialize: function (level, options) {
                var self=this;
                this.callSuper('initialize',options);
                this.lockRotation=true;
                this.hasRotatingPoint=false;

                var tex=level.texList[0];
                this.currentColor=tex.slices[tex.currentSliceIdx].color;

                this.currentImageElement = ResourceService.getResourceFromCache(tex.slices[tex.currentSliceIdx].imgSrc);
                if (this.currentImageElement) {
                    this.loaded = true;
                    this.setCoords();
                    this.fire('image:loaded');
                }
                this.on('changeTex', function (arg) {

                    var level=arg.level;
                    var _callback=arg.callback;

                    var tex=level.texList[0];
                    self.currentColor=tex.slices[tex.currentSliceIdx].color;
                    self.currentImageElement = ResourceService.getResourceFromCache(tex.slices[tex.currentSliceIdx].imgSrc);
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.renderAll();
                    _callback&&_callback();
                });

            },
            toObject: function () {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render: function (ctx) {
                try{
                    ctx.fillStyle=this.currentColor;
                    ctx.fillRect(
                        -(this.width / 2),
                        -(this.height / 2) ,
                        this.width ,
                        this.height );
                    if (this.currentImageElement){
                        ctx.drawImage(this.currentImageElement, -this.width / 2, -this.height / 2,this.width,this.height);

                    }
                }
                catch(err){
                    console.log('错误描述',err);
                    toastr.warning('渲染Slide出错');
                }
            }
        });
        fabric.MySlide.fromLevel= function (level, callback,option) {
            callback && callback(new fabric.MySlide(level, option));
        }
        fabric.MySlide.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    currentColor:this.currentColor,
                    currentImageElement:this.currentImageElement
                });
            }
        })(fabric.MySlide.prototype.toObject);
        fabric.MySlide.fromObject = function (object, callback) {
            var level=_self.getLevelById(object.id);
            callback && callback(new fabric.MySlide(level, object));
        };
        fabric.MySlide.async = true;











        /**
         * IDE当前项目
         * @type {{}}
         */
        var project = {};

        /**
         * IDEPage剪切板
         */
        var shearPagePlate = {
            type: '',
            objects: []
        };

        this.shearPlate={
            type: '',
            objects: [],
            mode:0,
            target:null
        };

        var shearPlate=this.shearPlate;

        var pageRendering = false;

        /**
         * 设置渲染状态
         * @param _rendering
         */
        this.setRendering = function (_rendering) {
            pageRendering = _rendering;
        };

        /**
         * 返回当前是否在渲染
         * @returns {boolean}
         */
        this.isRendering = function () {
            return pageRendering;
        };

        /**
         * 判断是否处于编辑Page的模式
         */
        this.isEditingPage = function () {
            var currentPage=_self.getCurrentPage();
            return currentPage.mode==0
        };

        /**
         * 获得当前选中的对象
         * @returns {{type: string, target: *, level: *}}  类型/fabric对象/图层对象
         */
        var getCurrentSelectObject=this.getCurrentSelectObject= function () {
            var type='none';
            var target=null;
            var level=null;
            var mode=0;
            var pageNode=CanvasService.getPageNode();
            var subLayerNode=CanvasService.getSubLayerNode();
            _.forEach(project.pages, function (_page) {
                if (_page.current){
                    if (_page.selected){
                        type= Type.MyPage;
                        target=pageNode;
                        level=_page;
                        mode=0;
                    }
                    if (_page.currentFabLayer&&_page.currentFabLayer.type==Type.MyLayerGroup){

                        type=Type.MyLayerGroup;
                        target=pageNode.getActiveGroup();

                        level={
                            info:{

                                left:target?target.getLeft():null,
                                top:target?target.getTop():null,
                            }
                        };
                        mode=0;

                    }
                    _.forEach(_page.layers, function (_layer) {

                        if (_layer.current){
                            if (_layer.selected){
                                type= Type.MyLayer;
                                target=_page.currentFabLayer;
                                level=_layer;
                                mode=0;

                            }
                            _.forEach(_layer.subLayers, function (_subLayer) {
                                if (_subLayer.current){
                                    if (_subLayer.selected){

                                        type= Type.MySubLayer;
                                        target=CanvasService.getSubLayerNode();
                                        level=_subLayer;
                                        mode=1;

                                    }
                                    if (_subLayer.currentFabWidget&&_subLayer.currentFabWidget.type==Type.MyWidgetGroup){



                                        type=Type.MyWidgetGroup;
                                        target=subLayerNode.getActiveGroup();
                                        level={
                                            info:{
                                                left:target?target.getLeft():null,
                                                top:target?target.getTop():null,
                                            }
                                        };
                                        mode=1;

                                    }
                                    _.forEach(_subLayer.widgets, function (_widget) {


                                        if ((_widget.current)&&(_widget.selected)){


                                            type=getFabricObject(_widget.id,true).type;
                                            target=_subLayer.currentFabWidget;
                                            level=_widget;
                                            mode=1;

                                        }
                                    })
                                }
                            })
                        }

                    })
                }

            });

            return {
                type: type,
                target: target,
                level: level,
                mode:mode
            };
        };

        /**
         * 存储全局的项目
         * @param _globalProject
         * @param _successCallback
         */
        this.saveProjectFromGlobal = function (_globalProject,_successCallback) {
            project = _globalProject;

            _.forEach(project.pages,function (_page) {
                _.forEach(_page.layers,function (_layer) {
                    _.forEach(_layer.subLayers,function (_subLayer) {
                        if (_subLayer.id==_layer.showSubLayer.id){
                            _layer.showSubLayer=_subLayer;
                        }
                    })
                })
            });
            var pageCount=project.pages.length;
            openAllPage(0,_successCallback);
            //


            function openAllPage(_index, _successCallback) {
                if (_index==pageCount){
                    _self.changeCurrentPageIndex(0,_successCallback);
                }else{
                    _self.changeCurrentPageIndex(_index,function () {
                        openAllPage(_index+1,_successCallback);

                    },true);
                }
            }
        };


        /**
         * 将当前项目赋值到scope.project
         * 不可在其他controller中直接改动scope.project
         * @param scope
         * @param _successCallback
         */
        this.getProjectTo = function (scope, _successCallback) {
            scope.project = project;
            _successCallback && _successCallback();
        };

        //get project copy to
        
        this.getProjectCopyTo = function (scope, scb) {
            scope.project = _.cloneDeep(project);
            scb && scb();
        };


        /**
         * 获得当前Page
         * @returns {*}
         */
        this.getCurrentPage= function () {
            var currentPage=null;
            _.forEach(project.pages, function (_page) {
                if (_page.current){
                    currentPage=_page;
                }
            });
            return currentPage;
        };

        /**
         * 获得当前SubLayer
         * @returns {*}
         */
        this.getCurrentSubLayer= function () {
            var currentPage=_self.getCurrentPage();
            var currentSubLayer=null;
            _.forEach(currentPage.layers, function (_layer) {
                if (_layer.current){
                    _.forEach(_layer.subLayers, function (_subLayer) {
                        if (_subLayer.current){
                            currentSubLayer=_subLayer
                        }
                    })
                }
            });
            return currentSubLayer;
        }

        /**
         * 根据当前的Page找到当前的Layer
         * @returns {*}
         */
        var getCurrentLayer=this.getCurrentLayer = function (_currentPage) {
            var currentPage=_currentPage;
            if (!currentPage){
                currentPage = _self.getCurrentPage();

            }
            var currentLayer=null;
            _.forEach(currentPage.layers, function (_layer) {
                if (_layer.current){
                    currentLayer=_layer;
                }
            });
            return currentLayer;
        };

        /**
         * 按照id获得项目中的level
         * 效率很低,不建议在循环中使用
         * @type {getLevelById}
         */
        var getLevelById=this.getLevelById = function (_id) {
            var level=null;
            _.forEach(project.pages, function (_page) {
                if (_page.id==_id){
                    level= _page;
                }
                _.forEach(_page.layers, function (_layer) {
                    if (_layer.id==_id){
                        level= _layer;
                    }
                    _.forEach(_layer.subLayers, function (_subLayer) {
                        if (_subLayer.id==_id){
                            level= _subLayer;
                        }
                        _.forEach(_subLayer.widgets, function (_widget) {
                            if (_widget.id==_id){
                                level= _widget;
                            }
                        })
                    })
                })

            });
            return level;
        };

        var getResourceList=this.getResourceList=function () {

            return project.resourceList;
        }

        var getCurrentWidget=this.getCurrentWidget= function (_currentSubLayer) {
            var currentSubLayer=getCurrentSubLayer();
            if (!currentSubLayer){
                currentSubLayer=_currentSubLayer;
            }

            if (!currentSubLayer){
                console.warn('找不到SubLayer');
                return;

            }
            var currentWidget=null;
            _.forEach(currentSubLayer.widgets, function (_widget) {
                if (_widget.current){
                    currentWidget=_widget;
                }
            });
            return currentWidget;

        }

        /**
         * 找到画布对应的Fabric对象
         * @returns {null}
         * @param _id
         * @param _isSubLayer
         */
        var getFabricObject=this.getFabricObject = function (_id, _isSubLayer) {
            var canvasNode;
            if (!_isSubLayer){
                canvasNode=CanvasService.getPageNode();
            }else {
                canvasNode=CanvasService.getSubLayerNode();

            }
            var fobj = null;

            _.forEach(canvasNode.getObjects(), function (_fobj) {

                if (_fobj.id == _id) {
                    fobj =_fobj;
                }
            });

            return fobj;
        };

        /**
         * 搜寻所有被项目引用过的图片资源名
         * 用于删除资源时判断  该资源是否可以被删除
         * @type {getRequiredResourceNames}
         */
        var getRequiredResourceNames=this.getRequiredResourceNames=function () {
            var names=[];
            _.forEach(project.pages,function (page) {
                if (page.backgroundImage){
                    names.push(page.backgroundImage);
                }
                _.forEach(page.layers,function (layer) {
                    _.forEach(layer.subLayers,function (subLayer) {
                        if (subLayer.backgroundImage){
                            names.push(subLayer.backgroundImage);
                        }
                        _.forEach(subLayer.widgets,function (widget) {
                            _.forEach(widget.texList,function (tex) {
                                _.forEach(tex.slices,function (slice) {
                                    if (slice.imgSrc){
                                        names.push(slice.imgSrc);

                                    }
                                })
                            })
                        })
                    })
                })
            });
            return names;
        };
        /**
         * 搜寻所有被项目引用过的tag名
         * 用于删除资源时判断  该资源是否可以被删除
         * @type {getRequiredResourceNames}
         */
        var getRequiredTagNames=this.getRequiredTagNames=function(){
            var names=[];
            _.forEach(project.pages,function(page){
                if(page.tag){
                    names.push(page.tag);
                }
                _.forEach(page.layers,function(layer){
                    if(layer.tag){
                        names.push(layer.tag);
                    }
                    _.forEach(layer.subLayers,function(subLayer){
                       _.forEach(subLayer.widgets,function(widget){
                           if(widget.tag){
                               names.push(widget.tag);
                           }
                       })
                    })
                })
            });
            return names
        };

        /**
         * Page之间的切换
         * @param _pageIndex
         * @param _successCallback
         */
        this.changeCurrentPageIndex = function (_pageIndex, _successCallback,isInit) {
            if (isInit){
                //console.log('初始化页面');
                intoNewPage();

            }
            else if (_pageIndex>=0){

                var  oldPage=_self.getCurrentPage();
                if (oldPage){
                    var oldPageIndex=-1;
                    _.forEach(project.pages, function (__page,__pageIndex) {

                        if (__page.id==oldPage.id){
                            oldPageIndex=__pageIndex;
                        }
                    })
                    //console.log(oldPageIndex+'/'+_pageIndex);
                    if (oldPageIndex!=_pageIndex){
                        console.log('页面间切换');
                        if (oldPage.mode==1){
                            _self.OnPageSelected(oldPageIndex,intoNewPage,true);

                        }else{
                            _self.OnPageSelected(_pageIndex,function(){
                                _successCallback&&_successCallback(true);
                            });
                        }

                    }else{
                        //console.log('相同页面点击');

                            _self.OnPageSelected(_pageIndex,function(){
                                _successCallback&&_successCallback(true);
                            },isInit);



                    }
                }else {
                    console.log('异常情况');
                    intoNewPage();

                }

            }

            function intoNewPage(){
                var pageNode=CanvasService.getPageNode();
                var currentPage=project.pages[_pageIndex];
                if (!currentPage){
                    console.warn('找不到Page');
                    return;
                }

                OnPageClicked(_pageIndex);

                var pageCount=currentPage.layers.length;

                pageNode.setBackgroundImage(null, function () {
                    pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                        //pageNode.setWidth(project.currentSize.width);
                        //pageNode.setHeight(project.currentSize.height);
                        if (isInit){
                            //console.log('更新layer');
                            updateLayerImage(0,function () {
                                _self.ScaleCanvas('page');

                                pageNode.renderAll();


                                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                                _self.OnPageSelected(_pageIndex,_successCallback,true);
                            })

                        }else{
                            //console.log('不更新layer');
                            _self.ScaleCanvas('page');

                            pageNode.renderAll();


                            currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                            _self.OnPageSelected(_pageIndex,_successCallback);
                        }


                    })

                });

                function updateLayerImage(_index,_successCallback) {
                    if (_index==pageCount){
                        _successCallback&&_successCallback();
                    }else {
                        var layer=currentPage.layers[_index];

                        _self.SyncSubLayerImage(layer,layer.showSubLayer,function () {
                            updateLayerImage(_index+1,_successCallback);
                        })
                    }
                }
            }
        }

        this.changeCurrentSubLayerIndex= function (_subLayerIndex,_successCallback) {
            if (_subLayerIndex<0){
                console.warn('输入不合法');
                return;
            }
            var subLayerNode=CanvasService.getSubLayerNode();
            var currentLayer=getCurrentLayer();
            var layerIndex= _indexById(_self.getCurrentPage().layers,currentLayer);
            var currentSubLayer=currentLayer.subLayers[_subLayerIndex];
            if (!currentSubLayer){
                console.warn('找不到SubLayer');
                return;
            }
            currentLayer.showSubLayer=currentSubLayer;

            _self.SyncSubLayerImage(currentLayer,currentSubLayer,function () {
                var selectObj=_self.getCurrentSelectObject();
                selectObj.target.fire('OnScaleRelease',selectObj.target.id);
                selectObj.target.fire('OnRelease',selectObj.target.id);

                _successCallback&&_successCallback();
            });

        }
        /**
         * 询问当前的复制粘贴状态
         * @returns {boolean}
         */
        this.shearPagePlateEnable = function () {
            return (shearPagePlate.objects.length != 0);
        };

        this.shearPlateEnable= function () {
            if (shearPlate.objects.length==0){
                return false;
            }
            var selectObj=getCurrentSelectObject();
            var currentPage=_self.getCurrentPage();
            if (selectObj.type==Type.MyPage){
                //Page下面只有Layer或者Layer组可以粘贴
                if (shearPlate.type==Type.MyLayer){
                    return true;
                }else if(shearPlate.type == Type.MyGroup && shearPlate.mode == 0){
                    return true;
                }else{
                    return false;
                }
            }else if (selectObj.type==Type.MyLayer||(selectObj.type==Type.MyGroup&&selectObj.mode==0)){
                //Layer下面只有Layer或者Layer组可以粘贴

                if (shearPlate.type==Type.MyLayer){
                    return true;
                }else if(shearPlate.type == Type.MyGroup && shearPlate.mode == 0){
                    return true;
                }else{
                    return false;
                }
            }else if (selectObj.type==Type.MySubLayer){
                //SubLayer下面只有Widget或者Widget组可以粘贴
                if (Type.isWidget(shearPlate.type)){
                    return true;
                }else return (shearPlate.type == Type.MyGroup && shearPlate.mode == 1);
            }else if (Type.isWidget(selectObj.type)||(selectObj.type==Type.MyGroup&&selectObj.mode==1)){
                //Widget下面只有Widget或者Widget组可以粘贴
                if (Type.isWidget(shearPlate.type)){
                    return true;
                }else return (shearPlate.type == Type.MyGroup && shearPlate.mode == 1);
            }else {
                return false;
            }
        }

        /**
         * 主要操作
         * 添加新Page
         * @param _newPage 新的页面
         * @param _successCallback 成功的回调
         * @constructor
         */
        this.AddNewPage = function (_newPage, _successCallback) {
            setRendering(true);

            var newPage = _.cloneDeep(_newPage);
            var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
            var newPageIndex=-1;
            if (currentPageIndex == project.pages.length - 1) {
                project.pages.push(newPage);
                newPageIndex=project.pages.length - 1;
            } else {
                project.pages.splice(currentPageIndex + 1, 0, newPage);
                newPageIndex=currentPageIndex + 1;

            }
            _self.changeCurrentPageIndex(newPageIndex, function () {
                _cleanPageHashKey();
                _successCallback && _successCallback();
            });


        };
        /**
         * 主要操作
         * 在当前Page添加一个新Layer
         * @param _newLayer
         * @param _successCallback
         * @constructor
         */
        this.AddNewLayerInCurrentPage = function (_newLayer, _successCallback) {

            var pageNode = CanvasService.getPageNode();
            //init zindex
            _newLayer.zIndex = pageNode.getObjects().length;

            var currentPage=_self.getCurrentPage();
            var initiator = {
                width: _newLayer.info.width,
                height: _newLayer.info.height,
                top: _newLayer.info.top,
                left: _newLayer.info.left,
                id: _newLayer.id,
                lockScalingFlip:true,
                hasRotatingPoint:false,
                shadow:{
                    color:'rgba(0,0,0,0.4)',blur:2
                }
            };

            currentPage.layers.push(_newLayer);

            var fabLayer=new fabric.MyLayer(_newLayer.id,initiator);
            pageNode.add(fabLayer);

            pageNode.renderAll.bind(pageNode)();
            _newLayer.info.width=fabLayer.getWidth();
            _newLayer.info.height=fabLayer.getHeight();


            currentPage.currentFabLayer=fabLayer;
            pageNode.renderAll.bind(pageNode)();

            _self.currentFabLayerIdList=[];
            _self.currentFabLayerIdList.push(_newLayer.id);
            _self.OnLayerSelected(_newLayer,_successCallback);


        };

        this.AddNewSubLayerInCurrentLayer= function (_newSubLayer,_successCallback) {

            var newSubLayer = _.cloneDeep(_newSubLayer);
            var currentLayer=getCurrentLayer();
            var currentLayerIndex= _indexById(_self.getCurrentPage().layers,currentLayer);
            currentLayer.subLayers.push(newSubLayer);
            var newSubLayerIndex=currentLayer.subLayers.length - 1;

            _self.OnSubLayerSelected(currentLayerIndex,newSubLayerIndex,_successCallback,true);

        }
        /**
         * 主要操作
         * 在当前SubLayer添加一个新Widget
         * @constructor
         */
        this.AddNewWidgetInCurrentSubLayer = function (_newWidget, _successCallback) {
            var subLayerNode = CanvasService.getSubLayerNode();
            var currentSubLayer=getCurrentSubLayer();
            //init zindex
            _newWidget.zIndex = subLayerNode.getObjects().length;
            var initiator = {
                width: _newWidget.info.width,
                height: _newWidget.info.height,
                top: _newWidget.info.top,
                left: _newWidget.info.left,
                id: _newWidget.id,
                lockScalingFlip:true,
                hasRotatingPoint:false,
                shadow:{
                    color:'rgba(0,0,0,0.4)',blur:2
                }
            };

            _self.currentFabWidgetIdList=[];
            _self.currentFabWidgetIdList.push(_newWidget.id);

            if (_newWidget.type==Type.MySlide){
                fabric.MySlide.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');


                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;


                    OnWidgetSelected(_newWidget,_successCallback);


                }, initiator);

            }
            else if (_newWidget.type==Type.MyProgress){

                if (_newWidget.backgroundImg==''){
                    _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                }
                if (_newWidget.progressImg==''){
                    _newWidget.progressImg=Preference.BLANK_LAYER_URL;
                }
                fabric.MyProgress.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.backgroundUrl=_newWidget.backgroundImg;
                    fabWidget.progressUrl=_newWidget.progressImg;

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll();

                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);


            }
            else if(_newWidget.type==Type.MyDashboard){
                if (_newWidget.backgroundImg==''){
                    _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                }
                if (_newWidget.progressImg==''){
                    _newWidget.progressImg=Preference.BLANK_LAYER_URL;
                }
                fabric.MyDashboard.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.backgroundUrl=_newWidget.backgroundImg;
                    fabWidget.progressUrl=_newWidget.progressImg;

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll();

                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);

            }
            else if (_newWidget.type==Type.MyButton){

                fabric.MyButton.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.normalImg=_newWidget.backgroundImg;
                    fabWidget.pressImg=_newWidget.progressImg;

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);


            }
            else  if (_newWidget.type==Type.MyButtonGroup){
                fabric.MyButtonGroup.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            } 
            else if(_newWidget.type==Type.MyNumber){
                fabric.MyNumber.fromLevel(_newWidget, function (fabWidget) {

                    _self.currentFabWidgetIdList=[fabWidget.id];
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);

                }, initiator);
            } else if(_newWidget.type==Type.MyTextArea){
                fabric.MyTextArea.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);

                }, initiator);
            } else if(_newWidget.type == Type.MyNum){
                fabric.MyNum.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll();

                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyKnob){
                if (_newWidget.backgroundImg==''){
                    _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                }
                if (_newWidget.knobImg==''){
                    _newWidget.knobImg=Preference.BLANK_LAYER_URL;
                }
                fabric.MyKnob.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.backgroundUrl=_newWidget.backgroundImg;
                    fabWidget.knobUrl=_newWidget.KnobImg;

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll();

                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyOscilloscope){

                if (_newWidget.backgroundImg==''){
                    _newWidget.backgroundImg=Preference.BLANK_LAYER_URL;
                }
                if (_newWidget.oscillationImg==''){
                    _newWidget.oscillationImg=Preference.BLANK_LAYER_URL;
                }
                fabric.MyOscilloscope.fromLevel(_newWidget, function (fabWidget) {
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.backgroundUrl=_newWidget.backgroundImg;
                    fabWidget.oscillationImg=_newWidget.oscillationImg;

                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll();

                    subLayerNode.renderAll.bind(subLayerNode)();
                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator)
            }else if(_newWidget.type==Type.MySwitch){
                fabric.MySwitch.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];

                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();
                    //console.log('-');


                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;


                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyRotateImg){
                fabric.MyRotateImg.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];
                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyDateTime){
                fabric.MyDateTime.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];
                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyScriptTrigger){
                fabric.MyScriptTrigger.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];
                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MySlideBlock){
                fabric.MySlideBlock.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabWidgetIdList=[fabWidget.id];
                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }else if(_newWidget.type==Type.MyVideo){
                fabric.MyVideo.fromLevel(_newWidget,function(fabWidget){
                    _self.currentFabLayerIdList=[fabWidget.id];
                    fabWidget.urls=_newWidget.subSlides;
                    subLayerNode.add(fabWidget);
                    subLayerNode.renderAll.bind(subLayerNode)();

                    _newWidget.info.width=fabWidget.getWidth();
                    _newWidget.info.height=fabWidget.getHeight();

                    currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                    currentSubLayer.widgets.push(_newWidget);
                    currentSubLayer.currentFabWidget=fabWidget;

                    OnWidgetSelected(_newWidget,_successCallback);
                },initiator);
            }



        };

        /**
         * 主要操作
         * 绑定缩略图的拖拽
         * @param _dragStartCallback
         * @param _droppedCallback
         * @returns {{dragStart: ProjectService.dragStart, dropped: ProjectService.dropped}}
         * @constructor
         */
        this.BindPageTree = function (_dragStartCallback, _droppedCallback) {
            var startOperate;
            var startIndex;
            var endIndex;
            var endOperate;
            return {

                dragStart: function (e) {
                    startOperate = SaveCurrentOperate();
                    startIndex = e.source.index;
                    _dragStartCallback(e);
                },
                dropped: function (e) {
                    endIndex = e.dest.index;
                    if (endIndex != startIndex) {

                        endOperate = SaveCurrentOperate();

                    }

                    _droppedCallback(e, endOperate)
                }

            };
        };

        /**
         * 主要操作
         * 根据序号删除一个页面
         * @param _index
         * @param _successCallback
         * @constructor
         */
        this.DeletePageByIndex = function (_index, _successCallback) {
            var currentPageIndex=-1;
            if (_index == 0 && project.pages.length == 1) {

                project.pages = [];
                var newPage = TemplateProvider.getRandomPage();
                project.pages.push(newPage);
                currentPageIndex = 0;
            } else if (_index == 0) {
                project.pages.shift();
                currentPageIndex = 0;

            } else {
                project.pages.splice(_index, 1);
                currentPageIndex = _index - 1;
            }
            _cleanPageHashKey();

            _self.changeCurrentPageIndex(currentPageIndex,_successCallback);




        };

        /**
         * 主要操作
         * 删除Layer
         * @param _successCallback
         * @constructor
         */
        this.DeleteActiveLayers = function (_successCallback) {
            var pageNode = CanvasService.getPageNode();
            var currentPage=_self.getCurrentPage();
            var currentPageIndex= _indexById(project.pages,currentPage);
            var activeGroup = pageNode.getActiveGroup();
            var activeObject = pageNode.getActiveObject();


            if (activeGroup && activeGroup.objects.length > 0) {
                _.forEach(activeGroup.getObjects(), function (_fabLayer) {
                    pageNode.fxRemove(_fabLayer,{
                        onComplete: function () {
                            deleteLayerFromJson(_fabLayer);
                        }
                    });
                });
                pageNode.fxRemove(activeGroup, {
                    onComplete: function () {
                        pageNode.deactivateAll();
                        pageNode.renderAll();

                        _self.OnPageSelected(currentPageIndex,_successCallback);
                    }
                });


            }
            else if (activeObject) {

                pageNode.fxRemove(activeObject, {
                    onComplete: function () {
                        deleteLayerFromJson(activeObject);
                        _self.OnPageSelected(currentPageIndex,_successCallback);


                    }
                });
            }

            function deleteLayerFromJson(object) {
                var layers = _self.getCurrentPage().layers;
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    if (layer.id == object.id) {
                        layers.splice(i, 1);
                    }
                }
            }


        };

        /**
         *主要操作
         * 删除当前的SubLayer
         * 如果是当前的showSubLayer要另外判断
         * @param _successCallback
         * @constructor
         */
        this.DeleteCurrentSubLayer= function (_successCallback) {
            var currentLayer= _self.getCurrentLayer();
            var currentSubLayer=_self.getCurrentSubLayer();
            var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
            var currentSubLayerIndex=-1;
            _.forEach(currentLayer.subLayers, function (_subLayer,_subLayerIndex) {
                if (_subLayer.id==currentSubLayer.id){
                    currentSubLayerIndex=_subLayerIndex;
                }
            });
            if (currentSubLayerIndex<0){
                console.warn('找不到SubLayer');
                return;
            }
            var shown=(currentLayer.showSubLayer.id==currentSubLayer.id);

            if (!shown){
                _self.OnLayerSelected(currentLayer, function () {
                    currentLayer.subLayers.splice(currentSubLayerIndex,1);
                    _successCallback&&_successCallback();
                });
            }else if(currentLayer.subLayers.length>1){
                var showSubLayer=currentLayer.subLayers[0];
                currentLayer.showSubLayer=showSubLayer;
                _self.SyncSubLayerImage(currentLayer,showSubLayer, function () {
                    _self.OnLayerSelected(currentLayer, function () {
                        currentLayer.subLayers.splice(currentSubLayerIndex,1);
                        _successCallback&&_successCallback();
                    });
                })

            }else {
                var newSubLayer=TemplateProvider.getDefaultSubLayer();
                currentLayer.subLayers.push(newSubLayer);
                currentLayer.showSubLayer=newSubLayer;
                _self.SyncSubLayerImage(currentLayer,newSubLayer, function () {
                    _self.OnLayerSelected(currentLayer, function () {
                        currentLayer.subLayers.splice(currentSubLayerIndex,1);
                        _successCallback&&_successCallback();
                    });
                })

            }


        };

        this.DeleteActiveWidgets= function (_successCallback) {
            var subLayerNode = CanvasService.getSubLayerNode();
            var currentSubLayer=_self.getCurrentSubLayer();
            var currentPage= _self.getCurrentPage();
            var currentLayer= _self.getCurrentLayer();
            var layerIndex= _indexById(currentPage.layers,currentLayer);
            var subLayerIndex= _indexById(currentLayer.subLayers,currentSubLayer);
            var activeGroup = subLayerNode.getActiveGroup();
            var activeObject = subLayerNode.getActiveObject();


            if (activeGroup && activeGroup.objects.length > 0) {
                _.forEach(activeGroup.getObjects(), function (_fabWidget) {
                    subLayerNode.fxRemove(_fabWidget,{
                        onComplete: function () {
                            deleteLayerFromJson(_fabWidget);
                        }
                    });
                });
                subLayerNode.fxRemove(activeGroup, {
                    onComplete: function () {
                        subLayerNode.deactivateAll();
                        subLayerNode.renderAll();

                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback);
                    }
                });


            }
            else if (activeObject) {

                subLayerNode.fxRemove(activeObject, {
                    onComplete: function () {
                        deleteLayerFromJson(activeObject);
                        _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback);

                    }
                });
            }

            function deleteLayerFromJson(object) {
                var widgets = _self.getCurrentSubLayer().widgets;
                for (var i = 0; i < widgets.length; i++) {
                    var widget = widgets[i];
                    if (widget.id == object.id) {
                        widgets.splice(i, 1);
                    }
                }
            }
        }





        /**
         * 主要操作
         * Move Layer
         * @param _successCallback
         * @constructor
         */
        this.MoveActiveObjects = function (type,direction,step,_successCallback) {
            var fabNode;
            var layerMode = true;
            if (type === 'layers'){
                fabNode = CanvasService.getPageNode();
            }else if (type === 'widgets'){
                fabNode = CanvasService.getSubLayerNode();
                layerMode = false;
            }else{
                return;
            }

            var activeGroup = fabNode.getActiveGroup();
            var activeObject = fabNode.getActiveObject();

            step = step || 0;
            var leftStep  = 0;
            var topStep = 0;
            switch (direction){
                case 'up':
                    topStep = 0-step;
                    break;
                case 'down':
                    topStep = step;
                    break;
                case 'left':
                    leftStep = 0-step;
                    break;
                case 'right':
                    leftStep = step;
                    break;
            }
            var tempLeft;
            var tempTop;

            if (activeGroup && activeGroup.objects.length > 0) {
                tempLeft = activeGroup.get('left') + leftStep;
                tempTop = activeGroup.get('top')+topStep;
                activeGroup.set('left',tempLeft);
                activeGroup.set('top',tempTop);


            }else if (activeObject) {

                tempLeft = activeObject.get('left') + leftStep;
                tempTop = activeObject.get('top')+topStep;
                activeObject.set('left',tempLeft);
                activeObject.set('top',tempTop);

            }

            fabNode.renderAll();

            if (layerMode){
                var layer=_self.getCurrentLayer();
                if (layer){
                    var fabLayer=_self.getFabricObject(layer.id);
                    if (fabLayer){
                        _self.SyncLevelFromFab(layer,fabLayer);
                    }
                }
            }else{
                var widget=_self.getCurrentWidget();
                if (widget){
                    var fabWidget=_self.getFabricObject(widget.id,true);
                    if (fabWidget){
                        _self.SyncLevelFromFab(widget,fabWidget);
                    }
                }
            }

            _self.UpdateCurrentThumb();

            _successCallback && _successCallback();



        };

        /**
         * 辅助
         * 获得一个Layer对象的拷贝
         * @param _layer
         * @private
         */
        function _getCopyLayer(_layer){
            var copyLayer= _.cloneDeep(_layer);
            copyLayer.id=Math.random().toString(36).substr(2);
            if(copyLayer&&copyLayer.info){
                copyLayer.info.left+=10;
                copyLayer.info.top+=10;
            }
            _.forEach(copyLayer.subLayers, function (_subLayer) {
                _subLayer.id=Math.random().toString(36).substr(2);
                var proJson1=JSON.parse(_subLayer.proJsonStr);

                _.forEach(proJson1.objects, function (_fabWidget) {
                    _.forEach(_subLayer.widgets, function (_widget) {

                        if (_widget.id==_fabWidget.id){
                            var newId=Math.random().toString(36).substr(2);
                            _widget.id=newId;
                            _fabWidget.id=newId;
                        }
                    })
                });
                _subLayer.proJsonStr=JSON.stringify(proJson1);

            });
            return copyLayer;
        }

        function _getCopyPage(_page){
            var pageCopy= _.cloneDeep(_page);
            pageCopy.id=Math.random().toString(36).substr(2);   //重置id
            pageCopy.mode=0;    //显示page模式
            var proJson=JSON.parse(pageCopy.proJsonStr);    //改proJson
            _.forEach(proJson.objects, function (_fabLayer) {
                _.forEach(pageCopy.layers, function (_layer) {
                    if (_layer.id==_fabLayer.id){
                        var newId=Math.random().toString(36).substr(2);
                        _layer.id=newId;
                        _fabLayer.id=newId;
                        _fabLayer.layer= _.cloneDeep(_layer);
                    }
                })
            });
            pageCopy.proJsonStr=JSON.stringify(proJson);
            _.forEach(pageCopy.layers, function (_layer) {
                _.forEach(_layer.subLayers, function (_subLayer) {
                    _subLayer.id=Math.random().toString(36).substr(2);
                    var proJson1=JSON.parse(_subLayer.proJsonStr);
                    _.forEach(proJson1.objects, function (_fabWidget) {
                        _.forEach(_subLayer.widgets, function (_widget) {
                            if (_widget.id==_fabWidget.id){
                                var newId=Math.random().toString(36).substr(2);
                                _widget.id=newId;
                                _fabWidget.id=newId;
                            }
                        })
                    });
                    _subLayer.proJsonStr=JSON.stringify(proJson1);
                })
            });
            return pageCopy;
        }

        /**
         * 辅助
         * 获得一个Widget拷贝对象
         * @param _widget
         * @private
         */
        function _getCopyWidget(_widget){
            var copyWidget= _.cloneDeep(_widget);
            var newId=Math.random().toString(36).substr(2);
            copyWidget.id=newId;
            if(copyWidget&&copyWidget.info){
                copyWidget.info.left+=5;
                copyWidget.info.top+=5;
            }
            return copyWidget;
        }


        /**
         * 主要操作
         * 根据序号拷贝一个页面
         * @param _index
         * @param _successCallback
         * @constructor
         */
        this.CopyPageByIndex = function (_index, _successCallback) {
            _self.OnPageSelected(_index, function () {

                shearPagePlate = {
                    type: Type.MyPage,
                    objects: [project.pages[_index]]
                };

                _successCallback&&_successCallback();
            },true);


        };

        this.CopyLayer= function (_layer, _successCallback) {
            var fabLayer=_self.getFabricObject(_layer.id);
            shearPlate = {
                type: Type.MyLayer,
                objects: [_layer],
                mode:0,
                target:fabLayer
            };
            toastr.info('复制成功');
            _successCallback&&_successCallback();

        };
        this.CopyWidget= function (_widget, _successCallback) {
            var copyWidget= _getCopyWidget(_widget);
            var fabWidget=_self.getFabricObject(_widget.id,true);
            shearPlate = {
                type:_widget.type,
                objects: [copyWidget],
                mode:0,
                target:fabWidget
            };
            toastr.info('复制成功');
            _successCallback&&_successCallback();
        }

        this.CopyLayerGroup= function (_groupTarget, _successCallback) {
            var pageIndex= _indexById(project.pages,_self.getCurrentPage());
            var groupCopy= _.cloneDeep(_groupTarget);

            _self.OnPageSelected(pageIndex, function () {
                var layers=_self.getCurrentPage().layers;
                _.forEach(layers, function (_layer) {
                    SyncLevelFromFab(_layer,_self.getFabricObject(_layer.id));
                });

                _self.OnLayerGroupSelected(_createGroup(groupCopy), function () {
                    var layers=[];
                    var fabGroup=_groupTarget;
                    _.forEach(_groupTarget.getObjects(), function (_fabLayer) {
                        var layer=_.cloneDeep(_self.getLevelById(_fabLayer.id));
                        if (!layer){
                            console.warn('layer不存在');
                            return;
                        }
                        layers.push(layer);
                    });
                    shearPlate = {
                        type: Type.MyLayerGroup,
                        objects:layers,
                        mode:0,
                        target:fabGroup
                    };
                    toastr.info('复制成功');
                    _successCallback&&_successCallback();

                })


            })

        };

        this.CopyWidgetGroup= function (_groupTarget, _successCallback) {
            var layerIndex= _indexById(_self.getCurrentPage().layers,_self.getCurrentLayer());
            var subLayerIndex= _indexById(_self.getCurrentLayer().subLayers,_self.getCurrentSubLayer());
            var groupCopy= _.cloneDeep(_groupTarget);
            _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {
                var widgets=_self.getCurrentSubLayer().widgets;
                _.forEach(widgets, function (_widget) {
                    SyncLevelFromFab(_widget,_self.getFabricObject(_widget.id,true));
                });
                _self.OnWidgetGroupSelected(_createGroup(groupCopy,true), function () {
                    var widgets=[];
                    var fabGroup=_groupTarget;
                    _.forEach(_groupTarget.getObjects(), function (_fabWidget) {

                        var widget= _.cloneDeep(_self.getLevelById(_fabWidget.id));
                        _fabWidget.id=widget.id;
                        if (!widget){
                            console.warn('layer不存在');
                            return;
                        }
                        widgets.push(widget);

                    });
                    shearPlate = {
                        type: Type.MyWidgetGroup,
                        objects:widgets,
                        mode:1,
                        target:fabGroup,
                    };
                    toastr.info('复制成功');
                    _successCallback&&_successCallback();
                })



            })

        }
        this.DoPaste= function (_successCallback) {
            //记录新生成Layer或Widget组成员的数组
            var fabLayerItems=[];
            var fabWidgetItems=[];

            if (shearPlate.type==Type.MyLayer){
                var newLayer= _getCopyLayer(shearPlate.objects[0]);
                newLayer.$$hashKey=undefined;
                _self.AddNewLayerInCurrentPage(newLayer,_successCallback);

            }else if (shearPlate.type==Type.MyGroup&&shearPlate.mode==0){
                //粘贴LayerGroup
                //添加Layer然后选中Group
                addLayers(0, function () {
                    _self.OnLayerGroupSelected(new fabric.Group(fabLayerItems),_successCallback,true);

                })
            }else if (Type.isWidget(shearPlate.type)){
                var newWidget= _getCopyWidget(shearPlate.objects[0]);
                newWidget.$$hashKey=undefined;
                _self.AddNewWidgetInCurrentSubLayer(newWidget,_successCallback);

            }else if (shearPlate.type==Type.MyGroup&&shearPlate.mode==1){
                //粘贴widgetGroup
                //添加widget然后选中Group
                addWidgets(0, function () {

                    _self.OnWidgetGroupSelected(new fabric.Group(fabWidgetItems),_successCallback);
                })
            }

            /**
             * 递归函数,往当前Page添加Layer数组
             * @param _index 当前Layer的index
             * @param _callback 递归的出口
             */
            function addLayers(_index,_callback){

                var layer=_getCopyLayer(shearPlate.objects[_index]);
                layer.$$hashKey=undefined;
                _self.AddNewLayerInCurrentPage(layer, function (_fabLayer) {
                    //如果不是Group中最后一个Layer,继续添加下一个
                    //否则运行回调
                    fabLayerItems.push(_fabLayer);
                    if (_index==shearPlate.objects.length-1){
                        _callback&&_callback();
                        return;
                    }
                    addLayers(_index+1,_callback);
                })
            }

            /**
             * 递归函数,往当前SubLayer添加Widget数组
             * @param _index 当前Layer的index
             * @param _callback 递归的出口
             */
            function addWidgets(_index,_callback){
                var widget=_getCopyWidget(shearPlate.objects[_index]);
                widget.$$hashKey=undefined;
                _self.AddNewWidgetInCurrentSubLayer(widget, function (_fabWidget) {
                    //如果不是Group中最后一个Layer,继续添加下一个
                    //否则运行回调

                    fabWidgetItems.push(_fabWidget);

                    if (_index==shearPlate.objects.length-1){
                        _callback&&_callback();
                        return;
                    }
                    addWidgets(_index+1,_callback);
                })
            }

        }
        /**
         * 主要操作
         * 根据序号粘贴一个页面
         * @param _successCallback
         * @constructor
         */
        this.PastePageByIndex = function (_successCallback) {

            if (shearPagePlate.type != Type.MyPage) {
                console.warn('当前剪切板中不是页面');
                return;
            }

            var pastePage = _getCopyPage(shearPagePlate.objects[0]);


            pastePage.id = Math.random().toString(36).substr(2);
            pastePage.$$hashKey = undefined;
            this.AddNewPage(pastePage, function () {
                _successCallback && _successCallback();
            });


        };

        //var holdOperate={};
        /**
         * 主要操作
         * 拿起一个可操作对象
         * @param status
         * @param _successCallback
         */
        this.HoldObject = function (status, _successCallback) {

            status.holdOperate = SaveCurrentOperate();
            _successCallback && _successCallback();
        };
        var scalingOperate={
            scaling:false,
            objId:''
        };
        this.ScaleLayer= function (status, _successCallback) {
            scalingOperate.scaling=true;
            scalingOperate.objId=getCurrentSelectObject().level.id;
            var layer=getCurrentLayer();
            status.holdOperate = SaveCurrentOperate();
            _successCallback && _successCallback();
        }

        /**
         * 主要操作
         * 放下一个可操作对象
         * @param status
         * @param _successCallback
         * @constructor
         */
        this.ReleaseObject = function (status, _successCallback) {
            var selectObj=getCurrentSelectObject();

            //如果缩放了Layer,需要和subLayer同步
            if (scalingOperate.scaling){
                scalingOperate.scaling=false;
                scalingOperate.objId='';
                if (selectObj.type==Type.MyLayer){
                    _self.SyncSubLayerImage(selectObj.level,selectObj.level.showSubLayer, function () {
                        selectObj.target.fire('OnScaleRelease',selectObj.target.id);
                    })
                }

            }

            if (selectObj.type==Type.MyLayer){
                selectObj.target.fire('OnRelease',selectObj.target.id);

            }else if (selectObj.type==Type.MyGroup&&selectObj.mode==0) {
                _.forEach(selectObj.target.getObjects(), function (_obj) {
                    var fabLayer = getFabricObject(_obj.id);
                    fabLayer.fire('OnRelease', fabLayer.id);
                })
            }
            else if (Type.isWidget(selectObj.type)){
                selectObj.target.fire('OnRelease',selectObj.target.id);

            }else if (selectObj.type==Type.MyGroup&&selectObj.mode==1){
                _.forEach(selectObj.target.getObjects(), function (_obj) {
                    var fabWidget=getFabricObject(_obj.id,true);
                    fabWidget.fire('OnRelease',fabWidget.id);
                })
            }



            if (status.holdOperate) {
                var currentPage=_self.getCurrentPage();
                if (!currentPage){
                    console.warn('找不到Page');
                    return;
                }
                currentPage.proJsonStr =
                    JSON.stringify(CanvasService.getPageNode().toJSON());
                //console.log(currentPage.proJsonStr);

                var currentSubLayer=_self.getCurrentSubLayer();
                if (currentSubLayer){

                    currentSubLayer.proJsonStr=JSON.stringify(CanvasService.getSubLayerNode().toJSON());

                }



                _successCallback && _successCallback();


            }



        };


        this.SaveCurrentOperate= function () {

            var currentPage=_self.getCurrentPage();
            var pageNode=CanvasService.getPageNode();
            //currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
            //console.log(currentPage.proJsonStr);

            var currentSubLayer=_self.getCurrentSubLayer();
            if (currentSubLayer){
                var subLayerNode=CanvasService.getSubLayerNode();

                //currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
            }
            return _.cloneDeep(project);

        };

        this.LoadCurrentOperate = function (_operate, _successCallback,_errCallback) {
            project=_operate;

            _cleanPageHashKey();
            var pageNode=CanvasService.getPageNode();
            var subCanvasNode=CanvasService.getSubLayerNode();
            _.forEach(project.pages, function (_page,_pageIndex) {
                if (_page.current){
                    if (_page.selected){
                        _self.OnPageSelected(_pageIndex,_successCallback,true,false,_errCallback);
                        return;
                    }
                    if (_page.currentFabLayer&&_page.currentFabLayer.type!=Type.MyLayer){
                        _self.OnLayerGroupSelected(_createGroup(_page.currentFabLayer),_successCallback,true);
                        return;
                    }
                    _.forEach(_page.layers, function (_layer, _layerIndex) {
                        if (_layer.current){
                            if (_layer.selected){
                                _self.OnLayerSelected(_layer,_successCallback,true);
                                return;
                            }

                            _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {
                                if (_subLayer.current){
                                    if (_subLayer.selected){
                                        _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);
                                        return;
                                    }

                                    if (!Type.isWidget(_subLayer.currentFabWidget.type)){

                                        //选中组
                                        _self.OnWidgetGroupSelected(_createGroup(_subLayer.currentFabWidget,true),_successCallback,true);
                                        return;
                                    }
                                    _.forEach(_subLayer.widgets, function (_widget) {
                                        if (_widget.current){
                                            if (_widget.selected){
                                                _self.OnWidgetSelected(_widget,_successCallback,true);
                                            }
                                        }
                                    })
                                }
                            })
                        }

                    })
                }
            });



        };


        /**
         * 次要操作
         * Page空白被点击后的响应
         * @param pageIndex         序号
         * @param _successCallback  回调
         * @param skipClean         是否跳过[清理currentFabLayerIdList]
         * @constructor
         */
        this.OnPageClicked= function (pageIndex, _successCallback,skipClean) {
            if (pageIndex<0){
                console.warn('找不到Page');
                return;
            }
            if (!skipClean){
                _self.currentFabLayerIdList=[];

            }
            _self.currentFabWidgetIdList=[];
            _.forEach(project.pages, function (_page,_pageIndex) {
                    if (_pageIndex != pageIndex) {
                        _page.selected = false;
                        _page.current = false;
                    } else {
                        _page.selected = true;
                        _page.current = true;
                        _page.currentFabLayer = null;
                    }
                    _.forEach(_page.layers, function (_layer) {
                        _layer.selected = false;
                        _layer.current = false;
                        _.forEach(_layer.subLayers, function (_subLayer) {
                            _subLayer.selected = false;
                            _subLayer.current = false;
                            _subLayer.currentFabWidget = null;

                            _.forEach(_subLayer.widgets, function (_widget) {
                                _widget.selected = false;
                                _subLayer.current = false;
                            })
                        })
                    })

                }
            );
            _successCallback&&_successCallback();


        };

        /**
         * 次要操作
         * 选择一个Page
         * @param pageIndex 序号
         * @param _successCallback  回调
         * @param forceReload   是否强制刷新
         * @param skipClean 跳过[清理选中的缓存]
         * @constructor
         */
        this.OnPageSelected= function (pageIndex,_successCallback,forceReload,skipClean,_errCallback) {
            //除了当前的Page,取消所有Page,Layer,SubLayer,Widget的current

            //如果当前在编辑Page,需要使所有Layer失焦,如果在编辑SubLayer,需要重新loadFromJSON
            var currentPage=project.pages[pageIndex];

            if (!currentPage){
                currentPage=_self.getCurrentPage();
            }
            if (!currentPage){
                console.warn('找不到Page');
                return;
            }

            var editInSamePage=false;
            if (!_self.getCurrentPage()){
                editInSamePage=true;

            }
            else if (_self.getCurrentPage()&&_self.getCurrentPage().id==currentPage.id){
                editInSamePage=true;
            }
            var pageNode = CanvasService.getPageNode();



            if (currentPage.mode==0&&editInSamePage&&!forceReload){
                _self.OnPageClicked(pageIndex,null,skipClean);
                pageNode.deactivateAll();
                pageNode.renderAll();
                currentPage.proJsonStr=pageNode.toJSON();

                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                _successCallback && _successCallback();
            }else if (currentPage.mode==1){
                _backToPage(currentPage, function () {
                    _self.OnPageClicked(pageIndex,null,skipClean);
                    pageNode.deactivateAll();

                    pageNode.renderAll();
                    currentPage.proJsonStr=pageNode.toJSON();

                    currentPage.mode=0;
                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                    _successCallback && _successCallback();

                });
            }else{
                pageNode.setBackgroundImage(null, function () {
                    pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                        _self.OnPageClicked(pageIndex,null,skipClean);

                        pageNode.deactivateAll();
                        pageNode.renderAll();
                        currentPage.proJsonStr=pageNode.toJSON();


                        currentPage.mode=0;
                        currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                        _successCallback && _successCallback();


                    });

                });
            }

        };




        /**
         * 当前选中的layer列表
         * @type {Array}
         */
        this.currentFabLayerIdList=[];
        this.currentFabWidgetIdList=[];
        this.OnLayerClicked= function (_target,_successCallback) {
            //除了选中的layer,清除所有Layer,SubLayer,Widget的current
            _self.currentFabWidgetIdList=[];


            var currentPage=_self.getCurrentPage();
            if (!currentPage){
                console.warn('找不到Page');
                return;
            }
            currentPage.selected=false;



            _.forEach(currentPage.layers, function (_layer) {
                if (_target.id==_layer.id){

                    _layer.current=true;
                    _layer.selected=true;
                    currentPage.currentFabLayer=_target;
                    _target.hasControls=true;

                    SyncLevelFromFab(_layer,_target);
                }else if (belongToGroup(_layer,_target)){

                    _target.lockScalingX=true;
                    _target.lockScalingY=true;
                    _layer.current=false;
                    _layer.selected=true;
                    currentPage.currentFabLayer=_target;
                    var controlsVisibility=Preference.GROUP_CONTROL_VISIBLE;
                    _target.setControlsVisibility(controlsVisibility);

                }else {
                    _layer.current=false;
                    _layer.selected=false;

                }
                _.forEach(_layer.subLayers, function (_subLayer) {
                    _subLayer.selected=false;
                    _subLayer.current=false;
                    _subLayer.currentFabWidget=null;
                    _.forEach(_subLayer.widgets, function (_widget) {
                        _widget.selected=false;
                        _subLayer.current=false;
                    })
                })
            });

            _successCallback&&_successCallback();
        };
        /**
         * 在多选模式下的选择
         * @constructor
         */
        this.OnLayerMultiSelected= function (_successCallback) {
            var currentFabLayerIdList=_self.currentFabLayerIdList;
            var pageNode=CanvasService.getPageNode();


            var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());

            if (currentFabLayerIdList.length>1){
                _self.OnPageSelected(currentPageIndex, function () {

                    var fabLayerList=[];
                    pageNode.forEachObject(function (fabLayer) {
                        if (_indexById(currentFabLayerIdList,fabLayer.id)>=0){
                            fabLayerList.push(fabLayer);
                        }
                    })
                    if (fabLayerList.length!=currentFabLayerIdList.length){
                        console.warn('数据不一致');
                    }
                    var fabGroup=new fabric.Group(fabLayerList,{
                        canvas:pageNode
                    });
                    _self.OnLayerGroupSelected(fabGroup,_successCallback,false);
                },false,true)

            }else if (currentFabLayerIdList.length==1){
                _self.OnPageSelected(currentPageIndex, function () {

                    _self.OnLayerSelected(_self.getLevelById(currentFabLayerIdList[0]),_successCallback,false);
                },false,true)

            }else{
                console.warn('currentFabLayerIdList为空');
            }


        };

        /**
         * 次要操作
         * 双击Layer
         * @param _layerId
         * @param _successCallback
         * @constructor
         */
        this.OnLayerDoubleClicked=function(_layerId,_successCallback){

            var currentPage=_self.getCurrentPage();
            var currentPageIndex=_indexById(project.pages,currentPage);
            var currentLayer=_self.getLevelById(_layerId);
            var layerIndex=_indexById(currentPage.layers,currentLayer);

            var subLayerIndex=-1;

            _.forEach(currentLayer.subLayers,function (_subLayer, _index) {
                if (_subLayer.id==currentLayer.showSubLayer.id){
                    subLayerIndex=_index;
                }
            })
            //console.log(currentPageIndex+'/'+layerIndex+'/'+subLayerIndex);
            _self.OnPageSelected(currentPageIndex,function () {
                _self.OnSubLayerSelected(layerIndex,subLayerIndex,_successCallback,true);

            });
        }
        this.OnWidgetMultiSelected= function (_successCallback) {
            var currentFabWidgetIdList=_self.currentFabWidgetIdList;
            var subLayerNode=CanvasService.getSubLayerNode();

            var layerIndex= _indexById(_self.getCurrentPage().layers,_self.getCurrentLayer());
            var subLayerIndex= _indexById(_self.getCurrentLayer().subLayers,_self.getCurrentSubLayer());

            if (currentFabWidgetIdList.length>1){
                _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {

                    var fabWidgetList=[];
                    subLayerNode.forEachObject(function (fabWidget) {
                        if (_indexById(currentFabWidgetIdList,fabWidget.id)>=0){
                            fabWidgetList.push(fabWidget);
                        }
                    })
                    if (fabWidgetList.length!=currentFabWidgetIdList.length){
                        console.warn('数据不一致');
                    }
                    var fabGroup=new fabric.Group(fabWidgetList,{
                        canvas:subLayerNode
                    });
                    _self.OnWidgetGroupSelected(fabGroup,_successCallback,false);
                },false,true)
            }else if (currentFabWidgetIdList.length==1){

                _self.OnSubLayerSelected(layerIndex,subLayerIndex, function () {

                    _self.OnWidgetSelected(_self.getLevelById(currentFabWidgetIdList[0]),_successCallback,false);
                },false,true)

            }else{
                console.warn('currentFabWidgetList为空');
            }


        }
        /**
         * 次要操作
         * 选中Layer组
         * @param fabGroup
         * @param _successCallback
         * @param forceReload
         * @param preventPop
         * @constructor
         */
        this.OnLayerGroupSelected= function (fabGroup, _successCallback, forceReload,preventPop) {
            var currentPage=_self.getCurrentPage();
            if (!currentPage){
                console.warn('找不到Page');
                return;
            }
            //如果当前在编辑Page,需要选择Layer,如果在编辑SubLayer,需要重新loadFromJSON
            var pageNode = CanvasService.getPageNode();
            if (currentPage.mode==0&&!forceReload){
                currentPage.currentFabLayer=fabGroup;
                var currentFabLayer= currentPage.currentFabLayer;
                pageNode.setActive(currentFabLayer);
                currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                pageNode.renderAll();
                currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                //console.log(currentPage.proJsonStr);

                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                _successCallback && _successCallback();
            }else {
                _backToPage(currentPage, function () {
                    currentPage.currentFabLayer=fabGroup;
                    var currentFabLayer= _createGroup(currentPage.currentFabLayer);
                    pageNode.setActive(currentFabLayer);
                    currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                    pageNode.renderAll();
                    currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                    //console.log(currentPage.proJsonStr);

                    currentPage.mode=0;
                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                    _successCallback && _successCallback();

                });
            }
        };

        /**
         * 次要操作
         * stage以外选中Layer
         * @param _layer Layer对象
         * @param _successCallback  回调
         * @param forceReload   是否强制刷新
         * @param _fabLayer
         * @constructor
         */
        this.OnLayerSelected= function (_layer,_successCallback,forceReload,_fabLayer) {
            var currentPage=_self.getCurrentPage();
            if (!currentPage){
                console.warn('找不到Page');
                return;
            }

            //如果当前在编辑Page,需要选择Layer,如果在编辑SubLayer,需要重新loadFromJSON
            var pageNode = CanvasService.getPageNode();

            if (currentPage.mode==0&&!forceReload){

                pageNode.deactivateAll();
                pageNode.renderAll();

                currentPage.currentFabLayer=_fabLayer?_fabLayer:getFabricObject(_layer.id);
                var currentFabLayer=currentPage.currentFabLayer;
                //console.log('currentFabLayer',currentFabLayer);

                pageNode.setActive(currentFabLayer);

                currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);
                pageNode.renderAll();
                currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                //console.log(currentPage.proJsonStr);

                currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                _self.SyncSubLayerImage(_layer,_layer.showSubLayer, function () {
                    _successCallback&&_successCallback(currentFabLayer)
                });
            }else {
                _backToPage(currentPage, function () {
                    currentPage.currentFabLayer=getFabricObject(_layer.id);
                    var currentFabLayer= currentPage.currentFabLayer;


                    pageNode.deactivateAll();
                    pageNode.renderAll();

                    pageNode.setActive(currentFabLayer);
                    currentPage.currentFabLayer= _.cloneDeep(currentFabLayer);

                    pageNode.renderAll();
                    currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());

                    currentPage.mode=0;
                    currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});

                    _self.SyncSubLayerImage(_layer,_layer.showSubLayer, function () {
                        _successCallback&&_successCallback(currentFabLayer);
                    });



                });
                //for fix scale bug!!!
                //var currentPageIndex= _indexById(project.pages, currentPage);
                //var layer = getCurrentLayer();
                //_self.OnPageSelected(currentPageIndex,function () {
                //    //$rootScope.$emit('ChangeCurrentPage',null, function () {});
                //},false);
                //
                //$timeout(function () {
                //    _self.OnLayerSelected(layer,function(){
                //        $rootScope.$emit('ChangeCurrentPage',null,function(){});
                //    },false);
                //},1);

            }


        };
        this.OnSubLayerClicked= function (layerIndex,subLayerIndex,_successCallback) {
            _self.currentFabLayerIdList=[];


            var currentPage=_self.getCurrentPage();
            var currentLayer=currentPage.layers[layerIndex];
            var currentSubLayer=currentLayer.subLayers[subLayerIndex];
            currentPage.selected=false;
            _.forEach(currentPage.layers, function (_layer,_layerIndex) {
                if (layerIndex>=0){
                    if (_layerIndex==layerIndex) {
                        _layer.current = true;
                        _layer.selected = false;
                        currentLayer = _layer;

                    }else {
                        _layer.current=false;
                        _layer.selected=false;
                    }
                }

                _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {
                    if (subLayerIndex>=0){
                        if (_subLayerIndex==subLayerIndex&&_layerIndex==layerIndex){
                            _subLayer.current=true;
                            _subLayer.selected=true;
                            currentSubLayer=_subLayer;
                            currentSubLayer.currentFabWidget=null;


                        }else {
                            _subLayer.current=false;
                            _subLayer.selected=false;
                        }
                    }

                    _.forEach(_subLayer.widgets, function (_widget) {
                        _widget.current=false;
                        _widget.selected=false;
                    })

                })

            });

            _successCallback&&_successCallback();
        };
        this.OnSubLayerSelected= function (layerIndex,subLayerIndex,_successCallback,forceReload) {


            //除了当前的SubLayer,取消所有Page,Layer,SubLayer,Widget的current
            var currentPage=_self.getCurrentPage();

            if (!currentPage){
                console.warn('找不到Page');
                return;
            }

            //如果当前正在编辑subLayer,需要保存之前的subLayer再跳转
            if (currentPage.mode==1){
                _leaveFromSubLayer(_self.getCurrentSubLayer());
            }
            try{
                var currentLayer=currentPage.layers[layerIndex];

            }catch(e){
                console.log(e);
            }

            var currentSubLayer=currentLayer.subLayers[subLayerIndex];

            if (!currentSubLayer){
                console.warn('找不到SubLayer');
                return;
            }

            drawBackgroundCanvas(currentLayer.info.width,currentLayer.info.height,currentLayer.info.left,currentLayer.info.top);

            var editInSameSubLayer=false;
            if (getCurrentSubLayer()&&getCurrentSubLayer().id==currentSubLayer.id){
                editInSameSubLayer=true;
            }

            OnSubLayerClicked(layerIndex,subLayerIndex);

            //如果当前在编辑SubLayer,需要使所有Widget失焦,如果在编辑Page,需要重新loadFromJSON
            var subLayerNode = CanvasService.getSubLayerNode();

            var fabLayer=getFabricObject(currentLayer.id);
            if (currentPage.mode==1&&editInSameSubLayer&&!forceReload){

                //subLayerNode.setWidth(currentLayer.info.width);
                //subLayerNode.setHeight(currentLayer.info.height);
                _self.ScaleCanvas('subCanvas',currentLayer);

                subLayerNode.deactivateAll();
                subLayerNode.renderAll();

                currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());


                _successCallback && _successCallback();


            }
            else {
                subLayerNode.clear();
                subLayerNode.setBackgroundImage(null, function () {
                    subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {


                        _self.ScaleCanvas('subCanvas',currentLayer);

                        subLayerNode.deactivateAll();
                        subLayerNode.renderAll();
                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                        currentPage.mode=1;



                        renderingSubLayer=false;

                        _successCallback && _successCallback();
                    });

                });
                //console.log('');

            }
        };
        var renderingSubLayer=false;

        /**
         * 次要操作
         * 当Layer在Page中发生了缩放时
         * 改变SubLayerNode画布并截图,贴到Layer上
         * @param layer
         * @param subLayer
         * @param _successCallback
         * @constructor
         */
        this.SyncSubLayerImage= function (layer,subLayer,_successCallback) {
            if (renderingSubLayer){
                return;
            }
            renderingSubLayer=true;
            var subLayerNode=CanvasService.getSubLayerNode();
            var currentSubLayer=subLayer;
            var currentLayer=layer;

            if (currentLayer.showSubLayer.backgroundImage&&currentLayer.showSubLayer.backgroundImage!=''){
                subLayerNode.clear();


                subLayerNode.loadFromJSON(currentLayer.showSubLayer.proJsonStr, function () {
                    //subLayerNode.setWidth(currentLayer.info.width);
                    //subLayerNode.setHeight(currentLayer.info.height);
                    _self.ScaleCanvas('subCanvas',currentLayer);

                    subLayerNode.setBackgroundImage(currentLayer.showSubLayer.backgroundImage, function () {

                            subLayerNode.deactivateAll();
                        subLayerNode.renderAll();
                        currentSubLayer.proJsonStr=subLayerNode.toJSON();

                        currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                        renderingSubLayer=false;

                        _successCallback && _successCallback();
                    },{
                        width:currentLayer.info.width,
                        height:currentLayer.info.height
                        })


                })
            }
            else {
                //subLayerNode.clear();


                subLayerNode.setBackgroundImage(null, function () {

                    subLayerNode.setBackgroundColor(currentLayer.showSubLayer.backgroundColor, function () {
                        subLayerNode.loadFromJSON(currentLayer.showSubLayer.proJsonStr, function () {

                            //subLayerNode.setWidth(currentLayer.info.width);
                            //subLayerNode.setHeight(currentLayer.info.height);
                            _self.ScaleCanvas('subCanvas',currentLayer);

                            subLayerNode.deactivateAll();
                            subLayerNode.renderAll();
                            currentSubLayer.proJsonStr= subLayerNode.toJSON();
                            currentSubLayer.url = subLayerNode.toDataURL({format:'png'});

                            renderingSubLayer = false;
                            _successCallback && _successCallback();
                        });
                    })
                });


            }



        };
        this.OnWidgetClicked= function (_target, _successCallback) {
            //除了选中的layer,清除所有Layer,SubLayer,Widget的current


            _self.currentFabLayerIdList=[];

            var currentPage=_self.getCurrentPage();
            currentPage.selected=false;

            if (!currentPage){
                console.warn('找不到Page');
                return;
            }
            currentPage.selected=false;
            _.forEach(currentPage.layers, function (_layer) {
                _layer.current=false;
                _layer.selected=false;

                _.forEach(_layer.subLayers, function (_subLayer) {
                    _subLayer.selected=false;
                    _subLayer.current=false;
                    _.forEach(_subLayer.widgets, function (_widget) {

                        if (_widget.id==_target.id){

                            _widget.selected=true;
                            _widget.current=true;

                            _subLayer.current=true;
                            _subLayer.currentFabWidget= _.cloneDeep(_target);
                            _layer.current=true;

                            _target.hasControls=true;
                            SyncLevelFromFab(_widget,_target);


                        }else if (belongToGroup(_widget,_target)){

                            _widget.selected=true;
                            _widget.current=false;
                            _subLayer.current=true;
                            _layer.current=true;
                            _subLayer.currentFabWidget= _.cloneDeep(_target);

                            //组的缩放要隐藏
                            var controlsVisibility=Preference.GROUP_CONTROL_VISIBLE;
                            _target.setControlsVisibility(controlsVisibility);
                        } else {

                            _widget.selected=false;
                            _widget.current=false;
                        }
                    })
                })
            });
            _successCallback&&_successCallback();

        };
        var OnWidgetSelected=this.OnWidgetSelected= function (_widget,_successCallback,forceReload,_fabWidget) {

            var currentPage=_self.getCurrentPage();

            //如果当前正在编辑subLayer,需要保存之前的subLayer再跳转
            if (currentPage.mode==1){
                //_leaveFromSubLayer(_self.getCurrentSubLayer());
            }

            var currentSubLayer=null;
            var currentLayer=null;

            _.forEach(currentPage.layers, function (_layer) {
                _.forEach(_layer.subLayers, function (_subLayer) {
                    _.forEach(_subLayer.widgets, function (widget) {

                        if (widget.id==_widget.id){
                            currentSubLayer=_subLayer;
                            currentLayer=_layer;
                        }
                    })
                })
            });

            if (!currentPage){
                console.warn('找不到Page');
                return;
            }
            if (!currentSubLayer){
                console.warn('找不到SubLayer');
                return;
            }

            var editInSameSubLayer=false;
            if (getCurrentSubLayer()&&getCurrentSubLayer().id==currentSubLayer.id){
                editInSameSubLayer=true;
            }

            //如果当前在编辑SubLayer,需要选择Widget,如果在编辑Page,需要重新loadFromJSON
            var subLayerNode = CanvasService.getSubLayerNode();

            if (currentPage.mode==1&&editInSameSubLayer&&!forceReload){
                //console.log('----');
                _self.ScaleCanvas('subCanvas',currentLayer);
                subLayerNode.deactivateAll();

                subLayerNode.renderAll();
                currentSubLayer.currentFabWidget=_fabWidget?_fabWidget:getFabricObject(_widget.id,true);

                var currentFabWidget= currentSubLayer.currentFabWidget;
                subLayerNode.setActive(currentFabWidget);
                //console.log('subLayerNode toJson',subLayerNode.toJSON());
                currentSubLayer.currentFabWidget= _.cloneDeep(currentFabWidget);

                currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                //console.log('currentSubLayer',currentSubLayer.proJsonStr);

                subLayerNode.renderAll();

                _successCallback && _successCallback(currentFabWidget);
            }else {
                subLayerNode.clear();
                subLayerNode.setBackgroundImage(null, function () {

                    subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {
                        //subLayerNode.setWidth(currentLayer.info.width);
                        //subLayerNode.setHeight(currentLayer.info.height);
                        _self.ScaleCanvas('subCanvas',currentLayer);
                        subLayerNode.deactivateAll();

                        subLayerNode.renderAll();

                        currentSubLayer.currentFabWidget=getFabricObject(_widget.id,true);

                        var currentFabWidget= currentSubLayer.currentFabWidget;
                        subLayerNode.setActive(currentFabWidget);
                        currentSubLayer.currentFabWidget=_.cloneDeep(currentFabWidget);

                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                        subLayerNode.renderAll();
                        currentPage.mode=1;
                        _successCallback && _successCallback(currentFabWidget);
                    });

                })
            }

        };
        /**
         * 选择WidgetGroup
         * @param fabWidgets    klass数组
         * @param fabGroup      fabric group对象,获取位置用
         * @param _successCallback
         * @param forceReload
         * @constructor
         */
        this.OnWidgetGroupSelected= function (fabGroup, _successCallback, forceReload) {

            var currentPage=_self.getCurrentPage();
            var currentSubLayer=_self.getCurrentSubLayer();

            var subLayerNode = CanvasService.getSubLayerNode();

            if (currentPage.mode==1&&!forceReload){

                currentSubLayer.currentFabwidget =fabGroup;
                var currentFabWidget=currentSubLayer.currentFabwidget;
                subLayerNode.setActive(currentFabWidget);
                currentSubLayer.currentFabwidget= _.cloneDeep(currentFabWidget);
                subLayerNode.renderAll();


                currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                _successCallback && _successCallback();
            }else {
                subLayerNode.clear();
                subLayerNode.setBackgroundImage(null, function () {

                    subLayerNode.loadFromJSON(currentSubLayer.proJsonStr, function () {
                        subLayerNode.renderAll();
                        currentSubLayer.currentFabwidget=fabGroup;

                        //重载时,需要重新创建一个group
                        var currentFabWidget=_createGroup(currentSubLayer.currentFabwidget,true);
                        subLayerNode.setActive(currentFabWidget);
                        currentSubLayer.currentFabwidget= _.cloneDeep(currentFabWidget);
                        subLayerNode.renderAll();
                        currentPage.mode=1;

                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());

                        currentSubLayer.url=subLayerNode.toDataURL({format:'png'});
                        _successCallback && _successCallback();
                    });

                })
            }
        };

        this.OnSelectAll= function (_successCallback) {
            if (_self.isEditingPage()){
                //如果在编辑Page,选中所有的Layer
                var pageNode=CanvasService.getPageNode();
                var currentPage=_self.getCurrentPage();
                var fabObjects=pageNode.getObjects();
                if (fabObjects.length==0){
                    return;
                }else if (fabObjects.length==1){
                    //只有一个Layer则直接选中
                    _self.OnLayerSelected(currentPage.layers[0],_successCallback);

                }else {
                    var fabGroup=new fabric.Group(fabObjects,{
                        originX:'left',originY:'top'
                    });
                    //只有一个Layer则直接选中
                    _self.OnLayerGroupSelected(fabGroup,_successCallback);

                }
            }else {
                //如果在编辑SubCanvas,选中所有Widget
                var subLayerNode=CanvasService.getSubLayerNode();
                var currentSubLayer=_self.getCurrentSubLayer();
                var fabWidgets=subLayerNode.getObjects();
                if (fabWidgets.length==0){
                }else if (fabWidgets.length==1){
                    //只有一个Layer则直接选中
                    _self.OnWidgetSelected(currentSubLayer.widgets[0],_successCallback);

                }else {
                    var fabGroup=new fabric.Group(fabWidgets,{
                        originX:'left',originY:'top'
                    })
                    //只有一个Layer则直接选中
                    _self.OnWidgetGroupSelected(fabGroup,_successCallback);

                }
            }
        }
        var SyncLevelFromFab=this.SyncLevelFromFab=function(level,fabNode){
            level.info.width=parseInt((fabNode.getWidth()).toFixed(0));
            level.info.height=parseInt((fabNode.getHeight()).toFixed(0));
            level.info.left=parseInt((fabNode.getLeft()).toFixed(0));
            level.info.top=parseInt((fabNode.getTop()).toFixed(0));

            if (level.type==Type.MyButtonGroup){
                //如果是按钮组,要同步放大其间距
                if (level.info.arrange=='horizontal'){
                    //横向用scaleX
                    level.info.interval=level.info.intervalScale*fabNode.getWidth();
                }else {
                    //纵向
                    level.info.interval=level.info.intervalScale*fabNode.getHeight();
                }
            }


        }

        /**
         *更新当前Page的预览图
         * @param _callback
         * @constructor
         */
        this.UpdateCurrentThumb = function (_callback) {
            var pageNode = CanvasService.getPageNode();
            var currentPage=_self.getCurrentPage();
            // $timeout(function () {
            //
            //     currentPage.url = pageNode.toDataURL({format:'jpeg',quality:'0.2'});
            //     _callback && _callback();
            // })

            currentPage.url = pageNode.toDataURL({format: 'jpeg', quality: '0.2'});
            _callback && _callback();
        };

        this.updateCurrentThumbInPage = function () {
            var subLayerNode = CanvasService.getSubLayerNode();
            if (!getCurrentLayer()) {
                console.warn('当前Layer为空');
                return;
            }
            getCurrentLayer().url = subLayerNode.toDataURL({format:'png'});
        };

        this.ChangeAttributeName= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=getCurrentSelectObject();
            object.level.name=_option.name;
            _successCallback&&_successCallback(currentOperate);
        };

        this.ChangeAttributeBackgroundColor= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=getCurrentSelectObject();
            switch (object.type){
                case Type.MyPage:
                    var currentPage=_self.getCurrentPage();
                    var pageNode=CanvasService.getPageNode();
                    pageNode.setBackgroundColor(_option.color, function () {
                        pageNode.renderAll();
                        currentPage.backgroundColor=_option.color;
                        currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                        //console.log(currentPage.proJsonStr);

                        var currentPageIndex= _indexById(project.pages, currentPage);
                        _self.OnPageSelected(currentPageIndex, function () {
                            _successCallback&&_successCallback(currentOperate);
                        });
                    });

                    break;

                case Type.MySubLayer:
                    var currentSubLayer=getCurrentSubLayer();
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.setBackgroundColor(_option.color, function () {
                        subLayerNode.renderAll();
                        currentSubLayer.backgroundColor=_option.color;

                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        var currentPageIndex= _indexById(project.pages, _self.getCurrentPage());
                        var currentLayerIndex=_indexById(project.pages[currentPageIndex].layers,_self.getCurrentLayer());
                        var currentSubLayerIndex= _indexById(project.pages[currentPageIndex].layers[currentLayerIndex].subLayers, _self.getCurrentSubLayer());
                        _self.OnSubLayerSelected(currentPageIndex,currentSubLayerIndex, function () {
                            _successCallback&&_successCallback(currentOperate);
                        });
                    })
            }

        };


        this.ChangeAttributeBackgroundImage= function (_option,_successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=getCurrentSelectObject();
            var currentPage=_self.getCurrentPage();

            switch (object.type){
                case Type.MyPage:
                    var pageNode=CanvasService.getPageNode();
                    pageNode.setBackgroundImage(_option.image, function () {
                        pageNode.renderAll();
                        currentPage.backgroundImage=_option.image;
                        currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());
                            //console.log(currentPage.proJsonStr);

                            var currentPageIndex= _indexById(project.pages, currentPage);
                        _self.OnPageSelected(currentPageIndex, function () {
                            _successCallback&&_successCallback(currentOperate);
                        });
                    }
                        ,{
                        width:pageNode.getWidth()/pageNode.getZoom(),
                        height:pageNode.getHeight()/pageNode.getZoom()
                    }
                    );

                    break;

                case Type.MySubLayer:
                    var currentLayer=getCurrentLayer();
                    var currentSubLayer=getCurrentSubLayer();
                    var subLayerNode=CanvasService.getSubLayerNode();
                    subLayerNode.setBackgroundImage(_option.image, function () {
                        subLayerNode.renderAll();
                        currentSubLayer.backgroundImage=_option.image;

                        currentSubLayer.proJsonStr=JSON.stringify(subLayerNode.toJSON());
                        var currentLayerIndex= _indexById(_self.getCurrentPage().layers, currentLayer);

                        var currentSubLayerIndex= _indexById(currentLayer.subLayers, currentSubLayer);
                        _self.OnSubLayerSelected(currentLayerIndex,currentSubLayerIndex, function () {
                            _successCallback&&_successCallback(currentOperate);
                        });
                    },{
                        width:currentLayer.info.width,
                        height:currentLayer.info.height

                    })
            }
        };

        this.ChangeAttributePressImage=function (_option,_successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            if (!_option.image||_option.image==''){
                console.warn('内容为空');
                return;
            }
            selectObj.level.pressImg=_option.image;
        };

        this.ChangeAttributeButtonText=function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var fabTextObj=getFabricObject(selectObj.level.id,true);
            var arg={
                level:selectObj.level,
                callback:function () {
                    var currentWidget=selectObj.level;
                    OnWidgetSelected(currentWidget,_successCallback);
                }
            };

            if(_option.hasOwnProperty('text')){
                selectObj.level.info.text=_option.text;
                arg.text=_option.text;
            }
            if(_option.fontFamily){
                selectObj.level.info.fontFamily=_option.fontFamily;
                arg.fontFamily=_option.fontFamily;
            }
            if(_option.fontSize){
                selectObj.level.info.fontSize=_option.fontSize;
                arg.fontSize=_option.fontSize;
            }
            if(_option.fontColor){
                selectObj.level.info.fontColor=_option.fontColor;
                arg.fontColor=_option.fontColor;
            }
            if(_option.fontBold){
                selectObj.level.info.fontBold=_option.fontBold;
                arg.fontBold=_option.fontBold;
            }
            if(_option.hasOwnProperty('fontItalic')){
                selectObj.level.info.fontItalic=_option.fontItalic;
                arg.fontItalic=_option.fontItalic;
            }
            if(_option.fontName){
                selectObj.level.info.fontName=_option.fontName;
            }

            selectObj.target.fire('changeButtonText',arg);
        };

        this.ChangeAttributeProgressValue= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();

            var progress=(_option.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);

            selectObj.level.info.progressValue=_option.progressValue;

            var arg={
                progress:progress,
                callback:_successCallback
            };
            selectObj.target.fire('changeProgressValue',arg);


        };
        this.ChangeAttributeArrange= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.info.arrange=_option.arrange;
            var arg={
                arrange:_option.arrange,
                callback:_successCallback
            };
            selectObj.target.fire('changeArrange',arg);

        };

        //改变所选进度条的光标和 模式
        this.ChangeAttributeCursor = function(_option,_successCallback){
            var templateId = TemplateProvider.getTemplateId();
            var arg={};
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.info.cursor=_option.cursor;
            selectObj.level.info.progressModeId=_option.progressModeId;
            //无光标
            if(_option.cursor=='0'){
                //普通进度条
                selectObj.level.texList=[{
                    currentSliceIdx:0,
                    name:'进度条底纹',
                    slices:[{
                        color:templateId?'rgba(0,0,0,0)':'rgba(240,145,66,1)',
                        imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/barBackground.png':'',
                        name:'进度条底纹'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'进度条',
                    slices:[{
                        color:templateId?'rgba(0,0,0,0)':'rgba(125,27,27,1)',
                        imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/barAll.png':'',
                        name:'进度条'
                    }]
                }];
                //变色进度条
                if(_option.progressModeId=='1'){
                    selectObj.level.texList=[{
                        currentSliceIdx:0,
                        name:'进度条背景',
                        slices:[{
                            color:templateId?'rgba(0,0,0,0)':'rgba(240,145,66,1)',
                            imgSrc:'',
                            name:'进度条背景'
                        }]
                    },{
                        currentSliceIdx:0,
                        name:'初始颜色',
                        slices:[{
                            color:'rgba(170,80,80,1)',
                            imgSrc:'',
                            name:'初始颜色'
                        }]
                    },{
                        currentSliceIdx:0,
                        name:'结束颜色',
                        slices:[{
                            color:'rgba(243,204,82,1)',
                            imgSrc:'',
                            name:'结束颜色'
                        }]
                    }];
                    arg.initColor=selectObj.level.texList[1].slices[0].color;
                    arg.endColor=selectObj.level.texList[2].slices[0].color;
                }
            }
            //有光标
            if(_option.cursor=='1'){
                selectObj.level.texList=[{
                    currentSliceIdx:0,
                    name:'进度条底纹',
                    slices:[{
                        color:templateId?'rgba(0,0,0,0)':'rgba(240,145,66,1)',
                        imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/barBackground.png':'',
                        name:'进度条底纹'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'进度条',
                    slices:[{
                        color:templateId?'rgba(0,0,0,0)':'rgba(125,27,27,1)',
                        imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/barAll.png':'',
                        name:'进度条'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'光标纹理',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'光标纹理'
                    }]
                }];
                //变色进度条
                if(_option.progressModeId=='1'){
                    selectObj.level.texList=[{
                        currentSliceIdx:0,
                        name:'进度条底纹',
                        slices:[{
                            color:templateId?'rgba(0,0,0,0)':'rgba(240,145,66,1)',
                            imgSrc:'',
                            name:'进度条底纹'
                        }]
                    },{
                        currentSliceIdx:0,
                        name:'初始颜色',
                        slices:[{
                            color:'rgba(170,80,80,1)',
                            imgSrc:'',
                            name:'初始颜色'
                        }]
                    },{
                        currentSliceIdx:0,
                        name:'结束颜色',
                        slices:[{
                            color:'rgba(243,204,82,1)',
                            imgSrc:'',
                            name:'结束颜色'
                        }]
                    },{
                        currentSliceIdx:0,
                        name:'光标纹理',
                        slices:[{
                            color:'rgba(0,0,0,0)',
                            imgSrc:'',
                            name:'光标纹理'
                        }]
                    }];
                    arg.initColor=selectObj.level.texList[1].slices[0].color;
                    arg.endColor=selectObj.level.texList[2].slices[0].color;
                }
            }
            arg.backgroundColor= selectObj.level.texList[0].slices[0].color;
            arg.progressColor=selectObj.level.texList[1].slices[0].color;
            arg.progressModeId=selectObj.level.info.progressModeId;
            arg.level=_.cloneDeep(selectObj.level);

            _successCallback&&_successCallback();
            selectObj.target.fire('changeAttributeCursor',arg);
        };


        this.ChangeAttributeDashboardOffsetValue = function(_option, _successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var offsetValue=_option.offsetValue;


            selectObj.level.info.offsetValue=offsetValue;

            var arg={
                offsetValue:offsetValue,
                callback:_successCallback
            }
            selectObj.target.fire('changeDashboardOffsetValue',arg);
        }


        this.ChangeAttributeDashboardValue= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            var value=_option.value;


            selectObj.level.info.value=_option.value;

            var arg={
                value:value,
                callback:_successCallback
            }
            selectObj.target.fire('changeDashboardValue',arg);


        };

        this.ChangeAttributeDashboardPointerLength= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            var value=_option.pointerLength;

            var fabDashboardObj = getFabricObject(selectObj.level.id,true);
            //console.log(fabDashboardObj,fabDashboardObj.getWidth(),fabDashboardObj.getHeight(),fabDashboardObj.getScaleX(),fabDashboardObj.getScaleY());

            selectObj.level.info.pointerLength=value;

            var arg={
                pointerLength:value,
                scaleX:fabDashboardObj.getScaleX(),
                scaleY:fabDashboardObj.getScaleY(),
                callback:_successCallback
            }

            selectObj.target.fire('changeDashboardPointerLength',arg);


        };

        this.ChangeAttributeKnobSize = function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var value=_option.knobSize;

            var fabDashboardObj = getFabricObject(selectObj.level.id,true);
            //console.log(fabDashboardObj,fabDashboardObj.getWidth(),fabDashboardObj.getHeight(),fabDashboardObj.getScaleX(),fabDashboardObj.getScaleY());

            selectObj.level.info.knobSize=value;

            var arg={
                knobSize:value,
                scaleX:fabDashboardObj.getScaleX(),
                scaleY:fabDashboardObj.getScaleY(),
                callback:_successCallback
            }

            selectObj.target.fire('changeKnobSize',arg);
        };

        this.ChangeAttributeKnobValue= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            var value=_option.value;


            selectObj.level.info.value=_option.value;

            var arg={
                value:value,
                callback:_successCallback
            }
            selectObj.target.fire('changeKnobValue',arg);


        };

        this.ChangeAttributeTextContent = function (_option,_successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            var fabTextObj=getFabricObject(selectObj.level.id,true);
            var arg={
                level:selectObj.level,
                callback:function () {
                    var currentWidget=selectObj.level;
                    OnWidgetSelected(currentWidget,_successCallback);
                }
            };

            if(_option.text){
                var tempText=_option.text;
                selectObj.level.info.text=tempText;
                arg.text=tempText;
            }
            if(_option.fontFamily){
                var tempFontFamily=_option.fontFamily;
                selectObj.level.info.fontFamily=tempFontFamily;
                arg.fontFamily=tempFontFamily;
            }
            if(_option.fontSize){
                var tempFontSize=_option.fontSize;
                selectObj.level.info.fontSize=tempFontSize;
                arg.fontSize=tempFontSize;
            }
            if(_option.fontColor){
                var tempFontColor=_option.fontColor;
                selectObj.level.info.fontColor=tempFontColor;
                arg.fontColor=tempFontColor;
            }
            if(_option.fontBold){
                var tempFontBold=_option.fontBold;
                selectObj.level.info.fontBold=tempFontBold;
                arg.fontBold=tempFontBold;
            }
            if(_option.hasOwnProperty('fontItalic')){
                var tempFontItalic=_option.fontItalic;
                selectObj.level.info.fontItalic=tempFontItalic;
                arg.fontItalic=tempFontItalic;
            }
            if(_option.fontName){
                selectObj.level.info.fontName=_option.fontName;
            }

            selectObj.target.fire('changeTextContent',arg);
        };

        //改变如下数字属性，需要重新渲染预览界面
        this.ChangeAttributeNumContent = function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var fabNumObj=getFabricObject(selectObj.level.id,true);
            var arg={
                scaleX:fabNumObj.getScaleX(),
                scaleY:fabNumObj.getScaleY(),
                callback:_successCallback
            };

            //下面是数字字体属性，如字体，字体大小，粗体，斜体
            if(_option.fontFamily){
                var tempFontFamily=_option.fontFamily;
                selectObj.level.info.fontFamily=tempFontFamily;
                arg.fontFamily=tempFontFamily;
            }
            if(_option.fontSize){
                var tempFontSize=_option.fontSize;
                selectObj.level.info.fontSize=tempFontSize;
                arg.fontSize=tempFontSize;
            }
            if(_option.fontBold){
                var tempFontBold=_option.fontBold;
                selectObj.level.info.fontBold=tempFontBold;
                arg.fontBold=tempFontBold;
            }
            if(_option.hasOwnProperty('fontItalic')){
                var tempFontItalic=_option.fontItalic;
                selectObj.level.info.fontItalic=tempFontItalic;
                arg.fontItalic=tempFontItalic;
            }
            if(_option.hasOwnProperty('fontColor')){
                var tempFontColor=_option.fontColor;
                selectObj.level.info.fontColor=tempFontColor;
                arg.fontColor=tempFontColor;
            }

            //下面是数字模式属性，如小数位数，字符数，切换模式，有无符号模式，前导0模式
            if(_option.numOfDigits){
                var tempNumOfDigits=_option.numOfDigits;
                selectObj.level.info.numOfDigits=tempNumOfDigits;
                arg.numOfDigits=tempNumOfDigits;
            }
            if(_option.decimalCount||(_option.decimalCount==0)){
                var tempDecimalCount=_option.decimalCount;
                selectObj.level.info.decimalCount=tempDecimalCount;
                arg.decimalCount=tempDecimalCount;
            }
            if(_option.symbolMode){
                var tempSymbolMode=_option.symbolMode;
                selectObj.level.info.symbolMode=tempSymbolMode;
                arg.symbolMode=tempSymbolMode;
            }
            if(_option.frontZeroMode){
                var tempFrontZeroMode=_option.frontZeroMode;
                selectObj.level.info.frontZeroMode=tempFrontZeroMode;
                arg.frontZeroMode=tempFrontZeroMode;
            }

            //下面是数字数值
            if(_option.hasOwnProperty('numValue')){
                var tempNumValue = _option.numValue;
                selectObj.level.info.numValue=tempNumValue;
                arg.numValue=tempNumValue;
            }
            if(_option.align){
                var tempAlign = _option.align;
                selectObj.level.info.align=tempAlign;
                arg.align=tempAlign;
            }
            selectObj.target.fire('changeNumContent',arg);
        };
        //如下属性改变，但是不用重新渲染界面，包括切换模式
        this.ChangeAttributeOfNum=function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            if(_option.numModeId){
                selectObj.level.info.numModeId=_option.numModeId;
            }
            if(_option.overFlowStyle){
                selectObj.level.info.overFlowStyle=_option.overFlowStyle;
            }
            _successCallback&&_successCallback();
            //console.log('displayModel',selectObj.level.info.numModeId);

        };

        //改变按钮模式
        this.ChangeAttributeButtonModeId= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.buttonModeId=_option.buttonModeId;
            _successCallback&&_successCallback();
        };

        //改变示波器的一些需要重新渲染的属性，如点距离，添加网格，
        this.ChangeAttributeOscilloscopeForRender = function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var arg={
                callback:_successCallback
            };
            if(_option.hasOwnProperty('spacing')){
                selectObj.level.info.spacing= _option.spacing;
                arg.spacing=_option.spacing;
            }
            if(_option.hasOwnProperty('grid')){
                selectObj.level.info.grid=_option.grid;
                arg.grid=_option.grid;
            }
            if(_option.hasOwnProperty('lineWidth')){
                selectObj.level.info.lineWidth=_option.lineWidth;
                arg.lineWidth=_option.lineWidth;
            }
            if(_option.hasOwnProperty('gridInitValue')){
                selectObj.level.info.gridInitValue=_option.gridInitValue;
                arg.gridInitValue=_option.gridInitValue;
            }
            if(_option.hasOwnProperty('gridUnitX')){
                selectObj.level.info.gridUnitX=_option.gridUnitX;
                arg.gridUnitX=_option.gridUnitX;
            }
            if(_option.hasOwnProperty('gridUnitY')){
                selectObj.level.info.gridUnitY=_option.gridUnitY;
                arg.gridUnitY=_option.gridUnitY;
            }
            selectObj.target.fire('ChangeAttributeOscilloscope',arg);
        };
        //改变示波器的不需要重新渲染的属性，如线条颜色
        this.ChangeAttributeOscilloscope = function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            if(_option.hasOwnProperty("lineColor")){
                //console.log('keke',_option.lineColor);
                selectObj.level.info.lineColor= _option.lineColor;
            }
        };
        //改变开关纹理所绑定的tag的位
        this.ChangeAttributeBindBit = function(_option,_successCallback){
            var bindBit=_option.bindBit;
            var selectObj = _self.getCurrentSelectObject();
            selectObj.level.info.bindBit=_option.bindBit;
            _successCallback&&_successCallback();
        };
        //改变控件初始值
        this.ChangeAttributeInitValue = function(_option,_successCallback){
            var initValue=_option.initValue;
            var selectObj= _self.getCurrentSelectObject();
            selectObj.level.info.initValue=_option.initValue;
            arg={
                initValue:initValue,
                callback:_successCallback
            };
            selectObj.target.fire('changeInitValue',arg);
        };
        //改变时间控件的显示模式
        this.ChangeAttributeDateTimeModeId = function(_option,_successCallback){
            var dateTimeModeId = _option.dateTimeModeId;
            var RTCModeId = _option.RTCModeId;
            var selectObj= _self.getCurrentSelectObject();
            selectObj.level.info.dateTimeModeId=dateTimeModeId;
            selectObj.level.info.RTCModeId=RTCModeId;
            var arg={
                level:selectObj.level,
                dateTimeModeId:dateTimeModeId,
                callback:function(){
                    var currentWidget=selectObj.level;
                    OnWidgetSelected(currentWidget,_successCallback);
                }
            };
            selectObj.target.fire('changeDateTimeModeId',arg);
        };
        this.ChangeAttributeDateTimeText = function(_option,_successCallback){
            var selectObj=_self.getCurrentSelectObject();
            var arg={
                level:selectObj.level,
                callback:function () {
                        var currentWidget=selectObj.level;
                        OnWidgetSelected(currentWidget,_successCallback);
                    }
                }

            if(_option.hasOwnProperty('fontFamily')){
                selectObj.level.info.fontFamily=_option.fontFamily;
                arg.fontFamily = _option.fontFamily;
            }
            if(_option.hasOwnProperty('fontSize')){
                selectObj.level.info.fontSize=_option.fontSize;
                arg.fontSize = _option.fontSize;
            }
            if(_option.hasOwnProperty('fontColor')){
                selectObj.level.info.fontColor=_option.fontColor;
                arg.fontColor = _option.fontColor;
            }

            selectObj.target.fire('changeDateTimeText',arg);
        };

        //改变仪表盘模式，相应地改变此仪表盘控件的的slice内容
        this.ChangeAttributeDashboardModeId = function(_option,_successCallback){
            var templateId = TemplateProvider.getTemplateId();
            var selectObj = _self.getCurrentSelectObject();
            selectObj.level.dashboardModeId = _option.dashboardModeId;
            if(selectObj.level.dashboardModeId=='0')
            {
                selectObj.level.texList=[
                    {
                        currentSliceIdx:0,
                        name:'仪表盘背景',
                        slices:[{
                                color:templateId?'rgba(0,0,0,0)':'rgba(100,100,100,1)',
                                imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/dashboard.png':'',
                                name:'仪表盘背景'
                            }]
                    },
                    {
                        currentSliceIdx:0,
                        name:'仪表盘指针',
                        slices:[{
                            color:'rgba(0,0,0,0)',
                            imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/pointer.png':'',
                        name:'仪表盘指针'
                            }]
                    }
                ]
            }else if(selectObj.level.dashboardModeId=='1'){
                selectObj.level.texList=[
                    {
                        currentSliceIdx:0,
                        name:'仪表盘背景',
                        slices:[{
                            color:templateId?'rgba(0,0,0,0)':'rgba(100,100,100,1)',
                            imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/dashboard.png':'',
                            name:'仪表盘背景'
                        }]
                    },
                    {
                        currentSliceIdx:0,
                        name:'仪表盘指针',
                        slices:[{
                            color:'rgba(0,0,0,0)',
                            imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/pointer.png':'',
                            name:'仪表盘指针'
                        }]
                    },
                    {
                        currentSliceIdx:0,
                        name:'光带效果',
                        slices:[{
                            color:'rgba(0,0,0,0)',
                            imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/lightBand.png':'',
                            name:'光带效果'
                        }]

                    }
                ]
            }else if(selectObj.level.dashboardModeId=='2'){
                selectObj.level.texList=[
                    {
                        currentSliceIdx:0,
                        name:'光带效果',
                        slices:[{
                            color:'rgba(0,0,0,0)',
                            imgSrc:templateId?'/public/templates/defaultTemplate/defaultResources/lightBand.png':'',
                            name:'光带效果'
                        }]
                    }
                ];
            }
            //改变slice，背景颜色会成为新值，需要将此新的颜色值传递给render，来重绘canvas
            var level = _.cloneDeep(selectObj.level);
            arg={
                level:level,
                backgroundColor: _.cloneDeep(selectObj.level.texList[0].slices[0].color),
                dashboardModeId:_option.dashboardModeId,
                callback:_successCallback
            };
            selectObj.target.fire('changeDashboardMode',arg);
        };
        //改变仪表盘的转动方向
        this.ChangeAttributeDashboardClockwise=function(_option,_successCallback){
            var selectObj = _self.getCurrentSelectObject();
            selectObj.level.info.clockwise = _option.clockwise
            arg={
                clockwise: _.cloneDeep(selectObj.level.info.clockwise),
            };
            _successCallback&&_successCallback();
            selectObj.target.fire('changeDashboardClockwise',arg);
        };
        this.ChangeAttributeInterval= function (_option, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.info.interval=_option.interval;

            var fabInterval=selectObj.level.info.interval;

            //更新间距的比例
            var fabButtonGroup=getFabricObject(selectObj.level.id,true);

            if (selectObj.level.info.arrange=='horizontal'){
                selectObj.level.info.intervalScale=selectObj.level.info.interval/fabButtonGroup.getWidth();
                fabInterval=selectObj.level.info.interval/fabButtonGroup.getScaleX();
            }else {
                selectObj.level.info.intervalScale=selectObj.level.info.interval/fabButtonGroup.getHeight();
                fabInterval=selectObj.level.info.interval/fabButtonGroup.getScaleY();
            }

            var arg={
                interval:fabInterval,
                callback:_successCallback
            }
            selectObj.target.fire('changeInterval',arg);

        };
        this.ChangeAttributeButtonCount= function (_option, _successCallback) {
            //console.log(_successCallback);
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.info.count=_option.count;
            checkTexList(selectObj.level,selectObj.level.info.count, function () {
                var arg={
                    level:selectObj.level,
                    callback:_successCallback,
                }
                selectObj.target.fire('changeTex',arg);

            })

            /**
             * 递归函数,根据count改变TexList
             * @param _level    buttonGroup对象
             * @param _count    要求的数目
             * @param _callback 回调函数
             */
            function checkTexList(_level,_count,_callback){
                if (_level.texList.length<_count){
                    _level.texList.push(TemplateProvider.getDefaultButtonTex());
                    checkTexList(_level,_count,_callback);
                }else if (_level.texList.length>_count){
                    _level.texList.pop();
                    checkTexList(_level,_count,_callback);

                }else {
                    _callback&&_callback();
                    return;
                }
            }

        }
        this.ChangeAttributePosition= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=_self.getCurrentSelectObject();
            var pageNode=CanvasService.getPageNode();
            var subLayerNode=CanvasService.getSubLayerNode();
            var currentPage=_self.getCurrentPage();

            if (object.type==Type.MyLayer) {

                var fabLayer = null;
                var currentLayer = getCurrentLayer();
                _.forEach(pageNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabLayer = _fabObj;
                    }
                });

                if (_.isNumber(_option.left)) {
                    fabLayer.setLeft(_option.left);
                    currentLayer.info.left = _option.left;

                }
                if (_.isNumber(_option.top)) {
                    fabLayer.setTop(_option.top);
                    currentLayer.info.top = _option.top;

                }

                pageNode.renderAll();
                currentPage.proJsonStr = JSON.stringify(pageNode.toJSON());
                //console.log(currentPage.proJsonStr);

                _self.OnLayerSelected(currentLayer, function () {
                    _successCallback && _successCallback(currentOperate);

                });
            }else if (Type.isWidget(object.type)) {


                var fabWidget = null;
                var currentSubLayer = getCurrentSubLayer();
                var currentWidget = getCurrentWidget(currentSubLayer);
                _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabWidget = _fabObj;
                    }
                });
                fabWidget = getFabricObject(object.target.id, true);
                if (!fabWidget) {
                    console.warn('找不到fabSlide');
                    return;
                }

                if (_.isNumber(_option.left)) {
                    fabWidget.setLeft(_option.left);
                    currentWidget.info.left = _option.left;

                }
                if (_.isNumber(_option.top)) {
                    fabWidget.setTop(_option.top);
                    currentWidget.info.top = _option.top;

                }

               subLayerNode.renderAll();

                currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                _self.OnWidgetSelected(currentWidget, function () {
                    _successCallback && _successCallback(currentOperate);

                });
            }else if (object.type==Type.MyGroup){
                var fabGroup=object.target;
                var currentGroup=object.level;
                if (!fabGroup) {
                    console.warn('找不到fabWidget');
                    return;
                }

                if (_.isNumber(_option.left)) {
                    fabGroup.setLeft(_option.left);
                    currentGroup.info.left = _option.left;

                }
                if (_.isNumber(_option.top)) {
                    fabGroup.setTop(_option.top);
                    currentGroup.info.top = _option.top;
                }

                if (getCurrentSubLayer()){
                    var currentSubLayer=getCurrentSubLayer();

                    currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());


                }else {
                    currentPage.proJsonStr = JSON.stringify(pageNode.toJSON());
                    //console.log(currentPage.proJsonStr);

                }
                subLayerNode.renderAll();
                pageNode.renderAll();
                _successCallback && _successCallback(currentOperate);

            }
        };


        /**
         * 主要操作
         * 改变对象的Action
         * @param _actionObj
         * @param _successCallback
         * @constructor
         */
        this.ChangeAttributeAction= function (_actionObj,_successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.actions=_actionObj;
            _successCallback&&_successCallback();
        };
        this.ChangeAttributeTexList= function (_actionObj,_successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.texList=_actionObj;
            var arg={
                level:selectObj.level,
                callback:_successCallback
            }
            selectObj.target.fire('changeTex',arg);
        };


        this.ChangeAttributeTag= function (_tagObj, _successCallback) {
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.tag=_tagObj;
            _successCallback&&_successCallback();
        }
        this.ChangeAttributeValue= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var subLayerNode=CanvasService.getSubLayerNode();
            var arg=null;
            var progress=null;

            var selectObj=getCurrentSelectObject();
            if (_option.hasOwnProperty('maxValue')){
                selectObj.level.info.maxValue=_option.maxValue;

                if(selectObj.type==Type.MyProgress){
                    progress=(selectObj.level.info.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);

                    arg={
                        progress:progress,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeProgressValue',arg);
                }
                if(selectObj.type==Type.MyDashboard){
                    arg={
                        maxValue:_option.maxValue,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeDashboardValue',arg);
                }
                if(selectObj.type==Type.MyOscilloscope){
                    arg={
                        maxValue:_option.maxValue,
                        callback:_successCallback
                    };
                    selectObj.target.fire('ChangeAttributeOscilloscope',arg);
                }
                if(selectObj.type==Type.MySlideBlock){
                    arg={
                        maxValue:_option.maxValue,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeInitValue',arg);
                }

            }
            if (_option.hasOwnProperty('minValue')){
                selectObj.level.info.minValue=_option.minValue;

                if(selectObj.type==Type.MyProgress){
                    progress=(selectObj.level.info.progressValue-selectObj.level.info.minValue)/(selectObj.level.info.maxValue-selectObj.level.info.minValue);

                    arg={
                        progress:progress,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeProgressValue',arg);
                }
                if(selectObj.type==Type.MyDashboard){
                    arg={
                        minValue:_option.minValue,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeDashboardValue',arg);
                }
                if(selectObj.type==Type.MyOscilloscope){
                    arg={
                        minValue:_option.minValue,
                        callback:_successCallback
                    }
                    selectObj.target.fire('ChangeAttributeOscilloscope',arg);
                }
                if(selectObj.type==Type.MySlideBlock){
                    arg={
                        minValue:_option.minValue,
                        callback:_successCallback
                    }
                    selectObj.target.fire('changeInitValue',arg);
                }
            }
            if(_option.hasOwnProperty('minAngle')){
                selectObj.level.info.minAngle=_option.minAngle;

                if(selectObj.type==Type.MyDashboard){
                    arg={
                        minAngle:_option.minAngle,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeDashboardValue',arg);
                }
            }
            if(_option.hasOwnProperty('maxAngle')){
                selectObj.level.info.maxAngle=_option.maxAngle;
                if(selectObj.type==Type.MyDashboard){
                    arg={
                        maxAngle:_option.maxAngle,
                        callback:_successCallback
                    };
                    selectObj.target.fire('changeDashboardValue',arg);
                }
            }
            if (_option.hasOwnProperty('highAlarmValue')){
                selectObj.level.info.highAlarmValue=_option.highAlarmValue;
            }
            if (_option.hasOwnProperty('lowAlarmValue')){
                selectObj.level.info.lowAlarmValue=_option.lowAlarmValue;
            }
            if (_option.hasOwnProperty('initValue')){
                selectObj.level.info.initValue=_option.initValue;
                selectObj.target.fire('changeNumber',selectObj.level);
                subLayerNode.renderAll();
            }
            toastr.info('修改成功!');
            _successCallback&&_successCallback(currentOperate);
        }

        this.ChangeAttributeNoInit= function (_option,_successCallback) {
            var selectObj=getCurrentSelectObject();
            if (_option.noInit){
                selectObj.level.info.noInit=_option.noInit;
            }
            toastr.info('修改成功!');
            //_successCallback&&_successCallback();
        }

        /**
         *
         * @param _option
         * @param _successCallback
         * @constructor
         */

        function sortObjects(objArray){

        }

        this.ChangeAttributeZIndex= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=getCurrentSelectObject();

            if (object.type==Type.MyLayer){
                var pageNode = CanvasService.getPageNode();
                var fabLayer = null;
                var currentPage=_self.getCurrentPage();
                var currentLayer = getCurrentLayer();
                _.forEach(pageNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabLayer = _fabObj;
                    }
                });
                if (!fabLayer) {
                    console.warn('找不到Layer');
                    return;
                }
                if (_option.index==0){
                    fabLayer.bringForward();
                    //var isTop=true;
                    //_.forEach(currentPage.layers, function (_layer) {
                    //    if (currentLayer.zIndex<=_layer.zIndex&&currentLayer.id!=_layer.id){
                    //        isTop=false;
                    //    }
                    //});
                    //if (!isTop){
                    //    currentLayer.zIndex=currentLayer.zIndex+1;
                    //}


                }else {
                    fabLayer.sendBackwards();
                    //var isBottom=true;
                    //_.forEach(currentPage.layers, function (_layer) {
                    //    if (currentLayer.zIndex>=_layer.zIndex&&currentLayer.id!=_layer.id){
                    //        isBottom=false;
                    //    }
                    //});
                    //if (!isBottom){
                    //    currentLayer.zIndex=currentLayer.zIndex-1;
                    //}

                }
                //pageNode.deactivateAll();
                //pageNode.renderAll();
                currentPage.proJsonStr=JSON.stringify(pageNode.toJSON());

                //currentPage.url=pageNode.toDataURL({format:'jpeg',quality:'0.2'});
                //console.log(currentPage.layers);
                var layers = pageNode.getObjects();
                _.forEach(currentPage.layers, function (_layer,index) {
                    // if (currentWidget.zIndex<=_widget.zIndex&&currentWidget.id!=_widget.id){
                    //     isTop=false;
                    // }

                    for (var i=0;i<layers.length;i++){
                        if (layers[i].id == _layer.id){
                            _layer.zIndex = i;
                            break;
                        }
                    }
                });
                //currentPage.layers.map(function (layer,idx) {
                //    console.log(layer.id,layer.zIndex);
                //})

            }
            else if (Type.isWidget(object.type)){
                var subLayerNode = CanvasService.getSubLayerNode();
                var fabWidget = null;
                var currentSubLayer=getCurrentSubLayer();
                console.log(currentSubLayer.widgets);
                var currentWidget = getCurrentWidget();
                _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabWidget = _fabObj;
                    }
                });
                if (!fabWidget) {
                    console.warn('找不到Widget');
                    return;
                }
                if (_option.index==0){
                    fabWidget.bringForward();
                    // var isTop=true;
                    // _.forEach(currentSubLayer.widgets, function (_widget) {
                    //     if (currentWidget.zIndex<=_widget.zIndex&&currentWidget.id!=_widget.id){
                    //         isTop=false;
                    //     }
                    // });
                    // if (!isTop){
                    //     currentWidget.zIndex=currentWidget.zIndex+1;
                    // }


                    // console.log('上移至'+currentWidget.zIndex);

                }else {
                    fabWidget.sendBackwards();
                    // var isBottom=true;
                    // _.forEach(currentSubLayer.widgets, function (_widget) {
                    //     if (currentWidget.zIndex>=_widget.zIndex&&currentWidget.id!=_widget.id){
                    //         isBottom=false;
                    //     }
                    // });
                    // if (!isBottom){
                    //     currentWidget.zIndex=currentWidget.zIndex-1;
                    // }
                    // console.log('下移至'+currentWidget.zIndex);

                }

                //console.log(subLayerNode.getObjects())
                currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                var widgetObjs = subLayerNode.getObjects();
                _.forEach(currentSubLayer.widgets, function (_widget,index) {
                    // if (currentWidget.zIndex<=_widget.zIndex&&currentWidget.id!=_widget.id){
                    //     isTop=false;
                    // }

                    for (var i=0;i<widgetObjs.length;i++){
                        if (widgetObjs[i].id == _widget.id){
                            _widget.zIndex = i;
                            break;
                        }
                    }
                });
                //currentSubLayer.widgets.map(function (widget,idx) {
                //    console.log(widget.id,widget.zIndex);
                //})
            }

            _successCallback&&_successCallback(currentOperate);
        };

        this.ChangeAttributeSize= function (_option, _successCallback) {
            var currentOperate=SaveCurrentOperate();
            var object=getCurrentSelectObject();

            if (object.type==Type.MyLayer) {

                var pageNode = CanvasService.getPageNode();
                var fabLayer = null;
                var currentLayer = getCurrentLayer();
                _.forEach(pageNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabLayer = _fabObj;
                    }
                });
                if (!fabLayer) {
                    console.warn('找不到Layer');
                    return;
                }
                var currentPage = _self.getCurrentPage();
                if (_option.width) {
                    fabLayer.setScaleX(_option.width / fabLayer.width);
                    //fabLayer.set({width:_option.width});
                    currentLayer.info.width = _option.width;
                }
                if (_option.height) {
                    fabLayer.setScaleY(_option.height / fabLayer.height);
                    //fabLayer.set({height:_option.height});
                    currentLayer.info.height = _option.height;
                }

                //for fix scale bug!!!
                object.target.fire('OnRelease',object.target.id);

                pageNode.renderAll();
                currentPage.proJsonStr = JSON.stringify(pageNode.toJSON());
                //console.log(currentPage.proJsonStr);

                var layer = getCurrentLayer();
                _self.OnLayerSelected(layer, function () {
                    _successCallback && _successCallback(currentOperate);

                });
            }else if (Type.isWidget(object.type)) {
                var subLayerNode = CanvasService.getSubLayerNode();
                var fabWidget = null;
                var currentSubLayer = getCurrentSubLayer();
                var currentWidget = getCurrentWidget(currentSubLayer);
                _.forEach(subLayerNode.getObjects(), function (_fabObj) {
                    if (_fabObj.id == object.target.id) {
                        fabWidget = _fabObj;
                    }
                });
                if (!fabWidget) {
                    console.warn('找不到Widget');
                    return;
                }
                if (_option.width) {
                    fabWidget.setScaleX(_option.width / fabWidget.width);
                    currentWidget.info.width = _option.width;
                }
                if (_option.height) {
                    fabWidget.setScaleY(_option.height / fabWidget.height);
                    //fabWidget.set({height:_option.height});
                    currentWidget.info.height = _option.height;
                }
                subLayerNode.renderAll();

                currentSubLayer.proJsonStr= JSON.stringify(subLayerNode.toJSON());
                OnWidgetSelected(currentWidget, function () {
                    _successCallback && _successCallback(currentOperate);

                });
            }


        };

        /**
         * 次要操作
         * 按照名字搜索一个对象
         * @param _nameString   名字
         * @param _successCallback  回调
         * @constructor
         */
        this.SearchObjectByName= function (_nameString, _successCallback) {
            var resultList=[];
            _.forEach(project.pages, function (_page) {
                if (_page.name==_nameString){
                    resultList.push({
                        id:_page.id,
                        type:Type.MyPage
                    });
                }
                _.forEach(_page.layers, function (_layer) {
                    if (_layer.name==_nameString){
                        resultList.push({
                            id:_layer.id,
                            type:Type.MyLayer
                        });
                    }
                    _.forEach(_layer.subLayers, function (_subLayer) {
                        if (_subLayer.name==_nameString){
                            resultList.push({
                                id:_subLayer.id,
                                type:Type.MySubLayer
                            });
                        }
                        _.forEach(_subLayer.widgets, function (_widget) {
                            if (_widget.name==_nameString){
                                resultList.push({
                                    id:_widget.id,
                                    type:_widget.type
                                });
                            }
                        });
                    });
                });

            });

            _successCallback(resultList);
        };

        /**
         * 次要操作
         * 从搜索结果中选中
         * @param _result   需要选中的resultList中的item
         * @param _successCallback  回调
         * @constructor
         */
        this.SelectInSearchResults= function (_result, _successCallback) {
            if (!_result){
                console.warn('无效的参数');
                return;
            }

            //如果在当前Page内部搜索,则不必先切换Page
            var currentPageIndex= _indexById(project.pages,_self.getCurrentPage());
            _.forEach(project.pages, function (_page,_pageIndex) {
                if (_page.id==_result.id&&_result.type==Type.MyPage){
                    _self.changeCurrentPageIndex(_pageIndex,_successCallback);
                    return;
                }
                _.forEach(_page.layers, function (_layer, _layerIndex) {
                    if (_layer.id==_result.id&&_result.type==Type.MyLayer){
                        if (currentPageIndex==_pageIndex){
                            _self.OnLayerSelected(_layer,_successCallback,true);

                        }else {
                            _self.changeCurrentPageIndex(_pageIndex, function () {
                                _self.OnLayerSelected(_layer,_successCallback,true);
                            })
                        }

                        return;
                    }
                    _.forEach(_layer.subLayers, function (_subLayer, _subLayerIndex) {


                        if (_subLayer.id==_result.id&&_result.type==Type.MySubLayer){
                            if (currentPageIndex==_pageIndex){
                                _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);

                            }else {
                                _self.changeCurrentPageIndex(_pageIndex, function () {
                                    _self.OnSubLayerSelected(_layerIndex,_subLayerIndex,_successCallback,true);
                                });
                            }

                            return;

                        }
                        _.forEach(_subLayer.widgets, function (_widget) {
                            if (_widget.id==_result.id&&Type.isWidget(_result.type)){
                                if (currentPageIndex==_pageIndex){
                                    _self.OnSubLayerSelected(_layerIndex,_subLayerIndex, function () {
                                        _self.OnWidgetSelected(_widget,_successCallback,true);

                                    },true);


                                }else {
                                    _self.changeCurrentPageIndex(_pageIndex, function () {
                                        _self.OnSubLayerSelected(_layerIndex,_subLayerIndex, function () {
                                            _self.OnWidgetSelected(_widget,_successCallback,true);

                                        },true);
                                    })
                                }
                            }


                            return;
                        })
                    })

                })
            })
        };

        /**
         * 缩放画布
         * @param _scaleMode 模式 'page' or 'subCanvas'
         * @constructor
         */
        this.ScaleCanvas= function (_scaleMode,_level) {
            var currentPage=_self.getCurrentPage();
            var _scale=1;
            if (_scaleMode=='page'){
                var pageNode=CanvasService.getPageNode();
                _scale=ViewService.getScaleFloat('page');
                pageNode.setZoom(_scale);

                pageNode.setWidth(project.currentSize.width*_scale);
                pageNode.setHeight(project.currentSize.height*_scale);

            }else if (_scaleMode=='subCanvas'){
                var currentLayer=_level?_level:_self.getCurrentLayer();
                var subLayerNode=CanvasService.getSubLayerNode();
                _scale=ViewService.getScaleFloat('subCanvas');

                drawBackgroundCanvas(currentLayer.info.width,currentLayer.info.height,currentLayer.info.left,currentLayer.info.top,_scale);
                subLayerNode.setZoom(_scale);

                subLayerNode.setWidth(currentLayer.info.width*_scale);
                subLayerNode.setHeight(currentLayer.info.height*_scale);

            }else {
                console.warn('传参有问题');
            }
        }



        /**
         * 清除page的HashKeys
         * @private
         */
        function _cleanPageHashKey() {
            _.forEach(project.pages, function (_page) {
                _page.$$hashKey = undefined;
            })
        }

        /**
         * 生成一个给定fabric.Group的最新体
         * @param oldFabGroup   旧的fabric group
         * @param is
         * @private
         */
        function _createGroup(oldFabGroup,isSubLayer){
            if(!oldFabGroup||oldFabGroup.type!=Type.MyGroup){
                console.warn('传参不对');
                return;
            }
            var canvasNode=null;
            if(!isSubLayer){
                canvasNode=CanvasService.getPageNode();
            }else{
                canvasNode=CanvasService.getSubLayerNode();
            }
            var groupItems=[];
            canvasNode.forEachObject(function (fabItem) {
                _.forEach(oldFabGroup.getObjects(), function (_fabLayer) {
                    if (_fabLayer.id==fabItem.id){
                        groupItems.push(fabItem);

                    }
                })
            })
            if (groupItems.length==oldFabGroup.getObjects().length){
                var fabGroup=new fabric.Group(groupItems,{
                    canvas:canvasNode
                });
                return fabGroup;

            }else {
                return oldFabGroup;
            }

        }

        /**
         * 辅助函数
         * 从subLayer模式返回Page模式
         * @param currentPage
         * @param _successCallback
         * @private
         */
        var _backToPage= function (currentPage,_successCallback) {
            var currentSubLayer=getCurrentSubLayer();
            var pageNode=CanvasService.getPageNode();

            if (currentSubLayer){
                currentSubLayer.proJsonStr=JSON.stringify(CanvasService.getSubLayerNode().toJSON());

            }

            pageNode.setBackgroundImage(null, function () {
                pageNode.loadFromJSON(currentPage.proJsonStr, function () {
                    if (currentPage.mode==1){
                        _leaveFromSubLayer(currentSubLayer,_successCallback);
                    }else {
                        _successCallback&&_successCallback();
                    }


                });
                //console.log('pageNode',pageNode);
            });
        };


        var _indexById= function (_array, _item) {
            var index=-1;
            if (!_array){
                return index;
            }
            _.forEach(_array, function (__item,_index) {
                if (__item.id==_item.id){
                    index=_index;
                }
            })
            return index;
        }

        /**
         * 辅助函数
         * 当离开当前SubLayer触发
         * @param _successCallback
         * @private
         */
        var _leaveFromSubLayer = function (currentSubLayer, _successCallback) {
            if (!currentSubLayer){
                console.warn('找不到SubLayer');
                return;
            }

            var subLayerNode=CanvasService.getSubLayerNode();
            var pageNode=CanvasService.getPageNode();

            subLayerNode.deactivateAll();
            subLayerNode.renderAll();

            currentSubLayer.url=subLayerNode.toDataURL({format:'png'});


            var pageNodeObjs = pageNode.getObjects();
            var totalNum = pageNodeObjs.length;
            if (totalNum > 0) {
                var cb = function () {
                    totalNum -= 1;
                    if (totalNum <= 0) {
                        _successCallback && _successCallback();

                    }
                }.bind(this);
                _.forEach(pageNodeObjs, function (_fabLayer) {
                    _fabLayer.fire('OnRenderUrl', cb);

                }.bind(this));
            } else {
                _successCallback && _successCallback();
            }






        }

        function belongToGroup(_obj,_target){
            var result=false;
            if (_target.type!='group'){
                return result;
            }
            _.forEach(_target.getObjects(), function (_item) {
                if (_item.id==_obj.id){
                    result=true;
                }
            });
            return result;
        }

        var setRendering = this.setRendering;
        var getCurrentSubLayer=this.getCurrentSubLayer;

        var OnPageClicked=this.OnPageClicked;
        var OnSubLayerClicked=this.OnSubLayerClicked;
        var SaveCurrentOperate=this.SaveCurrentOperate;


        /**
         * 用于将仪表盘中的角度转换，矫正变形偏差
         * @param value
         * @param scaleX
         * @param scaleY
         * @returns {*}
         */
        function translateAngle(value,scaleX,scaleY){
            var tempAngle=null;
            while(value>360){
                value=value-360;
            }
            while(value<0){
                value=value+360;
            }
            if(value>=0&&value<=90){
                tempAngle = Math.atan(Math.tan(value*Math.PI/180)*(scaleY/scaleX));
            }else if(value>90&&value<=180){
                tempAngle = Math.atan(Math.tan((value-90)*Math.PI/180)*(scaleX/scaleY));
                tempAngle+=Math.PI/2;
            }else if(value>180&&value<=270){
                tempAngle = Math.atan(Math.tan((value-180)*Math.PI/180)*(scaleY/scaleX));
                tempAngle+=Math.PI;
            }else if(value>270&&value<=360){
                tempAngle = Math.atan(Math.tan((value-270)*Math.PI/180)*(scaleX/scaleY));
                tempAngle+=Math.PI*3/2;
            }
            return tempAngle;
        }

        /**
         * 用于求渐变色
         * @param initColor
         * @param endColor
         * @param value
         */
        function changeColor(initColor,endColor,progressValue){
            var initColorArr = initColor.slice(5,initColor.length-1).split(','),
                endColorArr = endColor.slice(5,endColor.length-1).split(',');
            var initColorR = parseInt(initColorArr[0]),
                initColorG = parseInt(initColorArr[1]),
                initColorB = parseInt(initColorArr[2]),
                initColorA = parseInt(initColorArr[3]),
                endColorR = parseInt(endColorArr[0]),
                endColorG = parseInt(endColorArr[1]),
                endColorB = parseInt(endColorArr[2]),
                endColorA = parseInt(endColorArr[3]);

            var progressColorR = parseInt(initColorR+(endColorR-initColorR)*progressValue),
                progressColorG = parseInt(initColorG+(endColorG-initColorG)*progressValue),
                progressColorB = parseInt(initColorB+(endColorB-initColorB)*progressValue),
                progressColorA = 1;

            return  'rgba('+progressColorR+','+progressColorG+','+progressColorB+','+progressColorA+')';

        }

        /**
         * get image name(id)
         * @param imageName
         * @returns {*}
         */
        function getImageName(imageName) {
            if (imageName && typeof imageName === 'string') {
                var names = imageName.split('/');
                return names[names.length - 1];
            } else {
                return '';
            }
        }

        /**
         * 画网格
         * @param curX
         * @param curY
         * @param width
         * @param height
         * @param offsetX
         * @param offsetY
         * @param gridWidth
         * @param gridHeight
         * @param gridStyle
         */
        function drawGrid(curX, curY, width, height,offsetX, offsetY,gridWidth, gridHeight, gridStyle,ctx,minValue) {
            var _offsetX = offsetX/gridStyle.scaleX;
            var _offsetY = offsetY/gridStyle.scaleY;
            var _gridWidth = gridWidth/gridStyle.scaleX;
            var _gridHeight = gridHeight/gridStyle.scaleY;
            var vertGrids = Math.floor((width - _offsetX)/_gridWidth)+1;
            var horiGrids = Math.floor((height - _offsetY)/_gridHeight)+1;
            //var maxWidth = 0;
            ctx.save();
            ctx.translate(curX,curY);
            ctx.beginPath();
            //draw verts
            ctx.save();
            ctx.translate(_offsetX,0);
            if(gridStyle&&gridStyle.grid&&gridStyle.grid=='1'||gridStyle.grid=='3'){
                ctx.textAlign='center';
                ctx.textBaseline='top';
                ctx.fillStyle='rgba(255,255,255,1)';
                ctx.font='10px';
                var maxXValue =  gridStyle.gridInitValue+(vertGrids-1)*gridStyle.gridUnitX;
                var q = Math.floor(ctx.measureText(maxXValue).width/(2*gridWidth/3))+1;
                for (var i=0;i<vertGrids;i++){
                    var vertX = i * _gridWidth;
                    var xValue = gridStyle.gridInitValue+i*gridStyle.gridUnitX;

                    ctx.moveTo(vertX,0);
                    ctx.lineTo(vertX,height-_offsetY);

                    if(i%q==0){
                        ctx.scale(1/gridStyle.scaleX,1/gridStyle.scaleY);
                        ctx.fillText(xValue,vertX*gridStyle.scaleX,(height-_offsetY+2)*gridStyle.scaleY);
                        ctx.scale(gridStyle.scaleX,gridStyle.scaleY);
                    }
                }
            }
            ctx.restore();
            ctx.save();
            ctx.translate(_offsetX,height-_offsetY);
            if(gridStyle&&gridStyle.grid&&gridStyle.grid=='1'||gridStyle.grid=='2') {
                ctx.textAlign='right';
                ctx.textBaseline='middle';
                ctx.fillStyle='rgba(255,255,255,1)';
                ctx.font='10px';
                for (i = 0; i < horiGrids; i++) {
                    var horiY = i * _gridHeight;
                    var yValue = minValue+gridStyle.gridInitValue+i*gridStyle.gridUnitY;

                    ctx.moveTo(0, -horiY);
                    ctx.lineTo(width-_offsetX, -horiY);


                    ctx.scale(1/gridStyle.scaleX,1/gridStyle.scaleY);
                    ctx.fillText(yValue,(0-2)*gridStyle.scaleX, -horiY*gridStyle.scaleY);
                    ctx.scale(gridStyle.scaleX,gridStyle.scaleY);
                }
            }
            ctx.restore();
            ctx.lineWidth=gridStyle.lineWidth||1;
            ctx.strokeStyle = (gridStyle&&gridStyle.color) || 'lightgrey';
            ctx.scale(1/gridStyle.scaleX,1/gridStyle.scaleY);
            ctx.stroke();
            ctx.restore();
        }

        /**
         *
         * @param width
         * @param height
         */
        function drawBackgroundCanvas(width,height,x,y,scale){
            var _scale = scale||1;
            var _width = parseInt(width*_scale);
            var _height = parseInt(height*_scale);
            var currentPage = _self.getCurrentPage();

            var pageColor = currentPage.backgroundColor||'rgba(54,71,92,0.3)';
            var pageBackgroundImgSrc = currentPage.backgroundImage||"";
            //var pageFromJson = JSON.parse(currentPage.proJsonStr);
            var pageWidth = (project.currentSize&&project.currentSize.width)||1280;
            var pageHeight = (project.currentSize&&project.currentSize.height)||480;
            //console.log('got page width and height',pageWidth,pageHeight);

            var backgroundCanvas=document.getElementById('backgroundCanvas');
            backgroundCanvas.width=_width;
            backgroundCanvas.height=_height;
            var ctx=backgroundCanvas.getContext('2d');

            if(pageBackgroundImgSrc!=""&&pageBackgroundImgSrc!="/public/images/blank.png"){
                pageBackgroundImg = ResourceService.getResourceFromCache(pageBackgroundImgSrc);
                var sourceX = parseInt(pageBackgroundImg.width/pageWidth*x);
                var sourceY = parseInt(pageBackgroundImg.height/pageHeight*y);
                var sourceWidth =parseInt(pageBackgroundImg.width/pageWidth*width);
                var sourceHeight =parseInt(pageBackgroundImg.height/pageHeight*height);
                ctx.drawImage(pageBackgroundImg,sourceX,sourceY,sourceWidth,sourceHeight,0,0,_width,_height);
            }else{
                ctx.beginPath();
                ctx.rect(0,0,_width,_height);
                ctx.fillStyle=pageColor;
                ctx.fill();
                ctx.closePath();
            }
            //ctx.lineWidth = 1;
            //ctx.strokeStyle = 'rgba(102,153,255,0.75)';
            //ctx.stroke();
        }

        /**
         * to resize widget
         * @param self
         */
        function setWidthAndHeight(self){
            var w = parseInt((self.width*self.scaleX).toFixed(0)),
                h = parseInt((self.height*self.scaleY).toFixed(0));
            self.set({
                'height' :h,
                'width'  :w,
                'scaleX'  :1,
                'scaleY'  :1,
            });

        }

        /**
         * to reset top and left
         * @param self
         */
        function setTopAndLeft(self){
            var t = parseInt((self.top).toFixed(0));
            var l = parseInt((self.left).toFixed(0));
            var selectObj=_self.getCurrentSelectObject();
            selectObj.level.info.top=t;
            selectObj.level.info.left=l;
            self.set({
                top:t,
                left:l
            })

        }

        /**
         * calculate dashboard lightBand radius
         * @param mode
         * @param width
         * @param height
         * @returns {number}
         */
        function calculateRadius(mode,width,height){
            var radius = mode=='1'?Math.sqrt(width*width+height*height)/2:Math.max(width,height)/2;
            radius= Math.floor(radius);
            return radius;
        }

        /**
         *
         * @param mode
         * @param ctx
         * @param scaleX
         * @param scaleY
         * @param fontString
         * @param align
         * @param fontColor
         */
        function drawDateTime(mode,ctx,scaleX,scaleY,fontString,align,fontColor){
            ctx.fillStyle=fontColor;
            var dateObj = new Date(),
                arrTime = [],
                arrDate = [];
            var i=0;
            arrTime.push(dateObj.getHours());
            arrTime.push(dateObj.getMinutes());
            arrTime.push(dateObj.getSeconds());
            for(i=0;i<arrTime.length;i++){
                if(arrTime[i]<10){
                    arrTime[i]='0'+arrTime[i];
                }
            }

            arrDate.push(dateObj.getFullYear());
            arrDate.push(dateObj.getMonth()+1);
            arrDate.push(dateObj.getDate());

            for(i=0;i<arrDate.length;i++){
                if(arrDate[i]<10){
                    arrDate[i]='0'+arrDate[i];
                }
            }
            if(mode=='0'){
                //时分秒
                ctx.scale(1/scaleX,1/scaleY);
                ctx.font=fontString;
                ctx.textAlign=align;
                ctx.textBaseline='middle';
                ctx.fillText(arrTime.join(":"),0,0);
                ctx.scale(scaleX,scaleY);
            }else if(mode=='1'){
                ctx.scale(1/scaleX,1/scaleY);
                ctx.font=fontString;
                ctx.textAlign=align;
                ctx.textBaseline='middle';
                ctx.fillText(arrTime.slice(0,2).join(":"),0,0);
                ctx.scale(scaleX,scaleY);
            }
            else if(mode=='2'){
                //斜杠日期
                ctx.scale(1/scaleX,1/scaleY);
                ctx.font=fontString;
                ctx.textAlign=align;
                ctx.textBaseline='middle';
                ctx.fillText(arrDate.join("/"),0,0);
                ctx.scale(scaleX,scaleY);
            }else if(mode=='3'){
                //减号日期
                ctx.scale(1/scaleX,1/scaleY);
                ctx.font=fontString;
                ctx.textAlign=align;
                ctx.textBaseline='middle';
                ctx.fillText(arrDate.join("-"),0,0);
                ctx.scale(scaleX,scaleY);
            }
        }


    });