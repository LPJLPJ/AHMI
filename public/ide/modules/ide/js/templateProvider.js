/**
 * Created by shenaolin on 16/3/12.
 */
ideServices
    .service('TemplateProvider', ['Type','CanvasService','Preference',function (Type,CanvasService,Preference) {


        function Transition(name,show,duration){
            this.name=name||'';
            this.show=show||'';
            this.duration=duration;
        }

        var defaultTransition=new Transition('NO_TRANSITION','无动画',0);

        var project,
            defaultButton={
                info :{
                    width:100,
                    height: 50,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    arrange:'horizontal',

                    text:'button',
                    fontFamily:"宋体",
                    fontSize:20,
                    fontColor:'rgba(0,0,0,1)',
                    fontBold:"100",
                    fontItalic:'',
                },
                texList:[{
                    name:'按钮纹理',
                    currentSliceIdx:0,
                    slices:[{
                        color:'rgba(220,82,74,1)',
                        imgSrc:'',
                        name:'按下前'
                    },{
                        color:'rgba(254,205,82,1)',
                        imgSrc:'',
                        name:'按下后'
                    },{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]
            },
            defaultSwitch={
                info:{
                    width:50, height: 50,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    bindBit:null
                    },
                texList:[{
                        currentSliceIdx:0,
                         name:'开关图片',
                        slices:[{
                            color:'rgba(40,40,40,1)',
                            imgSrc:'',
                            name:'开关图片'
                    }]
                }]
            },
            defaultProgress={
                info:{
                    width:177,
                    height: 44,

                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    minValue:0,maxValue:100,
                    lowAlarmValue:0,highAlarmValue:100,
                    progressValue:50,
                    arrange:"horizontal" ,
                    cursor:"0",
                    progressModeId:'0'
                    },
                texList:[{
                    currentSliceIdx:0,
                    name:'进度条底纹',
                    slices:[{
                        color:'rgba(60,60,60,1)',
                        imgSrc:'',
                        name:'进度条底纹'
                    }]
                 },{
                    currentSliceIdx:0,
                    name:'进度条',
                    slices:[{
                        color:'rgba(70,70,70,1)',
                        imgSrc:'',
                        name:'进度条'
                    }]
                }]
            },
            defaultDashboard={
                info:{
                    width:250,
                    height: 250,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    clockwise:'1',
                    minValue:0,maxValue:360,
                    minAngle:0,maxAngle:360,
                    lowAlarmValue:0,highAlarmValue:360,
                    minCoverAngle:0,maxCoverAngle:0,
                    value:45,
                    offsetValue:0,
                    pointerLength:185
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'仪表盘背景',
                    slices:[{
                        color:'rgba(100,100,100,1)',
                        imgSrc:'',
                        name:'仪表盘背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'仪表盘指针',
                    slices:[{
                        color:'rgba(120,120,120,1)',
                        imgSrc:'',
                        name:'仪表盘指针'
                    }]
                }]
            },
            defaultRotateImage={
                info:{
                    width: 100,
                    height: 100,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    minValue:0,maxValue:360,
                    initValue:0
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'旋转图片',
                    slices:[{
                        color:'rgba(150,150,150,1)',
                        imgSrc:'',
                        name:'旋转图片'
                    }]
                }]
            },
            defaultSlideBlock={
                info:{
                    width:160,
                    height:50,

                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    minValue:0,maxValue:100,
                    lowAlarmValue:0,highAlarmValue:100,
                    initValue:0,
                    arrange:"horizontal"
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'滑块背景',
                    slices:[{
                        color:'rgba(63,63,63,1)',
                        imgSrc:'',
                        name:'滑块背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'滑块',
                    slices:[{
                        color:'rgba(180,180,180,1)',
                        imgSrc:'',
                        name:'滑块'
                    }]
                }]
            },
            defaultButtonGroup={};

        this.setDefaultWidget=function(widget){
            if(widget.defaultButton){
                defaultButton=widget.defaultButton;
            }
            if(widget.defaultSwitch){
                defaultSwitch=widget.defaultSwitch;
            }
            if(widget.defaultProgress){
                defaultProgress=widget.defaultProgress;
            }
            if(widget.defaultDashboard){
                defaultDashboard=widget.defaultDashboard;
            }
            if(widget.defaultRotateImage){
                defaultRotateImage=widget.defaultRotateImage;
            }
            if(widget.defaultSlideBlock){
                defaultSlideBlock=widget.defaultSlideBlock
            }
        };

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
            var r = 54;
            var g = 71;
            var b = 92;
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
                transition:_.cloneDeep(defaultTransition)
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
                zIndex:0,
                transition:_.cloneDeep(defaultTransition)
            }
        };

        this.getDefaultSubLayer = function () {
            var jsonStr = '{"objects":[],"background":"rgba(' + 255 + ',' + 255 + ',' + 255 + ',0.0)"}';
            return {
                url: '',
                id: Math.random().toString(36).substr(2),
                proJsonStr: jsonStr,
                widgets: [],
                name: 'NewSubCanvas',
                type: Type.MySubLayer,
                width: 0,
                height: 0,
                expand:true,
                backgroundImage:'',
                backgroundColor:"rgba(255,255,255,0.0)"

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
                width:200, height: 150,
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
                        color:'rgba(239,162,68,1)',
                        imgSrc:'',
                        name:'图片'
                    }]
                }]

            }
        }


        this.getDefaultButton= function () {
            var info = _.cloneDeep(defaultButton.info);
            var texList = _.cloneDeep(defaultButton.texList);
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
                texList:texList
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

            }
        };
        this.getDefaultTextArea = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:"horizontal",   //horizontal:水平   vertical:竖直

                text:'文本',
                fontName:'正文',
                fontFamily:'宋体',
                fontSize:15,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:"",
                fontUnderline:null
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewTextArea',
                type: Type.MyTextArea,
                expand:true,
                url:'',
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
                },{
                    name:'高亮',
                    currentSliceIdx:0,
                    slices:[{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
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
            var info = _.cloneDeep(defaultProgress.info);
            var texList = _.cloneDeep(defaultProgress.texList);

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
                texList:texList

            }
        };


        this.getDefaultDashboard= function () {
            var info = _.cloneDeep(defaultDashboard.info);
            var texList = _.cloneDeep(defaultDashboard.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                dashboardModeId:'0',//0-简单模式，1-复杂模式,2-精简模式
                name: 'NewDashboard',
                type: Type.MyDashboard,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList,

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
                symbolMode:'0',//符号模式标志，0：无符号位，1：有符号位
                decimalCount:0,//保留的小数位数
                numOfDigits:3,//数字的位数，最小1，最大未定
                overFlowStyle:'0',//指数字大于最大值时是否继续显示,0不显示，1显示

                align:'center',//数字对齐方式
                arrange:'horizontal',//数字方向，垂直vertical，水平horizontal

                //arrange:true,         //true:横向 false:竖向
                numValue:1,
                fontFamily:'宋体',
                fontSize:30,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:""
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
                }],
                transition:_.cloneDeep(defaultTransition)
            }
        };

        this.getDefaultOscilloscope = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,


                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:50,
                lowAlarmValue:0,highAlarmValue:100,
                spacing:20,   //光标间距
                lineColor:'rgba(0,0,0,1)',
                grid:'0',//0表示无网格，1表示有网格,2表示横网格，3表示竖网格
                lineWidth:1,//网格线宽
                gridUnitX:10,//横向网格单位长度长度
                gridUnitY:10,//纵向网格单位长度
                gridInitValue:0,//网格初始坐标值
                blankX:24,//x方向留白
                blankY:24//y方向留白
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
                    name:'背景纹理',
                    slices:[{
                        color:'rgba(17,17,17,1)',
                        imgSrc:'',
                        name:'背景图片'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'背光纹理',//指示波器折线图下方图案
                    slices:[{
                        color:'rgba(228,110,119,1)',
                        imgSrc:'',
                        name:'背光图片'
                    }]
                }]

            }
        };

        this.getDefaultSwitch=function(){
            var info=_.cloneDeep(defaultSwitch.info);
            var texList=_.cloneDeep(defaultSwitch.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewSwitch',
                type: Type.MySwitch,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };
        this.getDefaultRotateImg=function(){
            var info = _.cloneDeep(defaultRotateImage.info);
            var texList=_.cloneDeep(defaultRotateImage.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewRotateImg',
                type: Type.MyRotateImg,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };
        this.getDefaultDateTime=function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                initValue:0,
                dateTimeModeId:'0',//0表示时间秒，1表示时分，2表示斜杠日期，3表示减号日期
                RTCModeId:'0',//使用内部RTC，1表示使用外部RTC
                fontFamily:'宋体',
                fontSize:20,
                fontColor:'rgba(0,0,0,1)',
                align:'center',
                arrange:"horizontal"   //horizontal:水平   vertical:竖直
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
                    name:'时间日期',
                    slices:[{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]

            }
        };

        this.getDefaultScriptTrigger = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                lowAlarmValue:0,highAlarmValue:100
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewScriptTrigger',
                type: Type.MyScriptTrigger,
                expand:true,
                url:'',
                zIndex:0
            }
        };
        this.getDefaultSlideBlock = function(){
            var info = _.cloneDeep(defaultSlideBlock.info);
            var texList = _.cloneDeep(defaultSlideBlock.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewSlideBlock',
                type: Type.MySlideBlock,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };
        this.getDefaultVideo = function(){
            var info = {
                width:215,height:110,
                left:0,top:0,
                originX: 'center', originY: 'center',
            };
            return {
                id:Math.random().toString(36).substr(2),
                info:info,
                name:'NewVideo',
                type:Type.MyVideo,
                expand:true,
                zIndex:0,
                texList:[{
                        currentSliceIdx:0,
                        name:'影像',
                        slices:[{
                            color:'rgba(252,94,34,1)',
                            imgSrc:'',
                            name:'影像'
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


        var templateId=null;
        this.setTemplateId = function(id){
            templateId=id;
        }
        this.getTemplateId = function(){
            return templateId;
        }

    }]);