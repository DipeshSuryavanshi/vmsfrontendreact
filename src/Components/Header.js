// Header.js
import React from 'react';
import Logo from "../img/logo.png"
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { Avatar } from '@mui/material';
import { Mail, MailLock } from '@mui/icons-material';

const Header = () => {
    return (
        <>
        <header id="header" class="header fixed-top d-flex align-items-center">
<div className='d-flex align-items-center'>
        <div class="d-flex align-items-center justify-content-between">
            <a href="#" class="logo d-flex align-items-center">
                <img src={Logo} alt="logo"/>
                <span class="d-none d-lg-block">Evision</span>
            </a>
            <div className='icon-box'> <RxHamburgerMenu /></div>
           
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
                <Avatar/>

            </div>

    </header>
    </>
    );
};

export default Header;
