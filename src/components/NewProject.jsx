import React, {Component} from 'react';
import * as fs from 'fs-web';
import { Insert } from '../Stories/Story/Display/Insert.jsx';
import { Story } from '../Stories/Story/Story.jsx'
import Export from '../Stories/Story/Display/Export.jsx'
import './NewProject.css'


export default class NewProject extends Component {
    constructor(props){
        super(props);
        this.state = {
            JSON:null,
            media: null,
            

        }
        this.createJSON = this.createJSON.bind(this);
        this.setJSON = this.setJSON.bind(this);
        this.fileMedia = React.createRef();
        this.loadFiles = this.loadFiles.bind(this);
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
            if(ref.fileMedia.current.files[0].type.includes('video'))
                console.log("video")
            else if(ref.fileMedia.current.files[0].type.includes('audio'))
                console.log("audio")
            ref.createJSON()
            
        }
        
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
                <Export />
                <Story story={this.state.JSON}/>
            </div>
            :

            <div className='form'>
                <div className="line-center">

                    <div className="line line-right"></div>
                    <h1 className="line fs-18">Choose the file of Media</h1>
                    <div className="line line-left"></div>
                </div>
                <div className="start-button" >
                    <label htmlFor="arquivo" className='xml'>Choose a Media</label>
                    <input type="file" id="file-here" ref={this.fileMedia} onInput={this.loadFiles} id="arquivo"/>
                </div>
            </div>
        )
    }
}