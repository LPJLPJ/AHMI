import {notification} from 'antd';
import {queryProject, logout} from '../services/global';
import {isLocal} from '../utils/local'
export default {

  namespace: 'global',

  state: {
    collpased: false,
    projectId: '',
    project: null,
  },

  subscriptions: {
    setup({dispatch, history}) {
      const {pathname = ""} = window.location;
      const paths = pathname.split('/');
      const local = isLocal()
      let projectId = ''
      if(local){
        projectId = window.location.search && window.location.search.split('=')[1] || ''
      }else{
        projectId = paths[2] || ''
      }
      dispatch({
        type: 'save',
        payload: {
          projectId: projectId,
        }
      });
      dispatch({
        type: 'fetch'
      });
    },
  },

  effects: {
    * fetch({payload}, {call, put, select}) {
      const projectId = yield select(state => state.global.projectId);
      const response = yield call(queryProject, projectId);
      if (response.data) {
        if(!response.data.content){
          notification.open({
            message: "工程数据为空",
            description: "工程数据为空",
            duration: 0,
          });
          return;
        }

        yield put({
          type: 'save',
          payload: {
            project: response.data,
          }
        })

      } else {
        notification.open({
          message: "获取工程数据出错",
          description: "请尝试刷新浏览器或重新打开",
          duration: 0,
        })
      }

    },
  },

  reducers: {
    toggleCollasped(state, action) {
      return {
        ...state, collapsed: !state.collapsed
      }
    },
    save(state, {payload}) {
      return {...state, ...payload};
    },
    logout() {
      window.location.href = '/user/logout';
    },
  },

};
