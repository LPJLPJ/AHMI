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
var extract = require('extract-zip');


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
};

/**
 * 上传IDE生成的压缩包
 * @param req
 * @param res
 */
localIDEService.uploadProjectZip = function(req,res){
    if(req.session.user){
        var tempFilesPath = path.join(__dirname,'../tempFiles'),
            form = new formidable.IncomingForm(),
            reDir = '',
            fileName ='',
            unZipFolderPath = '';

        form.encoding = "utf-8";
        form.uploadDir = tempFilesPath;
        form.multiples = false;//设置为多文件上传
        form.keepExtensions = true;//是否保存文件后缀
        form.maxFieldsSize = 10*1024*1024;

        form.parse(req,function(err,fields,files){
            if(err){
                console.log('err in parse',err);
                errHandle(res,500,'err in parse!');
            }
        });

        form.on('file',function (name,file) {
            fileName = Date.now()+file.name;
            reDir = path.join(tempFilesPath,fileName);
            fs.renameSync(file.path,reDir);
        });

        form.on('error',function (error) {
            console.log('error',error);
        });
        
        form.on('end',function () {
            //解压文件
            unZipFolderPath = path.join(tempFilesPath,fileName.split('.')[0]);
            unZipFile(reDir,unZipFolderPath,function(err){
                if(err){
                    errHandler(res,500,'unzip err',err);
                }else{
                    //检查压缩包内工程合法性
                    checkUnZipFolder(unZipFolderPath,function(err,project){
                        if(err){
                            console.log('err in checkUnZip',err);
                            errHandler(res,500,'not standard project');
                        }else{
                            //创建工程
                            createProject(unZipFolderPath,project,req,function(err){
                                if(err){
                                    errHandler(res,500,err);
                                }else{
                                    res.send('ok');
                                }
                            });
                        }
                    });
                }
            });
        })
    }else{
        errHandler(res,500,'user not login!');
    }
};

localIDEService.returnUserType = function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var data;
    UserModel.findByMailOrName(username,username,function(err,user){
        if(err){
            res.send('err in find user',err);
        }
        if (user) {
            if (!user.verified){
                errHandler(res,500,'not verified');
                return;
            }else{
                user.comparePassword(password,function(err, isMatch){
                    if (err) {
                        errHandler(res,500,err);
                    }else{
                        if (isMatch) {
                            data={
                                confirm:'ok',
                                userType:user.type
                            };
                        }else{
                            data={
                                confirm:'account err'
                            }
                        }
                        res.send(data);
                    }

                })
            }
        }else{
            data={
                confirm:'account err'
            };
            res.send(data);
        }
    })
};

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
                    var host = String(process.env.CUR_HOST).split('//')[1]||req.hostname;
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
                        var host = String(process.env.CUR_HOST).split('//')[1];
                        res.send('cur_host:'+host);
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
    var contentObj = JSON.parse(content),
        pattern1 = null,
        pattern2 = null,
        str = '',
        transformSrc;

    if(host){
        //修改本地版中的src
        str = '/project/'+id+'/';
        pattern2 = /..\/..\/localproject\/[a-z\d]+\//g;
    }else{
        //修改IDE生成的压缩包中的json的src，仅仅修改project id
        str = '/project/'+id+'/';
        pattern2 = /\/project\/[a-z\d]+\//g;
    }
    transformSrc = function(key,value) {
        if (key == 'src' || key == 'imgSrc' || key == 'backgroundImage'||key=='originSrc') {
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

/**
 * 解压压缩包
 * @param srcPath
 * @param destPath
 * @param cb
 */
function unZipFile(srcPath,destPath,cb) {
    //make sure destPath folder exist
    fse.emptyDir(destPath,function(err){
        if(err){
            console.log('err in emptyDir',err);
            cb&&cb(err);
        }else{
            //extract zip
            extract(srcPath,{dir:destPath},function(err){
                cb&&cb(err)
            })
        }
    });
}

/**
 * 检查上传的压缩包是否合法
 * @param resourcePath
 * @param cb
 */
function checkUnZipFolder(resourcePath,cb){
    var jsonPath = path.join(resourcePath,'data.json'),
        attributeArr = ['name','author','size','pageList'],
        testResult = false,
        myError = null,
        project = null;
    fs.readFile(jsonPath,'utf-8',function(err,data){
        if(err){
            console.log('err in read json',err);
            myError = err;
        }else{
            project = JSON.parse(data);
            testResult = attributeArr.every(function(item) {
                return project.hasOwnProperty(item);
            });
            if(!testResult){
                myError = new Error('not standard project!');
            }
        }
        cb&&cb(myError,project);
    })
}

/**
 * 根据压缩包中的资源，创建一个工程
 * @param resourcePath
 * @param cb
 */
function createProject(resourcePath,project,req,cb){
    var newProjectFolderPath = '';

    var newProject = new ProjectModel();
    newProjectFolderPath = path.join(__dirname,'../project/',String(newProject._id),'resources');

    newProject.userId = req.session.user.id;
    newProject.name =  project.name;
    newProject.author = project.author;
    newProject.resolution = String(project.size.width)+'*'+String(project.size.height);
    newProject.content = fixProjectContent(JSON.stringify(project),newProject._id);

    newProject.save(function(err){
        if(err){
            console.log('err in save new project',err);
            cb&&cb(err);
        }else{
            fs.stat(newProjectFolderPath,function(err,stats){
                if (stats&&stats.isDirectory&&stats.isDirectory()) {
                    //copy resource to project resource folder
                    fse.copy(resourcePath,newProjectFolderPath,function(err){
                        if(err){
                            console.log('err in copy resource to new project');
                        }
                        cb&&cb(err);
                    })
                }else{
                    mkdir(newProjectFolderPath,function(err){
                        if(err){
                            console.log('err in mkdir',err);
                            cb&&cb(err);
                        }else{
                            fse.copy(resourcePath,newProjectFolderPath,function(err){
                                if(err){
                                    console.log('err in copy resource to new project');
                                }
                                cb&&cb(err);
                            })
                        }
                    })
                }
            })
        }
    });
}

module.exports = localIDEService;
