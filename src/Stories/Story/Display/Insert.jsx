import React, { Component } from 'react';
import * as fs from 'fs-web';
import './Insert.css'

const initialState = {
    participant: '',
    translations: '',
    transcriptions: '',
    starttime: '',
    endtime: ''
}

function Insert() {
    const [trail, setTrail] = React.useState(initialState)
    const json = localStorage.getItem('json')

    const handleChangeInput = e => {
        const { name, value } = e.target

        setTrail({ ...trail, [name]: value })
    }

    const captureInfo = () => {
        console.log(trail)
        let sentence = '';
        console.log(JSON.parse(json))
        if (verifyCompatibleWithLenghtOfMedia()) {

            json['speaker IDs'] = {
                S1: {
                    name: trail.participant,
                    tier: 'T1'
                }
            }
            Array.of(json['speakers']).push(trail.participant)
            sentence = {
                "dependents": [
                    {
                        "tier": "T2",
                        "values": [
                            {
                                'value': trail.translations,
                                'end_slot': 1,
                                'start_slot': 0
                            }
                        ]
                    }
                ],
                "end_time_ms": trail.endtime,
                "num_slots": "",
                "speaker": trail.participant,
                "start_time_ms": trail.starttime,
                "text": trail.transcriptions,
                "tier": "T1"
            }


            console.log(sentence)
            setSentenceOnJSON(sentence);

            //reseta o state
            setTrail(...initialState)

        }
    }

    const verifyCompatibleWithLenghtOfMedia = () => {
        let duration = document.getElementById('video')
        if ((duration.duration * 1000) > trail.endtime) {
            console.log('Trilha compativel')
            return true;
        }
    }

    const setSentenceOnJSON = (sentence) => {
        json.sentences.push(sentence)
        

    }

    const writeFile = (json) => {
        fs.writeFile("data/elan_files/eaftemp.eaf", JSON.stringify(json, null, 2))
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