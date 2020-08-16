import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';

import  Stories  from '../App/Stories/Stories.jsx';
import { NewProject } from './NewProject.jsx';
import { Home } from './Home.jsx';
import { About } from './About.jsx';

//<Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
export function App() {
    return (
        <div>
            <Route exact path="/" render={props => <LandingPage/>} />
            <Route path="/stories" render={props => <Stories/>}/>
            
            <Route exact path="/newproject" render={props => <NewProject/>}/>
            <Route exact path="/about" render={props => <About/>}/>
            <Route exact path="/home" render={props => <Home/>}/>
        </div>
    );
}