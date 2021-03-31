import React, { Component } from 'react'
import IndexRouter from './router'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
export default class App extends Component {
  render() {
    return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
      
    </Provider>
    )
  }
}

