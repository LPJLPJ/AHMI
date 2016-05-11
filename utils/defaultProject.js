/**
 * Created by ChangeCheng on 16/5/11.
 */
module.exports.getDefaultProject = function (resolution) {
    var defaultProject = {
        initSize:{
            width:500,
            height:400
        },
        currentSize:{
            width:500,
            height:400
        },
        pages:[],
        customTags:[],
        timerTags:[],
        resourceList:[],
        timers:0
    }
    var resolution = resolution.split('*');
    for (var i=0;i<resolution.length;i++){
        resolution[i] = Number(resolution[i])
    }

    defaultProject.currentSize = {
        width:resolution[0],
        height:resolution[1]
    }
    defaultProject.initSize={
        width:resolution[0],
        height:resolution[1]
    }
    return defaultProject;
}

module.exports.changeProject = function (defaultProject,resolution) {
    var resolution = resolution.split('*');
    for (var i=0;i<resolution.length;i++){
        resolution[i] = Number(resolution[i])
    }
    defaultProject.currentSize = {
        width:resolution[0],
        height:resolution[1]
    }
    return defaultProject

}