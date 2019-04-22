/**
 * Created by shenaolin on 16/3/12.
 */
ideServices
    .service('TemplateProvider', ['Type','CanvasService','Preference','FontMesureService',function (Type,CanvasService,Preference,FontMesureService) {


        function Transition(name,show,duration){
            this.name=name||'';
            this.show=show||'';
            this.duration=duration;
        }

        var defaultTransition=new Transition('NO_TRANSITION','无动画',0);
        var _self = this;
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
                    disableHighlight:false
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
                    bindBit:null,

                    text:'',
                    fontFamily:"宋体",
                    fontSize:20,
                    fontColor:'rgba(0,0,0,1)',
                    fontBold:"100",
                    fontItalic:'',
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
                    progressModeId:'0',
                    thresholdModeId:'1',
                    threshold1:null,
                    threshold2:null
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
            defaultChart={
                info:{
                    width: 250,
                    height: 250,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    minValue:0,maxValue:100,
                    xCount:5,
                    yCount:5,
                    xPadding:0,
                    yPadding:0,
                    values:[],
                    lowAlarmValue:0,highAlarmValue:100,
                    curValue:0
                    },
                texList:[{
                    currentSliceIdx:0,
                    name:'背景',
                    slices:[{
                        color:'rgba(60,60,60,1)',
                        imgSrc:'',
                        name:'背景'
                    }]
                 },{
                    currentSliceIdx:0,
                    name:'点',
                    slices:[{
                        color:'rgba(70,70,70,1)',
                        imgSrc:'',
                        name:'点'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'线',
                    slices:[{
                        color:'rgba(70,70,70,1)',
                        imgSrc:'',
                        name:'点'
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
                    pointerLength:185,
                    enableAnimation:false,
                    pointerImgWidth:0,
                    pointerImgHeight:0,
                    posRotatePointX:125,
                    posRotatePointY:125
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
                    initValue:0,
                    clockwise:1,
                    posRotatePointX:50,
                    posRotatePointY:50
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
            defaultTouchTrack={
                info:{
                    width: 100,
                    height: 100,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center'
                    
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'背景',
                    slices:[{
                        color:'rgba(63,63,63,1)',
                        imgSrc:'',
                        name:'滑块背景'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'指针',
                    slices:[{
                        color:'rgba(180,180,180,1)',
                        imgSrc:'',
                        name:'滑块'
                    }]
                }]
            },
            defaultAlphaImage={
                info:{
                    width: 100,
                    height: 100,
                    left: 0, top: 0,
                    originX: 'center', originY: 'center',
                    minValue:0,maxValue:100,
                    initValue:50
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'背景',
                    slices:[{
                        color:'rgba(150,150,150,1)',
                        imgSrc:'',
                        name:'背景'
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
                    arrange:"horizontal",
                    slideBlockModeId:'0'
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
            if(widget.defaultAlphaImage){
                defaultAlphaImage=widget.defaultAlphaImage;
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
            var r = 191;
            var g = 191;
            var b = 191;
            // var jsonStr = {"objects":[],"background":"rgb(" + r + "," + g + "," + b + ")"};
            return {
                url: '',
                id: Math.random().toString(36).substr(2),
                // proJsonStr: jsonStr,
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

        // 画布
        this.getDefaultLayer = function () {
            //var pageNode=CanvasService.getPageNode();
            var info = {
                width:(project.initSize.width) / 2, height: (project.initSize.height) / 2,


                //width: project.currentSize.width / 2, height: project.currentSize.height / 2,
                left: 0, top: 0,
                originX: 'center', originY: 'center'
            };

            var subLayer = this.getDefaultSubLayer();
            return {
                url: subLayer.backgroundImage,
                id: Math.random().toString(36).substr(2),
                backgroundImage:'',
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

        // 子画布
        this.getDefaultSubLayer = function () {
            // var jsonStr = '{"objects":[],"background":"rgba(' + 255 + ',' + 255 + ',' + 255 + ',0.0)"}';
            return {
                url: '',
                id: Math.random().toString(36).substr(2),
                // proJsonStr: jsonStr,
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
            // var jsonStr = '{"objects":[],"background":"rgba(255,255,255,1.0)","backgroundImage":{"type":"image","originX":"left","originY":"top","left":0,"top":0,"width":500,"height":284,"fill":"rgb(0,0,0)","strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","src":"http://localhost:63342/AHMIDesigner/modules/ide/demo3.jpg","filters":[],"crossOrigin":"","alignX":"none","alignY":"none","meetOrSlice":"meet"}}';
            var backgroundImage=Preference.getRandomImageURL();
            return {
                url: backgroundImage,
                id: Math.random().toString(36).substr(2),
                // proJsonStr: jsonStr,
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

        // 图层控件
        this.getDefaultSlide = function () {
            var subLayerNode = CanvasService.getSubLayerNode();
            var info = {
                width:200, height: 150,
                left: 0, top: 0,
                originX: 'center', originY: 'center',

                fontFamily:"宋体",
                fontSize:20,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:'',
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
        };

        // 透明图层
        this.getDefaultAlphaSlide = function () {
            var info = {
                width:200, height: 150,
                left: 0, top: 0,
                originX: 'center', originY: 'center',

                fontFamily:"宋体",
                fontSize:20,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:'',
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                subSlides: [],
                name: 'NewAlphaSlide',
                type: Type.MyAlphaSlide,
                expand:true,
                url:'',
                zIndex:0,
                texList:[
                    {
                        name:'纹理',
                        currentSliceIdx:0,
                        slices:[
                            {
                                color:'rgba(255,255,255,1)',
                                imgSrc:'',
                                name:'图片'
                            }
                        ]
                    },
                    {
                        name:'底色',
                        currentSliceIdx:0,
                        slices:[
                            {
                                color:'rgba(239,162,68,1)',
                                imgSrc:'',
                                name:'图片'
                            }
                        ]
                    }
                ]

            }
        };

        // 按钮控件
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

        // 文本控件
        this.getDefaultTextArea = function(){
            var subLayerNode=CanvasService.getSubLayerNode();

            var text='文本';
            var fontSize=15;
            var info={
                width:fontSize*(text.length+1),height:fontSize*2,

                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:"horizontal",   //horizontal:水平   vertical:竖直

                text:text,
                fontName:'正文',
                fontFamily:'宋体',
                fontSize:fontSize,
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

        // 文本输入
        this.getDefaultTextInput = function(){
            
            var text='文本输入';
            var fontSize=15;
            var info={
                width:fontSize*(text.length+1),height:fontSize*2,

                left: 0, top: 0,
                originX: 'center', originY: 'center',

                arrange:"horizontal",   //horizontal:水平   vertical:竖直

                text:text,
                fontName:'正文',
                fontFamily:'宋体',
                fontSize:fontSize,
                fontColor:'rgba(0,0,0,1)',
                fontBold:"100",
                fontItalic:"",
                fontUnderline:null
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewTextInput',
                type: Type.MyTextInput,
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

        // 按钮组
        this.getDefaultButtonGroup= function () {
            var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                interval:0,//间距
                intervalScale:0,//间距长度占总长度的比例,缩放时用到
                count:2,
                arrange:"horizontal",   //horizontal:水平   vertical:竖直
                disableHighlight:false
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
        };

        // 照片栏
        this.getDefaultGallery= function () {
            var subLayerNode=CanvasService.getSubLayerNode();
            var defaultWidth = (subLayerNode.getWidth()/subLayerNode.getZoom()) / 4
            var info={
                width:defaultWidth, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                interval:0,//间距
                photoWidth:parseInt(defaultWidth/3),
                curValue:1,
                intervalScale:0,//间距长度占总长度的比例,缩放时用到
                count:3,
                arrange:"horizontal"  //horizontal:水平   vertical:竖直
                
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                normalImg:'',
                pressImg:'',
                name: 'NewGallery',
                type: Type.MyGallery,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                transition:_.cloneDeep(defaultTransition),
                texList:[{
                    name:'图片1',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'图片1'
                    }]
                },{
                    name:'图片2',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'图片2'
                    }]
                },{
                    name:'图片3',
                    currentSliceIdx:0,
                    slices:[{
                        color:_getRandomColor(),
                        imgSrc:'',
                        name:'图片3'
                    }]
                }]
            }
        };

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
        };

        this.getDefaultTex= function () {
            return{
                name:'纹理',
                currentSliceIdx:0,
                slices:[{
                    color:_getRandomColor(),
                    imgSrc:'',
                    name:'纹理'
                }]
            }
        };

        // 进度条
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
                texList:texList,
                transition:_.cloneDeep(defaultTransition)
            }
        };

        // 图表
        this.getDefaultChart= function () {
            var info = _.cloneDeep(defaultChart.info);
            var texList = _.cloneDeep(defaultChart.texList);

            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewChart',
                type: Type.MyChart,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList,
                transition:_.cloneDeep(defaultTransition)
            }
        };

        // 仪表盘
        this.getDefaultDashboard= function () {
            var info = _.cloneDeep(defaultDashboard.info);
            var texList = _.cloneDeep(defaultDashboard.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                dashboardModeId:'0',//0-简单模式，1-复杂模式,2-精简模式
                backgroundModeId:'0', //0-不启用无背景模式 //1-启用无背景模式
                name: 'NewDashboard',
                type: Type.MyDashboard,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList,
                transition:_.cloneDeep(defaultTransition)
            }
        };

        // 数字
        this.getDefaultNum = function(){
            var font = "30px"+" "+"宋体";
            // var maxFontWidth = Math.ceil(FontMesureService.getMaxWidth('0123456789.',font)); //-
            var maxFontWidth = 30;//+
            var paddingRatio = 0.1;
            var spacing = -10;
            var width = 3*(maxFontWidth+spacing)+Math.ceil(maxFontWidth*paddingRatio*2);
            var height = maxFontWidth*(1+2*paddingRatio);
            var info={
                width:width, height: height,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                noInit:'NO',
                //initValue:'1',

                numModeId:'0',//原本用户切换动画，目前被enableAnmiation取代
                frontZeroMode:'0',//前导0模式标志，0：无前导0模式，1：有前导0模式
                symbolMode:'0',//符号模式标志，0：无符号位，1：有符号位
                decimalCount:0,//保留的小数位数
                numOfDigits:3,//数字的位数，最小1，最大未定
                overFlowStyle:'0',//指数字大于最大值时是否继续显示,0不显示，1显示

                numSystem:'0',//数字进制，0是默认十进制，1为16进制
                hexControl:{
                    markingMode:'0', //0x标识 0为无 1为有
                    transformMode:'0'//大小写 0为小写 1为大写
                },

                align:'center',//数字对齐方式
                arrange:'horizontal',//数字方向，垂直vertical，水平horizontal
                spacing:spacing,//数字之间的间距，默认为-10

                //arrange:true,         //true:横向 false:竖向
                numValue:1,
                fontFamily:'宋体',
                fontSize:30,
                fontColor:'rgba(255,255,255,1)',
                fontBold:"100",
                fontItalic:"",
                maxFontWidth:maxFontWidth,   //最大字体宽度
                enableAnimation:false, //显示模式标志，false:无动画 true:有动画
                paddingRatio:paddingRatio
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

        // 图层数字
        this.getDefaultTexNum = function () {
            var info={
                width:90, height: 30,
                characterW:30,characterH:30,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                minValue:0,maxValue:100,
                lowAlarmValue:0,highAlarmValue:100,
                noInit:'NO',
                frontZeroMode:'0',//前导0模式标志，0：无前导0模式，1：有前导0模式
                symbolMode:'0',//符号模式标志，0：无符号位，1：有符号位
                decimalCount:0,//保留的小数位数
                numOfDigits:3,//数字的位数，最小1，最大未定
                overFlowStyle:'0',//指数字大于最大值时是否继续显示,0不显示，1显示
                align:'center',//数字对齐方式
                numValue:1,
                enableAnimation:false, //显示模式标志，false:无动画 true:有动画

                numSystem:'0',//数字进制，0是默认十进制，1为16进制
                hexControl:{
                    markingMode:'0', //0x标识 0为无 1为有
                    transformMode:'0'//大小写 0为小写 1为大写
                }
            };
            var slices = [];
            for(var i=0,il=13;i<il;i++){
                slices[i] = {};
                slices[i].imgSrc = '';
                slices[i].color = 'rgba(120,120,120,1)';
                if(i<=9){
                    slices[i].name = '数字'+i;
                }else if(i===10){
                    slices[i].name = '.';
                }else if(i===11){
                    slices[i].name = '+';
                }else if(i===12){
                    slices[i].name = '-';
                }
            }
            var hexTex = ['x','a','b','c','d','e','f','A','B','C','D','E','F'];
            for(var i=0;i<hexTex.length;i++){
                var n=i+13;
                slices[n] = {};
                slices[n].imgSrc = '';
                slices[n].color = 'rgba(120,120,120,1)';
                slices[n].name = hexTex[i];
            }

            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewTexNum',
                type: Type.MyTexNum,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    name:'数字值',
                    currentSliceIdx:0,
                    slices:slices
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

        // 开关控件
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

        // 旋转图
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

        // 触摸追踪
        this.getDefaultTouchTrack=function(){
            var info = _.cloneDeep(defaultTouchTrack.info);
            var texList=_.cloneDeep(defaultTouchTrack.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewTouchTrack',
                type: Type.MyTouchTrack,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };

        // 透明图
        this.getDefaultAlphaImg=function(){
            var info = _.cloneDeep(defaultAlphaImage.info);
            var texList=_.cloneDeep(defaultAlphaImage.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewAlphaImage',
                type: Type.MyAlphaImg,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };

        // 时间
        this.getDefaultDateTime=function(){
            var font = "20px"+" "+"宋体";
            // var maxFontWidth = Math.ceil(FontMesureService.getMaxWidth('0123456789:/-',font));
            // var maxFontWidth = 20;//+
            // var width = 8*maxFontWidth;

            //edit by lx in 17/12/18
            var maxFontWidth = 30;//+
            var paddingRatio = 0.1;
            var spacing = -10;
            var width = 8*(maxFontWidth+spacing)+Math.ceil(maxFontWidth*paddingRatio*2);
            var height = maxFontWidth*(1+2*paddingRatio);
            var info={
                width:width, height: height,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                initValue:0,
                dateTimeModeId:'0',//0表示时间秒，1表示时分，2表示斜杠日期，3表示减号日期
                RTCModeId:'0',//使用内部RTC，1表示使用外部RTC
                fontFamily:'宋体',
                fontSize:maxFontWidth,
                fontColor:'rgba(255,255,255,1)',
                align:'center',
                arrange:"horizontal",   //horizontal:水平   vertical:竖直
                disableHighlight:false,
                fontBold:"100",
                fontItalic:"",
                maxFontWidth:maxFontWidth,   //最大字体宽度
                spacing:spacing,//数字之间的间距，默认为-10
                paddingRatio:paddingRatio//padding的值=paddingRatio*maxFontWidth
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

        // 图层时间
        this.getDefaultTexTime=function(){
            var info={
                characterW:30,
                characterH:30,
                width:240, height: 30,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                initValue:0,
                dateTimeModeId:'0',//0表示时间秒，1表示时分，2表示斜杠日期，3表示减号日期
                RTCModeId:'0',//使用内部RTC，1表示使用外部RTC

                align:'center',
                arrange:"horizontal",   //horizontal:水平   vertical:竖直
                disableHighlight:false,//
                maxFontWidth:30  //最大字体宽度
            };
            var slices = [];
            for(var i=0,il=13;i<il;i++){
                slices[i] = {};
                slices[i].imgSrc = '';
                slices[i].color = 'rgba(120,120,120,1)';
                if(i<=9){
                    slices[i].name = '数字'+i;
                }else if(i===10){
                    slices[i].name = ':';
                }else if(i===11){
                    slices[i].name = '/';
                }else if(i===12){
                    slices[i].name = '-';
                }
            }
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewTexTime',
                type: Type.MyTexTime,
                expand:true,
                url:'',
                zIndex:0,
                texList:[{
                    currentSliceIdx:0,
                    name:'时间日期纹理',
                    slices:slices,
                },{
                    currentSliceIdx:0,
                    name:'高亮纹理',
                    slices:[{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]

            }
        };

        // 触发器
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

        // 滑块
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

        // 视频控件
        this.getDefaultVideo = function(){
            var info = {
                width:215,height:110,
                left:0,top:0,
                originX: 'center', originY: 'center',
                source:'HDMI',scale:'1',
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

        // 开机动画
        this.getDefaultAnimation = function(){
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
                name: 'NewAnimation',
                type: Type.MyAnimation,
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
        };

        // 按钮开关
        this.getDefaultButtonSwitch = function(){
            var info = {
                width:100,
                height:50,
                left:0,
                top:0,
                originX: 'center',
                originY: 'center',
                enableAnimation:false
            };
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                subSlides: [],
                name: 'NewButtonSwitch',
                type:Type.MyButtonSwitch,
                expand:true,
                zIndex:0,
                url:'',
                texList:[{
                    currentSliceIdx:0,
                    name:'开关背景纹理',
                    slices:[{
                        color:'rgba(100,100,100,1)',
                        imgSrc:'',
                        name:'开关背景纹理'
                    }]
                },{
                    currentSliceIdx:0,
                    name:'开关滑块纹理',
                    slices:[{
                        color:'rgba(120,120,120,1)',
                        imgSrc:'',
                        name:'开关滑块纹理'
                    }]
                }],
                transition:_.cloneDeep(defaultTransition)
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
        };
        this.getTemplateId = function(){
            return templateId;
        };

        // 蒙板
        this.getDefaultMatte=function(){
            var pageNode=CanvasService.getPageNode();
            var info={
                width:project.initSize.width,
                height:project.initSize.height,
                left: 0,
                top: 0,
                backgroundColor:'rgba(0,0,0,0)',
                backgroundImg:"",
                opacity:0,
                originX: 'center',
                originY: 'center'
            };

            return {
                id: Math.random().toString(36).substr(2),
                type:'MyMatte',
                matteOn:false,
                info:info
            }
        };

        // 获取仪表盘的背景纹理
        this.getBackgroundSlice = function(){
            return defaultDashboard.texList[0];
        };

        // 用于切换仪表盘模式，返回不同的texList
        this.getDashboardTex = function(mode){
            var background = _.cloneDeep(defaultDashboard.texList[0]);
            var pointer = _.cloneDeep(defaultDashboard.texList[1]);
            var lightband = {
                currentSliceIdx:0,
                name:'光带效果',
                slices:[{
                    color:'rgba(0,0,0,0)',
                    imgSrc:'',
                    name:'光带效果'
                }]
            };

            var tex = [];
            switch (mode){
                case '0':
                    tex.push(background,pointer);
                    break;
                case '1':
                    tex.push(background,pointer,lightband);
                    break;
                case '2':
                    tex.push(lightband);
                    break;
                default:
                    tex.push(background,pointer);
                    break;

            }
            return tex
        };

        // 切换滑块模式纹理
        this.getSlideBlockTex = function(mode){
            var background = _.cloneDeep(defaultSlideBlock.texList[0]);
            var slideblock = _.cloneDeep(defaultSlideBlock.texList[1]);
            var progress = {
                currentSliceIdx:0,
                name:'进度条背景',
                slices:[{
                    color:'rgba(0,0,0,0)',
                    imgSrc:'',
                    name:'进度条背景'
                }]
            };

            var tex = [];
            switch (mode){
                case '0':
                    tex.push(background,slideblock);
                    break;
                case '1':
                    tex.push(background,slideblock,progress);
                    break;
                default:
                    tex.push(background,slideblock);
                    break;
            }
            return tex
        }
        
        // 时钟控件
        this.getDefaultClock = function () {
            var info = {
                width:250,
                height:250,
                left:0,
                top:0,
                hourImgWidth:0,
                hourImgHeight:0,
                minuteImgWidth:0,
                minuteImgHeight:0,
                secondImgWidth:0,
                secondImgHeight:0,
                originX: 'center',
                originY: 'center',
                enableAnimation:false
            };

            var texList = [{
                currentSliceIdx:0,
                name:'钟盘背景',
                slices:[{
                    color:'rgba(100,100,100,1)',
                    imgSrc:'',
                    name:'仪表盘背景'
                }]
            },{
                currentSliceIdx:0,
                name:'时针指针',
                slices:[{
                    color:'rgba(120,120,120,1)',
                    imgSrc:'',
                    name:'时针指针'
                }]
            },{
                currentSliceIdx:0,
                name:'分针指针',
                slices:[{
                    color:'rgba(120,120,120,1)',
                    imgSrc:'',
                    name:'分针指针'
                }]
            },{
                currentSliceIdx:0,
                name:'秒针指针',
                slices:[{
                    color:'rgba(120,120,120,1)',
                    imgSrc:'',
                    name:'秒针指针'
                }]
            }];


            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                subSlides: [],
                name: 'NewClock',
                type:Type.MyClock,
                expand:true,
                zIndex:0,
                url:'',
                texList:texList,
                transition:_.cloneDeep(defaultTransition)
            }
        }

        // 表格控件
        this.getDefaultGrid = function () {
            var info = {
                left:0,
                top:0,
                row:4,
                col:4,
                borderColor:'rgba(60,60,60,1)',
                border:1,
                originX: 'center',
                originY: 'center',
                enableAnimation:false
            };

            var base = _self.calcGridCell(info.row,info.col,info.border);

            info.width = base.width;
            info.height = base.height;
            info.cellWidth = base.cellWidth;
            info.cellHeight = base.cellHeight;

            var texList=[{
                currentSliceIdx:0,
                name:'表格背景',
                slices:[{
                    color:'rgba(212,212,212,0)',
                    imgSrc:'',
                    name:'表格背景'
                }]
            }];

            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewGrid',
                type: Type.MyGrid,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList
            }
        };
        //计算表格尺寸
        this.calcGridCell = function(row,col,border){
            var info = {};
            var initWidth,initHeight;
            initWidth = 50;
            initHeight = 50;

            info.cellWidth = [];
            for (var i = 0;i<col;i++){
                info.cellWidth.push({width:initWidth})
            }

            info.cellHeight = [];
            for (var j = 0;j<row;j++){
                info.cellHeight.push({height:initHeight})
            }

            info.width = col*initWidth+border;
            info.height = row*initHeight+border;

            return info;
        }

    }]);