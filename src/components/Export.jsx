import { parseXML } from 'jquery';
import React from 'react';
import {store} from '../redux/store.jsx'


const Export = () =>{
    
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
                ${console.log(createJsonOfSentences(json))}

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

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    const createJsonOfSentences = (json) => {
        const res=[]

        for (const sentence of json.sentences) {
            const str={}
            str['ref1']=sentence.ref1
            str['ref2']=sentence.ref2
            str['text']=sentence.text
            str['speaker']=sentence.speaker
            res.push(str)
        }
        
        return res.reduce((result, el) => 
             result + `<TIER LINGUISTIC_TYPE_REF="Phrases" PARTICIPANT="${el.speaker}" TIER_ID="A_Transcription-txt-deu">
            <ANNOTATION>
                <ALIGNABLE_ANNOTATION ANNOTATION_ID="a3" TIME_SLOT_REF1="${el.ref1}" TIME_SLOT_REF2="${el.ref2}">
                    <ANNOTATION_VALUE>${el.text}</ANNOTATION_VALUE>
                </ALIGNABLE_ANNOTATION>
            </ANNOTATION>
        </TIER>`
        )
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
