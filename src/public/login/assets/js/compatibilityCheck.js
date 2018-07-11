/**
 * created by Zzen1sS
 */
$(function () {
    var $compatibilityContainer = $('.compatibility-container')
    var $compatibilityShow = $('.compatibility-show')
    var $basicinfoIDEVersion = $('#basicinfo-ideversion')
    var curIDEVersion = window.ideVersion

    var compatibiltyObj = {
        '1.10.5':[
            '1.4'
        ]
    }
    updateCompatibility()
    $basicinfoIDEVersion.on('change',function () {
        curIDEVersion = $basicinfoIDEVersion.val().trim() || window.ideVersion
        updateCompatibility()
    })

    function updateCompatibility() {
        var compatibiltySpans = []
        console.log(curIDEVersion)
        if (curIDEVersion&&curIDEVersion in compatibiltyObj){
            compatibiltySpans = compatibiltyObj[curIDEVersion].map(function (c,i) {
                return '<span class="compatibility-ok">'+c+'</span>'
            })
        }else{
            compatibiltySpans = ['<span class="compatibility-warning">'+'兼容性未知'+'</span>']
        }
        $compatibilityShow.html(compatibiltySpans.join())
    }


})