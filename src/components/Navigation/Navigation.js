import React from 'react';
import ProfileIcon from './ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModalSettings, toggleModalProfile }) => {
    
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <ProfileIcon 
                    onRouteChange={onRouteChange}
                    toggleModalProfile={toggleModalProfile}
                    toggleModalSettings={toggleModalSettings}
                />
            </nav>
        );
    }
    else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
    
    
}

export default Navigation;