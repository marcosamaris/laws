import React from 'react';
import {store} from '../redux/store.jsx'
import {AiOutlineArrowUp} from 'react-icons/ai'
/* 
  A text format button that renders a window for tier selection on clicked. 
  This tier selection window then leads to a new block displaying the result of LaTeX format conversion.
*/


export class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.editSentence = this.editSentence.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.state = {
            clicked: false,
            translations: '',
            transcriptions: ''
        }
      }

    /* Updates the flag when button is clicked so that the tier selection component gets rendered. */
    handleClick(e) {
        e.preventDefault();
        this.setState({
            clicked: true
        })
        
    }

    handleChangeInput = e => {
        const { name, value } = e.target
        this.setState({ ...this.state, [name]: value, err: '', success: ''})

    }

    editSentence(){
        let json = store.getState().json
        let sentence = this.props.sentence

        //verifica se a Transcriptions foi alterada
        if(this.state.transcriptions != '')
            sentence['text'] = this.state.transcriptions

        if(this.state.translations != '')
            if (sentence['dependents'].lenght == 0){
                sentence['dependents'].push({tier: '', values:[{
                    start_slot:0,
                    end_slot: 1,
                    value: this.state.translations
                }]})
            }
            else{
                sentence['dependents'][0] = {tier: '', values:[{
                                            start_slot:0,
                                            end_slot: 1,
                                            value: this.state.translations
                                        }]}
            }

        //encontra o index do array
        let index = json.sentences.findIndex(e => e.start_time_ms == sentence.start_time_ms
                                             && e.end_time_ms == sentence.end_time_ms)
        
        json['sentences'][index]=sentence
        store.dispatch({type: "actions/set", json})
        
        //minimizar inputs do Editar
        this.setState({clicked: true })
        

    }

    render() {
        return (
            <div>
                <button className="btn btn-outline-dark btn-sm" onClick={this.handleClick}>
                Edit
                </button>
                {this.state.clicked ? 
                    <div>
                        <div>
                        <label className='labels transcriptions' htmlFor="transcriptions">Transcriptions</label>
                        <input value={this.state['transcriptions']} type="text" className='transcriptions' placeholder="Enter the transcriptions"
                            onChange={this.handleChangeInput} name="transcriptions" id="transcriptions" />
                        </div>

                        <div>
                        <label className='labels translations' htmlFor="translations">Translations</label>
                        <input value={this.state['translations']} type="text" className='translations' placeholder="Enter the Translations"
                            onChange={this.handleChangeInput} name="translations" id="translations" />
                        
                        </div>
                        <div >
                            <button className='btn btn-dark btn-sm' onClick={this.editSentence}>
                            Editar
                            </button>
                            <button  style={{margin: '0 20px'}} onClick={()=>this.setState({clicked: false })} >
                                <AiOutlineArrowUp />
                            </button>
                        </div>
                </div>
                : null }
            </div>); 
    }
    
}
