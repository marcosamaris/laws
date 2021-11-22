import React from 'react';
import './Insert.css'
import {useDispatch} from 'react-redux'
import {store} from '../redux/store.jsx'
import {isDigit, isEmpty, isLengthMedia} from '../js/validation.js'
import {showErrMsg, showSucessMsg} from './Notification.jsx'

const initialState = {
    participant: '',
    translations: '',
    transcriptions: '',
    starttime: 0,
    endtime: 0,
    err: '',
    success: ''
}

function Insert(props) {
    const dispatch = useDispatch()
    const json = store.getState().json
    const [trail, setTrail] = React.useState(initialState)

    const {transcriptions, translations, starttime, endtime, participant, err, success} = trail
    const handleChangeInput = e => {
        const { name, value } = e.target
        console.log(name, value)
        setTrail({ ...trail, [name]: value, err: '', success: ''})
        if(name == 'starttime' && /\D/.test(value)){
            return setTrail({...trail, err: 'Não permitido \'.\', \'e\' e \',\' no START-TIME'})
        }
        if(name == 'endtime' && /\D/.test(value)){
            return setTrail({...trail, err: 'Não permitido \'.\', \'e\' e \',\' no END-TIME'})
        }

    }


    const initInsert = () => {

        if(isEmpty(transcriptions) || isEmpty(translations) || isEmpty(participant) || isEmpty(starttime) || isEmpty(endtime)){
            return setTrail({...trail, err: "Por favor, preencha todos os campos."})
        }

        if(isTimeConfit(starttime, endtime)){
            return setTrail({...trail, err: 'Tempo em conflito'})
        }

        if(isLengthMedia(endtime)){
            return setTrail({...trail, err: 'Tempo informado ultrapassa duração da midia'})
        }
        
        let sentence = '';
        
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
        sortSentences()
        dispatch({type: "actions/set", json})          
        setTrail({...trail, success: 'Trilha adcionada com sucesso.'})
        console.log(store.getState())
    }

    const setSentenceOnJSON = (sentence) => {
        json.sentences.push(sentence)
    }

    const isTimeConfit = (timeStart, timeEnd) =>{
        let start = 0
        let end = 0
        let aux = 0
        for (const index in json.sentences) {
            start = parseInt(timeStart, 10)
            end = parseInt(timeEnd, 10)
            aux = json.sentences[index].end_time_ms - json.sentences[index].start_time_ms
            if(start < (json.sentences[index].start_time_ms + aux) && start > json.sentences[index]. start_time_ms){
                setTrail({...trail, err: 'Start_Time em conflito'})
                return true
            }
            else if(end < (json.sentences[index].start_time_ms + aux) && end > json.sentences[index].start_time_ms){
                setTrail({...trail, err: 'End_Time em conflito'})
            }
            
        }
        return false
    }

    const sortSentences = () =>{
        json.sentences.sort((s1,s2) => s1.start_time_ms - s2.start_time_ms);
        console.log('sentences organizado')
    }

    return (
        <div>
            {err && showErrMsg(err)}
            {success && showSucessMsg(success)}
            <div className="insert" >

                <div>
                    <label className='labels participant' htmlFor="participant">Participante</label>
                    <input value={trail['participant']} type="text" className='participant' placeholder="Enter participant name"
                        onChange={handleChangeInput} name="participant" id="participant" />
                </div>

                <div>
                    <label className='labels starttime' htmlFor="starttime">Tempo Inicial</label>
                    <input value={trail['starttime']} type="number" className='starttime' placeholder="Enter the Start time in milliseconds"
                        onChange={handleChangeInput} name="starttime" id="starttime" />
                </div>

                <div>
                    <label className='labels endtime' htmlFor="endtime">Tempo final</label>
                    <input pattern="\d+" value={trail['endtime']} type="number" className='endtime' placeholder="Enter the End time in milliseconds"
                        onChange={handleChangeInput} name="endtime" id="endtime" />
                </div>

                <div>
                    <label className='labels transcriptions' htmlFor="transcriptions">Transcrição</label>
                    <input pattern="\d+" value={trail['transcriptions']} type="text" className='transcriptions' placeholder="Enter the transcriptions"
                        onChange={handleChangeInput} name="transcriptions" id="transcriptions" />
                </div>

                <div>
                    <label className='labels translations' htmlFor="translations">Tradução</label>
                    <input value={trail['translations']} type="text" className='translations' placeholder="Enter the transcriptions"
                        onChange={handleChangeInput} name="translations" id="translations" />
                </div>

                <button type="Submit" id="submit" className="btn btn-dark btn-sm" onClick={initInsert}>Adicionar</button>
            </div>
            <div className="line"></div>

        </div>
    )
}

export default Insert;