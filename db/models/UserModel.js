var mongoose = require('mongoose')
var UserSchema = require('../schemas/UserSchema')
var UserModel = mongoose.model('UserModel',UserSchema)
module.exports= UserModel