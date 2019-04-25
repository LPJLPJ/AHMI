import request from '../utils/request';
import {isLocal, getLocalModules} from '../utils/local'
const NODE_ENV = process.env.NODE_ENV;
const prefix = NODE_ENV === "development" ? '/api' : '';

console.log('prefix', prefix);


export function queryProject(id) {
  var local = isLocal()
  if(local){
    var path,fs,__dirname;
    var localModules = getLocalModules()
    path = localModules.path
    fs = localModules.fs
    __dirname = localModules.__dirname
    var projectUrl = path.join(__dirname,'localproject',id,'project.json');
    var dataRaw = fs.readFileSync(projectUrl)
    var project = JSON.parse(dataRaw)
    console.log(project)
    return {
      data:project
    }
  }else{
    return request(`${prefix}/project/${id}/content`);
  }
  
}

export function logout() {
  return request(`${prefix}/user/logout`);
}
