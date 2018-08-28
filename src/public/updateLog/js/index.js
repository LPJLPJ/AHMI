$(function () {
    $(window).scroll(function () {
        var top = $(document).scrollTop();
        if (top > 50) {
            $('.update-log-title').addClass('nav-fixed');
        } else {
            $('.update-log-title').removeClass('nav-fixed');
        }
    })


});