/**
 * Created by zzen1ss on 16/7/13.
 */
;(function () {
    var versionNum = '1.10.7_build_11.6.14.32';
    window.ideVersion = versionNum;
    var versionTag = document.createElement('div');
    versionTag.id = 'version-tag';
    versionTag.innerHTML = versionNum;
    versionTag.setAttribute('style',"position:fixed;right:5px;bottom:10%;padding:0.2em;font:14px helvetica arial;z-index:99;box-shadow:0px 1px 1px rgba(0,0,0,0.3)");
    var body = document.body;
    body.appendChild(versionTag);
})();