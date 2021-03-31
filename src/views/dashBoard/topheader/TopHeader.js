import React, { Component } from 'react'
import { Layout, Avatar, Dropdown, Menu ,Breadcrumb,Button} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom';
// import store from '../../../redux/store';
import collapsedAction from '../../../redux/actions/collapsedAction';
import { connect } from 'react-redux';
import mstore from '../../../mobx/mobx';
const { Header } = Layout;
class TopHeader extends Component {
  state = {
    user: JSON.parse(localStorage.getItem('token')).username,
    role: JSON.parse(localStorage.getItem('token')).role.roleName
  }

  toggle = () => {
    this.props.collapsedAction()
  }
  fullScreen=()=>{
    mstore.set('isFullScreen',true)
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            {this.state.role}
          </a>
        </Menu.Item>
        <Menu.Item danger onClick={() => {
          localStorage.removeItem('token')
          this.props.history.push('/login')
        }}>退出</Menu.Item>
      </Menu>
    )
    return (
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
        {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.toggle,
        })}
        <div style={{display:'inline-block',marginLeft:'10px'}}>
          <Breadcrumb>
          {this.props.breadList.map(item=>
             <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
          )}
        </Breadcrumb>
        </div>
        <div style={{ float: "right" }}>
          <Button type='primary' onClick={this.fullScreen}>全屏</Button>
          <span>欢迎<span style={{ color: 'red' }}>{this.state.user}</span>回来</span>
          <Dropdown overlay={menu} trigger={['click']}>
            <Avatar size={30} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>

    )
  }
}
const mapStateToProps=(state)=>{
  return {
    collapsed:state.CollapsedReducer.collapsed,
    breadList:state.BreadReducer.title
  }
}
const mapDispatchToProps={
  collapsedAction
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))