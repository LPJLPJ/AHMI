ideServices.service("MiddleWareService",["AnimationService","Type",function(i,n){function t(){var i,n,t,e,o;i=arguments[0],n=i.pages||[],n.forEach(function(i){s.page(i),t=i.layers||[],t.forEach(function(i){s.layer(i),e=i.subLayers||[],e.forEach(function(n){s.subLayer(n,i.info||{}),o=n.widgets||[],o.forEach(function(i){s.widget(i)})}),t.showSubLayer=e[0]})})}function e(i){return parseInt((i.version||"1.0.0").replace(/\./g,""))<parseInt((a||"").replace(/\./g,""))}function o(i){e(i)&&t(i)}var a=window.ideVersion,s=Object.create({num:function(){var n=arguments[0],t=n.info;if(void 0===t.paddingRatio){var e,o;t.paddingRatio=.1,t.spacing=Math.ceil(-t.fontSize/3),t.maxFontWidth=t.fontSize,t.paddingX=Math.ceil(t.fontSize*t.paddingRatio),e="0"==t.symbolMode?t.numOfDigits*(t.fontSize+t.spacing)-t.spacing:(t.numOfDigits+1)*(t.fontSize+t.spacing)-t.spacing,e+=2*t.paddingX,0!=t.decimalCount&&(e+=.5*t.fontSize+this.spacing),o=Math.ceil(1.2*t.fontSize),t.width=e,t.height=o}void 0===n.transition&&(n.transition=i.getDefaultTransition()),void 0===t.enableAnimation&&(t.enableAnimation=!1)},texNum:function(){var n=arguments[0];n.info;void 0===n.transition&&(n.transition=i.getDefaultTransition())},dateTime:function(){var i=arguments[0],n=i.info;if(void 0===n.paddingRatio){var t,e,o;n.paddingRatio=.1,n.spacing=n.spacing=Math.ceil(-n.fontSize/3),t="0"==n.dateTimeModeId?8*n.fontSize+7*n.spacing:"1"==n.dateTimeModeId?5*n.fontSize+4*n.spacing:10*n.fontSize+9*n.spacing,e=t+2*n.paddingRatio*n.fontSize,o=n.fontSize*(1+2*n.paddingRatio),n.width=e,n.height=o}void 0==n.disableHighlight&&(n.disableHighlight=!1)},texTime:function(){var i=arguments[0],n=i.info;void 0==n.disableHighlight&&(n.disableHighlight=!1)},progress:function(){var n=arguments[0],t=n.info;void 0===t.thresholdModeId&&(t.thresholdModeId="1",t.threshold1=null,t.threshold2=null),void 0===t.enableAnimation&&(t.enableAnimation=!1),void 0===n.transition&&(n.transition=i.getDefaultTransition())},dashboard:function(){var n=arguments[0],t=n.info;void 0===t.minCoverAngle&&(t.minCoverAngle=0,t.maxCoverAngle=0),void 0===t.enableAnimation&&(t.enableAnimation=!1),void 0===n.transition&&(n.transition=i.getDefaultTransition())},button:function(){var i=arguments[0],n=i.info;void 0===n.disableHighlight&&(n.disableHighlight=!1)},buttonGroup:function(){var i=arguments[0],n=i.info;void 0===n.disableHighlight&&(n.disableHighlight=!1)},slide:function(){var i=arguments[0],n=i.info;void 0===n.fontFamily&&(n.fontFamily="宋体",n.fontSize=20,n.fontColor="rgba(0,0,0,1)",n.fontBold="100",n.fontItalic="")},mySwitch:function(){var i=arguments[0],n=i.info;void 0===n.text&&(n.text="",n.fontFamily="宋体",n.fontSize=20,n.fontColor="rgba(0,0,0,1)",n.fontBold="100",n.fontItalic="")}});Object.assign(s,{page:function(n){void 0===n.transition&&(n.transition=i.getDefaultTransition())},layer:function(n){void 0===n.transition&&(n.transition=i.getDefaultTransition())},subLayer:function(i,n){i.info||Object.assign(i,{info:{width:n.width||400,height:n.height||240,scrollVEnabled:!1,scrollHEnabled:!1}})},widget:function(i){switch(i.type){case n.MyNum:this.num(i);break;case n.MyDateTime:this.dateTime(i);break;case n.MyTexNum:this.texNum(i);break;case n.MyTexTime:this.texTime(i);break;case n.MyProgress:this.progress(i);break;case n.MyDashboard:this.dashboard(i);break;case n.MyButton:this.button(i);break;case n.MyButtonGroup:this.buttonGroup(i);break;case n.MySlide:this.slide(i);break;case n.MySwitch:this.mySwitch(i)}}}),this.useMiddleWare=o}]);