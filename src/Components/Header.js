// Header.js
import React from 'react';
import Logo from "../img/logo.png"
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { Avatar } from '@mui/material';
import { Mail, MailLock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        // Implement your logout logic here, such as clearing user session
        // For example, clear localStorage and redirect to the login page
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/'); 
    };

    return (
        <>
        <header id="header" class="header fixed-top d-flex align-items-center">
<div className='d-flex align-items-center'>
        <div class="d-flex align-items-center justify-content-between">
        <div className='icon-box'> <RxHamburgerMenu /></div>
           
        <div className="logo-container">
                            <a href="#" className="logo d-flex align-items-center">
                                <img src={Logo} alt="logo"/>
                                <span className="d-none d-lg-block">Evision</span>
                            </a>
                        </div>
           
        </div>

        <div class="search-bar">
            <form class="search-form d-flex align-items-center" method="POST" action="#">
                <input type="text" name="query" placeholder="Search" title="Enter search keyword"/>
                <button type="submit" title="Search"><CiSearch/></button>
            </form>
        </div>

      </div>
            <div className='menu-icon'>
                <Mail/>
                <Avatar onClick={handleLogout} className="avatar-logout" />

            </div>

    </header>
    </>
    );
};

export default Header;
