import React, {Component} from 'react';
import './Home.css'

export default class Home extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="home">
                <div className="descr">
                    <div className="line-title"></div>
                        <h2 className="subtitle">Laws é uma ferramenta computacional para anotações linguísticas manuais de arquivos audiovisuais!</h2>
                    <div className="line-title"></div>
                    
                </div>
                <div className="descr">
                    <h3 className="sub-desc">Plataforma amigavel e simples para todos os públicos</h3>
                </div>
                <div className='view'>
                <h2>View</h2>
                </div>
                <div>

                </div>

            </div>
        );
    }
}