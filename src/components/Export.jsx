import { parseXML } from 'jquery';
import React from 'react';
import {store} from '../redux/store.jsx'
const {generateXml} = require ('../js/export.js')


const Export = () =>{
    

    const clickMe = () =>{
        const S = generateXml(store.getState().json)
        const xml = parseXML(S)
        console.log(xml)
        downloadFiles(S, "xml.eaf")

    }

    function downloadFiles(data, file_name) {
        var file = new Blob([data], {type: "text/plain;charset=utf-8;"});
        if (window.navigator.msSaveOrOpenBlob) 
            window.navigator.msSaveOrOpenBlob(file, file_name);
        else { 
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = file_name;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    return (
        <div className='export'>
            <button onClick = {clickMe}>Export XML</button>
        </div>
    );
}

export default Export;
