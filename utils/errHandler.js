/**
 * Created by ChangeCheng on 16/5/9.
 */

module.exports = function (res, code, message) {
    res.status(code)
    if (message){
        res.end(message)
    }else{
        res.end()
    }
    return
}
