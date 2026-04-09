import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import MealsPage from './components/MealsPage';
import ResultPage from './components/ResultPage';
import Calculator from './components/Calculator';

function PageLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

function CalculatorRoute() {
  const navigate = useNavigate();

  const handleComplete = (data) => {
    sessionStorage.setItem('calcData', JSON.stringify(data));
    sessionStorage.removeItem('calcDataTemp');
    sessionStorage.removeItem('calcErrors');
    sessionStorage.removeItem('calcStep');
    navigate('/meals');
  };

  return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
        <Calculator onComplete={handleComplete} />
      </div>
    </PageLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<CalculatorRoute />} />
        <Route path="/meals" element={<PageLayout><MealsPage /></PageLayout>} />
        <Route path="/result" element={<PageLayout><ResultPage /></PageLayout>} />
      </Routes>
    </BrowserRouter>
  );
}