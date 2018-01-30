/**
 * Created by shenaolin on 16/3/12.
 */
ideServices
    .service('TemplateProvider', ['Type','Preference','FontMesureService','AnimationService',function (Type,Preference,FontMesureService,AnimationService) {

        var project,
            projectSize = {
                width:800,
                height:480
            },
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
                    enableAnimation:false
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
            defaultGeneral={
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
            defaultSelector={
                info :{
                    //宽高
                    width:80,
                    height: 40,
                    selectorWidth:80,
                    selectorHeight:40,
                    itemWidth:80,
                    itemHeight:40,
                    //坐标
                    left: 0,
                    top: 0,
                    selectorLeft:0,
                    selectorTop:0,
                    //item数
                    itemCount:1,
                    //能显示出的item数，item视窗大小
                    itemShowCount:1,
                    //item当前值
                    curValue:0,

                    text:'Selector',
                    //标题
                    selectorTitle:'',
                    itemFont:{
                        fontFamily:"宋体",
                        fontSize:20,
                        fontColor:'rgba(0,0,0,1)',
                        fontBold:"100",
                        fontItalic:''
                    },
                    selectorFont:{
                        fontFamily:"宋体",
                        fontSize:20,
                        fontColor:'rgba(0,0,0,1)',
                        fontBold:"100",
                        fontItalic:'',
                    },
                    titleFont:{
                        fontFamily:"宋体",
                        fontSize:20,
                        fontColor:'rgba(0,0,0,1)',
                        fontBold:"100",
                        fontItalic:'',
                    },
                    disableHighlight:false
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'选择器背景',
                    slices:[{
                        color:'rgba(0,0,0,1)',
                        imgSrc:'',
                        name:'选择器背景'
                    }]
                },{
                    currentSliceIdx:1,
                    name:'元素纹理',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        text:'',
                        name:'0'
                    }]
                },{
                    currentSliceIdx:2,
                    name:'元素选中后纹理',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        text:'',
                        name:'0'
                    }]
                },{
                    currentSliceIdx:3,
                    name:'高亮',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        text:'',
                        name:'高亮'
                    }]
                }]
            },
            defaultRotaryKnob={
                info :{
                    //坐标
                    left: 0,
                    top: 0,
                    //宽高
                    width:80,
                    height: 40,

                    //最大值
                    maxValue:100,
                    //最小值
                    minValue:0,
                    //当前值
                    curValue:0,

                    disableHighlight:false
                },
                texList:[{
                    currentSliceIdx:0,
                    name:'背景',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'背景'
                    }]
                },{
                    currentSliceIdx:1,
                    name:'光圈',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'光圈'
                    }]
                },{
                    currentSliceIdx:2,
                    name:'光标',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'光标'
                    }]
                },{
                    currentSliceIdx:3,
                    name:'高亮',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]
            },
            defaultButtonGroup={};

        //设置当前工程尺寸
        this.setProjectSize = function(currentSize){
            if(currentSize&&currentSize.height&&currentSize.width){
                projectSize.width = currentSize.width;
                projectSize.height = currentSize.height;
            }
        };

        //设置控件的默认模板，在使用模板模式时使用
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

        // this.saveProjectFromGlobal= function (_project) {
        //     project=_project;
        // };

        //获取默认页面
        this.getDefaultPage = function () {
            return this.getRandomPage();
        };

        //获取随机页面
        this.getRandomPage = function () {
            var r = 54;
            var g = 71;
            var b = 92;
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
                transition:AnimationService.getDefaultTransition()
            }

        };

        //图层
        this.getDefaultLayer = function () {
            // var pageNode=CanvasService.getPageNode();
            var info = {
                // width:Math.round((pageNode.getWidth()/pageNode.getZoom()) / 2),
                // height: Math.round((pageNode.getHeight()/pageNode.getZoom()) / 2),
                width:Math.round(projectSize.width/2),
                height:Math.round(projectSize.height/2),

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
                transition:AnimationService.getDefaultTransition()
            }
        };

        //子图层
        this.getDefaultSubLayer = function () {
            // var pageNode=CanvasService.getPageNode();
            var info = {
                width:Math.round(projectSize.width/2),
                height:Math.round(projectSize.height/2),
                scrollVEnabled:false,
                scrollHEnabled:false,
            };
            return {
                info:info,
                url: '',
                id: Math.random().toString(36).substr(2),
                widgets: [],
                name: 'NewSubCanvas',
                type: Type.MySubLayer,
                expand:true,
                backgroundImage:'',
                backgroundColor:"rgba(255,255,255,0.0)"
            }
        };

        //控件
        this.getDefaultWidget = function () {
            return this.getDefaultSlide();
        };

        //图层控件
        this.getDefaultSlide = function () {
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

        //按钮控件
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

        //通用控件
        this.getDefaultGeneral= function () {
            var info = _.cloneDeep(defaultGeneral.info);
            var texList = _.cloneDeep(defaultGeneral.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                normalImg:'',
                pressImg:'',
                name: 'general',
                type: Type.General,
                expand:true,
                url:'',
                buttonModeId:'0',
                zIndex:0,
                texList:texList
            }
        };

        //旋钮控件
        this.getDefaultKnob=function(){
            // var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                // width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                width:100,height:100,
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

        //文本控件
        this.getDefaultTextArea = function(){
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

        //按钮组控件
        this.getDefaultButtonGroup= function () {
            // var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                // width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                width:160,height:100,
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

        //按钮纹理，用于按钮组
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

        //进度条控件
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

        //仪表盘控件
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

        //数字控件
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
                transition:AnimationService.getDefaultTransition()
            }
        };

        //图层数字控件
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
                enableAnimation:false //显示模式标志，false:无动画 true:有动画
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
                transition:AnimationService.getDefaultTransition()
            }
        };

        //示波器控件
        this.getDefaultOscilloscope = function(){
            // var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                // width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                width:300,height:100,
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

        //开关控件
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

        //旋转图控件
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

        //时间日期控件
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

        //图层时间日期控件
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
                    currentSliceIdx:1,
                    name:'高亮纹理',
                    slices:[{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
                }]

            }
        };

        //触发器控件
        this.getDefaultScriptTrigger = function(){
            // var subLayerNode=CanvasService.getSubLayerNode();

            var info={
                // width:(subLayerNode.getWidth()/subLayerNode.getZoom()) / 4, height: (subLayerNode.getHeight()/subLayerNode.getZoom()) / 4,
                width:100,height:100,
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

        //滑块控件
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

        //视频控件
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

        //动画控件
        this.getDefaultAnimation = function(){
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

        //选择器控件
        this.getDefaultSelector= function () {
            var info = _.cloneDeep(defaultSelector.info);
            var texList = _.cloneDeep(defaultSelector.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewSelector',
                type: Type.MySelector,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList,
            };
        };

        //旋钮控件（新）
        this.getDefaultRotaryKnob= function () {
            var info = _.cloneDeep(defaultRotaryKnob.info);
            var texList = _.cloneDeep(defaultRotaryKnob.texList);
            return {
                id: Math.random().toString(36).substr(2),
                info: info,
                name: 'NewRotaryKnob',
                type: Type.MyRotaryKnob,
                expand:true,
                url:'',
                zIndex:0,
                texList:texList,
            };
        };


        //系统控件,日期选择器
        this.getSystemDatePicker = function(){
            var defaultW = 800,                //控件默认宽度
                defaultH = 480,                //控件默认高度
                pWidth = Math.ceil(0.9*projectSize.width),    //工程宽度
                pHeight = Math.ceil(0.9*projectSize.height),  //工程高度
                offsetX = Math.floor(0.05*projectSize.width),
                offsetY = Math.floor(0.05*projectSize.height),
                x,y,w,h,scaleX,scaleY,scale;   //控件坐标，实际宽高，横向、纵向缩放比

            //根据页面尺寸计算实际宽高
            scaleX = (pWidth>=defaultW)?1:pWidth/defaultW;
            scaleY = (pHeight>=defaultH)?1:pHeight/defaultH;
            scale = (scaleX<=scaleY)?scaleX:scaleY;
            w = Math.floor(scale*defaultW);
            h = Math.floor(scale*defaultH);
            x = Math.floor(Math.abs(pWidth-w)/2)+offsetX;
            y = Math.floor(Math.abs(pHeight-h)/2)+offsetY;
            var info = {
                top:y,
                left:x,
                width:w,    //控件默认宽度
                height:h,

                dayW:Math.floor(scale*100),//单位数字格子宽度
                dayH:Math.floor(scale*65),//数字格子的高度
                paddingX:Math.floor(scale*50),  //数字格子的起始X偏移
                paddingY:Math.floor(scale*145), //数字格子的起始Y偏移

                yearX:Math.floor(scale*200),    //'年'图层X坐标
                yearY:0,
                yearW:Math.floor(scale*180),
                yearH:Math.floor(scale*80),

                monthX:Math.floor(scale*450),   //'月'图层X坐标
                monthY:0,
                monthW:Math.floor(scale*90),
                monthH:Math.floor(scale*80),

                buttonSize:Math.floor(scale*80),//左右按钮的大小

                titleFontSize:Math.floor(scale*32),               //年月字体
                titleFontFamily:'Arial',
                titleFontColor:'#5E5E5E',

                itemFontSize:Math.floor(scale*20),                //日字体
                itemFontFamily:'Arial',
                itemFontColor:'#797979',
            };
            var texList = [
                {
                    currentSliceIdx:0,
                    name:'背景',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/images/datePicker/background.png',
                        name:'背景'
                    }]
                },
                {
                    currentSliceIdx:1,
                    name:'年',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'年'
                    }]
                },
                {
                    currentSliceIdx:2,
                    name:'月',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'',
                        name:'月'
                    }]
                },
                {
                    currentSliceIdx:3,
                    name:'日',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/images/datePicker/itemBack.png',
                        name:'日'
                    }]
                },
                {
                    currentSliceIdx:4,
                    name:'高亮',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/images/datePicker/highlight.png'
                    }]
                }
            ];
            return {
                id:Math.random().toString(36).substr(2),
                type:Type.SysDatePicker,
                name:'SysDatePicker',
                info:info,
                texList:texList
            }
        };

        /**
         * 系统控件，图层日期选择器。
         * 注：采用了新的texList结构，加入了每个slice的数据信息，不再
         */
        this.getSystemTexDatePicker = function(){
            var defaultW = 800,                                  //控件默认宽度
                defaultH = 480,                                  //控件默认高度
                pWidth = Math.ceil(0.9*projectSize.width),       //工程宽度
                pHeight = Math.ceil(0.9*projectSize.height),     //工程高度
                offsetX = Math.floor(0.05*projectSize.width),
                offsetY = Math.floor(0.05*projectSize.height),
                x,y,w,h,scaleX,scaleY,scale,                     //控件坐标，实际宽高，横向、纵向缩放比
                info;

            //根据页面尺寸计算实际宽高
            scaleX = (pWidth>=defaultW)?1:pWidth/defaultW;
            scaleY = (pHeight>=defaultH)?1:pHeight/defaultH;
            scale = (scaleX<=scaleY)?scaleX:scaleY;
            w = Math.floor(scale*defaultW);
            h = Math.floor(scale*defaultH);
            x = Math.floor(Math.abs(pWidth-w)/2)+offsetX;
            y = Math.floor(Math.abs(pHeight-h)/2)+offsetY;
            info = {
                top:y,
                left:x,
                width:w,                                          //控件默认宽度
                height:h,

                dayW:Math.floor(scale*100),                       //单位数字格子宽度
                dayH:Math.floor(scale*65),                        //数字格子的高度
                paddingX:Math.floor(scale*50),                    //数字格子的起始X偏移
                paddingY:Math.floor(scale*145),                   //数字格子的起始Y偏移

                year:{                                            //年图层信息
                    w:Math.floor(scale*20),
                    h:Math.floor(scale*80),
                    pos:[{
                        x:Math.floor(scale*300),
                        y:0,
                    },{
                        x:Math.floor(scale*320),
                        y:0,
                    },{
                        x:Math.floor(scale*340),
                        y:0,
                    },{
                        x:Math.floor(scale*360),
                        y:0
                    }]
                },

                month:{                                          //月图层信息
                    w:Math.floor(scale*20),
                    h:Math.floor(scale*80),
                    pos:[{
                        x:Math.floor(scale*500),
                        y:0,
                    },{
                        x:Math.floor(scale*520),
                        y:0
                    }]
                },

                buttonSize:Math.floor(scale*80),                  //左右按钮的大小

                titleFontSize:Math.floor(scale*32),               //年月字体
                titleFontFamily:'Arial',
                titleFontColor:'#5E5E5E',

            };


            var i,
                year_slices = [],
                month_slices = [],
                day_slices = [],
                texList;
            for(i=0;i<4;i++){
                year_slices[i] = {};
                year_slices[i].color = 'rgba(0,0,0,0)';
                year_slices[i].name = 'year'+(i+1);
                year_slices[i].imgSrc = '';
            }
            for(i=0;i<2;i++){
                month_slices[i] = {};
                month_slices[i].color = 'rgba(0,0,0,0)';
                month_slices[i].name = 'month'+(i+1);
                month_slices[i].imgSrc = '';
            }
            for(i=0;i<31;i++){
                day_slices[i] = {};
                day_slices[i].color = 'rgba(0,0,0,0)';
                day_slices[i].name = 'day'+(i+1);
                day_slices[i].imgSrc = '/public/images/texDatePicker/day'+(i+1)+'.png';
            }
            texList = [
                {
                    currentSliceIdx:0,
                    name:'background',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/images/texDatePicker/background.png',
                        name:'background'
                    }]
                },
                {
                    currentSliceIdx:1,
                    name:'year',
                    slices:year_slices,
                },
                {
                    currentSliceIdx:2,
                    name:'month',
                    slices:month_slices,
                },
                {
                    currentSliceIdx:3,
                    name:'days',
                    slices:day_slices
                },
                {
                    currentSliceIdx:4,
                    name:'highlight',
                    slices:[{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/images/texDatePicker/highlight.png',
                        name:'highlight'
                    }]
                }
            ];
            return {
                id:Math.random().toString(36).substr(2),
                type:Type.SysDatePicker,
                name:'SysTexDatePicker',
                info:info,
                texList:texList
            }
        };

        //工具函数，获取随机颜色
        function _getRandomColor(){
            var r = _.random(64, 255);
            var g = _.random(64, 255);
            var b = _.random(64, 255);
            return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
        }


        //模板ID
        var templateId=null;
        this.setTemplateId = function(id){
            templateId=id;
        };
        this.getTemplateId = function(){
            return templateId;
        }

    }]);