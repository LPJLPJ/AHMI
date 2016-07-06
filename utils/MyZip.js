var yazl = require('yazl');
var fs = require('fs');
var path = require('path');
// zipFile.addFile("LICENSE","package.json");
var MyZip = {};

// zipFile.addFile('node_modules','node_modules');
// zipFile.outputStream.pipe(fs.createWriteStream("output.zip")).on("close", function() {
//   console.log("done");
// });
//
// zipFile.end();

function zipSingleDir(zipFile,realDir, metaDir, cb) {
  fs.readdir(realDir,function(err,files){
    if (err) {
      cb && cb(err);
      return;
    }
    var totalNum = files.length;
    for (var i=0;i<files.length;i++){
      var curFile = files[i];
      var curFilePath = path.join(realDir,curFile);

      var stats = fs.statSync(curFilePath);
      if (stats.isFile()) {
        zipFile.addFile(curFilePath,path.join(metaDir,curFile));
        totalNum--;
        if (totalNum<=0) {
          //finished
          cb && cb();
        }
      }else{
        //dir
        zipSingleDir(zipFile,curFilePath,path.join(metaDir,curFile),function (err) {
          if (err) {
            cb && cb(err);
          }else{
            totalNum--;
            if (totalNum<=0) {
              //finished
              cb && cb();
            }
          }
        });
      }


    }

  })
}

MyZip.zipDir = function (realDir, output,cb) {
  var zipFile = new yazl.ZipFile();
  zipFile.outputStream.pipe(fs.createWriteStream(output).on('close',function () {
    console.log('finished');
    cb && cb();
  }))
  zipSingleDir(zipFile,realDir,'',function (err) {
    if (err) {
      cb && cb(err);
    }else{
      zipFile.end();
    }

  })



};

module.exports = MyZip;
