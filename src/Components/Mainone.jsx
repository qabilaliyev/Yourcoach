import React, { useEffect, useState, useContext } from 'react'
import heroimg from '../Images/ooXtd.jpg';
import introimgone from '../Images/Lu9Gu.jpg';
import introimgtwo from '../Images/0KcNA.jpg';
import introimgthre from '../Images/tvYyc.jpg';
import { GlobalContext } from '../Globalstate';

import '../Style/Mainone.css'

function Mainone() {
    const { cal, setCal } = useContext(GlobalContext);

    const clients = [
        {
            img: "https://assets.mynetdiary.com/images/success-story-julie@1x.png",
            name: "Julie Martel",
            result: "I lost 71 lb (35%) and kept it off for 492 days",
            quote: "My life has changed. My life is beautiful! And I am beautiful too!!!"
        },
        {
            img: "https://assets.mynetdiary.com/images/success-matthew-warner@1x.png",
            name: "Matthew Warner",
            result: "I lost 99 lb (41%) and kept it off for 430 days",
            quote: "My confidence is back. I feel stronger every day! This journey changed me!!!"
        },
        {
            img: "https://assets.mynetdiary.com/images/success-rick-white@1x.png",
            name: "Rick White",
            result: "I lost 88 lb (40%) and kept it off for 410 days",
            quote: "I got my health back. I feel alive again! Best decision ever!!!"
        },
        {
            img: "https://assets.mynetdiary.com/images/success-story-joe@1x.png",
            name: "Joe Carter",
            result: "I lost 110 lb (48%) and kept it off for 520 days",
            quote: "I have endless energy now. My life is totally different! I feel amazing!!!"
        },
        {
            img: "https://assets.mynetdiary.com/images/success-paul-reynolds@1x.png",
            name: "Paul Reynolds",
            result: "I lost 121 lb (50%) and kept it off for 600 days",
            quote: "I never thought this was possible. Now I live my best life! I am proud of myself!!!"
        },
        {
            img: "https://assets.mynetdiary.com/images/success-story-carrie@1x.png",
            name: "Carrie Johnson",
            result: "I lost 77 lb (36%) and kept it off for 390 days",
            quote: "I love myself again. I feel confident and happy! This changed everything!!!"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % clients.length)
        }, 3000)



        return () => clearInterval(interval)
    }, [])


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
            <div className="clients">
                <div className="clients-box">
                    <div className="clients-card-box">
                        <div className="clients-img-box">
                            <img src={clients[currentIndex].img} alt="" />
                        </div>
                        <div className="clients-text-box">
                            <h1>{clients[currentIndex].name}</h1>
                            <span>{clients[currentIndex].result}</span>
                            <p>{clients[currentIndex].quote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mainone