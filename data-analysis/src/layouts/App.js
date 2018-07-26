import { connect } from 'dva';
import Link from 'umi/link';

import { Layout, Menu, Icon } from 'antd';
import { GlobalHeader, Loader } from '../components';

import styles from './App.less';

const { Header, Sider, Content } = Layout;


const App = ({ children, location, global, loading, dispatch }) => {
  const { collapsed } = global;
  const { pathname } = location;

  const path = pathname.split('/')[1];
  const toggle = () => {
    dispatch({
      type: 'global/toggleCollasped',
    })
  }


  if (!global.project || loading) {
    return (<div>
      <Loader fullScreen spinning={loading} />
    </div>)
  }

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme='dark'
      >
        <div className={styles.logo} />
        <Menu theme="dark" mode="inline" selectedKeys={[path]}>
          <Menu.Item key="analysis">
            <Link to='analysnpmis'>
              <Icon type="dot-chart" />
              <span>数据统计</span>
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="tree">
            <Link to='tree'> 
              <Icon type="profile" />
              <span>工程结构</span>
            </Link>
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0' }}>
          <GlobalHeader
            collapsed={collapsed}
            onCollapse={toggle}
            currentUser={{ username: '用户' }}
          />
        </Header>
        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

function mapStateToProps({ global, loading }) {
  return {
    global,
    loading: loading.effects['global/fetch'],
  }
}

export default connect(mapStateToProps)(App);
