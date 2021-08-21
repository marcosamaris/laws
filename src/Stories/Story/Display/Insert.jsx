import React from 'react';
import './Insert.css'
import {useDispatch} from 'react-redux'
import {store} from '../../../redux/store.jsx'

const initialState = {
    participant: '',
    translations: '',
    transcriptions: '',
    starttime: '',
    endtime: ''
}

function Insert() {
    const dispatch = useDispatch()
    const json = store.getState().json
    const [trail, setTrail] = React.useState(initialState)

    const handleChangeInput = e => {
        const { name, value } = e.target
        
        setTrail({ ...trail, [name]: value })
    }

    const captureInfo = () => {
        let sentence = '';
        // isTimeOk()
        if (verifyCompatibleWithLenghtOfMedia()) {

            json['metadata']['speaker IDs'] = {
                S1: {
                    name: trail.participant,
                    tier: 'T1'
                }
            }
            Array.of(json['metadata']['speakers']).push(trail.participant)
            sentence = {
                "end_time_ms": parseInt(trail.endtime),
                "num_slots": 1,
                "speaker": trail.participant,
                "start_time_ms": parseInt(trail.starttime),
                "text": trail.transcriptions,
                "tier": "T"+(json['sentences'].length+1),
                "ref1": "ts1",
                "ref2": "ts2",
                "dependents": []
            }

            
            const dependents = {
                "tier": sentence['tier'],
                "values":[
                {
                    "start_slot": 0,
                    "end_slot": 1,
                    "value": trail.translations
                }
                ]
            }
            sentence['dependents'].push(dependents)


            setSentenceOnJSON(sentence);
            dispatch({type: "actions/set", json})          
            console.log(store.getState())

        }
    }

    const verifyCompatibleWithLenghtOfMedia = () => {
        let duration = document.getElementById('video')
        if ((duration.duration * 1000) > trail.endtime) {
            console.log('Trilha compativel')
            return true;
        }
    }

    const isTimeOk = () => {
        let i=0
        while(json["sentences"][i]['starttime'] < trail.starttime ){

            i = i+1
            console.log(json["sentences"][i]['starttime'])
        }
    }

    const setSentenceOnJSON = (sentence) => {
        json.sentences.push(sentence)
        

    }

    return (
        <div>
            <div className="insert" >

                <div>
                    <label className='labels participant' htmlFor="participant">Participant</label>
                    <input type="text" className='participant' placeholder="Enter participant name"
                        onChange={handleChangeInput} name="participant" id="participant" />
                </div>

                <div>
                    <label className='labels starttime' htmlFor="starttime">Start Time</label>
                    <input type="text" className='starttime' placeholder="Enter the Start time in milliseconds"
                        onChange={handleChangeInput} name="starttime" id="starttime" />
                </div>

                <div>
                    <label className='labels endtime' htmlFor="endtime">End Time</label>
                    <input type="text" className='endtime' placeholder="Enter the End time in milliseconds"
                        onChange={handleChangeInput} name="endtime" id="endtime" />
                </div>

                <div>
                    <label className='labels transcriptions' htmlFor="transcriptions">Transcriptions</label>
                    <input type="text" className='transcriptions' placeholder="Enter the transcriptions"
                        onChange={handleChangeInput} name="transcriptions" id="transcriptions" />
                </div>

                <div>
                    <label className='labels translations' htmlFor="translations">Translations</label>
                    <input type="text" className='translations' placeholder="Enter the transcriptions"
                        onChange={handleChangeInput} name="translations" id="translations" />
                </div>

                <input type="Submit" id="submit" className="add" value="Add" onClick={captureInfo} />
            </div>
            <div className="line"></div>

        </div>
    )
}

export default Insert;