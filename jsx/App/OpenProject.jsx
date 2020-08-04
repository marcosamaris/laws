import React from 'react';
import * as fs from 'fs-web';
const parseXml = require('xml2js').parseString;

const elan = require('../../preprocessing/preprocess_eaf');
const db = require('../../preprocessing/build_database.js');

const jsonFilesDir = "data/json_files/";
const isoFileName = "preprocessing/iso_dict.json";
const indexFileName = "data/index.json"; // stores metadata for all documents
const dbFileName = "data/database.json";


export class OpenProject extends React.Component {
    constructor(props){
        super(props);
        this.fileInput = React.createRef();
        this.open_file = this.open_file.bind(this);
      }
      
      open_file(){
        fs.mkdir("data")
        fs.mkdir("data/elan_files")
        fs.mkdir("data/json_files/")
        fs.writeFile("data/database.json")
        fs.writeFile("data/index.json")

        var reader = new FileReader();
        reader.readAsText(this.fileInput.current.files[0])
        reader.onload = function(){
          fs.writeFile("data/elan_files/eaftemp.eaf", reader.result);      
        }
        const nameFile = this.fileInput.current.files[0].name;
        const whenDone = function(){
          db.build(jsonFilesDir, indexFileName, dbFileName)
        }
        
        fs.readString("data/elan_files/eaftemp.eaf")
          .then(function(res){
              parseXml(res, function(err2, jsonData){
                  if (err2) throw err2;
                  const adoc = jsonData.ANNOTATION_DOCUMENT
                  console.log(adoc)
                  elan.preprocess(adoc, jsonFilesDir, nameFile, whenDone);
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
  