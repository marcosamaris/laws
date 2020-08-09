import React from 'react';
import * as fs from 'fs-web';


const parseXml = require('xml2js').parseString;

const elan = require('../../preprocessing/preprocess_eaf');

//const jsonFilesDir = "data/json_files/";
//const indexFileName = "data/index.json"; // stores metadata for all documents


export class OpenProject extends React.Component {
    constructor(props){
        super(props);
        this.fileInput = React.createRef();
        this.open_file = this.open_file.bind(this);
      }
      
      open_file(){
       
        
        fs.mkdir("data/elan_files")
        fs.mkdir("data/json_files/")
        fs.mkdir("data/media_files")

        var reader = new FileReader();
        // for (const obj of this.fileInput.current.files) {
        //   console.log(obj)
        // }
        reader.readAsText(this.fileInput.current.files[0])
        reader.onload = function(){
          fs.writeFile("data/elan_files/eaftemp.eaf", reader.result);      
        }
        const nameFile = this.fileInput.current.files[0].name;
        // const whenDone = function(){
        //   db.build(jsonFilesDir, indexFileName, dbFileName)
        // }
        
        fs.readString("data/elan_files/eaftemp.eaf")
          .then(function(res){
              parseXml(res, function(err2, jsonData){
                  if (err2) throw err2;
                  const adoc = jsonData.ANNOTATION_DOCUMENT
                  console.log(adoc)
                  elan.preprocess(adoc, nameFile, function(value){console.log(value)});
                  console.log("sucesso")
                  
                });
            
                
              })

          
      }
          
    render() {
      return (
          <div>
            <form >
            <label>
                Upload file:
                <input type="file" id="file-here" ref = {this.fileInput}/>
            </label>
            <br />
            <input type="submit" value="Submit" onClick={this.open_file}/>
            </form>

          </div>
      );
    }

  }
  