import React from 'react'
import Headerone from './Components/Headerone'
import './App.css'
import Mainone from './Components/Mainone'
import { GlobalProvider } from './Globalstate'
import IntroScreen from './IntroScreen'

function App() {
  return (
    < GlobalProvider>
      <div className="contanier">
        < IntroScreen />
      </div>
    </GlobalProvider>
  )
}

export default App