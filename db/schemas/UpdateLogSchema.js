/**
 * Created by tang on 2018/8/20.
 */
var mongoose=require('mongoose');
var UpdateLogSchema=new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    author:String,
    title:String,
    explain:String,
    content:[String],
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
});

UpdateLogSchema.index({createTime:-1});

UpdateLogSchema.pre('save',function(next){
    if(this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
    }
    next();
});



UpdateLogSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort({'createTime':-1})
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    deleteById:function (id, cb) {
        return this
            .remove({_id:id})
            .exec(cb)
    },
    findByPage:function(page,cb){
        return this
            .find({})
            .skip((page-1)*2)
            .limit(2)
            .sort({'createTime':-1})
            .exec(cb)
    }
};

module.exports= UpdateLogSchema;


