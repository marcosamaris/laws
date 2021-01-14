import React, {Component} from 'react';

export default class Export extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className='export'>
                <button>Export XML</button>
            </div>
        );
    }
}
