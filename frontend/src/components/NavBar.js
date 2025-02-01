import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import { jwtDecode } from 'jwt-decode';
import logo from "../images/temp-logo.png";
import profilePic from "../images/temp-profile.png";

const Navbar = () => {
    const token = localStorage.getItem('userId');
    const userId = token ? jwtDecode(token).id : null;
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (token && userId) {
            setUserData();
        }
    }, [token, userId]);

    const setUserData = () => {
        fetch(`/api/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.profile_pic) {
                setProfileImage(`http://localhost:5000${data.profile_pic}`);
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
    };


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

    const runTest = async () => {
        try {
            const response = await fetch(`/api/testscript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("successful run of test script")
            } else {
                alert('Failed to run test script.');
            }
        } catch (error) {
            console.error('Error running test script:', error);
            alert('Error running test script.');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
            </div>
            <div>
                {token ? (
                    <div className="navbar-links">
                        {/*<Link to="/dev-panel">Development Panel</Link>*/}
                        <Link to="/apparatus-selector">Code of Points</Link>
                        <Link to="/apparatus-selector">{location.pathname.startsWith("/apparatus-selector/") ? "Switch Apparatus" : "Build Routine"}</Link>
                        <div className="profile-dropdown-container" ref={dropdownRef}>
                            <Link to="/profile" onClick={handleProfileClick}>
                                <img src={profileImage || profilePic} className="profile-link" alt="Profile" />
                            </Link>
                            {location.pathname === '/profile' && isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <Link to="/settings">Settings</Link>
                                    <a onClick={handleLogOut}>Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                )
                : (
                    <div className="navbar-links">
                        <Link to="/log-in">Log In</Link>
                        <Link to="/sign-up">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
