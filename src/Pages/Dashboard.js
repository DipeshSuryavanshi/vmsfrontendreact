import React, { useEffect } from 'react';
import Sidebar from '../Components/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router-dom';
import Header from '../Components/Header';

const Dashboard = () => {
    useEffect(() => {
        const submenuItems = document.querySelectorAll('.sidebar-nav .nav-item');
        submenuItems.forEach(item => {
            item.addEventListener('click', function (event) {
                const submenu = this.querySelector('.submenu');
                if (submenu) {
                    event.preventDefault();
                    submenu.classList.toggle('active');
                }
            });
        });
    }, []);

    return (
        // <div>
        //     <NavBar />
        //     <Sidebar />
        //     <VendorList/>
            
            // <div id="adminNamePlaceholder" style={{ textAlign: 'center', marginTop: '20px' }}></div>
        // </div>

        <div>
            <div className='header-box'>
                <Header />
            </div>
            <div className='sidebar-box'>
                <Sidebar />
            </div>
            <div>
                <Outlet/>
            </div>
            <div className='footer-box'>
                <Footer />
            </div>
        
        </div>
    );
};

export default Dashboard;
