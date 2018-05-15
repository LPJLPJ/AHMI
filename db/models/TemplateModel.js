/**
 * Created by ChangeCheng on 18/4/9.
 */
var mongoose = require('mongoose')
var TemplateSchema = require('../schemas/TemplateSchema')
var TemplateModel = mongoose.model('TemplateModel',TemplateSchema)
module.exports= TemplateModel
