var TemplateModel = require('../db/models/TemplateModel')
var ProjectModel = require('../db/models/ProjectModel')
var UserModel = require('../db/models/UserModel')
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
                                template.name = project.name
                                template.author = project.author
                                template.resolution = project.resolution
                                template.type = project.type
                                template.ideVersion = project.ideVersion
                                template.supportTouch = project.supportTouch
                                template.thumbnail = project.thumbnail
                                template.content = project.content
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
    TemplateModel.fetchInfoBatch(0,10,req.query.filter,req.query.key,function (err, templates) {
        if (err){
            errHandler(res,500,JSON.stringify(err))
        }else{
            res.end(JSON.stringify(templates))
        }
    })
}

TemplateRoute.getUserTemplateIds = function (req, res) {
    var userId = req.session.user && req.session.user.id
    if (!userId){return errHandler(res,500,'invalid user')}
    UserModel.findById(userId,function (err, user) {
        if(err){return errHandler(res,500,JSON.stringify(err))}
        if(!user){return errHandler(res,500,'user not found')}
        res.end(JSON.stringify(user.templateIds||[]))
    })
}



TemplateRoute.getUserTemplateInfos = function (req, res) {
    var userId = req.session.user && req.session.user.id
    if (!userId){return errHandler(res,500,'invalid user')}
    UserModel.findById(userId,function (err, user) {
        if(err){return errHandler(res,500,JSON.stringify(err))}
        if(!user){return errHandler(res,500,'user not found')}
        var ids = user.templateIds||[]
        if (!ids.length){return res.end(JSON.stringify([]))}
        TemplateModel.fetchUserTemplateInfos(ids,function (err,templates) {
            if(err){return errHandler(res,500,JSON.stringify(err))}
            res.end(JSON.stringify(templates))
        })
    })
}

TemplateRoute.collectTemplate = function (req, res) {
    var userId = req.session.user && req.session.user.id
    var templateId = req.body.templateId
    if (!templateId){
        return errHandler(res,500,'invalid templateId')
    }
    if (userId){
        UserModel.findById(userId,function (err, user) {
            if (err) {return errHandler(res,500,JSON.stringify(err))}
            if (user){
                user.templateIds = user.templateIds || []
                if (addItemToSet(templateId,user.templateIds)){
                    user.save(function (err) {
                        if (err) {return errHandler(res,500,JSON.stringify(err))}
                        res.end('ok')
                        //inc collected
                        TemplateModel.incById(templateId)
                    })
                }else{
                    res.end('ok')
                }


            }else{
                errHandler(res,500,'user not found')
            }
        })
    }else{
        errHandler(res,500,'unlogin')
    }
}

TemplateRoute.uncollectTemplate = function (req, res) {
    var userId = req.session.user && req.session.user.id
    var templateId = req.body.templateId
    if (!templateId){
        return errHandler(res,500,'invalid templateId')
    }
    if (userId){
        UserModel.findById(userId,function (err, user) {
            if (err) {return errHandler(res,500,JSON.stringify(err))}
            if (user){
                user.templateIds = user.templateIds || []
                if (deleteFromSet(templateId,user.templateIds)){
                    user.save(function (err) {
                        if (err) {return errHandler(res,500,JSON.stringify(err))}
                        res.end('ok')
                        TemplateModel.decById(templateId)
                    })
                }else{
                    res.end('ok')
                }


            }else{
                errHandler(res,500,'user not found')
            }
        })
    }else{
        errHandler(res,500,'unlogin')
    }
}

function addItemToSet(item,curItems) {
    var flag = false
    for(var i=0;i<curItems.length;i++){
        if (curItems[i]==item){
            flag = true
            break
        }
    }
    if (!flag){
        curItems.push(item)
    }

    return !flag
}

function deleteFromSet(item,curItems) {
    var flag = false
    for(var i=0;i<curItems.length;i++){
        if (curItems[i]==item){
            flag = true
            break
        }
    }
    if (flag){
        curItems.splice(i,1)
    }

    return flag
}



module.exports = TemplateRoute