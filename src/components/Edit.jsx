import React from 'react';
import {useDispatch} from 'react-redux'
import {store} from '../redux/store.jsx'

/* 
  A text format button that renders a window for tier selection on clicked. 
  This tier selection window then leads to a new block displaying the result of LaTeX format conversion.
*/
export class Edit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonClicked : false
        }
        this.handleClick = this.handleClick.bind(this);
      }

    /* Updates the flag when button is clicked so that the tier selection component gets rendered. */
    handleClick(e) {
        e.preventDefault();
        console.log(this.props.sentence)
        this.setState({
            buttonClicked : true
        });

    }

    render() {
        return (
            <div class="latexButtonContainer">
                <button class="latexButton" onClick={this.handleClick}>
                Edit
                </button>
                {/* The -1 from start time ms matches how the sentence's search index is calculated for the sentence's URL.
                A timed sentence's index in the URL is its start time minus 1. */}
                {this.state.buttonClicked ? 
                console.log('clicado') 
                : null}
            </div>); 
    }
    
}
