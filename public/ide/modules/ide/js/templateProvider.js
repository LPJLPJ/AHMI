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

        this.getDefaultImage = function(){
             var subLayerNode = CanvasService.getSubLayerNode();
            var info = {
                width:(subLayerNode.getWidth()/subLayerNode.getZoom())/4,
                height:(subLayerNode.getHeight()/subLayerNode.getZoom())/4,
                left:0,top:0,
                originX:'center',originY:'center',
            };
            return{
                id:Math.random().toString(36).substr(2),
                info:info,
                name:'NewImage',
                type:Type.MyImage,
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
                arrange:true,            //true:横向 false:竖向

                buttonText:'button',
                buttonFontFamily:"Arial",
                buttonFontSize:20,
                buttonFontColor:'rgba(0,0,0,1)',
                buttonFontBold:"100",
                buttonFontItalic:'',
                boldBtnToggle:false,
                italicBtnToggle:false
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
                minValue:0,maxValue:360,
                value:0,//value 代表旋转角度，knob控件和tag绑定，代表旋转的角度。
                knobSize:parseInt((subLayerNode.getWidth()/subLayerNode.getZoom()) / 4)
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                backgroundImg:'',
                knobImg:'',
                name: 'NewKnob',
                type: Type.MyKnob,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'旋钮背景',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'旋钮背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'旋钮',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'旋钮'
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
                fontName:'正文',
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
                arrange:"horizontal" ,  //horizontal:水平   vertical:竖直
                cursor:"0"   //光标设置，0:无光标，1:有光标

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
                    name:'进度条底纹',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'进度条底纹'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'进度条',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'进度条'
                    }]
                }]

            }
        };


        this.getDefaultDashboard= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4,
                height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                clockwise:'1',//1代表顺时针，0代表逆时针
                minValue:0,maxValue:360,
                lowAlarmValue:0,highAlarmValue:360,
                value:45,
                offsetValue:0,
                pointerLength:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                dashboardModeId:'0',
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
        };

        this.getDefaultNum = function(){
            var subLayerNode = CanvasService.getSubLayerNode();
            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                noInit:'NO',
                //initValue:'1',

                numModeId:'0',//显示模式标志，0:普通模式 1:动画模式
                frontZeroMode:'0',//前导0模式标志，0：无前导0模式，1：有前导0模式
                symbolMode:'0',//符号模式标志，1：无符号位，1：有符号位
                decimalCount:0,//保留的小数位数
                numOfDigits:8,//数字的位数，最小1，最大未定
                align:'center',//数字对齐方式

                arrange:true,         //true:横向 false:竖向
                numValue:1,
                numFamily:'Arial',
                numSize:15,
                numColor:'rgba(0,0,0,1)',
                numBold:"100",
                numItalic:"",
                boldBtnToggle:false,
                italicBtnToggle:false
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewNum',
                type: Type.MyNum,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    name:'数字',
                    currentSliceIdx:0,
                    slices:[{
                        color:'rgba(120,120,120,1)',
                        imgSrc:'',
                        name:'数字背景'
                    }]
                }]
            }
        };

        this.getDefaultOscilloscope = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                spacing:50,   //光标间距
                oscColor:'rgb(50,60,50)'

            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                backgroundImg:'',
                oscillationImg:'',
                name: 'NewOscilloscope',
                type: Type.MyOscilloscope,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'示波器背景',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'示波器背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'波形渲染背景',//指示波器折线图下方图案
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'波形渲染背景'
                    }]
                }]

            }
        };

        this.getDefaultSwitch=function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                bindBit:-1 //绑定某tag的第几位
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewSwitch',
                type: Type.MySwitch,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'开关图片',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'开关图片'
                    }]
                }]

            }
        };
        this.getDefaultRotateImg=function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:360,
                initValue:0
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewRotateImg',
                type: Type.MyRotateImg,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'旋转图片',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'旋转图片'
                    }]
                }]

            }
        };
        this.getDefaultDateTime=function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                initValue:0,
                dateTimeModeId:'0'//0表示时间，1表示日期
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewDateTime',
                type: Type.MyDateTime,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'旋转图片',
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'时间日期'
                    }]
                }]

            }
        };


        function _getRandomColor(){
            var r = _.random(64, 255);
            var g = _.random(64, 255);
            var b = _.random(64, 255);
            return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
        }



    });