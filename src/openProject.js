import WaveSurfer from 'wavesurfer.js'
//import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline'

  window.function_open_project = function function_open_project(){ 
    var file = document.getElementById('open_here');
    var reader = new FileReader();
    reader.onloadend = function() {
      if(file.files.length == 1){
        document.querySelector('[wm-frame=trilhas]').scrollIntoView();
        getXmlFile(reader.result, (xml)=> {
          //new ExtractXml(xml);
          new CreateElements(xml)
        })      
      }
    }
    reader.readAsDataURL(file.files[0])
  }
  

  

function getXmlFile(path, callback) {
  let request = new XMLHttpRequest();
  
  request.open("GET", path);
  request.setRequestHeader("Content-Type", "text/xml");
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status ===200){
      callback(request.responseXML);
    }
  };
  request.send();
}

class ExtractXml{
  constructor(xml){
    this.xml = xml
    this.object = {}
    this.extractDatasOfXML();
  }
  
  extractMedia() {return this.xml.getElementsByTagName("MEDIA_DESCRIPTOR");}
  
  extractURL (line) { return  line.getAttribute('MEDIA_URL').replace("file://", ""); }
  
  extractDescriptor  (line) { return line.getAttribute('RELATIVE_MEDIA_URL').replace("./", "");}
  
  extractTimeAttributes  ()  {
    let time_slot_id = [], time_value = [];
    for (const i of this.xml.getElementsByTagName("TIME_SLOT")) {
      time_slot_id.push(i.getAttribute('TIME_SLOT_ID'))
      time_value.push(i.getAttribute('TIME_VALUE'))              
    }
    this.object['time_slot_id'] = time_slot_id;
    this.object['time_value'] = time_value;
  }
  
  isAudio(line){ return line.getAttribute('MIME_TYPE').search("audio") != -1;}
  
  isVideo(line){ return line.getAttribute('MIME_TYPE').search("video") != -1;}
  
  extractTierPhrases  () {
    let phrases = []
    for(const i of this.xml.getElementsByTagName('TIER')){
      if(i.getAttribute('LINGUISTIC_TYPE_REF'))
        phrases.push(i)
    }
    this.object['phrases'] = phrases
  }
  
  extractTIER_ID(){
    let array=[]
    for (const i of this.xml.getElementsByTagName('TIER')) {
      array.push(i.getAttribute('TIER_ID'))
    }
    this.object['TIER_ID'] = array;
  }

  extractDatasOfXML(){
    for (const element of this.extractMedia()){
      if(this.isVideo(element)){
        this.object['urlVideo'] = this.extractURL(element)
        this.object['media_url_video'] = this.extractDescriptor(element)
      }
      if(this.isAudio(element)){
        this.object['urlAudio'] = this.extractURL(element)
        this.object['media_url_audio'] = this.extractDescriptor(element)
    }
  }
  
  this.extractTimeAttributes();
  this.extractTierPhrases();
  this.extractTIER_ID()
  console.log(this.object)
  
}

}

class CreateElements{
  constructor(xml){
    this.wavesurfer = null;
    this.frame=document.querySelector('[wm-frame=trilhas]')
    this.wmframeondas = document.querySelector('[wm-frame=ondas]')
    console.log(this.frame)
    this.framDoc = (this.frame.contentWindow || this.frame.contentDocument).document
    this.ExtractXml = new ExtractXml(xml)
    this.divs = this.createDivs()
    this.submitDivsTIER_ID()
    this.createInputs()
    this.adjustInputs()
    this.createWavesuferAndLoadLI()
    this.loadMedia()
  }
  
  createDivs(){
    let  elements  = [""]
    for (const item of this.ExtractXml.object['TIER_ID']) {
      elements.push(`<div wm-input=${String(item)} type="text"></div>\n`)
    }
    return elements.join("");
  }

  submitDivsTIER_ID(){
    const D = this.framDoc.querySelector('[wm-div]')
    D.innerHTML = this.divs
  }
  
  
  createInputs(){
    let elements = [""]
    this.ExtractXml.object['phrases'].forEach(v => {
      for (const i of v.getElementsByTagName('ANNOTATION')) {
        let firstElement = i.firstElementChild;
        let divSelected = this.framDoc.querySelector(`[wm-input=${v.getAttribute('TIER_ID')}]`);
        divSelected.innerHTML +=`<input value="${firstElement.firstElementChild.innerHTML}"
        wm-annotation-id=${firstElement.getAttribute('ANNOTATION_ID')}
        wm-annotation-ref=${firstElement.getAttribute('ANNOTATION_REF')}
        wm-annotation-previous=${firstElement.getAttribute('PREVIOUS_ANNOTATION')} type="text"
        onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';">`
      }
    })
    //console.log(elements.join('\n'))
    return elements.join('\n')
  }
  
  adjustInputs(){
    this.framDoc.querySelectorAll('input').forEach(input =>{
      input.style.width = (input.value.length + 1)*8 + 'px';
    })
  }
  
  createWavesuferAndLoadLI(){
    
    var framedocument = (this.wmframeondas.contentWindow || this.wmframeondas.contentDocument).document.querySelector('#waveform')
    var tag_li_media = (this.wmframeondas.contentWindow || this.wmframeondas.contentDocument).document.querySelector("#tag-li-media") 
    tag_li_media.innerHTML = this.ExtractXml.object["media_url_video"];
    var frameTimeline = (this.wmframeondas.contentWindow || this.wmframeondas.contentDocument).document.querySelector('#wave-timeline')
    
    console.log(tag_li_media);
    console.log(framedocument);

    this.wavesurfer = WaveSurfer.create({
      container: framedocument,
      waveColor: '#000000',
      progressColor: '#f1f1f1',
      // plugins: [
      //     TimelinePlugin.create({
      //           container: frameTimeline,
          
      //       })
      //     ],
      backend: 'MediaElement',
        });
    }
    

      loadMedia(){
        var wmframeondas = document.querySelector('[wm-frame=controls]')
        var video = (wmframeondas.contentWindow || wmframeondas.contentDocument).document.querySelector('#video')
        console.log(video)
        
        
        video.firstElementChild.src = this.ExtractXml.object['urlVideo']
        //video.poster = this.ExtractXml.object['urlVideo']
        //video.play()
        this.wavesurfer.load(video);
        this.wavesurfer.play()
        
      }
    }
    