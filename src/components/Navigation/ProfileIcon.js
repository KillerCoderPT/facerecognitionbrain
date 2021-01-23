import React, { useState } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

const ProfileIcon = (props) => {
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <div className="pa4 tc">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={dropdownOpen}
                >
                    <img
                        src="http://tachyons.io/img/logo.jpg"
                        className="br-100 ba h3 w3 dib" alt="avatar" />
                </DropdownToggle>
                <DropdownMenu
                    right
                    className="b--transparent shadow-5"
                    style={{marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                    <DropdownItem
                        onClick={props.toggleModalProfile}
                        >Profile</DropdownItem>
                    <DropdownItem
                        onClick={props.toggleModalSettings}
                        >Settings</DropdownItem>
                    <DropdownItem onClick={() => props.onRouteChange('signout')}>Sign out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default ProfileIcon;
