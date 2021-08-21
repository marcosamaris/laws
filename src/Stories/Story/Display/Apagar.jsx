import {store} from '../../../redux/store.jsx'
import {useDispatch} from 'react-redux'

export function Apagar(){
    // const dispatch = useDispatch()

    const startTime = window.document.activeElement.getAttribute('capture-start-time');
    const json = store.getState().json
        
    let cont=[0];
    json.sentences.forEach(trilha => {
        cont[0]++;
        if(trilha['start_time_ms'] == startTime){
            const objTemp = delete json.sentences[cont]
            if(objTemp){
                cont=0;
                // dispatch({type: "actions/set", json})
                console.log(json.sentences)
            }
        }
    });
}