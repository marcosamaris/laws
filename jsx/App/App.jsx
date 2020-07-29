import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Stories } from './Stories/Stories.jsx';
import { OpenProject } from './OpenProject.jsx';
import { NewProject } from './NewProject.jsx';
import { Home } from './Home.jsx';
import { About } from './About.jsx';

export function App({ data }) {
    return (
        <div>
            <Route exact path="/" render={props => <LandingPage/>} />
            <Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
            <Route path="/story" render={props => <Stories stories={data.stories} />} />
            <Route path="/openproject" render={props => <OpenProject/>}/>
            <Route exact path="/newproject" render={props => <NewProject/>}/>
            <Route exact path="/about" render={props => <About/>}/>
            <Route exact path="/home" render={props => <Home/>}/>
        </div>
    );
}