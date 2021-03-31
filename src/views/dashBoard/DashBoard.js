import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Sidemenu from './sidemenu/Sidemenu'
import TopHeader from './topheader/TopHeader'
import {Layout} from 'antd'
import './DashBoard.css'
import axios from 'axios'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import Nopermisson from './nopermission/Nopermisson'
import Add from './news-manage/Add'
import Draft from './news-manage/Draft'
import Category from './news-manage/Category'
import Audit from './audit-manage/Audit'
import List from './audit-manage/List'
import Unpublished from './publish-manage/Unpublished'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import Preview from './news-manage/Preview'
import Update from './news-manage/Update'
import {autorun} from 'mobx'
import mstore from '../../mobx/mobx'
const {Content} = Layout
const localList = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":Add,
    "/news-manage/draft":Draft,
    "/news-manage/category":Category,
    "/news-manage/preview/:id":Preview,
    "/news-manage/update/:id":Update,
    "/audit-manage/audit":Audit,
    "/audit-manage/list":List,
    "/publish-manage/unpublished":Unpublished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset
}


export default class DashBoard extends Component {
    state={
        userRights:[],
        fullscreen:false
    }
    tokenRights=[]
    componentDidMount() {
        Promise.all([
            axios.get('http://localhost:8000/rights'),
            axios.get('http://localhost:8000/children')
        ]).then(res=>{
            this.setState({
                userRights:[...res[0].data,...res[1].data]
            })
        })
        this.tokenRights = JSON.parse(localStorage.getItem("token")).role.rights 
        this.cancel = autorun(()=>{
            this.setState({
                fullscreen:mstore.get('isFullScreen')
            },()=>{
                console.log(mstore.get('isFullScreen'))
            })
        })
    }
    componentWillUnmount () {
        this.cancel()
    }
    checkedRouter=(item)=>{
        return localList[item.key] && (item.pagepermisson || item.routepagepermisson)
    }
    checkedToken=(item)=>{
        return this.tokenRights.includes(item.key)
    }
    render() {
        return (
            <Layout>
                {!this.state.fullscreen && <Sidemenu></Sidemenu>}
                <Layout className="site-layout">
                    {!this.state.fullscreen && <TopHeader></TopHeader>}
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            overflow:'auto'
                        }}
                    >
                    <Switch>
                            {this.state.userRights.map(item=>{
                                if(this.checkedRouter(item) && this.checkedToken(item)){
                                    return <Route path={item.key} component={localList[item.key]} key={item.key} />
                                }
                                return null
                            })}
                            <Redirect from="/" to="/home" exact />
                            <Route path="*" component={Nopermisson} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout> 
        )
    }
}
