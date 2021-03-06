var express = require('express');
var path = require('path');
var router = express.Router();
var route_login = require('./route_login');
var route_signup = require('./route_signup');
var uploadFile = require('./uploadFile');
var getCaptcha = require('./getCaptcha');
var getUsers = require('./getUsers');
var route_space = require('./route_space');
var folder_space = require('./folder_space');
var route_admin = require('./route_admin');
var routeValidate = require('./routeValidate');
var UserModel = require('../db/models/UserModel');
var ProjectModel = require('../db/models/ProjectModel')
var DownloadRouter = require('./routeDownload');
var VersionManager = require('../utils/versionManager');
var templateRoute = require('./templateRoute')
var fse = require('fs-extra')

//admin
var UserControl = require('../middlewares/UserControl');

//api route
var signupAPI = require('./api/signupAPI');
var loginAPI = require('./api/loginAPI');


//projects
var projectInfo = require('./projectinfo');
var generateProject = require('./generateProject');

//recycle
var recycle = require('./route_recycle');

//docs
var docs = require('./route_docs');

//CAN projects
var CANProjectInfo = require('./CANProjectInfo');

//sessionTouch
var sessionTouch = require('../middlewares/sessionTouch');

//mail
var sendMail = require('./sendMail');
var userVerify = require('./userVerify');


//password
var findPassword = require('./findPassword');

//update local
var localIDEService = require('./localIDEService');


//update local IDE
router.route('/checkUpdate/manifest.json')
    .get(localIDEService.getCurrentVer);
router.route('/releases/updapp/win/updFiles.zip')
    .get(localIDEService.downloadNewVerZip);
//upload local project
router.route('/upload/project')
    .post(localIDEService.uploadProject);
router.route('/upload/project/zip')
    .post(localIDEService.uploadProjectZip);
//return user type
router.route('/user/checkUserType')
    .post(localIDEService.returnUserType);

//blog
var BlogRoute = require('./routeBlog');

//update log
var UpdateLogRoute = require('./route_updateLog');

// router.route('/userlist')
// .get(function(req, res){
// 	res.render('client/index.html')
// });

//index.html
router
.get('/',function(req,res){
	// res.render('login/index.html')
    res.render('login/home.html');
});



//admin
router.route('/admin/login')
    .get(route_admin.getLogin)
    .post(route_admin.postLogin);

router.route('/admin/manage/*')
    .all(UserControl.admin);

router.route('/admin/manage/space')
    .get(route_admin.getManageSpace);
router.route('/admin/manage/users')
    .get(route_admin.getUsers);
router.route('/admin/manage/changeusertype')
    .post(route_admin.changeUserType);

router.route('/admin/manage/delete-user')
    .post(function(req, res){
    UserModel.findByName(req.body.username,function(err , user){
        if (err) {
            res.status(500).end('error, no such user')
        }
        if (user) {
            var deleteUserCB = function(deleteProjectErr){
                if(deleteProjectErr){
                    res.status(500).end(JSON.stringify(deleteProjectErr))
                }else{
                    user.remove(function(err){
                        if (err) {
                            res.status(500).end('error'+err)
                        }else{
                            res.end('ok')
                        }
    
                    })
                }
                
            }
            //remove user projects
            ProjectModel.findProjectInfosByUser(user,function(err,projects){
                if(err){
                    res.end('error'+err)
                }else{
                    if(projects && projects.length){
                        var count = projects.length
                        var lastErr = null
                        var deleteProjectCB = function(err){
                            if(err){
                                lastErr = err
                            }
                            count--
                            if(count == 0){
                                //finish
                                deleteUserCB(lastErr)
                            }
                        }
                        projects.forEach(function(p){
                            ProjectModel.deleteById(p._id,function(err){
                                if(err){
                                    deleteProjectCB(err)
                                }else{
                                    //delete project data ok
                                    var targetDir = path.join(__dirname, '../project/', String(p._id)||'undefined');
                                    fse.remove(targetDir,function(err){
                                        if(err){
                                            deleteProjectCB(err)
                                        }else{
                                            //delete ok
                                            deleteProjectCB()
                                        }
                                    })
                                }
                            })
                        })
                    }else{
                        //no need to delete
                        deleteUserCB()
                    }
                    

                }
            })
            

        }else{
            res.status(500).end('error, no such user')
        }


    })
});
//release and update
router.route('/admin/manage/releaseVersion')
    .get(route_admin.getReleaseVerSpace);
router.route('/admin/manage/releaseInfo')
    .get(route_admin.getReleaseInfo);
router.route('/admin/manage/release/update')
    .post(route_admin.releaseUpdate);

router.route('/admin/manage/templatesSpace')
.get(route_admin.getTemplateSpace);

router.route('/admin/manage/templates/delete')
.delete(route_admin.deleteTemplates);
//user control
//signup
router.route('/user/signup')
.get(route_signup.get);

router.route('/user/signupapi')
.post(signupAPI.post);




//login

router.route('/user/login')
.get(route_login.get);

router.route('/user/loginAPI')
.post(loginAPI.post);

router.route('/user/logininfo')
    .get(loginAPI.getLoginInfo)

//logout
router.route('/user/logout')
.get(route_login.logout);


router.route('/private/*')
    .all(sessionTouch);
router.route('/private/space')
.get(route_space);


//router.route('/private/info')
//    .get(route_personalInfo)

router.route('/api/*')
    .all(sessionTouch);

router.route('/api/upload')
.post(uploadFile.uploadTest);

router.route('/api/generateproject')
    .post(generateProject);

router.route('/api/refreshlogin')
    .get(function (req, res) {
       res.end('ok');
    });

router.route('/api/versions')
    .get(function (req, res) {
        res.end(JSON.stringify(VersionManager.versions||[]))
    })

//captcha
router.route('/captcha')
.get(getCaptcha);


router.route('/users')
.get(getUsers);

router.route('/private/test')
.get(function(req, res){
	res.sendFile(path.join(__dirname,'..','client','private.html'))
});

router.route('/utils/checkusername')
.post(routeValidate.checkusername);

router.route('/utils/checkmail')
.post(routeValidate.checkmail);


//projects

router.route('/project/*')
    .all(sessionTouch);

router.route('/project/:id/basicinfo')
    .post(projectInfo.updateProject);

router.route('/project/:id/backuplist')
    .get(projectInfo.getBackupList);

router.route('/project/:id/editor')
    .get(projectInfo.getProjectById);

router.route('/project/:id/visualization')
    .get(projectInfo.getProjectTreeById);

router.route('/project/:id/data-analysis')
    .get(projectInfo.renderDataAnalysis);

router.route('/project/:id/content')
    .get(projectInfo.getProjectContent);

router.route('/project/:id/share')
    .get(projectInfo.getShareInfo)
    .post(projectInfo.updateShare)

router.route('/project/:id/sharedkey')
    .post(projectInfo.checkSharedKey)

router.route('/project/:id/save')
    .put(projectInfo.saveProject);
router.route('/project/:id/saveAs')
    .post(projectInfo.saveProjectAs);


router.route('/project/:id/thumbnail')
    .post(projectInfo.saveThumbnail);

router.route('/project/:id/generate')
    .post(projectInfo.generateProject);

router.route('/project/:id/generateLocalProject')
    .post(projectInfo.generateLocalProject);
router.route('/project/:id/downloadLocalProject')
    .get(projectInfo.downloadLocalProject);

router.route('/project/:id/resourcesSize')
    .get(projectInfo.getProjectResourcesSize)

router.route('/project/:id/download')
    .get(projectInfo.downloadProject);
//download resources
router.route('/project/:id/downloadFile')
    .get(projectInfo.downloadFile);
//download tag Excel
router.route('/project/:id/generateTagExcel')
    .post(projectInfo.generateTagExcel);
router.route('/project/:id/downloadTagExcel')
    .get(projectInfo.downloadTagExcel);


router.route('/project/:id/savedatacompress')
    .post(projectInfo.saveDataAndCompress);

router.route('/project/:id/userType')
    .get(projectInfo.getUserType);



router.route('/project/create')
    .post(projectInfo.checkCountAvailable, projectInfo.createProject);
router.route('/project/delete')
    .post(projectInfo.deleteProject);
router.route('/project/moveToClass')
    .post(projectInfo.updateProject);


//project class   add by tang
router.route('/folder/create')
    .post(projectInfo.createFolder);
router.route('/folder/update')
    .post(projectInfo.updateFolder);
router.route('/folder/delete')
    .post(projectInfo.deleteFolder);
router.route('/folder/getFolderList')
    .get(projectInfo.getFolderList);
router.route('/folder/:id/space')
    .get(folder_space);
router.route('/folder/space')
    .post(folder_space);

//project recycle
router.route('/project/recycle')
    .get(recycle.getRecycle);
router.route('/recycle/delete')
    .post(recycle.deleteRecycle);
router.route('/recycle/refund')
    .post(recycle.refundRecycle);
router.route('/recycle/clear')
    .post(recycle.clearRecycle);

//docs
router.route('/docs')
    .get(docs.getDocs);


//CAN project
router.route('/CANProject/create')
    .post(CANProjectInfo.createCANProject);
router.route('/CANProject/delete')
    .post(CANProjectInfo.deleteCANProject);
router.route('/CANProject/:id/editor')
    .get(CANProjectInfo.getCANProjectById);
router.route('/CANProject/:id/content')
    .get(CANProjectInfo.getCANProjectContent);
router.route('/CANProject/:id/save')
    .post(CANProjectInfo.saveCANProject);
router.route('/CANProject/:id/basicinfo')
    .post(CANProjectInfo.updateCANProject);
router.route('/CANProject/names')
    .get(CANProjectInfo.getAllCANProjectNames);
router.route('/CANProject/:id/importCANFile')
    .post(CANProjectInfo.generateCANFile);
router.route('/CANProject/:id/deleteCANFile')
    .post(CANProjectInfo.deleteCANFile);
router.route('/CANProject/:id/writeCANFile')
    .post(CANProjectInfo.writeCANFile);
router.route('/CANProject/:id/downloadCANFile')
    .get(CANProjectInfo.downloadCANFile);

//project file
router.route('/project/:id/upload')
    .post(uploadFile.uploadProjectFile);

//add by tang   mask upload
router.route('/project/:id/mask')
    .post(uploadFile.uploadMask);

router.route('/project/:id/generatetex')
    .post(uploadFile.uploadTex);

router.route('/project/:id/delete')
    .post(uploadFile.deleteProjectFile);

router.route('/project/:id/resources/:rid')
    .get(uploadFile.getProjectFile);

router.route('/project/:id/resources/template/:rid')
    .get(uploadFile.getProjectTemplateFile);

router.route('/project/:id/deleteresource/:rid')
    .delete(uploadFile.deleteResource);


//template center
router.route('/templatecenter')
    .get(templateRoute.getTemplateCenter)

//templates
router.route('/templates/center')
    .get(templateRoute.getTemplatesForCenter)

router.route('/templates/user/ids')
    .get(templateRoute.getUserTemplateIds)

router.route('/templates/user/infos')
    .get(templateRoute.getUserTemplateInfos)

router.route('/templates/new')
    .post(templateRoute.saveNewTemplate)

router.route('/templates/collect')
    .post(templateRoute.collectTemplate)

router.route('/templates/uncollect')
    .post(templateRoute.uncollectTemplate)


router.route('/mail/sendverifymail')
    .post(sendMail.sendVerifyMail);
//
router.route('/mail/sendpasswordmail')
    .get(sendMail.sendPasswordMail);

//router.route('/mail/test')
//    .get(sendMail.sendTestMail)

router.route('/user/verify')
    .get(userVerify.verify);


//password
router.route('/user/forgetpassword')
    .get(findPassword.getFindPasswordPage)
    .post(findPassword.postMail);

router.route('/user/findpassword')
    .get(findPassword.getResetPasswordPage)
    .post(findPassword.resetPassword);


//blog
router.route('/blog/manage')
    .all(UserControl.admin)
    .get(BlogRoute.getManage)
router.route('/blog/editor')
    .all(UserControl.admin)
    .get(BlogRoute.getEditor)
router.route('/blog/post')
    .get(BlogRoute.getBlog)

router.route('/blog/getblogdata')
    .get(BlogRoute.getBlogData)

router.route('/blog/createblog')
    .all(UserControl.admin)
    .get(BlogRoute.createBlog)
router.route('/blog/savedraft')
    .all(UserControl.admin)
    .post(BlogRoute.saveDrat)

router.route('/blog/publish')
    .all(UserControl.admin)
    .post(BlogRoute.publishBlog)

router.route('/blog/getlastmodified')
    .get(BlogRoute.getLastModified)

router.route('/blog/getallblogs')
    .get(BlogRoute.getAllBlogs)

router.route('/blog/getallpublishedblogs')
    .get(BlogRoute.getAllPublishedBlogs)
router.route('/blog/unpublish')
    .all(UserControl.admin)
    .post(BlogRoute.unpublishBlog)
router.route('/blog/deleteblog')
    .all(UserControl.admin)
    .post(BlogRoute.deleteBlog)
router.route('/blog/getMyBlog')
    .get(BlogRoute.getMyBlog);
router.route('/blog/getRecommend')
    .get(BlogRoute.getRecommendBlog);


//blog library
router.route('/blog/resources/upload')
    .post(BlogRoute.uploadImage)
router.route('/blog/resources/getresources')
    .get(BlogRoute.getResources)
router.route('/blog/resources/deleteresource')
    .delete(BlogRoute.deleteResource)

router.route('/blog/*')
    .get(BlogRoute.getIndex)

//updateLog
router.route('/update-log')
    .get(UpdateLogRoute.getLogIndex);
router.route('/update-log/release')
    .all(UserControl.admin)
    .get(UpdateLogRoute.releaseUpdateLog);
router.route('/update-log/save')
    .post(UpdateLogRoute.saveUpdateLog);
router.route('/update-log/manage')
    .all(UserControl.admin)
    .get(UpdateLogRoute.getLogEditIndex);
router.route('/update-log/delete')
    .post(UpdateLogRoute.deleteUpdateLog);
router.route('/update-log/edit')
    .get(UpdateLogRoute.editUpdateLog);
router.route('/update-log/update')
    .post(UpdateLogRoute.saveEditLog);
router.route('/update-log/index')
    .get(UpdateLogRoute.getLogIndex);


//comment
router.route('/blog/post/comment')
    .post(BlogRoute.postComment);
router.route('/blog/post/deleteComment')
    .delete(BlogRoute.deleteComment);

//download pcclient
router.route('/download/index.html')
    .get(DownloadRouter.getDownloadPage)

router.route('/download/resources.html')
    .get(DownloadRouter.getResourcesDownloadPage)

router.route('/download/pcclient/latest')
    .get(DownloadRouter.downloadPCClinet)

router.route('/download/pcclient_xp/latest')
    .get(DownloadRouter.downloadPCClinetXP)

// router.route('/project/data-analysis')
//     .get(function(req, res){
//         console.log('data-analysis');
//         res.sendFile(path.join(__dirname,'..','public','data-analysis','index.html'))
//     });


//router.route('*')
//    .all(function (req,res,next) {
//        res.render('login/404.html');
//    });
module.exports = router;