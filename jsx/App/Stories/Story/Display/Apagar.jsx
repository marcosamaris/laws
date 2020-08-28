import * as fs from 'fs-web'
export function Apagar(){
    const startTime = window.document.activeElement.getAttribute('capture-start-time');
    const filho = window.document.activeElement.parentElement.parentElement
    ApagarElement(filho)
    ApagarTrilhanoJSON(startTime)
}

function ApagarElement(filho){
    window.document.activeElement.parentElement.parentElement.parentElement.removeChild(filho)
}

function ApagarTrilhanoJSON(startTime){
    console.log(startTime)
    fs.readString('data/eaf_temp.json').then((data) => {
        
        let json = JSON.parse(data);
        let cont=0;
        let objTemp;
        json.sentences.forEach(trilha => {
            cont++;
            if(trilha['start_time_ms'] == startTime){
                objTemp = delete json.sentences[cont]
                if(objTemp){
                    cont=0;
                    console.log(json.sentences)

                }
            }
        });
    })
}