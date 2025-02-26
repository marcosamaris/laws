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
                        <h2>LAWS is a simple and accessible tool for annotating audiovisual recordings</h2> 
                        <p style={{padding: '20px 0px'}}>This tool was inspired in the project <a 
                        onMouseOver={() => $( ".overlaygrad" ).css( "display", "block" )} 
                        onMouseOut={() => $( ".overlaygrad" ).css( "display", "none" )}
                        target='_blank' 
                        style={{TextDecoder: 'underline', fontStyle: 'italic', fontWeight:'bold', cursor: 'pointer'}} 
                        className='link-tcc' href='https://github.com/BrownCLPS/LingView'
                        >LingView</a>, which was originally developed as part of the A'ingae Language Documentation Project. 
                        LingView is software for visualizing linguistic annotations (such as transcription and translation) 
                        and their respective media simultaneously and is designed to be a user-friendly resource for a wide
                         variety of audiences.</p>
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
                        <h3>About o LAWS</h3>
                        <p>The aim of LAWS is to create annotations on audiovisual materials in a simple way, 
                            with an interface that is easy to use and visualize. Based on LingView, we have created functionalities, 
                            accessible to a wide audience, for transcribing and translating audiovisual materials. </p>
                    </div>
                    <div className="container-contrib">
                        <img style={{padding:'0px 20px', borderRadius: '4%'}} src={Example} alt="Exibição do Site Laws" />
                        <div style={{padding:'0px 20px'}}>
                            <h4 className="sub-desc">Contributions of LAWS are:</h4>
                            <ul>
                                <li className='list-contrib'>User-friendly interface for all audiences</li>
                                <li className='list-contrib'>Easy to edit annotations</li>
                                <li className='list-contrib'> Easy to start new Projects</li>
                                <li className='list-contrib'>Easy to continue a project</li>
                                <li className='list-contrib'>Export projects with ELAN syntax</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <p>The media files supported are WAV, MP3 for audio and MPEG-4, MP4 and WebM for video (maximum length 
                            about 10 minutes). The projects are created in EAF format (Eudico Annotation Format), to be used in
                             the ELAN software.</p>
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
