$(function () {
    var pathname = window.location.pathname
    var urlElems = pathname.split('/')
    $('#submit').click(function () {
        var key = $('#sharedKey').val().trim()
        $.ajax({
            type:'post',
            url:'/project/'+urlElems[2]+'/sharedkey',
            data:{
              sharedKey:key
            },
            success:function (data) {
                window.location.reload();
            },
            error:function (err) {
               var errMsg = JSON.parse(err.responseText).errMsg
                $('#message').text(errMsg)
            }
        })
    })
})