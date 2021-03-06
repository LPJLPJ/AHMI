/**
 * Created by lixiang on 2016/12/6.
 */

var mongoose = require('mongoose');

var CANProjectSchema = new mongoose.Schema({
    name:String,
    userId:mongoose.Schema.Types.ObjectId,
    author:String,
    type:String,
    content:{type:String},
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
});

CANProjectSchema.pre('save',function(next){
    var project = this;
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
    }
    next()
});


CANProjectSchema.statics = {
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
    },
    deleteById: function (_projectId, cb) {
        return this
            .remove({_id:_projectId})
            .exec(cb)
    }

};

module.exports=CANProjectSchema;