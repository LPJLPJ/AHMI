/**
 * Created by lixiang on 2016/12/6.
 */

var mongoose = require('mongoose');
var CANProjectSchema = require('../schemas/CANProjectSchema');
var CANProjectModel = mongoose.model('CANProjectModel',CANProjectSchema);
module.exports = CANProjectModel;
