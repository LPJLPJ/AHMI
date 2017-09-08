/**
 * Created by ChangeCheng on 16/5/7.
 */
var mongoose = require('mongoose')

var ProjectSchema = new mongoose.Schema({
    name:String,
    userId:mongoose.Schema.Types.ObjectId,
    author:String,
    resolution:String,
    type:String,
    template:String,
    supportTouch:String,
    curSize:String,
    maxSize:String,
    thumbnail:String,
    content:{type:String},
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
})

ProjectSchema.pre('save',function(next){
    var project = this
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
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
            .sort({'createTime':-1})
            .exec(cb)
    },
    deleteById: function (_projectId, cb) {
        return this
            .remove({_id:_projectId})
            .exec(cb)
    }

}

module.exports= ProjectSchema