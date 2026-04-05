import React, { useContext } from 'react';
import '../Style/Headerone.css';
import { GlobalContext } from '../Globalstate';

function Headerone() {
    const { cal, setCal } = useContext(GlobalContext);
    return (
        <div className="Header-one">
            <div className="header-one-box">
                <div className="header-one-logo">
                    <span id='span-one'>Your<span id='span-two'>Coach</span></span>
                </div>
                <div className="header-one-btn">
                    <button onClick={() => { setCal("calculator") }}>
                        <i className='fa-solid fa-user'></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Headerone;