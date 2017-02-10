/**
 * Created by changecheng on 2017/2/10.
 */


function loadFromServer() {
    $.ajax({
        type:'GET',
        url:'/blog/getallpublishedblogs',
        success:function (msg) {
            console.log(msg)
        },
        error:function (xhr) {

        }
    })
}

loadFromServer()