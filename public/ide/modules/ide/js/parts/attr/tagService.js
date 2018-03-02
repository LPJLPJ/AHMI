/**
 * Created by lixiang on 16/3/17.
 */
ideServices
    .service('TagService', [function () {


        function Tag(name, register, indexOfRegister, writeOrRead, value, type,bindMod) {
            this.name = name;
            this.register = register;
            this.indexOfRegister = indexOfRegister;
            this.writeOrRead = writeOrRead;
            this.value = value;
            this.type = type || 'custom'; //custom, system, timer
            this.bindMod = bindMod||'default';
        }

        //var defaultTag ={
        //    name: "",
        //    register: false,
        //    indexOfRegister: null,
        //    //writeOrRead:'false',
        //    value: null
        //};
        var defaultTag = new Tag('',false,null,'true',null,'custom','default');
        var keyCode = new Tag('传递按键编码',false,null,'true',0,'system','forbidden');
        var videoTag = new Tag('视频',false,null,'true',0,'system','forbidden');
        var curPageTag = new Tag('当前页面序号', false, null, 'true', 0, 'system','forbidden');
        var RTCTag1 = new Tag('时钟变量年月日', false, null, 'true', 0,'system');
        var RTCTag2 = new Tag('时钟变量时分秒', false, null, 'true', 0,'system');
        var backLight = new Tag('背光',false,null,'true',0,'system');
        var buzzer =new Tag('蜂鸣器',false,null,'true',0,'system');
        var sysTags = [keyCode,videoTag,curPageTag,RTCTag1,RTCTag2,backLight,buzzer];
        var tags = sysTags; 
        var timerTags=[];
        var timerNum=0;
        //var templateTimerTags= [{ name:"", register: false, indexOfRegister: null, writeOrRead:false, value: 0}];


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
        this.getNewTag = function(){
            return _.cloneDeep(defaultTag);
        };
        this.setUniqueTags= function (tag,noDuplication,cb) {
            if((tags.length+timerTags.length)>255){
                toastr.warning('超出tag数量限制');
                return;
            }

            if(noDuplication(tag,tags)){

                tags.push(tag);
                cb && cb();

            }

        };

        this.syncAllTags = function (_tagList) {
            var _tags = [];
            var _timerTags = [];
            if (_tagList){
                for (var i = 0; i<_tagList.length;i++){
                    if (_tagList[i].name.indexOf('Sys')==0){
                        //timertag
                        _timerTags.push(_tagList[i])
                    }else{
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
            timerTags = _timerTags||[]
        };

        //返回所有的自定义tags
        this.getAllCustomTags=function(){
            return tags;
        };


        //返回所有的timerTags
        this.getAllTimerTags=function(){
            return timerTags;
        };


        //返回所有的tags，包括自定义tags和timerTags
        this.getAllTags=function(){
            return tags.concat(timerTags);
        };

        this.getAllTagsName=function(){
            var temptags=tags.concat(timerTags);
            var names=[];
            for(var i=0;i<temptags.length;i++){
                names.push(temptags[i].name);
            }
            console.log(names);
            return names;
        }

        //通过index返回一个指定的tags
        this.getTagByIndex=function(index){
            return tags[index];
        };

        //通过index返回一个指定的timerTags
        this.getTimerTagByIndex= function (index) {
            return timerTags[index];
        }

        //通过index删除一个tag
        this.deleteTagByIndex=function(index,cb){
            if((index>=0)&&(index<=tags.length-1)){
                tags.splice(index,1);
                cb && cb();
            }
        };

        //点击edit按钮调用此方法，将编辑后的tag放入tags数组
        this.editTagByIndex=function(index,tag,cb){
            if(tags.length==0){
                return;
            }
            var newTag= _.clone(tag);
            //_.assignIn(newTag,tag);
            tags.splice(index,1,newTag);
            cb && cb();
        };

        //点击edit按钮调用此方法，将编辑后的tag放入TimerTags
        this.editTimerTagByIndex= function (index,tag,cb) {
            if(timerTags.length==0){
                return;
            }
            var newTag={};
            _.assignIn(newTag,tag);
            timerTags.splice(index,1,newTag);
            cb && cb();
        }

        //设置Timer的tags
        this.setTimerTags=function(num){
            console.log("success to setTimerTags");
            timerTags.length=0;//先清空timerTags
            console.log(timerTags);
            for(var i=0;i<num;i++){
                timerTags[i]={ name: "", register: false, indexOfRegister: null, value: 0};
                timerTags[i].name="SysTmr_"+i+"_t";
            }
        };

        this.setTimerNum=function(num){
            timerNum=num;
        };
        this.getTimerNum=function(){
            return timerNum;
        };

        var sortNameOrder = true;
        var sortRegisterOrder = true;
        this.sortByName = function(cb){
            var sort = function (a,b) {
                    var nameA = a.name,
                        nameB = b.name;
                    return  sortNameOrder?nameA.localeCompare(nameB,"zh"):nameB.localeCompare(nameA,"zh");
                };
            sortNameOrder = !sortNameOrder;
            tags.sort(sort);
            cb&&cb()
        };

        this.sortByRegister = function(cb){
            var sort = function (a,b) {
                var A = a.indexOfRegister||-1,
                    B = b.indexOfRegister||-1;
                return  sortRegisterOrder?A-B:B-A;
            };
            sortRegisterOrder = !sortRegisterOrder;
            tags.sort(sort);
            cb&&cb()
        }

    }]);
