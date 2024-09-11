import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/temp-logo.png";
import computer from "../images/computer_ad.PNG";
import cursor from "../images/cursor.png";
import chart from "../images/chart.png";
import start_value from "../images/start_values.png";
import "../css/frontPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const HomePage = () => {
    const [scrollCounter, setScrollCounter] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const scrollThreshold = 1;

    useEffect(() => {
        const sections = document.querySelectorAll('.container, .container-2, .container-3, .final-container');

        const scrollToSection = (index) => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        };

        const handleScroll = (event) => {
            let delta = event.deltaY;

            if (delta > 0) {
                // Scrolling down
                if (scrollCounter >= scrollThreshold) {
                    if (currentSection < sections.length - 1) {
                        setCurrentSection(currentSection + 1);
                    }
                    setScrollCounter(0); // Reset scroll counter after section change
                } else {
                    setScrollCounter(scrollCounter + 1);
                }
            } else if (delta < 0) {
                // Scrolling up
                if (scrollCounter >= scrollThreshold) {
                    if (currentSection > 0) {
                        setCurrentSection(currentSection - 1);
                    }
                    setScrollCounter(0); // Reset scroll counter after section change
                } else {
                    setScrollCounter(scrollCounter + 1);
                }
            }

            scrollToSection(currentSection);
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentSection, scrollCounter]);

    return (
        <div style={{ backgroundColor: "gray" }}>
            <div className="container">
                <div className="sign-in">
                    <Link to="/log-in">
                        <a>log in</a>                  
                    </Link>
                    <Link to="/sign-up">
                        <button>sign up</button>
                    </Link>
                </div>

                <div className="front-page">
                    <img src={logo} alt="Logo" />
                    <p>Build Custom Gymnastics Routines</p>
                    <Link to="/apparatus-selector">
                        <button>Try It Now!</button>
                    </Link>
                </div>
            </div>
            <div className="container-2">
                <img src={computer} alt="pc-ad" className="computer-image" />
                <div className="info-container">
                    <div className="info-box">
                        <img src={cursor} alt="pointer" className="info-pic" />
                        <p>Drag and Drop new skills into your routine</p>
                    </div>
                    <div className="info-box">
                        <img src={chart} alt="pointer" className="info-pic" />
                        <p>Automatically calculate difficulty of routines</p>
                    </div>
                </div>
            </div>
            <div className="container-3">
                <div className="image-left">
                    <img src={start_value} alt="sv" className="start-value-img" />
                </div>
                <div className="info-right">
                    <h1>Save Your Custom Routines</h1>
                    <Link to="/log-in">
                        <button className="log-in-big">Log In</button>
                    </Link>
                </div>
            </div>
            <div className="final-container">
                <div className="info-left">
                    <p>Start Building your Routines Now</p>
                    <Link to="/apparatus-selector">
                        <button>Start Now</button>
                    </Link>
                </div>
                <div className="footer">
                    <div className="social-media-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;