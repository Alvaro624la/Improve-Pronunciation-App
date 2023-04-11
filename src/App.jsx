import { useState, useEffect, useContext } from 'react'
import { BsFillRecordFill, BsStopFill, BsCheckAll, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { HiSpeakerWave, HiLanguage } from "react-icons/hi2";
import esESFlag from "./assets/es-ES-flag.png";
import enUSFlag from "./assets/en-US-flag.png";
import enUKFlag from "./assets/en-UK-flag.png";
import { LangContext } from './context/Lang';

function App() {
  /// CONTEXT - CHANGE PAGE-LANG ///
  const { LangEsData, LangEnData } = useContext(LangContext);
  /// LANG ///
  const [selectContextLang, setSelectContextLang] = useState(JSON.parse(window.localStorage.getItem('selectContextLang')) || LangEnData);
  
  const [generalLang, setGeneralLang] = useState(window.localStorage.getItem('generalLang') || 'en-US'); // --- 'en-US' [4] --- 'es-ES' [0, 1, 2 o 7] --- 'en-UK' [5 o 6] --- 
  const [generalVoice, setGeneralVoice] = useState(window.localStorage.getItem('generalVoice') || 4);
  const [urlEndpoint, setUrlEndpoint] = useState(window.localStorage.getItem('urlEndpoint') || 'en');
  const [btnNewTextContent, setBtnNewTextContent] = useState(selectContextLang.changeBtnPreGame);

  /// CSS ///
  const [langSelectorCSS, setLangSelectorCSS] = useState('app__lang-selector lang-selector-hidden');
  const [visibilityListenBtn, setVisibilityListenBtn] = useState('hidden');
  const [visibilityCheckBtn, setVisibilityCheckBtn] = useState('hidden');
  const [visibilityRecStopBtn, setVisibilityRecStopBtn] = useState('hidden');
  ///////////////////// API - TEXTOS ALEATORIOS /////////////////////
  const [data, setData] = useState();
  const [readingTitle, setReadingTitle] = useState(selectContextLang.title);
  const [readingText, setReadingText] = useState();
  const [dataIndex, setDataIndex] = useState();

    useEffect(()=>{
      try{
        const url = `https://my-json-server.typicode.com/Alvaro624la/API-Generador-textos-ES-EN/${urlEndpoint}`; // endpoints: 'es' & 'en'
        const getData = async() => {
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          window.localStorage.getItem('dataIndex') === null ? setDataIndex(Math.round(Math.random()*10)) : setDataIndex(Number(window.localStorage.getItem('dataIndex')))
        }
        getData();
      } catch {error => console.warn(`Error. Failed to fetch DailyPhoto. --> ${error}`)}
    },[urlEndpoint]);

  const changeText = () => {
    console.log(selectContextLang);
    setBtnNewTextContent(selectContextLang.changeBtnGame);
    setReadingTitle(data[dataIndex].title);
    setReadingText(data[dataIndex].text);
    dataIndex > data.length - 2 ? setDataIndex(0) : setDataIndex(dataIndex + 1);
    window.localStorage.setItem('dataIndex', dataIndex);
    setTranscript('');
    setVisibilityCheckBtn('hidden');
    setVisibilityRecStopBtn('visible');
  }

  ///////////////////// API - SpeechSynthesis /////////////////////
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(readingText);
  utterThis.lang = generalLang;
  const voices = speechSynthesis.getVoices();
  utterThis.voice = voices[generalVoice];

  ///////////////////// HOOK - SpeechRecognition /////////////////////
  const [transcript, setTranscript] = useState('');

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionVoice = new recognition()
  recognitionVoice.lang = {generalLang};
  recognitionVoice.continuous = true;

  const rec = () => {
    setTranscript('');
    recognitionVoice.start();
    console.log('recording');
    setVisibilityCheckBtn('hidden');
  };
  const stopRec = () => {
    recognitionVoice.stop();
    console.log('recording stopped');
  }
  recognitionVoice.onresult = (e)=>{
    setVisibilityCheckBtn('visible');
    const arrTranscripts = [];
    for(let i = 0; i < e.results.length; i++){
      arrTranscripts.push(e.results[i][0].transcript);
    }
    setTranscript(arrTranscripts.join(''))
  };

  const check = () => {
    setVisibilityRecStopBtn('hidden');
    setVisibilityCheckBtn('hidden');
    let arrCoincidentes = [];
    let arrNoCoincidentes = [];

    const textA = readingText.toLowerCase().split(/\W/g).join('-').replace(/\-+/g, ' ').split(' ');
    const textB = transcript.toLowerCase().split(' ');
    textA.map((e, i)=>{
      if(i < textB.length){
        textB.includes(e) ? arrCoincidentes.push(e) : arrNoCoincidentes.push(` ${e}`);
      }
    });
    if(arrNoCoincidentes.length === 0){
      setReadingText(`Well done. You said this correctly: ${arrCoincidentes} `);
    } else setReadingText(`You mistaken this words:${arrNoCoincidentes}`);
  }

  ///////////////////// CHANGE LANGUAGE /////////////////////
  const changeLangES = () => {
    setSelectContextLang(LangEsData);
    setLangSelectorCSS('app__lang-selector lang-selector-hidden');
    setReadingTitle(data[0].title);
    setReadingText(data[0].text);
    setGeneralLang('es-ES');
    setGeneralVoice(0);
    setUrlEndpoint('es');
    window.localStorage.setItem('generalLang', generalLang);
    window.localStorage.setItem('generalVoice', generalVoice);
    window.localStorage.setItem('urlEndpoint', urlEndpoint);
    window.localStorage.setItem('selectContextLang', JSON.stringify(selectContextLang));
  }
  const changeLangUS = () => {
    setSelectContextLang(LangEnData);
    setLangSelectorCSS('app__lang-selector lang-selector-hidden');
    setReadingTitle(data[0].title);
    setReadingText(data[0].text);
    setGeneralLang('en-US');
    setGeneralVoice(4);
    setUrlEndpoint('en');
    window.localStorage.setItem('generalLang', generalLang);
    window.localStorage.setItem('generalVoice', generalVoice);
    window.localStorage.setItem('urlEndpoint', urlEndpoint);
    window.localStorage.setItem('selectContextLang', JSON.stringify(selectContextLang));
  }
  const changeLangUK = () => {
    setSelectContextLang(LangEnData);
    setLangSelectorCSS('app__lang-selector lang-selector-hidden');
    setReadingTitle(data[0].title);
    setReadingText(data[0].text);
    setGeneralLang('en-UK');
    setGeneralVoice(5);
    setUrlEndpoint('en');
    window.localStorage.setItem('generalLang', generalLang);
    window.localStorage.setItem('generalVoice', generalVoice);
    window.localStorage.setItem('urlEndpoint', urlEndpoint);
    window.localStorage.setItem('selectContextLang', JSON.stringify(selectContextLang));
  }
  
  return (
    <>
    <div className="app">
      <button onClick={()=>langSelectorCSS === 'app__lang-selector' ? setLangSelectorCSS('app__lang-selector lang-selector-hidden') : setLangSelectorCSS('app__lang-selector')} className='app__btn-change-lang'><HiLanguage/>{selectContextLang.changeLang}</button>
      <ul className={langSelectorCSS}>
        <li onClick={changeLangES}>
          <img src={esESFlag}/>
          <h4>Español (ES)</h4>
        </li>
        <li onClick={changeLangUS}>
          <img src={enUSFlag}/>
          <h4>English (US)</h4>
        </li>
        <li onClick={changeLangUK}>
          <img src={enUKFlag}/>
          <h4>English (UK)</h4>
        </li>
      </ul>      
      <div className="app__textsAB-cont">
        <div className="app__textsAB-cont__textA-cont">
          <h3 className="app__textsAB-cont__textA-cont__title">{readingTitle}</h3>
          <textarea className="app__textsAB-cont__textA-cont__readingText" value={readingText} readOnly/>
          <div className="app__textsAB-cont__textA-cont__api-listen-btns-cont">
            <HiSpeakerWave className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" onClick={()=>{
              synth.speak(utterThis);
              setVisibilityListenBtn('visible');
              }}/>
            <BsFillPlayFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" style={{visibility: visibilityListenBtn}} onClick={()=>synth.resume(utterThis)}/>
            <BsFillPauseFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" style={{visibility: visibilityListenBtn}} onClick={()=>synth.pause(utterThis)}/>
            <BsStopFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" style={{visibility: visibilityListenBtn}} onClick={()=>{
              synth.cancel(utterThis);
              setVisibilityListenBtn('hidden');
              }}/>
          </div>
        </div>
        <div className="app__textsAB-cont__textB-cont">
          <textarea className="app__textsAB-cont__textB-cont__transcript" value={transcript} readOnly/>
        </div>
      </div>
      <div className="app__btns-cont">
        <button className="app__btns-cont__btn-check" onClick={check} style={{visibility: visibilityCheckBtn}}>{selectContextLang.checkBtn}<BsCheckAll/></button>
        <button className="app__btns-cont__btn-change" onClick={changeText}>{btnNewTextContent}</button>
        <div className="app__btns-cont__rec-stop">
          <button className="app__btns-cont__rec-stop__btn-rec" onClick={rec} style={{visibility: visibilityRecStopBtn}}>{selectContextLang.recBtn}<BsFillRecordFill/></button>
          <button className="app__btns-cont__rec-stop__btn-stop" onClick={stopRec} style={{visibility: visibilityRecStopBtn}}>{selectContextLang.stopBtn}<BsStopFill/></button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App

////// tareas: 
//porque tengo que clicar 2 veces
// mostrar esas diferencias desde la coincidencia true hasta la siguiente true (rodeada por trues, sacará las palabras o frase mala)
//posibilidad de editar tu texto hablado, antes de analizar? o mejor aún, al analizar las coincidentes, si hay dos coincidentes seguidas pero en medio hay una que no, por ejemplo "today morning" "today was morning", ese was se coló por un fallo sin querer que no tiene sentido. Pues la posibilidad de eliminarlo el "was" solamente y luego ya volver a porder analizar todo.


// 1a coincidencia --> coge su indice y aplicalo al arr ReadingText, y aumentando es indice, la siguiente palabra conicide? si, aumenta el indice y pasa a la siguiente, no coincide? sigue con buscando esa palabra subiendo el indice en ReadingText hasta el final, no coincie, pasa a la siguiente...algo así nose


//idea mejora loca:
// primera palabra del arr 'ReadingText'
// busca coincidencia
// coge su indice (ej: index: 6)
// arrCoincidentes.push(coincidencia)
// busca conicidencias en index++
// ........