import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  IdcardOutlined,
  MenuOutlined,
  LockOutlined,
  ProfileOutlined,
  TrophyOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  HighlightOutlined,
  SnippetsOutlined,
  ZoomInOutlined,
  OrderedListOutlined,
  ToTopOutlined,
  UploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import SideAxios from '../../../redux/actions/SideAxios'
import BreadAction from '../../../redux/actions/BreadAction'
import { connect } from 'react-redux'
const { Sider } = Layout
const { SubMenu } = Menu
const IconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <IdcardOutlined />,
  "/user-manage/list": <MenuOutlined />,
  "/right-manage": <LockOutlined />,
  "/right-manage/right/list": <ProfileOutlined />,
  "/right-manage/role/list": <TrophyOutlined />,
  "/news-manage": <FileTextOutlined />,
  "/audit-manage": <FileSearchOutlined />,
  "/publish-manage": <FileDoneOutlined />,
  "/news-manage/add": <HighlightOutlined />,
  "/news-manage/draft": <FileTextOutlined />,
  "/news-manage/category":<SnippetsOutlined />,
  "/audit-manage/audit":<ZoomInOutlined />,
  "/audit-manage/list":<OrderedListOutlined/>,
  "/publish-manage/unpublished":<ToTopOutlined />,
  "/publish-manage/published":<UploadOutlined />,
  "/publish-manage/sunset":<CloudDownloadOutlined />
}
class Sidemenu extends Component {
  userRights = JSON.parse(localStorage.getItem("token")).role.rights
  componentDidMount() {
    if(this.props.sidelist.length===0){
      this.props.SideAxios()
    }
  }
  render() {
    const openKeys = ['/' + this.props.history.location.pathname.split('/')[1]]
    const selectedKeys = [this.props.history.location.pathname]
    return (
      <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="logo"><span>全球新闻发布系统</span></div>
          <div style={{ overflow: 'auto', flex: '1' }}>
            <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} defaultOpenKeys={openKeys}>
              {
                this.rendermenu(this.props.sidelist)
              }
            </Menu>
          </div>
        </div>
      </Sider>
    )
  }
  checked = (item) => {
    return this.userRights.includes(item.key)  
  }
  rendermenu = (menus,title) => {
    return menus.map(item => {
      if (item.children?.length > 0 && item.pagepermisson && this.checked(item)) {
        return <SubMenu key={item.key} icon={IconList[item.key]} title={item.title}>
          {this.rendermenu(item.children,item.title)}
        </SubMenu>
      }
      return this.checked(item) && item.pagepermisson && <Menu.Item key={item.key} icon={IconList[item.key]} onClick={() => {
        var list=[]
        title && list.push(title)
        list.push(item.title)
        this.props.BreadAction(list)
        this.props.history.push(item.key)
      }}>
        {item.title}
      </Menu.Item>
    })
  }
}
const mapStateToProps=(state)=>{
  return {
    collapsed:state.CollapsedReducer.collapsed,
    sidelist:state.ListReducer.list
  }
}
const mapDispatchToProps={
  BreadAction,
  SideAxios
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Sidemenu)) 