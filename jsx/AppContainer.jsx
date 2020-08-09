import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import * as fs from 'fs-web';
import { App } from './App/App.jsx';

//import('../data/database.json').then((data) => {
// fs.mkdir("data")
// fs.writeFile('data/eaf_temp.json', "").then(function(){
//     return fs.readString('data/eaf_temp.json').then((data) => {
//         console.log(data)  
        ReactDOM.render(
            <Router>
                <App  />
            </Router>,
            document.getElementById("main")
        );

//     })

// //fs.readFile('data/eaf_temp.json').then((data) => {  
// });