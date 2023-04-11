import React, { useState } from 'react'

export const LangContext = React.createContext();

function Lang(props) {

  const [LangEsData, setLangEsData] = useState({
    langName: 'LangEsData',
    changeLang: 'Cambiar idioma',
    title: "Hola! Veamos si eres capaz de pronunciar perfectamente el texto que se muestra arriba! Clica 'Empezar', 'GRABAR'y empieza a hablar.",
    changeBtnPreGame: 'Comenzar',
    changeBtnGame: 'Cambiar texto',
    checkBtn: 'Comprobar',
    recBtn: 'GRABAR',
    stopBtn: 'DETENER'
  });

  const [LangEnData, setLangEnData] = useState({
    langName: 'LangEnData',
    changeLang: 'Change language',
    title: "Welcome! Let me see if you can pronounce correctly the same text! Click 'start', 'rec' and start talking.",
    changeBtnPreGame: 'Start',
    changeBtnGame: 'Change text',
    checkBtn: 'Check',
    recBtn: 'REC',
    stopBtn: 'STOP'
  });

  return (
    <>
    <LangContext.Provider value={{LangEsData, LangEnData}}>
      {props.children}
    </LangContext.Provider>
    </>
  )
}

export default Lang