var express = require('express');
var path = require('path');
var router = express.Router();
var route_login = require('./route_login');
var route_signup = require('./route_signup');
var uploadFile = require('./uploadFile');
var getCaptcha = require('./getCaptcha');
var getUsers = require('./getUsers');
var route_space = require('./route_space');
var route_admin = require('./route_admin');
var routeValidate = require('./routeValidate');
var UserModel = require('../db/models/UserModel');
var DownloadRouter = require('./routeDownload');

//admin
var UserControl = require('../middlewares/UserControl');

//api route
var signupAPI = require('./api/signupAPI');
var loginAPI = require('./api/loginAPI');


//projects
var projectInfo = require('./projectinfo');
var generateProject = require('./generateProject');

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

// router.route('/userlist')
// .get(function(req, res){
// 	res.render('client/index.html')
// });

//index.html
router
.get('/',function(req,res){
	res.render('login/index.html')
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
//release and update
router.route('/admin/manage/releaseVersion')
    .get(route_admin.getReleaseVerSpace);
router.route('/admin/manage/releaseInfo')
    .get(route_admin.getReleaseInfo);
router.route('/admin/manage/release/update')
    .post(route_admin.releaseUpdate);
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
    .get(projectInfo.getBackupList)

router.route('/project/:id/editor')
    .get(projectInfo.getProjectById);

router.route('/project/:id/visualization')
    .get(projectInfo.getProjectTreeById);

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

router.route('/project/:id/download')
    .get(projectInfo.downloadProject);


router.route('/project/:id/savedatacompress')
    .post(projectInfo.saveDataAndCompress);

router.route('/project/:id/userType')
    .get(projectInfo.getUserType);



router.route('/project/create')
    .post(projectInfo.createProject);
router.route('/project/delete')
    .post(projectInfo.deleteProject);

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

router.route('/delete-user')
    .post(function(req, res){
    UserModel.findByName(req.body.username,function(err , user){
        if (err) {
            console.log(err);
            res.end('error')
        }
        if (user) {
            //duplicated name
            user.remove(function(err,user){
                if (err) {
                    console.log(err);
                    res.end('error')
                }

            })

        }
        UserModel.fetch(function(err, users){
            if (err) {
                console.log(err);
                res.end('error')
            }
            res.end(JSON.stringify(users))
        })


    })
});


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
    .delete(BlogRoute.deleteBlog)


//blog library
router.route('/blog/resources/upload')
    .post(BlogRoute.uploadImage)
router.route('/blog/resources/getresources')
    .get(BlogRoute.getResources)
router.route('/blog/resources/deleteresource')
    .delete(BlogRoute.deleteResource)

router.route('/blog/*')
    .get(BlogRoute.getIndex)

//comment
router.route('/blog/post/comment')
    .post(BlogRoute.postComment);
router.route('/blog/post/deleteComment')
    .delete(BlogRoute.deleteComment);

//download pcclient
router.route('/download/index.html')
    .get(DownloadRouter.getDownloadPage)

router.route('/download/pcclient/latest')
    .get(DownloadRouter.downloadPCClinet)





//router.route('*')
//    .all(function (req,res,next) {
//        res.render('login/404.html');
//    });
module.exports = router;