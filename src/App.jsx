import React from 'react';
import { Route } from 'react-router-dom';
import  Stories  from './Stories/Stories.jsx';
import  NewProject  from './components/NewProject.jsx';
import  Home  from './components/Home.jsx';
import './App.css'

export function App() {
    return (
        <div>
            <Route exact path="/" render={props => <Home/>} />
            <Route path="/stories" render={props => <Stories/>}/>
            <Route exact path="/newproject" render={props => <NewProject/>}/>
        </div>
    );
}