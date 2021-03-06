/**
 * Created by Zzen1sS on 26/3/2016
 */
ideServices.service('TexService',['Type',function(Type){
    var defaultTexList={};
    defaultTexList[Type.MyButton] = [{
        name:'按钮纹理',
        currentSliceIdx:0,
        slices:[
            {
                name:'按下前',
                imgSrc:'',
                color:'rgba(255,255,255,1)'

            },
            {
                name:'按下后',
                imgSrc:'',
                color:'rgba(255,255,255,1)'
            }
        ]
    }
    ];
    defaultTexList[Type.MyNumber] = [{
        name:'0',
        currentSliceIdx:0,
        slices:[
            {
                name:'数字',
                imgSrc:'',
                color:'rgba(255,255,255,1)'

            }
        ]
    },
        {
            name:'1',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'2',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'3',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'4',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'5',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'6',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'7',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'8',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'9',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'+',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'-',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        },
        {
            name:'.',
            currentSliceIdx:0,
            slices:[
                {
                    name:'数字',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        }
    ];
    defaultTexList[Type.MyProgress] = [{
        name:'进度条',
        currentSliceIdx:0,
        slices:[
            {
                name:'进度条',
                imgSrc:'',
                color:'rgba(255,255,255,1)'

            }
        ]
    },
        {
            name:'进度条底纹',
            currentSliceIdx:0,
            slices:[
                {
                    name:'进度条底纹',
                    imgSrc:'',
                    color:'rgba(255,255,255,1)'

                }
            ]
        }
    ];

    defaultTexList[Type.MySlide] = [{
        name:'多层纹理',
        currentSliceIdx:0,
        slices:[
            {
                name:'图片',
                imgSrc:'',
                color:'rgba(255,255,255,1)'

            }
        ]
    }];

    this.getDefaultWidget = function (type) {
        if (type in defaultTexList){
            return defaultTexList[type];
        }else{
            return null;
        }
    };
    this.getDefaultSlice = function () {
        return {
            name:'defaultSlice',
            imgSrc:'',
            color:'rgba(255,255,255,1)',
        }
    }

}]);