/**
 * Created by lixiang on 2017/2/8.
 */

var updateLocal = {};
var fs = require('fs');
var path = require('path');

updateLocal.getCurrentVer = function(req,res){
    var manifestPath = path.join(__dirname,'../manifest.json');
    var manifest = require(manifestPath);
    console.log('manifest.version',manifest.version);
    var manifestJson = JSON.stringify(manifest);
    res.end(manifestJson);
};

updateLocal.downloadNewVerZip = function(req,res){
    //console.log('req',req.path);
    var updFilesPath = path.join(__dirname,'../releaseUpdate/updFiles.zip');
    var options = {};
    res.sendFile(updFilesPath,options,function(err){
        if(err){
            console.log('err',err);
        }else{
            console.log('sent',updFilesPath);
        }
    })
};

module.exports = updateLocal;
