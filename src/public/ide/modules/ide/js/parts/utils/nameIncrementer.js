//created by Zzen1sS
ideServices.service('NameIncrementer',[function(){
    
    this.getNewName = function(baseName,existingNames){
        existingNames = existingNames || []
        existingNames = existingNames.sort(function(a,b){
            return a - b
        })
        var postfix = 1
        var newName = baseName
        for(var i=0;i<existingNames.length;i++){
            if(existingNames[i] == newName){
                newName = baseName + (postfix++)
            }
        }
        return newName
    }
}])