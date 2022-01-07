import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Story } from '../Stories/Story/Story.jsx';
import { NotFound } from './NotFound.jsx';
import Export from '../components/Export.jsx'

import {useDispatch, connect} from 'react-redux'

import tutorial from './../../images/tuto-open.gif'

const parseXml = require('xml2js').parseString;
const elan = require('../preprocessing/preprocess_eaf.js');

const initialState = {
  xml: '',
  media: '',
  video: ''
}

const OpenProject = ({modules}) => {
    
    const [files, setFiles] = React.useState(initialState)
    const [json, setJson] = React.useState();

    const dispatch = useDispatch()

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
          // console.log(jsonData)
          const adoc = jsonData.ANNOTATION_DOCUMENT
          
          elan.preprocess(adoc, nameFile, function(json){
            reader2.onload= function(){
              json['metadata']['nameFile'] = files.media.name
              json['metadata']['media']['video']= reader2.result
              // json['metadata']['media']['audio']= reader2.result
             
              setJson(json)
              dispatch({type: "actions/set", json})
              
            }
          });  
        });
      }          
    }
    
    return (
      json ?
      <Switch>
        {
              <div>
                <Export />
               <Story story={json} />
              </div>          
        }
				<Route component={NotFound} />
      </Switch>
          
      :
          <div className='container'>
            <div style={{textAlign: 'center', padding: '20px 20px'}}>
              <img style={{maxWidth: '40%'}} src={tutorial} alt="" />
            </div>
            <div style={{textAlign: 'center'}}>
              <h3>Carregue os arquivos XML e de media.</h3>
            </div>
            <div className='row'>
              <div style={{textAlign: 'center'}}>
                <label style={{margin: '20px'}} className='btn btn-dark btn-sm' htmlFor="xml">Upload XML</label>
                <input type="file" id="xml" name="xml" 
                onChange={handleChangeInput} />
                <label style={{margin: '20px'}} className='btn btn-dark btn-sm' htmlFor="media">Upload media</label>
                <input  type="file" id="media" name="media" 
                onChange={handleChangeInput} />
              </div>

              <input className='btn btn-dark btn-sm' type="submit" value="Começar" onClick={open_file}/>
            </div>
          </div>
      
  );

}

export default connect(state => ({modules: state}))(OpenProject)