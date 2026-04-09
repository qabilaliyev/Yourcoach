import React from "react";
import '../Style/Footer.css';

const socialLinks = [
    { key: "facebook", label: "Facebook", icon: "f", handle: "@yourcoach" },
    { key: "instagram", label: "Instagram", icon: "▣", handle: "@yourcoach" },
    { key: "youtube", label: "YouTube", icon: "▶", handle: "YourCoach TV" },
    { key: "twitter", label: "Twitter / X", icon: "𝕏", handle: "@yourcoach" },
];

const Footer = () => {
    return (
        <div className="footer-root">

            <div className="footer-cta">
                <div className="footer-cta__inner">
                    <span className="footer-cta__badge">🚀 Join 2.4 M+ athletes</span>
                    <h2 className="footer-cta__title">Ready to crush your goals?</h2>
                    <p className="footer-cta__sub">
                        Start tracking workouts, optimizing nutrition, and building
                        the body you deserve — free for 30 days.
                    </p>
                    <div className="footer-cta__actions">
                        <a href="#" className="footer-btn-primary">Get started free →</a>
                        <a href="#" className="footer-btn-ghost">View pricing</a>
                    </div>
                </div>
            </div>

            <div className="footer-body">
                <div className="footer-body__inner">
                    <div className="footer-cols">

                        <div className="footer-brand">
                            <a href="#" className="footer-brand__logo">
                                <div className="footer-brand__mark">YC</div>
                                <span className="footer-brand__name">
                                    Your<span>Coach</span>
                                </span>
                            </a>
                            <p className="footer-brand__desc">
                                Track workouts, optimize nutrition, and crush your goals.
                                Built for athletes who refuse to settle.
                            </p>

                            <div className="footer-brand__stats">
                                <div className="footer-brand__stat">
                                    <span className="footer-brand__stat-num">2.4M+</span>
                                    <span className="footer-brand__stat-label">Users</span>
                                </div>
                                <div className="footer-brand__stat">
                                    <span className="footer-brand__stat-num">98M</span>
                                    <span className="footer-brand__stat-label">Workouts</span>
                                </div>
                                <div className="footer-brand__stat">
                                    <span className="footer-brand__stat-num">4.9★</span>
                                    <span className="footer-brand__stat-label">Rating</span>
                                </div>
                            </div>

                            <div className="footer-brand__apps">
                                <a href="#" className="footer-app-badge">🍎 App Store</a>
                                <a href="#" className="footer-app-badge">▶ Google Play</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="footer-col__heading">Products</h4>
                            <ul className="footer-nav-list">
                                <li><a href="#">Workout Tracker</a></li>
                                <li><a href="#">Nutrition Planner</a></li>
                                <li><a href="#">Progress Analytics</a></li>
                                <li><a href="#">Community</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-col__heading">Company</h4>
                            <ul className="footer-nav-list">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-col__heading">Follow Us</h4>
                            <div className="footer-social-list">
                                {socialLinks.map(({ key, label, icon, handle }) => (
                                    <a key={key} href="#" className="footer-social-item">
                                        <div className={`footer-social-icon ${key}`}>{icon}</div>
                                        <span className="footer-social-name">{label}</span>
                                        <span className="footer-social-handle">{handle}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copy">
                            © 2026 <strong>YourCoach</strong>. All rights reserved.
                        </p>
                        <div className="footer-legal-links">
                            <a href="#">Privacy</a>
                            <div className="footer-legal-dot" />
                            <a href="#">Terms</a>
                            <div className="footer-legal-dot" />
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Footer;