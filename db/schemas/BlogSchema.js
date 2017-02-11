/**
 * Created by changecheng on 2017/2/9.
 */
var mongoose = require('mongoose')

var BlogSchema = new mongoose.Schema({
    authorId:mongoose.Schema.Types.ObjectId,
    publish:{type:Boolean,default:false},
    title:String,
    desp:String,
    keywords:String,
    digest:String,
    content:String,
    modifing:{type:Boolean,default:true},
    drafts:[
        {
            title:String,
            desp:String,
            keywords:String,
            content:String
        }
    ],
    resources:[String],
    publishTime:{type:Date,default:Date.now},
    createTime:{type:Date,default:Date.now},
    lastModifyTime:{type:Date,default:Date.now}
})

BlogSchema.pre('save',function(next){
    // console.log('saving');
    var blog = this
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifyTime = Date.now()

    }
    next()


})

BlogSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('publishTime')
            .exec(cb)
    },
    fetchBatch:function(from,limit,cb){
        if (limit===0){
            return this
                .find({})
                .sort('publishTime')
                .skip(from)
                .exec(cb)
        }else{
            return this
                .find({})
                .sort('publishTime')
                .skip(from)
                .limit(limit)
                .exec(cb)
        }

    },
    fetchPublishedBatch:function(from,limit,cb){
        if (limit===0){
            return this
                .find({publish:true})
                .sort('publishTime')
                .skip(from)
                .exec(cb)
        }else{
            return this
                .find({})
                .sort('publishTime')
                .skip(from)
                .limit(limit)
                .exec(cb)
        }

    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    findByTitle:function(title,cb){
        return this
            .findOne({title:title})
            .exec(cb)
    },
    findByAuthor:function (authorId,cb) {
        return this
            .find({authorId:authorId})
            .sort('publishTime')
            .exec(cb)
    },
    deleteById: function (blogId, cb) {
        return this
            .remove({_id:blogId})
            .exec(cb)
    }

}

module.exports= BlogSchema