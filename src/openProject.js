const extractMedia = (xml) => xml.getElementsByTagName("MEDIA_DESCRIPTOR");
const extractURL = (line) => line.getAttribute('MEDIA_URL');
const extractDescriptor = (line) => line.getAttribute('RELATIVE_MEDIA_URL');
const isAudio = (line) => line.getAttribute('MIME_TYPE').search("audio") != -1;
const isVideo = (line) => line.getAttribute('MIME_TYPE').search("video") != -1;
const extractParticipant = (xml) => [].map.call( xml.getElementsByTagName('TIER'), function(value){
  console.log(value.getAttribute('PARTICIPANT') && value.getAttribute('LINGUISTIC_TYPE_REF')=='Phrases' ?  value.getAttribute('PARTICIPANT'):'')

});

const extractPhrasesParticipant = (xml) => 
  Array.of(xml)
  .forEach(function(){
    var obj={};
    var array=[];
    for (const item of arguments[0]) {
      
      if(item.getAttribute('PARTICIPANT') != null && item.getAttribute('LINGUISTIC_TYPE_REF') == 'Phrases'){
        obj[item.getAttribute('PARTICIPANT')] =[]
        array.push(item.getElementsByTagName('ANNOTATION_VALUE')[0].innerHTML);
        // Array.prototype.push.apply(array, [item.getElementsByTagName('ANNOTATION_VALUE')[0].innerHTML])
        obj[item.getAttribute('PARTICIPANT')] = array//Array.prototype.push.apply({[item.getAttribute('LINGUISTIC_TYPE_REF')] : item.getElementsByTagName('ANNOTATION_VALUE')[0].innerHTML})
      }
    }
    console.log(obj)
  });
  
  
  function function_open_project(){ 
    var file = document.getElementById('open_here');
    var reader = new FileReader();
    reader.onloadend = function() {
      if(file.files.length == 1){
        getXmlFile(reader.result, extractXML);
  
}
}
reader.readAsDataURL(file.files[0])
}

function getXmlFile(path, callback) {
  let request = new XMLHttpRequest();
  var object={};
  request.open("GET", path);
  request.setRequestHeader("Content-Type", "text/xml");
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status ===200){
      callback(request.responseXML);
    }
  };
  request.send();
  
}

const extractXML = function(xml){
          
  const object = {};
  var urlVideo, urlAudio;
  var media_video, media_audio;
  var time_slot_id=[], time_value=[]
  
  var participant, type_ref, tier_id, parent_ref;
  //extractParticipant(xml)
  
  extractPhrasesParticipant(xml.getElementsByTagName('TIER'))
  
  for (const element of extractMedia(xml)){
    if(isVideo(element)){
      urlVideo = extractURL(element)
      media_video = extractDescriptor(element)
    }
    if(isAudio(element)){
    urlAudio = extractURL(element)
    media_audio = extractDescriptor(element)
  }
  
}
object['urlVideo']=urlVideo;
object['urlAudio']=urlAudio;
object['media_url_video']=media_video.replace("./", "");
object['media_url_audio']=media_audio.replace("./", "");


//extrai as marcações dos tempos
for (const i of xml.getElementsByTagName("TIME_SLOT")) {
  time_slot_id.push(i.getAttribute('TIME_SLOT_ID'))
  time_value.push(i.getAttribute('TIME_VALUE'))              
}
object['time_slot_id']=time_slot_id;
object['time_value']=time_value;


//extrai as trilhas
var trilhas=xml.getElementsByTagName("TIER");   
for (const i of trilhas) {
  participant = i.getAttribute('PARTICIPANT');
  for (const j of i.attributes) {
    switch(String(j.name)){
      case "LINGUISTIC_TYPE_REF":
        type_ref=j.value;
        break;
        
      case "TIER_ID":
        tier_id=j.value;
        
        break;
      case "PARENT_REF":
        parent_ref=j.value;

        break;
  } 
}
//object[participant]={}
if(type_ref == "Phrases"){
  var annotation = i.getElementsByTagName("ANNOTATION_VALUE");

  object[participant]={'Phrases': []}
  for (const phrases_annotation of annotation) {
    object[participant][type_ref].push(phrases_annotation.innerHTML);
    console.log("Participant: "+ i.getAttribute('PARTICIPANT') + " !" +  phrases_annotation.innerHTML)
  }
}
if(type_ref=="Words"){
  var annotationWords = i.getElementsByTagName("ANNOTATION_VALUE")
  object[participant]={'Words': []}
  for (const words_annotation of annotationWords) {
    object[participant][type_ref].push(words_annotation.innerHTML);
  }
}

if(type_ref=="Note" && tier_id.search("Translation") != -1){
  var annotationNote = i.getElementsByTagName("ANNOTATION_VALUE")
  for (const note_annotation of annotationNote) {
    
  }
}

if(type_ref=="Note" && tier_id.search("Participant-note")!=-1){
  var annotationnoteParticipant = i.getElementsByTagName("ANNOTATION_VALUE")
  for (const noteParticipant_annotation of annotationnoteParticipant) {
    
  }
}
}     
  

console.log(object)
//return object;
}