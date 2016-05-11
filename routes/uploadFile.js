var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
var errHandler = require('../utils/errHandler')
module.exports.uploadTest = function(req, res){
	var fields={}
	var files = {}
	var form = new formidable.IncomingForm()
	form.encoding = 'utf-8'
	form.multiples = true
	//form.uploadDir = path.join(__dirname,'temp')
    console.log(path.join(__dirname,'../public/images2'))
    form.uploadDir = path.join(__dirname,'../public/images2')
	//if (!fs.statSync(form.uploadDir)||!fs.statSync(form.uploadDir).isDirectory()) {
	//	fs.mkdir(form.uploadDir)
	//}
	form.on('field',function(name, value){
		fields[name] = value
	})
	form.on('file',function(name, file){
		files[name] = file
        fs.rename(file.path,path.join(form.uploadDir,fields.name));
	})
	form.on('end',function(){
		res.end('success')
	})
	form.on('error',function(err){
		res.end(err)
	})
	form.on('aborted',function(){
		res.end('aborted')
	})

    fs.stat(form.uploadDir, function (err, stats) {
        if (err){
            errHandler(res,500,'upload error')
        }
        console.log(stats)
        if (stats && stats.isDirectory()){
            console.log(stats.isDirectory())
            form.parse(req)
        }else{
            fs.mkdir(form.uploadDir, function () {
                console.log('mkdir')
                form.parse(req)
            })

        }
    })
}

module.exports.uploadProjectFile = function (req, res) {
    var projectId = req.params.id;
    var baseUrl = path.join(__dirname,'../projects/',projectId,'resources')
    if (projectId){
        //valid
        var fields={}
        var files = {}
        var form = new formidable.IncomingForm()
        form.encoding = 'utf-8'
        form.multiples = true
        form.uploadDir = baseUrl
        form.on('field',function(name, value){
            fields[name] = value
        })
        form.on('file',function(name, file){
            files[name] = file
            fs.rename(file.path,path.join(form.uploadDir,fields.name));
        })
        form.on('end',function(){
            res.end('success')
        })
        form.on('error',function(err){
            errHandler(res,500,'upload error')
        })
        form.on('aborted',function(){
            res.end('aborted')
        })

        //if (!fs.statSync(form.uploadDir)||!fs.statSync(form.uploadDir).isDirectory()) {
        //    fs.mkdir(form.uploadDir)
        //}

        fs.stat(form.uploadDir, function (err, stats) {
            if (stats&&stats.isDirectory&&stats.isDirectory()){
                form.parse(req)
            }else{
                fs.mkdir(form.uploadDir, function (err) {
                    if (err){
                        errHandler(res,500,'mkdir error')
                    }else{
                        console.log('mkdir',form.uploadDir)
                        form.parse(req)
                    }
                })
            }
        })

        //form.parse(req)

    }else{
        errHandler(res, 500, 'invalid projectid')
    }
}


module.exports.deleteProjectFile = function (req, res) {
    var projectId = req.params.id;
    var fileId = req.body.fileId;
    if (projectId!=''&&fileId!=''){
        //valid fileid
        var url = path.join(__dirname,'../projects/',String(projectId),fileId);
        fs.stat(url, function (err, stats) {
            if (stats&&stats.isFile&&stats.isFile()){
                fs.unlink(url, function (err) {
                    if (err){
                        errHandler(res,500,'delete error')
                    }else{
                        res.end('ok')
                    }
                })
            }
        })

    }else{
        errHandler(res,500,'file error')
    }

}


module.exports.getProjectFile = function (req, res) {
    console.log('getting')
    var projectId = req.params.id
    var fileId = req.params.rid;
    if (projectId!=''&&fileId!=''){
        //valid
        res.sendFile(path.join(__dirname,'../projects/',String(projectId),'/resources/',String(fileId)), function (err) {
            console.log(err)
        })
    }else{
        errHandler(res,500,'invalid resource url')
    }
}