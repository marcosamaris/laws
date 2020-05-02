function function_open_project(){ 
  var file = document.getElementById('open_here');
  var reader = new FileReader();
  reader.onloadend = function() {
    if(file.files.length == 1){
      
      getXmlFile(reader.result, (xml)=> {
        //new ExtractXml(xml);
        new CreateElements(xml)
      })
      
      new SubmitDatasFrame()
      
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
  
  extractDatasOfXML(){
    for (const element of this.extractMedia(this.xml)){
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
  console.log(this.object)
  this.extractTIER_ID()
  
  
  }
  
  extractMedia = () => this.xml.getElementsByTagName("MEDIA_DESCRIPTOR");
  
  extractURL = (line) => line.getAttribute('MEDIA_URL');
  
  extractDescriptor = (line) => line.getAttribute('RELATIVE_MEDIA_URL').replace("./", "");
  
  extractTimeAttributes = () => {
    let time_slot_id = [], time_value = [];
    for (const i of this.xml.getElementsByTagName("TIME_SLOT")) {
      time_slot_id.push(i.getAttribute('TIME_SLOT_ID'))
      time_value.push(i.getAttribute('TIME_VALUE'))              
    }
    this.object['time_slot_id'] = time_slot_id;
    this.object['time_value'] = time_value;
  }
  
  isAudio = (line) => line.getAttribute('MIME_TYPE').search("audio") != -1;
  
  isVideo = (line) => line.getAttribute('MIME_TYPE').search("video") != -1;

  extractTierPhrases = () =>{
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
  
}

class SubmitDatasFrame{
  constructor(){
    this.input = null
    this.inputDatasTrilhas()
  }

  getFrame(){
    return document.querySelector('[wm-frame=trilhas]')
  }

  getDocument(){
    let D = this.getFrame();
    return (D.contentWindow || D.contentDocument).document;
  }

  setInputs(){
    this.input = this.getDocument().querySelectorAll('[wm-inpt]')
  }

  inputDatasTrilhas(){
    this.setInputs()
    this.input.forEach(ipt =>{
      console.log(ipt.getAttribute('wm-inpt'))
    })
    console.log(this.getDocument())
  }
}

class CreateElements{
  constructor(xml){
    this.frame=document.querySelector('[wm-frame=trilhas]')
    this.framDoc = (this.frame.contentWindow || this.frame.contentDocument).document
    this.ExtractXml = new ExtractXml(xml)
    this.divs = this.createDivs()
    this.submitDivsTIER_ID()
    this.createInputs()
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
       for (const i of v.getElementsByTagName('ANNOTATION_VALUE')) {
        this.framDoc.querySelector(`[wm-input=${v.getAttribute('TIER_ID')}]`).innerHTML +=`<input value="${i.innerHTML}" type="text">`
       }
    })
    //console.log(elements.join('\n'))
    return elements.join('\n')
  }



}