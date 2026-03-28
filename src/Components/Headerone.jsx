import React from 'react'
import '../Style/Headerone.css'
function Headerone() {
    return (
        <div className="Header-one">
            <div className="header-one-box">
                <div className="header-one-logo">
                    <span id='span-one'>Your<span id='span-two'>Coach</span></span>
                </div>
                <div className="header-one-btn">
                    <button><i class="fa-solid fa-user"></i></button>
                </div>
            </div>
        </div>
    )
}

export default Headerone