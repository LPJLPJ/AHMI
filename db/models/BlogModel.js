/**
 * Created by changecheng on 2017/2/9.
 */
var mongoose = require('mongoose')
var BlogSchema = require('../schemas/BlogSchema')
var BlogModel = mongoose.model('BlogModel',BlogSchema)
module.exports = BlogModel