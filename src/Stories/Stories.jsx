import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Story } from './Story/Story.jsx';
import { NotFound } from './NotFound.jsx';
import '../components/OpenProject.css'
import { parseString } from 'xml2js';


const parseXml = require('xml2js').parseString;
const elan = require('../preprocessing/preprocess_eaf');

const initialState = {
  xml: '',
  media: '',
  video: ''
}

function Stories () {
    localStorage.clear()
    const [files, setFiles] = React.useState(initialState)
    const [json, setJson] = React.useState(
      localStorage.getItem('json') || ''
    );

    React.useEffect(() => {
      localStorage.setItem('json', json);
    }, [json])

    const handleChangeInput = e => {
      const {name} = e.target
      const value = e.target.files[0]
      
      setFiles({...files, [name]:value, video:''})
    }

    const open_file = ()=>{
      
      var reader1 = new FileReader();
      var reader2 = new FileReader();
      
      reader1.readAsText(files.xml)
      reader2.readAsDataURL(files.media)

      reader1.onload = function(){
        const nameFile = files.xml.name
        parseXml(reader1.result , function(err2, jsonData){
          if (err2) throw err2;
          console.log(jsonData)
          const adoc = jsonData.ANNOTATION_DOCUMENT
          console.log(adoc)
          elan.preprocess(adoc, nameFile, function(jsonOut){
            reader2.onload= function(){
              
              jsonOut['metadata']['media']['video']= reader2.result
              jsonOut['metadata']['media']['audio']= reader2.result
              let text = JSON.stringify(jsonOut, null, 2)
              console.log(text)
              setJson(jsonOut)
            }
          });
          
        });
      }     
            
    }

    // const story = this.state.JSON;
    
    return (
      json !== '' ?
      <Switch>
        {
              <div>
                {/* <Insert story={story} setJSONCallback={this.setJSON} /> */}
                <Story story={json} />
              </div>          
        }
				<Route component={NotFound} />
      </Switch>
          
      :
          <div className='openproject'>
            <div className="line-center">
                    <div className="line line-right"></div>
                    <h1 className="line fs-18">Choose the files XMLs and the of media!</h1>
                    <div className="line line-left"></div>
            </div>
            <form >
              <label className="labels-open" htmlFor="xml">Choose XML</label>
              <input type="file" id="xml" name="xml" 
              onChange={handleChangeInput} />
              <label className="labels-open" htmlFor="media"> Choose media</label>
              <input type="file" id="media" name="media" 
              onChange={handleChangeInput} />

              <input type="submit" className="start" value="Start" onClick={open_file}/>
            </form>
          </div>
      
  );

}

export default Stories;