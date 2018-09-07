/*
Version Maker for IDE
created by Zzen1ss. 2018/9/7

Version Convention:
1.10.4_build_9.7.11.21 - major.minor.patch_build_buildinfo

Usage:
    1. `node IDE_Release.js major` add major version
    2. `node IDE_Release.js minor` add minor version
    3. `node IDE_Release.js patch` add patch version
    4. `node IDE_Release.js 1.10.4` set custom version
    5. `node IDE_Release.js` update build info

*/


var path = require('path')
var fs = require('fs')
var exec = require('child_process').exec

//1.10.4_build_9.7.10.19
function Version(major,minor,patch,build){
    this.major = major
    this.minor = minor
    this.patch = patch
    this.build = build||'0'
    
}

Version.prototype.toString = function(){
    return this.major+'.'+this.minor+'.'+this.patch+'_'+'build'+'_'+this.build
}

Version.largerThan = function(v1,v2){
    return v1.major > v2.major || v1.minor > v2.minor || v1.patch > v2. patch || v1.build > v2.build
}

function createVersionByStr(verStr){
    var verParts = verStr.split('_')
    var mainVerStr = verParts[0]
    var buildStr = verParts[2]
    var mainVerParts = mainVerStr.split('.')
    var major = parseInt(mainVerParts[0])||0
    var minor = parseInt(mainVerParts[1])||0
    var patch = parseInt(mainVerParts[2])||0
    if (buildStr && buildStr.length){
        var build = buildStr
    }
    return new Version(major,minor,patch,build)
}

function parseFileVersion(fileUrl){
    
    switch(path.extname(fileUrl)){
        case ".json":
            return parseJSONVersion(fileUrl)
        case ".js":
            return parseJSVersion(fileUrl)
        default:
            return null
    }
}

function parseJSONVersion(jsonUrl){
    var curJson = require(jsonUrl)

    return createVersionByStr(curJson.version)
}

function parseJSVersion(jsUrl){
    var jsStr = fs.readFileSync(jsUrl) +''
    var verMath = jsStr.match(/versionNum\s*=\s*[\'|\"]([^\'\"]+?)[\'|\"];?/)
    if(verMath && verMath.length && verMath[1]){
        return createVersionByStr(verMath[1])
    }
    return null
}

//write
function writeJSONVersion(jsonUrl,versionStr){
    var curJson = JSON.parse(fs.readFileSync(jsonUrl)+'')
    curJson.version = versionStr
    fs.writeFileSync(jsonUrl,JSON.stringify(curJson,null,4))
}

function writeJSVersion(jsUrl,versionStr){
    var curJS =  fs.readFileSync(jsUrl) +''
    var result = curJS.replace(/versionNum\s*=\s*[\'|\"]([^\'\"]+?)[\'|\"];?/,'versionNum = \''+versionStr+'\';')
    fs.writeFileSync(jsUrl,result)

}

function writeFileVersion(fileUrl,versionStr){
    console.log('writing file version: '+fileUrl)
    switch(path.extname(fileUrl)){
        case ".json":
            return writeJSONVersion(fileUrl,versionStr)
        case ".js":
            return writeJSVersion(fileUrl,versionStr)
        default:
            return null
    }
}

function VersionMaker(){
    this.targetVerionFiles = [
        './package.json',
        './manifest.json',
        './src/public/general/js/versionTag.js'
    ]
}

VersionMaker.prototype.getVersion = function(){
    var version = this.targetVerionFiles.reduce(function(ac,cur){
        if(!ac){
            return parseFileVersion(cur)
        }else{
            var curVersion = parseFileVersion(cur)
            if  (curVersion){
                if (Version.largerThan(curVersion,ac)){
                    return curVersion
                }else{
                    return ac
                }
            }else{
                return ac
            }
        }
    },null)
   
    return version
    
}


VersionMaker.prototype.writeVersion = function(version){
    this.targetVerionFiles.forEach(function(fileUrl){
        writeFileVersion(fileUrl,version.toString())
    })
}

VersionMaker.prototype.generateBuildInfo = function(){
    var curTime = new Date()
    var parts = [
        curTime.getMonth()+1,
        curTime.getDate(),
        curTime.getHours(),
        curTime.getMinutes()
    ]
    return parts.join('.')
}

VersionMaker.prototype.release = function(verType){
    var curVersion = this.getVersion()
    console.log('current version: '+curVersion.toString())
    if(verType){
        switch(verType){
            case 'major':
                curVersion.major+=1
            break;
            case 'minor':
                curVersion.minor+=1
            break;
            case 'patch':
                curVersion.patch+=1
            break;
            default:
                //custom
                curVersion = createVersionByStr(verType)
                
        }
    }else{
        //no arg
        
    }
    curVersion.build = this.generateBuildInfo()
    console.log('will write new version: '+curVersion.toString())
    this.writeVersion(curVersion)
    this.commit(curVersion.toString())
    
}

VersionMaker.prototype.commit = function(versionStr){
    console.log('start to commit version files')
    exec("git commit -a -m "+'"'+"release version: "+versionStr+'"',function(err){
        if(err){
            return console.log(err)
        }
        console.log('finish committing version files')
    })
}

var verMaker = new VersionMaker()
var verType = process.argv[2]
verMaker.release(verType)
