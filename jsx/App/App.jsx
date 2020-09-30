import React from 'react';
import { Route } from 'react-router-dom';
import  Stories  from '../App/Stories/Stories.jsx';
import  NewProject  from './NewProject.jsx';
import  Home  from './Home.jsx';

export function App() {
    return (
        <div>
            <Route exact path="/" render={props => <Home/>} />
            <Route path="/stories" render={props => <Stories/>}/>
            <Route exact path="/newproject" render={props => <NewProject/>}/>
        </div>
    );
}