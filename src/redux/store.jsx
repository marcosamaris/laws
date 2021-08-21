import React from 'react'
import {createStore} from 'redux'
import rootReducer from './reducers/stateReduce.jsx'
import {Provider} from 'react-redux'

export const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

function DataProvider({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider;