import request from '../utils/request';

export function queryProject(id) {
  return request(`/api/project/${id}/content`);
}
