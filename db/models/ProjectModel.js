/**
 * Created by ChangeCheng on 16/5/7.
 */
var mongoose = require('mongoose')
var ProjectSchema = require('../schemas/ProjectSchema')
var ProjectModel = mongoose.model('ProjectModel',ProjectSchema)
module.exports= ProjectModel
