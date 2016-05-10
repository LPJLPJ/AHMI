/**
 * Created by lixiang on 16/3/17.
 */
ideServices
    .service('TagService', function () {
        var tags=[];
        var defaultTag ={
            name: "",
            register: false,
            indexOfRegister: -1,
            writeOrRead:'false',
            value: null
        };
        var timerTags=[];
        //var templateTimerTags= [{ name:"", register: false, indexOfRegister: null, writeOrRead:false, value: 0}];

        //新增一个tag
        this.getNewTag = function(){
            return _.cloneDeep(defaultTag);
        }
        this.setUniqueTags= function (tag,noDuplication,cb) {

            if(noDuplication(tag,tags)){

                tags.push(tag);
                cb && cb();

            }

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
            var newTag=[];
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

                timerTags[0+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[0+(i*6)].name="SysTmr_"+i+"_Start";

                timerTags[1+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[1+(i*6)].name="SysTmr_"+i+"_Stop";

                timerTags[2+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[2+(i*6)].name="SysTmr_"+i+"_Step";

                timerTags[3+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[3+(i*6)].name="SysTmr_"+i+"_Interval";

                timerTags[4+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[4+(i*6)].name="SysTmr_"+i+"_CurVal";

                timerTags[5+(i*6)]={ name: "", register: false, indexOfRegister: null, writeOrRead:false, value: 0};
                timerTags[5+(i*6)].name="SysTmr_"+i+"_Mode";

            }
        }

    });
