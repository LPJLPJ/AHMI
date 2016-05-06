var formidable = require('formidable')
module.exports = function(req, res){
	var fields={}
	var files = {}
	var form = new formidable.IncomingForm()
	form.encoding = 'utf-8'
	form.multiples = true
	form.uploadDir = path.join(__dirname,'temp')
	if (!fs.statSync(form.uploadDir).isDirectory()) {
		fs.mkdir(form.uploadDir)
	}
	form.on('field',function(name, value){
		fields[name] = value
	})
	form.on('file',function(name, file){
		files[name] = file
	})
	form.on('end',function(){
		res.end('success')
	})
	form.on('error',function(err){
		res.end(err)
	})
	form.on('aborted',function(){
		res.end('aborted')
	})

	form.parse(req)
}