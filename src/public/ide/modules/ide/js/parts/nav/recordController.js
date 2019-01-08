/**
 * 1.获取canvas图片，使用requestAnimationFrame计时器根据帧率节点计时，
 * 2.获取浏览器帧率，根据每秒帧数计算时间间隔，以此时间间隔插入图片生成webm格式视频，保持录制的时间和视频时长相吻合。
 */

ide.controller('recordCtrl',['$scope','$filter','$interval',function($scope,$filter,$interval){
    $scope.record = {
            showRecord:false,
            recordStatus:false,
            openRecord:openRecord,
            startRecord:startRecord,
            endRecord:endRecord,
            prompt:'点击开始录制',
            duration:0,
            generateStatus:false,
            timerStatus:false
    };

    $scope.timer=null;
    getFps();

    function openRecord(){
        $scope.record.showRecord = !$scope.record.showRecord;
    }

    function startRecord(){
        document.getElementById('record-download').style.display = 'none';
        $scope.recordElement = document.getElementById('simulator-canvas');
        if(!$scope.recordElement||!$scope.fps){
            $scope.record.prompt = '请先运行simulator';
            $scope.record.recordStatus = false;
            return;
        }
        $scope.record.recordStatus = true;
        $scope.record.prompt = '正在录制中...';
        $scope.record.timerStatus = true;
        $scope.timer = $interval(function(){
            $scope.record.duration +=1000;
        },1000);
        recordVideo();
    }

    function endRecord(){
        $scope.record.prompt = '正在生成中，请稍等...';
        $scope.record.recordStatus = false;
        $interval.cancel($scope.timer);
        $scope.record.timerStatus = false;
        $scope.record.duration = null;
        document.getElementById('start-record').style.display = 'none';
    }

    var video;

    //保存获取到的canvas图片
    var recordVideo = function(){
        if(!video){video=new Whammy.Video()}

        //根据当前帧率计算间隔时间
        var duration = 1000/$scope.fps;
        if($scope.record.recordStatus){
            video.add($scope.recordElement,duration);
            requestAnimationFrame(recordVideo);
        }else{
            finalizeVideo();
        }
    };

    //生成webm视频
    function finalizeVideo(){
        video.compile(false, function(output){
            var url = URL.createObjectURL(output);
            var download = document.getElementById('record-download');
            var fileName = "simulator_"+getDate();

            document.getElementById('record-prompt').innerText=fileName;
            download.style.display = '';
            download.href = url;
            download.setAttribute('download',fileName+'.webm');
            video = null;
            document.getElementById('start-record').style.display = 'block';
        });
    }

    //获取时间戳
    function getDate() {
        return $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
    }

    //浏览器fps
    function getFps(){
        var requestAnimationFrame =
            window.requestAnimationFrame || //Chromium
            window.webkitRequestAnimationFrame || //Webkit
            window.mozRequestAnimationFrame || //Mozilla Geko
            window.oRequestAnimationFrame || //Opera Presto
            window.msRequestAnimationFrame || //IE Trident?
            function(callback) { //Fallback function
                window.setTimeout(callback, 1000/60);
            };
        var fps,last,offset,step;

        fps = 0;
        last = Date.now();

        step = function(){
            offset = Date.now() - last;
            fps += 1;
            if( offset >= 1000 ){
                last += offset;
                $scope.fps = fps;
                fps = 0;
            }
            requestAnimationFrame( step );
        };
        step();
    }

}]);