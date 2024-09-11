import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import RoutineTab from './RoutineTab';
import profilePic from '../images/temp-profile.jpg';
import '../css/ProfilePage.css';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const token = localStorage.getItem('userId'); // Renamed to 'authToken'
    const userId = token ? jwtDecode(token).id : null;
    const [allRoutines, setAllRoutines] = useState([]);
    const [activeRoutines, setActiveRoutines] = useState([]);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        if (token && userId) {
            setUserData();
            setRoutineData();
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
            setUsername(data.name);
            setProfileImage(data.profile_pic);
        })
        .catch(error => console.error('Error fetching user data:', error));
    };

    const setRoutineData = () => {
        fetch(`/api/user/routines/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setAllRoutines(data);
            setActiveRoutines(data.filter(routine => routine.isActive === true));
        })
        .catch(error => console.error('Error fetching routines:', error));
    };

    const calculateTotalStartValue = () => {
        let total = activeRoutines.reduce((total, routine) => {
            return total + JSON.parse(routine.difficulty)["Start Value"];
        }, 0);
        return total.toFixed(2);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSetActiveRoutine = async (routine, status) => {
        try {
            const response = await fetch(`/api/routines/favourite/${routine.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: status })
            });

            if (response.ok) {
                await setRoutineData();
                alert("Routine Updated successfully");
            } else {
                const errorText = await response.text();
                alert(`Failed to update routine: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating routine:', error);
            alert('Error updating routine. Please try again.');
        }
    };

    const getActiveRoutines = () => {
        const pieces = [
            "Floor",
            "Pommel Horse",
            "Rings",
            "Vault",
            "Parallel Bars",
            "High Bar"
        ];

        return pieces.map(piece => {
            let routine = activeRoutines.find(routine => routine.apparatus === piece);
            return routine || {
                name: "Not Built",
                apparatus: piece,
                skills: [],
                difficulty: JSON.stringify({"Start Value": 0.0, "Execution": 0.0, "Difficulty": 0.0}),
                isActive: false,
                userId: 0
            };
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-section">
                <img src={profileImage || profilePic} alt="profile-pic" />
                <h2>{username}</h2>
                <p>Total SV: {calculateTotalStartValue()}</p>
                <Link to="/apparatus-selector">
                    <button>Build a Routine</button>
                </Link>
            </div>
            <div className="routines-section">
                <div className="tab-container">
                    <div
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => handleTabClick('active')}
                    >
                        Active Routines
                    </div>
                    <div
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All Routines
                    </div>
                </div>
                {activeTab === 'active' && (
                    <div className={`routine-tab ${activeTab === 'active' ? 'active' : ''}`}>
                        {getActiveRoutines().map(routine => (
                            <RoutineTab key={routine.id} routine={routine} activeRoutine={true} setActive={status => handleSetActiveRoutine(routine, status)} />
                        ))}
                    </div>
                )}
                {activeTab === 'all' && (
                    <div className={`routine-tab ${activeTab === 'all' ? 'active' : ''}`}>
                       {allRoutines.map(routine => (
                           <RoutineTab key={routine.id} routine={routine} setActive={status => handleSetActiveRoutine(routine, status)} />
                       ))}
                   </div>             
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
