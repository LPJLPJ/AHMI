var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_FACTOR = 10
var UserSchema = new mongoose.Schema({
	accountName:{unique:true,type:String},
    email:{unique:true,type:String},
	password:String,
	verified:{type:Boolean,default:false},
	companyId:String,
	projectIds:[String],
	templateIds:[String],
	historys:[],
	createTime:{type:Date,default:Date.now},
	lastestTime:{type:Date,default:Date.now}
})

UserSchema.pre('save',function(next){
	console.log('saving');
	var user = this
	if (this.isNew){
		this.createTime = Date.now()
	}else{
		this.lastestTime = Date.now()
	}
	bcrypt.genSalt(SALT_FACTOR,function(err, salt){
		if (err) return next(err)
		bcrypt.hash(user.password,salt,function(err, hash){
			if (err) {return next(err)}
			user.password = hash
			next()
		})
	})

	
})

UserSchema.methods = {
	comparePassword:function(password, cb){
		bcrypt.compare(password,this.password,function(err, isMatch){
			if (err) {return cb(err)}
			return cb(null, isMatch)
		})
	}
}

UserSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
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
	}

}

module.exports= UserSchema