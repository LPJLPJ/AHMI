/**
 * Created by zzen1ss on 16/7/13.
 */
;(function () {
    var versionNum = '1.10.4_build_9.7.15.39';
    window.ideVersion = versionNum;
    var versionTag = document.createElement('div');
    versionTag.id = 'version-tag';
    versionTag.innerHTML = versionNum;
    versionTag.setAttribute('style',"position:fixed;right:5px;bottom:10%;padding:0.2em;font:24px helvetica arial;z-index:99");
    var body = document.body;
    body.appendChild(versionTag);
})();