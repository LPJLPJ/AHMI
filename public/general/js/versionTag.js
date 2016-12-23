/**
 * Created by zzen1ss on 16/7/13.
 */
;(function () {
    window.onload = function () {
        var versionNum ='1.8.1';
        window.ideVersion = versionNum;
        var versionTag = document.createElement('div');
        versionTag.id = 'version-tag';
        versionTag.innerHTML = versionNum;
        versionTag.setAttribute('style',"position:fixed;right:5px;bottom:10%;padding:0.2em;font:24px helvetica arial;z-index:99");
        var body = document.body;
        body.appendChild(versionTag);
    }
})();