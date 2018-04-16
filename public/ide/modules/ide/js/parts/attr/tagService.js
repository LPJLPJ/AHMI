/**
 * Created by lixiang on 16/3/17.
 */
ideServices.service('TagService', [function () {

    function Tag(name, register, indexOfRegister, writeOrRead, value, type, bindMod) {
        this.name = name;
        this.register = register;
        this.indexOfRegister = indexOfRegister;
        this.writeOrRead = writeOrRead;
        this.value = value;
        this.type = type || 'custom'; //custom, system, timer
        this.bindMod = bindMod || 'default';
    }

    var defaultTag = new Tag('', false, null, 'true', null, 'custom', 'default');
    var keyCode = new Tag('传递按键编码', false, null, 'true', 0, 'system', 'forbidden');
    var videoTag = new Tag('视频', false, null, 'true', 0, 'system', 'forbidden');
    var curPageTag = new Tag('当前页面序号', false, null, 'true', 0, 'system', 'forbidden');
    var RTCTag1 = new Tag('时钟变量年月日', false, null, 'true', 0, 'system');
    var RTCTag2 = new Tag('时钟变量时分秒', false, null, 'true', 0, 'system');
    var backLight = new Tag('背光', false, null, 'true', 0, 'system');
    var buzzer = new Tag('蜂鸣器', false, null, 'true', 0, 'system');
    var fpsTag = new Tag('帧率',false,null,'true',0,'system');
    var sysTags = [keyCode, videoTag, curPageTag, RTCTag1, RTCTag2, backLight, buzzer,fpsTag];
    var tags = sysTags;
    var timerTags = [];
    var timerNum = 0;

    var sortNameOrder = true;
    var sortRegisterOrder = true;


    function addSysTags(tagList) {
        var sysTagFlags = sysTags.map(function (tag) {
            return false;
        });

        for (var j = 0; j < sysTags.length; j++) {
            for (var i = 0; i < tagList.length; i++) {
                if (tagList[i].name === sysTags[j].name) {
                    //has
                    sysTagFlags[j] = true;
                    break;
                }
            }
        }

        for (j = 0; j < sysTagFlags.length; j++) {
            if (!sysTagFlags[j]) {
                tagList.push(sysTags[j]);
            }
        }

    }

    //新增一个tag
    this.getNewTag = function () {
        return _.cloneDeep(defaultTag);
    };

    this.setUniqueTags = function (tag, noDuplication, cb) {
        if ((tags.length + timerTags.length) > 255) {
            toastr.warning('超出tag数量限制');
            return;
        }

        if (noDuplication(tag, tags)) {

            tags.push(tag);
            cb && cb();

        }

    };

    this.syncAllTags = function (_tagList) {
        var _tags = [];
        var _timerTags = [];
        if (_tagList) {
            for (var i = 0; i < _tagList.length; i++) {
                if (_tagList[i].name.indexOf('Sys') == 0) {
                    //timertag
                    _timerTags.push(_tagList[i])
                } else {
                    _tags.push(_tagList[i])
                }
            }
        }
        addSysTags(_tags);
        tags = _tags;
        timerTags = _timerTags

    };

    this.syncCustomTags = function (_customTags) {
        addSysTags(_customTags || []);
        tags = _customTags
    };

    this.syncTimerTags = function (_timerTags) {
        timerTags = _timerTags || []
    };

    //返回所有的自定义tags
    this.getAllCustomTags = function () {
        return tags;
    };

    //返回所有的timerTags
    this.getAllTimerTags = function () {
        return timerTags;
    };

    //返回所有的tags，包括自定义tags和timerTags
    this.getAllTags = function () {
        return tags.concat(timerTags);
    };

    this.getAllTagsName = function () {
        var temptags = tags.concat(timerTags);
        var names = [];
        for (var i = 0; i < temptags.length; i++) {
            names.push(temptags[i].name);
        }
        return names;
    };

    //通过index返回一个指定的tags
    this.getTagByIndex = function (index) {
        return tags[index];
    };

    //通过index返回一个指定的timerTags
    this.getTimerTagByIndex = function (index) {
        return timerTags[index];
    };

    //通过index删除一个tag
    this.deleteTagByIndex = function (index, cb) {
        if ((index >= 0) && (index <= tags.length - 1)) {
            tags.splice(index, 1);
            cb && cb();
        }
    };
    //通过name删除一个tag
    this.deleteTagByName = function (name, cb) {
        for(var i=0;i<tags.length;i++){
            if(tags[i].name==name){
                tags.splice(i, 1);
                cb && cb();
            }
        }
    };

    //点击edit按钮调用此方法，将编辑后的tag放入tags数组
    this.editTagByIndex = function (index, tag, cb) {
        if (tags.length == 0) {
            return;
        }
        var newTag = _.clone(tag);
        tags.splice(index, 1, newTag);
        cb && cb();
    };

    //点击edit按钮调用此方法，将编辑后的tag放入TimerTags
    this.editTimerTagByIndex = function (index, tag, cb) {
        if (timerTags.length == 0) {
            return;
        }
        var newTag = {};
        _.assignIn(newTag, tag);
        timerTags.splice(index, 1, newTag);
        cb && cb();
    };

    //设置Timer的tags
    this.setTimerTags = function (num) {
        timerTags.length = 0;//先清空timerTags
        for (var i = 0; i < num; i++) {
            timerTags[i] = {name: "", register: false, indexOfRegister: null, value: 0};
            timerTags[i].name = "SysTmr_" + i + "_t";
        }
    };

    //设置timer的数量
    this.setTimerNum = function (num) {
        timerNum = num;
    };

    //获取timer的数量
    this.getTimerNum = function () {
        return timerNum;
    };

    //将tag按名称排序
    this.sortByName = function (cb) {
        var sort = function (a, b) {
            var nameA = a.name,
                nameB = b.name;
            return sortNameOrder ? nameA.localeCompare(nameB, "zh") : nameB.localeCompare(nameA, "zh");
        };
        sortNameOrder = !sortNameOrder;
        tags.sort(sort);
        cb && cb()
    };

    //将tag按寄存器号排序
    this.sortByRegister = function (cb) {
        var sort = function (a, b) {
            var A = a.indexOfRegister || -1,
                B = b.indexOfRegister || -1;
            return sortRegisterOrder ? A - B : B - A;
        };
        sortRegisterOrder = !sortRegisterOrder;
        tags.sort(sort);
        cb && cb()
    };

    //设置tags，用于设置从服务器获取来的预设tags
    this.setTagsFromRemote = function (_tags, cb) {
        Object.assign(tags, _tags);
        cb && cb()
    };


    //*********tagClass*********//edit by LH in 2018/3/20
    function TagClass(name,type,tagArray){
        this.name=name;
        this.type=type || 'custom'; //custom, system, timer
        this.tagArray=tagArray||[];
    }

    var allTags=new TagClass('全部','system',tags);
    var timeTags=new TagClass('定时器','timer',timerTags);
    var defaultTagClass = new TagClass('default','custom',[]);
    var tagClasses=[allTags,timeTags];

    //新增一个tagClass
    this.getNewTagClass = function () {
        return _.cloneDeep(defaultTagClass);
    };

    //tagClass不允许重名，数量不允许超过30
    this.addToTagClasses = function (tagClass) {
        var tagClassesLength=tagClasses.length;
        if ((tagClassesLength) >= 30) {
            toastr.warning('超出标签数量限制');
            return false;
        }
        for(var i=0;i<tagClassesLength;i++){
            if(tagClass.name===tagClasses[i].name){
                toastr.warning('重复的标签名');
                return false;
            }
        }
        tagClasses.push(tagClass);
        return true;
    };

    //同步用户的标签列表
    this.syncTagClasses = function (_customTagClasses) {
        tagClasses = addDefaultTagClasses(_customTagClasses || []);
    };

    //给用户的标签列表添加默认标签
    function addDefaultTagClasses(tagClassesList) {
        var allTags=new TagClass('全部','system',tags);
        var timeTags=new TagClass('定时器','timer',timerTags);
        var defaultTagClasses = [allTags,timeTags];
        var sysTagClassFlags = defaultTagClasses.map(function () {
            return false;
        });
        for (var j = 0; j < sysTagClassFlags.length; j++) {
            for (var i = 0; i < tagClassesList.length; i++) {
                if (tagClassesList[i].name === defaultTagClasses[j].name) {
                    //has
                    sysTagClassFlags[j] = true;
                    break;
                }
            }
        }

        for (j = 0; j < sysTagClassFlags.length; j++) {
            if (!sysTagClassFlags[j]) {
                tagClassesList.push(defaultTagClasses[j]);
            }
        }
        return tagClassesList;

    }

    //返回所有标签
    this.getAllTagClasses = function () {
        addDefaultTagClasses(tagClasses);
        return tagClasses;
    };

    //通过index返回一个指定的tagClass
    this.getTagClassByIndex = function (index) {
        return tagClasses[index];
    };

    //通过index删除一个tagClass
    this.deleteTagClassByIndex = function (index, cb) {
        if ((index >= 0) && (index <= tagClasses.length - 1)) {
            tagClasses.splice(index, 1);
            cb && cb();
        }
    };

    //将编辑后的tag放入tags数组
    this.editTagClassByIndex = function (index, tagClass, cb) {
        if (tagClasses.length <= 2) {
            return;
        }
        var newTagClass = _.clone(tagClass);
        tags.splice(index, 1, newTagClass);
        cb && cb();
    };


}]);
