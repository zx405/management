import {createStore,applyMiddleware,combineReducers} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import CollapsedReducer from './reducers/CollapsedReducer'
import BreadReducer from './reducers/BreadReducer'
import ListReducer from './reducers/ListReducer.js'
import reduxPromise from 'redux-promise'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['ListReducer']
  }
const reducer = combineReducers({
    CollapsedReducer,
    BreadReducer,
    ListReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer,composeWithDevTools(
        applyMiddleware(reduxPromise)
    )
)
const persistor = persistStore(store)
export {store,persistor}