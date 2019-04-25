//created by Zzen1sS
//2019/4/22

var local = undefined
var localModules = {
    path:undefined,
    fs:undefined,
    __dirname:undefined
}

export function isLocal(){
    if(local === undefined){
        try{
            eval(`var path=require("path")`)
            local = true
        }catch(e){
            local = false
        }

        if(local){
            var path = eval(`require("path")`)
            var fs = eval(`require("fs")`)
            var __dirname = eval(`global.__dirname`)
            localModules.path = path
            localModules.fs = fs
            localModules.__dirname = __dirname
        }
    }
    return local
    
}

export function getLocalModules(){
    return localModules
}