$(function () {
    $(window).scroll(function () {
        var top = $(document).scrollTop();
        if (top > 50) {
            $('.update-log-headline').addClass('nav-fixed');
        } else {
            $('.update-log-headline').removeClass('nav-fixed');
        }
    });

    //日志发布
    (function($){
        var addLogContent = $('#add-log-content');
        var logContentList = $('#log-content-list');

        addLogContent.click(function(){
            var logType = $('#log-content-type').val(),logContent = $('#log-content-text').val();
            if(logContent!=''){
                var contentTpl = "<li><span class='log-type-bar'>["+logType+"]：</span><span>"+logContent+"</span></li>"
            }else{
                alert('请填写内容');
                return;
            }
            logContentList.append(contentTpl);
            $('#log-content-text').val("");
        })
    })(jQuery)


});