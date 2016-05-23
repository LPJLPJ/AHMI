var http = require('http');
var https = require('https');
var express = require('express')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var UserModel = require('./db/models/UserModel')

//Captcha
var CaptchaGenerator = require('./utils/CaptchaGenerator')
//Session
var Session = require('express-session')
var MongoStore = require('connect-mongo')(Session)
var CookieParser = require('cookie-parser')
var sessionControl = require('./middlewares/sessionControl')

//router
var router = require('./routes/index')

//init db
mongoose.connect('mongodb://localhost/ahmi')
var db = mongoose.connection
// console.log(db);
db.once('open',function(){
	console.log('opend ahmi');
})
db.on('error',function(err){
	console.log('error: '+err);
})

var app = express()
app.set('port',process.env.PORT||3000)
app.set('views',path.join(__dirname,'views'))
app.engine('.html',ejs.__express)
app.set('view engine','html')

app.use(function (req, res, next) {
    if (!req.secure){
        return res.redirect('https://' + req.hostname + req.url);
    }else{
        next()
    }

})

app.use(CookieParser())
// app.use(Session({
// 	resave:true,
// 	saveUninitialized:false,
// 	secret:'ahmi'
// }))

app.use(Session({
	resave:false,
	saveUninitialized:false,
    cookie:{maxAge:24*60*60*1000},
	secret:'ahmi',
	store:new MongoStore({
		url:'mongodb://localhost/ahmi',
        ttl:20000,
        autoRemove: 'native'
	})
}))


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

app.use('/public',express.static('public'))
//router

app.use(sessionControl)

app.use(router)




app.post('/delete-user',function(req, res){
	UserModel.findByName(req.body.username,function(err , user){
		if (err) {
			console.log(err);
			res.end('error')
		}
		if (user) {
			//duplicated name
			user.remove(function(err,user){
				if (err) {
					console.log(err);
					res.end('error')
				}

			})

		}
		UserModel.fetch(function(err, users){
			if (err) {
				console.log(err);
				res.end('error')
			}
			res.end(JSON.stringify(users))
		})
		

	})
})


//handle error and 404

app.use(function (err,req,res,next) {
    console.log(arguments)
    next()
})

//app.listen(app.get('port'),function(){
//	console.log('Listening on: '+app.get('port'));
//})

var privateKey = fs.readFileSync('./credentials/privatekey.key');
var certificate = fs.readFileSync('./credentials/certificate.key');
var options = {
    key:privateKey,
    cert:certificate
}
http.createServer(app).listen(app.get('port'));
https.createServer(options,app).listen(443);





