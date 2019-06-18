function Tag(name, register, indexOfRegister, writeOrRead, value, type, bindMod, valueType, lockTag) {
    this.name = name;
    this.register = register;
    this.indexOfRegister = indexOfRegister;
    this.writeOrRead = writeOrRead;
    this.value = value;
    this.type = type || 'custom'; //custom, system, timer
    this.bindMod = bindMod || 'default';
    this.valueType = valueType || 0; //0 数字 1字符串
    this.lockTag = lockTag;//锁定不可修改

    this.initValue = null; //初始值
}

var defaultTag = new Tag('', false, null, 'true', null, 'custom', 'default');
var videoTag = new Tag('视频', false, 1, 'true', 0, 'system', 'forbidden', '', true);
var curPageTag = new Tag('当前页面序号', false, 2, 'true', 0, 'system', 'forbidden', '', true);
var keyCode = new Tag('传递按键编码', false, 3, 'true', 0, 'system', 'forbidden', '', true);
var RTCTag1 = new Tag('时钟变量年月日', false, 4, 'true', 0, 'system', '', '', true);
var RTCTag2 = new Tag('时钟变量时分秒', false, 5, 'true', 0, 'system', '', '', true);
var buzzer = new Tag('蜂鸣器', false, 6, 'true', 0, 'system', '', '', true);
var backLight = new Tag('背光', false, 7, 'true', 0, 'system', '', '', true);
var fpsTag = new Tag('帧率', false, 8, 'true', 0, 'system', '', '', true);
var sysTags = [videoTag, curPageTag, keyCode, RTCTag1, RTCTag2, buzzer, backLight, fpsTag];

function mergeTagListToSysTags(tagList=[]){
    let sysTagsMap = {}
    sysTags.forEach((st)=>{
        sysTagsMap[st.name] = true
    })
    let resultList = [...sysTags]
    tagList.forEach((t)=>{
        if(!sysTagsMap[t.name]){
            resultList.push(t)
        }
    })
    return resultList

}

export {sysTags,Tag,mergeTagListToSysTags}