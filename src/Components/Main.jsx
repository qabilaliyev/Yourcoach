import React from 'react'
import { useNavigate } from 'react-router-dom'
import Calculator from './Calculator'
import "../Style/Calculator.css"
import "../Style/Main.css"

function Main() {
    const navigate = useNavigate();

    const handleComplete = (data) => {
        sessionStorage.setItem('calcData', JSON.stringify(data));
        navigate('/meals');
    };

    return (
        <main>
            <div className="main-cal">
                <Calculator onComplete={handleComplete} />
            </div>
        </main>
    );
}

export default Main