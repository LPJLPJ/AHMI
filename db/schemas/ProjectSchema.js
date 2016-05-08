/**
 * Created by ChangeCheng on 16/5/7.
 */
var mongoose = require('mongoose')

var ProjectSchema = new mongoose.Schema({
    name:String,
    userId:mongoose.Schema.Types.ObjectId,
    author:String,
    resolution:String,
    content:String,
    createTime:{type:Date,default:Date.now},
    lastModifiedTIme:{type:Date,default:Date.now}
})

ProjectSchema.pre('save',function(next){
    var project = this
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTIme = Date.now()
    }

    next()



})


ProjectSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('name')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    findByName:function(_name,cb){
        return this
            .findOne({name:_name})
            .exec(cb)
    },
    findByUser: function (_userId,cb) {
        return this
            .find({userId:_userId})
            .sort('lastModifiedTime')
            .exec(cb)
    }

}

module.exports= ProjectSchema