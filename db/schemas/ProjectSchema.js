/**
 * Created by ChangeCheng on 16/5/7.
 */
var mongoose = require('mongoose')

var ProjectSchema = new mongoose.Schema({
    name:String,
    userId:mongoose.Schema.Types.ObjectId,
    classId:String,
    author:String,
    resolution:String,
    type:String,
    template:String,
    ideVersion:String,
    originalSite:String,
    supportTouch:String,
    encoding:String,
    curSize:String,
    maxSize:String,
    thumbnail:String,
    shared:{type:Boolean,default:false},
    readOnlyState:{type:Boolean,default:false},
    sharedKey:{type:String},
    readOnlySharedKey:{type:String},
    recycle: {
        recycleStatus: {type: Boolean, default: false},
        recycleTime: {type: Date}
    },
    content:{type:String},
    backups:[{
        time:Date,
        content:String
    }],
    createTime:{type:Date,default:Date.now},
    lastModifiedTime:{type:Date,default:Date.now}
})

ProjectSchema.index({createTime:-1,'recycle.recycleTime':-1});

ProjectSchema.pre('save',function(next){
    var project = this
    if (this.isNew){
        this.createTime = Date.now()
    }else{
        this.lastModifiedTime = Date.now()
    }
    next()
});


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
    findBackupsById:function (id,cb) {
        return this
            .findOne({_id:id},{"backups.time":1})
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
    findProjectInfosByUser: function (_userId,cb) {
        return this
            .find({userId:_userId},{content:0,backups:0})
            .sort({'createTime':-1})
            .exec(cb)
    },
    countByUser:function(_userId,cb){
        return this.count({userId:_userId})
                .exec(cb)
               
    },
    updateShare:function (id,stateInfo,cb) {
        return this.findOneAndUpdate({_id:id},{shared:stateInfo.shared,sharedKey:stateInfo.sharedKey,readOnlySharedKey:stateInfo.readOnlySharedKey})
            .exec(cb)
    },
    deleteById: function (_projectId, cb) {
        return this
            .remove({_id:_projectId})
            .exec(cb)
    },
    /*findProInfo:function(_userId,_classId,cb){//add by tang
        return this
            .find({userId:_userId,"$or":[{classId: {$exists: false}},{classId:_classId}]},{content:0,backups:0})
            .sort({'createTime':-1})
            .exec(cb)
    },*/
    findProByClass:function(_userId,_classId,cb){
        return this
            .find({userId:_userId,classId:_classId,"$or": [{recycle: {$exists: false}}, {"recycle.recycleStatus":false}]},{content:0,backups:0})
            .sort({'createTime':-1})
            .exec(cb)
    },
    /*deleteByClass:function(_classId,cb){//batch delete
        return this
            .findAndUpdate({classId:_classId})
            .exec(cb)
    },*/
    findPro:function(_userId,_classId,cb){
        return this
            .find({userId:_userId,"$and":[
                {"$or": [//no classId or specified classId
                    {classId: {$exists: false}},
                    {classId:_classId}
                ]},
                {"$or": [//no recycle or recycle is false
                    {recycle: {$exists: false}},
                    {"recycle.recycleStatus":false}
                ]}
            ]},{content:0,backups:0})
            .sort({'createTime':-1})
            .exec(cb)
    },
    findRecycle:function(_userId,cb){
        return this
            .find({userId:_userId,"recycle.recycleStatus":true},{content:0,backups:0})
            // .sort({'recycle.recycleTime':-1})
            .exec(cb)
    },
    clearRecycle:function(_userId,cb){
        return this
            .remove({userId:_userId,"recycle.recycleStatus":true})
            .exec(cb)
    }

};

module.exports= ProjectSchema;