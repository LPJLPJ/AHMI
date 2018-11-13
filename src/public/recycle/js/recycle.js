/**
 * Created by tang on 2018/11/01
 */
$(function () {
    var recycleList = $('#recycle-list'),
        deleteProject = $('.delete'),
        refundProject = $('.refund'),
        deleteModal = $('#delete-modal'),
        refundModal = $('#refund-modal'),
        deleteConfirm = $('#delete-confirm'),
        refundConfirm = $('#refund-confirm');
    var project;

    recycleList.on('click','.delete',function(e){
        deleteModal.modal('show');
    }).on('click','.refund',function(e){
        refundModal.modal('show');
    });
});