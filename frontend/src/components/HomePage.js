import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import "../css/frontPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const HomePage = () => {

    return (
        <div className="landing-page">
            <section className="landing-section">
                <div className="landing-overlay">
                    <h1 className="landing-title">Routinast</h1>
                    <p className="landing-slogan">Prepare for Gymnastics Competitions</p>
                    <Link to="/apparatus-selector">
                        <button className="cta-button">Build a Routine</button>
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <div className="feature">
                    <img src="feature1.jpg" alt="Feature 1" className="feature-image" />
                    <div className="feature-text">
                        <h2>Build Routines</h2>
                        <p>
                            Design routines effortlessly with drag-and-drop functionality and access the full code of points. Automatically calculate difficulty and stay updated with the 2025-28 FIG code for accurate scoring. Ready to get started?
                        </p>
                        <Link to="/apparatus-selector">
                            <button className="cta-button">Try it Now</button>
                        </Link>
                    </div>
                </div>

                <div className="feature reverse">
                    <img src="feature2.jpg" alt="Feature 2" className="feature-image" />
                <div className="feature-text">
                    <h2>Save and Manage Routines</h2>
                    <p>
                        Save your routines securely and assign custom names for easy organization. Edit, update, or review them anytime with just a click. Don’t miss out—
                    </p>
                    <Link to="/sign-up">
                        <button className="cta-button">Sign up Now</button>
                    </Link>
                </div>
                </div>

                <div className="feature reverse">
                <div className="feature-text">
                    <h2>Organize with Collections</h2>
                    <p>
                        Prepare for competitions by creating collections to store routines for every apparatus. View overall start values to ensure you're competition-ready. Start organizing—
                    </p>
                    <Link to="/apparatus-selector">
                        <button className="cta-button">Build a Routine</button>
                    </Link>
                </div>
                <img src="feature2.jpg" alt="Feature 2" className="feature-image" />
                </div>
            </section>

            <section className="not-convinced-section">
                <div className="top-section">
                <h2>Not Convinced Yet?</h2>
                <p>Just give it a try, build a routine without signing up.</p>
                <button className="signup-button">Build a Routine</button>
                </div>
                <div className="bottom-section">
                <div className="feedback-section">
                    <div className="feedback-item">
                    <i className="icon">💬</i>
                    <p>"This tool changed the way I prepare my routines!"</p>
                    </div>
                    <div className="feedback-item">
                    <i className="icon">🌟</i>
                    <p>"A must-have for every gymnast and coach."</p>
                    </div>
                    <div className="feedback-item">
                    <i className="icon">📈</i>
                    <p>"Helps me track my progress like never before!"</p>
                    </div>
                </div>
                </div>
            </section>

            <div className="footer">
                <div className="social-media-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
