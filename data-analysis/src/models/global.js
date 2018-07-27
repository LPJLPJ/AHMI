import { notification } from 'antd';
import { queryProject } from '../services/global';

export default {

  namespace: 'global',

  state: {
    collpased: false,
    projectId: '',
    project: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const { pathname = "" } = window.location;
      const paths = pathname.split('/');
      dispatch({
        type: 'save',
        payload: {
          projectId: paths[2] || '',
        }
      });
      dispatch({
        type: 'fetch'
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.global.projectId);
      const response = yield call(queryProject, projectId);
      console.log('response', response);
      if (response.data) {
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
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
