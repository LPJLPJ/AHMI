var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_FACTOR = 10
var UserSchema = new mongoose.Schema({
	accountName:{unique:true,type:String},
	password:String,
	email:{unique:true,type:String},
    type:{type:String,default:'basic'},
    verified:{type:Boolean,default:false},
	companyId:String,
    phone:String,
    male:String,
	projectIds:[String],
	templateIds:[String],
	historys:[],
	createTime:{type:Date,default:Date.now},
	lastestTime:{type:Date,default:Date.now}
})

UserSchema.pre('save',function(next){
	// console.log('saving');
	var user = this
	if (this.isNew){
        this.createTime = Date.now()
        bcrypt.genSalt(SALT_FACTOR,function(err, salt){
            if (err) return next(err)
            bcrypt.hash(user.password,salt,function(err, hash){
                if (err) {return next(err)}
                user.password = hash

                next()
            })
        })

	}else{
		this.lastestTime = Date.now()
        next()
	}

	
})

UserSchema.methods = {
	comparePassword:function(password, cb){
		bcrypt.compare(password,this.password,function(err, isMatch){
			if (err) {return cb(err)}
			return cb(null, isMatch)
		})
	}
    //comparePassword:function(password, cb){
     //   console.log('compare',password,this.password)
     //   //bcrypt.compare(password,this.password,function(err, isMatch){
     //   //    if (err) {return cb(err)}
     //   //    return cb(null, isMatch)
     //   //})
     //   return cb(null,password == this.password)
    //}
}

UserSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
		.sort('accountName')
		.exec(cb)
	},
    fetchBatch:function(from,limit,cb){
	    if (limit===0){
            return this
                .find({})
                .sort('accountName')
                .skip(from)
                .exec(cb)
        }else{
            return this
                .find({})
                .sort('accountName')
                .skip(from)
                .limit(limit)
                .exec(cb)
        }

    },
    fetchFuzzy:function(keyword,cb){
		return this
		     .find({$or:[{accountName:{$regex:keyword}},{email:{$regex:keyword}},{type:{$regex:keyword}}]})
		     .sort('accountName')
		     .exec(cb)
    },
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	},
	findByName:function(name,cb){
		return this
		.findOne({accountName:name})
		.exec(cb)
	},
	findByMail:function(email,cb){
		return this
		.findOne({email:email})
		.exec(cb)
	},
    findByMailOrName: function (_mail,_name, cb) {
        return this
            .findOne({"$or":[{email:_mail},{accountName:_name}]})
            .exec(cb)
    }

}

module.exports= UserSchema