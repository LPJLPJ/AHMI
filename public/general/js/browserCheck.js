/**
 * Created by zzen1ss on 16/7/18.
 */
;(function () {
    window.onload = function () {
        var browserCheck = document.createElement('div');
        browserCheck.innerHTML = '<p>系统检测到您的浏览器版本不兼容,推荐使用Chrome,切勿使用搜狗。</p>';
        browserCheck.setAttribute('style',"position:absolute;display:inline-block;width:30%;height:20%;background:#F7F6F2;right:0;bottom:0;left:0;top:0;margin:auto;padding:0.2em;font:24px helvetica arial;z-index:99");
        var body = document.body;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (!checkUserAgent(userAgent)){
            body.appendChild(browserCheck);
        }

    }


    function checkUserAgent(userAgent) {
        var curAgent ={};
        var result;
        if (result = userAgent.match(/metasr/)){
            curAgent.type = 'sougou';
        }else if (result = userAgent.match(/qqbrowser/)){
            curAgent.type = 'qq';
        }else if (result = userAgent.match(/firefox/)){
            curAgent.type = 'firefox';
        }else if (result = userAgent.match(/msie\s(\d*\.\d*)/)){
            console.log(result);
            curAgent.type = 'ie';
            curAgent.version = result[1]
        }else if (result = userAgent.match(/chrome/)){
            curAgent.type = 'chrome';
        }else if (result = userAgent.match(/safari/)){
            curAgent.type = 'safari'
        }
        console.log(curAgent);
        var browerOk = true;
        if (curAgent.type){
            switch (curAgent.type){
                case 'sougou':
                    browerOk = false;
                    break;
                case 'ie':
                    if (curAgent.type === 'ie' && Number(curAgent.version)<9){
                        browerOk = false;
                    }
                    break;
            }
        }
        return browerOk;
    }

})();