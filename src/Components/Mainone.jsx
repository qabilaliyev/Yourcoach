import React, { useEffect, useState, useContext } from 'react'
import heroimg from '../Images/ooXtd.jpg';
import introimgone from '../Images/Lu9Gu.jpg';
import introimgtwo from '../Images/0KcNA.jpg';
import introimgthre from '../Images/tvYyc.jpg';
import { GlobalContext } from '../Globalstate';
import ClientsSlider from './ClientsSlider';
import '../Style/ClientsSlider.css';

import '../Style/Mainone.css'

function Mainone() {
    const { cal, setCal } = useContext(GlobalContext);


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
                        <a onClick={() => { setCal("calculator") }} href='#'>START NOW<i className='fas fa-arrow-right'></i></a>
                    </div>
                </section>
                <div className='hero-section-img'>
                    <img src={heroimg} alt="" />
                </div>
            </section>
            <div className="features-intro">
                <section className='features-intro-text'>
                    <h1><i className='fa-solid fa-heart-pulse'></i></h1>
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
            < ClientsSlider />
        </div>
    )
}

export default Mainone