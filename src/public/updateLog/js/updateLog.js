$(function () {
    //导航栏
    $(window).scroll(function () {
        var top = $(document).scrollTop();
        if (top > 50) {
            $('.update-log-headline').addClass('nav-fixed');
        } else {
            $('.update-log-headline').removeClass('nav-fixed');
        }
    });

    (function($){

        /**
         * 发布日志
         */
        var releaseLogContent = $('#release-log-content');
        var logContentList = $('#release-log-list');
        releaseLogContent.on('click','#add-log-content',function(){
            var logType = $('#release-log-type').val(),logContent = $('#release-log-content-text').val();
            if(logContent!=''){
                var contentTpl = "<li><span class='log-type-bar'>"+logType+"</span><span class='release-log-value'>"+logContent+"</span><span class='delete-release-list'>&times;</span></li>"
            }else{
                alert('请填写内容');
                return;
            }
            logContentList.append(contentTpl);
            $('#release-log-content-text').val("");
        });

        releaseLogContent.on('click','.delete-release-list',function(){
            $(this).parent().remove();
        });

        $(document).on('click','#confirm-release',function(){
            var title = $('#release-log-title').val();
            var explain = $('#release-log-explain').val();
            var content = [];

            if(title == ''){
                alert('请填写标题');
                return;
            }

            logContentList.find('li').each(function(index){
                var contentType = $(this).find('.log-type-bar').text();
                var contentText = $(this).find('.release-log-value').text();
                var contentItem = {
                    type:contentType,
                    content:contentText
                };
                content.push(JSON.stringify(contentItem));
            });

            if(explain==''&&!content.length){
                alert('请填写内容');
                return;
            }

            var data = {
                title:title,
                explain:explain,
                content:content
            };

            releaseUpdateLog(data)
        });

        function releaseUpdateLog(logData){
            $.ajax({
                url:'/update-log/save',
                type:'post',
                data:logData,
                success:function(data){
                    if(data == 'ok'){
                        alert('发布成功');
                        location.reload();
                    }
                },
                error:function(err){
                    console.log(err)
                }
            })
        }

        /**
         * 删除日志
         */
        $('.delete-log').on('click',function(){
            var confirmDelete = confirm("确定要删除吗");
            if(confirmDelete){
                var logItem = $(this).parents('.manage-log-content__item');
                var logId = logItem.attr('data-id');
                $.ajax({
                    url:'/update-log/delete',
                    type:'post',
                    data:{logId:logId},
                    success:function(data){
                        if(data == 'ok'){
                            logItem.remove();
                        }
                    },
                    error:function(err){
                        alert('删除失败');
                        console.log(err)
                    }
                })
            }
        });

        /**
         * 修改日志
         */
        $('.edit-log').on('click',function(){
            var logId = $(this).parents('.manage-log-content__item').attr('data-id');
            window.open('/update-log/edit?id='+logId)
        });

        $('#confirm-edit').on('click',function(){
            var title = $('#release-log-title').val();
            var explain = $('#release-log-explain').val();
            var id =releaseLogContent.attr('data-id');
            var content = [];

            if(title == ''){
                alert('请填写标题');
                return;
            }

            logContentList.find('li').each(function(index){
                var contentType = $(this).find('.log-type-bar').text();
                var contentText = $(this).find('.release-log-value').text();
                var contentItem = {
                    type:contentType,
                    content:contentText
                };
                content.push(JSON.stringify(contentItem));
            });

            if(explain==''&&!content.length){
                alert('请填写内容');
                return;
            }

            var data = {
                id:id,
                title:title,
                explain:explain,
                content:content
            };

            editUpdateLog(data);
        });

        function editUpdateLog(data){
            $.ajax({
                url:'/update-log/update',
                type:'post',
                data:{logData:data},
                success:function(data){
                    if(data == 'ok'){
                        alert('修改成功');
                    }
                },
                error:function(err){
                    alert('修改失败');
                    console.log(err)
                }
            })
        }

    })(jQuery);
});