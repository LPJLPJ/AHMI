/**
 * Created by lixiang on 16/3/17.
 */
ide.controller('TagCtrl', ['$scope','TagService','ProjectService','Type','$uibModal', function ($scope, TagService,ProjectService,Type,$uibModal) {
    $scope.selectedIdx = -1;
    $scope.component={
        allCustomTags:null,
        allTimerTags:null,
        visibleOfList:true,
        indexOfTagInList:null,
        timerNum:null,

        addNewTag:addNewTag,
        openPanel:openPanel,
        setTag:setTag,
        enterTag:enterTag,
        toggle:toggle,
        deleteTag:deleteTag,
        editTag:editTag,
        displayTagByIndex:displayTagByIndex,
        displayTimerTagByIndex:displayTimerTagByIndex,
        setTimerNum:setTimerNum,
        restoreTimerNum:restoreTimerNum,
        readTags:readTags,
        sortByName:sortByName,
        sortByRegister:sortByRegister
    };


    $scope.$on('GlobalProjectReceived', function () {
        initProject();
    });

    $scope.$on('ChangeAllTags',function(data){
        console.log('receive ChangeAllTags',data);
    });

    $scope.$on("MaskView",function(event,data){
        $scope.myMask=data;
    });

    function initProject() {
        readTagsInfo();
    }

    function addNewTag(){
        openPanel(-1);
    }

    function openPanel (index,_type) {
        var type;
        if (_type && _type=='timer'){
            type = _type;
        }else{
            type = 'custom';
        }
        $scope.selectedIdx = index;
        $scope.selectedType = type;

        var targetTag ;
        if (index == -1){
            //newAction
            targetTag = TagService.getNewTag();

        }else {
            if (type == 'timer'){
                //timer tag
                targetTag =_.cloneDeep($scope.component.allTimerTags[index]);
            }else{
                //custom tag
                targetTag =_.cloneDeep($scope.component.allCustomTags[index]);
            }
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'tagModal.html',
            controller: 'TagInstanceCtrl',
            size: 'sm',
            resolve: {
                tag: function () {
                    return targetTag;
                },
                type:function(){
                    return type;
                },
                index:function(){
                    return $scope.selectedIdx;
                }
            }
        });

        modalInstance.result.then(function (newTag) {
            //process save
            if ($scope.selectedIdx == -1){
                //new tag
                TagService.setUniqueTags(newTag,noDuplication,function(){
                    readTagsInfo();
                }.bind(this));
            }else if ($scope.selectedType == 'custom'){
                //edit custom tag
                TagService.editTagByIndex($scope.selectedIdx,newTag, function () {
                    readTagsInfo();
                }.bind(this));

            }else  if($scope.selectedType == 'timer'){
                //edit timer tag
                TagService.editTimerTagByIndex($scope.selectedIdx,newTag, function () {
                    readTagsInfo();
                }.bind(this));
            }
        }, function (newTag) {});
    }

    function readTagsInfo(){
        $scope.component.allCustomTags = TagService.getAllCustomTags();
        $scope.component.allTimerTags = TagService.getAllTimerTags();
        $scope.component.allTags = TagService.getAllTags();
        $scope.component.timerNum = TagService.getTimerNum();
    }

    function noDuplication(tag,tags){
        for(var i=0;i<tags.length;i++){
            if(tag.name==tags[i].name) {
                toastr.error('重复的tag名称');
                return false;
            }
        }
        return true;
    }

    function enterTag(ev){
        ev.preventDefault();
        ev.stopPropagation();

        if(ev.keyCode==13){
            setTag();
        }else{
            $scope.component.tag.name += String.fromCharCode(ev.charCode);
        }

    }

    //点击页面上的＋号，新增一个自定义tag
    function setTag() {
        //重置selected，使list里因选择而变灰的tag恢复原样
        $scope.selected=null;

        if(document.getElementById("tagName").disabled){
            //将输入框变为可修改，并重置页面tag
            document.getElementById("tagName").disabled=false;
            $scope.component.tag={
                name: "",
                register: false,
                indexOfRegister: null,
                writeOrRead:false,
                value: null
            };
        }else{
            //确保输入了tag名称，若未输入，跳出提示框
            if($scope.component.tag.name==""){
                alert("Please enter tag's name");
                return;
            }

            //将页面上的tag深拷贝至一个临时的newTag
            var newTag= _.cloneDeep($scope.component.tag);
            //_.assignIn(newTag,$scope.component.tag);

            //如果未选择register，则将indexOfRegister,writeOrRead,value这三个属性，置为null
            if(newTag.register==false){
                newTag.indexOfRegister=null;
                newTag.writeOrRead="false";
                newTag.value=null;
                //console.log("未设置register，三个属性置空");
            }

            TagService.setUniqueTags(newTag,function (tag,tags){
                for(var i=0;i<tags.length;i++){
                    if(newTag.name==tags[i].name) {
                        console.log('equal');
                        return false;
                    }
                }
                return true;
            });

            //添加后tag框变为初始状态
            $scope.component.tag={
                name: "",
                register: false,
                indexOfRegister: null,
                writeOrRead:false,
                value: null
            };

        }
    }

    //list按钮事件，确定list列表是否可见
    function toggle(){
        $scope.component.visibleOfList=!$scope.component.visibleOfList;
    }

    //点击按钮删除自定义tag
    function deleteTag(index){
        var requiredTagNames=ProjectService.getRequiredTagNames();
        for (var i=0;i<requiredTagNames.length;i++){
            if ($scope.component.allCustomTags[index].name==requiredTagNames[i]){
                toastr.warning('该tag已经被使用');
                return;
            }
        }
        switch ($scope.component.allCustomTags[index].type){
            case "system":
                toastr.warning('系统变量不可删除');
                return;
            default: break;
        }

        TagService.deleteTagByIndex(index,function(){
            readTagsInfo();
        }.bind(this));
    }

    //点击list里的自定义tag名称，将其先显示编辑面板上。
    function displayTagByIndex(trObj){
        document.getElementById('tagName').disabled=false;
        $scope.component.tag= _.cloneDeep(TagService.getTagByIndex(trObj.$index));
        $scope.component.indexOfTagInList=trObj.$index;
        $scope.selected=trObj.$id;
    }

    //点击list里的timerTag名称，将其显示在编辑面板上
    function displayTimerTagByIndex(trObj){
        document.getElementById("tagName").disabled=true;//不可修改timerTag的名字
        $scope.component.tag= _.cloneDeep(TagService.getTimerTagByIndex(trObj.$index));
        $scope.component.indexOfTagInList=trObj.$index;
        $scope.selected=trObj.$id;
    }

    //点击页面上的edit按钮对应事件，根据tag中的名字不同，将编辑后的tag属性写入自定义tag或timerTags
    function editTag(){
        console.log("edit success");
        if(!(TagService.getAllCustomTags().length||TagService.getAllTimerTags().length)||($scope.component.tag.name=="")){
            alert('Not selected tag!');
            return;
        }

        if($scope.component.tag.register==false){
            $scope.component.tag.indexOfRegister=null;
            $scope.component.tag.writeOrRead=false;
            $scope.component.tag.value=null;
        }

        var nameString=$scope.component.tag.name;
        if(nameString.match("SysTmr_")){
            TagService.editTimerTagByIndex($scope.component.indexOfTagInList,$scope.component.tag);
        }
        else{
            TagService.editTagByIndex($scope.component.indexOfTagInList,$scope.component.tag);
        }
    }

    function readTags(){
        readTagsInfo();
    }

    function setTimerNum(ev){
        if(ev.keyCode!==13){
            return;
        }
        var initNum = TagService.getTimerNum();
        if (!_.isInteger(parseInt($scope.component.timerNum))){
            toastr.warning('输入不合法');
            $scope.component.timerNum=initNum;
            return;
        }
        if($scope.component.timerNum>10||$scope.component.timerNum<0){

            toastr.warning('超出范围');
            $scope.component.timerNum=initNum;
            return;
        }
        TagService.setTimerNum($scope.component.timerNum);
        TagService.setTimerTags($scope.component.timerNum);
    }

    function restoreTimerNum(){
        $scope.component.timerNum=TagService.getTimerNum();
    }

    //tag按名称排序
    function sortByName(e){
        TagService.sortByName(function(){
            readTagsInfo();
        })
    }

    //tag按寄存器号排序
    function sortByRegister(){
        TagService.sortByRegister(function(){
            readTagsInfo();
        })
    }

}]);

/**
 * tag模态框控制器
 */
ide.controller('TagInstanceCtrl',['$scope','$uibModalInstance','TagService','ProjectService','tag','type','index',function ($scope, $uibModalInstance,TagService,ProjectService,tag,type,index) {

    $scope.tag = tag;
    $scope.type = type;

    //保存
    $scope.save = function (th) {
        //如果是定时器，就不验证，直接关闭
        if(th.type==="timer"){
            $uibModalInstance.close($scope.tag);
            return;
        }
        if(index!==-1){
            //edit tag
            var oldTag = TagService.getTagByIndex(index);
            if(oldTag.name!==$scope.tag.name){
                var requiredTagNames=ProjectService.getRequiredTagNames();
                for (var i=0;i<requiredTagNames.length;i++){
                    if (oldTag.name===requiredTagNames[i]){
                        toastr.warning('该tag已经被使用,修改名称请先解除绑定');
                        return;
                    }
                }
                var allTags=_.cloneDeep(TagService.getAllTags());
                for(var j=0;j<allTags.length;j++){
                    if($scope.tag.name===allTags[j].name){
                        if(index!=j){
                            toastr.error('重复的tag名称');
                            return;
                        }
                    }
                }
            }
        }
        if (ProjectService.inputValidate($scope.tag.name)){
            if($scope.tag.name.match(/^SysTmr_[0-9]+_t$/)){
                toastr.error('SysTmr_数字_t 为定时器保留名称');
                return;
            }
            $uibModalInstance.close($scope.tag);
        }
    };

    //取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //检查tag编号
    $scope.checkTagIndex = function(){
        if($scope.tag.indexOfRegister>65535||$scope.tag.indexOfRegister<0){
            toastr.warning('序号超出范围');
            $scope.tag.indexOfRegister=0;
        }
        if(!_.isInteger($scope.tag.indexOfRegister)){
            toastr.error('序号只能是整数');
            $scope.tag.indexOfRegister=0;
        }
    };

    function checkEmpty(){
        if (!tag.name || tag.name == ''){
            //empty
            alert("请输入Tag名称");
            return true;
        }
        return false;
    }

}]);

/**
 * Created by lixiang on 17/3/5.
 * tag选择框控制器，在属性栏里用于给对象绑定tag
 */
ide.controller('TagSelectCtl', ['$scope', 'TagService', 'ProjectService', 'Type', function ($scope, TagService, ProjectService, Type) {
    $scope.component = {
        showTagPanel: false,
        selectedTag: null,
        allCustomTags: null,
        allTimerTags: null,
        selectedTagFun: selectedTagFun,
    };

    $scope.$on('GlobalProjectReceived', function () {
        _initController();
    });

    $scope.$on('AttributeChanged', function () {
        _readTagsInfo();
        _reBindTag();
        _readObjType();
    });


    //初始化控制器
    function _initController() {
        _reBindTag();
        _readObjType();
    }

    //获取所有自定义tag和定时器tag
    function _readTagsInfo() {
        $scope.component.allCustomTags = TagService.getAllCustomTags();
        $scope.component.allTimerTags = TagService.getAllTimerTags();
    }

    //重新绑定tag
    function _reBindTag() {
        var selectObject = ProjectService.getCurrentSelectObject();
        if (!selectObject.level) {
            console.warn('空!');
            return;
        }
        $scope.component.selectedTag = selectObject.level.tag;
    }

    //重新读取选中对象信息，用于控制是否在属性栏显示tag选择框
    function _readObjType() {
        var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
        if (!currentSelectedObject) {
            console.warn('空!');
            return;
        }
        switch (currentSelectedObject.type) {
            case Type.MyNumber:
            case Type.MySlide:
            case Type.MyProgress:
            case Type.MyDashboard:
            case Type.MyButtonGroup:
            case Type.MyLayer:
            case Type.MyPage:
            case Type.MyNum:
            case Type.MyKnob:
            case Type.MyOscilloscope:
            case Type.MyImage:
            case Type.MySwitch:
            case Type.MyRotateImg:
            case Type.MyScriptTrigger:
            case Type.MySlideBlock:
            case Type.MyVideo:
            case Type.MyAnimation:
            case Type.MyTexNum:
                $scope.component.showTagPanel = true;
                break;
            default:
                $scope.component.showTagPanel = false;
        }
    }

    //选择tag，并将其绑定到当前对象上
    function selectedTagFun() {
        ProjectService.ChangeAttributeTag($scope.component.selectedTag, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage', oldOperate);
        });
    }
}]);
