/**
 * Created by ChangeCheng on 16/5/13.
 */

module.exports = function (req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    //console.log('touch',req.session)
    next()
}