$(function(){
	// $('#user-icon').on('click',function(){
	// 	$('#user-icon-menu').
	// })
	// $(".right").hover(function(){
 //        $(".menu").stop().animate({"height":"60px"})
 //    },function(){
 //        $(".menu").stop().animate({"height":"0px"})
 //    })
    $('.projectpanel').on('click', function (e) {
        var project = $(this).attr('data-project')
        project = JSON.parse(project)
        var curNodeName = e.target.nodeName
        if (curNodeName == 'IMG'){
            //img
        }else if (curNodeName == 'SPAN'){
            //span
            //show modal
            $('#modal-ok').html('确认')
            var title = $('#basicinfo-title')
            var author = $('#basicinfo-author')
            var resolution = $('#basicinfo-resolution')
            title.val(project.name)
            resolution.val(project.resolution)

            //ok press
            $('#modal-ok').on('click', function (e) {
                if (project.name != title.val() || project.resolution != resolution.val()){
                    //changed
                    project.name = title.val()
                    project.resolution = resolution.val()
                    $.ajax({
                        type:'POST',
                        url:'/project/'+project.id+'/basicinfo',
                        data:project,
                        success: function (data, status, xhr) {
                            //update success
                        },
                        error: function (err, status, xhr) {
                            //update error
                            alert('修改失败')
                        }
                    })
                }
            })


        }
    })
})