import React, {Component} from 'react';
import * as fs from 'fs-web';
import { Redirect } from 'react-router';
import Stories from './Stories/Stories';


const parseXml = require('xml2js').parseString;

const elan = require('../../preprocessing/preprocess_eaf');

//const jsonFilesDir = "data/json_files/";
//const indexFileName = "data/index.json"; // stores metadata for all documents


export default class OpenProject extends Component {
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.fileAudio = React.createRef();
    this.fileVideo = React.createRef();
    this.open_file = this.open_file.bind(this);
    this.preprocessFile = this.preprocessFile.bind(this);
    this.state = {
      JSON: null,
      fileLoadend: false,
      hasVideo: false,
      hasAudio: false,
      video: null,
      audio: null,
      xml: null
    }
  }


      setRedirect(){
        this.setState({redirect:true})
      }

      
      
      open_file(){
        const setFileLoadend = this;
        let video="";
        let audio="";
        var reader1 = new FileReader();
        var reader2 = new FileReader();
        var reader3 = new FileReader();
        reader1.readAsText(this.fileInput.current.files[0])
        reader1.onload = function(){
          fs.writeFile("data/elan_files/eaftemp.eaf", reader1.result);      
        }
    
        reader2.readAsDataURL(this.fileVideo.current.files[0])
        reader2.onload= function(){
          video = reader2.result
          setFileLoadend.setState({video: video})
          
        }
    
        reader3.readAsDataURL(this.fileAudio.current.files[0])
        reader3.onload= function(){
          audio = reader3.result
          setFileLoadend.setState({audio: audio})
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
                  json['metadata']['media']['video']= setFileLoadend.state.video
                  json['metadata']['media']['audio']= setFileLoadend.state.audio
                  setFileLoadend.setState({
                    JSON: json,
                    fileLoadend: true
                  });
                });
              });
            })
              
      }
          
    render() {
      const story = this.state.JSON;
      return (
        this.state.redirect ? 
        <Stories story={}/>
        :
        <div>
            <form >
            <label>
                Upload file:
                <input type="file" id="file-here" ref = {this.fileInput}/>
                Upload video:
                <input type="file" id="file-here" ref = {this.fileVideo}/>
                Upload audio:
                <input type="file" id="file-here" ref = {this.fileAudio}/>
            </label>
            <br />
            <input type="submit" value="Submit" onClick={this.open_file}/>
            </form>
          </div>
      );
    }

  }
  