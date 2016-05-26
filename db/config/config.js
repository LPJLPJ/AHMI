/**
 * Created by ChangeCheng on 16/5/26.
 */
var port = process.env.MONGODB_PORT_27017_TCP_PORT || 27017;
var addr = process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost';
var instance = process.env.MONGODB_INSTANCE_NAME || 'ahmi';
var password = process.env.MONGODB_PASSWORD ;
var username = process.env.MONGODB_USERNAME ;


var dbConfig = {}
if (!!username){
    dbConfig.dbPath = 'mongodb://' + username + ':' + password +'@' + addr + ':' + port + '/' + instance;
}else{
    dbConfig.dbPath = 'mongodb://'+addr+':'+port+'/'+instance;
}

module.exports = dbConfig;




