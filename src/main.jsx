// import React, { useContext } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.scss';
import LangContext from './context/Lang';

ReactDOM.createRoot(document.getElementById('root')).render(
    <LangContext>
        <App />
    </LangContext>
)
