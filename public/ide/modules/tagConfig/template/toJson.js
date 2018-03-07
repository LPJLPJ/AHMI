var fs = require('fs');


var defaultTags = [
    {
        name: '传递按键编码',                   //名称
        indexOfRegister: 1000         //寄存器序号
    },
    {
        name: '视频',                   //名称
        indexOfRegister: 1001         //寄存器序号
    },
    {
        name: '当前页面序号',                   //名称
        indexOfRegister: 1002         //寄存器序号
    },
    {
        name: '时钟变量年月日',                   //名称
        indexOfRegister: 1003         //寄存器序号
    },
    {
        name: '时钟变量时分秒',                   //名称
        indexOfRegister: 1004         //寄存器序号
    },
    {
        name: '背光',                   //名称
        indexOfRegister: 1005         //寄存器序号
    },
    {
        name: '蜂鸣器',                   //名称
        indexOfRegister: 1006         //寄存器序号
    },
    {
        name: '语言',                   //名称
        indexOfRegister: 1007         //寄存器序号
    },
    {
        name: '档位',                   //名称
        indexOfRegister: 1008          //寄存器序号
    },
    {
        name: '单位',                   //名称
        indexOfRegister: 1009          //寄存器序号
    },
    {
        name: '设置界面_背光亮度',         //名称
        indexOfRegister: 1010           //寄存器序号
    },
    {
        name: '设置界面_设置选择',                   //名称
        indexOfRegister: 1011         //寄存器序号
    },
    {
        name: '设置界面_报警车速',                   //名称
        indexOfRegister: 1012         //寄存器序号
    },
    {
        name: '设置界面_时',                   //名称
        indexOfRegister: 1013         //寄存器序号
    },
    {
        name: '设置界面_分',                   //名称
        indexOfRegister: 1014         //寄存器序号
    },
    {
        name: '设置界面_清零剩余次数',                   //名称
        indexOfRegister: 1015         //寄存器序号
    },
    {
        name: '设置界面_年',                   //名称
        indexOfRegister: 1016         //寄存器序号
    },
    {
        name: '设置界面_月',                   //名称
        indexOfRegister: 1017         //寄存器序号
    },
    {
        name: '设置界面_日',                   //名称
        indexOfRegister: 1018         //寄存器序号
    },
    {
        name: '设置界面_主题切换',                   //名称
        indexOfRegister: 1019         //寄存器序号
    },
    {
        name: '动画',                   //名称
        indexOfRegister: 1020         //寄存器序号
    },
    {
        name: '动画1ms',                   //名称
        indexOfRegister: 1021         //寄存器序号
    },
    {
        name: '能量回收',                   //名称
        indexOfRegister: 1022         //寄存器序号
    },
    {
        name: '充电界面-电池图片集',                   //名称
        indexOfRegister: 1023         //寄存器序号
    },
    {
        name: '警示灯',                   //名称
        indexOfRegister: 1024         //寄存器序号
    }

];


var defaultTags1 = [
    {
        name: '主题1_电压_数字',                   //名称
        indexOfRegister: 101         //寄存器序号
    },
    {
        name: '主题1_电压_图片集',                   //名称
        indexOfRegister: 102         //寄存器序号
    },
    {
        name: '主题1_电压_进度条',                   //名称
        indexOfRegister: 103         //寄存器序号
    },
    {
        name: '主题1_电压_仪表盘',                   //名称
        indexOfRegister: 104         //寄存器序号
    },
    {
        name: '主题1_电流_数字',                   //名称
        indexOfRegister: 105         //寄存器序号
    },
    {
        name: '主题1_电流_图片集',                   //名称
        indexOfRegister: 106         //寄存器序号
    },
    {
        name: '主题1_电流_进度条',                   //名称
        indexOfRegister: 107         //寄存器序号
    },
    {
        name: '主题1_电流_仪表盘',                   //名称
        indexOfRegister: 108         //寄存器序号
    },
    {
        name: '主题1_剩余电量_数字',                   //名称
        indexOfRegister: 109          //寄存器序号
    },
    {
        name: '主题1_剩余电量_图片集',                   //名称
        indexOfRegister: 110          //寄存器序号
    },
    {
        name: '主题1_剩余电量_进度条',         //名称
        indexOfRegister: 111           //寄存器序号
    },
    {
        name: '主题1_剩余电量_仪表盘',                   //名称
        indexOfRegister: 112         //寄存器序号
    },
    {
        name: '主题1_续航里程_数字',                   //名称
        indexOfRegister: 113         //寄存器序号
    },
    {
        name: '主题1_续航里程_图片集',                   //名称
        indexOfRegister: 114         //寄存器序号
    },
    {
        name: '主题1_续航里程_进度条',                   //名称
        indexOfRegister: 115         //寄存器序号
    },
    {
        name: '主题1_续航里程_仪表盘',                   //名称
        indexOfRegister: 116         //寄存器序号
    },
    {
        name: '主题1_转速_数字',                   //名称
        indexOfRegister: 117         //寄存器序号
    },
    {
        name: '主题1_转速_图片集',                   //名称
        indexOfRegister: 118         //寄存器序号
    },
    {
        name: '主题1_转速_进度条',                   //名称
        indexOfRegister: 119         //寄存器序号
    },
    {
        name: '主题1_转速_仪表盘',                   //名称
        indexOfRegister: 120         //寄存器序号
    },
    {
        name: '主题1_车速_数字',                   //名称
        indexOfRegister: 121         //寄存器序号
    },
    {
        name: '主题1_车速_图片集',                   //名称
        indexOfRegister: 122         //寄存器序号
    },
    {
        name: '主题1_车速_进度条',                   //名称
        indexOfRegister: 123         //寄存器序号
    },
    {
        name: '主题1_车速_仪表盘',                   //名称
        indexOfRegister: 124         //寄存器序号
    },
    {
        name: '主题1_温度_数字',                   //名称
        indexOfRegister: 125         //寄存器序号
    },
    {
        name: '主题1_温度_图片集',                   //名称
        indexOfRegister: 126         //寄存器序号
    },
    {
        name: '主题1_温度_进度条',                   //名称
        indexOfRegister: 127         //寄存器序号
    },
    {
        name: '主题1_温度_仪表盘',                   //名称
        indexOfRegister: 128         //寄存器序号
    },
    {
        name: '主题1_文字报警',                   //名称
        indexOfRegister: 129         //寄存器序号
    },
    {
        name: '主题1_小记里程',                   //名称
        indexOfRegister: 130         //寄存器序号
    },
    {
        name: '主题1_总里程',                   //名称
        indexOfRegister: 131         //寄存器序号
    },
    {
        name: '主题1_遮盖',                   //名称
        indexOfRegister: 132         //寄存器序号
    },
    {
        name: '主题1_车门状态',                   //名称
        indexOfRegister: 133         //寄存器序号
    }
];


var defaultTags2 = [
    {
        name: '主题2_电压_数字',                   //名称
        indexOfRegister: 201         //寄存器序号
    },
    {
        name: '主题2_电压_图片集',                   //名称
        indexOfRegister: 202         //寄存器序号
    },
    {
        name: '主题2_电压_进度条',                   //名称
        indexOfRegister: 203         //寄存器序号
    },
    {
        name: '主题2_电压_仪表盘',                   //名称
        indexOfRegister: 204         //寄存器序号
    },
    {
        name: '主题2_电流_数字',                   //名称
        indexOfRegister: 205         //寄存器序号
    },
    {
        name: '主题2_电流_图片集',                   //名称
        indexOfRegister: 206         //寄存器序号
    },
    {
        name: '主题2_电流_进度条',                   //名称
        indexOfRegister: 207         //寄存器序号
    },
    {
        name: '主题2_电流_仪表盘',                   //名称
        indexOfRegister: 208         //寄存器序号
    },
    {
        name: '主题2_剩余电量_数字',                   //名称
        indexOfRegister: 209          //寄存器序号
    },
    {
        name: '主题2_剩余电量_图片集',                   //名称
        indexOfRegister: 210          //寄存器序号
    },
    {
        name: '主题2_剩余电量_进度条',         //名称
        indexOfRegister: 211           //寄存器序号
    },
    {
        name: '主题2_剩余电量_仪表盘',                   //名称
        indexOfRegister: 212         //寄存器序号
    },
    {
        name: '主题2_续航里程_数字',                   //名称
        indexOfRegister: 213         //寄存器序号
    },
    {
        name: '主题2_续航里程_图片集',                   //名称
        indexOfRegister: 214         //寄存器序号
    },
    {
        name: '主题2_续航里程_进度条',                   //名称
        indexOfRegister: 215         //寄存器序号
    },
    {
        name: '主题2_续航里程_仪表盘',                   //名称
        indexOfRegister: 216         //寄存器序号
    },
    {
        name: '主题2_转速_数字',                   //名称
        indexOfRegister: 217         //寄存器序号
    },
    {
        name: '主题2_转速_图片集',                   //名称
        indexOfRegister: 218         //寄存器序号
    },
    {
        name: '主题2_转速_进度条',                   //名称
        indexOfRegister: 219         //寄存器序号
    },
    {
        name: '主题2_转速_仪表盘',                   //名称
        indexOfRegister: 220         //寄存器序号
    },
    {
        name: '主题2_车速_数字',                   //名称
        indexOfRegister: 221         //寄存器序号
    },
    {
        name: '主题2_车速_图片集',                   //名称
        indexOfRegister: 222         //寄存器序号
    },
    {
        name: '主题2_车速_进度条',                   //名称
        indexOfRegister: 223         //寄存器序号
    },
    {
        name: '主题2_车速_仪表盘',                   //名称
        indexOfRegister: 224         //寄存器序号
    },
    {
        name: '主题2_温度_数字',                   //名称
        indexOfRegister: 225         //寄存器序号
    },
    {
        name: '主题2_温度_图片集',                   //名称
        indexOfRegister: 226         //寄存器序号
    },
    {
        name: '主题2_温度_进度条',                   //名称
        indexOfRegister: 227         //寄存器序号
    },
    {
        name: '主题2_温度_仪表盘',                   //名称
        indexOfRegister: 228         //寄存器序号
    },
    {
        name: '主题2_文字报警',                   //名称
        indexOfRegister: 229         //寄存器序号
    },
    {
        name: '主题2_小记里程',                   //名称
        indexOfRegister: 230         //寄存器序号
    },
    {
        name: '主题2_总里程',                   //名称
        indexOfRegister: 231         //寄存器序号
    },
    {
        name: '主题2_遮盖',                   //名称
        indexOfRegister: 232         //寄存器序号
    },
    {
        name: '主题2_车门状态',                   //名称
        indexOfRegister: 233         //寄存器序号
    }
];


var defaultTags3 = [
    {
        name: '主题3_电压_数字',                   //名称
        indexOfRegister: 301         //寄存器序号
    },
    {
        name: '主题3_电压_图片集',                   //名称
        indexOfRegister: 302         //寄存器序号
    },
    {
        name: '主题3_电压_进度条',                   //名称
        indexOfRegister: 303         //寄存器序号
    },
    {
        name: '主题3_电压_仪表盘',                   //名称
        indexOfRegister: 304         //寄存器序号
    },
    {
        name: '主题3_电流_数字',                   //名称
        indexOfRegister: 305         //寄存器序号
    },
    {
        name: '主题3_电流_图片集',                   //名称
        indexOfRegister: 306         //寄存器序号
    },
    {
        name: '主题3_电流_进度条',                   //名称
        indexOfRegister: 307         //寄存器序号
    },
    {
        name: '主题3_电流_仪表盘',                   //名称
        indexOfRegister: 308         //寄存器序号
    },
    {
        name: '主题3_剩余电量_数字',                   //名称
        indexOfRegister: 309          //寄存器序号
    },
    {
        name: '主题3_剩余电量_图片集',                   //名称
        indexOfRegister: 310          //寄存器序号
    },
    {
        name: '主题3_剩余电量_进度条',         //名称
        indexOfRegister: 311           //寄存器序号
    },
    {
        name: '主题3_剩余电量_仪表盘',                   //名称
        indexOfRegister: 312         //寄存器序号
    },
    {
        name: '主题3_续航里程_数字',                   //名称
        indexOfRegister: 313         //寄存器序号
    },
    {
        name: '主题3_续航里程_图片集',                   //名称
        indexOfRegister: 314         //寄存器序号
    },
    {
        name: '主题3_续航里程_进度条',                   //名称
        indexOfRegister: 315         //寄存器序号
    },
    {
        name: '主题3_续航里程_仪表盘',                   //名称
        indexOfRegister: 316         //寄存器序号
    },
    {
        name: '主题3_转速_数字',                   //名称
        indexOfRegister: 317         //寄存器序号
    },
    {
        name: '主题3_转速_图片集',                   //名称
        indexOfRegister: 318         //寄存器序号
    },
    {
        name: '主题3_转速_进度条',                   //名称
        indexOfRegister: 319         //寄存器序号
    },
    {
        name: '主题3_转速_仪表盘',                   //名称
        indexOfRegister: 320         //寄存器序号
    },
    {
        name: '主题3_车速_数字',                   //名称
        indexOfRegister: 321         //寄存器序号
    },
    {
        name: '主题3_车速_图片集',                   //名称
        indexOfRegister: 322         //寄存器序号
    },
    {
        name: '主题3_车速_进度条',                   //名称
        indexOfRegister: 323         //寄存器序号
    },
    {
        name: '主题3_车速_仪表盘',                   //名称
        indexOfRegister: 324         //寄存器序号
    },
    {
        name: '主题3_温度_数字',                   //名称
        indexOfRegister: 325         //寄存器序号
    },
    {
        name: '主题3_温度_图片集',                   //名称
        indexOfRegister: 326         //寄存器序号
    },
    {
        name: '主题3_温度_进度条',                   //名称
        indexOfRegister: 327         //寄存器序号
    },
    {
        name: '主题3_温度_仪表盘',                   //名称
        indexOfRegister: 328         //寄存器序号
    },
    {
        name: '主题3_文字报警',                   //名称
        indexOfRegister: 329         //寄存器序号
    },
    {
        name: '主题3_小记里程',                   //名称
        indexOfRegister: 330         //寄存器序号
    },
    {
        name: '主题3_总里程',                   //名称
        indexOfRegister: 331         //寄存器序号
    },
    {
        name: '主题3_遮盖',                   //名称
        indexOfRegister: 332         //寄存器序号
    },
    {
        name: '主题3_车门状态',                   //名称
        indexOfRegister: 333         //寄存器序号
    }
];


var defaultTags4 = [
    {
        name: '主题4_电压_数字',                   //名称
        indexOfRegister: 401         //寄存器序号
    },
    {
        name: '主题4_电压_图片集',                   //名称
        indexOfRegister: 402         //寄存器序号
    },
    {
        name: '主题4_电压_进度条',                   //名称
        indexOfRegister: 403         //寄存器序号
    },
    {
        name: '主题4_电压_仪表盘',                   //名称
        indexOfRegister: 404         //寄存器序号
    },
    {
        name: '主题4_电流_数字',                   //名称
        indexOfRegister: 405         //寄存器序号
    },
    {
        name: '主题4_电流_图片集',                   //名称
        indexOfRegister: 406         //寄存器序号
    },
    {
        name: '主题4_电流_进度条',                   //名称
        indexOfRegister: 407         //寄存器序号
    },
    {
        name: '主题4_电流_仪表盘',                   //名称
        indexOfRegister: 408         //寄存器序号
    },
    {
        name: '主题4_剩余电量_数字',                   //名称
        indexOfRegister: 409          //寄存器序号
    },
    {
        name: '主题4_剩余电量_图片集',                   //名称
        indexOfRegister: 410          //寄存器序号
    },
    {
        name: '主题4_剩余电量_进度条',         //名称
        indexOfRegister: 411           //寄存器序号
    },
    {
        name: '主题4_剩余电量_仪表盘',                   //名称
        indexOfRegister: 412         //寄存器序号
    },
    {
        name: '主题4_续航里程_数字',                   //名称
        indexOfRegister: 413         //寄存器序号
    },
    {
        name: '主题4_续航里程_图片集',                   //名称
        indexOfRegister: 414         //寄存器序号
    },
    {
        name: '主题4_续航里程_进度条',                   //名称
        indexOfRegister: 415         //寄存器序号
    },
    {
        name: '主题4_续航里程_仪表盘',                   //名称
        indexOfRegister: 416         //寄存器序号
    },
    {
        name: '主题4_转速_数字',                   //名称
        indexOfRegister: 417         //寄存器序号
    },
    {
        name: '主题4_转速_图片集',                   //名称
        indexOfRegister: 418         //寄存器序号
    },
    {
        name: '主题4_转速_进度条',                   //名称
        indexOfRegister: 419         //寄存器序号
    },
    {
        name: '主题4_转速_仪表盘',                   //名称
        indexOfRegister: 420         //寄存器序号
    },
    {
        name: '主题4_车速_数字',                   //名称
        indexOfRegister: 421         //寄存器序号
    },
    {
        name: '主题4_车速_图片集',                   //名称
        indexOfRegister: 422         //寄存器序号
    },
    {
        name: '主题4_车速_进度条',                   //名称
        indexOfRegister: 423         //寄存器序号
    },
    {
        name: '主题4_车速_仪表盘',                   //名称
        indexOfRegister: 424         //寄存器序号
    },
    {
        name: '主题4_温度_数字',                   //名称
        indexOfRegister: 425         //寄存器序号
    },
    {
        name: '主题4_温度_图片集',                   //名称
        indexOfRegister: 426         //寄存器序号
    },
    {
        name: '主题4_温度_进度条',                   //名称
        indexOfRegister: 427         //寄存器序号
    },
    {
        name: '主题4_温度_仪表盘',                   //名称
        indexOfRegister: 428         //寄存器序号
    },
    {
        name: '主题4_文字报警',                   //名称
        indexOfRegister: 429         //寄存器序号
    },
    {
        name: '主题4_小记里程',                   //名称
        indexOfRegister: 430         //寄存器序号
    },
    {
        name: '主题4_总里程',                   //名称
        indexOfRegister: 431         //寄存器序号
    },
    {
        name: '主题4_遮盖',                   //名称
        indexOfRegister: 432         //寄存器序号
    },
    {
        name: '主题4_车门状态',                   //名称
        indexOfRegister: 433         //寄存器序号
    }
];

var tagsList = [defaultTags, defaultTags1, defaultTags2, defaultTags3, defaultTags4];

for(var i=0,il=tagsList.length;i<il;i++){
    tagsList[i].forEach(function (item) {
        item.register = false;
        item.writeOrRead = 'true';
        item.value = 0;
        var name = item.name;
        if (name === "传递按键编码" || name === "视频" || name === "当前页面序号" || name === "时钟变量年月日" ||
            name === "时钟变量时分秒" || name === "背光" || name === "蜂鸣器") {
            item.type = "system";
        } else {
            item.type = "custom";
        }

        if (name === "传递按键编码" || name === "视频" || name === "当前页面序号") {
            item.bindMod = "forbidden";
        } else {
            item.bindMod = "default";
        }
    });
}



fs.writeFile('tags.default0.json', JSON.stringify(defaultTags, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default1.json', JSON.stringify(defaultTags1, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default2.json', JSON.stringify(defaultTags2, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default2.json', JSON.stringify(defaultTags3, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default2.json', JSON.stringify(defaultTags4, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});