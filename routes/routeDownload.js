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

module.exports = DownloadRouter;