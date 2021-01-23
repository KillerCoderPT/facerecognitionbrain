import React from 'react';
import './Profile.css';

const Profile = ({ isProfileOpen, toggleModalProfile }) => {
    return (
        <div className="profile-modal">
            <button onClick={toggleModalProfile}>Click Profile</button>
        </div>
    );
}

export default Profile;
