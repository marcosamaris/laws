const extract = require('./extract_eaf_data')

function getVideo(){
    var wmframeondas = document.querySelector('[wm-frame=controls]')
    var video = (wmframeondas.contentWindow || wmframeondas.contentDocument).document.querySelector('#video')
    return video
}

function startPhrases(adoc){
    const frame = document.querySelector('[wm-frame=trilhas]');
    const framDoc = (frame.contentWindow || frame.contentDocument).document.querySelector('[wm-div]')
    
    console.log(framDoc)
    var doc = ""
    for(object of extract.getPhrases(adoc)){
        console.log(object)
        doc +=startLabeledTimeBlock(object["TIME_SLOT_REF1"], object["TIME_SLOT_REF2"], object["Participant"], object["Phrases"], object["Phrases"])
    }

    framDoc.innerHTML = doc

}

function rebuild(adoc){

}

function startLabeledTimeBlock(data_start_time, data_end_time, participant, transcriptions, translations){
    return ` <div class="labeledTimeBlock" data-start-time=${data_start_time} data-end-time=${data_end_time}>
                ${createSpanTimeStampContainer(data_start_time)}
                ${createDivTimeBlock(participant, transcriptions, translations)}
                </div>            
            `;
}


function createSpanTimeStampContainer(data_start_time){ return data_start_time.split("")[0];}

function createDivTimeBlock(participant, transcriptions, translations){
    return `    <div class="timeBlock">
                ${createDivLabeledSentence(participant, transcriptions, translations)}
                </div>
            `
}

function createDivLabeledSentence(participant, transcriptions, translations){
    return `    <div class="labeledSentence">
                ${createSpanSpeakerLabel(participant)}
                ${createTableGloss(transcriptions, translations)}
                </div>
    `
}

function createSpanSpeakerLabel(participant){
    return `<span class="speakerLabel">
            ${participant}
            ":"
            </span>
    `
}

function createTableGloss(transcriptions, translations){
    return `<table>
                <tbody>
                    <tr>
                        ${createTdColspanPhrases(transcriptions, translations)}
                    </tr>
                </tbody>
            </table>
    `
}

function createTdColspanPhrases(phrase1, phrase2){
    return `<td>
            ${phrase1}
            </td>
            <td>
            ${phrase2}
            </td>`
}

module.exports = {
    startPhrases: startPhrases
};