import request from '../utils/request';

export function queryProject(id) {
  return request(`/project/${id}/content`);
}
