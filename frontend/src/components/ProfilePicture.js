import React, { useState, useEffect } from 'react';
import tempProfilePic from '../images/temp-profile.jpg';
import '../css/ProfilePicture.css'; // Include styles

const ProfilePicture = ({ currentProfilePicture, onUpdate }) => {
    const [preview, setPreview] = useState(currentProfilePicture);

    useEffect(() => {
        if (currentProfilePicture) {
            setPreview(currentProfilePicture);
        } else {
            setPreview(null);
        }
    }, [currentProfilePicture]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
                if (onUpdate) {
                    onUpdate(file); // Pass the selected file to parent if needed
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-picture-container">
            <img src={preview || tempProfilePic} alt="Profile" className="profile-picture" />
            <div className="overlay">
                <label htmlFor="file-input" className="upload-label">
                    Change Profile Picture
                </label>
                <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the input
                />
            </div>
        </div>
    );
};

export default ProfilePicture;