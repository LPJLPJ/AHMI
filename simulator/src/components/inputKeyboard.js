/**
 * Created by ChangeCheng on 16/8/22.
 * visual input keyboard
 */
var kWidth = 0;
var kHeight = 0;
var kOffsetX = 0;
var kOffsetY = 0;
var InputKeyboard = {};
var _ = require('lodash');
var inputKeybaordStruct = {
    backgroundColor: 'rgba(212,212,212,1)',
    backgroundImage: '',
    actions: undefined,
    tag: '',
    triggers: undefined,
    canvasList: [
        {
            curSubCanvasIdx: 0,
            w: kWidth,
            h: kHeight,
            x: kOffsetX,
            y: kOffsetY,
            zIndex: 0,
            subCanvasList: [
                {
                    widgetList: [
                        {
                            type: 'widget',
                            subType: 'MyInputKeyboard',
                            info: {
                                width: kWidth,
                                height: kHeight,
                                left: 0,
                                top: 0
                            },
                            texList: [
                                {
                                    slices: [{
                                        imgSrc: '',
                                        color: 'rgba(0,0,0,1)'
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]

        }
    ]

};


function KeyTexObj(showValue, style, imgSrc, color) {
    this.display = {
        value: showValue || '',
        style: style || ''
    };

    this.imgSrc = imgSrc || '';
    this.color = color || '';
}

var keys = [
    {
        name: '1',
        value: '1',
        x: 2 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b1release', ''),
            new KeyTexObj('', '', 'b1press', '')
        ]
    },
    {
        name: '2',
        value: '2',
        x: 7 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b2release', ''),
            new KeyTexObj('', '', 'b2press', '')
        ]
    },
    {
        name: '3',
        value: '3',
        x: 12 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b3release', ''),
            new KeyTexObj('', '', 'b3press', '')
        ]
    },
    {
        name: 'Back',
        value: 'back',
        x: 17 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'bbackrelease', ''),
            new KeyTexObj('', '', 'bbackpress', '')
        ]
    },
    {
        name: 'Esc',
        value: 'esc',
        x: 22 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'bbackrelease', ''),
            new KeyTexObj('', '', 'bbackpress', '')
        ]
    },
    {
        name: '4',
        value: '4',
        x: 2 / 28,
        y: 0.5,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b4release', ''),
            new KeyTexObj('', '', 'b4press', '')
        ]
    },
    {
        name: '5',
        value: '5',
        x: 7 / 28,
        y: 0.5,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b5release', ''),
            new KeyTexObj('', '', 'b5press', '')
        ]
    },
    {
        name: '6',
        value: '6',
        x: 12 / 28,
        y: 0.5,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b6release', ''),
            new KeyTexObj('', '', 'b6press', '')
        ]
    },
    {
        name: '0',
        value: '0',
        x: 17 / 28,
        y: 0.5,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b0release', ''),
            new KeyTexObj('', '', 'b0press', '')
        ]
    },
    {
        name: 'Esc',
        value: 'esc',
        x: 22 / 28,
        y: 0.25,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'bescrelease', ''),
            new KeyTexObj('', '', 'bescpress', '')
        ]
    },
    {
        name: 'ENTER',
        value: 'enter',
        x: 22 / 28,
        y: 0.5,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'benterrelease', ''),
            new KeyTexObj('', '', 'benterpress', '')
        ]
    },
    {
        name: '7',
        value: '7',
        x: 2 / 28,
        y: 0.75,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b7release', ''),
            new KeyTexObj('', '', 'b7press', '')
        ]
    },
    {
        name: '8',
        value: '8',
        x: 7 / 28,
        y: 0.75,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b8release', ''),
            new KeyTexObj('', '', 'b8press', '')
        ]
    },
    {
        name: '9',
        value: '9',
        x: 12 / 28,
        y: 0.75,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'b9release', ''),
            new KeyTexObj('', '', 'b9press', '')
        ]
    },
    {
        name: '+/-',
        value: 'pm',
        x: 17 / 28,
        y: 0.75,
        width: 1 / 7,
        height: 3 / 16,
        slices: [
            new KeyTexObj('', '', 'bpmrelease', ''),
            new KeyTexObj('', '', 'bpmpress', '')
        ]
    }
];

var num = {
    x: 0,
    y: 0,
    width: 1,
    height: 0.2,
    color: 'rgba(255,0,0,1.0)',
    slices: [
        new KeyTexObj('', '', '', 'rgba(0,0,0,1.0)'),
    ]
}


var getInputKeyboard = function (width, height, offsetX, offsetY) {
    kWidth = width || kWidth;
    kHeight = height || kHeight;
    kOffsetX = offsetX || kOffsetX;
    kOffsetY = offsetY || kOffsetY;
    var curCanvas = inputKeybaordStruct.canvasList[0];
    curCanvas.w = kWidth;
    curCanvas.h = kHeight;
    curCanvas.x = kOffsetX;
    curCanvas.y = kOffsetY;
    var inputWidget = curCanvas.subCanvasList[0].widgetList[0];
    inputWidget.info.width = kWidth;
    inputWidget.info.height = kHeight;
    var curKeys = keys.map(function (key) {
        var curKey = _.cloneDeep(key);
        curKey.x = key.x * kWidth;
        curKey.y = key.y * kHeight;
        curKey.width = key.width * kWidth;
        curKey.height = key.height * kHeight;
        return curKey;
    })

    inputWidget.info.keys = curKeys;

    var curNum = _.cloneDeep(num);
    curNum.x *= kWidth;
    curNum.y *= kHeight;
    curNum.width *= kWidth;
    curNum.height *= kHeight;

    inputWidget.info.num = curNum;

    return inputKeybaordStruct;
}

InputKeyboard.getInputKeyboard = getInputKeyboard;
function TexRes(name) {
    this.id = name;
    this.name = name;
    this.type = 'image/bmp';
    this.src = '/public/images/' + name + '.png';
}

var defaultKeyTexList = ['b0press', 'b0release', 'b1press', 'b1release', 'b2press', 'b2release', 'b3press', 'b3release', 'b4press', 'b4release', 'b5press', 'b5release', 'b6press', 'b6release', 'b7press', 'b7release', 'b8press', 'b8release',
    'b9press', 'b9release', 'bbackpress', 'bbackrelease', 'benterpress', 'benterrelease', 'bescpress', 'bescrelease', 'bpmpress', 'bpmrelease'];
InputKeyboard.texList = defaultKeyTexList.map(function (name) {
    return new TexRes(name);
})

module.exports = InputKeyboard;