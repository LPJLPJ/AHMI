/**
 * Created by changecheng on 2017/2/23.
 */
var fs = require('fs');
var path = require('path');
var downloadBaseUrl = path.join(__dirname,'../release/')
var DownloadRouter = {};
DownloadRouter.getDownloadPage  = function (req,res) {
    res.render('download/index.html')
}
DownloadRouter.downloadUpdate  = function (req,res) {

}

DownloadRouter.downloadPCClinet  = function (req,res) {
    res.download(path.join(__dirname,'../release/test.exe'),'ahmi-local.exe')
}

module.exports = DownloadRouter;