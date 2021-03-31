import React, { Component } from 'react'
import { HashRouter,Redirect,Route,Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import DashBoard from '../views/dashBoard/DashBoard'
export default class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" render={()=>
                        localStorage.getItem('token')?
                        <DashBoard/>
                        :<Redirect to="/login"/>
                    }/>
                </Switch>
            </HashRouter>
        )
    }
}
