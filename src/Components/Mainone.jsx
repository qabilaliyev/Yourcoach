import React, { useState } from 'react'
import heroimg from '../Images/ooXtd.jpg';
import introimgone from '../Images/Lu9Gu.jpg';
import introimgtwo from '../Images/0KcNA.jpg';
import introimgthre from '../Images/tvYyc.jpg';

import '../Style/Mainone.css'

function Mainone() {
    const clienstimg = [
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2024/06/male-body-transformation-london-1.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2024/06/male-body-transformation-london-3.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2024/05/female-body-transformation.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2024/05/body-transformation-female.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2025/01/male-body-transformation-london-2.jpg?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2024/06/female-body-transformation-london.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2025/04/male-body-transformation-london-1.webp?fit=1000%2C700&ssl=1",
        "https://i0.wp.com/thecutgym.com/wp-content/uploads/2025/06/female-body-transformation-london-2-1.webp?fit=1000%2C700&ssl=1"
    ];

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
                    <img src={heroimg} alt="" />
                </div>
            </section>
            <div className="features-intro">
                <section className='features-intro-text'>
                    <h1><i class='fa-solid fa-heart-pulse'></i></h1>
                    <h1>What we have in store for you</h1>
                </section>
            </div>
            <div className="features">
                <div className="features-box">
                    <div className="features-img">
                        <img src={introimgone} alt="" />
                    </div>
                    <section className='features-text'>
                        <div className="features-text-one">
                            <h1>Yourcoach creates a personalized nutrition and workout plan for you</h1>
                        </div>
                        <div className="features-text-two">
                            <p>Understand your body. Build your plan.
                                Yourcoach analyzes your body, calculates your BMR, and automatically generates a personalized diet and workout program based on your goals</p>
                        </div>
                    </section>
                </div>
                <div className="features-box">
                    <section className='features-text'>
                        <div className="features-text-one">
                            <h1>Yourcoach analyzes your body and automatically builds a plan that fits you</h1>
                        </div>
                        <div className="features-text-two">
                            <p>No more guessing — only accurate results.
                                Based on your data, Yourcoach calculates your calorie needs and provides the most effective plan tailored to you</p>
                        </div>
                    </section>
                    <div className="features-img">
                        <img src={introimgtwo} alt="" />
                    </div>
                </div>
                <div className="features-box">
                    <div className="features-img">
                        <img src={introimgthre} alt="" />
                    </div>
                    <section className='features-text'>
                        <div className="features-text-one">
                            <h1>BMR, diet, and workouts — all in one platform, just for you.</h1>
                        </div>
                        <div className="features-text-two">
                            <p>Your goal, powered by smart technology.
                                Yourcoach analyzes your body, builds your diet and workout plan, and guides you step by step toward results</p>
                        </div>
                    </section>
                </div>
            </div>
            <div className="clients-text">
                <section className='clients-text-box'>
                    <h1>If we can do it, so can you!</h1>
                </section>
            </div>
            <div className="clients">
                <div className="clients-box">
                    <div className="clients-img-box">
                        {
                            clienstimg.map((element, index) => (
                                <div key={index} className="clients-img-card">
                                    <img src={element} alt="" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="cta-section">
                <div className="cta-section-box">
                    <div className="cta-login-section">
                        <input type="text" placeholder='Name' />
                        <input type="text" placeholder=' Last Name' />
                        <input type="Number" placeholder='Age' />
                        <button>Get Started Now<i class='fas fa-arrow-right'></i></button>
                    </div>
                    <div className="cta-section-text-box">
                        <section className='cta-section-text'>
                            <h1>Start now. Change your life.</h1>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mainone