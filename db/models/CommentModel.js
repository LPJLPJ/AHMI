/**
 * Created by lixiang on 2017/4/13.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/CommentSchema.js');
var CommentModel = new mongoose.model('CommentModel',CommentSchema);
module.exports = CommentModel;