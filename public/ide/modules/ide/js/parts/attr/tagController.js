/**
 * Created by lixiang on 16/3/17.
 */
ide.controller('TagCtrl', ['$scope', 'TagService', 'ProjectService', 'Type', '$uibModal', function ($scope, TagService, ProjectService, Type, $uibModal) {
    $scope.selectedIdx = -1;
    $scope.component = {
        allCustomTags: null,
        allTimerTags: null,
        visibleOfList: true,
        indexOfTagInList: null,
        timerNum: null,

        tagClasses: null,
        curTagClass: null,
        curTagClassName: null,
        timerTagShow: false,

        addNewTag: addNewTag,
        openPanel: openPanel,
        setTag: setTag,
        enterTag: enterTag,
        toggle: toggle,
        deleteTag: deleteTag,
        editTag: editTag,
        displayTagByIndex: displayTagByIndex,
        displayTimerTagByIndex: displayTimerTagByIndex,
        setTimerNum: setTimerNum,
        addTimerNum: addTimerNum,
        minusTimerNum: minusTimerNum,
        restoreTimerNum: restoreTimerNum,
        readTags: readTags,
        sortByName: sortByName,
        sortByRegister: sortByRegister,

        editTagClass: editTagClass,
        changeCurTagClass: changeCurTagClass,
        addToTagClass: addToTagClass,
        regCheckboxClick:regCheckboxClick,

        importTags: importTags
    };

    $scope.$on('GlobalProjectReceived', function () {
        initProject();
    });

    //导入tags事件
    $scope.$on('syncTagSuccess', function (data) {
        readTagsInfo();
    });

    function initProject() {
        readTagsInfo();
        readTagClassesInfo();
    }

    function addNewTag() {
        openPanel(-1);
    }

    function openPanel(index, _type) {
        var type;
        if (_type && _type == 'timer') {
            type = _type;
        } else {
            type = 'custom';
        }
        if(type !=='timer'){
            if(index!=-1){
                var tagName=$scope.component.curTagClass.tagArray[index].name;
                $scope.selectedIdx = IndexInTagClass(tagName,$scope.component.tagClasses[0]);
                index=$scope.selectedIdx;
            }else{
                $scope.selectedIdx =index;
            }
        }
        $scope.selectedIdx =index;
        $scope.selectedType = type;

        var targetTag;
        if (index == -1) {
            //newAction
            targetTag = TagService.getNewTag();

        } else {
            if (type == 'timer') {
                //timer tag
                targetTag = _.cloneDeep($scope.component.allTimerTags[index]);
            } else {
                //custom tag
                targetTag = _.cloneDeep($scope.component.allCustomTags[index]);
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
                type: function () {
                    return type;
                },
                index: function () {
                    return $scope.selectedIdx;
                }
            }
        });

        modalInstance.result.then(function (newTag) {
            //process save
            if ($scope.selectedIdx == -1) {
                //new tag
                TagService.setUniqueTags(newTag, noDuplication, function () {
                    readTagsInfo();
                    //如果添加了一个新的tag，同事将其添加到当前标签里
                    addTagToTagClass(newTag, $scope.component.curTagClass.name);
                }.bind(this));
            } else if ($scope.selectedType == 'custom') {
                //edit custom tag
                TagService.editTagByIndex($scope.selectedIdx, newTag, function () {
                    readTagsInfo();
                }.bind(this));
                editTagInTagClass(tagName,newTag,$scope.component.curTagClass);

            } else if ($scope.selectedType == 'timer') {
                //edit timer tag
                TagService.editTimerTagByIndex($scope.selectedIdx, newTag, function () {
                    readTagsInfo();
                }.bind(this));
            }
        }, function (newTag) {
        });
    }

    //加入的标签模态框
    function openPanelAddToTagClass(name) {
        //由于tag名不能重名，可以用来做统一标识，根据tag名找到在allCustomTags中对应的index
        for (var j = 0; j < $scope.component.allCustomTags.length; j++) {
            if ($scope.component.allCustomTags[j].name === name) {
                $scope.selectedIdx = j;
            }
        }

        var tempTagClasses = _.cloneDeep($scope.component.tagClasses);
        //两个默认标签不需要显示
        var defaultTagClassesLength = 2;
        tempTagClasses.splice(0, defaultTagClassesLength);
        //已经含有当前tag的标签不需要显示
        var tempTags;
        for (var k = 0; k < tempTagClasses.length; k++) {
            tempTags = tempTagClasses[k].tagArray;
            for (var m = 0; m < tempTags.length; m++) {
                if (name === tempTags[m].name) {
                    tempTagClasses.splice(k, 1);
                    k--;
                    break;
                }
            }
        }
        var tagClassNames = tempTagClasses.map(
            function (tagClass) {
                return tagClass.name;
            });

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addToTagClassModal.html',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.tagClassNames = tagClassNames;
                //确定
                $scope.save = function (th) {
                    if ($scope.curIndex === undefined) {
                        toastr.warning('未选中任何标签');
                    } else {
                        //传回选中的标签
                        $uibModalInstance.close($scope.tagClassNames[$scope.curIndex]);
                    }
                    return;
                };
                //取消
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                //选中标签
                $scope.indexSelected = function (index) {
                    $scope.curIndex = index;
                };
            }],
            size: 'sm',
            resolve: {
                tagClassNames: function () {
                    return tagClassNames;
                }
            }
        });

        modalInstance.result.then(function (tagClassName) {
            //将当前tag加入到选中的标签中
            addTagToTagClass($scope.component.allCustomTags[$scope.selectedIdx], tagClassName);
        }, function (tagClassName) {
        });
    }

    //将tag加入到以tagClassName标识的标签中
    function addTagToTagClass(tag, tagClassName) {
        for (var i = 0; i < $scope.component.tagClasses.length; i++) {
            //找到name为tagClassName的标签
            if (tagClassName === $scope.component.tagClasses[i].name) {
                //查重
                for (var j = 0; j < $scope.component.tagClasses[i].tagArray.length; j++) {
                    if ($scope.component.tagClasses[i].tagArray[j].name === tag.name) {
                        return;
                    }
                }
                //将tag加入到该标签中
                $scope.component.tagClasses[i].tagArray.push(tag);
                return;
            }
        }
    }

    //标签管理模态框
    function openPanelEditTagClasses() {

        var tagClassesManage = $scope.component.tagClasses.map(
            // name:tagClass.name 标签名
            // renamed:false      是否被改过名
            // renaming:false     是否处在改名中状态
            // delete:false       是否已经被删除
            function (tagClass) {
                return {
                    name: tagClass.name,
                    renamed: false,
                    renaming: false,
                    deleted: false,
                };
            });
        var defaultTagClassesLength = 2;
        //2个默认标签不能被改名或者删除
        var defaultTagClasses = tagClassesManage.splice(0, defaultTagClassesLength);

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'editTagClasses.html',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.tagClassesManage = tagClassesManage;   //自定义标签
                $scope.defaultTagClasses = defaultTagClasses; //默认标签
                $scope.$scopeCtl = $scope;
                $scope.$scopeCtl.curTagClassNewName = null;   //改名后的新名字在有效性验证前存放在这里
                $scope.someTagClassRenaming = false;          //标志位，如果有标签正在改名，会限制其他标签的操作
                $scope.addTagClass = false;                   //标志位，如果正在添加新标签，会显示新标签命名框
                //添加新标签
                $scope.addTagClass = function () {
                    $scope.addTagClassFlag = true;
                    $scope.someTagClassRenaming = true;
                    $scope.$scopeCtl.curTagClassNewName = null;
                    return;
                };
                //打开/关闭重命名输入框
                $scope.inputName = function (index) {
                    if (index !== undefined && index !== null) {
                        var curTagClass = $scope.tagClassesManage[index];
                        curTagClass.renaming = !curTagClass.renaming;
                        $scope.$scopeCtl.curTagClassNewName = curTagClass.name;
                    } else {
                        $scope.addTagClassFlag = false;
                    }
                    $scope.someTagClassRenaming = !$scope.someTagClassRenaming;

                };
                //命名
                $scope.enterName = function (index) {
                    if (isNameStandard($scope.$scopeCtl.curTagClassNewName) == true) {
                        if (index) {
                            var curTagClass = $scope.tagClassesManage[index];
                            curTagClass.name = $scope.$scopeCtl.curTagClassNewName;
                            curTagClass.renamed = true;
                            curTagClass.renaming = false;

                        } else {
                            var newTagClass = {
                                name: $scope.$scopeCtl.curTagClassNewName,
                                renamed: false,
                                renaming: false,
                                deleted: false,
                            };
                            $scope.tagClassesManage.push(newTagClass);
                            $scope.addTagClassFlag = false;
                        }

                        $scope.someTagClassRenaming = false;
                    }
                    return;
                };
                //删除
                $scope.delete = function (index) {

                };
                //关闭
                $scope.close = function () {
                    $uibModalInstance.close($scope.tagClassesManage);
                };

                //命名验证
                function isNameStandard(name) {
                    if (name == null) {
                        toastr.error('名称不能为空');
                        return false;
                    }
                    for (var i = 0; i < $scope.tagClassesManage.length; i++) {
                        if (name == $scope.tagClassesManage[i].name) {
                            if ($scope.tagClassesManage[i].deleted === false) {
                                toastr.error('重复的名称');
                                return false;
                            }
                        }
                    }
                    if (!ProjectService.inputValidate(name)) {
                        return false;
                    }
                    return true;
                }
            }],
            size: 'md',
            resolve: {
                tagClassesManage: function () {
                    return tagClassesManage;
                },
                defaultTagClasses: function () {
                    return defaultTagClasses;
                }
            }
        });

        modalInstance.result.then(function (tagClassesManage) {
            //delete
            //rename
            for (var i = 0; i < $scope.component.tagClasses.length - defaultTagClassesLength; i++) {
                if (tagClassesManage[i].deleted == true) {
                    tagClassesManage.splice(i, 1);
                    $scope.component.tagClasses.splice(i + defaultTagClassesLength, 1);
                    i--;
                    continue;
                }
                if (tagClassesManage[i].renamed == true) {
                    $scope.component.tagClasses[i + defaultTagClassesLength].name = tagClassesManage[i].name;
                }
            }
            if ($scope.component.tagClasses.length - defaultTagClassesLength < tagClassesManage.length) {
                for (; i < tagClassesManage.length; i++) {
                    if (tagClassesManage[i].deleted == false) {
                        //addNewTagclass
                        var newTagclass = TagService.getNewTagClass();
                        newTagclass.name = tagClassesManage[i].name;
                        $scope.component.tagClasses.push(newTagclass);
                    }
                }
            }
            TagService.syncTagClasses($scope.component.tagClasses);
        }, function (tagClassesManage) {
        });
    }

    function readTagsInfo() {
        $scope.component.allCustomTags = TagService.getAllCustomTags();
        $scope.component.allTimerTags = TagService.getAllTimerTags();
        $scope.component.allTags = TagService.getAllTags();
        $scope.component.timerNum = TagService.getTimerNum();
    }

    function noDuplication(tag, tags) {
        if(tag.type==='custom'){
            for (var i = 0; i < tags.length; i++) {
                if (tag.name == tags[i].name) {
                    toastr.error('重复的tag名称');
                    return false;
                }
            }
        }
        return true;
    }

    function enterTag(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        if (ev.keyCode == 13) {
            setTag();
        } else {
            $scope.component.tag.name += String.fromCharCode(ev.charCode);
        }

    }

    //点击页面上的＋号，新增一个自定义tag
    function setTag() {
        //重置selected，使list里因选择而变灰的tag恢复原样
        $scope.selected = null;

        if (document.getElementById("tagName").disabled) {
            //将输入框变为可修改，并重置页面tag
            document.getElementById("tagName").disabled = false;
            $scope.component.tag = {
                name: "",
                register: false,
                indexOfRegister: null,
                writeOrRead: false,
                value: null
            };
        } else {
            //确保输入了tag名称，若未输入，跳出提示框
            if ($scope.component.tag.name == "") {
                alert("Please enter tag's name");
                return;
            }

            //将页面上的tag深拷贝至一个临时的newTag
            var newTag = _.cloneDeep($scope.component.tag);
            //_.assignIn(newTag,$scope.component.tag);

            //如果未选择register，则将indexOfRegister,writeOrRead,value这三个属性，置为null
            if (newTag.register == false) {
                newTag.indexOfRegister = null;
                newTag.writeOrRead = "false";
                newTag.value = null;
                //console.log("未设置register，三个属性置空");
            }

            TagService.setUniqueTags(newTag, function (tag, tags) {
                for (var i = 0; i < tags.length; i++) {
                    if (newTag.name == tags[i].name) {
                        console.log('equal');
                        return false;
                    }
                }
                return true;
            });

            //添加后tag框变为初始状态
            $scope.component.tag = {
                name: "",
                register: false,
                indexOfRegister: null,
                writeOrRead: false,
                value: null
            };

        }
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
                case Type.MySelector:
                case Type.MyRotaryKnob:
                case Type.MyColorBlock:
                    $scope.showTagPanel = true;
                    break;
                default:
                    $scope.showTagPanel = false;
            }
        }

    //list按钮事件，确定list列表是否可见
    function toggle() {
        $scope.component.visibleOfList = !$scope.component.visibleOfList;
    }

    function deleteTag(name, type) {
        var requiredTagNames = ProjectService.getRequiredTagNames();
        for (var i = 0; i < requiredTagNames.length; i++) {
            if (name == requiredTagNames[i]) {
                toastr.warning('该tag已经被使用');
                return;
            }
        }
        switch (type) {
            case "system":
                toastr.warning('系统变量不可删除');
                return;
            default:
                break;
        }

        //从标签列表中删除
        var tags;
        for (var j = 0; j < $scope.component.tagClasses.length; j++) {
            tags = $scope.component.tagClasses[j].tagArray;
            for (i = 0; i < tags.length; i++) {
                if (tags[i].name === name) {
                    tags.splice(i, 1);
                }
            }
        }

    }

    //点击list里的自定义tag名称，将其先显示编辑面板上。
    function displayTagByIndex(trObj) {
        document.getElementById('tagName').disabled = false;
        $scope.component.tag = _.cloneDeep(TagService.getTagByIndex(trObj.$index));
        $scope.component.indexOfTagInList = trObj.$index;
        $scope.selected = trObj.$id;
    }

    //点击list里的timerTag名称，将其显示在编辑面板上
    function displayTimerTagByIndex(trObj) {
        document.getElementById("tagName").disabled = true;//不可修改timerTag的名字
        $scope.component.tag = _.cloneDeep(TagService.getTimerTagByIndex(trObj.$index));
        $scope.component.indexOfTagInList = trObj.$index;
        $scope.selected = trObj.$id;
    }

    //点击页面上的edit按钮对应事件，根据tag中的名字不同，将编辑后的tag属性写入自定义tag或timerTags
    function editTag() {
        console.log("edit success");
        if (!(TagService.getAllCustomTags().length || TagService.getAllTimerTags().length) || ($scope.component.tag.name == "")) {
            alert('Not selected tag!');
            return;
        }

        if ($scope.component.tag.register == false) {
            $scope.component.tag.indexOfRegister = null;
            $scope.component.tag.writeOrRead = false;
            $scope.component.tag.value = null;
        }

        var nameString = $scope.component.tag.name;
        if (nameString.match("SysTmr_")) {
            TagService.editTimerTagByIndex($scope.component.indexOfTagInList, $scope.component.tag);
        }
        else {
            TagService.editTagByIndex($scope.component.indexOfTagInList, $scope.component.tag);
        }
    }

    function readTags() {
        readTagsInfo();
    }

    function addTimerNum() {
        $scope.component.timerNum++;
        //模拟input标签enter输入
        var ev = {};
        ev.keyCode = 13;
        setTimerNum(ev);
    }

    function minusTimerNum() {
        $scope.component.timerNum--;
        //模拟input标签enter输入
        var ev = {};
        ev.keyCode = 13;
        setTimerNum(ev);
    }

    function setTimerNum(ev) {
        if (ev.keyCode !== 13) {
            return;
        }
        var initNum = TagService.getTimerNum();
        if (!_.isInteger(parseInt($scope.component.timerNum))) {
            toastr.warning('输入不合法');
            $scope.component.timerNum = initNum;
            return;
        }
        if ($scope.component.timerNum > 10 || $scope.component.timerNum < 0) {

            toastr.warning('超出范围');
            $scope.component.timerNum = initNum;
            return;
        }
        TagService.setTimerNum($scope.component.timerNum);
        TagService.setTimerTags($scope.component.timerNum);
    }

    function restoreTimerNum() {
        $scope.component.timerNum = TagService.getTimerNum();
    }

    //tag按名称排序
    function sortByName(e) {
        TagService.sortByName(function () {
            readTagsInfo();
        })
    }

    //tag按寄存器号排序
    function sortByRegister() {
        TagService.sortByRegister(function () {
            readTagsInfo();
        })
    }

    //*********tagClass*********//edit by LH in 2018/3/20
    //读取默认标签列表
    function readTagClassesInfo() {
        $scope.component.tagClasses = TagService.getAllTagClasses();
        $scope.component.tagClasses[0].tagArray = $scope.component.allCustomTags;
        $scope.component.tagClasses[1].tagArray = $scope.component.allTimerTags;
        $scope.component.curTagClass = TagService.getAllTagClasses()[0];
        $scope.component.curTagClassName = TagService.getAllTagClasses()[0].name;
    }

    //打开标签管理模态框
    function editTagClass() {
        openPanelEditTagClasses();
    }

    function addToTagClass(name) {
        openPanelAddToTagClass(name);
    }

    function changeCurTagClass() {
        var tagClasses = $scope.component.tagClasses;
        var curTagClassName = $scope.component.curTagClassName;
        var allTags = $scope.component.tagClasses[0].tagArray;
        var curTagClass = [];
        var syncCurTagArray = [];
        for (var i = 0; i < tagClasses.length; i++) {
            if (curTagClassName === tagClasses[i].name) {
                $scope.component.curTagClass = curTagClass = tagClasses[i];
                break;
            }
        }
        if ($scope.component.curTagClass.name === '定时器') {
            $scope.component.timerTagShow = true;
        } else {
            //显示非定时器模式下的tag列表
            $scope.component.timerTagShow = false;
        }
        syncTagClassTagArray($scope.component.curTagClass);

    }
    //返回tagName在tagClass的index
    function IndexInTagClass(tagName,tagClass){
        for(var i=0;i<tagClass.tagArray.length;i++){
            if(tagName===tagClass.tagArray[i].name){
                return i;
            }
        }
        return -1;
    }
    //更新某个tagclass中的某个tag
    function editTagInTagClass(tagName,newTag,tagClass){
        var index=IndexInTagClass(tagName,tagClass);
        tagClass.tagArray[index]=newTag;
    }
    //同步标签的tagArray
    function syncTagClassTagArray(tagClass){
        for(var i=0;i<tagClass.tagArray.length;i++){
            for(var j=0;j<$scope.component.allTags.length;j++){
                if(tagClass.tagArray[i].name===$scope.component.allTags[j].name){
                    tagClass.tagArray[i]=$scope.component.allTags[j];
                }
            }
        }
    }
    //regCheckboxClick
    function regCheckboxClick(tag){
        if($scope.component.curTagClassName!==$scope.component.tagClasses[0].name){
            var index=IndexInTagClass(tag.name,$scope.component.tagClasses[0]);
            TagService.editTagByIndex(index, tag, function () {
                readTagsInfo();
            });
        }
    }

    /**
     * 导入预设tags
     */
    function importTags() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'tagsImport.html',
            scope: $scope,//指定父scope
            size: 'md',
            resolve: {
                curTagClass: function () {
                    return $scope.component.curTagClass;
                }
            },
            controller: ['$scope', '$uibModalInstance', '$http', 'TagService', 'curTagClass', function ($scope, $uibModalInstance, $http, TagService, curTagClass) {
                $scope.selectedTagId = null;
                $scope.overlay = false;
                $scope.btnText = "确定";
                $scope.disableBtn = false;

                $scope.ok = function () {
                    if (!$scope.selectedTagId) {
                        toastr.warning('请选择一项预设变量');
                        return;
                    }
                    toggleBtn();
                    getTagsFromRemote($scope.selectedTagId);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss();
                };


                /**
                 * 获取选中的预设tags
                 * @param id
                 */
                function getTagsFromRemote(id) {
                    var pattern = new RegExp(/tags_default\d*$/g);
                    var url = '';

                    if (pattern.test(id)) {
                        //sys
                        url = '/public/ide/modules/tagConfig/template/' + id.replace('_', '.') + '.json';
                        console.log('url', url);
                    } else {
                        //custom
                    }
                    if (!url) {
                        console.error('url is empty!');
                        return;
                    }
                    $http({
                        method: 'get',
                        url: url
                    }).success(function (data) {
                        handler(null, data);
                    }).error(function (err) {
                        handler(err, null);
                    });
                }

                /**
                 * 处理函数
                 * @param err
                 * @param data
                 */
                function handler(err, data) {
                    if (err) {
                        toastr.error('获取失败，请检查您的网络');
                        toggleBtn();
                        return;
                    }
                    TagService.syncTagFromRemote(data, curTagClass, $scope.overlay, function () {
                        $scope.$emit('syncTagSuccess');
                        $uibModalInstance.close();
                    });
                }

                /**
                 * 改变按钮状态
                 */
                function toggleBtn() {
                    $scope.btnText = ($scope.btnText === '确定') ? '导入中...' : $scope.btnText;
                    $scope.disableBtn = $scope.btnText !== '确定';
                }
            }]
        });
    }
}]);

/**
 * tag模态框控制器
 */
ide.controller('TagInstanceCtrl', ['$scope', '$uibModalInstance', 'TagService', 'ProjectService', 'tag', 'type', 'index', function ($scope, $uibModalInstance, TagService, ProjectService, tag, type, index) {

    $scope.tag = tag;
    $scope.type = type;

    //保存
    $scope.save = function (th) {
        //如果是定时器，就不验证，直接关闭
        if (th.type === "timer") {
            $uibModalInstance.close($scope.tag);
            return;
        }
        if (index !== -1) {
            //edit tag
            var oldTag = TagService.getTagByIndex(index);
            if (oldTag.name !== $scope.tag.name) {
                var requiredTagNames = ProjectService.getRequiredTagNames();
                for (var i = 0; i < requiredTagNames.length; i++) {
                    if (oldTag.name === requiredTagNames[i]) {
                        toastr.warning('该tag已经被使用,修改名称请先解除绑定');
                        return;
                    }
                }
                var allTags = _.cloneDeep(TagService.getAllTags());
                for (var j = 0; j < allTags.length; j++) {
                    if ($scope.tag.name === allTags[j].name) {
                        if (index != j) {
                            toastr.error('重复的tag名称');
                            return;
                        }
                    }
                }
            }
        }
        if (ProjectService.inputValidate($scope.tag.name)) {
            if ($scope.tag.name.match(/^SysTmr_[0-9]+_t$/)) {
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
    $scope.checkTagIndex = function () {
        if ($scope.tag.indexOfRegister > 65535 || $scope.tag.indexOfRegister < 0) {
            toastr.warning('序号超出范围');
            $scope.tag.indexOfRegister = 0;
        }
        if (!_.isInteger($scope.tag.indexOfRegister)) {
            toastr.error('序号只能是整数');
            $scope.tag.indexOfRegister = 0;
        }
    };

    function checkEmpty() {
        if (!tag.name || tag.name == '') {
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
    $scope.selectedTagObj = {tagName: null};

    $scope.$on('GlobalProjectReceived', function () {
        _initController();
    });

    $scope.$on('AttributeChanged', function () {
        _readTagsInfo();
        _reBindTag();
        _readObjType();
    });

    $scope.$on("MaskView", function (event, data) {
        $scope.myMask = data;
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
        $scope.selectedTagObj.tagName = selectObject.level.tag;
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
            case Type.MySelector:
            case Type.MyRotaryKnob:
            case Type.MyColorBlock:
                $scope.component.showTagPanel = true;
                break;
            default:
                $scope.component.showTagPanel = false;
        }
    }

    //选择tag，并将其绑定到当前对象上
    function selectedTagFun() {
        $scope.component.selectedTag = $scope.selectedTagObj.tagName;
        ProjectService.ChangeAttributeTag($scope.component.selectedTag, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage', oldOperate);
        });
    }
}]);
