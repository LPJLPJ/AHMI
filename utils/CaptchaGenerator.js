var captchapng = require('captchapng')
var CaptchaGenerator = {}
CaptchaGenerator.generate = function(width, height,color1,color2){
	var number = parseInt(Math.random()*9000+1000)
	var p = new captchapng(width,height,number)
	if (color1) {
		p.color(color1.r,color1.g,color1.b,color1.a)

	}else{
		p.color(0,0,0,0)
	}
	if (color2) {
		p.color(color2.r,color2.g,color2.b,color2.a)

	}else{
		p.color(80,80,80,255)
	}

	var img = p.getBase64()
	var imgBase64 = new Buffer(img,'base64')
	return {
		text:number,
		img:imgBase64
	}

}

module.exports= CaptchaGenerator