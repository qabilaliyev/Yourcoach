import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { GlobalContext } from './Globalstate'
import IntroScreen from './IntroScreen'
import Main from './Components/Main'
import MealsPage from './Components/MealsPage'
import ResultPage from './Components/ResultPage'

function App() {
  const { cal } = useContext(GlobalContext);

  return (
    <div className="contanier">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={cal === "calculator" ? <Navigate to="/calculator" /> : <IntroScreen />} />
          <Route path="/calculator" element={<Main />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App