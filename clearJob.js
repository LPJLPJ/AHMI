
//created by Zzen1sS
//created 2019/3/22
var ClearManager = require('./utils/clearManager')
//clear outdated files

// ClearManager.clearOutdatedSingleProject(24*60*60*1000,'5c7e112c3720943719a763e8',function(err){
//     if(err){
//         console.log(err)
//     }
// })


// ClearManager.startClearJob(24*60*60*1000,24*60*60*1000,function(err){
//     console.log('clear error: ',err)
// })
ClearManager.clearProjects(24*60*60*1000,function(err){
    if(err){
        console.log(err)
    }else{
        console.log('clear finished')
    }
})