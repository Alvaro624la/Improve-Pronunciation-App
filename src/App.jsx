import { useState, useEffect } from 'react'
import { BsFillRecordFill, BsStopFill, BsCheckAll, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";
import './App.scss'

function App() {
  
  const [generalLanguage, setGeneralLanguage] = useState('en-US');
  const [urlEndpoint, setUrlEndpoint] = useState('/en');
  const [btnNewTextContent, setBtnNewTextContent] = useState('Start');
  ///////////////////// API - TEXTOS ALEATORIOS /////////////////////
  const [data, setData] = useState();
  const [readingTitle, setReadingTitle] = useState("Welcome! Let me see if you can pronounce correctly the same text! Click 'start', 'rec' and start talking.");
  const [readingText, setReadingText] = useState();
  const [dataIndex, setDataIndex] = useState();

  useEffect(()=>{
    try{
      const url = `https://my-json-server.typicode.com/Alvaro624la/API-Generador-textos-ES-EN/${urlEndpoint}`; // endpoints: '/es' & '/en'
      const getData = async() => {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
        localStorage.getItem('dataIndex') === null ? setDataIndex(Math.round(Math.random()*10)) : setDataIndex(Number(localStorage.getItem('dataIndex')))
      }
      getData();
    } catch {error => console.warn(`Error. Failed to fetch DailyPhoto. --> ${error}`)}
  },[]);
  // console.warn(data);

  const changeText = () => {
    // console.log(dataIndex);
    setBtnNewTextContent('Change text');
    setReadingTitle(data[dataIndex].title);
    setReadingText(data[dataIndex].text);
    dataIndex > data.length - 2 ? setDataIndex(0) : setDataIndex(dataIndex + 1);
    localStorage.setItem('dataIndex', dataIndex);
    setTranscript('');
  }

  ///////////////////// API - SpeechSynthesis /////////////////////
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(readingText);
  utterThis.lang = generalLanguage;
  const voices = speechSynthesis.getVoices();
  // console.log(voices);

  ///////////////////// HOOK - SpeechRecognition /////////////////////
  const [transcript, setTranscript] = useState('');

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionVoice = new recognition()
  recognitionVoice.lang = {generalLanguage};
  recognitionVoice.continuous = true;

  const rec = () => {
    setTranscript('');
    recognitionVoice.start();
    console.log('recording');
  };
  const stopRec = () => {
    recognitionVoice.stop();
    console.log('recording stopped');
  }
  recognitionVoice.onresult = (e)=>{
    const arrTranscripts = [];
    for(let i = 0; i < e.results.length; i++){
      arrTranscripts.push(e.results[i][0].transcript);
    }
    setTranscript(arrTranscripts.join(''))
  };

  const check = () => {
    let arrCoincidentes = [];
    let arrNoCoincidentes = [];
    const textA = readingText.toLowerCase().split(/\W/g).join('-').replace(/\-+/g, ' ').split(' ');
    const textB = transcript.toLowerCase().split(' ');
    console.log(textA);
    console.log(textB);
    // v1
    // for(let i = 0; i < textB.length; i++){
      // textA[i] === textB[i] ? arrCoincidentes.push(textB[i]) : arrNoCoincidentes.push(textB[i]);
    //v2
      // textA.includes(`${textB[i]} `) ? arrCoincidentes.push(textA[i]) : arrNoCoincidentes.push(textB[i]);
    // }
    //v3
    textB.map((e, i)=>{
      textA.includes(e) ? arrCoincidentes.push(textA[i]) : arrNoCoincidentes.push(` ${textA[i]}`);
    });
    console.warn(arrCoincidentes);
    console.warn(arrNoCoincidentes);
    if(arrNoCoincidentes.length === 0){
      setReadingText(`You mistaken all the words. 'Repeat' and try again.`);
      setBtnNewTextContent('Repeat');
    } else setReadingText(`You mistaken this words:${arrNoCoincidentes}`);
  }


  return (
    <>
    <div className="app">
      <div className="app__textsAB-cont">
        <div className="app__textsAB-cont__textA-cont">
          <h3 className="app__textsAB-cont__textA-cont__title">{readingTitle}</h3>
          <textarea className="app__textsAB-cont__textA-cont__readingText" value={readingText} readOnly/>
          <div className="app__textsAB-cont__textA-cont__api-listen-btns-cont">
            <HiSpeakerWave className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" onClick={()=>synth.speak(utterThis)}/>
            <BsFillPlayFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" onClick={()=>synth.resume(utterThis)}/>
            <BsFillPauseFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" onClick={()=>synth.pause(utterThis)}/>
            <BsStopFill className="app__textsAB-cont__textA-cont__api-listen-btns-cont__btn" onClick={()=>synth.cancel(utterThis)}/>
          </div>
        </div>
        <div className="app__textsAB-cont__textB-cont">
          <textarea className="app__textsAB-cont__textB-cont__transcript" value={transcript} readOnly/>
        </div>
      </div>
      <div className="app__btns-cont">
        <button className="app__btns-cont__btn-change" onClick={changeText}>{btnNewTextContent}</button>
        <div className="app__btns-cont__rec-stop">
          <button className="app__btns-cont__rec-stop__btn-rec" onClick={rec}>REC<BsFillRecordFill/></button>
          <button className="app__btns-cont__rec-stop__btn-stop" onClick={stopRec}>STOP<BsStopFill/></button>
        </div>
        <button className="app__btns-cont__btn-check" onClick={check}>Check<BsCheckAll/></button>
      </div>
    </div>
    </>
  )
}

export default App

////// tareas: 
// cambiar a español y britanico también
// mostrar esas diferencias desde la coincidencia true hasta la siguiente true (rodeada por trues, sacará las palabras o frase mala)
//posibilidad de editar tu texto hablado, antes de analizar? o mejor aún, al analizar las coincidentes, si hay dos coincidentes seguidas pero en medio hay una que no, por ejemplo "today morning" "today was morning", ese was se coló por un fallo sin querer que no tiene sentido. Pues la posibilidad de eliminarlo el "was" solamente y luego ya volver a porder analizar todo.


// 1a coincidencia --> coge su indice y aplicalo al arr ReadingText, y aumentando es indice, la siguiente palabra conicide? si, aumenta el indice y pasa a la siguiente, no coincide? sigue con buscando esa palabra subiendo el indice en ReadingText hasta el final, no coincie, pasa a la siguiente...algo así nose


// primera palabra del arr 'ReadingText'
// busca coincidencia
// coge su indice (ej: index: 6)
// arrCoincidentes.push(coincidencia)
// busca conicidencias en index++
// ........