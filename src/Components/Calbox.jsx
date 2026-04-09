import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Calculator from './Calculator'
import "../Style/Calbox.css"


export function Hero({ onStartQuiz }) {
    return (
        <section className="cal-hero">
            <div className="cal-hero__inner">
                <div className="cal-hero__badge">
                    <span className="hc-dot" /> Health Calculator
                </div>

                <h1 className="cal-hero__title">
                    A healthy life<br /><em>starts here.</em>
                </h1>

                <p className="cal-hero__sub">
                    Calculate your BMI, daily calorie needs, and get personalized recommendations in minutes.
                </p>

                <div className="cal-hero__actions">
                    <button className="cal-hero__btn-primary" onClick={onStartQuiz}>
                        Start My Plan
                    </button>
                    <button className="cal-hero__btn-ghost">Learn More</button>
                </div>

                <div className="cal-hero__pills" id="features">
                    {["BMI Calculator", "Calorie Needs", "Nutrition Analysis", "Personal Tips"].map((f) => (
                        <div className="hc-feature-pill" key={f}>{f}</div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function QuizModal({ onClose }) {
    const navigate = useNavigate()

    const handleComplete = (data) => {
        sessionStorage.setItem('calcData', JSON.stringify(data))
        sessionStorage.removeItem("calcDataTemp")
        sessionStorage.removeItem("calcErrors")
        navigate('/meals')
    }

    return (
        <div
            className="cal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="cal-modal">
                <button
                    className="cal-modal__close"
                    onClick={onClose}
                >
                    ✕
                </button>

                <Calculator onComplete={handleComplete} />
            </div>
        </div>
    )
}

export default function CalBox() {
    const [open, setOpen] = useState(false)

    return (
        <div className="cal-root">
            <Hero onStartQuiz={() => setOpen(true)} />

            {open && <QuizModal onClose={() => setOpen(false)} />}
        </div>
    )
}