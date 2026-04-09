import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import '../Style/Header.css';

function Avatar({ name }) {
    const letter = name ? name[0].toUpperCase() : '?';
    return <div className="hdr-avatar" title={name || 'User'}>{letter}</div>;
}

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({});
    const [notification, setNotification] = useState(null);
    const menuRef = useRef(null);

    const calcData = (() => {
        try { return JSON.parse(sessionStorage.getItem('calcData') || 'null'); } catch { return null; }
    })();

    const userName = settings.name || calcData?.name || '';
    const hasPlan = !!calcData;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // My Plan ve Results yalniz plan varsa gorunur
    const navLinks = [
        { label: 'Home', path: '/', icon: '🏠', always: true },
        { label: 'Calculator', path: '/calculator', icon: '🧮', always: true },
        { label: 'My Plan', path: '/meals', icon: '🥗', always: false },
        { label: 'Results', path: '/result', icon: '📊', always: false },
    ].filter(link => link.always || hasPlan);

    const isActive = (path) => location.pathname === path;

    const handleStartPlan = () => {
        sessionStorage.removeItem('calcDataTemp');
        sessionStorage.removeItem('calcErrors');
        sessionStorage.removeItem('calcStep');
        navigate('/calculator');
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSettingsSave = (newSettings) => {
        setSettings(newSettings);
        showNotification('Settings saved successfully!');
    };

    return (
        <>
            <header className={`hdr${scrolled ? ' hdr--scrolled' : ''}`}>
                <div className="hdr__inner">

                    {/* Logo */}
                    <a className="hdr__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <div className="hdr__logo-mark">YC</div>
                        <span className="hdr__logo-text">
                            Your<span className="hdr__logo-accent">Coach</span>
                        </span>
                        <span className="hdr__logo-pulse" />
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hdr__nav">
                        {navLinks.map(link => (
                            <a
                                key={link.path}
                                className={`hdr__link${isActive(link.path) ? ' hdr__link--active' : ''}`}
                                onClick={() => navigate(link.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                {link.label}
                                <span className="hdr__link-underline" />
                            </a>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hdr__actions">
                        {hasPlan && (
                            <div className="hdr__progress-chip">
                                <span className="hdr__progress-dot" />
                                <span>Active Plan</span>
                            </div>
                        )}

                        <button
                            className="hdr__icon-btn"
                            onClick={() => setSettingsOpen(true)}
                            title="Settings"
                            aria-label="Open settings"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </button>

                        {userName ? <Avatar name={userName} /> : null}

                        <button className="hdr__cta" onClick={handleStartPlan}>
                            <span className="hdr__cta-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="13 17 18 12 13 7" />
                                    <polyline points="6 17 11 12 6 7" />
                                </svg>
                            </span>
                            {hasPlan ? 'Redo Plan' : 'Start Plan'}
                        </button>

                        <button
                            ref={menuRef}
                            className={`hdr__burger${menuOpen ? ' hdr__burger--open' : ''}`}
                            onClick={() => setMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`hdr__mobile-menu${menuOpen ? ' hdr__mobile-menu--open' : ''}`}>
                    <div className="hdr__mobile-inner">
                        {navLinks.map(link => (
                            <a
                                key={link.path}
                                className={`hdr__mobile-link${isActive(link.path) ? ' hdr__mobile-link--active' : ''}`}
                                onClick={() => navigate(link.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="hdr__mobile-icon">{link.icon}</span>
                                {link.label}
                            </a>
                        ))}
                        <div className="hdr__mobile-divider" />
                        <button className="hdr__mobile-cta" onClick={handleStartPlan}>
                            {hasPlan ? 'Redo Plan →' : 'Start My Plan →'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className={`hdr-toast hdr-toast--${notification.type}`}>
                    <span>{notification.type === 'success' ? '✓' : '!'}</span>
                    {notification.msg}
                </div>
            )}

            {settingsOpen && (
                <SettingsModal
                    onClose={() => setSettingsOpen(false)}
                    onSettingsChange={handleSettingsSave}
                />
            )}
        </>
    );
}