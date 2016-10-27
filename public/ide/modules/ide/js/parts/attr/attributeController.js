

ide.controller('AttributeCtrl',['$scope','$timeout',
    'ProjectService',
    'Type', 'Preference',
    'ResourceService',
    'characterSetService',
    'CanvasService','AnimationService', function ($scope,$timeout,
                                     ProjectService,
                                     Type, Preference,
										  ResourceService,
                                          characterSetService,
                                     CanvasService,AnimationService) {

	var initObject=null;

	$scope.$on('GlobalProjectReceived', function () {
		initUserInterface();
		initProject();

	});

    //edit by lixiang for select of textArea show or hide
    $scope.$on('ToolShowChanged', function (event, toolShow) {
        $scope.component.textArea.toolShow=toolShow;
    });

	function initUserInterface(){
		$scope.component={
			type:'',
			onAttributeChanged:onAttributeChanged,
            transitionMode:[
                {name:'NO_TRANSITION',show:'无动画'},
                {name:'MOVE_LR',show:'从左进入'},
                {name:'MOVE_RL',show:'从右进入'},
                {name:'SCALE',show:'缩放'}
            ],
            transitionName:null,

            page:{
                enterImage:enterBackgroundImage,
                selectImage:'demo20.png',
            },

            layer:{
                enterShowSubLayer:enterShowSubLayer,
                selectModel:null,
            },
            subLayer:{
                enterImage:enterBackgroundImage,
                selectImage:'blank.png'
            },
            slide:{
                addSubSlide:addSubSlide
            },
            button:{
                buttonModeId:'0',
                buttonModes:[
                    {id:'0',name:'普通模式'},
                    {id:'1',name:'开关模式'}],
                enterButtonMode:enterButtonMode,
                enterNormalImage:enterNormalImage,
                enterPressImage:enterPressImage,

                enterButtonText:enterButtonText,
                changeButtonFontFamily:changeButtonFontFamily,
                setButtonFontBold:setButtonFontBold,
                setButtonFontItalic:setButtonFontItalic,
                changeButtonFontSize:changeButtonFontSize,

                normalImage:'blank.png',
                pressImage:'blank.png'

            },
            buttonGroup:{
                enterInterval:enterInterval,
                enterButtonCount:enterButtonCount,
                enterArrange:enterArrange

            },
            progress:{
                progressModeId:'0',
                progressModes:[
                    {id:'0',name:'普通进度条'},
                    {id:'1',name:'变色进度条'},
                    {id:'2',name:'脚本进度条'}
                ],
                backgroundImage:'blank.png',
                progressImage:'blank.png',
                enterBottomImage:enterBottomImage,
                enterProgressImage:enterProgressImage,
                enterProgressValue:enterProgressValue,
                enterArrange:enterArrange,
                enterCursor:enterCursor,
            },
            dashboard:{
                dashboardModeId:'0',
                clockwise:'1',
                dashboardModes:[
                    {id:'0',name:'简单模式'},
                    {id:'1',name:'复杂模式'},
                    {id:'2',name:'精简模式'}
                ],
                dashboardClockwise:[
                    {wise:'1',name:'顺时针'},
                    {wise:'0',name:'逆时针'},
                    {wise:'2',name:'双向'}
                ],
                backgroundImage:'blank.png',
                pointerImg:'blank.png',
                enterDashboardMode:enterDashboardMode,
                enterDashboardClockwise:enterDashboardClockwise,
                enterDashboardValue:enterDashboardValue,
                enterDashboardOffsetValue:enterDashboardOffsetValue,
                enterPointerLength:enterPointerLength,
                enterMinCoverAngle:enterMinCoverAngle,
                enterMaxCoverAngle:enterMaxCoverAngle
            },
            textArea:{
                enterText:enterText,
                changeFontFamily:changeFontFamily,
                changeFontSize:changeFontSize,
                setBoldFont:setBoldFont,
                setUnderlineFont:setUnderlineFont,
                setItalicFont:setItalicFont,
                selectCharacterSetByIndex:selectCharacterSetByIndex,
                selectCharacterSetByName:selectCharacterSetByName,
                addCharacterSet:addCharacterSet,
                deleteCharacterSetByIndex:deleteCharacterSetByIndex
            },
            num:{
                numModeId:'0',//代表切换模式。0:普通模式 1:动画模式
                numModes:[
                    {id:'0',name:'普通模式'},
                    {id:'1',name:'动画模式'}
                ],
                symbolMode:'0',
                symbolModes:[
                    {id:'0',name:'无符号模式'},
                    {id:'1',name:'有符号模式'}
                ],
                frontZeroMode:'0',
                frontZeroModes:[
                    {id:'0',name:'无前导0模式'},
                    {id:'1',name:'有前导0模式'}
                ],
                overFlowStyle:'0',
                overFlowStyles:[
                    {id:'0',name:'溢出不显示'},
                    {id:'1',name:'溢出显示'}
                ],
                changeNumFamily:changeNumFamily,
                setBoldNum:setBoldNum,
                setItalicNum:setItalicNum,
                changeNumSize:changeNumSize,
                changeNumOfDigits:changeNumOfDigits,
                changeDecimalCount:changeDecimalCount,
                enterNumMode:enterNumMode,
                enterSymbolMode:enterSymbolMode,
                enterFrontZeroMode:enterFrontZeroMode,
                enterOverFlowStyle:enterOverFlowStyle,

                enterNumValue:enterNumValue,
                changeNumAlign:changeNumAlign
            },

            //旋钮
            knob:{
                backgroundImage:'blank.png',
                knobImg:'blank.png',
                enterKnobSize:enterKnobSize,
                enterKnobValue:enterKnobValue
            },

            //示波器
            oscilloscope:{
                changeOscSpacing:changeOscSpacing,
                changeOscGrid:changeOscGrid,
                changeOscLinWidth:changeOscLinWidth,
                changeOscGridInitValue:changeOscGridInitValue,
                changeOscGridUnitX:changeOscGridUnitX,
                changeOscGridUnitY:changeOscGridUnitY
            },

            //开关
            switch:{
                enterBindBit:enterBindBit
            },
            //旋转
            rotateImg:{
                enterInitValue:enterInitValue
            },
            dateTime:{
                dateTimeModes:[
                    {id:'0',name:'时分秒模式'},
                    {id:'1',name:'时分模式'},
                    {id:'2',name:'斜杠日期'},
                    {id:'3',name:'减号日期'}
                ],
                RTCModes:[
                    {id:'0',name:'使用内部时钟'},
                    {id:'1',name:'使用外部时钟'}
                ],
                enterDateTimeMode:enterDateTimeMode,
                changeDateTimeFontFamily:changeDateTimeFontFamily,
                changeDateTimeFontSize:changeDateTimeFontSize,
            },
            //滑块
            slideBlock:{
                enterInitValue:enterInitValue,
                enterArrange:enterArrange
            },
            group:{
                align:[
                    {id:'top',name:'上对齐'},
                    {id:'bottom',name:'下对齐'},
                    {id:'left',name:'左对齐'},
                    {id:'right',name:'右对齐'}
                ],
                alignModeId:null,
                changeGroupAlign:changeGroupAlign,
            },

            enterName:enterName,
			enterColor:enterColor,
			enterX:enterX,
			enterY:enterY,
			enterWidth:enterWidth,
			enterHeight:enterHeight,
			enterImage:enterBackgroundImage,
            enterMinValue:enterMinValue,
            enterMaxValue:enterMaxValue,
            enterMinAngle:enterMinAngle,
            enterMaxAngle:enterMaxAngle,
            enterMinAlert:enterMinAlert,
            enterMaxAlert:enterMaxAlert,
			restore:restore,
            changeTransitionName:changeTransitionName,
            changeTransitionDur:changeTransitionDur,
		};
	}

	function initProject(){

		ProjectService.getProjectTo($scope);

        //edit by lixiang
        $scope.maxWidth = $scope.project.initSize.width||1280;
        $scope.maxHeight = $scope.project.initSize.height||1080;
        $scope.defaultTransition = AnimationService.getDefaultTransition();

		onAttributeChanged();
		updateImageList();
		$scope.$on('ResourceChanged', function () {
			updateImageList();

		});

		$scope.$on('AttributeChanged', function (event) {
			onAttributeChanged();
		});

		$scope.$on('colorpicker-submit', function (e,op) {
			enterColor(op);
		});

		$scope.$on('colorpicker-closed', function (e,op) {
			restore();
		});

        //edit by lixiang
        $scope.$on('changeFontFamily',function(e,op){
            //console.log(op);
            enterFontStyle(op);
        });

	}

	function updateImageList(){
        var blankImage={
            id:'blank.png',
            src:'/public/images/blank.png',
            name:'空白'
        }
        $timeout(function () {
            $scope.component.images=ResourceService.getAllImages();
            $scope.component.images.unshift(blankImage);
        })


	}

    /**
     * 当属性变化时的响应
     */
    function onAttributeChanged(){
		var selectObject=ProjectService.getCurrentSelectObject();
        $timeout(function () {
            $scope.component.object= _.cloneDeep(selectObject);
            initObject= _.cloneDeep(selectObject);
            //重置属性
            switch ($scope.component.object.type){
                case Type.MyLayer:
                    //调整Layer的ShowSubLayer
                    $scope.component.layer.selectModel=$scope.component.object.level.showSubLayer.id;
                    if((typeof $scope.component.object.level.transition)!='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    break;
                case Type.MyPage:
                    //调整Page的背景图
                    if ($scope.component.object.level.backgroundImage==''){
                        $scope.component.page.selectImage='blank.png';
                    }else {
                        $scope.component.page.selectImage=$scope.component.object.level.backgroundImage;
                    }
                    if((typeof $scope.component.object.level.transition)!='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    break;
                case Type.MySubLayer:
                    //调整SubLayer的背景图
                    if ($scope.component.object.level.backgroundImage==''){
                        $scope.component.subLayer.selectImage='blank.png';
                    }else {
                        $scope.component.subLayer.selectImage=$scope.component.object.level.backgroundImage;
                    }
                    break;

                case Type.MyGroup:

                    //让Group无法旋转和放大
                    var controlsVisibility=Preference.GROUP_CONTROL_VISIBLE;
                    selectObject.target.setControlsVisibility(controlsVisibility);
                    $scope.component.group.alignModeId=null;
                    break;

                case Type.MyProgress:
                    //Progress的方向
                    $scope.component.progress.arrangeModel=$scope.component.object.level.info.arrange;
                    //Progress的光标
                    $scope.component.progress.cursor = $scope.component.object.level.info.cursor;
                    $scope.component.progress.progressModeId=$scope.component.object.level.info.progressModeId;
                    //调整背景图
                    if ($scope.component.object.level.backgroundImg==''){
                        $scope.component.progress.backgroundImage='blank.png';
                    }else {
                        $scope.component.progress.backgroundImage=$scope.component.object.level.backgroundImg;
                    }
                    if ($scope.component.object.level.progressImg==''){

                        $scope.component.progress.progressImage='blank.png';
                    }else {
                        $scope.component.progress.progressImage=$scope.component.object.level.progressImg;
                    }

                    break;
                case Type.MyDashboard:
                    $scope.component.dashboard.dashboardModeId=$scope.component.object.level.dashboardModeId;
                    $scope.component.dashboard.clockwise=$scope.component.object.level.info.clockwise;
                    if(!($scope.component.object.level.info.minCoverAngle||$scope.component.object.level.info.maxCoverAngle)){
                        $scope.component.object.level.info.minCoverAngle=0;
                        $scope.component.object.level.info.maxCoverAngle=0;
                        selectObject.level.info.minCoverAngle=0;
                        selectObject.level.info.maxCoverAngle=0;
                    }
                    if ($scope.component.object.level.backgroundImg==''){
                        $scope.component.dashboard.backgroundImage='blank.png';
                    }else {
                        $scope.component.dashboard.backgroundImage=$scope.component.object.level.backgroundImg;
                    }
                    if ($scope.component.object.level.pointerImg==''){

                        $scope.component.dashboard.pointerImg='blank.png';
                    }else {
                        $scope.component.dashboard.pointerImg=$scope.component.object.level.pointerImg;
                    }
                    break;
                case Type.MyTextArea:
                    break;
                case Type.MyKnob:
                    if ($scope.component.object.level.backgroundImg==''){
                        $scope.component.knob.backgroundImage='blank.png';
                    }else {
                        $scope.component.knob.backgroundImage=$scope.component.object.level.backgroundImg;
                    }
                    if ($scope.component.object.level.knobImg==''){

                        $scope.component.dashboard.knobImg='blank.png';
                    }else {
                        $scope.component.dashboard.knobImg=$scope.component.object.level.knobImg;
                    }
                    break;

                case Type.MyButton:

                    $scope.component.button.buttonModeId=$scope.component.object.level.buttonModeId;
                    if ($scope.component.object.level.normalImg==''){
                        $scope.component.button.normalImage='blank.png';
                    }else {
                        $scope.component.button.normalImage=$scope.component.object.level.normalImg;
                    }
                    if ($scope.component.object.level.pressImg==''){

                        $scope.component.button.pressImage='blank.png';
                    }else {
                        $scope.component.button.pressImage=$scope.component.object.level.pressImg;
                    }

                    break;
                case Type.MyButtonGroup:
                    $scope.component.buttonGroup.arrangeModel=$scope.component.object.level.info.arrange;
                    break;

                case Type.MyNumber:
                    break;

                case Type.MyNum:
                    $scope.component.num.numModeId=$scope.component.object.level.info.numModeId;
                    $scope.component.num.symbolMode=$scope.component.object.level.info.symbolMode;
                    $scope.component.num.frontZeroMode=$scope.component.object.level.info.frontZeroMode;
                    $scope.component.num.overFlowStyle=$scope.component.object.level.info.overFlowStyle;
                    if((typeof $scope.component.object.level.transition)!='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    break;
                case Type.MyOscilloscope:
                    break;
                case Type.MyDateTime:
                    $scope.component.dateTime.dateTimeModeId=$scope.component.object.level.info.dateTimeModeId;
                    $scope.component.dateTime.RTCModeId = $scope.component.object.level.info.RTCModeId;
                    break;
                case Type.MySlideBlock:
                    $scope.component.slideBlock.arrangeModel=$scope.component.object.level.info.arrange;
                    break;
            }

        })





	}

	function restore(){
		$timeout(function () {
			$scope.component.object= _.cloneDeep(initObject);
		})
	}

    function changeTransitionName(){
        var option={
            name:$scope.component.transitionName
        };

        ProjectService.ChangeAttributeTransition(option);

    }
    function changeTransitionDur(e){
        if(e.keyCode==13){
            if($scope.component.object.level.transition.duration>60||$scope.component.object.level.transition.duration<0){
                toastr.warning('超出限制');
                restore();
                return;
            }
            if($scope.component.object.level.transition.duration==initObject.level.transition.duration){
                return;
            }
            var option={
                duration:$scope.component.object.level.transition.duration
            };
            oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTransition(option,function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    function addSubSlide(){

    }
	/**
	 * 输入名字
	 * @param e
     */
	function enterName(e){
		if (e.keyCode==13){

			//判断是否超长
			if ($scope.component.object.level.name.length>Preference.OBJECT_MAX_LENGTH){
				toastr.warning('名称超长');
				restore();
				return;
			}
			//判断是否为空
			if ($scope.component.object.level.name.length==0){
				toastr.warning('名称不能为空');
				restore();

				return;
			}
			//判断是否和初始一样
			if ($scope.component.object.level.name==initObject.level.name){
				return;
			}
			var option={
				name:$scope.component.object.level.name
			};

			ProjectService.ChangeAttributeName(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})
		}

	}

	function enterX(e){
		if (e.keyCode==13){
			//判断输入是否合法
			if (!_.isInteger(parseInt($scope.component.object.level.info.left))){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            //if($scope.component.object.level.info.left<0||$scope.component.object.level.info.left>$scope.maxWidth){
            //    toastr.warning('超出画布范围');
            //    restore();
            //    return;
            //}
			//判断是否有变化
			if ($scope.component.object.level.info.left==initObject.level.info.left){
				toastr.warning('未改变值'+$scope.component.object.level.info.left);
				return;
			}
			var option={
				left:$scope.component.object.level.info.left
			};

			ProjectService.ChangeAttributePosition(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})

		}
	}

	function enterY(e){
		if (e.keyCode==13){
			//判断输入是否合法
			if (!_.isInteger(parseInt($scope.component.object.level.info.top))){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            //if($scope.component.object.level.info.top<0||$scope.component.object.level.info.top>$scope.maxHeight){
            //    toastr.warning('超出范围');
            //    restore();
            //    return;
            //}
			//判断是否有变化
			if ($scope.component.object.level.info.top==initObject.level.info.top){
				return;
			}
			var option={
				top:$scope.component.object.level.info.top
			};

			ProjectService.ChangeAttributePosition(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})

		}
	}
	function enterWidth(e){
		if (e.keyCode==13){
			//判断输入是否合法
			var integer=Number($scope.component.object.level.info.width);
			if (!_.isInteger(integer)){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if($scope.component.object.level.info.width<1){
                toastr.warning('超出范围');
                restore();
                return;
            }
			//判断是否有变化
			if ($scope.component.object.level.info.width==initObject.level.info.width){
				console.log('没有变化');
				return;
			}
			var option={
				width:$scope.component.object.level.info.width
			};

			ProjectService.ChangeAttributeSize(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})
		}
	}
	function enterHeight(e){
		if (e.keyCode==13){
			//判断输入是否合法
			var integer=parseInt($scope.component.object.level.info.height);
			if (!_.isInteger(integer)||integer<1){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if($scope.component.object.level.info.height<1){
                toastr.warning('超出范围');
                restore();
                return;
            }
			//判断是否有变化
			if ($scope.component.object.level.info.height==initObject.level.info.height){
				console.log('没有变化');
				return;
			}
			var option={
				height:$scope.component.object.level.info.height
			};

			ProjectService.ChangeAttributeSize(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})
		}
	}
	function enterColor(op) {
        var oldOperate=null,
            option=null,
            colorValue,
            i;
        colorValue = op.value.slice(5,op.value.length-1);
        colorValue = colorValue.split(",");
        for(i=0;i<colorValue.length;i++){
            if(parseInt(colorValue[i])>255|| !_.isInteger(Number(colorValue[i]))){
                toastr.warning('格式错误');
                restore();
                return;
            }
        }

		if (op.name=='component.object.level.backgroundColor'){

			if (initObject.level.backgroundColor==op.value){
				return;
			}
            oldOperate=ProjectService.SaveCurrentOperate();

			option={
				color:op.value
			};
			ProjectService.ChangeAttributeBackgroundColor(option, function () {
				$scope.$emit('ChangeCurrentPage',oldOperate);

			})

		}
        if(op.name=='component.object.level.info.fontColor'){
            if(initObject.level.info.fontColor==op.value) {
                return;
            }
            option = {
                fontColor:op.value
            };

            oldOperate=ProjectService.SaveCurrentOperate();

            var selectObj=ProjectService.getCurrentSelectObject();
            if(selectObj.type==Type.MyTextArea){
                ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }else if(selectObj.type==Type.MyButton){
                ProjectService.ChangeAttributeButtonText(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }else if(selectObj.type==Type.MyDateTime){
                ProjectService.ChangeAttributeDateTimeText(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }else if(selectObj.type==Type.MyNum){
                ProjectService.ChangeAttributeNumContent(option,function(oldOperate){
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }
        }
        if(op.name=='component.object.level.info.lineColor'){
            if(initObject.level.info.lineColor==op.value){
                return;
            }
            option={
                lineColor:op.value
            };
            oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscope(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
	}

	function enterShowSubLayer(op){
        var oldOperate=ProjectService.SaveCurrentOperate();
        var subLayerId=$scope.component.layer.selectModel;
        var currentLayer=ProjectService.getCurrentLayer();
        _.forEach(currentLayer.subLayers, function (_subLayer,_index) {
            if(_subLayer.id==subLayerId){
                ProjectService.changeCurrentSubLayerIndex(_index, function () {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })

            }
        })


    }

	function enterBackgroundImage(){
        var selectImage='';
        if ($scope.component.object.type==Type.MyPage){
            selectImage=$scope.component.page.selectImage;
            if(selectImage=='/public/images/blank.png'){
                $scope.component.object.level.backgroundColor='rgb(54,71,92)';
            }
            else{
                $scope.component.object.level.backgroundColor='rgb(0,0,0)'
            }

            var currentPage=ProjectService.getCurrentPage();
            var pageNode=CanvasService.getPageNode();
            pageNode.setBackgroundColor($scope.component.object.level.backgroundColor, function () {
                pageNode.renderAll();
                currentPage.backgroundColor=$scope.component.object.level.backgroundColor;
                currentPage.proJsonStr=pageNode.toJSON();
            });
        }else if ($scope.component.object.type==Type.MySubLayer){
            selectImage=$scope.component.subLayer.selectImage;
            if(selectImage=='/public/images/blank.png'){
                $scope.component.object.level.backgroundColor=_getRandomColor();
            }
            else{
                $scope.component.object.level.backgroundColor='rgba(0,0,0,0)'
            }

            var currentSubLayer=ProjectService.getCurrentSubLayer();
            var subLayerNode=CanvasService.getSubLayerNode();
            subLayerNode.setBackgroundColor($scope.component.object.level.backgroundColor, function () {
                subLayerNode.renderAll();
                currentSubLayer.backgroundColor=$scope.component.object.level.backgroundColor;

                currentSubLayer.proJsonStr=subLayerNode.toJSON();
            })

        }else{
            return;
        }



        var option={
            image: _.cloneDeep(selectImage)
        };
        ProjectService.ChangeAttributeBackgroundImage(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
	}

    function enterNormalImage(){
        var selectImage=$scope.component.button.normalImage;

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            image: _.cloneDeep(selectImage)
        }
        ProjectService.ChangeAttributeNormalImage(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterPressImage(){
        var selectImage=$scope.component.button.pressImage;

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            image: _.cloneDeep(selectImage)
        }
        ProjectService.ChangeAttributePressImage(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function enterButtonText(e){
        if(e.keyCode==13){
            if ($scope.component.object.level.info.text==initObject.level.info.text){
                return;
            }
            var textLength = $scope.component.object.level.info.text.length||null;
            if(textLength>20){
                toastr.warning('字数最大20');
                restore();
                return;
            }
            var option = {
                text:$scope.component.object.level.info.text
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeButtonText(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    function changeButtonFontFamily(){
        if($scope.component.object.level.info.fontFamily==initObject.level.info.fontFamily) {
            return;
        }
        var option = {
            fontFamily:$scope.component.object.level.info.fontFamily
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeButtonText(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function setButtonFontBold(){
        if($scope.component.object.level.info.fontBold=="100"){
            $scope.component.object.level.info.fontBold="bold";
        }else if($scope.component.object.level.info.fontBold=="bold"){
            $scope.component.object.level.info.fontBold="100";
        }
        var option = {
            fontBold:$scope.component.object.level.info.fontBold
        };
        ProjectService.ChangeAttributeButtonText(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function setButtonFontItalic(){
        if($scope.component.object.level.info.fontItalic==""){
            $scope.component.object.level.info.fontItalic="italic";
        }else if($scope.component.object.level.info.fontItalic=="italic"){
            $scope.component.object.level.info.fontItalic="";
        }
        var option = {
            fontItalic:$scope.component.object.level.info.fontItalic
        };
        ProjectService.ChangeAttributeButtonText(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function changeButtonFontSize(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.fontSize<0||$scope.component.object.level.info.fontSize>150){
                toastr.warning('超出范围');
                restore();
                return;
            }
            if($scope.component.object.level.info.fontSize==initObject.level.info.fontSize) {
                return;
            }
            var option = {
                fontSize:$scope.component.object.level.info.fontSize
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeButtonText(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function enterInterval(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(Number($scope.component.object.level.info.interval))||(parseInt($scope.component.object.level.info.interval))<0){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            var interval = $scope.component.object.level.info.interval||0;
            var count = $scope.component.object.level.info.count||0;
            var width = $scope.component.object.level.info.width||0;
            if(interval*(count-1)>width){
                toastr.warning('配置不合理');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.interval==initObject.level.info.interval){
                return;
            }

            var option={
                interval:$scope.component.object.level.info.interval
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeInterval(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterButtonCount(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.count))||(parseInt($scope.component.object.level.info.interval)<0)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            var interval = $scope.component.object.level.info.interval||0;
            var count = $scope.component.object.level.info.count||0;
            var width = $scope.component.object.level.info.width||0;
            if(interval*(count-1)>width){
                toastr.warning('配置不合理');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.count==initObject.level.info.count){
                return;
            }
            if ($scope.component.object.level.info.count<2){
                toastr.warning('按钮数至少为2');
                restore();
                return;
            }
            if($scope.component.object.level.info.count>15){
                toastr.warning('按钮数至多为15');
                restore();
                return;
            }

            var option={
                count:parseInt($scope.component.object.level.info.count)
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeButtonCount(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    /**
     * 输入Progress的背景图片
     */
    function enterBottomImage(){
        var selectImage=$scope.component.progress.backgroundImage;

        var option={
            image: _.cloneDeep(selectImage)
        }
        ProjectService.ChangeAttributeBottomImage(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterProgressImage(){
        var selectImage=$scope.component.progress.progressImage;

        var oldOperate=ProjectService.SaveCurrentOperate();
        var option={
            image: _.cloneDeep(selectImage)
        }
        ProjectService.ChangeAttributeProgressImage(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterProgressValue(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.progressValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.progressValue==initObject.level.info.progressValue){
                return;
            }

            //判断是否在范围内
            if ($scope.component.object.level.info.progressValue<$scope.component.object.level.info.minValue
                ||$scope.component.object.level.info.progressValue>$scope.component.object.level.info.maxValue){
                toastr.warning('超出范围');

                restore();
                return;
            }
            var option={
                progressValue:$scope.component.object.level.info.progressValue
            };

            ProjectService.ChangeAttributeProgressValue(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    /**
     * 设置进度条是否具有光标
     */
    function enterCursor(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectCursor=null;
        var selectModeId=null;
        if(selectObj.type==Type.MyProgress){
            selectCursor=$scope.component.progress.cursor;
            selectModeId=$scope.component.progress.progressModeId;
        }else{
            return;
        }
        var oldOperate=ProjectService.SaveCurrentOperate();
        var option={
            cursor:selectCursor,
            progressModeId:selectModeId
        };
        ProjectService.ChangeAttributeCursor(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }


    /**
     * 改变排列方向属性
     * 只对progress和buttonGroup有效
     */
    function enterArrange(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectArrange=null;
        if (selectObj.type==Type.MyProgress){
            selectArrange=$scope.component.progress.arrangeModel;

        }else if (selectObj.type==Type.MyButtonGroup){
            selectArrange=$scope.component.buttonGroup.arrangeModel;

        }else if(selectObj.type==Type.MySlideBlock){
            selectArrange=$scope.component.slideBlock.arrangeModel;
        } else {
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            arrange:selectArrange
        };
        ProjectService.ChangeAttributeArrange(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);

        })
    }

    function enterDashboardOffsetValue(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(Number($scope.component.object.level.info.offsetValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.offsetValue<-360||
                $scope.component.object.level.info.offsetValue>360){
                toastr.warning('超出最小最大角度范围');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.offsetValue==initObject.level.info.offsetValue){
                return;
            }

            var option={
                offsetValue:$scope.component.object.level.info.offsetValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeDashboardOffsetValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterDashboardValue(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isNumber($scope.component.object.level.info.value)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.value==initObject.level.info.value){
                return;
            }

            //判断是否在范围内
            if ($scope.component.object.level.info.value<$scope.component.object.level.info.minValue
                ||$scope.component.object.level.info.value>$scope.component.object.level.info.maxValue){
                toastr.warning('超出范围');

                restore();
                return;
            }
            var option={
                value:$scope.component.object.level.info.value
            };

            //console.log('change attribute dashboard value',option)
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeDashboardValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterPointerLength(e){
        if (e.keyCode==13){
            var pointerLength = $scope.component.object.level.info.pointerLength;
            var width = $scope.component.object.level.info.width;
            var maxLengthOfPointer = width/Math.SQRT2+10;
            //判断输入是否合法
            if (!_.isInteger(Number(pointerLength))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if(pointerLength<0||pointerLength>maxLengthOfPointer){
                toastr.warning('指针长度超出范围');
                restore();
                return;
            }

            if (pointerLength==initObject.level.info.pointerLength){
                return;
            }

            var option={
                pointerLength:pointerLength
            };
            //console.log(option);
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeDashboardPointerLength(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterDashboardMode(e){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectDashboardMode=null;
        if (selectObj.type==Type.MyDashboard){
            selectDashboardMode=$scope.component.dashboard.dashboardModeId;

        }else {
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            dashboardModeId:selectDashboardMode
        };
        ProjectService.ChangeAttributeDashboardModeId(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function enterDashboardClockwise(e){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectDashboardClockwise=null;
        if(selectObj.type==Type.MyDashboard){
            selectDashboardClockwise=$scope.component.dashboard.clockwise;
        }else{
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            clockwise:selectDashboardClockwise
        };
        ProjectService.ChangeAttributeDashboardClockwise(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterMinCoverAngle(e){
        if(e.keyCode==13){
            if (!_.isInteger($scope.component.object.level.info.minCoverAngle)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.minCoverAngle<-360||$scope.component.object.level.info.minCoverAngle>360||
                $scope.component.object.level.info.minCoverAngle>$scope.component.object.level.info.maxCoverAngle||
                $scope.component.object.level.info.maxCoverAngle-$scope.component.object.level.info.minCoverAngle>360){
                toastr.warning('超出范围');
                restore();
                return;
            }
            var option = {
                minCoverAngle:$scope.component.object.level.info.minCoverAngle
            }
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeDashboardCoverAngle(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function enterMaxCoverAngle(e){
        if(e.keyCode==13){
            if (!_.isInteger($scope.component.object.level.info.maxCoverAngle)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.maxCoverAngle<-360||$scope.component.object.level.info.maxCoverAngle>360||
                $scope.component.object.level.info.maxCoverAngle<$scope.component.object.level.info.minCoverAngle||
                $scope.component.object.level.info.maxCoverAngle-$scope.component.object.level.info.minCoverAngle>360){
                toastr.warning('超出范围');
                restore();
                return;
            }
            var option = {
                maxCoverAngle:$scope.component.object.level.info.maxCoverAngle
            }
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeDashboardCoverAngle(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })

        }
    }

    function enterMinValue(e){

        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger($scope.component.object.level.info.minValue)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.minValue<(-Math.pow(10,9)+1)){
                toastr.warning('小于最小临界值');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.minValue==initObject.level.info.minValue){
                return;
            }
            //判断范围
            if ($scope.component.object.level.info.maxValue<=$scope.component.object.level.info.minValue){
                toastr.warning('不能比最大值大');
                restore();
                return;
            }

            if ($scope.component.object.level.type==Type.MyProgress){
                if ($scope.component.object.level.info.minValue>$scope.component.object.level.info.progressValue){
                    toastr.warning('不能比当前值大');

                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.MyDashboard){
                if($scope.component.object.level.info.minValue>$scope.component.object.level.info.value){
                    toastr.warning('不能比当前值大');
                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.Mynum){
                //默认是数字框
                if ($scope.component.object.level.info.minValue>$scope.component.object.level.info.initValue){
                    toastr.warning('不能比当前值大');
                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.MySlideBlock){
                if ($scope.component.object.level.info.minValue>$scope.component.object.level.info.initValue){
                    toastr.warning('不能比初始值大');
                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.MyRotateImg){
                if($scope.component.object.level.info.minValue<0){
                    toastr.warning('不能小于0');
                    restore();
                    return;
                }
            }

            var option={
                minValue:$scope.component.object.level.info.minValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterMaxValue(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.maxValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.maxValue>(Math.pow(10,9)-1)){
                toastr.warning('超过最大临界值');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.maxValue==initObject.level.info.maxValue){
                return;
            }

            //判断范围
            if ($scope.component.object.level.info.maxValue<=$scope.component.object.level.info.minValue){
                toastr.warning('不能比最小值小');

                restore();
                return;
            }
            if ($scope.component.object.level.type==Type.MyProgress){
                if ($scope.component.object.level.info.maxValue<$scope.component.object.level.info.progressValue){

                    toastr.warning('不能比当前值小');

                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.Mynum){
                //默认是数字框
                if ($scope.component.object.level.info.maxValue<$scope.component.object.level.info.initValue){

                    toastr.warning('不能比当前值小');

                    restore();
                    return;
                }

            }else if($scope.component.object.level.type==Type.MySlideBlock){
                if ($scope.component.object.level.info.maxValue<$scope.component.object.level.info.initValue){
                    toastr.warning('不能比初始值小');
                    restore();
                    return;
                }
            }else if($scope.component.object.level.type==Type.MyRotateImg){
                if($scope.component.object.level.info.maxValue>360){
                    toastr.warning('不能超过360');
                    restore();
                    return;
                }
            }

            var option={
                maxValue:$scope.component.object.level.info.maxValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    function enterMinAngle(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(Number($scope.component.object.level.info.minAngle))){
                toastr.warning('输入不合法');
                restore();
                return;
            }

            if($scope.component.object.level.info.minAngle<-360||$scope.component.object.level.info.minAngle>360){
                toastr.warning('最小角度应在-360到360之间');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.minAngle==initObject.level.info.minAngle){
                return;
            }
            var option={
                minAngle:$scope.component.object.level.info.minAngle
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    function enterMaxAngle(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.maxAngle))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.maxAngle>360||$scope.component.object.level.info.maxAngle<$scope.component.object.level.info.minAngle){
                toastr.warning('最大角度不能大于360且不小于最小角');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.maxAngle==initObject.level.info.maxAngle){
                return;
            }
            var option={
                maxAngle:$scope.component.object.level.info.maxAngle
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }



    function enterMinAlert(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.lowAlarmValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.lowAlarmValue<(-Math.pow(10,9)+1)){
                toastr.warning('小于最小临界值');
                restore();
                return;
            }

            //判断是否有变化
            if ($scope.component.object.level.info.lowAlarmValue==initObject.level.info.lowAlarmValue){
                return;
            }
            var option={
                lowAlarmValue:$scope.component.object.level.info.lowAlarmValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    function enterMaxAlert(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.highAlarmValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.highAlarmValue>(Math.pow(10,9)-1)){
                toastr.warning('大于最大临界值');
                restore();
                return;
            }

            if ($scope.component.object.level.info.highAlarmValue==initObject.level.info.highAlarmValue){
                return;
            }
            var option={
                highAlarmValue:$scope.component.object.level.info.highAlarmValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterButtonMode(e){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectButtonMode=null;
        if (selectObj.type==Type.MyButton){
            selectButtonMode=$scope.component.button.buttonModeId;

        }else {
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            buttonModeId:selectButtonMode
        }
        ProjectService.ChangeAttributeButtonModeId(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);

        })
    }

    function enterNoInit(){
        console.log($scope.component.object.level.info.noInit);
        //var noInit=$scope.component.number.numberNoInit;
        var option={
            noInit:$scope.component.object.level.info.noInit
        }
        ProjectService.ChangeAttributeNoInit(option, function () {
            $scope.$emit('ChangeCurrentPage');

        })
        //$scope.component.object.level.info.noInit=!$scope.component.object.level.info.noInit;
        //$scope.$emit('ChangeCurrentPage');

    }

    function enterText(e) {
        if(e.keyCode==13){
            if ($scope.component.object.level.info.text==initObject.level.info.text){
                return;
            }

            var option = {
                text:$scope.component.object.level.info.text
            };

            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeTextContent(option, function () {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })
        }
    }

    function changeFontFamily(){
        if($scope.component.object.level.info.fontFamily==initObject.level.info.fontFamily) {
            return;
        }
        var option = {
            fontFamily:$scope.component.object.level.info.fontFamily
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })

    }
    function changeFontSize(e){
        if(e.keyCode==13){
            if(!_.isInteger(Number($scope.component.object.level.info.fontSize))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.info.fontSize<0||$scope.component.object.level.info.fontSize>150){
                toastr.warning('超出范围');
                restore();
                return;
            }
            if($scope.component.object.level.info.fontSize==initObject.level.info.fontSize) {
                return;
            }
            var option = {
                fontSize:$scope.component.object.level.info.fontSize
            };

            toastr.info('修改成功');
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function setBoldFont(){
        if($scope.component.object.level.info.fontBold=="100"){
            $scope.component.object.level.info.fontBold="bold";
        }else if($scope.component.object.level.info.fontBold=="bold"){
            $scope.component.object.level.info.fontBold="100";
        }
        var option = {
            fontBold:$scope.component.object.level.info.fontBold
        };
        ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }


    function setUnderlineFont(){
    }


    function setItalicFont(){
        if($scope.component.object.level.info.fontItalic==""){
            $scope.component.object.level.info.fontItalic="italic";
        }else if($scope.component.object.level.info.fontItalic=="italic"){
            $scope.component.object.level.info.fontItalic="";
        }
        var option = {
            fontItalic:$scope.component.object.level.info.fontItalic
        };
        ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function selectCharacterSetByIndex(index){
        var selectCharacterSet = characterSetService.selectCharacterByIndex(index);
        //console.log(selectCharacterSet);
        if(selectCharacterSet){
            $scope.component.object.level.info.fontName=selectCharacterSet.fontName;
            $scope.component.object.level.info.fontFamily=selectCharacterSet.fontFamily;
            $scope.component.object.level.info.fontSize=selectCharacterSet.fontSize;
            $scope.component.object.level.info.fontColor=selectCharacterSet.fontColor;
            $scope.component.object.level.info.fontBold=selectCharacterSet.fontBold;
            $scope.component.object.level.info.fontItalic=selectCharacterSet.fontItalic;
            $scope.component.object.level.info.boldBtnToggle=selectCharacterSet.boldBtnToggle;
            $scope.component.object.level.info.italicBtnToggle=selectCharacterSet.italicBtnToggle;

            var option={
                text:$scope.component.object.level.info.text,
                fontName:$scope.component.object.level.info.fontName,
                fontFamily:$scope.component.object.level.info.fontFamily,
                fontSize: $scope.component.object.level.info.fontSize,
                fontColor: $scope.component.object.level.info.fontColor,
                fontBold:$scope.component.object.level.info.fontBold,
                fontItalic: $scope.component.object.level.info.fontItalic,
                boldBtnToggle:$scope.component.object.level.info.boldBtnToggle,
                italicBtnToggle:$scope.component.object.level.info.italicBtnToggle
            }
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    function selectCharacterSetByName(name){
        var selectObj=ProjectService.getCurrentSelectObject();
        if (selectObj.type==Type.MyTextArea){
            var selectCharacterSet = characterSetService.selectCharacterByName(name);
            //console.log(selectCharacterSet);
            if(selectCharacterSet){
                //$scope.component.object.level.info.text=selectCharacterSet.text;
                //$scope.component.object.level.info.fontName=selectCharacterSet.fontName;

                $scope.component.object.level.info.fontName=selectCharacterSet.fontName;
                $scope.component.object.level.info.fontFamily=selectCharacterSet.fontFamily;
                $scope.component.object.level.info.fontSize=selectCharacterSet.fontSize;
                $scope.component.object.level.info.fontColor=selectCharacterSet.fontColor;
                $scope.component.object.level.info.fontBold=selectCharacterSet.fontBold;
                $scope.component.object.level.info.fontItalic=selectCharacterSet.fontItalic;
                $scope.component.object.level.info.boldBtnToggle=selectCharacterSet.boldBtnToggle;
                $scope.component.object.level.info.italicBtnToggle=selectCharacterSet.italicBtnToggle;

                var option={
                    text:$scope.component.object.level.info.text,
                    fontName:$scope.component.object.level.info.fontName,
                    fontFamily:$scope.component.object.level.info.fontFamily,
                    fontSize: $scope.component.object.level.info.fontSize,
                    fontColor: $scope.component.object.level.info.fontColor,
                    fontBold:$scope.component.object.level.info.fontBold,
                    fontItalic: $scope.component.object.level.info.fontItalic,
                    boldBtnToggle:$scope.component.object.level.info.boldBtnToggle,
                    italicBtnToggle:$scope.component.object.level.info.italicBtnToggle
                }
                ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }
        }else{
            return;
        }
    }

    function addCharacterSet(event){
        var customCharacterSet = {
            fontName:'自定义',
            text:'自定义',
            fontFamily: _.cloneDeep($scope.component.object.level.info.fontFamily),
            fontSize: _.cloneDeep($scope.component.object.level.info.fontSize),
            fontColor: _.cloneDeep($scope.component.object.level.info.fontColor),
            fontBold: _.cloneDeep($scope.component.object.level.info.fontBold),
            fontItalic: _.cloneDeep($scope.component.object.level.info.fontItalic),
            boldBtnToggle: _.cloneDeep($scope.component.object.level.info.boldBtnToggle),
            italicBtnToggle: _.cloneDeep($scope.component.object.level.info.italicBtnToggle)
        }
        characterSetService.addCharacterSet(customCharacterSet);
        event.stopPropagation();

    }

    function deleteCharacterSetByIndex(event,index){
        characterSetService.deleteCharacterSetByIndex(index);
        event.stopPropagation();
    }

    //下面是数字框的方法
    function changeNumFamily(){
        if($scope.component.object.level.info.fontFamily==initObject.level.info.fontFamily) {
            return;
        }
        var option = {
            fontFamily:$scope.component.object.level.info.fontFamily
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function setBoldNum(){
        if($scope.component.object.level.info.fontBold=="100"){
            $scope.component.object.level.info.fontBold="bold";
        }else if($scope.component.object.level.info.fontBold=="bold"){
            $scope.component.object.level.info.fontBold="100";
        }
        var option = {
            fontBold:$scope.component.object.level.info.fontBold
        };
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function setItalicNum(){
        if($scope.component.object.level.info.fontItalic==""){
            $scope.component.object.level.info.fontItalic="italic";
        }else if($scope.component.object.level.info.fontItalic=="italic"){
            $scope.component.object.level.info.fontItalic="";
        }
        var option = {
            fontItalic:$scope.component.object.level.info.fontItalic
        };
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function changeNumSize(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.fontSize<0||$scope.component.object.level.info.fontSize>150){
                toastr.warning('超出最大值');
                restore();
                return;
            }
            if($scope.component.object.level.info.fontSize==initObject.level.info.fontSize) {
                return;
            }

            var option = {
                fontSize:$scope.component.object.level.info.fontSize
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeNumOfDigits(e){
        if(e.keyCode==13){
            //console.log('enter numOfDigits');
            if($scope.component.object.level.info.numOfDigits.toString().indexOf('.')>-1){
                restore();
                return;
            }
            if($scope.component.object.level.info.numOfDigits==initObject.level.info.numOfDigits){
                return;
            }
            if($scope.component.object.level.info.numOfDigits<1||$scope.component.object.level.info.numOfDigits>10){
                restore();
                toastr.warning('超出范围');
                return;
            }
            var length=$scope.component.object.level.info.numValue.toString().length+$scope.component.object.level.info.decimalCount;
            if($scope.component.object.level.info.numOfDigits<=$scope.component.object.level.info.decimalCount||$scope.component.object.level.info.numOfDigits<length){
                restore();
                toastr.warning('超出范围');
                return;
            }
            var option={
                numOfDigits:$scope.component.object.level.info.numOfDigits
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeDecimalCount(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.decimalCount.toString().indexOf('.')>-1){
                restore();
                return;
            }
            if($scope.component.object.level.info.decimalCount==initObject.level.info.decimalCount){
                return;
            }
            //判断小数的位数是否小于0，或者是否大于字符数减numValue位数
            if($scope.component.object.level.info.decimalCount<0||($scope.component.object.level.info.decimalCount>$scope.component.object.level.info.numOfDigits-$scope.component.object.level.info.numValue.toString().length)){
                restore();
                toastr.warning('超出范围');
                return;
            }

            var option={
                decimalCount:$scope.component.object.level.info.decimalCount,
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function enterNumMode(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectNumMode=null;
        if (selectObj.type==Type.MyNum){
            selectNumMode=$scope.component.num.numModeId;

        }else {
            return;
        }
        var option={
            numModeId:selectNumMode
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeOfNum(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterSymbolMode(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectSymbolMode=null;
        if (selectObj.type==Type.MyNum){
            selectSymbolMode=$scope.component.num.symbolMode;

        }else {
            return;
        }
        var option={
            symbolMode:selectSymbolMode
        };
        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function enterFrontZeroMode(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectFrontZeroMode=null;
        //console.log('当前值',$scope.component.num.frontZeroMode);
        if (selectObj.type==Type.MyNum){
            selectFrontZeroMode=$scope.component.num.frontZeroMode;

        }else {
            return;
        }

        var option={
            frontZeroMode:selectFrontZeroMode
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterOverFlowStyle(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectOverFlowStyle=null;
        //console.log('当前值',$scope.component.num.frontZeroMode);
        if (selectObj.type==Type.MyNum){
            selectOverFlowStyle=$scope.component.num.overFlowStyle

        }else {
            return;
        }

        var option={
            overFlowStyle:selectOverFlowStyle
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeOfNum(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterNumValue(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.numValue==initObject.level.info.numValue){
                return;
            }
            if($scope.component.object.level.info.numValue<$scope.component.object.level.info.minValue||$scope.component.object.level.info.numValue>$scope.component.object.level.info.maxValue||isNaN($scope.component.object.level.info.numValue)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断输入的数字的小数位数是否超出
            var tempNumStr = $scope.component.object.level.info.numValue.toString();
            if(tempNumStr.indexOf('.')!=-1){
                var tempDecimal = tempNumStr.split(".")[1];
                //console.log('tempDecimal',tempDecimal);
                if(tempDecimal.length>$scope.component.object.level.info.decimalCount){
                    toastr.warning('小数位数超出');
                    restore();
                    return;
                }
            }

            //判断输入的数字是否小于可以显示的最大值(4位数字，不大于10000)
            var tempNumOfDigits = $scope.component.object.level.info.numOfDigits-$scope.component.object.level.info.decimalCount;
            var maxValue = Math.pow(10,tempNumOfDigits);
            //console.log('maxValue',maxValue);
            if($scope.component.object.level.info.numValue<maxValue){

                var option={
                    numValue:$scope.component.object.level.info.numValue,
                };

                ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                })
            }else{
                toastr.warning('超出范围');
                restore();
            }


        }
    }

    function changeNumAlign(){
        if($scope.component.object.level.info.align==initObject.level.info.align){
            return;
        }
        var option={
            align:$scope.component.object.level.info.align
        };
        ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);

        })
    }


    function enterKnobSize(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.knobSize))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.knobSize==initObject.level.info.knobSize){
                return;
            }


            var option={
                knobSize:$scope.component.object.level.info.knobSize
            };
            //console.log(option);

            ProjectService.ChangeAttributeKnobSize(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    function enterKnobValue(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.value))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.value==initObject.level.info.value){
                return;
            }

            //判断是否在范围内
            if ($scope.component.object.level.info.value<$scope.component.object.level.info.minValue
                ||$scope.component.object.level.info.value>$scope.component.object.level.info.maxValue){
                toastr.warning('超出范围');

                restore();
                return;
            }
            var option={
                value:$scope.component.object.level.info.value
            };

            //console.log('change attribute dashboard value',option)

            ProjectService.ChangeAttributeKnobValue(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }
    function changeOscSpacing(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.spacing==initObject.level.info.spacing){
                return;
            }
            if($scope.component.object.level.info.spacing<=0||
                $scope.component.object.level.info.spacing>$scope.component.object.level.info.width){
                toastr.warning('超出范围');
            }
            var option = {
                spacing:$scope.component.object.level.info.spacing
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeOscLinWidth(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.lineWidth==initObject.level.info.lineWidth){
                return;
            }
            if($scope.component.object.level.info.lineWidth<=0||
                $scope.component.object.level.info.lineWidth>$scope.component.object.level.info.spacing/2){
                toastr.warning('超出范围');
            }
            var option = {
                lineWidth:$scope.component.object.level.info.lineWidth
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeOscGridInitValue(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.gridInitValue==initObject.level.info.gridInitValue){
                return;
            }
            var option = {
                gridInitValue:$scope.component.object.level.info.gridInitValue
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeOscGridUnitX(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.gridUnitX==initObject.level.info.gridUnitX){
                return;
            }
            var option = {
                gridUnitX:$scope.component.object.level.info.gridUnitX
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeOscGridUnitY(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.gridUnitY==initObject.level.info.gridUnitY){
                return;
            }
            var option = {
                gridUnitY:$scope.component.object.level.info.gridUnitY
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeOscGrid(){
        if($scope.component.object.level.info.grid==initObject.level.info.grid){
                return;
        };
        //toastr.info('修改成功');
        var option= {
            grid:$scope.component.object.level.info.grid,
        };
        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeOscilloscopeForRender(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })

    }
    function enterBindBit(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.bindBit==initObject.level.info.bindBit){
                return;
            };
            if($scope.component.object.level.info.bindBit<0||$scope.component.object.level.info.bindBit>30){
                toastr.warning('超出范围');
                restore();
                return;
            }
            toastr.info('修改成功');
            var option= {
                bindBit:$scope.component.object.level.info.bindBit,
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeBindBit(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    /**
     * 输入初始值
     * @param e
     */
    function enterInitValue(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.initValue==initObject.level.info.initValue){
                return;
            }
            if($scope.component.object.level.info.initValue<$scope.component.object.level.info.minValue||
                $scope.component.object.level.info.initValue>$scope.component.object.level.info.maxValue){
                toastr.warning('超出最大或最小范围');
                restore();
                return;
            }
            var option={
              initValue:$scope.component.object.level.info.initValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeInitValue(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    function enterDateTimeMode(e){
        var selectObj=ProjectService.getCurrentSelectObject();
        var selectDateTimeModeId=null;
        if (selectObj.type==Type.MyDateTime){
            selectDateTimeModeId=$scope.component.dateTime.dateTimeModeId;
            selectRTCModeId=$scope.component.dateTime.RTCModeId;
        }else {
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            dateTimeModeId:selectDateTimeModeId,
            RTCModeId:selectRTCModeId
        };
        ProjectService.ChangeAttributeDateTimeModeId(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function changeDateTimeFontFamily(e){
        if($scope.component.object.level.info.fontFamily==initObject.level.info.fontFamily) {
            return;
        }
        var option = {
            fontFamily:$scope.component.object.level.info.fontFamily
        };

        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeDateTimeText(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function changeDateTimeFontSize(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.fontSize==initObject.level.info.fontSize) {
                return;
            }
            var option = {
                fontSize:$scope.component.object.level.info.fontSize
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeDateTimeText(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }

    }

    function changeGroupAlign(){
        var option = {
            align :$scope.component.group.alignModeId
        };
        var oldOperate = ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeGroupAlign(option,function(oldOperate){
            $scope.$emit('ChangeCurrentPage',oldOperate);
        });
    }

    function _getRandomColor(){
        var r = _.random(64, 255);
        var g = _.random(64, 255);
        var b = _.random(64, 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    }

}]);