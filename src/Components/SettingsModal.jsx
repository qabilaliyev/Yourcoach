import React, { useState, useEffect, useRef } from 'react';

const SETTINGS_KEY = 'yc_settings';

export function loadSettings() {
    try {
        const s = localStorage.getItem(SETTINGS_KEY);
        return s ? JSON.parse(s) : {};
    } catch { return {}; }
}

export function saveSettings(data) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}

function RangeField({ label, value, min, max, unit, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    const gradient = `linear-gradient(to right, var(--primary, #1E3A8A) ${pct}%, #e2e8f0 ${pct}%)`;
    return (
        <div className="sm-field">
            <div className="sm-range-header">
                <label className="sm-label">{label}</label>
                <span className="sm-range-value">{value} <span className="sm-range-unit">{unit}</span></span>
            </div>
            <input
                type="range"
                className="sm-range"
                min={min}
                max={max}
                value={value}
                style={{ background: gradient }}
                onChange={e => onChange(Number(e.target.value))}
            />
            <div className="sm-range-minmax">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}

function PillSelect({ options, value, onChange }) {
    return (
        <div className="sm-pill-group">
            {options.map(([val, label]) => (
                <button
                    key={val}
                    type="button"
                    className={`sm-pill${value === val ? ' sm-pill--active' : ''}`}
                    onClick={() => onChange(val)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default function SettingsModal({ onClose, onSettingsChange }) {
    const overlayRef = useRef(null);

    const calcData = (() => {
        try { return JSON.parse(sessionStorage.getItem('calcData') || 'null'); }
        catch { return null; }
    })();

    const existingSettings = loadSettings();

    // Profile fields - hem settingsdən həm calcData-dan oxu
    const [name, setName] = useState(existingSettings.name || calcData?.name || '');
    const [age, setAge] = useState(existingSettings.age || calcData?.age || '');
    const [gender, setGender] = useState(existingSettings.gender || calcData?.gender || '');
    const [height, setHeight] = useState(existingSettings.height || calcData?.height || 170);
    const [weight, setWeight] = useState(existingSettings.weight || calcData?.weight || 70);

    // Goals
    const [calorieGoal, setCalorieGoal] = useState(existingSettings.calorieGoal || '2000');
    const [goal, setGoal] = useState(existingSettings.goal || calcData?.goal || '');
    const [activity, setActivity] = useState(existingSettings.activity || calcData?.activity || '');

    // Appearance
    const [darkMode, setDarkMode] = useState(existingSettings.darkMode || false);

    const [saved, setSaved] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    const handleSave = () => {
        const settings = { name, age, gender, height, weight, calorieGoal, goal, activity, darkMode };
        saveSettings(settings);

        // calcData-ni da guncelle ki diger sehifelerde duzgun hesablansin
        if (calcData) {
            const updated = { ...calcData, name, age, gender, height, weight, goal, activity };
            sessionStorage.setItem('calcData', JSON.stringify(updated));
        }

        onSettingsChange?.(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleResetAll = () => {
        if (!confirmReset) { setConfirmReset(true); return; }
        sessionStorage.clear();
        localStorage.removeItem(SETTINGS_KEY);
        onSettingsChange?.({});
        onClose();
        window.location.href = '/';
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'body', label: 'Body', icon: '📏' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'appearance', label: 'Display', icon: '🎨' },
        { id: 'data', label: 'Data', icon: '🗄️' },
    ];

    const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : null;
    const bmiStatus = bmi
        ? bmi < 18.5 ? { label: 'Underweight', color: '#3b82f6' }
            : bmi < 25 ? { label: 'Normal', color: '#10b981' }
                : bmi < 30 ? { label: 'Overweight', color: '#f59e0b' }
                    : { label: 'Obese', color: '#ef4444' }
        : null;

    return (
        <div className="sm-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="sm-panel" role="dialog" aria-modal="true" aria-label="Settings">

                {/* Header */}
                <div className="sm-header">
                    <div className="sm-header-left">
                        <div className="sm-header-icon">⚙️</div>
                        <div>
                            <h2 className="sm-title">Settings</h2>
                            <p className="sm-subtitle">Customize your YourCoach experience</p>
                        </div>
                    </div>
                    <button className="sm-close" onClick={onClose} aria-label="Close settings">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="sm-tabs">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={`sm-tab${activeTab === t.id ? ' sm-tab--active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            <span className="sm-tab-icon">{t.icon}</span>
                            <span className="sm-tab-label">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="sm-body">

                    {/* ── PROFILE TAB ── */}
                    {activeTab === 'profile' && (
                        <div className="sm-section">
                            <div className="sm-avatar-row">
                                <div className="sm-avatar-big">
                                    {name ? name[0].toUpperCase() : '?'}
                                </div>
                                <div className="sm-avatar-info">
                                    <div className="sm-avatar-name">{name || 'Your Name'}</div>
                                    <div className="sm-avatar-hint">YourCoach Member</div>
                                </div>
                            </div>

                            <div className="sm-field">
                                <label className="sm-label">Full Name</label>
                                <input
                                    className="sm-input"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                                <span className="sm-field-hint">Used in results and greetings</span>
                            </div>

                            <div className="sm-field-row">
                                <div className="sm-field">
                                    <label className="sm-label">Age</label>
                                    <input
                                        className="sm-input"
                                        type="number"
                                        min="10"
                                        max="100"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        placeholder="25"
                                    />
                                </div>
                                <div className="sm-field">
                                    <label className="sm-label">Gender</label>
                                    <select
                                        className="sm-input sm-select"
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── BODY TAB ── */}
                    {activeTab === 'body' && (
                        <div className="sm-section">
                            {bmi && (
                                <div className="sm-bmi-card">
                                    <div className="sm-bmi-value" style={{ color: bmiStatus.color }}>{bmi}</div>
                                    <div className="sm-bmi-label">BMI</div>
                                    <div className="sm-bmi-status" style={{ color: bmiStatus.color }}>{bmiStatus.label}</div>
                                </div>
                            )}

                            <RangeField
                                label="Height"
                                value={height}
                                min={140}
                                max={220}
                                unit="cm"
                                onChange={setHeight}
                            />

                            <RangeField
                                label="Weight"
                                value={weight}
                                min={30}
                                max={200}
                                unit="kg"
                                onChange={setWeight}
                            />

                            <div className="sm-body-stats">
                                {[
                                    { label: 'Height', value: `${height} cm` },
                                    { label: 'Weight', value: `${weight} kg` },
                                    { label: 'BMI', value: bmi || '—' },
                                ].map(s => (
                                    <div className="sm-body-stat" key={s.label}>
                                        <div className="sm-body-stat-value">{s.value}</div>
                                        <div className="sm-body-stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── GOALS TAB ── */}
                    {activeTab === 'goals' && (
                        <div className="sm-section">
                            <div className="sm-field">
                                <label className="sm-label">Your Goal</label>
                                <PillSelect
                                    options={[
                                        ['lose', '🔥 Lose Weight'],
                                        ['gain', '💪 Gain Weight'],
                                        ['maintain', '⚖️ Maintain'],
                                        ['muscle', '🏋️ Build Muscle'],
                                    ]}
                                    value={goal}
                                    onChange={setGoal}
                                />
                            </div>

                            <div className="sm-field">
                                <label className="sm-label">Activity Level</label>
                                <PillSelect
                                    options={[
                                        ['sedentary', '🛋️ Very Low'],
                                        ['light', '🚶 Light'],
                                        ['moderate', '🏃 Active'],
                                        ['very', '⚡ Very Active'],
                                    ]}
                                    value={activity}
                                    onChange={setActivity}
                                />
                            </div>

                            <div className="sm-field">
                                <label className="sm-label">Daily Calorie Goal</label>
                                <div className="sm-input-unit-wrap">
                                    <input
                                        className="sm-input sm-input--has-unit"
                                        type="number"
                                        min="1000"
                                        max="5000"
                                        value={calorieGoal}
                                        onChange={e => setCalorieGoal(e.target.value)}
                                        placeholder="2000"
                                    />
                                    <span className="sm-input-unit">kcal</span>
                                </div>
                                <span className="sm-field-hint">Recommended: 1800–2500 kcal/day</span>
                            </div>

                            <div className="sm-calorie-presets">
                                <span className="sm-presets-label">Quick presets:</span>
                                <div className="sm-presets-row">
                                    {[['Cut', '1600'], ['Maintain', '2000'], ['Bulk', '2500']].map(([label, val]) => (
                                        <button
                                            key={val}
                                            className={`sm-preset-btn${calorieGoal === val ? ' sm-preset-btn--active' : ''}`}
                                            onClick={() => setCalorieGoal(val)}
                                        >
                                            {label} <span>{val}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── APPEARANCE TAB ── */}
                    {activeTab === 'appearance' && (
                        <div className="sm-section">
                            <div className="sm-toggle-row">
                                <div className="sm-toggle-info">
                                    <div className="sm-toggle-title">Dark Mode</div>
                                    <div className="sm-toggle-desc">Switch between light and dark theme</div>
                                </div>
                                <button
                                    className={`sm-toggle${darkMode ? ' sm-toggle--on' : ''}`}
                                    onClick={() => setDarkMode(!darkMode)}
                                    aria-label="Toggle dark mode"
                                >
                                    <span className="sm-toggle-thumb">
                                        {darkMode ? '🌙' : '☀️'}
                                    </span>
                                </button>
                            </div>

                            <div className="sm-theme-preview">
                                <div className={`sm-preview-card${darkMode ? ' sm-preview-card--dark' : ''}`}>
                                    <div className="sm-preview-bar" />
                                    <div className="sm-preview-lines">
                                        <div className="sm-preview-line sm-preview-line--long" />
                                        <div className="sm-preview-line sm-preview-line--short" />
                                    </div>
                                </div>
                                <span className="sm-preview-label">
                                    {darkMode ? 'Dark mode active' : 'Light mode active'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── DATA TAB ── */}
                    {activeTab === 'data' && (
                        <div className="sm-section">
                            <div className="sm-data-info">
                                <div className="sm-data-icon">🗄️</div>
                                <div className="sm-data-text">
                                    <strong>Stored Data</strong>
                                    <p>Your health data is stored locally in your browser. Nothing is sent to any server.</p>
                                </div>
                            </div>

                            <div className="sm-data-items">
                                {[
                                    ['calcData', 'Health Profile', sessionStorage.getItem('calcData') ? '✓ Present' : '— Empty'],
                                    ['calcDataTemp', 'In-Progress Quiz', sessionStorage.getItem('calcDataTemp') ? '✓ Present' : '— Empty'],
                                    [SETTINGS_KEY, 'App Settings', localStorage.getItem(SETTINGS_KEY) ? '✓ Present' : '— Empty'],
                                ].map(([key, label, status]) => (
                                    <div className="sm-data-row" key={key}>
                                        <span className="sm-data-label">{label}</span>
                                        <span className={`sm-data-status${status.startsWith('✓') ? ' sm-data-status--ok' : ''}`}>{status}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="sm-danger-zone">
                                <div className="sm-danger-title">⚠️ Danger Zone</div>
                                <p className="sm-danger-desc">
                                    This will permanently delete all your data and redirect you to the homepage.
                                </p>
                                <button
                                    className={`sm-btn-danger${confirmReset ? ' sm-btn-danger--confirm' : ''}`}
                                    onClick={handleResetAll}
                                >
                                    {confirmReset ? '⚠️ Click again to confirm reset' : 'Reset All Data'}
                                </button>
                                {confirmReset && (
                                    <button className="sm-btn-cancel" onClick={() => setConfirmReset(false)}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {activeTab !== 'data' && (
                    <div className="sm-footer">
                        <button className="sm-btn-cancel-footer" onClick={onClose}>Cancel</button>
                        <button
                            className={`sm-btn-save${saved ? ' sm-btn-save--saved' : ''}`}
                            onClick={handleSave}
                        >
                            {saved ? '✓ Saved!' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}