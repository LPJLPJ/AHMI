/**
 * Created by lixiang on 2017/2/8.
 */

var localIDEService = {};
var fs = require('fs');
var path = require('path');

localIDEService.getCurrentVer = function(req,res){
    var manifestPath = path.join(__dirname,'../manifest.json');
    var manifest = require(manifestPath);
    console.log('manifest.version',manifest.version);
    var manifestJson = JSON.stringify(manifest);
    res.end(manifestJson);
};

localIDEService.downloadNewVerZip = function(req,res){
    //console.log('req',req.path);
    var updFilesPath = path.join(__dirname,'../release/update/updFiles.zip');
    var options = {};
    res.sendFile(updFilesPath,options,function(err){
        if(err){
            console.log('err',err);
        }else{
            console.log('sent',updFilesPath);
        }
    })
};

module.exports = localIDEService;
