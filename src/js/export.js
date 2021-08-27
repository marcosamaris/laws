function getTime(sentence){
    let times=[]
    let timeObject={}
    for (const item of sentence) {
        times.push(item.start_time_ms)
        times.push(item.end_time_ms)
    }
    //ordena o tempo
    times.sort((a,b) => a-b)
    let count = 0
    for (const i of times) {
        count++
        timeObject[i]='ts'+count
    }
    return timeObject
}

//gera a tag TimeOrder
function generateTimeSlot(times){
    let timeOrder=''
    for (const i of Object.keys(times)) {
        timeOrder += `<TIME_SLOT TIME_SLOT_ID="${times[i]}" TIME_VALUE="${i}"/>\n`
    }
    return `<TIME_ORDER>
            ${timeOrder}
            </TIME_ORDER>`
            
}

function generateTagHeader(metadata){
    return `<HEADER MEDIA_FILE="" TIME_UNITS="milliseconds">
                <MEDIA_DESCRIPTOR MEDIA_URL="${"file:///C:/music/" + metadata['nameFile']}" MIME_TYPE="${String(metadata['nameFile']).includes("mp3") ? "audio/" + metadata['nameFile'].split('.')[1] : "video/" + metadata['nameFile'].split('.')[1]+"/"}" RELATIVE_MEDIA_URL=""/>
                <PROPERTY NAME="lastUsedAnnotationId">13</PROPERTY>
            </HEADER>`
}

const generateTagAnnotation = (sentences, time) =>{
    let annotationID=0;
    let idRef=''
    let annotationsBySpeaker={}
    let annotationsBySpeakerTranslations={}
    let tierID = {}
    let tierContador=0
    
    for (const item of sentences) {
        //para cada sentença, temos um annotationID
        //incrementa annotationID
        annotationID++;

        //idREF
        idRef = 'a'+annotationID;

        //transcription
        if(annotationsBySpeaker[item.speaker] == null)
            annotationsBySpeaker[item.speaker] = []
        
        //verificar se o speaker ja tem o tierID
        if(tierID[item.speaker] == null ){
            tierID[item.speaker]=[]
            //armazenar tierID
            tierID[item.speaker].push({'tierID': 'T'+ ++tierContador, 'tierRef': null})
        }

        annotationsBySpeaker[item.speaker].push(TagAnnotation("a"+annotationID, time[item.start_time_ms], time[item.end_time_ms], item.text))
        //verifica se possui translations ou outras dependencias
        if(item.dependents.length > 0)
                
        for (const i of item.dependents) {
            //verifica se é translations                
            if (i.values.length == 1){
                        //guarda o tierIDReference
                        if(tierID[item.speaker][0].tierRef == null)
                            tierID[item.speaker][0] = ({...tierID[item.speaker][0], 'tierRef': 'T'+ ++tierContador})
                        //incrementa annotationID
                        annotationID++;
                        // translations
                        if(annotationsBySpeakerTranslations[item.speaker] == null)
                            annotationsBySpeakerTranslations[item.speaker] = []
                        annotationsBySpeakerTranslations[item.speaker].push(TagRefAnnotation("a"+annotationID, idRef, i.values[0].value))
                    }
                }
    }
    return (TagTier("Transcriptions", tierID, annotationsBySpeaker) + TagTierWithParentRef("Translations", tierID, annotationsBySpeakerTranslations))
}    

const TagTier = (linguisticType, tierID, trails) =>{
    //coleta todos os participantes
    const speakers = Object.keys(trails)
    let transcription = []
    for (const speaker of speakers) {
        //agrupa os tiers
        transcription.push(
    `<TIER LINGUISTIC_TYPE_REF="${linguisticType}" PARTICIPANT="${speaker}" TIER_ID="${tierID[speaker][0].tierID}">
        ${trails[speaker].join('\n')}
    </TIER>`)
    }

    return transcription.join('\n')
}

const TagTierWithParentRef = (linguisticType, tierID, trails) =>{
    //coleta os participantes, que nesse caso são também participantes referenciados
    const speakers = Object.keys(trails)
    let translations = []
    for (const speaker of speakers) {
        translations.push(
    `<TIER LINGUISTIC_TYPE_REF="${linguisticType}" PARENT_REF="${tierID[speaker][0].tierID}" PARTICIPANT="${speaker}" TIER_ID="${tierID[speaker][0].tierRef}">
        ${trails[speaker].join('\n')}           
    </TIER>`)
    }
    return translations.join('\n')
}

const TagRefAnnotation = (annotationID, annotationRef, text) =>{
return `<ANNOTATION>
<REF_ANNOTATION ANNOTATION_ID="${annotationID}" ANNOTATION_REF="${annotationRef}">
    <ANNOTATION_VALUE>${text}</ANNOTATION_VALUE>
</REF_ANNOTATION>
</ANNOTATION>`
}

const TagAnnotation = (annotationID, startTime, endTime, text) => {
    return `<ANNOTATION>
<ALIGNABLE_ANNOTATION ANNOTATION_ID="${annotationID}" TIME_SLOT_REF1="${startTime}" TIME_SLOT_REF2="${endTime}">
    <ANNOTATION_VALUE>${text}</ANNOTATION_VALUE>
</ALIGNABLE_ANNOTATION>
</ANNOTATION>`
}

function generateTagLingType(lingTypes){
    let lingsTypes=''
    for (const item of lingTypes) {
        lingsTypes += `<LINGUISTIC_TYPE GRAPHIC_REFERENCES="${item.grapRef}" LINGUISTIC_TYPE_ID="${item.typeID}" TIME_ALIGNABLE="${item.timeAlignable}" ${item.constrains ? "CONSTRAINTS=\""+item.constrains+"\"": ""}/>`
    }
    return lingsTypes
}

function getLingType(){
    let type=[]
    type.push({'typeID': 'Transcriptions', 'timeAlignable': true, 'grapRef': false, 'constrains': false})
    type.push({'typeID': 'Translations', 'timeAlignable': false, 'grapRef': false, 'constrains': 'Symbolic_Association'})
    return type
}

function generateXml(json){
    const time = getTime(json.sentences)
    const S = 
`<?xml version="1.0" encoding="UTF-8"?>
<ANNOTATION_DOCUMENT AUTHOR="" DATE="${json.metadata.date_uploaded}" FORMAT="2.7" VERSION="2.7" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ${generateTagHeader(json.metadata)}
    ${generateTimeSlot(time)}
    ${generateTagAnnotation(json.sentences, time)}
    <LOCALE COUNTRY_CODE="US" LANGUAGE_CODE="en"/>
    ${generateTagLingType(getLingType())}
    <CONSTRAINT DESCRIPTION="Time subdivision of parent annotation's time interval, no time gaps allowed within this interval" STEREOTYPE="Time_Subdivision"/>
    <CONSTRAINT DESCRIPTION="Symbolic subdivision of a parent annotation. Annotations refering to the same parent are ordered" STEREOTYPE="Symbolic_Subdivision"/>
    <CONSTRAINT DESCRIPTION="1-1 association with a parent annotation" STEREOTYPE="Symbolic_Association"/>
    <CONSTRAINT DESCRIPTION="Time alignable annotations within the parent annotation's time interval, gaps are allowed" STEREOTYPE="Included_In"/>
</ANNOTATION_DOCUMENT>`

return S
}

module.exports = {
    generateXml: generateXml
}
