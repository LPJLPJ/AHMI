var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
module.exports = function(req, res){
	var fields={}
	var files = {}
	var form = new formidable.IncomingForm()
	form.encoding = 'utf-8'
	form.multiples = true
	//form.uploadDir = path.join(__dirname,'temp')
    console.log(path.join(__dirname,'../public/images'))
    form.uploadDir = path.join(__dirname,'../public/images')
	if (!fs.statSync(form.uploadDir)||!fs.statSync(form.uploadDir).isDirectory()) {
		fs.mkdir(form.uploadDir)
	}
	form.on('field',function(name, value){
		fields[name] = value
	})
	form.on('file',function(name, file){
		files[name] = file
        fs.rename(file.path,path.join(__dirname,'../public/images',fields.name));
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