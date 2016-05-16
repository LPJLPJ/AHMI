/**
 * Created by shenaolin on 16/3/12.
 */
ideServices
    .service('TemplateProvider', function (Type,CanvasService,Preference) {


        var project;
        this.saveProjectFromGlobal= function (_project) {
            project=_project;
            
        }

        this.getDefaultPage = function () {
            return this.getRandomPage();
        };
        /**
         * 获得随机页面
         * @returns {{url, id, proJsonStr, layers}}
         */
        this.getRandomPage = function () {
            var r = _.random(64, 255);
            var g = _.random(64, 255);
            var b = _.random(64, 255);
            var jsonStr = '{"objects":[],"background":"rgb(' + r + ',' + g + ',' + b + ')"}';
            return {
                url: '',
                id: Math.random().toString(36).substr(2),
                proJsonStr: jsonStr,
                layers: [],
                name: 'NewPage',
                type: Type.MyPage,
                mode:0, //0:编辑Page  1:编辑SubLayer
                expand:true,
                selected:false,
                current:false,
                backgroundColor:'rgb(' + r + ',' + g + ',' + b + ')',
                backgroundImage:'',
                currentFabLayer:null,
            }

        };


        this.getDefaultLayer = function () {
            var pageNode=CanvasService.getPageNode();
            var info = {
                width:(pageNode.getWidth()/pageNode.getZoom()) / 2, height: (pageNode.getHeight()/pageNode.getZoom()) / 2,


                //width: project.currentSize.width / 2, height: project.currentSize.height / 2,
                left: 0, top: 0,
                originX: 'center', originY: 'center'
            };

            var subLayer = this.getDefaultSubLayer();
            return {
                url: subLayer.backgroundImage,
                id: Math.random().toString(36).substr(2),
                info: info,
                subLayers: [subLayer],
                name: 'NewCanvas',
                type: Type.MyLayer,
                expand:true,
                showSubLayer:subLayer,
                zIndex:0

            }
        };

        this.getDefaultSubLayer = function () {
            var jsonStr = '{"objects":[],"background":"rgba(' + 255 + ',' + 255 + ',' + 255 + ',1.0)"}';
            return {
                url: '/public/images/blank.png',
                id: Math.random().toString(36).substr(2),
                proJsonStr: jsonStr,
                widgets: [],
                name: 'NewSubCanvas',
                type: Type.MySubLayer,
                width: 0,
                height: 0,
                expand:true,
                backgroundImage:'',
                backgroundColor:"rgba(255,255,255,1.0)"

            }
        };

        this.getImageSubLayer = function () {
            var jsonStr = '{"objects":[],"background":"rgba(255,255,255,1.0)","backgroundImage":{"type":"image","originX":"left","originY":"top","left":0,"top":0,"width":500,"height":284,"fill":"rgb(0,0,0)","strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","src":"http://localhost:63342/AHMIDesigner/modules/ide/demo3.jpg","filters":[],"crossOrigin":"","alignX":"none","alignY":"none","meetOrSlice":"meet"}}';
            var backgroundImage=Preference.getRandomImageURL();
            return {
                url: backgroundImage,
                id: Math.random().toString(36).substr(2),
                proJsonStr: jsonStr,
                widgets: [],
                name: 'NewSubCanvas',
                type: Type.MySubLayer,
                width: 0,
                height: 0,
                expand:true,
                backgroundImage:backgroundImage

            }
        };

        this.getDefaultWidget = function () {
            return this.getDefaultSlide();
        };
        this.getDefaultSlide = function () {
            var subLayerNode = CanvasService.getSubLayerNode();
            var info = {
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center'
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                subSlides: [],
                name: 'NewSlide',
                type: Type.MySlide,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    name:'纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'图片'
                    }]
                }]

            }
        }

        this.getDefaultButton= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:true            //true:横向 false:竖向
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                normalImg:'',
                pressImg:'',
                name: 'NewButton',
                type: Type.MyButton,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:[{
                    name:'按钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下前'
                    },{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下后'
                    }]
                }]
            }
        };
        this.getDefaultKnob=function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:true            //true:横向 false:竖向
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                backgroundImg:'',
                buttonImg:'',
                name: 'NewKnob',
                type: Type.Myknob,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:[{
                    name:'旋钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按钮背景'
                    },{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按钮'
                    }]
                }]
            }
        };
        this.getDefaultTextArea = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:true,         //true:横向 false:竖向
                text:'文本',
                fontFamily:'Arial',
                fontSize:15,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:"",
                fontUnderline:null,
                boldBtnToggle:false,
                italicBtnToggle:false,
                underlineBtnToggle:false
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                backgroundImg:'',
                buttonImg:'',
                name: 'NewTextArea',
                type: Type.MyTextArea,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:[{
                    name:'文本框',
                    currentSliceIdx:0,
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'文本框背景'
                    }]
                }]
            }
        };

        this.getDefaultButtonGroup= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',
                interval:0,//间距
                intervalScale:0,//间距长度占总长度的比例,缩放时用到
                count:2,
                arrange:"horizontal"   //horizontal:水平   vertical:竖直

            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                normalImg:'',
                pressImg:'',
                name: 'NewButtonGroup',
                type: Type.MyButtonGroup,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:[{
                    name:'按钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下前'
                    },{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下后'
                    }]
                },{
                    name:'按钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下前'
                    },{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'按下后'
                    }]
                }]
            }
        }

        this.getDefaultButtonTex= function () {
            return{
                name:'按钮纹理',
                currentSliceIdx:0,
                slices:[{
                    color:_getRandomColor(),
                    imgSrc:'',
                    name:'按下前'
                },{
                    color:_getRandomColor(),
                    imgSrc:'',
                    name:'按下后'
                }]
            }
        }

        this.getDefaultProgress= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                progressValue:50,
                arrange:"horizontal"   //horizontal:水平   vertical:竖直
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                backgroundImg:'',
                progressImg:'',
                name: 'NewProgress',
                type: Type.MyProgress,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'进度条',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'进度条'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'进度条底纹',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'进度条底纹'
                    }]
                }]

            }
        };


        this.getDefaultDashboard= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:360,
                lowAlarmValue:0,highAlarmValue:360,
                value:50,
                pointerLength:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewDashboard',
                type: Type.MyDashboard,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'仪表盘背景',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'仪表盘背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'仪表盘指针',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'仪表盘指针'
                    }]
                }]

            }
        };

        this.getDefaultNumber= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,



                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                noInit:'NO',
                initValue:0
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewNumber',
                type: Type.MyNumber,
                expand:true,
                url:'',
                zIndex:0,
                texList:[]

            }
        }

        function _getRandomColor(){
            var r = _.random(64, 255);
            var g = _.random(64, 255);
            var b = _.random(64, 255);
            return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
        }



    });