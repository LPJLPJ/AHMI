/**
 * Created by ChangeCheng on 18/4/9.
 */
var mongoose = require('mongoose')

var TemplateSchema = new mongoose.Schema({
    name:String,
    userId:mongoose.Schema.Types.ObjectId,
    projectId:mongoose.Schema.Types.ObjectId,
    author:String,
    resolution:String,
    type:String,
    ideVersion:String,
    supportTouch:String,
    thumbnail:String,
    content:{type:String},
    collected:{type:Number,default:0},
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
})

TemplateSchema.index({createTime:-1});

TemplateSchema.pre('save',function(next){
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
    }

    next()



});


TemplateSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort({'createTime':-1})
            .exec(cb)
    },
    fetchBatch:function(from,limit,cb){
        return this
            .find({})
            .sort({'createTime':-1})
            .skip(from)
            .limit(limit)
            .exec(cb)
    },
    fetchInfoBatch:function(from,limit,cb){
        return this
            .find({},{content:0})
            .sort({'createTime':-1})
            .skip(from)
            .limit(limit)
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    findByProjectId:function(projectId,cb){
        return this
            .findOne({projectId:projectId})
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

module.exports= TemplateSchema