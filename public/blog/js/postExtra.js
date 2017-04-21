        function sad(e) {
            var changeId =e.getAttribute("commentId");
            var currentId = parseQuery(window.location.href);
                if(confirm('是否确认删除')){
                    $.ajax({
                        method:'DELETE',
                        url:'/blog/post/deleteComment',
                        data:{commentId:changeId,
                              blogId:currentId  
                        },
                        success:function(data){
                            console.log('data',data);
                            //window.location.reload();
                        },
                        error:function(err){
                            console.log('err',err);
                        }
                    })
                }
        }

        function parseQuery(url) {
            var query = url;
            var querys = query.split('#')
            var results = {}
            for (var i=0;i<querys.length;i++){
                var pair = querys[i].split('=')
                if(pair[1]!=undefined&&pair[1]!=null)
                results = pair[1]
            }
            return results
        }
