/**
 * Created by zzen1ss on 16/7/13.
 */
;(function () {
    var versionNum = '1.10.7_build_8.6.14.5';
    window.ideVersion = versionNum;
    var versionTag = document.createElement('div');
    versionTag.id = 'version-tag';
    versionTag.innerHTML = versionNum;
    versionTag.setAttribute('style',"position:fixed;right:5px;bottom:5%;padding:0.2em;font-size:14px;z-index:99;box-shadow:1px 1px 2px rgba(0,0,0,0.3);border-radius:2px;background-color:#ffffff");
    var body = document.body;
    body.appendChild(versionTag);
})();