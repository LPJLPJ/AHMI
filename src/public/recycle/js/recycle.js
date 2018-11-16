/**
 * Created by tang on 2018/11/01
 */
$(function () {
    var recycleList = $('#recycle-list'),
        deleteModal = $('#delete-modal'),
        refundModal = $('#refund-modal'),
        deleteConfirm = $('#delete-confirm'),
        refundConfirm = $('#refund-confirm');
    var projectItem,projectId;

    recycleList.on('click','.delete',function(e){
        projectItem = $(this).parents('.recycle-list_item');
        deleteModal.modal('show');
    }).on('click','.refund',function(e){
        projectItem = $(this).parents('.recycle-list_item');
        refundModal.modal('show');
    });

    deleteConfirm.on('click',function(){
        projectId = projectItem.attr('project-id');
        $.ajax({
            url:'/recycle/delete',
            type:'post',
            data:{projectId:projectId},
            success:function(data){
                projectItem.remove();
                toastr.info('删除成功');
            },
            error:function(err){
                console.log(err);
                toastr.error('删除失败，请刷新');
            }
        })
    });

    refundConfirm.on('click',function(){
        projectId = projectItem.attr('project-id');
        $.ajax({
            url:'/recycle/refund',
            type:'post',
            data:{projectId:projectId},
            success:function(data){
                projectItem.remove();
                toastr.info('恢复成功');
            },
            error:function(err){
                console.log(err);
                toastr.error('恢复失败，请刷新');
            }
        })
    });

    $('#clear-confirm').on('click',function(){
        if(!$('.project').length){
            toastr.error('回收站内暂无工程！');
            return;
        }

        $.ajax({
            url:'/recycle/clear',
            type:'post',
            data:{projectId:projectId},
            success:function(data){
                $('.project').remove();
                toastr.info('清空成功');
            },
            error:function(err){
                console.log(err);
                toastr.error('删除失败，请刷新');
            }
        })
    })
});