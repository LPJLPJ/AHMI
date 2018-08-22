var fs = require('fs');


var defaultTags1 = [
    {
        name: '传递按键编码',                     //名称
        indexOfRegister: 1         //寄存器序号
    },
    {
        name: '视频',                            //名称
        indexOfRegister: 2         //寄存器序号
    },
    {
        name: '当前页面序号',                     //名称
        indexOfRegister: 3        //寄存器序号
    },
    {
        name: '时钟变量年月日',                   //名称
        indexOfRegister: 4         //寄存器序号
    },
    {
        name: '时钟变量时分秒',                   //名称
        indexOfRegister: 5         //寄存器序号
    },
    {
        name: '蜂鸣器',                          //名称
        indexOfRegister: 6         //寄存器序号
    },
    {
        name: '背光',                            //名称
        indexOfRegister: 7         //寄存器序号
    },
    {
        name: '帧率',                            //名称
        indexOfRegister: 8         //寄存器序号
    },
    {
        name: '档位_图片集',                      //名称
        indexOfRegister: 9          //寄存器序号
    },
    {
        name: '符号片',                           //名称
        indexOfRegister: 10         //寄存器序号
    },
    {
        name: '文字报警',         //名称
        indexOfRegister: 11           //寄存器序号
    },
    {
        name: '小计里程',                   //名称
        indexOfRegister: 12         //寄存器序号
    },
    {
        name: '总里程',                   //名称
        indexOfRegister: 13         //寄存器序号
    },
    {
        name: '遮盖',                   //名称
        indexOfRegister: 14         //寄存器序号
    },
    {
        name: '车门状态',                   //名称
        indexOfRegister: 15         //寄存器序号
    },
    {
        name: '车速_文字',                   //名称
        indexOfRegister: 16         //寄存器序号
    },
    {
        name: '车速_图片集',                   //名称
        indexOfRegister: 17         //寄存器序号
    },
    {
        name: '车速_进度条',                   //名称
        indexOfRegister: 18         //寄存器序号
    },
    {
        name: '车速_仪表盘',                   //名称
        indexOfRegister: 19         //寄存器序号
    },
    {
        name: '电压_文字',                   //名称
        indexOfRegister: 20         //寄存器序号
    },
    {
        name: '电压_图片集',                   //名称
        indexOfRegister: 21         //寄存器序号
    },
    {
        name: '电压_进度条',                   //名称
        indexOfRegister: 22         //寄存器序号
    },
    {
        name: '电压_仪表盘',                   //名称
        indexOfRegister: 23         //寄存器序号
    },
    {
        name: '电流_文字',                   //名称
        indexOfRegister: 24         //寄存器序号
    },
    {
        name: '电流_图片集',                   //名称
        indexOfRegister: 25         //寄存器序号
    },
    {
        name: '电流_进度条',                   //名称
        indexOfRegister: 26         //寄存器序号
    },
    {
        name: '电流_仪表盘',                   //名称
        indexOfRegister: 27         //寄存器序号
    },
    {
        name: '剩余电量_文字',                   //名称
        indexOfRegister: 28         //寄存器序号
    },
    {
        name: '剩余电量_图片集',                   //名称
        indexOfRegister: 29         //寄存器序号
    },
    {
        name: '剩余电量_进度条',                   //名称
        indexOfRegister: 30         //寄存器序号
    },
    {
        name: '剩余电量_仪表盘',                   //名称
        indexOfRegister: 31         //寄存器序号
    },
    {
        name: '续航里程-数字',                   //名称
        indexOfRegister: 32         //寄存器序号
    },
    {
        name: '续航里程-图片集',                   //名称
        indexOfRegister: 33         //寄存器序号
    },
    {
        name: '续航里程-进度条',                   //名称
        indexOfRegister: 34         //寄存器序号
    },
    {
        name: '续航里程-仪表盘',                   //名称
        indexOfRegister: 35         //寄存器序号
    },
    {
        name: '转速_文字',                   //名称
        indexOfRegister: 36         //寄存器序号
    },
    {
        name: '转速_图片集',                   //名称
        indexOfRegister: 37         //寄存器序号
    },
    {
        name: '转速_进度条',                   //名称
        indexOfRegister: 38         //寄存器序号
    },
    {
        name: '转速_仪表盘',                   //名称
        indexOfRegister: 39         //寄存器序号
    },
    {
        name: '温度_文字',                   //名称
        indexOfRegister: 40         //寄存器序号
    },
    {
        name: '温度_图片集',                   //名称
        indexOfRegister: 41         //寄存器序号
    },
    {
        name: '温度_进度条',                   //名称
        indexOfRegister: 42         //寄存器序号
    },
    {
        name: '温度_仪表盘',                   //名称
        indexOfRegister: 43         //寄存器序号
    },
    {
        name: '动画',                   //名称
        indexOfRegister: 44         //寄存器序号
    }

];


var defaultTags2 = [
    {
        name: '传递按键编码',                     //名称
        indexOfRegister: 200         //寄存器序号
    },
    {
        name: '视频',                            //名称
        indexOfRegister: 201         //寄存器序号
    },
    {
        name: '当前页面序号',                     //名称
        indexOfRegister: 202        //寄存器序号
    },
    {
        name: '时钟变量年月日',                   //名称
        indexOfRegister: 203         //寄存器序号
    },
    {
        name: '时钟变量时分秒',                   //名称
        indexOfRegister: 204         //寄存器序号
    },
    {
        name: '蜂鸣器',                          //名称
        indexOfRegister: 205         //寄存器序号
    },
    {
        name: '背光',                            //名称
        indexOfRegister: 206         //寄存器序号
    },
    {
        name: '帧率',                            //名称
        indexOfRegister: 207         //寄存器序号
    },
    {
        name: '档位_图片集',                      //名称
        indexOfRegister: 208          //寄存器序号
    },
    {
        name: '符号片',                           //名称
        indexOfRegister: 209         //寄存器序号
    },
    {
        name: '文字报警',         //名称
        indexOfRegister: 210           //寄存器序号
    },
    {
        name: '小计里程',                   //名称
        indexOfRegister: 211         //寄存器序号
    },
    {
        name: '总里程',                   //名称
        indexOfRegister: 212         //寄存器序号
    },
    {
        name: '遮盖',                   //名称
        indexOfRegister: 213         //寄存器序号
    },
    {
        name: '车门状态',                   //名称
        indexOfRegister: 214         //寄存器序号
    },
    {
        name: '车速_文字',                   //名称
        indexOfRegister: 215         //寄存器序号
    },
    {
        name: '车速_图片集',                   //名称
        indexOfRegister: 216         //寄存器序号
    },
    {
        name: '车速_进度条',                   //名称
        indexOfRegister: 217         //寄存器序号
    },
    {
        name: '车速_仪表盘',                   //名称
        indexOfRegister: 218         //寄存器序号
    },
    {
        name: '电压_文字',                   //名称
        indexOfRegister: 219         //寄存器序号
    },
    {
        name: '电压_图片集',                   //名称
        indexOfRegister: 220         //寄存器序号
    },
    {
        name: '电压_进度条',                   //名称
        indexOfRegister: 221         //寄存器序号
    },
    {
        name: '电压_仪表盘',                   //名称
        indexOfRegister: 222         //寄存器序号
    },
    {
        name: '电流_文字',                   //名称
        indexOfRegister: 223         //寄存器序号
    },
    {
        name: '电流_图片集',                   //名称
        indexOfRegister: 224         //寄存器序号
    },
    {
        name: '电流_进度条',                   //名称
        indexOfRegister: 225         //寄存器序号
    },
    {
        name: '电流_仪表盘',                   //名称
        indexOfRegister: 226         //寄存器序号
    },
    {
        name: '剩余电量_文字',                   //名称
        indexOfRegister: 227         //寄存器序号
    },
    {
        name: '剩余电量_图片集',                   //名称
        indexOfRegister: 228         //寄存器序号
    },
    {
        name: '剩余电量_进度条',                   //名称
        indexOfRegister: 229         //寄存器序号
    },
    {
        name: '剩余电量_仪表盘',                   //名称
        indexOfRegister: 230         //寄存器序号
    },
    {
        name: '续航里程-数字',                   //名称
        indexOfRegister: 231         //寄存器序号
    },
    {
        name: '续航里程-图片集',                   //名称
        indexOfRegister: 232         //寄存器序号
    },
    {
        name: '续航里程-进度条',                   //名称
        indexOfRegister: 233         //寄存器序号
    },
    {
        name: '续航里程-仪表盘',                   //名称
        indexOfRegister: 234         //寄存器序号
    },
    {
        name: '转速_文字',                   //名称
        indexOfRegister: 235         //寄存器序号
    },
    {
        name: '转速_图片集',                   //名称
        indexOfRegister: 236         //寄存器序号
    },
    {
        name: '转速_进度条',                   //名称
        indexOfRegister: 237         //寄存器序号
    },
    {
        name: '转速_仪表盘',                   //名称
        indexOfRegister: 238         //寄存器序号
    },
    {
        name: '温度_文字',                   //名称
        indexOfRegister: 239         //寄存器序号
    },
    {
        name: '温度_图片集',                   //名称
        indexOfRegister: 240         //寄存器序号
    },
    {
        name: '温度_进度条',                   //名称
        indexOfRegister: 241         //寄存器序号
    },
    {
        name: '温度_仪表盘',                   //名称
        indexOfRegister: 242         //寄存器序号
    },
    {
        name: '动画',                   //名称
        indexOfRegister: 243         //寄存器序号
    }

];


var defaultTags3 = [
    {
        name: '传递按键编码',                     //名称
        indexOfRegister: 400         //寄存器序号
    },
    {
        name: '视频',                            //名称
        indexOfRegister: 401         //寄存器序号
    },
    {
        name: '当前页面序号',                     //名称
        indexOfRegister: 402        //寄存器序号
    },
    {
        name: '时钟变量年月日',                   //名称
        indexOfRegister: 403         //寄存器序号
    },
    {
        name: '时钟变量时分秒',                   //名称
        indexOfRegister: 404         //寄存器序号
    },
    {
        name: '蜂鸣器',                          //名称
        indexOfRegister: 405         //寄存器序号
    },
    {
        name: '背光',                            //名称
        indexOfRegister: 406         //寄存器序号
    },
    {
        name: '帧率',                            //名称
        indexOfRegister: 407         //寄存器序号
    },
    {
        name: '档位_图片集',                      //名称
        indexOfRegister: 408          //寄存器序号
    },
    {
        name: '符号片',                           //名称
        indexOfRegister: 409         //寄存器序号
    },
    {
        name: '文字报警',         //名称
        indexOfRegister: 410           //寄存器序号
    },
    {
        name: '小计里程',                   //名称
        indexOfRegister: 411         //寄存器序号
    },
    {
        name: '总里程',                   //名称
        indexOfRegister: 412         //寄存器序号
    },
    {
        name: '遮盖',                   //名称
        indexOfRegister: 413         //寄存器序号
    },
    {
        name: '车门状态',                   //名称
        indexOfRegister: 414         //寄存器序号
    },
    {
        name: '车速_文字',                   //名称
        indexOfRegister: 415         //寄存器序号
    },
    {
        name: '车速_图片集',                   //名称
        indexOfRegister: 416         //寄存器序号
    },
    {
        name: '车速_进度条',                   //名称
        indexOfRegister: 417         //寄存器序号
    },
    {
        name: '车速_仪表盘',                   //名称
        indexOfRegister: 418         //寄存器序号
    },
    {
        name: '电压_文字',                   //名称
        indexOfRegister: 419         //寄存器序号
    },
    {
        name: '电压_图片集',                   //名称
        indexOfRegister: 420         //寄存器序号
    },
    {
        name: '电压_进度条',                   //名称
        indexOfRegister: 421         //寄存器序号
    },
    {
        name: '电压_仪表盘',                   //名称
        indexOfRegister: 422         //寄存器序号
    },
    {
        name: '电流_文字',                   //名称
        indexOfRegister: 423         //寄存器序号
    },
    {
        name: '电流_图片集',                   //名称
        indexOfRegister: 424         //寄存器序号
    },
    {
        name: '电流_进度条',                   //名称
        indexOfRegister: 425         //寄存器序号
    },
    {
        name: '电流_仪表盘',                   //名称
        indexOfRegister: 426         //寄存器序号
    },
    {
        name: '剩余电量_文字',                   //名称
        indexOfRegister: 427         //寄存器序号
    },
    {
        name: '剩余电量_图片集',                   //名称
        indexOfRegister: 428         //寄存器序号
    },
    {
        name: '剩余电量_进度条',                   //名称
        indexOfRegister: 429         //寄存器序号
    },
    {
        name: '剩余电量_仪表盘',                   //名称
        indexOfRegister: 430         //寄存器序号
    },
    {
        name: '续航里程-数字',                   //名称
        indexOfRegister: 431         //寄存器序号
    },
    {
        name: '续航里程-图片集',                   //名称
        indexOfRegister: 432         //寄存器序号
    },
    {
        name: '续航里程-进度条',                   //名称
        indexOfRegister: 433         //寄存器序号
    },
    {
        name: '续航里程-仪表盘',                   //名称
        indexOfRegister: 434         //寄存器序号
    },
    {
        name: '转速_文字',                   //名称
        indexOfRegister: 435         //寄存器序号
    },
    {
        name: '转速_图片集',                   //名称
        indexOfRegister: 436         //寄存器序号
    },
    {
        name: '转速_进度条',                   //名称
        indexOfRegister: 437         //寄存器序号
    },
    {
        name: '转速_仪表盘',                   //名称
        indexOfRegister: 438         //寄存器序号
    },
    {
        name: '温度_文字',                   //名称
        indexOfRegister: 439         //寄存器序号
    },
    {
        name: '温度_图片集',                   //名称
        indexOfRegister: 440         //寄存器序号
    },
    {
        name: '温度_进度条',                   //名称
        indexOfRegister: 441         //寄存器序号
    },
    {
        name: '温度_仪表盘',                   //名称
        indexOfRegister: 442         //寄存器序号
    },
    {
        name: '动画',                   //名称
        indexOfRegister: 443         //寄存器序号
    }

];


var defaultTags4 = [
    {
        name: '传递按键编码',                     //名称
        indexOfRegister: 600         //寄存器序号
    },
    {
        name: '视频',                            //名称
        indexOfRegister: 601         //寄存器序号
    },
    {
        name: '当前页面序号',                     //名称
        indexOfRegister: 602        //寄存器序号
    },
    {
        name: '时钟变量年月日',                   //名称
        indexOfRegister: 603         //寄存器序号
    },
    {
        name: '时钟变量时分秒',                   //名称
        indexOfRegister: 604         //寄存器序号
    },
    {
        name: '蜂鸣器',                          //名称
        indexOfRegister: 605         //寄存器序号
    },
    {
        name: '背光',                            //名称
        indexOfRegister: 606         //寄存器序号
    },
    {
        name: '帧率',                            //名称
        indexOfRegister: 607         //寄存器序号
    },
    {
        name: '档位_图片集',                      //名称
        indexOfRegister: 608          //寄存器序号
    },
    {
        name: '符号片',                           //名称
        indexOfRegister: 609         //寄存器序号
    },
    {
        name: '文字报警',         //名称
        indexOfRegister: 610           //寄存器序号
    },
    {
        name: '小计里程',                   //名称
        indexOfRegister: 611         //寄存器序号
    },
    {
        name: '总里程',                   //名称
        indexOfRegister: 612         //寄存器序号
    },
    {
        name: '遮盖',                   //名称
        indexOfRegister: 613         //寄存器序号
    },
    {
        name: '车门状态',                   //名称
        indexOfRegister: 614         //寄存器序号
    },
    {
        name: '车速_文字',                   //名称
        indexOfRegister: 615         //寄存器序号
    },
    {
        name: '车速_图片集',                   //名称
        indexOfRegister: 616         //寄存器序号
    },
    {
        name: '车速_进度条',                   //名称
        indexOfRegister: 617         //寄存器序号
    },
    {
        name: '车速_仪表盘',                   //名称
        indexOfRegister: 618         //寄存器序号
    },
    {
        name: '电压_文字',                   //名称
        indexOfRegister: 619         //寄存器序号
    },
    {
        name: '电压_图片集',                   //名称
        indexOfRegister: 620         //寄存器序号
    },
    {
        name: '电压_进度条',                   //名称
        indexOfRegister: 621         //寄存器序号
    },
    {
        name: '电压_仪表盘',                   //名称
        indexOfRegister: 622         //寄存器序号
    },
    {
        name: '电流_文字',                   //名称
        indexOfRegister: 623         //寄存器序号
    },
    {
        name: '电流_图片集',                   //名称
        indexOfRegister: 624         //寄存器序号
    },
    {
        name: '电流_进度条',                   //名称
        indexOfRegister: 625         //寄存器序号
    },
    {
        name: '电流_仪表盘',                   //名称
        indexOfRegister: 626         //寄存器序号
    },
    {
        name: '剩余电量_文字',                   //名称
        indexOfRegister: 627         //寄存器序号
    },
    {
        name: '剩余电量_图片集',                   //名称
        indexOfRegister: 628         //寄存器序号
    },
    {
        name: '剩余电量_进度条',                   //名称
        indexOfRegister: 629         //寄存器序号
    },
    {
        name: '剩余电量_仪表盘',                   //名称
        indexOfRegister: 630         //寄存器序号
    },
    {
        name: '续航里程-数字',                   //名称
        indexOfRegister: 631         //寄存器序号
    },
    {
        name: '续航里程-图片集',                   //名称
        indexOfRegister: 632         //寄存器序号
    },
    {
        name: '续航里程-进度条',                   //名称
        indexOfRegister: 633         //寄存器序号
    },
    {
        name: '续航里程-仪表盘',                   //名称
        indexOfRegister: 634         //寄存器序号
    },
    {
        name: '转速_文字',                   //名称
        indexOfRegister: 635         //寄存器序号
    },
    {
        name: '转速_图片集',                   //名称
        indexOfRegister: 636         //寄存器序号
    },
    {
        name: '转速_进度条',                   //名称
        indexOfRegister: 637         //寄存器序号
    },
    {
        name: '转速_仪表盘',                   //名称
        indexOfRegister: 638         //寄存器序号
    },
    {
        name: '温度_文字',                   //名称
        indexOfRegister: 639         //寄存器序号
    },
    {
        name: '温度_图片集',                   //名称
        indexOfRegister: 640         //寄存器序号
    },
    {
        name: '温度_进度条',                   //名称
        indexOfRegister: 641         //寄存器序号
    },
    {
        name: '温度_仪表盘',                   //名称
        indexOfRegister: 642         //寄存器序号
    },
    {
        name: '动画',                   //名称
        indexOfRegister: 643         //寄存器序号
    }

];


var tagsList = [defaultTags1, defaultTags2, defaultTags3, defaultTags4];

for (var i = 0, il = tagsList.length; i < il; i++) {
    tagsList[i].forEach(function (item) {
        item.register = true;
        item.writeOrRead = 'true';
        item.value = 0;
        var name = item.name;
        if (name === "传递按键编码" || name === "视频" || name === "当前页面序号" || name === "时钟变量年月日" ||
            name === "时钟变量时分秒" || name === "蜂鸣器" || name === "背光" || name === "帧率") {
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

fs.writeFile('tags.default3.json', JSON.stringify(defaultTags3, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default4.json', JSON.stringify(defaultTags4, null, 4), function (err) {
    if (err)
        throw err;
    console.log('templates have saved!');
});