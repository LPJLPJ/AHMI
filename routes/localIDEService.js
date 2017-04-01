/**
 * Created by lixiang on 2017/2/8.
 */

var localIDEService = {};
var ProjectModel = require('../db/models/ProjectModel');
var UserModel = require('../db/models/UserModel');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var errHandler = require('../utils/errHandler');
var formidable = require('formidable');
var mkdir = require('mkdir-p');


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

localIDEService.uploadProject = function (req,res) {
    if(req.session.user){
        //console.log('I receive a message');
        var newProject = new ProjectModel();
        newProject.userId = req.session.user.id;
        //console.log('id',newProject._id);
        var targetDir = path.join(__dirname,'../project/',String(newProject._id),'resources','template');
        fs.stat(targetDir,function(err,stats){
            if (stats&&stats.isDirectory&&stats.isDirectory()) {
                parseFormData(req,res,newProject);
            }else{
                mkdir(targetDir,function(err){
                    if(err){
                        errHandler(res,500,'err in create folder');
                    }else{
                        parseFormData(req,res,newProject);
                    }
                })
            }
        })

    }else{
        errHandler(res,500,'NOT LOGIN!');
    }

    /**
     * 解析Form数据
     * @param req
     * @param res
     * @param newProject
     */
    function parseFormData(req,res,newProject){
        var resourceDir = path.join(__dirname,'../project/',String(newProject._id),'resources');
        var templateDir = path.join(resourceDir,'template');
        var projectId = newProject._id;
        var field = {};
        var files = {};
        var form = new formidable.IncomingForm();
        form.encoding="utf-8";
        form.uploadDir = resourceDir;
        form.multiples = true;//设置为多文件上传
        form.keepExtensions=true;//是否保存文件后缀
        form.maxFieldsSize = 10*1024*1024;

        //监听事件
        form.on('field',function(name,value){
            if(name === 'project') {
                var project = JSON.parse(value);
                //console.log('project',project,);
                delete project._id;
                delete project.createdTime;
                delete project.lastModified;
                for (var key in project) {
                    if (key === 'content') {
                        var host = process.env.CUR_HOST||'ide.graphichina.com';
                        newProject.content = fixProjectContent(project.content,newProject._id,host);
                    }else{
                        newProject[key] = project[key];
                    }
                }
            }
        });
        form.on('file',function(name,file){
            var reDir;
            if(name.indexOf('template')!=-1){
                reDir = path.join(templateDir,file.name);
            }else{
                reDir = path.join(resourceDir,file.name);
            }
            fs.rename(file.path,reDir,function(err){
                if(err){
                    console.log('err',err);
                }
            });
        });
        form.on('end',function(){
            newProject.save(function(err){
                if(err){
                    console.log('save err in upload',err);
                    ProjectModel.deleteById(projectId, function (err) {
                        if (err){
                            errHandler(res,500,'delete error')
                        }
                        //delete directory
                        var targetDir = path.join(__dirname,'../project/',String(projectId))
                        fs.stat(targetDir, function (err, stats) {
                            if (stats&&stats.isDirectory&&stats.isDirectory()){
                                //exists
                                //delete
                                rmdirAsync(targetDir,function (rmErr) {
                                    if (rmErr){
                                        errHandler(res,500,'rm directory error in upload')
                                    }else{
                                        errHandler(res,500,'err in save newProject');
                                    }
                                })
                            }else{
                                errHandler(res,500,'err in save newProject');
                            }
                        })

                    })
                }else{
                    //console.log()
                    res.format({
                        text:function(){
                            //var host = String(process.env.CUR_HOST).split('//').[1];
                            res.send('cur_host:'+process.env.CUR_HOST);
                        },
                        html:function(){
                            res.send('<p>ok</p>');
                        },
                        json:function(){
                            res.send({message:'ok'});
                        }
                    });
                }
            });
        });
        form.on('error',function(err){
            console.log('err',err);
            errHandle(err);
        });
        form.on('aborted',function(){
            console.log('aborted');
            res.end('aborted');
        });

        form.parse(req,function(err,fields,files){
            if(err){
                console.log('err in parse',err);
                errHandle(res,500,'err in parse!');
            }
        });
    }

    /**
     * 修改本地版content中的资源引用
     * @param content
     * @param id
     * @param host
     */
    function fixProjectContent(content,id,host){
        var contentObj = JSON.parse(content);
        //var pattern1 = /[\\]/g;
        var pattern2 = /..\/..\/localproject\/[a-z\d]+\//g;
        var str = '/project/'+id+'/';

        var transformSrc = function(key,value) {
            if (key == 'src' || key == 'imgSrc' || key == 'backgroundImage') {
                if((typeof value==='string')&&(value!='')){
                    if(value.indexOf('chrome-extension')==-1){
                        value = value.replace(/\\/g,'/');
                        value = value.replace(pattern2,str);
                        //console.log(key,value);
                        return value;
                    }else{
                        var arr = value.split('/');
                        arr[0]='https:';
                        arr[2]=String(host);
                        arr[3]='project';
                        arr[4]=String(id);
                        value = arr.join('/');
                        return value;
                    }
                }else{
                    return value;
                }
            }else{
                return value;
            }
        };
        return JSON.stringify(contentObj,transformSrc);
    }
};

module.exports = localIDEService;
