$(function () {

    var $templatesWrapper = $('.templates-wrapper')
    
    var $search = $('.template-tools-search')

    var $deleteButton = $('.template-tools-delete')

    var deleteIds = []


    $deleteButton.on('click',function(){
        if(deleteIds.length){
            $.ajax({
                type:'delete',
                url:'/admin/manage/templates/delete',
                data:{
                    ids:deleteIds.map(function(o){return o.id})
                },
                success:function(data){
                    console.log(data)
                    deleteIds.forEach(function(o){
                        o.dom.closest('.template-panel-wrapper').remove()
                    })
                },
                error:function(err){
                    console.log(err)
                }
            })
        }
    })

    $templatesWrapper.on('click','.template-panel',function(e){
        var $elem = $(this)
        var id = $elem.data('id')
        if(id){
            var hitPos = inDeleteIds(id)
            if(hitPos === -1){
                $elem.addClass('template-panel-selected')
                deleteIds.push({id:id,dom:$elem})
            }else{
                $elem.removeClass('template-panel-selected')
                deleteIds.splice(hitPos,1)
            }
            if(deleteIds.length){
                $deleteButton.attr('disabled',false)
            }else{
                $deleteButton.attr('disabled',true)
            }
            
        }
        
    })

    function inDeleteIds(id){
        for(var i=0;i<deleteIds.length;i++){
            if(deleteIds[i].id === id){
                //hit
                //remove
                return i
            }
        }
        return -1
    }
})