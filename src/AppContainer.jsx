import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import * as fs from 'fs-web';
import { App } from './App/App.jsx';

        ReactDOM.render(
            <Router>
                <App  />
            </Router>,
            document.getElementById("main")
        );

