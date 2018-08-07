/**
 * Created by tang on 2018/6/12.
 */
var mongoose=require('mongoose');
var ClassSchema=new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    name:String,
    author:String,
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
});

ClassSchema.index({createTime:-1});

ClassSchema.pre('save',function(next){

    if(this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
    }

    next();
});

ClassSchema.statics={
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
    findFolderByUser:function (_userId,cb) {
        return this
            .find({userId:_userId})
            .sort({'createTime':-1})
            .exec(cb)
    }
};

module.exports= ClassSchema;