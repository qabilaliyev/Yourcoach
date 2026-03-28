import React from 'react'
import Images from '../Images/ooXtd.jpg';
import '../Style/Mainone.css'
function Mainone() {
    return (
        <div className='mainone'>
            <section className='hero-section'>
                <section className='hero-section-text'>
                    <div className="hero-section-text-one">
                        <span>Real change, real tracking</span>
                    </div>
                    <div className="hero-section-text-two">
                        <span>Rack your nutrition in real life</span>
                    </div>
                    <div className="hero-section-btn">
                        <a href='#'>START NOW<i class='fas fa-arrow-right'></i></a>
                    </div>
                </section>
                <div className='hero-section-img'>
                    <img src={Images} alt="" />
                </div>
            </section>
        </div>
    )
}

export default Mainone