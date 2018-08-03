import React, { PureComponent } from 'react';

import { Icon, Tooltip, Dropdown, Spin, Avatar, Menu } from 'antd';

import avaatar from '../../assets/avatar.jpg'
import styles from './index.less';

const MenuItem = Menu.Item;

export default class GlobalHeader extends PureComponent {

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  }

  render() {
    const { collapsed, currentUser, onMenuClick } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <MenuItem key='logout'>
          <Icon type="logout" />退出登录
        </MenuItem>
      </Menu>
    )

    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />

        <div className={styles.right}>
          <Tooltip title="使用文档" placement="bottomLeft">
            <a
              target="_blank"
              href="https://docs.graphichina.com/"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          {currentUser.username ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={avaatar} />
                <span className={styles.name}>{currentUser.username}</span>
              </span>
            </Dropdown>
          ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
        </div>
      </div>
    )
  }
}
