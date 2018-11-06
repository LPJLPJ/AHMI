/**
 * created by Zzen1sS
 */
$(function () {
    var $compatibilityContainer = $('.compatibility-container')
    var $compatibilityShow = $('.compatibility-show')
    var $basicinfoIDEVersion = $('#basicinfo-ideversion')
    var curIDEVersion = window.ideVersion

    var compatibiltyObj = {
        '1.10.7':'1.5.0',
        '1.10.6':'1.5.0',
        '1.10.5':'1.4.0',
        '1.10.4':'1.4.0',
        '1.10.3':'1.4.0',
        '1.10.2':'1.3.0',
        '1.10.1':'1.3.0'
    }
    updateCompatibility()
    $basicinfoIDEVersion.on('change',function () {
        curIDEVersion = ($basicinfoIDEVersion.val()&&$basicinfoIDEVersion.val().trim() )|| window.ideVersion
        updateCompatibility()
    })


    function updateCompatibility() {
        var compatibiltySpans = []
        // console.log(curIDEVersion)
        // if (curIDEVersion&&curIDEVersion in compatibiltyObj){
        //     compatibiltySpans = compatibiltyObj[curIDEVersion].map(function (c,i) {
        //         return '<span class="compatibility-ok">'+c+'</span>'
        //     })
        // }else{
        //     compatibiltySpans = ['<span class="compatibility-warning">'+'兼容性未知'+'</span>']
        // }
        if (curIDEVersion&&curIDEVersion in compatibiltyObj){
            // compatibiltySpans = compatibiltyObj[curIDEVersion].map(function (c,i) {
            //     return '<span class="compatibility-ok">'+c+'</span>'
            // })
            var leastCompatibleV = compatibiltyObj[curIDEVersion]
            if (leastCompatibleV){
                compatibiltySpans = ['<span class="compatibility-ok">'+'兼容'+leastCompatibleV+'及以上版本'+'</span>']
            }else{
                //not compatible
                compatibiltySpans = ['<span class="compatibility-warning">'+'暂无兼容版本，请谨慎使用'+'</span>']
            }
        }else{
            compatibiltySpans = ['<span class="compatibility-warning">'+'兼容性未知'+'</span>']
        }
        $compatibilityShow.html(compatibiltySpans.join())
    }


})