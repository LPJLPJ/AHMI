/**
 * Created by tang on 2018/6/12
 */
var mongoose = require('mongoose');
var ClassSchema = require('../schemas/ClassSchema');
var ClassModel = mongoose.model('ClassModel',ClassSchema);
module.exports= ClassModel;
