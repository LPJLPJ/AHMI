$(function(){
	// $('#user-icon').on('click',function(){
	// 	$('#user-icon-menu').
	// })
	// $(".right").hover(function(){
 //        $(".menu").stop().animate({"height":"60px"})
 //    },function(){
 //        $(".menu").stop().animate({"height":"0px"})
 //    })
    var curSelectedPanel = null;

    $('.projectpanel').on('click', function (e) {
        var curPanel = $(this)
        curSelectedPanel = curPanel


        var project = $(this).attr('data-project')
        project = JSON.parse(project)
        var curNodeName = e.target.nodeName
        if (curNodeName == 'IMG'){
            //img
            //open in new window
            
        }else if (curNodeName == 'SPAN'){
            //span
            //show modal
            $('#modal-ok').html('确认')
            var title = $('#basicinfo-title')
            var author = $('#basicinfo-author')
            var resolution = $('#basicinfo-resolution')
            title.val(project.name)
            resolution.val(project.resolution)
        }else if (curNodeName == 'I'){
            //delete
            if(confirm('确认删除?')){
                deleteProject(project,curPanel)
            }else{

            }

        }
    })

    $('.projectpanel').hover(function (e) {
        var icon = $(this).find('.projectdelete')
        if (icon){
            icon.css('display','block')
        }
    }, function (e) {
        var icon = $(this).find('.projectdelete')
        if (icon){
            icon.css('display','none')
        }
    })




    $('#addproject').on('click', function (e) {
        $('#modal-ok').html('创建')

    })

    $('#modal-ok').on('click',changeProject);

    function changeProject(e){
        var op = $('#modal-ok').html()
        console.log(op)
        if (op == '确认'){
            updateProject(e)
        }else{
            createProject(e)
        }
    }
    function createProject(e) {
        console.log('create')
        var project = {}
        var title = $('#basicinfo-title')
        var author = $('#basicinfo-author')
        var resolution = $('#basicinfo-resolution')
        if (title.val()!=''&&resolution.val()!=''){
            //create
            project.name = title.val()
            project.resolution = resolution.val()

            $.ajax({
                type:'POST',
                url:'/project/create',
                data:project,
                success: function (data, status, xhr) {
                    var newProject = JSON.parse(data)
                    addNewProject(newProject)
                },
                error: function (err, status, xhr) {
                    console.log(err)
                }
            })
        }

    }


    function deleteProject(project,curPanel){
        console.log('delete')
        $.ajax({
            type:'POST',
            url:'/project/delete',
            data:{projectId:project._id},
            success:function (data, status, xhr){
                //delete ok
                console.log(data)
                curPanel.remove()

            },
            error: function (err, status, xhr) {
                console.log(err)
                alert('删除失败')
            }
        })
    }

    function updateProject(e) {
        var curPanel = curSelectedPanel
        var project = curPanel.attr('data-project')
        project = JSON.parse(project)
        console.log(project)
        var title = $('#basicinfo-title')
        var author = $('#basicinfo-author')
        var resolution = $('#basicinfo-resolution')
        if (project.name != title.val() || project.resolution != resolution.val()){
            //changed
            project.name = title.val()
            project.resolution = resolution.val()
            $.ajax({
                type:'POST',
                url:'/project/'+project._id+'/basicinfo',
                data:project,
                success: function (data, status, xhr) {
                    //update success
                    console.log('success',data)
                    //update panel
                    var html = new EJS({url:'/public/login/assets/views/projectpanel.ejs'}).render({project:project});

                    curPanel.replaceWith(html)
                },
                error: function (err, status, xhr) {
                    //update error
                    console.log('err',err)
                    alert('修改失败')
                }
            })
        }
    }


    function addNewProject(newProject){
        var html = new EJS({url:'/public/login/assets/views/projectpanel.ejs'}).render({project:newProject});
        console.log(html)
        $('#addproject').after(html)
    }
})