import { parseXML } from 'jquery';
import React from 'react';
import { useState } from 'react';
import {store} from '../redux/store.jsx'


const Export = () =>{
    
    const [time, setTime] = useState()
    const [annotationID, setAnnotationId] = useState(0)
    const [idRef, setIdRef] = useState('')

    const clickMe = () =>{
        const xml = createXML(store.getState().json)
        downloadFiles(xml, "xml.eaf")

    }

    const createXML = (json) => {
        const time = {}
        let inc=0
        for (const i of json.sentences) {
            time[i.start_time_ms] = "ts"+ ++inc
            time[i.end_time_ms] = "ts"+ ++inc
        }
        setTime(time)
        const S = `
            <ANNOTATION_DOCUMENT AUTHOR="" DATE="${json.metadata.date_uploaded}" >
                <HEADER MEDIA_FILE="" TIME_UNITS="milliseconds">
                    <MEDIA_DESCRIPTOR MEDIA_URL="${"./" + json.metadata.title}" MIME_TYPE="video/mp4" RELATIVE_MEDIA_URL=""/>
                    <MEDIA_DESCRIPTOR EXTRACTED_FROM="" MEDIA_URL="" RELATIVE_MEDIA_URL=""/>
                    <PROPERTY NAME="lastUsedAnnotationId">13</PROPERTY>
                </HEADER>
                <TIME_ORDER>
                    ${
                        json.sentences.map(e => `<TIME_SLOT TIME_SLOT_ID="${time[e.start_time_ms]}" TIME_VALUE="${e.start_time_ms}"/>` ).join("\n")
                        +'\n'+
                        json.sentences.map(e => `<TIME_SLOT TIME_SLOT_ID="${time[e.end_time_ms]}" TIME_VALUE="${e.end_time_ms}"/>` ).join("\n")
                    }
                </TIME_ORDER>

                ${generateTrails(json.sentences)}

                <LINGUISTIC_TYPE GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="default-lt" TIME_ALIGNABLE="true"/>
                <LINGUISTIC_TYPE GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="Phrases" TIME_ALIGNABLE="true"/>
                <LINGUISTIC_TYPE CONSTRAINTS="Symbolic_Association" GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="Blank" TIME_ALIGNABLE="false"/>
                <LINGUISTIC_TYPE CONSTRAINTS="Symbolic_Subdivision" GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="Words" TIME_ALIGNABLE="false"/>
                <LINGUISTIC_TYPE GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="Text" TIME_ALIGNABLE="true"/>
                <LINGUISTIC_TYPE CONSTRAINTS="Symbolic_Association" GRAPHIC_REFERENCES="false" LINGUISTIC_TYPE_ID="Note" TIME_ALIGNABLE="false"/>
                <CONSTRAINT DESCRIPTION="Time subdivision of parent annotation's time interval, no time gaps allowed within this interval" STEREOTYPE="Time_Subdivision"/>
                <CONSTRAINT DESCRIPTION="Symbolic subdivision of a parent annotation. Annotations refering to the same parent are ordered" STEREOTYPE="Symbolic_Subdivision"/>
                <CONSTRAINT DESCRIPTION="1-1 association with a parent annotation" STEREOTYPE="Symbolic_Association"/>
                <CONSTRAINT DESCRIPTION="Time alignable annotations within the parent annotation's time interval, gaps are allowed" STEREOTYPE="Included_In"/>
            </ANNOTATION_DOCUMENT>
            `
            const X = parseXML(S)
            console.log(X)
        return S
    }

    const generateTrails = (sentences) =>{
        let phrase = ''
        let translations = ''
        let words = ''
        let note = ''
        let trails=[]
        let tierID=0
        let tierIDWords=tierID

        
        for (const item of sentences) {
            phrase = TokenTranscriptions("Phrase", generateAnnotationId(), item.speaker, item.speaker, item.ref1, item.ref2, item.text)
            trails.push(phrase)
            setIdRef('a'+annotationID)
            if(item.dependents.length > 0)
                    
                    for (const i of item.dependents) {
                        if (i.values.length == 1){
                            // transcriptions
                            translations=TokenTranslations("Phrase", generateAnnotationId(), item.speaker, i.values[0].value,
                            item.speaker, item.speaker, idRef)
                        }
                        trails.push(translations)
                    }
        }


        return trails.join('\n')
    }    

    const TokenTranscriptions = (linguisticType, annotationID, speaker, tierID, ref1, ref2, text) =>{
        return `<TIER LINGUISTIC_TYPE_REF="${linguisticType}" PARTICIPANT="${speaker}" TIER_ID="${tierID}">
                    <ANNOTATION>
                        <ALIGNABLE_ANNOTATION ANNOTATION_ID="${annotationID}" TIME_SLOT_REF1="${ref1}" TIME_SLOT_REF2="${ref2}">
                            <ANNOTATION_VALUE>${text}</ANNOTATION_VALUE>
                        </ALIGNABLE_ANNOTATION>
                    </ANNOTATION>
                </TIER>`
    }

    const TokenTranslations = (linguisticType, annotationID, speaker, text, tierID, parentRef, annotationRef) =>{
        return `
                            <TIER LINGUISTIC_TYPE_REF="${linguisticType}" PARENT_REF="${parentRef}" PARTICIPANT="${speaker}" TIER_ID="${tierID}">
                                <ANNOTATION>
                                    <ALIGNABLE_ANNOTATION ANNOTATION_ID="${annotationID}" ANNOTATION_REF="${annotationRef}">
                                        <ANNOTATION_VALUE>${text}</ANNOTATION_VALUE>
                                    </ALIGNABLE_ANNOTATION>
                                </ANNOTATION>
                            </TIER>`
    }

    const generateAnnotationId = ()=>{
        setAnnotationId(annotationID+1)
        return annotationID
    }


    function downloadFiles(data, file_name) {
        var file = new Blob([data], {type: "text/plain;charset=utf-8;"});
        if (window.navigator.msSaveOrOpenBlob) 
            window.navigator.msSaveOrOpenBlob(file, file_name);
        else { 
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = file_name;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    return (
        <div className='export'>
            <button onClick = {clickMe}>Export XML</button>
        </div>
    );
}

export default Export;
