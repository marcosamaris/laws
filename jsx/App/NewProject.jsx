import React, {Component} from 'react';
import * as fs from 'fs-web';
import { Insert } from './Stories/Story/Display/Insert.jsx';
import { Story } from './Stories/Story/Story.jsx'


export default class NewProject extends Component {
    constructor(props){
        super(props);
        this.state = {
            JSON:null,
            media: null,
            nameproject: '',
            

        }
        this.createJSON = this.createJSON.bind(this);
        this.setJSON = this.setJSON.bind(this);
        this.fileMedia = React.createRef();
        this.loadFiles = this.loadFiles.bind(this);
        this.captureNameProject = this.captureNameProject.bind(this);
    }

    createJSON(){
        let json = 
        {
            "metadata":{
                "author": "",
                "timed": true,
                "date_created": new Date(),
                "data_uploaded": "",
                "description": "",
                "genre": "",
                "glosser": "",
                "languages": [],
                "media":{
                    "audio": "",
                    "video": this.state.media
                },
                "source":{
                    "_default":""
                },
                "source_filetype": "ELAN",
                "speaker IDs":{},
                "speakers":[],
                "story ID": "0ef60c73-c757-46c9-ab12-a17874de63ee",
                "tier IDs":{
                    "T1": {
                        "name": "Transcriptions",
                        "subdivided": false
                    },
                    "T2": {
                        "name": "Translations",
                        "subdivided": "false"
                    }
                },
                "timed":true,
                "title":{
                    "_default":""
                }
            },

            "sentences": []
        }
        this.setState({JSON: json})
        console.log(json)
    }

    loadFiles(){
        const ref = this;
        
        var reader = new FileReader();
        
        reader.readAsDataURL(this.fileMedia.current.files[0])
        reader.onload= function(){
            ref.setState({media: reader.result})
            ref.createJSON()
            
        }
        
    }

    captureNameProject(event){
        this.setState({nameproject: event.target.value})
    }
    
    setJSON(JSON){
        this.setState({
          JSON
        })
    }

    render(){

        const story = this.state.JSON;
        console.log(story)
        return(
            this.state.JSON ? 
            <div>
                <Insert story={story} setJSONCallback={this.setJSON} />
                <Story story={this.state.JSON}/>
            </div>
            :

            <div>
            <form >
            <label>
                Name project:
                <input type="text" value={this.state.nameproject} onChange={this.captureNameProject}/>
                Upload media:
                <input type="file" id="file-here" ref = {this.fileMedia}/>
            </label>
            <br />
            <input type="submit" value="Submit" onClick={this.loadFiles}/>
            </form>
          </div>
        )
    }
}