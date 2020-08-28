import React, {Component} from 'react'

function CaptureInfo(){
    console.log("captured with sucess")
}

export function Insert(){

    
        console.log(document)
        let timedTextDisplay = document.getElementById('timedTextDisplay');
        console.log(timedTextDisplay)

        timedTextDisplay.innerHTML
        
        timedTextDisplay.innerHTML +=`
            <div style="padding:10px 0px 60px">
                <input type="text" >Participante</input>
                <input type="text" >Start Time</input>
                <input type="text" >End Time</input>
                <input type="text" >Trilha</input>
                <button value="Submit" onClick=${CaptureInfo} id="submit" ></button>
            </div>
        `

}
