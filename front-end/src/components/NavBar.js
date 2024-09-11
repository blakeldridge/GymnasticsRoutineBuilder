import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import logo from "../images/temp-logo.png";
import profilePic from "../images/temp-profile.jpg";

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if(location.pathname === '/profile'){
            setDropdownOpen(!isDropdownOpen);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('userId');

        // Redirect the user to the login page or home page
        navigate('/log-in');
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="navbar-links">
                <Link to="/dev-panel">Development Panel</Link>
                <Link to="/apparatus-selector">Build Routine</Link>
                <div className="profile-dropdown-container" ref={dropdownRef}>
                    <Link to="/profile" onClick={handleProfileClick}>
                        <img src={profilePic} className="profile-link" alt="Profile" />
                    </Link>
                    {location.pathname === '/profile' && isDropdownOpen && (
                        <div className="profile-dropdown">
                            <Link to="/settings">Settings</Link>
                            <a onClick={handleLogOut}>Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
