import request from '../utils/request';

const NODE_ENV = process.env.NODE_ENV;
const prefix = NODE_ENV === "development" ? '/api' : '';

console.log('prefix', prefix);

export function queryProject(id) {
  return request(`${prefix}/project/${id}/content`);
}

export function logout() {
  return request(`${prefix}/user/logout`);
}
