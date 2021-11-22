import React from 'react';
import {store} from '../redux/store.jsx'

/* 
  A text format button that renders a window for tier selection on clicked. 
  This tier selection window then leads to a new block displaying the result of LaTeX format conversion.
*/
class Delete extends React.Component {


    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.del = this.del.bind(this);
      }

    /* Updates the flag when button is clicked so that the tier selection component gets rendered. */
    handleClick(e) {
        e.preventDefault();
        this.del()
    }

    del(){
        let json = store.getState().json
        let sentence = this.props.sentence

        //encontra o index do array
        let index = json.sentences.findIndex(e => e.start_time_ms == sentence.start_time_ms
                                             && e.end_time_ms == sentence.end_time_ms)
        //deleta a sentence
        json.sentences.splice(index, 1)
        //atualiza o store
        store.dispatch({type: "actions/set", json})

    }

    render() {
        return (
            <div >
                <button className="btn btn-outline-dark btn-sm" onClick={this.handleClick}>
                Deletar
                </button>
            </div>); 
    }   
}


export default Delete;