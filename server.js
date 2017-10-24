var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var UserModel = require('./db/models/UserModel');
var dbConfig = require('./db/config/config');
//logger
var logger = require('morgan');
//Captcha
var CaptchaGenerator = require('./utils/CaptchaGenerator');
//Session
var Session = require('express-session');
var MongoStore = require('connect-mongo')(Session);
var CookieParser = require('cookie-parser');
var sessionControl = require('./middlewares/sessionControl');
var socket = require('socket.io');

//init projects
var projectUrl = path.join(__dirname,'project');
try {
    var projectDir = fs.statSync(projectUrl);
    if (!projectDir.isDirectory()){
        fs.mkdirSync(projectUrl);
    }
}catch (err){
    fs.mkdirSync(projectUrl);
}




//router
var router = require('./routes/index');

//init db
console.log('dbConfig.dbPath',dbConfig.dbPath);
mongoose.connect(dbConfig.dbPath);
var db = mongoose.connection;
// console.log(db);
db.once('open',function(){
	console.log('opend ahmi');
});
db.on('error',function(err){
	console.log('error: '+err);
});

var app = express();
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));
app.engine('.html',ejs.__express);
app.set('view engine','html');


//logger.token('http-protocol', function(req, res){ return req.protocol })
//app.use(logger(':method :http-protocol :url :response-time'));

if (!process.env.USING_HTTP){
    app.use(function (req, res, next) {
        if (!req.secure){
            return res.redirect('https://' + req.hostname + req.url);
        }else{
            next()
        }

    })
}


//log

var FileStreamRotator = require('file-stream-rotator')
var morgan = require('morgan')
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

//cookie
app.use(CookieParser());

//session
var sessionMiddleware = Session({
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:24*60*60*1000 //a day
    },
    secret:'ahmi',
    domain:'.graphichina.com',
    store:new MongoStore({
        url:dbConfig.dbPath,
        ttl:24 * 60 * 60,
        autoRemove: 'native'
    })
});

app.use(sessionMiddleware);

// Enable cors.
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
 
// parse application/json 
app.use(bodyParser.json({limit: '50mb'}));

//public
app.use('/public',express.static('public'));
app.use('/release',express.static('release'));
app.use('/.well-known', express.static('.well-known'));

//session control
app.use(sessionControl);


//router
app.use(router);

//404

app.use(function (req,res) {
    res.render('login/404.html')
})

//https
var privateKey = fs.readFileSync('./credentials/privatekey.key');
var certificate = fs.readFileSync('./credentials/certificate.key');
var options = {
    key:privateKey,
    cert:certificate
};

var server;
var io;

http.createServer(app).listen(app.get('port'), function () {
    console.log('listening: '+app.get('port'))
});

if(!process.env.USING_HTTP){
    server = https.createServer(options,app);

    initSocketIO(io,server);

    server.listen(443,function(){
        console.log('listening: '+443)
    });
}

//io linstening


/**
 * 初始化socketIO
 * @param server
 */
var roomInfo = {};

function initSocketIO(io,server){
    io = new socket(server);
    console.log(io)

    //user session middleware to capture session in session
    io.use(function(socket,next){
       sessionMiddleware(socket.request,socket.request.res,next)
    });


    io.on('connection',function(socket){
        console.log('a new connections');

        var session = socket.request.session;
        var user = session.user;
        var urlArr = (socket.request.headers.referer||'').split('/');
        var roomId = urlArr[urlArr.length-2];

        if(!roomId){
            socket.emit('error','roomId is invalid!');
            return;
        }

        //create roomInfo
        if(!roomInfo[roomId]){
            roomInfo[roomId] = [];
        }
        var checkUnique = roomInfo[roomId].every(function(item){
            return item.id!==user.id;
        });
        //check user unique
        if(checkUnique){
            //检查用户是否还未加入room，避免事件的重复绑定
            roomInfo[roomId].push(user);

            var usersForSend = roomInfo[roomId].map(function(item){
                return {
                    id:item.id,
                    username:item.username
                }
            });

            //emit to current user
            socket.emit('connect:success',usersForSend,user);

            //join room
            socket.join(roomId);

            //broadcast to other user
            var userForSend={};
            for(var key in user){
                if(key==='id'||key==='username'){
                    userForSend[key]=user[key];
                }
            }
            socket.to(roomId).emit('user:enter',userForSend);

            //监听断开连接事件
            socket.on('disconnect',function(){
                //remove user from roomInfo
                if(roomInfo[roomId]){
                    var roomItem = roomInfo[roomId];
                    for(var i=0,il=roomItem.length;i<il;i++){
                        if(user.id===roomItem[i].id){
                            roomItem.splice(i,1);
                            break;
                        }
                    }
                    // if room is empty ,delete it
                    if(roomItem.length===0){
                        delete roomInfo[roomInfo];
                    }
                }

                //leave
                socket.leave(roomId);

                //broadcast to other user leave msg
                var userForSend={};
                for(var key in user){
                    if(key==='id'||key==='username'){
                        userForSend[key]=user[key];
                    }
                }
                socket.to(roomId).emit('user:leave',userForSend);
            })
        }

    });

}






