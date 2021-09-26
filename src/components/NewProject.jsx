import React from 'react';
import { Switch } from 'react-router-dom';
import { Story } from '../Stories/Story/Story.jsx'
import {useDispatch, connect} from 'react-redux'
import Export from '../components/Export.jsx'

import tutorial from './../../images/tuto-new.gif'

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

            <div className='container'>
                <div style={{textAlign: 'center', padding: '20px 20px'}}>
                    <img style={{maxWidth: '40%'}} src={tutorial} alt="" />
                </div>
                <div style={{textAlign: 'center'}}>
                    <h3>Carregue um arquivo de media.</h3>
                </div>
                <div className='row'>
                    <div style={{textAlign: 'center'}}>
                        <label htmlFor="media" style={{margin: '20px'}} className='btn btn-dark btn-sm'>Carregue uma Media</label>
                        <input type="file" id="media" name="media" 
                onChange={handleChangeInput}/>
                    </div>
                    <input type="submit" className="btn btn-dark btn-sm" value="Começar" onClick={createJSON}/>
                </div>
            </div>
        )
}

export default connect(state => ({modules: state}))(NewProject)