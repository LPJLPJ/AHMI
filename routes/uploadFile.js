var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
var errHandler = require('../utils/errHandler');
var ProjectModel = require('../db/models/ProjectModel');
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
    if (projectId){
        //valid
        //whether user logged in?
        var user = req.session.user;
        if (user && user.id){
            //user logged in
            ProjectModel.findById(projectId, function (err,project) {
                if (err){
                    errHandler(res,500,'project error')
                }else{
                    if (project.userId == user.id){
                        //valid for cur user
                        uploadSingleFile(req,res);
                    }else{
                        errHandler(res,500,'user not valid');
                    }
                }
            })

        }else{
            errHandler(res,500,'not logged in');
        }



        //form.parse(req)

    }else{
        errHandler(res, 500, 'invalid projectid')
    }
}


module.exports.uploadTex = function (req, res) {
    var projectId = req.params.id;
    if (projectId){
        //valid
        //whether user logged in?
        var user = req.session.user;
        if (user && user.id){
            //user logged in
            ProjectModel.findById(projectId, function (err,project) {
                if (err){
                    errHandler(res,500,'project error')
                }else{
                    if (project.userId == user.id){
                        //valid for cur user
                        uploadSingleFile(req,res);
                    }else{
                        errHandler(res,500,'user not valid');
                    }
                }
            })

        }else{
            errHandler(res,500,'not logged in');
        }



        //form.parse(req)

    }else{
        errHandler(res, 500, 'invalid projectid')
    }
}



function uploadSingleFile(req, res){
    var projectId = req.params.id;
    var baseUrl = path.join(__dirname,'../project/',projectId,'resources')
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
        errHandler(res, 500, 'upload error' + err)
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
                    errHandler(res,500,err)
                }else{
                    console.log('mkdir',form.uploadDir)
                    form.parse(req)
                }
            })
        }
    })
}


module.exports.deleteResource = function (req, res) {
    var projectId = req.params.id;
    var resourceId = req.params.rid;
    var baseUrl = path.join(__dirname,'../project/',projectId,'resources')
    var resourceUrl = path.join(baseUrl,resourceUrl);
    if (projectId){
        fs.stat(resourceUrl, function (err, stats) {
            if (stats && stats.isFile()){
                fs.unlink(resourceUrl,function(err){
                    if (err){
                        errHandler(res,500,'delete error')
                    }
                    res.end('ok')
                })
            }else{
                //can't delete
                errHandler(res,500,'invalid resource')
            }
        })
    }else{
        errHandler(res, 500, 'invalid projectid')
    }
}


module.exports.deleteProjectFile = function (req, res) {
    var projectId = req.params.id;
    var fileId = req.body.fileId;
    if (projectId!=''&&fileId!=''){
        //valid fileid
        var url = path.join(__dirname,'../project/',String(projectId),fileId);
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
    var projectId = req.params.id
    var fileId = req.params.rid;
    if (projectId!=''&&fileId!=''){
        //valid
        // console.log(projectId,fileId)
        res.sendFile(path.join(__dirname,'../project/',String(projectId),'/resources/',String(fileId)), function (err) {
            if (err){
                console.log(err);
                errHandler(res,500,'get project file error');
            }

        })
    }else{
        errHandler(res,500,'invalid resource url')
    }
};

module.exports.getProjectTemplateFile = function (req, res) {
    var projectId = req.params.id
    var fileId = req.params.rid;
    if (projectId!=''&&fileId!=''){
        //valid
        // console.log(projectId,fileId)
        res.sendFile(path.join(__dirname,'../project/',String(projectId),'resources','template',String(fileId)), function (err) {
            if (err){
                console.log(err);
                errHandler(res,500,'get project file error');
            }

        })
    }else{
        errHandler(res,500,'invalid resource url')
    }
};