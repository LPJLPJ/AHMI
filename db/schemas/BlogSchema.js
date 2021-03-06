/**
 * Created by changecheng on 2017/2/9.
 */
var mongoose = require('mongoose')

var BlogSchema = new mongoose.Schema({
    authorId:mongoose.Schema.Types.ObjectId,
    author:String,
    publish:{type:Boolean,default:false},
    title:String,
    desp:String,
    keywords:String,
    digest:String,
    category:String,
    content:String,
    modifing:{type:Boolean,default:true},
    drafts:[
        {
            title:String,
            desp:String,
            keywords:String,
            category:String,
            content:String
        }
    ],
    visits:{type:Number,default:0},
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
    countPublished:function (cb) {
        return this.find({publish:true}).count().exec(cb)
    },
    fetchPublishedBatch:function(from,limit,cb){
        if (limit===0){
            return this
                .find({publish:true})
                .sort({'publishTime':-1})
                .skip(from)
                .exec(cb)
        }else{
            return this
                .find({publish:true})
                .sort({'publishTime':-1})
                .skip(from)
                .limit(limit)
                .exec(cb)
        }


    },
    findById:function(id,cb){
        return this
            .findOneAndUpdate({_id:id},{$inc:{visits:1}})
            .exec(cb)
    },
    findByRecommend:function(cb){
        return this
            .find({publish:true})
            .sort({'visits':-1})
            .limit(4)
            .exec(cb)
    },
    findByAuthor:function (authorId,cb) {
        return this
            .find({authorId:authorId})
            .sort({'publishTime':-1})
            .exec(cb)
    },
    deleteById: function (blogId, cb) {
        return this
            .remove({_id:blogId})
            .exec(cb)
    }

}

module.exports= BlogSchema