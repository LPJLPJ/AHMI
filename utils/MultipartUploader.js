var formidable = require('formidable')
var MultipartUploader

var form = new formidable.IncomingForm()
MultipartUploader={
	form:from,
	results:{
		fields:{},
		files:[]
	}
}
form.encoding = 'utf-8'
form.multiples = true
form.on('field',function(name, value){
	MultipartUploader.results.fields[name] = value
})

form.on('file',function(name, file){
	MultipartUploader.results.files.push({name,file})
})


