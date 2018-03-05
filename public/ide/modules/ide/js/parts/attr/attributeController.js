

ide.controller('AttributeCtrl',['$scope','$rootScope','$timeout',
    'ProjectService',
    'Type', 'Preference',
    'ResourceService',
    'characterSetService',
    'CanvasService','AnimationService','UserTypeService', function ($scope,$rootScope,$timeout,
                                     ProjectService,
                                     Type, Preference,
										  ResourceService,
                                          characterSetService,
                                     CanvasService,AnimationService,UserTypeService) {

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
                selectImage:'demo20.png'
            },

            layer:{
                enterShowSubLayer:enterShowSubLayer,
                selectModel:null
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
                highlightModeId:'0',
                enterButtonMode:enterButtonMode,
                enterArrange:enterArrange
            },
            buttonGroup:{
                enterInterval:enterInterval,
                enterButtonCount:enterButtonCount,
                enterArrange:enterArrange,
                highlightModeId:'0'
            },
            progress:{
                progressModeId:'0',
                enableAnimationModeId:'0',
                progressModes:[
                    {id:'0',name:'普通进度条'},
                    {id:'1',name:'变色进度条'},
                    {id:'3',name:'多色进度条'}
                ],
                thresholdModeId:'1',
                thresholdModes:[
                    {id:'1',name:'两段色'},
                    {id:'2',name:'三段色'}
                ],
                enterProgressValue:enterProgressValue,
                enterArrange:enterArrange,
                enterCursor:enterCursor,
                enterThresholdMode:enterThresholdMode,
                enterThresholdValue1:enterThresholdValue1,
                enterThresholdValue2:enterThresholdValue2
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
                    {wise:'0',name:'逆时针'}
                   // {wise:'2',name:'双向'}
                ],
                enableAnimationModeId:'0',
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
                selectCharacterSetByIndex:selectCharacterSetByIndex,
                selectCharacterSetByName:selectCharacterSetByName,
                addCharacterSet:addCharacterSet,
                deleteCharacterSetByIndex:deleteCharacterSetByIndex,
                enterArrange:enterArrange
            },
            num:{
                numModeId:'0',//目前无用
                enableAnimationModeId:'0',
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
                changeNumOfDigits:changeNumOfDigits,
                changeDecimalCount:changeDecimalCount,
                enterNumMode:enterNumMode,
                enterSymbolMode:enterSymbolMode,
                enterFrontZeroMode:enterFrontZeroMode,
                enterOverFlowStyle:enterOverFlowStyle,

                enterNumValue:enterNumValue,
                changeNumAlign:changeNumAlign,
                enterArrange:enterArrange
            },
            texNum:{
                numModeId:'0',//目前无用
                enableAnimationModeId:'0',
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
                changeNumOfDigits:changeNumOfDigits,
                changeDecimalCount:changeDecimalCount,
                enterNumMode:enterNumMode,
                enterSymbolMode:enterSymbolMode,
                enterFrontZeroMode:enterFrontZeroMode,
                enterOverFlowStyle:enterOverFlowStyle,

                enterNumValue:enterNumValue,
                changeNumAlign:changeNumAlign,

                enterCharacterW:enterCharacterW,
                enterCharacterH:enterCharacterH
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
            switchWidget:{
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
                highlightModeId:'0',
                enterDateTimeMode:enterDateTimeMode,
                enterArrange:enterArrange,
            },
            //图层时间
            texTime:{
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
                highlightModeId:'0',
                enterDateTimeMode:enterDateTimeMode,
                enterArrange:enterArrange,
                enterCharacterW:enterCharacterW,
                enterCharacterH:enterCharacterH
            },
            //滑块
            slideBlock:{
                enterInitValue:enterInitValue,
                enterArrange:enterArrange
            },
            //视频
            video:{
                source:[
                    {id:'CVBS',name:'CVBS'},
                    {id:'HDMI',name:'HDMI'}
                ],
                scale:[
                    {id:'0',name:'非原比例'},
                    {id:'1',name:'原比例'}
                ],
                changeVideoSource:changeVideoSource,
                changeVideoScale:changeVideoScale
            },
            group:{
                align:[
                    {id:'top',name:'上对齐'},
                    {id:'bottom',name:'下对齐'},
                    {id:'left',name:'左对齐'},
                    {id:'right',name:'右对齐'}
                ],
                alignModeId:null,
                changeGroupAlign:changeGroupAlign
            },
            highlightModes:[
                {id:'0',name:'启用高亮'},
                {id:'1',name:'禁用高亮'}
            ],
            enableAnimationModes:[
                {id:'0',name:'启用动画'},
                {id:'1',name:'关闭动画'}
            ],
            enterName:enterName,
			enterColor:enterColor,
            enterFontText:enterFontText,
            enterFontSize:enterFontSize,
            enterFontFamily:enterFontFamily,
            enterFontBold:enterFontBold,
            enterFontItalic:enterFontItalic,
			enterX:enterX,
			enterY:enterY,
            enterAbsoluteX:enterAbsoluteX,
            enterAbsoluteY:enterAbsoluteY,
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
            enterHighlightMode:enterHighlightMode,
            enterEnableAnimationMode:enterEnableAnimationMode,
            enterSpacing:enterSpacing
		};
        $scope.animationsDisabled=UserTypeService.getAnimationAuthor()
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
            src:'',
            name:'空白'
        };
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
                    if((typeof $scope.component.object.level.transition)!=='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    break;
                case Type.MyPage:
                    //调整Page的背景图
                    $scope.component.page.selectImage=$scope.component.object.level.backgroundImage;
                    if((typeof $scope.component.object.level.transition)!=='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
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
                    if(!$scope.component.object.level.info.thresholdModeId){
                        selectObject.level.info.thresholdModeId='1';
                        selectObject.level.info.threshold1=null;
                        selectObject.level.info.threshold2=null;
                        $scope.component.progress.thresholdModeId='1';
                    }else{
                        $scope.component.progress.thresholdModeId=$scope.component.object.level.info.thresholdModeId;
                    }
                    if($scope.component.object.level.info.enableAnimation===undefined){
                        selectObject.level.info.enableAnimation=false;
                        $scope.component.progress.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation===false){
                        $scope.component.progress.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation===true){
                        $scope.component.progress.enableAnimationModeId='0'
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition===undefined){
                        selectObject.level.transition={};
                        $scope.component.object.level.transition={};
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition.duration===undefined){
                        selectObject.level.transition.duration=0;
                        $scope.component.object.level.transition.duration=0;
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
                    if($scope.component.object.level.info.enableAnimation===undefined){
                        selectObject.level.info.enableAnimation=false;
                        $scope.component.dashboard.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation===false){
                        $scope.component.dashboard.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation===true){
                        $scope.component.dashboard.enableAnimationModeId='0'
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition===undefined){
                        selectObject.level.transition={};
                        $scope.component.object.level.transition={};
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition.duration===undefined){
                        selectObject.level.transition.duration=0;
                        $scope.component.object.level.transition.duration=0;
                    }
                    break;
                case Type.MyTextArea:
                    $scope.component.textArea.arrangeModel=$scope.component.object.level.info.arrange;
                    break;
                case Type.MyButton:
                    $scope.component.button.buttonModeId=$scope.component.object.level.buttonModeId;
                    $scope.component.button.arrangeModel=$scope.component.object.level.info.arrange;
                    if($scope.component.object.level.info.disableHighlight===undefined){
                        selectObject.level.info.disableHighlight=false;
                        $scope.component.button.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight===false){
                        $scope.component.button.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight===true){
                        $scope.component.button.highlightModeId='1';
                    }
                    break;
                case Type.MyButtonGroup:
                    $scope.component.buttonGroup.arrangeModel=$scope.component.object.level.info.arrange;
                    if($scope.component.object.level.info.disableHighlight===undefined){
                        selectObject.level.info.disableHighlight=false;
                        $scope.component.buttonGroup.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight===false){
                        $scope.component.buttonGroup.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight===true){
                        $scope.component.buttonGroup.highlightModeId='1';
                    }
                    break;
                case Type.MyNum:
                    $scope.component.num.numModeId=$scope.component.object.level.info.numModeId;
                    $scope.component.num.symbolMode=$scope.component.object.level.info.symbolMode;
                    $scope.component.num.frontZeroMode=$scope.component.object.level.info.frontZeroMode;
                    $scope.component.num.overFlowStyle=$scope.component.object.level.info.overFlowStyle;
                    $scope.component.num.arrangeModel=$scope.component.object.level.info.arrange;
                    if((typeof $scope.component.object.level.transition)!='object'){
                        ProjectService.AddAttributeTransition(_.cloneDeep($scope.defaultTransition));
                        $scope.component.object.level.transition=_.cloneDeep($scope.defaultTransition);
                    }
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    if($scope.component.object.level.info.enableAnimation===undefined){
                        selectObject.level.info.enableAnimation=false;
                        $scope.component.num.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation==false){
                        $scope.component.num.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation==true){
                        $scope.component.num.enableAnimationModeId='0'
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition===undefined){
                        selectObject.level.transition={};
                        $scope.component.object.level.transition={};
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition.duration===undefined){
                        selectObject.level.transition.duration=0;
                        $scope.component.object.level.transition.duration=0;
                    }
                    break;
                case Type.MyTexNum:
                    $scope.component.texNum.numModeId=$scope.component.object.level.info.numModeId;
                    $scope.component.texNum.symbolMode=$scope.component.object.level.info.symbolMode;
                    $scope.component.texNum.frontZeroMode=$scope.component.object.level.info.frontZeroMode;
                    $scope.component.texNum.overFlowStyle=$scope.component.object.level.info.overFlowStyle;
                    $scope.component.texNum.arrangeModel=$scope.component.object.level.info.arrange;
                    $scope.component.transitionName=$scope.component.object.level.transition.name;
                    if($scope.component.object.level.info.enableAnimation==false){
                        $scope.component.texNum.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation==true){
                        $scope.component.texNum.enableAnimationModeId='0'
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.info.enableAnimation===undefined){
                        selectObject.level.info.enableAnimation=false;
                        $scope.component.texNum.enableAnimationModeId='1';
                    }else if($scope.component.object.level.info.enableAnimation==false){
                        $scope.component.texNum.enableAnimationModeId='1'
                    }else if($scope.component.object.level.info.enableAnimation==true){
                        $scope.component.texNum.enableAnimationModeId='0'
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition===undefined){
                        selectObject.level.transition={};
                        $scope.component.object.level.transition={};
                    }
                    //added at 2017/12/5 by LH
                    if($scope.component.object.level.transition.duration===undefined){
                        selectObject.level.transition.duration=0;
                        $scope.component.object.level.transition.duration=0;
                    }
                    break;
                case Type.MyDateTime:
                    $scope.component.dateTime.arrangeModel=$scope.component.object.level.info.arrange;
                    $scope.component.dateTime.dateTimeModeId=$scope.component.object.level.info.dateTimeModeId;
                    $scope.component.dateTime.RTCModeId = $scope.component.object.level.info.RTCModeId;
                    if($scope.component.object.level.info.disableHighlight==undefined){
                        selectObject.level.info.disableHighlight=false;
                        $scope.component.dateTime.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight==false){
                        $scope.component.dateTime.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight==true){
                        $scope.component.dateTime.highlightModeId='1';
                    }
                    break;
                case Type.MyTexTime:
                    $scope.component.texTime.arrangeModel=$scope.component.object.level.info.arrange;/////////////////
                    $scope.component.texTime.dateTimeModeId=$scope.component.object.level.info.dateTimeModeId;
                    $scope.component.texTime.RTCModeId = $scope.component.object.level.info.RTCModeId;
                    if($scope.component.object.level.info.disableHighlight==undefined){
                        selectObject.level.info.disableHighlight=false;
                        $scope.component.texTime.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight==false){
                        $scope.component.texTime.highlightModeId='0';
                    }else if($scope.component.object.level.info.disableHighlight==true){
                        $scope.component.texTime.highlightModeId='1';
                    }
                    break;
                case Type.MySlideBlock:
                    $scope.component.slideBlock.arrangeModel=$scope.component.object.level.info.arrange;
                    break;
                case Type.MyVideo:
                    $scope.component.video.sourceId = $scope.component.object.level.info.source;
                    break;
                case Type.MySlide:
                    //兼容旧的图层控件
                    if(selectObject.level.info.fontFamily===undefined){
                        selectObject.level.info.fontFamily="宋体";
                        selectObject.level.info.fontSize=20;
                        selectObject.level.info.fontColor='rgba(0,0,0,1)';
                        selectObject.level.info.fontBold="100";
                        selectObject.level.info.fontItalic='';
                    }
                    break;
                case Type.MySwitch:
                    //兼容旧的开关控件
                    if(selectObject.level.info.text===undefined){
                        selectObject.level.info.text='';
                        selectObject.level.info.fontFamily="宋体";
                        selectObject.level.info.fontSize=20;
                        selectObject.level.info.fontColor='rgba(0,0,0,1)';
                        selectObject.level.info.fontBold="100";
                        selectObject.level.info.fontItalic='';
                    }
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
        for(var i=0;i<$scope.component.transitionMode.length;i++){
            if($scope.component.transitionMode[i].name==$scope.component.transitionName){
                option.show=$scope.component.transitionMode[i].show;
                break;
            }
        }
        ProjectService.ChangeAttributeTransition(option);

    }
    function changeTransitionDur(e){
        if(e.keyCode==13){
            if($scope.component.object.level.transition.duration>5000||$scope.component.object.level.transition.duration<0){
                toastr.warning('超出限制');
                restore();
                return;
            }
            if(!_.isInteger($scope.component.object.level.transition.duration)){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if($scope.component.object.level.transition.duration==initObject.level.transition.duration){
                return;
            }
            var option={
                duration:$scope.component.object.level.transition.duration
            };
            toastr.info('修改成功');
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
	function enterName(e,th){
		if (e.keyCode==13){

			//判断是否和初始一样
			if ($scope.component.object.level.name==initObject.level.name){
                th.component.object.level.name=$scope.component.object.level.name;
				return;
			}
            var validation=ProjectService.inputValidate($scope.component.object.level.name);
            if(!validation){
                restore();
                return;
            }
            toastr.info('修改成功');
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
            var xCoor = Number($scope.component.object.level.info.left);
			if (!_.isInteger(xCoor)){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if(xCoor<-2000||xCoor>2000){
               toastr.warning('超出画布范围');
               restore();
               return;
            }
			//判断是否有变化
			if (xCoor==initObject.level.info.left){
				toastr.warning('未改变值'+$scope.component.object.level.info.left);
				return;
			}
			var option={
				left:xCoor
			};

			ProjectService.ChangeAttributePosition(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);
                var currentWidgetInfo=$scope.component.object.level.info;
                ProjectService.setAbsolutePosition(currentWidgetInfo);
			})

		}
	}

	function enterY(e){
		if (e.keyCode==13){
			//判断输入是否合法
            var yCoor = Number($scope.component.object.level.info.top);
			if (!_.isInteger(yCoor)){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if(yCoor<-2000||yCoor>2000){
               toastr.warning('超出范围');
               restore();
               return;
            }
			//判断是否有变化
			if (yCoor==initObject.level.info.top){
				return;
			}
			var option={
				top:yCoor
			};

            ProjectService.ChangeAttributePosition(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);
                var currentWidgetInfo=$scope.component.object.level.info;
                ProjectService.setAbsolutePosition(currentWidgetInfo);
			})

		}
	}

    //add by tang 2018/01/15
    function enterAbsoluteX(e){
        var absoluteX = Number($rootScope.position.absoluteX);
        var xCoor=$rootScope.position.absoluteX-$rootScope.position.currentLayerInfo.left;
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(absoluteX)){
                toastr.warning('输入不合法');
                $rootScope.position.absoluteX=$rootScope.position.initAbsoluteX;
                return;
            }
            if(xCoor<-2000||xCoor>2000){
                toastr.warning('超出画布范围');
                $rootScope.position.absoluteX=$rootScope.position.initAbsoluteX;
                return;
            }
            //判断是否有变化
            if (absoluteX==$rootScope.position.initAbsoluteX){
                toastr.warning('未改变值'+$rootScope.position.absoluteX);
                return;
            }
            var option={
                left:xCoor
            };

            ProjectService.ChangeAttributePosition(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterAbsoluteY(e){
        if (e.keyCode==13){
            //判断输入是否合法
            var absoluteY = Number($rootScope.position.absoluteY);
            var yCoor=$rootScope.position.absoluteY-$rootScope.position.currentLayerInfo.top;
            if (!_.isInteger(absoluteY)){
                toastr.warning('输入不合法');
                $rootScope.position.absoluteY=$rootScope.position.initAbsoluteY;
                return;
            }
            if(yCoor<-2000||yCoor>2000){
                toastr.warning('超出画布范围');
                $rootScope.position.absoluteY=$rootScope.position.initAbsoluteY;
                return;
            }
            //判断是否有变化
            if (absoluteY==$rootScope.position.initAbsoluteY){
                toastr.warning('未改变值'+$rootScope.position.absoluteY);
                return;
            }
            var option={
                top:yCoor
            };

            ProjectService.ChangeAttributePosition(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

	function enterWidth(e){
		if (e.keyCode==13){
			//判断输入是否合法
            var width = Number($scope.component.object.level.info.width);
			if (!_.isInteger(width)){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if(width<1||width>2000){
                toastr.warning('超出范围');
                restore();
                return;
            }
			//判断是否有变化
			if (width==initObject.level.info.width){
				console.log('没有变化');
				return;
			}
			var option={
				width:width
			};

			ProjectService.ChangeAttributeSize(option, function (oldOperate) {
				$scope.$emit('ChangeCurrentPage',oldOperate);
			})
		}
	}
	function enterHeight(e){
		if (e.keyCode==13){
			//判断输入是否合法
            var height = Number($scope.component.object.level.info.height);
			if (!_.isInteger(height)){
				toastr.warning('输入不合法');
				restore();
				return;
			}
            if(height<1||height>2000){
                toastr.warning('超出范围');
                restore();
                return;
            }
			//判断是否有变化
			if (height==initObject.level.info.height){
				console.log('没有变化');
				return;
			}
			var option={
				height:height
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
        for(i=0;i<colorValue.length-1;i++){
            if(colorValue[i]>255||colorValue[i]<0|| !_.isInteger(Number(colorValue[i]))){
                toastr.warning('格式错误');
                restore();
                return;
            }
        }
        if(colorValue.length===4){
            var a = colorValue[colorValue.length-1];
            if(a<0||a>1){
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
            _changeTextAttr(option);
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

    /**
     * 更改文本内容
     * @param e
     */
	function enterFontText(e){
        if(e.keyCode==13){
            var fontText = $scope.component.object.level.info.text;
            if (fontText==initObject.level.info.text){
                return;
            }
            var textLength = fontText.length;
            if(textLength>20){
                toastr.warning('字数最大20');
                restore();
                return;
            }
            var option = {
                text:fontText
            };

            _changeTextAttr(option)
        }
    }

    /**
     * 更改字体大小
     * @param e
     */
	function enterFontSize(e){
        if(e.keyCode==13){
            var fontSize = $scope.component.object.level.info.fontSize;
            if(!_.isInteger(Number(fontSize))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if(fontSize<0||fontSize>150){
                toastr.warning('超出范围');
                restore();
                return;
            }
            if(fontSize==initObject.level.info.fontSize) {
                return;
            }
            var option = {
                fontSize:fontSize
            };
            _changeTextAttr(option);
        }
    }

    /**
     * 更改字体
     * @param e
     */
    function enterFontFamily(e){
        var fontFamily = $scope.component.object.level.info.fontFamily;
        if(fontFamily==initObject.level.info.fontFamily) {
            return;
        }
        var option = {
            fontFamily:fontFamily
        };
        _changeTextAttr(option);
    }

    /**
     * 更改字体粗体
     * @param e
     */
    function enterFontBold(e){
        var fontBold = $scope.component.object.level.info.fontBold;
        if(fontBold==="100"){
            fontBold="bold";
        }else if(fontBold==="bold"){
            fontBold="100";
        }
        var option = {
            fontBold:fontBold
        };
        _changeTextAttr(option);
    }

    /**
     * 更改字体斜体
     * @param e
     */
    function enterFontItalic(e){
        var fontItalic = $scope.component.object.level.info.fontItalic;
        if(fontItalic===""){
            fontItalic="italic";
        }else if(fontItalic==="italic"){
            fontItalic="";
        }
        var option = {
            fontItalic:fontItalic
        };
        _changeTextAttr(option);
    }

    /**
     * 根据控件类型，更改控件字体属性
     * @param option
     * @private
     */
    function _changeTextAttr(option) {
        var oldOperate=ProjectService.SaveCurrentOperate();
        var selectObj=ProjectService.getCurrentSelectObject();
        switch(selectObj.type){
            case Type.MyTextArea:
                ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyDateTime:
                ProjectService.ChangeAttributeDateTimeText(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyNum:
                ProjectService.ChangeAttributeNumContent(option,function(oldOperate){
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MySwitch:
            case Type.MySlide:
            case Type.MyButton:
                ProjectService.ChangeAttributeFontStyle(option,function(oldOperate){
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            default:
                console.error('not match in change font color!');
                break;
        }
    }

    function enterHighlightMode(){
        var selectObj = ProjectService.getCurrentSelectObject();
        var selectHighlightMode=null;
        if(selectObj.type==Type.MyButton){
            selectHighlightMode=$scope.component.button.highlightModeId;
        }else if(selectObj.type==Type.MyButtonGroup){
            selectHighlightMode=$scope.component.buttonGroup.highlightModeId;
        }else if(selectObj.type==Type.MyDateTime){
            selectHighlightMode=$scope.component.dateTime.highlightModeId;
        }else if(selectObj.type==Type.MyTexTime){
            selectHighlightMode=$scope.component.texTime.highlightModeId;
        }
        var option = {
            highlightMode:selectHighlightMode
        };
        ProjectService.ChangeAttributeHighLightMode(option,function(oldOperate){
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    function enterEnableAnimationMode(){
        var selectObj = ProjectService.getCurrentSelectObject();
        var selectEnableAnimationMode;
        if(selectObj.type==Type.MyDashboard){
            selectEnableAnimationMode=$scope.component.dashboard.enableAnimationModeId;
        }else if(selectObj.type==Type.MyProgress){
            selectEnableAnimationMode=$scope.component.progress.enableAnimationModeId;
        }else if(selectObj.type==Type.MyNum){
            selectEnableAnimationMode=$scope.component.num.enableAnimationModeId;
        }else if(selectObj.type===Type.MyTexNum){
            selectEnableAnimationMode=$scope.component.texNum.enableAnimationModeId;
        }
        var option = {
            enableAnimationModeId:selectEnableAnimationMode
        }
        ProjectService.ChangeEnableAnimationMode(option,function(oldOperate){
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
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
            if(!selectImage){
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
        var selectThresholdModeId=null;
        if(selectObj.type==Type.MyProgress){
            selectCursor=$scope.component.progress.cursor;
            selectModeId=$scope.component.progress.progressModeId;
            selectThresholdModeId=$scope.component.progress.thresholdModeId;
        }else{
            return;
        }
        var oldOperate=ProjectService.SaveCurrentOperate();
        var option={
            cursor:selectCursor,
            progressModeId:selectModeId,
            thresholdModeId:selectThresholdModeId
        }
        ProjectService.ChangeAttributeCursor(option, function () {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    /**
     * 在多色进度条模式下，更改阈值模式
     * @param e
     */
    function enterThresholdMode(e){
        var selectThresholdMode = $scope.component.progress.thresholdModeId;
        $scope.component.progress.threshold2=null;
        var  option = {
            thresholdModeId:selectThresholdMode
        };
        var oldOperate= ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeProgressThreshold(option,function(){
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

    /**
     *输入阈值1
     * @param e
     */
    function enterThresholdValue1(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.threshold1==initObject.level.info.threshold1){
                return;
            }
            if($scope.component.object.level.info.threshold1<$scope.component.object.level.info.minValue||
               $scope.component.object.level.info.threshold1>$scope.component.object.level.info.maxValue){
                toastr.warning('超出范围');
                restore();
                return;
            }
            if($scope.component.object.level.info.threshold2){
                if($scope.component.object.level.info.threshold1>$scope.component.object.level.info.threshold2){
                    toastr.warning('超出范围');
                    restore();
                    return;
                }
            }
            var option = {
                threshold1:$scope.component.object.level.info.threshold1
            };
            var oldOperate = ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeProgressThreshold(option,function(){
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function enterThresholdValue2(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.threshold2==initObject.level.info.threshold2){
                return;
            }
            if($scope.component.object.level.info.threshold2<$scope.component.object.level.info.minValue||
                $scope.component.object.level.info.threshold2>$scope.component.object.level.info.maxValue){
                toastr.warning('超出范围');
                restore();
                return;
            }
            if($scope.component.object.level.info.threshold1){
                if($scope.component.object.level.info.threshold2<$scope.component.object.level.info.threshold1){
                    toastr.warning('超出范围');
                    restore();
                    return;
                }
            }
            var option = {
                threshold2:$scope.component.object.level.info.threshold2
            };
            var oldOperate = ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeProgressThreshold(option,function(){
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
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
        } else if(selectObj.type==Type.MyNum){
            selectArrange=$scope.component.num.arrangeModel;
        }else if(selectObj.type==Type.MyTextArea){
            selectArrange=$scope.component.textArea.arrangeModel;
        }else if(selectObj.type==Type.MyButton){
            selectArrange=$scope.component.button.arrangeModel;
        }else if(selectObj.type=Type.MyDateTime){
            selectArrange=$scope.component.dateTime.arrangeModel;
        }else if(selectObj.type=Type.MyTexTime){
            selectArrange=$scope.component.texTime.arrangeModel;
        }else{
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
            }else if($scope.component.object.level.type==Type.MyNum||$scope.component.object.level.type==Type.MyTexNum){
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
            var maxValue = $scope.component.object.level.info.maxValue,
                type = $scope.component.object.level.type;

            //判断输入是否合法
            if (!_.isInteger(parseInt(maxValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            if(maxValue>(Math.pow(10,9)-1)){
                toastr.warning('超过最大临界值');
                restore();
                return;
            }
            //判断是否有变化
            if (maxValue===initObject.level.info.maxValue){
                return;
            }

            //判断范围
            if (maxValue<=$scope.component.object.level.info.minValue){
                toastr.warning('不能比最小值小');
                restore();
                return;
            }
            if (type===Type.MyProgress){
                if (maxValue<$scope.component.object.level.info.progressValue){
                    toastr.warning('不能比当前值小');
                    restore();
                    return;
                }
            }else if(type===Type.MyNum||type==Type.MyTexNum){
                //默认是数字框
                if (maxValue<$scope.component.object.level.info.numValue){
                    toastr.warning('不能比当前值小');
                    restore();
                    return;
                }
                var numOfDigits = $scope.component.object.level.info.numOfDigits;
                var limit = Math.pow(10,numOfDigits)-1;
                if(maxValue>limit){
                    toastr.warning('超出范围');
                    restore();
                    return;
                }

            }else if(type===Type.MySlideBlock){
                if (maxValue<$scope.component.object.level.info.initValue){
                    toastr.warning('不能比初始值小');
                    restore();
                    return;
                }
            }else if(type===Type.MyRotateImg){
                if(maxValue>360){
                    toastr.warning('不能超过360');
                    restore();
                    return;
                }
            }

            var option={
                maxValue:maxValue
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

    //输入字符间距
    function enterSpacing(e){
        if (e.keyCode==13){
            //判断输入是否合法
            var spacing = $scope.component.object.level.info.spacing,
                fontSize = $scope.component.object.level.info.fontSize;
            if (!_.isInteger(spacing)){
                toastr.warning('输入不合法');
                restore();
                return;
            }

            if(spacing===initObject.level.info.spacing){
                return;
            }

            if(spacing<-fontSize||spacing>fontSize){
                toastr.warning('超出范围');
                restore();
                return;
            }

            var option={
                spacing:spacing
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            // console.log("$scope.component.object",$scope.component.object)
            if($scope.component.object.type==="MyNum"){

            }
            switch ($scope.component.object.type){
                case "MyNum":
                    ProjectService.ChangeAttributeNumContent(option, function () {
                        $scope.$emit('ChangeCurrentPage',oldOperate);

                    })
                    break;
                case "MyDateTime":
                    console.log("MyDateTimeEnterSpacing");
                    ProjectService.ChangeAttributeOfDateTime(option, function () {
                        $scope.$emit('ChangeCurrentPage',oldOperate);

                    })
                    break;
                default:
                    console.log("error!");
            }



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

    function changeNumOfDigits(e){
        if(e.keyCode==13){
            var type = $scope.component.object.level.type;
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
            switch(type){
                case Type.MyNum:
                    ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
                case Type.MyTexNum:
                    ProjectService.ChangeAttributeTexNumContent(option,function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
            }
        }
    }
    function changeDecimalCount(e){
        if(e.keyCode==13){
            var type = $scope.component.object.level.type;
            if($scope.component.object.level.info.decimalCount.toString().indexOf('.')>-1){
                restore();
                return;
            }
            if($scope.component.object.level.info.decimalCount==initObject.level.info.decimalCount){
                return;
            }
            //判断小数的位数是否小于0，或者是否大于字符数减numValue位数
            if($scope.component.object.level.info.decimalCount<0||($scope.component.object.level.info.decimalCount>=$scope.component.object.level.info.numOfDigits)){
                restore();
                toastr.warning('超出范围');
                return;
            }

            var option={
                decimalCount:$scope.component.object.level.info.decimalCount,
            }
            var oldOperate=ProjectService.SaveCurrentOperate();

            switch (type){
                case Type.MyNum:
                    ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
                case Type.MyTexNum:
                    ProjectService.ChangeAttributeTexNumContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
            }
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
        var type = selectObj.type;

        var option={};
        var oldOperate=ProjectService.SaveCurrentOperate();
        switch (type){
            case Type.MyNum:
                option.symbolMode = $scope.component.num.symbolMode;
                ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyTexNum:
                option.symbolMode = $scope.component.texNum.symbolMode;
                ProjectService.ChangeAttributeTexNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
        }

    }
    function enterFrontZeroMode(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var option={};

        var oldOperate=ProjectService.SaveCurrentOperate();
        switch (selectObj.type){
            case Type.MyNum:
                option.frontZeroMode = $scope.component.num.frontZeroMode;
                ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyTexNum:
                option.frontZeroMode = $scope.component.texNum.frontZeroMode;
                ProjectService.ChangeAttributeTexNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
        }
    }

    function enterOverFlowStyle(){
        var selectObj=ProjectService.getCurrentSelectObject();
        var option={};

        var oldOperate=ProjectService.SaveCurrentOperate();
        switch (selectObj.type){
            case Type.MyNum:
                option.overFlowStyle = $scope.component.num.overFlowStyle;
                ProjectService.ChangeAttributeOfNum(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyTexNum:
                option.overFlowStyle = $scope.component.texNum.overFlowStyle;
                ProjectService.ChangeAttributeOfTexNum(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
        }

    }

    function enterNumValue(e){
        if(e.keyCode==13){
            var type = $scope.component.object.level.type;
            var numValue = $scope.component.object.level.info.numValue;
            var minValue = $scope.component.object.level.info.minValue;
            var maxValue = $scope.component.object.level.info.maxValue;
            var numValueStr = numValue.toString();
            if(numValue==initObject.level.info.numValue){
                return;
            }
            if(numValue<minValue||numValue>maxValue||isNaN(numValue)||(numValueStr.indexOf('.')!=-1)){
                toastr.warning('输入不合法');
                restore();
                return;
            }

            var option={
                numValue:numValue,
            };
            switch (type){
                case Type.MyNum:
                    ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
                case Type.MyTexNum:
                    ProjectService.ChangeAttributeTexNumContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
            }
        }
    }

    function changeNumAlign(){
        var type = $scope.component.object.level.type;
        if($scope.component.object.level.info.align==initObject.level.info.align){
            return;
        }
        var option={
            align:$scope.component.object.level.info.align
        };
        switch (type){
            case Type.MyNum:
                ProjectService.ChangeAttributeNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyTexNum:
                ProjectService.ChangeAttributeTexNumContent(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
        }
    }

    function enterCharacterW(e){
        if(e.keyCode===13){
            var characterW = $scope.component.object.level.info.characterW;
            var type = $scope.component.object.level.type;
            if(!_.isInteger(characterW)||characterW<=0){
                toastr.warning('输入不合法');
                return;
            }
            if(characterW<1||characterW>2000){
                toastr.warning('超出范围');
                return;
            }
            var option={
                characterW:characterW,
            };
            switch(type){
                case Type.MyTexTime:
                    ProjectService.ChangeAttributeTexTimeContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
                case Type.MyTexNum:
                    ProjectService.ChangeAttributeTexNumContent(option,function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
            }

        }
    }
    function enterCharacterH(e){
        if(e.keyCode===13){
            var characterH = $scope.component.object.level.info.characterH;
            var type = $scope.component.object.level.type;
            if(!_.isInteger(characterH)||characterH<=0){
                toastr.warning('输入不合法');
                return;
            }
            if(characterH<1||characterH>2000){
                toastr.warning('超出范围');
                return;
            }
            var option={
                characterH:characterH,
            };
            switch(type){
                case Type.MyTexTime:
                    ProjectService.ChangeAttributeTexTimeContent(option, function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
                case Type.MyTexNum:
                    ProjectService.ChangeAttributeTexNumContent(option,function (oldOperate) {
                        $scope.$emit('ChangeCurrentPage',oldOperate);
                    });
                    break;
            }
        }
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
            if($scope.component.object.level.info.bindBit<0||$scope.component.object.level.info.bindBit>31){
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
    };

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
        }else if(selectObj.type==Type.MyTexTime){
            selectDateTimeModeId=$scope.component.texTime.dateTimeModeId;
            selectRTCModeId=$scope.component.texTime.RTCModeId;
        }else {
            return;
        }

        var oldOperate=ProjectService.SaveCurrentOperate();

        var option={
            dateTimeModeId:selectDateTimeModeId,
            RTCModeId:selectRTCModeId
        };
        switch(selectObj.type){
            case Type.MyTexTime:
                ProjectService.ChangeAttributeTexTimeModeId(option, function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
            case Type.MyDateTime:
                ProjectService.ChangeAttributeDateTimeModeId(option,function (oldOperate) {
                    $scope.$emit('ChangeCurrentPage',oldOperate);
                });
                break;
        }
    }

    function changeGroupAlign(){
        var option = {
            align :$scope.component.group.alignModeId
        };
        // var oldOperate = ProjectService.SaveCurrentOperate();
        ProjectService.ChangeAttributeGroupAlign(option);
    }

    function _getRandomColor(){
        var r = _.random(64, 255);
        var g = _.random(64, 255);
        var b = _.random(64, 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    }
    function changeVideoSource(e){
        var selectVideoSource=$scope.component.video.sourceId;
        var option = {
            source:selectVideoSource
        }
        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.changeVideoSource(option, function (oldOperate) {
           $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }
    function changeVideoScale(e){
        // if (selectObj.type==Type.scare){
        var selectVideoScale=$scope.component.video.scaleId;
        // }else {
        //     return;
        // }
        var option = {
            scale:selectVideoScale
        }
        var oldOperate=ProjectService.SaveCurrentOperate();
        ProjectService.changeVideoScale(option, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage',oldOperate);
        })
    }

}]);