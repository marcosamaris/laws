/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/openProject.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/openProject.js":
/*!****************************!*\
  !*** ./src/openProject.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline'\n\n\n  window.function_open_project = function function_open_project(){ \n    var file = document.getElementById('open_here');\n    var reader = new FileReader();\n    reader.onloadend = function() {\n      if(file.files.length == 1){\n        document.querySelector('[wm-frame=trilhas]').scrollIntoView();\n        getXmlFile(reader.result, (xml)=> {\n          //new ExtractXml(xml);\n          new CreateElements(xml)\n        })      \n      }\n    }\n    reader.readAsDataURL(file.files[0])\n  }\n  \n\n  \n\nfunction getXmlFile(path, callback) {\n  let request = new XMLHttpRequest();\n  \n  request.open(\"GET\", path);\n  request.setRequestHeader(\"Content-Type\", \"text/xml\");\n  request.onreadystatechange = function(){\n    if(request.readyState == 4 && request.status ===200){\n      callback(request.responseXML);\n    }\n  };\n  request.send();\n}\n\nclass ExtractXml{\n  constructor(xml){\n    this.xml = xml\n    this.object = {}\n    this.extractDatasOfXML();\n  }\n  \n  extractMedia() {return this.xml.getElementsByTagName(\"MEDIA_DESCRIPTOR\");}\n  \n  extractURL (line) { return  line.getAttribute('MEDIA_URL').replace(\"file://\", \"\"); }\n  \n  extractDescriptor  (line) { return line.getAttribute('RELATIVE_MEDIA_URL').replace(\"./\", \"\");}\n  \n  extractTimeAttributes  ()  {\n    let time_slot_id = [], time_value = [];\n    for (const i of this.xml.getElementsByTagName(\"TIME_SLOT\")) {\n      time_slot_id.push(i.getAttribute('TIME_SLOT_ID'))\n      time_value.push(i.getAttribute('TIME_VALUE'))              \n    }\n    this.object['time_slot_id'] = time_slot_id;\n    this.object['time_value'] = time_value;\n  }\n  \n  isAudio(line){ return line.getAttribute('MIME_TYPE').search(\"audio\") != -1;}\n  \n  isVideo(line){ return line.getAttribute('MIME_TYPE').search(\"video\") != -1;}\n  \n  extractTierPhrases  () {\n    let phrases = []\n    for(const i of this.xml.getElementsByTagName('TIER')){\n      if(i.getAttribute('LINGUISTIC_TYPE_REF'))\n        phrases.push(i)\n    }\n    this.object['phrases'] = phrases\n  }\n  \n  extractTIER_ID(){\n    let array=[]\n    for (const i of this.xml.getElementsByTagName('TIER')) {\n      array.push(i.getAttribute('TIER_ID'))\n    }\n    this.object['TIER_ID'] = array;\n  }\n\n  extractDatasOfXML(){\n    for (const element of this.extractMedia()){\n      if(this.isVideo(element)){\n        this.object['urlVideo'] = this.extractURL(element)\n        this.object['media_url_video'] = this.extractDescriptor(element)\n      }\n      if(this.isAudio(element)){\n        this.object['urlAudio'] = this.extractURL(element)\n        this.object['media_url_audio'] = this.extractDescriptor(element)\n    }\n  }\n  \n  this.extractTimeAttributes();\n  this.extractTierPhrases();\n  this.extractTIER_ID()\n  console.log(this.object)\n  \n}\n\n}\n\nclass CreateElements{\n  constructor(xml){\n    this.frame=document.querySelector('[wm-frame=trilhas]')\n    \n    console.log(this.frame)\n    this.framDoc = (this.frame.contentWindow || this.frame.contentDocument).document\n    this.ExtractXml = new ExtractXml(xml)\n    this.divs = this.createDivs()\n    this.submitDivsTIER_ID()\n    this.createInputs()\n    this.adjustInputs()\n    this.loadMedia()\n  }\n  \n  createDivs(){\n    let  elements  = [\"\"]\n    for (const item of this.ExtractXml.object['TIER_ID']) {\n      elements.push(`<div wm-input=${String(item)} type=\"text\"></div>\\n`)\n    }\n    return elements.join(\"\");\n  }\n\n  submitDivsTIER_ID(){\n    const D = this.framDoc.querySelector('[wm-div]')\n    D.innerHTML = this.divs\n  }\n  \n  \n  createInputs(){\n    let elements = [\"\"]\n    this.ExtractXml.object['phrases'].forEach(v => {\n      for (const i of v.getElementsByTagName('ANNOTATION')) {\n        let firstElement = i.firstElementChild;\n        let divSelected = this.framDoc.querySelector(`[wm-input=${v.getAttribute('TIER_ID')}]`);\n        divSelected.innerHTML +=`<li><input value=\"${firstElement.firstElementChild.innerHTML}\"\n        ${firstElement.getAttribute('ANNOTATION_ID')  != null ? (\"wm-annotation-id=\"+firstElement.getAttribute('ANNOTATION_ID')) : \"\"}\n        ${firstElement.getAttribute('ANNOTATION_REF') != null ? (\"wm-annotation-ref=\"+firstElement.getAttribute('ANNOTATION_REF')) : \"\"}\n        ${firstElement.getAttribute('PREVIOUS_ANNOTATION') != null ? (\"wm-annotation-previous=\"+firstElement.getAttribute('PREVIOUS_ANNOTATION')) : \"\"} type=\"text\"\n        onkeypress=\"this.style.width = ((this.value.length + 1) * 8) + 'px';\"></li>`\n      }\n    })\n    //console.log(elements.join('\\n'))\n    return elements.join('\\n')\n  }\n  \n  adjustInputs(){\n    this.framDoc.querySelectorAll('input').forEach(input =>{\n      input.style.width = (input.value.length + 1)*8 + 'px';\n    })\n  }\n    \n  loadMedia(){\n    \n    var wmframeondas = document.querySelector('[wm-frame=controls]')\n    var video = (wmframeondas.contentWindow || wmframeondas.contentDocument).document.querySelector('#video')\n    var path = String(this.ExtractXml.object['urlVideo'])//.replace(\"/home/kalebe/Projects/laws/dist\", \"\");\n    video.src = path;\n    console.log(video)\n    video.play();\n        \n  }\n    }\n    \n\n//# sourceURL=webpack:///./src/openProject.js?");

/***/ })

/******/ });