import React, {Component} from 'react';
import Example from "./../../images/example.gif"

import {AiOutlineMail} from 'react-icons/ai'
import {AiFillGithub} from 'react-icons/ai'

export default class Home extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="container">
                    <div style={{padding: '20px 0px'}}>
                        <h2>Laws é uma ferramenta para anotações de gravações, quer seja audio ou video!</h2> 
                        <p>Esta ferramenta foi inspirado no projeto <a target='_blank' href='https://github.com/BrownCLPS/LingView'>LingView</a>!</p>
                    </div>
                    <div className="container-contrib">
                        <img style={{padding:'0px 20px', borderRadius: '4%'}} src={Example} alt="Exibição do Site Laws" />
                        <div style={{padding:'0px 20px'}}>
                            <h3 className="sub-desc">Nossas contribuições, foram:</h3>
                            <ul>
                                <li className='list-contrib'>Interface amigavel e simples para todos os públicos</li>
                                <li className='list-contrib'>Facilidade edição de anotações</li>
                                <li className='list-contrib'>Criação de Novo Projeto</li>
                                <li className='list-contrib'>Exportar Projeto</li>
                            </ul>
                        </div>
                    </div>


                <div className='end'>
                    <a target='_blank' href="https://mail.google.com/mail/u/0/?fs=1&to=jeremiaskalebe@gmail.com&tf=cm">
                        <AiOutlineMail className='iconesTools' size='3rem'/>
                        </a>
                    <a target='_blank' href='https://github.com/jkalebe'>
                        <AiFillGithub className='iconesTools'size='3rem'/>
                        </a>
                </div>
            </div>
        );
    }
}