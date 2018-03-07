/**
 Version Manager for ide to manage versions of ide editor scripts
 created by Zzen1sS on 2018/2/25
 **/
var fs = require('fs')
var path = require('path')
var VersionManager = {}

var legacyBaseUrl = '../legacy'


VersionManager.versions = []

VersionManager.versionScripts = {}

VersionManager.versionBaseUrl = path.join(__dirname,legacyBaseUrl)

VersionManager.getAllVersions = function () {
    var versionBaseUrlStats
    try {
        versionBaseUrlStats = fs.statSync(VersionManager.versionBaseUrl)
    }catch(e){

    }

    if (versionBaseUrlStats && versionBaseUrlStats.isDirectory()){
        var versionDirs = fs.readdirSync(path.join(__dirname,legacyBaseUrl)).filter(function (name) {
            return name.indexOf('.')!==0
        })
        VersionManager.versions = versionDirs

        for(var i=0;i<versionDirs.length;i++){
            VersionManager.versionScripts[versionDirs[i]] =  JSON.parse(''+fs.readFileSync(path.join(__dirname,legacyBaseUrl,versionDirs[i],'ideScripts.json')))
        }
    }


}

module.exports =  VersionManager