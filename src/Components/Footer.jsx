import React from "react";
import '../Style/Footer.css'

const socialLinks = [
    { key: "facebook", label: "Facebook", icon: "f", handle: "@yourcoach" },
    { key: "instagram", label: "Instagram", icon: "▣", handle: "@yourcoach" },
    { key: "youtube", label: "YouTube", icon: "▶", handle: "YourCoach TV" },
    { key: "twitter", label: "Twitter / X", icon: "𝕏", handle: "@yourcoach" },
];

const Footer = () => {
    return (

        <div className="footer-contanier">
            <div className="footer-box">
                <footer className="footer">
                    <div className="footer-accent-bar" />
                    <div className="footer-top">
                        <div className="footer-col">
                            <div className="footer-logo-wrap">
                                <span className="footer-logo">
                                    Your<span>Coach</span>
                                </span>
                                <span className="footer-tagline">Your ultimate fitness companion</span>
                            </div>
                            <p className="footer-desc">
                                Track workouts, optimize nutrition, and crush your goals.
                                Built for athletes who refuse to settle.
                            </p>
                            <div className="footer-stats">
                                <div>
                                    <span className="footer-stat-num">2.4M+</span>
                                    <span className="footer-stat-label">Active users</span>
                                </div>
                                <div>
                                    <span className="footer-stat-num">98M</span>
                                    <span className="footer-stat-label">Workouts logged</span>
                                </div>
                                <div>
                                    <span className="footer-stat-num">4.9★</span>
                                    <span className="footer-stat-label">App store</span>
                                </div>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-heading">Products</h4>
                            <ul className="footer-list">
                                <li><a href="#">Workout Tracker</a></li>
                                <li><a href="#">Nutrition Planner</a></li>
                                <li><a href="#">Community</a></li>
                                <li><a href="#">Progress Analytics</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-heading">Legal</h4>
                            <ul className="footer-list">
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Cookie Preferences</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-heading">Follow Us</h4>
                            <div className="footer-social">
                                {socialLinks.map(({ key, label, icon, handle }) => (
                                    <a key={key} href="#" className="social-item">
                                        <div className={`social-icon ${key}`}>{icon}</div>
                                        <span className="social-name">{label}</span>
                                        <span className="social-handle">{handle}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copy">
                            © 2026 <span>YourCoach</span>. All rights reserved.
                        </p>
                        <div className="footer-badges">
                            <a href="#" className="footer-badge">
                                <div className="footer-badge-dot" />
                                App Store
                            </a>
                            <div className="footer-divider" />
                            <a href="#" className="footer-badge">
                                <div className="footer-badge-dot" />
                                Google Play
                            </a>
                        </div>
                    </div>

                </footer>
            </div>
        </div>

    );
};

export default Footer;