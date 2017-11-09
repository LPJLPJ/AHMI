/**
 * Created by lixiang on 16/3/17.
 */
ide.controller('TagCtrl', ['$scope','TagService','ProjectService','Type','$uibModal', function ($scope, TagService,ProjectService,Type,$uibModal) {
        $scope
            .$on('GlobalProjectReceived', function () {
                initProject();
            });

        function initProject() {
            $scope.selectedIdx = -1;
            $scope.component={
                selectedTag:{},
                allCustomTags:null,
                allTimerTags:null,
                visibleOfList:true,
                indexOfTagInList:null,
                timerNum:null,

                setTag:setTag,
                enterTag:enterTag,
                toggle:toggle,
                deleteTag:deleteTag,
                editTag:editTag,
                displayTagByIndex:displayTagByIndex,
                displayTimerTagByIndex:displayTimerTagByIndex,
                selectedTagFun:selectedTagFun,

                setTimerNum:setTimerNum,
                restoreTimerNum:restoreTimerNum,

                readTags:readTags
            };
            readTagsInfo();
            //判断属性type，用于在选择了多组canvas或多个控件时，不显示tag和action
            readObjType();

            $scope.component.allTags = TagService.getAllTags();

            $scope.status={
                collapsed : false
            };


            $scope.$on('AttributeChanged', function () {
                //如果目标属性或者目标对象发生变化,重新绑定tag
                reBindTag();
                //判断属性type，用于在选择了多组canvas或多个控件时，不显示tag和action
                readObjType();
            });

            $scope.collapse = function ($event) {

                $scope.status.collapsed=!$scope.status.collapsed;

            };

            $scope.openPanel = openPanel;
            $scope.addNewTag = function () {
                openPanel(-1);
            }

            reBindTag();
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

            /**
             * 利用$uiModal服务，制作模态窗口
             */
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

            /**
             * result.then接收两个匿名函数参数
             * calling $uibModalInstance.close will trigger the former function
             * when clicking at the background, pressing the esc button on keyboard, or calling $modalInstance.dismiss will trigger the latter one
             */
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
            }, function (newTag) {
                // console.log('Modal dismissed at: ' + new Date());
            });
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
        };

    /**
     * 重新绑定tag
     */
    function reBindTag(){
        var selectObject=ProjectService.getCurrentSelectObject();
        if (!selectObject.level){
            console.warn('空!');
            return;
        }
        $scope.component.selectedTag = selectObject.level.tag;
    }

        /**
         * 用于隐藏或显示tag
         */
        function readObjType() {
            var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
            if (!currentSelectedObject) {
                console.warn('空!');
                return;
            }
            //console.log(currentSelectedObject);
            switch (currentSelectedObject.type) {
                //case Type.MyButton:
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
                //case Type.MyTextArea:
                case Type.MyImage:
                case Type.MySwitch:
                //case Type.MyDateTime:
                case Type.MyRotateImg:
                case Type.MyScriptTrigger:
                case Type.MySlideBlock:
                case Type.MyVideo:
                case Type.MyAnimation:
                case Type.MyTexNum:
                    $scope.showTagPanel = true;
                    break;
                default:
                    $scope.showTagPanel = false;
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
            //console.log($scope.selected);
        }



        //点击list里的timerTag名称，将其显示在编辑面板上
        function displayTimerTagByIndex(trObj){
            document.getElementById("tagName").disabled=true;//不可修改timerTag的名字
            $scope.component.tag= _.cloneDeep(TagService.getTimerTagByIndex(trObj.$index));
            $scope.component.indexOfTagInList=trObj.$index;

            $scope.selected=trObj.$id;

            //console.log()
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

        /**
         *更新所选控件的tag
         */
        function selectedTagFun(){
            ProjectService.ChangeAttributeTag($scope.component.selectedTag,function(oldOperate){
                $scope.$emit('ChangeCurrentPage',oldOperate);
            });
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

    }]);

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
        // if (!checkEmpty()){
        //     $uibModalInstance.close($scope.tag);
        // }
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
    }


    function checkEmpty(){
        if (!tag.name || tag.name == ''){
            //empty
            alert("请输入Tag名称");
            return true;
        }
        return false;
    }

}]);
