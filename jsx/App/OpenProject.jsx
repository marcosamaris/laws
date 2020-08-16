import React, {Component} from 'react';
import * as fs from 'fs-web';
import { Redirect } from 'react-router';


const parseXml = require('xml2js').parseString;

const elan = require('../../preprocessing/preprocess_eaf');

//const jsonFilesDir = "data/json_files/";
//const indexFileName = "data/index.json"; // stores metadata for all documents


export default class OpenProject extends Component {
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.open_file = this.open_file.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
    this.state = {
      redirect: false,
      JSON: null
    }
  }


      setRedirect(){
        this.setState({redirect:true})
      }

      
      
      open_file(){
       
        fs.mkdir("data/elan_files")
        fs.mkdir("data/json_files/")
        fs.mkdir("data/media_files")

        var reader = new FileReader();
        const setRedirect = this;
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

                  fs.readString("data/eaf_temp.json")
                    .then((data) => {
                      let json = JSON.parse(data)
                      setRedirect.state.JSON = json;
                      console.log(json)
                      setRedirect.setRedirect()
                    });
                });
              })
              
      }
          
    render() {
      return (
        this.state.redirect ? 
        
        <Redirect  to={{
          pathname:'/story',
          state: {data:this.state.JSON}
        }}/> :
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
  