import React from 'react';
import { Route } from 'react-router-dom';
import  NewProject  from './components/NewProject.jsx';
import  OpenProject  from './components/OpenProject.jsx';
import  Home  from './components/Home.jsx';
import './App.css'

import DataProvider from './redux/store'


export function App() {
    return (
        <DataProvider>
        <div>
            <Route exact path="/" render={props => <Home/>} />
            <Route exact path="/openproject" render={props => <OpenProject/>}/>
            <Route exact path="/newproject" render={props => <NewProject/>}/>
        </div>
        </DataProvider>
    );
}