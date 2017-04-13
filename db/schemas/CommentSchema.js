/**
 * Created by lixiang on 2017/4/13.
 */

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    authorId:mongoose.Schema.Types.ObjectId,
    blogId:mongoose.Schema.Types.ObjectId,
    content:String,
    email:String,
    authorName:String,
    createTime:{type:Data,default:Data.now},
    resources:[String]
});


CommentSchema.pre('save',function(next){
    // console.log('saving');
    if (this.isNew){
        this.createTime = Date.now()
    }else{

    }
    next();
});

CommentSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('createTime')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .find({_id:id})
            .sort('createTime')
            .exec(cb)
    },
    findByAuthor:function(id,cb){
        return this
            .find({authorId:id})
            .sort('createTime')
            .exec(cb)
    },
    findByBlog:function(id,cb){
        return this
            .find({blogId:id})
            .sort('createTime')
            .exec(cb)
    },
    deleteById:function(id,cb) {
        return this
            .remove({_id: id})
            .exec(cb)
    }
};

module.exports = CommentSchema;
