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
                        <h2>Laws é uma ferramenta simples e acessível para anotações de gravações audiovisuais</h2> 
                        <p style={{padding: '20px 0px'}}>Esta ferramenta foi inspirada no
                        projeto <a 
                        onMouseOver={() => $( ".overlaygrad" ).css( "display", "block" )} 
                        onMouseOut={() => $( ".overlaygrad" ).css( "display", "none" )}
                        target='_blank' 
                        style={{TextDecoder: 'underline', fontStyle: 'italic', fontWeight:'bold', cursor: 'pointer'}} 
                        className='link-tcc' href='https://github.com/BrownCLPS/LingView'
                        >LingView</a>, o qual foi originalmente desenvolvido como parte do 
                        Projeto de Documentação da língua A’ingae. O LingView é um software de visualização de anotações 
                        linguísticas (como transcrição e tradução) e suas respectivas mídias simultaneamente e foi  projetado para 
                        ser um recurso amigável a uma grande variedade de público.</p>
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
                        <p>O objetivo do Laws é criar anotações em materiais audiovisuais de maneira simples, com uma interface de fácil
                            manuseio e visualização. A partir do LingView, criamos funcionalidades, de uso acessível a um público amplo, 
                            para a transcrição e tradução de materiais audiovisuais. </p>
                    </div>
                    <div className="container-contrib">
                        <img style={{padding:'0px 20px', borderRadius: '4%'}} src={Example} alt="Exibição do Site Laws" />
                        <div style={{padding:'0px 20px'}}>
                            <h4 className="sub-desc">Nossas contribuições foram:</h4>
                            <ul>
                                <li className='list-contrib'>Interface amigavel e simples para todos os públicos</li>
                                <li className='list-contrib'>Facilidade de edição de anotações</li>
                                <li className='list-contrib'>Criar Novo Projeto</li>
                                <li className='list-contrib'>Abrir Projeto</li>
                                <li className='list-contrib'>Exportar Projeto</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <p>Os arquivos de mídia suportados são WAV, MP3 para áudio e MPEG-4, MP4 e WebM para vídeo (de tamanho máximo de cerca de 10 minutos). 
                            Os projetos são criados em formato EAF (Eudico Annotation Format), para serem usados no software ELAN.</p>
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
