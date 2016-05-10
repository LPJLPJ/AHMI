/**
 * Created by shenaolin on 16/3/10.
 */

ide.controller('AttributeCtrl', function ($scope,$timeout,
                                     ProjectService,
                                     Type, Preference,
										  ResourceService,
                                          characterSetService,
                                     CanvasService) {

	var initObject=null;

	$scope.$on('GlobalProjectReceived', function () {
		initUserInterface();
		initProject();

	});
	function initUserInterface(){
		$scope.component={
			type:'',
			onAttributeChanged:onAttributeChanged,

            page:{
                enterImage:enterBackgroundImage,
                selectImage:'demo20.png',

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
                enterButtonMode:enterButtonMode,
                enterNormalImage:enterNormalImage,
                enterPressImage:enterPressImage,
                normalImage:'blank.png',
                pressImage:'blank.png'

            },
            buttonGroup:{
                enterInterval:enterInterval,
                enterButtonCount:enterButtonCount,
                enterArrange:enterArrange

            },
            number:{
                numberNoInit:false,
                enterInitValue:enterInitValue,
                enterNoInit:enterNoInit

            },

            progress:{
                backgroundImage:'blank.png',
                progressImage:'blank.png',
                enterBottomImage:enterBottomImage,
                enterProgressImage:enterProgressImage,
                enterProgressValue:enterProgressValue,
                enterArrange:enterArrange
            },
            dashboard:{
                backgroundImage:'blank.png',
                pointerImg:'blank.png',
                enterDashboardValue:enterDashboardValue,
                enterPointerLength:enterPointerLength
            },
            textArea:{
                enterText:enterText,
                changeFontFamily:changeFontFamily,
                changeFontSize:changeFontSize,
                changeFontColor:changeFontColor,
                setBoldFont:setBoldFont,
                setUnderlineFont:setUnderlineFont,
                setItalicFont:setItalicFont,
                selectCharacterSetByIndex:selectCharacterSetByIndex,
                addCharacterSet:addCharacterSet,
                deleteCharacterSetByIndex:deleteCharacterSetByIndex
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
            enterMinAlert:enterMinAlert,
            enterMaxAlert:enterMaxAlert,
			restore:restore
		};
	}

	function initProject(){

		ProjectService.getProjectTo($scope);

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
            console.log('keke2');
            console.log(op);
            enterFontStyle(op);
        });

	}

	function updateImageList(){
		$scope.component.images=ResourceService.getAllImages();
        $scope.component.baseUrl = ResourceService.getResourceUrl()
        console.log($scope.component.baseUrl)
		var blankImage={
			id:'blank.png',
			name:'空白',
		}

		$scope.component.images.unshift(blankImage);

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
                    break;
                case Type.MyPage:
                    //调整Page的背景图
                    if ($scope.component.object.level.backgroundImage==''){
                        $scope.component.page.selectImage='blank.png';
                    }else {
                        $scope.component.page.selectImage=$scope.component.object.level.backgroundImage;
                    }
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
                    break;

                case Type.MyProgress:
                    //Progress的方向
                    $scope.component.progress.arrangeModel=$scope.component.object.level.info.arrange;

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
            }

        })





	}

	function restore(){
		$timeout(function () {
			$scope.component.object= _.cloneDeep(initObject);
		})
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
			var integer=parseInt($scope.component.object.level.info.width);
			if (!_.isInteger(integer)||integer<1){
				toastr.warning('输入不合法');
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
		if (op.name=='component.object.level.backgroundColor'){

			if (initObject.level.backgroundColor==op.value){
				return;
			}
            var oldOperate=ProjectService.SaveCurrentOperate();

			var option={
				color:op.value
			};
			ProjectService.ChangeAttributeBackgroundColor(option, function () {
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
        }else if ($scope.component.object.type==Type.MySubLayer){
            selectImage=$scope.component.subLayer.selectImage;
        }
        var option={
            image: _.cloneDeep(selectImage)
        }
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

    function enterInterval(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.interval))||_.isInteger(parseInt($scope.component.object.level.info.interval))<0){
                toastr.warning('输入不合法');
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
            if (!_.isInteger(parseInt($scope.component.object.level.info.count))||_.isInteger(parseInt($scope.component.object.level.info.interval))<0){
                toastr.warning('输入不合法');
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

        }else {
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



    function enterDashboardValue(e){
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

            ProjectService.ChangeAttributeDashboardValue(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterPointerLength(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.pointerLength))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.pointerLength==initObject.level.info.pointerLength){
                return;
            }

            //判断是否在范围内
            //if ($scope.component.object.level.info.value<$scope.component.object.level.info.minValue
            //    ||$scope.component.object.level.info.value>$scope.component.object.level.info.maxValue){
            //    toastr.warning('超出范围');
            //
            //    restore();
            //    return;
            //}
            var option={
                pointerLength:$scope.component.object.level.info.pointerLength
            };
            console.log(option);

            ProjectService.ChangeAttributeDashboardPointerLength(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);

            })

        }
    }

    function enterMinValue(e){

        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.minValue))){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.maxValue==initObject.level.info.minValue){
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
            }else {
                //默认是数字框
                if ($scope.component.object.level.info.minValue>$scope.component.object.level.info.initValue){

                    toastr.warning('不能比当前值大');


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
            }else {
                //默认是数字框
                if ($scope.component.object.level.info.maxValue<$scope.component.object.level.info.initValue){

                    toastr.warning('不能比当前值小');

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

    function enterMinAlert(e){
        if (e.keyCode==13){
            //判断输入是否合法
            if (!_.isInteger(parseInt($scope.component.object.level.info.lowAlarmValue))){
                toastr.warning('输入不合法');
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
            //判断是否有变化
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

    /**
     * 输入number的初始值
     * @param e
     */
    function enterInitValue(e){


        if (e.keyCode==13){
            //判断输入是否合法
            console.log(_.isNumber($scope.component.object.level.info.initValue));
            if (!_.toNumber($scope.component.object.level.info.initValue)&&_.toNumber($scope.component.object.level.info.initValue)!=0){
                toastr.warning('输入不合法');
                restore();
                return;
            }
            //判断是否有变化
            if ($scope.component.object.level.info.initValue==initObject.level.info.initValue){
                return;
            }
            //判断范围
            if ($scope.component.object.level.info.initValue<$scope.component.object.level.info.minValue){
                toastr.warning('不能比最小值小');

                restore();
                return;
            }
            if ($scope.component.object.level.info.initValue>$scope.component.object.level.info.maxValue){
                toastr.warning('不能比最大值大');

                restore();
                return;
            }
            var option={
                initValue:$scope.component.object.level.info.initValue
            };
            var oldOperate=ProjectService.SaveCurrentOperate();

            ProjectService.ChangeAttributeValue(option, function () {
                var selectObj=ProjectService.getCurrentSelectObject();

                var fabNumber=ProjectService.getFabricObject(selectObj.level.id,true);
                ProjectService.SyncLevelFromFab(selectObj.level,fabNumber);
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

            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
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
            if($scope.component.object.level.info.fontSize==initObject.level.info.fontSize) {
                return;
            }
            var option = {
                fontSize:$scope.component.object.level.info.fontSize
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function changeFontColor(e){
        if(e.keyCode==13){
            if($scope.component.object.level.info.fontColor==initObject.level.info.fontColor) {
                return;
            }
            var option = {
                fontColor:$scope.component.object.level.info.fontColor
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }
    function setBoldFont(){
        $scope.component.object.level.info.boldBtnToggle=!$scope.component.object.level.info.boldBtnToggle;

        if($scope.component.object.level.info.boldBtnToggle){
            $scope.component.object.level.info.fontBold="bold";
            var option = {
                fontBold: $scope.component.object.level.info.fontBold,
                boldBtnToggle:$scope.component.object.level.info.boldBtnToggle
            }

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }else{
            $scope.component.object.level.info.fontBold="100";
            var option = {
                fontBold: $scope.component.object.level.info.fontBold,
                boldBtnToggle:$scope.component.object.level.info.boldBtnToggle
            };

            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }


    function setUnderlineFont(){
    }


    function setItalicFont(){
        $scope.component.object.level.info.italicBtnToggle=!$scope.component.object.level.info.italicBtnToggle;
        if($scope.component.object.level.info.italicBtnToggle){
            $scope.component.object.level.info.fontItalic="italic";
            var option={
                fontItalic:$scope.component.object.level.info.fontItalic,
                italicBtnToggle: $scope.component.object.level.info.italicBtnToggle
            }
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }else{
            $scope.component.object.level.info.fontItalic=" ";
            var option={
                fontItalic:$scope.component.object.level.info.fontItalic,
                italicBtnToggle: $scope.component.object.level.info.italicBtnToggle
            };
            var oldOperate=ProjectService.SaveCurrentOperate();
            ProjectService.ChangeAttributeTextContent(option, function (oldOperate) {
                $scope.$emit('ChangeCurrentPage',oldOperate);
            })
        }
    }

    function selectCharacterSetByIndex(index){
        var selectCharacterSet = characterSetService.selectCharacterByIndex(index);
        //console.log(selectCharacterSet);
        if(selectCharacterSet){
            //$scope.component.object.level.info.text=selectCharacterSet.text;
            $scope.component.object.level.info.fontFamily=selectCharacterSet.fontFamily;
            $scope.component.object.level.info.fontSize=selectCharacterSet.fontSize;
            $scope.component.object.level.info.fontColor=selectCharacterSet.fontColor;
            $scope.component.object.level.info.fontBold=selectCharacterSet.fontBold;
            $scope.component.object.level.info.fontItalic=selectCharacterSet.fontItalic;
            $scope.component.object.level.info.boldBtnToggle=selectCharacterSet.boldBtnToggle;
            $scope.component.object.level.info.italicBtnToggle=selectCharacterSet.italicBtnToggle;

            var option={
                text:$scope.component.object.level.info.text,
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

    function addCharacterSet(){
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

    }

    function deleteCharacterSetByIndex(index){
        characterSetService.deleteCharacterSetByIndex(index);
    }



});