import React, {Component} from 'react';
import $ from 'jquery'
import Example from "./../../images/example.gif"
import menu from "./../../images/Lingview.gif"

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
                        <p style={{padding: '20px 0px'}}>Esta ferramenta foi inspirado no
                        projeto <a 
                        onMouseOver={() => $( ".overlaygrad" ).css( "display", "block" )} 
                        onMouseOut={() => $( ".overlaygrad" ).css( "display", "none" )}
                        target='_blank' 
                        style={{TextDecoder: 'underline', fontStyle: 'italic', fontWeight:'bold', cursor: 'pointer'}} 
                        className='link-tcc' href='https://github.com/BrownCLPS/LingView'
                        >LingView</a>! O qual 
                        foi originalmente desenvolvido como parte do Projeto de Documentação da Língua A’ingae para exibir um corpus de materiais em A'ingae, 
                        o software foi projetado para ser um recurso flexível para uma variedade de diferentes comunidades, pesquisadores e materiais.</p>
                    </div>

                    <div  style={{position: "relative"}}>
                        <div className="overlaygrad">
                            <div >
                                <div className="col-lg-12 text-center">
                                    <p>LingView</p>
                                    <img className="img-graduation" src={menu}/>
                                </div>                         
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Sobre o Laws</h3>
                        <p>O objetivo do Laws é criar anotações em audiovisuais de maneira simples, com interface de facil visualização. Assim, obtemos o LingView e acrescentamos funcionalidades na ferramenta!</p>
                    </div>
                    <div className="container-contrib">
                        <img style={{padding:'0px 20px', borderRadius: '4%'}} src={Example} alt="Exibição do Site Laws" />
                        <div style={{padding:'0px 20px'}}>
                            <h4 className="sub-desc">Nossas contribuições, foram:</h4>
                            <ul>
                                <li className='list-contrib'>Interface amigavel e simples para todos os públicos</li>
                                <li className='list-contrib'>Facilidade edição de anotações</li>
                                <li className='list-contrib'>Criar Novo Projeto</li>
                                <li className='list-contrib'>Abrir Projeto</li>
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