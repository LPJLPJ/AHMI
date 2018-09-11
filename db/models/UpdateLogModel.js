/**
 * Created by tang on 2018/8/20
 */
var mongoose = require('mongoose');
var UpdateLogSchema = require('../schemas/UpdateLogSchema');
var UpdateLogModel = mongoose.model('UpdateLogModel',UpdateLogSchema);
module.exports= UpdateLogModel;
