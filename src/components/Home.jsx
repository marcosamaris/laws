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
                    <p className="subtitle">
                        No máximo, os lingüistas analisam a linguagem humana observando uma interação entre som e significado. Essas observações 
                        são adquiridas por meio de métodos etnográficos em arquivos multimídia. Para muitos linguistas, um dos primeiros passos em 
                        suas pesquisas é a criação da transcrição e tradução do material adquirido, para depois analisar o material ortograficamente 
                        ou foneticamente, ou mesmo outra análise sofisticada. ELAN é uma ferramenta de anotação que nos permite trabalhe com anotações 
                        para dados de vídeo e áudio. ELAN funciona em máquinas autônomas e tem vários processos complexos que podem chegar a ser 
                        complicados para usuários não especializados. Neste trabalho, propomos um sistema web de fácil utilização para anotações 
                        linguísticas manuais sobre transcrição e tradução de arquivos audiovisuais.
                    </p> 
                </div>
                <div className="descr">
                    <p className="sub-desc">Plataforma amigavel e simples para todos os públicos</p>
                </div>
                <div className='view'>
                <p>View</p>
                </div>
                <div>

                </div>

            </div>
        );
    }
}