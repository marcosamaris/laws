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
           
      console.log(fs.readString("/home/kalebe/reads/teste.fastq"))
      
      fs.writeFile('some-file.txt', 'foo')
      .then(function(){
        return fs.readdir('foo');
      })
      .then(function(files){
        console.log(files) // -> [ {some-file.txt} ]
      });

        // var reader = new FileReader();
        // reader.readAsText(this.fileInput.current.files[0]);
        
        // const nameFile = this.fileInput.current.files[0].name;
        // const whenDone = function(){
        //   db.build(jsonFilesDir, indexFileName, dbFileName)
        // }
        // reader.onload = function(){
        //   parseXml(reader.result, function(err2, jsonData){
        //     if (err2) throw err2;
        //     const adoc = jsonData.ANNOTATION_DOCUMENT
        //     console.log(adoc)
        //     elan.preprocess(adoc, jsonFilesDir, nameFile, whenDone);
        //     console.log("sucesso")
        //   });
        // }
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
  