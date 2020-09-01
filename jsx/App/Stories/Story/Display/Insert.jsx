import React, {Component} from 'react';
import * as fs from 'fs-web';

const initialState = {
    participant: '',
    trilha: '',
    starttime: '',
    endtime: ''
}

export class Insert extends Component{
    

    constructor(props){
        super(props)
        this.state={
            participant: '',
            translations: '',
            transcriptions: '',
            starttime: '',
            endtime: ''
        };
        this.captureInfo = this.captureInfo.bind(this)
        this.verifyCompatibleWithLenghtOfMedia = this.verifyCompatibleWithLenghtOfMedia.bind(this)
        this.setSentenceOnJSON = this.setSentenceOnJSON.bind(this)

        this.handleChangeParticipant = this.handleChangeParticipant.bind(this);
        this.handleChangeTranslations = this.handleChangeTranslations.bind(this);
        this.handleChangeTranscriptions = this.handleChangeTranscriptions.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);

    }

    captureInfo() {
        console.log(this.state)
        let sentence = '';
        if(this.verifyCompatibleWithLenghtOfMedia()){
            sentence = {
                "dependents":
                    {
                        "tier": "",
                        "values": this.state.translations
                    }, 
                "end_time_ms": this.state.endtime,
                "num_slots": "",
                "speaker": this.state.participant,
                "start_time_ms": this.state.starttime,
                "text": this.state.transcriptions
            }
            

            console.log(sentence)
            this.setSentenceOnJSON(sentence);

            //reseta o state
            this.setState(...initialState)
            
        }
    }

    verifyCompatibleWithLenghtOfMedia(){
        let duration = document.getElementById('audio')
        if(duration.duration > this.state.endtime){
            console.log('Trilha compativel')
            return true;
        }
    }

    setSentenceOnJSON(sentence){
        let json = this.props.story;
        json['sentences'].push(sentence)
        console.log(json)
    }

    handleChangeParticipant(event){
        this.setState({participant: event.target.value})
    }

    handleChangeTranslations(event){
        this.setState({translations: event.target.value})
    }

    handleChangeTranscriptions(event){
        this.setState({transcriptions: event.target.value})
    }

    handleChangeStartTime(event){
        this.setState({starttime: event.target.value})
    }

    handleChangeEndTime(event){
        this.setState({endtime: event.target.value})
    }

    render(){
        return(
            <div>
                <div className="insert" >
                    <label className='participant' htmlFor=""> Participant:</label>
                    <input type="text" className='participant' value={this.state.participant} onChange={this.handleChangeParticipant}/>

                    <label className='starttime' htmlFor=""> Start Time:</label>
                    <input type="text" className='starttime' value={this.state.starttime} onChange={this.handleChangeStartTime}/>

                    <label className='endtime' htmlFor=""> End Time:    </label>
                    <input type="text" className='endtime' value={this.state.endTime} onChange={this.handleChangeEndTime}/>

                    <label className='transcriptions' htmlFor=""> Transcriptions:</label>
                    <input type="text" className='transcriptions' value={this.state.transcriptions} onChange={this.handleChangeTranscriptions}/>

                    <label className='translations' htmlFor=""> Translations:</label>
                    <input type="text" className='translations' value={this.state.translations} onChange={this.handleChangeTranslations}/>

                    <input type="Submit" id="submit" onClick={this.captureInfo} Submit/>
                </div>
            </div>
        )
    }
}

