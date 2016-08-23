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
    backgroundColor: 'rbga(255,255,255,1)',
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
                                        color: 'rgba(255,255,0,1)'
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
        x: 0,
        y: 0,
        width: 0.1,
        height: 0.1,
        slices: [
            new KeyTexObj('1', '', '', 'rgba(0,255,0,1.0)'),
            new KeyTexObj('1')
        ]
    },
    {
        name: 'ENTER',
        value: 'enter',
        x: 0.1,
        y: 0.1,
        width: 0.1,
        height: 0.1,
        slices: [
            new KeyTexObj('Enter', '', '', 'rgba(0,255,0,1.0)'),
            new KeyTexObj('Enter')
        ]
    }
];

var num = {
    x: 0,
    y: 0,
    width: 1,
    height: 0.2
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


module.exports = InputKeyboard;