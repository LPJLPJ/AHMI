/**
 * Created by tang on 2018/11/01.
 */
var ProjectModel = require('../db/models/ProjectModel');
var UserModel = require('../db/models/UserModel');
var TemplateModel = require('../db/models/TemplateModel');
var ClassModel = require('../db/models/ClassModel');
var fs = require('fs');
var path = require('path');
var errHandler = require('../utils/errHandler');

var recycleRoute = {};

recycleRoute.getRecycle = function(req,res){
    res.render('recycle/recycle.html');
};


module.exports = recycleRoute;