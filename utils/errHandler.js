/**
 * Created by ChangeCheng on 16/5/9.
 */

module.exports = function (res, code, message) {
    console.log('error', message)
    res.status(code)
    if (message){
        res.send({errMsg:message})
        res.end()
    }else{
        res.end()
    }
};
