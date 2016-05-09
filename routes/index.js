var express = require('express')
var path = require('path')
var router = express.Router()
var route_login = require('./route_login')
var route_signup = require('./route_signup')
var uploadFile = require('./uploadFile')
var getCaptcha = require('./getCaptcha')
var getUsers = require('./getUsers')
var route_space = require('./route_space')
var routeValidate = require('./routeValidate')
//projects
var projectInfo = require('./projectinfo')

router.route('/userlist')
.get(function(req, res){
	res.render('client/index.html')
})

router
.get('/',function(req,res){
	console.log(req.session);
	// res.sendFile(path.join(__dirname,'..','static/modules/ide/index.html'))
	res.render('login/index.html')
})

router.route('/user/signup')
.get(route_signup.get)
.post(route_signup.post)

router.route('/user/login')
.get(route_login.get)
.post(route_login.post)
router.route('/user/logout')
.get(route_login.logout)

router.route('/private/space')
.get(route_space)

router.route('/api/upload')
.post(uploadFile)


router.route('/captcha')
.get(getCaptcha)


router.route('/users')
.get(getUsers)

router.route('/private/test')
.get(function(req, res){
	res.sendFile(path.join(__dirname,'..','client','private.html'))
})

router.route('/utils/checkusername')
.post(routeValidate.checkusername)

router.route('/utils/checkmail')
.post(routeValidate.checkmail)


//projects

router.route('/project/:id/basicinfo')
    .post(projectInfo.updateProject)

router.route('/project/:id/all')
    .get(projectInfo.getProjectById)

router.route('/project/:id/content')
    .get(projectInfo.getProjectContent)

router.route('/project/create')
    .post(projectInfo.createProject)
router.route('/project/delete')
    .post(projectInfo.deleteProject)

module.exports = router