var CaptchaGenerator = require('../utils/CaptchaGenerator')
module.exports = function(req, res){
	var captcha = CaptchaGenerator.generate(80,30)

	if (captcha) {
		req.session.captcha = {
			text:captcha.text
		}

		//console.log('captcha',captcha.text);
		//console.log('req session',req.session);
		res.writeHead(200,{
			'Content-Type':'image/png'
		})
		// console.log('captcha',req.session);
		res.end(captcha.img)
	}else{
		res.end('')
	}
}