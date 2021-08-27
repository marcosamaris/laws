import React from 'react';
import './NewProject.css'
import { Switch } from 'react-router-dom';
import { Story } from '../Stories/Story/Story.jsx'
import {useDispatch, connect} from 'react-redux'
import Export from '../components/Export.jsx'


const NewProject = () => {
    const [mediaUrl, setMediaUrl] = React.useState();
    const [media, setMedia] = React.useState();
    const [jsonInit, setJson]   = React.useState('');

    const dispatch = useDispatch()


    const handleChangeInput = e => {
        const value = e.target.files[0]
        var reader = new FileReader();
        reader.readAsDataURL(value)
        reader.onload= function(){
            setMediaUrl(reader.result)
        }
        setMedia(value)
      }    

    const createJSON = () => {
        const date = new Date();
        const prettyDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        const json = 
        {
            "metadata":{
                "author":"",
                "timed": true,
                "date_created": prettyDate,
                "data_uploaded": "",
                "description": "",
                "genre": "",
                "glosser": "",
                "languages": [],
                "media":{
                    "audio": "",
                    "video": ""
                },
                "source":{
                    "_default":""
                },
                "source_filetype": "ELAN",
                "speaker IDs":{},
                "speakers":[],
                "story ID": "0ef60c73-c757-46c9-ab12-a17874de63ee",
                "tier IDs":{},
                "title":{
                    "_default":""
                }
            },

            "sentences": []
        }
        json['metadata']['nameFile'] = media.name
        json['metadata']['media']['audio'] = mediaUrl
        json['metadata']['media']['video'] = mediaUrl

        setJson(json)
        dispatch({type: "actions/set", json})
    }


    
    return(
            jsonInit ?
            <Switch>
                    <div>
                    <Export />
                    <Story story={jsonInit} />
                    </div>                          
            </Switch>
            :

            <div className='form'>
                <div className="line-center">

                    <div className="line line-right"></div>
                    <h1 className="line fs-18">Choose the file of Media</h1>
                    <div className="line line-left"></div>
                </div>
                <div className="start-button" >
                    <label htmlFor="media" className='xml'>Choose a Media</label>
                    <input type="file" id="media" name="media" 
              onChange={handleChangeInput}/>
                    <input type="submit" className="start" value="Start" onClick={createJSON}/>
                </div>
            </div>
        )
}

export default connect(state => ({modules: state}))(NewProject)