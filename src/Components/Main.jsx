import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Hero from './Hero';
import Calculator from './Calculator';
import '../Style/Main.css';

function QuizModal({ onClose, onComplete }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="quiz-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="quiz-modal">
                <button className="quiz-modal__close" onClick={onClose}>✕</button>
                <Calculator onComplete={onComplete} />
            </div>
        </div>
    );
}

export default function Main() {
    const navigate = useNavigate();
    const [quizOpen, setQuizOpen] = useState(false);
    const [hasPlan, setHasPlan] = useState(() => {
        try { return !!JSON.parse(sessionStorage.getItem('calcData') || 'null'); }
        catch { return false; }
    });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('open') === 'quiz') setQuizOpen(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = quizOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [quizOpen]);

    const handleComplete = (data) => {
        sessionStorage.setItem('calcData', JSON.stringify(data));
        sessionStorage.removeItem('calcDataTemp');
        sessionStorage.removeItem('calcErrors');
        sessionStorage.removeItem('calcStep');
        setHasPlan(true);
        setQuizOpen(false);
        navigate('/meals');
    };

    return (
        <div className="main-root">
            <main className="main-content">

                <Hero key={String(hasPlan)} onStartQuiz={() => setQuizOpen(true)} />
            </main>
            {quizOpen && (
                <QuizModal
                    onClose={() => setQuizOpen(false)}
                    onComplete={handleComplete}
                />
            )}
        </div>
    );
}