/**
 * Created by lixiang on 2016/12/6.
 */
var CANProjectModel = require('../db/models/CANProjectModel');
var UserModel = require('../db/models/UserModel');
var _ = require('lodash');
var fs = require('fs');
var errHandler = require('../utils/errHandler');
var path = require('path');
var mkdir = require('mkdir-p')

var CANProjectRouter = {};

CANProjectRouter.createCANProject = function(req,res){
    var data = _.cloneDeep(req.body);
    if(req.session.user){
        //user exists
        data.userId = req.session.user.id;
        var newCANProject = new CANProjectModel(data);
        newCANProject.save(function(err){
            if(err){
                //console.log('CAN project create err when save',err);
                errHandler(res,500,'save error');
            }
            var newCANProjectInfo = _.cloneDeep(newCANProject);
            res.end(JSON.stringify(newCANProjectInfo));
        });
    }else{
        console.log('user not exit');
        res.status(500).end('not login');
    }
};

CANProjectRouter.getAllCANProjects = function(req,res){
    CANProjectModel.fetch(function(err,projects){
        if(err){
            errHandler(res,500,err);
        }
        res.end(projects);
    })
};

CANProjectRouter.getCANProjectById = function(req,res){
    var projectId = req.params.id;
    var userId = req.session.user&&req.session.user.id;
    if(projectId&&projectId!=''){
        CANProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'error');
            }
            if(userId==project.userId){
                res.render('ide/indexOfCAN');
            }else{
                res.render('login/login.html',{
                    title:'重新登录'
                });
            }
        })
    }else{
        errHandler(res,500,'invalid project id');
    }
};

CANProjectRouter.getCANProjectContent = function(req,res){
    var projectId = req.params.id;
    if(projectId && projectId!=""){
        CANProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'invalid project');
            }
            res.send(JSON.stringify(project));
        })
    }else{
        errHandler(res,500,'invalid project id');
    }
};

CANProjectRouter.saveCANProject = function(req,res){
    var projectId = req.params.id;
    if(projectId&&projectId!=""){
        CANProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'error');
            }else{
                var curProjectContent = req.body.data;
                //console.log('curProjectContent',curProjectContent);
                if(curProjectContent){
                    project.content = JSON.stringify(curProjectContent);
                    project.save(function(err){
                       if(err){
                           errHandler(res,500,'error');
                       }else{
                           res.end('ok');
                       }
                    });
                }else{
                    errHandler(res,500,'error');
                }
            }
        })
    }else{
        errHandler(res,500,'invalid project id');
    }
};

CANProjectRouter.updateCANProject = function(req,res){
    var newProject = req.body;
    if(newProject._id){
        CANProjectModel.findById(newProject._id,function(err,project){
            if(err){
                console.log('err',err);
                res.end(err);
            }
            if(project){
                for(var key in newProject){
                    if(key!='id'){
                        project[key]=newProject[key];
                    }
                }
                project.save(function(err){
                    if(err){
                        res.end('save err');
                    }
                    res.end('ok');
                })
            }else{
                res.end('no project');
            }
        })
    }else{
        res.end('err');
    }
};

CANProjectRouter.deleteCANProject = function(req,res){
    var projectId = req.body.projectId;
    if(projectId&&projectId!=""){
        CANProjectModel.deleteById(projectId,function(err){
            if(err){
                errHandler(res,500,'delete error');
            }else{
                //delete directory
                var targetDir = path.join(__dirname,'../project/',String(projectId));
                fs.stat(targetDir,function(err,stats){
                    if(err){
                        errHandler(res,500,'CAN folder url error');
                    }else{
                        if(stats&&stats.isDirectory&&stats.isDirectory()){
                            //exists and delete
                            fs.rmdir(targetDir,function(){
                                res.end('ok');
                            })
                        }else{
                            res.end('ok');
                        }
                    }
                })
            }
        })
    }else{
        errHandler(res,500,'invalid project id');
    }
};

CANProjectRouter.getAllCANProjectNames = function(req,res){
    var _user = req.session.user;
    if(_user && _user.username && _user.id){
        CANProjectModel.findByUser(_user.id,function(err,projects){
            if(err){
                console.log('err',err);
                errHandler(res,500,'error');
            }else{
                if(projects){
                    var processedProjects = _.cloneDeep(projects).map(function(project){
                        return {
                            name:project.name,
                            id:project.id
                        };
                    });
                    res.send(JSON.stringify(processedProjects));
                }else{
                    errHandler(res,500,'error');
                }
            }
        })
    }else{
        errHandler(res,500,'user not login');
    }
};

CANProjectRouter.generateCANFile = function(req,res){
    var CANProjectId = req.params.id;
    //console.log('typeof projectId',typeof projectId);
    var projectId = req.body.projectId;
    if(CANProjectId!=''){
        CANProjectModel.findById(CANProjectId,function(err,CANProject){
            if(err){
                errHandler(res,500,'CANProject not find!');
            }else{
                var CANContent = JSON.parse(CANProject.content);
                var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
                var DataFileUrl = path.join(ProjectBaseUrl,'resources','CANFile.json');
                fs.writeFile(DataFileUrl,JSON.stringify(CANContent,null,4),function(err){
                    if(err){
                        errHandler(res,500,'write CANCANFile error');
                    }else{
                        res.end('ok');
                    }
                })
            }
        })
    }else{
        errHandler(res,500,'CANProjectId error');
    }
};
CANProjectRouter.deleteCANFile = function(req,res){
    var projectId = req.params.id;
    if(projectId!=''){
        var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl,'resources','CANFile.json');
        fs.unlink(DataFileUrl,function(err){
            if(err){
                errHandler(res,500,'delete CAN file fail');
            }else{
                res.end('ok');
            }
        })
    }else{
        errHandler(res,500,'projectId error');
    }
};
CANProjectRouter.writeCANFile = function(req,res){
    var projectId = req.params.id;
    var curProjectContent = req.body.data;
    //console.log('projectId',projectId,'data',curProjectContent);
    if(projectId!=''){
        CANProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'error');
            }else{
                //console.log('curProjectContent',curProjectContent);
                if(curProjectContent){
                    project.content = JSON.stringify(curProjectContent);
                    project.save(function(err){
                       if(err){
                            errHandler(res,500,'save error');
                       }else{
                            
                       }
                    });
                }else{
                    errHandler(res,500,'save error');
                }
                var targetDir = path.join(__dirname,'../project/',String(projectId))
                fs.stat(targetDir,function(err,stats){
                    if(stats&&stats.isDirectory&&stats.isDirectory()){
                        var DataFileUrl = path.join(targetDir,'CANFile.json');
                        fs.writeFile(DataFileUrl,JSON.stringify(curProjectContent,null,4),function(err){
                            if(err){
                                errHandler(res,500,'write CANCANFile error');
                            }else{
                                res.end('ok');
                            }
                        })
                    }else{
                        //console.log('create dir');
                        mkdir(targetDir,function(err){
                            if(err){
                                errHandler(res,500,'mkdir error');
                            }else{
                                var DataFileUrl = path.join(targetDir,'CANFile.json');
                                fs.writeFile(DataFileUrl,JSON.stringify(curProjectContent,null,4),function(err){
                                    if(err){
                                        errHandler(res,500,'write CANCANFile error');
                                    }else{
                                        res.end('ok');
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    }else{
        errHandler(res,500,'projectId is null')
    }
};
CANProjectRouter.downloadCANFile = function(req,res){
    var projectId = req.params.id;
    if(projectId!=''){
        var projectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var fileUrl = path.join(projectBaseUrl,'CANFile.json');
        //console.log('fileUrl',fileUrl);
        res.download(fileUrl,'CANFile.json',function(err){
            if(err){
                console.log('err',err);
                errHandler(res,500,err);
            }else{

            }
        })
    }else{
        errHandler(res,500,'projectId error');
    }
}


module.exports = CANProjectRouter;