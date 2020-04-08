function function_open_project(){ 
  var file = document.getElementById('open_here');
  var reader = new FileReader();
  reader.onloadend = function() {
    if(file.files.length == 1){

    const object = {length:0};
    
    getXmlFile(reader.result, function(xml, object){
      
      var urlVideo;
      var urlAudio;
      var media_video;
      var media_audio;
      var time_slot_id=[]
      var time_value=[]
      
      var participant;
      var type_ref;
      var tier_id;
      var parent_ref;

      for (const element of xml.getElementsByTagName("MEDIA_DESCRIPTOR")){
        if(element.getAttribute('MIME_TYPE') == "video/mp4"){
          urlVideo = element.getAttribute('MEDIA_URL');
          media_video = element.getAttribute('RELATIVE_MEDIA_URL')
        }
        else if(element.getAttribute('MIME_TYPE') == "audio/x-wav"){
          urlAudio = element.getAttribute('MEDIA_URL');
          media_audio = element.getAttribute('RELATIVE_MEDIA_URL')
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
        for (const j of i.attributes) {
          switch(String(j.name)){
            case "LINGUISTIC_TYPE_REF":
              type_ref=j.value;
              //object[i.getAttribute('PARTICIPANT')]={length:0, [j.name]:[].push.apply(this, [j.value])}
              break;
              
            case "TIER_ID":
              tier_id=new String(j.value);
              
              break;
            case "PARENT_REF":
              parent_ref=new String(j.value);

              break;
        }
        
      }
      
      
      if(type_ref == "Phrases"){
        var annotation = i.getElementsByTagName("ANNOTATION_VALUE");
        
        for (const phrases_annotation of annotation) {
          
        }
      }
      
      if(type_ref=="Words"){
        var annotationWords = i.getElementsByTagName("ANNOTATION_VALUE")
        for (const words_annotation of annotationWords) {
          
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
    
  });
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
      callback(request.responseXML, object);
    }
  };
  request.send();
  
}