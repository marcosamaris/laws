import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import { Story } from './Story/Story.jsx';
import { Insert } from '../Stories/Story/Display/Insert.jsx';
import { NotFound } from './NotFound.jsx';
import * as fs from 'fs-web';

const parseXml = require('xml2js').parseString;
const elan = require('../../../preprocessing/preprocess_eaf');

export default class Stories extends Component{
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.media = React.createRef();
    this.open_file = this.open_file.bind(this);
    this.setJSON = this.setJSON.bind(this);
    this.state = {
      JSON: null,
      fileLoadend: false,
      media: null,
      xml: null,
      sentence: null
    }
  }

  open_file(){
    const ref = this;
    var reader1 = new FileReader();
    var reader2 = new FileReader();
    
    reader1.readAsText(this.fileInput.current.files[0])
    reader1.onload = function(){
      fs.writeFile("data/elan_files/eaftemp.eaf", reader1.result);      
    }

    reader2.readAsDataURL(this.media.current.files[0])
    reader2.onload= function(){
        ref.setState({video: reader2.result})
      
    }

    const nameFile = this.fileInput.current.files[0].name;
    
    fs.readString("data/elan_files/eaftemp.eaf")
      .then(function(res){
        parseXml(res, function(err2, jsonData){
          if (err2) throw err2;
          const adoc = jsonData.ANNOTATION_DOCUMENT
          console.log(adoc)
          elan.preprocess(adoc, nameFile, function(value){console.log(value)});
          console.log("sucesso")

          fs.readString("data/eaf_temp.json")
            .then((data) => {
              let json = JSON.parse(data);
              json['metadata']['media']['video']= ref.state.video
              json['metadata']['media']['audio']= ref.state.audio
              
              ref.setState({
                JSON: json,
                fileLoadend: true
              });
            });
          });
        })
          
  }


  setJSON(JSON){
    this.setState({
      JSON
    })
  }

  render(){
    const story = this.state.JSON;
    
    return (
      this.state.fileLoadend ?
      <Switch>
        {
              <div>
                <Insert story={story} setJSONCallback={this.setJSON} />
                <Story story={story} />
              </div>          
        }
				<Route component={NotFound} />
      </Switch>
          
      :
      <div>
            <form >
            <label>
                Upload XML:
                <input type="file" id="file-here" ref = {this.fileInput}/>
                Choose media:
                <input type="file" id="file-here" ref = {this.media}/>
            </label>
            <br />
            <input type="submit" value="Submit" onClick={this.open_file}/>
            </form>
          </div>
      
  );
}
}