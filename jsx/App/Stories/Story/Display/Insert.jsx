import React, {Component} from 'react';

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
            trilha: '',
            starttime: '',
            endtime: ''
        };
        this.captureInfo = this.captureInfo.bind(this)
        this.verifyCompatibleWithLenghtOfMedia = this.verifyCompatibleWithLenghtOfMedia.bind(this)
        this.handleChangeParticipant = this.handleChangeParticipant.bind(this);
        this.handleChangeTrilha = this.handleChangeTrilha.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);

    }

    captureInfo() {
        console.log(this.state)
        //reseta o state
        //this.setState(...initialState)
        this.verifyCompatibleWithLenghtOfMedia();
    }

    verifyCompatibleWithLenghtOfMedia(){
        let duration = document.getElementById('audio')
        console.log(duration)
        
        if(duration.duration > this.state.endtime){
            console.log('Trilha compativel')
        }
    }



    handleChangeParticipant(event){
        this.setState({participant: event.target.value})
    }

    handleChangeTrilha(event){
        this.setState({trilha: event.target.value})
    }

    handleChangeStartTime(event){
        this.setState({starttime: event.target.value})
    }

    handleChangeEndTime(event){
        this.setState({endtime: event.target.value})
    }

    render(){
        return(
            <div className="insert" >
                Participant:
                <input type="text" value={this.state.participant} onChange={this.handleChangeParticipant}/>
                Trilha:
                <input type="text" value={this.state.trilha} onChange={this.handleChangeTrilha}/>
                Start Time:
                <input type="text" value={this.state.starttime} onChange={this.handleChangeStartTime}/>
                End Time:
                <input type="text" value={this.state.endTime} onChange={this.handleChangeEndTime}/>
                <input type="Submit" id="submit" onClick={this.captureInfo} Submit/>
            </div>
        )
    }
}

