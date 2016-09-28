/**
 * Created by ChangeCheng on 16/9/8.
 */
var curVideo = document.createElement('video');
curVideo.setAttribute('muted',true);
var VideoSource = {};
VideoSource.videoObj = curVideo;
VideoSource.setVideoSrc = function (src) {
    if(curVideo.src != src && src && src!==''){
        curVideo.src = src;
        return true;
    }else{
        return false;
    }
};
VideoSource.play = function () {
    curVideo.play();
};

VideoSource.pause = function () {
    curVideo.pause();
};

module.exports = VideoSource;