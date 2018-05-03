var TemplateModel = require('../db/models/TemplateModel')
var ProjectModel = require('../db/models/ProjectModel')
var errHandler = require('../utils/errHandler')
var fse = require('fs-extra');
var path = require('path')
var TemplateRoute = {}

TemplateRoute.getTemplateCenter = function (req, res) {
    res.render('templateCenter/templateCenter.html')
}

TemplateRoute.saveNewTemplate = function (req, res) {
    var projectId = req.body.projectId
    if (projectId){
        TemplateModel.findByProjectId(projectId,function (err, template) {
            if (err){
                errHandler(res,500,JSON.stringify(err))
            }else{

                ProjectModel.findById(projectId,function (err, project) {
                    if (err){
                        errHandler(res,500,JSON.stringify(err))
                    }else{
                        if (project){
                            //save template
                            var newTemplate
                            if (template){
                                newTemplate = template
                            }else{
                                newTemplate = new TemplateModel({
                                    name:project.name,
                                    userId:project.userId,
                                    projectId:projectId,
                                    author:project.author,
                                    resolution:project.resolution,
                                    type:project.type,
                                    ideVersion:project.ideVersion,
                                    supportTouch:project.supportTouch,
                                    thumbnail:project.thumbnail,
                                    content:project.content
                                })
                            }

                            var newId = newTemplate._id;
                            if(newTemplate.content){
                                newTemplate.content=newTemplate.content.replace(/project\/[\S]+?\/resources/g,'template/'+newId+'/resources');
                            }
                            newTemplate.save(function(err){
                                if(err){
                                    errHandler(res,500,'save new project err')
                                }else{
                                    //console.log('save new project success');
                                    var targetDir = path.join(__dirname,'../template/',String(newTemplate._id));
                                    var srcDir = path.join(__dirname,'../project/',projectId);
                                    fse.ensureDir(targetDir,function(err){
                                        if(err){
                                            errHandler(res,500,'ensureDir err');
                                        }else{
                                            //console.log('make dir success');
                                            fse.copy(srcDir,targetDir,function(err){
                                                if(err){
                                                    errHandler(res,500,'copy project folder err')
                                                }else{
                                                    //console.log('copy dir success');
                                                    res.end('ok');
                                                }
                                            })
                                        }
                                    })
                                }
                            });
                        }else{
                            errHandler(res,500,'project not found')
                        }
                    }
                })
            }
        })
    }else{
        errHandler(res,500,'invalid projectId')
    }
}

TemplateRoute.getTemplatesForCenter = function (req, res) {
    TemplateModel.fetchBatch(0,10,function (err, templates) {
        if (err){
            errHandler(res,500,JSON.stringify(err))
        }else{
            res.end(JSON.stringify(templates))
        }
    })
}



module.exports = TemplateRoute