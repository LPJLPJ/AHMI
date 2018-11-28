var ProjectModel = require('../db/models/ProjectModel');
var UserModel = require('../db/models/UserModel');
var TemplateModel = require('../db/models/TemplateModel');
var ClassModel = require('../db/models/ClassModel');
var fs = require('fs-extra');
var path = require('path');
var errHandler = require('../utils/errHandler');
var moment = require('moment');

var docsRoute = {};

docsRoute.getDocs = function(req,res){
    /*var contentPath = path.join(__dirname, '../public/docs/docs.md');
    fs.readFile(contentPath,'utf8',function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data)
        }
    });*/
    res.render('docs/index.html')
};

module.exports = docsRoute;