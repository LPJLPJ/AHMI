/**
 * Created by lixiang on 2017/2/8.
 */

var localIDEService = {};
var fs = require('fs');
var path = require('path');

localIDEService.getCurrentVer = function(req,res){
    var manifestPath = path.join(__dirname,'../manifest.json');
    fs.readFile(manifestPath, function (err,data) {
        //console.log(JSON.parse(data));
        res.send(data);
    });
};

localIDEService.downloadNewVerZip = function(req,res){
    //console.log('req',req.path);
    var updFilesPath = path.join(__dirname,'../release/update/updFiles.zip');
    var options = {};
    res.sendFile(updFilesPath,options,function(err){
        if(err){
            console.log('err',err);
        }else{
            console.log('send',updFilesPath);
        }
    })
};

module.exports = localIDEService;
