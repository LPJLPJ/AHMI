/**
 * Created by changecheng on 2016/12/19.
 * Manage widgets behaviour
 */

ideServices.service('WidgetService',['ProjectService', 'Type', 'ResourceService','CanvasService','FontMesureService',function (ProjectService,
                                Type,
                                ResourceService,CanvasService,FontMesureService) {

    // var ProjectService = $injector.get('ProjectService');
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


    //MyLayer
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
            this.layerId = layerId;
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            // this.backgroundImg =

            //开始移动时Layer的Scale
            this.on('OnRelease', function () {
                var layerNode=ProjectService.getFabricObject(self.id);
                self.initPosition.left = self.getLeft();
                self.initPosition.top = self.getTop();
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

            this.on('OnRefresh',function (cb) {
                this.refresh(self,cb);
            })
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
                var currentLayer=ProjectService.getCurrentLayer();
                if (currentLayer&&ProjectService.scalingOperate.scaling&&ProjectService.scalingOperate.objId==this.id){
                    this.widgetImgs=[];
                    var layerNode= ProjectService.getFabricObject(currentLayer.id);
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
                    // console.log('drawing background element',this.backgroundImg.element)
                    ctx.drawImage(this.backgroundImg.element,
                        this.backgroundImg.left,
                        this.backgroundImg.top,

                        this.backgroundImg.width,
                        this.backgroundImg.height);
                }
            }catch (err) {
                console.log('错误描述',err);
                toastr.warning('渲染Layer出错');
            }

        }
    });

    fabric.MyLayer.prototype.loadAll= function (layerId,cb) {

        var backgroundImg = new Image();
        var layer=null;
        if(typeof layerId ==='string'){
            layer=ProjectService.getLevelById(layerId);
        }else{
            layer = layerId;
        }
        var layerWidth=layer.info.width/this.initScale.X;
        var layerHeight=layer.info.height/this.initScale.Y;

        this.initPosition={};

        if (layer.showSubLayer.url==''){
            backgroundImg = null;
        }else{
            backgroundImg.onload = (function () {
                this.width = layerWidth;
                this.height = layerHeight;
                this.loaded = true;
                this.setCoords();
                var pageNode = CanvasService.getPageNode();
                pageNode.renderAll();
                cb && cb()
            }).bind(this);
            backgroundImg.src = _.cloneDeep(layer.showSubLayer.url);
        }
        this.backgroundImg={
            element:backgroundImg,
            width:layerWidth,
            height:layerHeight,
            left:-layerWidth / 2,
            top:-layerHeight/2
        };
        this.backgroundColor=layer.showSubLayer.backgroundColor;
        this.initPosition.left = this.getLeft();
        this.initPosition.top = this.getTop();
    };
    fabric.MyLayer.prototype.refresh = function (self,cb) {
        this.renderUrlInPage(self,function () {
            cb && cb();
        })
    };
    fabric.MyLayer.prototype.renderUrlInPage = function (self, cb) {
        // console.log('rendering url in page',self.id);
        var currentLayer=ProjectService.getLevelById(self.id);
        var backgroundImg = new Image();
        backgroundImg.onload = function () {
            self.backgroundImg.element = backgroundImg;
            self.backgroundImg.width = self.width;
            self.backgroundImg.height = self.height;
            self.backgroundImg.left = -self.width / 2;
            self.backgroundImg.top = -self.height / 2;
            self.initPosition.left = self.getLeft();
            self.initPosition.top = self.getTop();
            var pageNode = CanvasService.getPageNode();
            pageNode.renderAll();
            cb && cb();
        }.bind(self);
        backgroundImg.onerror = function (err) {
            backgroundImg = null;
            cb && cb(err);
        }.bind(self);
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
    fabric.MyLayer.fromLevel = function(level,callback,option){
        // console.log('level in',level);
        callback && callback(new fabric.MyLayer(level.id,option));
    };
    fabric.MyLayer.async = true;

    //myMatte 蒙板 add by tang
    fabric.MyMatte = fabric.util.createClass(fabric.Object,{
        type:'MyMatte',
        initialize:function (options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            this.selectable=false;
            this.opacity/=100;
            this.loadImg(options.backgroundImg);

            this.on("changeOpacity",function(op){
                this.opacity=op/100;
                var pageNode=CanvasService.getPageNode();
                pageNode.renderAll();
            });

            this.on("changeBgi",function(img){
                this.loadImg(img);
                var pageNode=CanvasService.getPageNode();
                pageNode.renderAll();
            });

            this.on('changeBgc',function(co){
                this.backgroundColor=co;
                var pageNode=CanvasService.getPageNode();
                pageNode.renderAll();
            })
        },
        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'));
        },
        _render:function(ctx){
            try{
                ctx.globalAlpha=this.opacity;
                ctx.beginPath();
                ctx.drawImage(this.matteImg,-(this.width / 2),-(this.height / 2),this.width,this.height);
                ctx.fillStyle =this.backgroundColor;
                ctx.fillRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
                ctx.closePath();
            }catch (err) {
                console.log('渲染错误',err)
            }
        }
    });
    fabric.MyMatte.prototype.loadImg=function(imgSrc){
        var img=new Image();
        img.onload=(function () {

        }).bind(this);
        img.src=imgSrc;
        this.matteImg=img;
    };
    fabric.MyMatte.fromLevel=function(callback,option){
        var matte=new fabric.MyMatte(option);
        callback&&callback(matte);
    };


    //progress
    fabric.MyProgress = fabric.util.createClass(fabric.Object, {
        type: Type.MyProgress,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            this.progressValue=level.info.progressValue/(level.info.maxValue-level.info.minValue);
            this.progressValueOri=level.info.progressValue;
            this.progressModeId=level.info.progressModeId;
            this.arrange=level.info.arrange;
            this.cursor=level.info.cursor;
            this.thresholdModeId=level.info.thresholdModeId||'1';
            this.threshold1=level.info.threshold1||null;
            this.threshold2=level.info.threshold2||null;

            this.backgroundColor=level.texList[0].slices[0].color;
            this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
            if(this.progressModeId=='0'){
                this.progressColor=level.texList[1].slices[0].color;
                this.progressImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
            }else if(this.progressModeId=='1'){
                this.initColor=level.texList[1].slices[0].color;
                this.endColor=level.texList[2].slices[0].color;
            }else if(this.progressModeId=='2'){

            }else if(this.progressModeId=='3'){
                this.color1=level.texList[1].slices[0].color;
                this.color2=level.texList[2].slices[0].color;
                this.progressImageSrc1 = level.texList[1].slices[0].imgSrc;
                this.progressImageSrc2 = level.texList[2].slices[0].imgSrc;
                if(this.thresholdModeId=='2'){
                    this.color3=level.texList[3].slices[0].color;
                    this.progressImageSrc3 = level.texList[3].slices[0].imgSrc;
                }
            }
            if(this.cursor=='1'){
                var length = level.texList.length;
                this.cursorColor=level.texList[length-1].slices[0].color;
                this.cursorImageElement = ResourceService.getResourceFromCache(level.texList[length-1].slices[0].imgSrc);
            }



            this.on('changeProgressValue', function (arg) {
                self.progressValue=arg.progress;
                self.progressValueOri=arg.progressValueOri;
                var _callback=arg.callback;

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            this.on('changeTex', function (arg) {
                var level=arg.level;
                var _callback=arg.callback;
                var progressModeId=self.progressModeId;
                var cursor=self.cursor;
                self.backgroundColor=level.texList[0].slices[0].color;
                self.backgroundImageElement=ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if(progressModeId=='0'){
                    self.progressColor=level.texList[1].slices[0].color;
                    self.progressImageElement=ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                }else if(progressModeId=='1'){
                    self.initColor=level.texList[1].slices[0].color;
                    self.endColor=level.texList[2].slices[0].color;
                }else if(progressModeId=='2'){

                }else if(progressModeId=='3'){
                    self.color1=level.texList[1].slices[0].color;
                    self.color2=level.texList[2].slices[0].color;
                    self.progressImageSrc1 = level.texList[1].slices[0].imgSrc;
                    self.progressImageSrc2 = level.texList[2].slices[0].imgSrc;
                    if(self.thresholdModeId=='2'){
                        self.color3=level.texList[3].slices[0].color;
                        self.progressImageSrc3 = level.texList[3].slices[0].imgSrc;
                    }
                }
                if(cursor=='1'){
                    var length=level.texList.length;
                    self.cursorColor=level.texList[length-1].slices[0].color;
                    self.cursorImageElement=ResourceService.getResourceFromCache(level.texList[length-1].slices[0].imgSrc);
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
                var level=arg.level;
                self.backgroundColor=arg.backgroundColor;
                self.progressColor=arg.progressColor;
                self.cursor=arg.cursor;
                self.progressModeId=arg.progressModeId;

                self.backgroundColor=level.texList[0].slices[0].color;
                self.backgroundImageElement=ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                if(self.progressModeId=='0'){
                    self.progressColor=level.texList[1].slices[0].color;
                    self.progressImageElement=ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                }else if(self.progressModeId=='1'){
                    self.initColor=level.texList[1].slices[0].color;
                    self.endColor=level.texList[2].slices[0].color;
                }else if(self.progressModeId=='2'){

                }else if(self.progressModeId=='3'){
                    self.color1=level.texList[1].slices[0].color;
                    self.color2=level.texList[2].slices[0].color;
                    self.progressImageSrc1 = level.texList[1].slices[0].imgSrc;
                    self.progressImageSrc2 = level.texList[2].slices[0].imgSrc;
                    if(self.thresholdModeId=='2'){
                        self.color3=level.texList[3].slices[0].color;
                        self.progressImageSrc3 = level.texList[3].slices[0].imgSrc;
                    }
                }
                if(self.cursor=='1'){
                    var length=level.texList.length;
                    self.cursorColor=level.texList[length-1].slices[0].color;
                    self.cursorImageElement=ResourceService.getResourceFromCache(level.texList[length-1].slices[0].imgSrc);
                }else {
                    self.cursorColor = 'rgba(0,0,0,0)';
                    self.cursorImageElement = null;
                }



                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
            });
            this.on('changeThreshold',function(arg){
                if(arg.hasOwnProperty('thresholdModeId')){
                    self.thresholdModeId=arg.thresholdModeId;
                    if(self.thresholdModeId=='2'){
                        self.color3=arg.color3;
                        self.progressImageSrc3 = arg.progressImageSrc3
                    }
                    console.log('thresholdModeId',arg.thresholdModeId);
                }else if(arg.hasOwnProperty('threshold1')){
                    self.threshold1=arg.threshold1;
                    console.log('threshold1',arg.threshold1);
                }else if(arg.hasOwnProperty('threshold2')){
                    self.threshold2=arg.threshold2;
                    console.log('threshold2',arg.threshold2);
                }
                var _callback = arg.callback;
                _callback&&_callback();
                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
            })

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
                            if(this.progressValue !=0 )
                                ctx.drawImage(this.progressImageElement, 0, 0,this.progressImageElement.width*this.progressValue,this.progressImageElement.height,-this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);

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
                            if(this.progressValue !=0 )
                                ctx.drawImage(this.progressImageElement,0,this.progressImageElement.height*(1-this.progressValue),this.progressImageElement.width,this.progressImageElement.height*this.progressValue, -this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);
                        }
                        if(this.cursorImageElement){
                            ctx.drawImage(this.cursorImageElement,-this.cursorImageElement.width/2/this.scaleX,this.height/2-this.height*this.progressValue-this.cursorImageElement.height/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                        }
                    }
                }else if(this.progressModeId=='1'){
                    //变色进度条
                    var progressColor = changeColor(this.initColor,this.endColor,this.progressValue);
                    //console.log(progressColor);
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    if(this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
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
                }else if(this.progressModeId=='2'){
                    //脚本进度条，啥也不画！
                }else if(this.progressModeId=='3'){
                    var progressImageElement = null
                    ctx.fillStyle=this.backgroundColor;
                    ctx.fillRect(
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    if(this.backgroundImageElement){
                        ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                    }
                    if(this.arrange=='horizontal'){
                        if(this.cursorImageElement){
                            ctx.drawImage(this.cursorImageElement,-this.width/2+(this.width*this.progressValue),-this.cursorImageElement.height/2/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                        }
                        if(this.thresholdModeId=='1'){
                            if(this.threshold1!=null){
                                if(this.progressValueOri<this.threshold1){
                                    ctx.fillStyle=this.color1;
                                    progressImageElement = this.progressImageSrc1
                                }else if(this.progressValueOri>=this.threshold1){
                                    ctx.fillStyle=this.color2;
                                    progressImageElement = this.progressImageSrc2
                                }
                            }else{
                                ctx.fillStyle=this.null;
                            }
                            ctx.fillRect(-this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);
                        }else if(this.thresholdModeId=='2'){
                            if(this.progressValueOri<this.threshold1){
                                ctx.fillStyle=this.color1;
                                progressImageElement = this.progressImageSrc1
                            }else if(this.progressValueOri>=this.threshold1&&this.progressValueOri<this.threshold2){
                                ctx.fillStyle=this.color2;
                                progressImageElement = this.progressImageSrc2
                            }else if(this.progressValueOri>=this.threshold2){
                                ctx.fillStyle=this.color3;
                                progressImageElement = this.progressImageSrc3
                            }else{
                                ctx.fillStyle=null;
                                progressImageElement = null
                            }
                            ctx.fillRect(-this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);
                        }
                        if (progressImageElement){
                            if(this.progressValue !=0 ){
                                progressImageElement = ResourceService.getResourceFromCache(progressImageElement)
                                ctx.drawImage(progressImageElement, 0, 0,progressImageElement.width*this.progressValue,progressImageElement.height,-this.width / 2, -this.height / 2,this.width*this.progressValue,this.height);
                            }
                        }
                    }else{
                        if(this.cursorImageElement){
                            ctx.drawImage(this.cursorImageElement,-this.width/2+(this.width*this.progressValue),-this.cursorImageElement.height/2/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                        }
                        if(this.thresholdModeId=='1'){
                            if(this.threshold1!=null){
                                if(this.progressValueOri<this.threshold1){
                                    ctx.fillStyle=this.color1;
                                    progressImageElement = this.progressImageSrc1
                                }else if(this.progressValueOri>=this.threshold1){
                                    ctx.fillStyle=this.color2;
                                    progressImageElement = this.progressImageSrc2
                                }
                            }else{
                                ctx.fillStyle=this.null;
                            }
                            ctx.fillRect(-this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);

                        }else if(this.thresholdModeId=='2'){
                            if(this.progressValueOri<this.threshold1){
                                ctx.fillStyle=this.color1;
                                progressImageElement = this.progressImageSrc1
                            }else if(this.progressValueOri>=this.threshold1&&this.progressValueOri<this.threshold2){
                                ctx.fillStyle=this.color2;
                                progressImageElement = this.progressImageSrc2
                            }else if(this.progressValueOri>=this.threshold2){
                                ctx.fillStyle=this.color3;
                                progressImageElement = this.progressImageSrc3
                            }else{
                                ctx.fillStyle=null;
                                progressImageElement = null
                            }
                            ctx.fillRect(-this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);
                        }

                        if (progressImageElement){
                            if(this.progressValue !=0 ){
                                progressImageElement = ResourceService.getResourceFromCache(progressImageElement)
                                ctx.drawImage(progressImageElement,0,progressImageElement.height*(1-this.progressValue),progressImageElement.width,progressImageElement.height*this.progressValue, -this.width / 2, this.height / 2-this.height*this.progressValue,this.width,this.height*this.progressValue);
                            }

                        }
                        if(this.cursorImageElement){
                            ctx.drawImage(this.cursorImageElement,-this.cursorImageElement.width/2/this.scaleX,this.height/2-this.height*this.progressValue-this.cursorImageElement.height/this.scaleY,this.cursorImageElement.width/this.scaleX,this.cursorImageElement.height/this.scaleY);
                        }
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyProgress(level, object));
    };
    fabric.MyProgress.async = true;
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


    //osci
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

            this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
            if (this.backgroundImageElement) {
                this.loaded = true;
                this.setCoords();
                this.fire('image:loaded');
            }
            this.oscilloscopeColor=level.texList[1].slices[0].color;
            this.oscilloscopeImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);

            this.on('changeTex', function (arg) {
                var level=arg.level;
                var _callback=arg.callback;
                self.backgroundColor=level.texList[0].slices[0].color;
                this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                self.oscilloscopeColor=level.texList[1].slices[0].color;
                this.oscilloscopeImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();

            });
            this.on('ChangeAttributeOscilloscope',function(arg){
                var selectObj=ProjectService.getCurrentSelectObject();
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyOscilloscope(level, object));
    };
    fabric.MyOscilloscope.async = true;

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
            this.backgroundModeId = level.backgroundModeId||'0';
            if(level.info.hasOwnProperty('minCoverAngle')){
                this.minCoverAngle=level.info.minCoverAngle;
            }
            if(level.info.hasOwnProperty('maxCoverAngle')){
                this.maxCoverAngle=level.info.maxCoverAngle;
            }

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
                else if(arg.hasOwnProperty('maxValue')){
                    self.maxValue=arg.maxValue;
                }
                else if(arg.hasOwnProperty('minValue')){
                    self.minValue=arg.minValue;
                }
                else if(arg.hasOwnProperty('minAngle')){
                    self.minAngle=arg.minAngle;
                }
                else if(arg.hasOwnProperty('maxAngle')){
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
            this.on('changeDashboardCoverAngle',function(arg){
                var _callback=arg.callback;
                var subLayerNode=CanvasService.getSubLayerNode();
                if(arg.hasOwnProperty('minCoverAngle')){
                    self.minCoverAngle=arg.minCoverAngle;
                }else if(arg.hasOwnProperty('maxCoverAngle')){
                    self.maxCoverAngle=arg.maxCoverAngle;
                }
                subLayerNode.renderAll();
                _callback&&_callback();

            })

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

            this.on('changeBackgroundMode',function(arg){
                var _callback = arg.callback;
                self.backgroundModeId = arg.backgroundModeId;

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
                var newValue = (this.maxAngle-this.minAngle)/(this.maxValue-this.minValue)*(this.value-this.minValue);
                var taoValue = (this.maxAngle-this.minAngle)/(this.maxValue-this.minValue)*this.value;
                ctx.fillStyle=this.backgroundModeId==='0'?this.backgroundColor:"rgba(0,0,0,0)";
                ctx.fillRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
                if (this.backgroundImageElement&&this.backgroundModeId==='0'){
                    ctx.drawImage(this.backgroundImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                }
                if(this.lightBandImageElement){
                    //由于canvas进行了一定的比例变换，所以画扇形时，角度出现了偏差。下面纠正偏差
                    var angle=translateAngle(newValue+this.offsetValue+this.minAngle,this.scaleX,this.scaleY,newValue);
                    var minAngle=translateAngle(this.offsetValue+this.minAngle,this.scaleX,this.scaleY,null);
                    var nowangle=translateAngle(taoValue,this.scaleX,this.scaleY,null);
                    var offsetangle=translateAngle(this.offsetValue,this.scaleX,this.scaleY,null);
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(0,0);
                    var radius=calculateRadius(this.dashboardModeId,this.width,this.height);

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
                    else if(this.clockwise=='2'){
                        //正向，当前值大于0
                        if(taoValue>=0){
                            minAngle=offsetangle+Math.PI/2;
                            angle=nowangle+offsetangle+Math.PI/2;
                            ctx.arc(0,0,radius,minAngle,angle,false);
                            if(this.dashboardModeId=='2'){
                                ctx.arc(0,0,3*radius/4,angle,minAngle,true);
                            }
                        }
                        //逆向，当前值小于0
                        else if(taoValue<0){
                            var curValue = -taoValue;
                            var nowangle=translateAngle(curValue,this.scaleX,this.scaleY);
                            minAngle=offsetangle+Math.PI/2;
                            angle=-nowangle+offsetangle+Math.PI/2;
                            ctx.arc(0,0,radius,angle,minAngle,false);
                            if(this.dashboardModeId=='2'){
                                ctx.arc(0,0,3*radius/4,minAngle,angle,true);
                            }
                        }
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
                    if(!(this.minCoverAngle==this.maxCoverAngle)){
                        var newMinCoverAngle=translateAngle(this.minCoverAngle,this.scaleX,this.scaleY)+Math.PI/2;
                        var newMaxCoverAngle=translateAngle(this.maxCoverAngle,this.scaleX,this.scaleY)+Math.PI/2;
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(0,0);
                        ctx.arc(0,0,this.width/2,newMinCoverAngle,newMaxCoverAngle,false);
                        ctx.closePath();
                        ctx.fillStyle='rgba(244,244,244,0.3)';
                        ctx.fill();
                        ctx.restore();
                        ctx.beginPath();
                        ctx.moveTo(0,0);
                        ctx.arc(0,0,this.width/2,newMaxCoverAngle,newMinCoverAngle,false);
                        ctx.closePath();
                        //ctx.stroke();
                        ctx.clip();
                    }
                    ctx.scale(1/this.scaleX,1/this.scaleY);
                    ctx.rotate(angleOfPointer*Math.PI/180);
                    ctx.scale(this.scaleX,this.scaleY);
                    ctx.fillStyle=this.pointerColor;
                    ctx.fillRect(
                        0,
                        0,
                        this.width/2,
                        this.width/2
                    );
                    ctx.drawImage(this.pointerImageElement, 0, 0,this.pointerImageElement.width/this.scaleX,this.pointerImageElement.height/this.scaleY);
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyDashboard(level, object));
    };
    fabric.MyDashboard.async = true;

    /**
     * 用于将仪表盘中的角度转换，矫正变形偏差
     * @param value
     * @param scaleX
     * @param scaleY
     * @returns {*}
     */
    function translateAngle(value,scaleX,scaleY,NewValue){
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
        if(NewValue==360)
            tempAngle+= Math.PI*2;
        return tempAngle;
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


    //myknob
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
            this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
            if (this.backgroundImageElement) {
                this.loaded = true;
                this.setCoords();
                this.fire('image:loaded');
            }
            this.knobColor=level.texList[1].slices[0].color;
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
                self.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
                self.knobColor=level.texList[1].slices[0].color;
                self.knobImageElement = ResourceService.getResourceFromCache(level.texList[1].slices[0].imgSrc);
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyKnob(level, object));
    };
    fabric.MyKnob.async = true;


    //switch
    fabric.MySwitch = fabric.util.createClass(fabric.Object, {
        type: Type.MySwitch,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            this.backgroundColor=level.texList[0].slices[0].color;
            this.bindBit=level.info.bindBit;

            this.text=level.info.text||'';
            this.fontFamily=level.info.fontFamily||"宋体";
            this.fontSize=level.info.fontSize||20;
            this.fontColor=level.info.fontColor||'rgba(0,0,0,1)';
            this.fontBold=level.info.fontBold||"100";
            this.fontItalic=level.info.fontItalic||"";

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
                self.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeWidgetSize',function(arg){
                var _callback=arg.callback;
                var widgetWidth=arg.widgetWidth||25;
                var widgetHeight=arg.WidgetHeight||25;
                self.set({scaleX:1,scaleY:1,width:widgetWidth,height:widgetHeight});
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeFontStyle',function(arg){
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
                ctx.save();
                ctx.fillStyle=this.backgroundColor;
                ctx.fillRect(
                    -(this.width / 2),
                    -(this.height / 2) ,
                    this.width ,
                    this.height);

                if (this.imageElement){
                    ctx.drawImage(this.imageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                }
                ctx.restore();
                if(this.text){
                    ctx.save();
                    ctx.fillStyle=this.fontColor;
                    var fontString=this.fontItalic+" "+this.fontBold+" "+this.fontSize+"px"+" "+this.fontFamily;
                    // console.log('button font',fontString)
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MySwitch(level, object));
    };
    fabric.MySwitch.async = true;

    //myscripttrigger
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyScriptTrigger(level, object));
    };
    fabric.MyScriptTrigger.async = true;

    //rotateImg
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

                self.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeInitValue',function(arg){
                var _callback=arg.callback;
                self.initValue=arg.initValue;
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
                ctx.rotate((Math.PI/180)*this.initValue);
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyRotateImg(level, object));
    };
    fabric.MyRotateImg.async = true;



    //myslider
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
            this.backgroundImageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);
            if (this.backgroundImageElement) {
                this.loaded = true;
                this.setCoords();
                this.fire('image:loaded');
            }
            this.slideColor=level.texList[1].slices[0].color;
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
                // console.log('haha',arg);
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MySlideBlock(level, object));
    };
    fabric.MySlideBlock.async = true;


    //myDateTime
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
            this.fontBold=level.info.fontBold;
            this.fontItalic=level.info.fontItalic;
            this.align=level.info.align;
            this.initValue=level.info.initValue;
            this.arrange=level.info.arrange;
            // this.maxFontWidth=level.info.maxFontWidth;
            this.widthBeforePadding=this.width;

            if(level.info.paddingRatio===undefined){
                //维护旧的时间控件
                this.paddingRatio= level.info.paddingRatio=0.1;
                this.spacing = level.info.spacing= Math.ceil(-this.fontSize/3);
                var font = this.fontSize + "px" + " " + this.fontFamily;
                // var maxWidth = Math.ceil(FontMesureService.getMaxWidth('0123456789:/-',font));//-
                var maxWidth = parseInt(this.fontSize);//+
                this.fontSize = maxWidth;
                level.info.fontSize = maxWidth;
                if(this.dateTimeModeId=='0'){
                    this.widthBeforePadding=8*this.fontSize+7*this.spacing;
                }else if(this.dateTimeModeId=='1'){
                    this.widthBeforePadding=5*this.fontSize+4*this.spacing;
                }else {
                    this.widthBeforePadding=10*this.fontSize+9*this.spacing;
                }
                var width=this.widthBeforePadding+2*this.paddingRatio*this.fontSize;
                // this.setWidth(width);
                var height = this.fontSize*(1+2*this.paddingRatio);
                level.info.width = width;
                level.info.height=height;
                // this.setHeight(height);
                this.set({width:width,height:height});
            }
            this.spacing =level.info.spacing;
            this.paddingRatio=level.info.paddingRatio;

            if(self.dateTimeModeId=='0'){
                self.widthBeforePadding=8*self.fontSize+7*self.spacing;
            }else if(self.dateTimeModeId=='1'){
                self.widthBeforePadding=5*self.fontSize+4*self.spacing;
            }else {
                self.widthBeforePadding=10*self.fontSize+9*self.spacing;
            }
            self.setWidth(self.widthBeforePadding+2*self.paddingRatio*self.fontSize);

            this.on('changeDateTimeModeId',function(arg){
                var _callback=arg.callback;
                self.dateTimeModeId=arg.dateTimeModeId;
                self.setHeight(self.fontSize*(1+2*self.paddingRatio));
                if(self.dateTimeModeId=='0'){
                    self.widthBeforePadding=8*self.fontSize+7*self.spacing;
                }else if(self.dateTimeModeId=='1'){
                    self.widthBeforePadding=5*self.fontSize+4*self.spacing;
                }else {
                    self.widthBeforePadding=10*self.fontSize+9*self.spacing;
                }
                self.setWidth(self.widthBeforePadding+2*self.paddingRatio*self.fontSize);
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeDateTimeText',function(arg){
                var level = arg.level;
                var _callback = arg.callback;
                if(arg.hasOwnProperty('fontFamily')){
                    self.fontFamily = arg.fontFamily;
                }
                if(arg.hasOwnProperty('fontSize')){
                    self.fontSize=arg.fontSize;
                }
                if(arg.hasOwnProperty('fontColor')){
                    self.fontColor=arg.fontColor;
                }
                if(arg.hasOwnProperty('fontBold')){
                    self.fontBold=arg.fontBold;
                }
                if(arg.hasOwnProperty('fontItalic')){
                    self.fontItalic=arg.fontItalic;
                }
                self.setHeight(self.fontSize*(1+2*self.paddingRatio));
                // var font = self.fontItalic + " " + self.fontBold + " " + self.fontSize + "px" + " " + self.fontFamily;
                // var maxWidth = Math.ceil(FontMesureService.getMaxWidth('0123456789:/-',font));//-
                self.fontSize = parseInt(self.fontSize);//+
                if(self.dateTimeModeId=='0'){
                    self.widthBeforePadding=8*self.fontSize+7*self.spacing;
                }else if(self.dateTimeModeId=='1'){
                    self.widthBeforePadding=5*self.fontSize+4*self.spacing;
                }else {
                    self.widthBeforePadding=10*self.fontSize+9*self.spacing;
                }
                self.setWidth(self.widthBeforePadding+2*self.paddingRatio*self.fontSize);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeDateTimeAttr',function(arg){
                var level = arg.level;
                var _callback = arg.callback;
                if(arg.hasOwnProperty('spacing')){
                    self.spacing = arg.spacing;
                }
                if(self.dateTimeModeId=='0'){
                    self.widthBeforePadding=8*self.fontSize+7*self.spacing;
                }else if(self.dateTimeModeId=='1'){
                    self.widthBeforePadding=5*self.fontSize+4*self.spacing;
                }else {
                    self.widthBeforePadding=10*self.fontSize+9*self.spacing;
                }
                self.setWidth(self.widthBeforePadding+2*self.paddingRatio*self.fontSize);
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeArrange',function(arg){
                var _callback=arg.callback;
                self.arrange=arg.arrange;
                if(arg.arrange=='vertical'){
                    self.setAngle(90);
                    self.set({
                        originY:'bottom'
                    });
                }else if(arg.arrange=='horizontal'){
                    self.setAngle(0);
                    self.set({
                        originY:'top'
                    });
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
                var fontString;
                fontString=this.fontItalic + " " + this.fontBold + " " + this.fontSize+'px'+" "+this.fontFamily;

                drawNewDateTime(this.dateTimeModeId,ctx,fontString,this.align,this.fontColor,this.widthBeforePadding,this.fontSize,this.spacing);
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyDateTime(level, object));
    };
    fabric.MyDateTime.async = true;


    //my alpha img
    //rotateImg
    fabric.MyAlphaImg = fabric.util.createClass(fabric.Object, {
        type: Type.MyAlphaImg,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            this.backgroundColor=level.texList[0].slices[0].color;
            this.minValue=level.info.minValue||0;
            this.maxValue=level.info.maxValue||0;
            this.initValue=level.info.initValue||0;


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

                self.imageElement = ResourceService.getResourceFromCache(level.texList[0].slices[0].imgSrc);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeInitValue',function(arg){
                var _callback=arg.callback;

                if(arg.hasOwnProperty('initValue')){
                    self.initValue=arg.initValue;
                }else if(arg.hasOwnProperty('maxValue')){
                    self.maxValue=arg.maxValue;
                }else if(arg.hasOwnProperty('minValue')){
                    self.minValue=arg.minValue;
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
                // ctx.rotate((Math.PI/180)*this.initValue);
                ctx.save()
                var curAlpha= Number((this.initValue - this.minValue) /(this.maxValue-this.minValue))||0
                if(curAlpha<0){
                    curAlpha = 0
                }else if(curAlpha>1){
                    curAlpha = 1
                }

                ctx.globalAlpha = curAlpha
                ctx.fillStyle=this.backgroundColor;
                ctx.fillRect(
                    -(this.width / 2),
                    -(this.height / 2) ,
                    this.width ,
                    this.height);

                if (this.imageElement){
                    ctx.drawImage(this.imageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                }
                ctx.restore()
            }
            catch(err){
                ctx.restore()
                console.log('错误描述',err);
                toastr.warning('渲染透明图出错');
            }
        }
    });
    fabric.MyAlphaImg.fromLevel= function (level, callback,option) {
        callback && callback(new fabric.MyAlphaImg(level, option));
    };
    fabric.MyAlphaImg.prototype.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                imageElement:this.imageElement,
                backgroundColor:this.backgroundColor
            });
        }
    })(fabric.MyAlphaImg.prototype.toObject);
    fabric.MyAlphaImg.fromObject = function (object, callback) {
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyAlphaImg(level, object));
    };
    fabric.MyAlphaImg.async = true;


    /**
     * 按字符串渲染时间控件
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

    /**
     * [drawNewDateTime 逐个字符渲染时间控件]
     * @param  {[type]} mode       [模式]
     * @param  {[type]} ctx        [canvas对象]
     * @param  {[type]} fontString [字体样式字符串]
     * @param  {[type]} align      [对齐方式(未使用)]
     * @param  {[type]} fontColor  [字体颜色]
     * @param  {[type]} width      [控件宽度]
     * @return {[type]}            [description]
     */
    function drawNewDateTime(mode,ctx,fontString,align,fontColor,width,fontSize,spacing){
        ctx.fillStyle=fontColor;
        ctx.font=fontString;
        ctx.textBaseline='middle';
        ctx.textAlign = 'center';

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
        var dateTimeStr="";

        switch(mode){
            case '1':
                //时分
                dateTimeStr=arrTime.slice(0,2).join(":").toString();
                break;
            case '2':
                //斜杠日期
                dateTimeStr=arrDate.join("/").toString();
                break;
            case '3':
                //减号日期
                dateTimeStr=arrDate.join("-").toString();
                break;
            case '0':
            default:
                //时分秒
                dateTimeStr=arrTime.join(":").toString();
                break;
        }
        var xCoordinate= fontSize/2-width/2;//每个字符的起始值
        var displayStep = fontSize+spacing; //加入间隔
        for(i=0;i<dateTimeStr.length;i++){
            if(dateTimeStr[i] ==":"){
                ctx.fillText(dateTimeStr[i],xCoordinate,0);
            }
            else
                ctx.fillText(dateTimeStr[i],xCoordinate,0);
            xCoordinate+=displayStep;
        }
    }


    //MyTexTime
    fabric.MyTexTime = fabric.util.createClass(fabric.Object, {
        type: Type.MyTexTime,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            var slices = level.texList[0].slices;
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
            // this.fontFamily=level.info.fontFamily;
            // this.fontSize=level.info.fontSize;
            // this.fontColor=level.info.fontColor;
            this.align=level.info.align;
            this.initValue=level.info.initValue;
            this.arrange=level.info.arrange;
            this.characterW = level.info.characterW;
            this.characterH = level.info.characterH;

            //设置图层数字控件的宽高
            if(self.characterW){
                //根据模式设置宽度
                if(self.dateTimeModeId=='0'){
                    self.setWidth(8*self.characterW);
                }else if(self.dateTimeModeId=='1'){
                    self.setWidth(5*self.characterW);
                }else
                    self.setWidth(10*self.characterW);

                //设置高度
                self.setHeight(self.characterH);
            };

            //初始化数字字符
            this.numObj = [];
            for(var i=0,il=13;i<il;i++){
                this.numObj[i] = {};
                this.numObj[i].color = slices[i].color;
                this.numObj[i].img = ResourceService.getResourceFromCache(slices[i].imgSrc);
            }

            //修改数字纹理
            this.on('changeTex', function (arg) {
                var slices=arg.level.texList[0].slices;
                var _callback=arg.callback;

                for(var i=0,il=13;i<il;i++){
                    self.numObj[i] = {};
                    self.numObj[i].color = slices[i].color;
                    self.numObj[i].img = ResourceService.getResourceFromCache(slices[i].imgSrc);
                }

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();

            });

            //修改数字图层控件属性
            this.on('changeTexTimeContent', function (arg) {
                var _callback=arg.callback;
                var level=arg.level;

                if(arg.hasOwnProperty('characterW')){
                    self.characterW = level.info.characterW;
                }
                if(arg.hasOwnProperty('characterH')){
                    self.characterH = level.info.characterH;
                }

                //设置图层数字控件的宽高
                if(self.characterW){
                    //根据模式设置宽度
                    if(self.dateTimeModeId=='0'){
                        self.setWidth(8*self.characterW);
                    }else if(self.dateTimeModeId=='1'){
                        self.setWidth(5*self.characterW);
                    }else
                        self.setWidth(10*self.characterW);

                    //设置高度
                    self.setHeight(self.characterH);
                };

                //渲染
                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            //修改时间显示方式
            this.on('changeTexTimeModeId',function(arg){
                var _callback=arg.callback;
                self.dateTimeModeId=arg.dateTimeModeId;

                if(self.dateTimeModeId=='0'){
                    self.setWidth(8*self.characterW);
                }else if(self.dateTimeModeId=='1'){
                    self.setWidth(5*self.characterW);
                }else
                    self.setWidth(10*self.characterW);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });


            //修改方向，已废弃
            this.on('changeArrange',function(arg){
                var _callback=arg.callback;
                self.arrange=arg.arrange;
                if(arg.arrange=='vertical'){
                    self.setAngle(90);
                    self.set({
                        originY:'bottom'
                    });
                }else if(arg.arrange=='horizontal'){
                    self.setAngle(0);
                    self.set({
                        originY:'top'
                    });
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
                //生成当前时间日期
                var dateObj = new Date(),
                    arrTime = [],
                    arrDate = [];

                var i=0;

                //获取时间字符串
                arrTime.push(dateObj.getHours());
                arrTime.push(dateObj.getMinutes());
                arrTime.push(dateObj.getSeconds());
                for(i=0;i<arrTime.length;i++){
                    if(arrTime[i]<10){
                        arrTime[i]='0'+arrTime[i];
                    }
                }
                //获取日期字符串
                arrDate.push(dateObj.getFullYear());
                arrDate.push(dateObj.getMonth()+1);
                arrDate.push(dateObj.getDate());

                for(i=0;i<arrDate.length;i++){
                    if(arrDate[i]<10){
                        arrDate[i]='0'+arrDate[i];
                    }
                }
                var colonWidth = this.characterW/2;
                var dateTimeStr="";

                //根据模式生成对应格式的时间日期字符串
                switch(this.dateTimeModeId){
                    case '1':
                        //时分
                        dateTimeStr=arrTime.slice(0,2).join(":").toString();
                        break;
                    case '2':
                        //斜杠日期
                        dateTimeStr=arrDate.join("/").toString();
                        break;
                    case '3':
                        dateTimeStr=arrDate.join("-").toString();
                        break;
                    case '0':
                    default:
                        //时分秒
                        dateTimeStr=arrTime.join(":").toString();
                        break;
                }
                var numStr="";
                for(i=0;i<dateTimeStr.length;i++){
                    numStr=numStr+dateTimeStr[i];
                }
                // console.log("numStr:"+numStr);

                // drawTexTime(this.dateTimeModeId,ctx,this.numObj,this.width,this.characterW,this.characterH);
                drawTexTimeByCharacter(ctx,numStr,this.width,this.characterW,this.characterH,this.numObj);

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
                toastr.warning('渲染图层时间出错');
            };
        }
    });
    fabric.MyTexTime.fromLevel= function (level, callback,option) {
        callback && callback(new fabric.MyTexTime(level, option));
    };
    fabric.MyTexTime.prototype.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                imageElement:this.imageElement,
                backgroundColor:this.backgroundColor
            });
        }
    })(fabric.MyTexTime.prototype.toObject);
    fabric.MyTexTime.fromObject = function (object, callback) {
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyTexTime(level, object));
    };
    fabric.MyTexTime.async = true;

    /**
     * drawTexNumByCharacter 逐个字符渲染时间控件
     * @param  {[type]} ctx           [Canvas对象]
     * @param  {[string]} numStr        [要渲染的字符串]
     * @param  {[type]} width         [控件总宽度]
     * @param  {[type]} characterW    [单个字符宽度]
     * @param  {[type]} height        [控件高度]
     * @param  {[type]} numObj        [纹理]
     * @return {[type]}               [description]
     */
    function drawTexTimeByCharacter(ctx,numStr,width,characterW,height,numObj){
        var xCoordinate,         //每个字符的x坐标
            initXPos,            //整个控件的起始位置
            widthOfNumStr;       //整个控件的宽度

        //计算整个数字图层控件的宽度
        widthOfNumStr=width;
        initXPos = (characterW-widthOfNumStr)/2;
        //由对齐方式设置整个控件的起始位置
        // switch(align){
        //     case 'left':
        //         initXPos=characterW/2-width/2;
        //         break;
        //     case 'right':
        //         initXPos=width/2+characterW/2-widthOfNumStr;
        //         break;
        //     case 'center':
        //     default:
        //         initXPos = (characterW-widthOfNumStr)/2;
        //         break;
        // }
        //设置第一个数字的起始位置
        xCoordinate = initXPos;

        for(var i=0;i<numStr.length;i++){
            //根据数字字符绘制对应的数字图层
            switch (numStr[i]){
                case '0':
                    drawNum(0,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '1':
                    drawNum(1,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '2':
                    drawNum(2,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '3':
                    drawNum(3,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '4':
                    drawNum(4,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '5':
                    drawNum(5,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '6':
                    drawNum(6,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '7':
                    drawNum(7,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '8':
                    drawNum(8,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '9':
                    drawNum(9,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case ':':
                    drawNum(10,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '/':
                    drawNum(11,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '-':
                    drawNum(12,characterW,height,numObj,xCoordinate,ctx);
                    break;

            }
            //设置下一个数字的起始位置
            xCoordinate+=characterW;

        }
        // /**
        //  * 绘制单个数字图层
        //  * @param  {[type]} num           [要渲染的数字图层对象在numObj中的位置]
        //  * @param  {[type]} characterW         [要渲染的数字图层对象宽度]
        //  * @param  {[type]} height        [要渲染的数字图层对象高度]
        //  * @param  {[type]} numObj        [数字图层纹理]
        //  * @param  {[type]} xCoordinate   [要渲染的数字图层对象起始位置x坐标]
        //  * @param  {[type]} ctx           [Canvas对象]
        //  * @return {[type]} null          [null]
        //  */
        function drawNum(num,characterW,height,numObj,xCoordinate,ctx){
            try{
                ctx.beginPath();
                //设置背景色
                ctx.fillStyle=numObj[num].color;
                ctx.fillRect(
                    xCoordinate-characterW/2,
                    -height/2,
                    characterW ,
                    height );
                //ctx.fillStyle=this.numObj[num].img;
                //插入图片
                ctx.drawImage(
                    numObj[num].img,
                    xCoordinate-characterW/2,
                    -height/2,
                    characterW ,
                    height );
                ctx.closePath();
                ctx.stroke();
            }catch(err){

            }


        }
    }



    fabric.MyButton = fabric.util.createClass(fabric.Object, {
        type: Type.MyButton,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;
            this.normalColor=level.texList[0].slices[0].color;
            this.arrange=level.info.arrange;

            this.text=level.info.text;
            this.fontFamily=level.info.fontFamily;
            this.fontSize=level.info.fontSize;
            this.fontColor=level.info.fontColor;
            this.fontBold=level.info.fontBold;
            this.fontItalic=level.info.fontItalic;

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
                self.normalImageElement = ResourceService.getResourceFromCache(tex.slices[0].imgSrc);

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            this.on('changeFontStyle',function(arg){
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
            this.on('changeArrange',function(arg){
                var _callback=arg.callback;
                self.arrange=arg.arrange;
                if(arg.arrange=='vertical'){
                    self.setAngle(90);
                    self.set({
                        originY:'bottom'
                    });
                }else if(arg.arrange=='horizontal'){
                    self.setAngle(0);
                    self.set({
                        originY:'top'
                    });
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
                    // console.log('button font',fontString)
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
        var level=ProjectService.getLevelById(object.id);
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
                mb:false,
                ml:false,
                mr:false,
                mt:false,
                tl:false,
                tr:false
            };
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.setControlsVisibility(ctrlOptions);//使text控件只能左右拉伸
            this.hasRotatingPoint=false;
            this.backgroundColor=level.texList[0].slices[0].color;
            this.arrange=level.info.arrange;

            this.text=level.info.text;
            this.fontFamily=level.info.fontFamily;
            this.fontSize=level.info.fontSize;
            this.fontColor=level.info.fontColor;
            this.fontBold=level.info.fontBold;
            this.fontItalic=level.info.fontItalic;
            this.fontUnderline=level.info.fontUnderline;

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
            this.on('changeArrange',function(arg){
                var _callback=arg.callback;
                self.arrange=arg.arrange;
                if(arg.arrange=='vertical'){
                    self.setAngle(90);
                    self.set({
                        originY:'bottom'
                    });
                }else if(arg.arrange=='horizontal'){
                    self.setAngle(0);
                    self.set({
                        originY:'top'
                    });
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
        var level=ProjectService.getLevelById(object.id);
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
            this.arrange=level.info.arrange;
            //下面位数字模式属性
            this.numOfDigits=level.info.numOfDigits;
            this.decimalCount=level.info.decimalCount;
            this.symbolMode=level.info.symbolMode;
            this.frontZeroMode=level.info.frontZeroMode;
            this.maxFontWidth=level.info.maxFontWidth;
            this.spacing = (level.info.spacing===undefined)?(level.info.spacing=Math.ceil(-this.fontSize/3)):level.info.spacing;//兼容旧的数字控件
            this.paddingRatio = level.info.paddingRatio;
            //数字进制
            this.numSystem = level.info.numSystem;
            this.markingMode = level.info.hexControl.markingMode;
            this.transformMode = level.info.hexControl.transformMode;

            var maxWidth = parseInt(self.fontSize);//+
            self.maxFontWidth = maxWidth;
            level.info.maxFontWidth = maxWidth;
            var width = self.symbolMode=='0'?(self.numOfDigits*(maxWidth+self.spacing)-self.spacing):((self.numOfDigits+1)*(maxWidth+self.spacing)-self.spacing);
            var paddingX = Math.ceil(maxWidth*self.paddingRatio);
            width+=paddingX*2;
            if(self.decimalCount!=0){
                width +=0.5*maxWidth+self.spacing;
            }
            var height = self.fontSize*1.2;
            self.set({width:width,height:height});

            if(this.paddingRatio===undefined){
                //维护旧的数字控件
                level.info.paddingRatio = 0.1;
                this.paddingRatio = 0.1;
                var maxWidth = parseInt(this.fontSize);
                var paddingX = Math.ceil(maxWidth*this.paddingRatio);
                this.maxFontWidth = maxWidth;
                level.info.paddingX = this.paddingX;
                level.info.maxFontWidth = maxWidth;
                if(this.numOfDigits&&this.fontSize){
                    var width = this.symbolMode=='0'?(this.numOfDigits*(maxWidth+this.spacing)-this.spacing):((this.numOfDigits+1)*(maxWidth+this.spacing)-this.spacing);
                    width+=paddingX*2;
                    if(this.decimalCount!=0){
                        width +=0.5*maxWidth+this.spacing;
                    }
                    var height = Math.ceil(self.fontSize*1.2);
                    level.info.width = width;
                    level.info.height = height;
                    self.set({width:width,height:height});
                };
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
            this.on('changeArrange',function(arg){
                var _callback=arg.callback;
                self.arrange=arg.arrange;
                if(arg.arrange=='vertical'){
                    self.setAngle(90);
                    self.set({
                        originY:'bottom'
                    });
                }else if(arg.arrange=='horizontal'){
                    self.setAngle(0);
                    self.set({
                        originY:'top'
                    });
                }
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            this.on('changeNumContent', function (arg){
                var _callback=arg.callback;
                var level=arg.level;
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
                if(arg.hasOwnProperty('spacing')){
                    self.spacing = arg.spacing;
                }

                //设置宽高
                var font = self.fontItalic + " " + self.fontBold + " " + self.fontSize + "px" + " " + self.fontFamily;
                // var maxWidth = Math.ceil(FontMesureService.getMaxWidth('0123456789.+-',font));//-
                var maxWidth = parseInt(self.fontSize);//+
                self.maxFontWidth = maxWidth;
                level.info.maxFontWidth = maxWidth;

                var width = self.symbolMode=='0'?(self.numOfDigits*(maxWidth+self.spacing)-self.spacing):((self.numOfDigits+1)*(maxWidth+self.spacing)-self.spacing);
                var paddingX = Math.ceil(maxWidth*self.paddingRatio);
                width+=paddingX*2;

                if(self.decimalCount!=0){
                    width +=0.5*maxWidth+self.spacing;
                }
                var height = self.fontSize*1.2;
                self.set({width:width,height:height});

                //console.log('width',width,'maxWidth',maxWidth);
                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            this.on('changeNumSystem', function(arg){
                var _callback=arg.callback;
                var level=arg.level;
                if(arg.numSystem){
                    self.numSystem=arg.numSystem;
                    if(self.markingMode=='1'){
                        self.numSystem=='1'?self.numOfDigits+=2:self.numOfDigits-=2;
                        level.info.numOfDigits=self.numOfDigits;
                    }
                }
                if(arg.markingMode){
                    self.markingMode=arg.markingMode;
                    self.markingMode=='1'?self.numOfDigits+=2:self.numOfDigits-=2;
                    level.info.numOfDigits=self.numOfDigits;
                }
                if(arg.transformMode){
                    self.transformMode=arg.transformMode;
                }

                var maxWidth = parseInt(self.fontSize);
                self.maxFontWidth = maxWidth;
                level.info.maxFontWidth = maxWidth;
                var width = self.symbolMode=='0'?(self.numOfDigits*(maxWidth+self.spacing)-self.spacing):((self.numOfDigits+1)*(maxWidth+self.spacing)-self.spacing);
                var paddingX = Math.ceil(maxWidth*self.paddingRatio);
                width+=paddingX*2;
                if(self.decimalCount!=0){
                    width +=0.5*maxWidth+self.spacing;
                }
                var height = self.fontSize*1.2;
                self.set({width:width,height:height});

                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            })

        },
        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'));
        },
        _render: function (ctx) {
            try{
                ctx.fillStyle=this.fontColor;
                //在数字框里展示数字预览效果
                if(!isNaN(this.numValue)) {
                    ctx.font =this.fontItalic + " " + this.fontBold + " " + this.fontSize + "px" + " " + this.fontFamily;
                    //ctx.textAlign = this.align;
                    ctx.textBaseline='middle';//设置数字垂直居中
                    var negative=false;
                    if(this.numValue<0){
                        negative=true;
                    }
                    var tempNumValue=Math.abs(this.numValue);
                    tempNumValue= tempNumValue.toString();
                    var i=0;
                    //配置小数位数
                    if(this.decimalCount>0){
                        var baseCount = Math.pow(10,this.decimalCount);
                        tempNumValue = (Math.abs(this.numValue)/baseCount).toString();
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
                    if((this.symbolMode=='1')&&(negative)){
                        tempNumValue='-'+tempNumValue;
                    }
                    //16进制转换
                    if(this.numSystem=='1'){
                        tempNumValue=parseInt(tempNumValue).toString(16);
                        if(this.transformMode=='1'){
                            tempNumValue=tempNumValue.toUpperCase();
                        }
                        if(this.markingMode=='1'){
                            tempNumValue='0x'+tempNumValue;
                        }
                    }

                    drawNumByCharacter(ctx,tempNumValue,this.align,this.width,this.fontSize,this.decimalCount,this.spacing);

                    //offCtx.restore();
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
        var level=ProjectService.getLevelById(object.id);
        callback&&callback(new fabric.MyNum(level,object));
    };
    fabric.MyNum.async = true;
    /**
     * 逐字渲染数字控件
     * @param  {[type]} ctx           [Canvas对象]
     * @param  {[type]} numStr        [数字字符串]
     * @param  {[type]} align         [对齐方式]
     * @param  {[type]} width         [控件宽度]
     * @param  {[type]} fontSize      [字符大小]
     * @param  {[type]} decimalCount  [小数点模式]
     * @param  {[number]}spacing      [字符间距]
     * @return {[type]}               [description]
     */
    function drawNumByCharacter(ctx,numStr,align,width,fontSize,decimalCount,spacing){
        var xCoordinate,         //渲染每个字符的x坐标
            initXPos,            //渲染字符的起始位置
            widthOfNumStr,       //渲染的字符串的长度
            padding;             //数字边缘的留白

        padding = Math.ceil(fontSize/10);
        width = width-2*padding;

        widthOfNumStr=(decimalCount===0?(fontSize*numStr.length):(fontSize*(numStr.length-0.5)));
        widthOfNumStr += (numStr.length-1)*spacing;
        ctx.textAlign = 'center';
        switch(align){
            case 'left':
                initXPos=0;
                break;
            case 'right':
                initXPos= (widthOfNumStr > width) ? 0 : width-widthOfNumStr;
                break;
            case 'center':
            default:
                initXPos = (widthOfNumStr > width) ? 0 : (width-widthOfNumStr)/2;
                break;
        }
        xCoordinate = initXPos-width/2;
        xCoordinate += fontSize/2;      //+ 使数字画在方格中央

        // 修改数字控件字符的渲染位置的计算方式,
        // 步长改为当字符总的长度大于控件的宽度时为控件宽度的等分，否则为字符宽度
        var containerMeanValuePerChar = (0 === decimalCount ? ((width-fontSize)/(numStr.length-1)) : ((width-fontSize)/((numStr.length-1)+0.5-1)));
        var displayStep = widthOfNumStr > width ? containerMeanValuePerChar : fontSize;

        for(var i=0;i<numStr.length;i++){

            if(numStr[i]==='.'){
                //小数点往左偏移20%
                var tempXCor = xCoordinate-fontSize/5;
                ctx.fillText(numStr[i],tempXCor,0);
                // ctx.strokeRect(xCoordinate-fontSize/2,-fontSize/2-padding,fontSize+2*padding,fontSize+2*padding);
                xCoordinate+=displayStep/2;// 小数点显示坐标的步长为其它字符宽度的一半
            }else{
                ctx.fillText(numStr[i],xCoordinate,0);
                // ctx.strokeRect(xCoordinate-fontSize/2,-fontSize/2-padding,fontSize+2*padding,fontSize+2*padding);
                xCoordinate+=displayStep;
            }
            xCoordinate += spacing;
        }
    }

    //TexNum
    fabric.MyTexNum = fabric.util.createClass(fabric.Object,{
        type: Type.MyTexNum,
        initialize: function (level, options) {
            var self = this;
            var slices = level.texList[0].slices;
            var ctrlOptions = {
                bl: false,
                br: false,
                mb: false,
                ml: false,
                mr: false,
                mt: false,
                tl: false,
                tr: false
            };
            this.callSuper('initialize', options);
            this.lockRotation = true;
            this.setControlsVisibility(ctrlOptions);//使数字控件不能拉伸
            this.hasRotatingPoint = false;

            this.numValue = level.info.numValue;
            this.align = level.info.align;
            this.arrange = level.info.arrange;
            //下面为数字图层的属性
            this.numOfDigits = level.info.numOfDigits;
            this.decimalCount = level.info.decimalCount;
            this.symbolMode = level.info.symbolMode;
            this.frontZeroMode = level.info.frontZeroMode;
            this.maxFontWidth = level.info.maxFontWidth;
            this.characterW = level.info.characterW;
            this.characterH = level.info.characterH;

            //数字进制
            this.numSystem = level.info.numSystem;
            this.markingMode = level.info.hexControl.markingMode;
            this.transformMode = level.info.hexControl.transformMode;


            //初始化数字字符
            this.numObj = [];
            for(var i=0,il=26;i<il;i++){
                this.numObj[i] = {};
                this.numObj[i].color = slices[i].color;
                this.numObj[i].img = ResourceService.getResourceFromCache(slices[i].imgSrc);
            }

            //修改数字纹理
            this.on('changeTex', function (arg) {
                var slices=arg.level.texList[0].slices;
                var _callback=arg.callback;

                for(var i=0,il=26;i<il;i++){
                    self.numObj[i] = {};
                    self.numObj[i].color = slices[i].color;
                    self.numObj[i].img = ResourceService.getResourceFromCache(slices[i].imgSrc);
                }

                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();

            });

            //修改数字图层控件属性
            this.on('changeTexNumContent', function (arg) {
                var _callback=arg.callback;
                var level=arg.level;
                if(arg.hasOwnProperty('numValue')){
                    self.numValue=arg.numValue;
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
                if(arg.hasOwnProperty('characterW')){
                    self.characterW = level.info.characterW;
                }
                if(arg.hasOwnProperty('characterH')){
                    self.characterH = level.info.characterH;
                }

                //设置图层数字控件的宽高
                if(self.numOfDigits&&self.characterW){
                    //加入符号宽度
                    var width = self.symbolMode=='0'?(self.numOfDigits*self.characterW):((self.numOfDigits+1)*self.characterW);
                    //加入小数点宽度
                    if(self.decimalCount!=0){
                        width +=0.5*self.characterW;
                    }
                    //设置高度
                    var height = self.characterH;

                    self.set({width:width,height:height});
                };


                //console.log('width',width,'maxWidth',maxWidth);
                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });

            //数字进制
            this.on('changeNumSystem',function(arg){
                var _callback=arg.callback;
                var level=arg.level;
                if(arg.numSystem){
                    self.numSystem=arg.numSystem;
                    if(self.markingMode=='1'){
                        self.numSystem=='1'?self.numOfDigits+=2:self.numOfDigits-=2;
                        level.info.numOfDigits=self.numOfDigits;
                    }
                }
                if(arg.markingMode){
                    self.markingMode=arg.markingMode;
                    self.markingMode=='1'?self.numOfDigits+=2:self.numOfDigits-=2;
                    level.info.numOfDigits=self.numOfDigits;
                }
                if(arg.transformMode){
                    self.transformMode=arg.transformMode;
                }

                if(self.numOfDigits&&self.characterW){
                    //加入符号宽度
                    var width = self.symbolMode=='0'?(self.numOfDigits*self.characterW):((self.numOfDigits+1)*self.characterW);
                    //设置高度
                    var height = self.characterH;
                    self.set({width:width,height:height});
                }

                var subLayerNode = CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            })
        },
        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'));
        },

        _render:function(ctx){
            try{
                //在数字框里展示数字预览效果
                if(!isNaN(this.numValue)) {
                    //设置正负
                    var negative=false;
                    if(this.numValue<0){
                        negative=true;
                    }
                    //取绝对值
                    var tempNumValue=Math.abs(this.numValue);
                    //数值字符串化
                    tempNumValue= tempNumValue.toString();

                    var i=0;
                    //配置小数位数
                    if(this.decimalCount>0){
                        //Math.pow(x,y)返回x的y次幂
                        var baseCount = Math.pow(10,this.decimalCount);
                        //数值字符串化
                        tempNumValue = (Math.abs(this.numValue)/baseCount).toString();
                        //.indexOf('.')返回'.'在字符串中首次出现的位置，-1表示没有出现
                        if(tempNumValue.indexOf('.')!=-1){
                            //console.log('输入有小数')
                            //.split('.')[1]把字符串分割，tempNumValue.split('.')是返回的字符串数组，tempNumValue.split('.')[1]是小数部分
                            var tempDecimalCount=tempNumValue.split('.')[1];
                            //当小数部分的后几位为0时将0补足
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
                    if((this.symbolMode=='1')&&(negative)){
                        tempNumValue='-'+tempNumValue;
                    }

                    if(this.numSystem=='1'){
                        tempNumValue=parseInt(tempNumValue).toString(16);
                        if(this.transformMode=='1'){
                            tempNumValue=tempNumValue.toUpperCase();
                        }
                        if(this.markingMode=='1'){
                            tempNumValue='0x'+tempNumValue;
                        }
                    }
                    //console.log('keke',this.characterW,"Y",this.characterH);
                    drawTexNumByCharacter(ctx,tempNumValue,this.align,this.width,this.characterW,this.characterH,this.decimalCount,this.numObj);

                }
                //将图片超出canvas的部分裁剪
                this.clipTo=function(ctx){
                    ctx.save();
                    ctx.beginPath();//此时的坐标在控件的正中，因为设置了originX: 'center', originY: 'center'
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
                toastr.warning('渲染数字出错');
            }

        }
    });
    fabric.MyTexNum.fromLevel = function(level,callback,option){
        callback && callback(new fabric.MyTexNum(level, option));
    };
    fabric.MyTexNum.fromObject = function(object,callback){
        var level=ProjectService.getLevelById(object.id);
        callback&&callback(new fabric.MyTexNum(level,object));
    };
    fabric.MyTexNum.async = true;
    /**
     * 逐字渲染数字图层控件
     * @param  {[type]} ctx           [Canvas对象]
     * @param  {[type]} numStr        [数字字符串]
     * @param  {[type]} align         [对齐方式]
     * @param  {[type]} width         [数字图层控件总宽度]
     * @param  {[type]} characterW    [单个数字图层宽度]
     * @param  {[type]} height        [单个数字图层高度]
     * @param  {[type]} decimalCount  [小数点位数]
     * @param  {[type]} numObj        [数字图层纹理]
     * @return {[type]}               [description]
     */
    function drawTexNumByCharacter(ctx,numStr,align,width,characterW,height,decimalCount,numObj){
        var xCoordinate,         //每个字符的x坐标
            initXPos,            //整个数字图层控件的起始位置
            widthOfNumStr;       //整个数字图层控件的宽度

        //计算整个数字图层控件的宽度
        widthOfNumStr=(decimalCount===0?(characterW*numStr.length):(characterW*(numStr.length-0.5)));

        //由对齐方式设置整个数字图层控件的起始位置
        switch(align){
            case 'left':
                initXPos=characterW/2-width/2;
                break;
            case 'right':
                initXPos=width/2+characterW/2-widthOfNumStr;
                break;
            case 'center':
            default:
                initXPos = (characterW-widthOfNumStr)/2;
                break;
        }
        //设置第一个数字的起始位置
        xCoordinate = initXPos;

        for(var i=0;i<numStr.length;i++){
            //根据数字字符绘制对应的数字图层
            switch (numStr[i]){
                case '0':
                    drawNum(0,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '1':
                    drawNum(1,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '2':
                    drawNum(2,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '3':
                    drawNum(3,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '4':
                    drawNum(4,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '5':
                    drawNum(5,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '6':
                    drawNum(6,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '7':
                    drawNum(7,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '8':
                    drawNum(8,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '9':
                    drawNum(9,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '.':
                    drawNum(10,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '+':
                    drawNum(11,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case '-':
                    drawNum(12,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'x':
                    drawNum(13,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'a':
                    drawNum(14,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'b':
                    drawNum(15,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'c':
                    drawNum(16,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'd':
                    drawNum(17,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'e':
                    drawNum(18,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'f':
                    drawNum(19,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'A':
                    drawNum(20,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'B':
                    drawNum(21,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'C':
                    drawNum(22,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'D':
                    drawNum(23,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'E':
                    drawNum(24,characterW,height,numObj,xCoordinate,ctx);
                    break;
                case 'F':
                    drawNum(25,characterW,height,numObj,xCoordinate,ctx);
                    break;

            }
            //设置下一个数字的起始位置
            if(numStr[i]=='.'){
                xCoordinate+=characterW/2;
            }else{
                xCoordinate+=characterW;
            }
        }
        // /**
        //  * 绘制单个数字图层
        //  * @param  {[type]} num           [要渲染的数字图层对象在numObj中的位置]
        //  * @param  {[type]} characterW         [要渲染的数字图层对象宽度]
        //  * @param  {[type]} height        [要渲染的数字图层对象高度]
        //  * @param  {[type]} numObj        [数字图层纹理]
        //  * @param  {[type]} xCoordinate   [要渲染的数字图层对象起始位置x坐标]
        //  * @param  {[type]} ctx           [Canvas对象]
        //  * @return {[type]} null          [null]
        //  */
        function drawNum(num,characterW,height,numObj,xCoordinate,ctx){
            try{
                ctx.beginPath();
                //设置背景色
                ctx.fillStyle=numObj[num].color;
                ctx.fillRect(
                    xCoordinate-characterW/2,
                    -height/2,
                    characterW ,
                    height );
                //ctx.fillStyle=this.numObj[num].img;
                //插入图片
                ctx.drawImage(
                    numObj[num].img,
                    xCoordinate-characterW/2,
                    -height/2,
                    characterW ,
                    height );
                ctx.closePath();
                ctx.stroke();
            }catch(err){

            }


        }
    }

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
            for(var i=0;i<level.texList.length-1;i++){
                self.normalColors.push(level.texList[i].slices[0].color);
                self.normalImageElements.push(ResourceService.getResourceFromCache(level.texList[i].slices[0].imgSrc));
            }
            //_.forEach(level.texList, function (_tex) {
            //    self.normalColors.push(_tex.slices[0].color);
            //
            //    self.normalImageElements.push(ResourceService.getResourceFromCache(_tex.slices[0].imgSrc));
            //
            //});

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
                //_.forEach(level.texList, function (_tex) {
                //    self.normalColors.push(_tex.slices[0].color);
                //    self.normalImageElements.push(ResourceService.getResourceFromCache(_tex.slices[0].imgSrc));
                //});
                for(var i=0;i<level.texList.length-1;i++){
                    self.normalColors.push(level.texList[i].slices[0].color);
                    self.normalImageElements.push(ResourceService.getResourceFromCache(level.texList[i].slices[0].imgSrc));
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
        var level=ProjectService.getLevelById(object.id);
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
        var level=ProjectService.getLevelById(object.id);
        callback&&callback(new fabric.MyNumber(level,object));
    };
    fabric.MyNumber.async = true;



    //myvideo
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyVideo(level, object));
    };
    fabric.MyVideo.async = true;

    //myslide
    fabric.MySlide = fabric.util.createClass(fabric.Object, {
        type: Type.MySlide,
        initialize: function (level, options) {
            var self=this;
            this.callSuper('initialize',options);
            this.lockRotation=true;
            this.hasRotatingPoint=false;

            var tex=level.texList[0];
            this.currentColor=tex.slices[tex.currentSliceIdx].color;

            this.text=tex.slices[0].text||'';
            this.fontFamily=level.info.fontFamily||"宋体";
            this.fontSize=level.info.fontSize||20;
            this.fontColor=level.info.fontColor||'rgba(0,0,0,1)';
            this.fontBold=level.info.fontBold||"100";
            this.fontItalic=level.info.fontItalic||"";

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
                self.text = tex.slices[0].text;
                var subLayerNode=CanvasService.getSubLayerNode();
                subLayerNode.renderAll();
                _callback&&_callback();
            });
            this.on('changeFontStyle',function(arg){
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
                ctx.save();
                ctx.fillStyle=this.currentColor;
                ctx.fillRect(
                    -(this.width / 2),
                    -(this.height / 2) ,
                    this.width ,
                    this.height );
                if (this.currentImageElement){
                    ctx.drawImage(this.currentImageElement, -this.width / 2, -this.height / 2,this.width,this.height);
                }
                ctx.restore();

                if(this.text){
                    ctx.save();
                    ctx.fillStyle=this.fontColor;
                    var fontString=this.fontItalic+" "+this.fontBold+" "+this.fontSize+"px"+" "+'"'+this.fontFamily+'"';
                    // console.log('button font',fontString)
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
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MySlide(level, object));
    };
    fabric.MySlide.async = true;

    //myAnimation
    fabric.MyAnimation = fabric.util.createClass(fabric.Object, {
        type: Type.MyAnimation,
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
    fabric.MyAnimation.fromLevel= function (level, callback,option) {
        callback && callback(new fabric.MyAnimation(level, option));
    }
    fabric.MyAnimation.prototype.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                currentColor:this.currentColor,
                currentImageElement:this.currentImageElement
            });
        }
    })(fabric.MyAnimation.prototype.toObject);
    fabric.MyAnimation.fromObject = function (object, callback) {
        var level=ProjectService.getLevelById(object.id);
        callback && callback(new fabric.MyAnimation(level, object));
    };
    fabric.MyAnimation.async = true;


}]);