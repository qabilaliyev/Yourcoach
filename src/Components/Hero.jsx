import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Hero.css';
import ClientsSlider from './ClientsSlider';

const STATS = [
    { value: '50K+', label: 'Active Users' },
    { value: '92%', label: 'Success Rate' },
    { value: '4.9★', label: 'User Rating' },
    { value: '12+', label: 'Tools' },
];

const FEATURES = [
    { icon: '⚡', title: 'BMI Calculator', desc: 'Instant body mass index with personalized health range analysis.', color: 'feat--blue' },
    { icon: '🔥', title: 'Calorie Needs', desc: 'TDEE calculation based on your activity level and fitness goals.', color: 'feat--orange' },
    { icon: '🥗', title: 'Meal Planning', desc: 'Weekly diet plans tailored to your goal — lose, gain, or build muscle.', color: 'feat--green' },
    { icon: '📊', title: 'Nutrition Tracking', desc: 'Log your meals and compare against your daily macro targets.', color: 'feat--purple' },
    { icon: '🏋️', title: 'Exercise Guide', desc: 'Goal-specific workout recommendations based on your fitness level.', color: 'feat--teal' },
    { icon: '💧', title: 'Hydration Monitor', desc: 'Smart water intake targets calculated from your body weight.', color: 'feat--cyan' },
];

const PILLS = ['BMI Calculator', 'Calorie Needs', 'Meal Planning', 'Nutrition Analysis', 'Exercise Guide', 'Hydration Tracker'];

const TESTIMONIALS = [
    { name: 'Sarah K.', text: 'Lost 15kg in 3 months — the meal plan was a game changer!', avatar: 'S' },
    { name: 'Mike R.', text: "Best free health tool I've ever used. Simple and accurate.", avatar: 'M' },
    { name: 'Ana L.', text: 'Built 8kg of muscle following the recommended exercise plan.', avatar: 'A' },
];

function FloatingCard({ children, className = '' }) {
    return <div className={`hero-float-card ${className}`}>{children}</div>;
}

export default function Hero({ onStartQuiz }) {
    const navigate = useNavigate();
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [visible, setVisible] = useState(false);

    // calcData varsa start butonlari gizlenir
    const hasPlan = (() => {
        try { return !!JSON.parse(sessionStorage.getItem('calcData') || 'null'); }
        catch { return false; }
    })();

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`hero-root${visible ? ' hero-root--visible' : ''}`}>

            <div className="hero-bg-circle hero-bg-circle--1" />
            <div className="hero-bg-circle hero-bg-circle--2" />
            <div className="hero-bg-grid" />

            <div className="hero-inner">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" />
                        <span>AI-Powered Health Coach</span>
                        <span className="hero-badge-tag">Free</span>
                    </div>

                    <h1 className="hero-title">
                        Your personal
                        <span className="hero-title-highlight"> health plan</span>
                        <br />starts here.
                    </h1>

                    <p className="hero-sub">
                        Calculate your BMI, get personalized calorie targets, weekly meal plans,
                        and workout recommendations — all in under 5 minutes.
                    </p>

                    {/* Plan varsa CTA deyisir, start butonlari gizlenir */}
                    {hasPlan ? (
                        <div className="hero-actions">
                            <button className="hero-btn-primary" onClick={() => navigate('/meals')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                                View My Plan
                            </button>
                            <button className="hero-btn-ghost" onClick={() => navigate('/result')}>
                                See Results
                            </button>
                        </div>
                    ) : (
                        <div className="hero-actions">
                            <button className="hero-btn-primary" onClick={onStartQuiz}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Start My Free Plan
                            </button>
                            <button
                                className="hero-btn-ghost"
                                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                See How It Works
                            </button>
                        </div>
                    )}

                    <div className="hero-trust">
                        <div className="hero-trust-avatars">
                            {['S', 'M', 'A', 'J', 'R'].map((l, i) => (
                                <div key={i} className="hero-trust-avatar" style={{ zIndex: 5 - i }}>{l}</div>
                            ))}
                        </div>
                        <span className="hero-trust-text">
                            <strong>50,000+</strong> people improved their health this month
                        </span>
                    </div>

                    <div className="hero-pills">
                        {PILLS.map(p => <span key={p} className="hero-pill">{p}</span>)}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card-main">
                        <div className="hero-card-header">
                            <div className="hero-card-avatar">YC</div>
                            <div>
                                <div className="hero-card-name">Your Health Profile</div>
                                <div className="hero-card-sub">Personalized Plan Ready</div>
                            </div>
                            <span className="hero-card-badge">Active</span>
                        </div>

                        <div className="hero-card-stats">
                            {[
                                { label: 'BMI', value: '22.4', status: 'Normal', color: '#10b981' },
                                { label: 'TDEE', value: '2,140', status: 'kcal/day', color: '#1E3A8A' },
                                { label: 'Goal', value: 'Lose', status: '-500 kcal', color: '#FF8F00' },
                            ].map(s => (
                                <div className="hero-stat" key={s.label}>
                                    <div className="hero-stat-value" style={{ color: s.color }}>{s.value}</div>
                                    <div className="hero-stat-label">{s.label}</div>
                                    <div className="hero-stat-status">{s.status}</div>
                                </div>
                            ))}
                        </div>

                        <div className="hero-card-progress">
                            <div className="hero-card-progress-label">
                                <span>Weekly Progress</span>
                                <span>68%</span>
                            </div>
                            <div className="hero-card-progress-track">
                                <div className="hero-card-progress-fill" style={{ width: '68%' }} />
                            </div>
                        </div>

                        <div className="hero-card-macros">
                            {[
                                { label: 'Protein', pct: 75, color: '#1E3A8A' },
                                { label: 'Carbs', pct: 55, color: '#FF8F00' },
                                { label: 'Fat', pct: 82, color: '#10b981' },
                            ].map(m => (
                                <div className="hero-macro" key={m.label}>
                                    <div className="hero-macro-ring" style={{ '--pct': m.pct, '--clr': m.color }}>
                                        <span>{m.pct}%</span>
                                    </div>
                                    <div className="hero-macro-label">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FloatingCard className="hero-notif-card">
                        <span className="hero-notif-icon">🎯</span>
                        <div>
                            <div className="hero-notif-title">Goal Reached!</div>
                            <div className="hero-notif-sub">You hit your protein target today</div>
                        </div>
                    </FloatingCard>

                    <FloatingCard className="hero-testimonial-card">
                        <div className="hero-t-avatar">{TESTIMONIALS[activeTestimonial].avatar}</div>
                        <div>
                            <div className="hero-t-text">"{TESTIMONIALS[activeTestimonial].text}"</div>
                            <div className="hero-t-name">— {TESTIMONIALS[activeTestimonial].name}</div>
                        </div>
                    </FloatingCard>

                    <FloatingCard className="hero-streak-card">
                        <div className="hero-streak-icon">🔥</div>
                        <div className="hero-streak-val">14</div>
                        <div className="hero-streak-label">Day Streak</div>
                    </FloatingCard>
                </div>
            </div>

            <div className="hero-stats-bar">
                <div className="hero-stats-inner">
                    {STATS.map((s, i) => (
                        <React.Fragment key={s.label}>
                            <div className="hero-stat-item">
                                <div className="hero-stat-item-value">{s.value}</div>
                                <div className="hero-stat-item-label">{s.label}</div>
                            </div>
                            {i < STATS.length - 1 && <div className="hero-stat-divider" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div id="features-section" className="hero-features">
                <div className="hero-features-inner">
                    <div className="hero-section-badge">Everything You Need</div>
                    <h2 className="hero-features-title">
                        A complete health toolkit,<br />
                        <span style={{ color: '#FF8F00' }}>completely free.</span>
                    </h2>
                    <p className="hero-features-sub">
                        Six powerful tools working together to help you achieve your health goals faster.
                    </p>
                    <div className="hero-feat-grid">
                        {FEATURES.map(f => (
                            <div className={`hero-feat-card ${f.color}`} key={f.title}>
                                <div className="hero-feat-icon">{f.icon}</div>
                                <div className="hero-feat-title">{f.title}</div>
                                <div className="hero-feat-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ClientsSlider />

            {/* CTA section - plan varsa gizlenir */}
            {!hasPlan && (
                <div className="hero-cta-section">
                    <div className="hero-cta-inner">
                        <h2 className="hero-cta-title">Ready to transform your health?</h2>
                        <p className="hero-cta-sub">Join 50,000+ users who improved their fitness with YourCoach</p>
                        <button className="hero-btn-primary hero-btn-cta" onClick={onStartQuiz}>
                            Get Started — It's Free
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="13 17 18 12 13 7" />
                                <polyline points="6 17 11 12 6 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}