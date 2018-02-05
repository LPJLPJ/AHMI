ideServices.service("TemplateProvider",["Type","Preference","FontMesureService","AnimationService",function(e,t,r,i){function n(){return"rgba("+_.random(64,255)+","+_.random(64,255)+","+_.random(64,255)+",1.0)"}var o={width:800,height:480},a={info:{width:100,height:50,left:0,top:0,originX:"center",originY:"center",arrange:"horizontal",text:"button",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:"",disableHighlight:!1},texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:"rgba(220,82,74,1)",imgSrc:"",name:"按下前"},{color:"rgba(254,205,82,1)",imgSrc:"",name:"按下后"},{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]},l={info:{width:50,height:50,left:0,top:0,originX:"center",originY:"center",bindBit:null,text:"",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""},texList:[{currentSliceIdx:0,name:"开关图片",slices:[{color:"rgba(40,40,40,1)",imgSrc:"",name:"开关图片"}]}]},c={info:{width:177,height:44,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,progressValue:50,arrange:"horizontal",cursor:"0",progressModeId:"0",thresholdModeId:"1",threshold1:null,threshold2:null},texList:[{currentSliceIdx:0,name:"进度条底纹",slices:[{color:"rgba(60,60,60,1)",imgSrc:"",name:"进度条底纹"}]},{currentSliceIdx:0,name:"进度条",slices:[{color:"rgba(70,70,70,1)",imgSrc:"",name:"进度条"}]}]},g={info:{width:250,height:250,left:0,top:0,originX:"center",originY:"center",clockwise:"1",minValue:0,maxValue:360,minAngle:0,maxAngle:360,lowAlarmValue:0,highAlarmValue:360,minCoverAngle:0,maxCoverAngle:0,value:45,offsetValue:0,pointerLength:185,enableAnimation:!1},texList:[{currentSliceIdx:0,name:"仪表盘背景",slices:[{color:"rgba(100,100,100,1)",imgSrc:"",name:"仪表盘背景"}]},{currentSliceIdx:0,name:"仪表盘指针",slices:[{color:"rgba(120,120,120,1)",imgSrc:"",name:"仪表盘指针"}]}]},m={info:{width:100,height:100,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:360,initValue:0},texList:[{currentSliceIdx:0,name:"旋转图片",slices:[{color:"rgba(150,150,150,1)",imgSrc:"",name:"旋转图片"}]}]},u={info:{width:160,height:50,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,initValue:0,arrange:"horizontal"},texList:[{currentSliceIdx:0,name:"滑块背景",slices:[{color:"rgba(63,63,63,1)",imgSrc:"",name:"滑块背景"}]},{currentSliceIdx:0,name:"滑块",slices:[{color:"rgba(180,180,180,1)",imgSrc:"",name:"滑块"}]}]},s={info:{width:100,height:50,left:0,top:0,originX:"center",originY:"center",arrange:"horizontal",text:"button",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:"",disableHighlight:!1},texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:"rgba(220,82,74,1)",imgSrc:"",name:"按下前"},{color:"rgba(254,205,82,1)",imgSrc:"",name:"按下后"},{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]},d={info:{width:80,height:40,selectorWidth:80,selectorHeight:40,itemWidth:80,itemHeight:40,left:0,top:0,selectorLeft:0,selectorTop:0,itemCount:1,itemShowCount:1,curValue:0,text:"Selector",selectorTitle:"",itemFont:{fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""},selectorFont:{fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""},titleFont:{fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""},disableHighlight:!1},texList:[{currentSliceIdx:0,name:"选择器背景",slices:[{color:"rgba(0,0,0,1)",imgSrc:"",name:"选择器背景"}]},{currentSliceIdx:1,name:"元素纹理",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",text:"",name:"0"}]},{currentSliceIdx:2,name:"元素选中后纹理",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",text:"",name:"0"}]},{currentSliceIdx:3,name:"高亮",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",text:"",name:"高亮"}]}]},h={info:{left:0,top:0,width:80,height:40,maxValue:100,minValue:0,curValue:0,disableHighlight:!1},texList:[{currentSliceIdx:0,name:"背景",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"背景"}]},{currentSliceIdx:1,name:"光圈",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"光圈"}]},{currentSliceIdx:2,name:"光标",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"光标"}]},{currentSliceIdx:3,name:"高亮",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"高亮"}]}]};this.setProjectSize=function(e){e&&e.height&&e.width&&(o.width=e.width,o.height=e.height)},this.setDefaultWidget=function(e){e.defaultButton&&(a=e.defaultButton),e.defaultSwitch&&(l=e.defaultSwitch),e.defaultProgress&&(c=e.defaultProgress),e.defaultDashboard&&(g=e.defaultDashboard),e.defaultRotateImage&&(m=e.defaultRotateImage),e.defaultSlideBlock&&(u=e.defaultSlideBlock)},this.getDefaultPage=function(){return this.getRandomPage()},this.getRandomPage=function(){return{url:"",id:Math.random().toString(36).substr(2),layers:[],name:"NewPage",type:e.MyPage,mode:0,expand:!0,selected:!1,current:!1,backgroundColor:"rgb(54,71,92)",backgroundImage:"",currentFabLayer:null,transition:i.getDefaultTransition()}},this.getDefaultLayer=function(){var t={width:Math.round(o.width/2),height:Math.round(o.height/2),left:0,top:0,originX:"center",originY:"center"},r=this.getDefaultSubLayer();return{url:r.backgroundImage,id:Math.random().toString(36).substr(2),info:t,subLayers:[r],name:"NewCanvas",type:e.MyLayer,expand:!0,showSubLayer:r,zIndex:0,transition:i.getDefaultTransition()}},this.getDefaultSubLayer=function(){return{info:{width:Math.round(o.width/2),height:Math.round(o.height/2),scrollVEnabled:!1,scrollHEnabled:!1},url:"",id:Math.random().toString(36).substr(2),widgets:[],name:"NewSubCanvas",type:e.MySubLayer,expand:!0,backgroundImage:"",backgroundColor:"rgba(255,255,255,0.0)"}},this.getDefaultWidget=function(){return this.getDefaultSlide()},this.getDefaultSlide=function(){var t={width:200,height:150,left:0,top:0,originX:"center",originY:"center",fontFamily:"宋体",fontSize:20,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:""};return{id:Math.random().toString(36).substr(2),info:t,subSlides:[],name:"NewSlide",type:e.MySlide,expand:!0,url:"",zIndex:0,texList:[{name:"纹理",currentSliceIdx:0,slices:[{color:"rgba(239,162,68,1)",imgSrc:"",name:"图片"}]}]}},this.getDefaultButton=function(){var t=_.cloneDeep(a.info),r=_.cloneDeep(a.texList);return{id:Math.random().toString(36).substr(2),info:t,normalImg:"",pressImg:"",name:"NewButton",type:e.MyButton,expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:r}},this.getDefaultGeneral=function(){var t=_.cloneDeep(s.info),r=_.cloneDeep(s.texList);return{id:Math.random().toString(36).substr(2),info:t,normalImg:"",pressImg:"",name:"general",type:e.General,expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:r}},this.getDefaultKnob=function(){var t={width:100,height:100,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:360,value:0,knobSize:parseInt(subLayerNode.getWidth()/subLayerNode.getZoom()/4)};return{id:Math.random().toString(36).substr(2),info:t,backgroundImg:"",knobImg:"",name:"NewKnob",type:e.MyKnob,expand:!0,url:"",buttonModeId:"0",zIndex:0}},this.getDefaultTextArea=function(){var t={width:15*("文本".length+1),height:30,left:0,top:0,originX:"center",originY:"center",arrange:"horizontal",text:"文本",fontName:"正文",fontFamily:"宋体",fontSize:15,fontColor:"rgba(0,0,0,1)",fontBold:"100",fontItalic:"",fontUnderline:null};return{id:Math.random().toString(36).substr(2),info:t,name:"NewTextArea",type:e.MyTextArea,expand:!0,url:"",zIndex:0,texList:[{name:"文本框",currentSliceIdx:0,slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"文本框背景"}]}]}},this.getDefaultButtonGroup=function(){var t={width:160,height:100,left:0,top:0,originX:"center",originY:"center",interval:0,intervalScale:0,count:2,arrange:"horizontal",disableHighlight:!1};return{id:Math.random().toString(36).substr(2),info:t,normalImg:"",pressImg:"",name:"NewButtonGroup",type:e.MyButtonGroup,expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:n(),imgSrc:"",name:"按下前"},{color:n(),imgSrc:"",name:"按下后"}]},{name:"按钮纹理",currentSliceIdx:0,slices:[{color:n(),imgSrc:"",name:"按下前"},{color:n(),imgSrc:"",name:"按下后"}]},{name:"高亮",currentSliceIdx:0,slices:[{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]}},this.getDefaultButtonTex=function(){return{name:"按钮纹理",currentSliceIdx:0,slices:[{color:n(),imgSrc:"",name:"按下前"},{color:n(),imgSrc:"",name:"按下后"}]}},this.getDefaultProgress=function(){var t=_.cloneDeep(c.info),r=_.cloneDeep(c.texList);return{id:Math.random().toString(36).substr(2),info:t,backgroundImg:"",progressImg:"",name:"NewProgress",type:e.MyProgress,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultDashboard=function(){var t=_.cloneDeep(g.info),r=_.cloneDeep(g.texList);return{id:Math.random().toString(36).substr(2),info:t,dashboardModeId:"0",name:"NewDashboard",type:e.MyDashboard,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultNum=function(){var t=60+Math.ceil(6),r={width:t,height:36,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,noInit:"NO",numModeId:"0",frontZeroMode:"0",symbolMode:"0",decimalCount:0,numOfDigits:3,overFlowStyle:"0",align:"center",arrange:"horizontal",spacing:-10,numValue:1,fontFamily:"宋体",fontSize:30,fontColor:"rgba(255,255,255,1)",fontBold:"100",fontItalic:"",maxFontWidth:30,enableAnimation:!1,paddingRatio:.1};return{id:Math.random().toString(36).substr(2),info:r,name:"NewNum",type:e.MyNum,expand:!0,url:"",zIndex:0,texList:[{name:"数字",currentSliceIdx:0,slices:[{color:"rgba(120,120,120,1)",imgSrc:"",name:"数字背景"}]}],transition:i.getDefaultTransition()}},this.getDefaultTexNum=function(){for(var t={width:90,height:30,characterW:30,characterH:30,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:100,lowAlarmValue:0,highAlarmValue:100,noInit:"NO",frontZeroMode:"0",symbolMode:"0",decimalCount:0,numOfDigits:3,overFlowStyle:"0",align:"center",numValue:1,enableAnimation:!1},r=[],n=0;n<13;n++)r[n]={},r[n].imgSrc="",r[n].color="rgba(120,120,120,1)",n<=9?r[n].name="数字"+n:10===n?r[n].name=".":11===n?r[n].name="+":12===n&&(r[n].name="-");return{id:Math.random().toString(36).substr(2),info:t,name:"NewTexNum",type:e.MyTexNum,expand:!0,url:"",zIndex:0,texList:[{name:"数字值",currentSliceIdx:0,slices:r}],transition:i.getDefaultTransition()}},this.getDefaultOscilloscope=function(){var t={width:300,height:100,left:0,top:0,originX:"center",originY:"center",minValue:0,maxValue:50,lowAlarmValue:0,highAlarmValue:100,spacing:20,lineColor:"rgba(0,0,0,1)",grid:"0",lineWidth:1,gridUnitX:10,gridUnitY:10,gridInitValue:0,blankX:24,blankY:24};return{id:Math.random().toString(36).substr(2),info:t,backgroundImg:"",oscillationImg:"",name:"NewOscilloscope",type:e.MyOscilloscope,expand:!0,url:"",zIndex:0,texList:[{currentSliceIdx:0,name:"背景纹理",slices:[{color:"rgba(17,17,17,1)",imgSrc:"",name:"背景图片"}]},{currentSliceIdx:0,name:"背光纹理",slices:[{color:"rgba(228,110,119,1)",imgSrc:"",name:"背光图片"}]}]}},this.getDefaultSwitch=function(){var t=_.cloneDeep(l.info),r=_.cloneDeep(l.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewSwitch",type:e.MySwitch,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultRotateImg=function(){var t=_.cloneDeep(m.info),r=_.cloneDeep(m.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewRotateImg",type:e.MyRotateImg,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultDateTime=function(){var t=160+Math.ceil(6),r={width:t,height:36,left:0,top:0,originX:"center",originY:"center",initValue:0,dateTimeModeId:"0",RTCModeId:"0",fontFamily:"宋体",fontSize:30,fontColor:"rgba(255,255,255,1)",align:"center",arrange:"horizontal",disableHighlight:!1,fontBold:"100",fontItalic:"",maxFontWidth:30,spacing:-10,paddingRatio:.1};return{id:Math.random().toString(36).substr(2),info:r,name:"NewDateTime",type:e.MyDateTime,expand:!0,url:"",zIndex:0,texList:[{currentSliceIdx:0,name:"时间日期",slices:[{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]}},this.getDefaultTexTime=function(){for(var t={characterW:30,characterH:30,width:240,height:30,left:0,top:0,originX:"center",originY:"center",initValue:0,dateTimeModeId:"0",RTCModeId:"0",align:"center",arrange:"horizontal",disableHighlight:!1,maxFontWidth:30},r=[],i=0;i<13;i++)r[i]={},r[i].imgSrc="",r[i].color="rgba(120,120,120,1)",i<=9?r[i].name="数字"+i:10===i?r[i].name=":":11===i?r[i].name="/":12===i&&(r[i].name="-");return{id:Math.random().toString(36).substr(2),info:t,name:"NewTexTime",type:e.MyTexTime,expand:!0,url:"",zIndex:0,texList:[{currentSliceIdx:0,name:"时间日期纹理",slices:r},{currentSliceIdx:1,name:"高亮纹理",slices:[{color:"rgba(244,244,244,0.3)",imgSrc:"",name:"高亮"}]}]}},this.getDefaultScriptTrigger=function(){var t={width:100,height:100,left:0,top:0,originX:"center",originY:"center",lowAlarmValue:0,highAlarmValue:100};return{id:Math.random().toString(36).substr(2),info:t,name:"NewScriptTrigger",type:e.MyScriptTrigger,expand:!0,url:"",zIndex:0}},this.getDefaultSlideBlock=function(){var t=_.cloneDeep(u.info),r=_.cloneDeep(u.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewSlideBlock",type:e.MySlideBlock,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultVideo=function(){var t={width:215,height:110,left:0,top:0,originX:"center",originY:"center",source:"HDMI",scale:"1"};return{id:Math.random().toString(36).substr(2),info:t,name:"NewVideo",type:e.MyVideo,expand:!0,zIndex:0,texList:[{currentSliceIdx:0,name:"影像",slices:[{color:"rgba(252,94,34,1)",imgSrc:"",name:"影像"}]}]}},this.getDefaultAnimation=function(){var t={width:200,height:150,left:0,top:0,originX:"center",originY:"center"};return{id:Math.random().toString(36).substr(2),info:t,subSlides:[],name:"NewAnimation",type:e.MyAnimation,expand:!0,url:"",zIndex:0,texList:[{name:"纹理",currentSliceIdx:0,slices:[{color:"rgba(239,162,68,1)",imgSrc:"",name:"图片"}]}]}},this.getDefaultSelector=function(){var t=_.cloneDeep(d.info),r=_.cloneDeep(d.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewSelector",type:e.MySelector,expand:!0,url:"",zIndex:0,texList:r}},this.getDefaultRotaryKnob=function(){var t=_.cloneDeep(h.info),r=_.cloneDeep(h.texList);return{id:Math.random().toString(36).substr(2),info:t,name:"NewRotaryKnob",type:e.MyRotaryKnob,expand:!0,url:"",zIndex:0,texList:r}},this.getSysColorPicker=function(){var e,t,r,i,n,a,l,c=Math.ceil(.9*o.width),g=Math.ceil(.9*o.height),m=Math.floor(.05*o.width),u=Math.floor(.05*o.height);n=c>=800?1:c/800,a=g>=480?1:g/480,l=n<=a?n:a,r=Math.floor(800*l),i=Math.floor(480*l),e=Math.floor(Math.abs(c-r)/2)+m,t=Math.floor(Math.abs(g-i)/2)+u;var s={top:t,left:e,width:r,height:i},d=[{currentSliceIdx:0,name:"背景",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/colorPicker/slide.png",name:"slide"}]},{currentSliceIdx:1,name:"年",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/colorPicker/colorpickerAlphaBg.png",name:"colorPickerAlpha"}]},{currentSliceIdx:2,name:"月",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/colorPicker/bg.png",name:"bg"}]},{currentSliceIdx:3,name:"日",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/colorPicker/pickerIndicator.png",name:"pickerIndicator"}]}];return{id:Math.random().toString(36).substr(2),generalType:"ColorPicker",name:"ColorPicker",info:s,texList:d}},this.getSystemDatePicker=function(){var t,r,i,n,a,l,c,g=Math.ceil(.9*o.width),m=Math.ceil(.9*o.height),u=Math.floor(.05*o.width),s=Math.floor(.05*o.height);a=g>=800?1:g/800,l=m>=480?1:m/480,c=a<=l?a:l,i=Math.floor(800*c),n=Math.floor(480*c),t=Math.floor(Math.abs(g-i)/2)+u,r=Math.floor(Math.abs(m-n)/2)+s;var d={top:r,left:t,width:i,height:n,dayW:Math.floor(100*c),dayH:Math.floor(65*c),paddingX:Math.floor(50*c),paddingY:Math.floor(145*c),yearX:Math.floor(200*c),yearY:0,yearW:Math.floor(180*c),yearH:Math.floor(80*c),monthX:Math.floor(450*c),monthY:0,monthW:Math.floor(90*c),monthH:Math.floor(80*c),buttonSize:Math.floor(80*c),titleFontSize:Math.floor(32*c),titleFontFamily:"Arial",titleFontColor:"#5E5E5E",itemFontSize:Math.floor(20*c),itemFontFamily:"Arial",itemFontColor:"#797979"},h=[{currentSliceIdx:0,name:"背景",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/datePicker/background.png",name:"背景"}]},{currentSliceIdx:1,name:"年",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"年"}]},{currentSliceIdx:2,name:"月",slices:[{color:"rgba(0,0,0,0)",imgSrc:"",name:"月"}]},{currentSliceIdx:3,name:"日",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/datePicker/itemBack.png",name:"日"}]},{currentSliceIdx:4,name:"高亮",slices:[{color:"rgba(0,0,0,0)",imgSrc:"/public/images/datePicker/highlight.png"}]}];return{id:Math.random().toString(36).substr(2),type:e.SysDatePicker,name:"SysDatePicker",info:d,texList:h}};var f=null;this.setTemplateId=function(e){f=e},this.getTemplateId=function(){return f}}]);