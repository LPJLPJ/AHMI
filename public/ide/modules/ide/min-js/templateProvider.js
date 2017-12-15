ideServices.service("TemplateProvider",["Type","CanvasService","Preference","FontMesureService",function(e,t,n,r){function i(e,t,n){this.name=e||"",this.show=t||"",this.duration=n}function o(){return"rgba("+_.random(64,255)+","+_.random(64,255)+","+_.random(64,255)+",1.0)"}var a,l=new i("NO_TRANSITION","无动画",0),g={info:{width:100,height:50,left:0,top:0,originX:"center",originY:"center",arrange:"horizontal",text:"button",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:"",disableHighlight:!1},texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:"rgba(220,82,74,1)",imgSrc:"",name:"按下前"},{color:"rgba(254,205,82,1)",imgSrc:"",name:"按下后"},{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]},c={info:{width:50,height:50,left:0,top:0,originX:"center",originY:"center",bindBit:null,text:"",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""},texList:[{currentSliceIdx:0,name:"开关图片",slices:[{color:"rgba(40,40,40,1)",imgSrc:"",name:"开关图片"}]}]},u={info:{width:177,height:44,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,progressValue:50,arrange:"horizontal",cursor:"0",progressModeId:"0",thresholdModeId:"1",threshold1:null,threshold2:null},texList:[{currentSliceIdx:0,name:"进度条底纹",slices:[{color:"rgba(60,60,60,1)",imgSrc:"",name:"进度条底纹"}]},{currentSliceIdx:0,name:"进度条",slices:[{color:"rgba(70,70,70,1)",imgSrc:"",name:"进度条"}]}]},d={info:{width:250,height:250,left:0,top:0,originX:"center",originY:"center",clockwise:"1",minValue:0,maxValue:360,minAngle:0,maxAngle:360,lowAlarmValue:0,highAlarmValue:360,minCoverAngle:0,maxCoverAngle:0,value:45,offsetValue:0,pointerLength:185,enableAnimation:!1},texList:[{currentSliceIdx:0,name:"仪表盘背景",slices:[{color:"rgba(100,100,100,1)",imgSrc:"",name:"仪表盘背景"}]},{currentSliceIdx:0,name:"仪表盘指针",slices:[{color:"rgba(120,120,120,1)",imgSrc:"",name:"仪表盘指针"}]}]},m={info:{width:100,height:100,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:360,initValue:0},texList:[{currentSliceIdx:0,name:"旋转图片",slices:[{color:"rgba(150,150,150,1)",imgSrc:"",name:"旋转图片"}]}]},s={info:{width:160,height:50,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,initValue:0,arrange:"horizontal"},texList:[{currentSliceIdx:0,name:"滑块背景",slices:[{color:"rgba(63,63,63,1)",imgSrc:"",name:"滑块背景"}]},{currentSliceIdx:0,name:"滑块",slices:[{color:"rgba(180,180,180,1)",imgSrc:"",name:"滑块"}]}]};this.setDefaultWidget=function(e){e.defaultButton&&(g=e.defaultButton),e.defaultSwitch&&(c=e.defaultSwitch),e.defaultProgress&&(u=e.defaultProgress),e.defaultDashboard&&(d=e.defaultDashboard),e.defaultRotateImage&&(m=e.defaultRotateImage),e.defaultSlideBlock&&(s=e.defaultSlideBlock)},this.saveProjectFromGlobal=function(e){a=e},this.getDefaultPage=function(){return this.getRandomPage()},this.getRandomPage=function(){return{url:"",id:Math.random().toString(36).substr(2),layers:[],name:"NewPage",type:e.MyPage,mode:0,expand:!0,selected:!1,current:!1,backgroundColor:"rgb(54,71,92)",backgroundImage:"",currentFabLayer:null,transition:_.cloneDeep(l)}},this.getDefaultLayer=function(){var n=t.getPageNode(),r={width:n.getWidth()/n.getZoom()/2,height:n.getHeight()/n.getZoom()/2,left:0,top:0,originX:"center",originY:"center"},i=this.getDefaultSubLayer();return{url:i.backgroundImage,id:Math.random().toString(36).substr(2),info:r,subLayers:[i],name:"NewCanvas",type:e.MyLayer,expand:!0,showSubLayer:i,zIndex:0,transition:_.cloneDeep(l)}},this.getDefaultSubLayer=function(){return{url:"",id:Math.random().toString(36).substr(2),widgets:[],name:"NewSubCanvas",type:e.MySubLayer,width:0,height:0,expand:!0,backgroundImage:"",backgroundColor:"rgba(255,255,255,0.0)"}},this.getImageSubLayer=function(){var t=n.getRandomImageURL();return{url:t,id:Math.random().toString(36).substr(2),widgets:[],name:"NewSubCanvas",type:e.MySubLayer,width:0,height:0,expand:!0,backgroundImage:t}},this.getDefaultWidget=function(){return this.getDefaultSlide()},this.getDefaultSlide=function(){var n=(t.getSubLayerNode(),{width:200,height:150,left:0,top:0,originX:"center",originY:"center",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""});return{id:Math.random().toString(36).substr(2),info:n,subSlides:[],name:"NewSlide",type:e.MySlide,expand:!0,url:"",zIndex:0,texList:[{name:"纹理",currentSliceIdx:0,slices:[{color:"rgba(239,162,68,1)",imgSrc:"",name:"图片"}]}]}},this.getDefaultButton=function(){var t=_.cloneDeep(g.info),n=_.cloneDeep(g.texList);return{id:Math.random().toString(36).substr(2),info:t,normalImg:"",pressImg:"",name:"NewButton",type:e.MyButton,expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:n}},this.getDefaultKnob=function(){var n=t.getSubLayerNode(),r={width:n.getWidth()/n.getZoom()/4,height:n.getHeight()/n.getZoom()/4,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:360,value:0,knobSize:parseInt(n.getWidth()/n.getZoom()/4)};return{id:Math.random().toString(36).substr(2),info:r,backgroundImg:"",knobImg:"",name:"NewKnob",type:e.MyKnob,expand:!0,url:"",buttonModeId:"0",zIndex:0}},this.getDefaultTextArea=function(){var n=(t.getSubLayerNode(),{width:15*("文本".length+1),height:30,left:0,top:0,originX:"center",originY:"center",arrange:"horizontal",text:"文本",fontName:"正文",fontFamily:"宋体",fontSize:15,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:"",fontUnderline:null});return{id:Math.random().toString(36).substr(2),info:n,name:"NewTextArea",type:e.MyTextArea,expand:!0,url:"",zIndex:0,texList:[{name:"文本框",currentSliceIdx:0,slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"文本框背景"}]}]}},this.getDefaultButtonGroup=function(){var n=t.getSubLayerNode(),r={width:n.getWidth()/n.getZoom()/4,height:n.getHeight()/n.getZoom()/4,left:0,top:0,originX:"center",originY:"center",interval:0,intervalScale:0,count:2,arrange:"horizontal",disableHighlight:!1};return{id:Math.random().toString(36).substr(2),info:r,normalImg:"",pressImg:"",name:"NewButtonGroup",type:e.MyButtonGroup,expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:o(),imgSrc:"",name:"按下前"},{color:o(),imgSrc:"",name:"按下后"}]},{name:"按钮纹理",currentSliceIdx:0,slices:[{color:o(),imgSrc:"",name:"按下前"},{color:o(),imgSrc:"",name:"按下后"}]},{name:"高亮",currentSliceIdx:0,slices:[{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]}},this.getDefaultButtonTex=function(){return{name:"按钮纹理",currentSliceIdx:0,slices:[{color:o(),imgSrc:"",name:"按下前"},{color:o(),imgSrc:"",name:"按下后"}]}},this.getDefaultProgress=function(){var t=_.cloneDeep(u.info),n=_.cloneDeep(u.texList);return{id:Math.random().toString(36).substr(2),info:t,backgroundImg:"",progressImg:"",name:"NewProgress",type:e.MyProgress,expand:!0,url:"",zIndex:0,texList:n}},this.getDefaultDashboard=function(){var t=_.cloneDeep(d.info),n=_.cloneDeep(d.texList);return{id:Math.random().toString(36).substr(2),info:t,dashboardModeId:"0",name:"NewDashboard",type:e.MyDashboard,expand:!0,url:"",zIndex:0,texList:n}},this.getDefaultNum=function(){var t=90+Math.ceil(6),n={width:t,height:33,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,noInit:"NO",numModeId:"0",frontZeroMode:"0",symbolMode:"0",decimalCount:0,numOfDigits:3,overFlowStyle:"0",align:"center",arrange:"horizontal",spacing:0,numValue:1,fontFamily:"宋体",fontSize:30,fontColor:"rgba(255,255,255,1)",fontBold:"100",fontItalic:"",maxFontWidth:30,enableAnimation:!1,paddingRatio:.1};return{id:Math.random().toString(36).substr(2),info:n,name:"NewNum",type:e.MyNum,expand:!0,url:"",zIndex:0,texList:[{name:"数字",currentSliceIdx:0,slices:[{color:"rgba(120,120,120,1)",imgSrc:"",name:"数字背景"}]}],transition:_.cloneDeep(l)}},this.getDefaultTexNum=function(){for(var t={width:90,height:30,characterW:30,characterH:30,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,noInit:"NO",frontZeroMode:"0",symbolMode:"0",decimalCount:0,numOfDigits:3,overFlowStyle:"0",align:"center",numValue:1,enableAnimation:!1},n=[],r=0;r<13;r++)n[r]={},n[r].imgSrc="",n[r].color="rgba(120,120,120,1)",r<=9?n[r].name="数字"+r:10===r?n[r].name=".":11===r?n[r].name="+":12===r&&(n[r].name="-");return{id:Math.random().toString(36).substr(2),info:t,name:"NewTexNum",type:e.MyTexNum,expand:!0,url:"",zIndex:0,texList:[{name:"数字值",currentSliceIdx:0,slices:n}],transition:_.cloneDeep(l)}},this.getDefaultOscilloscope=function(){var n=t.getSubLayerNode(),r={width:n.getWidth()/n.getZoom()/4,height:n.getHeight()/n.getZoom()/4,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:50,lowAlarmValue:0,highAlarmValue:100,spacing:20,lineColor:"rgba(0,0,0,1)",grid:"0",lineWidth:1,gridUnitX:10,gridUnitY:10,gridInitValue:0,blankX:24,blankY:24};return{id:Math.random().toString(36).substr(2),info:r,backgroundImg:"",oscillationImg:"",name:"NewOscilloscope",type:e.MyOscilloscope,expand:!0,url:"",zIndex:0,texList:[{currentSliceIdx:0,name:"背景纹理",slices:[{color:"rgba(17,17,17,1)",imgSrc:"",name:"背景图片"}]},{currentSliceIdx:0,name:"背光纹理",slices:[{color:"rgba(228,110,119,1)",imgSrc:"",name:"背光图片"}]}]}},this.getDefaultSwitch=function(){var t=_.cloneDeep(c.info),n=_.cloneDeep(c.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewSwitch",type:e.MySwitch,expand:!0,url:"",zIndex:0,texList:n}},this.getDefaultRotateImg=function(){var t=_.cloneDeep(m.info),n=_.cloneDeep(m.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewRotateImg",type:e.MyRotateImg,expand:!0,url:"",zIndex:0,texList:n}},this.getDefaultDateTime=function(){var t={width:160,height:22,left:0,top:0,originX:"center",originY:"center",initValue:0,dateTimeModeId:"0",RTCModeId:"0",fontFamily:"宋体",fontSize:20,fontColor:"rgba(255,255,255,1)",align:"center",arrange:"horizontal",disableHighlight:!1,fontBold:"100",fontItalic:"",maxFontWidth:20,spacing:0,paddingRatio:.1};return{id:Math.random().toString(36).substr(2),info:t,name:"NewDateTime",type:e.MyDateTime,expand:!0,url:"",zIndex:0,texList:[{currentSliceIdx:0,name:"时间日期",slices:[{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]}},this.getDefaultScriptTrigger=function(){var n=t.getSubLayerNode(),r={width:n.getWidth()/n.getZoom()/4,height:n.getHeight()/n.getZoom()/4,left:0,top:0,originX:"center",originY:"center",lowAlarmValue:0,highAlarmValue:100};return{id:Math.random().toString(36).substr(2),info:r,name:"NewScriptTrigger",type:e.MyScriptTrigger,expand:!0,url:"",zIndex:0}},this.getDefaultSlideBlock=function(){var t=_.cloneDeep(s.info),n=_.cloneDeep(s.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewSlideBlock",type:e.MySlideBlock,expand:!0,url:"",zIndex:0,texList:n}},this.getDefaultVideo=function(){var t={width:215,height:110,left:0,top:0,originX:"center",originY:"center",source:"HDMI",scale:"1"};return{id:Math.random().toString(36).substr(2),info:t,name:"NewVideo",type:e.MyVideo,expand:!0,zIndex:0,texList:[{currentSliceIdx:0,name:"影像",slices:[{color:"rgba(252,94,34,1)",imgSrc:"",name:"影像"}]}]}},this.getDefaultAnimation=function(){var n=(t.getSubLayerNode(),{width:200,height:150,left:0,top:0,originX:"center",originY:"center"});return{id:Math.random().toString(36).substr(2),info:n,subSlides:[],name:"NewAnimation",type:e.MyAnimation,expand:!0,url:"",zIndex:0,texList:[{name:"纹理",currentSliceIdx:0,slices:[{color:"rgba(239,162,68,1)",imgSrc:"",name:"图片"}]}]}};var h=null;this.setTemplateId=function(e){h=e},this.getTemplateId=function(){return h}}]);