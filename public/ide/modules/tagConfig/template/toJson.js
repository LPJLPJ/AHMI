var fs = require('fs');



var template = [
    {
        name:'默认tags',
        indexOfRegister:100,
        register:true
    }
];

var template2 = [
    {
        name:'默认tags',
        indexOfRegister:101,
        register:true
    }
];

var template3 = [
    {
        name:'默认tags',
        indexOfRegister:102,
        register:true
    }
];


fs.writeFile('tags.default1.json',JSON.stringify(template,null,4),function(err){
    if(err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default2.json',JSON.stringify(template2,null,4),function(err){
    if(err)
        throw err;
    console.log('templates have saved!');
});

fs.writeFile('tags.default3.json',JSON.stringify(template3,null,4),function(err){
    if(err)
        throw err;
    console.log('templates have saved!');
});