import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import landingImage from '../images/front-page-image.png';

import "../css/frontPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const HomePage = () => {

    return (
        <div className="landing-page">
            <section className="landing-section">
                <div className="landing-left">
                    <div className="landing-text-box">
                        <h1 className="landing-title">Gymnast's Ultimate Tool</h1>
                        <p className="landing-slogan">Build single routines to competition-ready collections, perfect for gymnasts and coaches. </p>
                        <div className="landing-buttons">
                            <Link to="/apparatus-selector">
                                <button className="cta-button cta-button-red">Build Routine</button>
                            </Link>
                            <Link to="/sign-up">
                                <button className="cta-button cta-button-blue">Sign Up</button>
                            </Link> 
                        </div>
                    </div>
                </div>
                <div className="landing-front-image">
                    <img src={landingImage}/>
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
