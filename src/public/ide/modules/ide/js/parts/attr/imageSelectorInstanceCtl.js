/**
 * Created by Zzen1sS on 24/3/2016
 */

ide.filter('paging',function () {
    return function (lists,currentIndex,count) {
        var end = count*currentIndex,
            start = end - count ;
        return lists && lists.slice(start,end);
    }
});

ide.controller('ImageSelectorInstanceCtl', ['$rootScope','$scope','$uibModal','$timeout', '$uibModalInstance','ProjectService','Type', 'ResourceService','widgetInfo','TexService','$filter','uploadingHelperService',function ($rootScope,$scope,$uibModal,$timeout, $uibModalInstance,ProjectService,Type, ResourceService,widgetInfo,TexService,$filter,uploadingHelperService) {

    $scope.images = ResourceService.getAllImagesAndTemplates();
    $scope.images.unshift({
        name:'---',
        src:''
    });
    $scope.basicUrl = ResourceService.getResourceUrl();

    //edit by lixiang
    $scope.$on('colorpicker-submit', function (e,op) {
        enterColor(op);
    });
    $scope.$on('colorpicker-closed',function(e,op){
        restore();
    });
    $scope.$on('colorpicker-shown',function(e,op){
        cloneSlice();
    });


    $scope.canInputText = false;
    $scope.canAddNewSlice = false;
    $scope.canBatchAddImg = false;
    $scope.disableEditImg = false;
    $scope.disableEditColor = false;
    $scope.sliceNum = 0;
    $scope.processingVideoImg = false;
    switch (widgetInfo.type){
        case Type.MyButton:
            initConfigure(false,false,2,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyProgress:
            if((widgetInfo.objInfo.progressModeId==='1'/*||widgetInfo.objInfo.progressModeId==='3'*/)&&(widgetInfo.index==1||widgetInfo.index==2||widgetInfo.index==3)){
                initConfigure(false,false,1,widgetInfo.tex,true,true,false,false);
            }else{
                initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            }
            if(widgetInfo.tex.name==='光标纹理'){
                initConfigure(false,false,1,widgetInfo.tex,true,false,true,false);
            }
            break;
        case Type.MySlide:
            initConfigure(true,true,2,widgetInfo.tex,false,false,false,true);
            break;
        case Type.MyAlphaSlide:
            initConfigure(true,false,2,widgetInfo.tex,false,false,false,true);
            if(widgetInfo.tex.name==='底色'){
                initConfigure(false,false,1,widgetInfo.tex,true,true,false,false);
            }
            break;
        case Type.MyNumber:
            initConfigure(false,false,13,widgetInfo.tex,false,false,false,false);
            break;
        case Type.MyDashboard:
            initConfigure(false,false,2,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyTextArea:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyNum:
            initConfigure(false,false,1,widgetInfo.tex,false,false,false,false);
            break;
        case Type.MyOscilloscope:
            initConfigure(false,false,2,widgetInfo.tex,false,false,false,false);
            break;
        case Type.MyKnob:
            initConfigure(false,false,2,widgetInfo.tex,false,false,false,false);
            break;
        case Type.MyImage:
            initConfigure(false,false,1,widgetInfo.tex,false,false,false,false);
            break;
        case Type.MySwitch:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyRotateImg:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MySlideBlock:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyAnimation:
            initConfigure(true,false,1,widgetInfo.tex,false,false,false,true,true);
            break;
        case Type.MyTexNum:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyDateTime:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyButtonGroup:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyTexTime:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyChart:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            if(widgetInfo.tex.name==='线'){
                initConfigure(false,false,1,widgetInfo.tex,true,true,false,false);
            }
            break;
        case Type.MyAlphaImg:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        case Type.MyGrid:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false,false);
            break;
        default:
            initConfigure(true,false,1,widgetInfo.tex,false,false,false,false);
            break;
    }

    // $scope.addSlice = function () {
    //     $scope.tex.slices.push(TexService.getDefaultSlice());
    // };

    //last edtor: liuhuan 2017/8/17
    //从当前行的下一行插入默认新行
    $scope.addSlice = function () {
        var start = ($scope.currentNum-1)*10 +  $scope.curIndex +1;
        $scope.tex.slices.splice(start,0,TexService.getDefaultSlice());
        calPageNum();
    };

    //向上一行插入
    $scope.addSlicePrev=function(){
        var start = ($scope.currentNum-1)*10 +  $scope.curIndex;
        if($scope.curIndex===0){
            $scope.tex.slices.unshift(TexService.getDefaultSlice());
        }else{
            $scope.tex.slices.splice(start,0,TexService.getDefaultSlice());
        }
        $scope.curIndex+=1;
        calPageNum();
    };

    $scope.removeSlice = function (index) {
        if($scope.tex.slices.length==1){
            toastr.warning('至少有一张纹理');
            return;
        }else{
            $scope.tex.slices.splice(index,1);
        }
        calPageNum();
    };


    $scope.save = function () {
        if(validation){
            $uibModalInstance.close($scope.tex);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.disableColorInput = function(slice,e){
        if(slice.imgSrc){
            slice.color='rgba(0,0,0,0)';
        }else{
            slice.color=_getRandomColor();
        }
    };

    //开机动画批量插入 add by tang
    $scope.batchSelect=function(){
        var imgResources=ResourceService.getAllImagesAndTemplates()
            ,selectImgs=[];

        var modalInstance = $uibModal.open({
            templateUrl: 'batchSelectorModal.html',
            size :"md",
            controller: ['$scope','$uibModalInstance',function($scope,$uibModalInstance){
                init();

                function init(){
                    $scope.component = {
                        checkClasses:checkClasses,
                        selectAll:selectAll,
                        invertSelect:invertSelect,
                        selectResource:selectResource,
                        stopProp:stopProp,
                        add:add,
                        checkByClass:checkByClass,
                        currentClass:null,
                        classes:[],
                        classCheckStatus:false,
                        classReg:/#([\s\S]+)\_(\d+)+#/
                    };
                    $scope.imgResources = _.cloneDeep(imgResources);
                    $scope.batchSelectList = [];
                }


                function selectAll(){//全选
                    for(var i=0;i<$scope.imgResources.length;i++){
                        $scope.imgResources[i].select=true;
                    }
                }

                function invertSelect(){//反选
                    for(var i=0;i<$scope.imgResources.length;i++){
                        $scope.imgResources[i].select = $scope.imgResources[i].select ? !$scope.imgResources[i].select : true;
                    }
                }

                function selectResource(i){//点击tr选择
                    $scope.imgResources[i].select = $scope.imgResources[i].select ? !$scope.imgResources[i].select : true;
                }

                function stopProp(e){//阻止点击冒泡
                    e.stopPropagation();
                }

                function add(){//添加
                    var images;
                    for(var i=0;i<$scope.imgResources.length;i++){
                        if($scope.imgResources[i].select){
                            delete $scope.imgResources[i].select;
                            selectImgs.push($scope.imgResources[i]);
                        }
                    }


                    if(checkImg(selectImgs)){
                        images=selectImgs.sort(function (a, b) {
                            var x= a.name,y= b.name;
                            var reg1 = /[^\(\)]+(?=\))/g;
                            var reg2 = $scope.component.classReg;
                            var i1= parseInt(x.match(reg1) || x.match(reg2)[2]);
                            var i2= parseInt(y.match(reg1) || y.match(reg2)[2]);
                            return i1-i2;
                        });

                        $uibModalInstance.close(images);

                    }else{
                        alert("队列中含有不符合格式的命名文件");
                        $uibModalInstance.close();
                    }
                }



                function checkImg(imgs){
                    for(var i=0;i<imgs.length;i++){
                        var imgName=imgs[i].name;
                        if(!imgName.match(/[^\(\)]+(?=\))/g) && !imgName.match($scope.component.classReg)){
                            return false;
                        }
                    }
                    return true;
                }


                function checkClasses() {
                    if ($scope.component.classCheckStatus) {
                        var reg = $scope.component.classReg,
                            check,
                            classes,
                            imgArr = imgResources.filter(function (img) {
                                return img.name.match(reg);
                            });

                        check = {};
                        imgArr.forEach(function (img) {
                            var checkResult = img.name.match(reg)[1];
                            if (!check[checkResult]) {
                                check[checkResult] = true;
                            }
                        });

                        classes = [];
                        for (var key in check) {
                            classes.push(key);
                        }
                        $scope.component.classes = classes;
                    }else {
                        $scope.component.classes = [];
                        $scope.imgResources = _.cloneDeep(imgResources);
                    }
                }
                
                function checkByClass() {
                    var result = $scope.component.currentClass,
                        reg = new RegExp("#"+result+"+\\_(\\d+)+#");
                    $scope.imgResources = imgResources.filter(function (img) {
                        return img.name.match(reg);
                    });
                }


                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
        }],
            resolve: {}
        });

        modalInstance.result.then(function (imgs) {
            if(imgs){//插入图片
                if(imgs.length){
                    imgs = imgs.map(function (img) {
                        return {
                            name:'defaultSlice',
                            imgSrc:img.src,
                            color:'rgba(0,0,0,0)'
                        }
                    });

                    $scope.tex.slices = $scope.tex.slices.concat(imgs);
                    calPageNum();
                }else{
                    alert("未选择图片");
                    return;
                }
            }
        }, function () {
            $uibModalInstance.dismiss('cancel');
        });

    };




    //开机动画从视频插入
    $scope.addByVideo=function(){

        var modalInstance = $uibModal.open({
            templateUrl: 'addByVideoModal.html',
            size :"md",
            controller: ['$scope','$uibModalInstance','ResourceService',function($scope,$uibModalInstance,ResourceService){
                init();

                function init(){
                    // $scope.currentPageNum = 1
                    // $scope.pageNUm = 1
                    // $scope.totalImgNum = 0
                    // $scope.progress = 0
                    // $scope.renderedImgs = []
                    // $scope.currentPageImgIdx = []
                    $scope.numInSinglePage = 20
                    $scope.ui = {
                        currentPageNum:1,
                        pageNum:1,
                        currentPageImgIdx:[],
                        renderedImgs:[],
                        progress:{
                            current:0,
                            total:1000
                        },
                        widthHeightRatio:1
                    }
                }

                function showPage(index){
                    var start = (index-1) * $scope.numInSinglePage
                    var end = start + $scope.numInSinglePage - 1
                    end = Math.min(end,$scope.ui.renderedImgs.length-1)
                    var idx = []
                    for(var i=start;i<=end;i++){
                        idx.push(i)
                    }
                    $scope.ui.currentPageImgIdx = idx
                }

                $scope.renderVideoToImgs = function(videoFile){
                    if(!videoFile){
                        return
                    }
                    $scope.videoName = videoFile.name
                    var video = document.createElement('video')
                    video.setAttribute('preload','auto')
                    document.body.appendChild(video)
                    video.style.position='absolute'
                    video.style.top = 0
                    var url = URL.createObjectURL(videoFile)
                    video.src = url
                    ResourceService.waitUntilVideoLoad(video,function(){
                        ResourceService.convertVideoToImages(video,function(curIdx,total){
                            $scope.ui.progress = {
                                current:curIdx+1,
                                total:total
                            }
                            $scope.$apply()
                        },function(imgs){
                            //update image ratio
                            
                            $scope.ui.widthHeightRatio = (video.videoWidth/video.height).toFixed(2)
                            $scope.ui.renderedImgs = imgs
                            $scope.ui.pageNum = Math.ceil($scope.ui.renderedImgs.length/$scope.numInSinglePage)
                            $scope.$apply(function(){
                                showPage(1)
                            })
                            
                            URL.revokeObjectURL(url)
                        })
                    })
                    
                    
                }

                $scope.changeNum = function(direction){
                    var nextPageNum = $scope.ui.currentPageNum + (!!direction ? 1 : -1)
                    if(nextPageNum > $scope.ui.pageNum||nextPageNum < 1){
                        return
                    }
                    $scope.ui.currentPageNum = nextPageNum
                    showPage(nextPageNum)
                }

                $scope.deleteImg = function(imgIdx){
                    $scope.ui.renderedImgs.splice(imgIdx,1)
                    $scope.ui.pageNum = Math.ceil($scope.ui.renderedImgs.length/$scope.numInSinglePage)
                }

                $scope.confirm = function(){
                    $uibModalInstance.close({videoName:$scope.videoName,imgs:$scope.ui.renderedImgs})
                }


                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
        }],
            resolve: {}
        });

        modalInstance.result.then(function (imgsInfo) {
            var imgs = imgsInfo.imgs
            var videoName = imgsInfo.videoName
            videoName = videoName.split('.')[0]
            if(imgs&&imgs.length){//插入图片
                var files = imgs.map(function(img,i){
                    return ResourceService.blobToFile(ResourceService.dataURItoBlob(img),videoName+'-'+(i+1)+'.png')
                })
                var count = files.length
                $scope.processingVideoImg = true
                var i = 0
                function uploadFileHanlder(i,cb){
                    var translatedFile = uploadingHelperService.transFile(files[i]);
                    uploadingHelperService.upload(files[i],translatedFile,function(translatedFile){
                        //success
                        $scope.tex.slices.push({
                            name:'defaultSlice',
                            imgSrc:translatedFile.src,
                            color:'rgba(0,0,0,0)'
                        })
                        $scope.$apply(function(){
                            calPageNum();
                        })
                        cb && cb(null)
                        // count--
                        // if(count==0){
                        //     //finish uploading
                        //     // calPageNum();
                        //     $scope.$apply(function(){
                        //         $scope.processingVideoImg = false
                        //     })
                        //     $rootScope.$broadcast('ResourceUpdate');
                        // }
                    },function(e){
                       
                        if(e&&e.data&&e.data.errMsg){
                            switch (e.data.errMsg){
                                case 'not logged in':
                                    toastr.info('请重新登录');
                                    break;
                                case 'user not valid':
                                    toastr.info('请登录');
                                    break;
                                default:

                            }
                        }else{
                            toastr.error('上传出错！')
                        }
                        cb && cb(e)
                       
                        
                    },function(e){
                        translatedFile.progress = Math.round(1.0 * e.loaded / e.total * 100) + '%';
                    });
                }

                var uploadConvertedImg = function(){
                    uploadFileHanlder(i,function(err){
                        if(err){
                            console.log
                        }
                        if(i+1<count){
                            i++
                            uploadConvertedImg()
                        }else{
                            //finish
                            $scope.$apply(function(){
                                $scope.processingVideoImg = false
                            })
                            $rootScope.$broadcast('ResourceUpdate');
                        }
                    })
                }

                uploadConvertedImg()

                
                

                
            }
        }, function () {
            $uibModalInstance.dismiss('cancel');
        });

        

    };

    $scope.downloadFile = function (index) {
        var imgSrc=$scope.tex.slices[index].imgSrc;
        if(imgSrc!=''){
            var img=ResourceService.getResourceByUrl(imgSrc);
            if(img!=null){
                var projectId = ProjectService.getProjectId();
                ResourceService.downloadFile(img,projectId);
            }else{
                toastr.warning('未找到图片');
            }
        }else{
            toastr.warning('未使用图片资源');
        }
    };



    function initConfigure(_canAddNewSlice,_canInputText,_sliceNum,_tex,_disableEditName,_disableEditImg,_disableEditColor,_canBatchAddImg,_canAddFromVideo){
        $scope.canAddNewSlice = _canAddNewSlice;
        $scope.canInputText = _canInputText;
        $scope.sliceNum = _sliceNum;
        $scope.tex = _tex;
        $scope.currentTextList = _tex.slices.slice(0,10);
        $scope.disableEditName = _disableEditName;
        $scope.disableEditImg = _disableEditImg;
        $scope.disableEditColor = _disableEditColor;
        $scope.canBatchAddImg = _canBatchAddImg;
        $scope.canAddFromVideo = _canAddFromVideo||false
        //分页
        $scope.currentNum = 1;
        $scope.pageIndex = 10;
        calPageNum();
    }
    
    function calPageNum() {
        $scope.pageNum = Math.ceil($scope.tex.slices.length/10);
    }

    //edit by lixiang
    function cloneSlice(){
        //console.log('open success');
        $scope.tempSlices= _.cloneDeep($scope.tex.slices);
        //console.log($scope.tempSlices);
    }

    function enterColor(op) {
        if(op.name='selectSlice.color'){
        }
    }
    function restore(){
        $timeout(function () {
            $scope.tex.slices= _.cloneDeep($scope.tempSlices);
        });
    }

    function _getRandomColor(){
        var r = _.random(64, 255);
        var g = _.random(64, 255);
        var b = _.random(64, 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    }

    $scope.curIndex = 0;
    $scope.selectItem = function(index){
        $scope.curIndex = index;
    };

    var restoreValue;
    var validation=true;
    //保存旧值
    $scope.store=function(th){
        restoreValue=th.slice.name;
    };

    //回复旧值
    $scope.restore = function (th) {
        th.slice.name=restoreValue;
    };

    //验证新值
    $scope.enterName=function(th){
        //console.log("$scope.canInputText:",$scope.canInputText);

        //判断是否和初始一样
        if (th.slice.name===restoreValue){
            return;
        }
        //输入有效性检测
        validation=ProjectService.inputValidate(th.slice.name);
        if(!validation){
            $scope.restore(th);
            return;
        }
        toastr.info('修改成功');
        restoreValue=th.slice.name;
    };

    //验证enter键
    $scope.enterPress=function(e,th){
        if (e.keyCode==13){
            // angular.element($(th)).trigger("blur");
            // angular.element(document.getElementById('texBar')).trigger("click");
            // console.log(angular.element($("#texBar")));
            // console.log(angular.element(document.getElementById('texBar')));
            $scope.enterName(th);


        }
    };

    $scope.changeNum = function (n) {
        if (n && $scope.currentNum < $scope.pageNum){
            $scope.currentNum ++;
        } else if (n === 0 && $scope.currentNum > 1) {
            $scope.currentNum --;
        }
    }
}]);