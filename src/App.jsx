import React from 'react';
import { Route } from 'react-router-dom';
import  NewProject  from './components/NewProject.jsx';
import  OpenProject  from './components/OpenProject.jsx';
import  Home  from './components/Home.jsx';
import  Manual  from './components/Manual.jsx';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'


import DataProvider from './redux/store.jsx'


export function App() {
    return (
        <DataProvider>
        <div>
            <Route exact path="/" render={props => <Home/>} />
            <Route exact path="/openproject" render={props => <OpenProject/>}/>
            <Route exact path="/newproject" render={props => <NewProject/>}/>
            <Route exact path="/manual" render={props => <Manual/>}/>
        </div>
        </DataProvider>
    );
}