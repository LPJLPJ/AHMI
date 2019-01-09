/**
 * 1.获取canvas图片，使用requestAnimationFrame计时器根据帧率节点计时，
 * 2.获取浏览器帧率，根据每秒帧数计算时间间隔，以此时间间隔插入图片生成webm格式视频，保持录制的时间和视频时长相吻合。
 */

ide.controller('recordCtrl', ['$scope', '$filter', '$interval', function ($scope, $filter, $interval) {

    var requestAnimationFrame, video;
    initRequestFunction();

    $scope.$on('InitRecord', function () {
        initRecord()
    });

    function initRecord() {
        $scope.record = {
            showRecord: false,
            recordStatus: false,
            openRecord: openRecord,
            startRecord: startRecord,
            endRecord: endRecord,
            prompt: '点击开始按钮即可录制',
            timerValue: 0
        };
        document.getElementById('record-download').style.display = 'none';
    }

    $scope.$on('CloseRecord', function () {
        if ($scope.record.recordStatus) {
            endRecord();
        }
    });

    function openRecord() {
        $scope.record.showRecord = !$scope.record.showRecord;
    }

    function startRecord() {
        document.getElementById('record-download').style.display = 'none';
        $scope.recordElement = document.getElementById('simulator-canvas');
        console.log($scope.recordElement);
        if (!$scope.recordElement) {
            $scope.record.prompt = '请先运行simulator';
            $scope.record.recordStatus = false;
            return;
        }
        $scope.record.recordStatus = true;
        $scope.record.prompt = '正在录制中···';
        $scope.recordTimer = $interval(function () {
            $scope.record.timerValue += 1000;
        }, 1000);

        recording();
    }

    function endRecord() {
        $scope.record.prompt = '正在生成中，请稍等···';
        $scope.record.recordStatus = false;
        $interval.cancel($scope.recordTimer);
        $scope.record.timerValue = 0;
        document.getElementById('start-record').style.display = 'none';
    }

    //canvas转图片
    function recording() {
        if (!video) {
            video = new Whammy.Video()
        }
        var startTime = Date.now();
        var recordVideo = function () {
            if ($scope.record.recordStatus) {
                var now = Date.now();
                var duration = now - startTime || 16;//帧数时间差
                video.add($scope.recordElement, duration);
                startTime = now;
                requestAnimationFrame(recordVideo);
            } else {
                finalizeVideo();
            }
        };
        recordVideo();
    }

    //生成webm视频
    function finalizeVideo() {
        video.compile(false, function (output) {
            var download = document.getElementById('record-download');
            var fileUrl = URL.createObjectURL(output);
            var fileName = "simulator_" + getDate();

            document.getElementById('record-prompt').innerText = fileName;
            download.style.display = '';
            download.href = fileUrl;
            download.setAttribute('download', fileName + '.webm');
            document.getElementById('start-record').style.display = 'block';
            video = null;
        });
    }

    //获取时间
    function getDate() {
        return $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
    }

    //requestAnimationFrame兼容
    function initRequestFunction() {
        requestAnimationFrame =
            window.requestAnimationFrame || //Chromium
            window.webkitRequestAnimationFrame || //Webkit
            window.mozRequestAnimationFrame || //Mozilla Geko
            window.oRequestAnimationFrame || //Opera Presto
            window.msRequestAnimationFrame || //IE Trident?
            function (callback) { //Fallback function
                window.setTimeout(callback, 1000 / 60);
            };
    }

}]);