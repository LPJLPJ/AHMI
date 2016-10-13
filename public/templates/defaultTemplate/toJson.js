var fs = require('fs');
var defaultTemplate ={
	defaultButton:{
		info :{
				width:100, 
				height: 50,
                left: 0, top: 0,
                originX: 'center', originY: 'center',
                arrange:true,            

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
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/templates/defaultTemplate/defaultResources/button1.png',
                        name:'按下前'
                    },{
                        color:'rgba(0,0,0,0)',
                        imgSrc:'/public/templates/defaultTemplate/defaultResources/button2.png',
                        name:'按下后'
                    },{
                        color:'rgba(244,244,244,0.3)',
                        imgSrc:'',
                        name:'高亮'
                    }]
        }]
	},
	defaultSwitch:{
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
                color:'rgba(0,0,0,0)',
                imgSrc:'/public/templates/defaultTemplate/defaultResources/switch.png',
                name:'开关图片'
             }]
        }]
	},
	defaultProgress:{
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
                     color:'rgba(0,0,0,0)',
                     imgSrc:'/public/templates/defaultTemplate/defaultResources/barBackground.png',
                     name:'进度条底纹'
                     }]
                     },{
                     currentSliceIdx:0,
                     name:'进度条',
                     slices:[{
                     color:'rgba(0,0,0,0)',
                     imgSrc:'/public/templates/defaultTemplate/defaultResources/barAll.png',
                     name:'进度条'
             }]
        }]
	},
    defaultDashboard:{
        info:{
            width:250,
            height: 250,
            left: 0, top: 0,
            originX: 'center', originY: 'center',
            clockwise:'1',
            minValue:0,maxValue:360,
            minAngle:0,maxAngle:360,
            lowAlarmValue:0,highAlarmValue:360,
            value:45,
            offsetValue:0,
            pointerLength:185
        },
        texList:[{
            currentSliceIdx:0,
            name:'仪表盘背景',
            slices:[{
                color:'rgba(0,0,0,0)',
                imgSrc:'/public/templates/defaultTemplate/defaultResources/dashboard.png',
                name:'仪表盘背景'
            }]
        },{
            currentSliceIdx:0,
            name:'仪表盘指针',
            slices:[{
                color:'rgba(0,0,0,0)',
                imgSrc:'/public/templates/defaultTemplate/defaultResources/pointer.png',
                name:'仪表盘指针'
            }]
        }]
    },
    defaultRotateImage:{
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
                color:'rgba(0,0,0,0)',
                imgSrc:'/public/templates/defaultTemplate/defaultResources/rotateImage.png',
                name:'旋转图片'
            }]
        }]
    },
    defaultSlideBlock:{
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
                color:'rgba(0,0,0,0)',
                imgSrc:'/public/templates/defaultTemplate/defaultResources/sliderBlock.png',
                name:'滑块'
            }]
        }]
    },

	templateResourcesList:[
		{
            id: 'button1.png',
            src: '/public/templates/defaultTemplate/defaultResources/button1.png',
            name: '按钮按下前',
            content: null,
            complete: true,
            type:"image/png"
		},
		{
			id: 'button2.png',
            src: '/public/templates/defaultTemplate/defaultResources/button2.png',
            name: '按钮按下后',
            content: null,
            complete: true,
            type:"image/png"
		},
		{
		    id: 'switch.png',
            src: '/public/templates/defaultTemplate/defaultResources/switch.png',
            name: '开关纹理',
            content: null,
            complete: true,
            type:"image/png"
		},
        {
		    id: 'barAll.png',
            src: '/public/templates/defaultTemplate/defaultResources/barAll.png',
            name: '进度条',
            content: null,
            complete: true,
            type:"image/png"
		},
		{
            id: 'barBackground.png',
            src: '/public/templates/defaultTemplate/defaultResources/barBackground.png',
            name: '进度条背景',
            content: null,
            complete: true,
            type:"image/png"
        },
        {
            id: 'dashboard.png',
            src: '/public/templates/defaultTemplate/defaultResources/dashboard.png',
            name: '仪表盘背景',
            content: null,
            complete: true,
            type:"image/png"
        },
        {
            id: 'lightBand.png',
            src: '/public/templates/defaultTemplate/defaultResources/lightBand.png',
            name: '光带',
            content: null,
            complete: true,
            type:"image/png"
        },
        {
            id: 'pointer.png',
            src: '/public/templates/defaultTemplate/defaultResources/pointer.png',
            name: '指针',
            content: null,
            complete: true,
            type:"image/png"
        },
        {
            id: 'rotateImage.png',
            src: '/public/templates/defaultTemplate/defaultResources/rotateImage.png',
            name: '旋转图',
            content: null,
            complete: true,
            type:"image/png"
        },
        {
            id: 'sliderBlock.png',
            src: '/public/templates/defaultTemplate/defaultResources/sliderBlock.png',
            name: '滑块',
            content: null,
            complete: true,
            type:"image/png"
        }

	],	
	
}

var buttonJson = JSON.stringify(defaultTemplate);
fs.writeFile('defaultTemplate.json',buttonJson,function(err){
	if(err)
		throw err;
	console.log('templates have saved!');
})